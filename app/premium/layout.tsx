import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#d4af37',
}

export const metadata: Metadata = {
  title: 'Premium',
  description: 'Acesso vitalício a funções exclusivas. Sem key system, sem interrupções.',
  openGraph: {
    title: 'Premium',
    description: 'Acesso vitalício a funções exclusivas. Sem key system, sem interrupções.',
    url: 'https://michigun.xyz/premium',
    siteName: 'michigun.xyz',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Premium',
    description: 'Acesso vitalício a funções exclusivas. Sem key system, sem interrupções.',
  },
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
