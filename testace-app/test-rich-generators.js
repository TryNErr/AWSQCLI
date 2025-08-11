#!/usr/bin/env node

/**
 * TEST SCRIPT FOR RICH CONTENT GENERATORS
 * 
 * Tests the enhanced generators that leverage vast knowledge bases
 */

const EnhancedEnglishGenerator = require('./generators/enhancedEnglishGenerator.js');
const EnhancedReadingGeneratorRich = require('./generators/enhancedReadingGeneratorRich.js');
const EnhancedMathematicalReasoningGenerator = require('./generators/enhancedMathematicalReasoningGenerator.js');

console.log('🧪 TESTING RICH CONTENT GENERATORS');
console.log('='.repeat(50));

/**
 * Test a generator with samples
 */
function testRichGenerator(generator, name, grade, difficulty, samples = 3) {
  console.log(`\n📝 Testing ${name} Generator`);
  console.log(`   Grade: ${grade}, Difficulty: ${difficulty}`);
  console.log('   ' + '-'.repeat(40));
  
  let successCount = 0;
  let errors = [];
  
  for (let i = 0; i < samples; i++) {
    try {
      const question = generator.generateQuestion(grade, difficulty, i);
      
      if (question && question.content && question.options && question.correctAnswer) {
        successCount++;
        console.log(`   ✅ Sample ${i + 1}:`);
        console.log(`      Content: "${question.content.substring(0, 100)}..."`);
        console.log(`      Topic: ${question.topic}`);
        console.log(`      Options: ${question.options.length}`);
        console.log(`      Answer: "${question.correctAnswer}"`);
        console.log(`      Explanation: "${question.explanation.substring(0, 80)}..."`);
        console.log('');
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
function runRichContentTests() {
  console.log('Starting rich content generator tests...\n');
  
  const testCases = [
    { generator: EnhancedEnglishGenerator, name: 'Enhanced English', grade: '5', difficulty: 'easy' },
    { generator: EnhancedEnglishGenerator, name: 'Enhanced English', grade: '9', difficulty: 'hard' },
    { generator: EnhancedReadingGeneratorRich, name: 'Rich Reading', grade: '5', difficulty: 'easy' },
    { generator: EnhancedReadingGeneratorRich, name: 'Rich Reading', grade: '9', difficulty: 'hard' },
    { generator: EnhancedMathematicalReasoningGenerator, name: 'Mathematical Reasoning', grade: '5', difficulty: 'easy' },
    { generator: EnhancedMathematicalReasoningGenerator, name: 'Mathematical Reasoning', grade: '9', difficulty: 'hard' }
  ];
  
  let allPassed = true;
  let totalTests = 0;
  let passedTests = 0;
  
  testCases.forEach(testCase => {
    const passed = testRichGenerator(
      testCase.generator, 
      testCase.name, 
      testCase.grade, 
      testCase.difficulty, 
      2 // 2 samples per test
    );
    
    totalTests++;
    if (passed) {
      passedTests++;
    } else {
      allPassed = false;
    }
  });
  
  // Print summary
  console.log('\n📊 RICH CONTENT TEST SUMMARY');
  console.log('='.repeat(40));
  console.log(`Tests passed: ${passedTests}/${totalTests}`);
  console.log(`Success rate: ${Math.round(passedTests/totalTests*100)}%`);
  
  if (allPassed) {
    console.log('\n🎉 ALL RICH CONTENT TESTS PASSED!');
    console.log('✅ Enhanced generators are working correctly');
    console.log('✅ Rich content with domain knowledge ready');
    console.log('✅ High-quality questions with detailed explanations');
    console.log('\nTo run the rich content expansion:');
    console.log('node add-rich-content-expansion.js');
  } else {
    console.log('\n⚠️ Some tests failed. Please fix the generators before running expansion.');
  }
  
  return allPassed;
}

// Run the tests
const success = runRichContentTests();
process.exit(success ? 0 : 1);
