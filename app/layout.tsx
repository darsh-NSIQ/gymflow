import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import { ToastContainer } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: 'GymFlow — Production Gym Management SaaS',
  description:
    'Complete Gym Management SaaS Web App with Member Management, QR Attendance, Invoices, Workouts, Diets, and Multi-branch support.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#6C5CE7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased pb-16 md:pb-0">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  )
}
