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

# Create a backend server with Socket.IO support
echo "🔧 Creating backend server with Socket.IO support..."
cd backend

# Create a server with Socket.IO support
cat > server-with-socketio.js << 'EOF'
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

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

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Handle quiz session events
  socket.on('join-quiz', (data) => {
    console.log('🎯 User joined quiz:', data);
    socket.join(`quiz-${data.quizId}`);
    socket.emit('quiz-joined', { success: true, quizId: data.quizId });
  });

  socket.on('submit-answer', (data) => {
    console.log('📝 Answer submitted:', data);
    // Broadcast to quiz room
    socket.to(`quiz-${data.quizId}`).emit('answer-submitted', {
      userId: socket.id,
      answer: data.answer,
      timestamp: new Date()
    });
    
    // Send confirmation back to user
    socket.emit('answer-confirmed', { 
      success: true, 
      questionId: data.questionId,
      timestamp: new Date()
    });
  });

  socket.on('start-quiz', (data) => {
    console.log('🚀 Quiz started:', data);
    io.to(`quiz-${data.quizId}`).emit('quiz-started', {
      quizId: data.quizId,
      startTime: new Date(),
      questions: data.questions || []
    });
  });

  socket.on('end-quiz', (data) => {
    console.log('🏁 Quiz ended:', data);
    io.to(`quiz-${data.quizId}`).emit('quiz-ended', {
      quizId: data.quizId,
      endTime: new Date(),
      results: data.results || {}
    });
  });

  // Handle real-time chat/collaboration
  socket.on('send-message', (data) => {
    console.log('💬 Message sent:', data);
    socket.broadcast.emit('message-received', {
      userId: socket.id,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.broadcast.emit('user-typing', { userId: socket.id, ...data });
  });

  socket.on('typing-stop', (data) => {
    socket.broadcast.emit('user-stopped-typing', { userId: socket.id });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });

  // Send welcome message
  socket.emit('connected', { 
    message: 'Connected to TestAce server', 
    socketId: socket.id,
    timestamp: new Date()
  });
});

// Basic routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    socketIO: 'enabled',
    connections: io.engine.clientsCount
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend with Socket.IO is running', 
    timestamp: new Date().toISOString(),
    activeConnections: io.engine.clientsCount
  });
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
      },
      {
        id: '2',
        content: 'What is the capital of France?',
        type: 'multiple_choice',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
        explanation: 'Paris is the capital and largest city of France',
        subject: 'Geography',
        difficulty: 'easy'
      }
    ]
  });
});

// Dashboard data endpoint
app.get('/api/users/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        username: 'demo',
        profile: {
          firstName: 'Demo',
          lastName: 'User',
          avatar: '',
        },
        stats: {
          totalQuestions: 120,
          correctAnswers: 98,
          accuracy: 81.67,
          totalStudyTime: 14400 // 4 hours in seconds
        },
        streaks: {
          current: 5,
          longest: 12
        }
      },
      recentSessions: [
        {
          _id: '1',
          subject: 'Math',
          mode: 'practice',
          score: 85,
          questionsCount: 20,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          subject: 'Science',
          mode: 'timed',
          score: 75,
          questionsCount: 15,
          createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
        }
      ],
      dailyChallengeStatus: {
        completed: false,
        score: null,
        completedAt: null
      },
      weekStats: {
        sessionsCompleted: 8,
        questionsAnswered: 120,
        averageAccuracy: 81.67,
        studyTime: 240 // minutes
      },
      studyRecommendations: [
        'Focus on Algebra concepts based on your recent performance',
        'Try more timed practice sessions to improve speed',
        'Review Chemistry formulas where accuracy is below 70%',
        'Consider taking a full practice test this weekend'
      ]
    }
  });
});

// Quiz session routes
app.post('/api/quiz/start', (req, res) => {
  const quizId = 'quiz-' + Date.now();
  res.json({
    success: true,
    quizId: quizId,
    message: 'Quiz session created',
    socketEndpoint: '/socket.io/'
  });
});

app.get('/api/quiz/:quizId/status', (req, res) => {
  const { quizId } = req.params;
  res.json({
    success: true,
    quizId: quizId,
    status: 'active',
    participants: io.sockets.adapter.rooms.get(`quiz-${quizId}`)?.size || 0
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Backend server with Socket.IO running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO endpoint: http://localhost:${PORT}/socket.io/`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});
EOF

# Create socket service for frontend
echo "🔧 Creating socket service for frontend..."
cd ../frontend/src/services

# Create socket service if it doesn't exist
if [ ! -f "socketService.ts" ]; then
  cat > socketService.ts << 'EOF'
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private connectionAttempts = 0;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds

  connect() {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    
    try {
      console.log('Attempting to connect to socket server:', serverUrl);
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully:', this.socket?.id);
        this.connectionAttempts = 0;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.handleConnectionError();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      return this.socket;
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.handleConnectionError();
      return null;
    }
  }

  private handleConnectionError() {
    this.connectionAttempts++;
    
    if (this.connectionAttempts <= this.maxRetries) {
      console.log(`Retrying connection (${this.connectionAttempts}/${this.maxRetries}) in ${this.retryDelay}ms`);
      setTimeout(() => this.connect(), this.retryDelay);
    } else {
      console.error(`Failed to connect after ${this.maxRetries} attempts. Socket functionality will be limited.`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }

  emit(event: string, data: any) {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected, attempting to reconnect...');
      this.connect();
      // Queue the event to be sent after connection
      setTimeout(() => {
        if (this.socket?.connected) {
          this.socket.emit(event, data);
        } else {
          console.error('Failed to emit event, socket still not connected');
        }
      }, 1000);
      return;
    }
    
    this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      this.connect();
    }
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
EOF
fi

cd ../../..

# Start the backend with Socket.IO
echo "🔧 Starting backend server with Socket.IO..."
cd backend
node server-with-socketio.js &
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
echo "Backend:  http://localhost:5000 (with Socket.IO support)"
echo "Frontend: http://localhost:3000"
echo ""
echo "Note: This backend includes Socket.IO support for real-time features."
echo "The dashboard and socket connections should work properly now."
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
