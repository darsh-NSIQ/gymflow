'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/money'

const inventoryItems = [
  { id: 'inv_1', name: 'Whey Isolate Protein 2kg', category: 'Supplements', stock: 14, reorder: 5, price: 540000 },
  { id: 'inv_2', name: 'Creatine Monohydrate 250g', category: 'Supplements', stock: 3, reorder: 5, price: 120000 },
  { id: 'inv_3', name: 'Shaker Bottle 700ml', category: 'Accessories', stock: 28, reorder: 10, price: 35000 },
]

export default function InventoryPage() {
  const lowStock = inventoryItems.filter((i) => i.stock <= i.reorder)

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Inventory</h1>
        <p className="text-xs text-muted-foreground mt-1">Supplements and accessories sold at reception</p>
      </div>

      {lowStock.length > 0 && (
        <Card className="p-4 bg-warning border-warning-text/20 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning-text shrink-0 mt-0.5" />
          <p className="text-sm text-warning-text">
            <span className="font-bold">{lowStock.length} item{lowStock.length > 1 ? 's' : ''}</span> at or below reorder level:{' '}
            {lowStock.map((i) => i.name).join(', ')}.
          </p>
        </Card>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Selling price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inventoryItems.map((item) => {
              const low = item.stock <= item.reorder
              return (
                <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`font-extrabold ${low ? 'text-warning-text' : 'text-success-text'}`}>
                      {item.stock} units{low ? ' · reorder' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground whitespace-nowrap">{formatCurrency(item.price)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {inventoryItems.map((item) => {
          const low = item.stock <= item.reorder
          return (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className="font-bold text-foreground whitespace-nowrap">{formatCurrency(item.price)}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Stock</span>
                <span className={`font-extrabold ${low ? 'text-warning-text' : 'text-success-text'}`}>
                  {item.stock} units{low ? ' · reorder' : ''}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
