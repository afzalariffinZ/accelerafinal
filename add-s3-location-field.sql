-- Add S3 report location field to client_requests table
-- Run this in your Supabase SQL Editor

-- Add s3_report_location column to store the S3 path of generated reports
ALTER TABLE client_requests 
ADD COLUMN s3_report_location VARCHAR(500);

-- Add an index for faster queries on S3 location
CREATE INDEX idx_client_requests_s3_location ON client_requests(s3_report_location);

-- Add a comment to document the field
COMMENT ON COLUMN client_requests.s3_report_location IS 'S3 location of the generated analysis report (e.g., s3://bucket-name/path/to/report.json)';

-- Update the sample record to include an S3 location for testing
UPDATE client_requests 
SET s3_report_location = 's3://client-data-hfh/llm-generated-reports/report-2025-09-21T13-32-55Z.json'
WHERE request_id = 'REQ-SAMPLE-001';