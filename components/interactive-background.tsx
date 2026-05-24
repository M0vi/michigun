'use client';

import { useEffect, useState } from 'react';

export function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768 || window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
      if (mobile) return;

      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      if (!isFinePointer) return;

      const handleMouseMove = (e: MouseEvent) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        document.documentElement.style.setProperty('--mouse-opacity', '1');
      };
      const handleMouseLeave = () => {
        document.documentElement.style.setProperty('--mouse-opacity', '0');
      };
      const handleMouseEnter = () => {
        document.documentElement.style.setProperty('--mouse-opacity', '1');
      };

      // Set initial values
      document.documentElement.style.setProperty('--mouse-x', `-1000px`);
      document.documentElement.style.setProperty('--mouse-y', `-1000px`);
      document.documentElement.style.setProperty('--mouse-opacity', '0');

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
      document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener("mouseenter", handleMouseEnter);
      };
    }
  }, []);

  if (!mounted || isMobile) return null;

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-300"
      style={{
        background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.065), transparent 80%)',
        opacity: 'var(--mouse-opacity, 0)',
        willChange: 'background, opacity'
      }}
    />
  );
}
