'use client'

import React, { useState } from 'react'
import { UserCheck, Plus, Phone, Mail, Award, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

export default function TrainersPage() {
  const { trainers, addTrainer, gym } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [salary, setSalary] = useState('35000')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Trainers & Fitness Staff</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage personal trainers, working schedules, salary, and commission structures
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-soft-sm">
          <Plus className="h-4 w-4" />
          <span>Add Trainer</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainers.map((t) => (
          <Card key={t.id} hoverable>
            <CardHeader className="flex flex-row items-center gap-4">
              <img
                src={t.photo_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                alt={t.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/30"
              />
              <div>
                <CardTitle className="text-lg">{t.name}</CardTitle>
                <CardDescription className="text-xs">{t.specialization}</CardDescription>
                <div className="mt-1">
                  <StatusBadge status={t.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-bold text-foreground">{t.experience_years} Years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assigned Members</span>
                <span className="font-bold text-primary">{t.assigned_members_count} Members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly Salary</span>
                <span className="font-bold text-foreground">{formatCurrency(t.salary_paise, '₹')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">PT Commission</span>
                <span className="font-bold text-emerald-600">{t.commission_pct}% Cut</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Certified Trainer"
        description="Register trainer profile, specialization, and base salary."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Trainer Full Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vikram Malhotra" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Phone Number *</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98250 88888" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Specialization</label>
            <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="CrossFit / Strength / Pilates" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Monthly Salary (₹)</label>
            <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (name && phone) {
                  addTrainer({
                    name,
                    phone,
                    specialization: specialization || 'Fitness Trainer',
                    salary_paise: rupeesToPaise(Number(salary)),
                  })
                  setName('')
                  setPhone('')
                  setIsAddModalOpen(false)
                }
              }}
            >
              Save Trainer
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
