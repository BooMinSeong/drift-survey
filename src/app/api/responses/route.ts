import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { UserResponse, Coordinate } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { responses, coordinates }: { responses: UserResponse['answers'], coordinates: Coordinate[] } = body

    // Generate a session ID for this user
    const userSession = crypto.randomUUID()

    // Convert coordinates to PostgreSQL POINT format
    const pgPoints = coordinates.map(coord => `(${coord.x},${coord.y})`)

    const responseData = {
      user_session: userSession,
      survey_id: 'drift-survey-v1',
      answers: responses,
      coordinates: pgPoints
    }

    const { data, error } = await supabase
      .from('responses')
      .insert([responseData])
      .select()
      .single()

    if (error) {
      console.error('Error saving response:', error)
      return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      response: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { data: responses, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching responses:', error)
      return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
    }

    return NextResponse.json(responses)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}