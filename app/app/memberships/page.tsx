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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Membership Plans</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create and configure subscription tiers for your gym ({plans.length} active plans)
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-soft-sm">
          <Plus className="h-4 w-4" />
          <span>Create New Plan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="text-3xl font-extrabold text-foreground">
                  {formatCurrency(p.price_paise, gym.currency === 'INR' ? '₹' : '$')}
                </span>
                <span className="text-xs text-muted-foreground ml-1">+ 18% GST</span>
              </div>
              <CardDescription className="mt-2 text-xs leading-relaxed">{p.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs border-t border-border mt-4">
              <ul className="space-y-2 py-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Full Gym Equipment Access</span>
                </li>
                {p.freeze_allowed && (
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Freeze Allowance: {p.freeze_days} Days</span>
                  </li>
                )}
                {p.pt_included && (
                  <li className="flex items-center gap-2 text-primary font-bold">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span>Includes {p.pt_sessions_count} PT Sessions</span>
                  </li>
                )}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Edit Plan Settings
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Membership Plan"
        description="Configure pricing, duration, and freeze allowances."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Plan Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quarterly Executive" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Price in INR (₹) *</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Duration</label>
              <div className="flex gap-2">
                <Input type="number" value={durationValue} onChange={(e) => setDurationValue(e.target.value)} className="w-20" />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value as any)}
                  className="flex-1 h-10 px-2 rounded-md border border-input bg-card text-xs font-semibold"
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
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (name && price) {
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
              }}
            >
              Save Plan
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
