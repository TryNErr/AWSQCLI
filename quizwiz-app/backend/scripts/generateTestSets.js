const mongoose = require('mongoose');
const Question = require('../models/Question');
const TestSet = require('../models/TestSet');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwiz');

async function generateTestSets() {
  try {
    console.log('Starting test set generation...');
    
    // Clear existing test sets
    await TestSet.deleteMany({});
    console.log('Cleared existing test sets');
    
    // Get all unique combinations of subject, grade, difficulty
    const combinations = await Question.aggregate([
      {
        $group: {
          _id: {
            subject: '$subject',
            grade: '$grade',
            difficulty: '$difficulty'
          },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gte: 15 } // Only combinations with at least 15 questions
        }
      }
    ]);
    
    console.log(`Found ${combinations.length} valid combinations`);
    
    let totalTestSets = 0;
    
    for (const combo of combinations) {
      const { subject, grade, difficulty } = combo._id;
      const questionCount = combo.count;
      
      console.log(`Processing ${subject} - Grade ${grade} - ${difficulty} (${questionCount} questions)`);
      
      // Get all questions for this combination
      const questions = await Question.find({
        subject,
        grade,
        difficulty
      }).select('_id');
      
      // Shuffle questions
      const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
      
      // Create test sets for both practice and exam modes
      const modes = ['practice', 'exam'];
      
      for (const mode of modes) {
        // Create separate question pools for practice and exam
        const modeQuestions = [...shuffledQuestions];
        let setNumber = 1;
        
        // Create sets of 15 questions each
        while (modeQuestions.length >= 15) {
          const setQuestions = modeQuestions.splice(0, 15);
          
          const testSet = new TestSet({
            name: `${subject} Grade ${grade} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} - Set ${setNumber}`,
            subject,
            grade,
            difficulty,
            mode,
            setNumber,
            questions: setQuestions.map(q => q._id),
            totalQuestions: 15
          });
          
          await testSet.save();
          totalTestSets++;
          setNumber++;
        }
        
        console.log(`  Created ${setNumber - 1} ${mode} sets`);
      }
    }
    
    console.log(`\nTest set generation completed!`);
    console.log(`Total test sets created: ${totalTestSets}`);
    
    // Show summary
    const summary = await TestSet.aggregate([
      {
        $group: {
          _id: {
            subject: '$subject',
            grade: '$grade',
            difficulty: '$difficulty',
            mode: '$mode'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.subject': 1,
          '_id.grade': 1,
          '_id.difficulty': 1,
          '_id.mode': 1
        }
      }
    ]);
    
    console.log('\nTest Set Summary:');
    console.log('Subject | Grade | Difficulty | Mode | Sets');
    console.log('--------|-------|------------|------|-----');
    
    for (const item of summary) {
      const { subject, grade, difficulty, mode } = item._id;
      console.log(`${subject.padEnd(7)} | ${grade.padEnd(5)} | ${difficulty.padEnd(10)} | ${mode.padEnd(4)} | ${item.count}`);
    }
    
  } catch (error) {
    console.error('Error generating test sets:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
generateTestSets();
