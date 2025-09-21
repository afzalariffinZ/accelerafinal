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

        // Save to Supabase (basic request data only)
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
                    status: 'pending',
                    priority: 'medium',
                    source: 'website'
                    // AI summary fields will be added later via PATCH
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
        const requestId = searchParams.get('requestId')

        // If requestId is provided, fetch specific request
        if (requestId) {
            const { data, error } = await supabase
                .from('client_requests')
                .select('*')
                .eq('request_id', requestId)

            if (error) {
                console.error('Supabase error:', error)
                return NextResponse.json({
                    success: false,
                    message: 'Failed to fetch request',
                    error: error.message
                }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                data: data || []
            })
        }

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

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        if (!body.requestId) {
            return NextResponse.json({
                success: false,
                message: 'requestId is required'
            }, { status: 400 })
        }

        // Check if this is a status-only update
        if (body.status && !body.aiSummary) {
            // Status update only
            const updateData: any = {
                status: body.status,
                updated_at: new Date().toISOString()
            };
            
            // Include S3 location if provided
            if (body.s3Location) {
                updateData.s3_report_location = body.s3Location;
            }
            
            const { data, error } = await supabase
                .from('client_requests')
                .update(updateData)
                .eq('request_id', body.requestId)
                .select()

            if (error) {
                console.error('Supabase error:', error)
                return NextResponse.json({
                    success: false,
                    message: 'Failed to update request status',
                    error: error.message
                }, { status: 500 })
            }

            if (!data || data.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: 'Request not found'
                }, { status: 404 })
            }

            return NextResponse.json({
                success: true,
                message: 'Request status updated successfully',
                data: data[0]
            }, { status: 200 })
        }

        // Update existing request with AI summary
        const { data, error } = await supabase
            .from('client_requests')
            .update({
                executive_summary: body.aiSummary?.executiveSummary || null,
                technical_analysis: body.aiSummary?.technicalAnalysis || null,
                implementation_strategy: body.aiSummary?.implementationStrategy || null,
                financial_optimization: body.aiSummary?.financialOptimization || null,
                risk_assessment: body.aiSummary?.riskAssessment || null,
                next_steps: body.aiSummary?.nextSteps ? JSON.stringify(body.aiSummary.nextSteps) : null,
                updated_at: new Date().toISOString()
            })
            .eq('request_id', body.requestId)
            .select()

        // After your Supabase update
        const { data: fullData, error: fetchError } = await supabase
            .from('client_requests')
            .select('*')               // get all columns
            .eq('request_id', body.requestId)
            .single()                  // returns single object

        if (fetchError) {
            console.error('Failed to fetch full request data:', fetchError)
        } else {
            const lambdaPayload = { body: JSON.stringify(fullData) }

            try {
                await fetch('https://a3tqs8kvyf.execute-api.ap-southeast-5.amazonaws.com/prod', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(lambdaPayload)
                })
            } catch (err) {
                console.error('Failed to send data to API Gateway:', err)
            }
        }

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({
                success: false,
                message: 'Failed to update request with AI summary',
                error: error.message
            }, { status: 500 })
        }

        if (!data || data.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Request not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Request updated with AI summary successfully',
            data: data[0]
        }, { status: 200 })

    } catch (error) {
        console.error('Error updating client request:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to update request',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}