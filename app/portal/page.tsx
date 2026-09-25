'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Dumbbell, Apple, CheckCircle, ArrowLeft, Phone, Calendar, Receipt } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { ExerciseDemoModal } from '@/components/ui/exercise-demo-modal'
import { QrCode } from '@/components/ui/qr-code'
import { useApp } from '@/lib/context'
import { getDaysRemaining } from '@/lib/dates'
import { formatCurrency } from '@/lib/money'

export default function MemberPortalPage() {
  const { gym, currentUser, members, memberships, workouts, diets, attendance, payments, trainers, showToast } = useApp()

  const member =
    members.find((m) => m.user_id === currentUser.id) ??
    members.find((m) => m.email && m.email === currentUser.email) ??
    members[0]

  const [demoExerciseName, setDemoExerciseName] = useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({})
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({})

  if (!member) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center p-6 text-center">
        <Card className="p-8 max-w-sm space-y-3">
          <p className="text-sm text-muted-foreground">No member profile is linked to this sign-in yet. Ask reception to link your account.</p>
          <Link href="/" className="text-primary font-bold text-sm">
            Back to site
          </Link>
        </Card>
      </div>
    )
  }

  const currentMs = memberships.find((ms) => ms.member_id === member.id)
  const workout = workouts.find((w) => w.member_id === member.id)
  const diet = diets.find((d) => d.member_id === member.id)
  const myAttendance = attendance.filter((a) => a.member_id === member.id).sort((a, b) => b.date.localeCompare(a.date))
  const myPayments = payments.filter((p) => p.member_id === member.id)
  const dues = myPayments.reduce((s, p) => s + p.due_paise, 0)
  const trainer = trainers.find((t) => t.id === member.assigned_trainer_id)
  const daysLeft = currentMs ? getDaysRemaining(currentMs.end_date) : 0
  const todayIdx = new Date().getDay() // 0 = Sunday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayPlan = workout?.exercises.find((d) => d.day.toLowerCase().startsWith(dayNames[todayIdx].toLowerCase())) ?? workout?.exercises[0]

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }))
  }
  const toggleMeal = (name: string) => {
    setCompletedMeals((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="min-h-dvh bg-background text-foreground pb-[calc(1.5rem+env(safe-area-inset-bottom))] font-sans">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" aria-label="Back" className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-7 w-7 object-contain shrink-0" />
          <span className="font-extrabold text-sm text-foreground truncate">{gym.name}</span>
        </div>
        <StatusBadge status={member.status} />
      </header>

      <main className="p-4 space-y-4 max-w-lg mx-auto">
        <Card className="p-4 sm:p-5 bg-gradient-to-br from-primary-soft to-card border-primary/30">
          <div className="flex items-center gap-4">
            <img src={member.photo_url || '/logo.png'} alt={member.full_name} className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-primary" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-foreground truncate">{member.full_name}</h1>
              <p className="text-xs text-muted-foreground font-mono">{member.member_code}</p>
              {currentMs ? (
                <div className="mt-2 inline-flex flex-wrap items-center gap-x-2 px-3 py-1 rounded-full bg-success text-success-text text-xs font-bold">
                  <span className="truncate max-w-[180px]">{currentMs.plan_name}</span>
                  <span>· {daysLeft} days left</span>
                </div>
              ) : (
                <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-warning text-warning-text text-xs font-bold">No active plan</div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <Calendar className="h-4 w-4 text-primary mx-auto" />
            <span className="block text-lg font-extrabold mt-1">{myAttendance.length}</span>
            <span className="block text-[10px] text-muted-foreground font-semibold">visits</span>
          </Card>
          <Card className="p-3 text-center">
            <Dumbbell className="h-4 w-4 text-primary mx-auto" />
            <span className="block text-lg font-extrabold mt-1">{workout?.streak_days ?? 0}</span>
            <span className="block text-[10px] text-muted-foreground font-semibold">day streak</span>
          </Card>
          <Card className="p-3 text-center">
            <Receipt className="h-4 w-4 text-primary mx-auto" />
            <span className={`block text-lg font-extrabold mt-1 whitespace-nowrap ${dues > 0 ? 'text-warning-text' : ''}`}>{dues > 0 ? formatCurrency(dues) : '₹0'}</span>
            <span className="block text-[10px] text-muted-foreground font-semibold">due</span>
          </Card>
        </div>

        <Card className="p-4 sm:p-5 text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Entry pass</span>
          <QrCode value={member.qr_token} label={member.full_name} />
          <span className="text-xs text-muted-foreground mt-2">Show this at reception to check in</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Dumbbell className="h-5 w-5 text-primary shrink-0" />
              <h2 className="font-bold text-base text-foreground truncate">Today&apos;s workout</h2>
            </div>
            {todayPlan && <span className="text-[11px] text-muted-foreground font-semibold truncate">{todayPlan.day}</span>}
          </div>

          {todayPlan ? (
            <div className="space-y-2 text-xs">
              {todayPlan.list.map((ex) => {
                const isDone = Boolean(completedExercises[ex.id])
                return (
                  <div key={ex.id} className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${isDone ? 'bg-success border-success-text/30' : 'bg-card border-border'}`}>
                    <button
                      type="button"
                      onClick={() => setDemoExerciseName(ex.name)}
                      className="h-10 w-10 shrink-0 rounded-lg bg-primary-soft text-primary font-extrabold text-[10px]"
                      aria-label={`Show demo for ${ex.name}`}
                    >
                      Demo
                    </button>
                    <button type="button" onClick={() => toggleExercise(ex.id)} className="flex-1 min-w-0 text-left min-h-[40px]">
                      <span className={`font-bold block truncate ${isDone ? 'line-through text-success-text' : 'text-foreground'}`}>{ex.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {ex.sets} × {ex.reps}
                        {ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}
                      </span>
                    </button>
                    <button type="button" onClick={() => toggleExercise(ex.id)} aria-label={isDone ? 'Mark not done' : 'Mark done'} className="h-10 w-10 shrink-0 inline-flex items-center justify-center">
                      <CheckCircle className={`h-5 w-5 ${isDone ? 'text-success-text' : 'text-muted-foreground'}`} />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No workout plan assigned yet. Ask your trainer.</p>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-success-text" />
              <h2 className="font-bold text-base text-foreground">Today&apos;s meals</h2>
            </div>
            {diet && <span className="text-xs text-primary font-bold whitespace-nowrap">{diet.calories_target} kcal</span>}
          </div>

          {diet && diet.meals.length > 0 ? (
            <div className="space-y-2 text-xs">
              {diet.meals.map((m) => {
                const isDone = Boolean(completedMeals[m.name])
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => toggleMeal(m.name)}
                    className={`w-full text-left p-3 rounded-xl border flex items-start justify-between gap-3 min-h-[52px] transition-all ${
                      isDone ? 'bg-success border-success-text/30 text-success-text' : 'bg-card border-border'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className={`font-bold block ${isDone ? 'line-through' : ''}`}>
                        {m.name} <span className="font-normal text-muted-foreground">· {m.time}</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground break-words">{m.items.join(', ')}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold whitespace-nowrap shrink-0">{m.calories} kcal</span>
                  </button>
                )
              })}
            </div>
          ) : diet ? (
            <p className="text-xs text-muted-foreground">
              Targets set: {diet.protein_g}g protein · {diet.carbs_g}g carbs · {diet.fat_g}g fat · {diet.water_liters}L water.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No diet plan assigned yet.</p>
          )}
        </Card>

        {trainer && (
          <Card className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                {trainer.photo_url ? <img src={trainer.photo_url} alt={trainer.name} className="h-full w-full object-cover" /> : trainer.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-foreground block truncate">{trainer.name}</span>
                <span className="text-xs text-muted-foreground block truncate">{trainer.specialization}</span>
              </div>
            </div>
            <a
              href={`tel:${trainer.phone.replace(/\s+/g, '')}`}
              onClick={() => showToast(`Calling ${trainer.name}`)}
              className="h-10 px-3 inline-flex items-center gap-1.5 rounded-lg border border-border text-xs font-bold hover:bg-accent shrink-0"
            >
              <Phone className="h-3.5 w-3.5 text-primary" /> Call
            </a>
          </Card>
        )}

        {myAttendance.length > 0 && (
          <Card className="p-4 sm:p-5">
            <h2 className="font-bold text-base text-foreground mb-3">Recent visits</h2>
            <div className="space-y-1.5 text-xs">
              {myAttendance.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
                  <span className="text-muted-foreground">{a.date}</span>
                  <span className="font-mono font-semibold">
                    {a.check_in.split('T')[1]?.slice(0, 5)}
                    {a.check_out ? ` – ${a.check_out.split('T')[1]?.slice(0, 5)}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          {gym.name} · {gym.opening_hours} ·{' '}
          <a href={`tel:${gym.phone.replace(/\s+/g, '')}`} className="text-primary font-semibold">
            {gym.phone}
          </a>
        </p>
      </main>

      <ExerciseDemoModal exerciseName={demoExerciseName} isOpen={!!demoExerciseName} onClose={() => setDemoExerciseName(null)} />
    </div>
  )
}
