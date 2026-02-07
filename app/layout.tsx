import './globals.css'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#FFFFFF', // Cor da barra lateral
}

export const metadata: Metadata = {
  metadataBase: new URL('https://michigun.xyz'), // Importante para a imagem carregar

  description: 'O script de elite para Exército Brasileiro. Acesse funções exclusivas e garanta sua superioridade no jogo com a ferramenta mais confiável e otimizada da atualidade.',
  
  openGraph: {
    title: 'michigun.xyz',
    description: 'O script de elite para Exército Brasileiro. Acesse funções exclusivas e garanta sua superioridade no jogo com a ferramenta mais confiável e otimizada da atualidade.',
    url: 'https://michigun.xyz',
    siteName: '@fp3', // Isso aparece pequeno no "rodapé" do embed
    images: [
      {
        url: '/avatar.png',
        width: 500, // Recomendo imagem quadrada para ficar pequena perfeita
        height: 500,
        alt: 'logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  // 👇 É ISSO AQUI QUE DEIXA A IMAGEM PEQUENA
  twitter: {
    card: 'summary', // 'summary' = pequena. 'summary_large_image' = grande.
    title: 'michigun.xyz',
    description: 'michigun.xyz',
    images: ['/avatar.png'], // Mesma imagem
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
