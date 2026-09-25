'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Plus,
  UserPlus,
  QrCode,
  ArrowUpRight,
  ShieldAlert,
  CreditCard,
  Clock,
  UserCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/ui/status-badge'
import { AddMemberAdvancedModal } from '@/components/ui/add-member-advanced-modal'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'
import { getDaysRemaining } from '@/lib/dates'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const PIE_COLORS = ['#FF1E3D', '#FF6B00', '#00E5FF', '#10B981', '#A78BFA', '#F59E0B']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const selectCls =
  'w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring'

type TooltipPayload = { name?: string; value?: number | string; color?: string; payload?: { color?: string } }

const MoneyTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card/95 backdrop-blur-xl border border-primary/40 p-3 rounded-xl shadow-soft-lg text-xs space-y-1.5">
      <p className="font-extrabold text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-mono font-bold text-foreground">{formatCurrency(Number(entry.value))}</span>
        </div>
      ))}
    </div>
  )
}

const CountTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card/95 backdrop-blur-xl border border-primary/40 px-3 py-2 rounded-xl shadow-soft-lg text-xs">
      <p className="font-extrabold text-foreground">{label}</p>
      <p className="font-mono font-bold text-primary mt-0.5">{payload[0].value} check-ins</p>
    </div>
  )
}

export default function OwnerDashboard() {
  const {
    currentUser,
    members,
    memberships,
    attendance,
    payments,
    expenses,
    trainers,
    recordPayment,
    recordAttendance,
    addExpense,
  } = useApp()

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [newPayAmount, setNewPayAmount] = useState('')
  const [newPayMember, setNewPayMember] = useState(members[0]?.id ?? '')
  const [attendanceInput, setAttendanceInput] = useState('')
  const [newExpCategory, setNewExpCategory] = useState('')
  const [newExpAmount, setNewExpAmount] = useState('')

  const todayDateStr = new Date().toISOString().split('T')[0]

  const activeMembersCount = members.filter((m) => m.status === 'active').length
  const expiredMembersCount = members.filter((m) => m.status === 'expired').length
  const frozenMembersCount = members.filter((m) => m.status === 'frozen').length
  const totalMembersCount = members.filter((m) => m.status !== 'archived').length

  const todayAttendance = attendance.filter((a) => a.date === todayDateStr)
  const currentlyInsideCount = todayAttendance.filter((a) => !a.check_out).length

  const revenuePaise = payments.reduce((sum, p) => sum + p.paid_paise, 0)
  const expensesPaise = expenses.reduce((sum, e) => sum + e.amount_paise, 0)
  const netPaise = revenuePaise - expensesPaise
  const duesPaise = payments.reduce((sum, p) => sum + p.due_paise, 0)
  const activeTrainers = trainers.filter((t) => t.status === 'active').length

  // Last 6 months: collections vs expenses, from real records
  const monthlyTrend = useMemo(() => {
    const now = new Date()
    const buckets: { key: string; month: string; revenue: number; expenses: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, month: MONTH_LABELS[d.getMonth()], revenue: 0, expenses: 0 })
    }
    const byKey = new Map(buckets.map((b) => [b.key, b]))
    payments.forEach((p) => {
      const b = byKey.get(p.payment_date.slice(0, 7))
      if (b) b.revenue += p.paid_paise / 100
    })
    expenses.forEach((e) => {
      const b = byKey.get(e.date.slice(0, 7))
      if (b) b.expenses += e.amount_paise / 100
    })
    return buckets
  }, [payments, expenses])

  // Check-ins by hour (today, falling back to all records when today is empty)
  const hourly = useMemo(() => {
    const source = todayAttendance.length > 0 ? todayAttendance : attendance
    const counts = new Map<number, number>()
    source.forEach((a) => {
      const h = Number(a.check_in.split('T')[1]?.slice(0, 2))
      if (!Number.isNaN(h)) counts.set(h, (counts.get(h) || 0) + 1)
    })
    const rows = Array.from(counts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([h, count]) => ({ hour: `${String(h).padStart(2, '0')}:00`, count }))
    const peak = rows.reduce<{ hour: string; count: number } | null>((best, r) => (!best || r.count > best.count ? r : best), null)
    return { rows, peak, isToday: todayAttendance.length > 0 }
  }, [attendance, todayAttendance])

  // Plan split from real memberships
  const planSplit = useMemo(() => {
    const counts = new Map<string, number>()
    memberships.forEach((ms) => counts.set(ms.plan_name, (counts.get(ms.plan_name) || 0) + 1))
    const total = memberships.length || 1
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, value: Math.round((count / total) * 100), color: PIE_COLORS[i % PIE_COLORS.length] }))
  }, [memberships])

  // Follow-ups: expiring within 7 days, expired, or carrying dues
  const followUps = useMemo(() => {
    const dueByMember = new Map<string, number>()
    payments.forEach((p) => dueByMember.set(p.member_id, (dueByMember.get(p.member_id) || 0) + p.due_paise))
    return members
      .filter((m) => m.status !== 'archived')
      .map((m) => {
        const ms = memberships.find((x) => x.member_id === m.id)
        const days = ms ? getDaysRemaining(ms.end_date) : null
        const due = dueByMember.get(m.id) || 0
        let reason = ''
        if (m.status === 'expired' || (ms && ms.status === 'expired')) reason = 'Membership expired'
        else if (days !== null && days <= 7) reason = days === 0 ? 'Expires today' : `Expires in ${days} day${days === 1 ? '' : 's'}`
        else if (due > 0) reason = `${formatCurrency(due)} due`
        return { m, reason, due }
      })
      .filter((x) => x.reason)
      .slice(0, 6)
  }, [members, memberships, payments])

  const expiringSoon = memberships.filter((ms) => ms.status === 'active' && getDaysRemaining(ms.end_date) <= 7).length

  const kpiCards = [
    { title: 'Active members', val: activeMembersCount, sub: `${expiredMembersCount} expired · ${frozenMembersCount} frozen`, icon: Users, accent: 'border-l-primary' },
    { title: "Today's check-ins", val: todayAttendance.length, sub: `${currentlyInsideCount} inside right now`, icon: CalendarCheck, accent: 'border-l-info-icon' },
    { title: 'Collected', val: formatCurrency(revenuePaise), sub: `${formatCurrency(duesPaise)} still due`, icon: DollarSign, accent: 'border-l-success-icon' },
    { title: 'Net after expenses', val: formatCurrency(netPaise), sub: `Expenses ${formatCurrency(expensesPaise)}`, icon: TrendingUp, accent: 'border-l-warning-icon', highlight: netPaise >= 0 },
  ]

  const closeModal = () => setActiveModal(null)

  return (
    <div className="space-y-5 sm:space-y-8 pb-6">
      {/* Welcome + quick actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card/90 border border-primary/30 p-4 sm:p-6 lg:p-8"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
              Welcome back, {currentUser.full_name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {todayAttendance.length} check-ins so far today · {expiringSoon} membership{expiringSoon === 1 ? '' : 's'} expiring this week
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap xl:grid xl:grid-cols-2 2xl:flex items-center gap-2 shrink-0">
            <Button onClick={() => setActiveModal('add_member')} className="brand-btn-gradient text-white font-bold gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              <span>Add member</span>
            </Button>
            <Button variant="soft" onClick={() => setActiveModal('record_payment')} className="font-bold gap-2 w-full sm:w-auto">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Record fee</span>
            </Button>
            <Button variant="outline" onClick={() => setActiveModal('mark_attendance')} className="font-bold gap-2 w-full sm:w-auto">
              <QrCode className="h-4 w-4 text-info-icon" />
              <span>Check-in</span>
            </Button>
            <Button variant="ghost" onClick={() => setActiveModal('add_expense')} className="font-bold gap-2 w-full sm:w-auto border border-border sm:border-transparent">
              <Plus className="h-4 w-4" />
              <span>Expense</span>
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-5 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-soft border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Needs follow-up</span>
              <span className="text-foreground text-sm font-extrabold">{followUps.length} member{followUps.length === 1 ? '' : 's'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-info border border-info-text/20 flex items-center justify-center text-info-text shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Peak hour {hourly.isToday ? 'today' : '(all time)'}</span>
              <span className="text-foreground text-sm font-extrabold">{hourly.peak ? `${hourly.peak.hour} · ${hourly.peak.count} check-ins` : 'No data yet'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success border border-success-text/20 flex items-center justify-center text-success-text shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Trainers</span>
              <span className="text-foreground text-sm font-extrabold">{activeTrainers} active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div key={kpi.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.07 }}>
              <Card className={`h-full border-l-4 ${kpi.accent}`}>
                <CardContent className="p-3.5 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-wider leading-tight">{kpi.title}</span>
                    <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <span className={`block mt-2 sm:mt-3 text-xl sm:text-3xl font-black tracking-tight font-mono truncate ${kpi.highlight ? 'text-success-text' : 'text-foreground'}`}>
                    {kpi.val}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground block mt-1 truncate">{kpi.sub}</span>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Trend + plan split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 min-w-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:p-6 pb-2 sm:pb-2 border-b border-border/60">
            <div>
              <CardTitle className="text-base sm:text-lg font-black">Collections vs expenses</CardTitle>
              <CardDescription className="text-xs">Last 6 months, from recorded payments and expenses</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-primary"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Collected</span>
              <span className="flex items-center gap-1.5 text-info-text"><span className="h-2.5 w-2.5 rounded-full bg-info-icon" /> Expenses</span>
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-4 sm:pt-6">
            <div className="h-56 sm:h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF1E3D" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#FF1E3D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} width={48} tickFormatter={(v) => (v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`)} />
                  <Tooltip content={<MoneyTooltip />} cursor={{ stroke: 'rgba(255,30,61,0.4)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" name="Collected" stroke="#FF1E3D" strokeWidth={3} fill="url(#revenueGrad)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#00E5FF" strokeWidth={2} fill="url(#expenseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-w-0">
          <CardHeader className="border-b border-border/60 p-4 sm:p-6 pb-3 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-black">Plan split</CardTitle>
            <CardDescription className="text-xs">{memberships.length} memberships on record</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4 flex flex-col items-center">
            <div className="h-48 sm:h-56 w-full relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-3xl font-black text-foreground font-mono leading-none">{totalMembersCount}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">members</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planSplit} cx="50%" cy="50%" innerRadius="62%" outerRadius="86%" paddingAngle={4} dataKey="count" stroke="none">
                    {planSplit.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-card/95 border border-primary/40 px-3 py-2 rounded-xl text-xs shadow-soft-lg">
                          <span className="font-bold text-foreground">{payload[0].name}: </span>
                          <span className="font-mono font-bold text-primary">{payload[0].value}</span>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 w-full pt-4 border-t border-border/80">
              {planSplit.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-semibold truncate">{item.name}</span>
                  <span className="font-mono font-black text-foreground ml-auto shrink-0">{item.value}%</span>
                </div>
              ))}
              {planSplit.length === 0 && <p className="text-xs text-muted-foreground">No memberships yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly + follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="min-w-0">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base sm:text-lg font-black">Check-ins by hour</CardTitle>
                <CardDescription className="text-xs">{hourly.isToday ? 'Today' : 'All recorded days'}</CardDescription>
              </div>
              {hourly.peak && (
                <span className="text-xs font-black text-primary bg-primary-soft border border-primary/30 px-3 py-1 rounded-full self-start sm:self-auto whitespace-nowrap">
                  Peak {hourly.peak.hour} · {hourly.peak.count}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-4">
            <div className="h-52 sm:h-64 w-full min-w-0">
              {hourly.rows.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No check-ins recorded yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourly.rows} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF1E3D" stopOpacity={1} />
                        <stop offset="100%" stopColor="#FF6B00" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" vertical={false} />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CountTooltip />} cursor={{ fill: 'rgba(255,30,61,0.12)' }} />
                    <Bar dataKey="count" name="Check-ins" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 sm:p-6 pb-3 sm:pb-3 border-b border-border/60">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-black flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
                <span>Follow-ups</span>
              </CardTitle>
              <CardDescription className="text-xs">Expiring, expired or with dues</CardDescription>
            </div>
            <Link href="/app/members" className="shrink-0">
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold text-primary hover:text-primary hover:bg-primary-soft">
                <span>All members</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4">
            <div className="space-y-2.5">
              {followUps.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Nothing pending. All memberships are in good standing.</p>}
              {followUps.map(({ m, reason }) => (
                <Link
                  key={m.id}
                  href={`/app/members/${m.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={m.photo_url || '/logo.png'} alt={m.full_name} className="h-10 w-10 rounded-full object-cover border border-primary/30 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs text-foreground block truncate">{m.full_name}</span>
                      <span className="text-[11px] text-muted-foreground block truncate">{reason}</span>
                    </div>
                  </div>
                  <StatusBadge status={m.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick-action dialogs */}
      <AddMemberAdvancedModal isOpen={activeModal === 'add_member'} onClose={closeModal} />

      <Dialog
        isOpen={activeModal === 'record_payment'}
        onClose={closeModal}
        title="Record fee payment"
        description="An invoice is issued as soon as you save."
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={closeModal}>Cancel</Button>
            <Button
              className="w-full sm:w-auto"
              disabled={!newPayMember || Number(newPayAmount) <= 0}
              onClick={() => {
                const selectedM = members.find((m) => m.id === newPayMember)
                const paise = rupeesToPaise(Number(newPayAmount))
                recordPayment({ member_id: newPayMember, member_name: selectedM?.full_name || 'Member', paid_paise: paise, final_paise: paise })
                setNewPayAmount('')
                closeModal()
              }}
            >
              Save &amp; issue invoice
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="dash-pay-member" className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Member</label>
            <select id="dash-pay-member" value={newPayMember} onChange={(e) => setNewPayMember(e.target.value)} className={selectCls}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name} ({m.member_code})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dash-pay-amount" className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Amount paid (₹)</label>
            <Input id="dash-pay-amount" type="number" inputMode="decimal" min={0} value={newPayAmount} onChange={(e) => setNewPayAmount(e.target.value)} placeholder="0" className="font-mono font-bold" />
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={activeModal === 'mark_attendance'}
        onClose={closeModal}
        title="Quick check-in"
        description="Enter member code or mobile number."
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={closeModal}>Cancel</Button>
            <Button
              className="w-full sm:w-auto"
              disabled={!attendanceInput.trim()}
              onClick={() => {
                recordAttendance(attendanceInput.trim(), 'member_code')
                setAttendanceInput('')
                closeModal()
              }}
            >
              Record check-in
            </Button>
          </>
        }
      >
        <div>
          <label htmlFor="dash-att" className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Member code / mobile</label>
          <Input id="dash-att" value={attendanceInput} onChange={(e) => setAttendanceInput(e.target.value)} placeholder="TPFZ-M-0001 or 98250 00000" className="font-mono" autoFocus />
        </div>
      </Dialog>

      <Dialog
        isOpen={activeModal === 'add_expense'}
        onClose={closeModal}
        title="Add expense"
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={closeModal}>Cancel</Button>
            <Button
              className="w-full sm:w-auto"
              disabled={!newExpCategory.trim() || Number(newExpAmount) <= 0}
              onClick={() => {
                addExpense({ category: newExpCategory.trim(), amount_paise: rupeesToPaise(Number(newExpAmount)), vendor: '' })
                setNewExpCategory('')
                setNewExpAmount('')
                closeModal()
              }}
            >
              Save expense
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="dash-exp-cat" className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Category</label>
            <Input id="dash-exp-cat" value={newExpCategory} onChange={(e) => setNewExpCategory(e.target.value)} placeholder="Rent, electricity, repairs…" />
          </div>
          <div>
            <label htmlFor="dash-exp-amt" className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-wider">Amount (₹)</label>
            <Input id="dash-exp-amt" type="number" inputMode="decimal" min={0} value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} placeholder="0" className="font-mono font-bold" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
