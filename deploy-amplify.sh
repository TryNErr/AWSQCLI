#!/bin/bash

# QuizWiz AWS Amplify Deployment Script
# This script sets up and deploys both frontend and backend to AWS Amplify

set -e

echo "🚀 QuizWiz AWS Amplify Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
    print_error "AWS CLI is not installed. Please install it first:"
    echo "curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "unzip awscliv2.zip"
    echo "sudo ./aws/install"
    exit 1
fi

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    print_warning "Amplify CLI not found. Installing..."
    npm install -g @aws-amplify/cli
    print_status "Amplify CLI installed"
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

print_status "Project structure verified"

# Install dependencies
print_info "Installing dependencies..."
cd quizwiz-app/frontend
if [ ! -d "node_modules" ]; then
    npm install
    print_status "Frontend dependencies installed"
else
    print_status "Frontend dependencies already installed"
fi

cd ../backend
if [ ! -d "node_modules" ]; then
    npm install
    print_status "Backend dependencies installed"
else
    print_status "Backend dependencies already installed"
fi

cd "$SCRIPT_DIR"

# Initialize Amplify if not already initialized
if [ ! -d "amplify" ]; then
    print_info "Initializing Amplify project..."
    amplify init --yes
    print_status "Amplify project initialized"
else
    print_status "Amplify project already initialized"
fi

# Set monorepo environment variable
print_info "Setting monorepo configuration..."
if amplify env get --name AMPLIFY_MONOREPO_APP_ROOT &> /dev/null; then
    print_status "AMPLIFY_MONOREPO_APP_ROOT already set"
else
    amplify env add --name AMPLIFY_MONOREPO_APP_ROOT --value quizwiz-app
    print_status "AMPLIFY_MONOREPO_APP_ROOT set to 'quizwiz-app'"
fi

# Add hosting if not already added
print_info "Setting up Amplify hosting..."
if ! amplify status | grep -q "Hosting"; then
    amplify add hosting
    print_status "Amplify hosting configured"
else
    print_status "Amplify hosting already configured"
fi

# Deploy the application
print_info "Deploying to AWS Amplify..."
amplify publish --yes

print_status "Deployment completed!"

# Get the app URL
APP_URL=$(amplify status | grep -o 'https://[^[:space:]]*\.amplifyapp\.com' | head -1)

if [ -n "$APP_URL" ]; then
    echo ""
    echo "🎉 Deployment Summary:"
    echo "======================"
    echo "🌐 Frontend URL: $APP_URL"
    echo "📱 App Status: Live and accessible"
    echo "🔧 Monorepo Root: quizwiz-app"
    echo ""
    echo "🧪 Test your deployment:"
    echo "curl -I $APP_URL"
    echo ""
    echo "🔧 To update your deployment:"
    echo "amplify publish"
    echo ""
    echo "🗑️  To delete your deployment:"
    echo "amplify delete"
    echo ""
    echo "⚙️  Environment Variables Set:"
    echo "   AMPLIFY_MONOREPO_APP_ROOT=quizwiz-app"
else
    print_warning "Could not retrieve app URL. Check Amplify console for details."
fi

echo ""
print_status "QuizWiz is now live on AWS Amplify! 🚀"
