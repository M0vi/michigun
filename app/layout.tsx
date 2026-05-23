import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { EB_Garamond } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
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
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'michigun.xyz' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'michigun.xyz',
    description: 'Script para Exército Brasileiro no Roblox',
    images: ['/logo.png'],
  },
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable} ${ebGaramond.variable}`}>
      <body>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}