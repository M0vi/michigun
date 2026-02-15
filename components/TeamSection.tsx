'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { fetcher, playSound } from '@/lib/utils'
import { CONFIG } from '@/lib/constants'
import { Music } from 'lucide-react'

const TeamCard = ({ dev }: { dev: { id: string; role: string } }) => {
  const { data } = useSWR<{ success: boolean; data: any }>(
    `https://api.lanyard.rest/v1/users/${dev.id}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  const user = data?.success ? data.data : null
  const spotify = user?.listening_to_spotify && user.spotify

  let statusText = 'Offline'
  let statusColor = '#555'

  if (spotify) {
    statusText = `Ouvindo ${user.spotify.song}`
    statusColor = '#1DB954'
  } else if (user?.activities?.length > 0) {
    const vscode = user.activities.find((a: any) => a.name === 'Visual Studio Code' || a.name === 'Code')
    if (vscode) { 
      statusText = 'Codando'
      statusColor = '#007acc' 
    } else if (user.discord_status === 'online') { 
      statusText = 'Online'
      statusColor = '#4ade80' 
    } else if (user.discord_status === 'idle') {
      statusText = 'Ausente'
      statusColor = '#facc15'
    } else if (user.discord_status === 'dnd') {
      statusText = 'Ocupado'
      statusColor = '#ef4444'
    }
  } else if (user?.discord_status === 'online') {
    statusText = 'Online'
    statusColor = '#4ade80'
  }

  const avatarUrl = user?.discord_user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${dev.id}/${user.discord_user.avatar}.png`
    : `https://ui-avatars.com/api/?name=Dev&background=333&color=fff`

  return (
    <div 
      className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl transition-all hover:bg-white/10 hover:-translate-y-1 group"
      onMouseEnter={() => playSound('hover')}
    >
      <div className="relative">
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={42}
          height={42}
          className="rounded-full border-2 border-white/10 bg-zinc-800"
          unoptimized
        />
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0a]"
          style={{ backgroundColor: statusColor }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-white truncate">{user?.discord_user?.username || 'Carregando...'}</div>
        <div className="text-xs text-zinc-500 font-semibold">{dev.role}</div>
        
        {spotify ? (
          <a 
            href={`https://open.spotify.com/track/${user.spotify.track_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 mt-1 text-[10px] text-[#1DB954] hover:underline truncate"
            onClick={(e) => e.stopPropagation()}
          >
            <Music size={10} />
            <span className="truncate">{user.spotify.song}</span>
          </a>
        ) : (
          <div className="flex items-center gap-1.5 mt-1 text-[10px] truncate" style={{ color: statusColor }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
            {statusText}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TeamSection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Equipe</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        {CONFIG.devs.map(dev => <TeamCard key={dev.id} dev={dev} />)}
      </div>
    </div>
  )
}