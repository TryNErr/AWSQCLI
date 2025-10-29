const mongoose = require('mongoose');

const disputedQuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  testSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSet',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  wasMarkedCorrect: {
    type: Boolean,
    required: true
  },
  disputeReason: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DisputedQuestion', disputedQuestionSchema);
