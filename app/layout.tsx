import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: '../public/fonts/GeistVF.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
})

const geistMono = localFont({
  src: '../public/fonts/GeistMonoVF.woff2',
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://michigun.xyz'),
  title: 'michigun.xyz',
  description: 'Script para Exército Brasileiro no Roblox',
  openGraph: {
    title: 'michigun.xyz',
    description: 'Script para Exército Brasileiro no Roblox',
    url: 'https://michigun.xyz',
    siteName: 'michigun.xyz',
    images: [
      {
        url: '/avatar.png',
        width: 1200,
        height: 630,
        alt: 'michigun.xyz',
      },
    ],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}