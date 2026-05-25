'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

import SectionErrorBoundary from '@/components/section-error-boundary'
import { HeroSection } from '@/components/hero-section'
import { ScriptPanel } from '@/components/script-panel'
import { ArenasSection } from '@/components/arenas-section'
import { InteractiveBackground } from '@/components/interactive-background'
import { RiskTag } from '@/components/ui-components'
import { Ability } from '@/lib/data'

export default function Root() {
  const [focusedAbility, setFocusedAbility] = useState<Ability | null>(null)

  useEffect(() => {
    if (!focusedAbility) {
      document.body.style.overflow = 'auto'
      return
    }
    
    document.body.style.overflow = 'hidden' // Focus trap / scroll lock

    const onKey = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') setFocusedAbility(null) 
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('keydown', onKey)
    }
  }, [focusedAbility])

  return (
    <div className="font-display text-[#ebebeb] selection-coral relative min-h-screen bg-[#050505] overflow-x-hidden">
      <div className="noise-overlay" />
      <InteractiveBackground />
      
      <div className="max-w-[1440px] mx-auto w-full relative flex flex-col items-center px-4 sm:px-6 md:px-8">
        
        <main className="flex flex-col items-center w-full relative z-10 gap-16 pb-16 pt-24 md:pt-32">
          <HeroSection />
          
          <div className="w-full flex flex-col items-center">
            <SectionErrorBoundary label="ScriptPanel">
              <ScriptPanel />
            </SectionErrorBoundary>
          </div>
          
          <div className="w-full flex flex-col items-center">
            <SectionErrorBoundary label="ArenasSection">
              <ArenasSection onAbilityClick={setFocusedAbility} />
            </SectionErrorBoundary>
          </div>
        </main>

        <footer className="py-12 border-t border-white/5 w-full flex items-center justify-center relative z-10 bg-transparent mt-12">
          <span className="text-[10px] text-[#444444] font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} michigun.xyz
          </span>
        </footer>
      </div>

      <AnimatePresence>
        {focusedAbility && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            onClick={() => setFocusedAbility(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40, rotateX: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40, rotateX: -15 }} 
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-xl p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <button
                onClick={() => setFocusedAbility(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#888888] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
              
              <div className="mb-4">
                <RiskTag risk={focusedAbility.risk}/>
              </div>
              <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">
                {focusedAbility.name}
              </h3>
              <p className="text-sm font-medium text-[#a1a1a1] leading-relaxed">
                {focusedAbility.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}