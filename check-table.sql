-- Check if table exists and has correct columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'client_requests' 
ORDER BY ordinal_position;