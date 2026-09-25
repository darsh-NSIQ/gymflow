'use client'

import React, { useState } from 'react'
import { Printer, Download, Receipt, Building2, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/context'
import { formatCurrency, paiseToRupees } from '@/lib/money'

export default function InvoicesPage() {
  const { gym, payments } = useApp()
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(payments[0]?.id || '')

  const currentInvoice = payments.find((p) => p.id === selectedInvoiceId) || payments[0]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Invoices &amp; receipts</h1>
          <p className="text-xs text-muted-foreground mt-1">
            GST tax invoices with CGST and SGST breakup for every payment
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 w-full sm:w-auto">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 shadow-soft-sm w-full sm:w-auto">
            <Download className="h-4 w-4" />
            <span>Save as PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Selector Sidebar */}
        <div className="lg:col-span-1 no-print flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x">
          <h2 className="text-sm font-bold text-foreground">Recent receipts</h2>
          {payments.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedInvoiceId(p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedInvoiceId(p.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all shrink-0 w-[240px] lg:w-auto snap-start ${
                selectedInvoiceId === p.id
                  ? 'border-primary bg-primary-soft/50 shadow-soft-sm font-bold'
                  : 'border-border bg-card hover:bg-accent'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-foreground truncate">{p.invoice_number}</span>
                <span className="text-xs font-bold text-primary">{formatCurrency(p.paid_paise, '₹')}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between gap-2">
                <span className="truncate">{p.member_name}</span>
                <span>{p.payment_date.split('T')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Printable Tax Invoice Container */}
        <Card glass={false} className="lg:col-span-2 p-4 sm:p-8 bg-white text-slate-900 border border-slate-200 shadow-soft-lg print:shadow-none print:border-none print:p-0">
          {currentInvoice ? (
            <div className="space-y-6">
              {/* Header: Gym Logo & Business Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <img
                    src={gym.logo_url || '/logo.png'}
                    alt={gym.name}
                    className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 object-contain rounded-xl border border-slate-200 p-1"
                  />
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">{gym.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{gym.address}, {gym.city}, {gym.state}</p>
                    <p className="text-xs text-slate-500 break-words">Phone: {gym.phone} · {gym.email}</p>
                    {gym.gst_registered && (
                      <p className="text-xs font-bold text-indigo-700 mt-1">GSTIN: {gym.gstin}</p>
                    )}
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg mb-1">
                    TAX INVOICE
                  </span>
                  <span className="block font-mono text-sm font-extrabold text-slate-900">{currentInvoice.invoice_number}</span>
                  <span className="text-xs text-slate-500 block">Date: {currentInvoice.payment_date.split('T')[0]}</span>
                </div>
              </div>

              {/* Billed To Member Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Billed To Member</span>
                  <span className="font-extrabold text-sm text-slate-900 block">{currentInvoice.member_name}</span>
                  <span className="text-slate-600 block">Collected By: {currentInvoice.collected_by}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Payment Mode</span>
                  <span className="font-bold text-slate-900 uppercase block">{currentInvoice.payment_method}</span>
                  <span className="text-slate-500 font-mono text-[11px] block">{currentInvoice.transaction_ref || 'N/A'}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[520px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Base Amount</th>
                    <th className="py-2.5 px-3 text-right">CGST ({gym.cgst_rate}%)</th>
                    <th className="py-2.5 px-3 text-right">SGST ({gym.sgst_rate}%)</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Gym membership fee</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(currentInvoice.amount_paise, '₹')}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(Math.round(currentInvoice.tax_paise / 2), '₹')}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(Math.round(currentInvoice.tax_paise / 2), '₹')}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">{formatCurrency(currentInvoice.final_paise, '₹')}</td>
                  </tr>
                </tbody>
              </table>
              </div>

              {/* Invoice Totals */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(currentInvoice.amount_paise, '₹')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({gym.cgst_rate + gym.sgst_rate}%):</span>
                    <span>{formatCurrency(currentInvoice.tax_paise, '₹')}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-900 pt-2">
                    <span>Amount Paid:</span>
                    <span className="text-emerald-700">{formatCurrency(currentInvoice.paid_paise, '₹')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-6 border-t border-slate-200 text-center text-[11px] text-slate-500">
                <p className="font-semibold text-slate-700">Thank you for training with {gym.name}!</p>
                <p>This is a computer-generated tax invoice and does not need a signature.</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-10">No invoice selected.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
