"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Crown, Check, Copy, Lock, AlertCircle, ArrowDown, Key, Unlock, Sparkles, Headset } from "lucide-react";
import toast from "react-hot-toast";
import { AlertBadge } from "@/components/alert-badge";
import { Panel, Magnetic, Reveal } from "@/components/ui-components";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.footer-bg-dots {
  background-size: 24px 24px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1.5px, transparent 1.5px);
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 215, 0, 0.08) 0%, 
    rgba(255, 215, 0, 0.02) 40%, 
    transparent 70%
  );
}

.footer-giant-bg-text {
  font-size: 24vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,215,0,0.05);
  background: linear-gradient(180deg, rgba(255,215,0,0.1) 0%, transparent 80%);
  -webkit-background-clip: text;
  background-clip: text;
}
`;

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>ACESSO INSTANTÂNEO</span> <span className="text-white/30">✦</span>
    <span>SEM KEY SYSTEM</span> <span className="text-white/30">✦</span>
    <span>CHAVE PERMANENTE</span> <span className="text-white/30">✦</span>
    <span>SUPORTE VIP</span> <span className="text-white/30">✦</span>
    <span>FUNÇÕES EXCLUSIVAS</span> <span className="text-white/30">✦</span>
  </div>
);

function PremiumHero() {
  return (
    <div className="relative pt-40 pb-20 md:pt-52 md:pb-32 w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.06)_0%,transparent_50%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent border-y border-[#FFD700]/20 text-[#FFD700] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-12 opacity-80">
          Acesso Exclusivo
        </div>
        
        <h1 className="text-4xl sm:text-7xl md:text-[7.5rem] uppercase leading-none mix-blend-lighten flex flex-col items-center">
          <span className="font-black tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-neutral-600 drop-shadow-2xl">
            MICHIGUN
          </span>
          <span className="relative inline-block mt-3 sm:mt-4 md:mt-6 font-light tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.6em] text-[#FFD700] drop-shadow-[0_0_40px_rgba(255,215,0,0.6)] ml-[0.3em] sm:ml-[0.4em] md:ml-[0.6em] text-3xl sm:text-6xl md:text-[6rem]">
            PREMIUM
          </span>
        </h1>
        
        <p className="mt-12 text-neutral-400 max-w-lg text-sm md:text-base font-light tracking-[0.2em] uppercase opacity-60">
          A experiência definitiva.
        </p>
      </motion.div>
    </div>
  );
}

const FEATURES = [
  { title: "Acesso vitalício", desc: "Sua chave nunca expira.", Icon: Key },
  { title: "Sem key system", desc: "Injeção direta sem propagandas.", Icon: Unlock },
  { title: "Scripts VIP", desc: "Acesso total a funções exclusivas.", Icon: Sparkles },
  { title: "Suporte direto", desc: "Contato prioritário via Discord.", Icon: Headset }
];

function PremiumFeatures() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-12 md:gap-24 relative z-10">
      {FEATURES.map((feat, i) => (
        <Reveal key={i} delay={0.1}>
          <div className={`flex flex-col md:flex-row gap-6 md:gap-12 items-stretch ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 relative">
              <Panel className="p-8 md:p-12 h-full flex flex-col justify-center border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl relative overflow-hidden">
                {/* Watermark Icon for Mobile */}
                <div className="absolute -right-4 -bottom-4 md:hidden opacity-10 pointer-events-none">
                  <feat.Icon size={120} className="text-[#FFD700]" />
                </div>
                
                <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,215,0,0.15)] ring-1 ring-[#FFD700]/30 relative z-10">
                  <Check size={24} className="text-[#FFD700]" strokeWidth={3} />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-4 relative z-10">{feat.title}</h3>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium relative z-10">{feat.desc}</p>
              </Panel>
            </div>
            <div className="flex-1 hidden md:flex items-center justify-center">
              <div className="w-full h-full min-h-[200px] rounded-3xl bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_0%,transparent_70%)] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 footer-bg-grid opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i }}
                >
                  <feat.Icon size={64} className="text-[#FFD700]/20 drop-shadow-[0_0_15px_rgba(255,215,0,0.1)] group-hover:text-[#FFD700]/40 transition-colors duration-500" />
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function PremiumPage() {
  const [step, setStep] = useState<'form' | 'pix' | 'success'>('form');
  const [discord, setDiscord] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode: string; copyPaste: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "20vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        checkoutRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { scale: 0.85, borderRadius: "3rem" },
          {
            scale: 1,
            borderRadius: "0px",
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 95%",
              end: "top 0%",
              scrub: true,
            },
          }
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discord.trim() || !email.trim()) {
      toast.dismiss();
      toast.custom((t) => (
        <AlertBadge
          variant="error"
          icon={AlertCircle}
          label="Preencha todos os campos!"
          className={t.visible ? 'animate-in fade-in' : 'animate-out fade-out'}
        />
      ), { duration: 2500 });
      return;
    }
    setLoading(true);
    fetch("/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discord, email })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro na comunicação com a API");
        return data;
      })
      .then((data) => {
        setPixData(data);
        setStep('pix');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao gerar pix:", err);
        toast.dismiss();
        toast.custom((t) => (
          <AlertBadge
            variant="error"
            icon={AlertCircle}
            label={err.message || "Ocorreu um erro ao gerar o PIX."}
            className={t.visible ? 'animate-in fade-in' : 'animate-out fade-out'}
          />
        ), { duration: 3000 });
        setLoading(false);
      });
  };

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      toast.dismiss();
      toast.custom((t) => (
        <AlertBadge
          variant="success"
          icon={Check}
          label="Código PIX copiado com sucesso!"
          className={t.visible ? 'animate-in fade-in' : 'animate-out fade-out'}
        />
      ), { id: 'copy-toast', duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#050505] text-[#ebebeb] font-display flex flex-col relative overflow-x-hidden selection:bg-[#FFD700]/30 selection:text-white min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <PremiumHero />
      <PremiumFeatures />

      <div className="h-12 md:h-20 w-full" /> 
      
      <div
        ref={wrapperRef}
        className="relative w-full min-h-[100dvh] flex items-center justify-center bg-transparent"
      >
        <footer ref={footerRef} className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center py-20 md:py-32 overflow-hidden bg-[#0a0a0a] border border-white/5">
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[100px] pointer-events-none z-0" />
          <div className="footer-bg-dots absolute inset-0 z-0 pointer-events-none" />

          <div
            ref={giantTextRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none flex items-center justify-center opacity-30 w-full overflow-hidden"
          >
            <motion.div
              animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2], scale: [1, 1.02, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] text-[#FFD700]/20 drop-shadow-[0_0_120px_rgba(255,215,0,0.5)] mix-blend-screen" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="rgba(255, 215, 0, 0.03)" />
                <path d="M3 16h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" fill="rgba(255, 215, 0, 0.05)" />
              </svg>
            </motion.div>
          </div>

          <div className="absolute top-[8%] sm:top-[10%] md:top-[15%] left-0 w-full overflow-hidden border-y border-white/5 bg-[#111]/40 backdrop-blur-md py-3 sm:py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] text-[#FFD700] uppercase opacity-80">
              <MarqueeItem />
              <MarqueeItem />
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div ref={checkoutRef} className="relative z-20 w-full max-w-md mx-auto px-4 mt-12 sm:mt-8 md:mt-16">
            <Panel className="w-full bg-[#111]/80 backdrop-blur-2xl border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <div className="p-6 sm:p-8 relative z-10 w-full flex flex-col">
                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm text-neutral-400 mb-1 font-medium uppercase tracking-widest">Valor único</p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tighter text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                    R$ 19,97
                  </p>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-sm font-medium text-neutral-400 animate-pulse">Conectando AmploPay...</p>
                  </div>
                ) : step === 'form' ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Discord</label>
                      <input 
                        type="text" 
                        placeholder="@h64" 
                        value={discord}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^a-zA-Z0-9_.\-@]/g, '');
                          setDiscord(sanitized);
                        }}
                        pattern="^@?[a-zA-Z0-9_.-]{2,32}$"
                        title="O usuário do Discord só pode conter letras, números, underscore e ponto (máx 32 caracteres)."
                        maxLength={32}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FFD700] rounded-xl px-4 py-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:bg-white/10 shadow-inner focus:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">E-mail</label>
                      <input 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^a-zA-Z0-9_.+@\-]/g, '');
                          setEmail(sanitized);
                        }}
                        maxLength={255}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FFD700] rounded-xl px-4 py-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:bg-white/10 shadow-inner focus:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                        required
                      />
                    </div>
                    <Magnetic strength={0.2}>
                      <button 
                        type="submit"
                        className="mt-2 w-full bg-[#FFD700] text-black font-sans font-bold uppercase tracking-[0.1em] text-[12px] rounded-xl py-4 hover:bg-[#FBBF24] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                      >
                        Gerar PIX
                      </button>
                    </Magnetic>
                    <div className="flex items-center justify-center gap-2 mt-2 bg-black/40 py-2.5 px-3 rounded-lg border border-white/5">
                      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                        <Lock size={12} className="text-[#FFD700]" />
                      </motion.div>
                      <p className="text-[9px] font-mono font-bold text-neutral-400 tracking-widest uppercase">
                        Criptografado <span className="text-[#FFD700]">via AmploPay</span>
                      </p>
                    </div>
                  </form>
                ) : step === 'pix' && pixData ? (
                  <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
                    {pixData.qrCode ? (
                      <div className="relative p-2 bg-white rounded-xl shadow-2xl ring-4 ring-[#FFD700]/30">
                        <img src={pixData.qrCode} alt="QR Code PIX" className="rounded-lg w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
                      </div>
                    ) : (
                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                        <p className="text-sm font-bold text-neutral-400">QR Code indisponível.</p>
                        <p className="text-xs text-neutral-500 mt-1">Use a chave Copia e Cola abaixo.</p>
                      </div>
                    )}

                    <div className="w-full space-y-3">
                      <p className="text-sm font-medium text-center text-neutral-300">Escaneie o QR Code ou copie a chave</p>
                      <button
                        onClick={handleCopy}
                        className="group relative w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-[#FFD700]/80 rounded-xl py-4 px-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/10 to-[#FFD700]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="truncate text-sm font-mono text-neutral-300 group-hover:text-white transition-colors">
                          {pixData.copyPaste}
                        </span>
                        <div className="shrink-0 ml-2 p-2 rounded-lg bg-black/40 group-hover:bg-[#FFD700]/20 text-neutral-400 group-hover:text-[#FFD700] transition-colors">
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </div>
                      </button>
                    </div>

                    <Magnetic strength={0.2}>
                      <button
                        onClick={() => setStep('success')}
                        className="mt-2 w-full bg-[#FFD700] text-black font-sans font-bold uppercase tracking-[0.1em] text-[12px] rounded-xl py-4 hover:bg-[#FBBF24] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                      >
                        Já realizei o pagamento
                      </button>
                    </Magnetic>
                  </div>
                ) : step === 'success' ? (
                  <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500 py-2 sm:py-6 w-full relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-0 sm:mb-2 ring-4 ring-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                      <Check size={32} className="text-[#FFD700] sm:w-10 sm:h-10" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mb-2">Quase lá!</h2>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
                        Para liberar o seu acesso agora mesmo, siga os passos abaixo:
                      </p>
                    </div>
                    <div className="w-full bg-[#111] border border-[#333] rounded-xl p-4 sm:p-5 text-left space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5">1</div>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-snug">Entre no nosso servidor do Discord clicando no botão abaixo.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5">2</div>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-snug">
                          Procure pelo canal <span className="text-white font-mono bg-[#222] px-1.5 py-0.5 rounded text-[10px] sm:text-xs border border-[#333]">💸・receber-premium</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5">3</div>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-snug">Abra um ticket e envie a foto do seu comprovante. Um admin te entregará a key!</p>
                      </div>
                    </div>
                    <a href="https://discord.gg/pWeJUBabvF" target="_blank" className="mt-2 w-full bg-[#5865F2] text-white font-mono font-bold uppercase tracking-[0.1em] text-[10px] rounded-none py-4 hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2">
                      Abrir Discord
                    </a>
                  </div>
                ) : (
                  <div className="py-10 text-center text-neutral-400">
                    Erro ao carregar. Recarregue a página.
                  </div>
                )}
              </div>
            </Panel>
          </div>
          
          <div className="absolute bottom-6 left-0 w-full text-center z-10 pointer-events-none">
            <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-600 uppercase">
              © {new Date().getFullYear()} Michigun.xyz
            </p>
          </div>

        </footer>
      </div>
    </div>
  );
}
