/**
 * Test script for Australian Test Generator
 * Run with: node test-australian-generator.js
 */

const fs = require('fs');
const path = require('path');

// Load the questions data
const questionsPath = path.join(__dirname, 'combined_json_output.json');
let allQuestions = [];

try {
  let data = fs.readFileSync(questionsPath, 'utf-8');
  // Remove BOM if present
  if (data.charCodeAt(0) === 0xFEFF) {
    data = data.slice(1);
  }
  allQuestions = JSON.parse(data);
  console.log(`✅ Loaded ${allQuestions.length} questions from combined_json_output.json`);
} catch (error) {
  console.error('❌ Error loading questions:', error.message);
  process.exit(1);
}

// Test configuration
const AUSTRALIAN_TEST_FORMATS = {
  'opportunity-class': {
    name: 'Opportunity Class Test',
    totalQuestions: 40,
    timeLimit: 165,
    description: 'For gifted students in Years 4-5',
    sections: [
      {
        name: 'Thinking Skills',
        subject: 'thinking-skills',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      },
      {
        name: 'Reading',
        subject: 'reading',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      },
      {
        name: 'Mathematics',
        subject: 'math',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      },
      {
        name: 'English',
        subject: 'english',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      }
    ]
  },
  'selective-school': {
    name: 'Selective School Test',
    totalQuestions: 50,
    timeLimit: 180,
    description: 'For entry into selective high schools',
    sections: [
      {
        name: 'Thinking Skills',
        subject: 'thinking-skills',
        questionCount: 13,
        difficultyDistribution: { easy: 3, medium: 6, hard: 4 }
      },
      {
        name: 'Reading',
        subject: 'reading',
        questionCount: 12,
        difficultyDistribution: { easy: 3, medium: 6, hard: 3 }
      },
      {
        name: 'Mathematics',
        subject: 'math',
        questionCount: 13,
        difficultyDistribution: { easy: 3, medium: 6, hard: 4 }
      },
      {
        name: 'English',
        subject: 'english',
        questionCount: 12,
        difficultyDistribution: { easy: 3, medium: 6, hard: 3 }
      }
    ]
  }
};

// Helper functions
function mapSubjectToSection(subject) {
  if (!subject || typeof subject !== 'string') return '';
  const mapping = {
    'thinking_skills': 'thinking-skills',
    'thinking-skills': 'thinking-skills',
    'mathematical-reasoning': 'thinking-skills',
    'reading': 'reading',
    'math': 'math',
    'mathematics': 'math',
    'english': 'english'
  };
  return mapping[subject.toLowerCase()] || subject.toLowerCase();
}

function getQuestionsByGradeAndSubject(grade, subject) {
  return allQuestions.filter(q => {
    const questionGrade = String(q.grade || '').toLowerCase();
    const targetGrade = grade.toLowerCase();
    const questionSubject = mapSubjectToSection(q.subject);
    
    return questionGrade === targetGrade && questionSubject === subject;
  });
}

function analyzeQuestionAvailability() {
  console.log('\n📊 Question Availability Analysis');
  console.log('='.repeat(50));
  
  const grades = ['4', '5', '6', '7', '8', '9', '10'];
  const subjects = ['thinking-skills', 'reading', 'math', 'english'];
  
  grades.forEach(grade => {
    console.log(`\n📚 Year ${grade}:`);
    let totalForGrade = 0;
    
    subjects.forEach(subject => {
      const questions = getQuestionsByGradeAndSubject(grade, subject);
      const byDifficulty = {
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length
      };
      
      console.log(`  ${subject.padEnd(15)}: ${questions.length.toString().padStart(3)} total (Easy: ${byDifficulty.easy}, Medium: ${byDifficulty.medium}, Hard: ${byDifficulty.hard})`);
      totalForGrade += questions.length;
    });
    
    console.log(`  ${'TOTAL'.padEnd(15)}: ${totalForGrade.toString().padStart(3)} questions`);
  });
}

function testFormatGeneration(formatName, grade) {
  console.log(`\n🧪 Testing ${formatName} for Year ${grade}`);
  console.log('-'.repeat(40));
  
  const format = AUSTRALIAN_TEST_FORMATS[formatName];
  if (!format) {
    console.log('❌ Unknown format');
    return false;
  }
  
  let canGenerate = true;
  let totalSelected = 0;
  
  format.sections.forEach(section => {
    const available = getQuestionsByGradeAndSubject(grade, section.subject);
    const byDifficulty = {
      easy: available.filter(q => q.difficulty === 'easy').length,
      medium: available.filter(q => q.difficulty === 'medium').length,
      hard: available.filter(q => q.difficulty === 'hard').length
    };
    
    const needed = section.difficultyDistribution;
    const hasEnough = byDifficulty.easy >= needed.easy && 
                     byDifficulty.medium >= needed.medium && 
                     byDifficulty.hard >= needed.hard;
    
    console.log(`${section.name}:`);
    console.log(`  Available: ${available.length} (E:${byDifficulty.easy}, M:${byDifficulty.medium}, H:${byDifficulty.hard})`);
    console.log(`  Needed:    ${section.questionCount} (E:${needed.easy}, M:${needed.medium}, H:${needed.hard})`);
    console.log(`  Status:    ${hasEnough ? '✅ Sufficient' : '❌ Insufficient'}`);
    
    if (!hasEnough) canGenerate = false;
    totalSelected += section.questionCount;
  });
  
  console.log(`\nTotal questions needed: ${format.totalQuestions}`);
  console.log(`Can generate test: ${canGenerate ? '✅ YES' : '❌ NO'}`);
  
  return canGenerate;
}

function runTests() {
  console.log('🚀 Australian Test Generator Analysis');
  console.log('='.repeat(50));
  
  // Analyze question availability
  analyzeQuestionAvailability();
  
  // Test format generation for different grades
  console.log('\n🎯 Test Generation Validation');
  console.log('='.repeat(50));
  
  const testCases = [
    { format: 'opportunity-class', grade: '4' },
    { format: 'opportunity-class', grade: '5' },
    { format: 'selective-school', grade: '6' },
    { format: 'selective-school', grade: '7' },
    { format: 'selective-school', grade: '8' },
    { format: 'selective-school', grade: '9' },
    { format: 'selective-school', grade: '10' }
  ];
  
  let successCount = 0;
  testCases.forEach(testCase => {
    if (testFormatGeneration(testCase.format, testCase.grade)) {
      successCount++;
    }
  });
  
  console.log('\n📈 Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successful test generations: ${successCount}/${testCases.length}`);
  console.log(`📊 Success rate: ${Math.round((successCount / testCases.length) * 100)}%`);
  
  if (successCount === testCases.length) {
    console.log('🎉 All test formats can be generated successfully!');
  } else {
    console.log('⚠️  Some test formats need more questions to be fully supported.');
  }
}

// Run the tests
runTests();
