#!/bin/bash

# QuizWiz AWS Amplify Deployment Script
# This script deploys the QuizWiz frontend to AWS Amplify

set -e

echo "🚀 QuizWiz AWS Amplify Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
print_info "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run: aws configure"
    exit 1
fi
print_status "AWS credentials verified"

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in the right directory
if [ ! -d "quizwiz-app" ]; then
    print_error "quizwiz-app directory not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "quizwiz-app/frontend" ]; then
    print_error "quizwiz-app/frontend directory not found."
    exit 1
fi

print_status "Project structure verified"

# Test build locally first
print_info "Testing local build..."
cd quizwiz-app/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
    print_status "Dependencies installed"
fi

# Test build
print_info "Running test build..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Local build successful"
else
    print_error "Local build failed. Please fix build errors before deploying."
    exit 1
fi

cd "$SCRIPT_DIR"

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    print_warning "Amplify CLI not found. Installing..."
    npm install -g @aws-amplify/cli
    print_status "Amplify CLI installed"
fi

# Initialize Amplify if not already initialized
if [ ! -d "amplify" ]; then
    print_info "Initializing Amplify project..."
    amplify init --yes
    print_status "Amplify project initialized"
fi

# Add hosting if not already added
print_info "Setting up Amplify hosting..."
if ! amplify status 2>/dev/null | grep -q "Hosting"; then
    amplify add hosting
    print_status "Amplify hosting configured"
fi

# Deploy the application
print_info "Deploying to AWS Amplify..."
amplify publish --yes

print_status "Deployment completed!"

echo ""
echo "🎉 Deployment Summary:"
echo "======================"
echo "📱 QuizWiz frontend deployed successfully"
echo "🔧 Build artifacts: quizwiz-app/frontend/build"
echo ""
echo "🧪 Next steps:"
echo "1. Check the Amplify console for your app URL"
echo "2. Configure your backend API endpoint in the frontend"
echo "3. Test the application functionality"
echo ""
echo "🔧 To update your deployment:"
echo "amplify publish"
echo ""
echo "🗑️  To delete your deployment:"
echo "amplify delete"

print_status "QuizWiz frontend is now live on AWS Amplify! 🚀"
