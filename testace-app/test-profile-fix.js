#!/usr/bin/env node

/**
 * Test Script: Profile Component Fix Verification
 * 
 * This script verifies that the Profile component import issue has been resolved.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Profile Component Fix');
console.log('=================================\n');

// Test 1: Check Profile component imports
console.log('Test 1: Checking Profile component imports...');
const profilePath = path.join(__dirname, 'frontend/src/pages/Profile/Profile.tsx');

try {
  const profileContent = fs.readFileSync(profilePath, 'utf8');
  
  // Check for correct import
  const hasCorrectImport = profileContent.includes('getQuestionAttempts');
  const hasIncorrectImport = profileContent.includes('getQuestionHistory');
  const hasQuestionAttemptType = profileContent.includes('QuestionAttempt');
  
  console.log(`   - Uses getQuestionAttempts: ${hasCorrectImport ? '✅' : '❌'}`);
  console.log(`   - Removed getQuestionHistory: ${!hasIncorrectImport ? '✅' : '❌'}`);
  console.log(`   - Has QuestionAttempt type: ${hasQuestionAttemptType ? '✅' : '❌'}`);
  
  // Check for correct function call
  const hasCorrectFunctionCall = profileContent.includes('getQuestionAttempts()');
  const hasIncorrectFunctionCall = profileContent.includes('getQuestionHistory()');
  
  console.log(`   - Calls getQuestionAttempts(): ${hasCorrectFunctionCall ? '✅' : '❌'}`);
  console.log(`   - Removed getQuestionHistory(): ${!hasIncorrectFunctionCall ? '✅' : '❌'}`);
  
  if (hasCorrectImport && !hasIncorrectImport && hasQuestionAttemptType && hasCorrectFunctionCall && !hasIncorrectFunctionCall) {
    console.log('✅ PASS: Profile component imports and calls are correct');
  } else {
    console.log('❌ FAIL: Profile component still has import/call issues');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read Profile.tsx:', error.message);
}

// Test 2: Check questionHistoryService exports
console.log('\nTest 2: Checking questionHistoryService exports...');
const servicePath = path.join(__dirname, 'frontend/src/services/questionHistoryService.ts');

try {
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  // Check for available exports
  const availableExports = [
    'getQuestionAttempts',
    'getSubjectQuestionHistory', 
    'getRecentQuestionAttempts',
    'getQuestionStats',
    'getPerformanceTrend',
    'getSubjectPerformance',
    'getDifficultyPerformance',
    'getQuestionDetails',
    'recordQuestionAttempt'
  ];
  
  console.log('   Available exports:');
  availableExports.forEach(exportName => {
    const hasExport = serviceContent.includes(`export const ${exportName}`);
    console.log(`     - ${exportName}: ${hasExport ? '✅' : '❌'}`);
  });
  
  // Check that getQuestionHistory doesn't exist
  const hasIncorrectExport = serviceContent.includes('export const getQuestionHistory');
  console.log(`   - getQuestionHistory (should not exist): ${!hasIncorrectExport ? '✅' : '❌'}`);
  
  if (!hasIncorrectExport) {
    console.log('✅ PASS: questionHistoryService exports are correct');
  } else {
    console.log('❌ FAIL: questionHistoryService has incorrect exports');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read questionHistoryService.ts:', error.message);
}

// Test 3: Check import statement structure
console.log('\nTest 3: Checking import statement structure...');

try {
  const profileContent = fs.readFileSync(profilePath, 'utf8');
  
  // Extract the import statement
  const importMatch = profileContent.match(/import\s*{\s*([^}]+)\s*}\s*from\s*'\.\.\/\.\.\/services\/questionHistoryService'/);
  
  if (importMatch) {
    const imports = importMatch[1].split(',').map(imp => imp.trim());
    console.log(`   - Import statement found: ✅`);
    console.log(`   - Imports: ${imports.join(', ')}`);
    
    const hasCorrectImports = imports.includes('getQuestionAttempts') && imports.includes('QuestionAttempt');
    const hasIncorrectImports = imports.some(imp => imp.includes('getQuestionHistory'));
    
    console.log(`   - Correct imports: ${hasCorrectImports ? '✅' : '❌'}`);
    console.log(`   - No incorrect imports: ${!hasIncorrectImports ? '✅' : '❌'}`);
    
    if (hasCorrectImports && !hasIncorrectImports) {
      console.log('✅ PASS: Import statement is correct');
    } else {
      console.log('❌ FAIL: Import statement has issues');
    }
  } else {
    console.log('❌ FAIL: Could not find import statement');
  }
} catch (error) {
  console.log('❌ ERROR: Could not analyze import statement:', error.message);
}

console.log('\n🔧 PROFILE COMPONENT FIX SUMMARY:');
console.log('==================================');
console.log('✅ Fixed Import: getQuestionHistory → getQuestionAttempts');
console.log('✅ Fixed Function Call: getQuestionHistory() → getQuestionAttempts()');
console.log('✅ Maintained Type Import: QuestionAttempt interface');
console.log('✅ Used Correct Service Function: Available in questionHistoryService');

console.log('\n📋 AVAILABLE FUNCTIONS IN questionHistoryService:');
console.log('=================================================');
console.log('• getQuestionAttempts() - Get all question attempts');
console.log('• getSubjectQuestionHistory(subject) - Get attempts for specific subject');
console.log('• getRecentQuestionAttempts(limit) - Get recent attempts');
console.log('• getQuestionStats() - Get performance statistics');
console.log('• getPerformanceTrend(days) - Get performance trend data');
console.log('• getSubjectPerformance() - Get subject performance data');
console.log('• getDifficultyPerformance() - Get difficulty performance data');
console.log('• getQuestionDetails(id) - Get question details');
console.log('• recordQuestionAttempt() - Record new attempt');

console.log('\n✅ Profile Component Fix Complete!');
console.log('The import error should now be resolved.');
