'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { Download, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import { formatCurrency } from '@/lib/money'
import { getDaysRemaining } from '@/lib/dates'

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const { members, memberships, payments, attendance, trainers, showToast } = useApp()
  const today = new Date().toISOString().split('T')[0]

  const atRisk = useMemo(() => {
    const lastVisit = new Map<string, string>()
    attendance.forEach((a) => {
      const prev = lastVisit.get(a.member_id)
      if (!prev || a.date > prev) lastVisit.set(a.member_id, a.date)
    })
    const dueByMember = new Map<string, number>()
    payments.forEach((p) => dueByMember.set(p.member_id, (dueByMember.get(p.member_id) || 0) + p.due_paise))

    return members
      .filter((m) => m.status !== 'archived')
      .map((m) => {
        const ms = memberships.find((x) => x.member_id === m.id)
        const days = ms ? getDaysRemaining(ms.end_date) : null
        const last = lastVisit.get(m.id)
        const idleDays = last ? Math.floor((Date.parse(today) - Date.parse(last)) / 86400000) : null
        const due = dueByMember.get(m.id) || 0
        const signals: string[] = []
        if (m.status === 'expired' || m.status === 'inactive') signals.push(`Status ${m.status}`)
        if (days !== null && days <= 7 && m.status === 'active') signals.push(days === 0 ? 'Expires today' : `Expires in ${days} d`)
        if (idleDays !== null && idleDays >= 7) signals.push(`No visit for ${idleDays} d`)
        if (last === undefined) signals.push('Never checked in')
        if (due > 0) signals.push(`${formatCurrency(due)} due`)
        return { m, signals }
      })
      .filter((x) => x.signals.length > 0)
  }, [members, memberships, payments, attendance, today])

  const exportRevenue = () => {
    downloadCsv(
      `revenue_${today}.csv`,
      ['Invoice', 'Member', 'Date', 'Method', 'Amount', 'Tax', 'Paid', 'Due', 'Status'],
      payments.map((p) => [p.invoice_number, p.member_name, p.payment_date.split('T')[0], p.payment_method, p.amount_paise / 100, p.tax_paise / 100, p.paid_paise / 100, p.due_paise / 100, p.status])
    )
    showToast('Revenue report downloaded.')
  }

  const exportAttendance = () => {
    downloadCsv(
      `attendance_${today}.csv`,
      ['Date', 'Member', 'Code', 'Check-in', 'Check-out', 'Method'],
      attendance.map((a) => [a.date, a.member_name, a.member_code, a.check_in, a.check_out || '', a.method])
    )
    showToast('Attendance report downloaded.')
  }

  const exportTrainers = () => {
    downloadCsv(
      `trainers_${today}.csv`,
      ['Trainer', 'Specialization', 'Experience (yrs)', 'Assigned members', 'Salary', 'Commission %', 'Status'],
      trainers.map((t) => [t.name, t.specialization, t.experience_years, t.assigned_members_count, t.salary_paise / 100, t.commission_pct, t.status])
    )
    showToast('Trainer report downloaded.')
  }

  const exportAll = () => {
    exportRevenue()
    exportAttendance()
    exportTrainers()
  }

  const reports = [
    { title: 'Revenue & payments', desc: 'Every invoice with tax, paid and due amounts.', count: `${payments.length} rows`, run: exportRevenue },
    { title: 'Attendance', desc: 'Every check-in with time and method.', count: `${attendance.length} rows`, run: exportAttendance },
    { title: 'Trainers', desc: 'Specialization, assigned members, salary and commission.', count: `${trainers.length} rows`, run: exportTrainers },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Reports</h1>
          <p className="text-xs text-muted-foreground mt-1">Retention signals and CSV exports built from your records</p>
        </div>
        <Button size="sm" onClick={exportAll} className="gap-1.5 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          <span>Export all (CSV)</span>
        </Button>
      </div>

      <Card className="p-4 sm:p-6 border-warning-text/20 bg-warning/40">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2 text-warning-text font-bold text-base sm:text-lg">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Members to follow up ({atRisk.length})</span>
          </div>
          <CardDescription className="text-xs text-warning-text/80">
            Expired or inactive, expiring within a week, no visit in 7+ days, or carrying dues.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-1 space-y-2.5">
          {atRisk.length === 0 && <p className="text-sm text-muted-foreground py-4">No retention signals right now.</p>}
          {atRisk.map(({ m, signals }) => (
            <Link
              key={m.id}
              href={`/app/members/${m.id}`}
              className="flex items-start justify-between gap-3 p-3 rounded-xl border border-warning-text/20 bg-card text-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={m.photo_url || '/logo.png'} alt={m.full_name} className="h-9 w-9 rounded-full object-cover border border-border shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-foreground block truncate">
                    {m.full_name} <span className="font-mono text-muted-foreground">({m.member_code})</span>
                  </span>
                  <span className="text-warning-text font-medium block break-words">{signals.join(' · ')}</span>
                </div>
              </div>
              <StatusBadge status={m.status} />
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reports.map((r) => (
          <Card key={r.title} className="p-4 sm:p-6 flex flex-col">
            <h3 className="font-bold text-base text-foreground mb-1">{r.title}</h3>
            <p className="text-xs text-muted-foreground mb-1 flex-1">{r.desc}</p>
            <p className="text-[11px] font-mono text-muted-foreground mb-4">{r.count}</p>
            <Button variant="outline" size="sm" onClick={r.run} className="w-full text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
