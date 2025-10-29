const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
  explanation: String,
  passage: String, // For reading comprehension questions
  tags: [String]
}, {
  timestamps: true
});

questionSchema.index({ subject: 1, grade: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
