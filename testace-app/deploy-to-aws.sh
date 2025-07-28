#!/bin/bash

# TestAce AWS Lambda Deployment Script
# Usage: ./deploy-to-aws.sh [stage] [region]

set -e

STAGE=${1:-dev}
REGION=${2:-us-east-1}
BUCKET_PREFIX="testace-frontend"

echo "🚀 Deploying TestAce to AWS Lambda..."
echo "📍 Stage: $STAGE"
echo "🌍 Region: $REGION"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "   unzip awscliv2.zip"
    echo "   sudo ./aws/install"
    exit 1
fi

# Check if Serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed. Installing now..."
    npm install -g serverless
fi

# Check AWS credentials
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"

# Install dependencies
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# Deploy backend
echo ""
echo "📡 Deploying backend to AWS Lambda..."
serverless deploy --stage $STAGE --region $REGION

# Get API Gateway URL
echo "🔗 Getting API Gateway URL..."
API_URL=$(serverless info --stage $STAGE --region $REGION | grep "ServiceEndpoint" | awk '{print $2}')

if [ -z "$API_URL" ]; then
    echo "❌ Failed to get API Gateway URL"
    exit 1
fi

echo "✅ Backend deployed successfully!"
echo "🔗 API URL: $API_URL"

# Update frontend configuration
echo ""
echo "🔧 Updating frontend configuration..."
cd frontend

# Create production environment file
cat > .env.production << EOF
REACT_APP_API_URL=$API_URL/api
REACT_APP_SERVER_URL=$API_URL
GENERATE_SOURCEMAP=false
PUBLIC_URL=/
EOF

echo "✅ Frontend configuration updated"

# Build frontend
echo "🏗️ Building frontend for production..."
npm run build

# Create unique bucket name
BUCKET_NAME="$BUCKET_PREFIX-$STAGE-$(date +%s)"

echo ""
echo "📤 Deploying frontend to S3..."
echo "📦 Bucket name: $BUCKET_NAME"

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Set bucket policy for public read access
cat > ../bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://../bucket-policy.json

# Upload build files
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Set proper content types
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --metadata-directive REPLACE \
  --content-type "text/html" --exclude "*" --include "*.html"
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --metadata-directive REPLACE \
  --content-type "text/css" --exclude "*" --include "*.css"
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --metadata-directive REPLACE \
  --content-type "application/javascript" --exclude "*" --include "*.js"

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Frontend deployed successfully!"
echo "🌐 Website URL: $WEBSITE_URL"

# Clean up
rm ../bucket-policy.json

# Test deployment
echo ""
echo "🧪 Testing deployment..."
cd ..

# Test health endpoint
if curl -s "$API_URL/health" | grep -q "OK"; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

# Test login endpoint
if curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"demo@testace.com","password":"demo123"}' | grep -q "success"; then
    echo "✅ Login endpoint test passed"
else
    echo "❌ Login endpoint test failed"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   🔗 Backend API: $API_URL"
echo "   🌐 Frontend: $WEBSITE_URL"
echo "   📦 S3 Bucket: $BUCKET_NAME"
echo "   📍 Stage: $STAGE"
echo "   🌍 Region: $REGION"
echo ""
echo "🔧 To update the deployment:"
echo "   ./deploy-to-aws.sh $STAGE $REGION"
echo ""
echo "🗑️ To remove the deployment:"
echo "   serverless remove --stage $STAGE --region $REGION"
echo "   aws s3 rb s3://$BUCKET_NAME --force"
echo ""
echo "✨ Your TestAce app is now live on AWS!"
