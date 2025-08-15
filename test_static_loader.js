const fs = require('fs');

console.log('🧪 TESTING STATICQUESTIONLOADER DIRECTLY...');

// Simulate the StaticQuestionLoader logic exactly as it would work
const questionId = 'hard9_1755260455350_002';
const grade = '9';
const difficulty = 'hard';
const subject = 'Mathematical Reasoning';

console.log(`\n🎯 Testing: ${questionId}`);
console.log(`📊 Parameters: Grade ${grade}, ${difficulty}, ${subject}`);

// Step 1: Normalize subject (from StaticQuestionLoader)
function normalizeSubject(subject) {
  const normalized = subject.toLowerCase().trim();
  
  // EXACT matches first (most specific) - map to static file names
  if (normalized === 'math' || normalized === 'mathematics') {
    return 'math';
  }
  if (normalized === 'mathematical reasoning') {
    return 'mathematical-reasoning'; // Mathematical reasoning has its own files
  }
  if (normalized === 'reading' || normalized === 'reading comprehension') {
    return 'reading';
  }
  if (normalized === 'thinking skills' || normalized === 'critical thinking') {
    return 'thinking-skills';
  }
  if (normalized === 'english' || normalized === 'grammar' || normalized === 'literacy') {
    return 'english';
  }
  
  // Partial matches (be very specific to avoid conflicts)
  if (normalized.includes('mathematical') && normalized.includes('reasoning')) {
    return 'mathematical-reasoning';
  }
  if (normalized.includes('thinking') && normalized.includes('skills')) {
    return 'thinking-skills';
  }
  if (normalized.includes('reading')) {
    return 'reading';
  }
  if (normalized.includes('english') || normalized.includes('grammar')) {
    return 'english';
  }
  if (normalized.includes('math')) {
    return 'math';
  }
  
  // Default fallback
  return normalized.replace(/\s+/g, '-').toLowerCase();
}

// Step 2: Get key (from StaticQuestionLoader)
function getKey(grade, difficulty, subject) {
  return `${grade}_${difficulty}_${subject}`;
}

// Step 3: Test the logic
const normalizedSubject = normalizeSubject(subject);
const key = getKey(grade, difficulty, normalizedSubject);

console.log(`\n🔄 Normalization:`);
console.log(`   Input: "${subject}"`);
console.log(`   Normalized: "${normalizedSubject}"`);
console.log(`   Key: "${key}"`);

// Step 4: Try to load the file
const filePath = `/workspaces/AWSQCLI/testace-app/frontend/public/questions/${key}.json`;
console.log(`\n📁 File path: ${filePath}`);

if (fs.existsSync(filePath)) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    console.log(`✅ File loaded successfully`);
    console.log(`📊 Questions count: ${questions.length}`);
    
    // Find the specific question
    const targetQuestion = questions.find(q => q._id === questionId);
    
    if (targetQuestion) {
      console.log(`\n✅ QUESTION FOUND!`);
      console.log(`📝 ID: ${targetQuestion._id}`);
      console.log(`📖 Content: ${targetQuestion.content}`);
      console.log(`🏷️  Subject: ${targetQuestion.subject}`);
      console.log(`📚 Grade: ${targetQuestion.grade}`);
      console.log(`⚡ Difficulty: ${targetQuestion.difficulty}`);
      
      console.log(`\n🎉 SUCCESS: StaticQuestionLoader logic works perfectly!`);
      console.log(`📝 The issue must be in the React component or browser caching.`);
    } else {
      console.log(`\n❌ Question ${questionId} not found in file`);
      console.log(`📋 Available questions (first 3):`);
      questions.slice(0, 3).forEach(q => {
        console.log(`   - ${q._id}: ${q.content.substring(0, 50)}...`);
      });
    }
    
  } catch (error) {
    console.log(`❌ Error parsing JSON: ${error.message}`);
  }
} else {
  console.log(`❌ File does not exist: ${filePath}`);
}

console.log(`\n🎯 STATIC LOADER TEST COMPLETE`);
console.log(`\n💡 If this test passes but the app still fails:`);
console.log(`   1. The React component isn't calling StaticQuestionLoader properly`);
console.log(`   2. There's a browser/network caching issue`);
console.log(`   3. The development server needs a complete restart`);
console.log(`   4. There might be a React state management issue`);
