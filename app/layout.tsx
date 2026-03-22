import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://michigun.xyz'),
  title: 'michigun.xyz',
  description: 'Script para Exército Brasileiro no Roblox',
  openGraph: {
    title: 'michigun.xyz',
    description: 'Script para Exército Brasileiro no Roblox',
    url: 'https://michigun.xyz',
    siteName: 'michigun.xyz',
    images: [{ url: '/avatar.png', width: 1200, height: 630, alt: 'michigun.xyz' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'michigun.xyz',
    description: 'Script para Exército Brasileiro no Roblox',
    images: ['/avatar.png'],
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}