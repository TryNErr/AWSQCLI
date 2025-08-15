const fs = require('fs');
const path = require('path');

// DIVERSE Grade 9 HARD Mathematics Questions - Multiple Topics
const diverseGrade9HardMath = [
  {
    _id: "grade9_hard_math_001_diverse",
    content: "Solve the quadratic equation: x² - 5x + 6 = 0",
    type: "multiple_choice",
    options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3"
  },
  {
    _id: "grade9_hard_math_002_diverse",
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
    _id: "grade9_hard_math_003_diverse",
    content: "Factor completely: 2x² - 8x + 6",
    type: "multiple_choice",
    options: ["2(x - 1)(x - 3)", "2(x + 1)(x + 3)", "(2x - 2)(x - 3)", "2(x - 2)(x - 1)"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "2x² - 8x + 6 = 2(x² - 4x + 3) = 2(x - 1)(x - 3)"
  },
  {
    _id: "grade9_hard_math_004_diverse",
    content: "Solve the system: 3x + 2y = 12, x - y = 1",
    type: "multiple_choice",
    options: ["x = 2, y = 3", "x = 3, y = 2", "x = 4, y = 0", "x = 1, y = 4"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "From x - y = 1, x = y + 1. Substitute: 3(y + 1) + 2y = 12, so y = 3, x = 2"
  },
  {
    _id: "grade9_hard_math_005_diverse",
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
    _id: "grade9_hard_math_006_diverse",
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
    _id: "grade9_hard_math_007_diverse",
    content: "Simplify: √(72x⁴y²)",
    type: "multiple_choice",
    options: ["6x²y√2", "36x²y", "6x²y√8", "12x²y√2"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "√(72x⁴y²) = √(36 × 2 × x⁴ × y²) = 6x²y√2"
  },
  {
    _id: "grade9_hard_math_008_diverse",
    content: "If f(x) = 2x² - 3x + 1, find f(-2)",
    type: "multiple_choice",
    options: ["15", "11", "7", "19"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "f(-2) = 2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15"
  },
  {
    _id: "grade9_hard_math_009_diverse",
    content: "Solve: log₂(x + 4) = 3",
    type: "multiple_choice",
    options: ["x = 4", "x = 8", "x = 12", "x = 16"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "log₂(x + 4) = 3 means 2³ = x + 4, so 8 = x + 4, therefore x = 4"
  },
  {
    _id: "grade9_hard_math_010_diverse",
    content: "Find the vertex of the parabola y = x² - 6x + 8",
    type: "multiple_choice",
    options: ["(3, -1)", "(3, 1)", "(-3, -1)", "(6, 8)"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Vertex x = -b/2a = 6/2 = 3. y = 9 - 18 + 8 = -1. Vertex is (3, -1)"
  },
  {
    _id: "grade9_hard_math_011_diverse",
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
    _id: "grade9_hard_math_012_diverse",
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
    _id: "grade9_hard_math_013_diverse",
    content: "Find the discriminant of x² - 4x + 3 = 0",
    type: "multiple_choice",
    options: ["4", "16", "28", "-8"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Discriminant = b² - 4ac = (-4)² - 4(1)(3) = 16 - 12 = 4"
  },
  {
    _id: "grade9_hard_math_014_diverse",
    content: "Rationalize the denominator: 2/(3 + √2)",
    type: "multiple_choice",
    options: ["2(3 - √2)/7", "6 - 2√2", "(6 - 2√2)/7", "2(√2 - 3)"],
    correct_answer: 2,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Multiply by (3 - √2)/(3 - √2): 2(3 - √2)/(9 - 2) = 2(3 - √2)/7 = (6 - 2√2)/7"
  },
  {
    _id: "grade9_hard_math_015_diverse",
    content: "What is the period of y = sin(3x)?",
    type: "multiple_choice",
    options: ["2π/3", "3π", "π/3", "6π"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Period of sin(bx) is 2π/b. For sin(3x), period = 2π/3"
  },
  {
    _id: "grade9_hard_math_016_diverse",
    content: "Find the inverse of f(x) = 3x - 2",
    type: "multiple_choice",
    options: ["f⁻¹(x) = (x + 2)/3", "f⁻¹(x) = (x - 2)/3", "f⁻¹(x) = 3x + 2", "f⁻¹(x) = x/3 + 2"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Let y = 3x - 2, solve for x: x = (y + 2)/3, so f⁻¹(x) = (x + 2)/3"
  },
  {
    _id: "grade9_hard_math_017_diverse",
    content: "Solve: 3^(x+1) = 81",
    type: "multiple_choice",
    options: ["x = 3", "x = 4", "x = 2", "x = 5"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "3^(x+1) = 81 = 3⁴, so x + 1 = 4, therefore x = 3"
  },
  {
    _id: "grade9_hard_math_018_diverse",
    content: "Find the distance between points (1, 2) and (4, 6)",
    type: "multiple_choice",
    options: ["5", "7", "√7", "√25"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Distance = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5"
  },
  {
    _id: "grade9_hard_math_019_diverse",
    content: "Simplify: (x² - 9)/(x + 3)",
    type: "multiple_choice",
    options: ["x - 3", "x + 3", "x² - 3", "x + 9"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "(x² - 9)/(x + 3) = (x + 3)(x - 3)/(x + 3) = x - 3"
  },
  {
    _id: "grade9_hard_math_020_diverse",
    content: "If the area of a circle is 36π, what is its radius?",
    type: "multiple_choice",
    options: ["6", "12", "18", "36"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Area = πr² = 36π, so r² = 36, therefore r = 6"
  }
];

function fixGrade9HardMathWithDiversity() {
  console.log('🚨 FIXING GRADE 9 HARD MATH WITH DIVERSE TOPICS');
  console.log('===============================================\n');

  const filePath = 'testace-app/frontend/public/questions/9_hard_math.json';
  
  console.log('✅ Replacing repetitive linear equations with DIVERSE math topics...');
  
  // Write the diverse questions
  fs.writeFileSync(filePath, JSON.stringify(diverseGrade9HardMath, null, 2));
  
  console.log(`✅ Replaced with ${diverseGrade9HardMath.length} DIVERSE Grade 9 hard math questions`);
  
  // Show the variety
  console.log('\n🔍 TOPIC VARIETY - All 20 questions:');
  diverseGrade9HardMath.forEach((q, i) => {
    const topic = q.content.includes('quadratic') ? 'Quadratic' :
                  q.content.includes('sin') || q.content.includes('cos') || q.content.includes('tan') ? 'Trigonometry' :
                  q.content.includes('Factor') ? 'Factoring' :
                  q.content.includes('system') ? 'Systems' :
                  q.content.includes('slope') ? 'Linear Functions' :
                  q.content.includes('√') ? 'Radicals' :
                  q.content.includes('f(x)') && q.content.includes('find f') ? 'Function Evaluation' :
                  q.content.includes('log') ? 'Logarithms' :
                  q.content.includes('vertex') ? 'Parabolas' :
                  q.content.includes('inequality') ? 'Inequalities' :
                  q.content.includes('discriminant') ? 'Discriminant' :
                  q.content.includes('Rationalize') ? 'Rationalizing' :
                  q.content.includes('period') ? 'Periodic Functions' :
                  q.content.includes('inverse') ? 'Inverse Functions' :
                  q.content.includes('^') ? 'Exponentials' :
                  q.content.includes('distance') ? 'Distance Formula' :
                  q.content.includes('Simplify') && q.content.includes('/') ? 'Rational Expressions' :
                  q.content.includes('area') && q.content.includes('circle') ? 'Circle Geometry' :
                  'Other';
    console.log(`${i + 1}. ${topic}: ${q.content.substring(0, 50)}...`);
  });
  
  console.log('\n✅ SUCCESS: Grade 9 hard math now has DIVERSE mathematical topics!');
  console.log('Topics covered: Quadratics, Trigonometry, Factoring, Systems, Functions, Logarithms, Geometry, and more!');
}

fixGrade9HardMathWithDiversity();
