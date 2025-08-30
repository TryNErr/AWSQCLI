const fs = require('fs');
const path = require('path');

const topicsByGradeAndContent = {
  // Grade 1-3: Basic topics
  'addition': 'Addition',
  'subtraction': 'Subtraction', 
  'multiplication': 'Multiplication',
  'division': 'Division',
  'counting': 'Counting',
  'shapes': 'Shapes',
  'time': 'Time',
  'money': 'Money',
  
  // Grade 4-6: Intermediate topics
  'fractions': 'Fractions',
  'decimals': 'Decimals',
  'percentages': 'Percentages',
  'area': 'Geometry - Area',
  'perimeter': 'Geometry - Perimeter',
  'volume': 'Geometry - Volume',
  'statistics': 'Statistics',
  
  // Grade 7-9: Advanced topics
  'algebra': 'Algebra',
  'linear equations': 'Linear Equations',
  'quadratics': 'Quadratic Equations',
  'coordinate geometry': 'Coordinate Geometry',
  'factoring': 'Factoring',
  'systems': 'Systems of Equations',
  'inequalities': 'Inequalities',
  'functions': 'Functions',
  
  // Grade 10-12: High school topics
  'trigonometry': 'Trigonometry',
  'logarithms': 'Logarithms',
  'calculus': 'Calculus',
  'derivatives': 'Calculus - Derivatives',
  'integrals': 'Calculus - Integrals',
  'limits': 'Calculus - Limits'
};

function getTopicFromContent(content, grade) {
  const lowerContent = content.toLowerCase();
  
  // Grade-specific topic detection
  if (grade <= 3) {
    if (lowerContent.includes('+') || lowerContent.includes('add')) return 'Addition';
    if (lowerContent.includes('-') || lowerContent.includes('subtract')) return 'Subtraction';
    if (lowerContent.includes('×') || lowerContent.includes('multiply')) return 'Multiplication';
    if (lowerContent.includes('÷') || lowerContent.includes('divide')) return 'Division';
    if (lowerContent.includes('count') || lowerContent.includes('how many')) return 'Counting';
    if (lowerContent.includes('shape') || lowerContent.includes('sides') || lowerContent.includes('triangle') || lowerContent.includes('square')) return 'Shapes';
    if (lowerContent.includes('time') || lowerContent.includes('hour') || lowerContent.includes('minute')) return 'Time';
    if (lowerContent.includes('cent') || lowerContent.includes('dollar') || lowerContent.includes('money')) return 'Money';
  }
  
  if (grade <= 6) {
    if (lowerContent.includes('fraction') || lowerContent.includes('/')) return 'Fractions';
    if (lowerContent.includes('decimal') || lowerContent.includes('.')) return 'Decimals';
    if (lowerContent.includes('%') || lowerContent.includes('percent')) return 'Percentages';
    if (lowerContent.includes('area')) return 'Geometry - Area';
    if (lowerContent.includes('perimeter')) return 'Geometry - Perimeter';
    if (lowerContent.includes('volume')) return 'Geometry - Volume';
    if (lowerContent.includes('mean') || lowerContent.includes('median') || lowerContent.includes('mode') || lowerContent.includes('range')) return 'Statistics';
  }
  
  if (grade <= 9) {
    if (lowerContent.includes('solve:') && lowerContent.includes('x')) return 'Linear Equations';
    if (lowerContent.includes('x²') || lowerContent.includes('quadratic')) return 'Quadratic Equations';
    if (lowerContent.includes('factor')) return 'Factoring';
    if (lowerContent.includes('slope') || lowerContent.includes('distance') || lowerContent.includes('midpoint')) return 'Coordinate Geometry';
    if (lowerContent.includes('system') || lowerContent.includes('equations')) return 'Systems of Equations';
    if (lowerContent.includes('>') || lowerContent.includes('<') || lowerContent.includes('inequality')) return 'Inequalities';
    if (lowerContent.includes('f(x)') || lowerContent.includes('function')) return 'Functions';
  }
  
  if (grade >= 10) {
    if (lowerContent.includes('sin') || lowerContent.includes('cos') || lowerContent.includes('tan')) return 'Trigonometry';
    if (lowerContent.includes('log') || lowerContent.includes('ln')) return 'Logarithms';
    if (lowerContent.includes('derivative') || lowerContent.includes("f'")) return 'Calculus - Derivatives';
    if (lowerContent.includes('integral') || lowerContent.includes('∫')) return 'Calculus - Integrals';
    if (lowerContent.includes('limit') || lowerContent.includes('lim')) return 'Calculus - Limits';
  }
  
  // Default fallbacks
  if (lowerContent.includes('solve')) return 'Algebra';
  if (lowerContent.includes('simplify')) return 'Algebra';
  if (lowerContent.includes('expand')) return 'Algebra';
  
  return 'Mathematics';
}

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
const files = fs.readdirSync(questionsDir).filter(f => f.includes('math.json'));

files.forEach(filename => {
  const filePath = path.join(questionsDir, filename);
  const grade = parseInt(filename.split('_')[0]);
  
  try {
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const updatedQuestions = questions.map(q => {
      if (!q.topic) {
        q.topic = getTopicFromContent(q.content, grade);
      }
      return q;
    });
    
    fs.writeFileSync(filePath, JSON.stringify(updatedQuestions, null, 2));
    console.log(`Updated ${filename} with topics`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
});

console.log('All math files updated with topics!');
