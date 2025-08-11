#!/usr/bin/env node

console.log('🔍 Debugging Enhanced Practice Question Loading...\n');

// Simulate the Enhanced Practice loading process
const testConfigs = [
  { grade: '5', difficulty: 'medium', subject: '', count: 20 },
  { grade: '5', difficulty: 'medium', subject: 'Mathematical Reasoning', count: 20 },
  { grade: '5', difficulty: 'medium', subject: 'Reading', count: 20 },
  { grade: '5', difficulty: 'medium', subject: 'Thinking Skills', count: 20 }
];

console.log('📊 Testing different configurations:\n');

testConfigs.forEach((config, index) => {
  console.log(`${index + 1}. Grade ${config.grade}, ${config.difficulty}${config.subject ? `, ${config.subject}` : ', All Subjects'}`);
  console.log(`   Expected: ${config.count} questions`);
  console.log(`   Status: Checking static files...`);
  
  // Check if static question files exist
  const fs = require('fs');
  const path = require('path');
  
  const staticDir = path.join(__dirname, 'public/questions');
  
  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir);
    const matchingFiles = files.filter(file => {
      const parts = file.replace('.json', '').split('_');
      if (parts.length >= 3) {
        const [fileGrade, fileDifficulty, fileSubject] = parts;
        const gradeMatch = fileGrade === config.grade;
        const difficultyMatch = fileDifficulty === config.difficulty;
        const subjectMatch = !config.subject || fileSubject === config.subject.toLowerCase().replace(/\s+/g, '-');
        return gradeMatch && difficultyMatch && subjectMatch;
      }
      return false;
    });
    
    console.log(`   Found ${matchingFiles.length} matching static files:`);
    matchingFiles.forEach(file => {
      try {
        const filePath = path.join(staticDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`     - ${file}: ${content.length} questions`);
      } catch (error) {
        console.log(`     - ${file}: Error reading file`);
      }
    });
  } else {
    console.log(`   ❌ Static questions directory not found: ${staticDir}`);
  }
  
  console.log('');
});

// Check the Enhanced Practice component configuration
console.log('🔧 Checking Enhanced Practice Component Configuration:\n');

const practiceFile = path.join(__dirname, 'frontend/src/pages/Practice/EnhancedPractice.tsx');

try {
  const practiceContent = fs.readFileSync(practiceFile, 'utf8');
  
  // Check the count parameter
  const countMatch = practiceContent.match(/count:\s*(\d+)/);
  if (countMatch) {
    console.log(`✅ Question count requested: ${countMatch[1]}`);
  } else {
    console.log('❌ Could not find count parameter');
  }
  
  // Check for any slice operations
  const sliceMatches = practiceContent.match(/\.slice\([^)]+\)/g);
  if (sliceMatches) {
    console.log(`⚠️  Found slice operations: ${sliceMatches.join(', ')}`);
  } else {
    console.log('✅ No slice operations found that could limit questions');
  }
  
  // Check for any filter operations
  const filterMatches = practiceContent.match(/\.filter\([^}]+\}/g);
  if (filterMatches) {
    console.log(`🔍 Found filter operations: ${filterMatches.length} filters`);
  }
  
} catch (error) {
  console.error('❌ Error reading Enhanced Practice file:', error.message);
}

console.log('\n💡 Common Issues and Solutions:');
console.log('1. Static question files not generated - Run: npm run generate-questions');
console.log('2. Browser cache showing old data - Hard refresh: Ctrl+Shift+R');
console.log('3. Question generation failing - Check browser console for errors');
console.log('4. Filters too restrictive - Try "All Subjects" instead of specific subject');
console.log('5. Development server needs restart - Stop and start npm start');

console.log('\n🎯 Next Steps:');
console.log('1. Select Grade 5, Medium difficulty, All Subjects in Enhanced Practice');
console.log('2. Check browser developer console for error messages');
console.log('3. Look for the debug log showing how many questions were loaded');
console.log('4. If still showing 3 questions, there may be a display limit in the component');
