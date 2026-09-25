'use client'

import React, { useState } from 'react'
import { User, Ruler, Award, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, HeartPulse } from 'lucide-react'
import { Dialog } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

interface AddMemberAdvancedModalProps {
  isOpen: boolean
  onClose: () => void
}

const selectCls =
  'w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring'
const labelCls = 'text-xs font-bold text-muted-foreground block mb-1 uppercase tracking-wider'

const GOAL_OPTIONS = ['Fat loss', 'Muscle gain', 'Strength', 'Cardio & HIIT', 'General fitness', 'Endurance', 'Flexibility']
const SHIFTS = ['Morning (06:00 – 09:00)', 'Afternoon (12:00 – 15:00)', 'Evening (17:00 – 21:00)']
const SOURCES = ['Walk-in', 'Referral', 'Instagram', 'Google', 'Other']

const STEPS = [
  { num: 1, title: 'Details', icon: User },
  { num: 2, title: 'Body & goals', icon: Ruler },
  { num: 3, title: 'Plan & trainer', icon: Award },
  { num: 4, title: 'Payment', icon: CreditCard },
]

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function AddMemberAdvancedModal({ isOpen, onClose }: AddMemberAdvancedModalProps) {
  const { gym, plans, trainers, addMember, assignMembership, recordPayment, showToast } = useApp()
  const today = new Date().toISOString().split('T')[0]

  const [step, setStep] = useState(1)

  // Step 1
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')
  const [dob, setDob] = useState('')
  const [joiningDate, setJoiningDate] = useState(today)
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [address, setAddress] = useState('')
  const [leadSource, setLeadSource] = useState(SOURCES[0])

  // Step 2
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [targetWeightKg, setTargetWeightKg] = useState('')
  const [bodyFatPct, setBodyFatPct] = useState('')
  const [waistCm, setWaistCm] = useState('')
  const [chestCm, setChestCm] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [healthNotes, setHealthNotes] = useState('')

  // Step 3
  const activePlans = plans.filter((p) => p.status === 'active')
  const [selectedPlanId, setSelectedPlanId] = useState(activePlans[0]?.id ?? '')
  const [assignedTrainerId, setAssignedTrainerId] = useState('')
  const [workoutShift, setWorkoutShift] = useState(SHIFTS[0])

  // Step 4
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)
  const planPriceRupees = selectedPlan ? selectedPlan.price_paise / 100 : 0
  const gstPct = gym.gst_registered ? gym.cgst_rate + gym.sgst_rate : 0
  const [discountRupees, setDiscountRupees] = useState('0')
  const [paidRupees, setPaidRupees] = useState('')
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'card' | 'bank_transfer'>('upi')

  const baseAfterDiscount = Math.max(0, planPriceRupees - (Number(discountRupees) || 0))
  const gstRupees = Math.round((baseAfterDiscount * gstPct) / 100)
  const totalRupees = baseAfterDiscount + gstRupees
  const paid = Number(paidRupees) || 0
  const dueRupees = Math.max(0, totalRupees - paid)

  const heightM = Number(heightCm) / 100
  const bmi = heightM > 0 && Number(weightKg) > 0 ? Math.round((Number(weightKg) / (heightM * heightM)) * 10) / 10 : null

  const step1Valid = fullName.trim().length > 1 && phone.replace(/\D/g, '').length >= 10

  const toggleGoal = (goal: string) => setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))

  const reset = () => {
    setStep(1)
    setFullName('')
    setPhone('')
    setEmail('')
    setDob('')
    setEmergencyName('')
    setEmergencyPhone('')
    setAddress('')
    setHeightCm('')
    setWeightKg('')
    setTargetWeightKg('')
    setBodyFatPct('')
    setWaistCm('')
    setChestCm('')
    setSelectedGoals([])
    setHealthNotes('')
    setDiscountRupees('0')
    setPaidRupees('')
  }

  const next = () => {
    if (step === 1 && !step1Valid) {
      showToast('Name and a valid mobile number are required.')
      return
    }
    setStep((s) => Math.min(4, s + 1))
  }

  const save = () => {
    if (!step1Valid) {
      setStep(1)
      showToast('Name and a valid mobile number are required.')
      return
    }
    const trainer = trainers.find((t) => t.id === assignedTrainerId)
    const measurements = [
      heightCm && `Height ${heightCm} cm`,
      weightKg && `Weight ${weightKg} kg`,
      targetWeightKg && `Target ${targetWeightKg} kg`,
      bodyFatPct && `Body fat ${bodyFatPct}%`,
      waistCm && `Waist ${waistCm} cm`,
      chestCm && `Chest ${chestCm} cm`,
    ]
      .filter(Boolean)
      .join(', ')

    const newMember = addMember({
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gender,
      dob,
      joining_date: joiningDate,
      emergency_name: emergencyName.trim(),
      emergency_phone: emergencyPhone.trim() || phone.trim(),
      address: address.trim() || undefined,
      source: leadSource,
      assigned_trainer_id: trainer?.id,
      assigned_trainer_name: trainer?.name,
      fitness_goals: selectedGoals,
      preferred_workout_time: workoutShift,
      health_notes: [healthNotes.trim(), measurements].filter(Boolean).join(' | '),
    })

    if (selectedPlan) {
      assignMembership(newMember.id, selectedPlan.id)
      if (paid > 0) {
        recordPayment({
          member_id: newMember.id,
          member_name: newMember.full_name,
          amount_paise: rupeesToPaise(planPriceRupees),
          discount_paise: rupeesToPaise(Number(discountRupees) || 0),
          tax_paise: rupeesToPaise(gstRupees),
          final_paise: rupeesToPaise(totalRupees),
          paid_paise: rupeesToPaise(paid),
          due_paise: rupeesToPaise(dueRupees),
          payment_method: paymentMode,
          notes: `Joining fee · ${selectedPlan.name}`,
        })
      }
    }

    showToast(`${fullName.trim()} registered${selectedPlan ? ` on ${selectedPlan.name}` : ''}.`)
    reset()
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Register member"
      description={`Step ${step} of 4 · ${STEPS[step - 1].title}`}
      maxWidth="max-w-2xl"
      footer={
        <>
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-1.5 w-full sm:w-auto">
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancel
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={next} className="brand-btn-gradient text-white font-bold gap-1.5 w-full sm:w-auto">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={save} className="brand-btn-gradient text-white font-bold gap-2 w-full sm:w-auto">
              <CheckCircle2 className="h-4 w-4" />
              <span>Save member</span>
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        {/* Stepper */}
        <div className="grid grid-cols-4 gap-1 bg-muted/60 p-1 rounded-xl border border-border" role="tablist" aria-label="Registration steps">
          {STEPS.map((s) => {
            const Icon = s.icon
            const active = step === s.num
            const done = step > s.num
            return (
              <button
                key={s.num}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => (done || s.num === step ? setStep(s.num) : step1Valid && setStep(s.num))}
                className={`flex items-center justify-center gap-1.5 min-h-[40px] px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all min-w-0 ${
                  active ? 'bg-primary text-white' : done ? 'bg-success text-success-text' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.num}</span>
              </button>
            )
          })}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="am-name" label="Full name *">
                <Input id="am-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className="font-bold" />
              </Field>
              <Field id="am-phone" label="Mobile *">
                <Input id="am-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98250 00000" className="font-mono" />
              </Field>
              <Field id="am-email" label="Email">
                <Input id="am-email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" />
              </Field>
              <Field id="am-gender" label="Gender">
                <select id="am-gender" value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} className={selectCls}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field id="am-dob" label="Date of birth">
                <Input id="am-dob" type="date" max={today} value={dob} onChange={(e) => setDob(e.target.value)} />
              </Field>
              <Field id="am-join" label="Joining date">
                <Input id="am-join" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
              </Field>
              <Field id="am-em-name" label="Emergency contact">
                <Input id="am-em-name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Name (relation)" />
              </Field>
              <Field id="am-em-phone" label="Emergency phone">
                <Input id="am-em-phone" type="tel" inputMode="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="font-mono" />
              </Field>
              <Field id="am-source" label="How did they hear about us?">
                <select id="am-source" value={leadSource} onChange={(e) => setLeadSource(e.target.value)} className={selectCls}>
                  {SOURCES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field id="am-address" label="Address">
                <Input id="am-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Optional" autoComplete="street-address" />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-primary/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block">BMI</span>
                  <span className="text-[11px] text-muted-foreground">{bmi ? `From ${heightCm} cm · ${weightKg} kg` : 'Enter height and weight'}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-mono text-primary block">{bmi ?? '—'}</span>
                {bmi && (
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field id="am-h" label="Height (cm)">
                <Input id="am-h" type="number" inputMode="numeric" min={0} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="font-mono" />
              </Field>
              <Field id="am-w" label="Weight (kg)">
                <Input id="am-w" type="number" inputMode="decimal" min={0} step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="font-mono" />
              </Field>
              <Field id="am-tw" label="Target (kg)">
                <Input id="am-tw" type="number" inputMode="decimal" min={0} step="0.1" value={targetWeightKg} onChange={(e) => setTargetWeightKg(e.target.value)} className="font-mono" />
              </Field>
              <Field id="am-bf" label="Body fat %">
                <Input id="am-bf" type="number" inputMode="decimal" min={0} step="0.1" value={bodyFatPct} onChange={(e) => setBodyFatPct(e.target.value)} className="font-mono" placeholder="Optional" />
              </Field>
              <Field id="am-waist" label="Waist (cm)">
                <Input id="am-waist" type="number" inputMode="decimal" min={0} value={waistCm} onChange={(e) => setWaistCm(e.target.value)} className="font-mono" placeholder="Optional" />
              </Field>
              <Field id="am-chest" label="Chest (cm)">
                <Input id="am-chest" type="number" inputMode="decimal" min={0} value={chestCm} onChange={(e) => setChestCm(e.target.value)} className="font-mono" placeholder="Optional" />
              </Field>
            </div>

            <div>
              <span className={labelCls}>Goals</span>
              <div className="flex flex-wrap gap-2">
                {GOAL_OPTIONS.map((goal) => {
                  const sel = selectedGoals.includes(goal)
                  return (
                    <button
                      key={goal}
                      type="button"
                      aria-pressed={sel}
                      onClick={() => toggleGoal(goal)}
                      className={`px-3 min-h-[40px] rounded-full text-xs font-bold transition-all border ${
                        sel ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {goal}
                    </button>
                  )
                })}
              </div>
            </div>

            <Field id="am-health" label="Health notes / injuries">
              <Input id="am-health" value={healthNotes} onChange={(e) => setHealthNotes(e.target.value)} placeholder="e.g. lower back pain, hypertension" />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className={labelCls}>Membership plan</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
                {activePlans.map((p) => {
                  const sel = selectedPlanId === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${sel ? 'bg-primary-soft border-primary' : 'bg-card border-border hover:border-primary/40'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm text-foreground leading-snug">{p.name}</span>
                        <span className="font-mono font-black text-sm text-primary whitespace-nowrap">{formatCurrency(p.price_paise)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-1">
                        {p.duration_value} {p.duration_unit}
                        {p.freeze_allowed ? ` · freeze ${p.freeze_days} d` : ''}
                      </span>
                      {p.pt_included && (
                        <span className="inline-block text-[10px] font-bold text-success-text bg-success px-2 py-0.5 rounded-full mt-2">
                          {p.pt_sessions_count} PT sessions
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="am-trainer" label="Trainer">
                <select id="am-trainer" value={assignedTrainerId} onChange={(e) => setAssignedTrainerId(e.target.value)} className={selectCls}>
                  <option value="">Assign later</option>
                  {trainers
                    .filter((t) => t.status === 'active')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} · {t.specialization}
                      </option>
                    ))}
                </select>
              </Field>
              <Field id="am-shift" label="Preferred slot">
                <select id="am-shift" value={workoutShift} onChange={(e) => setWorkoutShift(e.target.value)} className={selectCls}>
                  {SHIFTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground truncate">{selectedPlan?.name ?? 'No plan selected'}</span>
                <span className="font-mono text-foreground whitespace-nowrap">{formatCurrency(rupeesToPaise(planPriceRupees))}</span>
              </div>
              {Number(discountRupees) > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-mono text-success-text">− {formatCurrency(rupeesToPaise(Number(discountRupees)))}</span>
                </div>
              )}
              {gstPct > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    GST {gstPct}% (CGST {gym.cgst_rate}% + SGST {gym.sgst_rate}%)
                  </span>
                  <span className="font-mono text-foreground">{formatCurrency(rupeesToPaise(gstRupees))}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-border text-sm">
                <span className="text-foreground font-bold">Total</span>
                <span className="font-mono font-black text-foreground">{formatCurrency(rupeesToPaise(totalRupees))}</span>
              </div>
              {paid > 0 && dueRupees > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-warning-text">Balance due</span>
                  <span className="font-mono font-bold text-warning-text">{formatCurrency(rupeesToPaise(dueRupees))}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="am-disc" label="Discount (₹)">
                <Input id="am-disc" type="number" inputMode="numeric" min={0} value={discountRupees} onChange={(e) => setDiscountRupees(e.target.value)} className="font-mono" />
              </Field>
              <Field id="am-paid" label="Amount received now (₹)">
                <Input id="am-paid" type="number" inputMode="decimal" min={0} value={paidRupees} onChange={(e) => setPaidRupees(e.target.value)} className="font-mono font-bold" placeholder={String(totalRupees)} />
              </Field>
            </div>

            <Field id="am-mode" label="Payment mode">
              <select id="am-mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as typeof paymentMode)} className={selectCls}>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="card">Card (POS)</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </Field>

            <p className="text-[11px] text-muted-foreground">
              {paid > 0 ? 'An invoice is issued for the amount received. ' : 'Leave the amount empty to register without a payment. '}
              You can record the balance later from the Payments page.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  )
}
