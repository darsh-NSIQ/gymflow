'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { HyperBackground } from '@/components/ui/hyper-background'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative">
      <HyperBackground />
      <Header />
      <div className="flex flex-1 relative z-10">
        <DesktopSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
