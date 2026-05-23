'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export interface ParallaxStarsBackgroundProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  speed?: number;
}

const generateBoxShadows = (n: number) => {
  if (typeof window === 'undefined') return ''
  let value = `${(Math.random() * 100).toFixed(2)}vw ${(Math.random() * 200).toFixed(2)}vh #FFF`;
  for (let i = 2; i <= n; i++) {
    value += `, ${(Math.random() * 100).toFixed(2)}vw ${(Math.random() * 200).toFixed(2)}vh #FFF`;
  }
  return value;
};

export function ParallaxStarsBackground({
  title = "PURE CSS\nPARALLAX PIXEL STARS",
  children,
  className = "",
  speed = 1
}: ParallaxStarsBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const shadowsSmall = useMemo(() => generateBoxShadows(700), []);
  const shadowsMedium = useMemo(() => generateBoxShadows(200), []);
  const shadowsBig = useMemo(() => generateBoxShadows(100), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative w-full min-h-screen bg-[#090A0F] font-display ${className}`}>
      <style>{`
        .bg-radial-space {
          background: radial-gradient(ellipse at bottom, #111111 0%, #000000 100%);
        }
        @keyframes animStar {
          from { transform: translateY(0vh); }
          to { transform: translateY(-200vh); }
        }
      `}</style>


      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

        <div className="absolute inset-0 bg-radial-space" />


        <div 
          className="absolute left-0 top-0 w-[1px] h-[1px] bg-transparent animate-[animStar_50s_linear_infinite]"
          style={{ 
            boxShadow: mounted ? shadowsSmall : 'none',
            animationDuration: `${50 / speed}s`
          }}
        >
          <div 
            className="absolute top-[200vh] w-[1px] h-[1px] bg-transparent"
            style={{ boxShadow: mounted ? shadowsSmall : 'none' }}
          />
        </div>


        <div 
          className="absolute left-0 top-0 w-[2px] h-[2px] bg-transparent animate-[animStar_100s_linear_infinite]"
          style={{ 
            boxShadow: mounted ? shadowsMedium : 'none',
            animationDuration: `${100 / speed}s`
          }}
        >
          <div 
            className="absolute top-[200vh] w-[2px] h-[2px] bg-transparent"
            style={{ boxShadow: mounted ? shadowsMedium : 'none' }}
          />
        </div>


        <div 
          className="absolute left-0 top-0 w-[3px] h-[3px] bg-transparent animate-[animStar_150s_linear_infinite]"
          style={{ 
            boxShadow: mounted ? shadowsBig : 'none',
            animationDuration: `${150 / speed}s`
          }}
        >
          <div 
            className="absolute top-[200vh] w-[3px] h-[3px] bg-transparent"
            style={{ boxShadow: mounted ? shadowsBig : 'none' }}
          />
        </div>
      </div>


      <div className="relative z-10 w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default ParallaxStarsBackground;
