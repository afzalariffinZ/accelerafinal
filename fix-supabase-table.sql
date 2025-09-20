-- Quick fix for Supabase table
-- Run this in your Supabase SQL Editor

-- Drop existing table if it exists (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS client_requests CASCADE;

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
    -- AI Enhanced Summary fields
    executive_summary TEXT,
    technical_analysis TEXT,
    implementation_strategy TEXT,
    financial_optimization TEXT,
    risk_assessment TEXT,
    next_steps TEXT, -- JSON array stored as text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_client_requests_status ON client_requests(status);
CREATE INDEX idx_client_requests_created_at ON client_requests(created_at);

-- Insert sample data to test
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

-- Verify the table was created correctly
SELECT * FROM client_requests;