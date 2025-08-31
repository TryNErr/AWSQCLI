const express = require('express');
const MathQuestionGenerator = require('../utils/questionGenerator');

const router = express.Router();
const generator = new MathQuestionGenerator();

// Generate unlimited math questions
router.post('/generate', (req, res) => {
  try {
    const { grade, difficulty, count = 10 } = req.body;
    
    // Validate inputs
    if (!grade || !difficulty) {
      return res.status(400).json({ 
        error: 'Grade and difficulty are required' 
      });
    }
    
    if (count > 100) {
      return res.status(400).json({ 
        error: 'Maximum 100 questions per request' 
      });
    }
    
    // Generate questions
    const questions = generator.generateQuestion(
      parseInt(grade), 
      difficulty.toLowerCase(), 
      parseInt(count)
    );
    
    res.json({
      success: true,
      count: Array.isArray(questions) ? questions.length : 1,
      questions: Array.isArray(questions) ? questions : [questions],
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message 
    });
  }
});

// Get available grades and difficulties
router.get('/options', (req, res) => {
  const availableOptions = {
    grades: [1, 5, 9, 12],
    difficulties: ['easy', 'medium', 'hard'],
    maxCount: 100
  };
  
  res.json(availableOptions);
});

module.exports = router;
