import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import questionRoutes from './routes/questions';
import sessionRoutes from './routes/sessions';
import analyticsRoutes from './routes/analytics';
import leaderboardRoutes from './routes/leaderboard';
import writingRoutes from './routes/writing';
import userRoutes from './routes/users';
const enhancedSessionRoutes = require('./routes/enhancedSessions');
const generateQuestionRoutes = require('../routes/generateQuestions');

import { setupSocketHandlers } from './socket/handlers';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter as any);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testace')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', authenticateToken, questionRoutes);
app.use('/api/sessions', authenticateToken, sessionRoutes);
app.use('/api/enhanced-sessions', authenticateToken, enhancedSessionRoutes);
app.use('/api/generate', authenticateToken, generateQuestionRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/leaderboard', authenticateToken, leaderboardRoutes);
app.use('/api/writing', authenticateToken, writingRoutes);
app.use('/api/users', authenticateToken, userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io setup
setupSocketHandlers(io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
