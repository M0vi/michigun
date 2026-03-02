'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import {
  Copy, Check, Download, FileCode, FileText, Search, X,
  Activity, Clock, BarChart3, Music, Code, Gamepad2, Moon, Circle,
  Target, ScanLine, Bot, GitBranch, Zap, Hammer, UserCog, Globe, Skull,
  TabletSmartphone, Coins, Magnet, Scan, UserX, EyeOff, Wind, Gauge,
  ArrowUpCircle, Navigation, Wrench, Terminal, Swords, Smile,
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
      { name: 'Silent Aim',      icon: Target,        type: 'safe',   category: 'PVP',    desc: 'Redireciona seus tiros automaticamente para os inimigos, facilitando matá-los.' },
      { name: 'Hitbox Expander', icon: ScanLine,       type: 'safe',   category: 'PVP',    desc: 'Amplia a hitbox dos inimigos, tornando qualquer tiro muito mais fácil de acertar.' },
      { name: 'ESP',             icon: Scan,           type: 'safe',   category: 'PVP',    desc: 'Mostra a posição de inimigos através de paredes.' },
      { name: "Auto JJ's",      icon: Activity,       type: 'safe',   category: 'Treino', desc: 'Realiza polichinelos automaticamente.' },
      { name: 'TAS',             icon: GitBranch,      type: 'safe',   category: 'Treino', desc: 'Completa parkours automaticamente com precisão absoluta.' },
      { name: 'F3X',             icon: Hammer,         type: 'safe',   category: 'Treino', desc: 'Modifica o tamanho de qualquer estrutura no mapa livremente.' },
      { name: 'ChatGPT',         icon: Bot,            type: 'safe',   category: 'Treino', desc: 'Integração com a API do ChatGPT para responder qualquer pergunta.' },
      { name: 'Char',            icon: UserCog,        type: 'visual', category: 'Misc',   desc: 'Altera o personagem seu ou de outros jogadores para qualquer char.' },
      { name: 'Anonimizar',      icon: UserX,          type: 'safe',   category: 'Misc',   desc: 'Esconde o seu nome de usuário ao gravar a tela.' },
      { name: 'Invisibilidade',  icon: EyeOff,         type: 'safe',   category: 'Local',  desc: 'Torna você completamente invisível para os outros jogadores.' },
      { name: 'Fling',           icon: Wind,           type: 'risk',   category: 'Local',  desc: 'Arremessa outros jogadores para fora do mapa instantaneamente.' },
      { name: 'Velocidade',      icon: Gauge,          type: 'safe',   category: 'Local',  desc: 'Altera a sua velocidade.' },
      { name: 'Pulo',            icon: ArrowUpCircle,  type: 'safe',   category: 'Local',  desc: 'Modifica a altura do seu pulo.' },
      { name: 'Teleporte',       icon: Navigation,     type: 'safe',   category: 'Local',  desc: 'Teleporta para qualquer jogador.' },
    ],
    apex: [
      { name: 'Global +',     icon: Globe,    type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Invadir Base', icon: Swords,   type: 'safe', category: 'Geral', desc: 'Permite invadir a base militar.' },
      { name: 'Mods de Arma', icon: Wrench,   type: 'safe', category: 'Geral', desc: 'Modifica a arma.' },
      { name: 'Troll',        icon: Smile,    type: 'safe', category: 'Geral', desc: 'Funções para trollar jogadores.' },
    ],
    tevez: [
      { name: 'Global +',   icon: Globe,            type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Kill Aura',  icon: Skull,            type: 'risk', category: 'Geral', desc: 'Elimina todos os inimigos ao redor instantaneamente.' },
      { name: 'Mods',       icon: Wrench,           type: 'safe', category: 'Geral', desc: 'Modifica a sua arma.' },
      { name: 'Spoofer',    icon: TabletSmartphone, type: 'safe', category: 'Geral', desc: 'Altera o dispositivo, permitindo treinos de qualquer dispositivo.' },
      { name: 'Autofarm',   icon: Coins,            type: 'safe', category: 'Geral', desc: 'Rouba o banco automaticamente.' },
    ],
    delta: [
      { name: 'Global +',  icon: Globe,  type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Kill Aura', icon: Skull,  type: 'risk', category: 'Geral', desc: 'Mata todos os inimigos instantaneamente.' },
      { name: 'Dinheiro',  icon: Coins,  type: 'safe', category: 'Geral', desc: 'Permite receber qualquer quantia de dinheiro.' },
    ],
    soucre: [
      { name: 'Global +', icon: Globe,   type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Magnet,  type: 'safe', category: 'Geral', desc: 'Autofarm de moeda.' },
    ],
    nova_era: [
      { name: 'Global +', icon: Globe,  type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Coins,  type: 'safe', category: 'Geral', desc: 'Autofarm de moeda.' },
    ],
  },
}

const NAV_ITEMS = [
  { id: 'inicio',  label: 'Início' },
  { id: 'script',  label: 'Script' },
  { id: 'jogos',   label: 'Jogos' },
  { id: 'equipe',  label: 'Equipe' },
]

const GAME_KEYS: Record<string, string> = {
  'Apex': 'apex', 'Tevez': 'tevez', 'Delta': 'delta',
  'Soucre': 'soucre', 'Nova Era': 'nova_era',
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const badgeLabel = (t: string) => t === 'safe' ? 'seguro' : t === 'risk' ? 'risco' : 'visual'

const Styles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    :root {
      --r: #e63c3c;
      --rb: #ff4f4f;
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
      -webkit-font-smoothing: antialiased;
    }

    .mono { font-family: 'JetBrains Mono', monospace; }

    ::-webkit-scrollbar { width: 2px; height: 2px; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }

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

    .tab-nav-item {
      padding: 9px 12px;
      font-family: 'Syne', sans-serif;
      font-size: 11px;
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
      -webkit-tap-highlight-color: transparent;
    }
    @media (min-width: 480px) { .tab-nav-item { padding: 10px 18px; font-size: 12px; } }
    .tab-nav-item:hover { color: var(--t2); }
    .tab-nav-item.active { color: #fff; }
    .tab-nav-item.active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0; height: 1.5px;
      background: var(--rb);
      border-radius: 2px;
    }

    .fc {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 90px;
      transition: border-color .15s, background .15s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .fc:active { background: var(--p2); border-color: var(--b2); }
    @media (hover: hover) { .fc:hover { border-color: rgba(255,255,255,.1); background: var(--p2); } }
    .fc-safe   { border-left: 2px solid rgba(34,197,94,.25); }
    .fc-risk   { border-left: 2px solid rgba(230,60,60,.25); }
    .fc-visual { border-left: 2px solid rgba(168,85,247,.25); }

    .fc-icon-wrap {
      width: 30px; height: 30px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 8px;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.06);
      flex-shrink: 0;
    }

    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7px;
      letter-spacing: .12em;
      text-transform: uppercase;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid;
      display: inline-block;
    }
    .badge-safe   { color: rgba(34,197,94,.8);   border-color: rgba(34,197,94,.2);  background: rgba(34,197,94,.05); }
    .badge-risk   { color: rgba(230,60,60,.85);  border-color: rgba(230,60,60,.25); background: rgba(230,60,60,.05); }
    .badge-visual { color: rgba(168,85,247,.8);  border-color: rgba(168,85,247,.2); background: rgba(168,85,247,.05); }

    .stat-card {
      background: var(--p1);
      border: 1px solid var(--b1);
      border-radius: 12px;
      padding: 14px;
    }

    .game-card {
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid transparent;
      transition: border-color .15s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .game-card.active { border-color: rgba(230,60,60,.4); }
  `}</style>
)

const CountUp = ({ end }: { end: number }) => {
  const [n, setN] = useState(0)
  useEffect(() => {
    let v = 0
    const step = end / (1200 / 16)
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
  const { data } = useSWR('/api/stats', fetcher, { refreshInterval: 15e3 })
  const items = [
    { label: 'Total',  Icon: Activity,  value: data?.executions, color: '#ef4444' },
    { label: 'Hoje',   Icon: BarChart3, value: data?.daily,      color: '#f97316' },
    { label: 'Reset',  Icon: Clock,     value: 'cd',             color: '#facc15' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((s, i) => (
        <div key={i} className="stat-card flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <s.Icon size={10} style={{ color: s.color }} />
            <span className="mono text-[8px] uppercase tracking-[.15em] text-zinc-600">{s.label}</span>
          </div>
          <span className="mono text-xl sm:text-2xl font-semibold text-white leading-none tracking-tight">
            {s.value === 'cd'
              ? <Countdown />
              : s.value ? <CountUp end={s.value as number} /> : <span className="text-zinc-700">—</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

function TeamCard({ dev }: { dev: any }) {
  const { data } = useSWR(`https://api.lanyard.rest/v1/users/${dev.id}`, fetcher, { refreshInterval: 10e3 })
  const u = data?.success ? data.data : null
  const spotify = u?.listening_to_spotify && u.spotify
  const activity = u?.activities?.find((x: any) => x.type !== 4 && x.name !== 'Spotify')

  let label = 'Offline'
  let SIcon: any = Circle
  let dot = '#3f3f46'
  let statusKey = 'offline'

  if (spotify) { label = u.spotify.song; SIcon = Music; dot = '#22c55e'; statusKey = 'spotify' }
  else if (activity) {
    label = activity.name === 'Code' ? 'Codando' : activity.name
    SIcon = activity.name === 'Code' ? Code : Gamepad2
    dot = '#71717a'; statusKey = 'activity'
  } else {
    const st = u?.discord_status
    if (st === 'online') { label = 'Online';  dot = '#22c55e'; statusKey = 'online' }
    if (st === 'idle')   { label = 'Ausente'; SIcon = Moon; dot = '#f59e0b'; statusKey = 'idle' }
    if (st === 'dnd')    { label = 'Ocupado'; SIcon = Circle; dot = '#dc2626'; statusKey = 'dnd' }
  }

  const avatarUrl = u?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png?size=80`
    : `https://ui-avatars.com/api/?name=?&background=1a1a1f&color=3f3f46&size=80`

  return (
    <div className="relative flex flex-col overflow-hidden"
      style={{ background: 'var(--p1)', border: '1px solid var(--b1)', borderRadius: 16 }}>
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${dot}44, transparent)` }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Image src={avatarUrl} alt="avatar" width={48} height={48} unoptimized
              className="rounded-xl ring-1 ring-white/8" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background: dot, borderColor: 'var(--p1)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-sm text-white tracking-wide truncate">
                {u?.discord_user?.username ?? <span className="text-zinc-700">—</span>}
              </span>
              <span className="mono text-[7px] uppercase tracking-[.2em] px-2 py-0.5 rounded-lg shrink-0"
                style={{ color: 'rgba(230,60,60,.7)', background: 'rgba(230,60,60,.07)', border: '1px solid rgba(230,60,60,.15)' }}>
                {dev.role}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mono text-[10px] min-w-0">
              <SIcon size={9} style={{ color: dot, flexShrink: 0 }} />
              <span className="truncate" style={{ color: statusKey === 'offline' ? '#3f3f46' : dot + 'cc' }}>
                {label}
              </span>
            </div>
          </div>
        </div>
        {spotify && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.1)' }}>
            <Music size={9} className="text-emerald-500/70 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white truncate">{u.spotify.song}</div>
              <div className="mono text-[9px] text-zinc-600 truncate">{u.spotify.artist}</div>
            </div>
          </div>
        )}
      </div>
      <div className="h-px mx-4" style={{ background: 'var(--b1)' }} />
      <div className="px-4 py-2.5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
        <span className="mono text-[8px] uppercase tracking-[.2em]" style={{ color: '#3f3f46' }}>Discord</span>
        <span className="ml-auto mono text-[8px] text-zinc-700 truncate">{u?.discord_user?.id ?? dev.id}</span>
      </div>
    </div>
  )
}

function FeatureCard({ f, onClick }: { f: any; onClick: () => void }) {
  return (
    <div onClick={onClick} className={`fc fc-${f.type}`}>
      <div className="fc-icon-wrap">
        <f.icon size={13} className="text-zinc-500" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="text-[11px] font-bold tracking-wide text-zinc-200 leading-snug">{f.name}</div>
        <span className={`badge badge-${f.type}`}>{badgeLabel(f.type)}</span>
      </div>
    </div>
  )
}

function GamesSection() {
  const [selected, setSelected] = useState<string | null>(null)
  const [modal, setModal] = useState<{ name: string; desc: string; type: string } | null>(null)

  const gameList = CONFIG.games.filter(g => g.icon)
  const allEntries = [
    { name: 'Global', icon: '', key: 'global', isGlobal: true },
    ...gameList.map(g => ({ name: g.name, icon: g.icon, key: GAME_KEYS[g.name] ?? null, isGlobal: false })),
  ]

  const COLS = 3
  const rows: typeof allEntries[] = []
  for (let i = 0; i < allEntries.length; i += COLS) rows.push(allEntries.slice(i, i + COLS))

  const handleClick = (key: string | null) => {
    if (!key) return
    setSelected(prev => prev === key ? null : key)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <div>
          <div className="slabel mb-2">Catálogo</div>
          <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-white leading-none">Jogos</h2>
        </div>
        <span className="mono text-[8px] uppercase tracking-[.2em] text-zinc-600 border border-[var(--b1)] bg-[var(--p1)] px-2.5 py-1.5 rounded-lg">
          {gameList.length} jogos
        </span>
      </div>

      <p className="mono text-[9px] uppercase tracking-[.2em] text-zinc-700">
        Toque no jogo para ver as funções exclusivas
      </p>

      <div className="flex flex-col gap-0">
        {rows.map((row, rowIdx) => {
          const expandedInRow = row.find(e => e.key === selected)
          const features: any[] = expandedInRow ? (CONFIG.features as any)[expandedInRow.key] ?? [] : []
          const grouped = features.reduce((acc: any, f: any) => {
            const c = f.category || 'Geral'
            if (!acc[c]) acc[c] = []
            acc[c].push(f)
            return acc
          }, {})

          return (
            <div key={rowIdx}>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {row.map((entry) => {
                  const isActive = selected === entry.key
                  return (
                    <div key={entry.name} onClick={() => handleClick(entry.key)}
                      className={`game-card ${isActive ? 'active' : ''}`}>
                      <div className="relative w-full" style={{ aspectRatio: '16/9', background: 'var(--p2)' }}>
                        {entry.isGlobal ? (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ background: isActive ? 'rgba(230,60,60,.1)' : 'rgba(230,60,60,.04)' }}>
                            <Globe size={24} style={{ color: isActive ? '#e63c3c' : 'rgba(230,60,60,.3)' }} />
                          </div>
                        ) : (
                          <Image src={entry.icon} alt={entry.name} fill unoptimized
                            className="object-cover"
                            style={{ filter: isActive ? 'none' : 'grayscale(70%) brightness(0.6)' }} />
                        )}
                      </div>
                      <div className="px-2 py-1.5 flex items-center justify-between"
                        style={{ background: isActive ? 'rgba(230,60,60,.08)' : 'var(--p1)' }}>
                        <span className="mono text-[9px] font-bold uppercase tracking-wide truncate"
                          style={{ color: isActive ? '#fff' : '#52525b' }}>
                          {entry.name}
                        </span>
                        {entry.key && (CONFIG.features as any)[entry.key] && (
                          <span className="mono text-[8px] text-zinc-700 shrink-0 ml-1">
                            {(CONFIG.features as any)[entry.key].length}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
                {row.length < COLS && Array.from({ length: COLS - row.length }).map((_, i) => <div key={i} />)}
              </div>

              {expandedInRow && features.length > 0 && (
                <div className="mb-2 rounded-xl p-3.5 flex flex-col gap-4"
                  style={{ background: 'var(--p1)', border: '1px solid var(--b1)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-0.5 h-3 rounded-full bg-red-600" />
                    <span className="mono text-[8px] uppercase tracking-[.22em] text-zinc-500">
                      {expandedInRow.key === 'global' ? 'Funções globais' : `Exclusivo — ${expandedInRow.name}`}
                    </span>
                    <div className="flex-1 h-px bg-[var(--b1)]" />
                    <span className="mono text-[8px] text-zinc-700">{features.length}</span>
                  </div>
                  {Object.entries(grouped).map(([cat, items]: any) => (
                    <div key={cat}>
                      {Object.keys(grouped).length > 1 && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="mono text-[7px] uppercase tracking-[.3em] text-zinc-700">{cat}</span>
                          <div className="flex-1 h-px bg-[var(--b1)]" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {items.map((f: any) => (
                          <FeatureCard key={f.name} f={f}
                            onClick={() => setModal({ name: f.name, desc: f.desc, type: f.type })} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative w-full max-w-sm p-5 rounded-2xl"
            style={{ background: 'var(--p1)', border: '1px solid var(--b2)', zIndex: 1 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-zinc-700" style={{ lineHeight: 1 }}>
              <X size={15} />
            </button>
            <span className={`badge badge-${modal.type} mb-4 inline-block`}>{badgeLabel(modal.type)}</span>
            <h3 className="text-lg font-bold tracking-wide text-white mb-2 leading-snug">{modal.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{modal.desc}</p>
          </div>
        </div>
      )}
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
      <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-white leading-none">Loader</h2>
      <Stats />
      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        <div className="relative flex-1 surface flex items-center gap-3 px-4 py-3.5 overflow-hidden">
          <Terminal size={12} className="text-zinc-700 shrink-0" />
          <div className="overflow-x-auto flex-1"><ScriptCode /></div>
          <div className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--p1), transparent)' }} />
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={copy}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl mono text-xs font-semibold uppercase tracking-wide border transition-all',
              copied
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-[var(--p1)] border-[var(--b1)] text-zinc-500 hover:text-white hover:border-[var(--b2)]'
            )}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
          <div className="relative">
            <button onClick={() => setDlOpen(v => !v)}
              className="h-full px-3 surface text-zinc-600 hover:text-white transition-colors">
              <Download size={13} />
            </button>
            {dlOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDlOpen(false)} />
                <div className="absolute bottom-full right-0 mb-2 w-36 bg-[var(--p2)] border border-[var(--b2)] rounded-xl overflow-hidden shadow-2xl z-50">
                  {([['txt', '.txt', FileText], ['lua', '.lua', FileCode]] as any[]).map(([ext, lbl, Icon]) => (
                    <button key={ext} onClick={() => download(ext)}
                      className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left mono text-xs text-zinc-500 hover:text-white hover:bg-white/[.04] border-b border-[var(--b1)] last:border-0 transition-colors tracking-wide uppercase">
                      <Icon size={11} />Arquivo {lbl}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamSection() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-white leading-none">Equipe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONFIG.devs.map((d: any) => <TeamCard key={d.id} dev={d} />)}
      </div>
    </div>
  )
}

export default function Page() {
  const [activePage, setActivePage] = useState('inicio')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'u'))
        e.preventDefault()
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', position: 'relative' }}>
      <Styles />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0,
        background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(230,60,60,.04) 0%, transparent 60%)' }} />

      <nav className="sticky top-0 z-50 flex justify-center py-3 px-3" style={{ position: 'relative' }}>
        <div className="flex items-center gap-0 border border-[var(--b1)] rounded-2xl px-1 py-1"
          style={{ background: 'rgba(14,14,18,0.95)' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => navigateTo(item.id)}
              className={`tab-nav-item ${activePage === item.id ? 'active' : ''}`}>
              {item.label}
            </button>
          ))}
          <div className="w-px h-5 mx-1 bg-[var(--b1)]" />
          <a href={CONFIG.discordLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl mono text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'rgba(88,101,242,.15)', border: '1px solid rgba(88,101,242,.3)', color: '#7289da' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="hidden sm:inline">Discord</span>
          </a>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 md:px-10 pb-16" style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {activePage === 'inicio' && (
            <motion.section key="inicio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="pt-10 md:pt-16 flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05 } }}>
                  <Image src="/avatar.png" alt="michigun"
                    width={240} height={240} unoptimized
                    className="select-none w-[240px] h-[240px] sm:w-[300px] sm:h-[300px]"
                    style={{ filter: 'drop-shadow(0 0 32px rgba(180,150,80,.16))', background: 'none' }} />
                </motion.div>
                <motion.p
                  className="mono text-[11px] text-zinc-600 leading-relaxed text-center max-w-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}>
                  michigun.xyz é um script desenvolvido para jogos de Exército Brasileiro no Roblox. Programado por @fp3 como hobby.
                </motion.p>
              </div>

              <div className="divider" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Funções', value: Object.values(CONFIG.features).flat().length, suffix: '+', color: '#ef4444' },
                  { label: 'Jogos',   value: CONFIG.games.filter(g => g.icon).length, suffix: '', color: '#f97316' },
                  { label: 'Seguro',  value: '100', suffix: '%', color: '#22c55e' },
                  { label: 'Suporte', value: '24', suffix: '/7', color: '#facc15' },
                ].map((stat, i) => (
                  <div key={i} className="stat-card flex flex-col gap-2">
                    <span className="mono text-[8px] uppercase tracking-[.15em] text-zinc-600">{stat.label}</span>
                    <span className="mono text-2xl sm:text-3xl font-bold leading-none" style={{ color: stat.color }}>
                      {stat.value}<span className="text-base sm:text-lg">{stat.suffix}</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activePage === 'script' && (
            <motion.section key="script"
              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="pt-10">
              <ScriptSection />
            </motion.section>
          )}

          {activePage === 'jogos' && (
            <motion.section key="jogos"
              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="pt-10">
              <GamesSection />
            </motion.section>
          )}

          {activePage === 'equipe' && (
            <motion.section key="equipe"
              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="pt-10">
              <TeamSection />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="flex justify-center py-5 px-4" style={{ position: 'relative', zIndex: 1 }}>
        <p className="mono text-[8px] text-zinc-700 tracking-widest uppercase">© 2026 michigun.xyz</p>
      </footer>
    </div>
  )
}