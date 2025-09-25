'use client'

import { useEffect, useRef } from 'react'
import { Coordinate } from '@/types'
import { setupCanvas, drawAllPoints, drawPoint } from '@/lib/canvas-utils'

interface CanvasGraphProps {
  coordinates: Coordinate[]
  className?: string
  onAnimationComplete?: () => void
  animateNewPoint?: boolean
}

export default function CanvasGraph({
  coordinates,
  className = '',
  onAnimationComplete,
  animateNewPoint = false
}: CanvasGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const previousCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = setupCanvas(canvas)
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()

    // If we have a new point and should animate it
    if (animateNewPoint && coordinates.length > previousCountRef.current) {
      const newPoint = coordinates[coordinates.length - 1]
      const oldPoints = coordinates.slice(0, -1)

      // Draw existing points first
      drawAllPoints(ctx, oldPoints, rect.width, rect.height)

      // Animate the new point
      let startTime = 0
      const animateDuration = 800 // 0.8 seconds

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / animateDuration, 1)

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3)

        // Clear and redraw
        drawAllPoints(ctx, oldPoints, rect.width, rect.height)

        // Draw animated point
        drawPoint(ctx, newPoint, rect.width, rect.height, {
          radius: 6 * easeOut,
          opacity: 0.6 * easeOut
        })

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete
          drawAllPoints(ctx, coordinates, rect.width, rect.height)
          onAnimationComplete?.()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    } else {
      // No animation, just draw all points
      drawAllPoints(ctx, coordinates, rect.width, rect.height)
    }

    previousCountRef.current = coordinates.length

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [coordinates, animateNewPoint, onAnimationComplete])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = setupCanvas(canvas)
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      drawAllPoints(ctx, coordinates, rect.width, rect.height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [coordinates])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}