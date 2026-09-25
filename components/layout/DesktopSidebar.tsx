'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/lib/context'
import { cn } from '@/lib/utils'
import { getVisibleNavGroups, isNavItemActive } from '@/lib/navigation'

export function DesktopSidebar() {
  const pathname = usePathname()
  const { currentUser } = useApp()
  const groups = getVisibleNavGroups(currentUser.role)

  return (
    <aside className="w-60 lg:w-64 shrink-0 hidden md:block bg-card/90 border-r border-border h-[calc(100dvh-4rem)] overflow-y-auto sticky top-16 p-3 shadow-soft-xs">
      <nav aria-label="Sidebar" className="space-y-6 py-2">
        {groups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <h4 className="px-3 text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">
              {group.groupName}
            </h4>
            <div className="space-y-0.5 mt-1">
              {group.items.map((item) => {
                const isActive = isNavItemActive(pathname, item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-base ease-standard',
                      isActive
                        ? 'brand-btn-gradient text-white shadow-[0_4px_15px_rgba(255,30,61,0.35)]'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-muted-foreground')} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold bg-white text-primary px-1.5 py-0.5 rounded-md uppercase shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
