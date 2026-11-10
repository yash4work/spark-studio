import { useEffect, useRef } from 'react';

/**
 * LiquidGradientShader
 * -----------------------------------------------------------------------
 * A faithful port of the "Liquid Gradient" WebGL2 shader used for the
 * Hero background on the Framer site (framer.com/projects/sparkstudio0).
 * The GLSL below (push-buffer + main fragment) is lifted verbatim from
 * the published Framer bundle; only the surrounding React/WebGL2
 * boilerplate (buffer setup, mouse tracking, render loop, uniform
 * wiring) is new, since Framer's own runtime harness isn't public.
 *
 * Uniform defaults match the exact instance values used on the Hero
 * section (colors, seed, scale, speed, turbulence, mouse response),
 * extracted from the same bundle.
 * ----------------------------------------------------------------------- */

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

    // --- Read own previous frame + neighbours ---
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

    // --- Smooth the cursor velocity (EMA) ---
    // Raw .zw arrives in uneven per-frame pulses at low speeds; the EMA
    // spreads each pulse over a few frames so the deposit reads as a
    // continuous stream. ~0.25 blend per 60fps frame, frame-rate independent.
    vec2 rawVel = u_mousePosition.zw * aspectFix * u_mouseHover;
    float smoothK = 1.0 - pow(0.75, r); //or smoothK = 1. for original no smooth feeling
    vec2 mouseVel = mix(prev.zw, rawVel, smoothK);

    float speed    = length(mouseVel);
    float brush    = max(u_mouseRadius * 0.1, 0.001);

    float speedPerSec = speed / max(u_deltaTime, 1e-4);
    float moving      = 1.0 - exp(-speedPerSec * 0.5);

    vec2 dir       = speed > 1e-5 ? mouseVel / speed : vec2(1.0, 0.0);
    vec2 ortho     = vec2(-dir.y, dir.x);

    vec2 toMouse   = (v_uv - u_mousePosition.xy) * aspectFix;
    //toMouse       += dir * brush * 0.2 * moving;

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

const MAIN_FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform sampler2D u_push_buffer;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_deltaTime;
uniform float u_pixelRatio;
uniform float u_loop;
uniform float u_speed;
uniform float u_seed;
uniform float u_scale;
uniform float u_jellify;
uniform float u_turbIter;
uniform float u_turbFreq;
uniform float u_turbAmp;
uniform float u_waveFreq;
uniform float u_distBias;
uniform float u_dither;
uniform float u_ditherMode;
uniform vec3  u_colors[8];
uniform int   u_colors_length;
uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;

in vec2 v_uv;
out vec4 fragColor;

// === CONSTANTS ===
const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

// === PCG hash - https://www.jcgt.org/published/0009/03/02/
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

// Seed
vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

// === COLOR SPACE UTILITIES ===
vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSrgb(vec3 c) {
    return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
}

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

vec3 oklabToLch(vec3 lab) {
    return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
}

vec3 lchToOklab(vec3 lch) {
    return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

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

// === PALETTE SAMPLING ===
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

// === DITHER ===
float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

// Dither Mode: 0=Off, 1=IGN, 2=quickNoise
float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;          // 0: Off
    if (mode < 1.5) return IGN(I);       // 1: Smooth
    return quickNoise(I);                // 2: Grain
}

// === POST-PROCESS ===
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

// === MAIN ===
void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;
    
    int colorCount = u_colors_length;
    
    // Early out: no colors -> black
    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float t = u_time * 0.3;
    
    // Map time onto a circle so animation seamlessly wraps.
    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;
    
    // Seed-based offsets
    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);
    
    // Golden angle rotation
    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;
    
    // Seed-based rotation
    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    mat2 rot = mat2(cs, -sn, sn, cs);
    p = rot * p;

    // === MOUSE PUSH ===
    // Displace the domain by the accumulated push field so the pattern
    // drags in the direction the cursor moved, then relaxes as it decays.
    vec2 pushField = texture(u_push_buffer, v_uv).xy;
    p -= rot * pushField * 2.0;
    
    // Get dither value
    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);
    
    // === TURBULENCE ===
    float totalVal = 0.0;
    float totalWeight = 0.0;
    int turbIter = int(u_turbIter);
    
    float freq = 1.0 / max(u_turbFreq, 0.01);
    
    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;
       
        vec2 q = p * u_scale;
        float sq = eph * eph;
        
        if (u_jellify > 0.5) {
            q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
        }
        
        float a = seedPhase.x;
        float d = seedPhase.y;
        
        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            // When looping, use circular time. Otherwise original t.
            float t1 = mix(t * u_speed, tA, looping);
            float t2 = mix(t * u_speed, tB, looping);
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
    
    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);
    
    fragColor = vec4(col, 1.0);
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

function parseColor(str) {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0];
  const parts = m[1].split(',').map((n) => parseFloat(n));
  return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
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
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw new Error('Program link error: ' + info);
  }
  return program;
}

function createPingPongTargets(gl, width, height) {
  const targets = [];
  for (let i = 0; i < 2; i++) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    targets.push({ tex, fbo });
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return targets;
}

export default function LiquidGradientShader({
  className = '',
  style = {},
  uniforms: userUniforms = {},
  resolutionScale = 1,
  mouseEnabled = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl2', { premultipliedAlpha: false, alpha: true });
    if (!gl) {
      // No WebGL2 support — leave canvas blank, caller should layer a
      // static fallback image behind/behind this component.
      return undefined;
    }

    const ext = gl.getExtension('EXT_color_buffer_float');
    if (!ext) return undefined;

    const u = { ...DEFAULT_UNIFORMS, ...userUniforms };
    const colorVecs = u.colors.map(parseColor);
    while (colorVecs.length < 8) colorVecs.push([0, 0, 0]);
    const colorsFlat = new Float32Array(colorVecs.flat());

    const pushProgram = createProgram(gl, VERTEX_SRC, PUSH_FRAGMENT_SRC);
    const mainProgram = createProgram(gl, VERTEX_SRC, MAIN_FRAGMENT_SRC);

    // Full-screen triangle (covers clip space with a single triangle)
    const quad = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    function bindQuad(program) {
      const loc = gl.getAttribLocation(program, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    let width = 0;
    let height = 0;
    let pushW = 0;
    let pushH = 0;
    let pingPong = null;
    let pingIndex = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * resolutionScale;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = width;
      canvas.height = height;

      pushW = Math.max(1, Math.floor(width * 0.5));
      pushH = Math.max(1, Math.floor(height * 0.5));
      pingPong = createPingPongTargets(gl, pushW, pushH);
      pingIndex = 0;
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Mouse state in normalized UV space (0..1, y flipped to match v_uv),
    // with a smoothed velocity so fast moves still read as a continuous drag.
    const mouse = { x: 0.5, y: 0.5, vx: 0, vy: 0, hover: 0 };
    let lastMouseX = 0.5;
    let lastMouseY = 0.5;

    function handlePointerMove(e) {
      if (!mouseEnabled) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1 - (e.clientY - rect.top) / rect.height;
      mouse.vx = nx - lastMouseX;
      mouse.vy = ny - lastMouseY;
      lastMouseX = nx;
      lastMouseY = ny;
      mouse.x = nx;
      mouse.y = ny;
      mouse.hover = 1;
    }
    function handlePointerLeave() {
      mouse.hover = 0;
    }
    if (mouseEnabled) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      canvas.addEventListener('pointerleave', handlePointerLeave);
    }

    const pushUniformLoc = {};
    const mainUniformLoc = {};
    function cacheLocations(program, cache, names) {
      names.forEach((n) => {
        cache[n] = gl.getUniformLocation(program, n);
      });
    }
    cacheLocations(pushProgram, pushUniformLoc, [
      'u_push_buffer', 'u_resolution', 'u_deltaTime', 'u_mousePersist',
      'u_mousePosition', 'u_mouseHover', 'u_mouseRadius', 'u_mouseStretch', 'u_mousePush',
    ]);
    cacheLocations(mainProgram, mainUniformLoc, [
      'u_push_buffer', 'u_resolution', 'u_time', 'u_deltaTime', 'u_pixelRatio',
      'u_loop', 'u_speed', 'u_seed', 'u_scale', 'u_jellify', 'u_turbIter',
      'u_turbFreq', 'u_turbAmp', 'u_waveFreq', 'u_distBias', 'u_dither',
      'u_ditherMode', 'u_colors', 'u_colors_length', 'u_exposure', 'u_contrast', 'u_saturation',
    ]);

    let rafId;
    let startTime = performance.now();
    let lastTime = startTime;

    function frame(now) {
      const t = (now - startTime) / 1000;
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      // --- Pass 1: advect the mouse push field (ping-pong buffer) ---
      const src = pingPong[pingIndex];
      const dst = pingPong[1 - pingIndex];

      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, pushW, pushH);
      gl.useProgram(pushProgram);
      bindQuad(pushProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(pushUniformLoc.u_push_buffer, 0);
      gl.uniform2f(pushUniformLoc.u_resolution, pushW, pushH);
      gl.uniform1f(pushUniformLoc.u_deltaTime, dt);
      gl.uniform1f(pushUniformLoc.u_mousePersist, u.mousePersist);
      gl.uniform4f(pushUniformLoc.u_mousePosition, mouse.x, mouse.y, mouse.vx, mouse.vy);
      gl.uniform1f(pushUniformLoc.u_mouseHover, mouse.hover);
      gl.uniform1f(pushUniformLoc.u_mouseRadius, u.mouseRadius);
      gl.uniform1f(pushUniformLoc.u_mouseStretch, u.mouseStretch);
      gl.uniform1f(pushUniformLoc.u_mousePush, u.mousePush);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // decay per-frame velocity impulse so a held cursor doesn't re-push every frame
      mouse.vx *= 0.5;
      mouse.vy *= 0.5;

      pingIndex = 1 - pingIndex;

      // --- Pass 2: main liquid-gradient render to the visible canvas ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(mainProgram);
      bindQuad(mainProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pingPong[pingIndex].tex);
      gl.uniform1i(mainUniformLoc.u_push_buffer, 0);
      gl.uniform2f(mainUniformLoc.u_resolution, width, height);
      gl.uniform1f(mainUniformLoc.u_time, t);
      gl.uniform1f(mainUniformLoc.u_deltaTime, dt);
      gl.uniform1f(mainUniformLoc.u_pixelRatio, Math.min(window.devicePixelRatio || 1, 2));
      gl.uniform1f(mainUniformLoc.u_loop, u.loop);
      gl.uniform1f(mainUniformLoc.u_speed, u.speed);
      gl.uniform1f(mainUniformLoc.u_seed, u.seed);
      gl.uniform1f(mainUniformLoc.u_scale, u.scale);
      gl.uniform1f(mainUniformLoc.u_jellify, u.jellify ? 1 : 0);
      gl.uniform1f(mainUniformLoc.u_turbIter, u.turbIter);
      gl.uniform1f(mainUniformLoc.u_turbFreq, u.turbFreq);
      gl.uniform1f(mainUniformLoc.u_turbAmp, u.turbAmp);
      gl.uniform1f(mainUniformLoc.u_waveFreq, u.waveFreq);
      gl.uniform1f(mainUniformLoc.u_distBias, u.distBias);
      gl.uniform1f(mainUniformLoc.u_dither, u.dither);
      gl.uniform1f(mainUniformLoc.u_ditherMode, u.ditherMode);
      gl.uniform3fv(mainUniformLoc.u_colors, colorsFlat);
      gl.uniform1i(mainUniformLoc.u_colors_length, u.colors.length);
      gl.uniform1f(mainUniformLoc.u_exposure, u.exposure);
      gl.uniform1f(mainUniformLoc.u_contrast, u.contrast);
      gl.uniform1f(mainUniformLoc.u_saturation, u.saturation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (mouseEnabled) {
        window.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerleave', handlePointerLeave);
      }
      gl.deleteProgram(pushProgram);
      gl.deleteProgram(mainProgram);
      gl.deleteBuffer(vbo);
      if (pingPong) {
        pingPong.forEach(({ tex, fbo }) => {
          gl.deleteTexture(tex);
          gl.deleteFramebuffer(fbo);
        });
      }
    };
  }, [userUniforms, mouseEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
