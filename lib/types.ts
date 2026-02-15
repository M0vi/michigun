export interface FeatureItem {
  name: string
  icon: any
  type: 'INDETECTAVEL' | 'RISCO' | 'VISUAL'
  desc: string
}

export interface GameItem {
  name: string
  icon: string
}

export interface DevProfile {
  id: string
  role: string
  username: string
  avatar_url: string
  status_text?: string
  status_color?: string
  spotify?: {
    song: string
    artist: string
    track_id: string
  }
}

export interface StatsData {
  executions: number
  daily: number
}