import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validate, sessionSchema, answerSchema } from '../middleware/validation';
import { AuthRequest } from '../middleware/auth';
import TestSession from '../models/TestSession';
import Question from '../models/Question';
import User from '../models/User';
import { TestMode, DifficultyLevel } from '../../../shared/types';
import { io } from '../server';
const MathQuestionGenerator = require('../../utils/questionGenerator');

const router = express.Router();
const questionGenerator = new MathQuestionGenerator();

// Helper function to get or generate questions
async function getQuestionsWithFallback(
  questionCount: number, 
  filters: any, 
  userId?: string, 
  mode?: TestMode
): Promise<any[]> {
  let questions = [];
  
  try {
    // First try to get questions from database
    if (mode === TestMode.DAILY_CHALLENGE) {
      questions = await (Question as any).getRandomQuestions(questionCount, {});
    } else if (mode === TestMode.PRACTICE && userId) {
      const user = await User.findById(userId);
      if (user?.stats?.weakAreas?.length > 0) {
        questions = await (Question as any).getAdaptiveQuestions(
          userId,
          questionCount,
          user.stats.weakAreas,
          filters.difficulty || DifficultyLevel.MEDIUM
        );
      } else {
        questions = await (Question as any).getRandomQuestions(questionCount, filters);
      }
    } else {
      questions = await (Question as any).getRandomQuestions(questionCount, filters);
    }
    
    // If we don't have enough questions, generate more
    const shortfall = questionCount - questions.length;
    if (shortfall > 0 && filters.subject === 'Mathematics') {
      console.log(`Generating ${shortfall} additional math questions...`);
      
      // Determine grade from difficulty or default
      const grade = getGradeFromDifficulty(filters.difficulty);
      const difficulty = filters.difficulty || 'medium';
      
      // Generate additional questions
      const generatedQuestions = questionGenerator.generateQuestion(
        grade, 
        difficulty.toLowerCase(), 
        shortfall
      );
      
      // Convert generated questions to database format
      const formattedQuestions = Array.isArray(generatedQuestions) 
        ? generatedQuestions 
        : [generatedQuestions];
      
      questions = [...questions, ...formattedQuestions];
      console.log(`✅ Generated ${formattedQuestions.length} questions on-the-fly`);
    }
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    
    // Fallback: generate all questions if database fails
    if (filters.subject === 'Mathematics') {
      const grade = getGradeFromDifficulty(filters.difficulty);
      const difficulty = filters.difficulty || 'medium';
      
      const generatedQuestions = questionGenerator.generateQuestion(
        grade, 
        difficulty.toLowerCase(), 
        questionCount
      );
      
      questions = Array.isArray(generatedQuestions) 
        ? generatedQuestions 
        : [generatedQuestions];
      
      console.log(`🔄 Fallback: Generated all ${questions.length} questions`);
    }
  }
  
  return questions;
}

// Helper to map difficulty to appropriate grade level
function getGradeFromDifficulty(difficulty?: string): number {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 1;
    case 'medium': return 5;
    case 'hard': return 9;
    default: return 5;
  }
}

// Create new test session
router.post('/', validate(sessionSchema), asyncHandler(async (req: AuthRequest, res) => {
  const { mode, subject, difficulty, timeLimit, questionCount = 30 } = req.body;
  const userId = req.user._id;

  // Check if user already has an active session
  const activeSession = await TestSession.findOne({
    userId,
    completed: false
  });

  if (activeSession) {
    return res.status(400).json({
      success: false,
      message: 'You already have an active session. Please complete it first.'
    });
  }

  // For daily challenge, check if user already completed today's challenge
  if (mode === TestMode.DAILY_CHALLENGE) {
    const todaysChallenge = await (TestSession as any).getTodaysDailyChallenge(userId);
    if (todaysChallenge) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed today\'s daily challenge'
      });
    }
  }

  // Get questions with automatic generation fallback
  const filters: any = {};
  if (subject) filters.subject = subject;
  if (difficulty) filters.difficulty = difficulty;

  const questions = await getQuestionsWithFallback(
    questionCount, 
    filters, 
    userId, 
    mode
  );

  // Validate minimum question count
  if (mode === TestMode.TIMED && questions.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Timed tests require at least 5 questions'
    });
  }

  if (questions.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Unable to generate questions for your criteria'
    });
  }

  // Create session with question IDs (for DB questions) or full questions (for generated)
  const questionIds = questions.map((q: any) => q._id || q.id || `generated_${Date.now()}_${Math.random()}`);
  
  const session = new TestSession({
    userId,
    mode,
    questions: questionIds,
    subject,
    difficulty,
    timeLimit,
    generatedQuestions: questions.filter(q => !q._id) // Store generated questions separately
  });

  await session.save();

  // Populate questions for response
  await session.populate('questions');

  // Emit socket event for real-time updates
  io.to(`user_${userId}`).emit('session-started', session);

  res.status(201).json({
    success: true,
    message: 'Test session created successfully',
    data: session
  });
}));

// Get user's sessions
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const {
    page = 1,
    limit = 10,
    mode,
    completed
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const query: any = { userId: req.user._id };
  if (mode) query.mode = mode;
  if (completed !== undefined) query.completed = completed === 'true';

  const [sessions, total] = await Promise.all([
    TestSession.find(query)
      .populate('questions', 'content subject topic difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    TestSession.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: sessions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Get active session
router.get('/active', asyncHandler(async (req: AuthRequest, res) => {
  const session = await TestSession.findOne({
    userId: req.user._id,
    completed: false
  }).populate('questions');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'No active session found'
    });
  }

  res.json({
    success: true,
    data: session
  });
}));

// Get session by ID
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const session = await TestSession.findOne({
    _id: req.params.id,
    userId: req.user._id
  }).populate('questions');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  res.json({
    success: true,
    data: session
  });
}));

// Submit answer
router.post('/:id/answer', validate(answerSchema), asyncHandler(async (req: AuthRequest, res) => {
  const { questionId, answer, timeSpent } = req.body;
  const sessionId = req.params.id;

  const session = await TestSession.findOne({
    _id: sessionId,
    userId: req.user._id,
    completed: false
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Active session not found'
    });
  }

  // Check if question belongs to this session
  if (!session.questions.includes(questionId)) {
    return res.status(400).json({
      success: false,
      message: 'Question not part of this session'
    });
  }

  // Check if already answered
  const existingAnswer = session.answers.find(a => a.questionId.toString() === questionId);
  if (existingAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Question already answered'
    });
  }

  // Get question to check correct answer
  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Check if answer is correct
  const isCorrect = question.correctAnswer.toString().toLowerCase() === answer.toString().toLowerCase();

  // Add answer to session
  session.answers.push({
    questionId,
    answer,
    timeSpent,
    isCorrect,
    timestamp: new Date()
  });

  await session.save();

  // Emit real-time update
  io.to(`user_${req.user._id}`).emit('answer-result', {
    correct: isCorrect,
    explanation: question.explanation,
    hints: question.hints
  });

  res.json({
    success: true,
    message: 'Answer submitted successfully',
    data: {
      correct: isCorrect,
      explanation: question.explanation,
      hints: question.hints,
      totalAnswered: session.answers.length,
      totalQuestions: session.questions.length
    }
  });
}));

// Complete session
router.post('/:id/complete', asyncHandler(async (req: AuthRequest, res) => {
  const session = await TestSession.findOne({
    _id: req.params.id,
    userId: req.user._id,
    completed: false
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Active session not found'
    });
  }

  // Mark session as completed
  session.completed = true;
  session.endTime = new Date();
  session.score = session.calculateScore();

  await session.save();

  // Update user statistics
  const user = await User.findById(req.user._id);
  if (user) {
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const totalAnswers = session.answers.length;
    
    user.stats.totalQuestions += totalAnswers;
    user.stats.correctAnswers += correctAnswers;
    user.stats.accuracy = (user.stats.correctAnswers / user.stats.totalQuestions) * 100;
    user.stats.averageTime = session.getAverageTime();
    user.stats.totalStudyTime += session.answers.reduce((sum, a) => sum + a.timeSpent, 0);

    // Update weak/strong areas based on performance
    const performanceByTopic: { [key: string]: { correct: number; total: number } } = {};
    
    for (const answer of session.answers) {
      const question = await Question.findById(answer.questionId);
      if (question) {
        if (!performanceByTopic[question.topic]) {
          performanceByTopic[question.topic] = { correct: 0, total: 0 };
        }
        performanceByTopic[question.topic].total++;
        if (answer.isCorrect) {
          performanceByTopic[question.topic].correct++;
        }
      }
    }

    // Identify weak areas (< 60% accuracy)
    const weakAreas = Object.entries(performanceByTopic)
      .filter(([_, perf]) => (perf.correct / perf.total) < 0.6)
      .map(([topic, _]) => topic);

    // Identify strong areas (> 80% accuracy)
    const strongAreas = Object.entries(performanceByTopic)
      .filter(([_, perf]) => (perf.correct / perf.total) > 0.8)
      .map(([topic, _]) => topic);

    user.stats.weakAreas = [...new Set([...user.stats.weakAreas, ...weakAreas])];
    user.stats.strongAreas = [...new Set([...user.stats.strongAreas, ...strongAreas])];

    // Update streak for daily challenges
    if (session.mode === TestMode.DAILY_CHALLENGE) {
      user.updateStreak();
    }

    await user.save();
  }

  // Populate session for response
  await session.populate('questions', 'content subject topic difficulty');

  // Emit completion event
  io.to(`user_${req.user._id}`).emit('session-ended', session);

  res.json({
    success: true,
    message: 'Session completed successfully',
    data: session
  });
}));

// Get session results/analytics
router.get('/:id/results', asyncHandler(async (req: AuthRequest, res) => {
  const session = await TestSession.findOne({
    _id: req.params.id,
    userId: req.user._id,
    completed: true
  }).populate('questions', 'content subject topic difficulty type');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Completed session not found'
    });
  }

  // Calculate detailed analytics
  const analytics = {
    score: session.score,
    accuracy: session.getAccuracy(),
    averageTime: session.getAverageTime(),
    totalTime: session.answers.reduce((sum, a) => sum + a.timeSpent, 0),
    correctAnswers: session.answers.filter(a => a.isCorrect).length,
    totalQuestions: session.questions.length,
    byDifficulty: {} as any,
    bySubject: {} as any,
    byTopic: {} as any,
    timeDistribution: session.answers.map(a => ({
      questionId: a.questionId,
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect
    }))
  };

  // Group performance by various categories
  for (const answer of session.answers) {
    const question = session.questions.find((q: any) => q._id.toString() === answer.questionId.toString()) as any;
    if (question) {
      // By difficulty
      if (!analytics.byDifficulty[question.difficulty]) {
        analytics.byDifficulty[question.difficulty] = { correct: 0, total: 0 };
      }
      analytics.byDifficulty[question.difficulty].total++;
      if (answer.isCorrect) analytics.byDifficulty[question.difficulty].correct++;

      // By subject
      if (!analytics.bySubject[question.subject]) {
        analytics.bySubject[question.subject] = { correct: 0, total: 0 };
      }
      analytics.bySubject[question.subject].total++;
      if (answer.isCorrect) analytics.bySubject[question.subject].correct++;

      // By topic
      if (!analytics.byTopic[question.topic]) {
        analytics.byTopic[question.topic] = { correct: 0, total: 0 };
      }
      analytics.byTopic[question.topic].total++;
      if (answer.isCorrect) analytics.byTopic[question.topic].correct++;
    }
  }

  res.json({
    success: true,
    data: {
      session,
      analytics
    }
  });
}));

// Delete session
router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const session = await TestSession.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  await TestSession.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Session deleted successfully'
  });
}));

export default router;
