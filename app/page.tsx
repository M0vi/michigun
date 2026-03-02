'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import {
  Copy, Check, Download, FileCode, FileText, AlertTriangle, Search, X,
  Activity, Clock, BarChart3, Music, Code, Gamepad2, Moon, Circle,
  Crosshair, Move, Bot, Route, Zap, Hammer, UserCog, Globe, Skull,
  TabletSmartphone, Coins, Magnet, Eye, UserX, Ghost, Wind, FastForward,
  ArrowUpCircle, MapPin, Wrench, Shield, Lock, Terminal,
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
      { name: 'Silent aim',      icon: Crosshair,       type: 'safe',   category: 'PVP',    desc: 'Permite matar alvos com facilidade, redirecionando os tiros a eles.' },
      { name: 'Hitbox expander', icon: Move,             type: 'safe',   category: 'PVP',    desc: 'Permite amplificar o tamanho da hitbox dos inimigos, facilitando o acerto de tiros.' },
      { name: 'ESP',             icon: Eye,              type: 'safe',   category: 'PVP',    desc: 'Permite ver inimigos através das paredes.' },
      { name: "Auto JJ's",       icon: Activity,         type: 'safe',   category: 'Treino', desc: 'Realiza polichinelos automaticamente.' },
      { name: 'TAS',             icon: Route,            type: 'safe',   category: 'Treino', desc: 'Permite realizar percursos automaticamente, garantindo que você não erre na hora H.' },
      { name: 'F3X',             icon: Hammer,           type: 'safe',   category: 'Treino', desc: 'Permite modificar o tamanho de estruturas, seja aumentando ou diminuindo seus tamanhos.' },
      { name: 'ChatGPT',         icon: Bot,              type: 'safe',   category: 'Treino', desc: 'API do ChatGPT integrada, permitindo responder rapidamente qualquer questão.' },
      { name: 'Anti-lag',        icon: Zap,              type: 'safe',   category: 'Misc',   desc: 'Suprime texturas e otimiza o jogo, garantindo mais FPS.' },
      { name: 'Char',            icon: UserCog,          type: 'visual', category: 'Misc',   desc: 'Permite alterar o seu char ou o char de terceiros para qualquer um.' },
      { name: 'Anonimizar',      icon: UserX,            type: 'safe',   category: 'Misc',   desc: 'Permite você gravar sua tela sem se identificar.' },
      { name: 'Invisibilidade',  icon: Ghost,            type: 'safe',   category: 'Local',  desc: 'Permite ficar invisível para os outros.' },
      { name: 'Fling',           icon: Wind,             type: 'risk',   category: 'Local',  desc: 'Permite arremessar outros para o limbo.' },
      { name: 'Speed',           icon: FastForward,      type: 'safe',   category: 'Local',  desc: 'Permite alterar sua velocidade.' },
      { name: 'Jump',            icon: ArrowUpCircle,    type: 'safe',   category: 'Local',  desc: 'Permite alterar o seu pulo.' },
      { name: 'Teleport',        icon: MapPin,           type: 'safe',   category: 'Local',  desc: 'Permite teleportar para outros jogadores.' },
    ],
    tevez: [
      { name: 'Global +',  icon: Globe,            type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Kill aura', icon: Skull,            type: 'risk', category: 'Geral', desc: 'Permite matar todos os inimigos ao redor instantaneamente.' },
      { name: 'Mods',      icon: Wrench,           type: 'safe', category: 'Geral', desc: 'Permite modificar sua arma.' },
      { name: 'Spoofer',   icon: TabletSmartphone, type: 'safe', category: 'Geral', desc: 'Permite alterar o dispositivo mostrado no seu personagem.' },
      { name: 'Autofarm',  icon: Coins,            type: 'safe', category: 'Geral', desc: 'Permite roubar o banco automaticamente.' },
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

const Styles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    :root {
      --r: #e63c3c;
      --rb: #ff4f4f;
      --rg: rgba(230,60,60,.38);
      --bg: #050507;
      --p1: #0d0d10;
      --p2: #131317;
      --p3: #1a1a1f;
      --b1: rgba(255,255,255,.065);
      --b2: rgba(255,255,255,.12);
      --t1: #e4e4e7;
      --t2: #71717a;
      --t3: #3f3f46;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--t1);
      font-family: 'Syne', sans-serif;
      overflow-x: hidden;
      user-select: none;
      -webkit-user-select: none;
    }

    body::before {
      content: '';
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background:
        radial-gradient(ellipse 80% 55% at 50% -10%, rgba(230,60,60,.07) 0%, transparent 65%),
        radial-gradient(ellipse 40% 35% at 5%  110%,  rgba(230,60,60,.04) 0%, transparent 60%);
    }

    .mono { font-family: 'JetBrains Mono', monospace; }

    ::-webkit-scrollbar { width: 2px; height: 2px; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }

    .noise-layer {
      position: fixed; inset: 0; z-index: 1; pointer-events: none;
      opacity: .022;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      animation: noiseAnim .35s steps(2) infinite;
    }
    @keyframes noiseAnim {
      0%   { background-position: 0 0; }
      33%  { background-position: -8% 12%; }
      66%  { background-position: 12% -8%; }
      100% { background-position: 0 0; }
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(230,60,60,.2) 35%, rgba(230,60,60,.2) 65%, transparent);
    }

    .slabel {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: .3em;
      text-transform: uppercase;
      color: var(--r);
      opacity: .5;
    }

    .surface {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 14px;
      transition: border-color .2s;
    }
    .surface:hover { border-color: var(--b2); }

    @keyframes glow-pulse {
      0%, 100% { opacity: .45; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.4); }
    }
    .glow-dot { animation: glow-pulse 1.8s ease-in-out infinite; }

    @keyframes glitch-clip {
      0%, 90%, 100% { transform: translate(0); filter: none; }
      91% { transform: translate(-3px, 1px);  clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); filter: hue-rotate(20deg); }
      93% { transform: translate(3px, -1px);  clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%); }
      95% { transform: translate(-1px, 0);    clip-path: none; }
    }
    .glitch { animation: glitch-clip 8s ease-in-out infinite; display: inline-block; }

    @keyframes typeIn {
      from { width: 0; }
      to   { width: 100%; }
    }

    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee { animation: marquee 36s linear infinite; }
    .marquee:hover { animation-play-state: paused; }
    .fade-sides { mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent); }

    @keyframes lineIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }

    .tab-item {
      padding: 9px 20px;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
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
    .tab-item:hover { color: var(--t2); }
    .tab-item.on { color: #fff; }
    .tab-item.on::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0; height: 1px;
      background: var(--rb);
      transform-origin: left;
      animation: lineIn .22s ease forwards;
    }

    .fc {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 12px;
      padding: 14px;
      cursor: pointer;
      min-height: 104px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      transition: border-color .18s, background .18s, transform .18s, box-shadow .18s;
    }
    .fc::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 60% at 0% 100%, var(--acc, rgba(34,197,94,.06)) 0%, transparent 70%);
      opacity: 0;
      transition: opacity .22s;
    }
    .fc:hover {
      border-color: rgba(255,255,255,.14);
      background: var(--p2);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0,0,0,.35);
    }
    .fc:hover::before { opacity: 1; }
    .fc-safe   { --acc: rgba(34,197,94,.1); }
    .fc-risk   { --acc: rgba(230,60,60,.1); }
    .fc-visual { --acc: rgba(168,85,247,.1); }

    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7px;
      letter-spacing: .2em;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid;
    }
    .badge-safe   { color: rgba(34,197,94,.75);  border-color: rgba(34,197,94,.2); }
    .badge-risk   { color: rgba(230,60,60,.8);    border-color: rgba(230,60,60,.25); }
    .badge-visual { color: rgba(168,85,247,.75);  border-color: rgba(168,85,247,.2); }

    .stat-card {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 12px;
      padding: 18px 16px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::after {
      content: '';
      position: absolute;
      top: 0; left: 20%; right: 20%; height: 1px;
      background: linear-gradient(90deg, transparent, var(--r), transparent);
      opacity: .3;
    }
  `}</style>
)

const CountUp = ({ end }: { end: number }) => {
  const [n, setN] = useState(0)
  useEffect(() => {
    let v = 0
    const step = end / (1500 / 16)
    const t = setInterval(() => {
      v += step
      if (v >= end) { setN(end); clearInterval(t) } else setN(Math.floor(v))
    }, 16)
    return () => clearInterval(t)
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
    const i = setInterval(tick, 6e4); tick(); return () => clearInterval(i)
  }, [])
  return <span>{v}</span>
}

const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [out, setOut] = useState('')
  const [active, setActive] = useState(false)
  useEffect(() => { const t = setTimeout(() => setActive(true), delay); return () => clearTimeout(t) }, [delay])
  useEffect(() => {
    if (!active) return
    let i = 0
    const t = setInterval(() => { setOut(text.slice(0, ++i)); if (i >= text.length) clearInterval(t) }, 24)
    return () => clearInterval(t)
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
    { label: 'Total',  Icon: Activity,  value: data?.executions, color: '#ef4444' },
    { label: 'Hoje',   Icon: BarChart3, value: data?.daily,      color: '#f97316' },
    { label: 'Reset',  Icon: Clock,     value: 'cd',             color: '#facc15' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * .09 + .3 }} className="stat-card flex flex-col gap-3">
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

  if (spotify)  { label = u.spotify.song;  SIcon = Music; dot = '#22c55e' }
  else if (activity) {
    label = activity.name === 'Code' ? 'Codando' : activity.name
    SIcon = activity.name === 'Code' ? Code : Gamepad2
    dot = '#a1a1aa'
  } else {
    const st = u?.discord_status
    if (st === 'online')  { label = 'Online';  dot = '#22c55e' }
    if (st === 'idle')    { label = 'Ausente';  SIcon = Moon; dot = '#f59e0b' }
    if (st === 'dnd')     { label = 'Ocupado';  dot = '#dc2626' }
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
          alt="av" width={42} height={42} unoptimized
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

function Features() {
  const [tab, setTab]     = useState('global')
  const [q, setQ]         = useState('')
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
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-end">
        <div>
          <div className="slabel mb-2">Sistema</div>
          <h2 className="text-[38px] font-extrabold tracking-tight text-white leading-none">Funções</h2>
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={12} />
          <input
            type="text" placeholder="Buscar..." value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full bg-[var(--p1)] border border-[var(--b1)] rounded-xl pl-9 pr-4 py-2.5 mono text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-[rgba(230,60,60,.3)] transition-colors"
          />
        </div>
      </div>

      <div className="flex border-b border-[var(--b1)] overflow-x-auto gap-1">
        {Object.keys(CONFIG.features).map(k => (
          <button key={k} onClick={() => { setTab(k); playSound('click') }}
            className={`tab-item ${tab === k ? 'on' : ''}`}>
            {k.replace('_', ' ')}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} className="flex flex-col gap-8">
          {Object.entries(grouped).map(([cat, items]: any) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-0.5 h-4 rounded-full bg-red-600" />
                <span className="mono text-[8px] uppercase tracking-[.28em] text-zinc-600">{cat}</span>
                <div className="flex-1 h-px bg-[var(--b1)]" />
                <span className="mono text-[8px] text-zinc-700">{items.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                <AnimatePresence mode="popLayout">
                  {items.map((f: any, j: number) => (
                    <motion.div key={f.name}
                      initial={{ opacity: 0, scale: .93 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: .93 }}
                      transition={{ delay: j * .02 }}
                      onClick={() => { setModal({ name: f.name, desc: f.desc, type: f.type }); playSound('click') }}
                      className={`fc fc-${f.type}`}>
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-white/[.04]">
                          <f.icon size={13} className="text-zinc-500" />
                        </div>
                        <span className={`badge badge-${f.type}`}>{f.type}</span>
                      </div>
                      <div>
                        <div className="text-[12px] font-bold tracking-wide text-zinc-200 leading-snug">{f.name}</div>
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

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: .93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .93 }}
              className={`relative w-full max-w-sm surface p-7 fc fc-${modal.type}`}
              style={{ background: 'var(--p1)', border: '1px solid var(--b2)' }}>
              <button onClick={() => setModal(null)}
                className="absolute top-5 right-5 text-zinc-700 hover:text-white transition-colors">
                <X size={15} />
              </button>
              <span className={`badge badge-${modal.type} mb-4 inline-block`}>{modal.type}</span>
              <h3 className="text-xl font-bold tracking-wide text-white mb-3 leading-snug">{modal.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-normal">{modal.desc}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function Page() {
  const [copied, setCopied] = useState(false)
  const [dlOpen, setDlOpen] = useState(false)

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

  const download = (ext: string) => {
    const a = document.createElement('a')
    const blob = new Blob([CONFIG.script], { type: 'application/octet-stream' })
    a.href = URL.createObjectURL(blob)
    a.download = `michigun.${ext}`
    a.click()
    setDlOpen(false)
  }

  return (
    <main className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-10 pb-28 flex flex-col gap-20">
      <Styles />
      <div className="noise-layer" />

      <section className="relative pt-24 md:pt-32 flex flex-col gap-6">
        <div className="absolute -top-32 -left-40 w-[600px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(230,60,60,.055) 0%, transparent 65%)' }} />

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 }}
          className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 glow-dot" />
          <span className="mono text-[8px] uppercase tracking-[.35em] text-red-500/50">Ativo</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}>
          <h1 className="text-[72px] md:text-[108px] font-extrabold leading-none tracking-tighter">
            <span className="glitch text-white">michi</span>
            <span style={{ color: '#e63c3c', textShadow: '0 0 50px rgba(230,60,60,.5), 0 0 100px rgba(230,60,60,.18)' }}>
              gun
            </span>
            <span style={{ color: '#27272a' }}>.xyz</span>
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
          className="mono text-xs text-zinc-600 max-w-xs leading-relaxed">
          <TypeWriter text="Desenvolvido por @fp3 para fins educacionais." delay={500} />
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 }}
          className="flex items-center gap-4 pt-1">
          <a href={CONFIG.discordLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all"
            style={{ background: 'rgba(230,60,60,.1)', border: '1px solid rgba(230,60,60,.2)', color: '#f87171' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(230,60,60,.17)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(230,60,60,.1)' }}>
            <Shield size={13} />
            Discord
          </a>
          <div className="flex items-center gap-2 mono text-[8px] text-zinc-700 uppercase tracking-widest">
            <Lock size={9} />
            Indetectado
          </div>
        </motion.div>
      </section>

      <div className="divider" />

      <section className="flex flex-col gap-5">
        <div className="slabel mb-1">Execução</div>

        <Stats />

        <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
          <div className="relative flex-1 surface flex items-center gap-3 px-4 py-3.5 overflow-hidden">
            <Terminal size={12} className="text-zinc-700 shrink-0" />
            <div className="overflow-x-auto flex-1 scrollbar-none"><ScriptCode /></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
              style={{ background: 'linear-gradient(to left, var(--p1), transparent)' }} />
          </div>
          <div className="flex gap-2 shrink-0">
            <motion.button whileTap={{ scale: .96 }} onClick={copy}
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
              <motion.button whileTap={{ scale: .96 }} onClick={() => setDlOpen(!dlOpen)}
                className="h-full px-4 surface text-zinc-600 hover:text-white transition-colors">
                <Download size={13} />
              </motion.button>
              <AnimatePresence>
                {dlOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDlOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 6, scale: .96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute bottom-full right-0 mb-2 w-44 bg-[var(--p2)] border border-[var(--b2)] rounded-xl overflow-hidden shadow-2xl z-50">
                      {[['txt', '.txt', FileText], ['lua', '.lua', FileCode]].map(([ext, lbl, Icon]: any) => (
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
      </section>

      <div className="divider" />

      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-end">
          <div>
            <div className="slabel mb-2">Compatibilidade</div>
            <h2 className="text-[38px] font-extrabold tracking-tight text-white leading-none">Jogos</h2>
          </div>
          <span className="mono text-[8px] uppercase tracking-[.2em] text-zinc-600 border border-[var(--b1)] px-3 py-1.5 rounded-lg">
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
                  : <div className="w-6 h-6 rounded-lg bg-[var(--p3)]" />
                }
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
      </section>

      <div className="divider" />

      <section className="flex flex-col gap-5">
        <div>
          <div className="slabel mb-2">Criadores</div>
          <h2 className="text-[38px] font-extrabold tracking-tight text-white leading-none">Equipe</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONFIG.devs.map((d: any) => <TeamCard key={d.id} dev={d} />)}
        </div>
      </section>

      <div className="divider" />

      <Features />

      <footer className="flex flex-col items-center gap-3 pt-4">
        <div className="divider w-full mb-2" />
        <div className="flex items-center gap-2 mono text-[8px] text-zinc-700 border border-[var(--b1)] bg-[var(--p1)] px-4 py-2 rounded-full uppercase tracking-widest">
          <AlertTriangle size={9} />
          Use com responsabilidade
        </div>
        <p className="mono text-[8px] text-zinc-700 tracking-widest uppercase">© 2026 michigun.xyz</p>
      </footer>
    </main>
  )
}
