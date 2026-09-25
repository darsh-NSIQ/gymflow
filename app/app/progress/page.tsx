'use client'

import React, { useState } from 'react'
import { TrendingUp, Camera, Scale, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/context'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function ProgressPage() {
  const { members } = useApp()
  const [selectedMemberId, setSelectedMemberId] = useState('mem_01')

  const weightProgressData = [
    { date: '01 Jan', weight: 82.5, bmi: 26.2, bodyFat: 22 },
    { date: '01 Feb', weight: 80.2, bmi: 25.5, bodyFat: 20 },
    { date: '01 Mar', weight: 78.5, bmi: 24.9, bodyFat: 18.5 },
    { date: '01 Apr', weight: 77.0, bmi: 24.4, bodyFat: 17 },
    { date: '01 Sep', weight: 75.8, bmi: 24.0, bodyFat: 15.5 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Progress & Body Composition</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track weight, BMI, body fat %, measurements, and before/after transformation photos
          </p>
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-card text-xs font-bold"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name} ({m.member_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight & BMI Trend Graph */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weight Loss & Body Fat Trend</CardTitle>
            <CardDescription>Empirical measurement log over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F6" />
                  <XAxis dataKey="date" stroke="#5B6378" fontSize={12} />
                  <YAxis stroke="#5B6378" fontSize={12} domain={[70, 90]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#6C5CE7" strokeWidth={3} />
                  <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#0CA678" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Before / After Photo Comparison */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Transformation Photos</h2>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="space-y-1">
              <span className="font-bold text-muted-foreground block">BEFORE (Jan 2026)</span>
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300"
                alt="Before"
                className="h-40 w-full object-cover rounded-xl border border-border"
              />
              <span className="text-muted-foreground block">Weight: 82.5 kg</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-emerald-600 block">AFTER (Sep 2026)</span>
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300"
                alt="After"
                className="h-40 w-full object-cover rounded-xl border-2 border-emerald-500"
              />
              <span className="text-emerald-600 font-bold block">Weight: 75.8 kg</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
