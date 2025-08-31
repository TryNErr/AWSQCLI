import mongoose, { Schema, Document } from 'mongoose';
import { TestSession as ITestSession, TestMode, UserAnswer, DifficultyLevel } from '../../../shared/types';

interface TestSessionDocument extends Omit<ITestSession, '_id'>, Document {
  calculateScore(): number;
  getAccuracy(): number;
  getAverageTime(): number;
  generatedQuestions?: any[]; // Store generated questions
}

const userAnswerSchema = new Schema<UserAnswer>({
  questionId: {
    type: Schema.Types.Mixed, // Allow both ObjectId and string for generated questions
    required: true
  },
  answer: {
    type: Schema.Types.Mixed,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const testSessionSchema = new Schema<TestSessionDocument>({
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: [...Object.values(TestMode), 'INFINITE_PRACTICE'],
    required: true
  },
  questions: [{
    type: Schema.Types.Mixed // Allow both ObjectId and string for generated questions
  }],
  generatedQuestions: [{
    type: Schema.Types.Mixed,
    default: []
  }],
  answers: [userAnswerSchema],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  timeLimit: {
    type: Number // in seconds
  },
  score: {
    type: Number
  },
  completed: {
    type: Boolean,
    default: false
  },
  subject: {
    type: String
  },
  difficulty: {
    type: String,
    enum: Object.values(DifficultyLevel)
  }
}, {
  timestamps: true
});

// Calculate score method
testSessionSchema.methods.calculateScore = function(): number {
  if (this.answers.length === 0) return 0;
  
  const correctAnswers = this.answers.filter((answer: UserAnswer) => answer.isCorrect).length;
  return Math.round((correctAnswers / this.answers.length) * 100);
};

// Get accuracy method
testSessionSchema.methods.getAccuracy = function(): number {
  if (this.answers.length === 0) return 0;
  
  const correctAnswers = this.answers.filter((answer: UserAnswer) => answer.isCorrect).length;
  return (correctAnswers / this.answers.length) * 100;
};

// Get average time method
testSessionSchema.methods.getAverageTime = function(): number {
  if (this.answers.length === 0) return 0;
  
  const totalTime = this.answers.reduce((sum: number, answer: UserAnswer) => sum + answer.timeSpent, 0);
  return totalTime / this.answers.length;
};

// Pre-save middleware to calculate score
testSessionSchema.pre('save', function(next) {
  if ((this as any).completed && (this as any).answers.length > 0) {
    (this as any).score = (this as any).calculateScore();
  }
  next();
});

// Indexes for better query performance
testSessionSchema.index({ userId: 1, createdAt: -1 });
testSessionSchema.index({ mode: 1 });
testSessionSchema.index({ completed: 1 });
testSessionSchema.index({ subject: 1 });

// Static method to get user's recent sessions
testSessionSchema.statics.getRecentSessions = function(userId: string, limit: number = 10) {
  return this.find({ userId, completed: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('questions', 'content subject topic difficulty');
};

// Static method to get daily challenge for user
testSessionSchema.statics.getTodaysDailyChallenge = function(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.findOne({
    userId,
    mode: TestMode.DAILY_CHALLENGE,
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  });
};

export default mongoose.model<TestSessionDocument>('TestSession', testSessionSchema);
