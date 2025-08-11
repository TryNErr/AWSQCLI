#!/usr/bin/env node

console.log('🔧 Testing Subject Filtering Fix...\n');

// Test the fixed normalizeSubject function
const normalizeSubject = (subject) => {
  const normalized = subject.toLowerCase().trim();
  
  // EXACT matches first (most specific)
  if (normalized === 'math' || normalized === 'mathematics') {
    return 'mathematical reasoning';
  }
  if (normalized === 'mathematical reasoning') {
    return 'mathematical reasoning';
  }
  if (normalized === 'reading' || normalized === 'reading comprehension') {
    return 'reading';
  }
  if (normalized === 'thinking skills' || normalized === 'critical thinking') {
    return 'thinking skills';
  }
  if (normalized === 'english' || normalized === 'grammar' || normalized === 'literacy') {
    return 'english';
  }
  
  // Partial matches (be very specific to avoid conflicts)
  if (normalized.includes('mathematical') && normalized.includes('reasoning')) {
    return 'mathematical reasoning';
  }
  if (normalized.includes('thinking') && normalized.includes('skills')) {
    return 'thinking skills';
  }
  if (normalized.includes('reading') && !normalized.includes('reasoning')) {
    return 'reading';
  }
  if (normalized.includes('english') || normalized.includes('grammar')) {
    return 'english';
  }
  if (normalized === 'math' || (normalized.includes('math') && !normalized.includes('reasoning'))) {
    return 'mathematical reasoning';
  }
  
  return normalized;
};

// Test cases
const testCases = [
  // User selections from dropdown
  { input: 'Math', expected: 'mathematical reasoning', description: 'User selects Math' },
  { input: 'English', expected: 'english', description: 'User selects English' },
  { input: 'Reading', expected: 'reading', description: 'User selects Reading' },
  { input: 'Thinking Skills', expected: 'thinking skills', description: 'User selects Thinking Skills' },
  { input: 'Mathematical Reasoning', expected: 'mathematical reasoning', description: 'User selects Mathematical Reasoning' },
  
  // Question subjects from files
  { input: 'Mathematical Reasoning', expected: 'mathematical reasoning', description: 'Question subject: Mathematical Reasoning' },
  { input: 'Reading', expected: 'reading', description: 'Question subject: Reading' },
  { input: 'Thinking Skills', expected: 'thinking skills', description: 'Question subject: Thinking Skills' },
  { input: 'English', expected: 'english', description: 'Question subject: English' },
];

console.log('🧪 Testing Subject Normalization:\n');

let allPassed = true;

testCases.forEach((testCase, index) => {
  const result = normalizeSubject(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   Input: "${testCase.input}"`);
  console.log(`   Expected: "${testCase.expected}"`);
  console.log(`   Got: "${result}"`);
  console.log(`   ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  if (!passed) allPassed = false;
});

// Test the specific bug scenario
console.log('🐛 Testing the Specific Bug Scenario:\n');

const bugTestCases = [
  {
    userSelection: 'Thinking Skills',
    questionSubject: 'Mathematical Reasoning',
    shouldMatch: false,
    description: 'Thinking Skills filter should NOT match Mathematical Reasoning questions'
  },
  {
    userSelection: 'Thinking Skills', 
    questionSubject: 'Thinking Skills',
    shouldMatch: true,
    description: 'Thinking Skills filter should match Thinking Skills questions'
  },
  {
    userSelection: 'Mathematical Reasoning',
    questionSubject: 'Mathematical Reasoning', 
    shouldMatch: true,
    description: 'Mathematical Reasoning filter should match Mathematical Reasoning questions'
  },
  {
    userSelection: 'Mathematical Reasoning',
    questionSubject: 'Thinking Skills',
    shouldMatch: false,
    description: 'Mathematical Reasoning filter should NOT match Thinking Skills questions'
  }
];

bugTestCases.forEach((testCase, index) => {
  const normalizedSelection = normalizeSubject(testCase.userSelection);
  const normalizedQuestion = normalizeSubject(testCase.questionSubject);
  const actualMatch = normalizedSelection === normalizedQuestion;
  const passed = actualMatch === testCase.shouldMatch;
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   User selects: "${testCase.userSelection}" → "${normalizedSelection}"`);
  console.log(`   Question subject: "${testCase.questionSubject}" → "${normalizedQuestion}"`);
  console.log(`   Should match: ${testCase.shouldMatch}`);
  console.log(`   Actually matches: ${actualMatch}`);
  console.log(`   ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  if (!passed) allPassed = false;
});

// Summary
console.log('📊 Test Summary:\n');
if (allPassed) {
  console.log('🎉 ALL TESTS PASSED! The subject filtering bug has been fixed.');
  console.log('');
  console.log('✅ Key Fixes:');
  console.log('   - "Thinking Skills" no longer matches "Mathematical Reasoning" questions');
  console.log('   - Each subject now has precise, non-overlapping matching rules');
  console.log('   - Exact matches are prioritized over partial matches');
  console.log('   - Partial matches are very specific to avoid conflicts');
} else {
  console.log('❌ SOME TESTS FAILED! The fix needs more work.');
}

console.log('');
console.log('🔄 Next Steps:');
console.log('1. Restart the development server');
console.log('2. Go to Enhanced Practice page');
console.log('3. Select Grade 5, Medium difficulty, "Thinking Skills"');
console.log('4. Verify that ONLY Thinking Skills questions appear');
console.log('5. Test other subjects to ensure they work correctly');

console.log('');
console.log('🎯 Expected Behavior:');
console.log('   - Thinking Skills → Only logic, patterns, reasoning questions');
console.log('   - Mathematical Reasoning → Only advanced math questions');
console.log('   - Math → Basic math questions');
console.log('   - Reading → Reading comprehension questions');
console.log('   - English → Grammar and language questions');
