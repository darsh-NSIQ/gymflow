'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'

const selectCls =
  'w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring'

export default function DietPage() {
  const { diets, members, gym, saveDietPlan, showToast } = useApp()
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? '')

  const [calories, setCalories] = useState('2400')
  const [protein, setProtein] = useState('160')
  const [carbs, setCarbs] = useState('250')
  const [fat, setFat] = useState('65')
  const [water, setWater] = useState('3')

  const canSave = Boolean(selectedMemberId) && Number(calories) > 0

  const handleSave = () => {
    if (!canSave) return
    const member = members.find((m) => m.id === selectedMemberId)
    saveDietPlan({
      id: `dt_${Date.now()}`,
      gym_id: gym.id,
      member_id: selectedMemberId,
      member_name: member?.full_name || 'Member',
      calories_target: Number(calories),
      protein_g: Number(protein),
      carbs_g: Number(carbs),
      fat_g: Number(fat),
      water_liters: Number(water),
      meals: [],
    })
    showToast(`Diet targets saved for ${member?.full_name ?? 'member'}.`)
  }

  const macroField = (label: string, value: string, set: (v: string) => void, id: string) => (
    <div>
      <label htmlFor={id} className="text-[11px] font-semibold mb-1 block">
        {label}
      </label>
      <Input id={id} type="number" inputMode="numeric" min={0} value={value} onChange={(e) => set(e.target.value)} />
    </div>
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Diet plans</h1>
          <p className="text-xs text-muted-foreground mt-1">Daily calorie and macro targets per member</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={!canSave} className="gap-1.5 w-full sm:w-auto">
          <Check className="h-4 w-4" />
          <span>Save targets</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 lg:col-span-1 space-y-4">
          <h2 className="text-base sm:text-lg font-bold">Set targets</h2>
          <div>
            <label htmlFor="diet-member" className="text-xs font-semibold mb-1 block">
              Member
            </label>
            <select id="diet-member" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className={selectCls}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="diet-cal" className="text-xs font-semibold mb-1 block">
              Daily calories (kcal)
            </label>
            <Input id="diet-cal" type="number" inputMode="numeric" min={0} value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
            {macroField('Protein (g)', protein, setProtein, 'diet-protein')}
            {macroField('Carbs (g)', carbs, setCarbs, 'diet-carbs')}
            {macroField('Fat (g)', fat, setFat, 'diet-fat')}
            {macroField('Water (L)', water, setWater, 'diet-water')}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:col-span-2 space-y-4">
          <h2 className="text-base sm:text-lg font-bold">Current plans ({diets.length})</h2>
          {diets.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No diet plans yet. Set targets on the left to create one.</p>}
          <div className="space-y-3 sm:space-y-4">
            {diets.map((d) => (
              <div key={d.id} className="p-3.5 sm:p-4 rounded-xl border border-border bg-muted/20 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground">{d.member_name}</h3>
                  <span className="font-bold text-primary whitespace-nowrap">{d.calories_target} kcal / day</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center p-2.5 sm:p-3 rounded-lg bg-card border border-border">
                  <div>
                    <span className="block text-muted-foreground text-[10px] sm:text-xs">Protein</span>
                    <span className="font-bold">{d.protein_g}g</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-[10px] sm:text-xs">Carbs</span>
                    <span className="font-bold">{d.carbs_g}g</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-[10px] sm:text-xs">Fat</span>
                    <span className="font-bold">{d.fat_g}g</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-[10px] sm:text-xs">Water</span>
                    <span className="font-bold">{d.water_liters}L</span>
                  </div>
                </div>
                {d.meals.length > 0 && (
                  <div className="space-y-1.5">
                    {d.meals.map((m) => (
                      <div key={m.name} className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-border/70">
                        <div className="min-w-0">
                          <span className="font-bold text-foreground block">
                            {m.name} <span className="text-muted-foreground font-normal">· {m.time}</span>
                          </span>
                          <span className="text-muted-foreground break-words">{m.items.join(', ')}</span>
                        </div>
                        <span className="font-mono font-semibold whitespace-nowrap shrink-0">{m.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
