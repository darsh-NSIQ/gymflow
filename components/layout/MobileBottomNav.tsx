'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  DollarSign,
  Menu,
  X,
  CreditCard,
  QrCode,
  Dumbbell,
  Apple,
  TrendingUp,
  Receipt,
  Package,
  Wrench,
  Settings,
  Bell,
  BarChart3,
  Smartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Members', href: '/app/members', icon: Users },
    { label: 'Attendance', href: '/app/attendance', icon: CalendarCheck },
    { label: 'Payments', href: '/app/payments', icon: DollarSign },
  ]

  const moreItems = [
    { label: 'QR Reception Scanner', href: '/app/qr-scanner', icon: QrCode },
    { label: 'Memberships', href: '/app/memberships', icon: CreditCard },
    { label: 'Workout Plans', href: '/app/workouts', icon: Dumbbell },
    { label: 'Diet & Nutrition', href: '/app/diet', icon: Apple },
    { label: 'Progress Tracking', href: '/app/progress', icon: TrendingUp },
    { label: 'Invoices', href: '/app/invoices', icon: Receipt },
    { label: 'Inventory', href: '/app/inventory', icon: Package },
    { label: 'Equipment', href: '/app/equipment', icon: Wrench },
    { label: 'Notifications', href: '/app/notifications', icon: Bell },
    { label: 'Reports & Analytics', href: '/app/reports', icon: BarChart3 },
    { label: 'Member Portal', href: '/portal', icon: Smartphone },
    { label: 'Admin Settings', href: '/app/settings', icon: Settings },
  ]

  return (
    <>
      {/* Slide-over Drawer for "More" */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative bg-card rounded-t-2xl p-5 border-t border-border shadow-soft-xl max-h-[80vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-fast">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="font-bold text-base text-foreground">All SaaS Modules</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-muted/40 hover:bg-primary-soft hover:border-primary/30 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground leading-tight">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-soft-lg px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl transition-all',
                isActive ? 'text-primary font-bold bg-primary-soft' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  )
}
