'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/context'
import { ALL_NAV_ITEMS, MOBILE_PRIMARY_HREFS, getVisibleNavGroups, isNavItemActive } from '@/lib/navigation'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { currentUser, branches, activeBranchId, setActiveBranchId } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  const primaryItems = MOBILE_PRIMARY_HREFS.map((href) => ALL_NAV_ITEMS.find((i) => i.href === href)).filter(
    (i): i is NonNullable<typeof i> => Boolean(i)
  )
  const groups = getVisibleNavGroups(currentUser.role)

  return (
    <>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="All modules">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative bg-card rounded-t-2xl border-t border-border shadow-soft-xl max-h-[85dvh] flex flex-col z-10 animate-in slide-in-from-bottom duration-fast">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">All modules</h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 space-y-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <label className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 h-12">
                <Building2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-muted-foreground shrink-0">Branch</span>
                <select
                  aria-label="Active branch"
                  value={activeBranchId}
                  onChange={(e) => setActiveBranchId(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-foreground text-sm font-bold focus:outline-none truncate"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>

              {groups.map((group) => (
                <div key={group.groupName}>
                  <h4 className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">
                    {group.groupName}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = isNavItemActive(pathname, item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-2.5 p-3 min-h-[52px] rounded-xl border transition-colors',
                            active
                              ? 'border-primary/50 bg-primary-soft text-foreground'
                              : 'border-border bg-muted/40 hover:bg-primary-soft hover:border-primary/30'
                          )}
                        >
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-xs font-semibold text-foreground leading-tight">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-soft-lg px-1 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] grid grid-cols-5"
      >
        {primaryItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-all',
                isActive ? 'text-primary font-bold bg-primary-soft' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] leading-none">{item.label === 'Dashboard' ? 'Home' : item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          className="flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] leading-none">More</span>
        </button>
      </nav>
    </>
  )
}
