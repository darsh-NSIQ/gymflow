'use client'

import React from 'react'
import { ShieldCheck, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/lib/context'

export default function AuditLogsPage() {
  const { auditLogs } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Audit Trail & Security Logs</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Immutable audit trail for all staff actions, payment collections, and membership modifications
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User & Persona</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity ID</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{log.timestamp.split('T')[0]} {log.timestamp.split('T')[1]?.slice(0, 8)}</td>
                <td className="px-4 py-3 font-bold text-foreground font-sans">{log.user_name}</td>
                <td className="px-4 py-3 font-bold text-primary">{log.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.entity_id}</td>
                <td className="px-4 py-3 text-foreground font-sans">{log.details || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
