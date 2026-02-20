import { 
  Crosshair, Move, Bot, Route, Activity, Zap, Hammer, UserCog, 
  Globe, Skull, TabletSmartphone, Coins, Box, Magnet,
  Eye, UserX, Ghost, Wind, FastForward, ArrowUpCircle, MapPin, Wrench
} from 'lucide-react'
import { FeatureItem, GameItem } from './types'

export const CONFIG = {
  script: 'loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()',
  discordLink: 'https://discord.gg/pWeJUBabvF',
  keySystemText: 'Key system',
  videoId: '20zXmdpUHQA',
  discordServerId: '1325182370353119263',
  devs: [
    { id: '1163467888259239996', role: 'Dev' },
    { id: '1062463366792216657', role: 'CMO' }
  ],
  games: [
    { name: 'Tevez', icon: 'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
    { name: 'Delta', icon: 'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
    { name: 'Soucre', icon: 'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' },
    { name: 'Nova Era', icon: 'https://tr.rbxcdn.com/180DAY-c2aa25a2b7a9e0556e93c63927cae5cc/768/432/Image/Webp/noFilter' },
    { name: 'Solara', icon: 'https://tr.rbxcdn.com/180DAY-e0fe33e9562b5e4003ed9ccc98f5b29a/768/432/Image/Webp/noFilter' },
    { name: 'Mathias', icon: 'https://tr.rbxcdn.com/180DAY-7ad6813df58de350ee91727f18e048d6/768/432/Image/Webp/noFilter' },
    { name: 'Victor', icon: 'https://tr.rbxcdn.com/180DAY-07913e65ddf48f064fa581415301f87c/768/432/Image/Webp/noFilter' },
    { name: 'Entre outros...', icon: '' }
  ] as GameItem[],
  features: {
    global: [
      { name: 'Silent aim', icon: Crosshair, type: 'safe', category: 'PVP', desc: 'Permite matar alvos com facilidade, redirecionando os tiros a eles.' },
      { name: 'Hitbox expander', icon: Move, type: 'safe', category: 'PVP', desc: 'Permite amplificar o tamanho da hitbox dos inimigos, facilitando o acerto de tiros.' },
      { name: 'ESP', icon: Eye, type: 'safe', category: 'PVP', desc: 'Permite ver inimigos através das paredes.' },
      { name: 'Auto JJ\'s', icon: Activity, type: 'safe', category: 'Treino', desc: 'Realiza polichinelos automaticamente.' },
      { name: 'TAS', icon: Route, type: 'safe', category: 'Treino', desc: 'Permite realizar percusos (parkours) automaticamente, garatindo que você não erre na hora H.' },
      { name: 'F3X', icon: Hammer, type: 'safe', category: 'Treino', desc: 'Permite modificar o tamanho de estruturas, seja aumentando ou diminuindo seus tamanhos.' },
      { name: 'ChatGPT', icon: Bot, type: 'safe', category: 'Treino', desc: 'API do ChatGPT integrada, permitindo que você faça perguntas e responda rapidamente qualquer questão.' },
      { name: 'Anti-lag', icon: Zap, type: 'safe', category: 'Misc', desc: 'Suprime texturas de alta qualidade e otimiza o jogo, garatindo mais FPS.' },
      { name: 'Char', icon: UserCog, type: 'visual', category: 'Misc', desc: 'Permite alterar o seu char ou o char de terceiros para qualquer um.' },
      { name: 'Anonimizar', icon: UserX, type: 'safe', category: 'Misc', desc: 'Permite você gravar sua tela sem se identificar.' },
      { name: 'Invisibilidade', icon: Ghost, type: 'safe', category: 'Local', desc: 'Permire ficar invisivel para os outros.' },
      { name: 'Fling', icon: Wind, type: 'risk', category: 'Local', desc: 'Permite arremessar outros para o limbo' },
      { name: 'Speed', icon: FastForward, type: 'safe', category: 'Local', desc: 'Permite alterar sua velocidade.' },
      { name: 'Jump', icon: ArrowUpCircle, type: 'safe', category: 'Local', desc: 'Permite alterar o seu pulo.' },
      { name: 'Teleport', icon: MapPin, type: 'safe', category: 'Local', desc: 'Permite teleportar para outros jogadores.' }
    ],
    tevez: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam neste mapa.' },
      { name: 'Kill aura', icon: Skull, type: 'risk', category: 'Geral', desc: 'Permite matar todos os inimigos ao redor instantaneamente.' },
      { name: 'Mods', icon: Wrench, type: 'safe', category: 'Geral', desc: 'Permite modificar sua arma.' },
      { name: 'Spoofer', icon: TabletSmartphone, type: 'safe', category: 'Geral', desc: 'Permite alterar o dispositivo mostrado no seu personagem, o que garante que você possa fazer tanto treinos MOBILE quanto PC.' },
      { name: 'Autofarm', icon: Coins, type: 'safe', category: 'Geral', desc: 'Permite roubar o banco automaticamente.' }
    ],
    delta: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Money', icon: Coins, type: 'safe', category: 'Geral', desc: 'Permite receber qualquer quantia de dinheiro instantaneamente.' }
    ],
    soucre: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Magnet, type: 'safe', category: 'Geral', desc: 'Realiza o trabalho de lixeiro automaticamente com rapidez.' }
    ],
    nova_era: [
      { name: 'Global +', icon: Globe, type: 'safe', category: 'Geral', desc: 'Todas as funções globais funcionam aqui.' },
      { name: 'Autofarm', icon: Coins, type: 'safe', category: 'Geral', desc: 'Ganha dinheiro automaticamente.' }
    ]
  } as Record<string, FeatureItem[]>
}