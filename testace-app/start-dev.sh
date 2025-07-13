#!/bin/bash

echo "🚀 Starting TestAce Development Servers"
echo "======================================"

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start backend server
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "Backend server started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "✅ Both servers are running!"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait
