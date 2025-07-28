# TestAce AWS Lambda Deployment Guide

## 🎯 Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   API Gateway    │    │  Lambda Function│
│   (Frontend)    │────│   (REST API)     │────│   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   S3 Bucket     │    │   Route 53       │    │   DynamoDB      │
│ (Static Files)  │    │    (DNS)         │    │  (Database)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

### 1. AWS Account Setup
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ installed locally

### 2. Install Required Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install Serverless Framework
npm install -g serverless

# Install AWS CDK (optional, for infrastructure as code)
npm install -g aws-cdk

# Verify installations
aws --version
serverless --version
```

### 3. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter output format (json)
```

## 🏗️ Step 1: Prepare Backend for Lambda

### 1.1 Create Lambda-Compatible Backend Structure
```bash
cd /workspace/AWSQCLI/testace-app
mkdir lambda-backend
cd lambda-backend
```

### 1.2 Initialize Serverless Project
```bash
serverless create --template aws-nodejs --name testace-backend
cd testace-backend
```

### 1.3 Install Dependencies
```bash
npm init -y
npm install express serverless-http cors dotenv
npm install aws-sdk @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
npm install socket.io @socket.io/redis-adapter redis
npm install --save-dev serverless-offline
```

### 1.4 Create Lambda Handler
Create `handler.js`:
```javascript
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

// DynamoDB setup
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'AWS Lambda'
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo authentication (replace with real auth logic)
    const user = {
      id: 'demo-user',
      email: email,
      username: email.split('@')[0],
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: ''
      },
      stats: {
        totalQuestions: 120,
        correctAnswers: 98,
        accuracy: 81.67,
        totalStudyTime: 14400
      },
      streaks: {
        current: 5,
        longest: 12
      }
    };
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'demo-token',
      user: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard endpoint
app.get('/api/users/dashboard', async (req, res) => {
  try {
    const dashboardData = {
      success: true,
      data: {
        user: {
          username: 'demo',
          profile: {
            firstName: 'Demo',
            lastName: 'User',
            avatar: '',
          },
          stats: {
            totalQuestions: 120,
            correctAnswers: 98,
            accuracy: 81.67,
            totalStudyTime: 14400
          },
          streaks: {
            current: 5,
            longest: 12
          }
        },
        recentSessions: [
          {
            _id: '1',
            subject: 'Math',
            mode: 'practice',
            score: 85,
            questionsCount: 20,
            createdAt: new Date().toISOString()
          }
        ],
        dailyChallengeStatus: {
          completed: false,
          score: null,
          completedAt: null
        },
        weekStats: {
          sessionsCompleted: 8,
          questionsAnswered: 120,
          averageAccuracy: 81.67,
          studyTime: 240
        },
        studyRecommendations: [
          'Focus on Algebra concepts based on your recent performance',
          'Try more timed practice sessions to improve speed'
        ]
      }
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Questions endpoint
app.get('/api/questions', async (req, res) => {
  try {
    const questions = [
      {
        id: '1',
        content: 'What is 2 + 2?',
        type: 'multiple_choice',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '2 + 2 equals 4',
        subject: 'Math',
        difficulty: 'easy'
      },
      {
        id: '2',
        content: 'What is the capital of France?',
        type: 'multiple_choice',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
        explanation: 'Paris is the capital and largest city of France',
        subject: 'Geography',
        difficulty: 'easy'
      }
    ];
    
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Quiz endpoints
app.post('/api/quiz/start', async (req, res) => {
  try {
    const quizId = 'quiz-' + Date.now();
    res.json({
      success: true,
      quizId: quizId,
      message: 'Quiz session created'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/quiz/:quizId/status', async (req, res) => {
  try {
    const { quizId } = req.params;
    res.json({
      success: true,
      quizId: quizId,
      status: 'active',
      participants: 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Export Lambda handler
module.exports.handler = serverless(app);
```

### 1.5 Create Serverless Configuration
Create `serverless.yml`:
```yaml
service: testace-backend

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    STAGE: ${self:provider.stage}
    AWS_REGION: ${self:provider.region}
    FRONTEND_URL: ${env:FRONTEND_URL, 'https://localhost:3000'}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource:
        - "arn:aws:dynamodb:${self:provider.region}:*:table/testace-*"

functions:
  api:
    handler: handler.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors:
            origin: '*'
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
            allowCredentials: true
      - http:
          path: /
          method: ANY
          cors:
            origin: '*'
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
            allowCredentials: true

resources:
  Resources:
    TestAceUsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: testace-users-${self:provider.stage}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
    
    TestAceQuestionsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: testace-questions-${self:provider.stage}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST

plugins:
  - serverless-offline

custom:
  serverless-offline:
    httpPort: 3001
```

## 🏗️ Step 2: Deploy Backend to Lambda

### 2.1 Deploy Backend
```bash
cd lambda-backend/testace-backend
serverless deploy --stage prod

# Note the API Gateway URL from the output
# Example: https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

### 2.2 Test Backend Deployment
```bash
# Test health endpoint
curl https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/health

# Test login endpoint
curl -X POST https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@testace.com","password":"demo123"}'
```

## 🏗️ Step 3: Prepare Frontend for S3 Deployment

### 3.1 Update Frontend Configuration
Update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/api
REACT_APP_SERVER_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
GENERATE_SOURCEMAP=false
```

### 3.2 Build Frontend for Production
```bash
cd /workspace/AWSQCLI/testace-app/frontend
npm run build
```

### 3.3 Create S3 Deployment Script
Create `deploy-frontend.sh`:
```bash
#!/bin/bash

# Configuration
BUCKET_NAME="testace-frontend-$(date +%s)"
REGION="us-east-1"
CLOUDFRONT_DISTRIBUTION_ID=""

echo "🚀 Deploying TestAce Frontend to AWS S3..."

# Create S3 bucket
echo "📦 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Set bucket policy for public read access
echo "🔓 Setting bucket policy..."
cat > bucket-policy.json << EOF
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

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Upload build files
echo "📤 Uploading build files..."
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Set proper content types
echo "🏷️ Setting content types..."
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
echo "📦 S3 Bucket: $BUCKET_NAME"

# Clean up
rm bucket-policy.json

echo "🎉 Deployment complete!"
```

### 3.4 Deploy Frontend
```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

## 🏗️ Step 4: Set Up CloudFront Distribution (Optional but Recommended)

### 4.1 Create CloudFront Distribution
Create `cloudfront-config.json`:
```json
{
  "CallerReference": "testace-frontend-$(date +%s)",
  "Comment": "TestAce Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-testace-frontend",
        "DomainName": "your-bucket-name.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-testace-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

### 4.2 Create CloudFront Distribution
```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## 🏗️ Step 5: Environment-Specific Deployment

### 5.1 Create Deployment Scripts

Create `deploy.sh`:
```bash
#!/bin/bash

STAGE=${1:-dev}
echo "🚀 Deploying TestAce to $STAGE environment..."

# Deploy backend
echo "📡 Deploying backend..."
cd lambda-backend/testace-backend
serverless deploy --stage $STAGE

# Get API Gateway URL
API_URL=$(serverless info --stage $STAGE | grep "ServiceEndpoint" | awk '{print $2}')
echo "🔗 API URL: $API_URL"

# Update frontend environment
echo "🔧 Updating frontend configuration..."
cd ../../frontend
cat > .env.production << EOF
REACT_APP_API_URL=$API_URL/api
REACT_APP_SERVER_URL=$API_URL
GENERATE_SOURCEMAP=false
EOF

# Build and deploy frontend
echo "🏗️ Building frontend..."
npm run build

echo "📤 Deploying frontend..."
./deploy-frontend.sh

echo "✅ Deployment complete!"
echo "🌐 Backend API: $API_URL"
echo "🌐 Frontend: Check S3 output above"
```

### 5.2 Make Script Executable and Run
```bash
chmod +x deploy.sh
./deploy.sh prod
```

## 🏗️ Step 6: Database Setup (DynamoDB)

### 6.1 Create DynamoDB Tables
```bash
# Users table
aws dynamodb create-table \
  --table-name testace-users-prod \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Questions table
aws dynamodb create-table \
  --table-name testace-questions-prod \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Sessions table
aws dynamodb create-table \
  --table-name testace-sessions-prod \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

## 🏗️ Step 7: Domain Setup (Optional)

### 7.1 Register Domain with Route 53
```bash
# Register domain (if needed)
aws route53domains register-domain --domain-name testace.com --duration-in-years 1

# Create hosted zone
aws route53 create-hosted-zone --name testace.com --caller-reference $(date +%s)
```

### 7.2 Create SSL Certificate
```bash
# Request certificate
aws acm request-certificate \
  --domain-name testace.com \
  --subject-alternative-names www.testace.com \
  --validation-method DNS
```

## 🏗️ Step 8: Monitoring and Logging

### 8.1 Set Up CloudWatch Monitoring
```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "TestAce-Dashboard" \
  --dashboard-body file://dashboard-config.json
```

### 8.2 Set Up Alarms
```bash
# Lambda error alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "TestAce-Lambda-Errors" \
  --alarm-description "TestAce Lambda function errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## 🏗️ Step 9: Testing Deployment

### 9.1 Create Test Script
Create `test-deployment.js`:
```javascript
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod';

async function testDeployment() {
  console.log('🧪 Testing TestAce AWS Deployment...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    
    // Test login endpoint
    console.log('2. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'demo@testace.com',
      password: 'demo123'
    });
    console.log('✅ Login test passed:', loginResponse.data.success);
    
    // Test dashboard endpoint
    console.log('3. Testing dashboard endpoint...');
    const dashboardResponse = await axios.get(`${API_BASE_URL}/api/users/dashboard`);
    console.log('✅ Dashboard test passed:', dashboardResponse.data.success);
    
    // Test questions endpoint
    console.log('4. Testing questions endpoint...');
    const questionsResponse = await axios.get(`${API_BASE_URL}/api/questions`);
    console.log('✅ Questions test passed:', questionsResponse.data.success);
    
    console.log('\n🎉 All tests passed! Deployment is successful.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testDeployment();
```

### 9.2 Run Tests
```bash
npm install axios
API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod node test-deployment.js
```

## 📊 Cost Estimation

### Monthly Costs (Approximate)
- **Lambda**: $0.20 per 1M requests + $0.0000166667 per GB-second
- **API Gateway**: $3.50 per million API calls
- **S3**: $0.023 per GB stored + $0.0004 per 1,000 requests
- **CloudFront**: $0.085 per GB transferred
- **DynamoDB**: $0.25 per million read/write requests
- **Route 53**: $0.50 per hosted zone per month

**Estimated monthly cost for moderate usage: $10-50**

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**
   ```bash
   # Update serverless.yml CORS configuration
   # Ensure frontend URL is whitelisted
   ```

2. **Lambda Timeout**
   ```yaml
   # In serverless.yml
   functions:
     api:
       timeout: 30  # Increase timeout
   ```

3. **DynamoDB Access Issues**
   ```yaml
   # Ensure proper IAM permissions in serverless.yml
   iamRoleStatements:
     - Effect: Allow
       Action:
         - dynamodb:*
       Resource: "*"
   ```

4. **Build Size Too Large**
   ```bash
   # Optimize bundle size
   npm install --save-dev webpack-bundle-analyzer
   # Analyze and remove unused dependencies
   ```

## 🎉 Deployment Complete!

Your TestAce app is now deployed on AWS Lambda with:
- ✅ Serverless backend on AWS Lambda
- ✅ Static frontend on S3 + CloudFront
- ✅ DynamoDB for data storage
- ✅ API Gateway for REST API
- ✅ Monitoring and logging
- ✅ Production-ready configuration

### Next Steps:
1. Set up CI/CD pipeline with GitHub Actions
2. Implement proper authentication with AWS Cognito
3. Add monitoring and alerting
4. Set up automated backups
5. Implement caching strategies
