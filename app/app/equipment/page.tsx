'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import { formatCurrency } from '@/lib/money'

export default function EquipmentPage() {
  const { equipment } = useApp()
  const needsAttention = equipment.filter((e) => e.status === 'maintenance' || e.status === 'broken').length

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Equipment</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {equipment.length} machines on record · {needsAttention} need attention
        </p>
      </div>

      {equipment.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">No equipment recorded yet.</Card>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {equipment.map((eq) => (
          <Card key={eq.id} hoverable>
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={eq.status} />
                <span className="text-[11px] font-mono text-muted-foreground truncate">{eq.location}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">{eq.name}</h2>
              <p className="text-xs text-muted-foreground">
                {eq.brand} · {eq.model}
              </p>
              <div className="border-t border-border pt-3 text-xs space-y-1.5 text-muted-foreground">
                <div className="flex justify-between gap-3">
                  <span>Purchase price</span>
                  <span className="font-bold text-foreground whitespace-nowrap">{formatCurrency(eq.cost_paise)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Warranty till</span>
                  <span className="font-semibold text-foreground">{eq.warranty_expiry}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Next service</span>
                  <span className="font-bold text-primary">{eq.next_maintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
