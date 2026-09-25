'use client'

import React, { useState } from 'react'
import { CreditCard, Plus, Check, Lock, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

export default function MembershipsPage() {
  const { plans, addPlan, gym } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('3500')
  const [durationValue, setDurationValue] = useState('1')
  const [durationUnit, setDurationUnit] = useState<'days' | 'months' | 'years'>('months')
  const [description, setDescription] = useState('')
  const [freezeDays, setFreezeDays] = useState('7')

  const savePlan = () => {
    if (!name || !price) return
    addPlan({
      name,
      price_paise: rupeesToPaise(Number(price)),
      duration_value: Number(durationValue),
      duration_unit: durationUnit,
      description,
      freeze_allowed: Number(freezeDays) > 0,
      freeze_days: Number(freezeDays),
    })
    setName('')
    setIsAddModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Membership plans</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {plans.length} plans available at reception
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-soft-sm w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>New plan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((p) => (
          <Card key={p.id} hoverable className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <StatusBadge status={p.status} />
                <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                  {p.duration_value} {p.duration_unit}
                </span>
              </div>
              <CardTitle className="text-xl mt-2">{p.name}</CardTitle>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground whitespace-nowrap">
                  {formatCurrency(p.price_paise, gym.currency === 'INR' ? '₹' : '$')}
                </span>
                {gym.gst_registered && (
                  <span className="text-xs text-muted-foreground ml-1">+ {gym.cgst_rate + gym.sgst_rate}% GST</span>
                )}
              </div>
              <CardDescription className="mt-2 text-xs leading-relaxed">{p.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs border-t border-border mt-4">
              <ul className="space-y-2 py-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-success-text" />
                  <span>Full gym floor access</span>
                </li>
                {p.freeze_allowed && (
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-success-text" />
                    <span>Freeze up to {p.freeze_days} days</span>
                  </li>
                )}
                {p.pt_included && (
                  <li className="flex items-center gap-2 text-primary font-bold">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span>Includes {p.pt_sessions_count} PT sessions</span>
                  </li>
                )}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Edit plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New membership plan"
        description="Price, duration and freeze allowance."
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="w-full sm:w-auto" disabled={!name || !price} onClick={savePlan}>Save plan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Plan Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quarterly Executive" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Price in INR (₹) *</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Duration</label>
              <div className="flex gap-2">
                <Input type="number" value={durationValue} onChange={(e) => setDurationValue(e.target.value)} className="w-24" inputMode="numeric" />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value as any)}
                  className="flex-1 min-w-0 h-11 sm:h-10 px-2 rounded-md border border-input bg-card text-base sm:text-xs font-semibold"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Includes steam bath, cardio zone..." />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Freeze allowance (days)</label>
            <Input type="number" inputMode="numeric" min={0} value={freezeDays} onChange={(e) => setFreezeDays(e.target.value)} />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
