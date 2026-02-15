'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { StatsData } from '@/lib/types'

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const duration = 1500
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end])

  return <>{count.toLocaleString()}</>
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setHours(24, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      
      setTimeLeft(`${h}h ${m}m`)
    }
    const timer = setInterval(tick, 60000)
    tick()
    return () => clearInterval(timer)
  }, [])

  return <span className="text-[10px] text-zinc-500 ml-2 font-mono">Reset: {timeLeft}</span>
}

export default function StatsDeck() {
  const { data } = useSWR<StatsData>('/api/stats', fetcher, { refreshInterval: 10000 })

  return (
    <div className="flex items-center gap-6 px-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
          <span className="text-[10px] font-bold text-green-400 tracking-widest">TOTAL</span>
        </div>
        <div className="font-mono text-xl font-bold leading-none text-white">
          {data ? <CountUp end={data.executions} /> : '---'}
        </div>
      </div>
      <div className="w-px h-8 bg-white/10" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-pulse" />
          <span className="text-[10px] font-bold text-yellow-400 tracking-widest">HOJE</span>
          <Countdown />
        </div>
        <div className="font-mono text-xl font-bold leading-none text-white">
          {data ? <CountUp end={data.daily} /> : '---'}
        </div>
      </div>
    </div>
  )
}