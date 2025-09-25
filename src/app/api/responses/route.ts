import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { UserResponse, Coordinate } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received request body:', JSON.stringify(body, null, 2))

    const { responses, coordinates }: { responses: UserResponse['answers'], coordinates: Coordinate[] } = body

    // Validate required fields
    if (!responses || !Array.isArray(responses)) {
      console.error('Invalid responses data:', responses)
      return NextResponse.json({
        error: 'Invalid responses data',
        received: responses
      }, { status: 400 })
    }

    if (!coordinates || !Array.isArray(coordinates)) {
      console.error('Invalid coordinates data:', coordinates)
      return NextResponse.json({
        error: 'Invalid coordinates data',
        received: coordinates
      }, { status: 400 })
    }

    // Generate a session ID for this user
    const userSession = crypto.randomUUID()
    console.log('Generated user session:', userSession)

    // Convert coordinates to PostgreSQL POINT format
    const pgPoints = coordinates.map(coord => `(${coord.x},${coord.y})`)
    console.log('Converted coordinates to PostgreSQL format:', pgPoints)

    const responseData = {
      user_session: userSession,
      survey_id: 'drift-survey-v1',
      answers: responses,
      coordinates: pgPoints
    }

    console.log('Attempting to insert data:', JSON.stringify(responseData, null, 2))

    const { data, error } = await supabase
      .from('responses')
      .insert([responseData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json({
        error: 'Failed to save response',
        supabaseError: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 500 })
    }

    console.log('Successfully saved response:', data)
    return NextResponse.json({
      success: true,
      response: data
    })

  } catch (error) {
    console.error('Unexpected error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    })
    return NextResponse.json({
      error: 'Invalid request data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
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