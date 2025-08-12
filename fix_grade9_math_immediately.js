#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// REAL GRADE 9 MEDIUM MATH QUESTIONS
// Age-appropriate, curriculum-aligned, and completely unique

const realGrade9MediumMath = [
  {
    content: "Solve for x: 2x + 5 = 17",
    options: ["x = 4", "x = 6", "x = 8", "x = 11"],
    correctAnswer: "x = 6",
    explanation: "2x + 5 = 17. Subtract 5: 2x = 12. Divide by 2: x = 6."
  },
  {
    content: "Expand: (x + 3)(x + 4)",
    options: ["x² + 7x + 12", "x² + 12x + 7", "x² + 6x + 12", "x² + 7x + 7"],
    correctAnswer: "x² + 7x + 12",
    explanation: "(x + 3)(x + 4) = x² + 4x + 3x + 12 = x² + 7x + 12."
  },
  {
    content: "Factorize: x² - 9",
    options: ["(x - 3)²", "(x + 3)²", "(x - 3)(x + 3)", "x(x - 9)"],
    correctAnswer: "(x - 3)(x + 3)",
    explanation: "x² - 9 is a difference of squares: x² - 3² = (x - 3)(x + 3)."
  },
  {
    content: "If y = 3x - 2, what is y when x = 5?",
    options: ["11", "13", "15", "17"],
    correctAnswer: "13",
    explanation: "Substitute x = 5: y = 3(5) - 2 = 15 - 2 = 13."
  },
  {
    content: "Solve the simultaneous equations: x + y = 8 and x - y = 2",
    options: ["x = 4, y = 4", "x = 5, y = 3", "x = 6, y = 2", "x = 3, y = 5"],
    correctAnswer: "x = 5, y = 3",
    explanation: "Add equations: 2x = 10, so x = 5. Substitute: 5 + y = 8, so y = 3."
  },
  {
    content: "What is the gradient of the line passing through (2, 5) and (4, 11)?",
    options: ["2", "3", "4", "6"],
    correctAnswer: "3",
    explanation: "Gradient = (y₂ - y₁)/(x₂ - x₁) = (11 - 5)/(4 - 2) = 6/2 = 3."
  },
  {
    content: "A circle has radius 6 cm. What is its area? (Use π ≈ 3.14)",
    options: ["37.68 cm²", "113.04 cm²", "226.08 cm²", "452.16 cm²"],
    correctAnswer: "113.04 cm²",
    explanation: "Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04 cm²."
  },
  {
    content: "Solve: 3x - 7 = 2x + 5",
    options: ["x = 10", "x = 12", "x = 14", "x = 16"],
    correctAnswer: "x = 12",
    explanation: "3x - 7 = 2x + 5. Subtract 2x: x - 7 = 5. Add 7: x = 12."
  },
  {
    content: "What is the area of a triangle with base 8 cm and height 6 cm?",
    options: ["14 cm²", "24 cm²", "28 cm²", "48 cm²"],
    correctAnswer: "24 cm²",
    explanation: "Area = ½ × base × height = ½ × 8 × 6 = 24 cm²."
  },
  {
    content: "If 2ˣ = 16, what is x?",
    options: ["3", "4", "5", "8"],
    correctAnswer: "4",
    explanation: "2⁴ = 16, so x = 4."
  },
  {
    content: "Simplify: 3x + 2x - 5x",
    options: ["0", "x", "10x", "-x"],
    correctAnswer: "0",
    explanation: "3x + 2x - 5x = (3 + 2 - 5)x = 0x = 0."
  },
  {
    content: "What is the circumference of a circle with diameter 10 cm? (Use π ≈ 3.14)",
    options: ["15.7 cm", "31.4 cm", "62.8 cm", "314 cm"],
    correctAnswer: "31.4 cm",
    explanation: "Circumference = πd = 3.14 × 10 = 31.4 cm."
  },
  {
    content: "Solve for y: 4y + 3 = 19",
    options: ["y = 3", "y = 4", "y = 5", "y = 6"],
    correctAnswer: "y = 4",
    explanation: "4y + 3 = 19. Subtract 3: 4y = 16. Divide by 4: y = 4."
  },
  {
    content: "What is the volume of a cube with side length 4 cm?",
    options: ["16 cm³", "48 cm³", "64 cm³", "256 cm³"],
    correctAnswer: "64 cm³",
    explanation: "Volume = side³ = 4³ = 64 cm³."
  },
  {
    content: "If f(x) = 2x + 1, what is f(3)?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    explanation: "f(3) = 2(3) + 1 = 6 + 1 = 7."
  },
  {
    content: "What is the mean of: 12, 16, 20, 24?",
    options: ["16", "17", "18", "19"],
    correctAnswer: "18",
    explanation: "Mean = (12 + 16 + 20 + 24) ÷ 4 = 72 ÷ 4 = 18."
  },
  {
    content: "Solve: x² = 25",
    options: ["x = 5", "x = ±5", "x = 25", "x = ±25"],
    correctAnswer: "x = ±5",
    explanation: "x² = 25, so x = ±√25 = ±5."
  },
  {
    content: "What is 30% of 150?",
    options: ["35", "40", "45", "50"],
    correctAnswer: "45",
    explanation: "30% of 150 = 0.30 × 150 = 45."
  },
  {
    content: "A rectangle has length 12 cm and width 8 cm. What is its perimeter?",
    options: ["20 cm", "40 cm", "96 cm", "192 cm"],
    correctAnswer: "40 cm",
    explanation: "Perimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40 cm."
  },
  {
    content: "If log₂(x) = 3, what is x?",
    options: ["6", "8", "9", "16"],
    correctAnswer: "8",
    explanation: "log₂(x) = 3 means 2³ = x, so x = 8."
  }
];

function fixGrade9MathImmediately() {
  console.log('🚨 EMERGENCY FIX: Grade 9 Medium Math Questions');
  console.log('Replacing inappropriate Grade 1 content with real Grade 9 algebra/geometry\n');
  
  const questionsDir = '/workspaces/AWSQCLI/testace-app/public/questions';
  const frontendQuestionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
  
  const questions = realGrade9MediumMath.map((q, index) => ({
    _id: `grade9_medium_math_${String(index + 1).padStart(3, '0')}`,
    content: q.content,
    type: "multiple_choice",
    options: q.options,
    correctAnswer: q.correctAnswer,
    subject: "Mathematics",
    grade: 9,
    difficulty: "medium",
    explanation: q.explanation
  }));
  
  const filename = '9_medium_math.json';
  
  // Write to both directories
  [questionsDir, frontendQuestionsDir].forEach(dir => {
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  });
  
  console.log(`✅ Fixed ${filename} with REAL Grade 9 content:`);
  console.log(`   • "Solve for x: 2x + 5 = 17" (Linear equations)`);
  console.log(`   • "Expand: (x + 3)(x + 4)" (Algebraic expansion)`);
  console.log(`   • "Factorize: x² - 9" (Difference of squares)`);
  console.log(`   • "Solve simultaneous equations" (Systems)`);
  console.log(`   • Circle area, gradients, functions, logarithms`);
  console.log(`\n🎯 All 20 questions are:`);
  console.log(`   • Age-appropriate for Grade 9 (14-15 years old)`);
  console.log(`   • Completely unique (no duplications)`);
  console.log(`   • Curriculum-aligned (algebra, geometry, functions)`);
  console.log(`   • Properly explained with step-by-step solutions`);
}

// Run the emergency fix
if (require.main === module) {
  fixGrade9MathImmediately();
}

module.exports = { fixGrade9MathImmediately, realGrade9MediumMath };
