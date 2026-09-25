'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { QrCode, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'

const timeOf = (iso?: string) => (iso ? iso.split('T')[1]?.slice(0, 5) : '')

export default function AttendancePage() {
  const { attendance, recordAttendance } = useApp()
  const [searchInput, setSearchInput] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.filter((a) => a.date === todayStr)
  const currentlyInside = todayAttendance.filter((a) => !a.check_out)

  const hourCounts = todayAttendance.reduce<Record<number, number>>((acc, a) => {
    const h = Number(a.check_in.split('T')[1]?.slice(0, 2))
    if (!Number.isNaN(h)) acc[h] = (acc[h] || 0) + 1
    return acc
  }, {})
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]
  const peakLabel = peakHour
    ? `${String(peakHour[0]).padStart(2, '0')}:00 – ${String(Number(peakHour[0]) + 1).padStart(2, '0')}:00`
    : 'No check-ins yet'

  const submitManual = () => {
    if (!searchInput.trim()) return
    recordAttendance(searchInput.trim(), 'manual')
    setSearchInput('')
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Attendance</h1>
          <p className="text-xs text-muted-foreground mt-1">Today&apos;s check-ins, check-outs and peak hour</p>
        </div>
        <Link href="/app/qr-scanner" className="w-full sm:w-auto">
          <Button size="sm" className="gap-1.5 w-full sm:w-auto">
            <QrCode className="h-4 w-4" />
            <span>Open QR scanner</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 bg-primary-soft/40 border-primary/20">
          <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">Check-ins today</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground block mt-1">{todayAttendance.length}</span>
        </Card>
        <Card className="p-4 bg-success border-success-text/20">
          <span className="text-[11px] sm:text-xs text-success-text font-semibold">Inside right now</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-success-text block mt-1">{currentlyInside.length}</span>
        </Card>
        <Card className="p-4 bg-info border-info-text/20 col-span-2 sm:col-span-1">
          <span className="text-[11px] sm:text-xs text-info-text font-semibold">Peak hour</span>
          <span className="text-lg sm:text-xl font-bold text-info-text block mt-1.5">{peakLabel}</span>
        </Card>
      </div>

      <Card className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitManual()
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Member name, code or phone"
              aria-label="Member name, code or phone"
              className="pl-9"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Record check-in
          </Button>
        </form>
      </Card>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {todayAttendance.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No check-ins recorded today.
                  </td>
                </tr>
              )}
              {todayAttendance.map((a) => (
                <tr key={a.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.member_photo || '/logo.png'}
                        alt={a.member_name}
                        className="h-8 w-8 rounded-full object-cover border border-border"
                      />
                      <span className="font-bold text-foreground">{a.member_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold">{a.member_code}</td>
                  <td className="px-4 py-3 uppercase text-muted-foreground font-mono text-[10px]">{a.method.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-semibold text-success-text">{timeOf(a.check_in)}</td>
                  <td className="px-4 py-3 text-muted-foreground font-semibold">{a.check_out ? timeOf(a.check_out) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        a.check_out ? 'bg-neutralBadge text-neutralBadge-text' : 'bg-success text-success-text'
                      }`}
                    >
                      {a.check_out ? 'CHECKED OUT' : 'INSIDE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {todayAttendance.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No check-ins recorded today.</Card>
        )}
        {todayAttendance.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex items-center gap-3">
              <img
                src={a.member_photo || '/logo.png'}
                alt={a.member_name}
                className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-foreground truncate">{a.member_name}</p>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {a.member_code} · {a.method.replace('_', ' ')}
                </p>
              </div>
              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                  a.check_out ? 'bg-neutralBadge text-neutralBadge-text' : 'bg-success text-success-text'
                }`}
              >
                {a.check_out ? 'OUT' : 'INSIDE'}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">Check-in</span>
                <span className="font-semibold text-success-text">{timeOf(a.check_in)}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">Check-out</span>
                <span className="font-semibold text-foreground">{a.check_out ? timeOf(a.check_out) : '—'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
