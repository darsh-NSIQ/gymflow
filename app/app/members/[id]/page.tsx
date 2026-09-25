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
  QrCode,
  Shield,
  ArrowLeft,
  CheckCircle,
  Plus,
  RefreshCw,
  Lock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
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
    showToast,
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
          <span>Back to Members List</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={member.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
              alt={member.full_name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/30 shadow-soft-sm"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-foreground">{member.full_name}</h1>
                <StatusBadge status={member.status} />
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {member.member_code} • Joined {member.joining_date}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-2">
                <span>Trainer: <strong className="text-foreground">{member.assigned_trainer_name || 'None'}</strong></span>
                <span>Phone: <strong className="text-foreground">{member.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Key Quick Stats */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="p-3 rounded-xl bg-primary-soft text-primary-softText border border-primary/20 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold block opacity-80">Current Plan</span>
              <span className="text-sm font-extrabold block truncate">{currentMembership?.plan_name || 'No Active Plan'}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold block opacity-80">Days Left</span>
              <span className="text-sm font-extrabold block">{daysRemaining} Days</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold block opacity-80">Check-Ins</span>
              <span className="text-sm font-extrabold block">{memberAttendance.length} Visits</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Member Details & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-muted-foreground font-semibold">Gender / DOB</span>
                  <span className="font-bold text-foreground capitalize">{member.gender} • {member.dob}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground font-semibold">Emergency Contact</span>
                  <span className="font-bold text-foreground">{member.emergency_name} ({member.emergency_phone})</span>
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
                  {member.health_notes || 'No health restrictions reported by member.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Member QR Code Card */}
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 bg-white rounded-2xl border-2 border-primary/20 shadow-soft-md mb-3">
              <div className="h-40 w-40 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono text-xs p-2 text-center">
                [QR ID CARD]<br />{member.qr_token}
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-foreground">{member.member_code}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Scan at reception for attendance</span>
          </Card>
        </div>
      )}

      {/* 2. Membership Tab */}
      {activeTab === 'membership' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Active Subscriptions & History</h2>
              <p className="text-xs text-muted-foreground">Manage renewal, plan upgrade, freeze, or extensions.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setIsAssignModalOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Assign New Plan</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsFreezeModalOpen(true)} className="gap-1">
                <Lock className="h-4 w-4" />
                <span>Freeze Membership</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {currentMembership ? (
              <div className="p-5 rounded-xl border border-primary/30 bg-primary-soft/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{currentMembership.plan_name}</h3>
                    <span className="text-xs text-muted-foreground">
                      Valid: {currentMembership.start_date} to {currentMembership.end_date}
                    </span>
                  </div>
                  <StatusBadge status={currentMembership.status} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-primary/20">
                  <div>
                    <span className="text-muted-foreground block">Plan Price</span>
                    <span className="font-bold text-foreground">{formatCurrency(currentMembership.price_paise, '₹')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Tax (18% GST)</span>
                    <span className="font-bold text-foreground">{formatCurrency(currentMembership.tax_paise, '₹')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Payment Status</span>
                    <span className="font-bold text-emerald-600 uppercase">{currentMembership.payment_status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No active membership assigned. Click "Assign New Plan" above.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 3. Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Attendance Check-In Logs</h2>
          <div className="space-y-2">
            {memberAttendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 text-xs">
                <div>
                  <span className="font-bold text-foreground">{a.date}</span>
                  <span className="text-muted-foreground block">Method: {a.method}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-bold block">Check In: {a.check_in.split('T')[1]?.slice(0, 5)}</span>
                  <span className="text-muted-foreground font-medium block">
                    {a.check_out ? `Check Out: ${a.check_out.split('T')[1]?.slice(0, 5)}` : 'Inside Gym'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 4. Payments Tab */}
      {activeTab === 'payments' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Payment Receipts & Invoices</h2>
          <div className="space-y-3">
            {memberPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 text-xs">
                <div>
                  <span className="font-bold text-foreground block">{p.invoice_number}</span>
                  <span className="text-muted-foreground">{p.payment_date.split('T')[0]} • {p.payment_method.toUpperCase()}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-foreground block">{formatCurrency(p.paid_paise, '₹')}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5. Workout Tab */}
      {activeTab === 'workout' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Assigned Workout Plan</h2>
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
                        <div key={ex.id} className="flex items-center justify-between text-muted-foreground">
                          <span>{ex.name} ({ex.muscle_group})</span>
                          <span className="font-mono font-semibold">{ex.sets} sets × {ex.reps} reps ({ex.weight_kg}kg)</span>
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
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Diet & Nutrition Plan</h2>
          {memberDiet ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3 text-center p-4 rounded-xl bg-muted/60">
                <div><span className="block text-muted-foreground">Calories</span><span className="font-bold text-base">{memberDiet.calories_target} kcal</span></div>
                <div><span className="block text-muted-foreground">Protein</span><span className="font-bold text-base">{memberDiet.protein_g}g</span></div>
                <div><span className="block text-muted-foreground">Carbs</span><span className="font-bold text-base">{memberDiet.carbs_g}g</span></div>
                <div><span className="block text-muted-foreground">Water</span><span className="font-bold text-base">{memberDiet.water_liters}L</span></div>
              </div>
              <div className="space-y-2">
                {memberDiet.meals.map((m) => (
                  <div key={m.name} className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">{m.name} ({m.time})</span>
                      <span className="text-muted-foreground">{m.items.join(', ')}</span>
                    </div>
                    <span className="font-mono font-semibold">{m.calories} kcal</span>
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
          <h3 className="font-bold text-sm text-foreground capitalize mb-1">{activeTab} Details</h3>
          <p>Tab records ready and connected for {member.full_name}.</p>
        </Card>
      )}

      {/* Assign Membership Modal */}
      <Dialog
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Membership Plan"
        description={`Select a new plan to assign to ${member.full_name}.`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Choose Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatCurrency(p.price_paise, '₹')} ({p.duration_value} {p.duration_unit})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                assignMembership(member.id, selectedPlanId)
                setIsAssignModalOpen(false)
              }}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Freeze Membership Modal */}
      <Dialog
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        title="Freeze Membership"
        description="Temporarily pause attendance and extend expiry date."
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Freezing will extend the membership end date by the specified number of frozen days.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsFreezeModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (currentMembership) {
                  freezeMembership(currentMembership.id, 14)
                }
                setIsFreezeModalOpen(false)
              }}
            >
              Confirm Freeze (14 Days)
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
