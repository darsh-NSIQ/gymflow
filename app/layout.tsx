import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import { ToastContainer } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: 'The Power Fitness Zone — Ahmedabad',
  description:
    'Strength and cardio training, certified trainers, personal training and diet consultation across two branches in Ahmedabad. Member portal and staff sign-in.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#08090D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  )
}
