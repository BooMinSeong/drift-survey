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
  const { radius = 6, color = '#60A5FA', opacity = 0.6 } = options

  // Convert normalized coordinates (0-1) to canvas pixels
  const x = coordinate.x * canvasWidth
  const y = coordinate.y * canvasHeight

  ctx.save()
  ctx.globalAlpha = opacity

  // Outer glow
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.5, `${color}40`)
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
  ctx.fill()

  // Inner point
  ctx.fillStyle = color
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
    drawPoint(ctx, coordinate, canvasWidth, canvasHeight, {
      opacity: 0.4 + (index / coordinates.length) * 0.4 // Newer points are more opaque
    })
  })
}