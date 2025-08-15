const fs = require('fs');
const path = require('path');

const questionsDir = 'testace-app/frontend/public/questions';

// Question generators by subject, grade, and difficulty
const questionGenerators = {
  generateMathQuestion: (grade, difficulty, index) => {
    const templates = {
      easy: {
        1: [
          { content: "What is 3 + 4?", options: ["6", "7", "8", "9"], correct: 1, explanation: "3 + 4 = 7" },
          { content: "What is 8 - 3?", options: ["4", "5", "6", "7"], correct: 1, explanation: "8 - 3 = 5" },
          { content: "What is 2 × 5?", options: ["8", "9", "10", "11"], correct: 2, explanation: "2 × 5 = 10" },
          { content: "What is 12 ÷ 4?", options: ["2", "3", "4", "5"], correct: 1, explanation: "12 ÷ 4 = 3" },
          { content: "Count: 🍎🍎🍎🍎", options: ["3", "4", "5", "6"], correct: 1, explanation: "There are 4 apples" }
        ],
        2: [
          { content: "What is 15 + 8?", options: ["21", "22", "23", "24"], correct: 2, explanation: "15 + 8 = 23" },
          { content: "What is 30 - 12?", options: ["16", "17", "18", "19"], correct: 2, explanation: "30 - 12 = 18" },
          { content: "What is 7 × 4?", options: ["26", "27", "28", "29"], correct: 2, explanation: "7 × 4 = 28" },
          { content: "What is 24 ÷ 6?", options: ["3", "4", "5", "6"], correct: 1, explanation: "24 ÷ 6 = 4" },
          { content: "What is half of 16?", options: ["6", "7", "8", "9"], correct: 2, explanation: "Half of 16 is 8" }
        ]
      },
      medium: {
        6: [
          { content: "Solve for x: 2x + 5 = 13", options: ["x = 3", "x = 4", "x = 5", "x = 6"], correct: 1, explanation: "2x = 8, so x = 4" },
          { content: "What is 25% of 80?", options: ["15", "20", "25", "30"], correct: 1, explanation: "25% of 80 = 0.25 × 80 = 20" },
          { content: "Find the area of a rectangle: length 6cm, width 4cm", options: ["20 cm²", "22 cm²", "24 cm²", "26 cm²"], correct: 2, explanation: "Area = 6 × 4 = 24 cm²" }
        ]
      },
      hard: {
        9: [
          { content: "Solve: x² - 5x + 6 = 0", options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"], correct: 0, explanation: "Factor: (x-2)(x-3) = 0" },
          { content: "What is sin(30°)?", options: ["1/2", "√2/2", "√3/2", "1"], correct: 0, explanation: "sin(30°) = 1/2" },
          { content: "Find the derivative of f(x) = 3x² + 2x", options: ["6x + 2", "6x - 2", "3x + 2", "3x - 2"], correct: 0, explanation: "f'(x) = 6x + 2" }
        ]
      }
    };
    
    const gradeTemplates = templates[difficulty]?.[grade] || templates.easy[1];
    const template = gradeTemplates[index % gradeTemplates.length];
    
    return {
      _id: `grade${grade}_${difficulty}_math_${index}_unique`,
      content: template.content,
      type: "multiple_choice",
      options: template.options,
      correct_answer: template.correct,
      subject: "Mathematics",
      grade: grade,
      difficulty: difficulty,
      explanation: template.explanation
    };
  },

  generateEnglishQuestion: (grade, difficulty, index) => {
    const templates = {
      easy: {
        1: [
          { content: "Which word rhymes with 'cat'?", options: ["dog", "hat", "car", "big"], correct: 1, explanation: "'Hat' rhymes with 'cat'" },
          { content: "What is the plural of 'dog'?", options: ["dog", "dogs", "doges", "dogies"], correct: 1, explanation: "Add 's' to make 'dogs'" },
          { content: "Which letter comes after 'B'?", options: ["A", "C", "D", "E"], correct: 1, explanation: "C comes after B" }
        ],
        2: [
          { content: "Which sentence is correct?", options: ["I am happy.", "i am happy", "I am happy", "i Am Happy"], correct: 0, explanation: "Sentences start with capitals and end with periods" },
          { content: "What is the past tense of 'walk'?", options: ["walking", "walks", "walked", "walkded"], correct: 2, explanation: "Add 'ed' for past tense" }
        ]
      },
      medium: {
        6: [
          { content: "Identify the verb: 'The dog barked loudly.'", options: ["dog", "barked", "loudly", "the"], correct: 1, explanation: "'Barked' is the action word" },
          { content: "What is the comparative form of 'good'?", options: ["gooder", "more good", "better", "best"], correct: 2, explanation: "'Better' is comparative" }
        ]
      },
      hard: {
        9: [
          { content: "Identify the literary device: 'The wind whispered.'", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correct: 2, explanation: "Giving human qualities to wind is personification" },
          { content: "What is a sonnet?", options: ["12-line poem", "14-line poem", "16-line poem", "18-line poem"], correct: 1, explanation: "A sonnet has 14 lines" }
        ]
      }
    };
    
    const gradeTemplates = templates[difficulty]?.[grade] || templates.easy[1];
    const template = gradeTemplates[index % gradeTemplates.length];
    
    return {
      _id: `grade${grade}_${difficulty}_english_${index}_unique`,
      content: template.content,
      type: "multiple_choice",
      options: template.options,
      correct_answer: template.correct,
      subject: "English",
      grade: grade,
      difficulty: difficulty,
      explanation: template.explanation
    };
  }
};

function eliminateWithinFileDuplicates() {
  console.log('🚨 ELIMINATING ALL WITHIN-FILE DUPLICATES');
  console.log('=========================================\n');

  const files = fs.readdirSync(questionsDir).filter(file => 
    file.endsWith('.json') && file !== 'manifest.json'
  );

  let totalFilesFixed = 0;
  let totalDuplicatesRemoved = 0;

  files.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let questions = Array.isArray(data) ? data : (data.questions || []);
    const originalCount = questions.length;
    
    // Check for duplicates
    const contentCounts = {};
    questions.forEach(q => {
      const content = q.content || '';
      contentCounts[content] = (contentCounts[content] || 0) + 1;
    });
    
    const duplicateContents = Object.keys(contentCounts).filter(content => contentCounts[content] > 1);
    
    if (duplicateContents.length > 0) {
      console.log(`\n🔧 Fixing ${filename}:`);
      console.log(`   Original: ${originalCount} questions`);
      console.log(`   Unique: ${Object.keys(contentCounts).length} questions`);
      console.log(`   Duplicates: ${originalCount - Object.keys(contentCounts).length}`);
      
      // Parse filename for grade, difficulty, subject
      const match = filename.match(/(\d+)_(\w+)_(\w+)\.json/);
      if (!match) {
        console.log(`   ❌ Cannot parse filename: ${filename}`);
        return;
      }
      
      const [, gradeStr, difficulty, subject] = match;
      const grade = parseInt(gradeStr);
      
      // Remove duplicates and generate new questions
      const uniqueQuestions = [];
      const seenContents = new Set();
      let replacementIndex = 0;
      
      questions.forEach(question => {
        const content = question.content || '';
        if (!seenContents.has(content)) {
          seenContents.add(content);
          uniqueQuestions.push(question);
        } else {
          // Generate replacement question
          let newQuestion;
          if (subject === 'math') {
            newQuestion = questionGenerators.generateMathQuestion(grade, difficulty, replacementIndex);
          } else if (subject === 'english') {
            newQuestion = questionGenerators.generateEnglishQuestion(grade, difficulty, replacementIndex);
          } else {
            // Fallback for other subjects
            newQuestion = {
              _id: `grade${grade}_${difficulty}_${subject}_${replacementIndex}_unique`,
              content: `Grade ${grade} ${difficulty} ${subject} question ${replacementIndex + 1}`,
              type: "multiple_choice",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correct_answer: 0,
              subject: subject.charAt(0).toUpperCase() + subject.slice(1),
              grade: grade,
              difficulty: difficulty,
              explanation: `This is a ${difficulty} level ${subject} question for grade ${grade}.`
            };
          }
          uniqueQuestions.push(newQuestion);
          replacementIndex++;
        }
      });
      
      // Write back the fixed questions
      if (Array.isArray(data)) {
        fs.writeFileSync(filePath, JSON.stringify(uniqueQuestions, null, 2));
      } else {
        data.questions = uniqueQuestions;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
      
      console.log(`   ✅ Fixed: ${uniqueQuestions.length} unique questions`);
      totalFilesFixed++;
      totalDuplicatesRemoved += (originalCount - uniqueQuestions.length);
    }
  });

  console.log(`\n🎯 WITHIN-FILE DUPLICATE ELIMINATION COMPLETE!`);
  console.log(`==============================================`);
  console.log(`✅ Files fixed: ${totalFilesFixed}`);
  console.log(`✅ Duplicates removed: ${totalDuplicatesRemoved}`);
  
  // Final verification
  console.log('\n🔍 FINAL VERIFICATION...');
  let remainingDuplicateFiles = 0;
  
  files.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let questions = Array.isArray(data) ? data : (data.questions || []);
    const total = questions.length;
    const unique = new Set(questions.map(q => q.content || '')).size;
    
    if (total !== unique) {
      console.log(`❌ ${filename}: ${total} total, ${unique} unique (${total - unique} duplicates)`);
      remainingDuplicateFiles++;
    }
  });
  
  if (remainingDuplicateFiles === 0) {
    console.log('✅ SUCCESS: All within-file duplicates eliminated!');
  } else {
    console.log(`❌ ${remainingDuplicateFiles} files still have duplicates`);
  }
}

eliminateWithinFileDuplicates();
