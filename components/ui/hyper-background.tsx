'use client'

import React, { useEffect, useRef } from 'react'

export function HyperBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Interactive Mouse Tracking
    const mouse = { x: width / 2, y: height / 2, radius: 220 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Brand Matched Palette (Crimson Red #FF1E3D, Orange #FF6B00, Metallic White #FFFFFF, Obsidian)
    const colors = ['#FF1E3D', '#E51937', '#FF6B00', '#FFFFFF', '#FF3352', '#00E5FF']

    // 1. PARTICLES & CONSTELLATIONS
    const particlesCount = Math.min(45, Math.floor(width / 30))
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      baseAlpha: number
    }> = []

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.35 + 0.15,
      })
    }

    // 2. FLOATING ANIMATED GYM GEAR (Dumbbells, Barbells, Plates, Kettlebells)
    type GearType = 'dumbbell' | 'barbell' | 'plate' | 'kettlebell'
    const gearItems: Array<{
      x: number
      y: number
      vx: number
      vy: number
      rotation: number
      vRot: number
      size: number
      type: GearType
      color: string
      alpha: number
    }> = []

    const gearTypes: GearType[] = ['dumbbell', 'barbell', 'plate', 'kettlebell', 'dumbbell', 'plate']
    const totalGearCount = Math.min(18, Math.max(8, Math.floor(width / 110)))

    for (let i = 0; i < totalGearCount; i++) {
      gearItems.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
        size: Math.random() * 16 + 18, // 18px - 34px
        type: gearTypes[i % gearTypes.length],
        color: colors[i % colors.length],
        alpha: Math.random() * 0.25 + 0.12,
      })
    }

    // DRAWING HELPER FUNCTIONS
    const drawDumbbell = (c: CanvasRenderingContext2D, size: number, color: string) => {
      // Handle
      c.fillStyle = color
      c.fillRect(-size * 0.9, -size * 0.12, size * 1.8, size * 0.24)
      
      // Knurling details
      c.fillStyle = '#FFFFFF'
      c.globalAlpha *= 0.5
      c.fillRect(-size * 0.4, -size * 0.12, size * 0.8, size * 0.24)
      c.globalAlpha /= 0.5

      // Left Weights
      c.fillStyle = color
      c.fillRect(-size * 1.0, -size * 0.5, size * 0.22, size * 1.0)
      c.fillRect(-size * 0.8, -size * 0.4, size * 0.22, size * 0.8)

      // Right Weights
      c.fillRect(size * 0.78, -size * 0.5, size * 0.22, size * 1.0)
      c.fillRect(size * 0.58, -size * 0.4, size * 0.22, size * 0.8)
    }

    const drawPlate = (c: CanvasRenderingContext2D, size: number, color: string) => {
      // Outer Rim
      c.strokeStyle = color
      c.lineWidth = size * 0.18
      c.beginPath()
      c.arc(0, 0, size * 0.8, 0, Math.PI * 2)
      c.stroke()

      // Inner Ring
      c.lineWidth = size * 0.08
      c.beginPath()
      c.arc(0, 0, size * 0.5, 0, Math.PI * 2)
      c.stroke()

      // Center Hole
      c.fillStyle = color
      c.beginPath()
      c.arc(0, 0, size * 0.18, 0, Math.PI * 2)
      c.fill()

      // 4 Grips cutouts
      for (let k = 0; k < 4; k++) {
        c.save()
        c.rotate((Math.PI / 2) * k)
        c.fillStyle = color
        c.beginPath()
        c.arc(0, -size * 0.65, size * 0.1, 0, Math.PI * 2)
        c.fill()
        c.restore()
      }
    }

    const drawBarbell = (c: CanvasRenderingContext2D, size: number, color: string) => {
      const barLen = size * 2.8
      // Long shaft
      c.fillStyle = color
      c.fillRect(-barLen / 2, -size * 0.08, barLen, size * 0.16)

      // Left Loaded Bumper Plates
      c.fillRect(-barLen / 2 + size * 0.2, -size * 0.7, size * 0.18, size * 1.4)
      c.fillRect(-barLen / 2 + size * 0.42, -size * 0.6, size * 0.18, size * 1.2)

      // Right Loaded Bumper Plates
      c.fillRect(barLen / 2 - size * 0.38, -size * 0.7, size * 0.18, size * 1.4)
      c.fillRect(barLen / 2 - size * 0.6, -size * 0.6, size * 0.18, size * 1.2)
    }

    const drawKettlebell = (c: CanvasRenderingContext2D, size: number, color: string) => {
      // Handle Loop
      c.strokeStyle = color
      c.lineWidth = size * 0.16
      c.beginPath()
      c.arc(0, -size * 0.3, size * 0.35, Math.PI * 0.85, Math.PI * 0.15, true)
      c.stroke()

      // Main Bell Body
      c.fillStyle = color
      c.beginPath()
      c.arc(0, size * 0.25, size * 0.55, 0, Math.PI * 2)
      c.fill()
    }

    // MAIN RENDER LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Crimson Brand Radial Spotlight Glow around Mouse Cursor
      const spotlight = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        480
      )
      spotlight.addColorStop(0, 'rgba(255, 30, 61, 0.10)')
      spotlight.addColorStop(0.5, 'rgba(229, 25, 55, 0.03)')
      spotlight.addColorStop(1, 'rgba(8, 9, 13, 0)')
      ctx.fillStyle = spotlight
      ctx.fillRect(0, 0, width, height)

      // 1. RENDER & UPDATE PARTICLES
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx)
          p.x -= Math.cos(angle) * 1.5
          p.y -= Math.sin(angle) * 1.5
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.baseAlpha
        ctx.fill()

        // Constellation Beams
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const pdx = p.x - p2.x
          const pdy = p.y - p2.y
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy)

          if (pdist < 130) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = p.color
            ctx.globalAlpha = (1 - pdist / 130) * 0.15
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // 2. RENDER & UPDATE FLOATING GYM GEAR
      for (let i = 0; i < gearItems.length; i++) {
        const g = gearItems[i]
        g.x += g.vx
        g.y += g.vy
        g.rotation += g.vRot

        // Screen Bounce
        if (g.x < -30) g.x = width + 30
        if (g.x > width + 30) g.x = -30
        if (g.y < -30) g.y = height + 30
        if (g.y > height + 30) g.y = -30

        // Mouse Repulsion Effect
        const gdx = mouse.x - g.x
        const gdy = mouse.y - g.y
        const gdist = Math.sqrt(gdx * gdx + gdy * gdy)
        let currentAlpha = g.alpha

        if (gdist < mouse.radius) {
          const angle = Math.atan2(gdy, gdx)
          g.x -= Math.cos(angle) * 2.0
          g.y -= Math.sin(angle) * 2.0
          currentAlpha = Math.min(0.6, g.alpha * 2.2) // Highlight on hover proximity
        }

        ctx.save()
        ctx.translate(g.x, g.y)
        ctx.rotate(g.rotation)
        ctx.globalAlpha = currentAlpha

        if (g.type === 'dumbbell') {
          drawDumbbell(ctx, g.size, g.color)
        } else if (g.type === 'plate') {
          drawPlate(ctx, g.size, g.color)
        } else if (g.type === 'barbell') {
          drawBarbell(ctx, g.size, g.color)
        } else if (g.type === 'kettlebell') {
          drawKettlebell(ctx, g.size, g.color)
        }

        ctx.restore()
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
