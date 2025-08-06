#!/usr/bin/env node

/**
 * Test script to verify timed test question count fix
 */

const { generateTimedTest } = require('./frontend/src/utils/enhancedTimedTestSystem');

async function testTimedTestGeneration() {
  console.log('🧪 Testing Timed Test Question Generation...
');
  
  const testConfigs = [
    { subject: 'Math', grade: '5', difficulty: 'medium', questionCount: 30, timeLimit: 30 },
    { subject: 'English', grade: '7', difficulty: 'easy', questionCount: 30, timeLimit: 30 },
    { subject: 'Thinking Skills', grade: '9', difficulty: 'hard', questionCount: 30, timeLimit: 30 },
    { subject: 'Mathematical Reasoning', grade: '6', difficulty: 'medium', questionCount: 30, timeLimit: 30 }
  ];
  
  for (const config of testConfigs) {
    try {
      console.log(`Testing: ${config.subject}, Grade ${config.grade}, ${config.difficulty}`);
      
      const result = await generateTimedTest(config);
      
      console.log(`  ✅ Generated ${result.questions.length}/${config.questionCount} questions`);
      console.log(`  📊 Stats: ${result.generatedCount} generated, ${result.duplicatesRemoved} duplicates removed`);
      
      if (result.questions.length < config.questionCount) {
        console.log(`  ⚠️  Warning: Only ${result.questions.length} questions generated (expected ${config.questionCount})`);
      }
      
      if (result.validationErrors.length > 0) {
        console.log(`  ⚠️  ${result.validationErrors.length} validation errors`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

if (require.main === module) {
  testTimedTestGeneration().catch(console.error);
}

module.exports = { testTimedTestGeneration };