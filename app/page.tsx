'use client'
import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
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

const PALETTE = {
  bg:      '#050505',
  surface: 'rgba(255,255,255,0.025)',
  rim:     'rgba(255,255,255,0.06)',
  rimHot:  'rgba(255,255,255,0.11)',
  muted:   '#a0a0a0',
  faint:   'rgba(160,160,160,0.38)',
  ghost:   'rgba(160,160,160,0.16)',
  snow:    '#f0f0f0',
}

const DISCORD_URL = 'https://discord.gg/pWeJUBabvF'

const CREW = [
  { id:'1163467888259239996', role:'Dev' },
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

interface ParticleBeam{x:number;y:number;w:number;len:number;angle:number;speed:number;op:number;pulse:number;ps:number}
interface ParticleBeamGrad extends ParticleBeam { grad?: CanvasGradient }

function ParticleCanvas(){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const beamList=useRef<ParticleBeamGrad[]>([])
  const rafId=useRef(0)
  const noMotion=useRef(
    typeof window!=='undefined'
      ?window.matchMedia('(prefers-reduced-motion: reduce)').matches
      :false
  )

  useEffect(()=>{
    const cv=canvasRef.current;if(!cv)return
    const ctx=cv.getContext('2d');if(!ctx){cv.style.display='none';return}
    if(noMotion.current){cv.style.display='none';return}

    const mob=innerWidth<768
    const TOTAL=mob?6:18
    const BLUR=mob?0:28
    const DPR=mob?1:Math.min((typeof devicePixelRatio!=='undefined'?devicePixelRatio:1)||1,2)

    const spawn=():ParticleBeamGrad=>({
      x:Math.random()*innerWidth*1.5-innerWidth*.25,
      y:Math.random()*innerHeight*1.5-innerHeight*.25,
      w:mob?30+Math.random()*40:20+Math.random()*45,
      len:innerHeight*2.5,
      angle:-35+Math.random()*10,
      speed:mob?.2+Math.random()*.3:.35+Math.random()*.7,
      op:mob?.04+Math.random()*.06:.03+Math.random()*.06,
      pulse:Math.random()*Math.PI*2,
      ps:mob?.008:.012+Math.random()*.02,
      grad:undefined,
    })

    const bakeGrad=(b:ParticleBeamGrad)=>{
      const g=ctx.createLinearGradient(0,0,0,b.len)
      g.addColorStop(0,`rgba(255,255,255,0)`)
      g.addColorStop(.15,`rgba(255,255,255,${b.op*.5})`)
      g.addColorStop(.5,`rgba(255,255,255,${b.op})`)
      g.addColorStop(.85,`rgba(255,255,255,${b.op*.5})`)
      g.addColorStop(1,`rgba(255,255,255,0)`)
      b.grad=g
    }

    const onResize=()=>{
      cv.width=innerWidth*DPR;cv.height=innerHeight*DPR
      cv.style.width=`${innerWidth}px`;cv.style.height=`${innerHeight}px`
      ctx.scale(DPR,DPR)
      beamList.current=Array.from({length:TOTAL},()=>{const b=spawn();bakeGrad(b);return b})
    }

    const recycle=(b:ParticleBeamGrad,i:number)=>{
      const seg=innerWidth/3;b.y=innerHeight+100
      b.x=(i%3)*seg+seg/2+(Math.random()-.5)*seg*.5
      b.w=mob?40+Math.random()*50:50+Math.random()*60
      b.speed=mob?.18+Math.random()*.25:.3+Math.random()*.4
      b.op=mob?.035+Math.random()*.05:.025+Math.random()*.05
      bakeGrad(b)
    }

    const paint=(b:ParticleBeamGrad)=>{
      if(!b.grad)return
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle*Math.PI/180)
      ctx.globalAlpha=0.8+Math.sin(b.pulse)*.2
      ctx.fillStyle=b.grad;ctx.fillRect(-b.w/2,0,b.w,b.len)
      ctx.globalAlpha=1;ctx.restore()
    }

    let lastTs=0
    const FPS=mob?30:60
    const STEP=1000/FPS

    const loop=(ts:number)=>{
      rafId.current=requestAnimationFrame(loop)
      if(ts-lastTs<STEP)return
      lastTs=ts
      ctx.clearRect(0,0,cv.width,cv.height)
      if(BLUR>0)ctx.filter=`blur(${BLUR}px)`
      beamList.current.forEach((b,i)=>{
        b.y-=b.speed;b.pulse+=b.ps
        if(b.y+b.len<-100)recycle(b,i)
        paint(b)
      })
      if(BLUR>0)ctx.filter='none'
    }

    onResize();addEventListener('resize',onResize);rafId.current=requestAnimationFrame(loop)
    return()=>{removeEventListener('resize',onResize);cancelAnimationFrame(rafId.current)}
  },[])

  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none',opacity:.55,willChange:'transform'}}/>
}

function Panel({children,style={},onClick}:{children:React.ReactNode;style?:React.CSSProperties;onClick?:()=>void}){
  return(
    <div onClick={onClick} className="card-hover"
      style={{position:'relative',borderRadius:12,overflow:'hidden',
        background:PALETTE.surface,border:`1px solid ${PALETTE.rim}`,
        cursor:onClick?'pointer':'default',...style}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,pointerEvents:'none',
        background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.055),transparent)`}}/>
      {children}
    </div>
  )
}

function Eyebrow({children}:{children:React.ReactNode}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{height:1,width:24,background:`linear-gradient(90deg,transparent,${PALETTE.rim})`}}/>
      <span style={{fontSize:9,fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase' as const,color:PALETTE.ghost}}>
        {children}
      </span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${PALETTE.rim},transparent)`}}/>
    </div>
  )
}

function RiskTag({risk}:{risk:RiskLevel}){
  const cfg={
    safe:  {l:'Seguro',I:Shield,       c:'#86efac',bg:'rgba(134,239,172,0.07)',b:'rgba(134,239,172,0.15)'},
    risk:  {l:'Risco', I:AlertTriangle,c:'#fbbf24',bg:'rgba(251,191,36,0.07)', b:'rgba(251,191,36,0.15)'},
    visual:{l:'Visual',I:Sparkles,     c:'#c4b5fd',bg:'rgba(196,181,253,0.07)',b:'rgba(196,181,253,0.15)'},
  }[risk]
  return(
    <span style={{display:'inline-flex',alignItems:'center',gap:3,
      fontSize:8,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase' as const,
      color:cfg.c,background:cfg.bg,border:`1px solid ${cfg.b}`,padding:'2px 6px',borderRadius:4,whiteSpace:'nowrap' as const}}>
      <cfg.I size={7}/> {cfg.l}
    </span>
  )
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const ref=useRef(null)
  const visible=useInView(ref,{once:true,amount:0.1})
  const noMotion=useReducedMotion()
  const[mob,setMob]=useState(false)
  useEffect(()=>{ setMob(window.innerWidth<768) },[])
  if(mob||noMotion) return <div>{children}</div>
  return(
    <motion.div ref={ref} initial={{opacity:0,y:14}}
      animate={visible?{opacity:1,y:0}:{}}
      transition={{duration:.45,ease:[.22,1,.36,1],delay}}>
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

const MONO='var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)'

function HeroSection(){
  return(
    <section style={{paddingTop:56,position:'relative',zIndex:1}}>
      <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{duration:.4}}
        style={{display:'flex',alignItems:'center',gap:10,marginBottom:40}}>
        <div style={{width:36,height:36,borderRadius:10,overflow:'hidden',
          border:`1px solid ${PALETTE.rim}`,flexShrink:0}}>
          <Image src="/avatar.png" alt="Logo michigun.xyz" width={36} height={36} priority
            style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <span style={{fontSize:12,color:PALETTE.faint,fontFamily:MONO,letterSpacing:'.04em'}}>
          michigun.xyz
        </span>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer"
          aria-label="Entrar no Discord"
          style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:6,
            fontSize:11,color:PALETTE.faint,textDecoration:'none',padding:'6px 14px',
            border:`1px solid ${PALETTE.rim}`,borderRadius:999,background:PALETTE.surface,transition:'all .2s',
            flexShrink:0}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=PALETTE.rimHot;(e.currentTarget as HTMLElement).style.color=PALETTE.muted}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=PALETTE.rim;(e.currentTarget as HTMLElement).style.color=PALETTE.faint}}>
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
        <p style={{fontSize:14,color:PALETTE.faint,lineHeight:1.7,maxWidth:320}}>
          Script para Exército Brasileiro no Roblox.<br/>por @fp3.
        </p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button
            onClick={()=>{ const b=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'; document.getElementById('script')?.scrollIntoView({behavior:b as ScrollBehavior}) }}
            aria-label="Ir para a seção do script"
            style={{position:'relative',display:'inline-flex',alignItems:'center',gap:7,
              padding:'10px 22px',borderRadius:999,fontSize:13,fontWeight:600,
              background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',
              color:PALETTE.snow,cursor:'pointer',fontFamily:'inherit',overflow:'hidden',transition:'all .2s'}}>
            <span style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,
              background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)'}}/>
            <span style={{position:'relative'}}>Pegar o script</span>
            <ArrowRight size={13} aria-hidden="true"/>
          </button>
          <button
            onClick={()=>{ const b=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'; document.getElementById('arenas')?.scrollIntoView({behavior:b as ScrollBehavior}) }}
            aria-label="Ver mapas disponíveis"
            style={{display:'inline-flex',alignItems:'center',gap:6,
              padding:'10px 20px',borderRadius:999,fontSize:13,fontWeight:500,
              background:PALETTE.surface,border:`1px solid ${PALETTE.rim}`,
              color:PALETTE.faint,cursor:'pointer',fontFamily:'inherit',transition:'all .2s'}}>
            Ver mapas
          </button>
        </div>
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
      style:{background:'rgba(10,10,10,0.95)',color:'#86efac',border:'1px solid rgba(134,239,172,0.2)',fontSize:'13px'},
      iconTheme:{primary:'#86efac',secondary:'rgba(10,10,10,0.95)'},
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
    <section id="script" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <Reveal>
        <Eyebrow>Script</Eyebrow>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:PALETTE.snow,lineHeight:1}}>
          Cole no seu executor
        </h2>
        <p style={{fontSize:13,color:PALETTE.faint,marginTop:8}}>Compatível com a maioria dos executores</p>
      </Reveal>
      <Reveal delay={.08}>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:6}}>
          <Panel style={{padding:'12px 14px',display:'flex',alignItems:'flex-start',gap:9,borderRadius:10}}>
            <Terminal size={11} style={{color:PALETTE.ghost,flexShrink:0,marginTop:2}} aria-hidden="true"/>
            <code style={{flex:1,minWidth:0,wordBreak:'break-all',
              fontFamily:MONO,fontSize:10.5,lineHeight:1.85,
              userSelect:'text',WebkitUserSelect:'text'}}>
              <span style={{color:'#c084fc'}}>loadstring</span>
              <span style={{color:PALETTE.ghost}}>(</span>
              <span style={{color:'#7dd3fc'}}>request</span>
              <span style={{color:PALETTE.ghost}}>({"{"}</span>
              <span style={{color:PALETTE.muted}}>Url</span>
              <span style={{color:PALETTE.ghost}}>=</span>
              <span style={{color:'#86efac'}}>"https://michigun.xyz/scripts/main.lua"</span>
              <span style={{color:PALETTE.ghost}}>{"}"}).</span>
              <span style={{color:'#7dd3fc'}}>Body</span>
              <span style={{color:PALETTE.ghost}}>()()</span>
            </code>
          </Panel>
          <div style={{display:'flex',gap:6}}>
            <button onClick={handleCopy}
              aria-label={copied?'Script copiado':'Copiar script'}
              style={{
                flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                padding:'10px 14px',borderRadius:10,border:'1px solid',
                fontFamily:MONO,fontSize:11,fontWeight:500,cursor:'pointer',transition:'all .15s',
                background:copied?'rgba(134,239,172,0.07)':PALETTE.surface,
                borderColor:copied?'rgba(134,239,172,0.22)':PALETTE.rim,
                color:copied?'#86efac':PALETTE.faint,
              }}>
              {copied?<Check size={12} aria-hidden="true"/>:<Copy size={12} aria-hidden="true"/>}
              {copied?'copiado!':'copiar'}
            </button>
            <div ref={dlRef} style={{position:'relative',flexShrink:0}}>
              <button
                onClick={()=>setDlOpen(v=>!v)}
                aria-label="Baixar script"
                aria-expanded={dlOpen}
                style={{
                  height:'100%',padding:'0 13px',borderRadius:10,cursor:'pointer',
                  background:PALETTE.surface,border:`1px solid ${PALETTE.rim}`,
                  color:PALETTE.faint,display:'flex',alignItems:'center',
                }}>
                <Download size={13} aria-hidden="true"/>
              </button>
              {dlOpen&&(
                <div style={{position:'absolute',bottom:'100%',right:0,marginBottom:5,width:116,zIndex:50,
                  background:'rgba(5,5,5,0.98)',border:`1px solid ${PALETTE.rim}`,borderRadius:10,overflow:'hidden'}}>
                  {([['txt',FileText],['lua',FileCode]] as [string,any][]).map(([ext,Icon])=>(
                    <button key={ext}
                      aria-label={`Baixar como .${ext}`}
                      onClick={()=>{
                        if(!scriptText)return
                        const a=document.createElement('a')
                        a.href=URL.createObjectURL(new Blob([scriptText],{type:'application/octet-stream'}))
                        a.download=`michigun.${ext}`;a.click();setDlOpen(false)
                      }}
                      style={{width:'100%',padding:'9px 12px',display:'flex',alignItems:'center',gap:7,
                        background:'none',border:'none',borderBottom:`1px solid ${PALETTE.rim}`,
                        color:PALETTE.faint,fontSize:11,cursor:'pointer',textAlign:'left',fontFamily:MONO,
                      }}>
                      <Icon size={11} aria-hidden="true"/>.{ext}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,marginTop:8,
            border:`1px solid ${PALETTE.rim}`,borderRadius:12,overflow:'hidden'}}>
            {[
              {Icon:Activity, label:'Execuções totais', value:stats?.executions},
              {Icon:BarChart3,label:'Execuções hoje',   value:stats?.daily},
            ].map((s)=>(
              <div key={s.label} style={{padding:'18px 16px',background:'rgba(255,255,255,0.015)',
                borderRight:s.label==='Execuções totais'?`1px solid ${PALETTE.rim}`:'none',
                position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)`}}/>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <s.Icon size={11} style={{color:PALETTE.ghost}} aria-hidden="true"/>
                  <span style={{fontSize:9,color:PALETTE.ghost,letterSpacing:'.12em',
                    textTransform:'uppercase' as const,fontFamily:MONO}}>{s.label}</span>
                </div>
                <p className="font-display" style={{fontSize:28,fontWeight:700,
                  letterSpacing:'-.03em',color:PALETTE.snow,lineHeight:1}}>
                  {statsErr?<span style={{color:'#f87171',fontSize:10}}>erro</span>:s.value!=null?<Ticker target={s.value}/>:<span style={{color:PALETTE.ghost}}>—</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function ArenasSection({onAbilityClick}:{onAbilityClick:(a:Ability)=>void}){
  const[sel,setSel]=useState('global')
  const tabsEl=useRef<HTMLDivElement>(null)
  const[fade,setFade]=useState(false)

  const allArenas=[
    {name:'Global',slug:'global',thumb:'',isGlobal:true},
    ...ARENAS.map(g=>({...g,isGlobal:false})),
  ]
  const current=allArenas.find(m=>m.slug===sel)
  const abilities=ABILITIES[sel]??[]
  const byCategory=abilities.reduce((acc,a)=>{
    if(!acc[a.category])acc[a.category]=[];acc[a.category].push(a);return acc
  },{} as Record<string,Ability[]>)

  useEffect(()=>{
    const el=tabsEl.current;if(!el)return
    const check=()=>setFade(el.scrollWidth>el.clientWidth&&el.scrollLeft<el.scrollWidth-el.clientWidth-2)
    check()
    el.addEventListener('scroll',check)
    window.addEventListener('resize',check)
    return()=>{el.removeEventListener('scroll',check);window.removeEventListener('resize',check)}
  },[])

  return(
    <section id="arenas" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <Reveal>
        <Eyebrow>Funções</Eyebrow>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:PALETTE.snow,lineHeight:1}}>
          Jogos com funções exclusivas
        </h2>
      </Reveal>
      <Reveal delay={.08}>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>
          <div style={{position:'relative'}}>
            <div
              ref={tabsEl}
              role="tablist"
              aria-label="Selecionar jogo"
              style={{display:'flex',gap:5,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
              {allArenas.map(m=>{
                const active=sel===m.slug
                return(
                  <button key={m.slug}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${m.slug}`}
                    onClick={()=>setSel(m.slug)}
                    style={{flexShrink:0,padding:'6px 14px',borderRadius:999,border:'1px solid',
                      cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:500,transition:'all .15s',
                      background:active?'rgba(255,255,255,0.1)':PALETTE.surface,
                      borderColor:active?'rgba(255,255,255,0.2)':PALETTE.rim,
                      color:active?PALETTE.snow:PALETTE.faint}}>
                    {m.name}
                  </button>
                )
              })}
            </div>
            {fade&&(
              <div style={{
                position:'absolute',top:0,right:0,height:'100%',width:48,pointerEvents:'none',
                background:`linear-gradient(to right,transparent,${PALETTE.bg})`,
              }}/>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={sel}
              id={`panel-${sel}`}
              role="tabpanel"
              initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:.15}}
              style={{display:'grid',gap:8,gridTemplateColumns:'1fr'}}
              className="sm:grid-cols-[180px_1fr]">

              <Panel style={{borderRadius:12,overflow:'hidden',minHeight:130,position:'relative'}}>
                {current?.isGlobal?(
                  <div style={{width:'100%',height:'100%',minHeight:130,display:'flex',
                    flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                    <Globe size={32} style={{color:PALETTE.ghost}} aria-label="Funções globais"/>
                    <span style={{fontSize:8,color:PALETTE.ghost,fontFamily:MONO,
                      letterSpacing:'.1em',textTransform:'uppercase'}}>global</span>
                  </div>
                ):(
                  <div style={{position:'relative',width:'100%',height:'100%',minHeight:130}}>
                    <Image src={(current as any)?.thumb??''} alt={(current as any)?.name??''} fill priority style={{objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,5,5,.85) 0%,transparent 55%)'}}/>
                    <div style={{position:'absolute',bottom:10,left:12}}>
                      <p className="font-display" style={{fontSize:14,fontWeight:700,color:'#f0f0f0',letterSpacing:'-.02em'}}>
                        {current?.name}
                      </p>
                      <p style={{fontSize:9,color:PALETTE.faint,fontFamily:MONO,marginTop:1}}>
                        {abilities.length} funções
                      </p>
                    </div>
                  </div>
                )}
              </Panel>

              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {Object.entries(byCategory).map(([cat,items])=>(
                  <div key={cat}>
                    {Object.keys(byCategory).length>1&&(
                      <p style={{fontSize:8,color:PALETTE.ghost,fontFamily:MONO,
                        letterSpacing:'.14em',textTransform:'uppercase',marginBottom:6,
                        paddingLeft:2}}>{cat}</p>
                    )}
                    <div style={{display:'grid',gap:4,
                      gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,155px),1fr))'}}>
                      {items.map(a=>(
                        <button key={a.name}
                          onClick={()=>onAbilityClick(a)}
                          aria-label={`Ver detalhes de ${a.name}`}
                          className="card-hover"
                          style={{display:'flex',alignItems:'center',gap:8,padding:'9px 10px',
                            background:PALETTE.surface,border:`1px solid ${PALETTE.rim}`,
                            borderRadius:9,cursor:'pointer',textAlign:'left',fontFamily:'inherit',
                            transition:'all .15s'}}>
                          <div style={{width:24,height:24,borderRadius:6,
                            background:'rgba(255,255,255,0.04)',border:`1px solid ${PALETTE.rim}`,
                            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <a.icon size={11} style={{color:PALETTE.faint}} aria-hidden="true"/>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{fontSize:11,fontWeight:500,color:PALETTE.muted,
                              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                              marginBottom:3}}>{a.name}</p>
                            <RiskTag risk={a.risk}/>
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
      </Reveal>
    </section>
  )
}

const MemberCard=memo(function MemberCard({dev}:{dev:typeof CREW[0]}){
  const{data}=useSWR(`/api/lanyard/${dev.id}`,fetcher,{refreshInterval:10e3})
  const u=data?.success?data.data:null
  const spotify=u?.listening_to_spotify&&u.spotify
  const activity=u?.activities?.find((x:any)=>x.type!==4&&x.name!=='Spotify')

  let statusLabel='Offline',StatusIcon:any=Circle,dot='rgba(255,255,255,0.1)'
  if(spotify){statusLabel=u.spotify.song;StatusIcon=Music;dot='#6ee7b7'}
  else if(activity){statusLabel=activity.name==='Code'?'Codando':activity.name;StatusIcon=activity.name==='Code'?Code:Gamepad2;dot=PALETTE.faint}
  else{
    const st=u?.discord_status
    if(st==='online'){statusLabel='Online';dot='#6ee7b7'}
    if(st==='idle'){statusLabel='Ausente';StatusIcon=Moon;dot='#fbbf24'}
    if(st==='dnd'){statusLabel='Ocupado';dot='#f87171'}
  }

  const avatarSrc=u?.discord_user?.avatar
    ?`https://cdn.discordapp.com/avatars/${dev.id}/${u.discord_user.avatar}.png?size=128`
    :`https://ui-avatars.com/api/?name=?&background=111&color=444&size=128`
  const handle=u?.discord_user?.username??'—'

  return(
    <Panel style={{overflow:'hidden'}}>
      <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,
        background:`radial-gradient(ellipse,${dot}12 0%,transparent 70%)`,pointerEvents:'none'}}/>
      <div style={{padding:'14px 14px 12px',borderBottom:`1px solid ${PALETTE.rim}`,
        display:'flex',alignItems:'center',gap:11}}>
        <div style={{position:'relative',flexShrink:0}}>
          <div style={{width:48,height:48,borderRadius:12,overflow:'hidden',
            border:`1px solid ${PALETTE.rim}`,boxShadow:`0 0 14px ${dot}18`}}>
            <Image src={avatarSrc} alt={`Avatar de ${handle}`} width={48} height={48}
              style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{position:'absolute',bottom:-1,right:-1,width:8,height:8,
            borderRadius:'50%',background:dot,border:`2px solid ${PALETTE.bg}`}}
            aria-hidden="true"/>
        </div>
        <div>
          <p className="font-display" style={{fontSize:16,fontWeight:700,color:PALETTE.snow,
            letterSpacing:'-.02em',lineHeight:1}}>
            {handle}
          </p>
          <span style={{fontSize:8,fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase' as const,marginTop:5,display:'inline-block',
            color:PALETTE.faint,border:`1px solid ${PALETTE.rim}`,padding:'2px 7px',borderRadius:999}}>
            {dev.role}
          </span>
        </div>
      </div>
      <div style={{padding:'10px 14px 13px',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:dot,flexShrink:0}} aria-hidden="true"/>
          <StatusIcon size={10} style={{color:dot}} aria-hidden="true"/>
          <span style={{fontSize:12,color:dot==='rgba(255,255,255,0.1)'?PALETTE.ghost:PALETTE.faint}}>{statusLabel}</span>
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
        <p style={{fontSize:8,fontFamily:MONO,color:PALETTE.ghost,letterSpacing:'.04em'}}>
          {u?.discord_user?.id??dev.id}
        </p>
      </div>
    </Panel>
  )
})

function CrewSection(){
  return(
    <section id="equipe" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <Reveal>
        <Eyebrow>Equipe</Eyebrow>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:PALETTE.snow,lineHeight:1}}>
          Por trás do script
        </h2>
      </Reveal>
      <Reveal delay={.08}>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:8,marginTop:20}}
          className="sm:grid-cols-2">
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
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:PALETTE.bg,width:'100%',WebkitOverflowScrolling:'touch',overflowX:'hidden'}}>
      <Toaster position="bottom-center"/>
      <Nav/>
      <ParticleCanvas/>
      <main style={{flex:1,padding:'0 22px',position:'relative',zIndex:1,overflowX:'visible',
        width:'100%',maxWidth:780,margin:'0 auto'}}
        className="sm:px-6">
        <HeroSection/>
        <SectionErrorBoundary label="ScriptPanel"><ScriptPanel/></SectionErrorBoundary>
        <SectionErrorBoundary label="ArenasSection"><ArenasSection onAbilityClick={setFocusedAbility}/></SectionErrorBoundary>
        <SectionErrorBoundary label="CrewSection"><CrewSection/></SectionErrorBoundary>
        <div style={{height:80}}/>
      </main>
      <footer style={{borderTop:`1px solid ${PALETTE.rim}`,padding:'12px 22px',
        display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
        <span style={{fontSize:9,color:PALETTE.ghost,fontFamily:MONO}}>
          © 2026 michigun.xyz
        </span>
      </footer>

      <AnimatePresence>
        {focusedAbility&&(
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${focusedAbility.name}`}
            style={{position:'fixed',inset:0,zIndex:99999,
              display:'flex',alignItems:'center',justifyContent:'center',padding:20,
              isolation:'isolate'}}
            onClick={()=>setFocusedAbility(null)}>
            <div style={{position:'absolute',inset:0,background:'rgba(4,4,4,0.88)',backdropFilter:'blur(14px)'}}/>
            <motion.div
              initial={{opacity:0,scale:.95,y:8}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:.95,y:8}} transition={{duration:.18,ease:[.22,1,.36,1]}}
              style={{position:'relative',width:'100%',maxWidth:310,zIndex:1,
                background:'rgba(10,10,10,0.99)',border:`1px solid ${PALETTE.rimHot}`,
                borderRadius:16,padding:22,boxShadow:'0 24px 60px rgba(0,0,0,0.6)'}}
              onClick={e=>e.stopPropagation()}>
              <div style={{position:'absolute',top:0,left:'15%',right:'15%',height:1,
                background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)'}}/>
              <button
                onClick={()=>setFocusedAbility(null)}
                aria-label="Fechar"
                style={{position:'absolute',top:12,right:12,
                  background:'rgba(255,255,255,0.05)',border:`1px solid ${PALETTE.rim}`,
                  borderRadius:7,width:26,height:26,display:'flex',alignItems:'center',
                  justifyContent:'center',color:PALETTE.faint,cursor:'pointer'}}>
                <X size={12} aria-hidden="true"/>
              </button>
              <RiskTag risk={focusedAbility.risk}/>
              <h3 className="font-display" style={{fontSize:20,fontWeight:700,color:PALETTE.snow,
                margin:'10px 0 6px',letterSpacing:'-.02em'}}>{focusedAbility.name}</h3>
              <p style={{fontSize:13,color:PALETTE.faint,lineHeight:1.65}}>{focusedAbility.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}