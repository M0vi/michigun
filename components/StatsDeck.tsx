'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { StatsData } from '@/lib/types'
import { Activity, Clock, BarChart3 } from 'lucide-react'

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

  return <span>{timeLeft}</span>
}

export default function StatsDeck() {
  const { data } = useSWR<StatsData>('/api/stats', fetcher, { refreshInterval: 10000 })

  return (
    <div className="grid grid-cols-3 divide-x divide-white/10 w-full">
      <div className="flex flex-col items-center justify-center py-1 px-2">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
        </div>
        <span className="font-mono text-sm font-bold text-white">
          {data ? <CountUp end={data.executions} /> : '...'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-1 px-2">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hoje</span>
        </div>
        <span className="font-mono text-sm font-bold text-white">
          {data ? <CountUp end={data.daily} /> : '...'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-1 px-2">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reseta em</span>
        </div>
        <span className="font-mono text-sm font-bold text-white">
          <Countdown />
        </span>
      </div>
    </div>
  )
}