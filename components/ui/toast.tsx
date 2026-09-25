'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'
import { useApp } from '@/lib/context'

export function ToastContainer() {
  const { toastMessage } = useApp()

  if (!toastMessage) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-4 right-4 sm:left-auto sm:right-5 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-5 z-[60] flex items-center gap-3 bg-card text-foreground px-4 py-3 rounded-xl shadow-soft-xl animate-in slide-in-from-bottom-5 duration-fast border border-border sm:max-w-sm"
    >
      <CheckCircle className="h-5 w-5 text-success-icon shrink-0" />
      <span className="text-sm font-medium break-words">{toastMessage}</span>
    </div>
  )
}
