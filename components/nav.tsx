'use client'
import { useState, useEffect } from 'react'
import { playSound } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Crown, Home } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Início', href: '/' },
  { id: 'premium', label: 'Premium', href: '/premium' },
  { id: 'discord', label: 'Discord', href: 'https://discord.gg/pWeJUBabvF', isExternal: true }
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const selected = pathname === '/premium' ? 'premium' : 'home'

  return (
    <nav
      aria-label="Navigation"
      className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-6 flex items-center justify-center transition-all duration-300 ${
        scrolled ? 'py-4' : 'bg-transparent'
      }`}
    >
      <div className={`flex items-center gap-1.5 md:gap-2 p-1.5 rounded-full border transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050505]/80 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
          : 'bg-[#111111]/40 backdrop-blur-sm border-white/5'
      }`}>
        {tabs.map((tab) => {
          const isSelected = selected === tab.id
          const isPremiumTab = tab.id === 'premium'
          
          if (tab.isExternal) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound('click')}
                className="px-4 py-2.5 md:px-5 md:py-3 bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white border border-[#5865F2]/30 hover:border-[#5865F2] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] rounded-full relative flex items-center justify-center gap-2 group text-[13px] md:text-[15px] font-sans font-semibold uppercase tracking-[0.08em] shadow-[0_0_15px_rgba(88,101,242,0.05)] hover:shadow-[0_0_20px_rgba(88,101,242,0.25)]"
                title={tab.label}
              >
                <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                <span className="relative z-10">Discord</span>
              </a>
            )
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => playSound('click')}
              className={`px-4 py-2.5 md:px-5 md:py-3 text-[13px] md:text-[15px] font-sans font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] rounded-full relative flex items-center justify-center gap-2 group ${
                isSelected
                  ? isPremiumTab
                    ? 'text-[#d4af37]'
                    : 'text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={tab.label}
            >
              {isPremiumTab && <Crown className={`w-4 h-4 md:w-[18px] md:h-[18px] transition-transform duration-300 ${isSelected ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />}
              {tab.id === 'home' && <Home className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
              <span className="relative z-10">{tab.label}</span>
              
              {isSelected && (
                <motion.span
                  layoutId="active-nav-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className={`absolute inset-0 z-0 rounded-full border ${
                    isPremiumTab
                      ? 'bg-gradient-to-r from-[#d4af37]/15 to-[#b5952f]/15 border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                      : 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.12)]'
                  }`}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}