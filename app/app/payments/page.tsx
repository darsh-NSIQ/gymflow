'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Receipt, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

const selectCls =
  'w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring'

export default function PaymentsPage() {
  const { payments, members, recordPayment } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

  const [memberId, setMemberId] = useState(members[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('upi')

  const filteredPayments = payments.filter(
    (p) =>
      p.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const canSubmit = Boolean(memberId) && Number(amount) > 0

  const submit = () => {
    if (!canSubmit) return
    const m = members.find((mem) => mem.id === memberId)
    const amtPaise = rupeesToPaise(Number(amount))
    recordPayment({
      member_id: memberId,
      member_name: m?.full_name || 'Member',
      paid_paise: amtPaise,
      final_paise: amtPaise,
      payment_method: method,
    })
    setAmount('')
    setIsRecordModalOpen(false)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Payments</h1>
          <p className="text-xs text-muted-foreground mt-1">Collections, payment modes and outstanding dues</p>
        </div>
        <Button size="sm" onClick={() => setIsRecordModalOpen(true)} className="gap-1.5 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Record payment</span>
        </Button>
      </div>

      <Card className="p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number or member"
            aria-label="Search payments"
            className="pl-9"
          />
        </div>
      </Card>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No payments match your search.
                  </td>
                </tr>
              )}
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-foreground whitespace-nowrap">{p.invoice_number}</td>
                  <td className="px-4 py-3 font-bold text-foreground">{p.member_name}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.payment_date.split('T')[0]}</td>
                  <td className="px-4 py-3 uppercase text-muted-foreground font-semibold text-[10px]">
                    {p.payment_method.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">{formatCurrency(p.paid_paise)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href="/app/invoices">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Receipt className="h-3.5 w-3.5" />
                        <span>Invoice</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredPayments.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No payments match your search.</Card>
        )}
        {filteredPayments.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{p.member_name}</p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">{p.invoice_number}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">Amount</span>
                <span className="font-bold text-foreground whitespace-nowrap">{formatCurrency(p.paid_paise)}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">Mode</span>
                <span className="font-semibold text-foreground uppercase">{p.payment_method.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">Date</span>
                <span className="font-semibold text-foreground">{p.payment_date.split('T')[0]}</span>
              </div>
            </div>
            <Link href="/app/invoices" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <Receipt className="h-3.5 w-3.5" /> View invoice
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record payment"
        description="An invoice is issued as soon as you save."
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" onClick={submit} disabled={!canSubmit}>
              Save &amp; issue invoice
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="pay-member" className="text-xs font-semibold mb-1 block">
              Member
            </label>
            <select id="pay-member" value={memberId} onChange={(e) => setMemberId(e.target.value)} className={selectCls}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pay-amount" className="text-xs font-semibold mb-1 block">
              Amount received (₹)
            </label>
            <Input
              id="pay-amount"
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="pay-method" className="text-xs font-semibold mb-1 block">
              Payment mode
            </label>
            <select
              id="pay-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
              className={selectCls}
            >
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
              <option value="card">Card (POS)</option>
              <option value="bank_transfer">Bank transfer / NEFT</option>
            </select>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
