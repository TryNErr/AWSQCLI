const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Get all question files
const allFiles = fs.readdirSync(questionsDir)
  .filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'version.json')
  .sort();

console.log(`🔍 Checking field names in ${allFiles.length} question files...\n`);

const issues = [];
let checkedCount = 0;

allFiles.forEach(filename => {
  try {
    const filePath = path.join(questionsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    if (questions.length === 0) {
      return;
    }
    
    const firstQuestion = questions[0];
    const fileIssues = [];
    
    // Check field names
    if (firstQuestion.correct_answer && !firstQuestion.correctAnswer) {
      fileIssues.push('Uses correct_answer instead of correctAnswer');
    }
    
    if (firstQuestion.subject && (
      firstQuestion.subject === 'Mathematics' || 
      firstQuestion.subject === 'Math' ||
      firstQuestion.subject === 'English' ||
      firstQuestion.subject === 'Reading' ||
      firstQuestion.subject === 'Thinking Skills' ||
      firstQuestion.subject === 'Mathematical Reasoning'
    )) {
      const expectedSubject = firstQuestion.subject.toLowerCase().replace(/\s+/g, '-');
      if (firstQuestion.subject !== expectedSubject) {
        fileIssues.push(`Subject is "${firstQuestion.subject}" instead of "${expectedSubject}"`);
      }
    }
    
    if (typeof firstQuestion.grade === 'number') {
      fileIssues.push(`Grade is number (${firstQuestion.grade}) instead of string`);
    }
    
    if (fileIssues.length > 0) {
      issues.push({ filename, issues: fileIssues });
    }
    
    checkedCount++;
    
  } catch (error) {
    console.log(`❌ ${filename}: Error reading file - ${error.message}`);
  }
});

console.log(`📊 SUMMARY:`);
console.log(`✅ Files checked: ${checkedCount}`);
console.log(`✅ Files with correct fields: ${checkedCount - issues.length}`);
console.log(`❌ Files with issues: ${issues.length}`);

if (issues.length > 0) {
  console.log(`\n🔧 Files that need fixing:`);
  issues.forEach(item => {
    console.log(`\n📄 ${item.filename}:`);
    item.issues.forEach(issue => console.log(`   - ${issue}`));
  });
  
  // Group by issue type
  const subjectIssues = issues.filter(item => 
    item.issues.some(issue => issue.includes('Subject is'))
  );
  const gradeIssues = issues.filter(item => 
    item.issues.some(issue => issue.includes('Grade is number'))
  );
  const correctAnswerIssues = issues.filter(item => 
    item.issues.some(issue => issue.includes('correct_answer'))
  );
  
  console.log(`\n📈 ISSUE BREAKDOWN:`);
  console.log(`   Subject field issues: ${subjectIssues.length} files`);
  console.log(`   Grade field issues: ${gradeIssues.length} files`);
  console.log(`   correctAnswer field issues: ${correctAnswerIssues.length} files`);
} else {
  console.log(`\n🎉 All files have correct field names!`);
}
