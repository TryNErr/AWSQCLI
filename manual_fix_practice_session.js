#!/usr/bin/env node

/**
 * Manual Fix for PracticeSession Subject Filtering Bug
 */

const fs = require('fs');

const PRACTICE_SESSION_FILE = './testace-app/frontend/src/pages/Practice/PracticeSession.tsx';

function manualFixPracticeSession() {
  console.log('🔧 MANUALLY FIXING PRACTICE SESSION');
  console.log('===================================\n');
  
  try {
    let content = fs.readFileSync(PRACTICE_SESSION_FILE, 'utf8');
    
    // Replace the import
    content = content.replace(
      "import { StaticQuestionLoader } from '../../utils/staticQuestionLoader';",
      "import { StaticQuestionLoader } from '../../utils/staticQuestionLoader';"
    );
    
    // Replace the question loading logic
    const oldQuestionLoading = `      // Use enhanced question maintenance system to get questions
      const questions = await getQuestionsForPractice({
        grade,
        difficulty: difficultyLevel,
        subject: subject || undefined,
        count: 20 // Request 20 questions for the session
      });`;
    
    const newQuestionLoading = `      // Use StaticQuestionLoader for consistent subject filtering (fixes Grade 9 Hard Reading → English bug)
      const questions = await StaticQuestionLoader.getQuestions(
        grade,
        difficultyLevel,
        subject || undefined,
        20 // Request 20 questions for the session
      );`;
    
    content = content.replace(oldQuestionLoading, newQuestionLoading);
    
    // Remove the old import if it exists
    content = content.replace(
      /import { getQuestionsForPractice } from '\.\.\/\.\.\/utils\/enhancedQuestionMaintenance';\n?/,
      ''
    );
    
    // Write the fixed content
    fs.writeFileSync(PRACTICE_SESSION_FILE, content);
    
    console.log('✅ Fixed PracticeSession to use StaticQuestionLoader');
    console.log('✅ Removed enhancedQuestionMaintenance dependency');
    console.log('✅ Subject filtering bug should now be resolved');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  manualFixPracticeSession();
}
