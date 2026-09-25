'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, CheckCircle, XCircle, AlertTriangle, Shield, Volume2, Camera } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'

export default function QRScannerPage() {
  const { members, recordAttendance } = useApp()
  const [scannedResult, setScannedResult] = useState<{
    status: 'success' | 'error' | 'idle'
    message: string
    member?: any
  }>({ status: 'idle', message: 'Waiting for QR scan at reception...' })

  const handleSimulateScan = (qrToken: string) => {
    const member = members.find((m) => m.qr_token === qrToken || m.id === qrToken)
    const result = recordAttendance(qrToken, 'qr_scan')

    if (result.success) {
      setScannedResult({
        status: 'success',
        message: result.message,
        member,
      })
    } else {
      setScannedResult({
        status: 'error',
        message: result.message,
        member,
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Reception QR Scanner</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Scan member QR card for automated attendance check-in and membership validation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Animated Scanner Viewfinder Box */}
        <Card className="p-6 flex flex-col items-center justify-center text-center bg-slate-950 text-white shadow-soft-xl relative overflow-hidden border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-60" />
          
          <div className="relative h-52 w-52 rounded-3xl border-4 border-primary/60 flex flex-col items-center justify-center p-4 my-4 overflow-hidden shadow-brand-ring">
            {/* Animated Laser Sweep Line */}
            <div className="scanner-laser" />

            <QrCode className="h-16 w-16 text-primary mb-2 opacity-80" />
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Webcam Live Scanner</span>
          </div>

          <p className="text-xs text-slate-300 font-medium">Position QR Code inside the frame</p>

          {/* Quick Demo Simulator buttons */}
          <div className="mt-6 w-full pt-4 border-t border-slate-800 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Simulate Member QR Scan:
            </span>
            <div className="space-y-1.5">
              {members.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSimulateScan(m.qr_token)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{m.full_name} ({m.member_code})</span>
                  <StatusBadge status={m.status} />
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Scan Result Feedback Card */}
        <Card className="p-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-4 border-b border-border">
            <CardTitle className="text-lg">Scan Validation Result</CardTitle>
            <CardDescription>Instant membership status verification</CardDescription>
          </CardHeader>

          <CardContent className="p-0 py-6 text-center my-auto">
            {scannedResult.status === 'idle' && (
              <div className="space-y-2 py-8">
                <QrCode className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <p className="text-xs text-muted-foreground font-medium">{scannedResult.message}</p>
              </div>
            )}

            {scannedResult.status === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className="space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-emerald-700 tracking-tight">ACCESS GRANTED</h2>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">{scannedResult.message}</p>
                </div>
                {scannedResult.member && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-xs space-y-1">
                    <span className="font-bold text-foreground block">{scannedResult.member.full_name}</span>
                    <span className="text-muted-foreground block font-mono">{scannedResult.member.member_code}</span>
                    <span className="text-emerald-700 font-semibold block">Attendance Recorded</span>
                  </div>
                )}
              </motion.div>
            )}

            {scannedResult.status === 'error' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className="space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-soft-sm">
                  <XCircle className="h-10 w-10 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-red-600 tracking-tight">MEMBERSHIP EXPIRED</h2>
                  <p className="text-xs font-semibold text-red-700 mt-1">{scannedResult.message}</p>
                </div>
                {scannedResult.member && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-left text-xs space-y-1">
                    <span className="font-bold text-foreground block">{scannedResult.member.full_name}</span>
                    <span className="text-red-700 font-semibold block">Please renew membership to enter.</span>
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScannedResult({ status: 'idle', message: 'Ready for next scan...' })}
            >
              Reset Scanner
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
