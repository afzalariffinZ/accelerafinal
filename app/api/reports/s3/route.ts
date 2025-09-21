import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '@/lib/aws-config';

// Get S3 client (works for both local and AWS Amplify)
const s3Client = getS3Client();

export async function POST(request: NextRequest) {
  try {
    const { s3Location } = await request.json();
    
    if (!s3Location) {
      return NextResponse.json({
        success: false,
        error: 'S3 location is required'
      }, { status: 400 });
    }
    
    // Parse S3 location (e.g., "s3://bucket-name/path/to/file.json")
    let bucketName: string;
    let key: string;
    
    try {
      if (s3Location.startsWith('s3://')) {
        const s3Url = new URL(s3Location);
        bucketName = s3Url.hostname;
        key = s3Url.pathname.substring(1); // Remove leading slash
      } else {
        // Handle case where it's just bucket/key format
        const parts = s3Location.split('/');
        bucketName = parts[0];
        key = parts.slice(1).join('/');
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid S3 location format'
      }, { status: 400 });
    }
    
    // Fetch the object from S3
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    
    try {
      const result = await s3Client.send(command);
      
      if (!result.Body) {
        return NextResponse.json({
          success: false,
          error: 'No data found in S3 object'
        }, { status: 404 });
      }
      
      // Convert stream to string
      const bodyContents = await result.Body.transformToString();
      
      // Parse the JSON data
      const reportData = JSON.parse(bodyContents);
      
      return NextResponse.json({
        success: true,
        data: reportData
      });
      
    } catch (s3Error: any) {
      console.error('S3 Error:', s3Error);
      
      if (s3Error.name === 'NoSuchKey') {
        return NextResponse.json({
          success: false,
          error: 'Report file not found in S3'
        }, { status: 404 });
      }
      
      if (s3Error.name === 'NoSuchBucket') {
        return NextResponse.json({
          success: false,
          error: 'S3 bucket not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: false,
        error: `S3 Error: ${s3Error.message}`
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Error fetching from S3:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch report from S3'
    }, { status: 500 });
  }
}

// GET method to test S3 connection
export async function GET() {
  try {
    // Test with a simple list operation (if you have permissions)
    return NextResponse.json({
      success: true,
      message: 'S3 API endpoint is working',
      config: {
        region: process.env.AWS_REGION || 'us-east-1',
        hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'S3 configuration error'
    }, { status: 500 });
  }
}