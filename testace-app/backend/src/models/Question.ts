import mongoose, { Schema, Document } from 'mongoose';
import { Question as IQuestion, QuestionType, DifficultyLevel } from '../../../shared/types';

interface QuestionDocument extends Omit<IQuestion, '_id'>, Document {}

const questionSchema = new Schema<QuestionDocument>({
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(QuestionType),
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: Object.values(DifficultyLevel),
    required: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  hints: [{
    type: String,
    trim: true
  }],
  timeLimit: {
    type: Number,
    default: 60 // seconds
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ subject: 1, topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ type: 1 });
questionSchema.index({ tags: 1 });

// Static method to get random questions
questionSchema.statics.getRandomQuestions = function(
  count: number,
  filters: {
    subject?: string;
    topic?: string;
    difficulty?: DifficultyLevel;
    type?: QuestionType;
  } = {}
) {
  const matchStage: any = {};
  
  if (filters.subject) matchStage.subject = filters.subject;
  if (filters.topic) matchStage.topic = filters.topic;
  if (filters.difficulty) matchStage.difficulty = filters.difficulty;
  if (filters.type) matchStage.type = filters.type;
  
  return this.aggregate([
    { $match: matchStage },
    { $sample: { size: count } }
  ]);
};

// Static method to get adaptive questions based on user performance
questionSchema.statics.getAdaptiveQuestions = function(
  userId: string,
  count: number,
  weakAreas: string[] = [],
  currentDifficulty: DifficultyLevel = DifficultyLevel.MEDIUM
) {
  const matchStage: any = {};
  
  // Focus on weak areas if available
  if (weakAreas.length > 0) {
    matchStage.$or = [
      { topic: { $in: weakAreas } },
      { tags: { $in: weakAreas } }
    ];
  }
  
  // Adjust difficulty based on performance
  matchStage.difficulty = currentDifficulty;
  
  return this.aggregate([
    { $match: matchStage },
    { $sample: { size: count } }
  ]);
};

export default mongoose.model<QuestionDocument>('Question', questionSchema);
