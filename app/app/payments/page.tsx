'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Plus, Download, Receipt, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

export default function PaymentsPage() {
  const { payments, members, recordPayment, gym } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

  const [memberId, setMemberId] = useState('mem_01')
  const [amount, setAmount] = useState('2950')
  const [method, setMethod] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('upi')

  const filteredPayments = payments.filter((p) =>
    p.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Payment Register</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track membership payments, UPI transactions, cash collections, and outstanding dues
          </p>
        </div>
        <Button size="sm" onClick={() => setIsRecordModalOpen(true)} className="gap-1.5 shadow-soft-sm">
          <Plus className="h-4 w-4" />
          <span>Record New Payment</span>
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number or member name..."
            className="pl-9"
          />
        </div>
      </Card>

      <div className="rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
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
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-foreground">{p.invoice_number}</td>
                <td className="px-4 py-3 font-bold text-foreground">{p.member_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.payment_date.split('T')[0]}</td>
                <td className="px-4 py-3 uppercase text-muted-foreground font-semibold text-[10px]">{p.payment_method}</td>
                <td className="px-4 py-3 font-bold text-foreground">{formatCurrency(p.paid_paise, '₹')}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href="/app/invoices">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] gap-1">
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

      <Dialog
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Payment & Generate Invoice"
        description="Select member and payment mode."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Member</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Amount Received (₹)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm"
            >
              <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
              <option value="cash">Cash Collection</option>
              <option value="card">POS Credit/Debit Card</option>
              <option value="bank_transfer">Bank Transfer / NEFT</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsRecordModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                const m = members.find((mem) => mem.id === memberId)
                const amtPaise = rupeesToPaise(Number(amount))
                recordPayment({
                  member_id: memberId,
                  member_name: m?.full_name || 'Member',
                  paid_paise: amtPaise,
                  final_paise: amtPaise,
                  payment_method: method,
                })
                setIsRecordModalOpen(false)
              }}
            >
              Issue Invoice
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
