const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Get all question files
const allFiles = fs.readdirSync(questionsDir)
  .filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'version.json')
  .sort();

console.log(`🔧 Fixing field names in ${allFiles.length} question files...\n`);

let fixedCount = 0;
let totalIssuesFixed = 0;

// Subject mapping for normalization
const subjectMapping = {
  'Mathematics': 'math',
  'Math': 'math', 
  'English': 'english',
  'Reading': 'reading',
  'Thinking Skills': 'thinking-skills',
  'Mathematical Reasoning': 'mathematical-reasoning'
};

allFiles.forEach((filename, index) => {
  try {
    const filePath = path.join(questionsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    if (questions.length === 0) {
      return;
    }
    
    console.log(`📝 Processing ${filename} (${index + 1}/${allFiles.length})...`);
    
    let fileIssuesFixed = 0;
    
    // Fix each question
    const fixedQuestions = questions.map(q => {
      const fixed = { ...q };
      let questionIssuesFixed = 0;
      
      // Fix correctAnswer field name
      if (q.correct_answer && !q.correctAnswer) {
        fixed.correctAnswer = q.correct_answer;
        delete fixed.correct_answer;
        questionIssuesFixed++;
      }
      
      // Fix subject field
      if (q.subject && subjectMapping[q.subject]) {
        fixed.subject = subjectMapping[q.subject];
        questionIssuesFixed++;
      }
      
      // Fix grade field (convert number to string)
      if (typeof q.grade === 'number') {
        fixed.grade = q.grade.toString();
        questionIssuesFixed++;
      }
      
      if (questionIssuesFixed > 0) {
        fileIssuesFixed += questionIssuesFixed;
      }
      
      return fixed;
    });
    
    // Only write if there were changes
    if (fileIssuesFixed > 0) {
      fs.writeFileSync(filePath, JSON.stringify(fixedQuestions, null, 2));
      console.log(`   ✅ Fixed ${fileIssuesFixed} field issues in ${fixedQuestions.length} questions`);
      fixedCount++;
      totalIssuesFixed += fileIssuesFixed;
    } else {
      console.log(`   ✅ No issues found`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error processing ${filename}: ${error.message}`);
  }
});

console.log(`\n🎉 COMPLETED:`);
console.log(`   Files processed: ${allFiles.length}`);
console.log(`   Files with fixes: ${fixedCount}`);
console.log(`   Total field issues fixed: ${totalIssuesFixed}`);
console.log(`\n📊 All question files should now have correct field names!`);
console.log(`🚀 Try loading Grade 9 Hard Math again - it should work now!`);
