#!/usr/bin/env node

/**
 * TEST SCRIPT FOR QUESTION GENERATORS
 * 
 * This script tests the enhanced generators to ensure they work correctly
 * before running the full expansion.
 */

const EnhancedMathGenerator = require('./generators/enhancedMathGenerator.js');
const EnhancedThinkingSkillsGenerator = require('./generators/enhancedThinkingSkillsGenerator.js');
const EnhancedReadingGenerator = require('./generators/enhancedReadingGenerator.js');

console.log('🧪 TESTING QUESTION GENERATORS');
console.log('='.repeat(40));

/**
 * Test a generator with multiple samples
 */
function testGenerator(generator, name, grade, difficulty, samples = 5) {
  console.log(`\n📝 Testing ${name} Generator`);
  console.log(`   Grade: ${grade}, Difficulty: ${difficulty}`);
  console.log('   ' + '-'.repeat(30));
  
  let successCount = 0;
  let errors = [];
  
  for (let i = 0; i < samples; i++) {
    try {
      const question = generator.generateQuestion(grade, difficulty, i);
      
      if (question && question.content && question.options && question.correctAnswer) {
        successCount++;
        console.log(`   ✅ Sample ${i + 1}: "${question.content.substring(0, 60)}..."`);
        console.log(`      Topic: ${question.topic}, Options: ${question.options.length}`);
      } else {
        errors.push(`Sample ${i + 1}: Invalid question structure`);
        console.log(`   ❌ Sample ${i + 1}: Invalid question structure`);
      }
    } catch (error) {
      errors.push(`Sample ${i + 1}: ${error.message}`);
      console.log(`   ❌ Sample ${i + 1}: ${error.message}`);
    }
  }
  
  console.log(`   📊 Success rate: ${successCount}/${samples} (${Math.round(successCount/samples*100)}%)`);
  
  if (errors.length > 0) {
    console.log(`   ⚠️ Errors encountered:`);
    errors.forEach(error => console.log(`      - ${error}`));
  }
  
  return successCount === samples;
}

/**
 * Run comprehensive tests
 */
function runTests() {
  console.log('Starting generator tests...\n');
  
  const testCases = [
    { generator: EnhancedMathGenerator, name: 'Math', grade: '5', difficulty: 'easy' },
    { generator: EnhancedMathGenerator, name: 'Math', grade: '9', difficulty: 'hard' },
    { generator: EnhancedThinkingSkillsGenerator, name: 'Thinking Skills', grade: '5', difficulty: 'easy' },
    { generator: EnhancedThinkingSkillsGenerator, name: 'Thinking Skills', grade: '9', difficulty: 'hard' },
    { generator: EnhancedReadingGenerator, name: 'Reading', grade: '5', difficulty: 'easy' },
    { generator: EnhancedReadingGenerator, name: 'Reading', grade: '9', difficulty: 'hard' }
  ];
  
  let allPassed = true;
  let totalTests = 0;
  let passedTests = 0;
  
  testCases.forEach(testCase => {
    const passed = testGenerator(
      testCase.generator, 
      testCase.name, 
      testCase.grade, 
      testCase.difficulty, 
      3 // 3 samples per test
    );
    
    totalTests++;
    if (passed) {
      passedTests++;
    } else {
      allPassed = false;
    }
  });
  
  // Print summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(30));
  console.log(`Tests passed: ${passedTests}/${totalTests}`);
  console.log(`Success rate: ${Math.round(passedTests/totalTests*100)}%`);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Generators are working correctly');
    console.log('✅ Ready to run full expansion');
    console.log('\nTo run the full expansion:');
    console.log('node expand-question-variety-complete.js');
  } else {
    console.log('\n⚠️ Some tests failed. Please fix the generators before running expansion.');
  }
  
  return allPassed;
}

// Run the tests
const success = runTests();
process.exit(success ? 0 : 1);
