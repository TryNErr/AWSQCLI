import mongoose, { Schema, Document } from 'mongoose';
import { WritingSubmission as IWritingSubmission, WritingType, CritiqueStatus, WritingCritique, CritiqueSection } from '../../../shared/types';

interface WritingSubmissionDocument extends Omit<IWritingSubmission, '_id'>, Document {}

const critiqueSectionSchema = new Schema<CritiqueSection>({
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    required: true
  },
  examples: [{
    type: String
  }]
});

const writingCritiqueSchema = new Schema<WritingCritique>({
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grammar: {
    type: critiqueSectionSchema,
    required: true
  },
  structure: {
    type: critiqueSectionSchema,
    required: true
  },
  clarity: {
    type: critiqueSectionSchema,
    required: true
  },
  vocabulary: {
    type: critiqueSectionSchema,
    required: true
  },
  suggestions: [{
    type: String
  }],
  strengths: [{
    type: String
  }],
  areasForImprovement: [{
    type: String
  }],
  processedAt: {
    type: Date,
    default: Date.now
  }
});

const writingSubmissionSchema = new Schema<WritingSubmissionDocument>({
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10000
  },
  type: {
    type: String,
    enum: Object.values(WritingType),
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  critique: {
    type: writingCritiqueSchema
  },
  status: {
    type: String,
    enum: Object.values(CritiqueStatus),
    default: CritiqueStatus.PENDING
  }
}, {
  timestamps: true
});

// Indexes for better query performance
writingSubmissionSchema.index({ userId: 1, submittedAt: -1 });
writingSubmissionSchema.index({ status: 1 });
writingSubmissionSchema.index({ type: 1 });

// Static method to get user's submissions
writingSubmissionSchema.statics.getUserSubmissions = function(userId: string, limit: number = 10) {
  return this.find({ userId })
    .sort({ submittedAt: -1 })
    .limit(limit);
};

// Static method to get pending submissions for processing
writingSubmissionSchema.statics.getPendingSubmissions = function(limit: number = 5) {
  return this.find({ status: CritiqueStatus.PENDING })
    .sort({ submittedAt: 1 })
    .limit(limit);
};

// Method to calculate word count
writingSubmissionSchema.methods.getWordCount = function(): number {
  return this.content.trim().split(/\s+/).length;
};

// Method to get reading time estimate (average 200 words per minute)
writingSubmissionSchema.methods.getReadingTime = function(): number {
  const wordCount = this.getWordCount();
  return Math.ceil(wordCount / 200);
};

export default mongoose.model<WritingSubmissionDocument>('WritingSubmission', writingSubmissionSchema);
