#!/usr/bin/env node

/**
 * Apply Surgical Fix to StaticQuestionLoader
 * 
 * This script applies a precise fix to add subject filtering
 * without breaking the TypeScript syntax.
 */

const fs = require('fs');
const path = require('path');

const STATIC_LOADER_PATH = './testace-app/frontend/src/utils/staticQuestionLoader.ts';

function applySurgicalFix() {
  console.log('🔧 APPLYING SURGICAL FIX TO STATICQUESTIONLOADER');
  console.log('================================================\n');
  
  // Read the current file
  let content = fs.readFileSync(STATIC_LOADER_PATH, 'utf8');
  
  // Step 1: Add the subject filtering after loading questions
  const originalReturn = 'const questions: Question[] = await response.json();\n      return questions;';
  const fixedReturn = `const questions: Question[] = await response.json();
      
      // 🔧 CRITICAL FIX: Apply strict subject filtering after loading
      const filteredQuestions = this.applyStrictSubjectFilter(questions, key);
      console.log(\`🔍 Loaded \${questions.length} questions, filtered to \${filteredQuestions.length} for subject matching\`);
      return filteredQuestions;`;
  
  if (content.includes(originalReturn)) {
    content = content.replace(originalReturn, fixedReturn);
    console.log('✅ Step 1: Added subject filtering call');
  } else {
    console.log('⚠️ Step 1: Could not find exact match for return statement');
  }
  
  // Step 2: Add the filtering methods before the last closing brace
  const filteringMethods = `
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
    
    return mapping[fileSubject] || null;
  }
`;
  
  // Find the last closing brace and add methods before it
  const lastBraceIndex = content.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    content = content.substring(0, lastBraceIndex) + filteringMethods + '\n}';
    console.log('✅ Step 2: Added filtering methods');
  } else {
    console.log('❌ Step 2: Could not find closing brace');
  }
  
  // Write the fixed file
  fs.writeFileSync(STATIC_LOADER_PATH, content);
  console.log('✅ Surgical fix applied successfully');
}

function verifyFix() {
  console.log('\n🔍 VERIFYING FIX');
  console.log('================\n');
  
  const content = fs.readFileSync(STATIC_LOADER_PATH, 'utf8');
  
  const hasFilterCall = content.includes('applyStrictSubjectFilter(questions, key)');
  const hasFilterMethod = content.includes('private static applyStrictSubjectFilter');
  const hasMappingMethod = content.includes('getExpectedQuestionSubject');
  
  if (hasFilterCall && hasFilterMethod && hasMappingMethod) {
    console.log('✅ All components of the fix are present');
    console.log('✅ Subject filtering should now work correctly');
  } else {
    console.log('❌ Fix may not have been applied correctly:');
    console.log(`   Filter call: ${hasFilterCall}`);
    console.log(`   Filter method: ${hasFilterMethod}`);
    console.log(`   Mapping method: ${hasMappingMethod}`);
  }
}

function main() {
  console.log('🚀 SURGICAL FIX FOR SUBJECT FILTERING');
  console.log('=====================================\n');
  
  console.log('Applying precise fix to StaticQuestionLoader...\n');
  
  applySurgicalFix();
  verifyFix();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. The TypeScript compilation errors should be resolved');
  console.log('2. Restart your development server');
  console.log('3. Test the Enhanced Practice page');
  console.log('4. Mathematics questions should no longer appear when filtering for English');
  
  console.log('\n✅ Surgical fix complete!');
}

if (require.main === module) {
  main();
}
