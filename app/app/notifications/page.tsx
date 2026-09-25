'use client'

import React from 'react'
import { Bell, CreditCard, CalendarCheck, Dumbbell, Apple, Zap, Info, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/lib/context'
import type { NotificationItem } from '@/lib/types'

const ICONS: Record<NotificationItem['type'], LucideIcon> = {
  payment: CreditCard,
  membership: Bell,
  attendance: CalendarCheck,
  workout: Dumbbell,
  diet: Apple,
  pt: Zap,
  system: Info,
}

const PRIORITY: Record<NotificationItem['priority'], string> = {
  high: 'bg-danger text-danger-text',
  medium: 'bg-warning text-warning-text',
  low: 'bg-neutralBadge text-neutralBadge-text',
}

const when = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso.split('T')[0]
    : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function NotificationsPage() {
  const { notifications } = useApp()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Notifications</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {unread} unread · payments, expiring memberships and staff notices
        </p>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {notifications.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</Card>
        )}
        {notifications.map((n) => {
          const Icon = ICONS[n.type] ?? Bell
          return (
            <Card key={n.id} className={`p-3.5 sm:p-4 ${n.read ? 'opacity-75' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-foreground leading-snug break-words">{n.title}</h3>
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{n.message}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${PRIORITY[n.priority]}`}>{n.priority}</span>
                    <span className="text-[11px] text-muted-foreground">{when(n.created_at)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
