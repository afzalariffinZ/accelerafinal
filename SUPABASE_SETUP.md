# Supabase Setup Guide

## 1. Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Note down your project URL and API keys

## 2. Database Setup

### Option A: Auto-migration (Recommended)
```bash
# Set your DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Run Prisma migration
npx prisma db push
```

### Option B: Manual SQL Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- This will be generated automatically when you run: npx prisma db push
-- But here's the manual version if needed:

CREATE TABLE "client_requests" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phoneNumber" TEXT,
    "requestType" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeline" TEXT,
    "budget" TEXT,
    "technicalRequirements" TEXT,
    "businessGoals" TEXT,
    "currentChallenges" TEXT,
    "expectedOutcome" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "source" TEXT NOT NULL DEFAULT 'website',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_requests_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint
ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_requestId_key" UNIQUE ("requestId");

-- Repeat similar pattern for other tables...
```

## 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Test the Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start the development server
npm run dev
```

## 5. Verify Database

- Go to your Supabase dashboard
- Check the "Table Editor" tab
- You should see the tables: `client_requests`, `enterprise_sales_requests`, `ai_enhanced_summaries`

## 6. Test API Endpoints

Test with curl or your browser:

```bash
# Test client request creation
curl -X POST http://localhost:3000/api/requests/client \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "requestType": "feature",
    "projectTitle": "Test Project",
    "description": "This is a test request"
  }'

# Get all client requests
curl http://localhost:3000/api/requests/client
```

Your database is now ready to save all request data! 🎉