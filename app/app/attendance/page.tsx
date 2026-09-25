'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, QrCode, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'

export default function AttendancePage() {
  const { attendance, members, recordAttendance } = useApp()
  const [searchInput, setSearchInput] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.filter((a) => a.date === todayStr)
  const currentlyInside = todayAttendance.filter((a) => !a.check_out)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Attendance Register</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time gym entry logs, check-outs, and peak hour tracking
          </p>
        </div>

        <Link href="/app/qr-scanner">
          <Button size="sm" className="gap-1.5 shadow-soft-sm bg-emerald-600 hover:bg-emerald-700 text-white">
            <QrCode className="h-4 w-4" />
            <span>Launch Reception QR Scanner</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-primary-soft/40 border-primary/20">
          <span className="text-xs text-muted-foreground font-semibold">Today's Total Check-Ins</span>
          <span className="text-3xl font-extrabold text-foreground block mt-1">{todayAttendance.length}</span>
        </Card>

        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <span className="text-xs text-emerald-800 font-semibold">Currently Inside Gym</span>
          <span className="text-3xl font-extrabold text-emerald-700 block mt-1">{currentlyInside.length}</span>
        </Card>

        <Card className="p-4 bg-sky-50 border-sky-200">
          <span className="text-xs text-sky-800 font-semibold">Peak Hour Slot</span>
          <span className="text-xl font-bold text-sky-700 block mt-2">07:00 AM - 09:00 AM</span>
        </Card>
      </div>

      {/* Manual Search & Record Form */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search member name, code (TPFZ-M-0001), or phone..."
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => {
              if (searchInput) {
                recordAttendance(searchInput, 'manual')
                setSearchInput('')
              }
            }}
            className="w-full sm:w-auto"
          >
            Record Manual Check-In
          </Button>
        </div>
      </Card>

      {/* Attendance Log Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Check-In Time</th>
              <th className="px-4 py-3">Check-Out Time</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {todayAttendance.map((a) => (
              <tr key={a.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={a.member_photo || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
                      alt={a.member_name}
                      className="h-8 w-8 rounded-full object-cover border border-border"
                    />
                    <span className="font-bold text-foreground">{a.member_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono font-semibold">{a.member_code}</td>
                <td className="px-4 py-3 uppercase text-muted-foreground font-mono text-[10px]">{a.method}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">{a.check_in.split('T')[1]?.slice(0, 8)}</td>
                <td className="px-4 py-3 text-muted-foreground font-semibold">
                  {a.check_out ? a.check_out.split('T')[1]?.slice(0, 8) : 'Inside Gym'}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${a.check_out ? 'bg-neutralBadge text-neutralBadge-text' : 'bg-emerald-100 text-emerald-800'}`}>
                    {a.check_out ? 'COMPLETED' : 'INSIDE GYM'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
