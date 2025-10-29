const mongoose = require('mongoose');
const Question = require('../models/Question');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixCorrectAnswers = async () => {
  try {
    console.log('Starting to fix correct answers...');
    
    // Find all questions
    const questions = await Question.find({});
    console.log(`Found ${questions.length} questions to check`);
    
    let fixedCount = 0;
    
    for (const question of questions) {
      let needsUpdate = false;
      let newCorrectAnswer = question.correctAnswer;
      
      // If correctAnswer is a number, find the matching option
      if (typeof question.correctAnswer === 'number') {
        const numberAnswer = question.correctAnswer;
        
        // Look for matching option that contains this number
        const matchingOption = question.options.find(option => {
          // Check if option contains the number (e.g., "50 cents" contains 50)
          return option.includes(numberAnswer.toString());
        });
        
        if (matchingOption) {
          newCorrectAnswer = matchingOption;
          needsUpdate = true;
          console.log(`Question ${question._id}: ${numberAnswer} -> ${matchingOption}`);
        }
      }
      
      // Update if needed
      if (needsUpdate) {
        await Question.findByIdAndUpdate(question._id, {
          correctAnswer: newCorrectAnswer
        });
        fixedCount++;
      }
    }
    
    console.log(`Fixed ${fixedCount} questions`);
    console.log('Correct answer fixing completed!');
    
  } catch (error) {
    console.error('Error fixing correct answers:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the fix
fixCorrectAnswers();
