'use client'

import React, { useState } from 'react'
import { FileText, Plus, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

export default function ExpensesPage() {
  const { expenses, addExpense, gym } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [category, setCategory] = useState('Rent')
  const [amount, setAmount] = useState('85000')
  const [vendor, setVendor] = useState('Satellite Complex')

  const totalExpensePaise = expenses.reduce((sum, e) => sum + e.amount_paise, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Expense Register</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track gym operating overheads: rent, electricity, maintenance, marketing, and salary payouts
          </p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 shadow-soft-sm">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </div>

      <Card className="p-5 bg-rose-50 border-rose-200">
        <span className="text-xs text-rose-800 font-semibold block">Total Monthly Overhead Expenses</span>
        <span className="text-3xl font-extrabold text-rose-700 block mt-1">{formatCurrency(totalExpensePaise, '₹')}</span>
      </Card>

      <div className="rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Vendor / Payee</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 font-bold text-foreground">{e.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                <td className="px-4 py-3 text-foreground font-medium">{e.vendor}</td>
                <td className="px-4 py-3 text-right font-bold text-rose-600">{formatCurrency(e.amount_paise, '₹')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Operating Expense"
        description="Log vendor payments and operational costs."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Category</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Rent / Electricity / Equipment" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Amount in INR (₹)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Vendor Name</label>
            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                addExpense({
                  category,
                  amount_paise: rupeesToPaise(Number(amount)),
                  vendor,
                })
                setIsModalOpen(false)
              }}
            >
              Save Expense
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
