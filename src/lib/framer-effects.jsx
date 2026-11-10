import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useSpring, motion } from 'framer-motion';

export const isFine = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Magnetic pull toward the cursor (buttons, CTAs)
export function withMagnetic(Component) {
  return function MagneticComponent(props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

    return (
      <Component
        {...props}
        style={{ ...props.style, x: sx, y: sy }}
        onMouseMove={(e) => {
          props.onMouseMove?.(e);
          if (!isFine()) return;
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
          y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
        }}
        onMouseLeave={(e) => {
          props.onMouseLeave?.(e);
          x.set(0);
          y.set(0);
        }}
      />
    );
  };
}

// Magnetic Button Wrapper Component for easy JSX composition
export function MagneticButton({ children, className = '', style = {}, ...rest }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      style={{ display: 'inline-block', x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!isFine()) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    </motion.div>
  );
}

// 3D tilt + cursor spotlight + scroll reveal (cards)
export function withTilt(Component) {
  return function TiltComponent(props) {
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 140, damping: 18 });
    const sry = useSpring(ry, { stiffness: 140, damping: 18 });

    return (
      <Component
        {...props}
        style={{
          ...props.style,
          rotateX: srx,
          rotateY: sry,
          transformPerspective: 1100,
          backgroundImage:
            'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(142,151,247,var(--sa, 0)), transparent 45%)',
        }}
        onMouseMove={(e) => {
          props.onMouseMove?.(e);
          if (!isFine()) return;
          const el = e.currentTarget;
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * 7);
          rx.set((0.5 - py) * 7);
          el.style.setProperty('--mx', `${px * 100}%`);
          el.style.setProperty('--my', `${py * 100}%`);
          el.style.setProperty('--sa', '0.16');
        }}
        onMouseLeave={(e) => {
          props.onMouseLeave?.(e);
          rx.set(0);
          ry.set(0);
          e.currentTarget.style.setProperty('--sa', '0');
        }}
      />
    );
  };
}

// Tilt Card Wrapper Component for easy JSX composition
export function TiltCard({ children, className = '', style = {}, ...rest }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1100,
        backgroundImage:
          'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(142,151,247,var(--sa, 0)), transparent 45%)',
      }}
      onMouseMove={(e) => {
        if (!isFine()) return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 7);
        rx.set((0.5 - py) * 7);
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.setProperty('--sa', '0.16');
      }}
      onMouseLeave={(e) => {
        rx.set(0);
        ry.set(0);
        e.currentTarget.style.setProperty('--sa', '0');
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Decode / scramble text when it scrolls into view (stats, labels)
export function withScramble(Component) {
  return function ScrambleComponent(props) {
    const ref = useRef(null);

    useEffect(() => {
      const el = ref.current;
      if (!el || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      const finals = nodes.map((n) => n.textContent || '');
      const glyphs = '!<>-_/[]{}=+*^?#01ABCDEF';
      let raf = 0;
      let timer = 0;
      let started = false;

      const run = () => {
        started = true;
        const start = performance.now();
        const dur = 1100;
        const frame = (now) => {
          const t = Math.min(1, (now - start) / dur);
          nodes.forEach((n, i) => {
            const f = finals[i];
            const reveal = Math.floor(t * f.length);
            let out = '';
            for (let c = 0; c < f.length; c++)
              out +=
                c < reveal || f[c] === ' '
                  ? f[c]
                  : glyphs[(Math.random() * glyphs.length) | 0];
            n.textContent = out;
          });
          if (t < 1) raf = requestAnimationFrame(frame);
          else nodes.forEach((n, i) => (n.textContent = finals[i]));
        };
        raf = requestAnimationFrame(frame);
      };

      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !started) {
            io.disconnect();
            timer = window.setTimeout(
              run,
              Math.max(250, 1100 - performance.now())
            );
          }
        },
        { threshold: 0.6 }
      );
      io.observe(el);

      return () => {
        io.disconnect();
        window.clearTimeout(timer);
        cancelAnimationFrame(raf);
        nodes.forEach((n, i) => (n.textContent = finals[i]));
      };
    }, []);

    return <Component {...props} ref={ref} />;
  };
}

// Scramble Text Element
export function ScrambleText({ text, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const glyphs = '!<>-_/[]{}=+*^?#01ABCDEF';
    let raf = 0;
    let timer = 0;
    let started = false;

    const run = () => {
      started = true;
      const start = performance.now();
      const dur = 1000;
      const frame = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const reveal = Math.floor(t * text.length);
        let out = '';
        for (let c = 0; c < text.length; c++) {
          out +=
            c < reveal || text[c] === ' '
              ? text[c]
              : glyphs[(Math.random() * glyphs.length) | 0];
        }
        if (el) el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(frame);
        else if (el) el.textContent = text;
      };
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          io.disconnect();
          timer = window.setTimeout(run, 250);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      if (el) el.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

// Floating glass navigation: blurs after scrolling, hides on scroll down, returns on scroll up
export function withGlassNav(Component) {
  return function GlassNavComponent(props) {
    const [scrolled, setScrolled] = useState(false);
    const y = useMotionValue(0);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      let last = window.scrollY;
      let hidden = false;
      const onScroll = () => {
        const cur = window.scrollY;
        setScrolled(cur > 24);
        if (cur > last + 4 && cur > 320 && !hidden) {
          hidden = true;
          animate(y, -130, {
            duration: 0.6,
            ease: [0.2, 0.8, 0.2, 1],
          });
        } else if ((cur < last - 4 || cur < 120) && hidden) {
          hidden = false;
          animate(y, 0, { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] });
        }
        last = cur;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }, [y]);

    return (
      <Component
        {...props}
        style={{
          ...props.style,
          y,
          backgroundColor: scrolled
            ? 'rgba(21,19,31,0.94)'
            : 'rgba(21,19,31,0)',
          boxShadow: scrolled
            ? 'inset 0 0 0 1px rgba(247,246,251,0.08), 0 20px 50px -20px rgba(0,0,0,0.6)'
            : 'inset 0 0 0 1px rgba(247,246,251,0)',
          borderRadius: scrolled ? 18 : 0,
          transition:
            'background-color .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s, border-radius .5s',
        }}
      />
    );
  };
}
