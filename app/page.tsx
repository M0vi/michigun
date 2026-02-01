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

const CONFIG = {
  script: 'loadstring(game:HttpGet("https://gitlab.com/sanctuaryangels/michigun.xyz/-/raw/main/main"))()',
  discordLink: 'https://discord.gg/pWeJUBabvF',
  videoId: '20zXmdpUHQA',

  games: [
    { name: 'Tevez', icon: 'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
    { name: 'Delta', icon: 'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
    { name: 'Soucre', icon: 'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' }
  ] as GameItem[],

  features: {
    global: [
      { name: 'Silent aim', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Redireciona os tiros para o inimigo.' },
      { name: 'Hitbox', icon: 'fas fa-arrows-alt', type: 'safe', desc: 'Permite aumentar a hitbox de quem você desejar.' },
      { name: 'ChatGPT', icon: 'fas fa-robot', type: 'safe', desc: 'IA integrada para gerar respostas automáticas.' },
      { name: 'Auto parkour', icon: 'fas fa-route', type: 'safe', desc: 'Realiza parkours de forma automática e perfeita.' },
      { name: 'Auto JJ\'s', icon: 'fas fa-running', type: 'safe', desc: 'Realiza JJs (polichinelos) automaticamente.' },
      { name: 'Anti-lag', icon: 'fas fa-bolt', type: 'safe', desc: 'Remove texturas e otimiza o client para ganhar FPS.' },
      { name: 'F3X', icon: 'fas fa-hammer', type: 'safe', desc: 'Permite alterar o tamanho de objetos e parkours.' },
      { name: 'Char', icon: 'fas fa-user-edit', type: 'visual', desc: 'Permite alterar sua skin ou a skin de terceiros.' }
    ],
    tevez: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Inclui todas as ferramentas da aba Global.' },
      { name: 'Kill aura', icon: 'fas fa-skull', type: 'risk', desc: 'Mata todos os inimigos ao redor automaticamente.' },
      { name: 'Mods', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Permite modificar os parâmetros da arma.' },
      { name: 'Spoofer', icon: 'fas fa-tablet-alt', type: 'safe', desc: 'Falsifica seu dispositivo para aparecer como outro.' },
      { name: 'Autofarm', icon: 'fas fa-university', type: 'safe', desc: 'Autofarm de dinheiro totalmente automatizado.' }
    ],
    delta: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Inclui todas as ferramentas da aba Global.' },
      { name: 'Inf money', icon: 'fas fa-coins', type: 'safe', desc: 'Você receberá dinheiro infinito no jogo.' },
      { name: 'Money all', icon: 'fas fa-parachute-box', type: 'safe', desc: 'Dá dinheiro infinito para todos do servidor.' }
    ],
    soucre: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Inclui todas as ferramentas da aba Global.' },
      { name: 'Autofarm', icon: 'fas fa-magnet', type: 'safe', desc: 'Autofarm de dinheiro otimizado.' }
    ]
  } as Record<string, FeatureItem[]>
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('global')
  const [videoActive, setVideoActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, title: '', desc: '' })
  const [toast, setToast] = useState(false)

  const displayGames = [...CONFIG.games, ...CONFIG.games]

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
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
          <img src="/avatar.png" className="loading-logo" alt="Loading" onError={(e) => handleImageError(e, 'M')} loading="lazy" />
        </div>
      )}

      <div className="wrapper" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        
        <header>
          <div className="profile-container">
            <img src="/avatar.png" className="avatar" alt="fp3" onError={(e) => handleImageError(e, 'FP')} loading="lazy" />
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
          <div className="mac-frame">
            <div className="mac-bar">
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
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
                  loading="lazy"
                ></iframe>
              )}
            </div>
          </div>
          <div className="hero-text">
            <div className="hero-title">Video <span>showcase</span></div>
            <p className="hero-desc">Veja o vídeo. Ele será atualizado periodicamente para mostrar as últimas funções do script.</p>
          </div>
        </div>

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
          <div className="trust-item">
            <i className="fas fa-life-ring trust-icon"></i>
            <span className="trust-label">24/7</span>
            <p className="trust-sub">Suporte ativo no DC.</p>
          </div>
        </div>

        <section>
          <div className="section-head">
            <span className="sec-title">Jogos Suportados</span>
            <span className="sec-badge">{CONFIG.games.length} Jogos</span>
          </div>
          <div className="carousel-wrap">
            <div className="track">
              {displayGames.map((game, index) => (
                <div key={index} className="game-pill">
                  <img
                    src={game.icon}
                    className="game-img"
                    alt={game.name}
                    onError={(e) => handleImageError(e, game.name)}
                    loading="lazy"
                  />
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
              <div
                key={index}
                className="feat-card"
                onClick={() => setModal({ open: true, title: item.name, desc: item.desc })}
              >
                <i className={item.icon}></i>
                <div>
                  <div className="feat-name">{item.name}</div>
                  <span className={`feat-tag tag-${item.type}`}>
                    {item.type === 'safe' ? 'Seguro' : item.type === 'risk' ? 'Risco' : 'Visual'}
                  </span>
                </div>
              </div>
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