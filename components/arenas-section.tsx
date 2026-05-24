'use client';

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Globe, ChevronDown } from 'lucide-react';
import { Reveal, Eyebrow, RiskTag } from '@/components/ui-components';
import { ARENAS, ABILITIES, Ability } from '@/lib/data';

const ArenaCard = memo(function ArenaCard({
  arena,
  abilities,
  onAbilityClick,
  index
}: {
  arena: any;
  abilities: Ability[];
  onAbilityClick: (a: Ability) => void;
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group w-full flex flex-col"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-3/4 h-3/4 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-all duration-1000" />
      </div>

      <div className="relative flex flex-col border border-white/5 bg-[#0a0a0a] overflow-hidden rounded-xl shadow-xl transition-all duration-300 hover:border-white/10 hover:shadow-[0_4px_30px_rgba(255,255,255,0.02)]">
        <div 
          className="w-full h-40 relative overflow-hidden shrink-0 cursor-pointer group/header rounded-t-xl" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {arena.isGlobal ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#111111] border-b border-white/5 group-hover/header:bg-[#151515] transition-colors">
              <Globe size={32} className="text-[#333333]" />
              <span className="font-black text-3xl uppercase tracking-tighter text-white">Global</span>
              <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase">{abilities.length} funções</p>
            </div>
          ) : (
            <>
              <Image src={(arena as any)?.thumb ?? ''} alt={arena.name} fill className="object-cover opacity-50 group-hover/header:opacity-70 transition-opacity duration-700" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 pointer-events-none">
                <p className="font-black text-3xl uppercase tracking-tighter text-white drop-shadow-xl">{arena.name}</p>
                <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mt-1">{abilities.length} funções</p>
              </div>
            </>
          )}
          
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/50 group-hover/header:text-white transition-colors">
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/5 bg-[#0a0a0a]"
            >
              <div className="p-4 flex flex-col gap-2.5">
                {abilities.map(a => (
                  <button key={a.name}
                    onClick={(e) => { e.stopPropagation(); onAbilityClick(a); }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#111111]/60 border border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left group shadow-sm"
                  >
                    <div className="flex items-center gap-3 truncate mr-4">
                      {a.icon && (
                        <div className="p-1.5 bg-white/5 rounded-lg text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-200 shrink-0">
                          <a.icon size={15} />
                        </div>
                      )}
                      <span className="text-[12px] font-bold text-white uppercase tracking-wider truncate">{a.name}</span>
                    </div>
                    <RiskTag risk={a.risk}/>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export function ArenasSection({ onAbilityClick }: { onAbilityClick: (a: Ability) => void }) {
  const allArenas = [
    { name: 'Global', slug: 'global', thumb: '/global_thumb.png', isGlobal: true },
    ...ARENAS.map(g => ({ ...g, isGlobal: false })),
  ];

  return (
    <section id="arenas" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
      <Reveal>
        <Eyebrow>Funções</Eyebrow>
        <h2 className="font-black tracking-tighter text-white uppercase leading-[0.9] text-5xl md:text-7xl">
          Jogos com funções <br /><span className="text-[#666666] font-light">exclusivas</span>
        </h2>
      </Reveal>
      
      <Reveal delay={0.1}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
          {allArenas.map((arena, i) => {
            const abilities = ABILITIES[arena.slug] ?? [];
            if (abilities.length === 0) return null;
            return <ArenaCard key={arena.slug} arena={arena} abilities={abilities} onAbilityClick={onAbilityClick} index={i} />;
          })}
        </div>
      </Reveal>
    </section>
  );
}
