const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE MATHEMATICAL REASONING DIAGNOSTIC...');

const questionId = 'hard9_1755260455350_002';
const grade = '9';
const difficulty = 'hard';
const subject = 'Mathematical Reasoning';

console.log(`\n🎯 Testing Question: ${questionId}`);
console.log(`📊 Parameters: Grade ${grade}, ${difficulty}, ${subject}`);

// Test 1: Check if question exists in files
console.log('\n=== TEST 1: FILE EXISTENCE ===');
const filePaths = [
  '/workspaces/AWSQCLI/testace-app/public/questions/9_hard_mathematical-reasoning.json',
  '/workspaces/AWSQCLI/testace-app/frontend/public/questions/9_hard_mathematical-reasoning.json'
];

filePaths.forEach((filePath, index) => {
  console.log(`\n📁 Location ${index + 1}: ${filePath}`);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const questions = JSON.parse(content);
      const targetQuestion = questions.find(q => q._id === questionId);
      
      console.log(`✅ File exists: ${questions.length} questions`);
      if (targetQuestion) {
        console.log(`✅ Question found: "${targetQuestion.content}"`);
        console.log(`📝 Subject: "${targetQuestion.subject}"`);
        console.log(`📚 Grade: ${targetQuestion.grade}`);
        console.log(`⚡ Difficulty: "${targetQuestion.difficulty}"`);
      } else {
        console.log(`❌ Question ${questionId} NOT found`);
        console.log(`📋 Available IDs (first 3):`);
        questions.slice(0, 3).forEach(q => console.log(`   - ${q._id}`));
      }
    } catch (error) {
      console.log(`❌ Error reading file: ${error.message}`);
    }
  } else {
    console.log(`❌ File does not exist`);
  }
});

// Test 2: Check StaticQuestionLoader mapping
console.log('\n=== TEST 2: STATICQUESTIONLOADER MAPPING ===');
const staticLoaderPath = '/workspaces/AWSQCLI/testace-app/frontend/src/utils/staticQuestionLoader.ts';
if (fs.existsSync(staticLoaderPath)) {
  const content = fs.readFileSync(staticLoaderPath, 'utf8');
  
  // Check if the mapping is correct
  if (content.includes("return 'mathematical-reasoning'")) {
    console.log('✅ StaticQuestionLoader mapping is correct');
  } else if (content.includes("return 'math'")) {
    console.log('❌ StaticQuestionLoader still maps to "math"');
  } else {
    console.log('⚠️  Could not determine StaticQuestionLoader mapping');
  }
  
  // Check the exact mapping logic
  const lines = content.split('\n');
  const mathReasoningLines = lines.filter(line => 
    line.includes('mathematical reasoning') || 
    line.includes('Mathematical Reasoning')
  );
  
  console.log('📋 Mathematical Reasoning mapping lines:');
  mathReasoningLines.forEach(line => console.log(`   ${line.trim()}`));
} else {
  console.log('❌ StaticQuestionLoader file not found');
}

// Test 3: Check Question component mapping
console.log('\n=== TEST 3: QUESTION COMPONENT MAPPING ===');
const questionComponentPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx';
if (fs.existsSync(questionComponentPath)) {
  const content = fs.readFileSync(questionComponentPath, 'utf8');
  
  // Check subject mappings
  if (content.includes("'Mathematical Reasoning': ['Mathematical Reasoning']")) {
    console.log('✅ Question component has separate Mathematical Reasoning mapping');
  } else if (content.includes("'Mathematical Reasoning'")) {
    console.log('⚠️  Question component mentions Mathematical Reasoning but mapping unclear');
  } else {
    console.log('❌ Question component has no Mathematical Reasoning mapping');
  }
  
  // Check dynamic generation
  if (content.includes('Mathematical Reasoning uses static files only')) {
    console.log('✅ Dynamic generation disabled for Mathematical Reasoning');
  } else if (content.includes('generateMathematicalReasoningQuestions')) {
    console.log('❌ Dynamic generation still enabled for Mathematical Reasoning');
  } else {
    console.log('⚠️  Could not determine dynamic generation status');
  }
} else {
  console.log('❌ Question component file not found');
}

// Test 4: Check if there are any build/compilation issues
console.log('\n=== TEST 4: BUILD STATUS ===');
const packageJsonPath = '/workspaces/AWSQCLI/testace-app/frontend/package.json';
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ Frontend package.json exists');
  
  // Check if node_modules exists (dependencies installed)
  const nodeModulesPath = '/workspaces/AWSQCLI/testace-app/frontend/node_modules';
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ Node modules installed');
  } else {
    console.log('❌ Node modules not installed - run npm install');
  }
} else {
  console.log('❌ Frontend package.json not found');
}

// Test 5: Check routing configuration
console.log('\n=== TEST 5: ROUTING CONFIGURATION ===');
const appPath = '/workspaces/AWSQCLI/testace-app/frontend/src/App.tsx';
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  if (content.includes('/practice/question/:id')) {
    console.log('✅ Route /practice/question/:id exists');
    
    // Check which component it routes to
    if (content.includes('<Question />')) {
      console.log('✅ Routes to Question component');
    } else if (content.includes('<EnhancedQuestion />')) {
      console.log('⚠️  Routes to EnhancedQuestion component');
    } else {
      console.log('❌ Could not determine which component handles the route');
    }
  } else {
    console.log('❌ Route /practice/question/:id not found');
  }
} else {
  console.log('❌ App.tsx not found');
}

// Test 6: Simulate the StaticQuestionLoader logic
console.log('\n=== TEST 6: SIMULATE STATICQUESTIONLOADER ===');
const normalizedSubject = subject.toLowerCase().trim();
console.log(`📥 Input subject: "${subject}"`);
console.log(`🔄 Normalized: "${normalizedSubject}"`);

let expectedMapping = '';
if (normalizedSubject === 'mathematical reasoning') {
  expectedMapping = 'mathematical-reasoning';
  console.log(`✅ Should map to: "${expectedMapping}"`);
} else {
  console.log(`❌ Normalization logic might be broken`);
}

const expectedKey = `${grade}_${difficulty}_${expectedMapping}`;
const expectedFilename = `${expectedKey}.json`;
console.log(`🔑 Expected key: "${expectedKey}"`);
console.log(`📄 Expected filename: "${expectedFilename}"`);

// Check if the expected file exists
const expectedPath = `/workspaces/AWSQCLI/testace-app/frontend/public/questions/${expectedFilename}`;
if (fs.existsSync(expectedPath)) {
  console.log(`✅ Expected file exists: ${expectedPath}`);
} else {
  console.log(`❌ Expected file missing: ${expectedPath}`);
}

console.log('\n🎯 DIAGNOSTIC COMPLETE');
console.log('\n📝 SUMMARY:');
console.log('If all tests pass but the question still doesn\'t load, the issue might be:');
console.log('1. Browser cache not cleared properly');
console.log('2. Development server not restarted');
console.log('3. TypeScript compilation cache issue');
console.log('4. React component state/cache issue');
console.log('5. Network/fetch request issue');
console.log('\n💡 Try: Stop server, delete node_modules/.cache, restart server, hard refresh browser');
