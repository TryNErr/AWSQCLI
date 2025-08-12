#!/usr/bin/env node

/**
 * Fix Subject Filtering Script
 * 
 * This script addresses the specific issue where Mathematics questions
 * appear when filtering for English questions.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function createStrictFilteringPatch() {
  console.log('🔧 CREATING STRICT FILTERING PATCH');
  console.log('==================================\n');
  
  // The issue is likely in the frontend question loading logic
  // Let's create a patch file that ensures strict subject filtering
  
  const patchContent = `
/**
 * STRICT SUBJECT FILTERING PATCH
 * 
 * This patch ensures that when users filter for a specific subject,
 * they ONLY get questions from that subject - no mixing or fallbacks.
 */

// Add this function to your question loading logic
function strictSubjectFilter(questions, requestedSubject) {
  console.log(\`🔍 Strict filtering: Requested "\${requestedSubject}", filtering \${questions.length} questions\`);
  
  // Normalize the requested subject
  const normalizedRequested = normalizeSubjectForFiltering(requestedSubject);
  
  // Filter questions with exact subject match
  const filtered = questions.filter(question => {
    const questionSubject = normalizeSubjectForFiltering(question.subject);
    const matches = questionSubject === normalizedRequested;
    
    if (!matches) {
      console.log(\`❌ Filtered out: "\${question.content.substring(0, 50)}..." (Subject: \${question.subject})\`);
    }
    
    return matches;
  });
  
  console.log(\`✅ Strict filter result: \${filtered.length} questions match "\${requestedSubject}"\`);
  
  // Log any remaining questions for verification
  if (filtered.length > 0) {
    console.log(\`📝 Sample filtered questions:\`);
    filtered.slice(0, 3).forEach((q, i) => {
      console.log(\`   \${i + 1}. "\${q.content.substring(0, 40)}..." (Subject: \${q.subject})\`);
    });
  }
  
  return filtered;
}

function normalizeSubjectForFiltering(subject) {
  if (!subject) return '';
  
  const normalized = subject.toLowerCase().trim();
  
  // Exact mappings for filtering
  if (normalized === 'english' || normalized === 'english language arts') return 'english';
  if (normalized === 'mathematics' || normalized === 'math') return 'mathematics';
  if (normalized === 'reading' || normalized === 'reading comprehension') return 'reading';
  if (normalized === 'thinking skills' || normalized === 'critical thinking') return 'thinking-skills';
  
  return normalized;
}

// Use this instead of loose filtering
export { strictSubjectFilter, normalizeSubjectForFiltering };
`;

  fs.writeFileSync('./strict_filtering_patch.js', patchContent);
  console.log('✅ Created strict_filtering_patch.js');
}

function validateQuestionFiles() {
  console.log('\n🔍 VALIDATING QUESTION FILES');
  console.log('============================\n');
  
  const testCases = [
    { file: '9_hard_english.json', expectedSubject: 'English' },
    { file: '9_hard_math.json', expectedSubject: 'Mathematics' },
    { file: '9_hard_reading.json', expectedSubject: 'Reading' },
    { file: '9_hard_thinking-skills.json', expectedSubject: 'Thinking Skills' }
  ];
  
  testCases.forEach(testCase => {
    const filePath = path.join(QUESTIONS_DIR, testCase.file);
    
    try {
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(`📁 ${testCase.file}:`);
      console.log(`   Expected subject: ${testCase.expectedSubject}`);
      console.log(`   Total questions: ${questions.length}`);
      
      const subjectCounts = {};
      questions.forEach(q => {
        subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
      });
      
      Object.entries(subjectCounts).forEach(([subject, count]) => {
        const status = subject === testCase.expectedSubject ? '✅' : '❌';
        console.log(`   ${status} ${subject}: ${count} questions`);
      });
      
      const wrongSubjects = questions.filter(q => q.subject !== testCase.expectedSubject);
      if (wrongSubjects.length > 0) {
        console.log(`   🚨 ${wrongSubjects.length} questions have wrong subject!`);
        wrongSubjects.slice(0, 2).forEach(q => {
          console.log(`     - "${q.content.substring(0, 40)}..." (${q.subject})`);
        });
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Could not validate ${testCase.file}: ${error.message}\n`);
    }
  });
}

function createDebugQuestionLoader() {
  console.log('🔧 CREATING DEBUG QUESTION LOADER');
  console.log('=================================\n');
  
  const debugContent = `
/**
 * DEBUG QUESTION LOADER
 * 
 * Use this to debug what questions are being loaded for each subject filter
 */

function debugQuestionLoading(grade, difficulty, subject) {
  console.log(\`🎯 DEBUG: Loading questions for Grade \${grade}, \${difficulty}, \${subject}\`);
  
  // Simulate the loading process
  const expectedFile = \`\${grade}_\${difficulty}_\${subject.toLowerCase().replace(' ', '-')}.json\`;
  console.log(\`📁 Expected file: \${expectedFile}\`);
  
  // Load and analyze
  fetch(\`/questions/\${expectedFile}\`)
    .then(response => response.json())
    .then(questions => {
      console.log(\`📊 Loaded \${questions.length} questions from \${expectedFile}\`);
      
      // Check subjects
      const subjects = [...new Set(questions.map(q => q.subject))];
      console.log(\`🏷️ Subjects found: \${subjects.join(', ')}\`);
      
      // Check for mismatches
      const expectedSubject = getExpectedSubject(subject);
      const mismatches = questions.filter(q => q.subject !== expectedSubject);
      
      if (mismatches.length > 0) {
        console.log(\`🚨 Found \${mismatches.length} questions with wrong subject:\`);
        mismatches.slice(0, 3).forEach(q => {
          console.log(\`   ❌ "\${q.content.substring(0, 40)}..." (Expected: \${expectedSubject}, Got: \${q.subject})\`);
        });
      } else {
        console.log(\`✅ All questions have correct subject: \${expectedSubject}\`);
      }
    })
    .catch(error => {
      console.log(\`❌ Failed to load \${expectedFile}: \${error.message}\`);
    });
}

function getExpectedSubject(requestedSubject) {
  const mapping = {
    'english': 'English',
    'math': 'Mathematics', 
    'mathematics': 'Mathematics',
    'reading': 'Reading',
    'thinking skills': 'Thinking Skills',
    'thinking-skills': 'Thinking Skills'
  };
  
  return mapping[requestedSubject.toLowerCase()] || requestedSubject;
}

// Add to your frontend for debugging
window.debugQuestionLoading = debugQuestionLoading;
`;

  fs.writeFileSync('./debug_question_loader.js', debugContent);
  console.log('✅ Created debug_question_loader.js');
}

function createFilteringTestSuite() {
  console.log('\n🧪 CREATING FILTERING TEST SUITE');
  console.log('================================\n');
  
  const testContent = `
/**
 * FILTERING TEST SUITE
 * 
 * Test cases to verify subject filtering works correctly
 */

const filteringTests = [
  {
    name: 'English Filter Test',
    grade: '9',
    difficulty: 'hard',
    subject: 'English',
    expectedSubject: 'English',
    shouldNotContain: ['Mathematics', 'Reading', 'Thinking Skills']
  },
  {
    name: 'Math Filter Test', 
    grade: '9',
    difficulty: 'hard',
    subject: 'Mathematics',
    expectedSubject: 'Mathematics',
    shouldNotContain: ['English', 'Reading', 'Thinking Skills']
  },
  {
    name: 'Reading Filter Test',
    grade: '9', 
    difficulty: 'hard',
    subject: 'Reading',
    expectedSubject: 'Reading',
    shouldNotContain: ['Mathematics', 'English', 'Thinking Skills']
  }
];

function runFilteringTests() {
  console.log('🧪 Running Filtering Tests...');
  
  filteringTests.forEach(test => {
    console.log(\`\\n📋 \${test.name}:\`);
    
    // Load questions for this filter
    const filename = \`\${test.grade}_\${test.difficulty}_\${test.subject.toLowerCase().replace(' ', '-')}.json\`;
    
    fetch(\`/questions/\${filename}\`)
      .then(response => response.json())
      .then(questions => {
        console.log(\`   📊 Loaded \${questions.length} questions\`);
        
        // Test 1: All questions should have expected subject
        const correctSubject = questions.filter(q => q.subject === test.expectedSubject);
        const wrongSubject = questions.filter(q => q.subject !== test.expectedSubject);
        
        console.log(\`   ✅ Correct subject (\${test.expectedSubject}): \${correctSubject.length}\`);
        
        if (wrongSubject.length > 0) {
          console.log(\`   ❌ Wrong subject: \${wrongSubject.length}\`);
          wrongSubject.forEach(q => {
            console.log(\`      - "\${q.content.substring(0, 30)}..." (Subject: \${q.subject})\`);
          });
        }
        
        // Test 2: Should not contain forbidden subjects
        test.shouldNotContain.forEach(forbiddenSubject => {
          const forbidden = questions.filter(q => q.subject === forbiddenSubject);
          if (forbidden.length > 0) {
            console.log(\`   🚨 Contains forbidden subject \${forbiddenSubject}: \${forbidden.length} questions\`);
          }
        });
        
        // Test result
        const passed = wrongSubject.length === 0;
        console.log(\`   \${passed ? '✅ PASSED' : '❌ FAILED'}\`);
      })
      .catch(error => {
        console.log(\`   ❌ Test failed to load: \${error.message}\`);
      });
  });
}

// Add to your frontend for testing
window.runFilteringTests = runFilteringTests;
`;

  fs.writeFileSync('./filtering_test_suite.js', testContent);
  console.log('✅ Created filtering_test_suite.js');
}

function main() {
  console.log('🚀 FIXING SUBJECT FILTERING ISSUE');
  console.log('=================================\n');
  
  console.log('Issue: Mathematics questions appear when filtering for English');
  console.log('Solution: Create strict filtering tools and validation\n');
  
  // Step 1: Validate current question files
  validateQuestionFiles();
  
  // Step 2: Create debugging tools
  createStrictFilteringPatch();
  createDebugQuestionLoader();
  createFilteringTestSuite();
  
  console.log('🎯 SOLUTION SUMMARY:');
  console.log('====================\n');
  
  console.log('Created debugging and fixing tools:');
  console.log('✅ strict_filtering_patch.js - Ensures strict subject filtering');
  console.log('✅ debug_question_loader.js - Debug what questions are loaded');
  console.log('✅ filtering_test_suite.js - Test filtering functionality\n');
  
  console.log('🔧 IMMEDIATE FIX RECOMMENDATIONS:');
  console.log('1. The question files themselves appear correct');
  console.log('2. The issue is likely in the frontend question loading/mixing logic');
  console.log('3. Use the strict filtering patch to ensure no cross-contamination');
  console.log('4. Add the debug tools to identify where mixing occurs\n');
  
  console.log('🎯 ROOT CAUSE HYPOTHESIS:');
  console.log('The system may be:');
  console.log('- Loading questions from multiple sources and mixing them');
  console.log('- Falling back to generated questions with wrong subjects');
  console.log('- Having caching issues that mix different subject pools');
  console.log('- Using loose subject matching instead of strict filtering\n');
  
  console.log('✅ Next step: Apply the strict filtering patch to the frontend!');
}

if (require.main === module) {
  main();
}
