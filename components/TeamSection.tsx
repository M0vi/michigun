'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { fetcher, playSound } from '@/lib/utils'
import { CONFIG } from '@/lib/constants'
import { Music, Code, Gamepad2, Moon, Circle } from 'lucide-react'

const TeamCard = ({ dev }: { dev: { id: string; role: string } }) => {
  const { data } = useSWR<{ success: boolean; data: any }>(
    `https://api.lanyard.rest/v1/users/${dev.id}`,
    fetcher,
    { refreshInterval: 5000 } // Atualiza mais rápido (5s) para pegar a música/jogo logo
  )

  const user = data?.success ? data.data : null
  const spotify = user?.listening_to_spotify && user.spotify
  
  // Lógica para pegar a atividade principal (que não seja status customizado)
  const activity = user?.activities?.find((a: any) => a.type !== 4 && a.name !== 'Spotify')

  let statusText = 'Offline'
  let statusColor = '#3f3f46' // Zinc-700
  let Icon = Circle // Ícone padrão

  // 1. Verifica Spotify (Prioridade Visual Noir: Branco)
  if (spotify) {
    statusText = user.spotify.song
    statusColor = '#ffffff' // Branco para destaque
    Icon = Music
  } 
  // 2. Verifica Atividade (Jogo ou VS Code)
  else if (activity) {
    statusText = activity.name
    statusColor = '#ffffff' // Branco para destaque
    
    if (activity.name === 'Visual Studio Code' || activity.name === 'Code') {
      Icon = Code
      statusText = 'Codando'
    } else {
      Icon = Gamepad2
    }
  } 
  // 3. Verifica Status do Discord (Online/Ausente/Ocupado)
  else {
    switch (user?.discord_status) {
      case 'online':
        statusText = 'Online'
        statusColor = '#ffffff' // Branco
        Icon = Circle
        break
      case 'idle':
        statusText = 'Ausente'
        statusColor = '#a1a1aa' // Zinc-400 (Cinza claro)
        Icon = Moon
        break
      case 'dnd':
        statusText = 'Ocupado'
        statusColor = '#52525b' // Zinc-600 (Cinza médio)
        Icon = Circle
        break
      default:
        statusText = 'Offline'
        statusColor = '#27272a' // Zinc-800 (Cinza escuro)
    }
  }

  // Avatar Fallback seguro
  const avatarUrl = user?.discord_user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${dev.id}/${user.discord_user.avatar}.png`
    : `https://ui-avatars.com/api/?name=Dev&background=111&color=fff`

  return (
    <div 
      className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-xl transition-all hover:bg-white/5 hover:border-white/20 group backdrop-blur-sm"
      onMouseEnter={() => playSound('hover')}
    >
      <div className="relative">
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={42}
          height={42}
          className="rounded-full border border-white/10 bg-zinc-900 grayscale group-hover:grayscale-0 transition-all"
          unoptimized
        />
        {/* Bolinha de status (agora usa a cor definida na lógica Noir) */}
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black"
          style={{ backgroundColor: statusColor }}
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center w-full">
           <span className="font-bold text-sm text-white truncate">{user?.discord_user?.username || 'Carregando...'}</span>
           <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 rounded uppercase tracking-wider">{dev.role}</span>
        </div>

        {/* Linha de Status / Atividade */}
        <div className="flex items-center gap-1.5 mt-0.5 text-xs truncate" style={{ color: spotify || activity ? '#fff' : '#a1a1aa' }}>
          <Icon size={12} className={spotify || activity ? "animate-pulse" : ""} />
          <span className="truncate opacity-90">{statusText}</span>
        </div>
      </div>
    </div>
  )
}

export default function TeamSection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] pl-1">Equipe</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CONFIG.devs.map(dev => <TeamCard key={dev.id} dev={dev} />)}
      </div>
    </div>
  )
}