'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { Check, Copy, Download, FileCode, FileText, Activity, BarChart3 } from 'lucide-react';
import { playSound, fetcher } from '@/lib/utils';
import { AlertBadge } from '@/components/alert-badge';
import { Panel, Reveal, Eyebrow, Ticker, Skeleton } from '@/components/ui-components';

export function ScriptPanel() {
  const [copied, setCopied] = useState(false);
  const [dlOpen, setDlOpen] = useState(false);
  const dlRef = useRef<HTMLDivElement>(null);

  const { data: cfg } = useSWR('/api/config', fetcher, { revalidateOnFocus: false });
  const scriptText: string = cfg?.script ?? '';

  const { data: stats, error: statsErr } = useSWR('/api/stats', fetcher, { refreshInterval: 15e3 });

  const handleCopy = useCallback(() => {
    if (!scriptText) return;
    playSound('click'); navigator.clipboard.writeText(scriptText);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    toast.custom((t) => (
      <AlertBadge
        variant="success"
        icon={Check}
        label="Script copiado!"
        className={t.visible ? 'animate-in fade-in' : 'animate-out fade-out'}
      />
    ), { id: 'copy-toast', duration: 2000 });
  }, [scriptText]);

  useEffect(() => {
    if (!dlOpen) return;
    const close = (e: MouseEvent) => {
      if (dlRef.current && !dlRef.current.contains(e.target as Node)) setDlOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [dlOpen]);

  return (
    <section id="script" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
      <Reveal>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] uppercase leading-none mix-blend-lighten flex flex-col items-center mt-4">
            <span className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-neutral-600 drop-shadow-2xl">
              INJETAR
            </span>
            <span className="font-light tracking-[0.2em] md:tracking-[0.4em] text-white opacity-80 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] text-xl sm:text-3xl md:text-[3rem] lg:text-[4rem] mt-2 ml-[0.2em] md:ml-[0.4em]">
              NO EXECUTOR
            </span>
          </h2>
          <p className="text-[#a1a1a1] font-medium mt-6 uppercase tracking-widest text-xs md:text-sm">Compatível com a maioria dos executores</p>
        </div>
      </Reveal>
      
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full">
          <Panel className="flex-1 p-0 overflow-visible relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] lg:self-center">
            <div className="bg-[#111111]/90 backdrop-blur-md border-b border-white/5 px-5 py-4 flex items-center justify-between rounded-t-xl shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.5)]" />
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleCopy} className="text-[#888888] hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14}/>}
                  {copied ? <span className="text-emerald-400">Copiado</span> : 'Copiar'}
                </button>
                <div className="w-px h-3 bg-white/10" />
                <div ref={dlRef} className="relative flex items-center">
                  <button onClick={() => setDlOpen(v => !v)} className="text-[#888888] hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                    <Download size={14} />
                    Salvar
                  </button>
                  {dlOpen && (
                    <div className="absolute top-full right-0 mt-4 w-32 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                      {([['txt', FileText], ['lua', FileCode]] as [string, any][]).map(([ext, Icon]) => (
                        <button key={ext}
                          onClick={() => {
                            if (!scriptText) return;
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(new Blob([scriptText], { type: 'application/octet-stream' }));
                            a.download = `michigun.${ext}`; a.click(); setDlOpen(false);
                          }}
                          className="w-full px-4 py-3 text-xs font-mono text-[#a1a1a1] hover:text-white hover:bg-[#1a1a1a] flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                        >
                          <Icon size={14}/>.{ext}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-x-auto flex-1 flex flex-col justify-center bg-[#050505]/40 relative rounded-b-xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none rounded-b-xl" />
              <code className="block font-mono text-[13px] md:text-[15px] leading-loose text-white/90 break-all relative z-10 whitespace-pre-wrap">
                <span className="text-[#FF6B50] font-bold">loadstring</span>
                <span className="text-white/40">(</span>
                <span className="text-[#7dd3fc] font-bold">request</span>
                <span className="text-white/40">{"({"}</span>
                <span className="text-[#a78bfa]">Url</span>
                <span className="text-white/40"> = </span>
                <span className="text-emerald-300">"https://michigun.xyz/scripts/main.lua"</span>
                <span className="text-white/40">{"})"}</span>
                <span className="text-[#7dd3fc]">.Body</span>
                <span className="text-white/40">)()</span>
              </code>
            </div>
          </Panel>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-[280px] shrink-0">
            {[
              { Icon: Activity, label: 'Execuções totais', value: stats?.executions },
              { Icon: BarChart3, label: 'Execuções hoje', value: stats?.daily },
            ].map((s) => (
              <Panel key={s.label} className="p-6 md:p-8 flex-1 lg:flex-none flex flex-col justify-center lg:h-1/2 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                  <s.Icon size={140} strokeWidth={1} />
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-[#888888] relative z-10">
                  <s.Icon size={14} className="text-white/60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                <div className="font-black text-4xl md:text-5xl tracking-tighter text-white relative z-10 drop-shadow-lg">
                  {statsErr ? (
                    <span className="text-red-400 text-sm font-medium tracking-normal">Erro ao carregar</span>
                  ) : s.value != null ? (
                    <Ticker target={s.value}/>
                  ) : (
                    <Skeleton className="h-10 w-24 bg-white/5" />
                  )}
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
