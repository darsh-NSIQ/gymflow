'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { useApp } from '@/lib/context'
import { formatCurrency, rupeesToPaise } from '@/lib/money'

export default function ExpensesPage() {
  const { expenses, addExpense } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [vendor, setVendor] = useState('')

  const totalExpensePaise = expenses.reduce((sum, e) => sum + e.amount_paise, 0)
  const canSave = category.trim().length > 0 && Number(amount) > 0

  const save = () => {
    if (!canSave) return
    addExpense({ category: category.trim(), amount_paise: rupeesToPaise(Number(amount)), vendor: vendor.trim() })
    setCategory('')
    setAmount('')
    setVendor('')
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Expenses</h1>
          <p className="text-xs text-muted-foreground mt-1">Rent, electricity, maintenance, marketing and salaries</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Add expense</span>
        </Button>
      </div>

      <Card className="p-4 sm:p-5 bg-danger border-danger-text/20">
        <span className="text-xs text-danger-text font-semibold block">Total recorded expenses</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-danger-text block mt-1 whitespace-nowrap">
          {formatCurrency(totalExpensePaise)}
        </span>
      </Card>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Vendor / payee</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No expenses recorded yet.
                </td>
              </tr>
            )}
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 font-bold text-foreground">{e.category}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{e.date}</td>
                <td className="px-4 py-3 text-foreground font-medium">{e.vendor}</td>
                <td className="px-4 py-3 text-right font-bold text-danger-text whitespace-nowrap">{formatCurrency(e.amount_paise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {expenses.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No expenses recorded yet.</Card>
        )}
        {expenses.map((e) => (
          <Card key={e.id} className="p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{e.category}</p>
              <p className="text-xs text-muted-foreground truncate">{e.vendor || '—'}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{e.date}</p>
            </div>
            <span className="font-bold text-danger-text whitespace-nowrap">{formatCurrency(e.amount_paise)}</span>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add expense"
        footer={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" onClick={save} disabled={!canSave}>
              Save expense
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="exp-category" className="text-xs font-semibold mb-1 block">
              Category
            </label>
            <Input
              id="exp-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Rent, electricity, equipment…"
            />
          </div>
          <div>
            <label htmlFor="exp-amount" className="text-xs font-semibold mb-1 block">
              Amount (₹)
            </label>
            <Input
              id="exp-amount"
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="exp-vendor" className="text-xs font-semibold mb-1 block">
              Vendor / payee
            </label>
            <Input id="exp-vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Optional" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
