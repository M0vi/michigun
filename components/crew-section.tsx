'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import useSWR from 'swr';
import { Circle, Music, Code, Gamepad2, Moon, Crown } from 'lucide-react';
import { fetcher, cn } from '@/lib/utils';
import { Reveal, Skeleton, Panel } from '@/components/ui-components';
import { CREW } from '@/lib/data';

const MemberCard = memo(function MemberCard({ dev, index }: { dev: typeof CREW[0], index: number }) {
  const { data } = useSWR(`/api/lanyard/${dev.id}`, fetcher, { refreshInterval: 10e3, dedupingInterval: 10000 });
  
  const isLoading = !data;
  const u = data?.success ? data.data : null;
  const spotify = u?.listening_to_spotify && u.spotify;
  const activity = u?.activities?.find((x: any) => x.type !== 4 && x.name !== 'Spotify');

  let statusLabel = 'Offline', StatusIcon: any = Circle, dot = 'bg-white/10 text-white/10';
  if (spotify) { statusLabel = u.spotify.song; StatusIcon = Music; dot = 'bg-emerald-400 text-emerald-400'; }
  else if (activity) { statusLabel = activity.name === 'Code' ? 'Codando' : activity.name; StatusIcon = activity.name === 'Code' ? Code : Gamepad2; dot = 'bg-[#888888] text-[#888888]'; }
  else {
    const st = u?.discord_status;
    if (st === 'online') { statusLabel = 'Online'; dot = 'bg-emerald-400 text-emerald-400'; }
    if (st === 'idle') { statusLabel = 'Ausente'; StatusIcon = Moon; dot = 'bg-amber-400 text-amber-400'; }
    if (st === 'dnd') { statusLabel = 'Ocupado'; dot = 'bg-red-400 text-red-400'; }
  }

  const avatarSrc = u?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png?size=256`
    : `https://ui-avatars.com/api/?name=${(dev as any).nick || '?'}&background=111&color=444&size=256`;
  const handle = u?.discord_user?.username ?? (dev as any).nick ?? '—';
  const isMainDev = handle.toLowerCase() === 'h64' || (dev as any).nick?.toLowerCase() === 'h64';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex justify-center mt-12 md:mt-16"
    >
      <Panel className="relative w-full max-w-[340px] px-6 pb-8 pt-0 group mt-14">
        
        {/* Floating Avatar (Overlapping Top) */}
        <div className="relative flex justify-center w-full -mt-14 mb-4">
          <div className={cn(
            "relative w-28 h-28 rounded-full overflow-hidden border-2 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.05] bg-[#0a0a0a]",
            isMainDev 
              ? "border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] group-hover:border-[#d4af37]/80" 
              : "border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:border-white/30"
          )}>
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : (
              <Image src={avatarSrc} alt={handle} fill className="object-cover" sizes="(max-width: 768px) 112px, 112px" />
            )}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
          </div>
          
          {!isLoading && (
            <div className={cn(
              "absolute bottom-0 right-[50%] translate-x-[56px] w-5 h-5 rounded-full border-[3px] border-[#111111] z-10 shadow-lg",
              dot.split(' ')[0]
            )} />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center w-full text-center">
          <div className="flex items-center gap-2 justify-center w-full">
            {isLoading ? (
              <Skeleton className="h-8 w-32 rounded" />
            ) : (
              <>
                <h3 className={cn(
                  "font-black text-2xl truncate tracking-tight",
                  isMainDev ? "text-transparent bg-clip-text bg-gradient-to-b from-[#fff] to-[#d4af37]" : "text-white"
                )}>
                  {handle}
                </h3>
                {isMainDev && (
                  <Crown size={20} className="text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.6)] shrink-0" />
                )}
              </>
            )}
          </div>

          <div className="mt-3">
            {isLoading ? (
              <Skeleton className="h-5 w-20 rounded-full" />
            ) : (
              <span className={cn(
                "inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border transition-colors",
                isMainDev 
                  ? "text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/10" 
                  : "text-[#a1a1a1] border-white/10 bg-white/5"
              )}>
                {isMainDev ? 'Líder / Dev' : dev.role}
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

        {/* RPC / Status */}
        <div className="flex flex-col items-center gap-3 w-full min-h-[40px]">
          {isLoading ? (
            <Skeleton className="h-5 w-24 rounded" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <StatusIcon size={14} className={isMainDev ? "text-[#d4af37]/80" : dot.split(' ')[1]} />
                <span className={cn("text-xs font-bold tracking-wide", isMainDev ? "text-[#d4af37]/90" : "text-[#a1a1a1]")}>
                  {statusLabel}
                </span>
              </div>

              {spotify && (
                <div className="w-full flex items-center justify-start gap-3 p-3 rounded-lg bg-black/40 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-black/60 mt-2">
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className={cn("absolute inset-0 blur-sm opacity-50", isMainDev ? "bg-[#d4af37]" : "bg-emerald-400")} />
                    <Music size={16} className={cn("relative z-10", isMainDev ? "text-[#d4af37]" : "text-emerald-400")} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={cn("text-[11px] font-black truncate tracking-wide leading-tight", isMainDev ? "text-[#f9f295]" : "text-white")}>{u.spotify.song}</p>
                    <p className={cn("text-[9px] font-bold truncate uppercase tracking-widest mt-0.5", isMainDev ? "text-[#d4af37]/80" : "text-[#666666]")}>{u.spotify.artist}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </Panel>
    </motion.div>
  );
});

export function CrewSection() {
  return (
    <section id="equipe" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 flex flex-col items-center">
      <Reveal>
        <h2 className="text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] uppercase leading-none mix-blend-lighten flex flex-col items-center mt-4">
          <span className="font-black tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-neutral-600 drop-shadow-2xl">
            EQUIPE
          </span>
          <span className="relative inline-block mt-2 font-light tracking-[0.2em] md:tracking-[0.4em] text-white opacity-80 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] ml-[0.2em] text-xl sm:text-3xl md:text-[3rem] lg:text-[4rem]">
            MICHIGUN
          </span>
        </h2>
      </Reveal>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-3xl">
        {CREW.map((d, i) => <MemberCard key={d.id} dev={d} index={i} />)}
      </div>
    </section>
  );
}
