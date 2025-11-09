#!/bin/bash

echo "🚀 Deploying Quiz_App to AWS Amplify..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Navigate to Quiz_App directory
cd Quiz_App

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Quiz_App ready for deployment!"
echo "📋 Next steps:"
echo "1. Push this branch to origin: git push origin quiz-app-amplify-v2"
echo "2. Create Amplify app in AWS Console pointing to this branch"
echo "3. Set build settings to use amplify.yml"
echo "4. Deploy!"

echo ""
echo "🌐 Manual Amplify Console Setup:"
echo "- App name: Quiz_App"
echo "- Repository: your-repo"
echo "- Branch: quiz-app-amplify-v2"
echo "- Build settings: Use amplify.yml"
