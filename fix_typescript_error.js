/**
 * Quick Fix for TypeScript Compilation Error
 * 
 * Fix: TS7034: Variable 'grade' implicitly has type 'any'
 */

const fs = require('fs');
const path = require('path');

const questionComponentPath = path.join(__dirname, 'testace-app/frontend/src/pages/Practice/Question.tsx');

console.log('🔧 Fixing TypeScript compilation error...');

// Read the current Question component
let questionComponent = fs.readFileSync(questionComponentPath, 'utf8');

// Fix the variable declarations with explicit types
const oldDeclaration = 'let grade, difficulty, subject;';
const newDeclaration = 'let grade: string, difficulty: string, subject: string;';

if (questionComponent.includes(oldDeclaration)) {
  questionComponent = questionComponent.replace(oldDeclaration, newDeclaration);
  console.log('✅ Fixed TypeScript variable declarations');
} else {
  console.log('❌ Could not find the variable declaration to fix');
  process.exit(1);
}

// Write the fixed component back
fs.writeFileSync(questionComponentPath, questionComponent);

console.log('✅ TypeScript error fixed!');
console.log('');
console.log('🚀 The build should now pass. You can:');
console.log('1. Commit this fix to stop the build failure');
console.log('2. Or revert all changes if you prefer');
