// AWS Configuration optimized for AWS Amplify deployment
// This automatically detects Amplify environment and uses appropriate credentials

import { S3Client } from '@aws-sdk/client-s3';

// Configuration that works in both local development and AWS Amplify
const getS3Client = () => {
  // Check if running on AWS Amplify (has AWS_REGION by default)
  const isAmplify = process.env.AWS_REGION && !process.env.AWS_ACCESS_KEY_ID;
  
  if (isAmplify) {
    // Running on AWS Amplify - use default AWS credentials (IAM role)
    console.log('Using AWS Amplify default credentials');
    return new S3Client({
      region: process.env.AWS_REGION
    });
  } else {
    // Running locally - use access keys from .env.local
    console.log('Using local development credentials');
    return new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }
};

export { getS3Client };