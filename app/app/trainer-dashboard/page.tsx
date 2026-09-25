'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, Users, Calendar, Apple, ChevronRight, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'

export default function TrainerDashboard() {
  const { currentUser, trainers, members, workouts, diets, attendance } = useApp()

  const me = useMemo(
    () => trainers.find((t) => t.email === currentUser.email) ?? trainers.find((t) => t.name === currentUser.full_name) ?? trainers[0],
    [trainers, currentUser]
  )

  const myMembers = useMemo(() => {
    const assigned = members.filter((m) => m.assigned_trainer_id === me?.id && m.status !== 'archived')
    return assigned.length > 0 ? assigned : []
  }, [members, me])

  const myWorkouts = workouts.filter((w) => w.trainer_id === me?.id)
  const membersWithoutPlan = myMembers.filter((m) => !workouts.some((w) => w.member_id === m.id))
  const membersWithoutDiet = myMembers.filter((m) => !diets.some((d) => d.member_id === m.id))
  const today = new Date().toISOString().split('T')[0]
  const myCheckinsToday = attendance.filter((a) => a.date === today && myMembers.some((m) => m.id === a.member_id)).length

  const lastVisit = (memberId: string) => {
    const dates = attendance.filter((a) => a.member_id === memberId).map((a) => a.date)
    return dates.length ? dates.sort().reverse()[0] : null
  }

  return (
    <div className="space-y-5 sm:space-y-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card/90 border border-primary/30 p-4 sm:p-6 lg:p-8"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">{me?.specialization ?? 'Trainer'}</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              {me?.name ?? currentUser.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {myMembers.length} assigned member{myMembers.length === 1 ? '' : 's'} · {myCheckinsToday} checked in today
            </p>
          </div>
          <Link href="/app/workouts" className="w-full lg:w-auto">
            <Button className="brand-btn-gradient text-white font-bold gap-2 w-full lg:w-auto">
              <Dumbbell className="h-5 w-5" />
              <span>Build workout plan</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-5 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Members</span>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono block mt-2">{myMembers.length}</span>
        </Card>
        <Card className="p-3.5 sm:p-5 border-l-4 border-l-warning-icon">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-muted-foreground font-extrabold uppercase tracking-wider">No workout</span>
            <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-warning-text" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono block mt-2">{membersWithoutPlan.length}</span>
        </Card>
        <Card className="p-3.5 sm:p-5 border-l-4 border-l-info-icon">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-muted-foreground font-extrabold uppercase tracking-wider">No diet</span>
            <Apple className="h-4 w-4 sm:h-5 sm:w-5 text-info-text" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono block mt-2">{membersWithoutDiet.length}</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="border-b border-border/60 p-4 sm:p-6 pb-3 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-black flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>My workout plans</span>
            </CardTitle>
            <CardDescription className="text-xs">{myWorkouts.length} active</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4 space-y-3">
            {myWorkouts.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No plans created yet.</p>}
            {myWorkouts.map((w) => (
              <Link key={w.id} href={`/app/members/${w.member_id}`} className="block p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-foreground truncate">{w.member_name}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary-soft text-primary-softText shrink-0">{w.level}</span>
                </div>
                <span className="text-xs text-muted-foreground block truncate">{w.name}</span>
                <span className="text-[11px] text-muted-foreground block">
                  {w.exercises.length} days · till {w.end_date}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 p-4 sm:p-6 pb-3 sm:pb-3">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-black flex items-center gap-2">
                <Target className="h-5 w-5 text-success-text shrink-0" />
                <span>Assigned members</span>
              </CardTitle>
              <CardDescription className="text-xs">Goals, last visit and plan status</CardDescription>
            </div>
            <Link href="/app/workouts" className="shrink-0">
              <Button size="sm" variant="ghost" className="text-xs font-extrabold text-primary hover:text-primary hover:bg-primary-soft">
                <span>Workouts</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4">
            {myMembers.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No members assigned to you yet.</p>}
            <div className="space-y-2.5">
              {myMembers.map((m) => {
                const hasPlan = workouts.some((w) => w.member_id === m.id)
                const visit = lastVisit(m.id)
                return (
                  <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={m.photo_url || '/logo.png'} alt={m.full_name} className="h-11 w-11 rounded-full object-cover border-2 border-primary/30 shrink-0" />
                      <div className="min-w-0">
                        <Link href={`/app/members/${m.id}`} className="font-extrabold text-sm text-foreground hover:text-primary block truncate">
                          {m.full_name}
                        </Link>
                        <span className="text-xs text-muted-foreground block truncate">
                          {m.fitness_goals?.length ? m.fitness_goals.join(', ') : 'No goal set'} · {visit ? `last visit ${visit}` : 'no visits yet'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <StatusBadge status={m.status} />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${hasPlan ? 'bg-success text-success-text' : 'bg-warning text-warning-text'}`}>
                        {hasPlan ? 'Plan set' : 'Needs plan'}
                      </span>
                      <Link href={`/app/members/${m.id}`} className="ml-auto sm:ml-0">
                        <Button variant="outline" size="sm" className="text-xs font-bold">
                          Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
