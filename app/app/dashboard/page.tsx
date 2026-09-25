'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Receipt,
  Dumbbell,
  Plus,
  UserPlus,
  QrCode,
  Zap,
  ArrowUpRight,
  Filter,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Activity,
  ArrowUp,
  Sparkles,
  MessageSquare,
  CreditCard,
  Target,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/ui/status-badge'
import { AddMemberAdvancedModal } from '@/components/ui/add-member-advanced-modal'
import { useApp } from '@/lib/context'
import { paiseToRupees, formatCurrency } from '@/lib/money'
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

// Custom Recharts High-Tech Dark Glass Tooltips
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D0F17]/95 backdrop-blur-xl border border-[#FF1E3D]/50 p-3.5 rounded-2xl shadow-[0_0_25px_rgba(255,30,61,0.25)] text-xs space-y-2 font-sans z-50">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
          <span className="font-extrabold text-white">{label} Financial Breakdown</span>
          <span className="text-[10px] font-mono text-primary font-bold">LIVE METRIC</span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
              <span className="text-slate-300 font-semibold">{entry.name}:</span>
            </div>
            <span className="font-mono font-extrabold text-white">
              ₹{Number(entry.value).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-[#0D0F17]/95 backdrop-blur-xl border border-[#FF1E3D]/50 px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,30,61,0.25)] text-xs font-sans z-50">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-[#FF1E3D] animate-pulse" />
          <span className="font-extrabold text-white">{label} Slot Intensity</span>
        </div>
        <div className="mt-1 font-mono text-sm font-extrabold text-primary">
          {data.value} Active Check-Ins
        </div>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-[#0D0F17]/95 backdrop-blur-xl border border-[#FF1E3D]/50 px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,30,61,0.25)] text-xs font-sans z-50 flex items-center gap-2.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.payload.color }} />
        <span className="font-bold text-white">{data.name}:</span>
        <span className="font-mono font-extrabold text-primary">{data.value}% Share</span>
      </div>
    )
  }
  return null
}

export default function OwnerDashboard() {
  const {
    gym,
    members,
    memberships,
    attendance,
    payments,
    expenses,
    trainers,
    addMember,
    recordPayment,
    recordAttendance,
    addExpense,
  } = useApp()

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberPhone, setNewMemberPhone] = useState('')
  const [newPayAmount, setNewPayAmount] = useState('2950')
  const [newPayMember, setNewPayMember] = useState(members[0]?.id || 'mem_01')
  const [attendanceInput, setAttendanceInput] = useState('')
  const [newExpCategory, setNewExpCategory] = useState('Utilities')
  const [newExpAmount, setNewExpAmount] = useState('1500')
  const [chartPeriod, setChartPeriod] = useState<'6M' | '1Y'>('6M')

  const totalMembersCount = members.filter((m) => m.status !== 'archived').length
  const activeMembersCount = members.filter((m) => m.status === 'active').length
  const expiredMembersCount = members.filter((m) => m.status === 'expired').length
  const frozenMembersCount = members.filter((m) => m.status === 'frozen').length

  const todayDateStr = new Date().toISOString().split('T')[0]
  const todayAttendanceCount = attendance.filter((a) => a.date === todayDateStr).length
  const currentlyInsideCount = attendance.filter((a) => !a.check_out).length

  const monthlyRevenuePaise = payments.reduce((sum, p) => sum + p.paid_paise, 0)
  const monthlyExpensesPaise = expenses.reduce((sum, e) => sum + e.amount_paise, 0)
  const estimatedProfitPaise = monthlyRevenuePaise - monthlyExpensesPaise
  const pendingPaymentsPaise = payments.reduce((sum, p) => sum + p.due_paise, 0)

  // Financial Growth Chart Data matching Crimson Red Theme
  const revenueTrendData = [
    { month: 'Apr', revenue: 210000, expenses: 110000 },
    { month: 'May', revenue: 280000, expenses: 120000 },
    { month: 'Jun', revenue: 340000, expenses: 135000 },
    { month: 'Jul', revenue: 410000, expenses: 140000 },
    { month: 'Aug', revenue: 450000, expenses: 130000 },
    { month: 'Sep', revenue: 485000, expenses: 119500 },
  ]

  const attendanceTrendData = [
    { hour: '06 AM', count: 28 },
    { hour: '07 AM', count: 54 },
    { hour: '08 AM', count: 62 },
    { hour: '09 AM', count: 35 },
    { hour: '05 PM', count: 46 },
    { hour: '06 PM', count: 78 },
    { hour: '07 PM', count: 68 },
    { hour: '08 PM', count: 40 },
  ]

  const membershipPieData = [
    { name: 'VIP Annual', value: 45, color: '#FF1E3D' },
    { name: 'Quarterly Beast', value: 30, color: '#FF6B00' },
    { name: 'Monthly Standard', value: 15, color: '#00E5FF' },
    { name: 'Personal Training', value: 10, color: '#10B981' },
  ]

  const kpiCards = [
    {
      title: 'Total Active Squad',
      val: activeMembersCount,
      sub: `${expiredMembersCount} Expired • ${frozenMembersCount} Frozen`,
      badge: '+14.2%',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: Users,
      glowColor: 'shadow-[0_0_20px_rgba(255,30,61,0.15)]',
      borderAccent: 'border-l-4 border-l-[#FF1E3D]',
    },
    {
      title: "Today's Live Check-Ins",
      val: todayAttendanceCount,
      sub: `${currentlyInsideCount} Currently on Floor`,
      badge: 'Peak Rush',
      badgeColor: 'text-primary bg-primary/10 border-primary/30',
      icon: CalendarCheck,
      glowColor: 'shadow-[0_0_20px_rgba(0,229,255,0.15)]',
      borderAccent: 'border-l-4 border-l-[#00E5FF]',
    },
    {
      title: 'Gross Monthly Revenue',
      val: formatCurrency(monthlyRevenuePaise, '₹'),
      sub: `${formatCurrency(pendingPaymentsPaise, '₹')} Due Payments`,
      badge: '+18.5%',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: DollarSign,
      glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      borderAccent: 'border-l-4 border-l-emerald-500',
    },
    {
      title: 'Net Profit Margin',
      val: formatCurrency(estimatedProfitPaise, '₹'),
      sub: `Expenses: ${formatCurrency(monthlyExpensesPaise, '₹')}`,
      badge: '75.4% Margin',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: TrendingUp,
      glowColor: 'shadow-[0_0_20px_rgba(255,107,0,0.15)]',
      borderAccent: 'border-l-4 border-l-[#FF6B00]',
      highlight: true,
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* AGGRESSIVE HERO COMMAND BANNER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D0F17] via-[#141722] to-[#0D0F17] border border-[#FF1E3D]/40 p-6 sm:p-8 shadow-[0_10px_35px_rgba(255,30,61,0.2)]"
      >
        {/* Background Glowing Orb */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF1E3D]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#00E5FF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1E3D]/20 border border-[#FF1E3D]/50 text-[#FF1E3D] text-xs font-black uppercase tracking-widest animate-pulse">
                <Flame className="h-3.5 w-3.5" />
                POWER COMMAND CENTER
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Gym Floor Online
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-white via-slate-200 to-[#FF1E3D] bg-clip-text text-transparent">{gym.name} Owner</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Real-time analytics, member check-ins, financial command, and instant operational control.
            </p>
          </div>

          {/* Quick Action Button Bar */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Button
              size="lg"
              onClick={() => setActiveModal('add_member')}
              className="brand-btn-gradient text-white font-extrabold gap-2 shadow-[0_0_20px_rgba(255,30,61,0.4)] hover:scale-105 transition-all duration-300"
            >
              <UserPlus className="h-4.5 w-4.5" />
              <span>Add Member</span>
            </Button>
            <Button
              size="lg"
              variant="soft"
              onClick={() => setActiveModal('record_payment')}
              className="bg-[#181B26] hover:bg-[#202534] text-white border border-[#FF1E3D]/30 font-extrabold gap-2 hover:scale-105 transition-all duration-300"
            >
              <CreditCard className="h-4.5 w-4.5 text-[#FF1E3D]" />
              <span>Record Fee</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setActiveModal('mark_attendance')}
              className="bg-transparent border-slate-700 hover:border-[#00E5FF] text-white font-extrabold gap-2 hover:scale-105 transition-all duration-300"
            >
              <QrCode className="h-4.5 w-4.5 text-[#00E5FF]" />
              <span>Check-In</span>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setActiveModal('add_expense')}
              className="text-slate-300 hover:text-white hover:bg-slate-800/60 font-bold gap-2"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Expense</span>
            </Button>
          </div>
        </div>

        {/* Live Capacity Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FF1E3D]/15 border border-[#FF1E3D]/30 flex items-center justify-center text-[#FF1E3D]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Gym Capacity Load</span>
              <span className="text-white text-sm font-extrabold font-mono">68% Capacity (68 / 100 Max)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Peak Hour Alert</span>
              <span className="text-white text-sm font-extrabold font-mono">06:00 PM - 08:00 PM Today</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Staff Status</span>
              <span className="text-white text-sm font-extrabold font-mono">4 Trainers & Reception Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className={`h-full relative overflow-hidden bg-[#0D0F17]/90 border-slate-800 ${kpi.borderAccent} ${kpi.glowColor} hover:border-[#FF1E3D]/50 transition-all duration-300 group`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${kpi.badgeColor}`}>
                      {kpi.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className={`text-3xl font-black tracking-tight font-mono ${kpi.highlight ? 'text-emerald-400' : 'text-white'}`}>
                      {kpi.val}
                    </span>
                    <div className="h-9 w-9 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-[#FF1E3D] group-hover:border-[#FF1E3D]/40 transition-colors">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 block mt-2">
                    {kpi.sub}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* FINANCIAL GROWTH AREA CHART & PLAN DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Area Chart */}
        <Card className="lg:col-span-2 bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/60">
            <div>
              <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                <span>Revenue & Profit Command Matrix</span>
                <span className="h-2 w-2 rounded-full bg-[#FF1E3D] animate-ping" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Monthly revenue stream vs operating expenditures
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-xs font-bold hidden sm:flex">
                <span className="flex items-center gap-1.5 text-[#FF1E3D]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF1E3D] shadow-[0_0_8px_#FF1E3D]" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[#00E5FF]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" /> Expenses
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF1E3D" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#FF1E3D" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    content={<CustomAreaTooltip />}
                    cursor={{ stroke: 'rgba(255, 30, 61, 0.4)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Gross Revenue"
                    stroke="#FF1E3D"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Operating Expenses"
                    stroke="#00E5FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution Donut */}
        <Card className="bg-[#0D0F17]/90 border-slate-800 shadow-xl flex flex-col justify-between">
          <CardHeader className="border-b border-slate-800/60 pb-3">
            <CardTitle className="text-lg font-black text-white">Membership Tier Split</CardTitle>
            <CardDescription className="text-xs text-slate-400">Distribution across active plan packages</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center justify-center relative">
            <div className="h-56 w-full relative flex items-center justify-center">
              {/* Dynamic Center Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-3xl font-black text-white font-mono leading-none">{totalMembersCount}</span>
                <span className="text-[10px] font-black text-[#FF1E3D] uppercase tracking-widest mt-1">Total Members</span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={88}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {membershipPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-2.5 w-full pt-4 border-t border-slate-800/80">
              {membershipPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
                  <span className="text-slate-300 font-semibold truncate text-[11px]">{item.name}</span>
                  <span className="font-mono font-black text-white ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PEAK HOURS BAR CHART & ATTENTION REQUIRED LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Bar Chart */}
        <Card className="bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <CardHeader className="pb-3 border-b border-slate-800/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                  <span>Gym Attendance Peak Intensity</span>
                  <Flame className="h-4 w-4 text-[#FF1E3D]" />
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">Hourly check-in volume distribution today</CardDescription>
              </div>
              <span className="text-xs font-black text-[#FF1E3D] bg-[#FF1E3D]/10 border border-[#FF1E3D]/30 px-3 py-1 rounded-full">
                Peak: 06 PM (78 Check-Ins)
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF1E3D" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: 'rgba(255, 30, 61, 0.12)', rx: 8 }}
                  />
                  <Bar dataKey="count" name="Check-ins" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attention Required List */}
        <Card className="bg-[#0D0F17]/90 border-slate-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/60">
            <div>
              <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[#FF1E3D]" />
                <span>Attention Required & Follow-Ups</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Expiring memberships & action items</CardDescription>
            </div>
            <Link href="/app/members">
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold text-[#FF1E3D] hover:text-[#FF1E3D] hover:bg-[#FF1E3D]/10">
                <span>View All Squad</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {members.slice(0, 4).map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-[#141722]/80 hover:border-[#FF1E3D]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
                      alt={m.full_name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-[#FF1E3D]/40 shadow-[0_0_10px_rgba(255,30,61,0.2)]"
                    />
                    <div>
                      <Link href={`/app/members/${m.id}`} className="font-extrabold text-xs text-white hover:text-[#FF1E3D] transition-colors block">
                        {m.full_name}
                      </Link>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {m.member_code} • {m.assigned_trainer_name || 'No Trainer'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={m.status} />
                    <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Joined {m.joining_date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTION MODALS */}
      <AddMemberAdvancedModal
        isOpen={activeModal === 'add_member'}
        onClose={() => setActiveModal(null)}
      />

      <Dialog
        isOpen={activeModal === 'record_payment'}
        onClose={() => setActiveModal(null)}
        title="Record Fee Payment & Issue GST Invoice"
        description="Collect cash, UPI, or card payment from a member."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-extrabold text-slate-300 mb-1 block uppercase tracking-wider">Select Member</label>
            <select
              value={newPayMember}
              onChange={(e) => setNewPayMember(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-semibold"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-extrabold text-slate-300 mb-1 block uppercase tracking-wider">Amount Paid (₹)</label>
            <Input
              type="number"
              value={newPayAmount}
              onChange={(e) => setNewPayAmount(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white font-mono font-bold"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="border-slate-700 text-white">Cancel</Button>
            <Button
              className="brand-btn-gradient text-white font-black"
              onClick={() => {
                const selectedM = members.find((m) => m.id === newPayMember)
                const amtRupees = Number(newPayAmount) || 2950
                const paise = amtRupees * 100
                recordPayment({
                  member_id: newPayMember,
                  member_name: selectedM?.full_name || 'Member',
                  paid_paise: paise,
                  final_paise: paise,
                })
                setActiveModal(null)
              }}
            >
              Generate Receipt
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={activeModal === 'mark_attendance'}
        onClose={() => setActiveModal(null)}
        title="Reception Quick Floor Check-In"
        description="Enter member code or mobile number to record gym attendance."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-extrabold text-slate-300 mb-1 block uppercase tracking-wider">Member Code / Mobile</label>
            <Input
              value={attendanceInput}
              onChange={(e) => setAttendanceInput(e.target.value)}
              placeholder="e.g. TPFZ-M-0001 or 9825077777"
              className="bg-slate-900 border-slate-700 text-white font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="border-slate-700 text-white">Cancel</Button>
            <Button
              className="brand-btn-gradient text-white font-black"
              onClick={() => {
                if (attendanceInput) {
                  recordAttendance(attendanceInput, 'member_code')
                  setAttendanceInput('')
                  setActiveModal(null)
                }
              }}
            >
              Record Check-In
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={activeModal === 'add_expense'}
        onClose={() => setActiveModal(null)}
        title="Record Operating Gym Expense"
        description="Track expenses for rent, electricity, equipment maintenance, etc."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-extrabold text-slate-300 mb-1 block uppercase tracking-wider">Category</label>
            <Input
              value={newExpCategory}
              onChange={(e) => setNewExpCategory(e.target.value)}
              placeholder="Rent / Electricity / Repairs"
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs font-extrabold text-slate-300 mb-1 block uppercase tracking-wider">Amount (₹)</label>
            <Input
              type="number"
              value={newExpAmount}
              onChange={(e) => setNewExpAmount(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white font-mono font-bold"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="border-slate-700 text-white">Cancel</Button>
            <Button
              className="brand-btn-gradient text-white font-black"
              onClick={() => {
                const amtRupees = Number(newExpAmount) || 1500
                addExpense({
                  category: newExpCategory,
                  amount_paise: amtRupees * 100,
                  vendor: 'Vendor',
                })
                setActiveModal(null)
              }}
            >
              Save Expense
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
