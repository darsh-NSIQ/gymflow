'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { HyperBackground } from '@/components/ui/hyper-background'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background flex flex-col font-sans relative pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <HyperBackground />
      <Header />
      <div className="flex flex-1 relative z-10 min-w-0">
        <DesktopSidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
