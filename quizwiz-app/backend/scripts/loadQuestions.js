const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to parse _id field and extract subject, grade, difficulty
const parseQuestionId = (id) => {
  // Expected format: subject_grade_difficulty_questionNumber
  // Example: math_9_medium_1, science_10_hard_5
  const parts = id.split('_');
  if (parts.length >= 3) {
    return {
      subject: parts[0],
      grade: parts[1],
      difficulty: parts[2]
    };
  }
  return null;
};

// Function to load questions from JSON file
const loadQuestions = async (jsonFilePath) => {
  try {
    console.log('Loading questions from:', jsonFilePath);
    
    // Read JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    // Handle both array and object formats
    let questions = [];
    if (Array.isArray(data)) {
      questions = data;
    } else if (data.questions && Array.isArray(data.questions)) {
      questions = data.questions;
    } else {
      console.error('Invalid JSON format. Expected array of questions or object with questions array.');
      return;
    }

    console.log(`Found ${questions.length} questions in JSON file`);

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    let validQuestions = 0;
    let invalidQuestions = 0;

    // Process each question
    for (const questionData of questions) {
      try {
        // Parse the _id field to get subject, grade, difficulty
        const parsedInfo = parseQuestionId(questionData._id);
        
        if (!parsedInfo) {
          console.warn(`Skipping question with invalid _id format: ${questionData._id}`);
          invalidQuestions++;
          continue;
        }

        // Handle different field names - your format uses 'content' instead of 'question'
        const questionText = questionData.question || questionData.content;
        const correctAnswer = questionData.correctAnswer || questionData.correct_answer;
        
        // Validate required fields
        if (!questionText || !questionData.options || !correctAnswer) {
          console.warn(`Skipping question with missing required fields: ${questionData._id}`);
          invalidQuestions++;
          continue;
        }

        // Create question document
        const question = new Question({
          question: questionText,
          options: questionData.options,
          correctAnswer: correctAnswer,
          subject: parsedInfo.subject,
          grade: parsedInfo.grade,
          difficulty: parsedInfo.difficulty,
          explanation: questionData.explanation || '',
          passage: questionData.passage || null, // Add passage field
          tags: questionData.tags || []
        });

        await question.save();
        validQuestions++;
      } catch (error) {
        console.error(`Error processing question ${questionData._id}:`, error.message);
        invalidQuestions++;
      }
    }

    console.log(`Successfully loaded ${validQuestions} questions`);
    console.log(`Skipped ${invalidQuestions} invalid questions`);

    // Create test user if it doesn't exist
    await createTestUser();

  } catch (error) {
    console.error('Error loading questions:', error);
  }
};

// Function to create a test user
const createTestUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'test@quizwiz.com' });
    
    if (!existingUser) {
      const testUser = new User({
        name: 'Test User',
        email: 'test@quizwiz.com',
        password: 'password123',
        grade: '9'
      });

      await testUser.save();
      console.log('Created test user: test@quizwiz.com / password123');
    } else {
      console.log('Test user already exists: test@quizwiz.com / password123');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// Main execution
const main = async () => {
  try {
    // Check if JSON file path is provided as argument
    const jsonFilePath = process.argv[2];
    
    if (!jsonFilePath) {
      console.log('Usage: node loadQuestions.js <path-to-json-file>');
      console.log('Example: node loadQuestions.js ../data/questions.json');
      process.exit(1);
    }

    // Check if file exists
    if (!fs.existsSync(jsonFilePath)) {
      console.error(`File not found: ${jsonFilePath}`);
      process.exit(1);
    }

    await loadQuestions(jsonFilePath);
    
    console.log('Question loading completed!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { loadQuestions, createTestUser };
