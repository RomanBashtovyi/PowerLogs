import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GetPowerLogs - Фітнес Трекер',
  description: 'Додаток для відслідковування тренувань, прогресу та планування вправ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
