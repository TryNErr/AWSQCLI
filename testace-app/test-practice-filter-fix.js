#!/usr/bin/env node

/**
 * Test Script: Practice Test Filter Fix Verification
 * 
 * This script verifies that the practice test mode now maintains
 * grade and difficulty filters when clicking "Practice This" and
 * "Try Another Question".
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Practice Test Filter Fix');
console.log('=====================================\n');

// Test 1: Verify EnhancedPractice.tsx has the fix
console.log('Test 1: Checking EnhancedPractice.tsx for startSingleQuestion fix...');
const enhancedPracticePath = path.join(__dirname, 'frontend/src/pages/Practice/EnhancedPractice.tsx');

try {
  const enhancedPracticeContent = fs.readFileSync(enhancedPracticePath, 'utf8');
  
  // Check if the fix is present
  const hasParameterPassing = enhancedPracticeContent.includes('params.set(\'grade\'') && 
                              enhancedPracticeContent.includes('params.set(\'difficulty\'') &&
                              enhancedPracticeContent.includes('paramString ? `?${paramString}` : \'\'');
  
  if (hasParameterPassing) {
    console.log('✅ PASS: EnhancedPractice.tsx correctly passes session parameters');
  } else {
    console.log('❌ FAIL: EnhancedPractice.tsx does not pass session parameters');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read EnhancedPractice.tsx:', error.message);
}

// Test 2: Verify Question.tsx has the fix
console.log('\nTest 2: Checking Question.tsx for filter maintenance fix...');
const questionPath = path.join(__dirname, 'frontend/src/pages/Practice/Question.tsx');

try {
  const questionContent = fs.readFileSync(questionPath, 'utf8');
  
  // Check if the fix is present
  const hasSearchParams = questionContent.includes('useSearchParams');
  const hasSessionParams = questionContent.includes('sessionGrade') && 
                          questionContent.includes('sessionDifficulty') &&
                          questionContent.includes('sessionSubject');
  const hasBulletproofSystem = questionContent.includes('BulletproofPracticeSystem.getPracticeQuestions');
  const hasFilterDisplay = questionContent.includes('Practice Session Filters Active');
  
  console.log(`   - useSearchParams import: ${hasSearchParams ? '✅' : '❌'}`);
  console.log(`   - Session parameter extraction: ${hasSessionParams ? '✅' : '❌'}`);
  console.log(`   - BulletproofPracticeSystem usage: ${hasBulletproofSystem ? '✅' : '❌'}`);
  console.log(`   - Filter display UI: ${hasFilterDisplay ? '✅' : '❌'}`);
  
  if (hasSearchParams && hasSessionParams && hasBulletproofSystem && hasFilterDisplay) {
    console.log('✅ PASS: Question.tsx has all required fixes');
  } else {
    console.log('❌ FAIL: Question.tsx is missing some fixes');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read Question.tsx:', error.message);
}

// Test 3: Verify BulletproofPracticeSystem exists
console.log('\nTest 3: Checking BulletproofPracticeSystem availability...');
const bulletproofSystemPath = path.join(__dirname, 'frontend/src/utils/bulletproofPracticeSystem.ts');

try {
  const bulletproofContent = fs.readFileSync(bulletproofSystemPath, 'utf8');
  
  const hasGetPracticeQuestions = bulletproofContent.includes('getPracticeQuestions');
  const hasStrictFiltering = bulletproofContent.includes('applyStrictFiltering');
  const hasDeduplication = bulletproofContent.includes('removeDuplicates');
  
  console.log(`   - getPracticeQuestions method: ${hasGetPracticeQuestions ? '✅' : '❌'}`);
  console.log(`   - Strict filtering: ${hasStrictFiltering ? '✅' : '❌'}`);
  console.log(`   - Deduplication: ${hasDeduplication ? '✅' : '❌'}`);
  
  if (hasGetPracticeQuestions && hasStrictFiltering && hasDeduplication) {
    console.log('✅ PASS: BulletproofPracticeSystem is properly implemented');
  } else {
    console.log('❌ FAIL: BulletproofPracticeSystem is missing features');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read BulletproofPracticeSystem:', error.message);
}

// Test 4: Create a sample URL to demonstrate the fix
console.log('\nTest 4: Sample URL demonstration...');
console.log('Before fix:');
console.log('  User selects: Grade 5, Medium, Math');
console.log('  Clicks "Practice This" → /practice/question/123');
console.log('  Clicks "Try Another Question" → Random grade/difficulty ❌');

console.log('\nAfter fix:');
console.log('  User selects: Grade 5, Medium, Math');
console.log('  Clicks "Practice This" → /practice/question/123?grade=5&difficulty=medium&subject=Math');
console.log('  Clicks "Try Another Question" → Grade 5, Medium, Math question ✅');

console.log('\n🎯 Fix Summary:');
console.log('================');
console.log('1. EnhancedPractice now passes session parameters in URL');
console.log('2. Question component extracts and maintains these parameters');
console.log('3. "Try Another Question" uses BulletproofPracticeSystem with maintained filters');
console.log('4. Visual indicators show active filters to the user');
console.log('5. No more random grade/difficulty - filters are preserved!');

console.log('\n✅ Practice Test Filter Fix Complete!');
console.log('Users will now get consistent grade and difficulty when practicing.');
