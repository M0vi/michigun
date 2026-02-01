'use client'

import { useState } from 'react'

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
  const [modal, setModal] = useState({ open: false, title: '', desc: '' })
  const [toast, setToast] = useState(false)

  const displayGames = [...CONFIG.games, ...CONFIG.games]

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
    <div className="wrapper">
      <header>
        <img
          src="/avatar.png"
          className="avatar"
          alt="fp3"
          onError={(e) => handleImageError(e, 'FP')}
        />
        <div className="header-info">
          <h1>@fp3 | 17</h1>
          <span style={{ fontSize: '0.7rem', color: '#555', fontWeight: 500 }}>michigun.xyz</span>
        </div>
        <div className="header-actions">
          <a href={CONFIG.discordLink} target="_blank" className="icon-btn" rel="noreferrer">
            <i className="fab fa-discord"></i>
          </a>
        </div>
      </header>

      {/* --- VIDEO SECTION --- */}
      <section>
        <div className="section-header">
          <h2 className="section-title">
            Video <span className="t-highlight">Showcase</span>
          </h2>
          <p className="section-desc">Veja o vídeo mostrando o script</p>
        </div>

        <div className="mac-container">
          <div className="mac-header">
            <div className="mac-dot"></div>
            <div className="mac-dot"></div>
            <div className="mac-dot"></div>
          </div>
          
          <div className="video-area">
            <div className="video-wrapper" onClick={() => setVideoActive(true)}>
              {!videoActive && (
                <div className="video-cover" style={{ backgroundImage: `url('https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg')` }}>
                  <div className="vid-play-centered">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              )}
              {videoActive && (
                <iframe
                  src={`https://www.youtube.com/embed/${CONFIG.videoId}?autoplay=1`}
                  allowFullScreen
                  allow="autoplay"
                ></iframe>
              )}
            </div>

            <div className="vid-desc-box">
              <h3 className="vid-desc-title">Full Info</h3>
              <p className="vid-desc-text">
                O michigun.xyz foi criado apenas como um hobby.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE LIST --- */}
      <section className="mac-container">
        <div className="mac-header">
          <div className="mac-dot"></div>
          <div className="mac-dot"></div>
          <div className="mac-dot"></div>
        </div>
        <div className="features-container">
          <div className="feat-item">
            <div className="feat-icon-btn"><i className="far fa-play-circle"></i></div>
            <div className="feat-content">
              <span className="feat-title">Suporte</span>
              <p className="feat-desc">Novas funções e jogos são adicionados constantemente</p>
            </div>
          </div>
          <div className="feat-item">
            <div className="feat-icon-btn"><i className="fas fa-key"></i></div>
            <div className="feat-content">
              <span className="feat-title">Key system</span>
              <p className="feat-desc">Key system fácil de ser concluido</p>
            </div>
          </div>
          <div className="feat-item">
            <div className="feat-icon-btn"><i className="fas fa-life-ring"></i></div>
            <div className="feat-content">
              <span className="feat-title">Suporte 24/7</span>
              <p className="feat-desc">Donos ativos no servidor</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SUPPORTED GAMES --- */}
      <section>
        <div className="section-header">
          <h2 className="section-title">
            Jogos <span className="t-highlight">Suportados</span>
          </h2>
          <p className="section-desc">O script possui funções exclusivas para os jogos abaixo</p>
        </div>

        <div className="carousel-window">
          <div className="carousel-track">
            {displayGames.map((game, index) => (
              <div key={index} className="game-card-modern">
                <div className="game-icon-box">
                  <img
                    src={game.icon}
                    className="game-icon-img"
                    alt={game.name}
                    onError={(e) => handleImageError(e, game.name)}
                  />
                </div>
                <span className="game-name">{game.name}</span>
                <span className="game-status">Ativo</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hover-info">
          Clique para pausar • <span style={{color: '#fff'}}> {CONFIG.games.length} Jogos suportados</span>
        </div>
      </section>

      {/* --- SCRIPT --- */}
      <div className="script-box">
        <code>{CONFIG.script}</code>
        <button className="copy-btn" onClick={copyScript}>
          <i className="fas fa-copy"></i>
        </button>
      </div>

      {/* --- TABS --- */}
      <nav className="nav-tabs">
        {Object.keys(CONFIG.features).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      <main>
        <div className="tab-content active">
          {CONFIG.features[activeTab].map((item, index) => (
            <div
              key={index}
              className="func-card"
              onClick={() => setModal({ open: true, title: item.name, desc: item.desc })}
            >
              <i className={item.icon}></i>
              <span className="func-name">{item.name}</span>
              <span className={`badge ${item.type}`}>
                {item.type === 'safe' ? 'Seguro' : item.type === 'risk' ? 'Risco' : 'Visual'}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer>© 2026 MICHIGUN.XYZ</footer>

      {/* MODAL & TOAST */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <span className="modal-title">{modal.title}</span>
            <span className="modal-desc">{modal.desc}</span>
            <button className="modal-btn" onClick={() => setModal({ ...modal, open: false })}>ENTENDI</button>
          </div>
        </div>
      )}
      <div className={`toast ${toast ? 'show' : ''}`}>Copiado!</div>
    </div>
  )
}