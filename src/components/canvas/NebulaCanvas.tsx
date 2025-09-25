'use client'

import { useEffect, useRef } from 'react'
import { Coordinate } from '@/types'

interface NebulaCanvasProps {
  coordinates: (Coordinate & { created_at: string })[]
  className?: string
}

export default function NebulaCanvas({ coordinates, className = '' }: NebulaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    let time = 0

    const drawNebula = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Create nebula background effect
      const bgGradient = ctx.createRadialGradient(
        rect.width / 2, rect.height / 2, 0,
        rect.width / 2, rect.height / 2, Math.max(rect.width, rect.height) / 2
      )
      bgGradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)')
      bgGradient.addColorStop(0.3, 'rgba(147, 51, 234, 0.03)')
      bgGradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.02)')
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Draw all points with nebula effect
      coordinates.forEach((coord, index) => {
        const x = coord.x * rect.width
        const y = coord.y * rect.height

        // Age-based opacity (older points are more faded)
        const age = Date.now() - new Date(coord.created_at).getTime()
        const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
        const ageRatio = Math.min(age / maxAge, 1)
        const baseOpacity = Math.max(0.1, 1 - ageRatio * 0.8)

        // Subtle pulsing animation
        const pulse = Math.sin(time * 0.001 + index * 0.1) * 0.2 + 0.8
        const opacity = baseOpacity * pulse

        // Point size varies slightly
        const baseSize = 2 + Math.sin(index * 0.3) * 1.5
        const size = baseSize * (0.8 + pulse * 0.4)

        // Color variation based on position
        const hue = (coord.x * 360 + coord.y * 180) % 360
        const saturation = 40 + coord.y * 20
        const lightness = 50 + coord.x * 30

        // Outer glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        glowGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 0.3})`)
        glowGradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 0.1})`)
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Inner point
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      time += 16
      animationRef.current = requestAnimationFrame(drawNebula)
    }

    animationRef.current = requestAnimationFrame(drawNebula)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [coordinates])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}