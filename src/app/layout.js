import './globals.css'

export const metadata = {
  title: 'AI产品导航',
  description: '发现和探索最新最全的AI产品和工具',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
} 