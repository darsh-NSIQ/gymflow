'use client'

import React, { useState } from 'react'
import { Apple, Check, Plus, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'

export default function DietPage() {
  const { diets, members, saveDietPlan, showToast } = useApp()
  const [selectedMemberId, setSelectedMemberId] = useState('mem_01')

  const [calories, setCalories] = useState('2400')
  const [protein, setProtein] = useState('160')
  const [carbs, setCarbs] = useState('250')
  const [fat, setFat] = useState('65')

  const handleSave = () => {
    const member = members.find((m) => m.id === selectedMemberId)
    saveDietPlan({
      id: `dt_${Date.now()}`,
      gym_id: 'gym_01',
      member_id: selectedMemberId,
      member_name: member?.full_name || 'Member',
      calories_target: Number(calories),
      protein_g: Number(protein),
      carbs_g: Number(carbs),
      fat_g: Number(fat),
      water_liters: 4,
      meals: [
        { name: 'Breakfast', time: '08:30 AM', items: ['4 Egg Whites + 2 Whole Eggs', '100g Oats'], calories: 550, completed: true },
        { name: 'Lunch', time: '01:30 PM', items: ['150g Chicken / Paneer', '1.5 Cup Brown Rice'], calories: 650, completed: false },
      ],
    })
    showToast('Saved custom diet plan.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Diet & Nutrition Builder</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Calculate daily calorie targets and configure 7-meal daily nutrition plans
          </p>
        </div>
        <Button size="sm" onClick={handleSave} className="gap-1.5 shadow-soft-sm">
          <Check className="h-4 w-4" />
          <span>Save Diet Plan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold">Nutrition Calculator</h2>
          <div>
            <label className="text-xs font-semibold mb-1 block">Assign Member</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm font-semibold"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Daily Calorie Target (kcal)</label>
            <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-semibold mb-1 block">Protein (g)</label>
              <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-semibold mb-1 block">Carbs (g)</label>
              <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-semibold mb-1 block">Fat (g)</label>
              <Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Existing Diet Plans */}
        <Card className="p-6 md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Active Meal Plans</h2>
          <div className="space-y-4">
            {diets.map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">Diet Plan for {d.member_name}</h3>
                  <span className="font-bold text-primary">{d.calories_target} kcal / day</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-lg bg-card border border-border">
                  <div><span className="block text-muted-foreground">Protein</span><span className="font-bold">{d.protein_g}g</span></div>
                  <div><span className="block text-muted-foreground">Carbs</span><span className="font-bold">{d.carbs_g}g</span></div>
                  <div><span className="block text-muted-foreground">Fats</span><span className="font-bold">{d.fat_g}g</span></div>
                  <div><span className="block text-muted-foreground">Water</span><span className="font-bold">{d.water_liters}L</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
