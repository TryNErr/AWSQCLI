#!/bin/bash

echo "🚀 Setting up TestAce Local Development Environment"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start MongoDB using Docker Compose
echo "🐳 Starting local MongoDB container..."
docker-compose -f docker-compose.local.yml up -d mongodb
if [ $? -ne 0 ]; then
    echo "❌ Failed to start MongoDB container"
    exit 1
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

# Check if MongoDB is accessible
echo "🔍 Checking MongoDB connection..."
timeout 30 bash -c 'until docker exec testace-mongodb-local mongosh --eval "db.adminCommand(\"ping\")" > /dev/null 2>&1; do sleep 1; done'
if [ $? -ne 0 ]; then
    echo "❌ MongoDB is not responding. Please check the container logs."
    docker logs testace-mongodb-local
    exit 1
fi

echo "✅ MongoDB is running and accessible"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
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
echo "🎉 Local setup completed successfully!"
echo ""
echo "MongoDB is running in Docker container on port 27017"
echo ""
echo "To start the development servers:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Or use the start script: ./start-local.sh"
echo ""
echo "Demo credentials:"
echo "Email: demo@testace.com"
echo "Password: demo123"
echo ""
echo "To stop MongoDB: docker-compose -f docker-compose.local.yml down"
echo "To view MongoDB logs: docker logs testace-mongodb-local"
