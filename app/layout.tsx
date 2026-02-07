import './globals.css'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#FF0000', 
}

export const metadata: Metadata = {
  // ... outras configurações
  title: {
    default: 'Michigun Script | Elite Roblox Hub', 
    template: '%s | Michigun'
  },
  // AQUI VAI O TEXTO (Escolha uma das opções acima):
  description: 'A ferramenta definitiva para o cenário de Exército Brasileiro no Roblox. O Michigun oferece um conjunto robusto de funcionalidades. Usuários Premium têm acesso imediato sem Key System e ferramentas exclusivas.',
  
  openGraph: {
    // Título do Embed
    title: 'michigun.xyz',
    // Descrição do Embed (A mesma de cima)
    description: 'O melhor script feito para jogos de Exército Brasileiro no Roblox, que possui diversas funções exclusivas para garantir sua vitória no jogo!',
    url: 'https://michigun.xyz',
    siteName: 'michigun.xyz',
    images: [
      {
        url: '/avatar.png',
        width: 800,
        height: 600,
        alt: 'imagem',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
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
