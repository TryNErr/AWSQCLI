#!/bin/bash

# TestAce Local Development Startup Script

echo "🚀 Starting TestAce Application Locally..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📋 Pre-flight checks..."

# Check if MongoDB is running (optional - will use default connection)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Starting with default connection..."
    fi
else
    echo "⚠️  MongoDB not found. Using default connection..."
fi

echo ""
echo "🔧 Installing dependencies..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "📝 Generating static questions..."
cd ..
if [ ! -d "public/questions" ]; then
    npm run generate-questions
else
    echo "✅ Static questions already generated"
fi

echo ""
echo "🚀 Starting services..."

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend development server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ TestAce Application Started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "🏥 Health:   http://localhost:5000/health"
echo ""
echo "📊 Question Banks Status:"
npm run question-status 2>/dev/null | tail -5
echo ""
echo "💡 Tips:"
echo "   - Press Ctrl+C to stop all services"
echo "   - Check question banks: npm run question-status"
echo "   - Add more questions: npm run question-add <grade> <difficulty> <subject> <count>"
echo ""
echo "⏳ Services are running... Press Ctrl+C to stop"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
