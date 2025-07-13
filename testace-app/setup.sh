#!/bin/bash

echo "🚀 Setting up TestAce Development Environment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB and try again."
    echo "   You can start MongoDB with: sudo systemctl start mongod"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual values (especially OPENAI_API_KEY)"
fi

# Build backend
echo "🔨 Building backend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build backend"
    exit 1
fi

# Seed database
echo "🌱 Seeding database with sample data..."
npx ts-node src/scripts/seedData.ts
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the development servers:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Demo credentials:"
echo "Email: demo@testace.com"
echo "Password: demo123"
echo ""
echo "Make sure to:"
echo "1. Update backend/.env with your OpenAI API key"
echo "2. Start MongoDB if not already running"
echo "3. Start both backend and frontend servers"
