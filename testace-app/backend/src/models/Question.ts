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
    type: Schema.Types.ObjectId as any,
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

// Enhanced static method to get random questions with fallback strategies
questionSchema.statics.getRandomQuestions = function(
  count: number,
  filters: {
    subject?: string;
    topic?: string;
    difficulty?: DifficultyLevel;
    type?: QuestionType;
  } = {}
) {
  const pipeline = [];
  
  // Primary match stage
  const matchStage: any = {};
  if (filters.subject) matchStage.subject = filters.subject;
  if (filters.topic) matchStage.topic = filters.topic;
  if (filters.difficulty) matchStage.difficulty = filters.difficulty;
  if (filters.type) matchStage.type = filters.type;
  
  pipeline.push({ $match: matchStage });
  pipeline.push({ $sample: { size: count * 2 } }); // Get more than needed for better randomization
  
  return this.aggregate(pipeline).then(questions => {
    // If we don't have enough questions, try with relaxed filters
    if (questions.length < count) {
      console.log(`Only found ${questions.length} questions with strict filters, trying flexible matching...`);
      
      // Try without difficulty filter
      const relaxedMatch = { ...matchStage };
      delete relaxedMatch.difficulty;
      
      return this.aggregate([
        { $match: relaxedMatch },
        { $sample: { size: count * 2 } }
      ]).then(relaxedQuestions => {
        if (relaxedQuestions.length < count) {
          console.log(`Still only found ${relaxedQuestions.length} questions, trying subject-only filter...`);
          
          // Try with subject only
          const subjectOnlyMatch = filters.subject ? { subject: filters.subject } : {};
          
          return this.aggregate([
            { $match: subjectOnlyMatch },
            { $sample: { size: count * 2 } }
          ]).then(subjectQuestions => {
            if (subjectQuestions.length < count) {
              console.log(`Found ${subjectQuestions.length} questions with subject filter, getting all available...`);
              
              // Get all questions as last resort
              return this.aggregate([
                { $sample: { size: count * 3 } }
              ]).then(allQuestions => {
                console.log(`Final fallback: ${allQuestions.length} questions from entire database`);
                return allQuestions.slice(0, count);
              });
            }
            return subjectQuestions.slice(0, count);
          });
        }
        return relaxedQuestions.slice(0, count);
      });
    }
    
    return questions.slice(0, count);
  });
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
