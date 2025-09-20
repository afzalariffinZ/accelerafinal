# Simple Supabase Setup

## 1. Create Your Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API key

## 2. Create the Database Table

Go to **SQL Editor** in your Supabase dashboard and run this:

```sql
-- Create simple client_requests table
CREATE TABLE client_requests (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone_number VARCHAR(50),
    request_type VARCHAR(100) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timeline VARCHAR(255),
    budget VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    source VARCHAR(50) DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_client_requests_status ON client_requests(status);
CREATE INDEX idx_client_requests_created_at ON client_requests(created_at);

-- Insert sample data
INSERT INTO client_requests (
    request_id, full_name, email, company, request_type, 
    project_title, description
) VALUES (
    'REQ-SAMPLE-001', 
    'John Doe', 
    'john@example.com', 
    'Test Company',
    'feature',
    'Sample Feature Request',
    'This is a sample request to test the database setup'
);
```

## 3. Environment Variables

Make sure your `.env` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://weuffnieuvybkdplzood.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `/request` page and submit a test request

3. Check your Supabase dashboard → **Table Editor** → `client_requests` to see the data

## 5. Test API Directly

```bash
curl -X POST http://localhost:3000/api/requests/client \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "requestType": "feature", 
    "projectTitle": "Test Project",
    "description": "This is a test request"
  }'
```

That's it! Much simpler than Prisma! 🎉