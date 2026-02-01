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
      { name: 'Silent aim', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Redireciona os tiros para o inimigo' },
      { name: 'Hitbox', icon: 'fas fa-arrows-alt', type: 'safe', desc: 'Permite aumentar a hitbox de quem você desejar' },
      { name: 'ChatGPT', icon: 'fas fa-robot', type: 'safe', desc: 'IA integrada para gerar respostas' },
      { name: 'Auto parkour', icon: 'fas fa-route', type: 'safe', desc: 'Realiza parkours de forma automática e perfeita' },
      { name: 'Auto JJ\'s', icon: 'fas fa-running', type: 'safe', desc: 'Realiza JJs (polichinelos) automaticamente' },
      { name: 'Anti-lag', icon: 'fas fa-bolt', type: 'safe', desc: 'Remove texturas e otimiza o client para ganhar FPS' },
      { name: 'F3X', icon: 'fas fa-hammer', type: 'safe', desc: 'Permite alterar o tamanho de objetos e parkours' },
      { name: 'Char', icon: 'fas fa-user-edit', type: 'visual', desc: 'Permite alterar sua skin ou a skin de terceiros para quem você quiser' }
    ],
    tevez: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Inclui todas as ferramentas da aba Global' },
      { name: 'Kill aura', icon: 'fas fa-skull', type: 'risk', desc: 'Mata todos os inimigos ao redor' },
      { name: 'Mods', icon: 'fas fa-crosshairs', type: 'safe', desc: 'Permite modificar a arma' },
      { name: 'Spoofer', icon: 'fas fa-tablet-alt', type: 'safe', desc: 'Falsifica seu dispositivo para aparecer como outro' },
      { name: 'Autofarm', icon: 'fas fa-university', type: 'safe', desc: 'Autofarm de dinheiro' }
    ],
    delta: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Inclui todas as ferramentas da aba Global' },
      { name: 'Inf money', icon: 'fas fa-coins', type: 'safe', desc: 'Você receberá dinheiro infinito' },
      { name: 'Money all', icon: 'fas fa-parachute-box', type: 'safe', desc: 'Dá dinheiro infinito para todos do servidor' }
    ],
    soucre: [
      { name: 'Global +', icon: 'fas fa-globe-americas', type: 'safe', desc: 'Inclui todas as ferramentas da aba Global' },
      { name: 'Autofarm', icon: 'fas fa-magnet', type: 'safe', desc: 'Autofarm de dinheiro' }
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
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
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
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      )}

      <div className="wrapper" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}>
        
        <header>
          <div className="header-left">
            <img src="/avatar.png" className="avatar" alt="fp3" onError={(e) => handleImageError(e, 'FP')} loading="lazy" />
            <div className="header-info">
              <h1>@fp3</h1>
              <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>michigun.xyz</span>
            </div>
          </div>
          <a href={CONFIG.discordLink} target="_blank" className="icon-btn" rel="noreferrer">
            <i className="fab fa-discord"></i>
          </a>
        </header>

        <section className="hero-section">
          <div className="video-container-pro">
            <div className="video-frame" onClick={() => setVideoActive(true)}>
              {!videoActive && (
                <div className="video-cover" style={{ backgroundImage: `url('https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg')` }}>
                  <div className="play-button-modern">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              )}
              {videoActive && (
                <iframe
                  src={`https://www.youtube.com/embed/${CONFIG.videoId}?autoplay=1`}
                  allowFullScreen
                  allow="autoplay"
                  loading="lazy"
                ></iframe>
              )}
            </div>
          </div>
          <div className="video-meta">
            <div>
              <div className="video-title">Showcase Oficial</div>
              <div className="video-subtitle">Veja o potencial máximo do Michigun Script.</div>
            </div>
          </div>
        </section>

        <section className="trust-grid">
          <div className="trust-card">
            <i className="far fa-play-circle trust-icon"></i>
            <span className="trust-title">Suporte</span>
            <p className="trust-desc">Novas funções e jogos adicionados constantemente.</p>
          </div>
          <div className="trust-card">
            <i className="fas fa-key trust-icon"></i>
            <span className="trust-title">Key System</span>
            <p className="trust-desc">Rápido, simples e sem anúncios invasivos.</p>
          </div>
          <div className="trust-card">
            <i className="fas fa-life-ring trust-icon"></i>
            <span className="trust-title">24/7</span>
            <p className="trust-desc">Suporte ativo no Discord para tirar dúvidas.</p>
          </div>
        </section>

        <section>
          <div className="section-header">
            <span className="section-label">Jogos Suportados</span>
            <span className="section-count">{CONFIG.games.length} Jogos</span>
          </div>

          <div className="carousel-window">
            <div className="carousel-track">
              {displayGames.map((game, index) => (
                <div key={index} className="game-chip">
                  <img
                    src={game.icon}
                    className="game-chip-icon"
                    alt={game.name}
                    onError={(e) => handleImageError(e, game.name)}
                    loading="lazy"
                  />
                  <div className="game-chip-info">
                    <span className="game-chip-name">{game.name}</span>
                    <span className="game-chip-status">Ativo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="script-area">
            <span className="script-label">Script Loader</span>
            <div className="code-block">
              <code>{CONFIG.script}</code>
              <button className="copy-btn-modern" onClick={copyScript}>
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="tabs-header">
            {Object.keys(CONFIG.features).map((tab) => (
              <button
                key={tab}
                className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="funcs-grid">
            {CONFIG.features[activeTab].map((item, index) => (
              <div
                key={index}
                className="module-card"
                onClick={() => setModal({ open: true, title: item.name, desc: item.desc })}
              >
                <i className={`${item.icon} module-icon`}></i>
                <div className="module-info">
                  <span className="module-name">{item.name}</span>
                  <p className="module-desc">{item.desc}</p>
                  <span className="module-status">
                    {item.type === 'safe' ? 'Seguro' : item.type === 'risk' ? 'Risco' : 'Visual'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer>
          © 2026 MICHIGUN.XYZ
        </footer>

        {modal.open && (
          <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="modal-title">{modal.title}</span>
              <span className="modal-desc">{modal.desc}</span>
              <button className="modal-btn-action" onClick={() => setModal({ ...modal, open: false })}>
                Entendi
              </button>
            </div>
          </div>
        )}

        <div className={`toast ${toast ? 'show' : ''}`}>
          <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>
          Copiado!
        </div>
      </div>
    </>
  )
}