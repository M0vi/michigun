'use client'
import { useState, useEffect } from 'react'
import { Menu, X, Terminal, Gamepad2, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'SCRIPT', id: 'script' },
  { label: 'MAPAS', id: 'arenas' },
  { label: 'EQUIPE', id: 'equipe' },
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileMenuOpen(false)
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)
    onResize()
    onScroll()
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const targets = NAV_ITEMS.map(l => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      entries => {
        const hit = entries.find(e => e.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    targets.forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    playSound('click')
    setMobileMenuOpen(false)
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    document.getElementById(id)?.scrollIntoView({ behavior: behavior as ScrollBehavior })
  }

  return (
    <>
      {/* Top Navigation */}
      <nav
        aria-label="Navigation"
        className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-6 flex items-center justify-center text-sm font-medium tracking-tight transition-all duration-300 ${
          scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent'
        }`}
      >
        {/* Desktop Menu */}
        {!isMobile && (
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-8 text-[#888888]">
              {NAV_ITEMS.map(item => {
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    aria-label={`Go to ${item.label}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`hover:text-white transition-colors text-[10px] font-mono font-bold uppercase tracking-[0.2em] relative py-1 ${
                      isActive ? 'text-white' : ''
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B50]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            
            <a
              href="https://discord.gg/pWeJUBabvF"
              target="_blank"
              rel="noreferrer"
              onClick={() => playSound('click')}
              className="p-2 bg-transparent hover:bg-white text-[#888888] hover:text-black border border-white/10 hover:border-white rounded-none transition-all duration-300 flex items-center justify-center"
              title="Discord"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
          </div>
        )}

        {/* Mobile Menu Trigger */}
        {isMobile && (
          <button
            onClick={() => {
              playSound('click')
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            className="p-2 text-white hover:text-[#FF6B50] transition-colors absolute right-6 md:right-12"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </nav>



      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-[#050505] pt-28 px-6 flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = active === item.id
                return (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`text-left text-2xl font-mono font-black tracking-tight uppercase transition-colors py-2 border-b border-white/5 ${
                      isActive ? 'text-[#FF6B50]' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              <a
                href="https://discord.gg/pWeJUBabvF"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  playSound('click')
                  setMobileMenuOpen(false)
                }}
                className="w-14 h-14 mx-auto bg-white text-black border border-white font-bold rounded-none flex items-center justify-center gap-2 hover:bg-[#e2e2e2] transition-colors"
                title="Discord"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}