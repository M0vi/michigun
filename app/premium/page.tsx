'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import ParticleCanvas from '@/components/particle-canvas'
import { ArrowLeft, Check, Copy, QrCode, Sparkles, Loader2, User, Mail, CreditCard } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

const PALETTE = {
  bg: '#050505',
  surface: 'rgba(255,255,255,0.025)',
  rim: 'rgba(255,255,255,0.06)',
  rimHot: 'rgba(255,255,255,0.11)',
  muted: '#a0a0a0',
  faint: 'rgba(160,160,160,0.38)',
  ghost: 'rgba(160,160,160,0.16)',
  snow: '#f0f0f0',
  accent: '#10b981',
}

export default function PremiumPage() {
  const [formData, setFormData] = useState({ discord: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<{ brCode: string; brCodeBase64: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/premium/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar PIX')
      }

      setPixData(data.data)
      toast.success('PIX gerado com sucesso!', {
        style: { background: 'rgba(10,10,10,0.95)', color: '#86efac', border: '1px solid rgba(134,239,172,0.2)' },
        iconTheme: { primary: '#86efac', secondary: 'rgba(10,10,10,0.95)' }
      })
    } catch (err: any) {
      toast.error(err.message, {
        style: { background: 'rgba(10,10,10,0.95)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' },
        iconTheme: { primary: '#f87171', secondary: 'rgba(10,10,10,0.95)' }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!pixData) return
    navigator.clipboard.writeText(pixData.brCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Código copiado!', {
      style: { background: 'rgba(10,10,10,0.95)', color: '#86efac', border: '1px solid rgba(134,239,172,0.2)', fontSize: '13px' },
      iconTheme: { primary: '#86efac', secondary: 'rgba(10,10,10,0.95)' }
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: PALETTE.bg, width: '100%' }}>
      <Toaster position="bottom-center" />
      <ParticleCanvas />
      
      {/* Background elements */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '120%', height: '120%', 
        background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <header style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: PALETTE.faint, textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color .2s' }}
          onMouseEnter={e => e.currentTarget.style.color = PALETTE.snow}
          onMouseLeave={e => e.currentTarget.style.color = PALETTE.faint}>
          <ArrowLeft size={14} />
          Voltar para Home
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: 16 }}>
                <Sparkles size={20} style={{ color: PALETTE.accent }} />
              </div>
              <h1 className="font-display" style={{ fontSize: 32, fontWeight: 800, color: PALETTE.snow, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 8 }}>
                michigun <span style={{ color: PALETTE.accent }}>Premium</span>
              </h1>
              <p style={{ color: PALETTE.faint, fontSize: 14, lineHeight: 1.6 }}>
                Preencha os dados abaixo para gerar seu PIX. O acesso será liberado automaticamente após o pagamento.
              </p>
            </div>

            <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.rim}`, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,rgba(16, 185, 129, 0.3),transparent)` }} />
              
              <AnimatePresence mode="wait">
                {!pixData ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit} style={{ padding: '28px 24px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: PALETTE.muted, marginBottom: 6 }}>Usuário do Discord</label>
                        <div style={{ position: 'relative' }}>
                          <User size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: PALETTE.faint }} />
                          <input 
                            required
                            type="text" 
                            placeholder="ex: michigun123"
                            value={formData.discord}
                            onChange={e => setFormData({ ...formData, discord: e.target.value })}
                            style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${PALETTE.rim}`, borderRadius: 10, color: PALETTE.snow, fontSize: 14, outline: 'none', transition: 'border-color .2s' }}
                            onFocus={e => e.currentTarget.style.borderColor = PALETTE.rimHot}
                            onBlur={e => e.currentTarget.style.borderColor = PALETTE.rim}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: PALETTE.muted, marginBottom: 6 }}>E-mail</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: PALETTE.faint }} />
                          <input 
                            required
                            type="email" 
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${PALETTE.rim}`, borderRadius: 10, color: PALETTE.snow, fontSize: 14, outline: 'none', transition: 'border-color .2s' }}
                            onFocus={e => e.currentTarget.style.borderColor = PALETTE.rimHot}
                            onBlur={e => e.currentTarget.style.borderColor = PALETTE.rim}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${PALETTE.rim}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 11, color: PALETTE.faint }}>Total a pagar</span>
                        <span style={{ fontSize: 20, fontWeight: 700, color: PALETTE.snow }}>R$ 19,90</span>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all .2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                        Gerar PIX
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="pix"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                    style={{ padding: '32px 24px', textAlign: 'center' }}>
                    
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: PALETTE.snow, marginBottom: 8 }}>Pagamento Pendente</h3>
                    <p style={{ fontSize: 13, color: PALETTE.faint, marginBottom: 24, lineHeight: 1.5 }}>
                      Escaneie o QR Code abaixo com o aplicativo do seu banco ou copie o código PIX para finalizar a compra.
                    </p>

                    <div style={{ background: '#fff', padding: 16, borderRadius: 16, display: 'inline-block', marginBottom: 24, border: `2px solid ${PALETTE.accent}` }}>
                      <img src={pixData.brCodeBase64} alt="QR Code PIX" style={{ width: 200, height: 200, display: 'block' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <input 
                        readOnly
                        value={pixData.brCode}
                        style={{ flex: 1, padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${PALETTE.rim}`, borderRadius: 10, color: PALETTE.snow, fontSize: 12, outline: 'none', textOverflow: 'ellipsis' }}
                      />
                      <button onClick={handleCopy}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 16px', borderRadius: 10, border: '1px solid', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', background: copied ? 'rgba(134,239,172,0.07)' : PALETTE.surface, borderColor: copied ? 'rgba(134,239,172,0.22)' : PALETTE.rim, color: copied ? '#86efac' : PALETTE.snow, flexShrink: 0 }}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>

                    <p style={{ marginTop: 24, fontSize: 12, color: PALETTE.faint }}>
                      Assim que o pagamento for confirmado, você receberá as instruções de acesso.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: PALETTE.ghost }}>Pagamento seguro via</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: PALETTE.faint }}>AbacatePay</span>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  )
}
