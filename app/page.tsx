'use client'
import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import { Toaster, toast } from 'react-hot-toast'
// [Performance] Removidos Clock e ChevronRight que não eram usados.
import {
  Copy, Check, Download, FileCode, FileText, Activity,
  BarChart3, Music, Code, Gamepad2, Moon, Circle, Globe, Skull,
  TabletSmartphone, Coins, Magnet, X, Crosshair, ScanSearch, Eye,
  Zap, GitMerge, Layers, Bot, UserX, Ghost, Wind, Rocket, Shuffle,
  Wrench, Laugh, Timer, Terminal, ArrowRight, Shield, AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { playSound, fetcher, cn } from '@/lib/utils'
import { ErrorBoundary } from '@/components/error-boundary'

const C = {
  bg:      '#060606',
  card:    'rgba(255,255,255,0.03)',
  border:  'rgba(255,255,255,0.07)',
  borderH: 'rgba(255,255,255,0.13)',
  text:    '#b8b8b8',
  textD:   'rgba(184,184,184,0.45)',
  textDD:  'rgba(184,184,184,0.2)',
  white:   '#efefef',
}

// [CHANGE 1 - Segurança] SCRIPT URL removida do bundle público.
// Buscar via /api/config no ScriptSection abaixo.
const DISCORD = 'https://discord.gg/pWeJUBabvF'
const DEVS = [
  { id:'1163467888259239996', role:'Dev' },
  { id:'1062463366792216657', role:'CMO' },
]
const GAMES = [
  { name:'Apex',    key:'apex',    icon:'https://tr.rbxcdn.com/180DAY-e4f1cbe7d7e0f7018ea98880b9414fb4/768/432/Image/Webp/noFilter' },
  { name:'Tevez',   key:'tevez',   icon:'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
  { name:'Delta',   key:'delta',   icon:'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
  { name:'Soucre',  key:'soucre',  icon:'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' },
  { name:'Nova Era',key:'nova_era',icon:'https://tr.rbxcdn.com/180DAY-c2aa25a2b7a9e0556e93c63927cae5cc/768/432/Image/Webp/noFilter' },
]
type FType = 'safe'|'risk'|'visual'
interface Feature { name:string; icon:any; type:FType; category:string; desc:string }
const FEATURES: Record<string,Feature[]> = {
  global:[
    {name:'Silent Aim',     icon:Crosshair,type:'safe',  category:'PVP',   desc:'Redireciona seus tiros automaticamente para os inimigos.'},
    {name:'Hitbox Expander',icon:ScanSearch,type:'safe',  category:'PVP',   desc:'Amplia a hitbox dos inimigos, tornando qualquer tiro mais fácil.'},
    {name:'ESP',            icon:Eye,       type:'safe',  category:'PVP',   desc:'Mostra a posição de inimigos através de paredes.'},
    {name:"Auto JJ's",     icon:Zap,       type:'safe',  category:'Treino',desc:'Realiza polichinelos automaticamente.'},
    {name:'TAS',            icon:GitMerge,  type:'safe',  category:'Treino',desc:'Completa parkours automaticamente com precisão absoluta.'},
    {name:'F3X',            icon:Layers,    type:'safe',  category:'Treino',desc:'Modifica estruturas no mapa livremente.'},
    {name:'ChatGPT',        icon:Bot,       type:'safe',  category:'Treino',desc:'Integração com a API do ChatGPT.'},
    {name:'Char',           icon:Shuffle,   type:'visual',category:'Misc',  desc:'Altera o personagem seu ou de outros jogadores.'},
    {name:'Anonimizar',     icon:UserX,     type:'safe',  category:'Misc',  desc:'Esconde o seu nome ao gravar a tela.'},
    {name:'Invisibilidade', icon:Ghost,     type:'safe',  category:'Local', desc:'Torna você completamente invisível.'},
    {name:'Fling',          icon:Wind,      type:'risk',  category:'Local', desc:'Arremessa outros jogadores para fora do mapa.'},
    {name:'Velocidade',     icon:Rocket,    type:'safe',  category:'Local', desc:'Altera a sua velocidade de movimento.'},
    {name:'Pulo',           icon:Timer,     type:'safe',  category:'Local', desc:'Modifica a altura do seu pulo.'},
    {name:'Teleporte',      icon:Zap,       type:'safe',  category:'Local', desc:'Teleporta para qualquer jogador.'},
  ],
  apex:[
    {name:'Global +',    icon:Globe,  type:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Invadir Base',icon:Skull,  type:'safe',category:'Geral',desc:'Permite invadir a base militar.'},
    {name:'Kill Aura',   icon:Skull,  type:'safe',category:'Geral',desc:'Mata todos os militares com arma equipada ao seu redor.'},
    {name:'Mods de Arma',icon:Wrench, type:'safe',category:'Geral',desc:'Modifica a arma.'},
    {name:'Troll',       icon:Laugh,  type:'safe',category:'Geral',desc:'Funções para trollar jogadores.'},
  ],
  tevez:[
    {name:'Global +', icon:Globe,           type:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Kill Aura',icon:Skull,           type:'risk',category:'Geral',desc:'Elimina todos os inimigos ao redor.'},
    {name:'Mods',     icon:Wrench,          type:'safe',category:'Geral',desc:'Modifica a sua arma.'},
    {name:'Spoofer',  icon:TabletSmartphone,type:'safe',category:'Geral',desc:'Altera o dispositivo para treinos.'},
    {name:'Autofarm', icon:Coins,           type:'safe',category:'Geral',desc:'Rouba o banco automaticamente.'},
  ],
  delta:[
    {name:'Global +', icon:Globe, type:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Kill Aura',icon:Skull, type:'risk',category:'Geral',desc:'Mata todos os inimigos instantaneamente.'},
    {name:'Dinheiro', icon:Coins, type:'safe',category:'Geral',desc:'Permite receber qualquer quantia de dinheiro.'},
  ],
  soucre:[
    {name:'Global +',icon:Globe,  type:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Magnet, type:'safe',category:'Geral',desc:'Autofarm de moeda.'},
  ],
  nova_era:[
    {name:'Global +',icon:Globe, type:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Coins, type:'safe',category:'Geral',desc:'Autofarm de moeda.'},
  ],
}

interface Beam{x:number;y:number;w:number;len:number;angle:number;speed:number;op:number;pulse:number;ps:number}

// [CHANGE 4 - Performance] Gradientes pré-computados fora do loop de draw
// para evitar alocação de objetos a cada frame.
interface BeamWithGradient extends Beam { grad?: CanvasGradient }

function BeamsBackground(){
  const ref=useRef<HTMLCanvasElement>(null)
  const beams=useRef<BeamWithGradient[]>([])
  const raf=useRef(0)
  // [CHANGE 9 - Acessibilidade] Respeitar prefers-reduced-motion
  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return
    const ctx=canvas.getContext('2d');if(!ctx)return

    // Se reduced motion, não renderizar o canvas animado
    if(prefersReduced.current){
      canvas.style.display='none'
      return
    }

    const isMobile=innerWidth<768
    const COUNT=isMobile?6:18
    const BLUR=isMobile?0:28
    const DPR=isMobile?1:Math.min(devicePixelRatio||1,2)

    const mk=():BeamWithGradient=>({
      x:Math.random()*innerWidth*1.5-innerWidth*.25,
      y:Math.random()*innerHeight*1.5-innerHeight*.25,
      w:isMobile?30+Math.random()*40:20+Math.random()*45,
      len:innerHeight*2.5,
      angle:-35+Math.random()*10,
      speed:isMobile?.2+Math.random()*.3:.35+Math.random()*.7,
      op:isMobile?.04+Math.random()*.06:.03+Math.random()*.06,
      pulse:Math.random()*Math.PI*2,
      ps:isMobile?.008:.012+Math.random()*.02,
      grad:undefined,
    })

    // [CHANGE 4 - Performance] Pré-computa o gradiente uma vez por beam.
    // Recria apenas quando op muda (não ocorre — op é fixo por beam).
    const buildGradient=(b:BeamWithGradient)=>{
      const g=ctx.createLinearGradient(0,0,0,b.len)
      g.addColorStop(0,`rgba(255,255,255,0)`)
      g.addColorStop(.15,`rgba(255,255,255,${b.op*.5})`)
      g.addColorStop(.5,`rgba(255,255,255,${b.op})`)
      g.addColorStop(.85,`rgba(255,255,255,${b.op*.5})`)
      g.addColorStop(1,`rgba(255,255,255,0)`)
      b.grad=g
    }

    const resize=()=>{
      canvas.width=innerWidth*DPR;canvas.height=innerHeight*DPR
      canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`
      ctx.scale(DPR,DPR)
      beams.current=Array.from({length:COUNT},()=>{const b=mk();buildGradient(b);return b})
    }
    const reset=(b:BeamWithGradient,i:number)=>{
      const s=innerWidth/3;b.y=innerHeight+100
      b.x=(i%3)*s+s/2+(Math.random()-.5)*s*.5
      b.w=isMobile?40+Math.random()*50:50+Math.random()*60
      b.speed=isMobile?.18+Math.random()*.25:.3+Math.random()*.4
      b.op=isMobile?.035+Math.random()*.05:.025+Math.random()*.05
      // Recria gradiente apenas no reset (mudou op)
      buildGradient(b)
    }
    const draw=(b:BeamWithGradient)=>{
      if(!b.grad)return
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle*Math.PI/180)
      // Nota: pulse afeta opacidade visual mas o gradiente base é pré-computado.
      // Para o efeito de pulse, multiplicamos globalAlpha em vez de recriar gradiente.
      ctx.globalAlpha=0.8+Math.sin(b.pulse)*.2
      ctx.fillStyle=b.grad;ctx.fillRect(-b.w/2,0,b.w,b.len)
      ctx.globalAlpha=1
      ctx.restore()
    }

    let last=0
    const FPS=isMobile?30:60
    const INTERVAL=1000/FPS

    const animate=(ts:number)=>{
      raf.current=requestAnimationFrame(animate)
      if(ts-last<INTERVAL)return
      last=ts
      ctx.clearRect(0,0,canvas.width,canvas.height)
      if(BLUR>0)ctx.filter=`blur(${BLUR}px)`
      beams.current.forEach((b,i)=>{
        b.y-=b.speed;b.pulse+=b.ps
        if(b.y+b.len<-100)reset(b,i)
        draw(b)
      })
      if(BLUR>0)ctx.filter='none'
    }
    resize();addEventListener('resize',resize);raf.current=requestAnimationFrame(animate)
    return()=>{removeEventListener('resize',resize);cancelAnimationFrame(raf.current)}
  },[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none',opacity:.55}}/>
}

function Card({children,style={},onClick}:{children:React.ReactNode;style?:React.CSSProperties;onClick?:()=>void}){
  return(
    <div onClick={onClick} className="card-hover"
      style={{position:'relative',borderRadius:12,overflow:'hidden',
        background:C.card,border:`1px solid ${C.border}`,
        cursor:onClick?'pointer':'default',...style}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,pointerEvents:'none',
        background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)`}}/>
      {children}
    </div>
  )
}

function Label({children}:{children:React.ReactNode}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{height:1,width:24,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
      <span style={{fontSize:9,fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase' as const,color:C.textDD}}>
        {children}
      </span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
    </div>
  )
}

function TBadge({type}:{type:FType}){
  const m={
    safe:  {l:'Seguro',I:Shield,       c:'#86efac',bg:'rgba(134,239,172,0.07)',b:'rgba(134,239,172,0.15)'},
    risk:  {l:'Risco', I:AlertTriangle,c:'#fbbf24',bg:'rgba(251,191,36,0.07)', b:'rgba(251,191,36,0.15)'},
    visual:{l:'Visual',I:Sparkles,     c:'#c4b5fd',bg:'rgba(196,181,253,0.07)',b:'rgba(196,181,253,0.15)'},
  }[type]
  return(
    <span style={{display:'inline-flex',alignItems:'center',gap:3,
      fontSize:8,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase' as const,
      color:m.c,background:m.bg,border:`1px solid ${m.b}`,padding:'2px 6px',borderRadius:4,whiteSpace:'nowrap' as const}}>
      <m.I size={7}/> {m.l}
    </span>
  )
}

// [CHANGE 9 - Acessibilidade] FadeUp respeita prefers-reduced-motion via Framer Motion hook
function FadeUp({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const ref=useRef(null)
  const v=useInView(ref,{once:true,margin:'-40px'})
  const shouldReduceMotion=useReducedMotion()
  const[isMobile,setIsMobile]=useState(false)
  useEffect(()=>{ setIsMobile(window.innerWidth<768) },[])
  if(isMobile||shouldReduceMotion) return <div>{children}</div>
  return(
    <motion.div ref={ref} initial={{opacity:0,y:14}}
      animate={v?{opacity:1,y:0}:{}}
      transition={{duration:.45,ease:[.22,1,.36,1],delay}}>
      {children}
    </motion.div>
  )
}

// [CHANGE 5 & 10 - UX + Bug] CountUp:
// - Inicia em 0 (elimina flash de "—" e hydration mismatch)
// - suppressHydrationWarning no span para evitar SSR/CSR mismatch residual
const CountUp=({end}:{end:number})=>{
  const[n,setN]=useState(0)
  useEffect(()=>{
    let v=0;const step=end/(700/16)
    const t=setInterval(()=>{v+=step;if(v>=end){setN(end);clearInterval(t)}else setN(Math.floor(v))},16)
    return()=>clearInterval(t)
  },[end])
  return<span suppressHydrationWarning>{n.toLocaleString()}</span>
}

const Countdown=()=>{
  const[v,setV]=useState<string|null>(null)
  useEffect(()=>{
    const tick=()=>{
      const now=new Date(),next=new Date(now);next.setHours(24,0,0,0)
      const d=next.getTime()-now.getTime()
      setV(`${Math.floor((d/36e5)%24)}h ${String(Math.floor((d/6e4)%60)).padStart(2,'0')}m`)
    }
    const t=setInterval(tick,6e4);tick();return()=>clearInterval(t)
  },[])
  return<>{v??'—'}</>
}

function Hero(){
  return(
    <section style={{paddingTop:56,position:'relative',zIndex:1}}>

      <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{duration:.4}}
        style={{display:'flex',alignItems:'center',gap:10,marginBottom:40}}>
        <div style={{width:36,height:36,borderRadius:10,overflow:'hidden',
          border:`1px solid ${C.border}`,flexShrink:0}}>
          {/* [CHANGE 3 - Performance] priority para LCP acima do fold */}
          <Image src="/avatar.png" alt="Logo michigun.xyz" width={36} height={36} unoptimized priority
            style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <span style={{fontSize:12,color:C.textD,fontFamily:'var(--font-mono, monospace)',letterSpacing:'.04em'}}>
          michigun.xyz
        </span>
        <a href={DISCORD} target="_blank" rel="noreferrer"
          aria-label="Entrar no Discord"
          style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:6,
            fontSize:11,color:C.textD,textDecoration:'none',padding:'6px 14px',
            border:`1px solid ${C.border}`,borderRadius:999,background:C.card,transition:'all .2s',
            flexShrink:0}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.borderH;(e.currentTarget as HTMLElement).style.color=C.text}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;(e.currentTarget as HTMLElement).style.color=C.textD}}>
          <svg width="14" height="14" viewBox="0 0 71 55" fill="currentColor" style={{flexShrink:0}} aria-hidden="true">
            <path d="M60.105 4.898A58.549 58.549 0 0 0 45.653.505a.225.225 0 0 0-.238.113c-.622 1.108-1.311 2.554-1.794 3.689a54.112 54.112 0 0 0-16.24 0 37.303 37.303 0 0 0-1.822-3.689.234.234 0 0 0-.238-.113A58.348 58.348 0 0 0 10.87 4.898a.212.212 0 0 0-.098.084C1.577 18.561-.944 31.835.293 44.944a.25.25 0 0 0 .095.17 58.783 58.783 0 0 0 17.709 8.958.237.237 0 0 0 .258-.085 42.012 42.012 0 0 0 3.622-5.893.232.232 0 0 0-.127-.323 38.715 38.715 0 0 1-5.532-2.636.235.235 0 0 1-.023-.39 30.272 30.272 0 0 0 1.099-.862.226.226 0 0 1 .236-.032c11.609 5.304 24.177 5.304 35.649 0a.225.225 0 0 1 .238.029c.356.293.728.588 1.101.865a.235.235 0 0 1-.02.39 36.368 36.368 0 0 1-5.535 2.634.233.233 0 0 0-.124.326 47.166 47.166 0 0 0 3.619 5.89.234.234 0 0 0 .259.086 58.618 58.618 0 0 0 17.722-8.958.236.236 0 0 0 .095-.167c1.48-15.315-2.48-28.482-10.497-40.062a.186.186 0 0 0-.096-.086zM23.725 37.033c-3.504 0-6.391-3.218-6.391-7.17s2.83-7.17 6.391-7.17c3.588 0 6.447 3.245 6.391 7.17 0 3.952-2.83 7.17-6.391 7.17zm23.624 0c-3.504 0-6.391-3.218-6.391-7.17s2.83-7.17 6.391-7.17c3.588 0 6.447 3.245 6.391 7.17 0 3.952-2.803 7.17-6.391 7.17z"/>
          </svg>
          Discord
        </a>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,delay:.06}}>
        <h1 className="font-display" style={{
          fontSize:'clamp(42px,9vw,76px)',
          fontWeight:800,
          letterSpacing:'-.05em',
          lineHeight:.88,
          marginBottom:24,
          background:'linear-gradient(170deg, #ffffff 0%, #c8c8c8 30%, #707070 65%, #2a2a2a 100%)',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          whiteSpace:'nowrap',
          overflow:'visible',
        }}>
          michigun.xyz
        </h1>
      </motion.div>

      <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.45,delay:.14}}
        style={{display:'flex',flexDirection:'column',gap:20,paddingLeft:2}}>
        <p style={{fontSize:14,color:C.textD,lineHeight:1.7,maxWidth:320}}>
          Script para Exército Brasileiro no Roblox.<br/>por @fp3.
        </p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button
            onClick={()=>{ const b=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'; document.getElementById('script')?.scrollIntoView({behavior:b as ScrollBehavior}) }}
            aria-label="Ir para a seção do script"
            style={{position:'relative',display:'inline-flex',alignItems:'center',gap:7,
              padding:'10px 22px',borderRadius:999,fontSize:13,fontWeight:600,
              background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',
              color:C.white,cursor:'pointer',fontFamily:'inherit',overflow:'hidden',transition:'all .2s'}}>
            <span style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,
              background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)'}}/>
            <span style={{position:'relative'}}>Pegar o script</span>
            <ArrowRight size={13} aria-hidden="true"/>
          </button>
          <button
            onClick={()=>{ const b=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'; document.getElementById('mapas')?.scrollIntoView({behavior:b as ScrollBehavior}) }}
            aria-label="Ver mapas disponíveis"
            style={{display:'inline-flex',alignItems:'center',gap:6,
              padding:'10px 20px',borderRadius:999,fontSize:13,fontWeight:500,
              background:C.card,border:`1px solid ${C.border}`,
              color:C.textD,cursor:'pointer',fontFamily:'inherit',transition:'all .2s'}}>
            Ver mapas
          </button>
        </div>
      </motion.div>

    </section>
  )
}

// [CHANGE 12 - Código] Fonte mono com fallback explícito para quando a CSS var não estiver disponível
const MONO_FONT = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)'

function ScriptSection(){
  const[copied,setCopied]=useState(false)
  const[dlOpen,setDlOpen]=useState(false)
  const dlRef=useRef<HTMLDivElement>(null)

  // [CHANGE 1 - Segurança] Busca o script via API protegida em vez de expor no bundle
  const{data:configData,isLoading:configLoading}=useSWR('/api/config',fetcher,{revalidateOnFocus:false})
  const script:string=configData?.script??''

  const{data}=useSWR('/api/stats',fetcher,{refreshInterval:15e3})

  const copy=useCallback(()=>{
    if(!script)return
    playSound('click');navigator.clipboard.writeText(script)
    setCopied(true);setTimeout(()=>setCopied(false),2000)
    // [UX] Toast global visível mesmo quando botão está fora da viewport
    toast.success('Script copiado!',{
      style:{background:'rgba(10,10,10,0.95)',color:'#86efac',border:'1px solid rgba(134,239,172,0.2)',fontSize:'13px'},
      iconTheme:{primary:'#86efac',secondary:'rgba(10,10,10,0.95)'},
      duration:2000,
    })
  },[script])

  // [CHANGE 11 - Bug] Fechar dropdown com click fora usando ref, evitando position:fixed overlay
  useEffect(()=>{
    if(!dlOpen)return
    const handler=(e:MouseEvent)=>{
      if(dlRef.current&&!dlRef.current.contains(e.target as Node)){
        setDlOpen(false)
      }
    }
    document.addEventListener('mousedown',handler)
    return()=>document.removeEventListener('mousedown',handler)
  },[dlOpen])

  return(
    <section id="script" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <FadeUp>
        <Label>Loader</Label>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:C.white,lineHeight:1}}>
          Cole no seu executor
        </h2>
        <p style={{fontSize:13,color:C.textD,marginTop:8}}>Compatível com a maioria dos executores</p>
      </FadeUp>
      <FadeUp delay={.08}>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:6}}>
          <Card style={{padding:'12px 14px',display:'flex',alignItems:'flex-start',gap:9,borderRadius:10}}>
            <Terminal size={11} style={{color:C.textDD,flexShrink:0,marginTop:2}} aria-hidden="true"/>
            {/* [CHANGE 13 - Código] userSelect aplicado só no código, não no root */}
            <code style={{flex:1,minWidth:0,wordBreak:'break-all',
              fontFamily:MONO_FONT,fontSize:10.5,lineHeight:1.85,
              userSelect:'text',WebkitUserSelect:'text'}}>
              <span style={{color:'#c084fc'}}>loadstring</span>
              <span style={{color:C.textDD}}>(</span>
              <span style={{color:'#7dd3fc'}}>request</span>
              <span style={{color:C.textDD}}>({'{'}</span>
              <span style={{color:C.text}}>Url</span>
              <span style={{color:C.textDD}}>=</span>
              <span style={{color:'#86efac'}}>"https://michigun.xyz/script"</span>
              <span style={{color:C.textDD}}>{'}'}).</span>
              <span style={{color:'#7dd3fc'}}>Body</span>
              <span style={{color:C.textDD}}>)()</span>
            </code>
          </Card>
          <div style={{display:'flex',gap:6}}>
            <button onClick={copy}
              aria-label={copied?'Script copiado':'Copiar script'}
              style={{
                flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                padding:'10px 14px',borderRadius:10,border:'1px solid',
                fontFamily:MONO_FONT,fontSize:11,fontWeight:500,cursor:'pointer',transition:'all .15s',
                background:copied?'rgba(134,239,172,0.07)':C.card,
                borderColor:copied?'rgba(134,239,172,0.22)':C.border,
                color:copied?'#86efac':C.textD,
              }}>
              {copied?<Check size={12} aria-hidden="true"/>:<Copy size={12} aria-hidden="true"/>}
              {copied?'copiado!':'copiar'}
            </button>

            {/* [CHANGE 11 - Bug] Dropdown sem overlay fixed — usa ref + mousedown listener */}
            <div ref={dlRef} style={{position:'relative',flexShrink:0}}>
              <button
                onClick={()=>setDlOpen(v=>!v)}
                aria-label="Baixar script"
                aria-expanded={dlOpen}
                style={{
                  height:'100%',padding:'0 13px',borderRadius:10,cursor:'pointer',
                  background:C.card,border:`1px solid ${C.border}`,
                  color:C.textD,display:'flex',alignItems:'center',
                }}>
                <Download size={13} aria-hidden="true"/>
              </button>
              {dlOpen&&(
                <div style={{position:'absolute',bottom:'100%',right:0,marginBottom:5,width:116,zIndex:50,
                  background:'rgba(5,5,5,0.98)',border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
                  {([['txt',FileText],['lua',FileCode]] as [string,any][]).map(([ext,Icon])=>(
                    <button key={ext}
                      aria-label={`Baixar como .${ext}`}
                      onClick={()=>{
                        if(!script)return
                        const a=document.createElement('a')
                        a.href=URL.createObjectURL(new Blob([script],{type:'application/octet-stream'}))
                        a.download=`michigun.${ext}`;a.click();setDlOpen(false)
                      }}
                      style={{width:'100%',padding:'9px 12px',display:'flex',alignItems:'center',gap:7,
                        background:'none',border:'none',borderBottom:`1px solid ${C.border}`,
                        color:C.textD,fontSize:11,cursor:'pointer',textAlign:'left',fontFamily:MONO_FONT,
                      }}>
                      <Icon size={11} aria-hidden="true"/>.{ext}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,marginTop:8,
            border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
            {[
              {Icon:Activity, label:'Execuções totais', value:data?.executions},
              {Icon:BarChart3,label:'Execuções hoje',   value:data?.daily},
            ].map((s)=>(
              <div key={s.label} style={{padding:'18px 16px',background:'rgba(255,255,255,0.015)',
                borderRight:s.label==='Execuções totais'?`1px solid ${C.border}`:'none',
                position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)`}}/>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <s.Icon size={11} style={{color:C.textDD}} aria-hidden="true"/>
                  <span style={{fontSize:9,color:C.textDD,letterSpacing:'.12em',
                    textTransform:'uppercase' as const,fontFamily:MONO_FONT}}>{s.label}</span>
                </div>
                <p className="font-display" style={{fontSize:28,fontWeight:700,
                  letterSpacing:'-.03em',color:C.white,lineHeight:1}}>
                  {s.value!=null?<CountUp end={s.value}/>:<span style={{color:C.textDD}}>—</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  )
}

function MapsSection({onFeatureClick}:{onFeatureClick:(f:Feature)=>void}){
  const[sel,setSel]=useState('global')
  const tabsRef=useRef<HTMLDivElement>(null)
  const[showFade,setShowFade]=useState(false)

  const allMaps=[
    {name:'Global',key:'global',icon:'',isGlobal:true},
    ...GAMES.map(g=>({...g,isGlobal:false})),
  ]
  const active=allMaps.find(m=>m.key===sel)
  const features=FEATURES[sel]??[]
  const grouped=features.reduce((acc,f)=>{
    if(!acc[f.category])acc[f.category]=[];acc[f.category].push(f);return acc
  },{} as Record<string,Feature[]>)

  // [CHANGE 8 - UX] Detecta se tabs têm scroll disponível para mostrar fade
  useEffect(()=>{
    const el=tabsRef.current;if(!el)return
    const check=()=>setShowFade(el.scrollWidth>el.clientWidth&&el.scrollLeft<el.scrollWidth-el.clientWidth-2)
    check()
    el.addEventListener('scroll',check)
    window.addEventListener('resize',check)
    return()=>{el.removeEventListener('scroll',check);window.removeEventListener('resize',check)}
  },[])

  return(
    <section id="mapas" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <FadeUp>
        <Label>Catálogo</Label>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:C.white,lineHeight:1}}>
          Jogos com funções exclusivas
        </h2>
      </FadeUp>
      <FadeUp delay={.08}>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>

          {/* [CHANGE 8 - UX] Container com fade lateral indicando scroll */}
          <div style={{position:'relative'}}>
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Selecionar jogo"
              style={{display:'flex',gap:5,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
              {allMaps.map(m=>{
                const a=sel===m.key
                return(
                  <button key={m.key}
                    role="tab"
                    aria-selected={a}
                    aria-controls={`tabpanel-${m.key}`}
                    onClick={()=>setSel(m.key)}
                    style={{flexShrink:0,padding:'6px 14px',borderRadius:999,border:'1px solid',
                      cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:500,transition:'all .15s',
                      background:a?'rgba(255,255,255,0.1)':C.card,
                      borderColor:a?'rgba(255,255,255,0.2)':C.border,
                      color:a?C.white:C.textD}}>
                    {m.name}
                  </button>
                )
              })}
            </div>
            {/* Fade lateral direito */}
            {showFade&&(
              <div style={{
                position:'absolute',top:0,right:0,height:'100%',width:48,pointerEvents:'none',
                background:'linear-gradient(to right,transparent,#060606)',
              }}/>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={sel}
              id={`tabpanel-${sel}`}
              role="tabpanel"
              initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:.15}}
              style={{display:'grid',gap:8,gridTemplateColumns:'1fr'}}
              className="sm:grid-cols-[180px_1fr]">

              <Card style={{borderRadius:12,overflow:'hidden',minHeight:130,position:'relative'}}>
                {active?.isGlobal?(
                  <div style={{width:'100%',height:'100%',minHeight:130,display:'flex',
                    flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                    <Globe size={32} style={{color:C.textDD}} aria-label="Funções globais"/>
                    <span style={{fontSize:8,color:C.textDD,fontFamily:MONO_FONT,
                      letterSpacing:'.1em',textTransform:'uppercase'}}>global</span>
                  </div>
                ):(
                  <div style={{position:'relative',width:'100%',height:'100%',minHeight:130}}>
                    {/* [CHANGE 3 - Performance] priority na imagem do mapa ativo (above-the-fold) */}
                    <Image src={(active as any)?.icon??''} alt={(active as any)?.name??''} fill unoptimized priority style={{objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(6,6,6,.85) 0%,transparent 55%)'}}/>
                    <div style={{position:'absolute',bottom:10,left:12}}>
                      <p className="font-display" style={{fontSize:14,fontWeight:700,color:'#f0f0f0',letterSpacing:'-.02em'}}>
                        {active?.name}
                      </p>
                      <p style={{fontSize:9,color:C.textD,fontFamily:MONO_FONT,marginTop:1}}>
                        {features.length} funções
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {Object.entries(grouped).map(([cat,items])=>(
                  <div key={cat}>
                    {Object.keys(grouped).length>1&&(
                      <p style={{fontSize:8,color:C.textDD,fontFamily:MONO_FONT,
                        letterSpacing:'.14em',textTransform:'uppercase',marginBottom:6,
                        paddingLeft:2}}>{cat}</p>
                    )}
                    <div style={{display:'grid',gap:4,
                      gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,155px),1fr))'}}>
                      {items.map(f=>(
                        <button key={f.name}
                          onClick={()=>onFeatureClick(f)}
                          aria-label={`Ver detalhes de ${f.name}`}
                          className="card-hover"
                          style={{display:'flex',alignItems:'center',gap:8,padding:'9px 10px',
                            background:C.card,border:`1px solid ${C.border}`,
                            borderRadius:9,cursor:'pointer',textAlign:'left',fontFamily:'inherit',
                            transition:'all .15s'}}>
                          <div style={{width:24,height:24,borderRadius:6,
                            background:'rgba(255,255,255,0.05)',border:`1px solid ${C.border}`,
                            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <f.icon size={11} style={{color:C.textD}} aria-hidden="true"/>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{fontSize:11,fontWeight:500,color:C.text,
                              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                              marginBottom:3}}>{f.name}</p>
                            <TBadge type={f.type}/>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </FadeUp>

    </section>
  )
}

// [CHANGE 2 - Performance] TeamCard usa proxy /api/lanyard/[id] em vez de
// chamar api.lanyard.rest diretamente, evitando CORS e permitindo cache no servidor.
// [React] memo evita re-renders quando o parent (Page) atualiza state
const TeamCard=memo(function TeamCard({dev}:{dev:typeof DEVS[0]}){
  const{data}=useSWR(`/api/lanyard/${dev.id}`,fetcher,{refreshInterval:10e3})
  const u=data?.success?data.data:null
  const spotify=u?.listening_to_spotify&&u.spotify
  const activity=u?.activities?.find((x:any)=>x.type!==4&&x.name!=='Spotify')

  let label='Offline',SIcon:any=Circle,dot='rgba(255,255,255,0.1)'
  if(spotify){label=u.spotify.song;SIcon=Music;dot='#6ee7b7'}
  else if(activity){label=activity.name==='Code'?'Codando':activity.name;SIcon=activity.name==='Code'?Code:Gamepad2;dot=C.textD}
  else{
    const st=u?.discord_status
    if(st==='online'){label='Online';dot='#6ee7b7'}
    if(st==='idle'){label='Ausente';SIcon=Moon;dot='#fbbf24'}
    if(st==='dnd'){label='Ocupado';dot='#f87171'}
  }
  const avatar=u?.discord_user?.avatar
    ?`https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png?size=128`
    :`https://ui-avatars.com/api/?name=?&background=111&color=444&size=128`
  const username=u?.discord_user?.username??'—'

  return(
    <Card style={{overflow:'hidden'}}>
      <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,
        background:`radial-gradient(ellipse,${dot}12 0%,transparent 70%)`,pointerEvents:'none'}}/>
      <div style={{padding:'14px 14px 12px',borderBottom:`1px solid ${C.border}`,
        display:'flex',alignItems:'center',gap:11}}>
        <div style={{position:'relative',flexShrink:0}}>
          <div style={{width:48,height:48,borderRadius:12,overflow:'hidden',
            border:`1px solid ${C.border}`,boxShadow:`0 0 14px ${dot}18`}}>
            <Image src={avatar} alt={`Avatar de ${username}`} width={48} height={48} unoptimized
              style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{position:'absolute',bottom:-1,right:-1,width:8,height:8,
            borderRadius:'50%',background:dot,border:`2px solid ${C.bg}`}}
            aria-hidden="true"/>
        </div>
        <div>
          <p className="font-display" style={{fontSize:16,fontWeight:700,color:C.white,
            letterSpacing:'-.02em',lineHeight:1}}>
            {username}
          </p>
          <span style={{fontSize:8,fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase' as const,marginTop:5,display:'inline-block',
            color:C.textD,border:`1px solid ${C.border}`,padding:'2px 7px',borderRadius:999}}>
            {dev.role}
          </span>
        </div>
      </div>
      <div style={{padding:'10px 14px 13px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:dot,flexShrink:0}} aria-hidden="true"/>
          <SIcon size={10} style={{color:dot}} aria-hidden="true"/>
          <span style={{fontSize:12,color:dot==='rgba(255,255,255,0.1)'?C.textDD:C.textD}}>{label}</span>
        </div>
        {spotify&&(
          <div style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:8,
            background:'rgba(110,231,183,0.05)',border:'1px solid rgba(110,231,183,0.1)'}}>
            <Music size={10} style={{color:'#6ee7b7',flexShrink:0}} aria-hidden="true"/>
            <div style={{minWidth:0}}>
              <p style={{fontSize:11,fontWeight:600,color:'#e8f8f0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {u.spotify.song}
              </p>
              <p style={{fontSize:10,color:'rgba(110,231,183,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {u.spotify.artist}
              </p>
            </div>
          </div>
        )}
        <p style={{fontSize:8,fontFamily:MONO_FONT,color:C.textDD,letterSpacing:'.04em'}}>
          {u?.discord_user?.id??dev.id}
        </p>
      </div>
    </Card>
  )
})

function TeamSection(){
  return(
    <section id="equipe" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <FadeUp>
        <Label>Equipe</Label>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:C.white,lineHeight:1}}>
          Por trás do script
        </h2>
      </FadeUp>
      <FadeUp delay={.08}>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:8,marginTop:20}}
          className="sm:grid-cols-2">
          {DEVS.map(d=><TeamCard key={d.id} dev={d}/>)}
        </div>
      </FadeUp>
    </section>
  )
}

export default function Page(){
  // [CHANGE 13 - Código] userSelect:none removido do root — aplicado pontualmente onde necessário
  // [CHANGE 7 - UX] Modal fecha com Esc
  const[activeFeature,setActiveFeature]=useState<Feature|null>(null)

  useEffect(()=>{
    if(!activeFeature)return
    const handler=(e:KeyboardEvent)=>{ if(e.key==='Escape')setActiveFeature(null) }
    document.addEventListener('keydown',handler)
    return()=>document.removeEventListener('keydown',handler)
  },[activeFeature])

  return(
    <div style={{minHeight:'100dvh',display:'flex',flexDirection:'column',background:C.bg,width:'100%'}}>
      <Toaster position="bottom-center"/>
      {/* [Acessibilidade] focus-visible global — só aparece na navegação por teclado */}
      <style>{`
        *:focus { outline: none; }
        *:focus-visible { outline: 2px solid rgba(255,255,255,0.4); outline-offset: 2px; border-radius: 4px; }
      `}</style>
      <BeamsBackground/>
      <main style={{flex:1,padding:'0 22px',position:'relative',zIndex:1,overflowX:'visible',
        width:'100%',maxWidth:780,margin:'0 auto'}}
        className="sm:px-6">
        <Hero/>
        <ErrorBoundary label="ScriptSection"><ScriptSection/></ErrorBoundary>
        <ErrorBoundary label="MapsSection"><MapsSection onFeatureClick={setActiveFeature}/></ErrorBoundary>
        <ErrorBoundary label="TeamSection"><TeamSection/></ErrorBoundary>
        <div style={{height:80}}/>
      </main>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:'12px 22px',
        display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
        <span style={{fontSize:9,color:C.textDD,fontFamily:MONO_FONT}}>
          © 2026 michigun.xyz
        </span>
      </footer>

      {/* [CHANGE 6 - UX] Modal fecha com Esc (listener acima) + aria adequado */}
      <AnimatePresence>
        {activeFeature&&(
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${activeFeature.name}`}
            style={{position:'fixed',inset:0,zIndex:99999,
              display:'flex',alignItems:'center',justifyContent:'center',padding:20,
              isolation:'isolate'}}
            onClick={()=>setActiveFeature(null)}>
            <div style={{position:'absolute',inset:0,background:'rgba(4,4,4,0.88)',backdropFilter:'blur(14px)'}}/>
            <motion.div
              initial={{opacity:0,scale:.95,y:8}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:.95,y:8}} transition={{duration:.18,ease:[.22,1,.36,1]}}
              style={{position:'relative',width:'100%',maxWidth:310,zIndex:1,
                background:'rgba(10,10,10,0.99)',border:`1px solid ${C.borderH}`,
                borderRadius:16,padding:22,boxShadow:'0 24px 60px rgba(0,0,0,0.6)'}}
              onClick={e=>e.stopPropagation()}>
              <div style={{position:'absolute',top:0,left:'15%',right:'15%',height:1,
                background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)'}}/>
              <button
                onClick={()=>setActiveFeature(null)}
                aria-label="Fechar"
                style={{position:'absolute',top:12,right:12,
                  background:'rgba(255,255,255,0.05)',border:`1px solid ${C.border}`,
                  borderRadius:7,width:26,height:26,display:'flex',alignItems:'center',
                  justifyContent:'center',color:C.textD,cursor:'pointer'}}>
                <X size={12} aria-hidden="true"/>
              </button>
              <TBadge type={activeFeature.type}/>
              <h3 className="font-display" style={{fontSize:20,fontWeight:700,color:C.white,
                margin:'10px 0 6px',letterSpacing:'-.02em'}}>{activeFeature.name}</h3>
              <p style={{fontSize:13,color:C.textD,lineHeight:1.65}}>{activeFeature.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}