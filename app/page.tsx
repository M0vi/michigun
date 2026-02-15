'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import { Copy, Check, Download, Key, MonitorPlay, AlertTriangle } from 'lucide-react'
import { CONFIG } from '@/lib/constants'
import { playSound, fetcher } from '@/lib/utils'
import TeamSection from '@/components/TeamSection'
import StatsDeck from '@/components/StatsDeck'
import FeatureSection from '@/components/FeatureSection'

const CodeBlock = ({ code }: { code: string }) => (
  <pre className="font-mono text-xs text-zinc-500 whitespace-pre-wrap break-all select-none">
    <span className="text-zinc-400">loadstring</span>(
    <span className="text-zinc-300">game</span>:
    <span className="text-zinc-300">HttpGet</span>(
    <span className="text-zinc-500">"{code.match(/"([^"]+)"/)?.[1]}"</span>
    ))()
  </pre>
)

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [videoActive, setVideoActive] = useState(false)
  
  const infiniteGames = [...CONFIG.games, ...CONFIG.games, ...CONFIG.games, ...CONFIG.games]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault()
      }
    }
    
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  const { data: versionCheck } = useSWR('/api/version', fetcher, { refreshInterval: 60000 })

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
    <main className="w-full max-w-[680px] p-6 flex flex-col gap-10 relative z-10 select-none">
      
      <TeamSection />

      <div className="relative flex flex-col gap-6">
        {/* Glow de fundo sutil em branco para o estilo Noir */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter cursor-default">
            MICHIGUN<span className="text-zinc-600">.XYZ</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto pointer-events-none font-medium">
             michigun.xyz
          </p>
        </div>

        <div className="glass-panel p-2 rounded-2xl shadow-2xl overflow-hidden group">
          <div 
            className="relative aspect-video bg-black rounded-xl overflow-hidden cursor-pointer border border-white/10"
            onClick={() => { setVideoActive(true); playSound('click'); }}
          >
            {!videoActive ? (
              <div className="w-full h-full relative group/video">
                <Image 
                  src={`https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg`} 
                  alt="Thumbnail" 
                  fill 
                  className="object-cover opacity-60 group-hover/video:opacity-100 group-hover/video:scale-105 transition-all duration-700 pointer-events-none grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-lg group-hover/video:scale-110 group-hover/video:bg-white group-hover/video:border-white transition-all duration-300">
                    <MonitorPlay className="fill-white text-white group-hover/video:fill-black group-hover/video:text-black ml-1 transition-colors" size={24} />
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

          <div className="mt-4 p-2 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/40 rounded-xl p-3 border border-white/5">
              <StatsDeck />
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none h-11 px-6 bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-300 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  {copied ? <Check size={18} className="text-black" /> : <Copy size={18} className="group-hover/btn:rotate-12 transition-transform" />}
                  {copied ? 'COPIADO' : 'COPIAR'}
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowDownload(!showDownload)}
                    className="h-11 w-11 bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-white hover:text-black active:scale-95 transition-all text-white border border-white/10"
                    aria-label="Download Options"
                  >
                    <Download size={18} />
                  </button>
                  
                  <AnimatePresence>
                    {showDownload && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowDownload(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full right-0 mb-2 w-32 bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                        >
                          <button onClick={() => handleDownload('txt')} className="px-4 py-3 text-xs text-left hover:bg-white hover:text-black text-zinc-400 transition-colors">Arquivo .txt</button>
                          <button onClick={() => handleDownload('lua')} className="px-4 py-3 text-xs text-left hover:bg-white hover:text-black text-zinc-400 transition-colors border-t border-white/10">Arquivo .lua</button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="bg-black rounded-xl border border-white/10 overflow-hidden font-mono text-xs">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                </div>
                <span className="text-zinc-500 ml-2">michigun.lua</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <CodeBlock code={CONFIG.script} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900/30 border border-white/5 text-xs font-bold text-zinc-500 hover:bg-white hover:text-black transition-all group">
                 <Key size={14} className="group-hover:text-black transition-colors" />
                 {CONFIG.keySystemText}
               </button>
               <a 
                 href={CONFIG.discordLink} 
                 target="_blank" 
                 className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white hover:text-black transition-all"
               >
                 Suporte
               </a>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-hidden w-full">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-zinc-500">Jogos suportados</h3>
          <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-bold border border-white/10">
            {CONFIG.games.length} ATIVOS
          </span>
        </div>
        
        <div className="relative w-full overflow-hidden">
           <div className="flex gap-3 w-max animate-scroll">
              {infiniteGames.map((game, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 bg-zinc-900 border border-white/5 pl-2 pr-4 py-2 rounded-full whitespace-nowrap hover:border-white transition-colors select-none"
                >
                  <Image 
                    src={game.icon} 
                    alt={game.name} 
                    width={24} 
                    height={24} 
                    className="rounded-full bg-black pointer-events-none grayscale"
                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Game&background=111&color=fff' }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">{game.name}</span>
                    <span className="text-[10px] text-zinc-500 font-bold leading-none mt-0.5 uppercase">Undetected</span>
                  </div>
                </div>
              ))}
           </div>
           {/* Fade suave nas laterais do carrossel */}
           <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>
      </div>

      <FeatureSection />

      <footer className="text-center pb-8 space-y-2">
        <p className="text-xs font-bold text-zinc-700">© 2026 Michigun Team</p>
        <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-800">
           <AlertTriangle size={10} />
           <span>Uso restrito para fins educacionais.</span>
        </div>
      </footer>
      
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl z-[100] flex items-center gap-2 pointer-events-none"
          >
            <Check size={16} className="text-black" />
            Copiado!
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
