const fs = require('fs');
const path = require('path');

// REAL Grade 9 HARD Mathematics Questions - Actual Problems, Not Generic Templates
const realGrade9HardMathQuestions = [
  {
    _id: "grade9_hard_math_001_real",
    content: "Solve the quadratic equation: x² - 6x + 8 = 0",
    type: "multiple_choice",
    options: ["x = 2, 4", "x = 1, 8", "x = -2, -4", "x = 3, 5"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Factor: (x - 2)(x - 4) = 0, so x = 2 or x = 4"
  },
  {
    _id: "grade9_hard_math_002_real",
    content: "Calculate the standard deviation of the data set: 10, 12, 14, 16, 18",
    type: "multiple_choice",
    options: ["2.83", "3.16", "4.00", "2.00"],
    correct_answer: 1,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Mean = 14, variance = 10, standard deviation = √10 ≈ 3.16"
  },
  {
    _id: "grade9_hard_math_003_real",
    content: "Solve the system of equations: 2x + 3y = 7, 4x - y = 5",
    type: "multiple_choice",
    options: ["x = 2, y = 1", "x = 1, y = 2", "x = 3, y = 0", "x = 0, y = 3"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "From second equation: y = 4x - 5. Substitute: 2x + 3(4x - 5) = 7, so x = 2, y = 1"
  },
  {
    _id: "grade9_hard_math_004_real",
    content: "Find the inverse function f⁻¹(x) if f(x) = 3x - 7",
    type: "multiple_choice",
    options: ["f⁻¹(x) = (x + 7)/3", "f⁻¹(x) = (x - 7)/3", "f⁻¹(x) = 3x + 7", "f⁻¹(x) = x/3 + 7"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Let y = 3x - 7, solve for x: x = (y + 7)/3, so f⁻¹(x) = (x + 7)/3"
  },
  {
    _id: "grade9_hard_math_005_real",
    content: "What is the probability of rolling two dice and getting a sum of 8?",
    type: "multiple_choice",
    options: ["5/36", "6/36", "7/36", "4/36"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Ways to get 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 ways out of 36 total"
  },
  {
    _id: "grade9_hard_math_006_real",
    content: "Factor completely: 3x² - 12x + 9",
    type: "multiple_choice",
    options: ["3(x - 1)(x - 3)", "3(x + 1)(x + 3)", "(3x - 3)(x - 3)", "3(x - 2)²"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x - 1)(x - 3)"
  },
  {
    _id: "grade9_hard_math_007_real",
    content: "Find the slope of the line passing through (-2, 5) and (3, -1)",
    type: "multiple_choice",
    options: ["-6/5", "-5/6", "6/5", "5/6"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (-1 - 5)/(3 - (-2)) = -6/5"
  },
  {
    _id: "grade9_hard_math_008_real",
    content: "Simplify: √(48x⁶y⁴)",
    type: "multiple_choice",
    options: ["4x³y²√3", "16x³y²", "4x³y²√12", "12x³y²"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "√(48x⁶y⁴) = √(16 × 3 × x⁶ × y⁴) = 4x³y²√3"
  },
  {
    _id: "grade9_hard_math_009_real",
    content: "If f(x) = x² - 4x + 3, find the vertex of the parabola",
    type: "multiple_choice",
    options: ["(2, -1)", "(2, 1)", "(-2, -1)", "(4, 3)"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Vertex x = -b/2a = 4/2 = 2. f(2) = 4 - 8 + 3 = -1. Vertex is (2, -1)"
  },
  {
    _id: "grade9_hard_math_010_real",
    content: "Solve: log₃(x + 2) = 2",
    type: "multiple_choice",
    options: ["x = 7", "x = 5", "x = 9", "x = 11"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "log₃(x + 2) = 2 means 3² = x + 2, so 9 = x + 2, therefore x = 7"
  },
  {
    _id: "grade9_hard_math_011_real",
    content: "What is sin(45°)?",
    type: "multiple_choice",
    options: ["√2/2", "1/2", "√3/2", "1"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "sin(45°) = √2/2 ≈ 0.707"
  },
  {
    _id: "grade9_hard_math_012_real",
    content: "Find the median of: 15, 22, 18, 31, 27, 19, 25",
    type: "multiple_choice",
    options: ["22", "23", "24", "25"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Ordered: 15, 18, 19, 22, 25, 27, 31. The middle value is 22"
  },
  {
    _id: "grade9_hard_math_013_real",
    content: "Solve the inequality: 3x - 7 > 2x + 5",
    type: "multiple_choice",
    options: ["x > 12", "x < 12", "x > -12", "x < -12"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "3x - 7 > 2x + 5, so 3x - 2x > 5 + 7, therefore x > 12"
  },
  {
    _id: "grade9_hard_math_014_real",
    content: "What is the distance between points (1, 3) and (5, 6)?",
    type: "multiple_choice",
    options: ["5", "7", "√7", "√25"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Distance = √[(5-1)² + (6-3)²] = √[16 + 9] = √25 = 5"
  },
  {
    _id: "grade9_hard_math_015_real",
    content: "Rationalize the denominator: 6/(2 + √3)",
    type: "multiple_choice",
    options: ["6(2 - √3)", "12 - 6√3", "(12 - 6√3)/1", "6(√3 - 2)"],
    correct_answer: 1,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Multiply by (2 - √3)/(2 - √3): 6(2 - √3)/(4 - 3) = 6(2 - √3) = 12 - 6√3"
  },
  {
    _id: "grade9_hard_math_016_real",
    content: "What is cos(60°)?",
    type: "multiple_choice",
    options: ["1/2", "√2/2", "√3/2", "1"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "cos(60°) = 1/2"
  },
  {
    _id: "grade9_hard_math_017_real",
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
    _id: "grade9_hard_math_018_real",
    content: "Find the range of the function f(x) = x² - 4x + 7",
    type: "multiple_choice",
    options: ["y ≥ 3", "y ≥ 7", "y ≥ -3", "y ≥ 0"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Complete the square: f(x) = (x - 2)² + 3. Minimum value is 3, so range is y ≥ 3"
  },
  {
    _id: "grade9_hard_math_019_real",
    content: "What is the area of a circle with radius 4 units?",
    type: "multiple_choice",
    options: ["16π", "8π", "4π", "32π"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "Area = πr² = π(4)² = 16π"
  },
  {
    _id: "grade9_hard_math_020_real",
    content: "Simplify: (x² - 16)/(x + 4)",
    type: "multiple_choice",
    options: ["x - 4", "x + 4", "x² - 4", "x + 16"],
    correct_answer: 0,
    subject: "Mathematics",
    grade: 9,
    difficulty: "hard",
    explanation: "(x² - 16)/(x + 4) = (x + 4)(x - 4)/(x + 4) = x - 4"
  }
];

function replaceWithRealGrade9HardMath() {
  console.log('🚨 REPLACING GENERIC GARBAGE WITH REAL GRADE 9 HARD MATH');
  console.log('=======================================================\n');

  const filePath = 'testace-app/frontend/public/questions/9_hard_math.json';
  
  console.log('✅ Replacing generic templates with REAL mathematical problems...');
  
  // Write the real questions
  fs.writeFileSync(filePath, JSON.stringify(realGrade9HardMathQuestions, null, 2));
  
  console.log(`✅ Replaced with ${realGrade9HardMathQuestions.length} REAL Grade 9 hard math questions`);
  
  // Show the variety of REAL topics
  console.log('\n🔍 REAL MATHEMATICAL TOPICS - All 20 questions:');
  realGrade9HardMathQuestions.forEach((q, i) => {
    const topic = q.content.includes('quadratic') ? 'Quadratic Equations' :
                  q.content.includes('standard deviation') ? 'Statistics' :
                  q.content.includes('system') ? 'Systems of Equations' :
                  q.content.includes('inverse') ? 'Inverse Functions' :
                  q.content.includes('probability') ? 'Probability' :
                  q.content.includes('Factor') ? 'Factoring' :
                  q.content.includes('slope') ? 'Linear Functions' :
                  q.content.includes('√') ? 'Radicals' :
                  q.content.includes('vertex') ? 'Parabolas' :
                  q.content.includes('log') ? 'Logarithms' :
                  q.content.includes('sin') || q.content.includes('cos') ? 'Trigonometry' :
                  q.content.includes('median') ? 'Statistics' :
                  q.content.includes('inequality') ? 'Inequalities' :
                  q.content.includes('distance') ? 'Distance Formula' :
                  q.content.includes('Rationalize') ? 'Rationalizing' :
                  q.content.includes('^') ? 'Exponentials' :
                  q.content.includes('range') ? 'Function Analysis' :
                  q.content.includes('area') ? 'Geometry' :
                  q.content.includes('Simplify') && q.content.includes('/') ? 'Rational Expressions' :
                  'Other';
    console.log(`${i + 1}. ${topic}: ${q.content}`);
  });
  
  console.log('\n✅ SUCCESS: Grade 9 hard math now has REAL mathematical problems!');
  console.log('No more generic "What is an important principle" garbage!');
}

replaceWithRealGrade9HardMath();
