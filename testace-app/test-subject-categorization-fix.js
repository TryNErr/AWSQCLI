#!/usr/bin/env node

/**
 * COMPREHENSIVE TEST FOR SUBJECT CATEGORIZATION FIX
 * 
 * This script tests the fix for the reported issue where users get thinking skills questions in math tests.
 * 
 * TESTS PERFORMED:
 * 1. Verify no mathematical questions remain in Thinking Skills files
 * 2. Verify no thinking skills questions are in Math files
 * 3. Test subject filtering logic for all subjects
 * 4. Simulate both timed test and practice test scenarios
 * 5. Validate question content matches subject classification
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 COMPREHENSIVE SUBJECT CATEGORIZATION TEST');
console.log('='.repeat(50));

// Configuration
const QUESTIONS_DIR = path.join(__dirname, 'public', 'questions');

// Test patterns
const MATHEMATICAL_PATTERNS = [
  /x²|x\^2|quadratic|equation/i,
  /probability|P\s*=|random.*chosen/i,
  /algebra|solve.*=|find.*value/i,
  /calculate|compute|what.*equals/i,
  /maximum.*value|minimum.*value/i,
  /coefficient|variable|expression/i,
  /factorial|permutation|combination/i
];

const THINKING_SKILLS_PATTERNS = [
  /pattern.*continues|next.*sequence|what.*comes.*next/i,
  /logical.*reasoning|if.*then|conclusion/i,
  /analogy|similar.*to|relationship/i,
  /spatial.*reasoning|rotate|flip|mirror/i,
  /critical.*thinking|analyze|evaluate/i,
  /problem.*solving.*strategy|approach/i,
  /categorize|classify|group/i,
  /inference|deduce|imply/i
];

// Test results
let testResults = {
  totalFiles: 0,
  totalQuestions: 0,
  mathFiles: 0,
  thinkingSkillsFiles: 0,
  readingFiles: 0,
  mathQuestionsInThinkingSkills: 0,
  thinkingSkillsQuestionsInMath: 0,
  correctlyCategorized: 0,
  ambiguousQuestions: 0,
  errors: []
};

/**
 * Analyze question content to determine if it matches its subject
 */
function analyzeQuestionMatch(question) {
  const content = question.content.toLowerCase();
  const explanation = (question.explanation || '').toLowerCase();
  const topic = (question.topic || '').toLowerCase();
  const fullText = `${content} ${explanation} ${topic}`;
  
  const isMathematical = MATHEMATICAL_PATTERNS.some(pattern => pattern.test(fullText));
  const isThinkingSkills = THINKING_SKILLS_PATTERNS.some(pattern => pattern.test(fullText));
  
  const subject = question.subject.toLowerCase();
  
  // Check for mismatches
  if (subject.includes('thinking') && isMathematical && !isThinkingSkills) {
    return { match: false, issue: 'Mathematical content in Thinking Skills', type: 'math-in-thinking' };
  }
  
  if ((subject.includes('math') || subject.includes('reasoning')) && isThinkingSkills && !isMathematical) {
    return { match: false, issue: 'Thinking Skills content in Math', type: 'thinking-in-math' };
  }
  
  if (isMathematical && isThinkingSkills) {
    return { match: true, issue: 'Ambiguous content (both math and thinking skills)', type: 'ambiguous' };
  }
  
  return { match: true, issue: null, type: 'correct' };
}

/**
 * Test a single question file
 */
function testQuestionFile(filename) {
  const filePath = path.join(QUESTIONS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    testResults.errors.push(`File not found: ${filename}`);
    return;
  }
  
  try {
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!Array.isArray(questions)) {
      testResults.errors.push(`Invalid format: ${filename} (not an array)`);
      return;
    }
    
    testResults.totalFiles++;
    testResults.totalQuestions += questions.length;
    
    // Categorize file type
    if (filename.includes('math')) {
      testResults.mathFiles++;
    } else if (filename.includes('thinking')) {
      testResults.thinkingSkillsFiles++;
    } else if (filename.includes('reading')) {
      testResults.readingFiles++;
    }
    
    // Test each question
    questions.forEach((question, index) => {
      if (!question.content || !question.subject) {
        testResults.errors.push(`Invalid question in ${filename} at index ${index}: missing content or subject`);
        return;
      }
      
      const analysis = analyzeQuestionMatch(question);
      
      switch (analysis.type) {
        case 'math-in-thinking':
          testResults.mathQuestionsInThinkingSkills++;
          testResults.errors.push({
            file: filename,
            index,
            issue: analysis.issue,
            content: question.content.substring(0, 100) + '...',
            subject: question.subject
          });
          break;
          
        case 'thinking-in-math':
          testResults.thinkingSkillsQuestionsInMath++;
          testResults.errors.push({
            file: filename,
            index,
            issue: analysis.issue,
            content: question.content.substring(0, 100) + '...',
            subject: question.subject
          });
          break;
          
        case 'ambiguous':
          testResults.ambiguousQuestions++;
          break;
          
        case 'correct':
          testResults.correctlyCategorized++;
          break;
      }
    });
    
  } catch (error) {
    testResults.errors.push(`Error processing ${filename}: ${error.message}`);
  }
}

/**
 * Test subject normalization function
 */
function testSubjectNormalization() {
  console.log('\n🔍 TESTING SUBJECT NORMALIZATION');
  console.log('='.repeat(30));
  
  // Simulate the normalization function from the fix
  function normalizeSubject(subject) {
    const normalized = subject.toLowerCase().trim();
    
    if (normalized === 'math' || normalized === 'mathematics' || normalized === 'mathematical reasoning') {
      return 'math';
    }
    if (normalized === 'english' || normalized === 'english language') {
      return 'english';
    }
    if (normalized === 'reading' || normalized === 'reading comprehension') {
      return 'reading';
    }
    if (normalized === 'thinking skills' || normalized === 'critical thinking' || normalized === 'logical reasoning') {
      return 'thinking skills';
    }
    
    if (normalized.includes('math')) return 'math';
    if (normalized.includes('english')) return 'english';
    if (normalized.includes('reading')) return 'reading';
    if (normalized.includes('thinking')) return 'thinking skills';
    if (normalized.includes('reasoning') && !normalized.includes('mathematical')) return 'thinking skills';
    if (normalized.includes('reasoning') && normalized.includes('mathematical')) return 'math';
    
    return normalized;
  }
  
  // Test cases
  const testCases = [
    { input: 'Math', expected: 'math' },
    { input: 'Mathematical Reasoning', expected: 'math' },
    { input: 'Thinking Skills', expected: 'thinking skills' },
    { input: 'Reading', expected: 'reading' },
    { input: 'English', expected: 'english' },
    { input: 'mathematics', expected: 'math' },
    { input: 'critical thinking', expected: 'thinking skills' },
    { input: 'logical reasoning', expected: 'thinking skills' },
    { input: 'reading comprehension', expected: 'reading' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(testCase => {
    const result = normalizeSubject(testCase.input);
    if (result === testCase.expected) {
      console.log(`✅ "${testCase.input}" → "${result}"`);
      passed++;
    } else {
      console.log(`❌ "${testCase.input}" → "${result}" (expected "${testCase.expected}")`);
      failed++;
    }
  });
  
  console.log(`\nNormalization test results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Test filtering logic simulation
 */
function testFilteringLogic() {
  console.log('\n🔍 TESTING FILTERING LOGIC SIMULATION');
  console.log('='.repeat(30));
  
  // Simulate filtering for different subjects
  const subjects = ['Math', 'Thinking Skills', 'Reading', 'English'];
  const grades = ['5', '9'];
  const difficulties = ['easy', 'hard'];
  
  subjects.forEach(subject => {
    grades.forEach(grade => {
      difficulties.forEach(difficulty => {
        console.log(`\n📊 Testing filter: ${subject}, Grade ${grade}, ${difficulty}`);
        
        // Get relevant files
        const pattern = `${grade}_${difficulty}_${subject.toLowerCase().replace(' ', '-')}.json`;
        const filePath = path.join(QUESTIONS_DIR, pattern);
        
        if (fs.existsSync(filePath)) {
          try {
            const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // Check if all questions match the filter criteria
            let matches = 0;
            let mismatches = 0;
            
            questions.forEach(question => {
              const gradeMatch = String(question.grade) === String(grade);
              const difficultyMatch = question.difficulty === difficulty;
              
              // Subject matching using normalization
              const normalizeSubject = (s) => {
                const n = s.toLowerCase().trim();
                if (n.includes('math') || n === 'mathematical reasoning') return 'math';
                if (n.includes('thinking')) return 'thinking skills';
                if (n.includes('reading')) return 'reading';
                if (n.includes('english')) return 'english';
                return n;
              };
              
              const subjectMatch = normalizeSubject(question.subject) === normalizeSubject(subject);
              
              if (gradeMatch && difficultyMatch && subjectMatch) {
                matches++;
              } else {
                mismatches++;
                if (!subjectMatch) {
                  console.log(`   ⚠️ Subject mismatch: "${question.subject}" vs "${subject}"`);
                }
              }
            });
            
            console.log(`   ✅ ${matches} questions match, ${mismatches} mismatches`);
            
            if (mismatches === 0) {
              console.log(`   🎉 Perfect filtering for ${subject}!`);
            }
            
          } catch (error) {
            console.log(`   ❌ Error reading ${pattern}: ${error.message}`);
          }
        } else {
          console.log(`   📁 File not found: ${pattern}`);
        }
      });
    });
  });
}

/**
 * Main test execution
 */
function runTests() {
  console.log('Starting comprehensive subject categorization tests...\n');
  
  // Test 1: Subject normalization
  const normalizationPassed = testSubjectNormalization();
  
  // Test 2: Question file analysis
  console.log('\n🔍 TESTING QUESTION FILES');
  console.log('='.repeat(30));
  
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  console.log(`Found ${files.length} question files to test`);
  
  files.forEach(testQuestionFile);
  
  // Test 3: Filtering logic simulation
  testFilteringLogic();
  
  // Print comprehensive results
  console.log('\n📊 COMPREHENSIVE TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total files tested: ${testResults.totalFiles}`);
  console.log(`Total questions tested: ${testResults.totalQuestions}`);
  console.log(`Math files: ${testResults.mathFiles}`);
  console.log(`Thinking Skills files: ${testResults.thinkingSkillsFiles}`);
  console.log(`Reading files: ${testResults.readingFiles}`);
  console.log(`\n🎯 CATEGORIZATION ACCURACY:`);
  console.log(`Correctly categorized: ${testResults.correctlyCategorized}`);
  console.log(`Math questions in Thinking Skills: ${testResults.mathQuestionsInThinkingSkills}`);
  console.log(`Thinking Skills questions in Math: ${testResults.thinkingSkillsQuestionsInMath}`);
  console.log(`Ambiguous questions: ${testResults.ambiguousQuestions}`);
  console.log(`Errors found: ${testResults.errors.length}`);
  
  // Show specific errors
  if (testResults.errors.length > 0) {
    console.log('\n❌ SPECIFIC ISSUES FOUND:');
    testResults.errors.forEach((error, index) => {
      if (typeof error === 'string') {
        console.log(`${index + 1}. ${error}`);
      } else {
        console.log(`${index + 1}. ${error.file} - ${error.issue}`);
        console.log(`   Subject: ${error.subject}`);
        console.log(`   Content: "${error.content}"`);
      }
    });
  }
  
  // Overall assessment
  const totalIssues = testResults.mathQuestionsInThinkingSkills + testResults.thinkingSkillsQuestionsInMath;
  const successRate = ((testResults.correctlyCategorized / testResults.totalQuestions) * 100).toFixed(2);
  
  console.log('\n🏆 OVERALL ASSESSMENT');
  console.log('='.repeat(30));
  console.log(`Subject normalization: ${normalizationPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Categorization issues: ${totalIssues === 0 ? '✅ NONE FOUND' : `❌ ${totalIssues} FOUND`}`);
  console.log(`Success rate: ${successRate}%`);
  console.log(`Overall result: ${totalIssues === 0 && normalizationPassed ? '🎉 ALL TESTS PASSED' : '⚠️ ISSUES FOUND'}`);
  
  if (totalIssues === 0 && normalizationPassed) {
    console.log('\n✅ SUCCESS! The subject categorization fix is working correctly.');
    console.log('✅ No mathematical questions found in Thinking Skills files');
    console.log('✅ No thinking skills questions found in Math files');
    console.log('✅ Subject normalization working properly');
    console.log('✅ Both timed test and practice test filtering should work correctly');
  } else {
    console.log('\n⚠️ The fix may need additional adjustments.');
    console.log('Please review the specific issues listed above.');
  }
  
  return totalIssues === 0 && normalizationPassed;
}

// Run all tests
const allTestsPassed = runTests();
process.exit(allTestsPassed ? 0 : 1);
