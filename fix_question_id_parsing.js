/**
 * Fix Question ID Parsing Issue
 * 
 * The current Question component has incorrect parsing logic for question IDs.
 * Question IDs like 'eng_6_hard_6' are being parsed incorrectly.
 * 
 * This script will fix the parsing logic in the Question component.
 */

const fs = require('fs');
const path = require('path');

const questionComponentPath = path.join(__dirname, 'testace-app/frontend/src/pages/Practice/Question.tsx');

console.log('🔧 Fixing Question ID parsing logic...');

// Read the current Question component
let questionComponent = fs.readFileSync(questionComponentPath, 'utf8');

// Find the loadQuestion function and fix the parsing logic
const oldParsingLogic = `      // Parse question ID to extract grade, difficulty, and subject
      const parts = questionId.split('_');
      if (parts.length >= 3) {
        const grade = parts[0].replace('grade', '');
        const difficulty = parts[1];
        const subject = parts[2];`;

const newParsingLogic = `      // Parse question ID to extract grade, difficulty, and subject
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
        }`;

// Replace the parsing logic
if (questionComponent.includes(oldParsingLogic)) {
  questionComponent = questionComponent.replace(oldParsingLogic, newParsingLogic);
  console.log('✅ Updated question ID parsing logic');
} else {
  console.log('⚠️ Could not find the exact parsing logic to replace');
  console.log('Looking for alternative patterns...');
  
  // Try to find a more flexible pattern
  const alternativePattern = /\/\/ Parse question ID to extract grade, difficulty, and subject[\s\S]*?const subject = parts\[2\];/;
  if (alternativePattern.test(questionComponent)) {
    questionComponent = questionComponent.replace(alternativePattern, newParsingLogic);
    console.log('✅ Updated question ID parsing logic (alternative pattern)');
  } else {
    console.log('❌ Could not find parsing logic to update');
    process.exit(1);
  }
}

// Write the updated component back
fs.writeFileSync(questionComponentPath, questionComponent);

console.log('✅ Question component updated successfully!');
console.log('');
console.log('🎯 The fix handles these question ID formats:');
console.log('   - eng_6_hard_6 -> English, Grade 6, Hard');
console.log('   - math_6_hard_6 -> Mathematics, Grade 6, Hard');
console.log('   - reading_6_hard_6 -> Reading, Grade 6, Hard');
console.log('   - thinking_6_hard_6 -> Thinking Skills, Grade 6, Hard');
console.log('   - grade6_hard_math -> Grade 6, Hard, Math (legacy format)');
console.log('');
console.log('🚀 Now redeploy your app to fix the "question not found" issue!');
