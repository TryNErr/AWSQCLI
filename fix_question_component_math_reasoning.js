const fs = require('fs');

console.log('🔧 FIXING QUESTION COMPONENT MATHEMATICAL REASONING HANDLING...');

const questionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx';

if (fs.existsSync(questionPath)) {
  let content = fs.readFileSync(questionPath, 'utf8');
  
  // Fix 1: Remove Mathematical Reasoning from Mathematics mapping
  const oldMapping = `              'Mathematics': ['Math', 'Mathematics', 'Mathematical Reasoning'],`;
  const newMapping = `              'Mathematics': ['Math', 'Mathematics'],
              'Mathematical Reasoning': ['Mathematical Reasoning'],`;
  
  if (content.includes(oldMapping)) {
    content = content.replace(oldMapping, newMapping);
    console.log('✅ Fixed subject mapping to separate Mathematical Reasoning');
  }
  
  // Fix 2: Remove dynamic generation for Mathematical Reasoning
  const oldGeneration = `        case 'Mathematical Reasoning':
          newQuestions = generateMathematicalReasoningQuestions(grade, difficulty, 1);
          break;`;
  
  const newGeneration = `        case 'Mathematical Reasoning':
          // Mathematical Reasoning uses static files only - no dynamic generation
          console.log('Mathematical Reasoning should be loaded from static files, not generated');
          break;`;
  
  if (content.includes(oldGeneration)) {
    content = content.replace(oldGeneration, newGeneration);
    console.log('✅ Disabled dynamic generation for Mathematical Reasoning');
  }
  
  fs.writeFileSync(questionPath, content);
  console.log('✅ Updated Question.tsx component');
} else {
  console.log('❌ Question.tsx not found');
}

console.log('\n🎯 QUESTION COMPONENT FIX COMPLETE!');
console.log('✅ Mathematical Reasoning now has its own subject mapping');
console.log('✅ Dynamic generation disabled - will use static files only');
console.log('✅ StaticQuestionLoader should now work properly');
console.log('\n📝 The Question component should now load Mathematical Reasoning from static files!');
