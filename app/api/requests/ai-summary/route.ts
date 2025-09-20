import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for AI enhanced summary
const aiSummarySchema = z.object({
  clientRequestId: z.string().optional(),
  enterpriseRequestId: z.string().optional(),
  originalRequestType: z.enum(['client', 'enterprise']),
  complexityScore: z.number().min(1).max(10).optional(),
  feasibilityScore: z.number().min(1).max(10).optional(),
  estimatedHours: z.number().optional(),
  estimatedCost: z.number().optional(),
  riskAssessment: z.enum(['low', 'medium', 'high']).optional(),
  technicalSummary: z.string().optional(),
  businessImpact: z.string().optional(),
  recommendedApproach: z.string().optional(),
  alternativeSolutions: z.string().optional(),
  autoApprovalEligible: z.boolean().default(false),
  recommendedAction: z.enum(['approve', 'review', 'reject', 'request-more-info']).optional(),
  confidenceLevel: z.number().min(0).max(1).optional(),
  aiProcessingSteps: z.array(z.string()).default([]),
  aiModel: z.string().optional(),
  processingTime: z.number().optional(),
  revenueImpact: z.number().optional(),
  resourceRequirements: z.string().optional(),
  timelineAssessment: z.string().optional(),
  marketFitScore: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = aiSummarySchema.parse(body)
    
    // Ensure either clientRequestId or enterpriseRequestId is provided
    if (!validatedData.clientRequestId && !validatedData.enterpriseRequestId) {
      return NextResponse.json({
        success: false,
        message: 'Either clientRequestId or enterpriseRequestId must be provided'
      }, { status: 400 })
    }
    
    // Save to database
    const aiSummary = await prisma.aIEnhancedRequestSummary.create({
      data: {
        ...validatedData,
        status: 'processed',
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'AI summary created successfully',
      data: aiSummary
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error saving AI summary:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create AI summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const requestType = searchParams.get('requestType')
    const skip = (page - 1) * limit
    
    const where: any = {}
    if (requestType) where.originalRequestType = requestType
    
    const [summaries, total] = await Promise.all([
      prisma.aIEnhancedRequestSummary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          clientRequest: true,
          enterpriseRequest: true
        }
      }),
      prisma.aIEnhancedRequestSummary.count({ where })
    ])
    
    return NextResponse.json({
      success: true,
      data: summaries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching AI summaries:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch AI summaries'
    }, { status: 500 })
  }
}