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

type DevProfile = {
  id: string
  role: string
  username: string
  avatar_url: string
  status_text?: string
  status_color?: string
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
  script: 'loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()',
  discordLink: 'https://discord.gg/pWeJUBabvF',
  keySystemText: 'Fácil de fazer',
  videoId: '20zXmdpUHQA',
  discordServerId: '1325182370353119263',
  
  devs: [
    { id: '1163467888259239996', role: 'Dev' },
    { id: '1062463366792216657', role: 'CMO' }
  ],
  
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
  const parts = code.split(/(".*?"|\(|\)|\.|{|}|,|=)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part === '(' || part === ')' || part === '.' || part === '{' || part === '}' || part === ',' || part === '=') return <span key={i} className="lua-symbol">{part}</span>
        if (part.startsWith('"')) return <span key={i} className="lua-string">{part}</span>
        if (part === 'loadstring' || part === 'request' || part === 'HttpGet') return <span key={i} className="lua-function">{part}</span>
        if (part === 'Url' || part === 'Method' || part === 'Body') return <span key={i} className="lua-keyword">{part}</span>
        if (part === 'game') return <span key={i} className="lua-global">{part}</span>
        return <span key={i} className="lua-token">{part}</span>
      })}
    </>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('global')
  const [videoActive, setVideoActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', desc: '' })
  const [toast, setToast] = useState(false)
  const [devProfiles, setDevProfiles] = useState<DevProfile[]>([])
  const [discordWidget, setDiscordWidget] = useState<DiscordWidgetData | null>(null)
  const [discordExtra, setDiscordExtra] = useState<DiscordInviteData | null>(null)
  const [execCount, setExecCount] = useState<number | null>(null)
  const [dailyExecCount, setDailyExecCount] = useState<number | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [showKeySystem, setShowKeySystem] = useState(false)
  const downloadMenuRef = useRef<HTMLDivElement>(null)
  const keySystemRef = useRef<HTMLDivElement>(null)

  const displayGames = [...CONFIG.games, ...CONFIG.games, ...CONFIG.games, ...CONFIG.games]

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
    const file = new Blob([CONFIG.script], { type: 'application/octet-stream' })
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
      if (keySystemRef.current && !keySystemRef.current.contains(e.target as Node)) {
        setShowKeySystem(false)
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

    setLoading(false)
    setTimeout(() => setContentReady(true), 100)

    const fetchDevStatus = async () => {
      try {
        const profiles = await Promise.all(CONFIG.devs.map(async (dev) => {
          try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${dev.id}`)
            const data = await res.json()
            if (data.success) {
              const user = data.data
              let statusText = ''
              let statusColor = '#888'

              if (user.listening_to_spotify && user.spotify) {
                statusText = `Ouvindo ${user.spotify.song}`
                statusColor = '#1DB954'
              } else if (user.activities && user.activities.length > 0) {
                const vscode = user.activities.find((a: any) => a.name === 'Visual Studio Code' || a.name === 'Code')
                const game = user.activities.find((a: any) => a.type === 0)
                const custom = user.activities.find((a: any) => a.type === 4)

                if (vscode) {
                  statusText = 'Codando'
                  statusColor = '#007acc'
                } else if (game) {
                  statusText = `Jogando ${game.name}`
                  statusColor = '#7289da'
                } else if (custom && custom.state) {
                  statusText = custom.state
                  statusColor = '#aaa'
                }
              }

              if (!statusText) {
                 switch (user.discord_status) {
                     case 'online': statusText = 'Online'; statusColor = '#4ade80'; break;
                     case 'idle': statusText = 'Ausente'; statusColor = '#facc15'; break;
                     case 'dnd': statusText = 'Não Perturbe'; statusColor = '#ef4444'; break;
                     default: statusText = 'Offline'; statusColor = '#555';
                 }
              }

              return {
                id: dev.id,
                role: dev.role,
                username: user.discord_user.username,
                avatar_url: `https://cdn.discordapp.com/avatars/${dev.id}/${user.discord_user.avatar}.png`,
                status_text: statusText,
                status_color: statusColor
              }
            }
          } catch {}
          
          return { 
            id: dev.id, 
            role: dev.role, 
            username: 'Dev', 
            avatar_url: `https://cdn.discordapp.com/avatars/${dev.id}/placeholder.png`,
            status_text: 'Offline',
            status_color: '#555'
          }
        }))
        setDevProfiles(profiles)
      } catch {}
    }

    async function fetchGlobalData() {
      try {
        const resCount = await fetch('/api/stats')
        const dataCount = await resCount.json()
        if (dataCount.executions !== undefined) setExecCount(dataCount.executions)
        if (dataCount.daily !== undefined) setDailyExecCount(dataCount.daily)

        const resWidget = await fetch(`https://discord.com/api/guilds/${CONFIG.discordServerId}/widget.json`)
        const dataWidget = await resWidget.json()
        if (dataWidget) setDiscordWidget(dataWidget)

        const inviteCode = CONFIG.discordLink.split('/').pop()
        const resInvite = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`)
        const dataInvite = await resInvite.json()
        if (dataInvite.guild) setDiscordExtra(dataInvite)
      } catch {}
    }
    
    fetchDevStatus()
    fetchGlobalData()

    const interval = setInterval(fetchDevStatus, 5000)
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      clearInterval(interval)
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

      <main className="wrapper" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        
        <div className="team-section">
          <h2 className="team-title">Equipe</h2>
          <div className="team-grid">
            {devProfiles.map((dev) => (
              <div key={dev.id} className="team-card" onMouseEnter={() => playSound('hover')}>
                <img 
                  src={dev.avatar_url} 
                  className="team-avatar" 
                  alt={dev.username} 
                  onError={(e) => handleImageError(e, dev.username)}
                />
                <div className="team-info">
                  <div className="team-name">{dev.username}</div>
                  <div className="team-role">{dev.role}</div>
                  {dev.status_text && (
                    <div className="team-status" style={{ color: dev.status_color }}>
                      <span className="status-dot-small" style={{ background: dev.status_color }}></span>
                      {dev.status_text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-wrapper">
          <div className="hero-glow"></div>
          
          <div className="hero-header-text">
            <div className="hero-title">Showcase</div>
            <p className="hero-desc">O vídeo pode estar desatualizado</p>
          </div>

          <div className="video-modern-wrapper" onMouseEnter={() => playSound('hover')}>
            <div 
              className="video-container" 
              onClick={withSound(() => setVideoActive(true))}
              role="button"
              aria-label="Reproduzir vídeo"
              tabIndex={0}
            >
              {!videoActive ? (
                <div className="video-thumb">
                  <img 
                    src={`https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg`} 
                    alt="Thumbnail"
                    className="video-thumb-img"
                    // @ts-ignore
                    fetchPriority="high"
                  />
                  <div className="play-icon">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${CONFIG.videoId}?autoplay=1`}
                  allowFullScreen
                  allow="autoplay"
                  title="Video"
                ></iframe>
              )}
            </div>
          </div>

          <div className="hero-footer-group">
            <div className={`control-deck ${contentReady ? 'visible' : ''}`} ref={downloadMenuRef}>
              
              <div className="deck-stats-group">
                <div className="deck-stat-item">
                  <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>TOTAL</span>
                  </div>
                  <div className="stat-value">
                    {execCount !== null ? execCount.toLocaleString() : '---'}
                  </div>
                </div>

                <div className="vertical-divider"></div>

                <div className="deck-stat-item">
                  <div className="status-indicator">
                    <div className="status-dot daily-dot"></div>
                    <span>HOJE</span>
                  </div>
                  <div className="stat-value">
                    {dailyExecCount !== null ? `${dailyExecCount.toLocaleString()}` : '---'}
                  </div>
                </div>
              </div>

              <div className="deck-actions">
                <button 
                  className="deck-btn download-btn" 
                  onClick={copyScript} 
                  onMouseEnter={() => playSound('hover')}
                  aria-label="Copiar"
                >
                  <i className="fas fa-copy"></i>
                </button>

                <div className="download-wrapper" style={{position: 'relative'}}>
                   <button 
                     className={`deck-btn download-btn ${showDownloadMenu ? 'active' : ''}`} 
                     onClick={withSound(() => setShowDownloadMenu(!showDownloadMenu))}
                     onMouseEnter={() => playSound('hover')}
                     aria-label="Opções"
                   >
                      <i className="fas fa-download"></i>
                   </button>
                   
                   <div className={`hud-dropdown ${showDownloadMenu ? 'show' : ''}`} role="menu">
                      <button role="menuitem" onClick={() => handleDownload('txt')}>Texto (.txt)</button>
                      <button role="menuitem" onClick={() => handleDownload('lua')}>Lua (.lua)</button>
                   </div>
                 </div>
              </div>
            </div>

            <div className={`editor-window ${contentReady ? 'visible' : ''}`}>
               <div className="editor-header">
                  <div className="window-controls">
                     <span className="win-dot red"></span>
                     <span className="win-dot yellow"></span>
                     <span className="win-dot green"></span>
                  </div>
                  <div className="editor-filename">michigun.lua</div>
               </div>
               
               <div className="editor-body">
                  <div className="line-numbers">
                     <span>1</span>
                  </div>
                  <div className="code-content">
                     <SimpleLuaHighlight code={CONFIG.script} />
                  </div>
               </div>
            </div>

            <div className="dual-grid-row">
                <div className="trust-cell" ref={keySystemRef}>
                    <button 
                        className={`trust-btn ${showKeySystem ? 'active' : ''}`}
                        onClick={withSound(() => setShowKeySystem(!showKeySystem))}
                        onMouseEnter={() => playSound('hover')}
                    >
                        <i className="fas fa-key"></i>
                        <span>Key System</span>
                    </button>
                    <div className={`trust-popup ${showKeySystem ? 'show' : ''}`}>
                        <div className="popup-arrow"></div>
                        <p>{CONFIG.keySystemText}</p>
                    </div>
                </div>

                <div className="trust-cell">
                    <a 
                        href={CONFIG.discordLink} 
                        target="_blank" 
                        className="trust-btn"
                        onClick={() => playSound('click')}
                        onMouseEnter={() => playSound('hover')}
                    >
                        <i className="fab fa-discord"></i>
                        <span>Suporte no Discord</span>
                    </a>
                </div>
            </div>

            <section className={`discord-dock ${contentReady ? 'visible' : ''}`} onMouseEnter={() => playSound('hover')}>
              <div className="discord-glass-bg"></div>
              <div className="discord-content-row">
                <div className="discord-meta-col">
                    <div className="discord-brand">
                        <div className="discord-logo-box">
                        {getServerIcon() ? (
                            <img 
                            src={getServerIcon()!} 
                            alt="Server" 
                            className="discord-server-icon" 
                            loading="lazy"
                            decoding="async" 
                            />
                        ) : (
                            <i className="fab fa-discord"></i>
                        )}
                        </div>
                        <div className="discord-txt">
                            <h3>{discordWidget?.name || 'Comunidade'}</h3>
                            <div className="discord-badges">
                                <span className="d-badge online">
                                    <span className="dot"></span> {discordWidget?.presence_count || 0} Online
                                </span>
                                {discordExtra && (
                                    <span className="d-badge total">
                                        <span className="dot gray"></span> {discordExtra.approximate_member_count} Membros
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="discord-avatars">
                    {contentReady && discordWidget?.members ? (
                        discordWidget.members.slice(0, 8).map((m, i) => (
                        <img 
                            key={m.id}
                            src={m.avatar_url} 
                            className="stack-avatar" 
                            alt={m.username} 
                            style={{zIndex: 10 - i}}
                            onError={(e) => handleImageError(e, 'User')} 
                        />
                        ))
                    ) : (
                        [1,2,3,4].map(i => <div key={i} className="skeleton" style={{width: 32, height: 32, borderRadius: '50%'}}></div>)
                    )}
                    </div>
                </div>
                
                <button 
                  className="discord-join-btn" 
                  onClick={withSound(() => window.open(CONFIG.discordLink, '_blank'))}
                >
                  Entrar
                </button>
              </div>
            </section>
          </div>
        </div>

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
                      decoding="async"
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
          <div className="sec-title">Funcionalidades</div>
          
          <div className="tabs" role="tablist">
            {Object.keys(CONFIG.features).map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={withSound(() => setActiveTab(tab))}
                onMouseEnter={() => playSound('hover')}
                role="tab"
                aria-selected={activeTab === tab}
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
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${item.name}`}
                >
                  <div className="feat-icon-box">
                    <i className={item.icon}></i>
                  </div>
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
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
          role="status"
        >
          Copiado!
        </div>
      </main>
    </>
  )
}