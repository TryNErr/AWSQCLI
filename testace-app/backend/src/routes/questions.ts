import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validate, questionSchema } from '../middleware/validation';
import { AuthRequest } from '../middleware/auth';
import Question from '../models/Question';
import { QuestionType, DifficultyLevel } from '../../../shared/types';

const router = express.Router();

// Get questions with filters and pagination
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const {
    page = 1,
    limit = 20,
    subject,
    topic,
    difficulty,
    type,
    search
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build query
  const query: any = {};
  
  if (subject) query.subject = subject;
  if (topic) query.topic = topic;
  if (difficulty) query.difficulty = difficulty;
  if (type) query.type = type;
  
  if (search) {
    query.$or = [
      { content: { $regex: search, $options: 'i' } },
      { explanation: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

  const [questions, total] = await Promise.all([
    Question.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Question.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: questions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Get random questions for practice
router.get('/random', asyncHandler(async (req: AuthRequest, res) => {
  const {
    count = 10,
    subject,
    topic,
    difficulty,
    type
  } = req.query;

  const filters: any = {};
  if (subject) filters.subject = subject;
  if (topic) filters.topic = topic;
  if (difficulty) filters.difficulty = difficulty;
  if (type) filters.type = type;

  const questions = await (Question as any).getRandomQuestions(
    parseInt(count as string),
    filters
  );

  res.json({
    success: true,
    data: questions
  });
}));

// Get adaptive questions based on user performance
router.get('/adaptive', asyncHandler(async (req: AuthRequest, res) => {
  const {
    count = 10,
    difficulty = DifficultyLevel.MEDIUM
  } = req.query;

  const user = req.user;
  const weakAreas = user.stats.weakAreas || [];

  const questions = await (Question as any).getAdaptiveQuestions(
    user._id,
    parseInt(count as string),
    weakAreas,
    difficulty as DifficultyLevel
  );

  res.json({
    success: true,
    data: questions
  });
}));

// Get question by ID
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const question = await Question.findById(req.params.id)
    .populate('createdBy', 'username');

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  res.json({
    success: true,
    data: question
  });
}));

// Create new question (admin/teacher only - for now, any authenticated user)
router.post('/', validate(questionSchema), asyncHandler(async (req: AuthRequest, res) => {
  const questionData = {
    ...req.body,
    createdBy: req.user._id
  };

  const question = new Question(questionData);
  await question.save();

  await question.populate('createdBy', 'username');

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: question
  });
}));

// Update question
router.put('/:id', validate(questionSchema), asyncHandler(async (req: AuthRequest, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Check if user is the creator (or admin in future)
  if (question.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this question'
    });
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'username');

  res.json({
    success: true,
    message: 'Question updated successfully',
    data: updatedQuestion
  });
}));

// Delete question
router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Check if user is the creator (or admin in future)
  if (question.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this question'
    });
  }

  await Question.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Question deleted successfully'
  });
}));

// Get subjects
router.get('/meta/subjects', asyncHandler(async (req: AuthRequest, res) => {
  const subjects = await Question.distinct('subject');
  
  res.json({
    success: true,
    data: subjects
  });
}));

// Get topics for a subject
router.get('/meta/topics/:subject', asyncHandler(async (req: AuthRequest, res) => {
  const topics = await Question.distinct('topic', { subject: req.params.subject });
  
  res.json({
    success: true,
    data: topics
  });
}));

// Get question statistics
router.get('/meta/stats', asyncHandler(async (req: AuthRequest, res) => {
  const stats = await Question.aggregate([
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        byDifficulty: {
          $push: {
            difficulty: '$difficulty',
            count: 1
          }
        },
        bySubject: {
          $push: {
            subject: '$subject',
            count: 1
          }
        },
        byType: {
          $push: {
            type: '$type',
            count: 1
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0] || { totalQuestions: 0 }
  });
}));

export default router;
