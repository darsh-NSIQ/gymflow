'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Video,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ExternalLink,
  Target,
  Sparkles,
  Layers,
  Ruler,
} from 'lucide-react'
import { Dialog } from './dialog'
import { Button } from './button'
import { getExerciseGuide, ExerciseGuide } from '@/lib/exercise-db'

interface ExerciseDemoModalProps {
  exerciseName: string | null
  isOpen: boolean
  onClose: () => void
}

export function ExerciseDemoModal({ exerciseName, isOpen, onClose }: ExerciseDemoModalProps) {
  if (!exerciseName) return null

  const guide: ExerciseGuide = getExerciseGuide(exerciseName)

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" description="">
      <div className="space-y-5 text-white max-h-[85vh] overflow-y-auto pr-1">
        {/* MEDIA & BANNER CONTAINER */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0D0F17] border border-[#FF1E3D]/40 shadow-[0_0_30px_rgba(255,30,61,0.2)]">
          {/* Animated GIF / Image Preview */}
          <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden">
            <img
              src={guide.gif_url}
              alt={guide.name}
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-[#0D0F17]/40 to-transparent pointer-events-none" />

            {/* Live Animation Overlay Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1E3D]/90 text-white text-[11px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,61,0.6)] animate-pulse">
                <Play className="h-3 w-3 fill-white" />
                MOTION GUIDE ACTIVE
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 text-[11px] font-extrabold">
                {guide.equipment}
              </span>
            </div>

            {/* Difficulty Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-extrabold uppercase">
                {guide.difficulty} Level
              </span>
            </div>
          </div>

          {/* Exercise Title Header */}
          <div className="p-5 relative z-10 -mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{guide.name}</span>
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs font-bold text-[#FF1E3D] bg-[#FF1E3D]/10 px-2.5 py-0.5 rounded-full border border-[#FF1E3D]/30">
                    Primary: {guide.muscle_group}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Secondary: {guide.secondary_muscles.join(', ')}
                  </span>
                </div>
              </div>

              {guide.video_url && (
                <a
                  href={guide.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button
                    size="sm"
                    className="brand-btn-gradient text-white font-extrabold gap-2 shadow-[0_0_15px_rgba(255,30,61,0.4)] hover:scale-105 transition-transform"
                  >
                    <Video className="h-4 w-4" />
                    <span>Watch HD Video Guide</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* STEP-BY-STEP FORM EXECUTION */}
        <div className="p-5 rounded-2xl bg-[#0D0F17] border border-slate-800 space-y-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Step-by-Step Form Execution</span>
          </h3>
          <div className="space-y-2.5 pt-1">
            {guide.execution_steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#141722]/80 border border-slate-800">
                <span className="h-6 w-6 rounded-full bg-[#FF1E3D]/20 text-[#FF1E3D] font-mono font-black text-xs flex items-center justify-center shrink-0 border border-[#FF1E3D]/40">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed mt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRO TIPS & COMMON MISTAKES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pro Trainer Tips */}
          <div className="p-4 rounded-2xl bg-[#0D0F17] border border-slate-800 space-y-2">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF1E3D]" />
              <span>Pro Trainer Form Cues</span>
            </h4>
            <div className="space-y-2 pt-1">
              {guide.pro_tips.map((tip, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#FF1E3D]/10 border border-[#FF1E3D]/30 text-xs text-slate-200 font-medium flex items-start gap-2">
                  <span className="text-[#FF1E3D] font-black">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="p-4 rounded-2xl bg-[#0D0F17] border border-slate-800 space-y-2">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Mistakes to Avoid</span>
            </h4>
            <div className="space-y-2 pt-1">
              {guide.common_mistakes.map((mistake, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 font-medium flex items-start gap-2">
                  <span className="text-amber-400 font-black">×</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-white font-bold">
            Close Reference Guide
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
