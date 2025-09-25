import { Coordinate } from '@/types'

export const setupCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Set canvas size based on container
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  ctx.scale(dpr, dpr)

  // Set canvas display size
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  return ctx
}

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  coordinate: Coordinate,
  canvasWidth: number,
  canvasHeight: number,
  options: {
    radius?: number
    color?: string
    opacity?: number
  } = {}
) => {
  const { radius = 8, color = '#60A5FA', opacity = 0.8 } = options

  // Convert normalized coordinates (0-1) to canvas pixels
  const x = coordinate.x * canvasWidth
  const y = coordinate.y * canvasHeight

  ctx.save()
  ctx.globalAlpha = opacity

  // Outer glow - more vibrant
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.3, color.replace(')', ', 0.5)').replace('hsl', 'hsla'))
  gradient.addColorStop(0.7, color.replace(')', ', 0.25)').replace('hsl', 'hsla'))
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2)
  ctx.fill()

  // Inner bright point
  ctx.fillStyle = '#FFFFFF'
  ctx.globalAlpha = opacity * 0.9
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2)
  ctx.fill()

  // Main point
  ctx.fillStyle = color
  ctx.globalAlpha = opacity
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height)
}

export const drawAllPoints = (
  ctx: CanvasRenderingContext2D,
  coordinates: Coordinate[],
  canvasWidth: number,
  canvasHeight: number
) => {
  clearCanvas(ctx, canvasWidth, canvasHeight)

  coordinates.forEach((coordinate, index) => {
    // More vibrant colors with better visibility
    const hue = (coordinate.x * 360 + coordinate.y * 180) % 360
    const color = `hsl(${hue}, 70%, 60%)`

    drawPoint(ctx, coordinate, canvasWidth, canvasHeight, {
      opacity: 0.6 + (index / coordinates.length) * 0.3, // Newer points are more opaque
      color: color
    })
  })
}