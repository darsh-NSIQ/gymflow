'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import { getDaysRemaining } from '@/lib/dates'

export default function PersonalTrainingPage() {
  const { trainers, members, memberships, plans } = useApp()

  const ptMembers = useMemo(() => {
    const ptPlanIds = new Set(plans.filter((p) => p.pt_included).map((p) => p.id))
    return memberships
      .filter((ms) => ptPlanIds.has(ms.plan_id))
      .map((ms) => {
        const member = members.find((m) => m.id === ms.member_id)
        const plan = plans.find((p) => p.id === ms.plan_id)
        const trainer = trainers.find((t) => t.id === member?.assigned_trainer_id)
        return { ms, member, plan, trainer, daysLeft: getDaysRemaining(ms.end_date) }
      })
      .filter((x) => x.member)
  }, [memberships, members, plans, trainers])

  const activeTrainers = trainers.filter((t) => t.status === 'active')

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Personal training</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {ptMembers.length} member{ptMembers.length === 1 ? '' : 's'} on PT plans · {activeTrainers.length} trainers available
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold">Members on PT plans</h2>
          {ptMembers.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">No member is on a plan that includes personal training.</p>
          )}
          <div className="space-y-3">
            {ptMembers.map(({ ms, member, plan, trainer, daysLeft }) => (
              <Link
                key={ms.id}
                href={`/app/members/${member!.id}`}
                className="block p-3.5 sm:p-4 rounded-xl border border-border bg-muted/20 text-xs space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-foreground truncate">{member!.full_name}</span>
                  <StatusBadge status={ms.status} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-muted-foreground">
                  <span className="truncate">
                    Trainer: <strong className="text-foreground">{trainer?.name ?? 'Not assigned'}</strong>
                  </span>
                  <span>
                    Ends in <strong className="text-foreground">{daysLeft} days</strong>
                  </span>
                </div>
                <div className="text-[11px] text-primary font-semibold border-t border-border pt-2 flex flex-wrap justify-between gap-1">
                  <span className="truncate">{plan?.name}</span>
                  <span className="whitespace-nowrap">{plan?.pt_sessions_count ?? 0} sessions included</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold">Trainers</h2>
          <div className="space-y-3">
            {activeTrainers.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/30 bg-muted shrink-0">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserCheck className="h-5 w-5 m-auto mt-2.5 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-foreground block truncate">{t.name}</span>
                    <span className="text-muted-foreground block truncate">{t.specialization}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-success-text block whitespace-nowrap">{t.commission_pct}% PT commission</span>
                  <span className="text-muted-foreground whitespace-nowrap">{t.assigned_members_count} members</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
