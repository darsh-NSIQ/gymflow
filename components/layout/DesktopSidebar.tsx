'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  QrCode,
  Dumbbell,
  Apple,
  TrendingUp,
  Receipt,
  FileText,
  DollarSign,
  Package,
  Wrench,
  Zap,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCheck,
  Activity,
  Smartphone,
} from 'lucide-react'
import { useApp } from '@/lib/context'
import { hasPermission } from '@/lib/permissions'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  permission?: string
  badge?: string
}

export function DesktopSidebar() {
  const pathname = usePathname()
  const { currentUser } = useApp()

  const navGroups: { groupName: string; items: NavItem[] }[] = [
    {
      groupName: 'Core Operations',
      items: [
        { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
        { label: 'Members', href: '/app/members', icon: Users, permission: 'members.view' },
        { label: 'Memberships', href: '/app/memberships', icon: CreditCard, permission: 'memberships.view' },
        { label: 'Attendance', href: '/app/attendance', icon: CalendarCheck, permission: 'attendance.view' },
        { label: 'QR Scanner', href: '/app/qr-scanner', icon: QrCode, permission: 'attendance.manage', badge: 'Scanner' },
      ],
    },
    {
      groupName: 'Fitness & Coaching',
      items: [
        { label: 'Trainers & Staff', href: '/app/trainers', icon: UserCheck, permission: 'trainers.view' },
        { label: 'Trainer Portal', href: '/app/trainer-dashboard', icon: Activity, permission: 'workout.manage' },
        { label: 'Workout Plans', href: '/app/workouts', icon: Dumbbell, permission: 'workout.view' },
        { label: 'Diet & Nutrition', href: '/app/diet', icon: Apple, permission: 'diet.view' },
        { label: 'Progress Tracking', href: '/app/progress', icon: TrendingUp, permission: 'progress.view' },
        { label: 'Personal Training', href: '/app/personal-training', icon: Dumbbell, permission: 'pt.view' },
      ],
    },
    {
      groupName: 'Finance & Sales',
      items: [
        { label: 'Payments', href: '/app/payments', icon: DollarSign, permission: 'payments.view' },
        { label: 'Invoices & Receipts', href: '/app/invoices', icon: Receipt, permission: 'invoices.view' },
        { label: 'Expenses', href: '/app/expenses', icon: FileText, permission: 'expenses.view' },
      ],
    },
    {
      groupName: 'Management & Assets',
      items: [
        { label: 'Inventory', href: '/app/inventory', icon: Package, permission: 'inventory.manage' },
        { label: 'Equipment', href: '/app/equipment', icon: Wrench, permission: 'equipment.manage' },
        { label: 'Automations', href: '/app/automations', icon: Zap, permission: 'automations.manage' },
        { label: 'Notifications', href: '/app/notifications', icon: Bell },
        { label: 'Reports & Churn', href: '/app/reports', icon: BarChart3, permission: 'reports.view' },
      ],
    },
    {
      groupName: 'System',
      items: [
        { label: 'Member Portal View', href: '/portal', icon: Smartphone },
        { label: 'Admin Settings', href: '/app/settings', icon: Settings, permission: 'settings.manage' },
        { label: 'Audit Logs', href: '/app/audit-logs', icon: ShieldCheck, permission: 'audit.view' },
      ],
    },
  ]

  return (
    <aside className="w-64 shrink-0 hidden md:block bg-card/90 border-r border-border h-[calc(100vh-65px)] overflow-y-auto sticky top-[65px] p-3 shadow-soft-xs">
      <div className="space-y-6 py-2">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.permission) return true
            return hasPermission(currentUser.role, item.permission as any)
          })

          if (visibleItems.length === 0) return null

          return (
            <div key={group.groupName} className="space-y-1">
              <h4 className="px-3 text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">
                {group.groupName}
              </h4>
              <div className="space-y-0.5 mt-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(item.href + '/'))
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-base ease-standard',
                        isActive
                          ? 'brand-btn-gradient text-white shadow-[0_4px_15px_rgba(255,30,61,0.35)]'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-white' : 'text-muted-foreground'
                          )}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-extrabold bg-white text-primary px-1.5 py-0.5 rounded-md uppercase">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
