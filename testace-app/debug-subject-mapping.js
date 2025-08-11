#!/usr/bin/env node

console.log('🔍 Debugging Subject Mapping Issue...\n');

// Test the StaticQuestionLoader normalization
const normalizeSubject = (subject) => {
  const normalized = subject.toLowerCase().trim();
  
  // EXACT matches first (most specific) - map to static file names
  if (normalized === 'math' || normalized === 'mathematics') {
    return 'math';
  }
  if (normalized === 'mathematical reasoning') {
    return 'math'; // Mathematical reasoning uses math files
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
    return 'math';
  }
  if (normalized.includes('thinking') && normalized.includes('skills')) {
    return 'thinking-skills';
  }
  if (normalized.includes('reading') && !normalized.includes('reasoning')) {
    return 'reading';
  }
  if (normalized.includes('english') || normalized.includes('grammar')) {
    return 'english';
  }
  if (normalized === 'math' || (normalized.includes('math') && !normalized.includes('reasoning'))) {
    return 'math';
  }
  
  // Default fallback
  return 'math';
};

console.log('🧪 Testing Subject Mapping:\n');

const testCases = [
  'Math',
  'Mathematical Reasoning', 
  'English',
  'Reading',
  'Thinking Skills'
];

testCases.forEach(subject => {
  const normalized = normalizeSubject(subject);
  const expectedFile = `9_medium_${normalized}.json`;
  
  console.log(`Input: "${subject}"`);
  console.log(`Normalized: "${normalized}"`);
  console.log(`Expected file: ${expectedFile}`);
  
  // Check if file exists
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(__dirname, 'public/questions', expectedFile);
  
  if (fs.existsSync(filepath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      console.log(`✅ File exists with ${content.length} questions`);
    } catch (error) {
      console.log(`❌ File exists but has JSON error: ${error.message}`);
    }
  } else {
    console.log(`❌ File does not exist: ${filepath}`);
  }
  console.log('');
});

// Test the specific case: Grade 9, Medium, Math
console.log('🎯 Testing Specific Case: Grade 9, Medium, Math\n');

const grade = '9';
const difficulty = 'medium';
const subject = 'Math';
const normalizedSubject = normalizeSubject(subject);
const filename = `${grade}_${difficulty}_${normalizedSubject}.json`;

console.log(`Grade: ${grade}`);
console.log(`Difficulty: ${difficulty}`);
console.log(`Subject: "${subject}" → "${normalizedSubject}"`);
console.log(`Expected filename: ${filename}`);

const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'public/questions', filename);

console.log(`Full path: ${filepath}`);

if (fs.existsSync(filepath)) {
  try {
    const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    console.log(`✅ SUCCESS: File found with ${content.length} questions`);
    
    // Show sample question
    if (content.length > 0) {
      const sample = content[0];
      console.log(`\n📝 Sample question:`);
      console.log(`   Content: "${sample.content}"`);
      console.log(`   Subject: "${sample.subject}"`);
      console.log(`   Grade: ${sample.grade}`);
      console.log(`   Difficulty: ${sample.difficulty}`);
    }
  } catch (error) {
    console.log(`❌ FAILED: File exists but JSON error: ${error.message}`);
  }
} else {
  console.log(`❌ FAILED: File not found`);
  
  // List available files for debugging
  const questionsDir = path.join(__dirname, 'public/questions');
  if (fs.existsSync(questionsDir)) {
    const files = fs.readdirSync(questionsDir);
    const grade9Files = files.filter(f => f.startsWith('9_medium_'));
    console.log(`\n📁 Available Grade 9 Medium files:`);
    grade9Files.forEach(file => console.log(`   - ${file}`));
  }
}

console.log('\n💡 Possible Issues:');
console.log('1. Subject mapping is incorrect');
console.log('2. StaticQuestionLoader is not being called properly');
console.log('3. File path resolution issue');
console.log('4. Browser cache showing old results');
console.log('5. Development server not serving static files correctly');
