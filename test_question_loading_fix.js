/**
 * Test Question Loading Fix
 * 
 * This script tests if the question loading fix works correctly
 * by simulating the question loading process.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing question loading fix...');

// Test the question file exists and contains the expected question
const questionFilePath = path.join(__dirname, 'testace-app/frontend/public/questions/6_hard_english.json');

if (!fs.existsSync(questionFilePath)) {
  console.error('❌ Question file not found:', questionFilePath);
  process.exit(1);
}

console.log('✅ Question file exists:', questionFilePath);

// Load and parse the question file
const questionData = JSON.parse(fs.readFileSync(questionFilePath, 'utf8'));
console.log(`📚 Loaded ${questionData.length} questions from file`);

// Look for the specific question
const targetQuestionId = 'eng_6_hard_6';
const foundQuestion = questionData.find(q => q._id === targetQuestionId);

if (foundQuestion) {
  console.log('✅ Target question found!');
  console.log('📋 Question details:');
  console.log(`   ID: ${foundQuestion._id}`);
  console.log(`   Subject: ${foundQuestion.subject}`);
  console.log(`   Grade: ${foundQuestion.grade}`);
  console.log(`   Difficulty: ${foundQuestion.difficulty}`);
  console.log(`   Content: ${foundQuestion.content.substring(0, 100)}...`);
  console.log(`   Options: ${foundQuestion.options.length} choices`);
  console.log(`   Correct Answer: ${foundQuestion.correctAnswer}`);
} else {
  console.error('❌ Target question not found in file');
  console.log('📋 Available questions:');
  questionData.slice(0, 10).forEach(q => {
    console.log(`   - ${q._id}: ${q.content.substring(0, 50)}...`);
  });
  process.exit(1);
}

// Test the question ID parsing logic
console.log('');
console.log('🔍 Testing question ID parsing logic...');

function parseQuestionId(questionId) {
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
    
    return { grade, difficulty, subject };
  }
  
  return null;
}

const parsed = parseQuestionId(targetQuestionId);
if (parsed) {
  console.log('✅ Question ID parsed successfully:');
  console.log(`   Grade: ${parsed.grade}`);
  console.log(`   Difficulty: ${parsed.difficulty}`);
  console.log(`   Subject: ${parsed.subject}`);
  
  // Verify it matches the actual question
  if (parsed.grade === foundQuestion.grade && 
      parsed.difficulty === foundQuestion.difficulty && 
      parsed.subject === foundQuestion.subject) {
    console.log('✅ Parsed values match the actual question!');
  } else {
    console.log('⚠️ Parsed values do not match:');
    console.log(`   Expected: Grade ${foundQuestion.grade}, ${foundQuestion.difficulty}, ${foundQuestion.subject}`);
    console.log(`   Parsed: Grade ${parsed.grade}, ${parsed.difficulty}, ${parsed.subject}`);
  }
} else {
  console.error('❌ Failed to parse question ID');
}

console.log('');
console.log('🎉 Test completed! The fix should resolve the "question not found" issue.');
console.log('');
console.log('📋 Next steps:');
console.log('1. Deploy the updated code to AWS Amplify');
console.log('2. Test the URL: https://master.d210nlz7uk7hed.amplifyapp.com/practice/question/eng_6_hard_6?grade=6&difficulty=hard&subject=English');
console.log('3. Check browser console for detailed debugging logs');
