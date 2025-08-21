const fs = require('fs');
const path = require('path');

// Test the Grade 9 hard reading file specifically
const filePath = '/workspaces/AWSQCLI/testace-app/frontend/public/questions/9_hard_reading.json';

console.log('🔍 Testing Grade 9 Hard Reading Questions...\n');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(content);
  
  console.log(`📄 File loaded: ${questions.length} questions found`);
  
  // Check first few questions
  questions.slice(0, 3).forEach((q, index) => {
    console.log(`\n📝 Question ${index + 1}:`);
    console.log(`   ID: ${q._id}`);
    console.log(`   Content: "${q.content.substring(0, 50)}..."`);
    console.log(`   Options: ${q.options ? q.options.length : 'MISSING'} choices`);
    console.log(`   Subject: "${q.subject}"`);
    console.log(`   Grade: "${q.grade}" (type: ${typeof q.grade})`);
    console.log(`   Difficulty: "${q.difficulty}"`);
    console.log(`   CorrectAnswer: "${q.correctAnswer}" (present: ${!!q.correctAnswer})`);
    
    // Validation check
    const isValid = !!(q._id && q.content && q.options && q.correctAnswer && q.subject && q.grade && q.difficulty);
    console.log(`   ✅ Valid: ${isValid}`);
    
    if (!isValid) {
      const missing = [];
      if (!q._id) missing.push('_id');
      if (!q.content) missing.push('content');
      if (!q.options) missing.push('options');
      if (!q.correctAnswer) missing.push('correctAnswer');
      if (!q.subject) missing.push('subject');
      if (!q.grade) missing.push('grade');
      if (!q.difficulty) missing.push('difficulty');
      console.log(`   ❌ Missing fields: ${missing.join(', ')}`);
    }
  });
  
  // Check for duplicates
  const contentMap = new Map();
  let duplicates = 0;
  questions.forEach((q, index) => {
    const contentKey = q.content.substring(0, 100);
    if (contentMap.has(contentKey)) {
      duplicates++;
      console.log(`\n⚠️  Duplicate found: Question ${index + 1} matches Question ${contentMap.get(contentKey) + 1}`);
    } else {
      contentMap.set(contentKey, index);
    }
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total questions: ${questions.length}`);
  console.log(`   Duplicates found: ${duplicates}`);
  
  // Validate all questions
  const validQuestions = questions.filter(q => 
    q._id && 
    q.content && 
    q.options && 
    q.correctAnswer &&
    q.subject &&
    q.grade &&
    q.difficulty
  );
  
  console.log(`   Valid questions: ${validQuestions.length}/${questions.length}`);
  
  if (validQuestions.length === 0) {
    console.log(`\n❌ NO VALID QUESTIONS FOUND - This explains the loading error!`);
  } else {
    console.log(`\n✅ ${validQuestions.length} valid questions should load properly`);
  }
  
} catch (error) {
  console.log(`❌ Error loading file: ${error.message}`);
}
