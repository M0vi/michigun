'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import {
  Copy, Check, Download, MonitorPlay, Terminal, FileCode, FileText,
  AlertTriangle, Search, X, Activity, Clock, BarChart3, Music, Code,
  Gamepad2, Moon, Circle, Crosshair, Move, Bot, Route, Zap, Hammer,
  UserCog, Globe, Skull, TabletSmartphone, Coins, Magnet, Eye, UserX,
  Ghost, Wind, FastForward, ArrowUpCircle, MapPin, Wrench, ChevronRight,
  Shield, Lock,
} from 'lucide-react'
import { playSound, fetcher, cn } from '@/lib/utils'

/* ══════════════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════════════ */
const CONFIG = {
  script: 'loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()',
  discordLink: 'https://discord.gg/pWeJUBabvF',
  videoId: '20zXmdpUHQA',
  devs: [
    { id: '1163467888259239996', role: 'Dev' },
    { id: '1062463366792216657', role: 'CMO' },
  ],
  games: [
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
      { name: 'Silent aim',     icon: Crosshair,      type: 'safe',   category: 'PVP',    desc: 'Permite matar alvos com facilidade, redirecionando os tiros a eles.' },
      { name: 'Hitbox expander',icon: Move,            type: 'safe',   category: 'PVP',    desc: 'Permite amplificar o tamanho da hitbox dos inimigos, facilitando o acerto de tiros.' },
      { name: 'ESP',            icon: Eye,             type: 'safe',   category: 'PVP',    desc: 'Permite ver inimigos através das paredes.' },
      { name: "Auto JJ's",      icon: Activity,        type: 'safe',   category: 'Treino', desc: 'Realiza polichinelos automaticamente.' },
      { name: 'TAS',            icon: Route,           type: 'safe',   category: 'Treino', desc: 'Permite realizar percursos automaticamente, garantindo que você não erre na hora H.' },
      { name: 'F3X',            icon: Hammer,          type: 'safe',   category: 'Treino', desc: 'Permite modificar o tamanho de estruturas, seja aumentando ou diminuindo seus tamanhos.' },
      { name: 'ChatGPT',        icon: Bot,             type: 'safe',   category: 'Treino', desc: 'API do ChatGPT integrada, permitindo responder rapidamente qualquer questão.' },
      { name: 'Anti-lag',       icon: Zap,             type: 'safe',   category: 'Misc',   desc: 'Suprime texturas de alta qualidade e otimiza o jogo, garantindo mais FPS.' },
      { name: 'Char',           icon: UserCog,         type: 'visual', category: 'Misc',   desc: 'Permite alterar o seu char ou o char de terceiros para qualquer um.' },
      { name: 'Anonimizar',     icon: UserX,           type: 'safe',   category: 'Misc',   desc: 'Permite você gravar sua tela sem se identificar.' },
      { name: 'Invisibilidade', icon: Ghost,           type: 'safe',   category: 'Local',  desc: 'Permite ficar invisível para os outros.' },
      { name: 'Fling',          icon: Wind,            type: 'risk',   category: 'Local',  desc: 'Permite arremessar outros para o limbo.' },
      { name: 'Speed',          icon: FastForward,     type: 'safe',   category: 'Local',  desc: 'Permite alterar sua velocidade.' },
      { name: 'Jump',           icon: ArrowUpCircle,   type: 'safe',   category: 'Local',  desc: 'Permite alterar o seu pulo.' },
      { name: 'Teleport',       icon: MapPin,          type: 'safe',   category: 'Local',  desc: 'Permite teleportar para outros jogadores.' },
    ],
    tevez: [
      { name: 'Global +',  icon: Globe,           type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Kill aura', icon: Skull,           type: 'risk', category: 'Geral', desc: 'Permite matar todos os inimigos ao redor instantaneamente.' },
      { name: 'Mods',      icon: Wrench,          type: 'safe', category: 'Geral', desc: 'Permite modificar sua arma.' },
      { name: 'Spoofer',   icon: TabletSmartphone,type: 'safe', category: 'Geral', desc: 'Permite alterar o dispositivo mostrado no seu personagem.' },
      { name: 'Autofarm',  icon: Coins,           type: 'safe', category: 'Geral', desc: 'Permite roubar o banco automaticamente.' },
    ],
    delta: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Money',    icon: Coins, type: 'safe', category: 'Geral', desc: 'Permite receber qualquer quantia de dinheiro instantaneamente.' },
    ],
    soucre: [
      { name: 'Global +', icon: Globe,  type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Magnet, type: 'safe', category: 'Geral', desc: 'Realiza o trabalho de lixeiro automaticamente com rapidez.' },
    ],
    nova_era: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Coins, type: 'safe', category: 'Geral', desc: 'Ganha dinheiro automaticamente.' },
    ],
  },
}

/* ══════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

    :root {
      --red:        #dc2626;
      --red-bright: #ef4444;
      --red-glow:   rgba(220,38,38,.4);
      --bg:         #060608;
      --s1:         #0b0b0e;
      --s2:         #111115;
      --s3:         #161619;
      --border:     rgba(255,255,255,.07);
      --border2:    rgba(255,255,255,.13);
      --muted:      #52525b;
      --dimmed:     #3f3f46;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: #e4e4e7;
      font-family: 'Barlow Condensed', sans-serif;
      user-select: none;
      -webkit-user-select: none;
      overflow-x: hidden;
    }

    /* Radial ambient */
    body::before {
      content: '';
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background:
        radial-gradient(ellipse 65% 40% at 50% -5%, rgba(220,38,38,.08) 0%, transparent 70%),
        radial-gradient(ellipse 35% 25% at 90% 90%,  rgba(220,38,38,.04) 0%, transparent 60%);
    }

    /* Scanlines */
    body::after {
      content: '';
      position: fixed; inset: 0; z-index: 1; pointer-events: none;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 3px,
        rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 4px
      );
    }

    .mono  { font-family: 'JetBrains Mono', monospace; }
    .cond  { font-family: 'Barlow Condensed', sans-serif; }

    ::-webkit-scrollbar { width: 2px; height: 2px; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }

    /* ── Noise overlay ── */
    .noise {
      position: fixed; inset: 0; z-index: 2; pointer-events: none; opacity: .025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      animation: noiseShift .4s steps(2) infinite;
    }
    @keyframes noiseShift {
      0%   { background-position: 0 0; }
      25%  { background-position: -10% -5%; }
      50%  { background-position: 5% 15%; }
      75%  { background-position: -15% 5%; }
      100% { background-position: 0 0; }
    }

    /* ── Glitch ── */
    @keyframes glitch {
      0%, 93%, 100% { transform: translate(0); clip-path: none; opacity: 1; }
      94% { transform: translate(-2px, 1px); clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%); color: #f87171; }
      96% { transform: translate(2px, -1px); clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%); color: #ef4444; }
      98% { transform: translate(-1px, 0); clip-path: none; }
    }
    .glitch { animation: glitch 7s ease-in-out infinite; display: inline-block; }

    /* ── Marquee ── */
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee { animation: marquee 34s linear infinite; }
    .marquee:hover { animation-play-state: paused; }
    .fade-x { mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); }

    /* ── Pulse ── */
    @keyframes pulseDot { 0%, 100% { opacity: .5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.35); } }
    .pdot { animation: pulseDot 1.6s ease-in-out infinite; }

    /* ── Blink cursor ── */
    @keyframes blinkC { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .cursor::after { content: '▋'; animation: blinkC .9s step-end infinite; margin-left: 1px; color: var(--red-bright); }

    /* ── Tab underline ── */
    @keyframes lineIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }

    /* ── Red line divider ── */
    .red-line {
      height: 1px;
      background: linear-gradient(to right, transparent, var(--red) 25%, var(--red) 75%, transparent);
      opacity: .2;
    }

    /* ── Section label ── */
    .slabel {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: .28em;
      color: var(--red-bright);
      opacity: .55;
    }

    /* ── Card base ── */
    .card {
      background: var(--s1);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: border-color .18s, background .18s;
    }
    .card:hover { border-color: var(--border2); }

    /* ── HUD corner bracket ── */
    .hud::before, .hud::after {
      content: '';
      position: absolute;
      width: 12px; height: 12px;
      border-color: rgba(220,38,38,.4);
      border-style: solid;
    }
    .hud::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
    .hud::after  { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

    /* ── Stat box ── */
    .stat-box {
      background: var(--s1);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 14px;
      position: relative;
      overflow: hidden;
    }
    .stat-box::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(to right, transparent, var(--red) 50%, transparent);
      opacity: .35;
    }

    /* ── Feature card ── */
    .fc {
      background: var(--s1);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      cursor: pointer;
      min-height: 108px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color .18s, background .18s, transform .18s;
      position: relative;
      overflow: hidden;
    }
    .fc::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0; height: 2px;
      background: var(--acc, #22c55e);
      opacity: 0;
      transition: opacity .18s;
    }
    .fc:hover { border-color: var(--border2); background: var(--s2); transform: translateY(-2px); }
    .fc:hover::after { opacity: .7; }
    .fc-safe   { --acc: #22c55e; }
    .fc-risk   { --acc: #dc2626; }
    .fc-visual { --acc: #a855f7; }

    /* ── Type badge ── */
    .badge-safe   { color: rgba(34,197,94,.7);  border-color: rgba(34,197,94,.2); }
    .badge-risk   { color: rgba(220,38,38,.8);   border-color: rgba(220,38,38,.25); }
    .badge-visual { color: rgba(168,85,247,.7);  border-color: rgba(168,85,247,.25); }

    /* ── Tab ── */
    .tab {
      padding: 8px 18px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--muted);
      background: none;
      border: none;
      cursor: pointer;
      transition: color .15s;
      position: relative;
      white-space: nowrap;
    }
    .tab.active { color: #fff; }
    .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0; height: 1px;
      background: var(--red-bright);
      transform-origin: left;
      animation: lineIn .2s ease forwards;
    }
  `}</style>
)

/* ══════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════ */
const CountUp = ({ end }: { end: number }) => {
  const [c, setC] = useState(0)
  useEffect(() => {
    let s = 0
    const inc = end / (1500 / 16)
    const t = setInterval(() => {
      s += inc
      if (s >= end) { setC(end); clearInterval(t) } else setC(Math.floor(s))
    }, 16)
    return () => clearInterval(t)
  }, [end])
  return <>{c.toLocaleString()}</>
}

const Countdown = () => {
  const [t, setT] = useState('')
  useEffect(() => {
    const k = () => {
      const n = new Date(), m = new Date(n)
      m.setHours(24, 0, 0, 0)
      const d = m.getTime() - n.getTime()
      const h = Math.floor((d / 36e5) % 24), x = Math.floor((d / 6e4) % 60)
      setT(`${h}h ${String(x).padStart(2, '0')}m`)
    }
    const i = setInterval(k, 6e4); k(); return () => clearInterval(i)
  }, [])
  return <span>{t}</span>
}

const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [out, setOut] = useState('')
  const [go, setGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t) }, [delay])
  useEffect(() => {
    if (!go) return
    let i = 0
    const t = setInterval(() => { setOut(text.slice(0, ++i)); if (i >= text.length) clearInterval(t) }, 26)
    return () => clearInterval(t)
  }, [go, text])
  return <span className="cursor">{out}</span>
}

const CodeDisplay = () => (
  <div className="mono text-[11px] sm:text-xs whitespace-pre-wrap break-all leading-relaxed">
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
  </div>
)

/* ══════════════════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════════════════ */
function StatsDeck() {
  const { data } = useSWR('/api/stats', fetcher, { refreshInterval: 1e4 })
  const stats = [
    { label: 'Total',  Icon: Activity,  value: data?.executions, accent: '#ef4444' },
    { label: 'Hoje',   Icon: BarChart3, value: data?.daily,      accent: '#f97316' },
    { label: 'Reset',  Icon: Clock,     value: 'cd',             accent: '#eab308' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s, j) => (
        <motion.div key={j} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: j * .08 + .25 }} className="stat-box flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <s.Icon size={11} style={{ color: s.accent }} />
            <span className="mono text-[8px] uppercase tracking-[.18em] text-zinc-600">{s.label}</span>
          </div>
          <span className="mono text-xl font-semibold text-white leading-none">
            {s.value === 'cd'
              ? <Countdown />
              : s.value
                ? <CountUp end={s.value as number} />
                : <span className="text-zinc-700">—</span>}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TEAM
══════════════════════════════════════════════════════════════ */
function TeamCard({ dev }: { dev: any }) {
  const { data } = useSWR(`https://api.lanyard.rest/v1/users/${dev.id}`, fetcher, { refreshInterval: 5e3 })
  const u = data?.success ? data.data : null
  const spotify = u?.listening_to_spotify && u.spotify
  const activity = u?.activities?.find((x: any) => x.type !== 4 && x.name !== 'Spotify')

  let label = 'Offline', SIcon = Circle, dot = '#3f3f46'
  if (spotify) { label = u.spotify.song; SIcon = Music; dot = '#22c55e' }
  else if (activity) { label = activity.name === 'Code' ? 'Codando' : activity.name; SIcon = activity.name === 'Code' ? Code : Gamepad2; dot = '#fff' }
  else {
    const st = u?.discord_status
    if (st === 'online')  { label = 'Online';  dot = '#22c55e' }
    else if (st === 'idle')   { label = 'Ausente'; SIcon = Moon; dot = '#f59e0b' }
    else if (st === 'dnd')    { label = 'Ocupado'; dot = '#dc2626' }
  }

  return (
    <motion.div whileHover={{ x: 3 }}
      className="flex items-center gap-4 p-4 card cursor-default"
      onMouseEnter={() => playSound('hover')}>
      <div className="relative shrink-0">
        <Image
          src={u?.discord_user?.avatar
            ? `https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png`
            : `https://ui-avatars.com/api/?name=D&background=111&color=555`}
          alt="av" width={40} height={40}
          className="rounded-full ring-1 ring-white/10" unoptimized />
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--s1)] pdot"
          style={{ background: dot }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm tracking-wide text-white truncate">
            {u?.discord_user?.username || '...'}
          </span>
          <span className="mono text-[7px] uppercase tracking-[.25em] text-red-500/60 border border-red-500/20 px-1.5 py-0.5 rounded">
            {dev.role}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mono text-[10px] truncate"
          style={{ color: dot === '#fff' ? '#71717a' : dot + 'b3' }}>
          <SIcon size={9} />
          <span className="truncate">{label}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════════════════ */
function FeatureSection() {
  const [tab, setTab]     = useState('global')
  const [q,   setQ]       = useState('')
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
    <section className="flex flex-col gap-6">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <div className="slabel mb-1.5">Sistema</div>
          <h2 className="text-4xl font-black uppercase tracking-wide text-white leading-none">Funções</h2>
        </div>
        <div className="relative w-full md:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={12} />
          <input
            type="text" placeholder="Buscar função..." value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full bg-[var(--s1)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2.5 mono text-xs text-white focus:outline-none focus:border-red-600/30 transition-colors placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* tabs */}
      <div className="flex border-b border-[var(--border)] overflow-x-auto">
        {Object.keys(CONFIG.features).map(x => (
          <button key={x}
            onClick={() => { setTab(x); playSound('click') }}
            className={`tab ${tab === x ? 'active' : ''}`}>
            {x.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* cards */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} className="flex flex-col gap-8">
          {Object.entries(grouped).map(([cat, items]: any) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[3px] h-4 rounded-sm" style={{ background: 'var(--red)' }} />
                <span className="mono text-[8px] uppercase tracking-[.25em] text-zinc-600">{cat}</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="mono text-[8px] text-zinc-700">{items.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <AnimatePresence mode="popLayout">
                  {items.map((f: any, j: number) => (
                    <motion.div key={f.name}
                      initial={{ opacity: 0, scale: .94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: .94 }}
                      transition={{ delay: j * .025 }}
                      onClick={() => { setModal({ name: f.name, desc: f.desc, type: f.type }); playSound('click') }}
                      className={`fc fc-${f.type}`}>
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-md bg-white/[.04]">
                          <f.icon size={13} className="text-zinc-500" />
                        </div>
                        <span className={`mono text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded border badge-${f.type}`}>
                          {f.type}
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-200 leading-tight">{f.name}</div>
                        <div className="mono text-[7px] text-zinc-700 mt-0.5 uppercase tracking-widest">{f.category}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
            <motion.div initial={{ opacity: 0, scale: .94, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .94 }}
              className={`relative hud w-full max-w-sm fc fc-${modal.type} p-6`}
              style={{ background: 'var(--s1)', border: '1px solid var(--border2)' }}>
              <button onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-zinc-700 hover:text-white transition-colors">
                <X size={14} />
              </button>
              <span className={`mono text-[8px] uppercase tracking-[.25em] badge-${modal.type} border rounded px-1.5 py-0.5`}>
                {modal.type}
              </span>
              <h3 className="text-xl font-black uppercase tracking-wide text-white mt-3 mb-2">{modal.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-normal">{modal.desc}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [copied, setCopied] = useState(false)
  const [dlOpen, setDlOpen] = useState(false)
  const [video,  setVideo]  = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'u'))
        e.preventDefault()
    }
    document.addEventListener('keydown', h)
    document.addEventListener('contextmenu', e => e.preventDefault())
    return () => document.removeEventListener('keydown', h)
  }, [])

  const copy = () => {
    playSound('click')
    navigator.clipboard.writeText(CONFIG.script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dl = (ext: string) => {
    const a = document.createElement('a')
    const b = new Blob([CONFIG.script], { type: 'application/octet-stream' })
    a.href = URL.createObjectURL(b); a.download = `michigun.${ext}`; a.click()
    setDlOpen(false)
  }

  return (
    <main className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-10 pb-24 flex flex-col gap-16">
      <GlobalStyles />
      <div className="noise" />

      {/* ─── HERO ─── */}
      <section className="relative pt-20 md:pt-28 flex flex-col gap-5">
        <div className="absolute -top-24 -left-24 w-[520px] h-[420px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,.06) 0%, transparent 70%)' }} />

        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 }}
          className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 pdot" />
          <span className="mono text-[8px] uppercase tracking-[.35em] text-red-500/55">Sistema ativo</span>
          <div className="h-px w-14 bg-gradient-to-r from-red-500/30 to-transparent" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}
          className="text-7xl md:text-9xl font-black uppercase leading-none tracking-tighter">
          <span className="glitch">michi</span>
          <span style={{ color: '#dc2626', textShadow: '0 0 40px rgba(220,38,38,.55), 0 0 80px rgba(220,38,38,.2)' }}>gun</span>
          <span style={{ color: 'var(--dimmed)' }}>.xyz</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}
          className="mono text-[11px] text-zinc-500 max-w-xs leading-relaxed tracking-wide">
          <TypeWriter text="Desenvolvido por @fp3 para fins educacionais." delay={450} />
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55 }}
          className="flex items-center gap-4 pt-1">
          <a href={CONFIG.discordLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[.04] border border-white/[.08] text-zinc-300 text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-white/[.07] hover:border-white/[.14] hover:text-white transition-all">
            <Shield size={12} />
            Discord
            <ChevronRight size={11} className="text-zinc-600" />
          </a>
          <div className="flex items-center gap-1.5 mono text-[8px] text-zinc-600 uppercase tracking-widest">
            <Lock size={9} />indetectado
          </div>
        </motion.div>
      </section>

      <div className="red-line" />

      {/* ─── EXECUÇÃO ─── */}
      <section className="flex flex-col gap-4">
        <div className="slabel mb-1">Execução</div>

        {/* video + stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3 card overflow-hidden">
            <div className="relative aspect-video bg-black cursor-pointer group"
              onClick={() => { setVideo(true); playSound('click') }}>
              {!video ? (
                <>
                  <Image src={`https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg`}
                    alt="thumb" fill className="object-cover opacity-20 group-hover:opacity-35 transition-all duration-500 grayscale group-hover:grayscale-[40%]" unoptimized />
                  {/* HUD brackets */}
                  {['top-3 left-3 border-t border-l','top-3 right-3 border-t border-r','bottom-3 left-3 border-b border-l','bottom-3 right-3 border-b border-r'].map((c, i) => (
                    <div key={i} className={`absolute ${c} w-5 h-5`} style={{ borderColor: 'rgba(220,38,38,.4)' }} />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                      className="flex items-center gap-3 px-6 py-3 bg-black/60 border border-red-700/50 rounded-lg text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-700/15 transition-all">
                      <MonitorPlay size={15} />Preview
                    </motion.button>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="mono text-[7px] uppercase tracking-[.3em] text-red-500/40 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-500 pdot" />CLIQUE PARA ASSISTIR
                    </div>
                  </div>
                </>
              ) : (
                <iframe src={`https://www.youtube-nocookie.com/embed/${CONFIG.videoId}?autoplay=1`}
                  className="absolute inset-0 w-full h-full" allowFullScreen />
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <StatsDeck />
          </div>
        </div>

        {/* script input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 card flex items-center gap-3 px-4 py-3 overflow-hidden">
            <Terminal size={12} className="text-zinc-700 shrink-0" />
            <div className="overflow-x-auto flex-1 scrollbar-hide"><CodeDisplay /></div>
            <div className="absolute right-0 top-0 bottom-0 w-14 pointer-events-none"
              style={{ background: 'linear-gradient(to left, var(--s1), transparent)' }} />
          </div>
          <div className="flex gap-2 shrink-0">
            <motion.button whileTap={{ scale: .96 }} onClick={copy}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 border rounded-lg mono text-xs font-bold uppercase tracking-wide transition-all',
                copied
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-white/[.03] border-[var(--border)] text-zinc-500 hover:text-white hover:border-[var(--border2)]'
              )}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'OK' : 'Copiar'}
            </motion.button>
            <div className="relative">
              <motion.button whileTap={{ scale: .96 }} onClick={() => setDlOpen(!dlOpen)}
                className="h-full px-4 card text-zinc-600 hover:text-white transition-colors">
                <Download size={13} />
              </motion.button>
              <AnimatePresence>
                {dlOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDlOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 6, scale: .97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute bottom-full right-0 mb-2 w-44 bg-[#0e0e12] border border-[var(--border2)] rounded-xl overflow-hidden shadow-2xl z-50">
                      {[['txt', '.txt', FileText], ['lua', '.lua', FileCode]].map(([ext, label, Icon]: any) => (
                        <button key={ext} onClick={() => dl(ext)}
                          className="w-full px-4 py-3 flex items-center gap-3 text-left mono text-[11px] text-zinc-500 hover:text-white hover:bg-white/[.04] border-b border-[var(--border)] last:border-0 transition-colors uppercase tracking-wide">
                          <Icon size={12} />Arquivo {label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* ─── JOGOS ─── */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="slabel mb-1.5">Compatibilidade</div>
            <h2 className="text-4xl font-black uppercase tracking-wide text-white leading-none">Jogos Exclusivos</h2>
          </div>
          <span className="mono text-[8px] uppercase tracking-[.2em] text-zinc-600 border border-[var(--border)] px-3 py-1.5 rounded-lg">
            {CONFIG.games.length} jogos
          </span>
        </div>

        <div className="relative overflow-hidden fade-x py-2">
          <div className="flex gap-3 w-max marquee">
            {[...CONFIG.games, ...CONFIG.games].map((g: any, i: number) => (
              <div key={i}
                className="flex items-center gap-3 bg-[var(--s1)] border border-[var(--border)] hover:border-[var(--border2)] pl-2 pr-5 py-3 rounded-xl transition-all cursor-default group">
                {g.icon && (
                  <Image src={g.icon} alt={g.name} width={22} height={22} unoptimized
                    className="rounded-md grayscale group-hover:grayscale-0 transition-all" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 group-hover:text-white transition-colors">{g.name}</div>
                  <div className="mono text-[8px] text-zinc-700 flex items-center gap-1.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500/70 pdot" />
                    Indetectado
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* ─── EQUIPE ─── */}
      <section className="flex flex-col gap-5">
        <div>
          <div className="slabel mb-1.5">Criadores</div>
          <h2 className="text-4xl font-black uppercase tracking-wide text-white leading-none">Equipe</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONFIG.devs.map((d: any) => <TeamCard key={d.id} dev={d} />)}
        </div>
      </section>

      <div className="red-line" />

      {/* ─── FEATURES ─── */}
      <FeatureSection />

      {/* ─── FOOTER ─── */}
      <footer className="pt-6 pb-2 flex flex-col items-center gap-3">
        <div className="red-line w-full mb-4" />
        <div className="flex items-center gap-2 mono text-[8px] text-zinc-600 border border-[var(--border)] bg-[var(--s1)] px-4 py-2 rounded-full uppercase tracking-widest">
          <AlertTriangle size={9} />Use com responsabilidade
        </div>
        <p className="mono text-[8px] text-zinc-700 tracking-widest uppercase">© 2026 michigun.xyz — @fp3</p>
      </footer>
    </main>
  )
}
