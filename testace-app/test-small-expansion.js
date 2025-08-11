#!/usr/bin/env node

/**
 * SMALL TEST EXPANSION
 * 
 * This script tests the expansion system by adding just 5 questions to a few files
 * to verify everything works before running the full 200-question expansion.
 */

const fs = require('fs');
const path = require('path');

// Import the enhanced generators
const EnhancedMathGenerator = require('./generators/enhancedMathGenerator.js');
const EnhancedThinkingSkillsGenerator = require('./generators/enhancedThinkingSkillsGenerator.js');
const EnhancedReadingGenerator = require('./generators/enhancedReadingGenerator.js');

console.log('🧪 SMALL TEST EXPANSION');
console.log('='.repeat(40));

// Configuration
const QUESTIONS_DIR = path.join(__dirname, 'public', 'questions');
const TEST_FILES = ['5_easy_math.json', '5_easy_thinking-skills.json', '5_easy_reading.json'];
const QUESTIONS_TO_ADD = 5; // Small test

/**
 * Generate unique ID for new questions
 */
function generateUniqueId(subject, grade, difficulty, index) {
  const timestamp = Date.now();
  const subjectCode = subject.toLowerCase().replace(/\s+/g, '');
  return `test_${subjectCode}_${grade}_${difficulty}_${index}_${timestamp}`;
}

/**
 * Parse filename to extract parameters
 */
function parseFilename(filename) {
  const parts = filename.replace('.json', '').split('_');
  const grade = parts[0];
  const difficulty = parts[1];
  const subject = parts.slice(2).join(' ').replace('-', ' ');
  
  return [grade, difficulty, subject];
}

/**
 * Normalize subject names
 */
function normalizeSubject(subject) {
  if (subject.includes('math')) return 'Mathematical Reasoning';
  if (subject.includes('thinking')) return 'Thinking Skills';
  if (subject.includes('reading')) return 'Reading';
  return subject;
}

/**
 * Test expansion on a single file
 */
async function testExpandFile(filename) {
  console.log(`\n📄 Testing expansion: ${filename}`);
  
  try {
    const filePath = path.join(QUESTIONS_DIR, filename);
    
    // Read existing questions
    const existingQuestions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`   📊 Current questions: ${existingQuestions.length}`);
    
    // Parse filename
    const [grade, difficulty, subject] = parseFilename(filename);
    console.log(`   🎯 Parameters: Grade ${grade}, ${difficulty}, ${subject}`);
    
    // Generate new questions
    const newQuestions = [];
    const existingContent = new Set(existingQuestions.map(q => q.content.toLowerCase().trim()));
    
    for (let i = 0; i < QUESTIONS_TO_ADD; i++) {
      let question = null;
      
      // Generate based on subject
      if (subject.includes('math')) {
        question = EnhancedMathGenerator.generateQuestion(grade, difficulty, i);
      } else if (subject.includes('thinking')) {
        question = EnhancedThinkingSkillsGenerator.generateQuestion(grade, difficulty, i);
      } else if (subject.includes('reading')) {
        question = EnhancedReadingGenerator.generateQuestion(grade, difficulty, i);
      }
      
      if (question && !existingContent.has(question.content.toLowerCase().trim())) {
        // Add metadata
        question._id = generateUniqueId(subject, grade, difficulty, i);
        question.subject = normalizeSubject(subject);
        question.grade = grade;
        question.difficulty = difficulty;
        question.createdBy = 'test-expansion';
        question.createdAt = new Date().toISOString();
        question.isExpanded = true;
        question.testExpansion = true;
        
        newQuestions.push(question);
        existingContent.add(question.content.toLowerCase().trim());
        
        console.log(`   ✅ Generated question ${i + 1}: "${question.content.substring(0, 50)}..."`);
      }
    }
    
    console.log(`   📈 Successfully generated: ${newQuestions.length}/${QUESTIONS_TO_ADD} questions`);
    
    // Show sample questions
    if (newQuestions.length > 0) {
      console.log(`   📝 Sample question:`);
      const sample = newQuestions[0];
      console.log(`      Content: "${sample.content}"`);
      console.log(`      Options: [${sample.options.join(', ')}]`);
      console.log(`      Answer: "${sample.correctAnswer}"`);
      console.log(`      Topic: ${sample.topic}`);
    }
    
    return newQuestions.length === QUESTIONS_TO_ADD;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Run the test expansion
 */
async function runTestExpansion() {
  console.log('Starting small test expansion...\n');
  
  let allPassed = true;
  let passedFiles = 0;
  
  for (const filename of TEST_FILES) {
    const success = await testExpandFile(filename);
    if (success) {
      passedFiles++;
    } else {
      allPassed = false;
    }
  }
  
  // Print summary
  console.log('\n📊 TEST EXPANSION SUMMARY');
  console.log('='.repeat(40));
  console.log(`Files tested: ${TEST_FILES.length}`);
  console.log(`Files passed: ${passedFiles}`);
  console.log(`Success rate: ${Math.round(passedFiles/TEST_FILES.length*100)}%`);
  
  if (allPassed) {
    console.log('\n🎉 TEST EXPANSION SUCCESSFUL!');
    console.log('✅ All generators working correctly');
    console.log('✅ Question generation and metadata assignment working');
    console.log('✅ No duplicate questions generated');
    console.log('✅ Ready for full expansion');
    console.log('\nTo run the full expansion (200 questions per file):');
    console.log('node expand-question-variety-complete.js');
  } else {
    console.log('\n⚠️ Test expansion had issues. Please review the errors above.');
  }
  
  return allPassed;
}

// Run the test
runTestExpansion().then(success => {
  process.exit(success ? 0 : 1);
}).catch(console.error);
