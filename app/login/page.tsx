'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'
import { UserRole } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const { gym, setCurrentUserByRole, showToast } = useApp()
  const [email, setEmail] = useState('owner@gymflow.com')
  const [password, setPassword] = useState('••••••••')
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentUserByRole(selectedRole)
    showToast(`Logged in as ${selectedRole.toUpperCase()}`)

    if (selectedRole === 'member') {
      router.push('/portal')
    } else if (selectedRole === 'trainer') {
      router.push('/app/trainer-dashboard')
    } else {
      router.push('/app/dashboard')
    }
  }

  const quickRoles: { role: UserRole; name: string; email: string }[] = [
    { role: 'owner', name: 'Gym Owner', email: 'owner@gymflow.com' },
    { role: 'branch_manager', name: 'Manager', email: 'manager@gymflow.com' },
    { role: 'receptionist', name: 'Receptionist', email: 'reception@gymflow.com' },
    { role: 'trainer', name: 'Trainer', email: 'trainer@gymflow.com' },
    { role: 'member', name: 'Member', email: 'member@gymflow.com' },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-card border border-border p-2 shadow-soft-sm flex items-center justify-center">
          <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-full w-full object-contain" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground tracking-tight">
          Welcome back to {gym.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to access your role-based dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-soft-xl border border-border rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                Select Persona Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickRoles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.role)
                      setEmail(r.email)
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                      selectedRole === r.role
                        ? 'border-primary bg-primary-soft text-primary-softText font-bold shadow-soft-xs'
                        : 'border-border bg-card text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="block font-bold truncate">{r.name}</span>
                    <span className="text-[10px] opacity-70 block truncate">{r.role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary" defaultChecked />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-primary font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-11 text-base shadow-soft-md gap-2">
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Don't have a gym workspace yet?{' '}
            <Link href="/onboarding" className="font-bold text-primary hover:underline">
              Launch Onboarding Wizard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
