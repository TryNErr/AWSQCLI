#!/bin/bash

echo "🚀 Starting TestAce Development Environment (Simple Mode)"
echo "======================================================="

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "🐳 Stopping MongoDB container..."
    docker-compose -f docker-compose.local.yml stop mongodb
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start MongoDB if not already running
if ! docker ps | grep -q testace-mongodb-local; then
    echo "🐳 Starting MongoDB container..."
    docker-compose -f docker-compose.local.yml up -d mongodb
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 10
else
    echo "✅ MongoDB container is already running"
fi

# Install frontend dependencies if not present
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start backend server using the built JavaScript files
echo "🔧 Starting backend server (using built JS)..."
cd backend
if [ ! -d "dist" ]; then
    echo "📦 Building backend first..."
    npm run build || {
        echo "❌ Build failed, trying to start with nodemon anyway..."
        NODE_ENV=development node -r ts-node/register src/server.ts &
        BACKEND_PID=$!
    }
else
    NODE_ENV=development node dist/server.js &
    BACKEND_PID=$!
fi
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
echo "✅ All services are running!"
echo "MongoDB:  localhost:27017 (Docker container)"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
