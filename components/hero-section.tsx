'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Magnetic } from '@/components/ui-components';

export function HeroSection() {
  const { scrollY } = useScroll();
  const heroTextScale = useTransform(scrollY, [0, 1200], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [200, 1000], [1, 0]);

  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-36 pb-16 z-10">
      <motion.div
        className="flex flex-col items-center justify-center px-6 will-change-transform"
        style={{ scale: heroTextScale, opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Image src="/avatar.png" alt="Logo" width={96} height={96} className="w-full h-full object-cover" priority />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] uppercase leading-none mix-blend-lighten flex flex-col items-center">
            <span className="font-black tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-neutral-600 drop-shadow-2xl">
              MICHIGUN
            </span>
          </h1>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes text-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-text-gradient {
              background-size: 200% auto;
              animation: text-gradient 4s linear infinite;
            }
            @keyframes hue-shift {
              0% { filter: hue-rotate(0deg); }
              100% { filter: hue-rotate(360deg); }
            }
            .animate-hue-shift {
              animation: hue-shift 2.5s linear infinite;
            }
          ` }} />

          <div className="flex flex-col items-center gap-8 mt-4 md:mt-6">
            <p className="text-base md:text-xl font-medium tracking-[0.1em] md:tracking-[0.15em] text-neutral-300 max-w-2xl text-center uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#8A2BE2] to-[#FF0080] animate-text-gradient animate-hue-shift drop-shadow-[0_0_15px_rgba(138,43,226,0.5)]">
                Script
              </span>{' '}
              para Exército Brasileiro <br className="sm:hidden" /><span className="text-neutral-500 font-normal">no Roblox</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 justify-center w-full max-w-lg">
              <Magnetic strength={0.2}>
                <Link href="#script" className="w-full sm:w-auto bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md text-white px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  Pegar o script <ArrowRight size={14} className="opacity-70" />
                </Link>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Link href="#arenas" className="w-full sm:w-auto bg-transparent text-white/50 border border-white/10 px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-[0.1em] text-[11px] hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
                  Ver mapas
                </Link>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
