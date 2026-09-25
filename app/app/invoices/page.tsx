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
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Tax Invoices & Receipts</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate 100% GST-compliant tax receipts with CGST, SGST, and business details
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 shadow-soft-sm">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Selector Sidebar */}
        <div className="lg:col-span-1 space-y-3 no-print">
          <h2 className="text-sm font-bold text-foreground">Select Recent Receipt</h2>
          {payments.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedInvoiceId(p.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedInvoiceId === p.id
                  ? 'border-primary bg-primary-soft/50 shadow-soft-sm font-bold'
                  : 'border-border bg-card hover:bg-accent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">{p.invoice_number}</span>
                <span className="text-xs font-bold text-primary">{formatCurrency(p.paid_paise, '₹')}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{p.member_name}</span>
                <span>{p.payment_date.split('T')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Printable Tax Invoice Container */}
        <Card className="lg:col-span-2 p-8 bg-white text-slate-900 border border-slate-200 shadow-soft-lg print:shadow-none print:border-none print:p-0">
          {currentInvoice ? (
            <div className="space-y-6">
              {/* Header: Gym Logo & Business Info */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={gym.logo_url || '/logo.png'}
                    alt={gym.name}
                    className="h-16 w-16 object-contain rounded-xl border border-slate-200 p-1"
                  />
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{gym.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{gym.address}, {gym.city}, {gym.state}</p>
                    <p className="text-xs text-slate-500">Phone: {gym.phone} | Email: {gym.email}</p>
                    {gym.gst_registered && (
                      <p className="text-xs font-bold text-indigo-700 mt-1">GSTIN: {gym.gstin}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg mb-1">
                    TAX INVOICE
                  </span>
                  <span className="block font-mono text-sm font-extrabold text-slate-900">{currentInvoice.invoice_number}</span>
                  <span className="text-xs text-slate-500 block">Date: {currentInvoice.payment_date.split('T')[0]}</span>
                </div>
              </div>

              {/* Billed To Member Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Billed To Member</span>
                  <span className="font-extrabold text-sm text-slate-900 block">{currentInvoice.member_name}</span>
                  <span className="text-slate-600 block">Collected By: {currentInvoice.collected_by}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Payment Mode</span>
                  <span className="font-bold text-slate-900 uppercase block">{currentInvoice.payment_method}</span>
                  <span className="text-slate-500 font-mono text-[11px] block">{currentInvoice.transaction_ref || 'N/A'}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Base Amount</th>
                    <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                    <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Gym Membership Subscription Fee</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(currentInvoice.amount_paise, '₹')}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(Math.round(currentInvoice.tax_paise / 2), '₹')}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(Math.round(currentInvoice.tax_paise / 2), '₹')}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">{formatCurrency(currentInvoice.final_paise, '₹')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Invoice Totals */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(currentInvoice.amount_paise, '₹')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total GST Tax (18%):</span>
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
                <p>Look Good Feel Great • This is a computer-generated tax invoice.</p>
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
