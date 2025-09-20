# Test the API endpoints - POST for basic request and PATCH for AI summary
Write-Host "🚀 Testing Request API Endpoints" -ForegroundColor Cyan

# Test 1: Create basic request (POST)
Write-Host "`n1️⃣ Testing POST /api/requests/client (Basic Request Data)" -ForegroundColor Yellow
$postUri = "http://localhost:3001/api/requests/client"
$headers = @{
    "Content-Type" = "application/json"
}
$postBody = @{
    fullName = "Test User"
    email = "test@example.com"
    company = "Test Company"
    phoneNumber = "555-0123"
    requestType = "enterprise_solution"
    projectTitle = "HIGH Priority Enterprise Solution - 50 Seats"
    description = "We need a comprehensive enterprise solution with advanced user management and workflow automation capabilities."
    timeline = "3-6 months"
    budget = "`$50,000-`$100,000"
} | ConvertTo-Json -Depth 2

try {
    $postResponse = Invoke-RestMethod -Uri $postUri -Method Post -Headers $headers -Body $postBody
    Write-Host "✅ POST Success!" -ForegroundColor Green
    Write-Host "Request ID: $($postResponse.requestId)" -ForegroundColor Cyan
    $requestId = $postResponse.requestId
} catch {
    Write-Host "❌ POST Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Update with AI summary (PATCH)
Write-Host "`n2️⃣ Testing PATCH /api/requests/client (AI Summary Update)" -ForegroundColor Yellow
$patchBody = @{
    requestId = $requestId
    aiSummary = @{
        executiveSummary = "REQ-TEST-001: Enterprise-grade solution for 50 users with high priority implementation targeting 3-6 months. Our AI analysis indicates this project aligns with modern scalability requirements and estimated flexible payment structure."
        technicalAnalysis = "Based on your requirements for 50 licenses, our AI recommends a scalable architecture supporting 5 administrators, 35 standard users, and 10 viewers. The proposed solution incorporates enterprise-grade security, role-based access controls, and seamless integration capabilities."
        implementationStrategy = "Priority HIGH classification ensures dedicated resource allocation. Target completion: 3-6 months. Recommended approach: Agile methodology with bi-weekly sprints, continuous integration, and user acceptance testing phases."
        financialOptimization = "Revenue analysis suggests quarterly payment schedule aligning with cash flow patterns. Budget constraints accommodate recommended solution scope."
        riskAssessment = "Low complexity risk profile. Standard implementation timeline. Flexible budget allocation recommended."
        nextSteps = @(
            "Technical architecture review (1-2 business days)",
            "Resource allocation and team assignment",
            "Detailed project timeline creation", 
            "Final cost estimation and contract preparation",
            "Client approval and project kickoff"
        )
    }
} | ConvertTo-Json -Depth 4

try {
    $patchResponse = Invoke-RestMethod -Uri $postUri -Method Patch -Headers $headers -Body $patchBody
    Write-Host "✅ PATCH Success!" -ForegroundColor Green
    Write-Host "Updated Request Status: $($patchResponse.data.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ PATCH Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Test Complete!" -ForegroundColor Green