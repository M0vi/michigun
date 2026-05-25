'use client'
import { useState, useEffect } from 'react'
import { playSound } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, LayoutGroup } from 'framer-motion'
import { Star, Home, Users } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Início', href: '/' },
  { id: 'team', label: 'Equipe', href: '/equipe' },
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

  // Simple active state logic
  const selected = pathname === '/premium' ? 'premium' : pathname === '/equipe' ? 'team' : 'home'

  return (
    <nav
      aria-label="Navigation"
      className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-12 flex items-center justify-center transition-all duration-300 ${
        scrolled ? 'pt-5 pb-4 md:pt-6 md:pb-4' : 'pt-8 pb-4 md:pt-10 md:pb-6 bg-transparent'
      }`}
    >
      <div className={`flex items-center gap-1 sm:gap-2 md:gap-3 p-1.5 sm:p-2 rounded-2xl border transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050505]/80 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
          : 'bg-[#111111]/40 backdrop-blur-sm border-white/5'
      }`}>
        <LayoutGroup>
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
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-[#5865F2] hover:bg-[#4752c4] text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] rounded-xl relative flex items-center justify-center gap-1.5 md:gap-2 group text-[10px] sm:text-[11px] md:text-[15px] font-sans font-bold uppercase tracking-[0.05em] md:tracking-[0.08em] shadow-[0_0_15px_rgba(88,101,242,0.25)] hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]"
                  title={tab.label}
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  <span className="relative z-10 hidden xs:inline-block">Discord</span>
                </a>
              )
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => playSound('click')}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-[10px] sm:text-[11px] md:text-[15px] font-sans font-bold uppercase tracking-[0.05em] md:tracking-[0.08em] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] rounded-xl relative flex items-center justify-center gap-1.5 md:gap-2 group ${
                  isPremiumTab 
                    ? 'text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]' 
                    : isSelected
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                }`}
                title={tab.label}
              >
                {isPremiumTab && <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] fill-[#FFD700] text-[#FFD700] transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] ${isSelected ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />}
                {tab.id === 'home' && <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />}
                {tab.id === 'team' && <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />}
                
                <span className="relative z-10">{tab.label}</span>
                
                {isSelected && (
                  <motion.span
                    layoutId="active-nav-tab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 z-0 rounded-xl border ${
                      isPremiumTab
                        ? 'bg-gradient-to-r from-[#FFD700]/15 to-[#FFD700]/5 border-[#FFD700]/40 shadow-[0_0_20px_rgba(255,215,0,0.25)]'
                        : 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.12)]'
                    }`}
                  />
                )}
              </Link>
            )
          })}
        </LayoutGroup>
      </div>
    </nav>
  )
}