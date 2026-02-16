import { Crosshair, Move, Bot, Route, Activity, Zap, Hammer, UserCog, Globe, Skull, TabletSmartphone, Coins, Box, Magnet } from 'lucide-react'
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
      { name: 'Silent aim', icon: Crosshair, type: 'safe', desc: 'Redireciona os tiros ao inimigo' },
      { name: 'Hitbox', icon: Move, type: 'safe', desc: 'Aumenta a hitbox dos inimigos' },
      { name: 'ChatGPT', icon: Bot, type: 'safe', desc: 'IA integrada para gerar textos' },
      { name: 'Auto parkour', icon: Route, type: 'safe', desc: 'Parkour automático' },
      { name: 'Auto JJ\'s', icon: Activity, type: 'safe', desc: 'JJs (polichinelos) automáticos' },
      { name: 'Anti-lag', icon: Zap, type: 'safe', desc: 'Remove texturas e otimiza a renderização' },
      { name: 'F3X', icon: Hammer, type: 'safe', desc: 'Permite modificar estruturas' },
      { name: 'Char', icon: UserCog, type: 'visual', desc: 'Permite alterar seu char ou o de terceiros' }
    ],
    tevez: [
      { name: 'Global +', icon: Globe, type: 'safe', desc: 'Todas funções globais' },
      { name: 'Kill aura', icon: Skull, type: 'risk', desc: 'Mata todos os inimigos ao redor' },
      { name: 'Mods', icon: Crosshair, type: 'safe', desc: 'Modifica a arma' },
      { name: 'Spoofer', icon: TabletSmartphone, type: 'safe', desc: 'Altera o dispositivo visível' },
      { name: 'Autofarm', icon: Coins, type: 'safe', desc: 'Ganha dinheiro automaticamente' }
    ],
    delta: [
      { name: 'Global +', icon: Globe, type: 'safe', desc: 'Todas funções globais' },
      { name: 'Inf money', icon: Coins, type: 'safe', desc: 'Dinheiro infinito' },
      { name: 'Money all', icon: Box, type: 'safe', desc: 'Transfere dinheiro para todos' }
    ],
    soucre: [
      { name: 'Global +', icon: Globe, type: 'safe', desc: 'Todas funções globais' },
      { name: 'Autofarm', icon: Magnet, type: 'safe', desc: 'Ganha dinheiro automaticamente' }
    ]
  } as Record<string, FeatureItem[]>
}