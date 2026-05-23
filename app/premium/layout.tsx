import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#d4af37',
}

export const metadata: Metadata = {
  title: 'Premium',
  description: 'Libere funções exclusivas e sem key system de forma vitalícia',
  openGraph: {
    title: 'Premium',
    description: 'Libere funções exclusivas e sem key system de forma vitalícia',
    url: 'https://michigun.xyz/premium',
    siteName: 'michigun.xyz',
    images: [{ url: '/premium-og.png', width: 1920, height: 1080, alt: 'Michigun Premium Banner' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium',
    description: 'Libere funções exclusivas e sem key system de forma vitalícia',
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
