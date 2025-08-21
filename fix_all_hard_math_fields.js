const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Files that need fixing (excluding 5 and 9 which are already correct)
const filesToFix = [
  '10_hard_math.json',
  '11_hard_math.json', 
  '12_hard_math.json',
  '1_hard_math.json',
  '2_hard_math.json',
  '3_hard_math.json',
  '4_hard_math.json',
  '6_hard_math.json',
  '7_hard_math.json',
  '8_hard_math.json'
];

console.log('🔧 Fixing field names in hard math files...\n');

let fixedCount = 0;

filesToFix.forEach(filename => {
  try {
    const filePath = path.join(questionsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    console.log(`📝 Fixing ${filename}...`);
    
    // Fix each question
    const fixedQuestions = questions.map(q => {
      const fixed = { ...q };
      
      // Fix correctAnswer field name
      if (q.correct_answer && !q.correctAnswer) {
        fixed.correctAnswer = q.correct_answer;
        delete fixed.correct_answer;
      }
      
      // Fix subject field
      if (q.subject === 'Mathematics' || q.subject === 'Math') {
        fixed.subject = 'math';
      }
      
      // Fix grade field (convert number to string)
      if (typeof q.grade === 'number') {
        fixed.grade = q.grade.toString();
      }
      
      return fixed;
    });
    
    // Write the fixed file
    fs.writeFileSync(filePath, JSON.stringify(fixedQuestions, null, 2));
    console.log(`   ✅ Fixed ${fixedQuestions.length} questions`);
    fixedCount++;
    
  } catch (error) {
    console.log(`   ❌ Error fixing ${filename}: ${error.message}`);
  }
});

console.log(`\n🎉 COMPLETED: Fixed ${fixedCount}/${filesToFix.length} files`);
console.log('📊 All hard math files should now have correct field names!');
