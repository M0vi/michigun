import "./globals.css"
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { JetBrains_Mono, Bricolage_Grotesque } from 'next/font/google'

const mono = JetBrains_Mono({ subsets:['latin'], variable:'--font-mono' })
const display = Bricolage_Grotesque({ subsets:['latin'], variable:'--font-display', weight:['400','500','700','800'] })

export const viewport: Viewport = { themeColor:'#050505', width:'device-width', initialScale:1 }

export const metadata: Metadata = {
  metadataBase: new URL('https://michigun.xyz'),
  title: 'michigun.xyz',
  description: 'O melhor script para jogos de Exército Brasileiro no Roblox.',
  icons: { icon: '/avatar.png', apple: '/avatar.png' },
  openGraph: {
    title: 'michigun.xyz',
    description: 'O melhor script para jogos de EB no Roblox.',
    url: 'https://michigun.xyz',
    images: [{ url: '/avatar.png' }],
    locale: 'pt_BR', type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${GeistSans.variable} ${mono.variable} ${display.variable}`}>
      <body className="font-sans antialiased min-h-screen flex justify-center overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
