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
        <Eyebrow>Script</Eyebrow>
        <h2 className="font-black tracking-tighter text-white uppercase leading-[0.9] text-5xl md:text-7xl">
          Cole no seu <br /><span className="text-[#666666] font-light">executor</span>
        </h2>
        <p className="text-[#a1a1a1] font-medium mt-6">Compatível com a maioria dos executores</p>
      </Reveal>
      
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col gap-6 max-w-4xl w-full">
          <Panel className="p-0 overflow-visible relative">
            <div className="bg-[#111111]/80 border-b border-white/5 px-4 py-3 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B50]/60" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/5" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleCopy} className="text-[#a1a1a1] hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <div className="w-px h-3 bg-white/10" />
                <div ref={dlRef} className="relative flex items-center">
                  <button onClick={() => setDlOpen(v => !v)} className="text-[#a1a1a1] hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
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

            <div className="p-6 md:p-8 overflow-x-auto">
              <code className="block font-mono text-xs md:text-sm leading-relaxed text-white/80 break-all">
                <span className="text-[#FF6B50]">loadstring</span>
                <span className="text-white/40">(</span>
                <span className="text-[#7dd3fc]">request</span>
                <span className="text-white/40">{"({"}</span>
                <span className="text-white/50">Url</span>
                <span className="text-white/40"> = </span>
                <span className="text-emerald-300">"https://michigun.xyz/scripts/main.lua"</span>
                <span className="text-white/40">{"})"}</span>
                <span className="text-[#7dd3fc]">.Body</span>
                <span className="text-white/40">)()</span>
              </code>
            </div>
          </Panel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { Icon: Activity, label: 'Execuções totais', value: stats?.executions },
              { Icon: BarChart3, label: 'Execuções hoje', value: stats?.daily },
            ].map((s) => (
              <Panel key={s.label} className="p-6 flex flex-col justify-center min-h-[140px]">
                <div className="flex items-center gap-2 mb-3 text-[#666666]">
                  <s.Icon size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                <div className="font-black text-4xl md:text-5xl tracking-tighter text-white">
                  {statsErr ? (
                    <span className="text-red-400 text-sm">erro</span>
                  ) : s.value != null ? (
                    <Ticker target={s.value}/>
                  ) : (
                    <Skeleton className="h-10 w-32" />
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
