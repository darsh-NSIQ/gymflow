'use client'

import React, { useMemo, useState } from 'react'
import { Plus, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

type Entry = { memberId: string; date: string; weight: number; height: number; bodyFat?: number; waist?: number }

const selectCls =
  'w-full h-11 sm:h-10 px-3 rounded-md border border-input bg-card text-base sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring'

export default function ProgressPage() {
  const { members, showToast } = useApp()
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? '')
  const [entries, setEntries] = useState<Entry[]>([])

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [waist, setWaist] = useState('')

  const memberEntries = useMemo(
    () => entries.filter((e) => e.memberId === selectedMemberId).sort((a, b) => a.date.localeCompare(b.date)),
    [entries, selectedMemberId]
  )
  const latest = memberEntries[memberEntries.length - 1]
  const first = memberEntries[0]
  const bmi = latest ? latest.weight / Math.pow(latest.height / 100, 2) : null

  const canLog = Boolean(selectedMemberId) && Number(weight) > 0 && Number(height) > 0

  const log = () => {
    if (!canLog) return
    setEntries((prev) => [
      ...prev,
      {
        memberId: selectedMemberId,
        date,
        weight: Number(weight),
        height: Number(height),
        bodyFat: bodyFat ? Number(bodyFat) : undefined,
        waist: waist ? Number(waist) : undefined,
      },
    ])
    setWeight('')
    setBodyFat('')
    setWaist('')
    showToast('Measurement logged.')
  }

  const chartData = memberEntries.map((e) => ({
    date: e.date.slice(5),
    weight: e.weight,
    bodyFat: e.bodyFat ?? null,
  }))

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Progress</h1>
          <p className="text-xs text-muted-foreground mt-1">Weight, BMI and body measurements per member</p>
        </div>
        <div className="w-full sm:w-72">
          <label htmlFor="progress-member" className="sr-only">
            Member
          </label>
          <select id="progress-member" value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className={selectCls}>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name} ({m.member_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold block">Latest weight</span>
          <span className="text-lg sm:text-2xl font-extrabold text-foreground block mt-1">{latest ? `${latest.weight} kg` : '—'}</span>
        </Card>
        <Card className="p-3.5 sm:p-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold block">BMI</span>
          <span className="text-lg sm:text-2xl font-extrabold text-foreground block mt-1">{bmi ? bmi.toFixed(1) : '—'}</span>
        </Card>
        <Card className="p-3.5 sm:p-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold block">Change</span>
          <span className={`text-lg sm:text-2xl font-extrabold block mt-1 ${latest && first && latest.weight < first.weight ? 'text-success-text' : 'text-foreground'}`}>
            {latest && first && memberEntries.length > 1 ? `${(latest.weight - first.weight).toFixed(1)} kg` : '—'}
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 min-w-0">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Weight trend</CardTitle>
            <CardDescription>{memberEntries.length} measurement{memberEntries.length === 1 ? '' : 's'} logged</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0 sm:pt-0">
            <div className="h-56 sm:h-64 w-full min-w-0">
              {chartData.length < 2 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-sm text-muted-foreground gap-2 px-4">
                  <Scale className="h-8 w-8 opacity-50" />
                  Log at least two measurements to see the trend.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: '#121520', border: '1px solid #1E2333', borderRadius: 12, fontSize: 12 }} />
                    <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#FF1E3D" strokeWidth={3} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="bodyFat" name="Body fat %" stroke="#00E5FF" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold">Log measurement</h2>
          <div>
            <label htmlFor="pg-date" className="text-xs font-semibold mb-1 block">
              Date
            </label>
            <Input id="pg-date" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="pg-weight" className="text-xs font-semibold mb-1 block">
                Weight (kg)
              </label>
              <Input id="pg-weight" type="number" inputMode="decimal" min={0} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label htmlFor="pg-height" className="text-xs font-semibold mb-1 block">
                Height (cm)
              </label>
              <Input id="pg-height" type="number" inputMode="numeric" min={0} value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div>
              <label htmlFor="pg-fat" className="text-xs font-semibold mb-1 block">
                Body fat %
              </label>
              <Input id="pg-fat" type="number" inputMode="decimal" min={0} step="0.1" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label htmlFor="pg-waist" className="text-xs font-semibold mb-1 block">
                Waist (cm)
              </label>
              <Input id="pg-waist" type="number" inputMode="decimal" min={0} value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <Button onClick={log} disabled={!canLog} className="w-full gap-1.5">
            <Plus className="h-4 w-4" /> Save measurement
          </Button>

          {memberEntries.length > 0 && (
            <div className="pt-3 border-t border-border space-y-1.5 max-h-48 overflow-y-auto">
              {[...memberEntries].reverse().map((e, i) => (
                <div key={`${e.date}-${i}`} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{e.date}</span>
                  <span className="font-mono font-semibold text-foreground">
                    {e.weight} kg{e.bodyFat ? ` · ${e.bodyFat}%` : ''}{e.waist ? ` · ${e.waist} cm` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
