#!/usr/bin/env node

/**
 * Fix StaticQuestionLoader Filtering Issue
 * 
 * This script patches the StaticQuestionLoader to add strict subject filtering
 * after loading questions from files.
 */

const fs = require('fs');
const path = require('path');

const STATIC_LOADER_PATH = './testace-app/frontend/src/utils/staticQuestionLoader.ts';

function createFixedStaticQuestionLoader() {
  console.log('🔧 FIXING STATICQUESTIONLOADER FILTERING');
  console.log('========================================\n');
  
  console.log('Issue: StaticQuestionLoader loads questions from files but doesn\'t filter by subject');
  console.log('Result: Mathematics questions appear when filtering for English\n');
  
  // Read the current file
  const currentContent = fs.readFileSync(STATIC_LOADER_PATH, 'utf8');
  
  // Create the fixed version with strict subject filtering
  const fixedContent = currentContent.replace(
    // Find the loadQuestionsFromFile method
    /(private static async loadQuestionsFromFile\(key: string\): Promise<Question\[\]> \{[\s\S]*?const questions: Question\[\] = await response\.json\(\);)/,
    `$1
      
      // 🔧 CRITICAL FIX: Apply strict subject filtering after loading
      const filteredQuestions = this.applyStrictSubjectFilter(questions, key);
      console.log(\`🔍 Loaded \${questions.length} questions, filtered to \${filteredQuestions.length} for subject matching\`);`
  );
  
  // Add the strict filtering method
  const finalContent = fixedContent.replace(
    /(return questions;[\s\S]*?}\s*\/\*\*)/,
    `return filteredQuestions;
      
    } catch (error) {
      // Silently handle missing files - this is expected behavior
      console.log(\`📄 Question file not available for \${key}, using generated questions\`);
      return [];
    }
  }

  /**
   * Apply strict subject filtering to loaded questions
   * This ensures that when filtering for English, only English questions are returned
   */
  private static applyStrictSubjectFilter(questions: Question[], key: string): Question[] {
    // Extract expected subject from the key (e.g., "9_hard_english" -> "english")
    const keyParts = key.split('_');
    const expectedSubject = keyParts[keyParts.length - 1]; // Last part is the subject
    
    // Map file subjects to expected question subjects
    const expectedQuestionSubject = this.getExpectedQuestionSubject(expectedSubject);
    
    if (!expectedQuestionSubject) {
      console.log(\`⚠️ Could not determine expected subject for key: \${key}\`);
      return questions; // Return all if we can't determine the subject
    }
    
    // Filter questions to only include those with the correct subject
    const filtered = questions.filter(question => {
      const matches = question.subject === expectedQuestionSubject;
      
      if (!matches) {
        console.log(\`❌ Filtered out: "\${question.content?.substring(0, 40)}..." (Expected: \${expectedQuestionSubject}, Got: \${question.subject})\`);
      }
      
      return matches;
    });
    
    console.log(\`✅ Subject filter: \${filtered.length}/\${questions.length} questions match "\${expectedQuestionSubject}"\`);
    return filtered;
  }
  
  /**
   * Get the expected question subject based on the file subject
   */
  private static getExpectedQuestionSubject(fileSubject: string): string | null {
    const mapping: { [key: string]: string } = {
      'math': 'Mathematics',
      'english': 'English', 
      'reading': 'Reading',
      'thinking-skills': 'Thinking Skills'
    };
    
    return mapping[fileSubject] || null;$1`
  );
  
  // Write the fixed file
  fs.writeFileSync(STATIC_LOADER_PATH, finalContent);
  
  console.log('✅ StaticQuestionLoader patched with strict subject filtering');
  console.log('✅ Now when filtering for English, only English questions will be returned');
  console.log('✅ Mathematics questions will be filtered out automatically\n');
}

function verifyPatch() {
  console.log('🔍 VERIFYING PATCH');
  console.log('==================\n');
  
  const content = fs.readFileSync(STATIC_LOADER_PATH, 'utf8');
  
  const hasStrictFilter = content.includes('applyStrictSubjectFilter');
  const hasExpectedSubjectMethod = content.includes('getExpectedQuestionSubject');
  const hasFilteringLogic = content.includes('Filtered out:');
  
  if (hasStrictFilter && hasExpectedSubjectMethod && hasFilteringLogic) {
    console.log('✅ Patch successfully applied!');
    console.log('✅ Strict subject filtering is now active');
    console.log('✅ Debug logging added for troubleshooting');
  } else {
    console.log('❌ Patch may not have been applied correctly');
    console.log(`   hasStrictFilter: ${hasStrictFilter}`);
    console.log(`   hasExpectedSubjectMethod: ${hasExpectedSubjectMethod}`);
    console.log(`   hasFilteringLogic: ${hasFilteringLogic}`);
  }
}

function createTestScript() {
  console.log('\n🧪 CREATING TEST SCRIPT');
  console.log('=======================\n');
  
  const testScript = `
// Test script to verify filtering works
// Add this to your browser console when testing the Enhanced Practice page

function testSubjectFiltering() {
  console.log('🧪 Testing Subject Filtering...');
  
  // This should only return English questions
  StaticQuestionLoader.getQuestions('9', 'hard', 'English', 5)
    .then(questions => {
      console.log('📊 Results for Grade 9, Hard, English:');
      questions.forEach((q, i) => {
        const status = q.subject === 'English' ? '✅' : '❌';
        console.log(\`  \${i+1}. \${status} "\${q.content.substring(0, 40)}..." (Subject: \${q.subject})\`);
      });
      
      const englishCount = questions.filter(q => q.subject === 'English').length;
      const nonEnglishCount = questions.length - englishCount;
      
      console.log(\`\\n📈 Summary: \${englishCount} English, \${nonEnglishCount} non-English\`);
      
      if (nonEnglishCount === 0) {
        console.log('🎉 SUCCESS: Perfect subject filtering!');
      } else {
        console.log('❌ FAILURE: Subject filtering not working');
      }
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
    });
}

// Run the test
testSubjectFiltering();
`;

  fs.writeFileSync('./test_subject_filtering.js', testScript);
  console.log('✅ Created test_subject_filtering.js');
  console.log('   Copy and paste this into your browser console to test the fix');
}

function main() {
  console.log('🚀 FIXING SUBJECT FILTERING ISSUE');
  console.log('=================================\n');
  
  console.log('Problem: Mathematics questions appear when filtering for English');
  console.log('Root Cause: StaticQuestionLoader doesn\'t filter by subject after loading');
  console.log('Solution: Add strict subject filtering to the loader\n');
  
  // Apply the fix
  createFixedStaticQuestionLoader();
  
  // Verify it worked
  verifyPatch();
  
  // Create test script
  createTestScript();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. The StaticQuestionLoader has been patched');
  console.log('2. Restart your development server');
  console.log('3. Test the Enhanced Practice page');
  console.log('4. When filtering for English, you should only see English questions');
  console.log('5. Use the test script to verify the fix works');
  
  console.log('\n✅ Subject filtering issue should now be resolved!');
}

if (require.main === module) {
  main();
}
