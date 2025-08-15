const fs = require('fs');

console.log('🔧 FIXING STATICQUESTIONLOADER TO HANDLE MATHEMATICAL REASONING...');

const staticQuestionLoaderPath = '/workspaces/AWSQCLI/testace-app/frontend/src/utils/staticQuestionLoader.ts';

if (fs.existsSync(staticQuestionLoaderPath)) {
  let content = fs.readFileSync(staticQuestionLoaderPath, 'utf8');
  
  // Fix the normalizeSubject function to properly map Mathematical Reasoning
  const oldMapping = `    if (normalized === 'mathematical reasoning') {
      return 'math'; // Mathematical reasoning uses math files
    }`;
  
  const newMapping = `    if (normalized === 'mathematical reasoning') {
      return 'mathematical-reasoning'; // Mathematical reasoning has its own files
    }`;
  
  if (content.includes(oldMapping)) {
    content = content.replace(oldMapping, newMapping);
    
    // Also fix the partial match section
    const oldPartialMatch = `    if (normalized.includes('mathematical') && normalized.includes('reasoning')) {
      return 'math';
    }`;
    
    const newPartialMatch = `    if (normalized.includes('mathematical') && normalized.includes('reasoning')) {
      return 'mathematical-reasoning';
    }`;
    
    if (content.includes(oldPartialMatch)) {
      content = content.replace(oldPartialMatch, newPartialMatch);
    }
    
    fs.writeFileSync(staticQuestionLoaderPath, content);
    console.log('✅ Updated StaticQuestionLoader to properly map Mathematical Reasoning');
  } else {
    console.log('❌ Could not find the exact mapping pattern to replace');
  }
} else {
  console.log('❌ StaticQuestionLoader file not found');
}

console.log('\n🎯 STATICQUESTIONLOADER FIX COMPLETE!');
console.log('✅ Mathematical Reasoning now maps to "mathematical-reasoning" files');
console.log('✅ This should resolve the question loading issue');
console.log('\n📝 The app should now load Mathematical Reasoning questions from static files!');
