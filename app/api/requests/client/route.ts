import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for client request
const clientRequestSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  phoneNumber: z.string().optional(),
  requestType: z.string().min(1, 'Request type is required'),
  projectTitle: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  technicalRequirements: z.string().optional(),
  businessGoals: z.string().optional(),
  currentChallenges: z.string().optional(),
  expectedOutcome: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = clientRequestSchema.parse(body)
    
    // Save to database
    const clientRequest = await prisma.clientRequest.create({
      data: {
        ...validatedData,
        source: 'website',
        status: 'pending',
        priority: 'medium',
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      requestId: clientRequest.requestId,
      data: clientRequest
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error saving client request:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }
    
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
    const skip = (page - 1) * limit
    
    const where = status ? { status } : {}
    
    const [requests, total] = await Promise.all([
      prisma.clientRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          AIEnhancedRequestSummary: true
        }
      }),
      prisma.clientRequest.count({ where })
    ])
    
    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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