'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    if (window.innerWidth < 768) return

    const lenis = new Lenis({
      duration: 1.5, // Scroll suave um pouco mais lento e elegante
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Efeito de inércia elástica premium
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
