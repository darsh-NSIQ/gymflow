'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Gym,
  Branch,
  UserProfile,
  Member,
  MembershipPlan,
  MemberMembership,
  AttendanceRecord,
  PaymentRecord,
  ExpenseRecord,
  Trainer,
  WorkoutPlan,
  DietPlan,
  ProgressRecord,
  EquipmentItem,
  NotificationItem,
  AutomationRule,
  AuditLog,
  UserRole,
} from './types'
import {
  INITIAL_GYM,
  INITIAL_BRANCHES,
  DEMO_USERS,
  INITIAL_MEMBERS,
  INITIAL_PLANS,
  INITIAL_MEMBERSHIPS,
  INITIAL_ATTENDANCE,
  INITIAL_PAYMENTS,
  INITIAL_TRAINERS,
  INITIAL_EXPENSES,
  INITIAL_WORKOUTS,
  INITIAL_DIETS,
  INITIAL_EQUIPMENT,
  INITIAL_AUTOMATIONS,
  INITIAL_AUDIT_LOGS,
} from './store'
import { calculateMembershipEndDate } from './dates'

interface AppContextType {
  gym: Gym
  branches: Branch[]
  activeBranchId: string
  setActiveBranchId: (id: string) => void
  currentUser: UserProfile
  setCurrentUserByRole: (role: UserRole) => void
  members: Member[]
  plans: MembershipPlan[]
  memberships: MemberMembership[]
  attendance: AttendanceRecord[]
  payments: PaymentRecord[]
  trainers: Trainer[]
  expenses: ExpenseRecord[]
  workouts: WorkoutPlan[]
  diets: DietPlan[]
  equipment: EquipmentItem[]
  automations: AutomationRule[]
  notifications: NotificationItem[]
  auditLogs: AuditLog[]
  // Actions
  updateGymSettings: (updated: Partial<Gym>) => void
  addMember: (memberData: Partial<Member>) => Member
  updateMember: (id: string, memberData: Partial<Member>) => void
  archiveMember: (id: string) => void
  assignMembership: (memberId: string, planId: string) => MemberMembership
  freezeMembership: (membershipId: string, freezeDays: number) => void
  recordAttendance: (memberId: string, method?: 'qr_scan' | 'member_code' | 'phone_search' | 'manual') => { success: boolean; message: string; record?: AttendanceRecord }
  recordPayment: (paymentData: Partial<PaymentRecord>) => PaymentRecord
  addExpense: (expenseData: Partial<ExpenseRecord>) => ExpenseRecord
  addPlan: (planData: Partial<MembershipPlan>) => MembershipPlan
  updatePlan: (id: string, planData: Partial<MembershipPlan>) => void
  addTrainer: (trainerData: Partial<Trainer>) => Trainer
  assignTrainer: (memberId: string, trainerId: string) => void
  saveWorkoutPlan: (plan: WorkoutPlan) => void
  saveDietPlan: (plan: DietPlan) => void
  toggleAutomation: (id: string) => void
  addAuditLog: (action: string, entity: string, entityId: string, details?: string) => void
  toastMessage: string | null
  showToast: (msg: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [gym, setGym] = useState<Gym>(INITIAL_GYM)
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [activeBranchId, setActiveBranchId] = useState<string>('br_01')
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]) // Default Owner

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS)
  const [memberships, setMemberships] = useState<MemberMembership[]>(INITIAL_MEMBERSHIPS)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE)
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS)
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES)
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(INITIAL_WORKOUTS)
  const [diets, setDiets] = useState<DietPlan[]>(INITIAL_DIETS)
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT)
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_01',
      gym_id: 'gym_01',
      title: 'Membership Renewal Due',
      message: 'Rohan Trivedi membership expires in 2 days.',
      type: 'membership',
      read: false,
      priority: 'high',
      created_at: new Date().toISOString(),
    },
    {
      id: 'notif_02',
      gym_id: 'gym_01',
      title: 'Partial Payment Pending',
      message: 'Priya Joshi has pending balance of ₹2,080.',
      type: 'payment',
      read: false,
      priority: 'medium',
      created_at: new Date().toISOString(),
    },
  ])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Auto LocalStorage & Local Disk File Sync (/api/db)
  useEffect(() => {
    if (typeof window === 'undefined') return
    // 1. Try loading from browser localStorage first
    try {
      const localM = localStorage.getItem('gymflow_members')
      if (localM) setMembers(JSON.parse(localM))

      const localMs = localStorage.getItem('gymflow_memberships')
      if (localMs) setMemberships(JSON.parse(localMs))

      const localPay = localStorage.getItem('gymflow_payments')
      if (localPay) setPayments(JSON.parse(localPay))

      const localAtt = localStorage.getItem('gymflow_attendance')
      if (localAtt) setAttendance(JSON.parse(localAtt))

      const localExp = localStorage.getItem('gymflow_expenses')
      if (localExp) setExpenses(JSON.parse(localExp))
    } catch (e) {
      console.error('Failed to load local storage state:', e)
    }

    // 2. Fetch from Local Disk File DB (/api/db)
    fetch('/api/db')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.members?.length) setMembers(res.data.members)
          if (res.data.memberships?.length) setMemberships(res.data.memberships)
          if (res.data.payments?.length) setPayments(res.data.payments)
          if (res.data.attendance?.length) setAttendance(res.data.attendance)
          if (res.data.expenses?.length) setExpenses(res.data.expenses)
        }
      })
      .catch((err) => console.log('Local disk API sync idle:', err))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('gymflow_members', JSON.stringify(members))
      localStorage.setItem('gymflow_memberships', JSON.stringify(memberships))
      localStorage.setItem('gymflow_payments', JSON.stringify(payments))
      localStorage.setItem('gymflow_attendance', JSON.stringify(attendance))
      localStorage.setItem('gymflow_expenses', JSON.stringify(expenses))

      // Save to Local Disk File DB (gymflow_db.json)
      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members, memberships, payments, attendance, expenses }),
      }).catch((err) => console.log('Disk write silent:', err))
    } catch (e) {
      console.error('Failed to save local storage state:', e)
    }
  }, [members, memberships, payments, attendance, expenses])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const setCurrentUserByRole = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0]
    setCurrentUser(found)
    showToast(`Switched active persona to ${found.full_name} (${found.role.toUpperCase()})`)
  }

  const addAuditLog = (action: string, entity: string, entityId: string, details?: string) => {
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      gym_id: gym.id,
      user_name: `${currentUser.full_name} (${currentUser.role.toUpperCase()})`,
      action,
      entity,
      entity_id: entityId,
      timestamp: new Date().toISOString(),
      details,
    }
    setAuditLogs((prev) => [newLog, ...prev])
  }

  const updateGymSettings = (updated: Partial<Gym>) => {
    setGym((prev) => ({ ...prev, ...updated }))
    addAuditLog('GYM_SETTINGS_UPDATED', 'Gym', gym.id, 'Updated gym configuration/branding.')
    showToast('Gym settings & branding saved successfully!')
  }

  const addMember = (memberData: Partial<Member>): Member => {
    const nextCodeNumber = String(members.length + 1).padStart(4, '0')
    const newMember: Member = {
      id: `mem_${Date.now()}`,
      gym_id: gym.id,
      branch_id: activeBranchId,
      member_code: `${gym.member_prefix}${nextCodeNumber}`,
      full_name: memberData.full_name || 'New Member',
      gender: memberData.gender || 'male',
      dob: memberData.dob || '1996-01-01',
      phone: memberData.phone || '+91 99000 00000',
      email: memberData.email,
      address: memberData.address,
      emergency_name: memberData.emergency_name || 'Emergency Contact',
      emergency_phone: memberData.emergency_phone || '+91 99000 00001',
      joining_date: memberData.joining_date || new Date().toISOString().split('T')[0],
      source: memberData.source || 'Walk-in',
      assigned_trainer_id: memberData.assigned_trainer_id,
      assigned_trainer_name: memberData.assigned_trainer_name,
      status: 'active',
      health_notes: memberData.health_notes,
      fitness_goals: memberData.fitness_goals || ['General Fitness'],
      preferred_workout_time: memberData.preferred_workout_time || 'Morning',
      qr_token: `QR_${(memberData.full_name || 'MEMBER').replace(/\s+/g, '_')}_${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    setMembers((prev) => [newMember, ...prev])
    addAuditLog('MEMBER_CREATED', 'Member', newMember.id, `Registered member ${newMember.full_name}`)
    showToast(`Member ${newMember.full_name} registered successfully!`)
    return newMember
  }

  const updateMember = (id: string, memberData: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...memberData } : m)))
    addAuditLog('MEMBER_UPDATED', 'Member', id, 'Updated member profile details.')
    showToast('Member profile updated.')
  }

  const archiveMember = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'archived' } : m)))
    addAuditLog('MEMBER_ARCHIVED', 'Member', id, 'Archived member record.')
    showToast('Member archived.')
  }

  const assignMembership = (memberId: string, planId: string): MemberMembership => {
    const member = members.find((m) => m.id === memberId)
    const plan = plans.find((p) => p.id === planId)

    const startDate = new Date().toISOString().split('T')[0]
    const endDate = calculateMembershipEndDate(startDate, plan?.duration_value || 1, plan?.duration_unit || 'months')

    const newMs: MemberMembership = {
      id: `ms_${Date.now()}`,
      gym_id: gym.id,
      member_id: memberId,
      member_name: member?.full_name || 'Member',
      plan_id: planId,
      plan_name: plan?.name || 'Membership Plan',
      start_date: startDate,
      end_date: endDate,
      price_paise: plan?.price_paise || 250000,
      discount_paise: 0,
      tax_paise: Math.round((plan?.price_paise || 250000) * 0.18),
      final_amount_paise: Math.round((plan?.price_paise || 250000) * 1.18),
      payment_status: 'paid',
      status: 'active',
      created_at: new Date().toISOString(),
    }

    setMemberships((prev) => [newMs, ...prev])
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, status: 'active' } : m)))
    addAuditLog('MEMBERSHIP_ASSIGNED', 'MemberMembership', newMs.id, `Assigned ${plan?.name} to ${member?.full_name}`)
    showToast(`Assigned ${plan?.name} to ${member?.full_name}`)
    return newMs
  }

  const freezeMembership = (membershipId: string, freezeDays: number) => {
    setMemberships((prev) =>
      prev.map((ms) => {
        if (ms.id === membershipId) {
          return { ...ms, status: 'frozen' }
        }
        return ms
      })
    )
    showToast(`Membership frozen for ${freezeDays} days.`)
  }

  const recordAttendance = (
    memberId: string,
    method: 'qr_scan' | 'member_code' | 'phone_search' | 'manual' = 'manual'
  ) => {
    const member = members.find((m) => m.id === memberId || m.qr_token === memberId || m.member_code === memberId)

    if (!member) {
      return { success: false, message: 'Member not found in database.' }
    }

    if (member.status === 'expired') {
      return { success: false, message: `Membership Expired for ${member.full_name}. Refused check-in.` }
    }
    if (member.status === 'frozen') {
      return { success: false, message: `Member ${member.full_name} is currently Frozen. Unfreeze to allow check-in.` }
    }
    if (member.status === 'suspended') {
      return { success: false, message: `Member ${member.full_name} is Suspended.` }
    }

    const todayStr = new Date().toISOString().split('T')[0]
    const existingCheckIn = attendance.find((a) => a.member_id === member.id && a.date === todayStr && !a.check_out)

    if (existingCheckIn) {
      // Perform Check-Out
      setAttendance((prev) =>
        prev.map((a) => (a.id === existingCheckIn.id ? { ...a, check_out: new Date().toISOString() } : a))
      )
      addAuditLog('ATTENDANCE_CHECKOUT', 'AttendanceRecord', existingCheckIn.id, `Checked out ${member.full_name}`)
      showToast(`Checked out ${member.full_name} successfully!`)
      return { success: true, message: `Checked OUT ${member.full_name} successfully.` }
    }

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      gym_id: gym.id,
      branch_id: activeBranchId,
      member_id: member.id,
      member_name: member.full_name,
      member_code: member.member_code,
      member_photo: member.photo_url,
      check_in: new Date().toISOString(),
      method,
      is_grace: (member.status as string) === 'expired',
      auto_closed: false,
      date: todayStr,
    }

    setAttendance((prev) => [newRecord, ...prev])
    addAuditLog('ATTENDANCE_CHECKIN', 'AttendanceRecord', newRecord.id, `Checked in ${member.full_name} via ${method}`)
    showToast(`Welcome! Checked in ${member.full_name} successfully.`)
    return { success: true, message: `Welcome, ${member.full_name}! Attendance recorded.`, record: newRecord }
  }

  const recordPayment = (paymentData: Partial<PaymentRecord>): PaymentRecord => {
    const nextInv = String(payments.length + 1).padStart(4, '0')
    const newPay: PaymentRecord = {
      id: `pay_${Date.now()}`,
      gym_id: gym.id,
      branch_id: activeBranchId,
      invoice_number: `${gym.invoice_prefix}${nextInv}`,
      member_id: paymentData.member_id || 'mem_01',
      member_name: paymentData.member_name || 'Member',
      amount_paise: paymentData.amount_paise || 250000,
      discount_paise: paymentData.discount_paise || 0,
      tax_paise: paymentData.tax_paise || 45000,
      final_paise: paymentData.final_paise || 295000,
      paid_paise: paymentData.paid_paise || paymentData.final_paise || 295000,
      due_paise: paymentData.due_paise || 0,
      payment_method: paymentData.payment_method || 'upi',
      transaction_ref: paymentData.transaction_ref || `TXN_${Date.now()}`,
      payment_date: new Date().toISOString(),
      collected_by: currentUser.full_name,
      status: (paymentData.due_paise || 0) > 0 ? 'partial' : 'paid',
      notes: paymentData.notes,
    }

    setPayments((prev) => [newPay, ...prev])
    addAuditLog('PAYMENT_RECORDED', 'PaymentRecord', newPay.id, `Invoice ${newPay.invoice_number} recorded.`)
    showToast(`Payment of ₹${(newPay.paid_paise / 100).toLocaleString()} recorded!`)
    return newPay
  }

  const addExpense = (expenseData: Partial<ExpenseRecord>): ExpenseRecord => {
    const newExp: ExpenseRecord = {
      id: `exp_${Date.now()}`,
      gym_id: gym.id,
      branch_id: activeBranchId,
      category: expenseData.category || 'General',
      amount_paise: expenseData.amount_paise || 100000,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      vendor: expenseData.vendor || 'Vendor',
      notes: expenseData.notes,
    }
    setExpenses((prev) => [newExp, ...prev])
    addAuditLog('EXPENSE_ADDED', 'ExpenseRecord', newExp.id, `Added ${newExp.category} expense`)
    showToast(`Expense of ₹${(newExp.amount_paise / 100).toLocaleString()} recorded.`)
    return newExp
  }

  const addPlan = (planData: Partial<MembershipPlan>): MembershipPlan => {
    const newPlan: MembershipPlan = {
      id: `plan_${Date.now()}`,
      gym_id: gym.id,
      name: planData.name || 'New Plan',
      duration_value: planData.duration_value || 1,
      duration_unit: planData.duration_unit || 'months',
      price_paise: planData.price_paise || 300000,
      description: planData.description || '',
      pt_included: planData.pt_included || false,
      pt_sessions_count: planData.pt_sessions_count || 0,
      freeze_allowed: planData.freeze_allowed || false,
      freeze_days: planData.freeze_days || 0,
      status: 'active',
    }
    setPlans((prev) => [newPlan, ...prev])
    showToast(`Membership plan ${newPlan.name} created!`)
    return newPlan
  }

  const updatePlan = (id: string, planData: Partial<MembershipPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...planData } : p)))
    showToast('Membership plan updated.')
  }

  const addTrainer = (trainerData: Partial<Trainer>): Trainer => {
    const newTr: Trainer = {
      id: `tr_${Date.now()}`,
      gym_id: gym.id,
      branch_id: activeBranchId,
      name: trainerData.name || 'New Trainer',
      phone: trainerData.phone || '+91 99999 88888',
      email: trainerData.email || 'trainer@powerfitnesszone.com',
      specialization: trainerData.specialization || 'Fitness Trainer',
      experience_years: trainerData.experience_years || 3,
      joining_date: new Date().toISOString().split('T')[0],
      salary_paise: trainerData.salary_paise || 2500000,
      commission_pct: trainerData.commission_pct || 10,
      assigned_members_count: 0,
      status: 'active',
    }
    setTrainers((prev) => [newTr, ...prev])
    showToast(`Trainer ${newTr.name} added!`)
    return newTr
  }

  const assignTrainer = (memberId: string, trainerId: string) => {
    const trainer = trainers.find((t) => t.id === trainerId)
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, assigned_trainer_id: trainerId, assigned_trainer_name: trainer?.name }
          : m
      )
    )
    showToast(`Assigned trainer ${trainer?.name || ''}`)
  }

  const saveWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkouts((prev) => {
      const exists = prev.some((w) => w.id === plan.id)
      if (exists) return prev.map((w) => (w.id === plan.id ? plan : w))
      return [plan, ...prev]
    })
    showToast('Workout plan saved.')
  }

  const saveDietPlan = (plan: DietPlan) => {
    setDiets((prev) => {
      const exists = prev.some((d) => d.id === plan.id)
      if (exists) return prev.map((d) => (d.id === plan.id ? plan : d))
      return [plan, ...prev]
    })
    showToast('Diet plan saved.')
  }

  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
    showToast('Automation rule updated.')
  }

  return (
    <AppContext.Provider
      value={{
        gym,
        branches,
        activeBranchId,
        setActiveBranchId,
        currentUser,
        setCurrentUserByRole,
        members,
        plans,
        memberships,
        attendance,
        payments,
        trainers,
        expenses,
        workouts,
        diets,
        equipment,
        automations,
        notifications,
        auditLogs,
        updateGymSettings,
        addMember,
        updateMember,
        archiveMember,
        assignMembership,
        freezeMembership,
        recordAttendance,
        recordPayment,
        addExpense,
        addPlan,
        updatePlan,
        addTrainer,
        assignTrainer,
        saveWorkoutPlan,
        saveDietPlan,
        toggleAutomation,
        addAuditLog,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
