const fs = require('fs');
const path = require('path');

console.log('📚 EXPANDING GRADE 9 HARD MATH TO 20 CHALLENGING QUESTIONS...');

// Generate 20 diverse, challenging Grade 9 hard math questions
const grade9HardMathQuestions = [
  {
    "_id": `alg9_${Date.now()}_001`,
    "content": "Solve the system: 2x + 3y = 7, x² + y² = 10",
    "type": "multiple_choice",
    "options": ["(1, 3) and (3, 1)", "(2, 1) and (-2, -1)", "(1, √7) and (3, -1)", "No real solutions"],
    "correctAnswer": "(1, 3) and (3, 1)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Substitute linear equation into quadratic to find intersection points"
  },
  {
    "_id": `alg9_${Date.now()}_002`,
    "content": "If f(x) = 2x² - 3x + 1, find the value of k such that f(k) = f(k+2)",
    "type": "multiple_choice",
    "options": ["k = 1/2", "k = -1/2", "k = 3/2", "k = -3/2"],
    "correctAnswer": "k = 1/2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Set up equation f(k) = f(k+2) and solve for k"
  },
  {
    "_id": `alg9_${Date.now()}_003`,
    "content": "In triangle ABC, if sin A : sin B : sin C = 3 : 5 : 7, find the ratio of the sides a : b : c",
    "type": "multiple_choice",
    "options": ["3 : 5 : 7", "7 : 5 : 3", "9 : 25 : 49", "Cannot be determined"],
    "correctAnswer": "3 : 5 : 7",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "By sine rule: a/sin A = b/sin B = c/sin C, so a : b : c = sin A : sin B : sin C"
  },
  {
    "_id": `alg9_${Date.now()}_004`,
    "content": "Find the remainder when x⁴ - 3x³ + 2x² - x + 5 is divided by (x - 2)",
    "type": "multiple_choice",
    "options": ["7", "11", "15", "19"],
    "correctAnswer": "11",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use remainder theorem: substitute x = 2 into the polynomial"
  },
  {
    "_id": `alg9_${Date.now()}_005`,
    "content": "If log₂(x) + log₄(x) + log₈(x) = 11, find x",
    "type": "multiple_choice",
    "options": ["16", "32", "64", "128"],
    "correctAnswer": "64",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Convert to same base: log₂(x) + ½log₂(x) + ⅓log₂(x) = 11"
  },
  {
    "_id": `alg9_${Date.now()}_006`,
    "content": "Solve for x: √(x + 3) + √(x - 1) = 4",
    "type": "multiple_choice",
    "options": ["x = 1", "x = 5", "x = 6", "x = 13"],
    "correctAnswer": "x = 13",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Square both sides carefully to eliminate radicals, check for extraneous solutions"
  },
  {
    "_id": `alg9_${Date.now()}_007`,
    "content": "Find the equation of the circle passing through points (0,0), (4,0), and (0,3)",
    "type": "multiple_choice",
    "options": ["(x-2)² + (y-1.5)² = 6.25", "(x-2)² + (y-1.5)² = 2.5", "x² + y² - 4x - 3y = 0", "x² + y² + 4x + 3y = 0"],
    "correctAnswer": "x² + y² - 4x - 3y = 0",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use general form x² + y² + Dx + Ey + F = 0 and substitute the three points"
  },
  {
    "_id": `alg9_${Date.now()}_008`,
    "content": "If the roots of x² - px + q = 0 are α and β, find the equation whose roots are α² and β²",
    "type": "multiple_choice",
    "options": ["x² - (p² - 2q)x + q² = 0", "x² - (p² + 2q)x + q² = 0", "x² + (p² - 2q)x - q² = 0", "x² - p²x + q² = 0"],
    "correctAnswer": "x² - (p² - 2q)x + q² = 0",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use α + β = p, αβ = q, then find α² + β² = (α + β)² - 2αβ and α²β² = (αβ)²"
  },
  {
    "_id": `alg9_${Date.now()}_009`,
    "content": "In an arithmetic progression, if the 5th term is 14 and the 12th term is 35, find the 20th term",
    "type": "multiple_choice",
    "options": ["53", "56", "59", "62"],
    "correctAnswer": "59",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Find first term and common difference: a₅ = a + 4d = 14, a₁₂ = a + 11d = 35"
  },
  {
    "_id": `alg9_${Date.now()}_010`,
    "content": "Solve the inequality: |2x - 3| > |x + 1|",
    "type": "multiple_choice",
    "options": ["x < -4 or x > 2/3", "x < 2/3 or x > 4", "x < -1/2 or x > 4", "x < 0 or x > 4"],
    "correctAnswer": "x < 2/3 or x > 4",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Square both sides: (2x-3)² > (x+1)², expand and solve the quadratic inequality"
  },
  {
    "_id": `alg9_${Date.now()}_011`,
    "content": "Find the value of k for which the equation kx² - 2(k+1)x + (k+5) = 0 has equal roots",
    "type": "multiple_choice",
    "options": ["k = -1/3", "k = 1/3", "k = -3", "k = 3"],
    "correctAnswer": "k = -1/3",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "For equal roots, discriminant = 0: b² - 4ac = 0"
  },
  {
    "_id": `alg9_${Date.now()}_012`,
    "content": "In triangle ABC, if a = 7, b = 8, and C = 60°, find the length of side c",
    "type": "multiple_choice",
    "options": ["√57", "√65", "√73", "√85"],
    "correctAnswer": "√57",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use cosine rule: c² = a² + b² - 2ab cos C = 49 + 64 - 2(7)(8)cos(60°)"
  },
  {
    "_id": `alg9_${Date.now()}_013`,
    "content": "Simplify: (x² - 4)/(x² - 4x + 4) ÷ (x + 2)/(x - 2)",
    "type": "multiple_choice",
    "options": ["(x - 2)/(x + 2)", "(x + 2)/(x - 2)", "1", "(x - 2)²/(x + 2)"],
    "correctAnswer": "(x - 2)/(x + 2)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Factor and multiply by reciprocal: [(x-2)(x+2)/(x-2)²] × [(x-2)/(x+2)]"
  },
  {
    "_id": `alg9_${Date.now()}_014`,
    "content": "If 3^(x+1) + 3^(x-1) = 30, find the value of x",
    "type": "multiple_choice",
    "options": ["x = 2", "x = 3", "x = 4", "x = 5"],
    "correctAnswer": "x = 3",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Factor out 3^(x-1): 3^(x-1)(3² + 1) = 30, so 3^(x-1) × 10 = 30"
  },
  {
    "_id": `alg9_${Date.now()}_015`,
    "content": "Find the coordinates of the vertex of the parabola y = 2x² - 8x + 5",
    "type": "multiple_choice",
    "options": ["(2, -3)", "(2, 3)", "(-2, -3)", "(-2, 3)"],
    "correctAnswer": "(2, -3)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use vertex formula x = -b/2a = 8/4 = 2, then substitute to find y"
  },
  {
    "_id": `alg9_${Date.now()}_016`,
    "content": "Solve: (x - 1)/(x + 2) + (x + 3)/(x - 4) = 2",
    "type": "multiple_choice",
    "options": ["x = 1, x = 7", "x = -1, x = 7", "x = 1, x = -7", "x = -1, x = -7"],
    "correctAnswer": "x = 1, x = 7",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Cross multiply and solve the resulting quadratic equation"
  },
  {
    "_id": `alg9_${Date.now()}_017`,
    "content": "In a geometric progression, if the 3rd term is 12 and the 6th term is 96, find the first term",
    "type": "multiple_choice",
    "options": ["1.5", "2", "3", "4"],
    "correctAnswer": "1.5",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use a₃ = ar² = 12 and a₆ = ar⁵ = 96 to find r = 2, then a = 1.5"
  },
  {
    "_id": `alg9_${Date.now()}_018`,
    "content": "Find the area of triangle with vertices at (1,2), (3,5), and (-2,4)",
    "type": "multiple_choice",
    "options": ["6.5", "7", "7.5", "8"],
    "correctAnswer": "7.5",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Use formula: Area = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|"
  },
  {
    "_id": `alg9_${Date.now()}_019`,
    "content": "If tan θ = 3/4 and θ is in the first quadrant, find sin 2θ",
    "type": "multiple_choice",
    "options": ["24/25", "7/25", "12/25", "9/25"],
    "correctAnswer": "24/25",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Find sin θ = 3/5, cos θ = 4/5, then sin 2θ = 2 sin θ cos θ = 2(3/5)(4/5)"
  },
  {
    "_id": `alg9_${Date.now()}_020`,
    "content": "Solve for x: x/(x-1) - (x-1)/x = 3/2",
    "type": "multiple_choice",
    "options": ["x = 2, x = -1/2", "x = 3, x = -1/3", "x = 4, x = -1/4", "x = 5, x = -1/5"],
    "correctAnswer": "x = 2, x = -1/2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "hard",
    "explanation": "Multiply through by x(x-1) and solve the resulting quadratic equation"
  }
];

// Update both locations
const locations = [
  '/workspaces/AWSQCLI/testace-app/public/questions/9_hard_math.json',
  '/workspaces/AWSQCLI/testace-app/frontend/public/questions/9_hard_math.json'
];

for (const location of locations) {
  if (fs.existsSync(location)) {
    fs.writeFileSync(location, JSON.stringify(grade9HardMathQuestions, null, 2));
    console.log(`✅ Updated ${location} with 20 challenging questions`);
  }
}

console.log('\n🎯 GRADE 9 HARD MATH EXPANDED TO 20 QUESTIONS!');
console.log('✅ All questions are challenging and diverse');
console.log('✅ Topics include: systems of equations, logarithms, trigonometry, polynomials');
console.log('✅ Advanced algebra, coordinate geometry, sequences and series');
console.log('✅ Perfect for Grade 9 advanced students');
console.log('\n📝 Refresh your browser to see all 20 questions!');
