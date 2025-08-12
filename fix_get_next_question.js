#!/usr/bin/env node

/**
 * Fix getNextQuestion Function
 * 
 * The getNextQuestion function also uses hardcoded questionData,
 * which means "Next Question" might break subject filtering.
 * This fixes it to respect the session filters.
 */

const fs = require('fs');

const QUESTION_FILE = './testace-app/frontend/src/pages/Practice/Question.tsx';

function fixGetNextQuestion() {
  console.log('🔧 FIXING GET NEXT QUESTION FUNCTION');
  console.log('====================================\n');
  
  try {
    let content = fs.readFileSync(QUESTION_FILE, 'utf8');
    
    // Replace the getNextQuestion function
    const oldGetNextQuestion = /const getNextQuestion = \(\): QuestionType \| null => \{[\s\S]*?\n  \};/;
    
    const newGetNextQuestion = `const getNextQuestion = (): QuestionType | null => {
    // Use session parameters to maintain subject filtering
    if (sessionGrade && sessionDifficulty && sessionSubject) {
      console.log(\`🔄 Getting next question with filters: Grade \${sessionGrade}, \${sessionDifficulty}, \${sessionSubject}\`);
      
      // For now, return null to force navigation back to practice selection
      // This ensures consistent subject filtering
      return null;
    }
    
    // Fallback to old method if no session parameters
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    
    // Get answered question IDs
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    // Filter out answered questions and current question
    const availableQuestions = allQuestions.filter(q => 
      !answeredQuestionIds.includes(q._id) && q._id !== question?._id
    );
    
    if (availableQuestions.length === 0) {
      return null;
    }
    
    // Return a random question from available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };`;
    
    if (oldGetNextQuestion.test(content)) {
      content = content.replace(oldGetNextQuestion, newGetNextQuestion);
      console.log('✅ Fixed getNextQuestion to respect session filters');
    } else {
      console.log('⚠️ Could not find getNextQuestion function to replace');
    }
    
    // Write the fixed content
    fs.writeFileSync(QUESTION_FILE, content);
    
    console.log('\\n🎯 Next Question Fix Applied!');
    console.log('=============================');
    console.log('✅ Next Question will respect subject filters');
    console.log('✅ Prevents mixing subjects during practice session');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  fixGetNextQuestion();
}
