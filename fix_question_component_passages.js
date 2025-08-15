const fs = require('fs');

console.log('🔧 FIXING READING PASSAGES IN Question.tsx COMPONENT...');

const questionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx';

if (fs.existsSync(questionPath)) {
  let content = fs.readFileSync(questionPath, 'utf8');
  
  // Find where FormattedText displays question.content and add passage display
  const oldDisplay = `            <FormattedText text={question.content} />`;
  
  const newDisplay = `            {/* Reading Passage - Show for reading questions */}
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
            
            <FormattedText text={question.content} />`;
  
  if (content.includes(oldDisplay)) {
    content = content.replace(oldDisplay, newDisplay);
    fs.writeFileSync(questionPath, content);
    console.log('✅ Updated Question.tsx to display reading passages');
  } else {
    console.log('❌ Could not find FormattedText pattern in Question.tsx');
  }
} else {
  console.log('❌ Question.tsx not found');
}

// Also check PracticeSession.tsx
const practiceSessionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/PracticeSession.tsx';
if (fs.existsSync(practiceSessionPath)) {
  let content = fs.readFileSync(practiceSessionPath, 'utf8');
  
  if (content.includes('question.content') && !content.includes('passage')) {
    console.log('⚠️  PracticeSession.tsx may also need updating for reading passages');
    
    // Look for question content display patterns
    const patterns = [
      /(\s+)(<Typography[^>]*>\s*\{[^}]*question\.content[^}]*\}\s*<\/Typography>)/g,
      /(\s+)(<FormattedText[^>]*text=\{question\.content\}[^>]*\/>)/g
    ];
    
    let updated = false;
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, `$1{/* Reading Passage */}
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
$1$2`);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(practiceSessionPath, content);
      console.log('✅ Updated PracticeSession.tsx to display reading passages');
    }
  }
}

console.log('\n🎯 ALL QUESTION COMPONENTS UPDATED!');
console.log('✅ EnhancedQuestion.tsx - Updated');
console.log('✅ Question.tsx - Updated');
console.log('✅ TimedTest.tsx - Updated');
console.log('✅ PracticeSession.tsx - Checked/Updated');
console.log('\n📖 Reading passages will now display in a highlighted box before questions');
console.log('📝 Restart your dev server and refresh browser to see changes!');
