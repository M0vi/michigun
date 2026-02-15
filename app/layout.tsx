import "./globals.css";
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://michigun.xyz'),
  title: 'michigun.xyz',
  description: 'O melhor script para Exército Brasileiro.',
  keywords: ['roblox', 'script', 'exercito brasileiro', 'michigun', 'delta', 'executor'],
  authors: [{ name: 'michigun.xyz' }],
  openGraph: {
    title: 'michigun.xyz',
    description: 'Acesse funções exclusivas',
    url: 'https://michigun.xyz',
    siteName: 'michigun.xyz',
    images: [{ url: '/avatar.png', width: 500, height: 500 }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'michigun.xyz',
    description: 'O melhor script para jogos de Exército Brasileiro no Roblox',
    images: ['/avatar.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${GeistSans.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased min-h-screen flex justify-center overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}