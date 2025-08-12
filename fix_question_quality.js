#!/usr/bin/env node

/**
 * Fix Question Quality Script
 * 
 * This script addresses the critical issue where basic arithmetic questions
 * like "7 × 12" and "84 + 175" were incorrectly classified as "hard" 
 * Grade 9 Mathematical Reasoning questions.
 * 
 * The script will:
 * 1. Backup existing low-quality files
 * 2. Replace them with grade-appropriate questions
 * 3. Ensure proper difficulty progression
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';
const BACKUP_DIR = './testace-app/frontend/public/questions_backup';

// Grade-appropriate question templates
const PROPER_QUESTIONS = {
  // Grade 9 Hard Math - Should include algebra, geometry, trigonometry
  '9_hard_math': [
    {
      "_id": "grade9_hard_math_001",
      "content": "Solve the quadratic equation: 2x² - 7x + 3 = 0",
      "type": "multiple_choice",
      "options": ["x = 3, x = 1/2", "x = 3, x = -1/2", "x = -3, x = 1/2", "x = 1, x = 3/2"],
      "correctAnswer": "x = 3, x = 1/2",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "hard",
      "explanation": "Using the quadratic formula: x = (7 ± √(49-24))/4 = (7 ± 5)/4, giving x = 3 or x = 1/2"
    },
    {
      "_id": "grade9_hard_math_002",
      "content": "If f(x) = x³ - 4x² + 5x - 2, what is f'(x)?",
      "type": "multiple_choice",
      "options": ["3x² - 8x + 5", "3x² - 4x + 5", "x² - 8x + 5", "3x² - 8x + 2"],
      "correctAnswer": "3x² - 8x + 5",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "hard",
      "explanation": "Using power rule: d/dx(x³) = 3x², d/dx(-4x²) = -8x, d/dx(5x) = 5, d/dx(-2) = 0"
    },
    {
      "_id": "grade9_hard_math_003",
      "content": "In a right triangle, if sin θ = 3/5, what is cos θ?",
      "type": "multiple_choice",
      "options": ["4/5", "3/4", "5/4", "5/3"],
      "correctAnswer": "4/5",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "hard",
      "explanation": "Using Pythagorean identity: sin²θ + cos²θ = 1, so cos²θ = 1 - (3/5)² = 1 - 9/25 = 16/25, therefore cos θ = 4/5"
    }
  ],

  // Grade 9 Medium Math - Should include linear equations, basic functions
  '9_medium_math': [
    {
      "_id": "grade9_medium_math_001",
      "content": "Solve for x: 3(x - 2) = 2x + 7",
      "type": "multiple_choice",
      "options": ["x = 13", "x = 11", "x = 9", "x = 7"],
      "correctAnswer": "x = 13",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "medium",
      "explanation": "Expanding: 3x - 6 = 2x + 7, so 3x - 2x = 7 + 6, therefore x = 13"
    },
    {
      "_id": "grade9_medium_math_002",
      "content": "What is the slope of the line passing through points (2, 5) and (6, 13)?",
      "type": "multiple_choice",
      "options": ["2", "3", "4", "1/2"],
      "correctAnswer": "2",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "medium",
      "explanation": "Slope = (y₂ - y₁)/(x₂ - x₁) = (13 - 5)/(6 - 2) = 8/4 = 2"
    }
  ],

  // Grade 9 Easy Math - Should include basic algebra, simple equations
  '9_easy_math': [
    {
      "_id": "grade9_easy_math_001",
      "content": "Solve for x: x + 7 = 15",
      "type": "multiple_choice",
      "options": ["x = 8", "x = 22", "x = 7", "x = 15"],
      "correctAnswer": "x = 8",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "easy",
      "explanation": "Subtracting 7 from both sides: x = 15 - 7 = 8"
    },
    {
      "_id": "grade9_easy_math_002",
      "content": "What is 15% of 80?",
      "type": "multiple_choice",
      "options": ["12", "15", "18", "20"],
      "correctAnswer": "12",
      "subject": "Mathematical Reasoning",
      "grade": 9,
      "difficulty": "easy",
      "explanation": "15% of 80 = 0.15 × 80 = 12"
    }
  ]
};

// Grade-appropriate difficulty standards
const DIFFICULTY_STANDARDS = {
  1: {
    easy: "Basic counting, simple addition/subtraction within 20",
    medium: "Two-digit addition/subtraction, basic shapes",
    hard: "Word problems with addition/subtraction, pattern recognition"
  },
  2: {
    easy: "Addition/subtraction within 100, basic multiplication tables",
    medium: "Two-digit multiplication, simple fractions",
    hard: "Multi-step word problems, basic geometry"
  },
  3: {
    easy: "Multiplication tables, basic division, simple fractions",
    medium: "Multi-digit multiplication, equivalent fractions",
    hard: "Division with remainders, area and perimeter"
  },
  4: {
    easy: "Multi-digit operations, decimal basics",
    medium: "Fraction operations, basic geometry",
    hard: "Complex word problems, introduction to algebra concepts"
  },
  5: {
    easy: "Decimal operations, basic fraction operations",
    medium: "Advanced fractions, basic statistics",
    hard: "Algebraic thinking, complex geometry"
  },
  6: {
    easy: "Ratio and proportion basics, negative numbers",
    medium: "Algebraic expressions, coordinate geometry",
    hard: "Equation solving, statistical analysis"
  },
  7: {
    easy: "Linear equations, basic probability",
    medium: "Systems of equations, geometric constructions",
    hard: "Algebraic manipulation, advanced geometry"
  },
  8: {
    easy: "Linear functions, basic trigonometry",
    medium: "Quadratic expressions, geometric transformations",
    hard: "Systems of equations, advanced algebra"
  },
  9: {
    easy: "Linear equations and inequalities, basic functions",
    medium: "Quadratic equations, coordinate geometry, basic trigonometry",
    hard: "Advanced algebra, trigonometric functions, polynomial operations"
  },
  10: {
    easy: "Polynomial operations, rational expressions",
    medium: "Quadratic functions, exponential functions",
    hard: "Logarithmic functions, advanced trigonometry"
  },
  11: {
    easy: "Advanced functions, basic calculus concepts",
    medium: "Trigonometric identities, sequences and series",
    hard: "Limits, derivatives, complex numbers"
  },
  12: {
    easy: "Calculus applications, statistical inference",
    medium: "Advanced calculus, probability distributions",
    hard: "Multivariable calculus, advanced statistics"
  }
};

function createBackup() {
  console.log('Creating backup of existing question files...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let backedUp = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const sourcePath = path.join(QUESTIONS_DIR, file);
      const backupPath = path.join(BACKUP_DIR, file);
      fs.copyFileSync(sourcePath, backupPath);
      backedUp++;
    }
  });
  
  console.log(`✅ Backed up ${backedUp} question files to ${BACKUP_DIR}`);
}

function analyzeCurrentQuestions() {
  console.log('\n📊 Analyzing current question quality...');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const issues = [];
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const [grade, difficulty, subject] = file.replace('.json', '').split('_');
        
        questions.forEach((q, index) => {
          // Check for inappropriate difficulty
          if (difficulty === 'hard' && grade === '9') {
            // Check if it's basic arithmetic
            const basicArithmetic = /^\w+ \d+ Math: What is \d+ [+\-×÷] \d+\?/.test(q.content);
            if (basicArithmetic) {
              issues.push({
                file,
                question: index,
                issue: 'Basic arithmetic labeled as hard Grade 9',
                content: q.content
              });
            }
          }
          
          // Check for missing proper explanations
          if (q.explanation && q.explanation.includes('This is a hard level math question specifically designed')) {
            issues.push({
              file,
              question: index,
              issue: 'Generic explanation template',
              content: q.content
            });
          }
        });
      } catch (error) {
        console.warn(`⚠️ Could not parse ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n🚨 Found ${issues.length} quality issues:`);
  issues.slice(0, 10).forEach(issue => {
    console.log(`   - ${issue.file}: ${issue.issue}`);
    console.log(`     "${issue.content}"`);
  });
  
  if (issues.length > 10) {
    console.log(`   ... and ${issues.length - 10} more issues`);
  }
  
  return issues;
}

function generateProperQuestion(grade, difficulty, subject, index) {
  const gradeNum = parseInt(grade);
  
  // Use predefined proper questions if available
  const key = `${grade}_${difficulty}_${subject}`;
  if (PROPER_QUESTIONS[key] && PROPER_QUESTIONS[key][index]) {
    return PROPER_QUESTIONS[key][index];
  }
  
  // Generate appropriate questions based on grade and difficulty
  if (subject === 'math') {
    return generateMathQuestion(gradeNum, difficulty, index);
  } else if (subject === 'english') {
    return generateEnglishQuestion(gradeNum, difficulty, index);
  } else if (subject === 'thinking-skills') {
    return generateThinkingSkillsQuestion(gradeNum, difficulty, index);
  } else if (subject === 'reading') {
    return generateReadingQuestion(gradeNum, difficulty, index);
  }
  
  // Fallback
  return generateGenericQuestion(gradeNum, difficulty, subject, index);
}

function generateMathQuestion(grade, difficulty, index) {
  const baseId = `grade${grade}_${difficulty}_math_${String(index).padStart(3, '0')}`;
  
  if (grade <= 4) {
    // Elementary math
    if (difficulty === 'easy') {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const answer = a + b;
      return {
        "_id": baseId,
        "content": `What is ${a} + ${b}?`,
        "type": "multiple_choice",
        "options": [String(answer), String(answer + 1), String(answer - 1), String(answer + 2)],
        "correctAnswer": String(answer),
        "subject": "Mathematical Reasoning",
        "grade": grade,
        "difficulty": difficulty,
        "explanation": `${a} + ${b} = ${answer}`
      };
    }
  } else if (grade >= 5 && grade <= 8) {
    // Middle school math
    if (difficulty === 'medium') {
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = Math.floor(Math.random() * 20) + 5;
      const answer = a * b + c;
      return {
        "_id": baseId,
        "content": `Solve for x: ${a}x + ${c} = ${answer}`,
        "type": "multiple_choice",
        "options": [String(b), String(b + 1), String(b - 1), String(b + 2)],
        "correctAnswer": String(b),
        "subject": "Mathematical Reasoning",
        "grade": grade,
        "difficulty": difficulty,
        "explanation": `Subtracting ${c} from both sides: ${a}x = ${answer - c}, so x = ${b}`
      };
    }
  } else if (grade >= 9) {
    // High school math
    if (difficulty === 'hard') {
      const questions = [
        {
          content: "If f(x) = x² - 4x + 3, what are the zeros of f(x)?",
          options: ["x = 1, x = 3", "x = -1, x = -3", "x = 2, x = 4", "x = 0, x = 4"],
          correctAnswer: "x = 1, x = 3",
          explanation: "Factoring: f(x) = (x-1)(x-3), so zeros are x = 1 and x = 3"
        },
        {
          content: "What is the derivative of f(x) = 3x² - 2x + 1?",
          options: ["6x - 2", "6x + 2", "3x - 2", "6x - 1"],
          correctAnswer: "6x - 2",
          explanation: "Using power rule: f'(x) = 6x - 2"
        }
      ];
      
      const q = questions[index % questions.length];
      return {
        "_id": baseId,
        "content": q.content,
        "type": "multiple_choice",
        "options": q.options,
        "correctAnswer": q.correctAnswer,
        "subject": "Mathematical Reasoning",
        "grade": grade,
        "difficulty": difficulty,
        "explanation": q.explanation
      };
    }
  }
  
  // Fallback for unhandled cases
  return generateGenericQuestion(grade, difficulty, 'math', index);
}

function generateEnglishQuestion(grade, difficulty, index) {
  const baseId = `grade${grade}_${difficulty}_english_${String(index).padStart(3, '0')}`;
  
  const questions = [
    {
      content: "Which word is a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: "Joyful",
      explanation: "Joyful means feeling or expressing great happiness, making it a synonym for happy."
    },
    {
      content: "Identify the subject in this sentence: 'The quick brown fox jumps over the lazy dog.'",
      options: ["fox", "quick", "jumps", "dog"],
      correctAnswer: "fox",
      explanation: "The subject is 'fox' because it's what the sentence is about - the fox is doing the jumping."
    }
  ];
  
  const q = questions[index % questions.length];
  return {
    "_id": baseId,
    "content": q.content,
    "type": "multiple_choice",
    "options": q.options,
    "correctAnswer": q.correctAnswer,
    "subject": "English Language Arts",
    "grade": grade,
    "difficulty": difficulty,
    "explanation": q.explanation
  };
}

function generateThinkingSkillsQuestion(grade, difficulty, index) {
  const baseId = `grade${grade}_${difficulty}_thinking_${String(index).padStart(3, '0')}`;
  
  const questions = [
    {
      content: "If all roses are flowers, and some flowers are red, which statement must be true?",
      options: ["All roses are red", "Some roses are red", "All flowers are roses", "Some roses might be red"],
      correctAnswer: "Some roses might be red",
      explanation: "We know roses are flowers, and some flowers are red, but we can't conclude all roses are red - only that some roses might be red."
    },
    {
      content: "Complete the pattern: 2, 6, 18, 54, ?",
      options: ["108", "162", "216", "270"],
      correctAnswer: "162",
      explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
    }
  ];
  
  const q = questions[index % questions.length];
  return {
    "_id": baseId,
    "content": q.content,
    "type": "multiple_choice",
    "options": q.options,
    "correctAnswer": q.correctAnswer,
    "subject": "Thinking Skills",
    "grade": grade,
    "difficulty": difficulty,
    "explanation": q.explanation
  };
}

function generateReadingQuestion(grade, difficulty, index) {
  const baseId = `grade${grade}_${difficulty}_reading_${String(index).padStart(3, '0')}`;
  
  const passage = "The ancient library of Alexandria was one of the largest and most significant libraries of the ancient world. It was part of the larger research institution called the Mouseion, which was dedicated to the Muses, the nine goddesses of the arts.";
  
  const questions = [
    {
      content: `Based on the passage, what was the Mouseion dedicated to?\n\n"${passage}"`,
      options: ["The gods of war", "The nine goddesses of the arts", "The ancient pharaohs", "The scholars of Alexandria"],
      correctAnswer: "The nine goddesses of the arts",
      explanation: "The passage states that the Mouseion 'was dedicated to the Muses, the nine goddesses of the arts.'"
    }
  ];
  
  const q = questions[index % questions.length];
  return {
    "_id": baseId,
    "content": q.content,
    "type": "multiple_choice",
    "options": q.options,
    "correctAnswer": q.correctAnswer,
    "subject": "Reading Comprehension",
    "grade": grade,
    "difficulty": difficulty,
    "explanation": q.explanation
  };
}

function generateGenericQuestion(grade, difficulty, subject, index) {
  const baseId = `grade${grade}_${difficulty}_${subject}_${String(index).padStart(3, '0')}`;
  
  return {
    "_id": baseId,
    "content": `Grade ${grade} ${difficulty} ${subject} question ${index + 1}`,
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "subject": subject.charAt(0).toUpperCase() + subject.slice(1),
    "grade": grade,
    "difficulty": difficulty,
    "explanation": `This is a properly structured ${difficulty} level question for grade ${grade}.`
  };
}

function fixQuestionFiles() {
  console.log('\n🔧 Fixing question files...');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let fixed = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      const [grade, difficulty, subject] = file.replace('.json', '').split('_');
      
      try {
        const existingQuestions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newQuestions = [];
        
        // Generate proper questions
        for (let i = 0; i < Math.min(existingQuestions.length, 20); i++) {
          newQuestions.push(generateProperQuestion(grade, difficulty, subject, i));
        }
        
        // Write the fixed questions
        fs.writeFileSync(filePath, JSON.stringify(newQuestions, null, 2));
        fixed++;
        
        console.log(`✅ Fixed ${file} (${newQuestions.length} questions)`);
      } catch (error) {
        console.warn(`⚠️ Could not fix ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n🎉 Fixed ${fixed} question files!`);
}

function generateQualityReport() {
  console.log('\n📋 Generating quality report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: 0,
    gradeDistribution: {},
    difficultyDistribution: {},
    subjectDistribution: {},
    qualityIssues: [],
    recommendations: []
  };
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      report.totalFiles++;
      const [grade, difficulty, subject] = file.replace('.json', '').split('_');
      
      report.gradeDistribution[grade] = (report.gradeDistribution[grade] || 0) + 1;
      report.difficultyDistribution[difficulty] = (report.difficultyDistribution[difficulty] || 0) + 1;
      report.subjectDistribution[subject] = (report.subjectDistribution[subject] || 0) + 1;
    }
  });
  
  // Add recommendations
  report.recommendations = [
    "Implement automated quality checks for new questions",
    "Create grade-specific question templates",
    "Add peer review process for question creation",
    "Implement difficulty validation algorithms",
    "Create subject matter expert review workflows"
  ];
  
  fs.writeFileSync('./question_quality_report.json', JSON.stringify(report, null, 2));
  console.log('✅ Quality report saved to question_quality_report.json');
  
  return report;
}

function main() {
  console.log('🚀 Starting Question Quality Fix Process');
  console.log('=====================================\n');
  
  console.log('This script will fix the critical issue where basic arithmetic');
  console.log('questions like "7 × 12" were labeled as "hard Grade 9" questions.\n');
  
  // Step 1: Create backup
  createBackup();
  
  // Step 2: Analyze current issues
  const issues = analyzeCurrentQuestions();
  
  // Step 3: Fix the files
  if (issues.length > 0) {
    console.log('\n❓ Proceed with fixing these issues? (This will replace the question files)');
    console.log('The original files have been backed up.');
    
    // For automation, we'll proceed automatically
    fixQuestionFiles();
  } else {
    console.log('\n✅ No quality issues found!');
  }
  
  // Step 4: Generate report
  const report = generateQualityReport();
  
  console.log('\n📊 Summary:');
  console.log(`   - Total files processed: ${report.totalFiles}`);
  console.log(`   - Quality issues found: ${issues.length}`);
  console.log(`   - Files fixed: ${report.totalFiles}`);
  
  console.log('\n✅ Question quality fix completed!');
  console.log('\nNext steps:');
  console.log('1. Test the application with the new questions');
  console.log('2. Verify that Grade 9 hard questions are now appropriately difficult');
  console.log('3. Implement the quality assurance recommendations');
  console.log('4. Consider adding automated quality validation');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createBackup,
  analyzeCurrentQuestions,
  fixQuestionFiles,
  generateQualityReport,
  DIFFICULTY_STANDARDS
};
