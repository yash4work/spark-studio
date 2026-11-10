import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState('default'); // 'default' | 'hover' | 'view'

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Exact Framer smooth spring configuration
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Hide system cursor on desktop matching Framer's html.spark-cursor
    document.documentElement.classList.add('spark-cursor');

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect clickable element vs template card hovers
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // 1. Template Card hover -> 'view' mode (92px purple pill with "View" text)
      if (
        target.closest('.framer-template-card') ||
        target.closest('[data-framer-name="Template Card"]')
      ) {
        setCursorMode('view');
        return;
      }

      // 2. Buttons, links, standard rows -> 'hover' mode (54px ring, scaled dot)
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.framer-standard-row') ||
        target.closest('.framer-service-card') ||
        target.closest('.framer-btn-primary') ||
        target.closest('.framer-btn-secondary') ||
        target.closest('.framer-pipeline-card')
      ) {
        setCursorMode('hover');
        return;
      }

      setCursorMode('default');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.documentElement.classList.remove('spark-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  const isView = cursorMode === 'view';
  const isHover = cursorMode === 'hover';

  const ringSize = isView ? 92 : isHover ? 54 : 34;

  return (
    <>
      {/* Outer Spring Ring (Exact Framer Specs) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10001] rounded-full flex items-center justify-center select-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: ringSize,
          height: ringSize,
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: isView ? 'rgb(108, 79, 232)' : 'rgba(247, 246, 251, 0.45)',
          backgroundColor: isView ? 'rgb(108, 79, 232)' : 'rgba(0, 0, 0, 0)',
          boxShadow: isView ? '0 10px 30px rgba(108, 79, 232, 0.5)' : 'none',
          transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
        }}
      >
        {/* "View" Text Inside Ring (Appears ONLY on Template Cards) */}
        <span
          style={{
            color: 'rgb(247, 246, 251)',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            opacity: isView ? 1 : 0,
            transform: isView ? 'scale(1)' : 'scale(0.6)',
            transition: 'opacity 0.2s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          View
        </span>
      </motion.div>

      {/* Inner Dot (Disappears on Template Card hover, scales down on link hover) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10002] rounded-full bg-[#f7f6fb] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: '6px',
          height: '6px',
          opacity: isView ? 0 : 1,
          transform: isHover
            ? 'translateX(-50%) translateY(-50%) scale(0.5)'
            : 'translateX(-50%) translateY(-50%) scale(1)',
          transition: 'opacity 0.2s ease, transform 0.2s ease'
        }}
      />
    </>
  );
}
