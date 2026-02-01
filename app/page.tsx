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

      <div className="games-section" style={{ paddingBottom: '0' }}>
        <h2 className="games-title">
          <span className="t-white">Video</span> <span className="t-red">Showcase</span>
        </h2>
        <p className="games-desc">Veja o script em ação.</p>
      </div>

      <div className="player-container">
        <div className="mac-header">
          <div className="mac-dot red"></div>
          <div className="mac-dot yellow"></div>
          <div className="mac-dot green"></div>
        </div>

        <div className="video-wrapper" onClick={() => setVideoActive(true)}>
          {!videoActive && (
            <div className="video-cover" style={{ backgroundImage: `url('https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg')` }}>
              <div className="vid-top-left">
                <img
                  src="/avatar.png"
                  className="vid-avatar-img"
                  onError={(e) => handleImageError(e, 'FP')}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="vid-title-text">Vídeo</span>
                  <span className="vid-author">@fp3</span>
                </div>
              </div>

              <div className="vid-play-centered">
                <i className="fas fa-play"></i>
              </div>

              <div className="vid-bottom-bar">
                <div className="vid-icons-left">
                  <i className="fas fa-share vid-icon-btn"></i>
                  <i className="far fa-clock vid-icon-btn"></i>
                </div>
                <div className="vid-watch-pill">
                  Assista no <i className="fab fa-youtube" style={{ color: '#fff' }}></i> YouTube
                </div>
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
      </div>

      <div className="vid-desc-box">
        <h3 className="vid-desc-title">Full Feature Showcase</h3>
        <p className="vid-desc-text">
          Showcase do script. Esse vídeo mostra as funções (será atualizado periodicamente)
        </p>
      </div>

      <div className="games-section">
        <h2 className="games-title">
          <span className="t-white">Jogos</span> <span className="t-red">Suportados</span>
        </h2>
        <p className="games-desc">Jogos com funções exclusivas no script.</p>

        <div className="carousel-window">
          <div className="carousel-track">
            {displayGames.map((game, index) => (
              <div key={index} className="game-card">
                <img
                  src={game.icon}
                  className="game-icon"
                  alt={game.name}
                  onError={(e) => handleImageError(e, game.name)}
                />
                <span className="game-name">{game.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="script-box">
        <code>{CONFIG.script}</code>
        <button className="copy-btn" onClick={copyScript}>COPIAR</button>
      </div>

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

      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <span className="modal-title">{modal.title}</span>
            <span className="modal-desc">{modal.desc}</span>
            <button className="modal-btn" onClick={() => setModal({ ...modal, open: false })}>ENTENDI</button>
          </div>
        </div>
      )}

      <div className={`toast ${toast ? 'show' : ''}`}>Copiado para a área de transferência!</div>
    </div>
  )
}


