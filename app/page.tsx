'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import {
  Copy, Check, Download, FileCode, FileText, Activity, Clock,
  BarChart3, Music, Code, Gamepad2, Moon, Circle, Globe, Skull,
  TabletSmartphone, Coins, Magnet, X, Crosshair, ScanSearch, Eye,
  Zap, GitMerge, Layers, Bot, UserX, Ghost, Wind, Rocket, Shuffle,
  Wrench, Laugh, Timer, Terminal, ArrowRight, Shield, AlertTriangle,
  Sparkles, ChevronRight,
} from 'lucide-react'
import { playSound, fetcher, cn } from '@/lib/utils'

/* ─── Palette ─────────────────────────────────────────── */
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

/* ─── Config ──────────────────────────────────────────── */
const SCRIPT = 'loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()'
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

/* ─── Beams Background ────────────────────────────────── */
interface Beam{x:number;y:number;w:number;len:number;angle:number;speed:number;op:number;pulse:number;ps:number}
function BeamsBackground(){
  const ref=useRef<HTMLCanvasElement>(null)
  const beams=useRef<Beam[]>([])
  const raf=useRef(0)
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return
    const ctx=canvas.getContext('2d');if(!ctx)return

    // Detect mobile — reduce beam count and disable blur on mobile for performance
    const isMobile=innerWidth<768
    const COUNT=isMobile?6:18
    const BLUR=isMobile?0:28  // no ctx.filter on mobile — biggest perf win
    const DPR=isMobile?1:Math.min(devicePixelRatio||1,2)  // cap DPR on mobile

    const mk=():Beam=>({
      x:Math.random()*innerWidth*1.5-innerWidth*.25,
      y:Math.random()*innerHeight*1.5-innerHeight*.25,
      w:isMobile?30+Math.random()*40:20+Math.random()*45,
      len:innerHeight*2.5,
      angle:-35+Math.random()*10,
      speed:isMobile?.2+Math.random()*.3:.35+Math.random()*.7,
      op:isMobile?.04+Math.random()*.06:.03+Math.random()*.06,
      pulse:Math.random()*Math.PI*2,
      ps:isMobile?.008:.012+Math.random()*.02,
    })
    const resize=()=>{
      canvas.width=innerWidth*DPR;canvas.height=innerHeight*DPR
      canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`
      ctx.scale(DPR,DPR);beams.current=Array.from({length:COUNT},mk)
    }
    const reset=(b:Beam,i:number)=>{
      const s=innerWidth/3;b.y=innerHeight+100
      b.x=(i%3)*s+s/2+(Math.random()-.5)*s*.5
      b.w=isMobile?40+Math.random()*50:50+Math.random()*60
      b.speed=isMobile?.18+Math.random()*.25:.3+Math.random()*.4
      b.op=isMobile?.035+Math.random()*.05:.025+Math.random()*.05
    }
    const draw=(b:Beam)=>{
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle*Math.PI/180)
      const o=b.op*(0.8+Math.sin(b.pulse)*.2)
      const g=ctx.createLinearGradient(0,0,0,b.len)
      g.addColorStop(0,`rgba(255,255,255,0)`)
      g.addColorStop(.15,`rgba(255,255,255,${o*.5})`)
      g.addColorStop(.5,`rgba(255,255,255,${o})`)
      g.addColorStop(.85,`rgba(255,255,255,${o*.5})`)
      g.addColorStop(1,`rgba(255,255,255,0)`)
      ctx.fillStyle=g;ctx.fillRect(-b.w/2,0,b.w,b.len);ctx.restore()
    }

    // Throttle to ~30fps on mobile
    let last=0
    const FPS=isMobile?30:60
    const INTERVAL=1000/FPS

    const animate=(ts:number)=>{
      raf.current=requestAnimationFrame(animate)
      if(ts-last<INTERVAL)return
      last=ts
      ctx.clearRect(0,0,canvas.width,canvas.height)
      if(BLUR>0)ctx.filter=`blur(${BLUR}px)` // skip filter entirely on mobile
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

/* ─── UI Primitives ───────────────────────────────────── */
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

function FadeUp({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const ref=useRef(null)
  const v=useInView(ref,{once:true,margin:'-40px'})
  const[isMobile,setIsMobile]=useState(false)
  useEffect(()=>{ setIsMobile(window.innerWidth<768) },[])
  if(isMobile) return <div>{children}</div>
  return(
    <motion.div ref={ref} initial={{opacity:0,y:14}}
      animate={v?{opacity:1,y:0}:{}}
      transition={{duration:.45,ease:[.22,1,.36,1],delay}}>
      {children}
    </motion.div>
  )
}

const CountUp=({end}:{end:number})=>{
  const[n,setN]=useState(0)
  useEffect(()=>{
    let v=0;const step=end/(700/16)
    const t=setInterval(()=>{v+=step;if(v>=end){setN(end);clearInterval(t)}else setN(Math.floor(v))},16)
    return()=>clearInterval(t)
  },[end])
  return<>{n.toLocaleString()}</>
}

const Countdown=()=>{
  const[v,setV]=useState('')
  useEffect(()=>{
    const tick=()=>{
      const now=new Date(),next=new Date(now);next.setHours(24,0,0,0)
      const d=next.getTime()-now.getTime()
      setV(`${Math.floor((d/36e5)%24)}h ${String(Math.floor((d/6e4)%60)).padStart(2,'0')}m`)
    }
    const t=setInterval(tick,6e4);tick();return()=>clearInterval(t)
  },[])
  return<>{v}</>
}

/* ─── Hero ─────────────────────────────────────────────── */
function Hero(){
  const total=Object.values(FEATURES).flat().length

  return(
    <section style={{paddingTop:56,position:'relative',zIndex:1}}>

      {/* Avatar — left aligned, small */}
      <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{duration:.4}}
        style={{display:'flex',alignItems:'center',gap:10,marginBottom:40}}>
        <div style={{width:36,height:36,borderRadius:10,overflow:'hidden',
          border:`1px solid ${C.border}`,flexShrink:0}}>
          <Image src="/avatar.png" alt="m" width={36} height={36} unoptimized
            style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <span style={{fontSize:12,color:C.textD,fontFamily:'var(--font-mono)',letterSpacing:'.04em'}}>
          michigun.xyz
        </span>
        {/* Discord pill — right side of logo row */}
        <a href={DISCORD} target="_blank" rel="noreferrer"
          style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:6,
            fontSize:11,color:C.textD,textDecoration:'none',padding:'6px 14px',
            border:`1px solid ${C.border}`,borderRadius:999,background:C.card,transition:'all .2s',
            flexShrink:0}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.borderH;(e.currentTarget as HTMLElement).style.color=C.text}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;(e.currentTarget as HTMLElement).style.color=C.textD}}>
          <svg width="14" height="14" viewBox="0 0 71 55" fill="currentColor" style={{flexShrink:0}}>
            <path d="M60.105 4.898A58.549 58.549 0 0 0 45.653.505a.225.225 0 0 0-.238.113c-.622 1.108-1.311 2.554-1.794 3.689a54.112 54.112 0 0 0-16.24 0 37.303 37.303 0 0 0-1.822-3.689.234.234 0 0 0-.238-.113A58.348 58.348 0 0 0 10.87 4.898a.212.212 0 0 0-.098.084C1.577 18.561-.944 31.835.293 44.944a.25.25 0 0 0 .095.17 58.783 58.783 0 0 0 17.709 8.958.237.237 0 0 0 .258-.085 42.012 42.012 0 0 0 3.622-5.893.232.232 0 0 0-.127-.323 38.715 38.715 0 0 1-5.532-2.636.235.235 0 0 1-.023-.39 30.272 30.272 0 0 0 1.099-.862.226.226 0 0 1 .236-.032c11.609 5.304 24.177 5.304 35.649 0a.225.225 0 0 1 .238.029c.356.293.728.588 1.101.865a.235.235 0 0 1-.02.39 36.368 36.368 0 0 1-5.535 2.634.233.233 0 0 0-.124.326 47.166 47.166 0 0 0 3.619 5.89.234.234 0 0 0 .259.086 58.618 58.618 0 0 0 17.722-8.958.236.236 0 0 0 .095-.167c1.48-15.315-2.48-28.482-10.497-40.062a.186.186 0 0 0-.096-.086zM23.725 37.033c-3.504 0-6.391-3.218-6.391-7.17s2.83-7.17 6.391-7.17c3.588 0 6.447 3.245 6.391 7.17 0 3.952-2.83 7.17-6.391 7.17zm23.624 0c-3.504 0-6.391-3.218-6.391-7.17s2.83-7.17 6.391-7.17c3.588 0 6.447 3.245 6.391 7.17 0 3.952-2.803 7.17-6.391 7.17z"/>
          </svg>
          Discord
        </a>
      </motion.div>

      {/* MEGA TITLE — full bleed, no container */}
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

      {/* Sub + CTAs — left aligned, offset */}
      <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.45,delay:.14}}
        style={{display:'flex',flexDirection:'column',gap:20,paddingLeft:2}}>
        <p style={{fontSize:14,color:C.textD,lineHeight:1.7,maxWidth:320}}>
          Script para Exército Brasileiro no Roblox.<br/>por @fp3.
        </p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button onClick={()=>document.getElementById('script')?.scrollIntoView({behavior:'smooth'})}
            style={{position:'relative',display:'inline-flex',alignItems:'center',gap:7,
              padding:'10px 22px',borderRadius:999,fontSize:13,fontWeight:600,
              background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',
              color:C.white,cursor:'pointer',fontFamily:'inherit',overflow:'hidden',transition:'all .2s'}}>
            <span style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,
              background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)'}}/>
            <span style={{position:'relative'}}>Pegar o script</span>
            <ArrowRight size={13}/>
          </button>
          <button onClick={()=>document.getElementById('mapas')?.scrollIntoView({behavior:'smooth'})}
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

/* ─── Script Section ──────────────────────────────────── */
function ScriptSection(){
  const[copied,setCopied]=useState(false)
  const[dlOpen,setDlOpen]=useState(false)
  const{data}=useSWR('/api/stats',fetcher,{refreshInterval:15e3})
  const copy=useCallback(()=>{
    playSound('click');navigator.clipboard.writeText(SCRIPT)
    setCopied(true);setTimeout(()=>setCopied(false),2000)
  },[])

  return(
    <section id="script" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <FadeUp>
        <Label>Loader</Label>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:C.white,lineHeight:1}}>
          Cole no seu executor
        </h2>
        <p style={{fontSize:13,color:C.textD,marginTop:8}}>Compatível com os principais executores.</p>
      </FadeUp>
      <FadeUp delay={.08}>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:6}}>
          {/* executions strip */}
          <div style={{display:'flex',alignItems:'center',gap:16,padding:'9px 14px',
            border:`1px solid ${C.border}`,borderRadius:10,background:C.card,flexWrap:'wrap'}}>
            {[
              {Icon:Activity, l:'Total',v:data?.executions},
              {Icon:BarChart3,l:'Hoje', v:data?.daily},
              {Icon:Clock,    l:'Reset',v:'cd'},
            ].map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:5}}>
                <s.Icon size={9} style={{color:C.textDD}}/>
                <span style={{fontSize:10,color:C.textDD,fontFamily:'var(--font-mono)'}}>{s.l}</span>
                <span style={{fontSize:11,fontWeight:600,color:C.text,fontFamily:'var(--font-mono)'}}>
                  {s.v==='cd'?<Countdown/>:s.v!=null?<CountUp end={s.v as number}/>:'—'}
                </span>
              </div>
            ))}
          </div>
          {/* code */}
          <Card style={{padding:'12px 14px',display:'flex',alignItems:'flex-start',gap:9,borderRadius:10}}>
            <Terminal size={11} style={{color:C.textDD,flexShrink:0,marginTop:2}}/>
            <code style={{flex:1,minWidth:0,wordBreak:'break-all',
              fontFamily:'var(--font-mono)',fontSize:10.5,lineHeight:1.85}}>
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
            <button onClick={copy} style={{
              flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
              padding:'10px 14px',borderRadius:10,border:'1px solid',
              fontFamily:'var(--font-mono)',fontSize:11,fontWeight:500,cursor:'pointer',transition:'all .15s',
              background:copied?'rgba(134,239,172,0.07)':C.card,
              borderColor:copied?'rgba(134,239,172,0.22)':C.border,
              color:copied?'#86efac':C.textD,
            }}>
              {copied?<Check size={12}/>:<Copy size={12}/>}{copied?'copiado!':'copiar'}
            </button>
            <div style={{position:'relative',flexShrink:0}}>
              <button onClick={()=>setDlOpen(v=>!v)} style={{
                height:'100%',padding:'0 13px',borderRadius:10,cursor:'pointer',
                background:C.card,border:`1px solid ${C.border}`,
                color:C.textD,display:'flex',alignItems:'center',
              }}><Download size={13}/></button>
              {dlOpen&&(<>
                <div style={{position:'fixed',inset:0,zIndex:40}} onClick={()=>setDlOpen(false)}/>
                <div style={{position:'absolute',bottom:'100%',right:0,marginBottom:5,width:116,zIndex:50,
                  background:'rgba(5,5,5,0.98)',border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
                  {([['txt',FileText],['lua',FileCode]] as any[]).map(([ext,Icon])=>(
                    <button key={ext} onClick={()=>{
                      const a=document.createElement('a')
                      a.href=URL.createObjectURL(new Blob([SCRIPT],{type:'application/octet-stream'}))
                      a.download=`michigun.${ext}`;a.click();setDlOpen(false)
                    }} style={{width:'100%',padding:'9px 12px',display:'flex',alignItems:'center',gap:7,
                      background:'none',border:'none',borderBottom:`1px solid ${C.border}`,
                      color:C.textD,fontSize:11,cursor:'pointer',textAlign:'left',fontFamily:'var(--font-mono)',
                    }}><Icon size={11}/>.{ext}</button>
                  ))}
                </div>
              </>)}
            </div>
          </div>

          {/* ── Executions stats panel ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,marginTop:8,
            border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
            {[
              {Icon:Activity, label:'Execuções totais', value:data?.executions},
              {Icon:BarChart3,label:'Execuções hoje',   value:data?.daily},
            ].map((s,i)=>(
              <div key={i} style={{padding:'18px 16px',background:'rgba(255,255,255,0.015)',
                borderRight:i===0?`1px solid ${C.border}`:'none',
                position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,
                  background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)`}}/>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <s.Icon size={11} style={{color:C.textDD}}/>
                  <span style={{fontSize:9,color:C.textDD,letterSpacing:'.12em',
                    textTransform:'uppercase' as const,fontFamily:'var(--font-mono)'}}>{s.label}</span>
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

/* ─── Maps Section ────────────────────────────────────── */
function MapsSection({onFeatureClick}:{onFeatureClick:(f:Feature)=>void}){
  const[sel,setSel]=useState('global')
  const allMaps=[
    {name:'Global',key:'global',icon:'',isGlobal:true},
    ...GAMES.map(g=>({...g,isGlobal:false})),
  ]
  const active=allMaps.find(m=>m.key===sel)
  const features=FEATURES[sel]??[]
  const grouped=features.reduce((acc,f)=>{
    if(!acc[f.category])acc[f.category]=[];acc[f.category].push(f);return acc
  },{} as Record<string,Feature[]>)

  return(
    <section id="mapas" style={{padding:'80px 0 0',zIndex:1,position:'relative'}}>
      <FadeUp>
        <Label>Catálogo</Label>
        <h2 className="font-display" style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,
          letterSpacing:'-.04em',marginTop:16,color:C.white,lineHeight:1}}>
          Mapas suportados
        </h2>
      </FadeUp>
      <FadeUp delay={.08}>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>
          {/* pills */}
          <div style={{display:'flex',gap:5,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
            {allMaps.map(m=>{
              const a=sel===m.key
              return(
                <button key={m.key} onClick={()=>setSel(m.key)}
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

          {/* split: thumbnail left, features right */}
          <AnimatePresence mode="wait">
            <motion.div key={sel}
              initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:.15}}
              style={{display:'grid',gap:8,gridTemplateColumns:'1fr'}}
              className="sm:grid-cols-[180px_1fr]">

              {/* thumbnail */}
              <Card style={{borderRadius:12,overflow:'hidden',minHeight:130,position:'relative'}}>
                {active?.isGlobal?(
                  <div style={{width:'100%',height:'100%',minHeight:130,display:'flex',
                    flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                    <Globe size={32} style={{color:C.textDD}}/>
                    <span style={{fontSize:8,color:C.textDD,fontFamily:'var(--font-mono)',
                      letterSpacing:'.1em',textTransform:'uppercase'}}>global</span>
                  </div>
                ):(
                  <div style={{position:'relative',width:'100%',height:'100%',minHeight:130}}>
                    <Image src={(active as any)?.icon??''} alt={active?.name??''} fill unoptimized style={{objectFit:'cover'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(6,6,6,.85) 0%,transparent 55%)'}}/>
                    <div style={{position:'absolute',bottom:10,left:12}}>
                      <p className="font-display" style={{fontSize:14,fontWeight:700,color:'#f0f0f0',letterSpacing:'-.02em'}}>
                        {active?.name}
                      </p>
                      <p style={{fontSize:9,color:C.textD,fontFamily:'var(--font-mono)',marginTop:1}}>
                        {features.length} funções
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* features grouped */}
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {Object.entries(grouped).map(([cat,items])=>(
                  <div key={cat}>
                    {Object.keys(grouped).length>1&&(
                      <p style={{fontSize:8,color:C.textDD,fontFamily:'var(--font-mono)',
                        letterSpacing:'.14em',textTransform:'uppercase',marginBottom:6,
                        paddingLeft:2}}>{cat}</p>
                    )}
                    <div style={{display:'grid',gap:4,
                      gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,155px),1fr))'}}>
                      {items.map(f=>(
                        <button key={f.name} onClick={()=>onFeatureClick(f)}
                          className="card-hover"
                          style={{display:'flex',alignItems:'center',gap:8,padding:'9px 10px',
                            background:C.card,border:`1px solid ${C.border}`,
                            borderRadius:9,cursor:'pointer',textAlign:'left',fontFamily:'inherit',
                            transition:'all .15s'}}>
                          <div style={{width:24,height:24,borderRadius:6,
                            background:'rgba(255,255,255,0.05)',border:`1px solid ${C.border}`,
                            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <f.icon size={11} style={{color:C.textD}}/>
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

/* ─── Team Section ────────────────────────────────────── */
function TeamCard({dev}:{dev:typeof DEVS[0]}){
  const{data}=useSWR(`https://api.lanyard.rest/v1/users/${dev.id}`,fetcher,{refreshInterval:10e3})
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

  return(
    <Card style={{overflow:'hidden'}}>
      <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,
        background:`radial-gradient(ellipse,${dot}12 0%,transparent 70%)`,pointerEvents:'none'}}/>
      <div style={{padding:'14px 14px 12px',borderBottom:`1px solid ${C.border}`,
        display:'flex',alignItems:'center',gap:11}}>
        <div style={{position:'relative',flexShrink:0}}>
          <div style={{width:48,height:48,borderRadius:12,overflow:'hidden',
            border:`1px solid ${C.border}`,boxShadow:`0 0 14px ${dot}18`}}>
            <Image src={avatar} alt="av" width={48} height={48} unoptimized
              style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{position:'absolute',bottom:-1,right:-1,width:8,height:8,
            borderRadius:'50%',background:dot,border:`2px solid ${C.bg}`}}/>
        </div>
        <div>
          <p className="font-display" style={{fontSize:16,fontWeight:700,color:C.white,
            letterSpacing:'-.02em',lineHeight:1}}>
            {u?.discord_user?.username??'—'}
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
          <div style={{width:5,height:5,borderRadius:'50%',background:dot,flexShrink:0}}/>
          <SIcon size={10} style={{color:dot}}/>
          <span style={{fontSize:12,color:dot==='rgba(255,255,255,0.1)'?C.textDD:C.textD}}>{label}</span>
        </div>
        {spotify&&(
          <div style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:8,
            background:'rgba(110,231,183,0.05)',border:'1px solid rgba(110,231,183,0.1)'}}>
            <Music size={10} style={{color:'#6ee7b7',flexShrink:0}}/>
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
        <p style={{fontSize:8,fontFamily:'var(--font-mono)',color:C.textDD,letterSpacing:'.04em'}}>
          {u?.discord_user?.id??dev.id}
        </p>
      </div>
    </Card>
  )
}

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

/* ─── Page ─────────────────────────────────────────────── */
export default function Page(){
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key))||(e.ctrlKey&&e.key==='u'))
        e.preventDefault()
    }
    const n=(e:MouseEvent)=>e.preventDefault()
    document.addEventListener('keydown',h);document.addEventListener('contextmenu',n)
    return()=>{document.removeEventListener('keydown',h);document.removeEventListener('contextmenu',n)}
  },[])

  const[activeFeature,setActiveFeature]=useState<Feature|null>(null)

  return(
    <div style={{minHeight:'100dvh',display:'flex',flexDirection:'column',background:C.bg,width:'100%'}}>
      <BeamsBackground/>
      <main style={{flex:1,padding:'0 22px',position:'relative',zIndex:1,overflowX:'visible',
        width:'100%',maxWidth:780,margin:'0 auto'}}
        className="sm:px-6">
        <Hero/>
        <ScriptSection/>
        <MapsSection onFeatureClick={setActiveFeature}/>
        <TeamSection/>
        <div style={{height:80}}/>
      </main>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:'12px 22px',
        display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
        <span style={{fontSize:9,color:C.textDD,fontFamily:'var(--font-mono)'}}>
          © 2026 michigun.xyz
        </span>
      </footer>

      {/* Modal — rendered at root level, always above everything */}
      <AnimatePresence>
        {activeFeature&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
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
              <button onClick={()=>setActiveFeature(null)} style={{position:'absolute',top:12,right:12,
                background:'rgba(255,255,255,0.05)',border:`1px solid ${C.border}`,
                borderRadius:7,width:26,height:26,display:'flex',alignItems:'center',
                justifyContent:'center',color:C.textD,cursor:'pointer'}}>
                <X size={12}/>
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
