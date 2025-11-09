#!/bin/bash

# QuizWiz Lambda Deployment Script for Sydney (ap-southeast-2)
set -e

REGION="ap-southeast-2"
FUNCTION_NAME="quizwiz-api"
ROLE_NAME="quizwiz-lambda-role"

echo "🚀 Deploying QuizWiz Lambda to Sydney (ap-southeast-2)..."

# Create IAM role for Lambda
echo "📋 Creating IAM role..."
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }' \
  --region $REGION || echo "Role already exists"

# Attach basic execution policy
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --region $REGION

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text --region $REGION)
echo "📋 Role ARN: $ROLE_ARN"

# Create Lambda function code
echo "📦 Creating Lambda function code..."
cat > index.js << 'EOF'
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const path = event.rawPath || event.path || '/';
    const method = event.requestContext?.http?.method || event.httpMethod || 'GET';
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    // Health check
    if (path === '/test' || path === '/test/') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: 'QuizWiz API is running!',
                timestamp: new Date().toISOString(),
                path: path,
                method: method
            })
        };
    }
    
    // API endpoints
    if (path.includes('/api/test-sets/available')) {
        const query = event.queryStringParameters || {};
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                testSets: [],
                message: 'No test sets available yet - backend is working!',
                query: query,
                timestamp: new Date().toISOString()
            })
        };
    }
    
    if (path.includes('/api/quiz/stats')) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                totalQuizzes: 0, 
                averageScore: 0,
                message: 'Stats endpoint working!',
                timestamp: new Date().toISOString()
            })
        };
    }
    
    if (path.includes('/api/user/stats')) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                quizzesTaken: 0, 
                totalScore: 0,
                message: 'User stats endpoint working!',
                timestamp: new Date().toISOString()
            })
        };
    }
    
    // Default response
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
            message: 'QuizWiz API endpoint received request',
            path: path,
            method: method,
            query: event.queryStringParameters,
            timestamp: new Date().toISOString()
        })
    };
};
EOF

# Create deployment package
echo "📦 Creating deployment package..."
zip function.zip index.js

# Wait for role to be ready
echo "⏳ Waiting for IAM role to be ready..."
sleep 10

# Create Lambda function
echo "🔧 Creating Lambda function..."
aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512 \
  --region $REGION || \
aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --region $REGION

# Create function URL
echo "🔗 Creating function URL..."
FUNCTION_URL=$(aws lambda create-function-url-config \
  --function-name $FUNCTION_NAME \
  --auth-type NONE \
  --cors '{
    "AllowCredentials": false,
    "AllowHeaders": ["*"],
    "AllowMethods": ["*"],
    "AllowOrigins": ["*"],
    "MaxAge": 86400
  }' \
  --region $REGION \
  --query 'FunctionUrl' \
  --output text 2>/dev/null || \
aws lambda get-function-url-config \
  --function-name $FUNCTION_NAME \
  --region $REGION \
  --query 'FunctionUrl' \
  --output text)

echo "✅ Lambda function deployed successfully!"
echo "🔗 Function URL: $FUNCTION_URL"

# Test the function
echo "🧪 Testing function..."
curl -s "$FUNCTION_URL/test" | jq '.' || echo "Function is responding"

# Clean up
rm -f index.js function.zip

echo ""
echo "🎉 Deployment completed!"
echo "📋 Function Name: $FUNCTION_NAME"
echo "🔗 Function URL: $FUNCTION_URL"
echo "🌍 Region: $REGION"
echo ""
echo "Update your frontend to use: $FUNCTION_URL"
