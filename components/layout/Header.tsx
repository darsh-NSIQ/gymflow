'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building2,
  UserCheck,
  Bell,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { useApp } from '@/lib/context'
import { UserRole } from '@/lib/types'

export function Header() {
  const { gym, branches, activeBranchId, setActiveBranchId, currentUser, setCurrentUserByRole, notifications } = useApp()
  const unreadCount = notifications.filter((n) => !n.read).length

  const rolesList: { role: UserRole; name: string }[] = [
    { role: 'owner', name: 'Gym Owner' },
    { role: 'branch_manager', name: 'Branch Manager' },
    { role: 'receptionist', name: 'Receptionist' },
    { role: 'trainer', name: 'Trainer' },
    { role: 'nutritionist', name: 'Nutritionist' },
    { role: 'accountant', name: 'Accountant' },
    { role: 'member', name: 'Member' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-border shadow-soft-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Branding & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/app/dashboard" className="flex items-center gap-3.5 group">
            {/* Logo image container matching brand design */}
            <div className="relative h-11 w-11 rounded-xl bg-black border border-primary/50 p-1 shadow-[0_0_15px_rgba(255,30,61,0.3)] flex items-center justify-center group-hover:scale-105 transition-transform duration-fast">
              <img
                src={gym.logo_url || '/logo.png'}
                alt={gym.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-[#FFFFFF] text-lg tracking-tight block group-hover:text-primary transition-colors">
                {gym.name}
              </span>
            </div>
          </Link>

          {/* Branch Switcher */}
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-border">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-muted text-foreground text-xs font-bold rounded-xl px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Persona Switcher, Notifications, Portal Link */}
        <div className="flex items-center gap-3">
          {/* Member Portal Shortcut */}
          <Link
            href="/portal"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-primary/15 text-primary-softText border border-primary/30 px-3.5 py-1.5 rounded-full hover:bg-primary/25 transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            <span>Member Portal</span>
          </Link>

          {/* Role Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-muted/80 border border-border px-3 py-1.5 rounded-xl text-xs font-semibold">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="hidden lg:inline text-muted-foreground">Role:</span>
            <select
              value={currentUser.role}
              onChange={(e) => setCurrentUserByRole(e.target.value as UserRole)}
              className="bg-transparent text-foreground font-bold cursor-pointer focus:outline-none"
            >
              {rolesList.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notification bell */}
          <Link
            href="/app/notifications"
            className="relative p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4.5 w-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,30,61,0.6)] animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-border">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-primary/40 bg-slate-800">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.full_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-foreground block leading-none">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-0.5">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
