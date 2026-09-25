'use client'

import React from 'react'
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import { formatCurrency } from '@/lib/money'

export default function EquipmentPage() {
  const { equipment } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Equipment & Maintenance</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Track machinery condition, warranty expiry dates, and scheduled maintenance alerts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {equipment.map((eq) => (
          <Card key={eq.id} hoverable>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={eq.status} />
                <span className="text-[11px] font-mono text-muted-foreground">{eq.location}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">{eq.name}</h2>
              <p className="text-xs text-muted-foreground">{eq.brand} • {eq.model}</p>
              <div className="border-t border-border pt-3 text-xs space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Purchase Price:</span>
                  <span className="font-bold text-foreground">{formatCurrency(eq.cost_paise, '₹')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Warranty Expiry:</span>
                  <span className="font-semibold text-foreground">{eq.warranty_expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Maintenance:</span>
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
