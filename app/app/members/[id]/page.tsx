'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  User,
  CreditCard,
  Calendar,
  DollarSign,
  Dumbbell,
  Apple,
  TrendingUp,
  Bell,
  FileText,
  Clock,
  ArrowLeft,
  Plus,
  Lock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { QrCode } from '@/components/ui/qr-code'
import { useApp } from '@/lib/context'
import { getDaysRemaining } from '@/lib/dates'
import { formatCurrency } from '@/lib/money'

export default function MemberProfilePage() {
  const params = useParams()
  const memberId = params.id as string

  const {
    members,
    plans,
    memberships,
    attendance,
    payments,
    workouts,
    diets,
    assignMembership,
    freezeMembership,
    gym,
  } = useApp()

  const member = members.find((m) => m.id === memberId) || members[0]
  const currentMembership = memberships.find((ms) => ms.member_id === member.id)
  const memberAttendance = attendance.filter((a) => a.member_id === member.id)
  const memberPayments = payments.filter((p) => p.member_id === member.id)
  const memberWorkout = workouts.find((w) => w.member_id === member.id)
  const memberDiet = diets.find((d) => d.member_id === member.id)

  const daysRemaining = currentMembership
    ? getDaysRemaining(currentMembership.end_date)
    : 0

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'membership'
    | 'attendance'
    | 'payments'
    | 'workout'
    | 'diet'
    | 'progress'
    | 'pt'
    | 'notifications'
    | 'documents'
    | 'notes'
    | 'timeline'
  >('overview')

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('plan_01')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'membership', label: 'Membership', icon: CreditCard },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'diet', label: 'Diet', icon: Apple },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'pt', label: 'PT Sessions', icon: Dumbbell },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'timeline', label: 'Activity Timeline', icon: Clock },
  ]

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div>
        <Link href="/app/members" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to members</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
            <img
              src={member.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
              alt={member.full_name}
              className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl object-cover border-2 border-primary/30 shadow-soft-sm"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground break-words">{member.full_name}</h1>
                <StatusBadge status={member.status} />
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {member.member_code} • Joined {member.joining_date}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground mt-2">
                <span>Trainer: <strong className="text-foreground">{member.assigned_trainer_name || 'None'}</strong></span>
                <span>Phone: <strong className="text-foreground">{member.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-3 md:flex items-stretch gap-2 sm:gap-3 w-full md:w-auto">
            <div className="p-2.5 sm:p-3 rounded-xl bg-primary-soft text-primary-softText border border-primary/20 text-center min-w-0 md:min-w-[120px]">
              <span className="text-[10px] uppercase font-bold block opacity-80">Current Plan</span>
              <span className="text-xs sm:text-sm font-extrabold block leading-tight line-clamp-2">{currentMembership?.plan_name || 'No plan'}</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-success text-success-text border border-success-text/20 text-center min-w-0 md:min-w-[100px]">
              <span className="text-[10px] uppercase font-extrabold block opacity-80">Days Left</span>
              <span className="text-xs sm:text-sm font-extrabold block">{daysRemaining} days</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-warning text-warning-text border border-warning-text/20 text-center min-w-0 md:min-w-[100px]">
              <span className="text-[10px] uppercase font-extrabold block opacity-80">Check-Ins</span>
              <span className="text-xs sm:text-sm font-extrabold block">{memberAttendance.length} visits</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b border-border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist">
        <div className="flex items-center gap-1 min-w-max pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 min-h-[44px] rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-soft-sm font-bold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-muted-foreground font-semibold">Gender / DOB</span>
                  <span className="font-bold text-foreground capitalize">{member.gender} • {member.dob}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground font-semibold">Emergency Contact</span>
                  <span className="font-bold text-foreground break-words">{member.emergency_name} ({member.emergency_phone})</span>
                </div>
                <div>
                  <span className="block text-muted-foreground font-semibold">Preferred Workout Time</span>
                  <span className="font-bold text-foreground">{member.preferred_workout_time || 'Morning'}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground font-semibold">Referral Source</span>
                  <span className="font-bold text-foreground">{member.source}</span>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <span className="block text-muted-foreground font-semibold mb-1">Health Notes & Injuries</span>
                <p className="p-3 rounded-lg bg-muted/60 text-foreground text-xs leading-relaxed">
                  {member.health_notes || 'No health notes recorded.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Member QR Code Card */}
          <Card className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <QrCode value={member.qr_token} label={member.full_name} className="mb-3" />
            <span className="font-mono text-xs font-bold text-foreground">{member.member_code}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Scan at reception for attendance</span>
          </Card>
        </div>
      )}

      {/* 2. Membership Tab */}
      {activeTab === 'membership' && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
            <div>
              <h2 className="text-lg font-bold">Membership</h2>
              <p className="text-xs text-muted-foreground">Renew, change plan or freeze.</p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <Button size="sm" onClick={() => setIsAssignModalOpen(true)} className="gap-1 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span>Assign plan</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsFreezeModalOpen(true)} className="gap-1 w-full sm:w-auto" disabled={!currentMembership}>
                <Lock className="h-4 w-4" />
                <span>Freeze</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {currentMembership ? (
              <div className="p-4 sm:p-5 rounded-xl border border-primary/30 bg-primary-soft/40 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground">{currentMembership.plan_name}</h3>
                    <span className="text-xs text-muted-foreground">
                      Valid: {currentMembership.start_date} to {currentMembership.end_date}
                    </span>
                  </div>
                  <StatusBadge status={currentMembership.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-primary/20">
                  <div>
                    <span className="text-muted-foreground block">Plan Price</span>
                    <span className="font-bold text-foreground">{formatCurrency(currentMembership.price_paise, '₹')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">GST ({gym.cgst_rate + gym.sgst_rate}%)</span>
                    <span className="font-bold text-foreground">{formatCurrency(currentMembership.tax_paise, '₹')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Payment Status</span>
                    <span className="font-bold text-success-text uppercase">{currentMembership.payment_status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No membership yet. Use “Assign plan” to start one.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 3. Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Attendance</h2>
          <div className="space-y-2">
            {memberAttendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 text-xs">
                <div>
                  <span className="font-bold text-foreground">{a.date}</span>
                  <span className="text-muted-foreground block">Method: {a.method}</span>
                </div>
                <div className="text-right">
                  <span className="text-success-text font-bold block">In {a.check_in.split('T')[1]?.slice(0, 5)}</span>
                  <span className="text-muted-foreground font-medium block">
                    {a.check_out ? `Out ${a.check_out.split('T')[1]?.slice(0, 5)}` : 'Inside'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 4. Payments Tab */}
      {activeTab === 'payments' && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Payments</h2>
          <div className="space-y-3">
            {memberPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-muted/20 text-xs">
                <div className="min-w-0">
                  <span className="font-bold text-foreground block truncate">{p.invoice_number}</span>
                  <span className="text-muted-foreground">{p.payment_date.split('T')[0]} • {p.payment_method.toUpperCase()}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-foreground block whitespace-nowrap">{formatCurrency(p.paid_paise, '₹')}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5. Workout Tab */}
      {activeTab === 'workout' && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Workout plan</h2>
          {memberWorkout ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-primary-soft/50 border border-primary/20">
                <h3 className="font-bold text-base text-foreground">{memberWorkout.name}</h3>
                <p className="text-muted-foreground">Goal: {memberWorkout.goal} • Trainer: {memberWorkout.trainer_name}</p>
              </div>
              <div className="space-y-3">
                {memberWorkout.exercises.map((day) => (
                  <div key={day.day} className="p-4 rounded-xl border border-border bg-card">
                    <h4 className="font-bold text-foreground mb-2">{day.day}</h4>
                    <div className="space-y-1">
                      {day.list.map((ex) => (
                        <div key={ex.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 text-muted-foreground py-1 border-b border-border/60 last:border-0">
                          <span>{ex.name} <span className="opacity-70">({ex.muscle_group})</span></span>
                          <span className="font-mono font-semibold text-foreground">{ex.sets} × {ex.reps} · {ex.weight_kg}kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No workout plan assigned yet.</p>
          )}
        </Card>
      )}

      {/* 6. Diet Tab */}
      {activeTab === 'diet' && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Diet plan</h2>
          {memberDiet ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center p-4 rounded-xl bg-muted/60">
                <div><span className="block text-muted-foreground">Calories</span><span className="font-bold text-base">{memberDiet.calories_target} kcal</span></div>
                <div><span className="block text-muted-foreground">Protein</span><span className="font-bold text-base">{memberDiet.protein_g}g</span></div>
                <div><span className="block text-muted-foreground">Carbs</span><span className="font-bold text-base">{memberDiet.carbs_g}g</span></div>
                <div><span className="block text-muted-foreground">Water</span><span className="font-bold text-base">{memberDiet.water_liters}L</span></div>
              </div>
              <div className="space-y-2">
                {memberDiet.meals.map((m) => (
                  <div key={m.name} className="p-3 rounded-lg border border-border flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-bold text-foreground block">{m.name} ({m.time})</span>
                      <span className="text-muted-foreground break-words">{m.items.join(', ')}</span>
                    </div>
                    <span className="font-mono font-semibold whitespace-nowrap shrink-0">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No diet plan assigned.</p>
          )}
        </Card>
      )}

      {/* Fallback for remaining tabs */}
      {['progress', 'pt', 'notifications', 'documents', 'notes', 'timeline'].includes(activeTab) && (
        <Card className="p-8 text-center text-xs text-muted-foreground">
          <h3 className="font-bold text-sm text-foreground capitalize mb-1">{activeTab.replace('pt', 'PT sessions')}</h3>
          <p>Nothing recorded here yet for {member.full_name}.</p>
        </Card>
      )}

      {/* Assign Membership Modal */}
      <Dialog
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign plan"
        description={`New plan for ${member.full_name}.`}
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                assignMembership(member.id, selectedPlanId)
                setIsAssignModalOpen(false)
              }}
            >
              Assign plan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="assign-plan" className="text-xs font-semibold mb-1 block">Plan</label>
            <select
              id="assign-plan"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatCurrency(p.price_paise, '₹')} ({p.duration_value} {p.duration_unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>

      {/* Freeze Membership Modal */}
      <Dialog
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        title="Freeze membership"
        description="Pauses check-in and extends the end date by the frozen days."
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsFreezeModalOpen(false)}>Cancel</Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                if (currentMembership) freezeMembership(currentMembership.id, 14)
                setIsFreezeModalOpen(false)
              }}
            >
              Freeze for 14 days
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          {currentMembership
            ? `${currentMembership.plan_name} currently ends on ${currentMembership.end_date}. Freezing adds 14 days.`
            : 'No active membership to freeze.'}
        </p>
      </Dialog>
    </div>
  )
}
