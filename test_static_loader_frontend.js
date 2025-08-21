// Simulate the frontend StaticQuestionLoader call
const fs = require('fs');
const path = require('path');

// Simulate the StaticQuestionLoader.getQuestions call
async function testStaticQuestionLoader(grade, difficulty, subject, count = 20) {
  console.log(`🔍 Testing StaticQuestionLoader.getQuestions("${grade}", "${difficulty}", "${subject}", ${count})`);
  
  // This simulates what the frontend loader does
  const normalizedSubject = normalizeSubject(subject || 'math');
  const key = getKey(grade, difficulty, normalizedSubject);
  
  console.log(`📝 Generated key: ${key}`);
  
  // Try to load the file
  const filename = `${key}.json`;
  const filePath = path.join('/workspaces/AWSQCLI/testace-app/frontend/public/questions', filename);
  
  console.log(`📁 Looking for file: ${filename}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    console.log(`📄 File loaded: ${questions.length} questions found`);
    
    // Apply subject filtering like the frontend does
    const keyParts = key.split('_');
    const expectedSubject = keyParts[keyParts.length - 1];
    
    const subjectMapping = {
      'math': ['Mathematics', 'math'],
      'english': ['English', 'english'],
      'reading': ['Reading', 'reading'],
      'thinking-skills': ['Thinking Skills', 'thinking-skills'],
      'mathematical-reasoning': ['Mathematical Reasoning', 'mathematical-reasoning']
    };
    
    const expectedQuestionSubjects = subjectMapping[expectedSubject];
    if (expectedQuestionSubjects) {
      const filtered = questions.filter(q => 
        expectedQuestionSubjects.includes(q.subject) ||
        expectedQuestionSubjects.some(s => s.toLowerCase().replace(/\s+/g, '-') === q.subject.toLowerCase().replace(/\s+/g, '-'))
      );
      console.log(`🔍 Subject filter: ${filtered.length}/${questions.length} questions match subjects ${expectedQuestionSubjects.join(' or ')}`);
      
      if (filtered.length > 0) {
        console.log(`✅ Sample question: "${filtered[0].content.substring(0, 60)}..."`);
        console.log(`   Subject: "${filtered[0].subject}"`);
        console.log(`   Grade: ${filtered[0].grade}`);
        console.log(`   Difficulty: "${filtered[0].difficulty}"`);
      }
      
      return filtered.slice(0, count);
    }
    
    return questions.slice(0, count);
    
  } catch (error) {
    console.log(`❌ Error loading file: ${error.message}`);
    return [];
  }
}

// Helper functions that match the frontend
function normalizeSubject(subject) {
  if (!subject) return 'math';
  
  const normalized = subject.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const subjectMap = {
    'mathematics': 'math',
    'maths': 'math',
    'language': 'english',
    'language-arts': 'english',
    'comprehension': 'reading',
    'reading-comprehension': 'reading',
    'critical-thinking': 'thinking-skills',
    'logic': 'thinking-skills',
    'reasoning': 'mathematical-reasoning',
    'math-reasoning': 'mathematical-reasoning'
  };
  
  return subjectMap[normalized] || normalized;
}

function getKey(grade, difficulty, subject) {
  return `${grade}_${difficulty}_${subject}`;
}

// Run the test
async function runTest() {
  console.log('🧪 Testing Frontend StaticQuestionLoader Logic\n');
  
  // Test the exact case that's failing
  console.log('=== TESTING GRADE 5 HARD MATH ===');
  const result = await testStaticQuestionLoader('5', 'hard', 'math', 20);
  
  if (result.length > 0) {
    console.log(`\n🎉 SUCCESS: Found ${result.length} questions!`);
    console.log('✅ The StaticQuestionLoader should work correctly');
  } else {
    console.log('\n❌ FAILED: No questions found');
    console.log('❌ There may be an issue with the loader logic');
  }
  
  // Test a few other cases
  console.log('\n=== TESTING OTHER CASES ===');
  const testCases = [
    ['5', 'easy', 'math'],
    ['5', 'medium', 'math'],
    ['5', 'hard', 'english']
  ];
  
  for (const [grade, difficulty, subject] of testCases) {
    console.log(`\n--- Testing Grade ${grade} ${difficulty} ${subject} ---`);
    const questions = await testStaticQuestionLoader(grade, difficulty, subject, 5);
    console.log(`Result: ${questions.length} questions`);
  }
}

runTest().catch(console.error);
