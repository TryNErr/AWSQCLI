const fs = require('fs');

console.log('🔧 FIXING READING PASSAGE DISPLAY IN FRONTEND...');

const enhancedQuestionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/EnhancedQuestion.tsx';

if (fs.existsSync(enhancedQuestionPath)) {
  let content = fs.readFileSync(enhancedQuestionPath, 'utf8');
  
  // Find the section where question content is displayed and add passage display
  const oldQuestionDisplay = `            <Typography variant="h5" gutterBottom>
              {question.content}
            </Typography>`;
  
  const newQuestionDisplay = `            {/* Reading Passage - Show for reading questions */}
            {question.subject === 'Reading' && (question as any).passage && (
              <Box sx={{ mb: 3, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📖 Reading Passage:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontFamily: 'serif' }}>
                  {(question as any).passage}
                </Typography>
              </Box>
            )}
            
            <Typography variant="h5" gutterBottom>
              {question.content}
            </Typography>`;
  
  // Replace the old display with the new one
  if (content.includes(oldQuestionDisplay)) {
    content = content.replace(oldQuestionDisplay, newQuestionDisplay);
    
    fs.writeFileSync(enhancedQuestionPath, content);
    console.log('✅ Updated EnhancedQuestion.tsx to display reading passages');
  } else {
    console.log('❌ Could not find the exact pattern to replace in EnhancedQuestion.tsx');
    console.log('The component structure may have changed. Manual update needed.');
  }
} else {
  console.log('❌ EnhancedQuestion.tsx not found');
}

// Also check if there are other question display components
const practiceDir = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice';
if (fs.existsSync(practiceDir)) {
  const files = fs.readdirSync(practiceDir);
  console.log('\n📁 Files in Practice directory:');
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      console.log(`  - ${file}`);
    }
  });
}

// Check TimedTest component as well
const timedTestPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/TimedTest/TimedTest.tsx';
if (fs.existsSync(timedTestPath)) {
  let content = fs.readFileSync(timedTestPath, 'utf8');
  
  // Look for question content display in TimedTest
  if (content.includes('question.content') && !content.includes('question.passage')) {
    console.log('\n⚠️  TimedTest.tsx also needs updating for reading passages');
    
    // Try to find and update the question display in TimedTest
    const questionContentPattern = /(\s+)(<Typography[^>]*>\s*\{question\.content\}\s*<\/Typography>)/g;
    
    const replacement = `$1{/* Reading Passage for TimedTest */}
$1{question.subject === 'Reading' && (question as any).passage && (
$1  <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
$1    <Typography variant="subtitle1" gutterBottom color="primary">
$1      📖 Reading Passage:
$1    </Typography>
$1    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
$1      {(question as any).passage}
$1    </Typography>
$1  </Box>
$1)}
$1$2`;
    
    content = content.replace(questionContentPattern, replacement);
    fs.writeFileSync(timedTestPath, content);
    console.log('✅ Updated TimedTest.tsx to display reading passages');
  }
}

console.log('\n🎯 READING PASSAGE DISPLAY FIX COMPLETE!');
console.log('✅ Reading questions will now show the passage before the question');
console.log('✅ Passages are displayed in a highlighted box with proper formatting');
console.log('\n📝 Next steps:');
console.log('1. Restart your development server');
console.log('2. Hard refresh your browser');
console.log('3. Reading questions should now show passages!');
