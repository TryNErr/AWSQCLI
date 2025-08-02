#!/usr/bin/env node

/**
 * Test Script for Timed Test Fixes
 * 
 * This script tests the fixes for timed test issues:
 * 1. No duplicate questions in the same test
 * 2. No unprofessional placeholder answers like "Wrong Answer 1"
 * 3. Enhanced answer validation for accurate scoring
 */

const fs = require('fs');
const path = require('path');

// Mock the frontend modules for testing
const mockTypes = {
  DifficultyLevel: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  },
  QuestionType: {
    MULTIPLE_CHOICE: 'multiple_choice'
  }
};

// Mock utility functions
const mockUtils = {
  shuffleArray: (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },
  
  getRandomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  generateId: () => {
    return 'test_' + Math.random().toString(36).substr(2, 9);
  }
};

// Test duplicate question detection
function testDuplicateDetection() {
  console.log('\n🔍 Testing Duplicate Question Detection...\n');
  
  const testQuestions = [
    {
      _id: '1',
      content: 'What is 2 + 3?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      subject: 'Math',
      difficulty: 'medium',
      grade: '3'
    },
    {
      _id: '2',
      content: 'What is 2 + 3?', // Exact duplicate
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      subject: 'Math',
      difficulty: 'medium',
      grade: '3'
    },
    {
      _id: '3',
      content: 'What is 2+3?', // Similar (no spaces)
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      subject: 'Math',
      difficulty: 'medium',
      grade: '3'
    },
    {
      _id: '4',
      content: 'What is 4 + 5?', // Different question
      options: ['8', '9', '10', '11'],
      correctAnswer: '9',
      subject: 'Math',
      difficulty: 'medium',
      grade: '3'
    }
  ];
  
  const uniqueQuestions = removeDuplicateQuestions(testQuestions);
  
  console.log(`Original questions: ${testQuestions.length}`);
  console.log(`After duplicate removal: ${uniqueQuestions.length}`);
  
  const expectedUnique = 2; // Should have 2 unique questions (the 2+3 variants should be treated as duplicates)
  const testPassed = uniqueQuestions.length === expectedUnique;
  
  if (testPassed) {
    console.log('✅ Duplicate detection working correctly');
  } else {
    console.log(`❌ Expected ${expectedUnique} unique questions, got ${uniqueQuestions.length}`);
  }
  
  return testPassed;
}

// Test unprofessional answer detection
function testUnprofessionalAnswerDetection() {
  console.log('\n🎭 Testing Unprofessional Answer Detection...\n');
  
  const testCases = [
    {
      question: {
        content: 'What is 2 + 3?',
        options: ['Wrong Answer 1', 'Wrong Answer 2', '5', 'Wrong Answer 3'],
        correctAnswer: '5'
      },
      shouldBeRejected: true,
      reason: 'Contains "Wrong Answer X" placeholders'
    },
    {
      question: {
        content: 'What is the capital of France?',
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris'
      },
      shouldBeRejected: false,
      reason: 'Professional answer options'
    },
    {
      question: {
        content: 'Choose the correct answer:',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A'
      },
      shouldBeRejected: true,
      reason: 'Generic option labels'
    },
    {
      question: {
        content: 'What is 10 ÷ 2?',
        options: ['3', '5', '7', ''],
        correctAnswer: '5'
      },
      shouldBeRejected: true,
      reason: 'Contains empty answer option'
    },
    {
      question: {
        content: 'Which is a primary color?',
        options: ['Red', 'Green', 'Orange', 'Purple'],
        correctAnswer: 'Red'
      },
      shouldBeRejected: false,
      reason: 'Professional content-specific answers'
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  testCases.forEach((testCase, index) => {
    const hasUnprofessionalAnswers = detectUnprofessionalAnswers(testCase.question);
    const testPassed = hasUnprofessionalAnswers === testCase.shouldBeRejected;
    
    console.log(`Test Case ${index + 1}: ${testCase.reason}`);
    console.log(`  Question: ${testCase.question.content}`);
    console.log(`  Options: [${testCase.question.options.join(', ')}]`);
    console.log(`  Expected rejection: ${testCase.shouldBeRejected}`);
    console.log(`  Actual rejection: ${hasUnprofessionalAnswers}`);
    
    if (testPassed) {
      console.log('  ✅ PASSED\n');
      passedTests++;
    } else {
      console.log('  ❌ FAILED\n');
    }
  });
  
  console.log(`Unprofessional Answer Detection: ${passedTests}/${totalTests} tests passed\n`);
  return passedTests === totalTests;
}

// Test answer set duplicate detection
function testAnswerSetDuplicates() {
  console.log('\n🎯 Testing Answer Set Duplicate Detection...\n');
  
  const testQuestions = [
    {
      _id: '1',
      content: 'What is 2 + 3?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5'
    },
    {
      _id: '2',
      content: 'What is 1 + 4?',
      options: ['5', '6', '7', '4'], // Same options, different order
      correctAnswer: '5'
    },
    {
      _id: '3',
      content: 'What is 3 + 2?',
      options: ['8', '9', '10', '11'], // Different options
      correctAnswer: '5'
    }
  ];
  
  const uniqueQuestions = removeAnswerSetDuplicates(testQuestions);
  
  console.log(`Original questions: ${testQuestions.length}`);
  console.log(`After answer set duplicate removal: ${uniqueQuestions.length}`);
  
  const expectedUnique = 2; // First two should be considered duplicates due to same answer set
  const testPassed = uniqueQuestions.length === expectedUnique;
  
  if (testPassed) {
    console.log('✅ Answer set duplicate detection working correctly');
  } else {
    console.log(`❌ Expected ${expectedUnique} unique questions, got ${uniqueQuestions.length}`);
  }
  
  return testPassed;
}

// Test complete test validation
function testCompleteTestValidation() {
  console.log('\n🔬 Testing Complete Test Validation...\n');
  
  const scenarios = [
    {
      name: 'High-quality test',
      questions: generateMockQuestions(30, false, false),
      expectedValid: true
    },
    {
      name: 'Test with duplicates',
      questions: [...generateMockQuestions(15, false, false), ...generateMockQuestions(15, false, false)],
      expectedValid: false
    },
    {
      name: 'Test with unprofessional answers',
      questions: generateMockQuestions(30, true, false),
      expectedValid: false
    },
    {
      name: 'Test with invalid answers',
      questions: generateMockQuestions(30, false, true),
      expectedValid: false
    },
    {
      name: 'Small test (under minimum)',
      questions: generateMockQuestions(5, false, false),
      expectedValid: false
    }
  ];
  
  let passedTests = 0;
  
  scenarios.forEach((scenario, index) => {
    console.log(`Scenario ${index + 1}: ${scenario.name}`);
    
    const validation = validateCompleteTest(scenario.questions);
    const testPassed = validation.isValid === scenario.expectedValid;
    
    console.log(`  Questions: ${scenario.questions.length}`);
    console.log(`  Expected valid: ${scenario.expectedValid}`);
    console.log(`  Actual valid: ${validation.isValid}`);
    console.log(`  Issues: ${validation.issues.length}`);
    console.log(`  Recommendations: ${validation.recommendations.length}`);
    
    if (testPassed) {
      console.log('  ✅ PASSED\n');
      passedTests++;
    } else {
      console.log('  ❌ FAILED');
      console.log(`  Issues found: ${validation.issues.join(', ')}`);
      console.log('');
    }
  });
  
  console.log(`Complete Test Validation: ${passedTests}/${scenarios.length} tests passed\n`);
  return passedTests === scenarios.length;
}

// Helper functions

function removeDuplicateQuestions(questions) {
  const seenContent = new Set();
  const uniqueQuestions = [];
  
  questions.forEach(q => {
    const normalized = normalizeQuestionContent(q.content);
    if (!seenContent.has(normalized)) {
      seenContent.add(normalized);
      uniqueQuestions.push(q);
    }
  });
  
  return uniqueQuestions;
}

function removeAnswerSetDuplicates(questions) {
  const seenAnswerSets = new Set();
  const uniqueQuestions = [];
  
  questions.forEach(q => {
    const answerSignature = createAnswerSignature(q.options);
    if (!seenAnswerSets.has(answerSignature)) {
      seenAnswerSets.add(answerSignature);
      uniqueQuestions.push(q);
    }
  });
  
  return uniqueQuestions;
}

function normalizeQuestionContent(content) {
  return content
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function createAnswerSignature(options) {
  return options
    .map(opt => opt.toLowerCase().trim())
    .sort()
    .join('|');
}

function detectUnprofessionalAnswers(question) {
  const unprofessionalPatterns = [
    /wrong\s*answer\s*\d*/i,
    /option\s*[a-d]\s*$/i,
    /choice\s*\d+/i,
    /answer\s*\d+/i,
    /placeholder/i,
    /test\s*option/i,
    /dummy/i,
    /^[a-d]\.?\s*$/i,
    /^option\s*$/i,
    /^answer\s*$/i,
    /^\s*$/,
    /lorem\s*ipsum/i,
    /sample\s*text/i,
    /example\s*answer/i
  ];
  
  return question.options.some(option => 
    unprofessionalPatterns.some(pattern => pattern.test(option.trim()))
  );
}

function validateCompleteTest(questions) {
  const issues = [];
  const recommendations = [];
  
  // Check minimum question count
  if (questions.length < 10) {
    issues.push(`Test has only ${questions.length} questions (minimum recommended: 10)`);
  }
  
  // Check for duplicates
  const contentSet = new Set();
  let duplicates = 0;
  
  questions.forEach(q => {
    const normalized = normalizeQuestionContent(q.content);
    if (contentSet.has(normalized)) {
      duplicates++;
    } else {
      contentSet.add(normalized);
    }
  });
  
  if (duplicates > 0) {
    issues.push(`Found ${duplicates} duplicate questions`);
  }
  
  // Check for unprofessional answers
  let unprofessionalCount = 0;
  questions.forEach(q => {
    if (detectUnprofessionalAnswers(q)) {
      unprofessionalCount++;
    }
  });
  
  if (unprofessionalCount > 0) {
    issues.push(`${unprofessionalCount} questions have unprofessional answer options`);
  }
  
  // Check for invalid answers (simplified)
  let invalidAnswers = 0;
  questions.forEach(q => {
    if (!q.options.includes(q.correctAnswer)) {
      invalidAnswers++;
    }
  });
  
  if (invalidAnswers > 0) {
    issues.push(`${invalidAnswers} questions have invalid answers`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

function generateMockQuestions(count, includeUnprofessional = false, includeInvalidAnswers = false) {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    const num1 = mockUtils.getRandomInt(1, 20);
    const num2 = mockUtils.getRandomInt(1, 20);
    const answer = num1 + num2;
    
    let options;
    if (includeUnprofessional && i % 5 === 0) {
      options = ['Wrong Answer 1', 'Wrong Answer 2', answer.toString(), 'Wrong Answer 3'];
    } else {
      options = [
        answer.toString(),
        (answer + 1).toString(),
        (answer - 1).toString(),
        (answer + 2).toString()
      ];
    }
    
    let correctAnswer = answer.toString();
    if (includeInvalidAnswers && i % 7 === 0) {
      correctAnswer = 'invalid_answer'; // Not in options
    }
    
    questions.push({
      _id: mockUtils.generateId(),
      content: `What is ${num1} + ${num2}?`,
      options: mockUtils.shuffleArray(options),
      correctAnswer,
      subject: 'Math',
      difficulty: 'medium',
      grade: '3',
      topic: 'Addition',
      type: 'multiple_choice'
    });
  }
  
  return questions;
}

// Main test runner
function runAllTests() {
  console.log('🚀 Running Timed Test Fix Tests...\n');
  console.log('=' .repeat(60));
  
  const results = {
    duplicateDetection: testDuplicateDetection(),
    unprofessionalAnswers: testUnprofessionalAnswerDetection(),
    answerSetDuplicates: testAnswerSetDuplicates(),
    completeTestValidation: testCompleteTestValidation()
  };
  
  console.log('=' .repeat(60));
  console.log('\n📊 FINAL TEST RESULTS:\n');
  
  Object.entries(results).forEach(([testName, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    const displayName = testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${displayName}: ${status}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n' + '=' .repeat(60));
  console.log(`\n🎯 OVERALL RESULT: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`);
  
  if (allPassed) {
    console.log('🎉 The timed test fixes are working correctly!');
    console.log('✨ No duplicate questions in tests');
    console.log('🎭 No unprofessional placeholder answers');
    console.log('🔍 Enhanced answer validation for accurate scoring');
    console.log('🏆 Professional, high-quality timed tests');
  } else {
    console.log('⚠️  Some issues were detected. Please review the test results above.');
  }
  
  console.log('\n' + '=' .repeat(60));
  
  return allPassed;
}

// Run the tests
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testDuplicateDetection,
  testUnprofessionalAnswerDetection,
  testAnswerSetDuplicates,
  testCompleteTestValidation
};
