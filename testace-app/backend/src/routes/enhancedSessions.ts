import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import TestSession from '../models/TestSession';
import Question from '../models/Question';
import { TestMode } from '../../../shared/types';
const MathQuestionGenerator = require('../../utils/questionGenerator');

const router = express.Router();
const questionGenerator = new MathQuestionGenerator();

// Enhanced question fetching with infinite generation
router.get('/:sessionId/questions', asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params;
  const { offset = 0, limit = 10 } = req.query;
  
  const session = await TestSession.findOne({
    _id: sessionId,
    userId: req.user._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  const offsetNum = parseInt(offset as string);
  const limitNum = parseInt(limit as string);
  
  let questions = [];
  
  try {
    // First, try to get questions from the original session
    const dbQuestions = await Question.find({
      _id: { $in: session.questions }
    }).skip(offsetNum).limit(limitNum);
    
    questions = [...dbQuestions];
    
    // If we don't have enough questions and this is a math session, generate more
    const shortfall = limitNum - questions.length;
    if (shortfall > 0 && session.subject === 'Mathematics') {
      console.log(`🔄 Generating ${shortfall} additional questions for session ${sessionId}`);
      
      const grade = getGradeFromDifficulty(session.difficulty);
      const generatedQuestions = questionGenerator.generateQuestion(
        grade,
        session.difficulty?.toLowerCase() || 'medium',
        shortfall
      );
      
      const formattedQuestions = Array.isArray(generatedQuestions) 
        ? generatedQuestions 
        : [generatedQuestions];
      
      // Add unique IDs for generated questions
      formattedQuestions.forEach((q, i) => {
        q._id = `generated_${sessionId}_${offsetNum + questions.length + i}_${Date.now()}`;
      });
      
      questions = [...questions, ...formattedQuestions];
      
      // Store generated questions in session for future reference
      await TestSession.findByIdAndUpdate(sessionId, {
        $push: { 
          generatedQuestions: { $each: formattedQuestions },
          questions: { $each: formattedQuestions.map(q => q._id) }
        }
      });
      
      console.log(`✅ Generated ${formattedQuestions.length} questions on-the-fly`);
    }
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    
    // Complete fallback: generate all requested questions
    if (session.subject === 'Mathematics') {
      const grade = getGradeFromDifficulty(session.difficulty);
      const generatedQuestions = questionGenerator.generateQuestion(
        grade,
        session.difficulty?.toLowerCase() || 'medium',
        limitNum
      );
      
      questions = Array.isArray(generatedQuestions) 
        ? generatedQuestions 
        : [generatedQuestions];
      
      questions.forEach((q, i) => {
        q._id = `fallback_${sessionId}_${offsetNum + i}_${Date.now()}`;
      });
      
      console.log(`🆘 Fallback: Generated ${questions.length} questions`);
    }
  }

  res.json({
    success: true,
    data: {
      questions,
      hasMore: true, // Always true for infinite generation
      offset: offsetNum,
      limit: limitNum,
      generated: questions.filter(q => q._id?.toString().includes('generated')).length
    }
  });
}));

// Enhanced practice mode with infinite questions
router.post('/practice/infinite', asyncHandler(async (req: AuthRequest, res) => {
  const { subject = 'Mathematics', difficulty = 'medium', batchSize = 10 } = req.body;
  const userId = req.user._id;

  // Create or get infinite practice session
  let session = await TestSession.findOne({
    userId,
    mode: 'INFINITE_PRACTICE',
    subject,
    difficulty,
    completed: false
  });

  if (!session) {
    session = new TestSession({
      userId,
      mode: 'INFINITE_PRACTICE',
      subject,
      difficulty,
      questions: [],
      timeLimit: null, // No time limit for infinite practice
      generatedQuestions: []
    });
    await session.save();
  }

  // Generate initial batch of questions
  const grade = getGradeFromDifficulty(difficulty);
  const questions = questionGenerator.generateQuestion(
    grade,
    difficulty.toLowerCase(),
    batchSize
  );

  const formattedQuestions = Array.isArray(questions) ? questions : [questions];
  formattedQuestions.forEach((q, i) => {
    q._id = `infinite_${session._id}_${Date.now()}_${i}`;
  });

  // Add to session
  await TestSession.findByIdAndUpdate(session._id, {
    $push: { 
      generatedQuestions: { $each: formattedQuestions },
      questions: { $each: formattedQuestions.map(q => q._id) }
    }
  });

  res.json({
    success: true,
    data: {
      sessionId: session._id,
      questions: formattedQuestions,
      message: `Infinite practice session ready with ${formattedQuestions.length} questions`
    }
  });
}));

// Get more questions for infinite practice
router.post('/:sessionId/more-questions', asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params;
  const { count = 10 } = req.body;
  
  const session = await TestSession.findOne({
    _id: sessionId,
    userId: req.user._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  // Generate more questions
  const grade = getGradeFromDifficulty(session.difficulty);
  const questions = questionGenerator.generateQuestion(
    grade,
    session.difficulty?.toLowerCase() || 'medium',
    count
  );

  const formattedQuestions = Array.isArray(questions) ? questions : [questions];
  const currentCount = session.questions.length;
  
  formattedQuestions.forEach((q, i) => {
    q._id = `more_${sessionId}_${currentCount + i}_${Date.now()}`;
  });

  // Add to session
  await TestSession.findByIdAndUpdate(sessionId, {
    $push: { 
      generatedQuestions: { $each: formattedQuestions },
      questions: { $each: formattedQuestions.map(q => q._id) }
    }
  });

  res.json({
    success: true,
    data: {
      questions: formattedQuestions,
      totalQuestions: session.questions.length + formattedQuestions.length,
      message: `Generated ${formattedQuestions.length} additional questions`
    }
  });
}));

// Helper function
function getGradeFromDifficulty(difficulty?: string): number {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 1;
    case 'medium': return 5;
    case 'hard': return 9;
    default: return 5;
  }
}

module.exports = router;
