'use client'

import React, { useState } from 'react'
import { Dumbbell, Check, Play, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExerciseDemoModal } from '@/components/ui/exercise-demo-modal'
import { useApp } from '@/lib/context'
import type { WorkoutPlan } from '@/lib/types'

const selectCls =
  'w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring'

const TEMPLATE: WorkoutPlan['exercises'] = [
  {
    day: 'Monday · Chest & Triceps',
    list: [
      { id: '1', name: 'Barbell Bench Press', muscle_group: 'Chest', sets: 4, reps: '8-10', weight_kg: 70, rest_sec: 90 },
      { id: '2', name: 'Incline Dumbbell Press', muscle_group: 'Upper Chest', sets: 3, reps: '10-12', weight_kg: 24, rest_sec: 60 },
      { id: '3', name: 'Tricep Rope Pushdown', muscle_group: 'Triceps', sets: 4, reps: '12-15', weight_kg: 30, rest_sec: 60 },
    ],
  },
  {
    day: 'Tuesday · Back & Biceps',
    list: [
      { id: '4', name: 'Lat Pulldown', muscle_group: 'Lats', sets: 4, reps: '10-12', weight_kg: 55, rest_sec: 90 },
      { id: '5', name: 'Seated Cable Row', muscle_group: 'Middle Back', sets: 3, reps: '10', weight_kg: 60, rest_sec: 60 },
      { id: '6', name: 'EZ Bar Bicep Curl', muscle_group: 'Biceps', sets: 4, reps: '12', weight_kg: 20, rest_sec: 60 },
    ],
  },
  {
    day: 'Wednesday · Legs & Core',
    list: [
      { id: '7', name: 'Barbell Back Squat', muscle_group: 'Quadriceps', sets: 4, reps: '8', weight_kg: 80, rest_sec: 120 },
      { id: '8', name: 'Leg Extension', muscle_group: 'Quads', sets: 3, reps: '15', weight_kg: 45, rest_sec: 60 },
      { id: '9', name: 'Hanging Leg Raise', muscle_group: 'Abs', sets: 3, reps: '15', rest_sec: 45 },
    ],
  },
  {
    day: 'Thursday · Shoulders',
    list: [
      { id: '10', name: 'Dumbbell Lateral Raise', muscle_group: 'Shoulders', sets: 4, reps: '12-15', weight_kg: 12, rest_sec: 60 },
      { id: '11', name: 'Incline Dumbbell Press', muscle_group: 'Shoulders', sets: 4, reps: '10', weight_kg: 22, rest_sec: 90 },
    ],
  },
  {
    day: 'Friday · Arms & Core',
    list: [
      { id: '12', name: 'EZ Bar Bicep Curl', muscle_group: 'Biceps', sets: 4, reps: '12', weight_kg: 22, rest_sec: 60 },
      { id: '13', name: 'Tricep Rope Pushdown', muscle_group: 'Triceps', sets: 4, reps: '15', weight_kg: 32, rest_sec: 60 },
      { id: '14', name: 'Hanging Leg Raise', muscle_group: 'Abs', sets: 4, reps: '20', weight_kg: 0, rest_sec: 45 },
    ],
  },
  {
    day: 'Saturday · Full body',
    list: [
      { id: '15', name: 'Barbell Deadlift', muscle_group: 'Back', sets: 4, reps: '6', weight_kg: 100, rest_sec: 120 },
      { id: '16', name: 'Barbell Bench Press', muscle_group: 'Chest', sets: 3, reps: '10', weight_kg: 65, rest_sec: 90 },
      { id: '17', name: 'Barbell Back Squat', muscle_group: 'Legs', sets: 3, reps: '10', weight_kg: 70, rest_sec: 90 },
    ],
  },
]

export default function WorkoutsPage() {
  const { workouts, members, trainers, gym, currentUser, saveWorkoutPlan, showToast } = useApp()
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? '')
  const defaultTrainer = trainers.find((t) => t.email === currentUser.email) ?? trainers[0]
  const [trainerId, setTrainerId] = useState(defaultTrainer?.id ?? '')
  const [planName, setPlanName] = useState('6-day strength split')
  const [goal, setGoal] = useState('Muscle gain')
  const [level, setLevel] = useState<WorkoutPlan['level']>('intermediate')
  const [demoExerciseName, setDemoExerciseName] = useState<string | null>(null)

  const canSave = Boolean(selectedMemberId && trainerId && planName.trim())

  const handleSave = () => {
    if (!canSave) return
    const member = members.find((m) => m.id === selectedMemberId)
    const trainer = trainers.find((t) => t.id === trainerId)
    saveWorkoutPlan({
      id: `wo_${Date.now()}`,
      gym_id: gym.id,
      member_id: selectedMemberId,
      member_name: member?.full_name || 'Member',
      trainer_id: trainerId,
      trainer_name: trainer?.name || 'Trainer',
      name: planName.trim(),
      goal: goal.trim(),
      level,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      streak_days: 0,
      exercises: TEMPLATE,
    })
    showToast(`Workout plan saved for ${member?.full_name ?? 'member'}.`)
  }

  return (
    <div className="space-y-5 sm:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Workout plans</h1>
          <p className="text-xs text-muted-foreground mt-1">Assign a routine and tap any exercise for a form demo</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={!canSave} className="brand-btn-gradient text-white font-extrabold gap-1.5 w-full sm:w-auto">
          <Check className="h-4 w-4" />
          <span>Save plan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 lg:col-span-1 space-y-4">
          <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span>Assign routine</span>
          </h2>

          <div>
            <label htmlFor="wo-member" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Member
            </label>
            <select id="wo-member" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className={selectCls}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="wo-trainer" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Trainer
            </label>
            <select id="wo-trainer" value={trainerId} onChange={(e) => setTrainerId(e.target.value)} className={selectCls}>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="wo-name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Routine name
            </label>
            <Input id="wo-name" value={planName} onChange={(e) => setPlanName(e.target.value)} className="font-bold" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <div>
              <label htmlFor="wo-goal" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                Goal
              </label>
              <Input id="wo-goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <div>
              <label htmlFor="wo-level" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                Level
              </label>
              <select id="wo-level" value={level} onChange={(e) => setLevel(e.target.value as WorkoutPlan['level'])} className={selectCls}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">Saves the standard 6-day split. Edit sets and weights from the member profile after saving.</p>
        </Card>

        <Card className="p-4 sm:p-6 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-base sm:text-lg font-black">Assigned routines ({workouts.length})</h2>
            <span className="text-xs text-muted-foreground">Tap an exercise for the demo</span>
          </div>

          {workouts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No routines assigned yet.</p>}

          <div className="space-y-4">
            {workouts.map((w) => (
              <div key={w.id} className="p-3.5 sm:p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-sm sm:text-base text-foreground break-words">{w.name}</h3>
                    <span className="text-xs text-muted-foreground block">
                      <span className="text-foreground font-bold">{w.member_name}</span> · {w.goal} · {w.trainer_name}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary-softText font-extrabold uppercase text-[10px] whitespace-nowrap">
                    {w.level}
                  </span>
                </div>

                <div className="space-y-2">
                  {w.exercises.map((day, idx) => (
                    <details key={day.day} open={idx === 0} className="group rounded-xl bg-card border border-border">
                      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-3.5 min-h-[48px] font-black text-xs text-primary uppercase tracking-wider">
                        <span className="truncate">{day.day}</span>
                        <span className="flex items-center gap-2 shrink-0 text-muted-foreground normal-case tracking-normal font-semibold">
                          {day.list.length} exercises
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </span>
                      </summary>
                      <div className="px-2.5 pb-2.5 space-y-1.5">
                        {day.list.map((ex) => (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => setDemoExerciseName(ex.name)}
                            className="w-full text-left flex items-center justify-between gap-3 p-2.5 min-h-[52px] rounded-xl bg-muted/30 border border-border/80 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="h-9 w-9 shrink-0 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                                <Play className="h-3.5 w-3.5 fill-current" />
                              </span>
                              <div className="min-w-0">
                                <span className="font-black text-xs text-foreground block truncate">{ex.name}</span>
                                <span className="text-[10px] text-muted-foreground block font-mono truncate">{ex.muscle_group}</span>
                              </div>
                            </div>
                            <span className="font-mono font-black text-[11px] sm:text-xs text-success-text whitespace-nowrap shrink-0">
                              {ex.sets} × {ex.reps}
                              {ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}
                            </span>
                          </button>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ExerciseDemoModal exerciseName={demoExerciseName} isOpen={!!demoExerciseName} onClose={() => setDemoExerciseName(null)} />
    </div>
  )
}
