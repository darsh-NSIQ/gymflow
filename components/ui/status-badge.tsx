import React from 'react'

export type StatusType =
  | 'active'
  | 'paid'
  | 'completed'
  | 'expiring'
  | 'partial'
  | 'pending'
  | 'expired'
  | 'failed'
  | 'overdue'
  | 'no_show'
  | 'broken'
  | 'suspended'
  | 'frozen'
  | 'scheduled'
  | 'maintenance'
  | 'inactive'
  | 'archived'
  | 'cancelled'
  | 'refunded'
  | 'retired'
  | string

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, '_')

  let styleClasses = 'bg-neutralBadge text-neutralBadge-text border-transparent'

  // Success
  if (['active', 'paid', 'completed'].includes(normalized)) {
    styleClasses = 'bg-success text-success-text border-transparent'
  }
  // Warning
  else if (['expiring', 'expiring_soon', 'partial', 'pending'].includes(normalized)) {
    styleClasses = 'bg-warning text-warning-text border-transparent'
  }
  // Danger
  else if (['expired', 'failed', 'overdue', 'no_show', 'broken'].includes(normalized)) {
    styleClasses = 'bg-danger text-danger-text border-transparent'
  } else if (normalized === 'suspended') {
    styleClasses = 'bg-transparent text-danger-text border-danger-icon border'
  }
  // Info
  else if (['frozen', 'scheduled', 'maintenance'].includes(normalized)) {
    styleClasses = 'bg-info text-info-text border-transparent'
  }
  // Neutral
  else if (['inactive', 'archived', 'cancelled', 'refunded', 'retired'].includes(normalized)) {
    styleClasses = 'bg-neutralBadge text-neutralBadge-text border-transparent'
  }

  const displayLabel = label || status.replace(/_/g, ' ').toUpperCase()

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${styleClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {displayLabel}
    </span>
  )
}
