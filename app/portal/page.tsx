'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  QrCode,
  Dumbbell,
  Apple,
  Calendar,
  CreditCard,
  User,
  Bell,
  CheckCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { ExerciseDemoModal } from '@/components/ui/exercise-demo-modal'
import { useApp } from '@/lib/context'
import { getDaysRemaining } from '@/lib/dates'
import { formatCurrency } from '@/lib/money'

export default function MemberPortalPage() {
  const { gym, members, memberships, workouts, diets, attendance, showToast } = useApp()

  const member = members[0] // Amit Verma demo member
  const currentMs = memberships.find((ms) => ms.member_id === member.id)
  const workout = workouts.find((w) => w.member_id === member.id)
  const diet = diets.find((d) => d.member_id === member.id)
  const myAttendance = attendance.filter((a) => a.member_id === member.id)

  const daysLeft = currentMs ? getDaysRemaining(currentMs.end_date) : 0

  const [demoExerciseName, setDemoExerciseName] = useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({
    ex_1: true,
    ex_2: false,
  })

  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({
    Breakfast: true,
    Lunch: false,
  })

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }))
    showToast('Updated workout exercise log.')
  }

  const toggleMeal = (name: string) => {
    setCompletedMeals((prev) => ({ ...prev, [name]: !prev[name] }))
    showToast('Updated meal logging.')
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans">
      {/* Top Portal Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 shadow-soft-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app/dashboard" className="p-1 rounded-lg text-muted-foreground hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-7 w-7 object-contain" />
            <span className="font-extrabold text-sm text-foreground">Member Portal</span>
          </div>
        </div>
        <StatusBadge status={member.status} />
      </header>

      <main className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Welcome Card */}
        <Card className="p-5 bg-gradient-to-br from-primary-soft to-card border-primary/30">
          <div className="flex items-center gap-4">
            <img
              src={member.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
              alt={member.full_name}
              className="h-16 w-16 rounded-full object-cover border-2 border-primary shadow-soft-sm"
            />
            <div>
              <h1 className="text-xl font-extrabold text-foreground">Welcome, {member.full_name}!</h1>
              <p className="text-xs text-muted-foreground font-mono">{member.member_code}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <span>{currentMs?.plan_name}</span>
                <span>• {daysLeft} Days Left</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Member QR ID Card Pass */}
        <Card className="p-5 text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
            Your Digital Gym Entry Pass
          </span>
          <div className="p-4 bg-white rounded-2xl border-2 border-primary/40 shadow-soft-md my-2">
            <div className="h-44 w-44 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono text-xs p-2">
              [SCAN AT RECEPTION]<br />{member.qr_token}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Show this QR scanner at gym entry</span>
        </Card>

        {/* Today's Workout Checklist */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-base text-foreground">Today's Workout Routine</h2>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">Streak: {workout?.streak_days || 1} Days 🔥</span>
          </div>

          {workout ? (
            <div className="space-y-2 text-xs">
              <span className="font-bold text-muted-foreground block">{workout.exercises[0]?.day}</span>
              {workout.exercises[0]?.list.map((ex) => {
                const isDone = completedExercises[ex.id]
                return (
                  <div
                    key={ex.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-80'
                        : 'bg-card border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDemoExerciseName(ex.name)
                        }}
                        className="h-7 px-2 bg-primary/15 text-primary hover:bg-primary hover:text-white rounded-md text-[10px] font-extrabold gap-1 shrink-0"
                      >
                        🎬 GIF Guide
                      </Button>
                      <div onClick={() => toggleExercise(ex.id)} className="cursor-pointer">
                        <span className={`font-bold block ${isDone ? 'line-through' : ''}`}>{ex.name}</span>
                        <span className="text-[11px] text-muted-foreground">{ex.sets} sets × {ex.reps} reps ({ex.weight_kg}kg)</span>
                      </div>
                    </div>
                    <CheckCircle
                      onClick={() => toggleExercise(ex.id)}
                      className={`h-5 w-5 cursor-pointer ${isDone ? 'text-emerald-500' : 'text-slate-500'}`}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No workout assigned today.</p>
          )}
        </Card>

        {/* EXERCISE MOTION REFERENCE MODAL */}
        <ExerciseDemoModal
          exerciseName={demoExerciseName}
          isOpen={!!demoExerciseName}
          onClose={() => setDemoExerciseName(null)}
        />

        {/* Today's Diet Checklist */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-emerald-600" />
              <h2 className="font-bold text-base text-foreground">Daily Nutrition Checklist</h2>
            </div>
            <span className="text-xs text-primary font-bold">{diet?.calories_target || 2400} kcal</span>
          </div>

          {diet ? (
            <div className="space-y-2 text-xs">
              {diet.meals.map((m) => {
                const isDone = completedMeals[m.name]
                return (
                  <div
                    key={m.name}
                    onClick={() => toggleMeal(m.name)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through'
                        : 'bg-card border-border hover:border-primary'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{m.name} ({m.time})</span>
                      <span className="text-[11px] text-muted-foreground">{m.items.join(', ')}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold">{m.calories} kcal</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No diet plan assigned.</p>
          )}
        </Card>

        {/* My Trainer Card */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
              RK
            </div>
            <div>
              <span className="font-bold text-sm text-foreground block">Trainer: Rajesh Kumar</span>
              <span className="text-xs text-muted-foreground">Hypertrophy Specialist</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs">
            Message
          </Button>
        </Card>
      </main>
    </div>
  )
}
