import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const playSound = (type: 'hover' | 'click') => {
  try {
    const audio = new Audio(`/sounds/${type}.mp3`)
    audio.volume = 0.2
    audio.play().catch(() => {})
    if (type === 'click' && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
  } catch {}
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json())