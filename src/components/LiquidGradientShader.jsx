import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * LiquidGradientShader (optimized)
 * -----------------------------------------------------------------------
 * Same look as the original Framer "Liquid Gradient" shader, restructured
 * to be cheap enough for mobile and PageSpeed:
 *
 *  - Capability gating: reduced-motion, data-saver, low-memory devices and
 *    software renderers (SwiftShader / llvmpipe, what Lighthouse uses)
 *    never run the shader; a static CSS gradient (or image) is shown.
 *  - Deferred mount: waits for window "load" + browser idle time.
 *  - Colour pipeline (palette, OKLab/LCH mix, exposure, contrast,
 *    saturation, gamut map, sRGB) is baked once into a 1D LUT texture.
 *  - Turbulence loop trimmed (the i = 0 pass had zero weight) and its bounds
 *    are compile-time constants so the compiler can unroll it.
 *  - Mouse push pass is only compiled/run when the mouse is enabled.
 *  - Lower internal resolution on mobile, smaller push buffer, fps cap,
 *    pauses when offscreen or tab hidden, optional freeze after N seconds.
 *  - useEffect dependencies are stable (no teardown on every parent render).
 *
 * Props
 *  className / style     applied to the wrapper (same as before)
 *  uniforms              overrides for DEFAULT_UNIFORMS
 *  resolutionScale       render scale vs CSS size (default: 0.6 mobile, 0.75 desktop)
 *  mouseEnabled          mouse push effect (auto-disabled on touch devices)
 *  maxFps                frame cap (default: 30 mobile, 60 desktop)
 *  freezeAfterSeconds    stop animating after N seconds (0 = never)
 *  fallbackImage         URL of a pre-rendered frame shown until/unless the shader runs
 *  respectReducedMotion  show static fallback when prefers-reduced-motion (default true)
 * ----------------------------------------------------------------------- */

const LUT_SIZE = 512;

const VERTEX_SRC = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const PUSH_FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform sampler2D u_push_buffer;
uniform vec2 u_resolution;
uniform float u_deltaTime;
uniform float u_mousePersist;
uniform vec4 u_mousePosition;
uniform float u_mouseHover;
uniform float u_mouseRadius;
uniform float u_mouseStretch;
uniform float u_mousePush;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 aspectFix = vec2(aspect, 1.0);

    vec2 texel = 1.0 / u_resolution;

    vec4 prev = texture(u_push_buffer, v_uv);
    vec2 c  = prev.xy;
    vec2 nl = texture(u_push_buffer, v_uv - vec2(texel.x, 0.0)).xy;
    vec2 nr = texture(u_push_buffer, v_uv + vec2(texel.x, 0.0)).xy;
    vec2 nd = texture(u_push_buffer, v_uv - vec2(0.0, texel.y)).xy;
    vec2 nu = texture(u_push_buffer, v_uv + vec2(0.0, texel.y)).xy;

    vec2 blurred = (nl + nr + nd + nu) * 0.25;
    vec2 field = mix(c, blurred, 0.12);

    float r = clamp(u_deltaTime * 60.0, 0.0, 3.0);
    float decay = pow(mix(0.86, 0.985, clamp(u_mousePersist, 0.0, 1.0)), r);
    field *= decay;

    vec2 rawVel = u_mousePosition.zw * aspectFix * u_mouseHover;
    float smoothK = 1.0 - pow(0.75, r);
    vec2 mouseVel = mix(prev.zw, rawVel, smoothK);

    float speed    = length(mouseVel);
    float brush    = max(u_mouseRadius * 0.1, 0.001);

    float speedPerSec = speed / max(u_deltaTime, 1e-4);
    float moving      = 1.0 - exp(-speedPerSec * 0.5);

    vec2 dir       = speed > 1e-5 ? mouseVel / speed : vec2(1.0, 0.0);
    vec2 ortho     = vec2(-dir.y, dir.x);

    vec2 toMouse   = (v_uv - u_mousePosition.xy) * aspectFix;

    float along    = dot(toMouse, dir);
    float across   = dot(toMouse, ortho);
    float ra       = brush * (1.0 + u_mouseStretch * moving);
    float rb       = brush;
    float d2       = (along * along) / (ra * ra) + (across * across) / (rb * rb);
    float falloff  = exp(-d2);

    field += mouseVel * falloff * (u_mousePush * 0.1) * u_mouseHover;

    field = clamp(field, -1.0, 1.0);

    fragColor = vec4(field, mouseVel);
}
`;

/* Colour helpers. Only used by the one-off LUT bake pass now. */
const COLOR_LIB = `
const float GOLDEN_ANGLE_UNUSED = 0.0;

vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
vec3 toSrgb(vec3 c)   { return pow(clamp(c, 0.0, 1.0), vec3(0.4545)); }

vec3 linearToOklab(vec3 c) {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

    l = pow(max(l, 0.0), 1.0/3.0);
    m = pow(max(m, 0.0), 1.0/3.0);
    s = pow(max(s, 0.0), 1.0/3.0);

    return vec3(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    );
}

vec3 oklabToLinear(vec3 c) {
    float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;

    l = l * l * l;
    m = m * m * m;
    s = s * s * s;

    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

vec3 oklabToLch(vec3 lab) { return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y)); }
vec3 lchToOklab(vec3 lch) { return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z)); }

vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
    vec3 lch0 = oklabToLch(lab0);
    vec3 lch1 = oklabToLch(lab1);

    if (lch0.y < 0.05) lch0.z = lch1.z;
    if (lch1.y < 0.05) lch1.z = lch0.z;

    float dh = lch1.z - lch0.z;
    if (dh > 3.14159265) dh -= 6.28318530;
    if (dh < -3.14159265) dh += 6.28318530;

    return lchToOklab(vec3(
        mix(lch0.x, lch1.x, t),
        mix(lch0.y, lch1.y, t),
        lch0.z + dh * t
    ));
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));

    float segmentSize = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t / segmentSize)), count - 2);
    float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);

    vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
    vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));

    return oklabToLinear(mixLch(lab0, lab1, localT));
}

vec3 softGamutMap(vec3 linearRgb) {
    float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
    float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));

    if (minC >= 0.0 && maxC <= 1.0) return linearRgb;

    vec3 lab = linearToOklab(max(linearRgb, 0.0));
    float L = clamp(lab.x, 0.0, 1.0);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);

    float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));

    if (C > maxChroma * 0.7) {
        float knee = maxChroma * 0.7;
        C = knee + (maxChroma - knee) * tanh(min((C - knee) / (maxChroma - knee + 0.001), 10.0));
    }

    return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
}

vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
    vec3 lab = linearToOklab(linearRgb);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);

    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= saturation;
    lab.y = C * cos(h);
    lab.z = C * sin(h);

    return oklabToLinear(lab);
}
`;

/* One-off pass: renders the whole colour pipeline into a LUT_SIZE x 1 texture. */
const LUT_FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec3  u_colors[8];
uniform int   u_colors_length;
uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;

in vec2 v_uv;
out vec4 fragColor;

const float LUT_SIZE = ${LUT_SIZE.toFixed(1)};

${COLOR_LIB}

void main() {
    // v_uv.x is a texel centre: (i + 0.5) / LUT_SIZE  ->  val in [0, 1]
    float val = clamp((v_uv.x * LUT_SIZE - 0.5) / (LUT_SIZE - 1.0), 0.0, 1.0);

    vec3 col = paletteN(val, u_colors_length);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);

    fragColor = vec4(col, 1.0);
}
`;

/* Per-frame pass. Defines injected at compile time:
 *   TURB_ITER (int), USE_PUSH, JELLIFY */
const MAIN_FRAGMENT_SRC = `#version 300 es
precision highp float;

#ifdef USE_PUSH
uniform sampler2D u_push_buffer;
#endif
uniform sampler2D u_lut;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_pixelRatio;
uniform float u_loop;
uniform float u_speed;
uniform float u_seed;
uniform float u_scale;
uniform float u_turbFreq;
uniform float u_turbAmp;
uniform float u_waveFreq;
uniform float u_distBias;
uniform float u_dither;
uniform float u_ditherMode;

in vec2 v_uv;
out vec4 fragColor;

const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;
const float LUT_SIZE = ${LUT_SIZE.toFixed(1)};

// PCG hash - https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;
    if (mode < 1.5) return IGN(I);
    return quickNoise(I);
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;

    float t = u_time * 0.3;

    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;

    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);

    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;

    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    mat2 rot = mat2(cs, -sn, sn, cs);
    p = rot * p;

#ifdef USE_PUSH
    vec2 pushField = texture(u_push_buffer, v_uv).xy;
    p -= rot * pushField * 2.0;
#endif

    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);

    float totalVal = 0.0;
    float totalWeight = 0.0;

    float freq = 1.0 / max(u_turbFreq, 0.01);
    float t1 = mix(t * u_speed, tA, looping);
    float t2 = mix(t * u_speed, tB, looping);

    // i = 0 has weight 0 (smoothstep(0, 0.5, 0) = 0), so it is skipped.
    for (float i = 1.0; i < 4.0; i++) {
        float eph = i / 4.0;

        vec2 q = p * u_scale;
        float sq = eph * eph;

#ifdef JELLIFY
        q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
#endif

        float a = seedPhase.x;
        float d = seedPhase.y;

        for (int j = 2; j < TURB_ITER; j++) {
            float fj = float(j);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z + t2 * 0.3 * looping);
            d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y + t2 * 0.3 * looping);
        }

        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
        float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * weight;
        totalWeight += weight;
    }

    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);

    // Whole colour pipeline is a single LUT fetch now.
    float lutU = (val * (LUT_SIZE - 1.0) + 0.5) / LUT_SIZE;
    fragColor = vec4(texture(u_lut, vec2(lutU, 0.5)).rgb, 1.0);
}
`;

const DEFAULT_UNIFORMS = {
  colors: ['rgb(0, 0, 26)', 'rgb(41, 98, 255)', 'rgb(64, 188, 255)', 'rgb(255, 184, 181)', 'rgb(255, 193, 79)'],
  seed: 312,
  speed: 0.1,
  loop: 0,
  scale: 0.55,
  turbAmp: 0.55,
  turbFreq: 0.1,
  turbIter: 4,
  waveFreq: 2.6,
  distBias: 0,
  jellify: false,
  mousePush: 0.5,
  mouseRadius: 1,
  mouseStretch: 0,
  mousePersist: 0.8,
  ditherMode: 0,
  dither: 0.04,
  exposure: 1.1,
  contrast: 1.1,
  saturation: 1,
};

/* ----------------------------- helpers ----------------------------- */

function parseColor(str) {
  const s = String(str).trim();
  const rgb = s.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const parts = rgb[1].split(',').map((n) => parseFloat(n));
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
  }
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  }
  return [0, 0, 0];
}

function withDefines(src, defines) {
  return src.replace('#version 300 es\n', `#version 300 es\n${defines}\n`);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Shader compile error: ' + info);
  }
  return shader;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, 'a_position');
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Program link error: ' + info);
  }
  return program;
}

function getLocations(gl, program, names) {
  const out = {};
  names.forEach((n) => {
    out[n] = gl.getUniformLocation(program, n);
  });
  return out;
}

function createTarget(gl, internalFormat, format, type, width, height, filter) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { tex, fbo };
}

function deleteTarget(gl, target) {
  if (!target) return;
  gl.deleteTexture(target.tex);
  gl.deleteFramebuffer(target.fbo);
}

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const isMobileLike = () =>
  typeof window !== 'undefined' && (isCoarsePointer() || window.innerWidth < 768);

/** Cheap checks that don't need a GL context. */
function environmentAllowsShader(respectReducedMotion) {
  if (typeof window === 'undefined') return false;
  if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (navigator.connection && navigator.connection.saveData) return false;
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return false;
  return true;
}

function isSoftwareRenderer(gl) {
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

/* ----------------------------- component ----------------------------- */

export default function LiquidGradientShader({
  className = '',
  style = {},
  uniforms: userUniforms = {},
  resolutionScale,
  mouseEnabled = true,
  maxFps,
  freezeAfterSeconds = 0,
  fallbackImage,
  respectReducedMotion = true,
}) {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);

  // Stable key: inline `uniforms={{...}}` from a parent no longer rebuilds GL on each render.
  const uniformsKey = JSON.stringify(userUniforms);

  const fallbackBackground = useMemo(() => {
    if (fallbackImage) return `url(${fallbackImage}) center / cover no-repeat`;
    const u = { ...DEFAULT_UNIFORMS, ...JSON.parse(uniformsKey) };
    const stops = u.colors.length > 1 ? u.colors : [u.colors[0] || '#000', u.colors[0] || '#000'];
    return `linear-gradient(135deg, ${stops.join(', ')})`;
  }, [uniformsKey, fallbackImage]);

  /* Gate 1: environment checks + defer mounting until after load and idle. */
  useEffect(() => {
    if (!environmentAllowsShader(respectReducedMotion)) return undefined;

    let cancelled = false;
    let idleHandle = null;
    let timeoutHandle = null;

    const schedule = () => {
      if (cancelled) return;
      const start = () => {
        if (!cancelled) setMounted(true);
      };
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        timeoutHandle = window.setTimeout(start, 1500);
      }
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (idleHandle !== null && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== null) window.clearTimeout(timeoutHandle);
    };
  }, [respectReducedMotion]);

  /* The GL renderer. */
  useEffect(() => {
    if (!mounted || failed) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mobile = isMobileLike();
    const useMouse = mouseEnabled && !isCoarsePointer();

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl || isSoftwareRenderer(gl)) {
      setFailed(true);
      return undefined;
    }
    const floatExt = gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float');
    if (!floatExt) {
      setFailed(true);
      return undefined;
    }

    const u = { ...DEFAULT_UNIFORMS, ...JSON.parse(uniformsKey) };
    const colorList = (u.colors && u.colors.length ? u.colors : ['rgb(0,0,0)']).slice(0, 8);
    const colorVecs = colorList.map(parseColor);
    while (colorVecs.length < 8) colorVecs.push([0, 0, 0]);
    const colorsFlat = new Float32Array(colorVecs.flat());

    const turbIter = Math.max(2, Math.min(13, Math.floor(u.turbIter)));
    const mainDefines = [
      `#define TURB_ITER ${turbIter}`,
      useMouse ? '#define USE_PUSH' : '',
      u.jellify ? '#define JELLIFY' : '',
    ].join('\n');

    let pushProgram = null;
    let mainProgram = null;
    let lutProgram = null;
    let vao = null;
    let vbo = null;
    let lutTarget = null;
    let pingPong = null;

    try {
      mainProgram = createProgram(gl, VERTEX_SRC, withDefines(MAIN_FRAGMENT_SRC, mainDefines));
      lutProgram = createProgram(gl, VERTEX_SRC, LUT_FRAGMENT_SRC);
      if (useMouse) pushProgram = createProgram(gl, VERTEX_SRC, PUSH_FRAGMENT_SRC);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setFailed(true);
      return undefined;
    }

    // Full-screen triangle, bound once for all programs (attribute 0).
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const mainLoc = getLocations(gl, mainProgram, [
      'u_push_buffer', 'u_lut', 'u_resolution', 'u_time', 'u_pixelRatio', 'u_loop', 'u_speed',
      'u_seed', 'u_scale', 'u_turbFreq', 'u_turbAmp', 'u_waveFreq', 'u_distBias', 'u_dither', 'u_ditherMode',
    ]);
    const lutLoc = getLocations(gl, lutProgram, [
      'u_colors', 'u_colors_length', 'u_exposure', 'u_contrast', 'u_saturation',
    ]);
    const pushLoc = pushProgram
      ? getLocations(gl, pushProgram, [
          'u_push_buffer', 'u_resolution', 'u_deltaTime', 'u_mousePersist', 'u_mousePosition',
          'u_mouseHover', 'u_mouseRadius', 'u_mouseStretch', 'u_mousePush',
        ])
      : null;

    /* --- Bake the colour pipeline into a 1D LUT (once) --- */
    lutTarget = createTarget(gl, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, LUT_SIZE, 1, gl.LINEAR);
    gl.bindFramebuffer(gl.FRAMEBUFFER, lutTarget.fbo);
    gl.viewport(0, 0, LUT_SIZE, 1);
    gl.useProgram(lutProgram);
    gl.uniform3fv(lutLoc.u_colors, colorsFlat);
    gl.uniform1i(lutLoc.u_colors_length, colorList.length);
    gl.uniform1f(lutLoc.u_exposure, u.exposure);
    gl.uniform1f(lutLoc.u_contrast, u.contrast);
    gl.uniform1f(lutLoc.u_saturation, u.saturation);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    /* --- Sizing --- */
    const scale = resolutionScale ?? (mobile ? 0.6 : 0.75);
    const dprCap = mobile ? 1 : 2;
    let width = 0;
    let height = 0;
    let pushW = 0;
    let pushH = 0;
    let pingIndex = 0;
    let effectivePixelRatio = 1;
    let rect = canvas.getBoundingClientRect();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      effectivePixelRatio = dpr * scale;
      const w = Math.max(1, Math.floor(canvas.clientWidth * effectivePixelRatio));
      const h = Math.max(1, Math.floor(canvas.clientHeight * effectivePixelRatio));
      rect = canvas.getBoundingClientRect();
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = width;
      canvas.height = height;

      if (useMouse) {
        // The push field is heavily blurred, so a quarter-res buffer is plenty.
        pushW = Math.max(64, Math.floor(width * 0.25));
        pushH = Math.max(64, Math.floor(height * 0.25));
        if (pingPong) pingPong.forEach((t) => deleteTarget(gl, t));
        pingPong = [0, 1].map(() =>
          createTarget(gl, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, pushW, pushH, gl.LINEAR)
        );
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        pingIndex = 0;
      }
    }

    /* --- Mouse --- */
    const mouse = { x: 0.5, y: 0.5, vx: 0, vy: 0, hover: 0 };
    let lastMouseX = 0.5;
    let lastMouseY = 0.5;
    let hasLastMouse = false;

    function handlePointerMove(e) {
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1 - (e.clientY - rect.top) / rect.height;
      const inside = nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1;
      if (!inside) {
        mouse.hover = 0;
        hasLastMouse = false;
        return;
      }
      if (hasLastMouse) {
        mouse.vx = nx - lastMouseX;
        mouse.vy = ny - lastMouseY;
      }
      hasLastMouse = true;
      lastMouseX = nx;
      lastMouseY = ny;
      mouse.x = nx;
      mouse.y = ny;
      mouse.hover = 1;
    }
    function handlePointerLeave() {
      mouse.hover = 0;
      hasLastMouse = false;
    }
    function handleScrollOrResizeRect() {
      rect = canvas.getBoundingClientRect();
    }

    /* --- Render --- */
    let time = 0;
    let started = false;

    function render(dt) {
      if (useMouse) {
        const src = pingPong[pingIndex];
        const dst = pingPong[1 - pingIndex];

        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.viewport(0, 0, pushW, pushH);
        gl.useProgram(pushProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform1i(pushLoc.u_push_buffer, 0);
        gl.uniform2f(pushLoc.u_resolution, pushW, pushH);
        gl.uniform1f(pushLoc.u_deltaTime, dt);
        gl.uniform1f(pushLoc.u_mousePersist, u.mousePersist);
        gl.uniform4f(pushLoc.u_mousePosition, mouse.x, mouse.y, mouse.vx, mouse.vy);
        gl.uniform1f(pushLoc.u_mouseHover, mouse.hover);
        gl.uniform1f(pushLoc.u_mouseRadius, u.mouseRadius);
        gl.uniform1f(pushLoc.u_mouseStretch, u.mouseStretch);
        gl.uniform1f(pushLoc.u_mousePush, u.mousePush);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        mouse.vx *= 0.5;
        mouse.vy *= 0.5;
        pingIndex = 1 - pingIndex;
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(mainProgram);

      if (useMouse) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pingPong[pingIndex].tex);
        gl.uniform1i(mainLoc.u_push_buffer, 0);
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, lutTarget.tex);
      gl.uniform1i(mainLoc.u_lut, 1);

      gl.uniform2f(mainLoc.u_resolution, width, height);
      gl.uniform1f(mainLoc.u_time, time);
      gl.uniform1f(mainLoc.u_pixelRatio, effectivePixelRatio);
      gl.uniform1f(mainLoc.u_loop, u.loop);
      gl.uniform1f(mainLoc.u_speed, u.speed);
      gl.uniform1f(mainLoc.u_seed, u.seed);
      gl.uniform1f(mainLoc.u_scale, u.scale);
      gl.uniform1f(mainLoc.u_turbFreq, u.turbFreq);
      gl.uniform1f(mainLoc.u_turbAmp, u.turbAmp);
      gl.uniform1f(mainLoc.u_waveFreq, u.waveFreq);
      gl.uniform1f(mainLoc.u_distBias, u.distBias);
      gl.uniform1f(mainLoc.u_dither, u.dither);
      gl.uniform1f(mainLoc.u_ditherMode, u.ditherMode);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!started) {
        started = true;
        canvas.style.opacity = '1'; // fade in over the static fallback
      }
    }

    resize();
    render(1 / 60);

    /* --- Loop control: fps cap, pause offscreen / hidden tab, optional freeze --- */
    const fps = maxFps ?? (mobile ? 30 : 60);
    const frameInterval = 1000 / fps;
    let rafId = 0;
    let lastDraw = 0;
    let visible = true;
    let frozen = false;

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      const elapsed = now - lastDraw;
      if (elapsed < frameInterval - 1) return;
      lastDraw = now;

      const dt = Math.min(elapsed / 1000, 0.1);
      time += dt;
      render(dt);

      if (freezeAfterSeconds > 0 && time >= freezeAfterSeconds) {
        frozen = true;
        syncLoop();
      }
    }

    function syncLoop() {
      const shouldRun = visible && !document.hidden && !frozen;
      if (shouldRun && !rafId) {
        lastDraw = performance.now();
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!rafId) render(0); // keep the still frame correct while paused/frozen
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncLoop();
    });
    intersectionObserver.observe(canvas);

    const onVisibility = () => syncLoop();
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (e) => {
      e.preventDefault();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      setFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    if (useMouse) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScrollOrResizeRect, { passive: true });
      window.addEventListener('resize', handleScrollOrResizeRect, { passive: true });
      document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    }

    syncLoop();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      if (useMouse) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('scroll', handleScrollOrResizeRect);
        window.removeEventListener('resize', handleScrollOrResizeRect);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      if (pingPong) pingPong.forEach((t) => deleteTarget(gl, t));
      deleteTarget(gl, lutTarget);
      if (pushProgram) gl.deleteProgram(pushProgram);
      gl.deleteProgram(mainProgram);
      gl.deleteProgram(lutProgram);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, [mounted, failed, uniformsKey, mouseEnabled, resolutionScale, maxFps, freezeAfterSeconds]);

  return (
    <div className={className} style={{ display: 'block', width: '100%', height: '100%', ...style }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Static layer: shown to PageSpeed, reduced-motion users, and while the shader boots. */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: fallbackBackground }}
        />
        {mounted && !failed && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              width: '100%',
              height: '100%',
              opacity: 0,
              transition: 'opacity 0.6s ease',
            }}
          />
        )}
      </div>
    </div>
  );
}
