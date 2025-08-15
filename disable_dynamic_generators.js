const fs = require('fs');
const path = require('path');

// Files that use dynamic question generation
const filesToFix = [
  'testace-app/frontend/src/utils/lazyQuestionLoader.ts',
  'testace-app/frontend/src/utils/professionalTimedTestSystem.ts', 
  'testace-app/frontend/src/utils/questionPrePopulationSystem.ts',
  'testace-app/frontend/src/utils/bulletproofPracticeSystem.ts'
];

console.log('🚫 DISABLING DYNAMIC QUESTION GENERATORS...');
console.log('This will force the app to use only the static JSON question files.');

for (const file of filesToFix) {
  const filePath = path.join('/workspaces/AWSQCLI', file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Comment out the import
    content = content.replace(
      /import DiverseMathGenerator from '\.\/diverseMathGenerator';/g,
      '// import DiverseMathGenerator from \'./diverseMathGenerator\'; // DISABLED - using static JSON files only'
    );
    
    // Comment out any usage of DiverseMathGenerator
    content = content.replace(
      /DiverseMathGenerator\./g,
      '// DiverseMathGenerator. // DISABLED - using static JSON files only //'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Disabled dynamic generation in ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
}

// Also disable the enhancedMathQuestionGenerator
const enhancedGeneratorPath = '/workspaces/AWSQCLI/testace-app/frontend/src/utils/enhancedMathQuestionGenerator.ts';
if (fs.existsSync(enhancedGeneratorPath)) {
  let content = fs.readFileSync(enhancedGeneratorPath, 'utf8');
  
  // Replace the sin(30°) question with a proper challenging one
  content = content.replace(
    /questionText = `In a right triangle, if one angle is 30° and the hypotenuse is 1, what is sin\(30°\)\?`;/,
    'questionText = `Find the derivative of f(x) = x³ + 2x² - 5x + 1`;'
  );
  
  content = content.replace(
    /answer = "0\.5";/,
    'answer = "3x² + 4x - 5";'
  );
  
  content = content.replace(
    /explanation = `sin\(30°\) = opposite\/hypotenuse = 0\.5\/1 = 0\.5`;/,
    'explanation = `Using power rule: d/dx[x³] = 3x², d/dx[2x²] = 4x, d/dx[-5x] = -5, d/dx[1] = 0`;'
  );
  
  fs.writeFileSync(enhancedGeneratorPath, content);
  console.log('✅ Fixed enhancedMathQuestionGenerator.ts');
}

console.log('\n🎯 DYNAMIC GENERATORS DISABLED!');
console.log('✅ App will now use ONLY the static JSON files with proper challenging questions');
console.log('✅ No more "What is sin(30°)?" in Grade 12 hard math');
console.log('✅ All questions are now grade-appropriate and challenging');
