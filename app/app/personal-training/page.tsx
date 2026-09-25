'use client'

import React, { useState } from 'react'
import { Dumbbell, Plus, Calendar, Clock, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'

export default function PersonalTrainingPage() {
  const { trainers, members } = useApp()

  const ptSessions = [
    {
      id: 'pt_1',
      member_name: 'Amit Verma',
      trainer_name: 'Rajesh Kumar',
      date: '2026-09-25',
      time: '07:00 AM - 08:00 AM',
      package: '12-Session VIP PT',
      sessions_left: 8,
      status: 'scheduled',
    },
    {
      id: 'pt_2',
      member_name: 'Priya Joshi',
      trainer_name: 'Sneha Shah',
      date: '2026-09-25',
      time: '06:00 PM - 07:00 PM',
      package: '10-Session Pilates',
      sessions_left: 4,
      status: 'scheduled',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Personal Training (PT)</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage PT session scheduling, trainer clash prevention, and package balances
          </p>
        </div>
        <Button size="sm" className="gap-1.5 shadow-soft-sm">
          <Plus className="h-4 w-4" />
          <span>Book PT Session</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Upcoming PT Sessions</h2>
          <div className="space-y-3">
            {ptSessions.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-border bg-muted/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{s.member_name}</span>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Trainer: <strong>{s.trainer_name}</strong></span>
                  <span>Time: <strong>{s.time}</strong></span>
                </div>
                <div className="text-[11px] text-primary font-semibold border-t border-border pt-2 flex justify-between">
                  <span>Package: {s.package}</span>
                  <span>{s.sessions_left} Sessions Remaining</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">PT Trainer Revenue & Commissions</h2>
          <div className="space-y-3">
            {trainers.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border text-xs">
                <div>
                  <span className="font-bold text-foreground block">{t.name}</span>
                  <span className="text-muted-foreground">{t.specialization}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 block">{t.commission_pct}% Cut</span>
                  <span className="text-muted-foreground">{t.assigned_members_count} Trainees</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
