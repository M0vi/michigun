'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import { 
  Copy, Check, Download, MonitorPlay, Terminal, FileCode, 
  FileText, AlertTriangle, Search, X, Activity, Clock, 
  BarChart3, Music, Code, Gamepad2, Moon, Circle 
} from 'lucide-react'

import { CONFIG } from '@/lib/constants'
import { playSound, fetcher, cn } from '@/lib/utils'

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --bg-color: #000000;
      --surface-color: #09090b;
      --border-color: rgba(255, 255, 255, 0.08);
    }
    
    body {
      background-color: var(--bg-color);
      color: #ffffff;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 40px 40px, 40px 40px;
      background-attachment: fixed;
      user-select: none;
      -webkit-user-select: none;
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #52525b; }

    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
    
    .animate-marquee:hover {
      animation-play-state: paused;
    }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .fade-edges {
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }
  `}</style>
)

const CodeDisplay = ({ code }: { code: string }) => {
  const match = code.match(/"([^"]+)"/);
  const codeContent = match ? match[1] : 'URL_DO_SCRIPT';

  return (
    <div className="font-mono text-[11px] sm:text-xs whitespace-pre-wrap break-all select-none leading-relaxed">
      <span className="text-pink-500">loadstring</span>(
      <span className="text-blue-400">game</span>:
      <span className="text-blue-400">HttpGet</span>(
      <span className="text-green-400">"{codeContent}"</span>
      ))()
    </div>
  )
}

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

function StatsDeck() {
  const { data } = useSWR('/api/stats', fetcher, { refreshInterval: 10000 })

  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      <div className="flex flex-col items-start justify-center p-4 bg-[#0a0a0a] border border-white/5 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-zinc-500">
          <Activity size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
        </div>
        <span className="font-mono text-xl font-medium text-white tracking-tight">
          {data ? <CountUp end={data.executions} /> : '---'}
        </span>
      </div>

      <div className="flex flex-col items-start justify-center p-4 bg-[#0a0a0a] border border-white/5 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-zinc-500">
          <BarChart3 size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Hoje</span>
        </div>
        <span className="font-mono text-xl font-medium text-white tracking-tight">
          {data ? <CountUp end={data.daily} /> : '---'}
        </span>
      </div>

      <div className="flex flex-col items-start justify-center p-4 bg-[#0a0a0a] border border-white/5 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-zinc-500">
          <Clock size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Reseta em</span>
        </div>
        <span className="font-mono text-xl font-medium text-white tracking-tight">
          <Countdown />
        </span>
      </div>
    </div>
  )
}

function TeamCard({ dev }: { dev: { id: string; role: string } }) {
  const { data } = useSWR(
    `https://api.lanyard.rest/v1/users/${dev.id}`,
    fetcher,
    { refreshInterval: 5000 }
  )

  const user = data?.success ? data.data : null
  const spotify = user?.listening_to_spotify && user.spotify
  const activity = user?.activities?.find((a: any) => a.type !== 4 && a.name !== 'Spotify')

  let statusText = 'Offline'
  let Icon = Circle
  let iconClass = 'text-zinc-600'

  if (spotify) {
    statusText = user.spotify.song
    Icon = Music
    iconClass = 'text-white animate-pulse'
  } else if (activity) {
    statusText = activity.name
    if (activity.name === 'Visual Studio Code' || activity.name === 'Code') {
      Icon = Code
      statusText = 'Codando'
    } else {
      Icon = Gamepad2
    }
    iconClass = 'text-white'
  } else {
    switch (user?.discord_status) {
      case 'online': statusText = 'Online'; iconClass = 'text-green-500'; break;
      case 'idle': statusText = 'Ausente'; Icon = Moon; iconClass = 'text-amber-500'; break;
      case 'dnd': statusText = 'Ocupado'; iconClass = 'text-red-500'; break;
    }
  }

  const avatarUrl = user?.discord_user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${dev.id}/${user.discord_user.avatar}.png`
    : `https://ui-avatars.com/api/?name=Dev&background=111&color=fff`

  return (
    <div 
      className="flex items-center gap-4 p-3 bg-transparent border border-transparent hover:bg-[#0a0a0a] hover:border-white/10 rounded-xl transition-all group"
      onMouseEnter={() => playSound('hover')}
    >
      <Image
        src={avatarUrl}
        alt="Avatar"
        width={38}
        height={38}
        className="rounded-full bg-zinc-900 border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-300"
        unoptimized
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center w-full mb-1">
           <span className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
             {user?.discord_user?.username || 'Carregando...'}
           </span>
           <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{dev.role}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 truncate">
          <Icon size={10} className={iconClass} />
          <span className="truncate">{statusText}</span>
        </div>
      </div>
    </div>
  )
}

function TeamSection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">Sistemas / Equipe</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {CONFIG.devs.map(dev => <TeamCard key={dev.id} dev={dev} />)}
      </div>
    </div>
  )
}

function FeatureSection() {
  const [activeTab, setActiveTab] = useState('global')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; title: string; desc: string } | null>(null)

  const filteredFeatures = useMemo(() => {
    return CONFIG.features[activeTab].filter((f: any) => 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.desc.toLowerCase().includes(search.toLowerCase())
    )
  }, [activeTab, search])

  return (
    <section className="flex flex-col gap-6 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">Módulos</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
          <input 
            type="text" 
            placeholder="Buscar módulo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/5 pb-px">
        {Object.keys(CONFIG.features).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); playSound('click'); }}
            onMouseEnter={() => playSound('hover')}
            className={cn(
              "relative px-4 py-2 text-xs font-mono tracking-wider transition-colors",
              activeTab === tab ? "text-white" : "text-zinc-600 hover:text-zinc-300"
            )}
          >
            {activeTab === tab && (
              <motion.div 
                layoutId="tabLine"
                className="absolute bottom-0 left-0 right-0 h-px bg-white"
              />
            )}
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((item: any, idx: number) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              onClick={() => { setModal({ open: true, title: item.name, desc: item.desc }); playSound('click'); }}
              onMouseEnter={() => playSound('hover')}
              className="group bg-[#0a0a0a] border border-white/5 hover:border-white/15 rounded-xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[100px]"
            >
              <div className="flex justify-between items-start mb-4">
                <item.icon className="text-zinc-600 group-hover:text-white transition-colors" size={18} />
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  item.type === 'safe' ? "bg-green-500/50" : item.type === 'risk' ? "bg-red-500/50" : "bg-purple-500/50"
                )} />
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-300 group-hover:text-white transition-colors">
                  {item.name}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal?.open && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 rounded-xl p-6 shadow-2xl"
            >
              <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors">
                <X size={16} />
              </button>
              <h3 className="text-sm font-mono text-white mb-3">{modal.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{modal.desc}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [videoActive, setVideoActive] = useState(false)
  
  const infiniteGames = [...CONFIG.games, ...CONFIG.games, ...CONFIG.games, ...CONFIG.games]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault()
      }
    }
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  const handleCopy = () => {
    playSound('click')
    navigator.clipboard.writeText(CONFIG.script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (ext: 'txt' | 'lua') => {
    const element = document.createElement('a')
    const file = new Blob([CONFIG.script], { type: 'application/octet-stream' })
    element.href = URL.createObjectURL(file)
    element.download = `michigun.${ext}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setShowDownload(false)
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-6 md:p-10 flex flex-col gap-12 relative z-10 select-none">
      <GlobalStyles />
      
      <header className="flex flex-col gap-2 pt-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tighter cursor-default">
          michigun<span className="text-zinc-600">.xyz</span>
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm max-w-md pointer-events-none tracking-wide">
           O michigun.xyz foi desenvolvido por @fp3 e serve apenas para fins educacionais.
        </p>
      </header>

      <div className="bg-[#050505] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.02)] overflow-hidden flex flex-col">
        <div className="bg-[#0a0a0a] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          </div>
          <div className="text-[10px] text-zinc-600 font-mono tracking-[0.2em] uppercase">
            Terminal_Access
          </div>
          <div className="w-10" />
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 bg-[#0a0a0a] border border-white/5 rounded-xl p-2 relative group">
              <div 
                className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-pointer"
                onClick={() => { setVideoActive(true); playSound('click'); }}
              >
                {!videoActive ? (
                  <div className="w-full h-full relative">
                    <Image 
                      src={`https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg`} 
                      alt="Thumbnail" 
                      fill 
                      className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 pointer-events-none grayscale group-hover:grayscale-[50%]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:border-white transition-all duration-300">
                        <MonitorPlay className="text-white group-hover:text-black ml-1 transition-colors" size={20} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${CONFIG.videoId}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            <div className="md:col-span-2 h-full">
              <StatsDeck />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row items-stretch gap-3 group/code transition-colors hover:border-white/15">
            <div className="flex-1 bg-black border border-white/5 rounded-lg p-4 flex items-center overflow-hidden relative">
              <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
              <div className="pl-8 w-full overflow-x-auto scrollbar-hide">
                <CodeDisplay code={CONFIG.script} />
              </div>
            </div>

            <div className="flex gap-2 sm:w-auto w-full">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-6 bg-[#0a0a0a] border border-white/10 text-zinc-300 rounded-lg font-medium text-xs hover:text-white hover:bg-white/5 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <Check size={16} />
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <Copy size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDownload(!showDownload)}
                  className="h-full px-4 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/20 active:scale-95 transition-all"
                >
                  <Download size={16} />
                </button>

                <AnimatePresence>
                  {showDownload && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDownload(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full right-0 mb-3 w-40 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                      >
                        <div className="px-3 py-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest border-b border-white/5">
                          Formato
                        </div>
                        <button onClick={() => handleDownload('txt')} className="flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
                          <FileText size={14} className="text-zinc-500" />
                          Arquivo .txt
                        </button>
                        <button onClick={() => handleDownload('lua')} className="flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-white/5 text-zinc-300 hover:text-white transition-colors border-t border-white/5">
                          <FileCode size={14} className="text-zinc-500" />
                          Arquivo .lua
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">Sistemas suportados</h3>
          <span className="text-[9px] font-mono bg-white/5 text-zinc-300 px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
            {CONFIG.games.length} Ativos
          </span>
        </div>
        
        <div className="relative w-full overflow-hidden fade-edges py-2">
           <div className="flex gap-4 w-max animate-marquee">
              {infiniteGames.map((game: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-[#0a0a0a] border border-white/5 pl-2 pr-5 py-2 rounded-lg whitespace-nowrap opacity-60 hover:opacity-100 hover:border-white/20 transition-all select-none group">
                  {game.icon && !game.name.toLowerCase().includes('entre outros') && (
                    <Image src={game.icon} alt={game.name} width={20} height={20} className="rounded bg-zinc-900 pointer-events-none grayscale group-hover:grayscale-0 transition-all" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-200 group-hover:text-white leading-none">{game.name}</span>
                    <span className="text-[9px] text-zinc-600 font-mono leading-none mt-1 uppercase tracking-wider">Indetectado</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/5 my-2" />

      <TeamSection />

      <FeatureSection />

      <footer className="pt-12 pb-8 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 font-mono border border-white/5 bg-[#0a0a0a] px-4 py-2 rounded-full">
           <AlertTriangle size={12} className="text-zinc-500" />
           <span>Use com responsabilidade</span>
        </div>
        <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">© 2026 michigun.xyz</p>
      </footer>
    </main>
  )
}