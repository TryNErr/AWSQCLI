#!/usr/bin/env node

/**
 * Debug Subject Filtering Issue
 * 
 * The user selected "Grade 9 Hard Reading" but got "Grade 9 Medium English" instead.
 * This script will test the subject filtering logic to identify the exact problem.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function testSubjectFiltering() {
  console.log('🔍 DEBUGGING SUBJECT FILTERING ISSUE');
  console.log('====================================\n');
  
  console.log('User Issue: Selected "Grade 9 Hard Reading" but got "Grade 9 Medium English"');
  console.log('Expected: Reading comprehension questions');
  console.log('Actual: English grammar/sentence structure questions\n');
  
  // Test 1: Check if the correct file exists
  const expectedFile = '9_hard_reading.json';
  const expectedPath = path.join(QUESTIONS_DIR, expectedFile);
  
  console.log('📁 FILE EXISTENCE TEST:');
  console.log(`   Looking for: ${expectedFile}`);
  console.log(`   Full path: ${expectedPath}`);
  console.log(`   Exists: ${fs.existsSync(expectedPath) ? '✅ YES' : '❌ NO'}`);
  
  if (fs.existsSync(expectedPath)) {
    try {
      const questions = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
      console.log(`   Questions count: ${questions.length}`);
      console.log(`   First question subject: "${questions[0]?.subject}"`);
      console.log(`   First question content: "${questions[0]?.content?.substring(0, 100)}..."`);
    } catch (error) {
      console.log(`   ❌ Error reading file: ${error.message}`);
    }
  }
  
  console.log('\n📊 SUBJECT MAPPING TEST:');
  
  // Test the subject normalization logic (copied from StaticQuestionLoader)
  function normalizeSubject(subject) {
    const normalized = subject.toLowerCase().trim();
    
    if (normalized === 'math' || normalized === 'mathematics') {
      return 'math';
    }
    if (normalized === 'mathematical reasoning') {
      return 'math';
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
    
    // Partial matches
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
    
    return normalized;
  }
  
  const testCases = [
    'Reading',
    'reading',
    'Reading Comprehension',
    'English',
    'english',
    'Grammar',
    'Mathematics',
    'Math',
    'Mathematical Reasoning'
  ];
  
  testCases.forEach(testCase => {
    const normalized = normalizeSubject(testCase);
    console.log(`   "${testCase}" → "${normalized}"`);
  });
  
  console.log('\n🔑 KEY GENERATION TEST:');
  
  function getKey(grade, difficulty, subject) {
    return `${grade}_${difficulty}_${subject}`;
  }
  
  const userSelection = {
    grade: '9',
    difficulty: 'hard',
    subject: 'Reading'
  };
  
  const normalizedSubject = normalizeSubject(userSelection.subject);
  const expectedKey = getKey(userSelection.grade, userSelection.difficulty, normalizedSubject);
  
  console.log(`   User selected: Grade ${userSelection.grade}, ${userSelection.difficulty}, ${userSelection.subject}`);
  console.log(`   Normalized subject: "${normalizedSubject}"`);
  console.log(`   Expected key: "${expectedKey}"`);
  console.log(`   Expected file: "${expectedKey}.json"`);
  
  // Test 2: Check what's actually in the file
  console.log('\n📋 ACTUAL FILE CONTENT TEST:');
  
  const actualFile = `${expectedKey}.json`;
  const actualPath = path.join(QUESTIONS_DIR, actualFile);
  
  if (fs.existsSync(actualPath)) {
    try {
      const questions = JSON.parse(fs.readFileSync(actualPath, 'utf8'));
      console.log(`   ✅ File found: ${actualFile}`);
      console.log(`   Questions: ${questions.length}`);
      
      // Check subject distribution
      const subjectCounts = {};
      questions.forEach(q => {
        subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
      });
      
      console.log('   Subject distribution:');
      Object.entries(subjectCounts).forEach(([subject, count]) => {
        console.log(`     ${subject}: ${count} questions`);
      });
      
      // Show first few questions
      console.log('\n   First 3 questions:');
      questions.slice(0, 3).forEach((q, i) => {
        console.log(`     ${i + 1}. Subject: "${q.subject}"`);
        console.log(`        Content: "${q.content?.substring(0, 80)}..."`);
        console.log('');
      });
      
    } catch (error) {
      console.log(`   ❌ Error reading ${actualFile}: ${error.message}`);
    }
  } else {
    console.log(`   ❌ File not found: ${actualFile}`);
  }
  
  // Test 3: Check if there's a wrong file being loaded
  console.log('\n🔍 WRONG FILE DETECTION:');
  
  const possibleWrongFiles = [
    '9_medium_english.json',
    '9_hard_english.json',
    '9_easy_english.json'
  ];
  
  possibleWrongFiles.forEach(wrongFile => {
    const wrongPath = path.join(QUESTIONS_DIR, wrongFile);
    if (fs.existsSync(wrongPath)) {
      try {
        const questions = JSON.parse(fs.readFileSync(wrongPath, 'utf8'));
        const hasGrammarQuestions = questions.some(q => 
          q.content?.includes('sentence') || 
          q.content?.includes('grammar') ||
          q.content?.includes('combines these ideas')
        );
        
        if (hasGrammarQuestions) {
          console.log(`   ⚠️ POTENTIAL CULPRIT: ${wrongFile}`);
          console.log(`      Contains grammar/sentence questions that match user's complaint`);
          const grammarQuestion = questions.find(q => q.content?.includes('combines these ideas'));
          if (grammarQuestion) {
            console.log(`      Example: "${grammarQuestion.content?.substring(0, 100)}..."`);
          }
        }
      } catch (error) {
        console.log(`   Error checking ${wrongFile}: ${error.message}`);
      }
    }
  });
  
  console.log('\n🎯 DIAGNOSIS SUMMARY:');
  console.log('===================');
  console.log('1. Check if Grade 9 Hard Reading file exists and has correct content');
  console.log('2. Verify subject normalization is working correctly');
  console.log('3. Confirm the right file is being loaded');
  console.log('4. Look for any caching or routing issues');
}

if (require.main === module) {
  testSubjectFiltering();
}
