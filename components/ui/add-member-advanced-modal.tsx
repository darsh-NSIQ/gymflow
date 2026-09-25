'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Ruler,
  Weight,
  Target,
  Activity,
  Award,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Flame,
  Sparkles,
  Dumbbell,
  HeartPulse,
  Receipt,
  UserPlus,
} from 'lucide-react'
import { Dialog } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { useApp } from '@/lib/context'
import { paiseToRupees, formatCurrency } from '@/lib/money'

interface AddMemberAdvancedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddMemberAdvancedModal({ isOpen, onClose }: AddMemberAdvancedModalProps) {
  const { gym, plans, trainers, addMember, assignMembership, recordPayment, showToast } = useApp()

  const [activeTab, setActiveTab] = useState<number>(1)

  // Step 1: Basic & Contact Info
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')
  const [dob, setDob] = useState('1998-05-15')
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0])
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [address, setAddress] = useState('')
  const [leadSource, setLeadSource] = useState('Walk-in')

  // Step 2: Body Measurements & Fitness Targets
  const [heightCm, setHeightCm] = useState<string>('175')
  const [weightKg, setWeightKg] = useState<string>('78')
  const [targetWeightKg, setTargetWeightKg] = useState<string>('70')
  const [targetTimeline, setTargetTimeline] = useState('90 Days')
  const [bodyFatPct, setBodyFatPct] = useState<string>('18')
  const [chestCm, setChestCm] = useState<string>('102')
  const [waistCm, setWaistCm] = useState<string>('86')
  const [armsCm, setArmsCm] = useState<string>('38')
  const [thighsCm, setThighsCm] = useState<string>('58')
  const [hipsCm, setHipsCm] = useState<string>('98')
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Fat Loss', 'Muscle Hypertrophy'])
  const [healthNotes, setHealthNotes] = useState('')

  // Step 3: Plan & Trainer
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'plan_01')
  const [assignedTrainerId, setAssignedTrainerId] = useState<string>(trainers[0]?.id || 'tr_01')
  const [workoutShift, setWorkoutShift] = useState('Morning (06:00 AM - 09:00 AM)')

  // Step 4: Billing & Initial Payment
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0]
  const planPriceRupees = selectedPlan ? selectedPlan.price_paise / 100 : 2500
  const [discountRupees, setDiscountRupees] = useState<string>('0')
  const [paidRupees, setPaidRupees] = useState<string>(String(planPriceRupees))
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'card' | 'bank_transfer'>('upi')
  const [generateInvoice, setGenerateInvoice] = useState(true)

  // Auto-calculated BMI
  const heightM = (Number(heightCm) || 170) / 100
  const weightVal = Number(weightKg) || 70
  const bmiVal = Math.round((weightVal / (heightM * heightM)) * 10) / 10

  const goalOptions = [
    'Fat Loss',
    'Muscle Hypertrophy',
    'Powerlifting 5x5',
    'HIIT Cardio',
    'General Fitness',
    'Endurance',
    'Flexibility & Yoga',
  ]

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const resetForm = () => {
    setActiveTab(1)
    setFullName('')
    setPhone('')
    setEmail('')
    setHealthNotes('')
    setSelectedGoals(['Fat Loss', 'Muscle Hypertrophy'])
  }

  const handleSaveMember = () => {
    if (!fullName) {
      showToast('Please enter member full name.')
      setActiveTab(1)
      return
    }
    if (!phone) {
      showToast('Please enter mobile number.')
      setActiveTab(1)
      return
    }

    const assignedTr = trainers.find((t) => t.id === assignedTrainerId)

    // 1. Create Member Record
    const newMember = addMember({
      full_name: fullName,
      phone: phone,
      email: email || undefined,
      gender: gender,
      dob: dob,
      joining_date: joiningDate,
      emergency_name: emergencyName || 'Emergency Contact',
      emergency_phone: emergencyPhone || phone,
      address: address || undefined,
      source: leadSource,
      assigned_trainer_id: assignedTrainerId,
      assigned_trainer_name: assignedTr?.name,
      fitness_goals: selectedGoals,
      preferred_workout_time: workoutShift,
      health_notes: healthNotes
        ? `${healthNotes} | Height: ${heightCm}cm, Weight: ${weightKg}kg (Target: ${targetWeightKg}kg, ${targetTimeline})`
        : `Initial Weight: ${weightKg}kg, Target: ${targetWeightKg}kg (${targetTimeline})`,
    })

    // 2. Assign Selected Membership Plan
    if (selectedPlan) {
      assignMembership(newMember.id, selectedPlan.id)
    }

    // 3. Record Initial Payment Invoice if paid amount > 0
    const amtPaid = Number(paidRupees) || 0
    if (amtPaid > 0 && generateInvoice) {
      const disc = Number(discountRupees) || 0
      const finalRupees = Math.max(0, planPriceRupees - disc)
      const dueRupees = Math.max(0, finalRupees - amtPaid)

      recordPayment({
        member_id: newMember.id,
        member_name: newMember.full_name,
        amount_paise: planPriceRupees * 100,
        discount_paise: disc * 100,
        tax_paise: Math.round(planPriceRupees * 0.18 * 100),
        final_paise: finalRupees * 100,
        paid_paise: amtPaid * 100,
        due_paise: dueRupees * 100,
        payment_method: paymentMode,
        notes: `Registration & initial plan fee for ${selectedPlan?.name}`,
      })
    }

    showToast(`Member ${fullName} registered with full measurements & membership!`)
    resetForm()
    onClose()
  }

  const steps = [
    { num: 1, title: 'Basic Info', icon: User },
    { num: 2, title: 'Body & Goals', icon: Ruler },
    { num: 3, title: 'Plan & Trainer', icon: Award },
    { num: 4, title: 'Billing & GST', icon: CreditCard },
  ]

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" description="">
      <div className="space-y-6 text-white max-h-[85vh] overflow-y-auto pr-1">
        {/* Header Title Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#FF1E3D]/20 border border-[#FF1E3D]/50 flex items-center justify-center text-[#FF1E3D]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Register New Athlete Member
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FF1E3D]/20 text-[#FF1E3D] border border-[#FF1E3D]/40 whitespace-nowrap shrink-0">
                  ADVANCED REGISTRATION
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Full body measurement, target fitness goals, trainer assignment & GST invoice</p>
            </div>
          </div>
        </div>

        {/* STEPPER TABS BAR */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#0D0F17] p-1.5 rounded-2xl border border-slate-800">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = activeTab === step.num
            const isCompleted = activeTab > step.num
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveTab(step.num)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-black transition-all min-w-0 ${
                  isActive
                    ? 'bg-[#FF1E3D] text-white shadow-[0_0_15px_rgba(255,30,61,0.4)]'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.num}</span>
              </button>
            )
          })}
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="min-h-[320px]">
          {/* STEP 1: BASIC & CONTACT INFO */}
          {activeTab === 1 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">
                    Full Name <span className="text-[#FF1E3D]">*</span>
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="bg-slate-900 border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">
                    Mobile Number (+91) <span className="text-[#FF1E3D]">*</span>
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98250 12345"
                    className="bg-slate-900 border-slate-700 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@example.com"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold text-xs"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Date of Birth</label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Joining Date</label>
                  <Input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Emergency Contact Name</label>
                  <Input
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma (Father)"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Emergency Phone</label>
                  <Input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98250 99999"
                    className="bg-slate-900 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Residential Address</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: BODY MEASUREMENTS & TARGET GOALS */}
          {activeTab === 2 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {/* BMI Auto-Calculation Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141722] to-[#0D0F17] border border-[#FF1E3D]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FF1E3D]/15 border border-[#FF1E3D]/40 flex items-center justify-center text-[#FF1E3D]">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Calculated Body Mass Index (BMI)</span>
                    <span className="text-[11px] text-slate-400 font-medium">Height: {heightCm} cm • Weight: {weightKg} kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-[#FF1E3D] block">{bmiVal}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal Fit' : bmiVal < 30 ? 'Overweight' : 'Obese Tier'}
                  </span>
                </div>
              </div>

              {/* Grid: Core Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-300 block mb-1 uppercase tracking-wider">Height (cm)</label>
                  <Input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-300 block mb-1 uppercase tracking-wider">Current Weight (kg)</label>
                  <Input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-300 block mb-1 uppercase tracking-wider">Target Weight (kg)</label>
                  <Input
                    type="number"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-300 block mb-1 uppercase tracking-wider">Body Fat %</label>
                  <Input
                    type="number"
                    value={bodyFatPct}
                    onChange={(e) => setBodyFatPct(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Detailed Circumference Measurements */}
              <div className="p-4 rounded-2xl bg-[#0D0F17] border border-slate-800 space-y-3">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5 text-[#FF1E3D]" />
                  Body Circumference Log (cm)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Chest</label>
                    <Input
                      type="number"
                      value={chestCm}
                      onChange={(e) => setChestCm(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Waist</label>
                    <Input
                      type="number"
                      value={waistCm}
                      onChange={(e) => setWaistCm(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Arms / Biceps</label>
                    <Input
                      type="number"
                      value={armsCm}
                      onChange={(e) => setArmsCm(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Thighs</label>
                    <Input
                      type="number"
                      value={thighsCm}
                      onChange={(e) => setThighsCm(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Hips</label>
                    <Input
                      type="number"
                      value={hipsCm}
                      onChange={(e) => setHipsCm(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Fitness Goal Selection Chips */}
              <div>
                <label className="text-xs font-black text-slate-300 block mb-2 uppercase tracking-wider">
                  Target Fitness Goals (Multi-Select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map((goal) => {
                    const isSel = selectedGoals.includes(goal)
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                          isSel
                            ? 'bg-[#FF1E3D] text-white border-[#FF1E3D] shadow-[0_0_10px_rgba(255,30,61,0.3)]'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {goal}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Medical & Health Notes */}
              <div>
                <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">
                  Medical History & Health Restrictions
                </label>
                <Input
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="e.g. Lower back pain history, Hypertension, Egg allergy"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: PLAN & TRAINER SELECTION */}
          {activeTab === 3 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-300 block mb-2 uppercase tracking-wider">
                  Select Membership Tier Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plans.map((p) => {
                    const isSel = selectedPlanId === p.id
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSel
                            ? 'bg-[#FF1E3D]/15 border-[#FF1E3D] shadow-[0_0_20px_rgba(255,30,61,0.25)]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-white">{p.name}</span>
                          <span className="font-mono font-black text-sm text-[#FF1E3D]">
                            ₹{(p.price_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-1 font-medium">
                          Duration: {p.duration_value} {p.duration_unit}
                        </span>
                        {p.pt_included && (
                          <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full mt-2">
                            Personal Trainer Included
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">
                  Assign Personal Trainer
                </label>
                <select
                  value={assignedTrainerId}
                  onChange={(e) => setAssignedTrainerId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold text-xs"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">
                  Preferred Workout Shift
                </label>
                <select
                  value={workoutShift}
                  onChange={(e) => setWorkoutShift(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold text-xs"
                >
                  <option value="Morning (06:00 AM - 09:00 AM)">Morning Shift (06:00 AM - 09:00 AM)</option>
                  <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon Shift (12:00 PM - 03:00 PM)</option>
                  <option value="Evening (05:00 PM - 09:00 PM)">Evening Beast Mode (05:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* STEP 4: BILLING & GST INVOICE */}
          {activeTab === 4 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0D0F17] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Base Plan Price ({selectedPlan?.name}):</span>
                  <span className="text-white font-mono">₹{planPriceRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                  <span className="text-slate-400">GST (18% Included):</span>
                  <span className="text-emerald-400 font-mono">₹{Math.round(planPriceRupees * 0.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Discount Applied (₹)</label>
                  <Input
                    type="number"
                    value={discountRupees}
                    onChange={(e) => setDiscountRupees(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Initial Payment Collected (₹)</label>
                  <Input
                    type="number"
                    value={paidRupees}
                    onChange={(e) => setPaidRupees(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white font-mono font-bold text-[#FF1E3D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-300 block mb-1 uppercase tracking-wider">Payment Channel</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold text-xs"
                >
                  <option value="upi">UPI / QR Scan Payment</option>
                  <option value="cash">Cash Counter Collection</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <input
                  type="checkbox"
                  id="genInv"
                  checked={generateInvoice}
                  onChange={(e) => setGenerateInvoice(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#FF1E3D] cursor-pointer"
                />
                <label htmlFor="genInv" className="text-xs font-bold text-slate-200 cursor-pointer">
                  Auto-generate & Print 100% GST Official Receipt Invoice
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {activeTab > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab((prev) => prev - 1)}
              className="border-slate-700 text-white gap-1.5 font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Step</span>
            </Button>
          ) : (
            <div />
          )}

          {activeTab < 4 ? (
            <Button
              type="button"
              onClick={() => setActiveTab((prev) => prev + 1)}
              className="brand-btn-gradient text-white font-black gap-1.5"
            >
              <span>Next Step</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveMember}
              className="brand-btn-gradient text-white font-black gap-2 shadow-[0_0_20px_rgba(255,30,61,0.4)]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save & Complete Registration</span>
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  )
}
