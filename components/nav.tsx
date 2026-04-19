'use client'
import { useState, useEffect } from 'react'

const PALETTE = {
  bg:    'rgba(5,5,5,0.92)',
  rim:   'rgba(255,255,255,0.07)',
  faint: 'rgba(160,160,160,0.38)',
  snow:  '#f0f0f0',
}

const NAV_ITEMS = [
  { label: 'script', id: 'script' },
  { label: 'mapas',  id: 'arenas' },
  { label: 'equipe', id: 'equipe' },
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
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
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    document.getElementById(id)?.scrollIntoView({ behavior: behavior as ScrollBehavior })
  }

  if (!shown) return null

  return (
    <nav
      aria-label="Navegação"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: 2,
        padding: '4px',
        background: PALETTE.bg,
        border: `1px solid ${PALETTE.rim}`,
        borderRadius: 999,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        opacity: shown ? 1 : 0,
        transition: 'opacity .2s',
      }}>
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            aria-label={`Ir para ${item.label}`}
            aria-current={isActive ? 'location' : undefined}
            style={{
              padding: '5px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              transition: 'all .15s',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: isActive ? PALETTE.snow : PALETTE.faint,
            }}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}