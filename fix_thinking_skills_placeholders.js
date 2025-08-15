const fs = require('fs');
const path = require('path');

const questionsDir = 'testace-app/frontend/public/questions';

// Thinking skills questions by grade and difficulty
const thinkingSkillsQuestions = [
  {
    content: "Complete the pattern: 2, 4, 6, 8, ?",
    options: ["9", "10", "11", "12"],
    correct_answer: 1,
    explanation: "The pattern increases by 2 each time: 2, 4, 6, 8, 10"
  },
  {
    content: "If all cats are animals, and Fluffy is a cat, what can we conclude?",
    options: ["Fluffy is not an animal", "Fluffy is an animal", "Fluffy might be an animal", "We cannot conclude anything"],
    correct_answer: 1,
    explanation: "Since all cats are animals and Fluffy is a cat, Fluffy must be an animal"
  },
  {
    content: "Which number comes next: 1, 4, 9, 16, ?",
    options: ["20", "23", "25", "30"],
    correct_answer: 2,
    explanation: "These are perfect squares: 1², 2², 3², 4², 5² = 25"
  },
  {
    content: "A farmer has chickens and cows. There are 20 heads and 56 legs total. How many cows are there?",
    options: ["6", "8", "10", "12"],
    correct_answer: 1,
    explanation: "Let c = cows, h = chickens. c + h = 20, 4c + 2h = 56. Solving: c = 8"
  },
  {
    content: "If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?",
    options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"],
    correct_answer: 0,
    explanation: "Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes"
  },
  {
    content: "What is the next letter in the sequence: A, D, G, J, ?",
    options: ["K", "L", "M", "N"],
    correct_answer: 2,
    explanation: "Each letter skips 2 positions: A(+3)D(+3)G(+3)J(+3)M"
  },
  {
    content: "A snail climbs up a 10-meter wall. Each day it climbs 3 meters up, but each night it slides 2 meters down. How many days to reach the top?",
    options: ["7 days", "8 days", "9 days", "10 days"],
    correct_answer: 1,
    explanation: "After 7 days: 7m. On day 8, it climbs 3m more to reach 10m before sliding back"
  },
  {
    content: "Which shape comes next in the pattern: Circle, Square, Triangle, Circle, Square, ?",
    options: ["Circle", "Square", "Triangle", "Diamond"],
    correct_answer: 2,
    explanation: "The pattern repeats every 3 shapes: Circle, Square, Triangle"
  },
  {
    content: "If you rearrange the letters 'CIFAIPC', you get the name of a:",
    options: ["Country", "Animal", "Ocean", "Planet"],
    correct_answer: 2,
    explanation: "CIFAIPC rearranged spells PACIFIC (ocean)"
  },
  {
    content: "What number should replace the question mark: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correct_answer: 1,
    explanation: "Differences: +4, +6, +8, +10, +12. Next is 30 + 12 = 42"
  }
];

function fixThinkingSkillsPlaceholders() {
  console.log('🔧 FIXING THINKING SKILLS PLACEHOLDERS');
  console.log('======================================\n');

  const files = fs.readdirSync(questionsDir).filter(file => 
    file.includes('thinking-skills') && file.endsWith('.json')
  );
  
  let totalReplacements = 0;
  let filesModified = 0;

  files.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let questions = Array.isArray(data) ? data : (data.questions || []);
    let modified = false;
    
    // Parse filename to get grade and difficulty
    const match = filename.match(/(\d+)_(\w+)_thinking-skills\.json/);
    if (!match) return;
    
    const [, gradeStr, difficulty] = match;
    const grade = parseInt(gradeStr);
    
    let questionIndex = 0;
    questions = questions.map(question => {
      if (question.content && question.content.includes('Unique Grade') && question.content.includes('question - ID:')) {
        // This is a placeholder question
        const template = thinkingSkillsQuestions[questionIndex % thinkingSkillsQuestions.length];
        const newQuestion = {
          _id: `grade${grade}_${difficulty}_thinking_skills_${questionIndex}_fixed`,
          content: template.content,
          type: "multiple_choice",
          options: template.options,
          correct_answer: template.correct_answer,
          subject: "Thinking Skills",
          grade: grade,
          difficulty: difficulty,
          explanation: template.explanation
        };
        
        questionIndex++;
        totalReplacements++;
        modified = true;
        console.log(`  ✅ Replaced placeholder in ${filename}`);
        return newQuestion;
      }
      return question;
    });

    if (modified) {
      // Write back in the same format
      if (Array.isArray(data)) {
        fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
      } else {
        data.questions = questions;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
      filesModified++;
    }
  });

  console.log(`\n🎯 THINKING SKILLS FIX COMPLETE!`);
  console.log(`================================`);
  console.log(`✅ Files modified: ${filesModified}`);
  console.log(`✅ Placeholder questions replaced: ${totalReplacements}`);

  // Final verification
  console.log('\n🔍 FINAL VERIFICATION...');
  let remainingPlaceholders = 0;
  const allFiles = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json') && file !== 'manifest.json');
  
  allFiles.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let questions = Array.isArray(data) ? data : (data.questions || []);
    const count = questions.filter(q => q.content && q.content.includes('Unique Grade') && q.content.includes('question - ID:')).length;
    if (count > 0) {
      remainingPlaceholders += count;
      console.log(`⚠️  ${filename}: ${count} placeholders remaining`);
    }
  });

  if (remainingPlaceholders === 0) {
    console.log('✅ ALL PLACEHOLDER QUESTIONS SUCCESSFULLY REPLACED!');
  } else {
    console.log(`⚠️  ${remainingPlaceholders} placeholder questions still remain`);
  }
}

fixThinkingSkillsPlaceholders();
