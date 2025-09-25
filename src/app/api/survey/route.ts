import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: survey, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', 'drift-survey-v1')
      .single()

    if (error) {
      console.error('Error fetching survey:', error)
      return NextResponse.json({ error: 'Failed to fetch survey' }, { status: 500 })
    }

    return NextResponse.json(survey)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}