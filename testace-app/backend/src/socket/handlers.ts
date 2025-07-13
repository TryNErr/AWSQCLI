import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import TestSession from '../models/TestSession';
import Question from '../models/Question';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export function setupSocketHandlers(io: Server) {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user.username} connected: ${socket.id}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle joining practice rooms
    socket.on('join-practice-room', (data: { subject?: string; difficulty?: string }) => {
      const roomName = `practice_${data.subject || 'general'}_${data.difficulty || 'mixed'}`;
      socket.join(roomName);
      
      // Notify others in the room
      socket.to(roomName).emit('user-joined-practice', {
        userId: socket.userId,
        username: socket.user.username
      });

      console.log(`User ${socket.user.username} joined practice room: ${roomName}`);
    });

    // Handle leaving practice rooms
    socket.on('leave-practice-room', (data: { subject?: string; difficulty?: string }) => {
      const roomName = `practice_${data.subject || 'general'}_${data.difficulty || 'mixed'}`;
      socket.leave(roomName);
      
      // Notify others in the room
      socket.to(roomName).emit('user-left-practice', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // Handle starting a live practice session
    socket.on('start-live-practice', async (data: {
      subject?: string;
      difficulty?: string;
      questionCount?: number;
    }) => {
      try {
        // Check if user already has an active session
        const activeSession = await TestSession.findOne({
          userId: socket.userId,
          completed: false
        });

        if (activeSession) {
          socket.emit('error', {
            message: 'You already have an active session'
          });
          return;
        }

        // Get questions for the session
        const filters: any = {};
        if (data.subject) filters.subject = data.subject;
        if (data.difficulty) filters.difficulty = data.difficulty;

        const questions = await (Question as any).getRandomQuestions(
          data.questionCount || 10,
          filters
        );

        if (questions.length === 0) {
          socket.emit('error', {
            message: 'No questions found for your criteria'
          });
          return;
        }

        // Create session
        const session = new TestSession({
          userId: socket.userId,
          mode: 'practice',
          questions: questions.map((q: any) => q._id),
          subject: data.subject,
          difficulty: data.difficulty
        });

        await session.save();
        await session.populate('questions');

        // Join session room
        socket.join(`session_${session._id}`);

        // Send first question
        const firstQuestion = questions[0];
        socket.emit('session-started', {
          sessionId: session._id,
          totalQuestions: questions.length,
          currentQuestion: 1,
          question: firstQuestion
        });

        console.log(`Live practice session started for user ${socket.user.username}`);
      } catch (error) {
        console.error('Error starting live practice:', error);
        socket.emit('error', {
          message: 'Failed to start practice session'
        });
      }
    });

    // Handle answer submission in live practice
    socket.on('submit-live-answer', async (data: {
      sessionId: string;
      questionId: string;
      answer: string | number;
      timeSpent: number;
    }) => {
      try {
        const session = await TestSession.findOne({
          _id: data.sessionId,
          userId: socket.userId,
          completed: false
        }).populate('questions');

        if (!session) {
          socket.emit('error', {
            message: 'Session not found or already completed'
          });
          return;
        }

        // Check if already answered this question
        const existingAnswer = session.answers.find(
          a => a.questionId.toString() === data.questionId
        );

        if (existingAnswer) {
          socket.emit('error', {
            message: 'Question already answered'
          });
          return;
        }

        // Get the question to check correct answer
        const question = await Question.findById(data.questionId);
        if (!question) {
          socket.emit('error', {
            message: 'Question not found'
          });
          return;
        }

        // Check if answer is correct
        const isCorrect = question.correctAnswer.toString().toLowerCase() === 
                         data.answer.toString().toLowerCase();

        // Add answer to session
        session.answers.push({
          questionId: data.questionId,
          answer: data.answer,
          timeSpent: data.timeSpent,
          isCorrect,
          timestamp: new Date()
        });

        await session.save();

        // Send answer result
        socket.emit('answer-result', {
          correct: isCorrect,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          hints: question.hints,
          currentQuestion: session.answers.length,
          totalQuestions: session.questions.length
        });

        // Check if session is complete
        if (session.answers.length >= session.questions.length) {
          // Complete the session
          session.completed = true;
          session.endTime = new Date();
          session.score = session.calculateScore();
          await session.save();

          // Update user stats
          await updateUserStats(socket.userId!, session);

          socket.emit('session-completed', {
            sessionId: session._id,
            score: session.score,
            accuracy: session.getAccuracy(),
            totalQuestions: session.questions.length,
            correctAnswers: session.answers.filter(a => a.isCorrect).length
          });

          // Leave session room
          socket.leave(`session_${session._id}`);
        } else {
          // Send next question
          const nextQuestionIndex = session.answers.length;
          const nextQuestion = session.questions[nextQuestionIndex];
          
          socket.emit('next-question', {
            question: nextQuestion,
            currentQuestion: nextQuestionIndex + 1,
            totalQuestions: session.questions.length
          });
        }
      } catch (error) {
        console.error('Error submitting live answer:', error);
        socket.emit('error', {
          message: 'Failed to submit answer'
        });
      }
    });

    // Handle daily challenge participation
    socket.on('join-daily-challenge', async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if user already completed today's challenge
        const existingChallenge = await TestSession.findOne({
          userId: socket.userId,
          mode: 'daily_challenge',
          createdAt: { $gte: today }
        });

        if (existingChallenge) {
          socket.emit('daily-challenge-status', {
            completed: existingChallenge.completed,
            score: existingChallenge.score,
            message: existingChallenge.completed ? 
              'You have already completed today\'s challenge!' :
              'You have an active daily challenge'
          });
          return;
        }

        // Join daily challenge room
        socket.join('daily_challenge');
        
        // Get today's challenge questions (mixed difficulty)
        const questions = await (Question as any).getRandomQuestions(15, {});
        
        if (questions.length === 0) {
          socket.emit('error', {
            message: 'Daily challenge questions not available'
          });
          return;
        }

        // Create daily challenge session
        const session = new TestSession({
          userId: socket.userId,
          mode: 'daily_challenge',
          questions: questions.map((q: any) => q._id),
          timeLimit: 900 // 15 minutes
        });

        await session.save();

        socket.emit('daily-challenge-started', {
          sessionId: session._id,
          timeLimit: 900,
          totalQuestions: questions.length,
          message: 'Daily challenge started! You have 15 minutes.'
        });

        // Notify others that someone joined the challenge
        socket.to('daily_challenge').emit('challenge-participant-joined', {
          username: socket.user.username,
          totalParticipants: (await io.in('daily_challenge').allSockets()).size
        });
      } catch (error) {
        console.error('Error joining daily challenge:', error);
        socket.emit('error', {
          message: 'Failed to join daily challenge'
        });
      }
    });

    // Handle real-time leaderboard updates
    socket.on('request-leaderboard-update', async (data: { type: string }) => {
      try {
        let leaderboard = [];
        
        if (data.type === 'daily') {
          // Get today's daily challenge leaderboard
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const sessions = await TestSession.find({
            mode: 'daily_challenge',
            completed: true,
            createdAt: { $gte: today, $lt: tomorrow }
          })
          .populate('userId', 'username profile.firstName profile.lastName')
          .sort({ score: -1, endTime: 1 })
          .limit(10);

          leaderboard = sessions.map((session, index) => ({
            rank: index + 1,
            username: (session.userId as any).username,
            displayName: `${(session.userId as any).profile.firstName} ${(session.userId as any).profile.lastName}`,
            score: session.score,
            completionTime: session.endTime
          }));
        }

        socket.emit('leaderboard-update', {
          type: data.type,
          leaderboard
        });
      } catch (error) {
        console.error('Error getting leaderboard update:', error);
      }
    });

    // Handle typing indicators for collaborative features (future)
    socket.on('typing-start', (data: { room: string }) => {
      socket.to(data.room).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    socket.on('typing-stop', (data: { room: string }) => {
      socket.to(data.room).emit('user-stopped-typing', {
        userId: socket.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected: ${socket.id}`);
      
      // Notify rooms about user leaving
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit('user-disconnected', {
            userId: socket.userId,
            username: socket.user.username
          });
        }
      });
    });
  });
}

// Helper function to update user statistics
async function updateUserStats(userId: string, session: any) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const correctAnswers = session.answers.filter((a: any) => a.isCorrect).length;
    const totalAnswers = session.answers.length;
    
    user.stats.totalQuestions += totalAnswers;
    user.stats.correctAnswers += correctAnswers;
    user.stats.accuracy = (user.stats.correctAnswers / user.stats.totalQuestions) * 100;
    user.stats.totalStudyTime += session.answers.reduce((sum: number, a: any) => sum + a.timeSpent, 0);

    // Update streak for daily challenges
    if (session.mode === 'daily_challenge') {
      user.updateStreak();
    }

    await user.save();
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}
