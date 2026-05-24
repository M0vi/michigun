'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/data';

// Spotlight Panel
export function Panel({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches);
  }, []);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-xl bg-[#111111] border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:shadow-[0_0_35px_rgba(255,255,255,0.06)] transition-all duration-300 group",
        onClick && "cursor-pointer hover:border-white/15",
        className
      )}
    >
      {/* Static top light */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-t-xl z-10" />
      
      {/* Spotlight Hover Effect */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.08),
                transparent 80%
              )
            `,
          }}
        />
      )}
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded bg-white/10", className)} />
  );
}

export function Magnetic({ children, className, strength = 0.2 }: { children: React.ReactElement; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches);
  }, []);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={isMobile ? { x: 0, y: 0 } : { x, y }}
      style={{ x: springX, y: springY }}
      className={cn("relative flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm font-bold tracking-[0.2em] text-[#a1a1a1] uppercase">
        {children}
      </span>
    </div>
  );
}

export function RiskTag({ risk }: { risk: RiskLevel }) {
  const cfg = {
    safe:   { l: 'Seguro', c: 'text-emerald-400', bg: 'bg-emerald-400/10', b: 'border-emerald-400/20' },
    risk:   { l: 'Risco',  c: 'text-amber-400',   bg: 'bg-amber-400/10',   b: 'border-amber-400/20' },
    visual: { l: 'Visual', c: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', b: 'border-fuchsia-400/20' },
  };
  const current = cfg[risk] || cfg.safe;
  
  return (
    <span className={cn("inline-flex items-center text-[9px] font-sans font-bold tracking-[0.15em] uppercase px-2.5 py-0.5 rounded-full border", current.c, current.bg, current.b)}>
      {current.l}
    </span>
  );
}

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-10%" });
  const noMotion = useReducedMotion();
  
  if (noMotion) return <div>{children}</div>;
  
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50, filter: "blur(12px)", scale: 0.95 }}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}>
      {children}
    </motion.div>
  );
}

export const Ticker = ({ target }: { target: number }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0; const inc = target / (700 / 16);
    const t = setInterval(() => { v += inc; if (v >= target) { setN(target); clearInterval(t); } else setN(Math.floor(v)); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <span suppressHydrationWarning>{n.toLocaleString()}</span>;
};
