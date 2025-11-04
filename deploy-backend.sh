#!/bin/bash
# Deploy QuizWiz Backend (FREE with AWS Lambda)

set -e

echo "🚀 Deploying QuizWiz Backend (FREE Tier)"
echo "========================================"

cd quizwiz-app

# Install serverless if not installed
if ! command -v serverless &> /dev/null; then
    echo "Installing Serverless Framework..."
    npm install -g serverless
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install && cd ..

# Deploy using serverless
echo "Deploying to AWS Lambda..."
serverless deploy --stage prod --region us-east-1

# Get the API endpoint
echo ""
echo "🎉 Backend Deployed Successfully!"
echo "================================="
echo ""
echo "📋 Next Steps:"
echo "1. Copy the API Gateway URL from above"
echo "2. Update frontend/.env.production.local with the real URL"
echo "3. Redeploy frontend: git commit + push"
echo ""
echo "💰 Cost: $0/month (within free tier limits)"
echo "📊 Free tier includes:"
echo "   - 1M Lambda requests/month"
echo "   - 1M API Gateway calls/month"
echo "   - 400K GB-seconds compute time"
