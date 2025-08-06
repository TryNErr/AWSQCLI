import express from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/errorHandler';
import { validate, writingSubmissionSchema } from '../middleware/validation';
import { AuthRequest } from '../middleware/auth';
import WritingSubmission from '../models/WritingSubmission';
import { CritiqueStatus } from '../../../shared/types';
import { analyzeWriting } from '../services/openaiService';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .pdf files are allowed'));
    }
  }
});

// Submit writing for critique
router.post('/', validate(writingSubmissionSchema), asyncHandler(async (req: AuthRequest, res) => {
  const { title, content, type } = req.body;
  const userId = req.user._id;

  // Check word count
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount < 50) {
    return res.status(400).json({
      success: false,
      message: 'Writing must be at least 50 words long'
    });
  }

  if (wordCount > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Writing must be less than 2000 words'
    });
  }

  // Create submission
  const submission = new WritingSubmission({
    userId,
    title,
    content,
    type,
    status: CritiqueStatus.PENDING
  });

  await submission.save();

  // Start async analysis
  processWritingCritique(submission._id.toString());

  res.status(201).json({
    success: true,
    message: 'Writing submitted successfully. Analysis will be ready shortly.',
    data: submission
  });
}));

// Upload writing file
router.post('/upload', upload.single('file') as any, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const { title, type } = req.body;
  
  if (!title || !type) {
    return res.status(400).json({
      success: false,
      message: 'Title and type are required'
    });
  }

  // Extract text content from file
  let content = '';
  if (req.file.mimetype === 'text/plain') {
    content = req.file.buffer.toString('utf-8');
  } else {
    // For PDF files, you'd need a PDF parser like pdf-parse
    return res.status(400).json({
      success: false,
      message: 'PDF parsing not yet implemented. Please use text files.'
    });
  }

  // Validate content
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount < 50 || wordCount > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Writing must be between 50 and 2000 words'
    });
  }

  // Create submission
  const submission = new WritingSubmission({
    userId: req.user._id,
    title,
    content,
    type,
    status: CritiqueStatus.PENDING
  });

  await submission.save();

  // Start async analysis
  processWritingCritique(submission._id.toString());

  res.status(201).json({
    success: true,
    message: 'File uploaded and submitted for analysis',
    data: submission
  });
}));

// Get user's writing submissions
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    type
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const query: any = { userId: req.user._id };
  if (status) query.status = status;
  if (type) query.type = type;

  const [submissions, total] = await Promise.all([
    WritingSubmission.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum),
    WritingSubmission.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: submissions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Get specific submission
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const submission = await WritingSubmission.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }

  res.json({
    success: true,
    data: submission
  });
}));

// Delete submission
router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const submission = await WritingSubmission.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }

  await WritingSubmission.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Submission deleted successfully'
  });
}));

// Get writing statistics
router.get('/stats/overview', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user._id;

  const stats = await WritingSubmission.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        completedCritiques: {
          $sum: { $cond: [{ $eq: ['$status', CritiqueStatus.COMPLETED] }, 1, 0] }
        },
        averageScore: {
          $avg: { $ifNull: ['$critique.overallScore', null] }
        },
        byType: {
          $push: {
            type: '$type',
            score: '$critique.overallScore'
          }
        }
      }
    }
  ]);

  const result = stats[0] || {
    totalSubmissions: 0,
    completedCritiques: 0,
    averageScore: null,
    byType: []
  };

  // Calculate improvement trend (last 5 submissions vs previous 5)
  const recentSubmissions = await WritingSubmission.find({
    userId,
    status: CritiqueStatus.COMPLETED,
    'critique.overallScore': { $exists: true }
  })
  .sort({ submittedAt: -1 })
  .limit(10)
  .select('critique.overallScore submittedAt');

  let improvementTrend = 0;
  if (recentSubmissions.length >= 6) {
    const recent5 = recentSubmissions.slice(0, 5);
    const previous5 = recentSubmissions.slice(5, 10);
    
    const recentAvg = recent5.reduce((sum, sub) => sum + sub.critique!.overallScore, 0) / 5;
    const previousAvg = previous5.reduce((sum, sub) => sum + sub.critique!.overallScore, 0) / 5;
    
    improvementTrend = recentAvg - previousAvg;
  }

  res.json({
    success: true,
    data: {
      ...result,
      improvementTrend: Math.round(improvementTrend * 100) / 100
    }
  });
}));

// Resubmit for analysis (if failed)
router.post('/:id/reanalyze', asyncHandler(async (req: AuthRequest, res) => {
  const submission = await WritingSubmission.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }

  if (submission.status === CritiqueStatus.PROCESSING) {
    return res.status(400).json({
      success: false,
      message: 'Analysis already in progress'
    });
  }

  // Reset status and reprocess
  submission.status = CritiqueStatus.PENDING;
  submission.critique = undefined;
  await submission.save();

  // Start async analysis
  processWritingCritique(submission._id.toString());

  res.json({
    success: true,
    message: 'Reanalysis started'
  });
}));

// Async function to process writing critique
async function processWritingCritique(submissionId: string) {
  try {
    const submission = await WritingSubmission.findById(submissionId);
    if (!submission) return;

    // Update status to processing
    submission.status = CritiqueStatus.PROCESSING;
    await submission.save();

    // Analyze with OpenAI
    const critique = await analyzeWriting(submission.content, submission.type);

    // Update submission with critique
    submission.critique = critique;
    submission.status = CritiqueStatus.COMPLETED;
    await submission.save();

    console.log(`Writing critique completed for submission ${submissionId}`);
  } catch (error) {
    console.error(`Error processing writing critique for ${submissionId}:`, error);
    
    // Update status to failed
    await WritingSubmission.findByIdAndUpdate(submissionId, {
      status: CritiqueStatus.FAILED
    });
  }
}

export default router;
