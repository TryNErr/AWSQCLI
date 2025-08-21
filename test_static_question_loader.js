const fs = require('fs');
const path = require('path');

// Simulate the static question loader functionality for testing
class TestStaticQuestionLoader {
  
  static async loadQuestions(grade, difficulty, subject) {
    try {
      const filename = `${grade}_${difficulty}_${subject}.json`;
      const filePath = path.join('/workspaces/AWSQCLI/testace-app/frontend/public/questions', filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        return [];
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const questions = JSON.parse(content);
      
      // Validate questions
      const validQuestions = questions.filter(q => 
        q._id && 
        q.content && 
        q.options && 
        q.correctAnswer &&
        q.subject &&
        q.grade &&
        q.difficulty
      );
      
      console.log(`✅ Loaded ${validQuestions.length} questions from ${filename}`);
      return validQuestions;
      
    } catch (error) {
      console.error(`❌ Error loading ${grade}_${difficulty}_${subject}:`, error.message);
      return [];
    }
  }
  
  static async testSpecificCase(grade, difficulty, subject) {
    console.log(`\n🔍 Testing: Grade ${grade}, ${difficulty}, ${subject}`);
    const questions = await this.loadQuestions(grade, difficulty, subject);
    
    if (questions.length > 0) {
      const sample = questions[0];
      console.log(`   📝 Sample question: "${sample.content.substring(0, 60)}..."`);
      console.log(`   🎯 Options: ${sample.options.length} choices`);
      console.log(`   ✅ Answer: ${sample.correctAnswer}`);
      return true;
    } else {
      console.log(`   ❌ No questions found`);
      return false;
    }
  }
}

async function runTests() {
  console.log('🧪 Testing Static Question Loader\n');
  
  // Test the specific case that was failing
  console.log('=== TESTING GRADE 5 HARD MATH (the failing case) ===');
  const success = await TestStaticQuestionLoader.testSpecificCase(5, 'hard', 'math');
  
  if (success) {
    console.log('\n🎉 SUCCESS: Grade 5 hard math questions are available!');
  } else {
    console.log('\n❌ FAILED: Grade 5 hard math questions not found');
  }
  
  // Test a few other cases
  console.log('\n=== TESTING OTHER CASES ===');
  
  const testCases = [
    [5, 'easy', 'math'],
    [5, 'medium', 'math'],
    [5, 'hard', 'english'],
    [3, 'hard', 'math'],
    [1, 'easy', 'english']
  ];
  
  let successCount = 0;
  
  for (const [grade, difficulty, subject] of testCases) {
    const result = await TestStaticQuestionLoader.testSpecificCase(grade, difficulty, subject);
    if (result) successCount++;
  }
  
  console.log(`\n📊 SUMMARY: ${successCount}/${testCases.length + 1} test cases passed`);
  
  // Check file structure
  console.log('\n=== CHECKING FILE STRUCTURE ===');
  const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
  const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'version.json');
  
  console.log(`📁 Found ${files.length} question files`);
  
  // Check for Grade 5 files specifically
  const grade5Files = files.filter(f => f.startsWith('5_'));
  console.log(`📚 Grade 5 files: ${grade5Files.length}`);
  grade5Files.forEach(f => console.log(`   - ${f}`));
  
  // Check if 5_hard_math.json exists and has content
  const targetFile = '5_hard_math.json';
  if (files.includes(targetFile)) {
    const filePath = path.join(questionsDir, targetFile);
    const stats = fs.statSync(filePath);
    console.log(`\n📄 ${targetFile}:`);
    console.log(`   Size: ${stats.size} bytes`);
    console.log(`   Modified: ${stats.mtime}`);
    
    // Check first question
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`   Questions: ${content.length}`);
      if (content.length > 0) {
        console.log(`   First question: "${content[0].content.substring(0, 50)}..."`);
      }
    } catch (error) {
      console.log(`   ❌ Error reading content: ${error.message}`);
    }
  } else {
    console.log(`\n❌ ${targetFile} not found!`);
  }
}

runTests().catch(console.error);
