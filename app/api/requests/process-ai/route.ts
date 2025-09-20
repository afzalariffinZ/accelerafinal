import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processRequestWithAI, createAIEnhancedSummary } from '@/lib/ai-processing'

export async function POST(request: NextRequest) {
  try {
    const { requestId, requestType } = await request.json()
    
    if (!requestId || !requestType) {
      return NextResponse.json({
        success: false,
        message: 'requestId and requestType are required'
      }, { status: 400 })
    }
    
    // Fetch the original request
    let originalRequest
    if (requestType === 'client') {
      originalRequest = await prisma.clientRequest.findUnique({
        where: { id: requestId }
      })
    } else if (requestType === 'enterprise') {
      originalRequest = await prisma.enterpriseSalesRequest.findUnique({
        where: { id: requestId }
      })
    }
    
    if (!originalRequest) {
      return NextResponse.json({
        success: false,
        message: 'Request not found'
      }, { status: 404 })
    }
    
    // Check if AI summary already exists
    const existingSummary = await prisma.aIEnhancedRequestSummary.findFirst({
      where: {
        ...(requestType === 'client' 
          ? { clientRequestId: requestId } 
          : { enterpriseRequestId: requestId })
      }
    })
    
    if (existingSummary) {
      return NextResponse.json({
        success: true,
        message: 'AI summary already exists',
        data: existingSummary
      })
    }
    
    // Process with AI
    const aiAnalysis = await processRequestWithAI(originalRequest, {
      requestId,
      requestType: requestType as 'client' | 'enterprise',
      aiModel: 'mock-ai-v1.0'
    })
    
    // Create AI enhanced summary
    const aiSummary = await createAIEnhancedSummary(requestId, requestType as 'client' | 'enterprise', aiAnalysis)
    
    return NextResponse.json({
      success: true,
      message: 'AI processing completed successfully',
      data: aiSummary
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error processing AI summary:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to process AI summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}