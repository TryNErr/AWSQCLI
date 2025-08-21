const fs = require('fs');
const path = require('path');

// Simulate the static question loader logic for Grade 9 hard reading
async function testStaticQuestionLoader() {
  console.log('🔍 Testing Static Question Loader for Grade 9 Hard Reading...\n');
  
  const grade = '9';
  const difficulty = 'hard';
  const subject = 'reading';
  
  // Step 1: Generate the key
  const key = `${grade}_${difficulty}_${subject}`;
  console.log(`📝 Generated key: ${key}`);
  
  // Step 2: Try to load the file
  const filename = `${key}.json`;
  const filePath = path.join('/workspaces/AWSQCLI/testace-app/frontend/public/questions', filename);
  
  console.log(`📁 Looking for file: ${filename}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return [];
  }
  
  try {
    // Step 3: Load and parse the file
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    console.log(`📄 File loaded: ${questions.length} questions found`);
    
    // Step 4: Validate questions (same logic as static loader)
    const validQuestions = questions.filter(q => 
      q._id && 
      q.content && 
      q.options && 
      q.correctAnswer &&
      q.subject &&
      q.grade &&
      q.difficulty
    );
    
    console.log(`✅ Valid questions after filtering: ${validQuestions.length}`);
    
    // Step 5: Apply subject filtering (this is where the issue might be)
    const keyParts = key.split('_');
    const expectedSubject = keyParts[keyParts.length - 1]; // 'reading'
    
    console.log(`🔍 Expected subject from key: "${expectedSubject}"`);
    
    // Subject mapping from the static loader
    const subjectMapping = {
      'math': ['Mathematics', 'math'],
      'english': ['English', 'english'],
      'reading': ['Reading', 'reading'],
      'thinking-skills': ['Thinking Skills', 'thinking-skills'],
      'mathematical-reasoning': ['Mathematical Reasoning', 'mathematical-reasoning']
    };
    
    const expectedQuestionSubjects = subjectMapping[expectedSubject];
    console.log(`🔍 Expected question subjects: ${expectedQuestionSubjects ? expectedQuestionSubjects.join(' or ') : 'NONE'}`);
    
    if (expectedQuestionSubjects) {
      const filtered = validQuestions.filter(q => 
        expectedQuestionSubjects.includes(q.subject) ||
        expectedQuestionSubjects.some(s => s.toLowerCase().replace(/\s+/g, '-') === q.subject.toLowerCase().replace(/\s+/g, '-'))
      );
      
      console.log(`🔍 Subject filter result: ${filtered.length}/${validQuestions.length} questions match`);
      
      if (filtered.length > 0) {
        console.log(`✅ Sample question subject: "${filtered[0].subject}"`);
        console.log(`✅ Sample question content: "${filtered[0].content.substring(0, 60)}..."`);
        return filtered;
      } else {
        console.log(`❌ NO QUESTIONS MATCH SUBJECT FILTER!`);
        console.log(`   Questions have subject: "${validQuestions[0]?.subject}"`);
        console.log(`   Expected subjects: ${expectedQuestionSubjects.join(', ')}`);
        return [];
      }
    }
    
    return validQuestions;
    
  } catch (error) {
    console.log(`❌ Error loading file: ${error.message}`);
    return [];
  }
}

testStaticQuestionLoader().then(result => {
  console.log(`\n📊 FINAL RESULT: ${result.length} questions would be returned`);
  if (result.length === 0) {
    console.log(`❌ This explains why "No questions available" appears!`);
  } else {
    console.log(`✅ Questions should load properly`);
  }
});
