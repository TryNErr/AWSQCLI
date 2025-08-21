const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Get all hard math files
const hardMathFiles = fs.readdirSync(questionsDir)
  .filter(f => f.includes('_hard_math.json'))
  .sort();

console.log('🔍 Checking field names in hard math files...\n');

const issues = [];

hardMathFiles.forEach(filename => {
  try {
    const filePath = path.join(questionsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    if (questions.length === 0) {
      console.log(`⚠️  ${filename}: No questions found`);
      return;
    }
    
    const firstQuestion = questions[0];
    const fileIssues = [];
    
    // Check field names
    if (firstQuestion.correct_answer && !firstQuestion.correctAnswer) {
      fileIssues.push('Uses correct_answer instead of correctAnswer');
    }
    
    if (firstQuestion.subject === 'Mathematics' || firstQuestion.subject === 'Math') {
      fileIssues.push(`Subject is "${firstQuestion.subject}" instead of "math"`);
    }
    
    if (typeof firstQuestion.grade === 'number') {
      fileIssues.push(`Grade is number (${firstQuestion.grade}) instead of string`);
    }
    
    if (fileIssues.length > 0) {
      console.log(`❌ ${filename}:`);
      fileIssues.forEach(issue => console.log(`   - ${issue}`));
      issues.push({ filename, issues: fileIssues });
    } else {
      console.log(`✅ ${filename}: All fields correct`);
    }
    
  } catch (error) {
    console.log(`❌ ${filename}: Error reading file - ${error.message}`);
  }
});

console.log(`\n📊 SUMMARY:`);
console.log(`✅ Files with correct fields: ${hardMathFiles.length - issues.length}`);
console.log(`❌ Files with issues: ${issues.length}`);

if (issues.length > 0) {
  console.log(`\n🔧 Files that need fixing:`);
  issues.forEach(item => {
    console.log(`   ${item.filename}`);
  });
}
