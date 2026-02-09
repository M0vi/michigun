import './globals.css'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://michigun.xyz'),
  title: 'michigun.xyz',
  description: 'O script de elite para Exército Brasileiro. Acesse funções exclusivas e garanta sua superioridade no jogo com a ferramenta mais confiável e otimizada da atualidade.',
  openGraph: {
    title: 'michigun.xyz',
    description: 'O script de elite para Exército Brasileiro. Acesse funções exclusivas e garanta sua superioridade no jogo com a ferramenta mais confiável e otimizada da atualidade.',
    url: 'https://michigun.xyz',
    siteName: '@fp3',
    images: [
      {
        url: '/avatar.png',
        width: 500,
        height: 500,
        alt: 'logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'michigun.xyz',
    description: 'michigun.xyz',
    images: ['/avatar.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className={jetbrains.className}>{children}</body>
    </html>
  )
}