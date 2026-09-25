'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, Building, Image as ImageIcon, MapPin, Phone, Clock, DollarSign, CreditCard, UserPlus, Bell, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useApp } from '@/lib/context'

export default function OnboardingPage() {
  const router = useRouter()
  const { gym, updateGymSettings, showToast } = useApp()
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    gymName: gym.name || 'The Power Fitness Zone',
    logoUrl: gym.logo_url || '/logo.png',
    address: gym.address || 'Plot 42, Fitness Avenue',
    city: gym.city || 'Ahmedabad',
    state: gym.state || 'Gujarat',
    phone: gym.phone || '+91 98765 43210',
    email: gym.email || 'contact@powerfitnesszone.com',
    openingHours: gym.opening_hours || '06:00 AM - 10:00 PM',
    currency: 'INR',
    gstRegistered: true,
    gstin: '24AAACG1234F1Z5',
    planName: 'Monthly Gold',
    planPrice: '2500',
    trainerName: 'Rajesh Kumar',
    trainerPhone: '+91 98250 44444',
  })

  const steps = [
    { num: 1, title: 'Gym Name', icon: Building },
    { num: 2, title: 'Branding Logo', icon: ImageIcon },
    { num: 3, title: 'Location Address', icon: MapPin },
    { num: 4, title: 'Contact Info', icon: Phone },
    { num: 5, title: 'Opening Hours', icon: Clock },
    { num: 6, title: 'Currency & GST', icon: DollarSign },
    { num: 7, title: 'Initial Plans', icon: CreditCard },
    { num: 8, title: 'Add Trainers', icon: UserPlus },
    { num: 9, title: 'Notifications', icon: Bell },
    { num: 10, title: 'Finish Setup', icon: CheckCircle },
  ]

  const handleFinish = () => {
    updateGymSettings({
      name: formData.gymName,
      logo_url: formData.logoUrl,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      phone: formData.phone,
      email: formData.email,
      opening_hours: formData.openingHours,
      currency: formData.currency,
      gst_registered: formData.gstRegistered,
      gstin: formData.gstin,
    })
    showToast(`Setup complete. Welcome to ${formData.gymName}.`)
    router.push('/app/dashboard')
  }

  return (
    <div className="min-h-dvh bg-background py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
            <Building className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Gym setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep} of {steps.length} · {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden sm:hidden" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={currentStep}>
            <div className="h-full bg-primary transition-all" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
          </div>
          <div className="hidden sm:flex items-center justify-between gap-1">
            {steps.map((s) => (
              <button
                type="button"
                key={s.num}
                onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                className="flex flex-col items-center min-w-0 flex-1"
                aria-current={currentStep === s.num ? 'step' : undefined}
              >
                <div
                  className={`h-9 w-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    currentStep === s.num
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : currentStep > s.num
                      ? 'bg-success text-success-text'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground mt-1 truncate max-w-full">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Card */}
        <Card className="p-4 sm:p-8 shadow-soft-lg">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Gym name</h2>
              <p className="text-xs text-muted-foreground">The name printed on invoices, member cards and the portal.</p>
              <div>
                <label className="text-xs font-semibold mb-1 block">Gym Name</label>
                <Input
                  value={formData.gymName}
                  onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                  placeholder="e.g. The Power Fitness Zone"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Logo</h2>
              <p className="text-xs text-muted-foreground">Shown on member cards, receipts and the dashboard.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-dashed border-border rounded-xl bg-muted/40">
                <div className="h-16 w-16 shrink-0 rounded-xl bg-card border border-border p-2 flex items-center justify-center">
                  <img src={formData.logoUrl} alt="Logo preview" className="h-full w-full object-contain" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <Input
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="/logo.png or image URL"
                  />
                  <span className="text-[11px] text-muted-foreground">Path or image URL</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold mb-1 block">Street Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Phone Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">Email Address</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Opening hours</h2>
              <div>
                <label className="text-xs font-semibold mb-1 block">Daily Timings</label>
                <Input
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Currency &amp; GST</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Currency</label>
                  <Input value="INR (₹)" disabled />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">GSTIN Number</label>
                  <Input
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">First membership plan</h2>
              <div className="p-4 border border-border rounded-xl bg-muted/30 space-y-3">
                <Input
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  placeholder="Plan name"
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  value={formData.planPrice}
                  onChange={(e) => setFormData({ ...formData, planPrice: e.target.value })}
                  placeholder="Price in ₹"
                />
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">First trainer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Trainer Name</label>
                  <Input
                    value={formData.trainerName}
                    onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">Trainer Phone</label>
                  <Input
                    value={formData.trainerPhone}
                    onChange={(e) => setFormData({ ...formData, trainerPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold">Reminders</h2>
              <div className="space-y-1 text-sm font-medium">
                <label className="flex items-center gap-3 min-h-[44px]">
                  <input type="checkbox" className="h-5 w-5 accent-[#FF1E3D]" defaultChecked /> In-app alerts
                </label>
                <label className="flex items-center gap-3 min-h-[44px]">
                  <input type="checkbox" className="h-5 w-5 accent-[#FF1E3D]" defaultChecked /> WhatsApp expiry reminders
                </label>
                <label className="flex items-center gap-3 min-h-[44px]">
                  <input type="checkbox" className="h-5 w-5 accent-[#FF1E3D]" defaultChecked /> Email invoice receipts
                </label>
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="space-y-4 text-center py-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-success text-success-text flex items-center justify-center">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">All set</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                <strong className="text-foreground">{formData.gymName}</strong> is ready. You can change any of this later in Settings.
              </p>
            </div>
          )}

          {/* Navigation controls */}
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2 pt-5 border-t border-border mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="gap-1.5 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < 10 ? (
              <Button onClick={() => setCurrentStep((prev) => prev + 1)} className="gap-1.5 w-full sm:w-auto">
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="gap-1.5 w-full sm:w-auto">
                <span>Open dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
