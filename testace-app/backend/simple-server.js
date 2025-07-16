const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Socket.IO setup with proper CORS and Gitpod compatibility
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      /https:\/\/3000-.*\.gitpod\.io$/,
      /https:\/\/.*\.ws-.*\.gitpod\.io$/
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'], // Prioritize polling for Gitpod
  allowEIO3: true, // Allow Engine.IO v3 clients
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    /https:\/\/3000-.*\.gitpod\.io$/,
    /https:\/\/.*\.ws-.*\.gitpod\.io$/
  ],
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
          grade: '12',
          subjects: ['Math', 'Science', 'English'],
          targetTests: ['SAT', 'ACT']
        },
        stats: {
          totalSessions: 25,
          averageScore: 85,
          timeSpent: 1200,
          questionsAnswered: 450,
          correctAnswers: 382,
          accuracy: 85
        },
        streaks: {
          current: 7,
          longest: 15,
          lastActivity: new Date().toISOString()
        }
      },
      recentSessions: [
        {
          _id: '1',
          id: '1',
          type: 'practice',
          mode: 'practice',
          subject: 'Math',
          score: 88,
          questionsAnswered: 20,
          questionsCount: 20,
          timeSpent: 25,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '2',
          id: '2',
          type: 'timed_test',
          mode: 'timed_test',
          subject: 'English',
          score: 92,
          questionsAnswered: 15,
          questionsCount: 15,
          timeSpent: 30,
          completedAt: new Date(Date.now() - 172800000).toISOString(),
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '3',
          id: '3',
          type: 'daily_challenge',
          mode: 'daily_challenge',
          subject: 'Science',
          score: 78,
          questionsAnswered: 10,
          questionsCount: 10,
          timeSpent: 15,
          completedAt: new Date(Date.now() - 259200000).toISOString(),
          createdAt: new Date(Date.now() - 259200000).toISOString()
        }
      ],
      dailyChallengeStatus: {
        completed: false,
        score: null,
        completedAt: null
      },
      weekStats: {
        sessionsCompleted: 12,
        questionsAnswered: 180,
        averageAccuracy: 87,
        studyTime: 320
      },
      studyRecommendations: [
        "Focus more on algebra problems to improve your math scores",
        "Practice reading comprehension daily for 15 minutes",
        "Review grammar rules, especially comma usage",
        "Take more timed practice tests to improve speed",
        "Work on science vocabulary to boost your science scores"
      ]
    }
  });
});

// User profile endpoint
app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'demo-user',
      email: 'demo@testace.com',
      username: 'demo',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        grade: '12',
        subjects: ['Math', 'Science', 'English'],
        targetTests: ['SAT', 'ACT']
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle practice session events
  socket.on('start-practice', (data) => {
    console.log('🎯 Practice session started:', data);
    socket.emit('practice-started', { sessionId: Date.now(), timestamp: new Date() });
  });

  socket.on('submit-answer', (data) => {
    console.log('📝 Answer submitted:', data);
    // Simulate answer processing
    const isCorrect = Math.random() > 0.3; // 70% chance of being correct for demo
    socket.emit('answer-result', {
      questionId: data.questionId,
      isCorrect,
      explanation: isCorrect ? 'Great job!' : 'Not quite right, but keep trying!',
      timestamp: new Date()
    });
  });

  // Handle real-time leaderboard updates
  socket.on('request-leaderboard', () => {
    const mockLeaderboard = [
      { rank: 1, username: 'demo', score: 1250, streak: 7 },
      { rank: 2, username: 'student1', score: 1180, streak: 5 },
      { rank: 3, username: 'student2', score: 1120, streak: 3 }
    ];
    socket.emit('leaderboard-update', mockLeaderboard);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO server ready`);
});
