'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Activity,
  Dumbbell,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Flame,
  Zap,
  Target,
  ChevronRight,
  Plus,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'

export default function TrainerDashboard() {
  const { members, workouts } = useApp()
  const [quickPlanModal, setQuickPlanModal] = useState(false)

  const assignedMembers = members.filter((m) => m.assigned_trainer_id === 'tr_01' || m.status === 'active')

  const ptSessionsToday = [
    {
      time: '06:30 AM',
      member: 'Rahul Sharma',
      goal: 'Chest & Triceps Hypertrophy',
      status: 'Completed',
      statusColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    },
    {
      time: '08:00 AM',
      member: 'Priya Patel',
      goal: 'Fat Loss HIIT & Core Blast',
      status: 'In Progress',
      statusColor: 'text-primary bg-primary/15 border-primary/30 animate-pulse',
    },
    {
      time: '05:30 PM',
      member: 'Vikram Singh',
      goal: 'Heavy Deadlift Strength 5x5',
      status: 'Upcoming',
      statusColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* AGGRESSIVE HERO BANNER FOR TRAINERS */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D0F17] via-[#141722] to-[#0D0F17] border border-[#FF1E3D]/40 p-6 sm:p-8 shadow-[0_10px_35px_rgba(255,30,61,0.2)]"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF1E3D]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1E3D]/20 border border-[#FF1E3D]/50 text-[#FF1E3D] text-xs font-black uppercase tracking-widest animate-pulse">
                <Flame className="h-3.5 w-3.5" />
                BEAST MODE ACTIVE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-400 text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Senior Master Trainer
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Personal Trainer <span className="bg-gradient-to-r from-white via-slate-200 to-[#FF1E3D] bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Manage client workout programs, track hypertrophy progress, and review live PT schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/app/workouts">
              <Button
                size="lg"
                className="brand-btn-gradient text-white font-black gap-2 shadow-[0_0_20px_rgba(255,30,61,0.4)] hover:scale-105 transition-all"
              >
                <Dumbbell className="h-5 w-5" />
                <span>Build Workout Plan</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Trainer Stats Row */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Total Trainees</span>
            <span className="text-white text-lg font-black font-mono">{assignedMembers.length} Athletes</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Workout Completion Rate</span>
            <span className="text-emerald-400 text-lg font-black font-mono">94.8% Adherence</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Today's Sessions</span>
            <span className="text-primary text-lg font-black font-mono">3 PT Slots</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Pending Reviews</span>
            <span className="text-amber-400 text-lg font-black font-mono">2 Logs Pending</span>
          </div>
        </div>
      </motion.div>

      {/* CORE STAT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-5 bg-[#0D0F17]/90 border-slate-800 border-l-4 border-l-[#FF1E3D] shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Assigned Squad</span>
              <Users className="h-5 w-5 text-[#FF1E3D]" />
            </div>
            <span className="text-3xl font-black text-white font-mono block mt-2">{assignedMembers.length} Members</span>
            <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">Active 1-on-1 PT Roster</span>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="p-5 bg-[#0D0F17]/90 border-slate-800 border-l-4 border-l-emerald-500 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Today's Scheduled PT</span>
              <Calendar className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white font-mono block mt-2">3 Sessions</span>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">1 Completed • 1 In Progress</span>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card className="p-5 bg-[#0D0F17]/90 border-slate-800 border-l-4 border-l-amber-500 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Pending Workout Reviews</span>
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-white font-mono block mt-2">2 Reviews Needed</span>
            <span className="text-[11px] font-semibold text-amber-400 mt-1 block">Log verification pending</span>
          </Card>
        </motion.div>
      </div>

      {/* TODAY'S PT TIMELINE & TRAINEES LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PT Timeline */}
        <Card className="lg:col-span-1 bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <CardHeader className="border-b border-slate-800/60 pb-3">
            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#FF1E3D]" />
              <span>Today's PT Schedule</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">Scheduled personal training slots</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {ptSessionsToday.map((session, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-800 bg-[#141722]/80 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-[#FF1E3D] bg-[#FF1E3D]/10 px-2.5 py-0.5 rounded-md border border-[#FF1E3D]/30">
                    {session.time}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${session.statusColor}`}>
                    {session.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-extrabold text-white block">{session.member}</span>
                  <span className="text-xs text-slate-400 font-medium block">{session.goal}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Trainees Grid */}
        <Card className="lg:col-span-2 bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/60">
            <div>
              <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                <span>My Assigned Trainees Roster</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Track member workout adherence and goal progress</CardDescription>
            </div>
            <Link href="/app/workouts">
              <Button size="sm" variant="ghost" className="text-xs font-extrabold text-[#FF1E3D]">
                <span>Manage Workouts</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="space-y-3">
              {assignedMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-[#141722]/80 hover:border-[#FF1E3D]/40 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={m.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
                      alt={m.full_name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-[#FF1E3D]/40 shadow-[0_0_12px_rgba(255,30,61,0.2)]"
                    />
                    <div>
                      <Link href={`/app/members/${m.id}`} className="font-extrabold text-sm text-white hover:text-[#FF1E3D] transition-colors block">
                        {m.full_name}
                      </Link>
                      <span className="text-xs text-slate-400 font-medium block mt-0.5">
                        Goals: <span className="text-slate-200">{m.fitness_goals?.join(', ') || 'Muscle Gain'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={m.status} />
                    <Link href={`/app/members/${m.id}`}>
                      <Button variant="outline" size="sm" className="text-xs font-bold border-slate-700 hover:border-[#FF1E3D] text-white">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
