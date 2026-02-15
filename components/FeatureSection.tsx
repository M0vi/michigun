'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG } from '@/lib/constants'
import { playSound, cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

export default function FeatureSection() {
  const [activeTab, setActiveTab] = useState('global')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; title: string; desc: string } | null>(null)

  const filteredFeatures = useMemo(() => {
    return CONFIG.features[activeTab].filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase())
    )
  }, [activeTab, search])

  return (
    <section className="bg-black border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-lg font-bold text-white tracking-tight">Funcionalidades</h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-zinc-900/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {Object.keys(CONFIG.features).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); playSound('click'); }}
            onMouseEnter={() => playSound('hover')}
            className={cn(
              "relative px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
              activeTab === tab ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tabHighlight"
                className="absolute inset-0 bg-white rounded-lg mix-blend-difference" // Efeito legal em B&W
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => { setModal({ open: true, title: item.name, desc: item.desc }); playSound('click'); }}
              onMouseEnter={() => playSound('hover')}
              className="relative group bg-zinc-900/30 border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white hover:text-black hover:border-white transition-all overflow-hidden"
            >
              {/* Barra lateral indicadora (Agora em tons de cinza) */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-colors",
                item.type === 'safe' ? "bg-white" : item.type === 'risk' ? "bg-zinc-600" : "bg-zinc-800",
                "opacity-100" 
              )} />

              <item.icon className="text-zinc-500 group-hover:text-black transition-colors mb-3" size={20} />

              <div className="font-mono text-xs font-bold text-zinc-300 group-hover:text-black mb-2">
                {item.name}
              </div>

              {/* Badges B&W */}
              <div className={cn(
                "text-[10px] font-bold uppercase tracking-wider inline-block px-2 py-0.5 rounded border",
                item.type === 'safe' ? "text-white border-white bg-white/5 group-hover:bg-black/10 group-hover:text-black group-hover:border-black" :
                item.type === 'risk' ? "text-zinc-400 border-zinc-600 bg-zinc-900/50 group-hover:text-black group-hover:border-black" :
                "text-zinc-500 border-zinc-800 group-hover:text-black group-hover:border-black"
              )}>
                {item.type === 'safe' ? 'Seguro' : item.type === 'risk' ? 'Risco' : 'Visual'}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {modal?.open && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-sm bg-black border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-2">{modal.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{modal.desc}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}