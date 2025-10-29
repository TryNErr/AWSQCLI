const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSet',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  mode: {
    type: String,
    required: true,
    enum: ['practice', 'exam']
  },
  setNumber: {
    type: Number,
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    question: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number // time spent on this question in seconds
  }],
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeSpent: Number, // total time in seconds
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

quizResultSchema.index({ user: 1, completedAt: -1 });
quizResultSchema.index({ user: 1, subject: 1 });
quizResultSchema.index({ user: 1, testSet: 1 });
quizResultSchema.index({ testSet: 1, user: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
