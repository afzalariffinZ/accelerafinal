import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for enterprise sales request
const enterpriseRequestSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  annualRevenue: z.string().optional(),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  jobTitle: z.string().optional(),
  solutionInterest: z.string().min(1, 'Solution interest is required'),
  projectScope: z.string().min(1, 'Project scope is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  timeline: z.string().optional(),
  estimatedBudget: z.string().optional(),
  userCount: z.number().optional(),
  integrationNeeds: z.string().optional(),
  complianceRequirements: z.string().optional(),
  supportLevel: z.string().optional(),
  leadSource: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = enterpriseRequestSchema.parse(body)
    
    // Save to database
    const enterpriseRequest = await prisma.enterpriseSalesRequest.create({
      data: {
        ...validatedData,
        salesStage: 'lead',
        status: 'new',
        priority: 'medium',
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Enterprise request submitted successfully',
      requestId: enterpriseRequest.requestId,
      data: enterpriseRequest
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error saving enterprise request:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to submit enterprise request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const salesStage = searchParams.get('salesStage')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit
    
    const where: any = {}
    if (salesStage) where.salesStage = salesStage
    if (status) where.status = status
    
    const [requests, total] = await Promise.all([
      prisma.enterpriseSalesRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          AIEnhancedRequestSummary: true
        }
      }),
      prisma.enterpriseSalesRequest.count({ where })
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
    console.error('Error fetching enterprise requests:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch enterprise requests'
    }, { status: 500 })
  }
}