#!/usr/bin/env node

const fs = require('fs');

function manualQuestionFix() {
  console.log('🔧 MANUAL QUESTION.TSX FIX');
  console.log('==========================\n');
  
  try {
    let content = fs.readFileSync('./testace-app/frontend/src/pages/Practice/Question.tsx', 'utf8');
    
    // Add StaticQuestionLoader import
    if (!content.includes('StaticQuestionLoader')) {
      content = content.replace(
        "import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';",
        "import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';\nimport { StaticQuestionLoader } from '../../utils/staticQuestionLoader';"
      );
      console.log('✅ Added StaticQuestionLoader import');
    }
    
    // Replace the loadQuestion function
    const oldLoadQuestion = `  const loadQuestion = (questionId: string) => {
    setLoading(true);
    
    try {
      // Find question in both standard and generated questions
      const allQuestions = [...questionData, ...getGeneratedQuestions()];
      let foundQuestion = allQuestions.find(q => q._id === questionId);
      
      // If question not found, try to generate a new one
      if (!foundQuestion) {
        console.log(\`Question \${questionId} not found, generating new question\`);
        
        try {
          const grade = getUserGrade().toString();
          const difficulty = DifficultyLevel.MEDIUM;`;
    
    const newLoadQuestion = `  const loadQuestion = async (questionId: string) => {
    setLoading(true);
    
    try {
      console.log(\`🔍 Loading question: \${questionId}\`);
      
      // Parse question ID to extract grade, difficulty, and subject
      const parts = questionId.split('_');
      if (parts.length >= 3) {
        const grade = parts[0].replace('grade', '');
        const difficulty = parts[1];
        const subject = parts[2];
        
        console.log(\`📊 Parsed: Grade \${grade}, \${difficulty}, \${subject}\`);
        
        // Use StaticQuestionLoader ONLY
        const questions = await StaticQuestionLoader.getQuestions(
          grade,
          getDifficultyLevel(difficulty),
          subject,
          50
        );
        
        const foundQuestion = questions.find(q => q._id === questionId);
        
        if (foundQuestion) {
          console.log(\`✅ Found: \${foundQuestion.subject} question\`);
          setQuestion(foundQuestion);
        } else {
          console.error(\`❌ Question \${questionId} not found\`);
          setQuestion(null);
        }
      } else {
        console.error(\`❌ Invalid question ID: \${questionId}\`);
        setQuestion(null);
      }`;
    
    // Find the start and end of the loadQuestion function
    const startIndex = content.indexOf('const loadQuestion = (questionId: string) => {');
    if (startIndex !== -1) {
      // Find the matching closing brace
      let braceCount = 0;
      let endIndex = startIndex;
      let inFunction = false;
      
      for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          inFunction = true;
        } else if (content[i] === '}') {
          braceCount--;
          if (inFunction && braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      // Find the end of the function (including the closing brace and semicolon)
      while (endIndex < content.length && content[endIndex] !== ';') {
        endIndex++;
      }
      endIndex++; // Include the semicolon
      
      // Replace the function
      const beforeFunction = content.substring(0, startIndex);
      const afterFunction = content.substring(endIndex);
      
      content = beforeFunction + newLoadQuestion + `
      
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
  };` + afterFunction;
      
      console.log('✅ Replaced loadQuestion function');
    } else {
      console.log('❌ Could not find loadQuestion function');
    }
    
    // Write the fixed content
    fs.writeFileSync('./testace-app/frontend/src/pages/Practice/Question.tsx', content);
    
    console.log('\\n🎯 Question.tsx Fixed!');
    console.log('======================');
    console.log('✅ Now uses StaticQuestionLoader exclusively');
    console.log('✅ No fallback to questionData or generation');
    console.log('✅ Proper subject filtering implemented');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  manualQuestionFix();
}
