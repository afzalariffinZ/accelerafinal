// Test AWS S3 connection
// You can run this in your browser console or create a test endpoint

// Test the S3 API endpoint
async function testS3Connection() {
  try {
    const response = await fetch('/api/reports/s3', {
      method: 'GET'
    });
    
    const result = await response.json();
    console.log('S3 Test Result:', result);
    
    if (result.success) {
      console.log('✅ S3 configuration is working!');
      console.log('Region:', result.config.region);
      console.log('Has credentials:', result.config.hasCredentials);
    } else {
      console.log('❌ S3 configuration error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error);
  }
}

// Test fetching a specific S3 file
async function testS3Fetch() {
  const testS3Location = 's3://client-data-hfh/llm-generated-reports/report-2025-09-21T13-32-55Z.json';
  
  try {
    const response = await fetch('/api/reports/s3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        s3Location: testS3Location
      }),
    });
    
    const result = await response.json();
    console.log('S3 Fetch Result:', result);
    
    if (result.success) {
      console.log('✅ Successfully fetched report from S3!');
      console.log('Report data:', result.data);
    } else {
      console.log('❌ Failed to fetch from S3:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error);
  }
}

// Run tests
console.log('Testing S3 connection...');
testS3Connection();

console.log('Testing S3 file fetch...');
testS3Fetch();