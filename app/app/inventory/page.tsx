'use client'

import React from 'react'
import { Package, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/lib/context'
import { formatCurrency } from '@/lib/money'

export default function InventoryPage() {
  const inventoryItems = [
    { id: 'inv_1', name: 'Whey Isolate Protein 2kg', category: 'Supplements', stock: 14, reorder: 5, price: 540000 },
    { id: 'inv_2', name: 'Creatine Monohydrate 250g', category: 'Supplements', stock: 3, reorder: 5, price: 120000 },
    { id: 'inv_3', name: 'Gym Flow Shaker Bottle', category: 'Accessories', stock: 28, reorder: 10, price: 35000 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Supplement & Item Inventory</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage gym product stock, selling prices, and automated low-stock alerts
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock Level</th>
              <th className="px-4 py-3 text-right">Selling Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inventoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 font-bold text-foreground">{item.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`font-extrabold ${item.stock <= item.reorder ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {item.stock} Units {item.stock <= item.reorder && '(Low Stock Alert)'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-foreground">{formatCurrency(item.price, '₹')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
