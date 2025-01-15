import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Web',
  description: 'AI Web Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
} 