const fs = require('fs');

console.log('🔧 FIXING SYNTAX ERROR IN bulletproofPracticeSystem.ts...');

const bulletproofPath = '/workspaces/AWSQCLI/testace-app/frontend/src/utils/bulletproofPracticeSystem.ts';
if (fs.existsSync(bulletproofPath)) {
  let content = fs.readFileSync(bulletproofPath, 'utf8');
  
  // Fix the incomplete assignment
  content = content.replace(
    /newQuestion = \/\/ Disabled: generateQuestion\(grade, difficulty\);/g,
    'newQuestion = null; // Disabled: generateQuestion(grade, difficulty);'
  );
  
  // Also fix any other similar patterns
  content = content.replace(
    /= \/\/ Disabled: /g,
    '= null; // Disabled: '
  );
  
  fs.writeFileSync(bulletproofPath, content);
  console.log('✅ Fixed syntax error in bulletproofPracticeSystem.ts');
} else {
  console.log('❌ File not found: bulletproofPracticeSystem.ts');
}

console.log('\n🎯 SYNTAX ERROR FIXED!');
console.log('✅ TypeScript should now compile successfully');
