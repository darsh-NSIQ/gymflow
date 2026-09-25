'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

export default function TrainersPage() {
  const { trainers, branches, addTrainer } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [salary, setSalary] = useState('')

  const canSave = name.trim().length > 1 && phone.trim().length >= 10

  const save = () => {
    if (!canSave) return
    addTrainer({
      name: name.trim(),
      phone: phone.trim(),
      specialization: specialization.trim() || 'General fitness',
      salary_paise: rupeesToPaise(Number(salary) || 0),
    })
    setName('')
    setPhone('')
    setSpecialization('')
    setSalary('')
    setIsAddModalOpen(false)
  }

  const branchName = (id: string) => branches.find((b) => b.id === id)?.name ?? ''

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Trainers</h1>
          <p className="text-xs text-muted-foreground mt-1">{trainers.length} on the team · salary and PT commission</p>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Add trainer</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {trainers.map((t) => (
          <Card key={t.id} hoverable>
            <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <img
                src={t.photo_url || '/logo.png'}
                alt={t.name}
                className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl object-cover border-2 border-primary/30"
              />
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg truncate">{t.name}</CardTitle>
                <CardDescription className="text-xs break-words">{t.specialization}</CardDescription>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={t.status} />
                  <span className="text-[10px] text-muted-foreground truncate">{branchName(t.branch_id)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs border-t border-border pt-4 p-4 sm:p-6 sm:pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-bold text-foreground">{t.experience_years} yrs</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Assigned members</span>
                <span className="font-bold text-primary">{t.assigned_members_count}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Monthly salary</span>
                <span className="font-bold text-foreground whitespace-nowrap">{formatCurrency(t.salary_paise)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">PT commission</span>
                <span className="font-bold text-success-text">{t.commission_pct}%</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
                <a href={`tel:${t.phone.replace(/\s+/g, '')}`} className="font-semibold text-foreground hover:text-primary min-h-[32px] inline-flex items-center">
                  {t.phone}
                </a>
                <span className="text-muted-foreground">Since {t.joining_date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add trainer"
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" onClick={save} disabled={!canSave}>
              Save trainer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="tr-name" className="text-xs font-semibold mb-1 block">
              Full name
            </label>
            <Input id="tr-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="tr-phone" className="text-xs font-semibold mb-1 block">
              Phone
            </label>
            <Input id="tr-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98250 00000" />
          </div>
          <div>
            <label htmlFor="tr-spec" className="text-xs font-semibold mb-1 block">
              Specialization
            </label>
            <Input id="tr-spec" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Strength, weight loss, CrossFit…" />
          </div>
          <div>
            <label htmlFor="tr-salary" className="text-xs font-semibold mb-1 block">
              Monthly salary (₹)
            </label>
            <Input id="tr-salary" type="number" inputMode="numeric" min={0} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="0" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
