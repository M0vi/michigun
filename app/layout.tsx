import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#060606',
}

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
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `window.addEventListener('error', function(e) { document.body.innerHTML = '<div style="color:red;padding:20px;background:white;font-family:sans-serif;z-index:999999;position:fixed;inset:0;overflow:auto;"><h1>Client Error</h1><pre>' + e.error.stack + '</pre></div>'; });`
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}