const mongoose = require('mongoose');

const userTestProgressSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  attempts: [{
    attemptNumber: Number,
    startedAt: Date,
    completedAt: Date,
    score: Number,
    correctAnswers: Number,
    totalQuestions: Number,
    timeSpent: Number, // in seconds
    answers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      userAnswer: String,
      isCorrect: Boolean,
      timeSpent: Number // time spent on this question
    }]
  }],
  bestScore: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: Date
}, {
  timestamps: true
});

// Compound index for unique user-testset combinations
userTestProgressSchema.index({ user: 1, testSet: 1 }, { unique: true });

// Index for efficient querying
userTestProgressSchema.index({ user: 1, status: 1 });
userTestProgressSchema.index({ user: 1, lastAttemptAt: -1 });

module.exports = mongoose.model('UserTestProgress', userTestProgressSchema);
