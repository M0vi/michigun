'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import {
  Copy, Check, Download, FileCode, FileText, AlertTriangle, Search, X,
  Activity, Clock, BarChart3, Music, Code, Gamepad2, Moon, Circle,
  Crosshair, Move, Bot, Route, Zap, Hammer, UserCog, Globe, Skull,
  TabletSmartphone, Coins, Magnet, Eye, UserX, Ghost, Wind, FastForward,
  ArrowUpCircle, MapPin, Wrench, Shield, Lock, Terminal, Swords, Laugh,
} from 'lucide-react'
import { playSound, fetcher, cn } from '@/lib/utils'

const CONFIG = {
  script: 'loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()',
  discordLink: 'https://discord.gg/pWeJUBabvF',
  devs: [
    { id: '1163467888259239996', role: 'Dev' },
    { id: '1062463366792216657', role: 'CMO' },
  ],
  games: [
    { name: 'Apex',            icon: 'https://tr.rbxcdn.com/180DAY-e4f1cbe7d7e0f7018ea98880b9414fb4/768/432/Image/Webp/noFilter' },
    { name: 'Tevez',           icon: 'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
    { name: 'Delta',           icon: 'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
    { name: 'Soucre',          icon: 'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' },
    { name: 'Nova Era',        icon: 'https://tr.rbxcdn.com/180DAY-c2aa25a2b7a9e0556e93c63927cae5cc/768/432/Image/Webp/noFilter' },
    { name: 'Solara',          icon: 'https://tr.rbxcdn.com/180DAY-e0fe33e9562b5e4003ed9ccc98f5b29a/768/432/Image/Webp/noFilter' },
    { name: 'Mathias',         icon: 'https://tr.rbxcdn.com/180DAY-7ad6813df58de350ee91727f18e048d6/768/432/Image/Webp/noFilter' },
    { name: 'Victor',          icon: 'https://tr.rbxcdn.com/180DAY-07913e65ddf48f064fa581415301f87c/768/432/Image/Webp/noFilter' },
    { name: 'Entre outros...', icon: '' },
  ],
  features: {
    global: [
      { name: 'Silent Aim',      icon: Crosshair,       type: 'safe',   category: 'PVP',    desc: 'Redireciona seus tiros automaticamente para os inimigos, facilitando eliminações.' },
      { name: 'Hitbox Expander', icon: Move,             type: 'safe',   category: 'PVP',    desc: 'Amplia a hitbox dos inimigos, tornando qualquer tiro muito mais fácil de acertar.' },
      { name: 'ESP',             icon: Eye,              type: 'safe',   category: 'PVP',    desc: 'Revela a posição de inimigos através de paredes e obstáculos.' },
      { name: 'Auto JJ\'s',     icon: Activity,         type: 'safe',   category: 'Treino', desc: 'Executa polichinelos automaticamente sem nenhum esforço.' },
      { name: 'TAS',             icon: Route,            type: 'safe',   category: 'Treino', desc: 'Completa percursos automaticamente com precisão absoluta.' },
      { name: 'F3X',             icon: Hammer,           type: 'safe',   category: 'Treino', desc: 'Modifica o tamanho de qualquer estrutura no mapa livremente.' },
      { name: 'ChatGPT',         icon: Bot,              type: 'safe',   category: 'Treino', desc: 'Integração direta com a API do ChatGPT para responder qualquer pergunta.' },
      { name: 'Anti-lag',        icon: Zap,              type: 'safe',   category: 'Misc',   desc: 'Remove texturas desnecessárias e otimiza o jogo para mais FPS.' },
      { name: 'Char',            icon: UserCog,          type: 'visual', category: 'Misc',   desc: 'Altera o personagem seu ou de outros jogadores para qualquer modelo.' },
      { name: 'Anonimizar',      icon: UserX,            type: 'safe',   category: 'Misc',   desc: 'Oculta sua identidade ao gravar a tela do jogo.' },
      { name: 'Invisibilidade',  icon: Ghost,            type: 'safe',   category: 'Local',  desc: 'Torna você completamente invisível para os outros jogadores.' },
      { name: 'Fling',           icon: Wind,             type: 'risk',   category: 'Local',  desc: 'Arremessa outros jogadores para fora do mapa instantaneamente.' },
      { name: 'Velocidade',      icon: FastForward,      type: 'safe',   category: 'Local',  desc: 'Ajusta livremente a sua velocidade de movimento.' },
      { name: 'Pulo',            icon: ArrowUpCircle,    type: 'safe',   category: 'Local',  desc: 'Modifica a altura do seu pulo sem limites.' },
      { name: 'Teleporte',       icon: MapPin,           type: 'safe',   category: 'Local',  desc: 'Teleporta instantaneamente até qualquer jogador no servidor.' },
    ],
    apex: [
      { name: 'Global +',     icon: Globe,    type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Invadir Base', icon: Swords,   type: 'risk', category: 'Geral', desc: 'Permite invadir a base inimiga sem ser detectado.' },
      { name: 'Mods de Arma', icon: Wrench,   type: 'safe', category: 'Geral', desc: 'Modifica atributos da sua arma como dano, cadência e precisão.' },
      { name: 'Troll',        icon: Laugh,    type: 'risk', category: 'Geral', desc: 'Conjunto de ações de troll para irritar outros jogadores.' },
    ],
    tevez: [
      { name: 'Global +',   icon: Globe,            type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Kill Aura',  icon: Skull,            type: 'risk', category: 'Geral', desc: 'Elimina todos os inimigos próximos ao redor instantaneamente.' },
      { name: 'Mods',       icon: Wrench,           type: 'safe', category: 'Geral', desc: 'Modifica os atributos da sua arma livremente.' },
      { name: 'Spoofer',    icon: TabletSmartphone, type: 'safe', category: 'Geral', desc: 'Altera o dispositivo exibido no seu personagem.' },
      { name: 'Autofarm',   icon: Coins,            type: 'safe', category: 'Geral', desc: 'Rouba o banco automaticamente sem intervenção.' },
    ],
    delta: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Dinheiro',  icon: Coins, type: 'safe', category: 'Geral', desc: 'Recebe qualquer quantia de dinheiro instantaneamente.' },
    ],
    soucre: [
      { name: 'Global +', icon: Globe,  type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Magnet, type: 'safe', category: 'Geral', desc: 'Realiza o trabalho de lixeiro automaticamente com máxima velocidade.' },
    ],
    nova_era: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Coins, type: 'safe', category: 'Geral', desc: 'Acumula dinheiro automaticamente sem parar.' },
    ],
  },
}

const NAV_ITEMS = [
  { id: 'inicio',  label: 'Início' },
  { id: 'script',  label: 'Script' },
  { id: 'jogos',   label: 'Jogos' },
  { id: 'funcoes', label: 'Funções' },
  { id: 'equipe',  label: 'Equipe' },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease } } as import('framer-motion').TargetAndTransition),
}

const Styles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    :root {
      --r: #e63c3c;
      --rb: #ff4f4f;
      --rg: rgba(230,60,60,.35);
      --bg: #06060a;
      --p1: #0e0e12;
      --p2: #141418;
      --p3: #1c1c22;
      --b1: rgba(255,255,255,.055);
      --b2: rgba(255,255,255,.1);
      --t1: #e8e8ec;
      --t2: #6b6b74;
      --t3: #38383f;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--t1);
      font-family: 'Syne', sans-serif;
      overflow-x: hidden;
    }

    .mono { font-family: 'JetBrains Mono', monospace; }

    ::-webkit-scrollbar { width: 2px; height: 2px; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }

    .noise-layer {
      position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .018;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      animation: noiseAnim .4s steps(2) infinite;
    }
    @keyframes noiseAnim {
      0%   { background-position: 0 0; }
      33%  { background-position: -8% 12%; }
      66%  { background-position: 12% -8%; }
      100% { background-position: 0 0; }
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(230,60,60,.15) 30%, rgba(230,60,60,.15) 70%, transparent);
    }

    .slabel {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: .3em;
      text-transform: uppercase;
      color: var(--r);
      opacity: .45;
    }

    .surface {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 14px;
      transition: border-color .2s;
    }
    .surface:hover { border-color: var(--b2); }

    @keyframes glow-pulse {
      0%, 100% { opacity: .5; transform: scale(1); }
      50%       { opacity: 1; transform: scale(1.5); }
    }
    .glow-dot { animation: glow-pulse 2s ease-in-out infinite; }

    @keyframes glitch-clip {
      0%, 88%, 100% { transform: translate(0); filter: none; clip-path: none; }
      89% { transform: translate(-3px, 1px);  clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); filter: hue-rotate(20deg); }
      91% { transform: translate(3px, -1px);  clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%); filter: none; }
      93% { transform: translate(0); clip-path: none; }
    }
    .glitch { animation: glitch-clip 9s ease-in-out infinite; display: inline-block; will-change: transform; }

    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .marquee { animation: marquee 38s linear infinite; will-change: transform; }
    .marquee:hover { animation-play-state: paused; }
    .fade-sides { mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent); }

    .tab-nav-item {
      padding: 10px 22px;
      font-family: 'Syne', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--t3);
      background: none;
      border: none;
      cursor: pointer;
      transition: color .15s;
      position: relative;
      white-space: nowrap;
    }
    .tab-nav-item:hover { color: var(--t2); }
    .tab-nav-item.active { color: #fff; }
    .tab-nav-item.active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0; height: 1.5px;
      background: var(--rb);
      border-radius: 2px;
    }

    .tab-feat-item {
      padding: 8px 18px;
      font-family: 'Syne', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--t3);
      background: none;
      border: none;
      cursor: pointer;
      transition: color .15s;
      position: relative;
      white-space: nowrap;
    }
    .tab-feat-item:hover { color: var(--t2); }
    .tab-feat-item.active { color: #fff; }
    .tab-feat-item.active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0; height: 1px;
      background: var(--rb);
    }

    .fc {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 16px;
      padding: 18px 16px 16px;
      cursor: pointer;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
      position: relative;
      overflow: hidden;
      transition: border-color .18s, background .18s, transform .18s, box-shadow .18s;
    }
    .fc::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 70% at 10% 90%, var(--acc, rgba(34,197,94,.06)) 0%, transparent 70%);
      opacity: 0;
      transition: opacity .25s;
    }
    .fc:hover {
      border-color: rgba(255,255,255,.12);
      background: var(--p2);
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(0,0,0,.4);
    }
    .fc:hover::before { opacity: 1; }
    .fc-safe   { --acc: rgba(34,197,94,.1); }
    .fc-risk   { --acc: rgba(230,60,60,.1); }
    .fc-visual { --acc: rgba(168,85,247,.1); }

    .fc-icon-wrap {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.06);
    }

    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7px;
      letter-spacing: .2em;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid;
    }
    .badge-safe   { color: rgba(34,197,94,.8);   border-color: rgba(34,197,94,.2);  background: rgba(34,197,94,.05); }
    .badge-risk   { color: rgba(230,60,60,.85);  border-color: rgba(230,60,60,.25); background: rgba(230,60,60,.05); }
    .badge-visual { color: rgba(168,85,247,.8);  border-color: rgba(168,85,247,.2); background: rgba(168,85,247,.05); }

    .stat-card {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 14px;
      padding: 20px 18px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::after {
      content: '';
      position: absolute;
      top: 0; left: 20%; right: 20%; height: 1px;
      background: linear-gradient(90deg, transparent, var(--r), transparent);
      opacity: .25;
    }

    .page-section {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px;
    }
  `}</style>
)

const CountUp = ({ end }: { end: number }) => {
  const [n, setN] = useState(0)
  useEffect(() => {
    let v = 0
    const step = end / (1500 / 16)
    const timer = setInterval(() => {
      v += step
      if (v >= end) { setN(end); clearInterval(timer) }
      else setN(Math.floor(v))
    }, 16)
    return () => clearInterval(timer)
  }, [end])
  return <>{n.toLocaleString()}</>
}

const Countdown = () => {
  const [v, setV] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date(), next = new Date(now)
      next.setHours(24, 0, 0, 0)
      const diff = next.getTime() - now.getTime()
      const h = Math.floor((diff / 36e5) % 24)
      const m = Math.floor((diff / 6e4) % 60)
      setV(`${h}h ${String(m).padStart(2, '0')}m`)
    }
    const timer = setInterval(tick, 6e4); tick(); return () => clearInterval(timer)
  }, [])
  return <span>{v}</span>
}

const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [out, setOut] = useState('')
  const [active, setActive] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  useEffect(() => {
    if (!active) return
    let i = 0
    const timer = setInterval(() => {
      setOut(text.slice(0, ++i))
      if (i >= text.length) clearInterval(timer)
    }, 24)
    return () => clearInterval(timer)
  }, [active, text])
  return (
    <span>
      {out}
      {out.length < text.length && <span className="inline-block w-0.5 h-3 bg-red-500 ml-0.5 align-middle animate-pulse" />}
    </span>
  )
}

const ScriptCode = () => (
  <span className="mono text-[11px] sm:text-xs whitespace-nowrap">
    <span className="text-red-400">loadstring</span>
    <span className="text-zinc-600">(</span>
    <span className="text-sky-400">request</span>
    <span className="text-zinc-600">({'{'}</span>
    <span className="text-zinc-300">Url</span>
    <span className="text-zinc-600">=</span>
    <span className="text-emerald-400">"https://michigun.xyz/script"</span>
    <span className="text-zinc-600">,Method=</span>
    <span className="text-emerald-400">"GET"</span>
    <span className="text-zinc-600">{'}'}</span>
    <span className="text-zinc-600">).</span>
    <span className="text-sky-400">Body</span>
    <span className="text-zinc-600">)()</span>
  </span>
)

function Stats() {
  const { data } = useSWR('/api/stats', fetcher, { refreshInterval: 1e4 })
  const items = [
    { label: 'Total',   Icon: Activity,  value: data?.executions, color: '#ef4444' },
    { label: 'Hoje',    Icon: BarChart3, value: data?.daily,      color: '#f97316' },
    { label: 'Reset',   Icon: Clock,     value: 'cd',             color: '#facc15' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((s, i) => (
        <motion.div key={i} variants={fadeUp} initial="hidden" animate="show" custom={i}
          className="stat-card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <s.Icon size={11} style={{ color: s.color }} />
            <span className="mono text-[8px] uppercase tracking-[.2em] text-zinc-600">{s.label}</span>
          </div>
          <span className="mono text-2xl font-semibold text-white leading-none tracking-tight">
            {s.value === 'cd'
              ? <Countdown />
              : s.value ? <CountUp end={s.value as number} /> : <span className="text-zinc-700">—</span>}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function TeamCard({ dev }: { dev: any }) {
  const { data } = useSWR(`https://api.lanyard.rest/v1/users/${dev.id}`, fetcher, { refreshInterval: 5e3 })
  const u = data?.success ? data.data : null
  const spotify = u?.listening_to_spotify && u.spotify
  const activity = u?.activities?.find((x: any) => x.type !== 4 && x.name !== 'Spotify')

  let label = 'Offline'
  let SIcon: any = Circle
  let dot = '#3f3f46'

  if (spotify) { label = u.spotify.song; SIcon = Music; dot = '#22c55e' }
  else if (activity) {
    label = activity.name === 'Code' ? 'Codando' : activity.name
    SIcon = activity.name === 'Code' ? Code : Gamepad2
    dot = '#a1a1aa'
  } else {
    const st = u?.discord_status
    if (st === 'online') { label = 'Online';  dot = '#22c55e' }
    if (st === 'idle')   { label = 'Ausente'; SIcon = Moon; dot = '#f59e0b' }
    if (st === 'dnd')    { label = 'Ocupado'; dot = '#dc2626' }
  }

  return (
    <motion.div whileHover={{ x: 2 }}
      className="flex items-center gap-4 p-4 surface cursor-default"
      onMouseEnter={() => playSound('hover')}>
      <div className="relative shrink-0">
        <Image
          src={u?.discord_user?.avatar
            ? `https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png`
            : `https://ui-avatars.com/api/?name=Dev&background=111&color=555`}
          alt="av" width={44} height={44} unoptimized
          className="rounded-xl ring-1 ring-white/10" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2.5px] border-[var(--p1)] glow-dot"
          style={{ background: dot }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-bold text-sm text-white truncate tracking-wide">
            {u?.discord_user?.username || '...'}
          </span>
          <span className="mono text-[7px] uppercase tracking-[.25em] border px-2 py-0.5 rounded-md"
            style={{ color: 'rgba(230,60,60,.6)', borderColor: 'rgba(230,60,60,.2)' }}>
            {dev.role}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mono text-[10px] truncate"
          style={{ color: dot === '#a1a1aa' ? '#52525b' : dot + 'aa' }}>
          <SIcon size={9} />
          <span className="truncate">{label}</span>
        </div>
      </div>
    </motion.div>
  )
}

function FeaturesSection() {
  const [tab, setTab] = useState('global')
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<{ name: string; desc: string; type: string } | null>(null)

  const filtered = useMemo(() =>
    (CONFIG.features as any)[tab].filter((f: any) =>
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.desc.toLowerCase().includes(q.toLowerCase())
    ), [tab, q])

  const grouped = useMemo(() =>
    filtered.reduce((acc: any, f: any) => {
      const c = f.category || 'Geral'
      if (!acc[c]) acc[c] = []
      acc[c].push(f)
      return acc
    }, {}), [filtered])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-end">
        <div>
          <div className="slabel mb-2">Sistema</div>
          <h2 className="text-[36px] font-extrabold tracking-tight text-white leading-none">Funções</h2>
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={12} />
          <input
            type="text" placeholder="Buscar..." value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full bg-[var(--p1)] border border-[var(--b1)] rounded-xl pl-9 pr-4 py-2.5 mono text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-[rgba(230,60,60,.3)] transition-colors" />
        </div>
      </div>

      <div className="flex border-b border-[var(--b1)] overflow-x-auto gap-1">
        {Object.keys(CONFIG.features).map(k => (
          <button key={k} onClick={() => { setTab(k); playSound('click') }}
            className={`tab-feat-item ${tab === k ? 'active' : ''}`}>
            {k.replace('_', ' ')}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="flex flex-col gap-8">
          {Object.entries(grouped).map(([cat, items]: any) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-0.5 h-4 rounded-full bg-red-600" />
                <span className="mono text-[8px] uppercase tracking-[.28em] text-zinc-600">{cat}</span>
                <div className="flex-1 h-px bg-[var(--b1)]" />
                <span className="mono text-[8px] text-zinc-700">{items.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {items.map((f: any, j: number) => (
                  <motion.div key={f.name}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: j * 0.025, duration: 0.25, ease } }}
                    onClick={() => { setModal({ name: f.name, desc: f.desc, type: f.type }); playSound('click') }}
                    className={`fc fc-${f.type}`}>
                    <div className="flex justify-between items-start">
                      <div className="fc-icon-wrap">
                        <f.icon size={14} className="text-zinc-500" />
                      </div>
                      <span className={`badge badge-${f.type}`}>{f.type}</span>
                    </div>
                    <div>
                      <div className="text-[12px] font-bold tracking-wide text-zinc-200 leading-snug">{f.name}</div>
                      <div className="mono text-[7px] text-zinc-700 mt-1 uppercase tracking-widest">{f.category}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease } }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
              className={`relative w-full max-w-sm p-7 fc fc-${modal.type}`}
              style={{ background: 'var(--p1)', border: '1px solid var(--b2)' }}>
              <button onClick={() => setModal(null)}
                className="absolute top-5 right-5 text-zinc-700 hover:text-white transition-colors">
                <X size={15} />
              </button>
              <span className={`badge badge-${modal.type} mb-5 inline-block`}>{modal.type}</span>
              <h3 className="text-xl font-bold tracking-wide text-white mb-3 leading-snug">{modal.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-normal">{modal.desc}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScriptSection() {
  const [copied, setCopied] = useState(false)
  const [dlOpen, setDlOpen] = useState(false)

  const copy = useCallback(() => {
    playSound('click')
    navigator.clipboard.writeText(CONFIG.script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const download = useCallback((ext: string) => {
    const a = document.createElement('a')
    const blob = new Blob([CONFIG.script], { type: 'application/octet-stream' })
    a.href = URL.createObjectURL(blob)
    a.download = `michigun.${ext}`
    a.click()
    setDlOpen(false)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="slabel mb-2">Execução</div>
        <h2 className="text-[36px] font-extrabold tracking-tight text-white leading-none mb-6">Script</h2>
      </div>

      <Stats />

      <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
        <div className="relative flex-1 surface flex items-center gap-3 px-4 py-3.5 overflow-hidden">
          <Terminal size={12} className="text-zinc-700 shrink-0" />
          <div className="overflow-x-auto flex-1 scrollbar-none"><ScriptCode /></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--p1), transparent)' }} />
        </div>
        <div className="flex gap-2 shrink-0">
          <motion.button whileTap={{ scale: 0.96 }} onClick={copy}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl mono text-xs font-semibold uppercase tracking-wide border transition-all',
              copied
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-[var(--p1)] border-[var(--b1)] text-zinc-500 hover:text-white hover:border-[var(--b2)]'
            )}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </motion.button>
          <div className="relative">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setDlOpen(v => !v)}
              className="h-full px-4 surface text-zinc-600 hover:text-white transition-colors">
              <Download size={13} />
            </motion.button>
            <AnimatePresence>
              {dlOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDlOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease } }}
                    exit={{ opacity: 0, y: 4, scale: 0.95, transition: { duration: 0.12 } }}
                    className="absolute bottom-full right-0 mb-2 w-44 bg-[var(--p2)] border border-[var(--b2)] rounded-xl overflow-hidden shadow-2xl z-50">
                    {([['txt', '.txt', FileText], ['lua', '.lua', FileCode]] as any[]).map(([ext, lbl, Icon]) => (
                      <button key={ext} onClick={() => download(ext)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left mono text-xs text-zinc-500 hover:text-white hover:bg-white/[.04] border-b border-[var(--b1)] last:border-0 transition-colors tracking-wide uppercase">
                        <Icon size={12} />Arquivo {lbl}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function GamesSection() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <div>
          <div className="slabel mb-2">Compatibilidade</div>
          <h2 className="text-[36px] font-extrabold tracking-tight text-white leading-none">Jogos</h2>
        </div>
        <span className="mono text-[8px] uppercase tracking-[.2em] text-zinc-600 border border-[var(--b1)] bg-[var(--p1)] px-3 py-1.5 rounded-lg">
          {CONFIG.games.length} jogos
        </span>
      </div>
      <div className="relative overflow-hidden fade-sides py-1">
        <div className="flex gap-3 w-max marquee">
          {[...CONFIG.games, ...CONFIG.games].map((g: any, i: number) => (
            <div key={i}
              className="flex items-center gap-3 bg-[var(--p1)] border border-[var(--b1)] hover:border-[var(--b2)] pl-2.5 pr-5 py-3 rounded-2xl transition-all cursor-default group">
              {g.icon
                ? <Image src={g.icon} alt={g.name} width={24} height={24} unoptimized
                    className="rounded-lg grayscale group-hover:grayscale-0 transition-all" />
                : <div className="w-6 h-6 rounded-lg bg-[var(--p3)]" />}
              <div>
                <div className="text-xs font-bold tracking-wide text-zinc-500 group-hover:text-white transition-colors">{g.name}</div>
                <div className="mono text-[8px] flex items-center gap-1.5 mt-0.5 text-zinc-700">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/60 glow-dot" />
                  Indetectado
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
        {CONFIG.games.filter(g => g.icon).map((g, i) => (
          <motion.div key={g.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3, ease } }}
            className="flex items-center gap-3 bg-[var(--p1)] border border-[var(--b1)] hover:border-[var(--b2)] p-3.5 rounded-2xl transition-all cursor-default group">
            <Image src={g.icon} alt={g.name} width={32} height={32} unoptimized
              className="rounded-lg grayscale group-hover:grayscale-0 transition-all flex-shrink-0" />
            <div>
              <div className="text-sm font-bold tracking-wide text-zinc-400 group-hover:text-white transition-colors">{g.name}</div>
              <div className="mono text-[8px] flex items-center gap-1 mt-0.5 text-zinc-700">
                <div className="w-1 h-1 rounded-full bg-emerald-500/60 glow-dot" />
                Suportado
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TeamSection() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="slabel mb-2">Criadores</div>
        <h2 className="text-[36px] font-extrabold tracking-tight text-white leading-none">Equipe</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CONFIG.devs.map((d: any) => <TeamCard key={d.id} dev={d} />)}
      </div>
    </div>
  )
}

export default function Page() {
  const [activePage, setActivePage] = useState('inicio')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u')
      ) e.preventDefault()
    }
    const noCtx = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('keydown', handler)
    document.addEventListener('contextmenu', noCtx)
    return () => {
      document.removeEventListener('keydown', handler)
      document.removeEventListener('contextmenu', noCtx)
    }
  }, [])

  const navigateTo = (id: string) => {
    playSound('click')
    setActivePage(id)
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Styles />
      <div className="noise-layer" />

      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(230,60,60,.06) 0%, transparent 60%)',
        }} />

      <nav className="sticky top-0 z-50 flex justify-center py-4 px-5">
        <div className="flex items-center gap-1 bg-[rgba(14,14,18,0.85)] backdrop-blur-xl border border-[var(--b1)] rounded-2xl px-2 py-1 shadow-2xl"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,.5), 0 0 0 1px rgba(230,60,60,.06) inset' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 glow-dot" />
            <span className="mono text-[9px] uppercase tracking-[.3em] text-red-500/50">michi<span className="text-red-400">gun</span></span>
          </div>
          <div className="w-px h-5 bg-[var(--b1)]" />
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => navigateTo(item.id)}
              className={`tab-nav-item ${activePage === item.id ? 'active' : ''}`}>
              {item.label}
            </button>
          ))}
          <div className="w-px h-5 bg-[var(--b1)]" />
          <a href={CONFIG.discordLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl mono text-[10px] font-semibold uppercase tracking-wider transition-all ml-1"
            style={{ background: 'rgba(230,60,60,.1)', border: '1px solid rgba(230,60,60,.2)', color: '#f87171' }}>
            <Shield size={11} />
            Discord
          </a>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-5 md:px-10 pb-24">
        <AnimatePresence mode="wait">
          {activePage === 'inicio' && (
            <motion.section key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="pt-16 md:pt-24 flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
                  className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 glow-dot" />
                  <span className="mono text-[8px] uppercase tracking-[.35em] text-red-500/50">Ativo</span>
                </motion.div>

                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
                  <h1 className="text-[72px] md:text-[108px] font-extrabold leading-none tracking-tighter">
                    <span className="glitch text-white">michi</span>
                    <span style={{ color: '#e63c3c', textShadow: '0 0 50px rgba(230,60,60,.5), 0 0 100px rgba(230,60,60,.15)' }}>gun</span>
                    <span style={{ color: '#27272a' }}>.xyz</span>
                  </h1>
                </motion.div>

                <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                  className="mono text-xs text-zinc-600 max-w-xs leading-relaxed">
                  <TypeWriter text="Desenvolvido por @fp3 para fins educacionais." delay={400} />
                </motion.p>

                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                  className="flex items-center gap-4 pt-1">
                  <a href={CONFIG.discordLink} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all"
                    style={{ background: 'rgba(230,60,60,.1)', border: '1px solid rgba(230,60,60,.2)', color: '#f87171' }}>
                    <Shield size={13} />
                    Discord
                  </a>
                  <div className="flex items-center gap-2 mono text-[8px] text-zinc-700 uppercase tracking-widest">
                    <Lock size={9} />
                    Indetectado
                  </div>
                </motion.div>
              </div>

              <div className="divider" />

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Funções', value: Object.values(CONFIG.features).flat().length, suffix: '+', color: '#ef4444' },
                  { label: 'Jogos', value: CONFIG.games.filter(g => g.icon).length, suffix: '', color: '#f97316' },
                  { label: 'Indetectado', value: '100', suffix: '%', color: '#22c55e' },
                  { label: 'Suporte', value: '24', suffix: '/7', color: '#facc15' },
                ].map((stat, i) => (
                  <div key={i} className="stat-card flex flex-col gap-2">
                    <span className="mono text-[8px] uppercase tracking-[.2em] text-zinc-600">{stat.label}</span>
                    <span className="mono text-3xl font-bold leading-none" style={{ color: stat.color }}>
                      {stat.value}<span className="text-lg">{stat.suffix}</span>
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
                className="flex flex-col gap-3">
                <div className="slabel">Acesso rápido</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {NAV_ITEMS.filter(n => n.id !== 'inicio').map((item, i) => (
                    <button key={item.id} onClick={() => navigateTo(item.id)}
                      className="flex items-center justify-between p-4 surface hover:bg-[var(--p2)] transition-all group">
                      <span className="font-semibold text-sm text-zinc-500 group-hover:text-white transition-colors">{item.label}</span>
                      <span className="mono text-[10px] text-zinc-700 group-hover:text-red-500/50 transition-colors">→</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.section>
          )}

          {activePage === 'script' && (
            <motion.section key="script"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
              className="pt-16">
              <ScriptSection />
            </motion.section>
          )}

          {activePage === 'jogos' && (
            <motion.section key="jogos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
              className="pt-16">
              <GamesSection />
            </motion.section>
          )}

          {activePage === 'funcoes' && (
            <motion.section key="funcoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
              className="pt-16">
              <FeaturesSection />
            </motion.section>
          )}

          {activePage === 'equipe' && (
            <motion.section key="equipe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
              className="pt-16">
              <TeamSection />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="flex flex-col items-center gap-3 py-8 px-5">
        <div className="divider w-full max-w-5xl mb-2" />
        <div className="flex items-center gap-2 mono text-[8px] text-zinc-700 border border-[var(--b1)] bg-[var(--p1)] px-4 py-2 rounded-full uppercase tracking-widest">
          <AlertTriangle size={9} />
          Use com responsabilidade
        </div>
        <p className="mono text-[8px] text-zinc-700 tracking-widest uppercase">© 2026 michigun.xyz — @fp3</p>
      </footer>
    </div>
  )
}
