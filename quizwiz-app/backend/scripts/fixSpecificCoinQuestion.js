const mongoose = require('mongoose');
const Question = require('../models/Question');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixSpecificCoinQuestion = async () => {
  try {
    console.log('Fixing specific coin question...');
    
    // Find the problematic question
    const question = await Question.findById('6901cee43b11a44f20795b4b');
    
    if (question) {
      console.log('Found question:');
      console.log(`Question: ${question.question}`);
      console.log(`Options: ${JSON.stringify(question.options)}`);
      console.log(`Current Correct Answer: "${question.correctAnswer}"`);
      
      // Update the correct answer to match the option
      await Question.findByIdAndUpdate(question._id, {
        correctAnswer: "50 cents"
      });
      
      console.log('Updated correct answer to: "50 cents"');
      console.log('Fix completed!');
    } else {
      console.log('Question not found');
    }
    
  } catch (error) {
    console.error('Error fixing question:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the fix
fixSpecificCoinQuestion();
