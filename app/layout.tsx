import './globals.css'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'michigun.xyz',
      description: 'michigun.xyz',
        icons: {
            icon: '/avatar.png',
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