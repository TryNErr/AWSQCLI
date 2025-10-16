const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Question schema (simplified)
const questionSchema = new mongoose.Schema({
  content: String,
  options: [String],
  correctAnswer: String,
  explanation: String,
  difficulty: String,
  subject: String,
  grade: Number,
  type: String,
  topic: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);

async function loadQuestions() {
  try {
    console.log('🚀 Loading questions from combined_json_output.json...');
    
    const filePath = path.join(__dirname, 'combined_json_output.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(rawData);
    
    console.log(`📊 Found ${questions.length} questions to load`);
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️ Cleared existing questions');
    
    let loaded = 0;
    let errors = 0;
    
    for (const q of questions) {
      try {
        // Map the question data
        const questionData = {
          content: q.question || q.content,
          options: q.options || [],
          correctAnswer: q.correct_answer || q.correctAnswer,
          explanation: q.explanation || 'No explanation provided',
          difficulty: q.difficulty || 'medium',
          subject: q.subject || 'General',
          grade: q.grade ? Number(q.grade) : null,
          type: q.type || 'multiple_choice',
          topic: q.topic || q.subject || 'General',
          tags: q.tags || [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Validate required fields
        if (!questionData.content || !questionData.correctAnswer) {
          console.warn(`⚠️ Skipping invalid question: missing content or answer`);
          errors++;
          continue;
        }
        
        await Question.create(questionData);
        loaded++;
        
        if (loaded % 1000 === 0) {
          console.log(`📈 Loaded ${loaded} questions...`);
        }
        
      } catch (error) {
        console.warn(`⚠️ Error loading question: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`✅ Successfully loaded ${loaded} questions`);
    console.log(`❌ Failed to load ${errors} questions`);
    
    // Show some stats
    const subjects = await Question.distinct('subject');
    const grades = await Question.distinct('grade');
    
    console.log(`📚 Subjects: ${subjects.join(', ')}`);
    console.log(`🎓 Grades: ${grades.filter(g => g != null).sort((a,b) => a-b).join(', ')}`);
    
  } catch (error) {
    console.error('💥 Error loading questions:', error);
  } finally {
    mongoose.connection.close();
  }
}

loadQuestions();
