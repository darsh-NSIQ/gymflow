'use client'

import React from 'react'
import { Bell, CheckCircle, AlertTriangle, CreditCard, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/lib/context'

export default function NotificationsPage() {
  const { notifications } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Notification Center</h1>
        <p className="text-xs text-muted-foreground mt-1">
          In-app alerts for pending payments, expiring memberships, and staff notices
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">{n.created_at.split('T')[0]}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
