import type { Metadata } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'EasySplit — Split bills, settle up fairly', template: '%s | EasySplit' },
  description: 'The free Australian bill-splitting app with receipt scanning, PayID settlements, and zero daily limits.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
