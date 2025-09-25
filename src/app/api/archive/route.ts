import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Coordinate } from '@/types'

export async function GET() {
  try {
    // Get all coordinates from all responses
    const { data: responses, error } = await supabase
      .from('responses')
      .select('coordinates, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching archive data:', error)
      return NextResponse.json({ error: 'Failed to fetch archive data' }, { status: 500 })
    }

    // Flatten all coordinates from all responses
    const allCoordinates: (Coordinate & { created_at: string })[] = []

    responses.forEach((response) => {
      if (response.coordinates && Array.isArray(response.coordinates)) {
        response.coordinates.forEach((pgPoint: string) => {
          // Parse PostgreSQL POINT format: "(x,y)"
          const match = pgPoint.match(/\(([^,]+),([^)]+)\)/)
          if (match) {
            const x = parseFloat(match[1])
            const y = parseFloat(match[2])
            if (!isNaN(x) && !isNaN(y)) {
              allCoordinates.push({
                x,
                y,
                created_at: response.created_at
              })
            }
          }
        })
      }
    })

    return NextResponse.json({
      coordinates: allCoordinates,
      total_points: allCoordinates.length,
      total_responses: responses.length
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}