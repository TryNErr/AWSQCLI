#!/bin/bash

echo "🚀 Starting TestAce Development Environment (Working Mode)"
echo "========================================================="

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

# Create a simple backend server that works
echo "🔧 Creating simplified backend server..."
cd backend

# Create a minimal working server
cat > simple-server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testace')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Basic routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running', timestamp: new Date().toISOString() });
});

// Placeholder auth routes
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Demo login successful',
    token: 'demo-token',
    user: { id: 'demo-user', email: 'demo@testace.com', username: 'demo' }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Demo registration successful',
    token: 'demo-token',
    user: { id: 'demo-user', email: req.body.email, username: req.body.username }
  });
});

// Placeholder question routes
app.get('/api/questions', (req, res) => {
  res.json({
    success: true,
    questions: [
      {
        id: '1',
        content: 'What is 2 + 2?',
        type: 'multiple_choice',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '2 + 2 equals 4',
        subject: 'Math',
        difficulty: 'easy'
      }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
EOF

# Start the simplified backend
echo "🔧 Starting simplified backend server..."
node simple-server.js &
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
echo "✅ All services are running!"
echo "MongoDB:  localhost:27017 (Docker container)"
echo "Backend:  http://localhost:5000 (simplified version)"
echo "Frontend: http://localhost:3000"
echo ""
echo "Note: This is a simplified backend for development."
echo "Some features may not work until TypeScript issues are resolved."
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
