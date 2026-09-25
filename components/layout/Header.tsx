'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, UserCheck, Bell, Smartphone } from 'lucide-react'
import { useApp } from '@/lib/context'
import { UserRole } from '@/lib/types'
import { ROLE_OPTIONS } from '@/lib/navigation'

export function Header() {
  const { gym, branches, activeBranchId, setActiveBranchId, currentUser, setCurrentUserByRole, notifications } = useApp()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-border shadow-soft-xs h-16">
      <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Left: brand + branch */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/app/dashboard" className="flex items-center gap-2.5 group min-w-0">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-black border border-primary/50 p-1 shadow-[0_0_15px_rgba(255,30,61,0.3)] flex items-center justify-center group-hover:scale-105 transition-transform duration-fast">
              <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-full w-full object-contain" />
            </div>
            <span className="font-extrabold text-foreground text-sm sm:text-lg tracking-tight truncate max-w-[34vw] sm:max-w-[260px] group-hover:text-primary transition-colors">
              {gym.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-2 pl-4 border-l border-border">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              aria-label="Active branch"
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-muted text-foreground text-xs font-bold rounded-xl px-3 h-9 border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer max-w-[220px] truncate"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: portal, role, bell, avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/portal"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold bg-primary/15 text-primary-softText border border-primary/30 px-3.5 h-9 rounded-full hover:bg-primary/25 transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            <span>Member Portal</span>
          </Link>

          <label className="flex items-center gap-1.5 bg-muted/80 border border-border pl-2 pr-1 sm:px-3 h-10 rounded-xl text-xs font-semibold">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="hidden lg:inline text-muted-foreground">Role:</span>
            <select
              aria-label="Switch role"
              value={currentUser.role}
              onChange={(e) => setCurrentUserByRole(e.target.value as UserRole)}
              className="bg-transparent text-foreground font-bold cursor-pointer focus:outline-none h-full max-w-[96px] sm:max-w-none truncate text-xs"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <Link
            href="/app/notifications"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            className="relative h-10 w-10 inline-flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,30,61,0.6)]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2.5 sm:pl-2 sm:border-l border-border">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-primary/40 bg-muted shrink-0">
              <img
                src={currentUser.avatar_url || '/logo.png'}
                alt={currentUser.full_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <span className="text-xs font-bold text-foreground block leading-none truncate max-w-[140px]">
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
