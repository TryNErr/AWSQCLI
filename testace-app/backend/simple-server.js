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
    user: { 
      _id: 'demo-user',
      username: 'demo',
      email: req.body.email || 'demo@testace.com',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: null,
        grade: '12',
        subjects: ['Math', 'Science', 'English'],
        targetTests: ['SAT', 'ACT']
      },
      stats: {
        totalQuestions: 150,
        correctAnswers: 120,
        accuracy: 80,
        averageTime: 45,
        subjectStats: {
          'Math': { totalQuestions: 50, correctAnswers: 40, accuracy: 80, averageTime: 50 },
          'Science': { totalQuestions: 50, correctAnswers: 42, accuracy: 84, averageTime: 40 },
          'English': { totalQuestions: 50, correctAnswers: 38, accuracy: 76, averageTime: 45 }
        }
      },
      streaks: {
        current: 7,
        longest: 15,
        lastActivity: new Date()
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Demo registration successful',
    token: 'demo-token',
    user: { 
      _id: 'demo-user-new',
      username: req.body.username || 'newuser',
      email: req.body.email || 'newuser@testace.com',
      profile: {
        firstName: req.body.profile?.firstName || 'New',
        lastName: req.body.profile?.lastName || 'User',
        avatar: null,
        grade: req.body.profile?.grade || '12',
        subjects: req.body.profile?.subjects || ['Math'],
        targetTests: req.body.profile?.targetTests || ['SAT']
      },
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTime: 0,
        subjectStats: {}
      },
      streaks: {
        current: 0,
        longest: 0,
        lastActivity: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  // In demo mode, return the demo user
  res.json({
    success: true,
    user: { 
      _id: 'demo-user',
      username: 'demo',
      email: 'demo@testace.com',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: null,
        grade: '12',
        subjects: ['Math', 'Science', 'English'],
        targetTests: ['SAT', 'ACT']
      },
      stats: {
        totalQuestions: 150,
        correctAnswers: 120,
        accuracy: 80,
        averageTime: 45,
        subjectStats: {
          'Math': { totalQuestions: 50, correctAnswers: 40, accuracy: 80, averageTime: 50 },
          'Science': { totalQuestions: 50, correctAnswers: 42, accuracy: 84, averageTime: 40 },
          'English': { totalQuestions: 50, correctAnswers: 38, accuracy: 76, averageTime: 45 }
        }
      },
      streaks: {
        current: 7,
        longest: 15,
        lastActivity: new Date()
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  });
});

// Dashboard endpoint
app.get('/api/users/dashboard', (req, res) => {
  // Generate demo dashboard data
  const dashboardData = {
    user: {
      username: 'demo',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: null,
        grade: '12',
        subjects: ['Math', 'Science', 'English'],
        targetTests: ['SAT', 'ACT']
      },
      stats: {
        totalQuestions: 150,
        correctAnswers: 120,
        accuracy: 80,
        averageTime: 45,
        totalStudyTime: 7200, // 2 hours in seconds
        subjectStats: {
          'Math': { totalQuestions: 50, correctAnswers: 40, accuracy: 80, averageTime: 50 },
          'Science': { totalQuestions: 50, correctAnswers: 42, accuracy: 84, averageTime: 40 },
          'English': { totalQuestions: 50, correctAnswers: 38, accuracy: 76, averageTime: 45 }
        }
      },
      streaks: {
        current: 7,
        longest: 15,
        lastActivity: new Date()
      }
    },
    recentSessions: [
      {
        _id: 'session1',
        subject: 'Math',
        mode: 'practice',
        score: 85,
        questionsCount: 20,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        _id: 'session2',
        subject: 'Science',
        mode: 'timed',
        score: 78,
        questionsCount: 25,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        _id: 'session3',
        subject: 'English',
        mode: 'daily_challenge',
        score: 92,
        questionsCount: 15,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        _id: 'session4',
        subject: 'Math',
        mode: 'practice',
        score: 73,
        questionsCount: 18,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        _id: 'session5',
        subject: 'Science',
        mode: 'practice',
        score: 88,
        questionsCount: 22,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ],
    dailyChallengeStatus: {
      completed: Math.random() > 0.5, // 50% chance of being completed
      score: Math.random() > 0.5 ? Math.floor(Math.random() * 40) + 60 : null, // Random score 60-100 if completed
      completedAt: Math.random() > 0.5 ? new Date() : null
    },
    weekStats: {
      sessionsCompleted: 12,
      questionsAnswered: 240,
      averageAccuracy: 82,
      studyTime: 180 // minutes
    },
    studyRecommendations: [
      'Focus on algebra problems to improve your math accuracy',
      'Practice more reading comprehension questions',
      'Review chemistry concepts - your weakest area',
      'Try timed practice sessions to improve speed',
      'Work on essay writing structure and grammar'
    ]
  };

  res.json({
    success: true,
    data: dashboardData
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authentication (simplified for demo)
  socket.on('authenticate', (data) => {
    console.log('User authenticated:', data);
    socket.emit('authenticated', { success: true });
  });

  // Practice room events
  socket.on('join-practice-room', (data) => {
    const room = `practice-${data.subject || 'general'}-${data.difficulty || 'all'}`;
    socket.join(room);
    console.log(`User ${socket.id} joined practice room: ${room}`);
    socket.emit('joined-practice-room', { room, success: true });
  });

  socket.on('leave-practice-room', (data) => {
    const room = `practice-${data.subject || 'general'}-${data.difficulty || 'all'}`;
    socket.leave(room);
    console.log(`User ${socket.id} left practice room: ${room}`);
  });

  // Live practice events
  socket.on('start-live-practice', (options) => {
    console.log('Starting live practice:', options);
    socket.emit('session-started', {
      sessionId: 'demo-session-' + Date.now(),
      options,
      message: 'Live practice session started!'
    });
  });

  socket.on('submit-live-answer', (data) => {
    console.log('Live answer submitted:', data);
    // Simulate answer processing
    const isCorrect = Math.random() > 0.3; // 70% chance of being correct
    socket.emit('answer-result', {
      questionId: data.questionId,
      isCorrect,
      correctAnswer: 'Demo Answer',
      explanation: 'This is a demo explanation.'
    });
  });

  // Daily challenge events
  socket.on('join-daily-challenge', () => {
    console.log('User joined daily challenge:', socket.id);
    socket.join('daily-challenge');
    socket.emit('daily-challenge-started', {
      challengeId: 'daily-' + new Date().toDateString(),
      message: 'Welcome to today\'s challenge!'
    });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('error', { message: 'An error occurred' });
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

server.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO enabled`);
});
