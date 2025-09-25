import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }

    // Test if responses table exists
    const { data: responseTest, error: responseError } = await supabase
      .from('responses')
      .select('*')
      .limit(1)

    if (responseError) {
      console.error('Responses table error:', responseError)
      return NextResponse.json({
        success: false,
        error: `Responses table error: ${responseError.message}`,
        details: responseError
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      surveysData: data,
      responseTableExists: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Unexpected connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected connection error',
      details: error
    }, { status: 500 })
  }
}