'use client'
import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import ParticleCanvas from '@/components/particle-canvas'
import { Toaster, toast } from 'react-hot-toast'
import {
  Copy, Check, Download, FileCode, FileText, Activity,
  BarChart3, Music, Code, Gamepad2, Moon, Circle, Globe, Skull,
  TabletSmartphone, Coins, Magnet, X, Crosshair, ScanSearch, Eye,
  Zap, GitMerge, Layers, Bot, UserX, Ghost, Wind, Rocket, Shuffle,
  Wrench, Laugh, Timer, Terminal, ArrowRight, Shield, AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { playSound, fetcher, cn } from '@/lib/utils'
import SectionErrorBoundary from '@/components/section-error-boundary'
import Nav from '@/components/nav'
import ParallaxStarsBackground from '@/components/parallax-stars'
import ShinyText from '@/components/shiny-text'

const DISCORD_URL = 'https://discord.gg/pWeJUBabvF'

const CREW = [
  { id:'1466338768335274148', role:'Dev', nick: 'h64' },
  { id:'1062463366792216657', role:'CMO' },
]

const ARENAS = [
  { name:'Apex',    slug:'apex',    thumb:'https://tr.rbxcdn.com/180DAY-e4f1cbe7d7e0f7018ea98880b9414fb4/768/432/Image/Webp/noFilter' },
  { name:'Tevez',   slug:'tevez',   thumb:'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
  { name:'Delta',   slug:'delta',   thumb:'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
  { name:'Soucre',  slug:'soucre',  thumb:'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' },
  { name:'Nova Era',slug:'nova_era',thumb:'https://tr.rbxcdn.com/180DAY-c2aa25a2b7a9e0556e93c63927cae5cc/768/432/Image/Webp/noFilter' },
]

type RiskLevel = 'safe'|'risk'|'visual'
interface Ability { name:string; icon:any; risk:RiskLevel; category:string; desc:string }

const ABILITIES: Record<string,Ability[]> = {
  global:[
    {name:'Silent Aim',     icon:Crosshair, risk:'safe',  category:'PVP',    desc:'Redireciona seus tiros automaticamente para os inimigos.'},
    {name:'Hitbox Expander',icon:ScanSearch,risk:'safe',  category:'PVP',    desc:'Amplia a hitbox dos inimigos, tornando qualquer tiro mais fácil.'},
    {name:'ESP',            icon:Eye,       risk:'safe',  category:'PVP',    desc:'Mostra a posição de inimigos através de paredes.'},
    {name:"Auto JJ's",      icon:Zap,       risk:'safe',  category:'Treino', desc:'Realiza polichinelos automaticamente.'},
    {name:'TAS',            icon:GitMerge,  risk:'safe',  category:'Treino', desc:'Completa parkours automaticamente com precisão absoluta.'},
    {name:'F3X',            icon:Layers,    risk:'safe',  category:'Treino', desc:'Modifica estruturas no mapa livremente.'},
    {name:'ChatGPT',        icon:Bot,       risk:'safe',  category:'Treino', desc:'Integração com a API do ChatGPT.'},
    {name:'Char',           icon:Shuffle,   risk:'visual',category:'Misc',   desc:'Altera o personagem seu ou de outros jogadores.'},
    {name:'Anonimizar',     icon:UserX,     risk:'safe',  category:'Misc',   desc:'Esconde o seu nome ao gravar a tela.'},
    {name:'Invisibilidade', icon:Ghost,     risk:'safe',  category:'Local',  desc:'Torna você completamente invisível.'},
    {name:'Fling',          icon:Wind,      risk:'risk',  category:'Local',  desc:'Arremessa outros jogadores para fora do mapa.'},
    {name:'Velocidade',     icon:Rocket,    risk:'safe',  category:'Local',  desc:'Altera a sua velocidade de movimento.'},
    {name:'Pulo',           icon:Timer,     risk:'safe',  category:'Local',  desc:'Modifica a altura do seu pulo.'},
    {name:'Teleporte',      icon:Zap,       risk:'safe',  category:'Local',  desc:'Teleporta para qualquer jogador.'},
  ],
  apex:[
    {name:'Global +',    icon:Globe,  risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Invadir Base',icon:Skull,  risk:'safe',category:'Geral',desc:'Permite invadir a base militar.'},
    {name:'Kill Aura',   icon:Skull,  risk:'safe',category:'Geral',desc:'Mata todos os militares com arma equipada ao seu redor.'},
    {name:'Mods de Arma',icon:Wrench, risk:'safe',category:'Geral',desc:'Modifica a arma.'},
    {name:'Troll',       icon:Laugh,  risk:'safe',category:'Geral',desc:'Funções para trollar jogadores.'},
  ],
  tevez:[
    {name:'Global +', icon:Globe,           risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Kill Aura',icon:Skull,           risk:'risk',category:'Geral',desc:'Elimina todos os inimigos ao redor.'},
    {name:'Mods',     icon:Wrench,          risk:'safe',category:'Geral',desc:'Modifica a sua arma.'},
    {name:'Spoofer',  icon:TabletSmartphone,risk:'safe',category:'Geral',desc:'Altera o dispositivo para treinos.'},
    {name:'Autofarm', icon:Coins,           risk:'safe',category:'Geral',desc:'Rouba o banco automaticamente.'},
  ],
  delta:[
    {name:'Global +', icon:Globe, risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Kill Aura',icon:Skull, risk:'risk',category:'Geral',desc:'Mata todos os inimigos instantaneamente.'},
    {name:'Dinheiro', icon:Coins, risk:'safe',category:'Geral',desc:'Permite receber qualquer quantia de dinheiro.'},
  ],
  soucre:[
    {name:'Global +',icon:Globe,  risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Magnet, risk:'safe',category:'Geral',desc:'Autofarm de moeda.'},
  ],
  nova_era:[
    {name:'Global +',icon:Globe, risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Coins, risk:'safe',category:'Geral',desc:'Autofarm de moeda.'},
  ],
}

function Panel({children,className,onClick}:{children:React.ReactNode;className?:string;onClick?:()=>void}){
  return(
    <div className={cn("relative group w-full h-full", className)}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-3/4 h-3/4 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-all duration-1000" />
      </div>
      <div onClick={onClick} className={cn("relative w-full h-full rounded-none overflow-hidden bg-[#111111] border border-white/5", onClick && "cursor-pointer hover:border-white/30 transition-colors")}>
        {children}
      </div>
    </div>
  )
}

function Eyebrow({children}:{children:React.ReactNode}){
  return(
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm font-bold tracking-[0.2em] text-[#888888] uppercase">
        {children}
      </span>
    </div>
  )
}

function RiskTag({risk}:{risk:RiskLevel}){
  const cfg={
    safe:  {l:'Seguro', c:'text-emerald-400',bg:'bg-emerald-400/10',b:'border-emerald-400/20'},
    risk:  {l:'Risco', c:'text-amber-400',  bg:'bg-amber-400/10',  b:'border-amber-400/20'},
    visual:{l:'Visual', c:'text-fuchsia-400',bg:'bg-fuchsia-400/10',b:'border-fuchsia-400/20'},
  }[risk]
  return(
    <span className={cn("inline-flex items-center text-[9px] font-mono font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-none border", cfg.c, cfg.bg, cfg.b)}>
      {cfg.l}
    </span>
  )
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const ref=useRef(null)
  const visible=useInView(ref,{once:true,margin:"-10%"})
  const noMotion=useReducedMotion()
  if(noMotion) return <div>{children}</div>
  return(
    <motion.div ref={ref} initial={{opacity:0,y:50,filter:"blur(12px)",scale:0.95}}
      animate={visible?{opacity:1,y:0,filter:"blur(0px)",scale:1}:{}}
      transition={{duration:1,ease:[0.16,1,0.3,1],delay}}>
      {children}
    </motion.div>
  )
}

const Ticker=({target}:{target:number})=>{
  const[n,setN]=useState(0)
  useEffect(()=>{
    let v=0;const inc=target/(700/16)
    const t=setInterval(()=>{v+=inc;if(v>=target){setN(target);clearInterval(t)}else setN(Math.floor(v))},16)
    return()=>clearInterval(t)
  },[target])
  return<span suppressHydrationWarning>{n.toLocaleString()}</span>
}

function HeroSection(){
  const { scrollY } = useScroll()
  const heroTextScale = useTransform(scrollY, [0, 800], [1, 0.95])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])

  return(
    <section className="relative h-screen w-full flex flex-col items-center justify-center pt-16 z-10">
      <motion.div
        className="flex flex-col items-center justify-center px-6 will-change-transform"
        style={{ scale: heroTextScale, opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-none overflow-hidden border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Image src="/avatar.png" alt="Logo" width={64} height={64} className="w-full h-full object-cover" priority />
          </div>

          <h1 className="relative font-black text-center tracking-tighter leading-[0.85] text-[15vw] md:text-[11vw] uppercase select-none group">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/2 bg-white/20 blur-[100px] md:blur-[120px] rounded-full group-hover:bg-white/30 transition-all duration-1000" />
            </div>
            
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-black">
              MICHIGUN
            </span>

            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_4s_infinite_linear] bg-[length:200%_auto] opacity-80 mix-blend-overlay">
              MICHIGUN
            </span>
          </h1>
          
          <div className="flex flex-col items-center gap-8 mt-2">
            <p className="text-sm md:text-base font-medium text-[#888888] max-w-sm text-center">
              Script para Exército Brasileiro no Roblox.<br/>por @h64.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={()=>{ const b=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'; document.getElementById('script')?.scrollIntoView({behavior:b as ScrollBehavior}) }}
                className="bg-white text-black px-8 py-4 rounded-none font-mono font-medium uppercase tracking-[0.1em] text-[10px] flex items-center gap-3 hover:bg-[#e2e2e2] transition-colors border border-white"
              >
                Pegar o script <ArrowRight size={14} />
              </button>
              <button
                onClick={()=>{ const b=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'; document.getElementById('arenas')?.scrollIntoView({behavior:b as ScrollBehavior}) }}
                className="bg-transparent text-white border border-white/20 px-8 py-4 rounded-none font-mono font-medium uppercase tracking-[0.1em] text-[10px] hover:border-white/60 hover:bg-white/5 transition-all duration-300"
              >
                Ver mapas
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ScriptPanel(){
  const[copied,setCopied]=useState(false)
  const[dlOpen,setDlOpen]=useState(false)
  const dlRef=useRef<HTMLDivElement>(null)

  const{data:cfg}=useSWR('/api/config',fetcher,{revalidateOnFocus:false})
  const scriptText:string=cfg?.script??''

  const{data:stats,error:statsErr}=useSWR('/api/stats',fetcher,{refreshInterval:15e3})

  const handleCopy=useCallback(()=>{
    if(!scriptText)return
    playSound('click');navigator.clipboard.writeText(scriptText)
    setCopied(true);setTimeout(()=>setCopied(false),2000)
    toast.success('Script copiado!',{
      style: { background: '#111111', color: '#ffffff', border: '1px solid #222222', borderRadius: '12px' },
      duration:2000,
    })
  },[scriptText])

  useEffect(()=>{
    if(!dlOpen)return
    const close=(e:MouseEvent)=>{
      if(dlRef.current&&!dlRef.current.contains(e.target as Node)) setDlOpen(false)
    }
    document.addEventListener('mousedown',close)
    return()=>document.removeEventListener('mousedown',close)
  },[dlOpen])

  return(
    <section id="script" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
      <Reveal>
        <Eyebrow>Script</Eyebrow>
        <h2 className="font-black tracking-tighter text-white uppercase leading-[0.9] text-5xl md:text-7xl">
          Cole no seu <br/><span className="text-[#666666] font-light">executor</span>
        </h2>
        <p className="text-[#888888] font-medium mt-6">Compatível com a maioria dos executores</p>
      </Reveal>
      
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col gap-6 max-w-4xl">
          {/* Terminal Window */}
          <Panel className="p-0 overflow-visible relative">
            {/* Window Header */}
            <div className="bg-[#111111]/80 border-b border-white/5 px-4 py-3 flex items-center justify-between rounded-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B50]/60" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/5" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleCopy} className="text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <div className="w-px h-3 bg-white/10" />
                <div ref={dlRef} className="relative flex items-center">
                  <button onClick={()=>setDlOpen(v=>!v)} className="text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                    <Download size={14} />
                    Salvar
                  </button>
                  {dlOpen && (
                    <div className="absolute top-full right-0 mt-4 w-32 bg-[#111111] border border-white/10 rounded-none overflow-hidden shadow-2xl z-50">
                      {([['txt',FileText],['lua',FileCode]] as [string,any][]).map(([ext,Icon])=>(
                        <button key={ext}
                          onClick={()=>{
                            if(!scriptText)return
                            const a=document.createElement('a')
                            a.href=URL.createObjectURL(new Blob([scriptText],{type:'application/octet-stream'}))
                            a.download=`michigun.${ext}`;a.click();setDlOpen(false)
                          }}
                          className="w-full px-4 py-3 text-xs font-mono text-[#888888] hover:text-white hover:bg-[#1a1a1a] flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                        >
                          <Icon size={14}/>.{ext}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Window Body */}
            <div className="p-6 md:p-8 overflow-x-auto">
              <code className="block font-mono text-xs md:text-sm leading-relaxed text-white/80 break-all">
                <span className="text-[#FF6B50]">loadstring</span>
                <span className="text-white/40">(</span>
                <span className="text-[#7dd3fc]">request</span>
                <span className="text-white/40">{"({"}</span>
                <span className="text-white/50">Url</span>
                <span className="text-white/40"> = </span>
                <span className="text-emerald-300">"https://michigun.xyz/scripts/main.lua"</span>
                <span className="text-white/40">{"})"}</span>
                <span className="text-[#7dd3fc]">.Body</span>
                <span className="text-white/40">)()</span>
              </code>
            </div>
          </Panel>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {Icon:Activity, label:'Execuções totais', value:stats?.executions},
              {Icon:BarChart3,label:'Execuções hoje',   value:stats?.daily},
            ].map((s)=>(
              <Panel key={s.label} className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-[#666666]">
                  <s.Icon size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                <p className="font-black text-4xl md:text-5xl tracking-tighter text-white">
                  {statsErr?<span className="text-red-400 text-sm">erro</span>:s.value!=null?<Ticker target={s.value}/>:<span className="text-[#444444]">—</span>}
                </p>
              </Panel>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function ArenasSection({onAbilityClick}:{onAbilityClick:(a:Ability)=>void}){
  const allArenas=[
    {name:'Global',slug:'global',thumb:'',isGlobal:true},
    ...ARENAS.map(g=>({...g,isGlobal:false})),
  ];

  return (
    <section id="arenas" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
      <Reveal>
        <Eyebrow>Funções</Eyebrow>
        <h2 className="font-black tracking-tighter text-white uppercase leading-[0.9] text-5xl md:text-7xl">
          Jogos com funções <br /><span className="text-[#666666] font-light">exclusivas</span>
        </h2>
      </Reveal>
      
      <Reveal delay={0.1}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
          {allArenas.map((arena, i) => {
            const abilities = ABILITIES[arena.slug] ?? []
            if (abilities.length === 0) return null

            return (
              <motion.div 
                key={arena.slug}
                initial={{opacity:0, y:20}}
                whileInView={{opacity:1, y:0}}
                viewport={{once:true}}
                transition={{delay: i * 0.1}}
                className="relative group w-full h-full"
              >
                {/* Glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                  <div className="w-3/4 h-3/4 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-all duration-1000" />
                </div>
                
                {/* Card Content */}
                <div className="relative flex flex-col border border-white/5 bg-[#0a0a0a] overflow-hidden rounded-none h-full">
                  {/* Arena Header (Banner) */}
                  <div className="w-full h-40 relative overflow-hidden">
                    {arena.isGlobal ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#111111] border-b border-white/5">
                        <Globe size={32} className="text-[#333333]" />
                        <span className="font-black text-3xl uppercase tracking-tighter text-white">Global</span>
                        <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase">{abilities.length} funções</p>
                      </div>
                    ) : (
                      <>
                        <Image src={(arena as any)?.thumb??''} alt={arena.name} fill className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                        <div className="absolute bottom-4 left-6">
                          <p className="font-black text-3xl uppercase tracking-tighter text-white drop-shadow-xl">{arena.name}</p>
                          <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mt-1">{abilities.length} funções</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Abilities List */}
                  <div className="p-4 flex flex-col gap-2">
                    {abilities.map(a => (
                      <button key={a.name}
                        onClick={()=>onAbilityClick(a)}
                        className="flex items-center justify-between p-4 rounded-none bg-[#111111] border border-white/5 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left group"
                      >
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate mr-4">{a.name}</span>
                        <RiskTag risk={a.risk}/>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}

const MemberCard=memo(function MemberCard({dev}:{dev:typeof CREW[0]}){
  const{data}=useSWR(`/api/lanyard/${dev.id}`,fetcher,{refreshInterval:10e3})
  const u=data?.success?data.data:null
  const spotify=u?.listening_to_spotify&&u.spotify
  const activity=u?.activities?.find((x:any)=>x.type!==4&&x.name!=='Spotify')

  let statusLabel='Offline',StatusIcon:any=Circle,dot='bg-white/10 text-white/10'
  if(spotify){statusLabel=u.spotify.song;StatusIcon=Music;dot='bg-emerald-400 text-emerald-400'}
  else if(activity){statusLabel=activity.name==='Code'?'Codando':activity.name;StatusIcon=activity.name==='Code'?Code:Gamepad2;dot='bg-[#888888] text-[#888888]'}
  else{
    const st=u?.discord_status
    if(st==='online'){statusLabel='Online';dot='bg-emerald-400 text-emerald-400'}
    if(st==='idle'){statusLabel='Ausente';StatusIcon=Moon;dot='bg-amber-400 text-amber-400'}
    if(st==='dnd'){statusLabel='Ocupado';dot='bg-red-400 text-red-400'}
  }

  const avatarSrc=u?.discord_user?.avatar
    ?`https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png?size=128`
    :`https://ui-avatars.com/api/?name=${(dev as any).nick || '?'}&background=111&color=444&size=128`
  const handle=u?.discord_user?.username??(dev as any).nick??'—'

  return(
    <Panel className="relative p-6 flex flex-col justify-between overflow-hidden group">
      {/* Background glow based on status */}
      <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[64px] opacity-20", dot.split(' ')[0])} />
      
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="relative">
          <Image src={avatarSrc} alt={handle} width={64} height={64} className="rounded-xl object-cover border border-white/10" />
          <div className={cn("absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#111111]", dot.split(' ')[0])} />
        </div>
        <div>
          <p className="font-black text-xl text-white tracking-tight">{handle}</p>
          <span className="text-[10px] font-bold text-[#666666] tracking-[0.2em] uppercase border border-white/10 px-2 py-0.5 rounded-full mt-1 inline-block">
            {dev.role}
          </span>
        </div>
      </div>
      
      <div className="pt-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <StatusIcon size={12} className={dot.split(' ')[1]} />
          <span className="text-xs font-medium text-[#888888] truncate">{statusLabel}</span>
        </div>
        {spotify&&(
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
            <Music size={14} className="text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-100 truncate">{u.spotify.song}</p>
              <p className="text-[10px] text-emerald-400/60 truncate">{u.spotify.artist}</p>
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
})

function CrewSection(){
  return(
    <section id="equipe" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
      <Reveal>
        <h2 className="font-black tracking-tighter text-white uppercase leading-[0.9] text-5xl md:text-7xl text-center">
          EQUIPE
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          {CREW.map(d=><MemberCard key={d.id} dev={d}/>)}
        </div>
      </Reveal>
    </section>
  )
}

export default function Root(){
  const[focusedAbility,setFocusedAbility]=useState<Ability|null>(null)

  useEffect(()=>{
    if(!focusedAbility)return
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape')setFocusedAbility(null) }
    document.addEventListener('keydown',onKey)
    return()=>document.removeEventListener('keydown',onKey)
  },[focusedAbility])

  return(
    <ParallaxStarsBackground className="font-display text-[#ebebeb] selection-coral">
      <Toaster position="bottom-center"/>
      <Nav/>
      
      <main className="flex flex-col items-center w-full relative z-10 gap-24 pb-24">
        <HeroSection/>
        <div className="w-full flex flex-col items-center">
          <SectionErrorBoundary label="ScriptPanel"><ScriptPanel/></SectionErrorBoundary>
        </div>
        <div className="w-full flex flex-col items-center">
          <SectionErrorBoundary label="ArenasSection"><ArenasSection onAbilityClick={setFocusedAbility}/></SectionErrorBoundary>
        </div>
        <div className="w-full flex flex-col items-center">
          <SectionErrorBoundary label="CrewSection"><CrewSection/></SectionErrorBoundary>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 flex items-center justify-center relative z-10 bg-transparent">
        <span className="text-[10px] text-[#444444] font-bold tracking-widest uppercase">
          © {new Date().getFullYear()} michigun.xyz
        </span>
      </footer>

      <AnimatePresence>
        {focusedAbility&&(
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            onClick={()=>setFocusedAbility(null)}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{opacity:0,scale:0.95,y:40,rotateX:15}} animate={{opacity:1,scale:1,y:0,rotateX:0}}
              exit={{opacity:0,scale:0.95,y:40,rotateX:-15}} transition={{type:"spring", stiffness:350, damping:25}}
              className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-none p-8 shadow-2xl"
              onClick={e=>e.stopPropagation()}>
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <button
                onClick={()=>setFocusedAbility(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[#888888] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
              
              <div className="mb-4">
                <RiskTag risk={focusedAbility.risk}/>
              </div>
              <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">
                {focusedAbility.name}
              </h3>
              <p className="text-sm font-medium text-[#888888] leading-relaxed">
                {focusedAbility.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ParallaxStarsBackground>
  )
}