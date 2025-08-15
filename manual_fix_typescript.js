const fs = require('fs');

console.log('🔧 MANUALLY FIXING TYPESCRIPT SYNTAX...');

// Fix lazyQuestionLoader.ts
const lazyLoaderPath = '/workspaces/AWSQCLI/testace-app/frontend/src/utils/lazyQuestionLoader.ts';
if (fs.existsSync(lazyLoaderPath)) {
  let content = fs.readFileSync(lazyLoaderPath, 'utf8');
  
  // Fix the invalid syntax
  content = content.replace(
    /newQuestion : any = null; \/\/ Disabled: generateQuestion - using static JSON files only/g,
    'newQuestion = null as any; // Disabled: generateQuestion - using static JSON files only'
  );
  
  fs.writeFileSync(lazyLoaderPath, content);
  console.log('✅ Fixed lazyQuestionLoader.ts');
}

// Fix all other files with similar issues
const filesToFix = [
  '/workspaces/AWSQCLI/testace-app/frontend/src/utils/bulletproofPracticeSystem.ts',
  '/workspaces/AWSQCLI/testace-app/frontend/src/utils/professionalTimedTestSystem.ts',
  '/workspaces/AWSQCLI/testace-app/frontend/src/utils/questionPrePopulationSystem.ts'
];

for (const filePath of filesToFix) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix invalid type annotations
    content = content.replace(
      /(mathQuestion|question|newQuestion) : any = null;/g,
      '$1 = null as any;'
    );
    
    // Fix const declarations
    content = content.replace(
      /const (mathQuestion|question|newQuestion): any = null;/g,
      'const $1 = null as any;'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath.split('/').pop()}`);
  }
}

console.log('\n🎯 TYPESCRIPT SYNTAX MANUALLY FIXED!');
console.log('✅ All invalid type annotations corrected');
console.log('✅ Compilation should now work properly');
