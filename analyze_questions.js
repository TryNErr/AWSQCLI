const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./Quiz_App/public/fixed_questions.json', 'utf8'));

const breakdown = {
  total: data.length,
  bySubject: {},
  byGrade: {},
  byDifficulty: {}
};

data.forEach(q => {
  // Subject breakdown
  const subject = q.subject || 'Unknown';
  breakdown.bySubject[subject] = (breakdown.bySubject[subject] || 0) + 1;
  
  // Grade breakdown
  const grade = q.grade || 'Unknown';
  breakdown.byGrade[grade] = (breakdown.byGrade[grade] || 0) + 1;
  
  // Difficulty breakdown
  const difficulty = q.difficulty || 'Unknown';
  breakdown.byDifficulty[difficulty] = (breakdown.byDifficulty[difficulty] || 0) + 1;
});

console.log('📊 Question Breakdown (77,437 valid questions)');
console.log('='.repeat(50));

console.log('\n📚 By Subject:');
Object.entries(breakdown.bySubject)
  .sort(([,a], [,b]) => b - a)
  .forEach(([subject, count]) => {
    console.log(`   ${subject}: ${count.toLocaleString()}`);
  });

console.log('\n🎓 By Grade:');
Object.entries(breakdown.byGrade)
  .sort(([a], [b]) => Number(a) - Number(b))
  .forEach(([grade, count]) => {
    console.log(`   Grade ${grade}: ${count.toLocaleString()}`);
  });

console.log('\n⚡ By Difficulty:');
Object.entries(breakdown.byDifficulty)
  .sort(([,a], [,b]) => b - a)
  .forEach(([difficulty, count]) => {
    console.log(`   ${difficulty}: ${count.toLocaleString()}`);
  });
