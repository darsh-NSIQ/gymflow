'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, CheckCircle, XCircle, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import type { Member } from '@/lib/types'

type ScanState = { status: 'idle' | 'success' | 'error'; message: string; member?: Member }

export default function QRScannerPage() {
  const { members, recordAttendance } = useApp()
  const [manualCode, setManualCode] = useState('')
  const [scan, setScan] = useState<ScanState>({ status: 'idle', message: 'Scan a member QR card or enter a code below.' })

  const runScan = (token: string) => {
    const member = members.find((m) => m.qr_token === token || m.id === token || m.member_code === token)
    const result = recordAttendance(token, 'qr_scan')
    setScan({ status: result.success ? 'success' : 'error', message: result.message, member })
    setManualCode('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">QR check-in</h1>
        <p className="text-xs text-muted-foreground mt-1">Reception scanner — validates the membership and records attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 flex flex-col items-center text-center bg-black text-foreground relative overflow-hidden border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />

          <div className="relative w-full max-w-[220px] aspect-square rounded-3xl border-4 border-primary/60 flex flex-col items-center justify-center p-4 my-2 overflow-hidden shadow-brand-ring">
            <div className="scanner-laser" />
            <QrCode className="h-16 w-16 text-primary mb-2 opacity-80" />
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Camera view</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Hold the member card inside the frame</p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (manualCode.trim()) runScan(manualCode.trim())
            }}
            className="relative mt-5 w-full pt-4 border-t border-border text-left space-y-2"
          >
            <label htmlFor="scan-code" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Or enter member code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="scan-code" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="TPFZ-M-0001" className="pl-9 font-mono" />
              </div>
              <Button type="submit" disabled={!manualCode.trim()}>
                Go
              </Button>
            </div>
          </form>

          <div className="relative mt-4 w-full text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Quick pick</span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {members.slice(0, 6).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => runScan(m.qr_token)}
                  className="w-full text-left px-3 min-h-[44px] rounded-xl bg-card border border-border hover:border-primary/40 text-xs font-semibold flex items-center justify-between gap-2 transition-colors"
                >
                  <span className="truncate">
                    {m.full_name} <span className="font-mono text-muted-foreground">({m.member_code})</span>
                  </span>
                  <StatusBadge status={m.status} />
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 flex flex-col">
          <div className="pb-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-bold">Result</h2>
            <p className="text-xs text-muted-foreground">Membership check for the last scan</p>
          </div>

          <div className="py-6 text-center my-auto">
            {scan.status === 'idle' && (
              <div className="space-y-2 py-6">
                <QrCode className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <p className="text-xs text-muted-foreground font-medium">{scan.message}</p>
              </div>
            )}

            {scan.status === 'success' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-success text-success-text flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-success-text tracking-tight">Access granted</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">{scan.message}</p>
                </div>
                {scan.member && (
                  <div className="p-4 rounded-xl bg-success border border-success-text/20 text-left text-xs space-y-1">
                    <span className="font-bold text-foreground block">{scan.member.full_name}</span>
                    <span className="text-muted-foreground block font-mono">{scan.member.member_code}</span>
                    <span className="text-success-text font-semibold block">Attendance recorded</span>
                  </div>
                )}
              </motion.div>
            )}

            {scan.status === 'error' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-danger text-danger-text flex items-center justify-center mx-auto">
                  <XCircle className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-danger-text tracking-tight">Entry blocked</h3>
                  <p className="text-xs font-semibold text-danger-text/80 mt-1">{scan.message}</p>
                </div>
                {scan.member && (
                  <div className="p-4 rounded-xl bg-danger border border-danger-text/20 text-left text-xs space-y-1">
                    <span className="font-bold text-foreground block">{scan.member.full_name}</span>
                    <span className="text-danger-text font-semibold block">Renew at reception to continue.</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setScan({ status: 'idle', message: 'Ready for the next scan.' })}>
              Clear
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
