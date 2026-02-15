'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Copy, Check, Download, MonitorPlay, Terminal, FileCode, FileText, AlertTriangle } from 'lucide-react'
import { CONFIG } from '@/lib/constants'
import { playSound } from '@/lib/utils'
import TeamSection from '@/components/TeamSection'
import StatsDeck from '@/components/StatsDeck'
import FeatureSection from '@/components/FeatureSection'

const CodeDisplay = ({ code }: { code: string }) => (
  <div className="font-mono text-xs whitespace-pre-wrap break-all select-none">
    <span className="text-zinc-500">loadstring</span>(
    <span className="text-zinc-300">game</span>:
    <span className="text-zinc-300">HttpGet</span>(
    <span className="text-zinc-500">"{code.match(/"([^"]+)"/)?.[1]}"</span>
    ))()
  </div>
)

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [videoActive, setVideoActive] = useState(false)
  
  const infiniteGames = [...CONFIG.games, ...CONFIG.games, ...CONFIG.games]

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
    <main className="w-full max-w-[680px] p-6 flex flex-col gap-10 relative z-10 select-none">
      <TeamSection />

      <div className="relative flex flex-col gap-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter cursor-default">
            michigun<span className="text-zinc-500">.xyz</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto pointer-events-none">
             script para jogos de Exército Brasileiro
          </p>
        </div>

        <div className="glass-panel p-1 rounded-2xl shadow-2xl overflow-hidden group border border-white/10 bg-black/40">
          <div 
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden cursor-pointer border border-white/5"
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
                  <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover/video:scale-110 group-hover/video:bg-white group-hover/video:border-white transition-all duration-300">
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

          <div className="mt-1 bg-[#050505] rounded-xl border border-white/5">
            <div className="border-b border-white/5 bg-white/[0.02] py-3">
               <StatsDeck />
            </div>

            <div className="p-3 flex items-stretch gap-3">
              <div className="flex-1 relative bg-black border border-white/10 rounded-lg p-3 flex items-center overflow-hidden group/code">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700">
                  <Terminal size={14} />
                </div>
                
                <div className="pl-6 w-full overflow-x-auto scrollbar-hide">
                  <CodeDisplay code={CONFIG.script} />
                </div>

                <div className="absolute inset-0 border border-white/0 group-hover/code:border-white/10 rounded-lg transition-colors pointer-events-none" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="h-full px-5 bg-white text-black rounded-lg font-bold text-xs hover:bg-zinc-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 min-w-[70px] group/copy shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Check size={18} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Copy size={18} className="group-hover/copy:rotate-12 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span>{copied ? 'OK' : 'COPIAR'}</span>
                </button>

                <div className="relative h-full">
                  <button
                    onClick={() => setShowDownload(!showDownload)}
                    className="h-full w-12 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/20 active:scale-95 transition-all"
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
                          className="absolute bottom-full right-0 mb-2 w-40 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                        >
                          <div className="px-3 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
                            Salvar como
                          </div>
                          <button onClick={() => handleDownload('txt')} className="flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-white/10 text-zinc-300 hover:text-white transition-colors group/dl">
                            <FileText size={14} className="text-zinc-500 group-hover/dl:text-white transition-colors" />
                            Arquivo .txt
                          </button>
                          <button onClick={() => handleDownload('lua')} className="flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-white/10 text-zinc-300 hover:text-white transition-colors border-t border-white/5 group/dl">
                            <FileCode size={14} className="text-zinc-500 group-hover/dl:text-white transition-colors" />
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
      </div>

      <div className="space-y-4 overflow-hidden w-full">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-zinc-400">Jogos suportados</h3>
          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
            {CONFIG.games.length} ATIVOS
          </span>
        </div>
        
        <div className="relative w-full overflow-hidden">
           <div className="flex gap-3 w-max animate-scroll">
              {infiniteGames.map((game, i) => (
                <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-white/5 pl-2 pr-4 py-2 rounded-full whitespace-nowrap hover:border-white transition-colors select-none group/game">
                  <Image src={game.icon} alt={game.name} width={24} height={24} className="rounded-full bg-zinc-800 pointer-events-none" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">{game.name}</span>
                    <span className="text-[10px] text-green-500 font-bold leading-none mt-0.5 uppercase">Indetectado</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <FeatureSection />

      <footer className="text-center pb-8 space-y-2">
        <p className="text-xs font-bold text-zinc-700">© 2026 michigun.xyz</p>
        <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-700">
           <AlertTriangle size={10} />
           <span>Use com responsabilidade</span>
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