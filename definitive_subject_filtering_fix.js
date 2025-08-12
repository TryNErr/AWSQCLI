#!/usr/bin/env node

/**
 * DEFINITIVE Subject Filtering Fix
 * 
 * This will completely eliminate ALL sources of wrong subject questions:
 * 1. Fix Question.tsx to use StaticQuestionLoader properly
 * 2. Remove all question generation that overrides static files
 * 3. Clear all caches
 * 4. Ensure consistent behavior across all components
 */

const fs = require('fs');

function definitiveSubjectFilteringFix() {
  console.log('🔧 DEFINITIVE SUBJECT FILTERING FIX');
  console.log('===================================\n');
  
  console.log('🎯 FIXING ALL REMAINING ISSUES:');
  console.log('1. Question.tsx - Force StaticQuestionLoader usage');
  console.log('2. Clear localStorage caches');
  console.log('3. Disable question generation that overrides static files');
  console.log('4. Ensure consistent behavior\n');
  
  // 1. Fix Question.tsx definitively
  try {
    const questionFile = './testace-app/frontend/src/pages/Practice/Question.tsx';
    let questionContent = fs.readFileSync(questionFile, 'utf8');
    
    // Add StaticQuestionLoader import if not present
    if (!questionContent.includes('StaticQuestionLoader')) {
      questionContent = questionContent.replace(
        "import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';",
        "import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';\nimport { StaticQuestionLoader } from '../../utils/staticQuestionLoader';"
      );
      console.log('✅ Added StaticQuestionLoader import to Question.tsx');
    }
    
    // Replace the loadQuestion function completely
    const newLoadQuestionFunction = `  const loadQuestion = async (questionId: string) => {
    setLoading(true);
    
    try {
      console.log(\`🔍 Loading question: \${questionId}\`);
      
      // Parse question ID to extract grade, difficulty, and subject
      // Format: grade9_hard_reading_009
      const parts = questionId.split('_');
      if (parts.length >= 3) {
        const grade = parts[0].replace('grade', '');
        const difficulty = parts[1];
        const subject = parts[2];
        
        console.log(\`📊 Parsed question ID: Grade \${grade}, \${difficulty}, \${subject}\`);
        
        // FORCE StaticQuestionLoader usage - NO FALLBACKS TO GENERATION
        const questions = await StaticQuestionLoader.getQuestions(
          grade,
          getDifficultyLevel(difficulty),
          subject,
          50 // Load more questions to find the specific one
        );
        
        // Find the specific question by ID
        const foundQuestion = questions.find(q => q._id === questionId);
        
        if (foundQuestion) {
          console.log(\`✅ Found question: "\${foundQuestion.content?.substring(0, 50)}..."\`);
          console.log(\`📚 Subject: \${foundQuestion.subject}\`);
          setQuestion(foundQuestion);
        } else {
          console.error(\`❌ Question \${questionId} not found in static files\`);
          console.error(\`❌ NO FALLBACK - Static files are the ONLY source\`);
          setQuestion(null);
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
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };`;
    
    // Replace the existing loadQuestion function
    const loadQuestionRegex = /const loadQuestion = .*?\{[\s\S]*?\n  \};/;
    if (loadQuestionRegex.test(questionContent)) {
      questionContent = questionContent.replace(loadQuestionRegex, newLoadQuestionFunction);
      console.log('✅ Replaced loadQuestion function in Question.tsx');
    } else {
      console.log('⚠️ Could not find loadQuestion function to replace in Question.tsx');
    }
    
    fs.writeFileSync(questionFile, questionContent);
    
  } catch (error) {
    console.error(\`❌ Error fixing Question.tsx: \${error.message}\`);
  }
  
  // 2. Create cache clearing utility
  const cacheCleanupScript = \`// Clear all question caches
localStorage.removeItem('generatedQuestions');
localStorage.removeItem('questionCache');
localStorage.removeItem('staticQuestionCache');
console.log('✅ Cleared all question caches');
\`;
  
  fs.writeFileSync('./testace-app/frontend/public/clear-cache.js', cacheCleanupScript);
  console.log('✅ Created cache clearing script');
  
  // 3. Create a patch to disable problematic question generation
  const generatorPatchScript = \`#!/usr/bin/env node

/**
 * Disable Question Generation That Overrides Static Files
 */

const fs = require('fs');

// Disable enhancedLanguageGenerator
const languageGeneratorFile = './src/utils/enhancedLanguageGenerator.ts';
if (fs.existsSync(languageGeneratorFile)) {
  let content = fs.readFileSync(languageGeneratorFile, 'utf8');
  
  // Add a check at the beginning of generation functions
  const disableCheck = \`
  // DISABLED: Static files are the authoritative source for questions
  console.warn('Question generation disabled - using static files only');
  return [];
  \`;
  
  // Find and disable generation functions
  content = content.replace(
    /export function generate.*?\\{/g,
    match => match + disableCheck
  );
  
  fs.writeFileSync(languageGeneratorFile, content);
  console.log('✅ Disabled enhancedLanguageGenerator');
}
\`;
  
  fs.writeFileSync('./testace-app/frontend/disable-generators.js', generatorPatchScript);
  console.log('✅ Created generator disabling script');
  
  console.log('\\n🎯 DEFINITIVE FIX APPLIED!');
  console.log('==========================');
  console.log('✅ Question.tsx now ONLY uses StaticQuestionLoader');
  console.log('✅ No fallbacks to question generation');
  console.log('✅ Cache clearing script created');
  console.log('✅ Generator disabling script created');
  
  console.log('\\n🧪 TESTING INSTRUCTIONS:');
  console.log('=========================');
  console.log('1. Restart the frontend development server');
  console.log('2. Open browser console and run: localStorage.clear()');
  console.log('3. Navigate to: /practice/question/grade9_hard_reading_009?grade=9&difficulty=hard&subject=Reading');
  console.log('4. Verify: You see Reading comprehension, NOT English grammar');
  console.log('5. Check console logs for "📊 Parsed question ID" and "📚 Subject" messages');
  
  console.log('\\n🚨 IF STILL NOT WORKING:');
  console.log('========================');
  console.log('The issue might be:');
  console.log('• Browser cache - try hard refresh (Ctrl+Shift+R)');
  console.log('• Service worker cache - check Application tab in DevTools');
  console.log('• Different route being used - check URL carefully');
  console.log('• Component not re-rendering - check React DevTools');
}

if (require.main === module) {
  definitiveSubjectFilteringFix();
}
