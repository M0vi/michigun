import {
  Crosshair, ScanSearch, Eye, Zap, GitMerge, Layers, Bot, UserX, Ghost, Wind,
  Rocket, Shuffle, Timer, Globe, Skull, Wrench, Laugh, TabletSmartphone, Coins, Magnet
} from 'lucide-react';

export const DISCORD_URL = 'https://discord.gg/pWeJUBabvF';

export const CREW = [
  { id:'1466338768335274148', role:'Dev', nick: 'h64' },
  { id:'1062463366792216657', role:'CMO' },
];

export const ARENAS = [
  { name:'Apex',    slug:'apex',    thumb:'https://tr.rbxcdn.com/180DAY-e4f1cbe7d7e0f7018ea98880b9414fb4/768/432/Image/Webp/noFilter' },
  { name:'Tevez',   slug:'tevez',   thumb:'https://tr.rbxcdn.com/180DAY-84c7c1edcc63c7dfab5712b1ad377133/768/432/Image/Webp/noFilter' },
  { name:'Delta',   slug:'delta',   thumb:'https://tr.rbxcdn.com/180DAY-8952e9d8abbff8104b22356f8b66f962/768/432/Image/Webp/noFilter' },
  { name:'Soucre',  slug:'soucre',  thumb:'https://tr.rbxcdn.com/180DAY-791e58a5c620d0a301d60c346688e6ec/512/512/Image/Webp/noFilter' },
  { name:'Nova Era',slug:'nova_era',thumb:'https://tr.rbxcdn.com/180DAY-c2aa25a2b7a9e0556e93c63927cae5cc/768/432/Image/Webp/noFilter' },
  { name:'Christian',slug:'christian',thumb:'https://tr.rbxcdn.com/180DAY-048e9d153b3fd43e5ee5207b61b810f7/768/432/Image/Webp/noFilter' },
];

export type RiskLevel = 'safe' | 'risk' | 'visual';

export interface Ability {
  name: string;
  icon: any;
  risk: RiskLevel;
  category: string;
  desc: string;
}

export const ABILITIES: Record<string, Ability[]> = {
  global:[
    {name:'Silent Aim',     icon:Crosshair, risk:'safe',  category:'PVP',    desc:'Redireciona seus tiros automaticamente para os inimigos.'},
    {name:'Hitbox Expander',icon:ScanSearch,risk:'safe',  category:'PVP',    desc:'Amplia a hitbox dos inimigos, tornando qualquer tiro mais fácil.'},
    {name:'ESP',            icon:Eye,       risk:'safe',  category:'PVP',    desc:'Mostra a posição de inimigos através de paredes.'},
    {name:"Auto JJ's",      icon:Zap,       risk:'safe',  category:'Treino', desc:'Realiza polichinelos automaticamente.'},
    {name:'TAS',            icon:GitMerge,  risk:'safe',  category:'Treino', desc:'Completa parkours automaticamente com precisão absoluta.'},
    {name:'F3X',            icon:Layers,    risk:'safe',  category:'Treino', desc:'Modifica estruturas no mapa livremente.'},
    {name:'ChatGPT',        icon:Bot,       risk:'safe',  category:'Treino', desc:'Integração com a API do ChatGPT.'},
    {name:'Char',           icon:Shuffle,   risk:'visual',category:'Misc',   desc:'Altera o personagem seu ou de outros jogadores.'},
    {name:'Anonimizar',     icon:UserX,     risk:'safe',  category:'Misc',   desc:'Esconde o seu nome ao gravar a tela.'},
    {name:'Invisibilidade', icon:Ghost,     risk:'safe',  category:'Local',  desc:'Torna você completamente invisível.'},
    {name:'Fling',          icon:Wind,      risk:'risk',  category:'Local',  desc:'Arremessa outros jogadores para fora do mapa.'},
    {name:'Velocidade',     icon:Rocket,    risk:'safe',  category:'Local',  desc:'Altera a sua velocidade de movimento.'},
    {name:'Pulo',           icon:Timer,     risk:'safe',  category:'Local',  desc:'Modifica a altura do seu pulo.'},
    {name:'Teleporte',      icon:Zap,       risk:'safe',  category:'Local',  desc:'Teleporta para qualquer jogador.'},
  ],
  apex:[
    {name:'Global +',    icon:Globe,  risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Invadir Base',icon:Skull,  risk:'safe',category:'Geral',desc:'Permite invadir a base militar.'},
    {name:'Kill Aura',   icon:Skull,  risk:'safe',category:'Geral',desc:'Mata todos os militares com arma equipada ao seu redor.'},
    {name:'Mods de Arma',icon:Wrench, risk:'safe',category:'Geral',desc:'Modifica a arma.'},
    {name:'Troll',       icon:Laugh,  risk:'safe',category:'Geral',desc:'Funções para trollar jogadores.'},
  ],
  tevez:[
    {name:'Global +', icon:Globe,           risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Kill Aura',icon:Skull,           risk:'risk',category:'Geral',desc:'Elimina todos os inimigos ao redor.'},
    {name:'Mods',     icon:Wrench,          risk:'safe',category:'Geral',desc:'Modifica a sua arma.'},
    {name:'Spoofer',  icon:TabletSmartphone,risk:'safe',category:'Geral',desc:'Altera o dispositivo para treinos.'},
    {name:'Autofarm', icon:Coins,           risk:'safe',category:'Geral',desc:'Rouba o banco automaticamente.'},
  ],
  delta:[
    {name:'Global +', icon:Globe, risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Kill Aura',icon:Skull, risk:'risk',category:'Geral',desc:'Mata todos os inimigos instantaneamente.'},
    {name:'Dinheiro', icon:Coins, risk:'safe',category:'Geral',desc:'Permite receber qualquer quantia de dinheiro.'},
  ],
  soucre:[
    {name:'Global +',icon:Globe,  risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Magnet, risk:'safe',category:'Geral',desc:'Autofarm de moeda.'},
  ],
  nova_era:[
    {name:'Global +',icon:Globe, risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Coins, risk:'safe',category:'Geral',desc:'Autofarm de moeda.'},
  ],
  christian:[
    {name:'Global +',icon:Globe, risk:'safe',category:'Geral',desc:'Todas as funções globais funcionam aqui.'},
    {name:'Autofarm',icon:Coins, risk:'safe',category:'Geral',desc:'Lixeiro e Entregador. Dá mais de 1k moedas a cada 3 segundos.'},
    {name:'Kill all',icon:Skull, risk:'risk',category:'Geral',desc:'Mata instantaneamente todos os jogadores que equiparem alguma arma.'},
  ],
};
