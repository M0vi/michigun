'use client'
import React from 'react'
import Nav from '@/components/nav'
import { CrewSection } from '@/components/crew-section'
import { InteractiveBackground } from '@/components/interactive-background'

export default function EquipePage() {
  return (
    <div className="font-display text-[#ebebeb] selection-coral relative min-h-screen bg-[#050505] overflow-x-hidden">
      <div className="noise-overlay" />
      <InteractiveBackground />
      
      <div className="max-w-[1440px] mx-auto w-full relative flex flex-col items-center px-4 sm:px-6 md:px-8">
        <Nav />
        
        <main className="flex flex-col items-center w-full relative z-10 pt-24 pb-16">
          <CrewSection />
        </main>

        <footer className="py-12 border-t border-white/5 w-full flex items-center justify-center relative z-10 bg-transparent mt-12">
          <span className="text-[10px] text-[#444444] font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} michigun.xyz
          </span>
        </footer>
      </div>
    </div>
  )
}
