'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: string
  footer?: React.ReactNode
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'sm:max-w-lg',
  footer,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-fast"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        className={cn(
          'relative w-full flex flex-col bg-card shadow-soft-xl border border-border z-10 outline-none',
          'rounded-t-2xl sm:rounded-2xl max-h-[92dvh] sm:max-h-[85vh]',
          'animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-fast',
          maxWidth.startsWith('max-w-') ? `sm:${maxWidth}` : maxWidth
        )}
      >
        <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-border shrink-0">
          <div className="min-w-0">
            {title && (
              <h2 id="dialog-title" className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                {title}
              </h2>
            )}
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="h-10 w-10 -mr-2 -mt-1 shrink-0 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-border px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            {footer}
          </div>
        )}
        {!footer && <div className="h-[env(safe-area-inset-bottom)] sm:hidden shrink-0" />}
      </div>
    </div>
  )
}
