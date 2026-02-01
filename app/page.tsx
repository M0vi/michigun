'use client'

import { useState, useEffect, useRef } from 'react'

type FeatureItem = {
  name: string
  icon: string
  type: string
  desc: string
}

type GameItem = {
  name: string
  icon: string
}

type DiscordMember = {
  id: string
  username: string
  avatar_url: string
  status: string
}

type DiscordWidgetData = {
  id: string
  name: string
  instant_invite: string
  channels: any[]
  members: DiscordMember[]
  presence_count: number
}

type DiscordInviteData = {
  guild: {
    id: string
    name: string
    icon: string
  }
  approximate_member_count: number
  approximate_presence_count: number
}

const CONFIG = {
  script: 'loadstring(game:HttpGet("https://gitlab.com/sanctuaryangels/michigun.xyz/-/raw/main/main"))()',
  discordLink: 'https://discord.gg/pWeJUBabvF',
  videoId: '20zXmdpUHQA',
  discordId: '1163467888259239996',
  discordServerId: '1325182370353119263',
  
  games: [
    { name: 'Tevez', icon: 'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
    { name: 'Delta', icon: 'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
    { name: 'Soucre', icon: 'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' }
  ] as GameItem[],

  features: {
    global: [
      { name: 'Silent aim', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Redireciona os tiros ao inimigo' },
      { name: 'Hitbox', icon: 'fas fa-arrows-alt', type: 'safe', desc: 'Aumenta a hitbox dos inimigos' },
      { name: 'ChatGPT', icon: 'fas fa-robot', type: 'safe', desc: 'IA integrada para gerar textos' },
      { name: 'Auto parkour', icon: 'fas fa-route', type: 'safe', desc: 'Parkour automático' },
      { name: 'Auto JJ\'s', icon: 'fas fa-running', type: 'safe', desc: 'JJs (polichinelos) automáticos' },
      { name: 'Anti-lag', icon: 'fas fa-bolt', type: 'safe', desc: 'Remove texturas e otimiza a renderização para ganhar FPS' },
      { name: 'F3X', icon: 'fas fa-hammer', type: 'safe', desc: 'Permite modificar estruturas, incluindo parkours' },
      { name: 'Char', icon: 'fas fa-user-edit', type: 'visual', desc: 'Permite alterar seu char ou o char de terceiros' }
    ],
    tevez: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Todas funções globais' },
      { name: 'Kill aura', icon: 'fas fa-skull', type: 'risk', desc: 'Mata todos os inimigos ao redor' },
      { name: 'Mods', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Modifica a arma' },
      { name: 'Spoofer', icon: 'fas fa-tablet-alt', type: 'safe', desc: 'Permite alterar o dispositivo no qual você joga que aparece para os outros' },
      { name: 'Autofarm', icon: 'fas fa-university', type: 'safe', desc: 'Ganha dinheiro automaticamente' }
    ],
    delta: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Todas funções globais' },
      { name: 'Inf money', icon: 'fas fa-coins', type: 'safe', desc: 'Dinheiro infinito' },
      { name: 'Money all', icon: 'fas fa-parachute-box', type: 'safe', desc: 'Transfere dinheiro infinito para todos' }
    ],
    soucre: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Todas funções globais' },
      { name: 'Autofarm', icon: 'fas fa-magnet', type: 'safe', desc: 'Ganha dinheiro automaticamente' }
    ]
  } as Record<string, FeatureItem[]>
}

const SimpleLuaHighlight = ({ code }: { code: string }) => {
  const parts = code.split(/(".*?"|\(|\)|\.)/g)
  
  return (
    <>
      {parts.map((part, i) => {
        if (part === '(' || part === ')' || part === '.') return <span key={i} className="lua-symbol">{part}</span>
        if (part.startsWith('"')) return <span key={i} className="lua-string">{part}</span>
        if (part === 'loadstring' || part === 'HttpGet') return <span key={i} className="lua-function">{part}</span>
        if (part === 'game') return <span key={i} className="lua-global">{part}</span>
        return <span key={i} className="lua-token">{part}</span>
      })}
    </>
  )
}

const useTypewriter = (text: string, speed: number = 100, delay: number = 0) => {
  const [displayText, setDisplayText] = useState('')
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const startTyping = () => {
      let i = 0
      const type = () => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1))
          i++
          timeout = setTimeout(type, speed)
        } else {
          setIsFinished(true)
        }
      }
      type()
    }

    const initialDelay = setTimeout(startTyping, delay)
    return () => {
      clearTimeout(initialDelay)
      clearTimeout(timeout)
    }
  }, [text, speed, delay])

  return { displayText, isFinished }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('global')
  const [videoActive, setVideoActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', desc: '' })
  const [toast, setToast] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/avatar.png')
  const [discordWidget, setDiscordWidget] = useState<DiscordWidgetData | null>(null)
  const [discordExtra, setDiscordExtra] = useState<DiscordInviteData | null>(null)
  const [execCount, setExecCount] = useState<number | null>(null)
  
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const downloadMenuRef = useRef<HTMLDivElement>(null)

  const displayGames = [...CONFIG.games, ...CONFIG.games]
  
  const { displayText: typeText, isFinished: typeFinished } = useTypewriter('Developer', 150, 2000)

  const playSound = (type: 'hover' | 'click') => {
    try {
      const audio = new Audio(`/sounds/${type}.mp3`)
      audio.volume = 0.2
      audio.play().catch(() => {})
    } catch {}
  }

  const handleDownload = (ext: 'txt' | 'lua') => {
    playSound('click')
    const element = document.createElement('a')
    const file = new Blob([CONFIG.script], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `michigun.${ext}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setShowDownloadMenu(false)
  }

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setContentReady(true), 800)
    }, 1500)

    async function fetchData() {
      try {
        const resAv = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`)
        const dataAv = await resAv.json()
        if (dataAv.success && dataAv.data.discord_user.avatar) {
          setAvatarUrl(`https://cdn.discordapp.com/avatars/${CONFIG.discordId}/${dataAv.data.discord_user.avatar}.png`)
        }

        const resWidget = await fetch(`https://discord.com/api/guilds/${CONFIG.discordServerId}/widget.json`)
        const dataWidget = await resWidget.json()
        if (dataWidget) setDiscordWidget(dataWidget)

        const inviteCode = CONFIG.discordLink.split('/').pop()
        const resInvite = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`)
        const dataInvite = await resInvite.json()
        if (dataInvite.guild) setDiscordExtra(dataInvite)

        const resCount = await fetch('/api/stats')
        const dataCount = await resCount.json()
        if (dataCount.executions !== undefined) setExecCount(dataCount.executions)

      } catch {}
    }
    fetchData()
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      clearTimeout(timer)
    }
  }, [])

  const copyScript = () => {
    playSound('click')
    navigator.clipboard.writeText(CONFIG.script).then(() => {
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    })
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackName: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${fallbackName}&background=333&color=fff&size=128`
  }

  const getServerIcon = () => {
    if (discordExtra?.guild?.icon) {
      return `https://cdn.discordapp.com/icons/${discordExtra.guild.id}/${discordExtra.guild.icon}.png`
    }
    return null
  }

  const withSound = (action: () => void) => {
    return () => {
      playSound('click')
      action()
    }
  }

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <div className="loading-text">Carregando</div>
        </div>
      )}

      <div className="wrapper" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        
        <header>
          <div className="profile-container" onMouseEnter={() => playSound('hover')}>
            <img src={avatarUrl} className="avatar" alt="fp3" onError={(e) => handleImageError(e, 'FP')} />
            <div>
              <div className="brand-name">fp3</div>
              <div className="brand-sub">
                {typeText}
                {!typeFinished && <span className="cursor-blink"></span>}
              </div>
            </div>
          </div>
        </header>

        <div className="hero-wrapper">
          <div className="hero-glow"></div>
          
          <div className="video-modern-wrapper" onMouseEnter={() => playSound('hover')}>
            {contentReady ? (
              <div className="video-container" onClick={withSound(() => setVideoActive(true))}>
                {!videoActive ? (
                  <div className="video-thumb" style={{ backgroundImage: `url('https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg')` }}>
                    <div className="play-icon">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${CONFIG.videoId}?autoplay=1`}
                    allowFullScreen
                    allow="autoplay"
                  ></iframe>
                )}
              </div>
            ) : (
              <div className="video-container skeleton"></div>
            )}
          </div>

          <div className="hero-text">
            <div className="hero-title">Showcase</div>
            <p className="hero-desc">O vídeo pode estar desatualizado</p>
            
            <div className={`execution-badge ${contentReady ? 'visible' : ''}`}>
               <i className="fas fa-terminal"></i>
               <span>
                 {execCount !== null ? execCount.toLocaleString() : '...'}
               </span>
               <span className="exec-label">Execuções</span>
            </div>
          </div>
        </div>

        <div className="trust-grid">
          {[
            { icon: 'far fa-play-circle', label: 'Suporte', sub: 'Atualizações constantes' },
            { icon: 'fas fa-key', label: 'Key System', sub: 'Rápido e direto' },
            { icon: 'fab fa-discord', label: '24/7', sub: 'Suporte ativo no Discord' }
          ].map((item, i) => (
            <div key={i} className="trust-item" onMouseEnter={() => playSound('hover')}>
              <i className={`${item.icon} trust-icon`}></i>
              <span className="trust-label">{item.label}</span>
              <p className="trust-sub">{item.sub}</p>
            </div>
          ))}
        </div>

        <section className="discord-dock" onMouseEnter={() => playSound('hover')}>
          <div className="discord-inner">
            <div className="discord-header-row">
              <div className="discord-info-group">
                <div className="discord-logo-box">
                  {getServerIcon() ? (
                    <img src={getServerIcon()!} alt="Server" className="discord-server-icon" loading="lazy" />
                  ) : (
                    <i className="fab fa-discord"></i>
                  )}
                </div>
                <div className="discord-names">
                  <h3>{discordWidget?.name || 'Comunidade'}</h3>
                  <p>
                    <span className="online-dot"></span>
                    {discordWidget?.presence_count || 0} Online
                  </p>
                </div>
              </div>
              {discordExtra && (
                <div className="discord-stat-badge">
                  {discordExtra.approximate_member_count} Membros
                </div>
              )}
            </div>

            <div className="discord-members-area">
              <span className="members-label">Online</span>
              <div className="members-scroll">
                {contentReady && discordWidget?.members ? (
                  discordWidget.members.map((m) => (
                    <div key={m.id} className="dm-item">
                      <img src={m.avatar_url} className="dm-avatar" alt={m.username} onError={(e) => handleImageError(e, 'User')} loading="lazy" />
                      <div className="dm-status"></div>
                    </div>
                  ))
                ) : (
                  [1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{width: 44, height: 44, borderRadius: '50%', minWidth: 44}}></div>)
                )}
              </div>
            </div>

            <button className="btn-join-discord" onClick={withSound(() => window.open(CONFIG.discordLink, '_blank'))} onMouseEnter={() => playSound('hover')}>
              <i className="fab fa-discord"></i> Entrar no servidor
            </button>
          </div>
        </section>

        <section>
          <div className="section-head">
            <span className="sec-title">Jogos com funções exclusivas</span>
            <span className="sec-badge">{CONFIG.games.length} Jogos</span>
          </div>
          <div className="carousel-wrap">
            <div className="track">
              {displayGames.map((game, index) => (
                <div key={index} className="game-pill" onMouseEnter={() => playSound('hover')}>
                  {contentReady ? (
                    <img
                      src={game.icon}
                      className="game-img"
                      alt={game.name}
                      onError={(e) => handleImageError(e, game.name)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="game-img skeleton"></div>
                  )}
                  <div className="game-data">
                    <span className="game-t">{game.name}</span>
                    <span className="game-s">Ativo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="script-dock">
          <div className="sec-title">Como usar</div>
          <p className="trust-sub">Copie o script abaixo e cole no seu executor</p>
          
          <div className="code-container" ref={downloadMenuRef}>
            <div className="code-header">
              <div className="window-dots">
                <span className="dot-red"></span>
                <span className="dot-yellow"></span>
                <span className="dot-green"></span>
              </div>
              
              <div className="action-group">
                <div style={{ position: 'relative' }}>
                  <button 
                    className="icon-btn" 
                    onClick={withSound(() => setShowDownloadMenu(!showDownloadMenu))}
                    aria-label="Baixar"
                    onMouseEnter={() => playSound('hover')}
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  
                  <div className={`download-dropdown ${showDownloadMenu ? 'show' : ''}`}>
                    <button className="dl-option" onClick={() => handleDownload('txt')}>
                      <i className="fas fa-file-alt"></i> Texto (.txt)
                    </button>
                    <button className="dl-option" onClick={() => handleDownload('lua')}>
                      <i className="fas fa-code"></i> Lua (.lua)
                    </button>
                  </div>
                </div>

                <button className="icon-btn" onClick={copyScript} aria-label="Copiar" onMouseEnter={() => playSound('hover')}>
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div className="code-scroll-area">
              <code>
                <SimpleLuaHighlight code={CONFIG.script} />
              </code>
            </div>
          </div>

          <div className="tabs">
            {Object.keys(CONFIG.features).map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={withSound(() => setActiveTab(tab))}
                onMouseEnter={() => playSound('hover')}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid-features">
            {CONFIG.features[activeTab].map((item, index) => (
              contentReady ? (
                <div
                  key={index}
                  className="feat-card"
                  onClick={withSound(() => setModal({ open: true, title: item.name, desc: item.desc }))}
                  onMouseEnter={() => playSound('hover')}
                >
                  <i className={item.icon}></i>
                  <div className="feat-content">
                    <div className="feat-name">{item.name}</div>
                    <span className={`feat-tag tag-${item.type}`}>
                      {item.type === 'safe' ? 'Seguro' : item.type === 'risk' ? 'Risco' : 'Visual'}
                    </span>
                  </div>
                </div>
              ) : (
                <div key={index} className="feat-card skeleton"></div>
              )
            ))}
          </div>
        </section>

        <footer>© 2026 michigun.xyz</footer>

        {modal.open && (
          <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{modal.title}</h3>
              <p className="modal-desc">{modal.desc}</p>
              <button className="modal-close" onClick={withSound(() => setModal({ ...modal, open: false }))}>
                Entendi
              </button>
            </div>
          </div>
        )}

        <div 
          style={{
            position: 'fixed', bottom: 30, left: '50%', transform: toast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
            opacity: toast ? 1 : 0, transition: '0.4s', background: '#fff', color: '#000', padding: '12px 24px',
            borderRadius: 50, fontWeight: 700, fontSize: '0.8rem', pointerEvents: 'none', zIndex: 10001,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          Copiado!
        </div>

      </div>
    </>
  )
}