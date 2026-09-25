'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

interface QrCodeProps {
  value: string
  label?: string
  className?: string
}

/** Renders a real scannable QR code for a member token, on a white tile. */
export function QrCode({ value, label, className }: QrCodeProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(value, { margin: 1, width: 512, color: { dark: '#08090D', light: '#FFFFFF' } })
      .then((url) => {
        if (!cancelled) setSrc(url)
      })
      .catch(() => {
        if (!cancelled) setSrc(null)
      })
    return () => {
      cancelled = true
    }
  }, [value])

  return (
    <div className={cn('p-3 bg-white rounded-2xl border-2 border-primary/40 w-full max-w-[220px]', className)}>
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-white flex items-center justify-center">
        {src ? (
          <img src={src} alt={label ? `QR code for ${label}` : 'Member QR code'} className="h-full w-full object-contain" />
        ) : (
          <span className="font-mono text-[10px] text-black/60 p-3 text-center break-all">{value}</span>
        )}
      </div>
    </div>
  )
}
