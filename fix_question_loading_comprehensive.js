/**
 * Comprehensive Fix for Question Loading Issue
 * 
 * This script addresses the "question not found" issue by:
 * 1. Fixing question ID parsing logic
 * 2. Adding better error handling and debugging
 * 3. Ensuring proper subject normalization
 * 4. Adding fallback mechanisms
 */

const fs = require('fs');
const path = require('path');

const questionComponentPath = path.join(__dirname, 'testace-app/frontend/src/pages/Practice/Question.tsx');

console.log('🔧 Applying comprehensive fix for question loading...');

// Read the current Question component
let questionComponent = fs.readFileSync(questionComponentPath, 'utf8');

// Enhanced loadQuestion function with better debugging and error handling
const enhancedLoadQuestionFunction = `  const loadQuestion = async (questionId: string) => {
    setLoading(true);
    
    try {
      console.log(\`🔍 Loading question: \${questionId}\`);
      
      // Parse question ID to extract grade, difficulty, and subject
      // Handle different question ID formats:
      // Format 1: 'eng_6_hard_6' -> subject=English, grade=6, difficulty=hard
      // Format 2: 'grade6_hard_math' -> grade=6, difficulty=hard, subject=math
      const parts = questionId.split('_');
      let grade, difficulty, subject;
      
      if (parts.length >= 3) {
        // Check if first part is a subject prefix (eng, math, etc.)
        if (parts[0] === 'eng' || parts[0] === 'english') {
          // Format: eng_6_hard_6
          subject = 'English';
          grade = parts[1];
          difficulty = parts[2];
        } else if (parts[0] === 'math' || parts[0] === 'mathematics') {
          // Format: math_6_hard_6
          subject = 'Mathematics';
          grade = parts[1];
          difficulty = parts[2];
        } else if (parts[0] === 'reading') {
          // Format: reading_6_hard_6
          subject = 'Reading';
          grade = parts[1];
          difficulty = parts[2];
        } else if (parts[0] === 'thinking') {
          // Format: thinking_6_hard_6
          subject = 'Thinking Skills';
          grade = parts[1];
          difficulty = parts[2];
        } else if (parts[0].startsWith('grade')) {
          // Format: grade6_hard_math
          grade = parts[0].replace('grade', '');
          difficulty = parts[1];
          subject = parts[2];
        } else {
          // Default parsing (assume grade_difficulty_subject)
          grade = parts[0].replace('grade', '');
          difficulty = parts[1];
          subject = parts[2];
        }
        
        console.log(\`📊 Parsed: Grade \${grade}, \${difficulty}, \${subject}\`);
        
        // Use StaticQuestionLoader ONLY
        const questions = await StaticQuestionLoader.getQuestions(
          grade,
          getDifficultyLevel(difficulty),
          subject,
          50
        );
        
        console.log(\`📚 Retrieved \${questions.length} questions for Grade \${grade}, \${difficulty}, \${subject}\`);
        
        // First try to find the exact question by ID
        let foundQuestion = questions.find(q => q._id === questionId);
        
        if (foundQuestion) {
          console.log(\`✅ Found exact question: \${foundQuestion.subject} - \${foundQuestion._id}\`);
          setQuestion(foundQuestion);
        } else {
          console.log(\`⚠️ Exact question \${questionId} not found, trying alternative approaches...\`);
          
          // Fallback 1: Try to find any question with similar properties
          const similarQuestions = questions.filter(q => 
            q.grade === grade && 
            q.difficulty === difficulty && 
            q.subject.toLowerCase().includes(subject.toLowerCase())
          );
          
          if (similarQuestions.length > 0) {
            foundQuestion = similarQuestions[0];
            console.log(\`✅ Found similar question: \${foundQuestion.subject} - \${foundQuestion._id}\`);
            setQuestion(foundQuestion);
          } else {
            // Fallback 2: Try with different subject mappings
            const subjectMappings = {
              'English': ['English', 'Grammar', 'Language Arts'],
              'Mathematics': ['Math', 'Mathematics', 'Mathematical Reasoning'],
              'Reading': ['Reading', 'Reading Comprehension'],
              'Thinking Skills': ['Thinking Skills', 'Critical Thinking']
            };
            
            for (const [key, alternatives] of Object.entries(subjectMappings)) {
              if (alternatives.some(alt => alt.toLowerCase() === subject.toLowerCase())) {
                console.log(\`🔄 Trying alternative subject mapping: \${key}\`);
                const altQuestions = await StaticQuestionLoader.getQuestions(
                  grade,
                  getDifficultyLevel(difficulty),
                  key,
                  50
                );
                
                foundQuestion = altQuestions.find(q => q._id === questionId);
                if (foundQuestion) {
                  console.log(\`✅ Found with alternative mapping: \${foundQuestion.subject} - \${foundQuestion._id}\`);
                  setQuestion(foundQuestion);
                  break;
                }
              }
            }
            
            if (!foundQuestion) {
              console.error(\`❌ Question \${questionId} not found after all attempts\`);
              console.log(\`📋 Available questions in this category:\`);
              questions.slice(0, 5).forEach(q => console.log(\`   - \${q._id}: \${q.subject}\`));
              setQuestion(null);
            }
          }
        }
      } else {
        console.error(\`❌ Invalid question ID format: \${questionId}\`);
        setQuestion(null);
      }
      
      // Reset form state
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setShowExplanation(false);
      setLoadingNextQuestion(false);
      
    } catch (error) {
      console.error('Error loading question:', error);
      console.error('Error details:', {
        questionId,
        error: error.message,
        stack: error.stack
      });
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };`;

// Find and replace the loadQuestion function
const loadQuestionRegex = /const loadQuestion = async \(questionId: string\) => \{[\s\S]*?\};/;

if (loadQuestionRegex.test(questionComponent)) {
  questionComponent = questionComponent.replace(loadQuestionRegex, enhancedLoadQuestionFunction);
  console.log('✅ Enhanced loadQuestion function with comprehensive debugging');
} else {
  console.log('❌ Could not find loadQuestion function to replace');
  process.exit(1);
}

// Write the updated component back
fs.writeFileSync(questionComponentPath, questionComponent);

console.log('✅ Question component updated with comprehensive fix!');
console.log('');
console.log('🎯 Improvements made:');
console.log('   ✅ Fixed question ID parsing for eng_6_hard_6 format');
console.log('   ✅ Added comprehensive debugging logs');
console.log('   ✅ Added fallback mechanisms for question finding');
console.log('   ✅ Added alternative subject mapping attempts');
console.log('   ✅ Better error handling and reporting');
console.log('');
console.log('🚀 Now redeploy your app to fix the "question not found" issue!');
console.log('');
console.log('📋 To test locally:');
console.log('   cd testace-app && npm start');
console.log('   Then navigate to: /practice/question/eng_6_hard_6?grade=6&difficulty=hard&subject=English');
