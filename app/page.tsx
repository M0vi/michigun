'use client'

import { useState, useEffect } from 'react'

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
      { name: 'Silent aim', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Redireciona os tiros.' },
      { name: 'Hitbox', icon: 'fas fa-arrows-alt', type: 'safe', desc: 'Aumenta área de acerto.' },
      { name: 'ChatGPT', icon: 'fas fa-robot', type: 'safe', desc: 'IA integrada para chat.' },
      { name: 'Auto parkour', icon: 'fas fa-route', type: 'safe', desc: 'Parkour automático.' },
      { name: 'Auto JJ\'s', icon: 'fas fa-running', type: 'safe', desc: 'JJs automáticos.' },
      { name: 'Anti-lag', icon: 'fas fa-bolt', type: 'safe', desc: 'Remove texturas.' },
      { name: 'F3X', icon: 'fas fa-hammer', type: 'safe', desc: 'Ferramenta de construção.' },
      { name: 'Char', icon: 'fas fa-user-edit', type: 'visual', desc: 'Alterador de skin.' }
    ],
    tevez: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Todas funções globais.' },
      { name: 'Kill aura', icon: 'fas fa-skull', type: 'risk', desc: 'Mata inimigos próximos.' },
      { name: 'Mods', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Modificadores de arma.' },
      { name: 'Spoofer', icon: 'fas fa-tablet-alt', type: 'safe', desc: 'Falsifica dispositivo.' },
      { name: 'Autofarm', icon: 'fas fa-university', type: 'safe', desc: 'Farm de dinheiro auto.' }
    ],
    delta: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Todas funções globais.' },
      { name: 'Inf money', icon: 'fas fa-coins', type: 'safe', desc: 'Dinheiro infinito.' },
      { name: 'Money all', icon: 'fas fa-parachute-box', type: 'safe', desc: 'Dinheiro para todos.' }
    ],
    soucre: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Todas funções globais.' },
      { name: 'Autofarm', icon: 'fas fa-magnet', type: 'safe', desc: 'Autofarm otimizado.' }
    ]
  } as Record<string, FeatureItem[]>
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('global')
  const [videoActive, setVideoActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', desc: '' })
  const [toast, setToast] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/avatar.png')
  const [discordData, setDiscordData] = useState<DiscordWidgetData | null>(null)

  const displayGames = [...CONFIG.games, ...CONFIG.games]

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    
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

    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setContentReady(true), 800)
    }, 2000)

    async function fetchData() {
      try {
        // Avatar
        const resAv = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`)
        const dataAv = await resAv.json()
        if (dataAv.success && dataAv.data.discord_user.avatar) {
          setAvatarUrl(`https://cdn.discordapp.com/avatars/${CONFIG.discordId}/${dataAv.data.discord_user.avatar}.png`)
        }

        // Widget Data Full
        const resWidget = await fetch(`https://discord.com/api/guilds/${CONFIG.discordServerId}/widget.json`)
        const dataWidget = await resWidget.json()
        if (dataWidget) {
          setDiscordData(dataWidget)
        }
      } catch {}
    }
    fetchData()
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [])

  const copyScript = () => {
    navigator.clipboard.writeText(CONFIG.script).then(() => {
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    })
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackName: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${fallbackName}&background=333&color=fff&size=128`
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
          <div className="profile-container">
            <img src={avatarUrl} className="avatar" alt="fp3" onError={(e) => handleImageError(e, 'FP')} />
            <div>
              <div className="brand-name">fp3</div>
              <div className="brand-sub">Developer</div>
            </div>
          </div>
          <a href={CONFIG.discordLink} target="_blank" className="social-btn" rel="noreferrer">
            <i className="fab fa-discord"></i>
          </a>
        </header>

        <div className="hero-wrapper">
          <div className="hero-glow"></div>
          
          <div className="video-modern-wrapper">
            {contentReady ? (
              <div className="video-container" onClick={() => setVideoActive(true)}>
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
            <p className="hero-desc">Veja o vídeo. Ele será atualizado periodicamente para mostrar as últimas funções do script.</p>
          </div>
        </div>

        {/* TRUST GRID REVERTIDO (2 Colunas) */}
        <div className="trust-grid">
          <div className="trust-item">
            <i className="far fa-play-circle trust-icon"></i>
            <span className="trust-label">Suporte</span>
            <p className="trust-sub">Atualizações constantes.</p>
          </div>
          <div className="trust-item">
            <i className="fas fa-key trust-icon"></i>
            <span className="trust-label">Key System</span>
            <p className="trust-sub">Rápido e sem spam.</p>
          </div>
        </div>

        {/* DISCORD DEDICADO */}
        <section className="discord-dock">
          <div className="discord-inner">
            <div className="discord-header-row">
              <div className="discord-info-group">
                <div className="discord-logo-box"><i className="fab fa-discord"></i></div>
                <div className="discord-names">
                  <h3>{discordData?.name || 'Comunidade'}</h3>
                  <p>{discordData?.presence_count || 0} Membros Online</p>
                </div>
              </div>
              {discordData && (
                <div className="discord-stat-badge">
                  {discordData.channels?.length || 0} Canais Ativos
                </div>
              )}
            </div>

            <div className="discord-members-area">
              <span className="members-label">Online Agora</span>
              <div className="members-scroll">
                {contentReady && discordData?.members ? (
                  discordData.members.map((m) => (
                    <div key={m.id} className="dm-item">
                      <img src={m.avatar_url} className="dm-avatar" alt={m.username} />
                      <div className="dm-status"></div>
                    </div>
                  ))
                ) : (
                  [1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{width: 44, height: 44, borderRadius: '50%', minWidth: 44}}></div>)
                )}
              </div>
            </div>

            <button className="btn-join-discord" onClick={() => window.open(CONFIG.discordLink, '_blank')}>
              <i className="fab fa-discord"></i> Juntar-se ao Servidor
            </button>
          </div>
        </section>

        <section>
          <div className="section-head">
            <span className="sec-title">Jogos suportados</span>
            <span className="sec-badge">{CONFIG.games.length} Jogos</span>
          </div>
          <div className="carousel-wrap">
            <div className="track">
              {displayGames.map((game, index) => (
                <div key={index} className="game-pill">
                  {contentReady ? (
                    <img
                      src={game.icon}
                      className="game-img"
                      alt={game.name}
                      onError={(e) => handleImageError(e, game.name)}
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
          <div className="sec-title">Como usar?</div>
          <p className="trust-sub">Copie o loader abaixo e cole no seu executor.</p>
          
          <div className="code-container">
            <code>{CONFIG.script}</code>
            <button className="copy-action" onClick={copyScript}>
              <i className="fas fa-copy"></i>
            </button>
          </div>

          <div className="tabs">
            {Object.keys(CONFIG.features).map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
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
                  onClick={() => setModal({ open: true, title: item.name, desc: item.desc })}
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

        <footer>© 2026 MICHIGUN.XYZ</footer>

        {modal.open && (
          <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{modal.title}</h3>
              <p className="modal-desc">{modal.desc}</p>
              <button className="modal-close" onClick={() => setModal({ ...modal, open: false })}>
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