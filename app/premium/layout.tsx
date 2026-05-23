import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#d4af37',
}

export const metadata: Metadata = {
  title: 'Michigun Premium | Acesso Exclusivo',
  description: 'Libere funções exclusivas, remova o Key System e obtenha suporte VIP. Garanta seu acesso vitalício agora mesmo.',
  openGraph: {
    title: 'Michigun Premium 👑',
    description: 'Libere funções exclusivas, remova o Key System e obtenha suporte VIP. Garanta seu acesso vitalício agora mesmo.',
    url: 'https://michigun.xyz/premium',
    siteName: 'Michigun',
    images: [{ url: '/premium-og.png', width: 1920, height: 1080, alt: 'Michigun Premium Banner' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michigun Premium 👑',
    description: 'Libere funções exclusivas e remova o Key System.',
    images: ['/premium-og.png'],
  },
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
