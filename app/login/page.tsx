'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'
import { UserRole } from '@/lib/types'

const quickRoles: { role: UserRole; name: string; email: string }[] = [
  { role: 'owner', name: 'Owner', email: 'owner@powerfitnesszone.com' },
  { role: 'branch_manager', name: 'Manager', email: 'manager@powerfitnesszone.com' },
  { role: 'receptionist', name: 'Reception', email: 'reception@powerfitnesszone.com' },
  { role: 'trainer', name: 'Trainer', email: 'trainer@powerfitnesszone.com' },
  { role: 'accountant', name: 'Accounts', email: 'accounts@powerfitnesszone.com' },
  { role: 'member', name: 'Member', email: 'member@powerfitnesszone.com' },
]

export default function LoginPage() {
  const router = useRouter()
  const { gym, setCurrentUserByRole, showToast } = useApp()
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner')
  const [email, setEmail] = useState(quickRoles[0].email)
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentUserByRole(selectedRole)
    showToast(`Signed in as ${quickRoles.find((r) => r.role === selectedRole)?.name ?? selectedRole}`)
    if (selectedRole === 'member') router.push('/portal')
    else if (selectedRole === 'trainer') router.push('/app/trainer-dashboard')
    else router.push('/app/dashboard')
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full sm:mx-auto sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground min-h-[44px]">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </div>

      <div className="w-full sm:mx-auto sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-black border border-primary/40 p-2 flex items-center justify-center">
          <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-full w-full object-contain" />
        </div>
        <h1 className="mt-4 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">{gym.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Staff and member sign-in</p>
      </div>

      <div className="mt-6 w-full sm:mx-auto sm:max-w-md">
        <div className="bg-card py-6 px-4 sm:py-8 sm:px-8 border border-border rounded-2xl shadow-soft-xl">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <span className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">I am signing in as</span>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Role">
                {quickRoles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    role="radio"
                    aria-checked={selectedRole === r.role}
                    onClick={() => {
                      setSelectedRole(r.role)
                      setEmail(r.email)
                    }}
                    className={`min-h-[44px] px-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedRole === r.role
                        ? 'border-primary bg-primary-soft text-primary-softText'
                        : 'border-border bg-card text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-foreground mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base gap-2">
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Members: your QR card and plan are in the{' '}
            <Link href="/portal" className="font-bold text-primary hover:underline">
              Member Portal
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
