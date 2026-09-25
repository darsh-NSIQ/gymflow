'use client'

import React, { useState } from 'react'
import { Settings, Image as ImageIcon, ShieldCheck, Check, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'
import { ROLE_PERMISSIONS } from '@/lib/permissions'

export default function SettingsPage() {
  const { gym, updateGymSettings, showToast } = useApp()

  const [gymName, setGymName] = useState(gym.name)
  const [logoUrl, setLogoUrl] = useState(gym.logo_url)
  const [phone, setPhone] = useState(gym.phone)
  const [email, setEmail] = useState(gym.email)
  const [gstin, setGstin] = useState(gym.gstin || '')
  const [primaryColor, setPrimaryColor] = useState(gym.primary_color)
  const [graceDays, setGraceDays] = useState(String(gym.grace_days))

  const handleSave = () => {
    updateGymSettings({
      name: gymName,
      logo_url: logoUrl,
      phone,
      email,
      gstin,
      primary_color: primaryColor,
      grace_days: Number(graceDays),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Admin Gym Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure branding, tax GSTIN details, grace days, and role permission matrices
          </p>
        </div>
        <Button size="sm" onClick={handleSave} className="gap-1.5 shadow-soft-sm">
          <Save className="h-4 w-4" />
          <span>Save All Settings</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branding & Business Config */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <h2 className="text-lg font-bold">Gym Branding & Profile</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1 block">Gym Business Name</label>
              <Input value={gymName} onChange={(e) => setGymName(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Logo Image URL / Path</label>
              <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Contact Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Contact Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">GSTIN Number</label>
              <Input value={gstin} onChange={(e) => setGstin(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Expired Grace Access (Days)</label>
              <Input type="number" value={graceDays} onChange={(e) => setGraceDays(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Live Logo Preview Box */}
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Branding Live Preview</span>
          <div className="h-28 w-28 rounded-2xl bg-card border-2 border-primary/30 p-2 shadow-soft-md flex items-center justify-center">
            <img src={logoUrl || '/logo.png'} alt="Logo Preview" className="h-full w-full object-contain" />
          </div>
          <span className="font-extrabold text-base text-foreground">{gymName}</span>
          <span className="text-xs text-muted-foreground">GSTIN: {gstin || 'Not Configured'}</span>
        </Card>
      </div>

      {/* Role Permission Matrix Card */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-1">Role-Based Access Control (RBAC Matrix)</h2>
        <p className="text-xs text-muted-foreground mb-4">View exact server-enforced permissions for each persona role.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3">Permission Key</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Receptionist</th>
                <th className="px-4 py-3">Trainer</th>
                <th className="px-4 py-3">Accountant</th>
                <th className="px-4 py-3">Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {[
                'members.view',
                'members.create',
                'memberships.manage',
                'attendance.manage',
                'payments.create',
                'workout.manage',
                'reports.view',
                'settings.manage',
              ].map((perm) => (
                <tr key={perm} className="hover:bg-accent/40">
                  <td className="px-4 py-2.5 font-bold text-foreground font-sans">{perm}</td>
                  <td className="px-4 py-2.5 text-emerald-600 font-bold">✓ YES</td>
                  <td className="px-4 py-2.5">{ROLE_PERMISSIONS.branch_manager.includes(perm as any) ? '✓ YES' : '—'}</td>
                  <td className="px-4 py-2.5">{ROLE_PERMISSIONS.receptionist.includes(perm as any) ? '✓ YES' : '—'}</td>
                  <td className="px-4 py-2.5">{ROLE_PERMISSIONS.trainer.includes(perm as any) ? '✓ YES' : '—'}</td>
                  <td className="px-4 py-2.5">{ROLE_PERMISSIONS.accountant.includes(perm as any) ? '✓ YES' : '—'}</td>
                  <td className="px-4 py-2.5">{ROLE_PERMISSIONS.member.includes(perm as any) ? '✓ YES' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
