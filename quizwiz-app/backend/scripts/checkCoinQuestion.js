const mongoose = require('mongoose');
const Question = require('../models/Question');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkCoinQuestion = async () => {
  try {
    console.log('Searching for coin questions...');
    
    // Find questions about coins
    const coinQuestions = await Question.find({
      question: { $regex: /coin.*worth.*most/i }
    });
    
    console.log(`Found ${coinQuestions.length} coin questions:`);
    
    coinQuestions.forEach((q, index) => {
      console.log(`\n${index + 1}. ID: ${q._id}`);
      console.log(`   Question: ${q.question}`);
      console.log(`   Options: ${JSON.stringify(q.options)}`);
      console.log(`   Correct Answer: "${q.correctAnswer}" (type: ${typeof q.correctAnswer})`);
      console.log(`   Subject: ${q.subject}, Grade: ${q.grade}, Difficulty: ${q.difficulty}`);
    });
    
  } catch (error) {
    console.error('Error checking coin questions:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the check
checkCoinQuestion();
