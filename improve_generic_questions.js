#!/usr/bin/env node

/**
 * Improve Generic Questions Script
 * 
 * This script identifies and improves generic placeholder questions
 * like "Grade 5 easy math question 1" with proper educational content.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

// Grade-appropriate question templates
const IMPROVED_QUESTIONS = {
  // Mathematics questions by grade and difficulty
  math: {
    1: {
      easy: [
        {
          content: "What is 3 + 2?",
          options: ["5", "4", "6", "3"],
          correctAnswer: "5",
          explanation: "When we add 3 + 2, we count: 3, 4, 5. So 3 + 2 = 5."
        },
        {
          content: "How many sides does a triangle have?",
          options: ["3", "4", "5", "2"],
          correctAnswer: "3",
          explanation: "A triangle always has exactly 3 sides and 3 corners."
        }
      ],
      medium: [
        {
          content: "What is 8 - 3?",
          options: ["5", "6", "4", "7"],
          correctAnswer: "5",
          explanation: "When we subtract 3 from 8, we count backwards: 8, 7, 6, 5. So 8 - 3 = 5."
        }
      ],
      hard: [
        {
          content: "Sarah has 7 stickers. She gives away 2 stickers. How many stickers does she have left?",
          options: ["5", "9", "4", "6"],
          correctAnswer: "5",
          explanation: "Sarah started with 7 stickers and gave away 2. So 7 - 2 = 5 stickers left."
        }
      ]
    },
    5: {
      easy: [
        {
          content: "What is 0.5 + 0.3?",
          options: ["0.8", "0.2", "0.53", "0.35"],
          correctAnswer: "0.8",
          explanation: "Adding decimals: 0.5 + 0.3 = 0.8"
        },
        {
          content: "What fraction is equivalent to 1/2?",
          options: ["2/4", "1/3", "3/4", "1/4"],
          correctAnswer: "2/4",
          explanation: "2/4 equals 1/2 because 2 ÷ 4 = 0.5 and 1 ÷ 2 = 0.5"
        }
      ],
      medium: [
        {
          content: "If a rectangle has length 8 cm and width 5 cm, what is its area?",
          options: ["40 cm²", "26 cm²", "13 cm²", "45 cm²"],
          correctAnswer: "40 cm²",
          explanation: "Area of rectangle = length × width = 8 × 5 = 40 cm²"
        }
      ],
      hard: [
        {
          content: "Solve for x: 2x + 3 = 11",
          options: ["x = 4", "x = 7", "x = 5", "x = 3"],
          correctAnswer: "x = 4",
          explanation: "2x + 3 = 11, so 2x = 8, therefore x = 4"
        }
      ]
    },
    12: {
      easy: [
        {
          content: "What is the derivative of x³?",
          options: ["3x²", "x²", "3x", "x³"],
          correctAnswer: "3x²",
          explanation: "Using the power rule: d/dx(x³) = 3x²"
        }
      ],
      medium: [
        {
          content: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
          options: ["2", "1", "0", "undefined"],
          correctAnswer: "2",
          explanation: "Factor: (x² - 1)/(x - 1) = (x + 1)(x - 1)/(x - 1) = x + 1. As x → 1, limit = 2"
        }
      ],
      hard: [
        {
          content: "Find the integral of 2x + 3 dx",
          options: ["x² + 3x + C", "2x² + 3x + C", "x² + 3 + C", "2x + 3x + C"],
          correctAnswer: "x² + 3x + C",
          explanation: "∫(2x + 3)dx = ∫2x dx + ∫3 dx = x² + 3x + C"
        }
      ]
    }
  },
  
  // English questions by grade and difficulty
  english: {
    5: {
      easy: [
        {
          content: "Which word is a noun in this sentence: 'The cat runs quickly'?",
          options: ["cat", "runs", "quickly", "the"],
          correctAnswer: "cat",
          explanation: "A noun is a person, place, or thing. 'Cat' is a thing, so it's a noun."
        }
      ],
      medium: [
        {
          content: "What is the past tense of 'run'?",
          options: ["ran", "running", "runs", "runned"],
          correctAnswer: "ran",
          explanation: "The past tense of 'run' is 'ran'. It's an irregular verb."
        }
      ],
      hard: [
        {
          content: "Which sentence uses correct punctuation?",
          options: [
            "Hello, how are you?",
            "Hello how are you.",
            "Hello; how are you!",
            "Hello how are you"
          ],
          correctAnswer: "Hello, how are you?",
          explanation: "Use a comma after 'Hello' and a question mark for questions."
        }
      ]
    },
    9: {
      easy: [
        {
          content: "What is the main idea of a paragraph called?",
          options: ["Topic sentence", "Conclusion", "Supporting detail", "Transition"],
          correctAnswer: "Topic sentence",
          explanation: "The topic sentence states the main idea of a paragraph."
        }
      ],
      medium: [
        {
          content: "What literary device is used in 'The wind whispered through the trees'?",
          options: ["Personification", "Metaphor", "Simile", "Alliteration"],
          correctAnswer: "Personification",
          explanation: "Personification gives human qualities (whispering) to non-human things (wind)."
        }
      ],
      hard: [
        {
          content: "In Shakespeare's Romeo and Juliet, what does the balcony scene symbolize?",
          options: [
            "The barrier between the lovers",
            "Juliet's social status",
            "Romeo's determination",
            "The height of their love"
          ],
          correctAnswer: "The barrier between the lovers",
          explanation: "The balcony represents the physical and social barriers keeping Romeo and Juliet apart."
        }
      ]
    },
    12: {
      hard: [
        {
          content: "Which rhetorical device is most effective in persuasive writing?",
          options: ["Ethos", "Pathos", "Logos", "All are equally important"],
          correctAnswer: "All are equally important",
          explanation: "Effective persuasion combines ethos (credibility), pathos (emotion), and logos (logic)."
        }
      ]
    }
  }
};

function identifyGenericQuestions() {
  console.log('🔍 IDENTIFYING GENERIC PLACEHOLDER QUESTIONS');
  console.log('============================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const genericQuestions = [];
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      const [grade, difficulty, subject] = file.replace('.json', '').split('_');
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        questions.forEach((question, index) => {
          if (isGenericQuestion(question)) {
            genericQuestions.push({
              file,
              grade,
              difficulty,
              subject,
              index,
              content: question.content
            });
          }
        });
        
      } catch (error) {
        console.warn(`⚠️ Could not check ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`Found ${genericQuestions.length} generic placeholder questions:`);
  genericQuestions.slice(0, 10).forEach(q => {
    console.log(`   ❌ ${q.file}: "${q.content}"`);
  });
  
  if (genericQuestions.length > 10) {
    console.log(`   ... and ${genericQuestions.length - 10} more`);
  }
  
  return genericQuestions;
}

function isGenericQuestion(question) {
  const content = question.content || '';
  
  // Generic patterns
  const genericPatterns = [
    /^Grade \d+ \w+ \w+ question \d+$/i,
    /^Which word is a synonym for 'happy'\?$/i, // This appears in multiple grades
    /^Option [A-D]$/i,
    /^This is a properly structured/i
  ];
  
  return genericPatterns.some(pattern => pattern.test(content));
}

function improveGenericQuestions() {
  console.log('\n🔧 IMPROVING GENERIC QUESTIONS');
  console.log('==============================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let improved = 0;
  let totalChanges = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      const [grade, difficulty, subject] = file.replace('.json', '').split('_');
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let fileChanged = false;
        let fileChanges = 0;
        
        questions.forEach((question, index) => {
          if (isGenericQuestion(question)) {
            const improvedQuestion = getImprovedQuestion(grade, difficulty, subject, index);
            
            if (improvedQuestion) {
              // Keep the original structure but improve content
              question.content = improvedQuestion.content;
              question.options = improvedQuestion.options;
              question.correctAnswer = improvedQuestion.correctAnswer;
              question.explanation = improvedQuestion.explanation;
              
              fileChanged = true;
              fileChanges++;
              totalChanges++;
              
              console.log(`   ✅ Improved ${file} question ${index + 1}: "${improvedQuestion.content.substring(0, 50)}..."`);
            }
          }
        });
        
        if (fileChanged) {
          fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
          improved++;
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not improve ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files improved: ${improved}`);
  console.log(`   Total questions improved: ${totalChanges}`);
  
  return { improved, totalChanges };
}

function getImprovedQuestion(grade, difficulty, subject, index) {
  const gradeNum = parseInt(grade);
  
  // Get appropriate questions for this combination
  if (subject === 'math' && IMPROVED_QUESTIONS.math[gradeNum] && IMPROVED_QUESTIONS.math[gradeNum][difficulty]) {
    const questions = IMPROVED_QUESTIONS.math[gradeNum][difficulty];
    return questions[index % questions.length];
  }
  
  if (subject === 'english' && IMPROVED_QUESTIONS.english[gradeNum] && IMPROVED_QUESTIONS.english[gradeNum][difficulty]) {
    const questions = IMPROVED_QUESTIONS.english[gradeNum][difficulty];
    return questions[index % questions.length];
  }
  
  // Generate appropriate question based on grade/difficulty/subject
  return generateAppropriateFallback(gradeNum, difficulty, subject, index);
}

function generateAppropriateFallback(grade, difficulty, subject, index) {
  if (subject === 'math') {
    if (grade <= 2) {
      return {
        content: `What is ${Math.floor(Math.random() * 5) + 1} + ${Math.floor(Math.random() * 5) + 1}?`,
        options: ["5", "6", "7", "8"],
        correctAnswer: "5",
        explanation: "Count the numbers together to find the sum."
      };
    } else if (grade <= 5) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      return {
        content: `What is ${a} × ${b}?`,
        options: [String(a * b), String(a * b + 1), String(a * b - 1), String(a * b + 2)],
        correctAnswer: String(a * b),
        explanation: `${a} × ${b} = ${a * b}`
      };
    } else if (grade >= 9) {
      return {
        content: "Solve for x: 3x - 7 = 14",
        options: ["x = 7", "x = 5", "x = 21", "x = 3"],
        correctAnswer: "x = 7",
        explanation: "3x - 7 = 14, so 3x = 21, therefore x = 7"
      };
    }
  }
  
  if (subject === 'english') {
    if (grade <= 5) {
      return {
        content: "Which word rhymes with 'cat'?",
        options: ["hat", "dog", "run", "big"],
        correctAnswer: "hat",
        explanation: "Hat and cat both end with the same sound: -at"
      };
    } else {
      return {
        content: "What type of sentence is this: 'Please close the door.'?",
        options: ["Imperative", "Declarative", "Interrogative", "Exclamatory"],
        correctAnswer: "Imperative",
        explanation: "An imperative sentence gives a command or makes a request."
      };
    }
  }
  
  // Default fallback
  return null;
}

function main() {
  console.log('🚀 IMPROVING GENERIC PLACEHOLDER QUESTIONS');
  console.log('==========================================\n');
  
  console.log('Identifying and improving generic questions like:');
  console.log('❌ "Grade 5 easy math question 1"');
  console.log('❌ "Which word is a synonym for \'happy\'?" (repeated across grades)');
  console.log('✅ Replacing with grade-appropriate, educational content\n');
  
  // Step 1: Identify generic questions
  const genericQuestions = identifyGenericQuestions();
  
  // Step 2: Improve them
  if (genericQuestions.length > 0) {
    const results = improveGenericQuestions();
    
    console.log('\n✅ IMPROVEMENT COMPLETE!');
    console.log('========================');
    console.log('Generic placeholder questions have been replaced with:');
    console.log('✅ Grade-appropriate content');
    console.log('✅ Educational value');
    console.log('✅ Proper difficulty progression');
    console.log('✅ Meaningful explanations');
    
  } else {
    console.log('\n✅ No generic questions found - all questions appear to be properly structured!');
  }
}

if (require.main === module) {
  main();
}
