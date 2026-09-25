'use client'

import React, { useState } from 'react'
import {
  Zap,
  MessageSquare,
  Mail,
  Bell,
  Check,
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  Dumbbell,
  Apple,
  TrendingUp,
  Wrench,
  Gift,
  Send,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import { AutomationRule } from '@/lib/types'

export default function AutomationsPage() {
  const { automations, toggleAutomation, showToast } = useApp()
  const [activeTab, setActiveTab] = useState<'rules' | 'types' | 'builder'>('rules')
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)

  // Builder state
  const [ruleName, setRuleName] = useState('')
  const [selectedTrigger, setSelectedTrigger] = useState('membership_expires_7_days')
  const [condition, setCondition] = useState('Days remaining <= 7')
  const [channel, setChannel] = useState<'in_app' | 'email' | 'whatsapp' | 'sms'>('whatsapp')
  const [template, setTemplate] = useState(
    'Hi {{member_name}}, your {{membership_name}} at {{gym_name}} expires on {{expiry_date}}. Renew today to avoid interruption!'
  )

  const reminderTypesCategories = [
    {
      category: '1. Membership Reminders',
      icon: Calendar,
      color: 'border-red-500/30 text-red-500',
      items: [
        { trigger: 'membership_expires_30_days', label: 'Expiry in 30 Days', desc: 'Early renewal awareness alert' },
        { trigger: 'membership_expires_15_days', label: 'Expiry in 15 Days', desc: 'Mid-month renewal notification' },
        { trigger: 'membership_expires_7_days', label: 'Expiry in 7 Days', desc: 'Urgent renewal prompt' },
        { trigger: 'membership_expires_3_days', label: 'Expiry in 3 Days', desc: 'High priority reminder' },
        { trigger: 'membership_expires_tomorrow', label: 'Expiry Tomorrow', desc: 'Final day warning' },
        { trigger: 'membership_expired', label: 'Membership Expired', desc: 'Grace period notice & offer' },
      ],
    },
    {
      category: '2. Payment & Invoice Reminders',
      icon: DollarSign,
      color: 'border-amber-500/30 text-amber-500',
      items: [
        { trigger: 'payment_due', label: 'Payment Due Date', desc: 'Subscription payment due today' },
        { trigger: 'payment_overdue', label: 'Payment Overdue', desc: 'Unpaid fee reminder after due date' },
        { trigger: 'partial_payment_pending', label: 'Partial Dues Pending', desc: 'Balance collection reminder' },
      ],
    },
    {
      category: '3. Attendance & Inactivity Alerts',
      icon: AlertTriangle,
      color: 'border-emerald-500/30 text-emerald-500',
      items: [
        { trigger: 'member_absent_3_days', label: '3 Days Absent', desc: 'Gentle check-in reminder' },
        { trigger: 'member_absent_7_days', label: '7 Days Absent', desc: 'Trainer follow-up alert' },
        { trigger: 'member_absent_14_days', label: '14 Days Absent', desc: 'Retention risk warning' },
        { trigger: 'member_absent_30_days', label: '30 Days Inactive', desc: 'Win-back campaign' },
      ],
    },
    {
      category: '4. Workout & Diet Reminders',
      icon: Dumbbell,
      color: 'border-indigo-500/30 text-indigo-500',
      items: [
        { trigger: 'workout_reminder', label: 'Daily Workout Plan', desc: 'Today exercise checklist alert' },
        { trigger: 'workout_plan_expired', label: 'Workout Plan Expired', desc: 'Trainer routine update due' },
        { trigger: 'meal_reminder', label: 'Meal Timing Alert', desc: 'Pre/post workout nutrition reminder' },
        { trigger: 'diet_review_due', label: 'Diet Review Due', desc: 'Weekly macro evaluation' },
      ],
    },
    {
      category: '5. Personal Training (PT)',
      icon: Zap,
      color: 'border-purple-500/30 text-purple-500',
      items: [
        { trigger: 'pt_session_reminder', label: 'PT Session Upcoming', desc: '1 hour before PT session' },
        { trigger: 'pt_session_followup', label: 'PT Follow-up', desc: 'Post session feedback' },
      ],
    },
    {
      category: '6. Progress & Body Measurements',
      icon: TrendingUp,
      color: 'border-sky-500/30 text-sky-500',
      items: [
        { trigger: 'monthly_measurement_due', label: 'Monthly Measurement', desc: 'Weight & waist check-in' },
        { trigger: 'progress_photo_reminder', label: 'Progress Photo Due', desc: 'Before/after transformation update' },
      ],
    },
    {
      category: '7. Gym Equipment & Operations',
      icon: Wrench,
      color: 'border-rose-500/30 text-rose-500',
      items: [
        { trigger: 'equipment_maintenance_due', label: 'Equipment Maintenance', desc: 'Machinery service alert' },
        { trigger: 'warranty_expiry', label: 'Warranty Expiry', desc: 'Equipment warranty ending' },
        { trigger: 'license_expiry', label: 'Document/License Expiry', desc: 'Gym trade license renewal' },
      ],
    },
    {
      category: '8. Celebrations & Campaigns',
      icon: Gift,
      color: 'border-pink-500/30 text-pink-500',
      items: [
        { trigger: 'member_birthday', label: 'Member Birthday', desc: 'Automated birthday wish + gift pass' },
        { trigger: 'gym_anniversary', label: 'Gym Anniversary', desc: 'Special promo campaign' },
        { trigger: 'festival_campaign', label: 'Festival Offer', desc: 'Diwali/New Year renewal discount' },
      ],
    },
  ]

  const handleCreateRule = () => {
    if (!ruleName) return
    showToast(`Created new automation rule: "${ruleName}"`)
    setIsBuilderOpen(false)
    setRuleName('')
  }

  const handleTestRule = (rule: AutomationRule) => {
    showToast(`Fired test trigger for "${rule.name}" via ${rule.action_channel.toUpperCase()}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Automation & Reminder Engine</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure automated WhatsApp, Email, SMS & In-App triggers for members and operations
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsBuilderOpen(true)}
          className="brand-btn-gradient text-white gap-1.5 font-extrabold shadow-soft-md hover:scale-105 transition-transform"
        >
          <Plus className="h-4 w-4" />
          <span>Create Automation Rule</span>
        </Button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'rules'
              ? 'brand-btn-gradient text-white shadow-soft-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Active Rules ({automations.length})
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'types'
              ? 'brand-btn-gradient text-white shadow-soft-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Supported Reminder Types (20+)
        </button>
      </div>

      {/* 1. Active Automation Rules View */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {automations.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-foreground">{rule.name}</h2>
                    <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-primary/20 text-primary-softText border border-primary/40">
                      Channel: {rule.action_channel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    WHEN <strong className="text-foreground">{rule.trigger}</strong> IF{' '}
                    <strong className="text-foreground">{rule.condition}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleTestRule(rule)} className="text-xs gap-1 font-semibold">
                    <Send className="h-3.5 w-3.5 text-primary" />
                    <span>Test Rule</span>
                  </Button>

                  <button
                    onClick={() => toggleAutomation(rule.id)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    {rule.enabled ? (
                      <span className="text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3.5 py-1.5 rounded-full">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold bg-slate-800 text-slate-400 border border-slate-700 px-3.5 py-1.5 rounded-full">
                        DISABLED
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Template Editor Box */}
              <div className="mt-4 p-4 rounded-xl bg-card/90 text-xs font-mono text-foreground border border-border/80">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1.5">
                  Message Template:
                </span>
                {rule.template}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 2. All Supported Reminder Types Grid */}
      {activeTab === 'types' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-xs text-muted-foreground flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0" />
            <span>
              GymFlow supports <strong className="text-foreground">20+ automated reminder triggers</strong> across memberships, payments, attendance, workouts, nutrition, PT, equipment maintenance, and marketing campaigns.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reminderTypesCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Card key={cat.category} className="p-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-border mb-4">
                    <div className={`p-2.5 rounded-xl border ${cat.color} bg-card`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-foreground">{cat.category}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {cat.items.map((item) => (
                      <div
                        key={item.trigger}
                        className="p-3 rounded-xl border border-border bg-card/60 flex items-center justify-between text-xs hover:border-primary/40 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-foreground block">{item.label}</span>
                          <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTrigger(item.trigger)
                            setRuleName(`Rule for ${item.label}`)
                            setIsBuilderOpen(true)
                          }}
                          className="text-[11px] font-bold text-primary hover:text-primary hover:bg-primary/20"
                        >
                          + Use Trigger
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* AUTOMATION BUILDER DIALOG */}
      <Dialog
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title="Create Custom Automation Rule"
        description="Configure trigger condition, action channel, and message variables."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Rule Title *</label>
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g. 7 Days Expiring WhatsApp Alert"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">WHEN Trigger</label>
            <select
              value={selectedTrigger}
              onChange={(e) => setSelectedTrigger(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-xs font-bold"
            >
              {reminderTypesCategories.flatMap((c) =>
                c.items.map((i) => (
                  <option key={i.trigger} value={i.trigger}>
                    [{c.category.split('.')[1]?.trim()}] {i.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">CONDITION Expression</label>
            <Input value={condition} onChange={(e) => setCondition(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">THEN Action Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-xs font-bold"
            >
              <option value="whatsapp">Send WhatsApp Message</option>
              <option value="email">Send Email Receipt / Alert</option>
              <option value="in_app">Push In-App System Notification</option>
              <option value="sms">Send SMS Text</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">
              Message Template (Variables: {'{{member_name}}'}, {'{{expiry_date}}'}, {'{{amount_due}}'})
            </label>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-md border border-input bg-card text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>Cancel</Button>
            <Button className="brand-btn-gradient text-white font-extrabold" onClick={handleCreateRule}>
              Save & Activate Rule
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
