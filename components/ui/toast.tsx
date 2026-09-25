'use client'

import React from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useApp } from '@/lib/context'

export function ToastContainer() {
  const { toastMessage } = useApp()

  if (!toastMessage) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-soft-xl animate-in slide-in-from-bottom-5 duration-fast border border-slate-700">
      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-medium">{toastMessage}</span>
    </div>
  )
}
