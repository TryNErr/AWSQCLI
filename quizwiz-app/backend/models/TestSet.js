const mongoose = require('mongoose');

const testSetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
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
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  totalQuestions: {
    type: Number,
    default: 15
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique test sets
testSetSchema.index({ 
  subject: 1, 
  grade: 1, 
  difficulty: 1, 
  mode: 1, 
  setNumber: 1 
}, { unique: true });

// Index for efficient querying
testSetSchema.index({ subject: 1, grade: 1, difficulty: 1, mode: 1 });

module.exports = mongoose.model('TestSet', testSetSchema);
