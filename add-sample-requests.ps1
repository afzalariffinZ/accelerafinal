# Test script to add sample client requests data
Write-Host "🚀 Adding sample client requests..." -ForegroundColor Cyan

$requests = @(
    @{
        fullName = "John Smith"
        email = "john.smith@techcorp.com"
        company = "Tech Corp Ltd"
        phoneNumber = "555-0101"
        requestType = "enterprise_solution"
        projectTitle = "HIGH Priority Enterprise Solution - 250 Seats"
        description = "We need a comprehensive enterprise solution with advanced user management, workflow automation, and analytics capabilities for our growing team."
        timeline = "3-6 months"
        budget = "50,000-100,000"
    },
    @{
        fullName = "Sarah Johnson"
        email = "sarah@startupxyz.com"
        company = "StartupXYZ"
        phoneNumber = "555-0102"
        requestType = "custom_development"
        projectTitle = "MEDIUM Priority Custom Integration - 75 Seats"
        description = "Custom integration with our existing CRM and inventory management systems. Need real-time data synchronization."
        timeline = "2-4 months"
        budget = "25,000-50,000"
    },
    @{
        fullName = "Michael Chen"
        email = "mchen@globalind.com"
        company = "Global Industries"
        phoneNumber = "555-0103"
        requestType = "enterprise_solution"
        projectTitle = "CRITICAL Priority Global Rollout - 500 Seats"
        description = "Global enterprise rollout across 15 countries with multi-language support, compliance features, and 24/7 support requirements."
        timeline = "6-12 months"
        budget = "100,000+"
    }
)

$baseUri = "http://localhost:3000/api/requests/client"
$headers = @{
    "Content-Type" = "application/json"
}

foreach ($request in $requests) {
    try {
        Write-Host "Adding request for $($request.fullName)..." -ForegroundColor Yellow
        
        $body = $request | ConvertTo-Json -Depth 3
        $response = Invoke-RestMethod -Uri $baseUri -Method Post -Headers $headers -Body $body
        
        Write-Host "✅ Added: $($response.requestId)" -ForegroundColor Green
        Start-Sleep 1
    } catch {
        Write-Host "❌ Error adding request for $($request.fullName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Sample data setup complete!" -ForegroundColor Green
Write-Host "Go to http://localhost:3000/admin/dashboard and click on 'Client Requests' tab" -ForegroundColor Cyan