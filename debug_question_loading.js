const fs = require('fs');

console.log('🔍 DEBUGGING MATHEMATICAL REASONING QUESTION LOADING...');

// Test if the question files are accessible and properly formatted
const testQuestionId = 'hard9_1755260455350_020';
const filePath = '/workspaces/AWSQCLI/testace-app/frontend/public/questions/9_hard_mathematical-reasoning.json';

console.log(`\n📁 Testing file: ${filePath}`);
console.log(`🎯 Looking for question ID: ${testQuestionId}`);

if (fs.existsSync(filePath)) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    console.log(`✅ File exists and is valid JSON`);
    console.log(`📊 Total questions: ${questions.length}`);
    
    // Find the specific question
    const targetQuestion = questions.find(q => q._id === testQuestionId);
    
    if (targetQuestion) {
      console.log(`✅ Question ${testQuestionId} found!`);
      console.log(`📝 Content: ${targetQuestion.content}`);
      console.log(`🏷️  Subject: ${targetQuestion.subject}`);
      console.log(`📚 Grade: ${targetQuestion.grade}`);
      console.log(`⚡ Difficulty: ${targetQuestion.difficulty}`);
    } else {
      console.log(`❌ Question ${testQuestionId} NOT found in file`);
      console.log(`📋 Available IDs:`);
      questions.slice(0, 5).forEach(q => console.log(`   - ${q._id}`));
      console.log(`   ... and ${questions.length - 5} more`);
    }
    
    // Test the StaticQuestionLoader mapping logic
    console.log(`\n🔧 Testing subject mapping logic:`);
    const subject = 'Mathematical Reasoning';
    const normalized = subject.toLowerCase().trim();
    console.log(`📥 Input subject: "${subject}"`);
    console.log(`🔄 Normalized: "${normalized}"`);
    
    if (normalized === 'mathematical reasoning') {
      console.log(`✅ Should map to: "mathematical-reasoning"`);
    } else {
      console.log(`❌ Mapping logic might be broken`);
    }
    
    // Check if both file locations exist
    const locations = [
      '/workspaces/AWSQCLI/testace-app/public/questions/9_hard_mathematical-reasoning.json',
      '/workspaces/AWSQCLI/testace-app/frontend/public/questions/9_hard_mathematical-reasoning.json'
    ];
    
    console.log(`\n📂 Checking both file locations:`);
    locations.forEach(loc => {
      if (fs.existsSync(loc)) {
        const content = fs.readFileSync(loc, 'utf8');
        const questions = JSON.parse(content);
        const hasQuestion = questions.some(q => q._id === testQuestionId);
        console.log(`✅ ${loc} - ${questions.length} questions, has target: ${hasQuestion}`);
      } else {
        console.log(`❌ ${loc} - does not exist`);
      }
    });
    
  } catch (error) {
    console.log(`❌ Error reading/parsing file: ${error.message}`);
  }
} else {
  console.log(`❌ File does not exist: ${filePath}`);
}

console.log(`\n🎯 DEBUGGING COMPLETE`);
console.log(`📝 If question exists but app can't find it, the issue is likely:`);
console.log(`   1. App not using StaticQuestionLoader for this route`);
console.log(`   2. Different file path being used`);
console.log(`   3. Caching issue preventing updates`);
console.log(`   4. TypeScript compilation issue`);
