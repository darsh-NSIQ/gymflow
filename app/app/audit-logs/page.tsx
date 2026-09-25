'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/lib/context'

const fmt = (iso: string) => `${iso.split('T')[0]} ${iso.split('T')[1]?.slice(0, 8) ?? ''}`

export default function AuditLogsPage() {
  const { auditLogs } = useApp()

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Audit log</h1>
        <p className="text-xs text-muted-foreground mt-1">Staff actions, payment collections and membership changes</p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground font-sans">
                    No activity recorded yet.
                  </td>
                </tr>
              )}
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(log.timestamp)}</td>
                  <td className="px-4 py-3 font-bold text-foreground font-sans">{log.user_name}</td>
                  <td className="px-4 py-3 font-bold text-primary">{log.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.entity_id}</td>
                  <td className="px-4 py-3 text-foreground font-sans">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {auditLogs.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No activity recorded yet.</Card>
        )}
        {auditLogs.map((log) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-xs font-bold text-primary break-all">{log.action}</span>
              <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">{fmt(log.timestamp)}</span>
            </div>
            <p className="text-sm font-bold text-foreground mt-2">{log.user_name}</p>
            {log.details && <p className="text-xs text-muted-foreground mt-1 break-words">{log.details}</p>}
            <p className="text-[10px] font-mono text-muted-foreground mt-2 break-all">{log.entity_id}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
