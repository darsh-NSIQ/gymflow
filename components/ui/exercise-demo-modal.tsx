'use client'

import React from 'react'
import { Video, CheckCircle2, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react'
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={guide.name}
      description={`${guide.muscle_group} · ${guide.equipment} · ${guide.difficulty}`}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto font-bold">
            Close
          </Button>
          {guide.video_url && (
            <a href={guide.video_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button className="brand-btn-gradient text-white font-extrabold gap-2 w-full sm:w-auto">
                <Video className="h-4 w-4" />
                <span>Watch video</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </Button>
            </a>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-black border border-primary/30 aspect-video w-full">
          <img src={guide.gif_url} alt={`${guide.name} demonstration`} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-primary-softText bg-primary-soft px-2.5 py-1 rounded-full border border-primary/30">
              Primary: {guide.muscle_group}
            </span>
            {guide.secondary_muscles.length > 0 && (
              <span className="text-[11px] font-semibold text-muted-foreground bg-card/80 px-2.5 py-1 rounded-full border border-border truncate max-w-full">
                Also: {guide.secondary_muscles.join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success-text" />
            <span>How to do it</span>
          </h3>
          <ol className="space-y-2">
            {guide.execution_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <span className="h-6 w-6 rounded-full bg-primary-soft text-primary font-mono font-black text-xs flex items-center justify-center shrink-0">{idx + 1}</span>
                <p className="text-xs text-foreground font-medium leading-relaxed mt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
            <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Form cues</span>
            </h4>
            <ul className="space-y-2">
              {guide.pro_tips.map((tip, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-primary-soft/60 border border-primary/20 text-xs text-foreground font-medium flex items-start gap-2">
                  <span className="text-primary font-black">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
            <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-text" />
              <span>Avoid</span>
            </h4>
            <ul className="space-y-2">
              {guide.common_mistakes.map((mistake, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-warning/60 border border-warning-text/20 text-xs text-foreground font-medium flex items-start gap-2">
                  <span className="text-warning-text font-black">×</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
