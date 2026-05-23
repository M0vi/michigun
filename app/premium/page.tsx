"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Crown, QrCode, Check, Copy, ArrowLeft, Lock } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import Nav from "@/components/nav";

export default function PremiumPage() {
  const [step, setStep] = useState<'form' | 'pix'>('form');
  const [discord, setDiscord] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode: string; copyPaste: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Mouse Tracking Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discord.trim() || !email.trim()) {
      toast.error("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    fetch("/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discord, email })
    })
      .then((res) => res.json())
      .then((data) => {
        setPixData(data);
        setStep('pix');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao gerar pix:", err);
        toast.error("Ocorreu um erro ao gerar o PIX.");
        setLoading(false);
      });
  };

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      toast.success("Código PIX copiado com sucesso!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ebebeb] font-display flex flex-col relative overflow-hidden">
      {/* Background elements (Mouse Tracking + Pulse) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            background: useMotionTemplate`radial-gradient(circle 800px at ${mouseX}px ${mouseY}px, rgba(212,175,55,0.06), transparent 80%)`
          }}
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_60%)]"
        />
      </div>

      <Nav />

      <main className="flex-1 flex items-center justify-center relative z-10 px-4 pt-24 pb-12">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Lado Esquerdo - Info Premium */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit text-sm font-medium">
              <ArrowLeft size={16} /> Voltar para o início
            </Link>
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                <Crown size={12} /> Acesso Exclusivo
              </div>
              <h1 className="relative text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-neutral-500 drop-shadow-lg">
                  Michigun
                </span>
                <br/>
                <span className="relative inline-block mt-2 font-serif italic tracking-widest text-[#d4af37] drop-shadow-[0_0_25px_rgba(212,175,55,0.8)]">
                  Premium
                </span>
              </h1>
            </div>

            <ul className="space-y-4 mt-4">
              {[
                "Remoção completa do Key-System",
                "Funções exclusivas de administrador",
                "Suporte direto com os desenvolvedores"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-300">
                  <div className="p-1 rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Lado Direito - Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="relative w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#222] shadow-[0_0_50px_rgba(212,175,55,0.1)]">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-70" />

              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-sm text-neutral-400 mb-1 font-medium uppercase tracking-widest">Valor único</p>
                  <p className="text-4xl font-black tracking-tighter text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                    R$ 19,90
                  </p>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-sm font-medium text-neutral-400 animate-pulse">Conectando AmploPay...</p>
                  </div>
                ) : step === 'form' ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Discord</label>
                      <input 
                        type="text" 
                        placeholder="@h64" 
                        value={discord}
                        onChange={(e) => {
                          // Impede fisicamente a digitação de qualquer coisa que não seja: letras, números, _, ., - ou @
                          const sanitized = e.target.value.replace(/[^a-zA-Z0-9_.\-@]/g, '');
                          setDiscord(sanitized);
                        }}
                        pattern="^@?[a-zA-Z0-9_.-]{2,32}$"
                        title="O usuário do Discord só pode conter letras, números, underscore e ponto (máx 32 caracteres)."
                        maxLength={32}
                        className="w-full bg-[#111] border border-[#333] focus:border-[#d4af37] rounded-xl px-4 py-4 text-sm text-white placeholder-neutral-600 outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">E-mail</label>
                      <input 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => {
                          // Impede fisicamente a digitação de aspas, espaços, <, > e caracteres perigosos
                          const sanitized = e.target.value.replace(/[^a-zA-Z0-9_.+@\-]/g, '');
                          setEmail(sanitized);
                        }}
                        maxLength={255}
                        className="w-full bg-[#111] border border-[#333] focus:border-[#d4af37] rounded-xl px-4 py-4 text-sm text-white placeholder-neutral-600 outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="mt-4 w-full bg-[#d4af37] text-black font-mono font-bold uppercase tracking-[0.1em] text-[10px] rounded-none py-4 hover:bg-[#b5952f] transition-colors flex items-center justify-center gap-2 border border-[#d4af37]"
                    >
                      Gerar PIX
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 bg-[#111] py-2 px-3 rounded-lg border border-[#333]">
                      <motion.div
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Lock size={12} className="text-[#d4af37]" />
                      </motion.div>
                      <p className="text-[9px] font-mono font-bold text-neutral-400 tracking-widest uppercase">
                        Criptografado <span className="text-[#d4af37]">via AmploPay</span>
                      </p>
                    </div>
                  </form>
                ) : pixData ? (
                  <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="relative p-2 bg-white rounded-xl shadow-2xl ring-4 ring-[#d4af37]/30">
                      <Image
                        src={pixData.qrCode}
                        alt="QR Code PIX"
                        width={220}
                        height={220}
                        className="rounded-lg"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
                    </div>

                    <div className="w-full space-y-3">
                      <p className="text-sm font-medium text-center text-neutral-300">
                        Escaneie o QR Code ou copie a chave
                      </p>
                      
                      <button
                        onClick={handleCopy}
                        className="group relative w-full flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:border-[#d4af37]/80 rounded-xl py-4 px-4 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/10 to-[#d4af37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="truncate text-sm font-mono text-neutral-300 group-hover:text-white transition-colors">
                          {pixData.copyPaste}
                        </span>
                        <div className="shrink-0 ml-2 p-2 rounded-lg bg-[#222] group-hover:bg-[#d4af37]/20 text-neutral-400 group-hover:text-[#d4af37] transition-colors">
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </div>
                      </button>
                    </div>

                    <div className="w-full flex items-center justify-center gap-2 pt-4 border-t border-[#333] text-xs font-medium text-neutral-400">
                      <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                      Aguardando pagamento...
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-neutral-400">
                    Erro ao carregar PIX. Recarregue a página.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
