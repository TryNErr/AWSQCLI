const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'AWS Lambda',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend with Lambda is running', 
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo authentication (replace with real auth logic)
    const user = {
      id: 'demo-user',
      email: email,
      username: email.split('@')[0],
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: ''
      },
      stats: {
        totalQuestions: 120,
        correctAnswers: 98,
        wrongAnswers: 22,
        averageScore: 81.67
      },
      streaks: {
        current: 5,
        longest: 12
      }
    };
    
    res.json({ 
      success: true, 
      message: 'Demo login successful',
      token: 'demo-token',
      user: user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const user = {
      id: 'demo-user-' + Date.now(),
      email: email,
      username: email.split('@')[0],
      name: name,
      profile: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        avatar: ''
      },
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageScore: 0
      },
      streaks: {
        current: 0,
        longest: 0
      }
    };
    
    res.json({ 
      success: true, 
      message: 'Demo registration successful',
      token: 'demo-token',
      user: user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard endpoint
app.get('/api/users/dashboard', async (req, res) => {
  try {
    const dashboardData = {
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
            totalStudyTime: 14400
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
            createdAt: new Date(Date.now() - 86400000).toISOString()
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
          studyTime: 240
        },
        studyRecommendations: [
          'Focus on Algebra concepts based on your recent performance',
          'Try more timed practice sessions to improve speed',
          'Review Chemistry formulas where accuracy is below 70%',
          'Consider taking a full practice test this weekend'
        ]
      }
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Questions endpoint
app.get('/api/questions', async (req, res) => {
  try {
    const questions = [
      {
        id: '1',
        content: 'What is 2 + 2?',
        type: 'multiple_choice',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '2 + 2 equals 4',
        subject: 'Math',
        difficulty: 'easy',
        grade: '5',
        topic: 'Arithmetic'
      },
      {
        id: '2',
        content: 'What is the capital of France?',
        type: 'multiple_choice',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
        explanation: 'Paris is the capital and largest city of France',
        subject: 'Geography',
        difficulty: 'easy',
        grade: '5',
        topic: 'World Capitals'
      },
      {
        id: '3',
        content: 'What is 15 + 27?',
        type: 'multiple_choice',
        options: ['40', '42', '44', '45'],
        correctAnswer: '42',
        explanation: 'To solve 15 + 27, we can break it down: 15 + 27 = 15 + 20 + 7 = 35 + 7 = 42',
        subject: 'Math',
        difficulty: 'easy',
        grade: '5',
        topic: 'Addition'
      }
    ];
    
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Questions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Quiz endpoints
app.post('/api/quiz/start', async (req, res) => {
  try {
    const quizId = 'quiz-' + Date.now();
    res.json({
      success: true,
      quizId: quizId,
      message: 'Quiz session created',
      startTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Quiz start error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/quiz/:quizId/status', async (req, res) => {
  try {
    const { quizId } = req.params;
    res.json({
      success: true,
      quizId: quizId,
      status: 'active',
      participants: 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Quiz status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// User profile endpoints
app.get('/api/auth/me', async (req, res) => {
  try {
    const user = {
      id: 'demo-user',
      email: 'demo@testace.com',
      username: 'demo',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: ''
      },
      stats: {
        totalQuestions: 120,
        correctAnswers: 98,
        wrongAnswers: 22,
        averageScore: 81.67
      },
      streaks: {
        current: 5,
        longest: 12
      }
    };
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Export Lambda handler
module.exports.handler = serverless(app);
