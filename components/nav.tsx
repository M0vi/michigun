'use client'
import { useState, useEffect } from 'react'

const C = {
  bg:     'rgba(6,6,6,0.85)',
  border: 'rgba(255,255,255,0.07)',
  textD:  'rgba(184,184,184,0.45)',
  white:  '#efefef',
}

const LINKS = [
  { label: 'script', id: 'script' },
  { label: 'mapas',  id: 'mapas'  },
  { label: 'equipe', id: 'equipe' },
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const targets = LINKS.map(l => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    targets.forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  const scroll = (id: string) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    document.getElementById(id)?.scrollIntoView({ behavior: behavior as ScrollBehavior })
  }

  if (!visible) return null

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
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 999,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity .2s',
      }}>
      {LINKS.map(l => {
        const isActive = active === l.id
        return (
          <button
            key={l.id}
            onClick={() => scroll(l.id)}
            aria-label={`Ir para ${l.label}`}
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
              color: isActive ? C.white : C.textD,
            }}
          >
            {l.label}
          </button>
        )
      })}
    </nav>
  )
}