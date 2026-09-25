'use client'

import React, { useState } from 'react'
import { Dumbbell, Plus, Trash, Check, Play, Video, Sparkles, Flame, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExerciseDemoModal } from '@/components/ui/exercise-demo-modal'
import { useApp } from '@/lib/context'

export default function WorkoutsPage() {
  const { workouts, members, saveWorkoutPlan, showToast } = useApp()
  const [selectedMemberId, setSelectedMemberId] = useState('mem_01')

  const [planName, setPlanName] = useState('Hypertrophy & Strength 5-Day Split')
  const [goal, setGoal] = useState('Muscle Gain & Fat Loss')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')

  // Motion Reference Modal State
  const [demoExerciseName, setDemoExerciseName] = useState<string | null>(null)

  const handleSave = () => {
    const member = members.find((m) => m.id === selectedMemberId)
    saveWorkoutPlan({
      id: `wo_${Date.now()}`,
      gym_id: 'gym_01',
      member_id: selectedMemberId,
      member_name: member?.full_name || 'Member',
      trainer_id: 'tr_01',
      trainer_name: 'Rajesh Kumar',
      name: planName,
      goal,
      level,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      streak_days: 1,
      exercises: [
        {
          day: 'Monday (Chest & Triceps)',
          list: [
            { id: '1', name: 'Barbell Bench Press', muscle_group: 'Chest', sets: 4, reps: '8-10', weight_kg: 70, rest_sec: 90 },
            { id: '2', name: 'Incline Dumbbell Press', muscle_group: 'Upper Chest', sets: 3, reps: '10-12', weight_kg: 24, rest_sec: 60 },
            { id: '3', name: 'Tricep Rope Pushdown', muscle_group: 'Triceps', sets: 4, reps: '12-15', weight_kg: 30, rest_sec: 60 },
          ],
        },
        {
          day: 'Tuesday (Back & Biceps)',
          list: [
            { id: '4', name: 'Lat Pulldown', muscle_group: 'Lats', sets: 4, reps: '10-12', weight_kg: 55, rest_sec: 90 },
            { id: '5', name: 'Seated Cable Row', muscle_group: 'Middle Back', sets: 3, reps: '10', weight_kg: 60, rest_sec: 60 },
            { id: '6', name: 'EZ Bar Bicep Curl', muscle_group: 'Biceps', sets: 4, reps: '12', weight_kg: 20, rest_sec: 60 },
          ],
        },
        {
          day: 'Wednesday (Legs & Glutes)',
          list: [
            { id: '7', name: 'Barbell Back Squat', muscle_group: 'Quadriceps', sets: 4, reps: '8', weight_kg: 80, rest_sec: 120 },
            { id: '8', name: 'Leg Extension', muscle_group: 'Quads', sets: 3, reps: '15', weight_kg: 45, rest_sec: 60 },
            { id: '9', name: 'Hanging Leg Raise', muscle_group: 'Abs', sets: 3, reps: '15', rest_sec: 45 },
          ],
        },
        {
          day: 'Thursday (Shoulders & Traps)',
          list: [
            { id: '10', name: 'Dumbbell Lateral Raise', muscle_group: 'Shoulders', sets: 4, reps: '12-15', weight_kg: 12, rest_sec: 60 },
            { id: '11', name: 'Incline Dumbbell Press', muscle_group: 'Shoulders', sets: 4, reps: '10', weight_kg: 22, rest_sec: 90 },
          ],
        },
        {
          day: 'Friday (Arms & Core Power)',
          list: [
            { id: '12', name: 'EZ Bar Bicep Curl', muscle_group: 'Biceps', sets: 4, reps: '12', weight_kg: 22, rest_sec: 60 },
            { id: '13', name: 'Tricep Rope Pushdown', muscle_group: 'Triceps', sets: 4, reps: '15', weight_kg: 32, rest_sec: 60 },
            { id: '14', name: 'Hanging Leg Raise', muscle_group: 'Abs', sets: 4, reps: '20', weight_kg: 0, rest_sec: 45 },
          ],
        },
        {
          day: 'Saturday (Full Body Beast & Cardio)',
          list: [
            { id: '15', name: 'Barbell Deadlift', muscle_group: 'Back', sets: 4, reps: '6', weight_kg: 100, rest_sec: 120 },
            { id: '16', name: 'Barbell Bench Press', muscle_group: 'Chest', sets: 3, reps: '10', weight_kg: 65, rest_sec: 90 },
            { id: '17', name: 'Barbell Back Squat', muscle_group: 'Legs', sets: 3, reps: '10', weight_kg: 70, rest_sec: 90 },
          ],
        },
      ],
    })
    showToast('Saved custom 6-day workout plan to member profile.')
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Workout Plan Command & Motion Library</span>
            <span className="text-xs font-bold bg-[#FF1E3D]/20 text-[#FF1E3D] px-3 py-1 rounded-full border border-[#FF1E3D]/40">
              GIF Motion Demos
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build custom exercise routines with live animated GIF form tutorials for every workout
          </p>
        </div>
        <Button size="sm" onClick={handleSave} className="brand-btn-gradient text-white font-extrabold gap-1.5 shadow-[0_0_15px_rgba(255,30,61,0.4)]">
          <Check className="h-4 w-4" />
          <span>Save Workout Routine</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assign & Builder Form */}
        <Card className="p-6 lg:col-span-1 space-y-4 bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-[#FF1E3D]" />
            <span>Assign Routine to Athlete</span>
          </h2>

          <div>
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider mb-1 block">Select Trainee Member</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold text-xs"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider mb-1 block">Routine Name</label>
            <Input value={planName} onChange={(e) => setPlanName(e.target.value)} className="bg-slate-900 border-slate-700 text-white font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider mb-1 block">Primary Fitness Goal</label>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-slate-900 border-slate-700 text-white" />
          </div>
        </Card>

        {/* Workout Routines Display */}
        <Card className="p-6 lg:col-span-2 space-y-4 bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#FF1E3D]" />
              <span>Assigned Member Workout Routines (Monday - Saturday)</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Click any exercise to watch GIF motion demo</span>
          </div>

          <div className="space-y-4">
            {workouts.map((w) => (
              <div key={w.id} className="p-5 rounded-2xl border border-slate-800 bg-[#141722]/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-base text-white">{w.name}</h3>
                    <span className="text-xs text-slate-400 font-medium">Assigned to <span className="text-white font-bold">{w.member_name}</span> • Goal: {w.goal}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FF1E3D]/20 text-[#FF1E3D] border border-[#FF1E3D]/40 font-extrabold uppercase text-[10px] whitespace-nowrap shrink-0">
                    {w.level} Level
                  </span>
                </div>

                <div className="space-y-3">
                  {w.exercises.map((day) => (
                    <div key={day.day} className="p-4 rounded-xl bg-[#0D0F17] border border-slate-800 space-y-2.5">
                      <span className="font-black text-xs text-[#FF1E3D] uppercase tracking-wider block">
                        {day.day}
                      </span>
                      <div className="space-y-2">
                        {day.list.map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141722] border border-slate-800/80 hover:border-[#FF1E3D]/40 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDemoExerciseName(ex.name)}
                                className="h-8 px-2.5 bg-[#FF1E3D]/15 text-[#FF1E3D] hover:bg-[#FF1E3D] hover:text-white border border-[#FF1E3D]/30 rounded-lg text-xs font-extrabold gap-1.5 transition-colors shrink-0"
                              >
                                <Play className="h-3.5 w-3.5 fill-current" />
                                <span>Watch GIF / Video</span>
                              </Button>
                              <div>
                                <span className="font-black text-xs text-white block">{ex.name}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">Target: {ex.muscle_group}</span>
                              </div>
                            </div>
                            <span className="font-mono font-black text-xs text-emerald-400">
                              {ex.sets} Sets × {ex.reps} ({ex.weight_kg || 0}kg)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* EXERCISE MOTION REFERENCE MODAL */}
      <ExerciseDemoModal
        exerciseName={demoExerciseName}
        isOpen={!!demoExerciseName}
        onClose={() => setDemoExerciseName(null)}
      />
    </div>
  )
}
