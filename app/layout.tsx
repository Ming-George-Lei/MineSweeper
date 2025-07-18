import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Minesweeper Game',
  description: 'A classic Minesweeper game built with Next.js and Tailwind CSS',
  icons: {
    icon: process.env.NODE_ENV === 'production' ? '/MineSweeper/Bomb_icon.png' : '/Bomb_icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}