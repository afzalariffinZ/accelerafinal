import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.fullName || !body.email || !body.requestType || !body.projectTitle || !body.description) {
      return NextResponse.json({
        success: false,
        message: 'Required fields: fullName, email, requestType, projectTitle, description'
      }, { status: 400 })
    }
    
    // Generate unique request ID
    const requestId = 'REQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('client_requests')
      .insert([
        {
          request_id: requestId,
          full_name: body.fullName,
          email: body.email,
          company: body.company || null,
          phone_number: body.phoneNumber || null,
          request_type: body.requestType,
          project_title: body.projectTitle,
          description: body.description,
          timeline: body.timeline || null,
          budget: body.budget || null,
          ai_enhanced_summary: body.aiEnhancedSummary || null,
          status: 'pending',
          priority: 'medium',
          source: 'website'
        }
      ])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to save request',
        error: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      requestId: requestId,
      data: data[0]
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error saving client request:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to submit request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    
    let query = supabase
      .from('client_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch requests',
        error: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit
      }
    })
    
  } catch (error) {
    console.error('Error fetching client requests:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch requests'
    }, { status: 500 })
  }
}