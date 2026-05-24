'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Cursor coordinates
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Fast spring configuration to smooth pixel-stepping and jitter
  const springConfig = { damping: 35, stiffness: 600, mass: 0.2 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Detect if device has a precise pointer (PC/Mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setIsMobile(!isFinePointer)
    if (!isFinePointer) return

    const moveCursor = (e: MouseEvent) => {
      // 8px width/height -> offset by 4px to center
      cursorX.set(e.clientX - 4)
      cursorY.set(e.clientY - 4)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.cursor-pointer') ||
        target.onclick
      
      setIsHovered(!!isClickable)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    // Hide default cursor globally for PC
    const style = document.createElement('style')
    style.id = 'custom-cursor-hide-css'
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, [role="button"], select, input, textarea, .cursor-pointer {
          cursor: none !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      const injectedStyle = document.getElementById('custom-cursor-hide-css')
      if (injectedStyle) {
        injectedStyle.remove()
      }
    }
  }, [cursorX, cursorY])

  if (isMobile) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[99999] border border-black/25 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        scale: isHovered ? 2 : 1,
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.95)',
        boxShadow: isHovered 
          ? '0 0 12px rgba(255, 255, 255, 1)' 
          : '0 0 8px rgba(255, 255, 255, 0.8)',
      }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
    />
  )
}
