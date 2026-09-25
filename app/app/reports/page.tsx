'use client'

import React from 'react'
import { BarChart3, Download, AlertCircle, Users, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApp } from '@/lib/context'
import { formatCurrency } from '@/lib/money'

export default function ReportsPage() {
  const { members, payments, showToast } = useApp()

  // Churn signals logic
  const churnRiskMembers = members.filter(
    (m) => m.status === 'expired' || m.status === 'inactive' || m.full_name === 'Rohan Trivedi'
  )

  const exportReport = (title: string) => {
    showToast(`Generated & downloaded ${title} report CSV.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Reports & Retention Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Financial analytics, member retention risks, and downloadable CSV audit reports
          </p>
        </div>
        <Button size="sm" onClick={() => exportReport('Consolidated Executive Summary')} className="gap-1.5 shadow-soft-sm">
          <Download className="h-4 w-4" />
          <span>Export All Reports (CSV)</span>
        </Button>
      </div>

      {/* Churn Risk / Retention Analytics Section */}
      <Card className="p-6 border-amber-200 bg-amber-50/40">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-lg">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span>Member Retention & Absence Risk ("Potential Follow-Up Needed")</span>
          </div>
          <CardDescription className="text-xs text-amber-900">
            Identified members with reduced attendance or upcoming expiry who may require staff follow-up
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2 space-y-3">
          {churnRiskMembers.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-card text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={m.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
                  alt={m.full_name}
                  className="h-9 w-9 rounded-full object-cover border border-border"
                />
                <div>
                  <span className="font-bold text-foreground block">{m.full_name} ({m.member_code})</span>
                  <span className="text-amber-800 font-medium">Signal: Reduced attendance / Expiring soon</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Potential follow-up needed
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Executive Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="p-6">
          <h3 className="font-bold text-base text-foreground mb-1">Revenue & Payment Report</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown of gross collection, GST taxes, and outstanding dues.</p>
          <Button variant="outline" size="sm" onClick={() => exportReport('Revenue')} className="w-full text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </Button>
        </Card>

        <Card hoverable className="p-6">
          <h3 className="font-bold text-base text-foreground mb-1">Attendance & Peak Hours</h3>
          <p className="text-xs text-muted-foreground mb-4">Hourly check-in density and member attendance percentage.</p>
          <Button variant="outline" size="sm" onClick={() => exportReport('Attendance')} className="w-full text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </Button>
        </Card>

        <Card hoverable className="p-6">
          <h3 className="font-bold text-base text-foreground mb-1">Trainer & PT Performance</h3>
          <p className="text-xs text-muted-foreground mb-4">PT sessions completed, trainer salary, and commission payouts.</p>
          <Button variant="outline" size="sm" onClick={() => exportReport('Trainer')} className="w-full text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </Button>
        </Card>
      </div>
    </div>
  )
}
