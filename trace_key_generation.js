// Simulate the exact StaticQuestionLoader key generation process

console.log('🔍 TRACING STATICQUESTIONLOADER KEY GENERATION...');

// Input parameters from the URL
const grade = '9';
const difficulty = 'hard'; // This becomes DifficultyLevel.HARD which equals 'hard'
const subject = 'Mathematical Reasoning';

console.log(`\n📥 Input parameters:`);
console.log(`   Grade: "${grade}"`);
console.log(`   Difficulty: "${difficulty}"`);
console.log(`   Subject: "${subject}"`);

// Step 1: normalizeSubject function (from StaticQuestionLoader)
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

// Step 2: getKey function (from StaticQuestionLoader)
function getKey(grade, difficulty, subject) {
  return `${grade}_${difficulty}_${subject}`;
}

// Execute the process
const normalizedSubject = normalizeSubject(subject);
const key = getKey(grade, difficulty, normalizedSubject);
const filename = `${key}.json`;
const fetchPath = `/questions/${filename}`;

console.log(`\n🔄 Processing:`);
console.log(`   Normalized subject: "${normalizedSubject}"`);
console.log(`   Generated key: "${key}"`);
console.log(`   Filename: "${filename}"`);
console.log(`   Fetch path: "${fetchPath}"`);

// Check if this matches our actual file
const fs = require('fs');
const actualFilePath = `/workspaces/AWSQCLI/testace-app/frontend/public/questions/${filename}`;

console.log(`\n📁 File check:`);
console.log(`   Expected file: ${actualFilePath}`);

if (fs.existsSync(actualFilePath)) {
  console.log(`   ✅ File exists!`);
  
  // Check if the target question is in the file
  try {
    const content = fs.readFileSync(actualFilePath, 'utf8');
    const questions = JSON.parse(content);
    const targetQuestion = questions.find(q => q._id === 'hard9_1755260455350_003');
    
    if (targetQuestion) {
      console.log(`   ✅ Target question found in file!`);
      console.log(`   📝 Content: ${targetQuestion.content}`);
    } else {
      console.log(`   ❌ Target question NOT found in file`);
      console.log(`   📋 Available IDs (first 3):`);
      questions.slice(0, 3).forEach(q => console.log(`      - ${q._id}`));
    }
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
  }
} else {
  console.log(`   ❌ File does not exist!`);
  
  // List what files do exist
  const dir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.includes('9_hard'));
    console.log(`   📋 Available Grade 9 Hard files:`);
    files.forEach(f => console.log(`      - ${f}`));
  }
}

console.log(`\n🎯 KEY GENERATION TRACE COMPLETE`);
console.log(`\nIf the file exists and contains the question, but the app still can't load it,`);
console.log(`the issue is likely in the React component's fetch logic or error handling.`);
