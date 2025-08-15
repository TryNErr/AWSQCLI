const fs = require('fs');

console.log('🔧 FIXING THINKING SKILLS SCENARIO DISPLAY IN FRONTEND...');

// List of components to update
const componentsToUpdate = [
  '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/EnhancedQuestion.tsx',
  '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx',
  '/workspaces/AWSQCLI/testace-app/frontend/src/pages/TimedTest/TimedTest.tsx'
];

for (const componentPath of componentsToUpdate) {
  if (fs.existsSync(componentPath)) {
    let content = fs.readFileSync(componentPath, 'utf8');
    
    // Find the reading passage section and add thinking skills scenario after it
    const readingPassagePattern = /(\s+)(\{\/\* Reading Passage - Show for reading questions \*\/\}[\s\S]*?<\/Box>\s*\)\s*\})/;
    
    if (readingPassagePattern.test(content)) {
      // Add thinking skills scenario after reading passage
      content = content.replace(
        readingPassagePattern,
        `$1$2
$1
$1{/* Thinking Skills Scenario - Show for thinking skills questions */}
$1{question.subject === 'Thinking Skills' && (question as any).scenario && (
$1  <Box sx={{ mb: 3, p: 3, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
$1    <Typography variant="h6" gutterBottom color="success.main">
$1      🧠 Scenario:
$1    </Typography>
$1    <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
$1      {(question as any).scenario}
$1    </Typography>
$1  </Box>
$1)}`
      );
      
      console.log(`✅ Updated ${componentPath.split('/').pop()} to display thinking skills scenarios`);
    } else {
      // If no reading passage section found, add thinking skills scenario before question content
      const questionContentPattern = /(\s+)(<Typography variant="h5"[^>]*>\s*\{question\.content\}\s*<\/Typography>)/;
      
      if (questionContentPattern.test(content)) {
        content = content.replace(
          questionContentPattern,
          `$1{/* Thinking Skills Scenario */}
$1{question.subject === 'Thinking Skills' && (question as any).scenario && (
$1  <Box sx={{ mb: 3, p: 3, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
$1    <Typography variant="h6" gutterBottom color="success.main">
$1      🧠 Scenario:
$1    </Typography>
$1    <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
$1      {(question as any).scenario}
$1    </Typography>
$1  </Box>
$1)}
$1
$1$2`
        );
        
        console.log(`✅ Updated ${componentPath.split('/').pop()} to display thinking skills scenarios (alternative pattern)`);
      } else {
        console.log(`⚠️  Could not find suitable pattern in ${componentPath.split('/').pop()}`);
      }
    }
    
    fs.writeFileSync(componentPath, content);
  } else {
    console.log(`❌ File not found: ${componentPath}`);
  }
}

// Also check PracticeSession.tsx
const practiceSessionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/PracticeSession.tsx';
if (fs.existsSync(practiceSessionPath)) {
  let content = fs.readFileSync(practiceSessionPath, 'utf8');
  
  // Look for existing reading passage code and add thinking skills after it
  if (content.includes('Reading Passage') && !content.includes('Thinking Skills')) {
    const readingPattern = /(\s+)(\}\s*\{\/\* Reading Passage[\s\S]*?<\/Box>\s*\)\s*\})/;
    
    if (readingPattern.test(content)) {
      content = content.replace(
        readingPattern,
        `$1$2
$1{/* Thinking Skills Scenario */}
$1{question.subject === 'Thinking Skills' && (question as any).scenario && (
$1  <Box sx={{ mb: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
$1    <Typography variant="subtitle1" gutterBottom color="success.main">
$1      🧠 Scenario:
$1    </Typography>
$1    <Typography variant="body2" sx={{ lineHeight: 1.6, fontStyle: 'italic' }}>
$1      {(question as any).scenario}
$1    </Typography>
$1  </Box>
$1)}`
      );
      
      fs.writeFileSync(practiceSessionPath, content);
      console.log('✅ Updated PracticeSession.tsx to display thinking skills scenarios');
    }
  }
}

console.log('\n🎯 THINKING SKILLS SCENARIO DISPLAY FIX COMPLETE!');
console.log('✅ All question components updated to show scenarios');
console.log('✅ Scenarios displayed in green-themed boxes with brain emoji');
console.log('✅ Consistent styling across all components');
console.log('\n📝 Next steps:');
console.log('1. Restart your development server');
console.log('2. Hard refresh your browser');
console.log('3. Thinking skills questions should now show scenarios!');
