const fs = require('fs');
const path = require('path');

// REAL Grade 9 HARD Mathematics Questions
const realGrade9HardMath = [
  {
    _id: "grade9_hard_math_001_real",
    content: "Solve the quadratic equation: x² - 7x + 12 = 0",
    type: "multiple_choice",
    options: ["x = 3, 4", "x = 2, 6", "x = 1, 12", "x = -3, -4"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Factor: (x - 3)(x - 4) = 0, so x = 3 or x = 4"
  },
  {
    _id: "grade9_hard_math_002_real",
    content: "Find the derivative of f(x) = 2x³ - 5x² + 3x - 1",
    type: "multiple_choice",
    options: ["6x² - 10x + 3", "6x² - 5x + 3", "2x² - 10x + 3", "6x² - 10x + 1"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "f'(x) = 6x² - 10x + 3 using the power rule"
  },
  {
    _id: "grade9_hard_math_003_real",
    content: "What is sin(60°)?",
    type: "multiple_choice",
    options: ["1/2", "√2/2", "√3/2", "1"],
    correct_answer: 2,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "sin(60°) = √3/2 ≈ 0.866"
  },
  {
    _id: "grade9_hard_math_004_real",
    content: "Solve the system of equations: 3x + 2y = 12, x - y = 1",
    type: "multiple_choice",
    options: ["x = 2, y = 3", "x = 3, y = 2", "x = 4, y = 0", "x = 1, y = 4"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "From x - y = 1, x = y + 1. Substitute: 3(y + 1) + 2y = 12, so y = 3, x = 2"
  },
  {
    _id: "grade9_hard_math_005_real",
    content: "Factor completely: 3x² - 12x + 9",
    type: "multiple_choice",
    options: ["3(x - 1)(x - 3)", "3(x - 2)²", "(3x - 3)(x - 3)", "3(x² - 4x + 3)"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x - 1)(x - 3)"
  },
  {
    _id: "grade9_hard_math_006_real",
    content: "What is cos(45°)?",
    type: "multiple_choice",
    options: ["1/2", "√2/2", "√3/2", "1"],
    correct_answer: 1,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "cos(45°) = √2/2 ≈ 0.707"
  },
  {
    _id: "grade9_hard_math_007_real",
    content: "Simplify: (2x + 3)² - (x - 1)²",
    type: "multiple_choice",
    options: ["3x² + 14x + 8", "3x² + 10x + 8", "x² + 14x + 8", "3x² + 14x + 10"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "(2x + 3)² - (x - 1)² = (4x² + 12x + 9) - (x² - 2x + 1) = 3x² + 14x + 8"
  },
  {
    _id: "grade9_hard_math_008_real",
    content: "Solve for x: log₂(x + 3) = 4",
    type: "multiple_choice",
    options: ["x = 13", "x = 11", "x = 16", "x = 5"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "log₂(x + 3) = 4 means 2⁴ = x + 3, so 16 = x + 3, therefore x = 13"
  },
  {
    _id: "grade9_hard_math_009_real",
    content: "Find the vertex of the parabola y = x² - 6x + 5",
    type: "multiple_choice",
    options: ["(3, -4)", "(3, 4)", "(-3, -4)", "(6, 5)"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Vertex x = -b/2a = 6/2 = 3. y = 9 - 18 + 5 = -4. Vertex is (3, -4)"
  },
  {
    _id: "grade9_hard_math_010_real",
    content: "What is tan(30°)?",
    type: "multiple_choice",
    options: ["1/√3", "√3/3", "√3", "1"],
    correct_answer: 1,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "tan(30°) = 1/√3 = √3/3 ≈ 0.577"
  },
  {
    _id: "grade9_hard_math_011_real",
    content: "Solve: 2^(x+1) = 32",
    type: "multiple_choice",
    options: ["x = 4", "x = 5", "x = 3", "x = 6"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "2^(x+1) = 32 = 2⁵, so x + 1 = 5, therefore x = 4"
  },
  {
    _id: "grade9_hard_math_012_real",
    content: "Find the discriminant of 2x² - 5x + 3 = 0",
    type: "multiple_choice",
    options: ["1", "25", "49", "-23"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Discriminant = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1"
  },
  {
    _id: "grade9_hard_math_013_real",
    content: "Simplify: √(50x⁴y²)",
    type: "multiple_choice",
    options: ["5x²y√2", "25x²y", "5x²y√10", "10x²y√5"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "√(50x⁴y²) = √(25 × 2 × x⁴ × y²) = 5x²y√2"
  },
  {
    _id: "grade9_hard_math_014_real",
    content: "If f(x) = 3x² - 2x + 1, find f(-2)",
    type: "multiple_choice",
    options: ["17", "13", "9", "21"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "f(-2) = 3(-2)² - 2(-2) + 1 = 3(4) + 4 + 1 = 12 + 4 + 1 = 17"
  },
  {
    _id: "grade9_hard_math_015_real",
    content: "Solve the inequality: 2x - 5 > 3x + 1",
    type: "multiple_choice",
    options: ["x < -6", "x > -6", "x < 6", "x > 6"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "2x - 5 > 3x + 1, so -5 - 1 > 3x - 2x, therefore -6 > x, or x < -6"
  },
  {
    _id: "grade9_hard_math_016_real",
    content: "Find the slope of the line passing through (2, 5) and (-1, -4)",
    type: "multiple_choice",
    options: ["3", "-3", "1/3", "-1/3"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (-4 - 5)/(-1 - 2) = -9/(-3) = 3"
  },
  {
    _id: "grade9_hard_math_017_real",
    content: "What is the period of y = sin(2x)?",
    type: "multiple_choice",
    options: ["π", "2π", "π/2", "4π"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Period of sin(bx) is 2π/b. For sin(2x), period = 2π/2 = π"
  },
  {
    _id: "grade9_hard_math_018_real",
    content: "Rationalize the denominator: 3/(2 + √5)",
    type: "multiple_choice",
    options: ["3(2 - √5)", "6 - 3√5", "(6 - 3√5)/(-1)", "3(√5 - 2)"],
    correct_answer: 1,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Multiply by (2 - √5)/(2 - √5): 3(2 - √5)/(4 - 5) = 3(2 - √5)/(-1) = 6 - 3√5"
  },
  {
    _id: "grade9_hard_math_019_real",
    content: "Find the inverse of f(x) = 2x - 3",
    type: "multiple_choice",
    options: ["f⁻¹(x) = (x + 3)/2", "f⁻¹(x) = (x - 3)/2", "f⁻¹(x) = 2x + 3", "f⁻¹(x) = x/2 + 3"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Let y = 2x - 3, solve for x: x = (y + 3)/2, so f⁻¹(x) = (x + 3)/2"
  },
  {
    _id: "grade9_hard_math_020_real",
    content: "Evaluate: lim(x→2) (x² - 4)/(x - 2)",
    type: "multiple_choice",
    options: ["4", "2", "0", "undefined"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Factor: (x² - 4)/(x - 2) = (x + 2)(x - 2)/(x - 2) = x + 2. As x→2, limit = 4"
  }
];

function fixGrade9HardMathWithRealQuestions() {
  console.log('🚨 FIXING GRADE 9 HARD MATH WITH REAL QUESTIONS');
  console.log('===============================================\n');

  const filePath = 'testace-app/frontend/public/questions/9_hard_math.json';
  
  console.log('✅ Replacing generic garbage with REAL Grade 9 hard math questions...');
  
  // Write the real questions
  fs.writeFileSync(filePath, JSON.stringify(realGrade9HardMath, null, 2));
  
  console.log(`✅ Replaced with ${realGrade9HardMath.length} REAL Grade 9 hard math questions`);
  
  // Verify
  console.log('\n🔍 VERIFICATION - First 5 questions:');
  realGrade9HardMath.slice(0, 5).forEach((q, i) => {
    console.log(`${i + 1}. ${q.content}`);
  });
  
  console.log('\n✅ SUCCESS: Grade 9 hard math now has REAL mathematical content!');
}

fixGrade9HardMathWithRealQuestions();
