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

          <h1 className="relative font-black text-center tracking-tighter leading-[0.85] text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] uppercase select-none group">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/2 bg-white/20 blur-[100px] md:blur-[120px] rounded-full group-hover:bg-white/30 transition-all duration-1000" />
            </div>
            
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-black">
              MICHIGUN
            </span>

            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_4s_infinite_linear] bg-[length:200%_auto] opacity-80 mix-blend-overlay">
              MICHIGUN
            </span>
          </h1>
          
          <div className="flex flex-col items-center gap-8 mt-2">
            <p className="text-sm md:text-base font-medium text-[#a1a1a1] max-w-sm text-center">
              Script para Exército Brasileiro no Roblox.<br/>por @h64.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center w-full max-w-lg">
              <Magnetic>
                <Link href="#script" className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-xl font-sans font-bold uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 hover:bg-[#e2e2e2] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] border border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                  Pegar o script <ArrowRight size={14} />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link href="#arenas" className="w-full sm:w-auto bg-transparent text-white border border-white/20 px-8 py-4 rounded-xl font-sans font-bold uppercase tracking-[0.1em] text-[11px] hover:border-white/60 hover:bg-white/5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center">
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
