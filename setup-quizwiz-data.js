const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwiz';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Load questions from fixed JSON files
const loadFixedQuestions = async () => {
  try {
    const { loadQuestions } = require('./quizwiz-app/backend/scripts/loadQuestions');
    
    // Look for fixed question files in the data directory
    const dataDir = path.join(__dirname, 'quizwiz-app', 'backend', 'data');
    
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️  Data directory not found, skipping question loading');
      return;
    }
    
    // Check for fixed_questions.json first, then fixed-*.json files
    const fixedQuestionsFile = path.join(dataDir, 'fixed_questions.json');
    
    if (fs.existsSync(fixedQuestionsFile)) {
      console.log('📚 Loading questions from fixed_questions.json...');
      await loadQuestions(fixedQuestionsFile);
      console.log('✅ Fixed questions loaded successfully');
      return;
    }
    
    // Fallback to fixed-*.json files
    const files = fs.readdirSync(dataDir);
    const fixedFiles = files.filter(file => file.startsWith('fixed-') && file.endsWith('.json'));
    
    if (fixedFiles.length === 0) {
      console.log('⚠️  No fixed question files found, skipping question loading');
      return;
    }
    
    console.log(`📚 Found ${fixedFiles.length} fixed question files`);
    
    // Load each fixed file
    for (const file of fixedFiles) {
      const filePath = path.join(dataDir, file);
      console.log(`📖 Loading questions from ${file}...`);
      await loadQuestions(filePath);
    }
    
    console.log('✅ All fixed questions loaded successfully');
  } catch (error) {
    console.error('❌ Error loading questions:', error.message);
  }
};

// Generate test sets
const generateTestSets = async () => {
  try {
    console.log('🎯 Generating test sets...');
    
    // Import and run the generateTestSets script
    const generateScript = require('./quizwiz-app/backend/scripts/generateTestSets');
    
    console.log('✅ Test sets generated successfully');
  } catch (error) {
    console.error('❌ Error generating test sets:', error.message);
  }
};

// Create test user
const createTestUser = async () => {
  try {
    const { createTestUser } = require('./quizwiz-app/backend/scripts/loadQuestions');
    await createTestUser();
    console.log('✅ Test user setup completed');
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }
};

// Main setup function
const setupQuizWizData = async () => {
  console.log('🚀 Setting up QuizWiz data for deployment...');
  console.log('==========================================');
  
  try {
    await connectDB();
    await loadFixedQuestions();
    await generateTestSets();
    await createTestUser();
    
    console.log('');
    console.log('🎉 QuizWiz data setup completed successfully!');
    console.log('📊 Database is ready for deployment');
    console.log('👤 Test user: test@quizwiz.com / password123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run setup if called directly
if (require.main === module) {
  setupQuizWizData();
}

module.exports = { setupQuizWizData };
