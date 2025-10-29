#!/bin/bash

echo "🚀 Starting QuizWiz Development Environment..."

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if MongoDB container is running
if ! docker ps | grep -q mongodb; then
    echo "📦 Starting MongoDB container..."
    docker run -d --name mongodb -p 27017:27017 mongo:latest
    sleep 3
fi

echo "✅ MongoDB is running"

# Start backend in background
echo "🔧 Starting backend server..."
cd "$SCRIPT_DIR/backend" && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd "$SCRIPT_DIR/frontend" && npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 QuizWiz is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🧪 Test User: test@quizwiz.com / password123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $FRONTEND_PID $BACKEND_PID
