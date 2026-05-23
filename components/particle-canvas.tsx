'use client'
import React, { useEffect, useRef } from 'react'

interface ParticleBeam {
  x: number;
  y: number;
  w: number;
  len: number;
  angle: number;
  speed: number;
  op: number;
  pulse: number;
  ps: number;
}
interface ParticleBeamGrad extends ParticleBeam { 
  grad?: CanvasGradient 
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamList = useRef<ParticleBeamGrad[]>([])
  const rafId = useRef(0)
  const noMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); if (!ctx) { cv.style.display = 'none'; return }
    if (noMotion.current) { cv.style.display = 'none'; return }

    const mob = innerWidth < 768
    const TOTAL = mob ? 6 : 18
    const BLUR = mob ? 0 : 28
    const DPR = mob ? 1 : Math.min((typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1) || 1, 2)

    const spawn = (): ParticleBeamGrad => ({
      x: Math.random() * innerWidth * 1.5 - innerWidth * .25,
      y: Math.random() * innerHeight * 1.5 - innerHeight * .25,
      w: mob ? 30 + Math.random() * 40 : 20 + Math.random() * 45,
      len: innerHeight * 2.5,
      angle: -35 + Math.random() * 10,
      speed: mob ? .2 + Math.random() * .3 : .35 + Math.random() * .7,
      op: mob ? .04 + Math.random() * .06 : .03 + Math.random() * .06,
      pulse: Math.random() * Math.PI * 2,
      ps: mob ? .008 : .012 + Math.random() * .02,
      grad: undefined,
    })

    const bakeGrad = (b: ParticleBeamGrad) => {
      const g = ctx.createLinearGradient(0, 0, 0, b.len)
      g.addColorStop(0, `rgba(255,255,255,0)`)
      g.addColorStop(.15, `rgba(255,255,255,${b.op * .5})`)
      g.addColorStop(.5, `rgba(255,255,255,${b.op})`)
      g.addColorStop(.85, `rgba(255,255,255,${b.op * .5})`)
      g.addColorStop(1, `rgba(255,255,255,0)`)
      b.grad = g
    }

    const onResize = () => {
      cv.width = innerWidth * DPR; cv.height = innerHeight * DPR
      cv.style.width = `${innerWidth}px`; cv.style.height = `${innerHeight}px`
      ctx.scale(DPR, DPR)
      beamList.current = Array.from({ length: TOTAL }, () => { const b = spawn(); bakeGrad(b); return b })
    }

    const recycle = (b: ParticleBeamGrad, i: number) => {
      const seg = innerWidth / 3; b.y = innerHeight + 100
      b.x = (i % 3) * seg + seg / 2 + (Math.random() - .5) * seg * .5
      b.w = mob ? 40 + Math.random() * 50 : 50 + Math.random() * 60
      b.speed = mob ? .18 + Math.random() * .25 : .3 + Math.random() * .4
      b.op = mob ? .035 + Math.random() * .05 : .025 + Math.random() * .05
      bakeGrad(b)
    }

    const paint = (b: ParticleBeamGrad) => {
      if (!b.grad) return
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.angle * Math.PI / 180)
      ctx.globalAlpha = 0.8 + Math.sin(b.pulse) * .2
      ctx.fillStyle = b.grad; ctx.fillRect(-b.w / 2, 0, b.w, b.len)
      ctx.globalAlpha = 1; ctx.restore()
    }

    let lastTs = 0
    const FPS = mob ? 30 : 60
    const STEP = 1000 / FPS

    const loop = (ts: number) => {
      rafId.current = requestAnimationFrame(loop)
      if (ts - lastTs < STEP) return
      lastTs = ts
      ctx.clearRect(0, 0, cv.width, cv.height)
      if (BLUR > 0) ctx.filter = `blur(${BLUR}px)`
      beamList.current.forEach((b, i) => {
        b.y -= b.speed; b.pulse += b.ps
        if (b.y + b.len < -100) recycle(b, i)
        paint(b)
      })
      if (BLUR > 0) ctx.filter = 'none'
    }

    onResize(); addEventListener('resize', onResize); rafId.current = requestAnimationFrame(loop)
    return () => { removeEventListener('resize', onResize); cancelAnimationFrame(rafId.current) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: .55, willChange: 'transform' }} />
}
