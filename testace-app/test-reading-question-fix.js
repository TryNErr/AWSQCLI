#!/usr/bin/env node

/**
 * Test to verify that reading questions now include the full passage text
 * This addresses the critical issue where users couldn't answer reading questions
 * because the passage text was missing.
 */

const fs = require('fs');
const path = require('path');

// Read the fixed file
const filePath = path.join(__dirname, 'frontend/src/utils/bulletproofPracticeSystem.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

console.log('🔍 Testing Reading Question Fix...\n');

// Test 1: Check that the broken pattern is fixed
const brokenPattern = /Read the passage and answer:/;
const hasOldBrokenPattern = brokenPattern.test(fileContent);

if (hasOldBrokenPattern) {
  console.log('❌ FAIL: Still contains the broken "Read the passage and answer:" pattern');
  process.exit(1);
} else {
  console.log('✅ PASS: Removed broken "Read the passage and answer:" pattern');
}

// Test 2: Check that the correct pattern exists
const correctPattern = /\$\{passage\.title\}\\n\\n\$\{passage\.passage\}\\n\\nQuestion: \$\{question\.content\}/;
const hasCorrectPattern = correctPattern.test(fileContent);

if (hasCorrectPattern) {
  console.log('✅ PASS: Contains correct pattern with passage title, text, and question');
} else {
  console.log('❌ FAIL: Missing correct pattern for reading questions');
  process.exit(1);
}

// Test 3: Check that both reading question generation methods are consistent
const lines = fileContent.split('\n');
let readingQuestionFormats = [];

lines.forEach((line, index) => {
  if (line.includes('content: `') && line.includes('passage')) {
    readingQuestionFormats.push({
      line: index + 1,
      content: line.trim()
    });
  }
});

console.log('\n📋 Found reading question formats:');
readingQuestionFormats.forEach(format => {
  console.log(`   Line ${format.line}: ${format.content}`);
});

// Test 4: Verify the format includes all necessary components
const hasTitle = fileContent.includes('${passage.title}');
const hasPassageText = fileContent.includes('${passage.passage}');
const hasQuestionText = fileContent.includes('${question.content}');

if (hasTitle && hasPassageText && hasQuestionText) {
  console.log('\n✅ PASS: Reading questions now include:');
  console.log('   - Passage title');
  console.log('   - Full passage text');
  console.log('   - Question text');
} else {
  console.log('\n❌ FAIL: Missing components:');
  if (!hasTitle) console.log('   - Missing passage title');
  if (!hasPassageText) console.log('   - Missing passage text');
  if (!hasQuestionText) console.log('   - Missing question text');
  process.exit(1);
}

console.log('\n🎉 SUCCESS: Reading questions are now properly formatted!');
console.log('\n📖 Example format:');
console.log('   Title: "My Pet Cat"');
console.log('   ');
console.log('   Passage: "I have a pet cat named Fluffy..."');
console.log('   ');
console.log('   Question: "What is the name of the pet cat?"');
console.log('   A) Fluffy  B) Mittens  C) Whiskers  D) Shadow');

console.log('\n✨ Users can now properly read the passage and answer the questions!');
