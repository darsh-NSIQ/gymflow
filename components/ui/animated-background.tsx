'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Soft Ambient Light Orb 1 - Top Left Primary Violet */}
      <motion.div
        className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-primary/10 blur-[120px]"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Soft Ambient Light Orb 2 - Top Right Emerald */}
      <motion.div
        className="absolute top-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Soft Ambient Light Orb 3 - Bottom Left Sky Blue */}
      <motion.div
        className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[130px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle Dot Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
