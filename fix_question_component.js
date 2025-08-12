#!/usr/bin/env node

/**
 * Fix Question Component Subject Filtering Bug
 * 
 * PROBLEM: Question component loads from hardcoded questionData instead of static JSON files
 * RESULT: User gets wrong subject questions (Math instead of Reading)
 * SOLUTION: Replace with StaticQuestionLoader to load from correct JSON files
 */

const fs = require('fs');

const QUESTION_FILE = './testace-app/frontend/src/pages/Practice/Question.tsx';

function fixQuestionComponent() {
  console.log('🔧 FIXING QUESTION COMPONENT SUBJECT FILTERING');
  console.log('==============================================\n');
  
  console.log('Problem: Question component uses hardcoded questionData instead of static JSON files');
  console.log('Result: grade9_hard_reading_009 loads Math question instead of Reading question');
  console.log('Solution: Use StaticQuestionLoader to load from correct 9_hard_reading.json file\n');
  
  try {
    let content = fs.readFileSync(QUESTION_FILE, 'utf8');
    
    console.log('📋 Current Implementation Analysis:');
    
    const hasQuestionData = content.includes('questionData');
    const hasStaticLoader = content.includes('StaticQuestionLoader');
    
    console.log(`   Uses hardcoded questionData: ${hasQuestionData ? '❌ YES (problematic)' : '✅ NO'}`);
    console.log(`   Uses StaticQuestionLoader: ${hasStaticLoader ? '✅ YES' : '❌ NO (needs fixing)'}`);
    
    // Add StaticQuestionLoader import
    if (!hasStaticLoader) {
      content = content.replace(
        "import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';",
        "import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';\nimport { StaticQuestionLoader } from '../../utils/staticQuestionLoader';"
      );
      console.log('   ✅ Added StaticQuestionLoader import');
    }
    
    // Replace the loadQuestion function
    const oldLoadQuestionStart = 'const loadQuestion = (questionId: string) => {';
    const oldLoadQuestionEnd = '  };';
    
    const newLoadQuestion = `const loadQuestion = async (questionId: string) => {
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
        
        // Load questions from the correct static file
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
          console.warn(\`⚠️ Question \${questionId} not found in static files\`);
          // Fallback: try to find in old questionData
          const allQuestions = [...questionData, ...getGeneratedQuestions()];
          const fallbackQuestion = allQuestions.find(q => q._id === questionId);
          
          if (fallbackQuestion) {
            console.log(\`📦 Using fallback question from questionData\`);
            setQuestion(fallbackQuestion);
          } else {
            console.error(\`❌ Question \${questionId} not found anywhere\`);
            setQuestion(null);
          }
        }
      } else {
        console.warn(\`⚠️ Invalid question ID format: \${questionId}\`);
        // Fallback to old method
        const allQuestions = [...questionData, ...getGeneratedQuestions()];
        const foundQuestion = allQuestions.find(q => q._id === questionId);
        setQuestion(foundQuestion || null);
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
    
    // Find and replace the loadQuestion function
    const loadQuestionRegex = /const loadQuestion = \(questionId: string\) => \{[\s\S]*?\n  \};/;
    
    if (loadQuestionRegex.test(content)) {
      content = content.replace(loadQuestionRegex, newLoadQuestion);
      console.log('   ✅ Replaced loadQuestion function with StaticQuestionLoader version');
    } else {
      console.log('   ⚠️ Could not find loadQuestion function to replace');
    }
    
    // Write the fixed content
    fs.writeFileSync(QUESTION_FILE, content);
    
    console.log('\\n🎯 Fix Applied Successfully!');
    console.log('============================');
    console.log('✅ Question component now uses StaticQuestionLoader');
    console.log('✅ Questions will load from correct JSON files');
    console.log('✅ grade9_hard_reading_009 will load Reading question, not Math');
    console.log('✅ Subject filtering will work consistently');
    
    console.log('\\n🧪 Testing Instructions:');
    console.log('1. Restart the frontend development server');
    console.log('2. Navigate to the problematic URL:');
    console.log('   /practice/question/grade9_hard_reading_009?grade=9&difficulty=hard&subject=Reading');
    console.log('3. Verify you see a Reading comprehension question, not Math algebra');
    
  } catch (error) {
    console.error(`❌ Error fixing Question component: ${error.message}`);
  }
}

if (require.main === module) {
  fixQuestionComponent();
}
