const fs = require('fs');

console.log('📚 CREATING 20 PROPER GRADE 9 MEDIUM MATH QUESTIONS...');

// Grade 9 Medium Math - Appropriately challenging for medium level
const grade9MediumMath = [
  {
    "_id": `med9_${Date.now()}_001`,
    "content": "Solve for x: 3x + 7 = 22",
    "type": "multiple_choice",
    "options": ["x = 5", "x = 7", "x = 15", "x = 29"],
    "correctAnswer": "x = 5",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5"
  },
  {
    "_id": `med9_${Date.now()}_002`,
    "content": "Factor completely: x² - 9",
    "type": "multiple_choice",
    "options": ["(x - 3)(x + 3)", "(x - 9)(x + 1)", "x(x - 9)", "Cannot be factored"],
    "correctAnswer": "(x - 3)(x + 3)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "This is a difference of squares: a² - b² = (a - b)(a + b)"
  },
  {
    "_id": `med9_${Date.now()}_003`,
    "content": "Find the slope of the line passing through (2, 5) and (6, 13)",
    "type": "multiple_choice",
    "options": ["m = 2", "m = 3", "m = 4", "m = 8"],
    "correctAnswer": "m = 2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Use slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (13 - 5)/(6 - 2) = 8/4 = 2"
  },
  {
    "_id": `med9_${Date.now()}_004`,
    "content": "Solve: x² - 5x + 6 = 0",
    "type": "multiple_choice",
    "options": ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 5, 1"],
    "correctAnswer": "x = 2, 3",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3"
  },
  {
    "_id": `med9_${Date.now()}_005`,
    "content": "Simplify: (2x³)(3x²)",
    "type": "multiple_choice",
    "options": ["5x⁵", "6x⁵", "6x⁶", "5x⁶"],
    "correctAnswer": "6x⁵",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Multiply coefficients and add exponents: 2 × 3 = 6, x³ × x² = x⁵"
  },
  {
    "_id": `med9_${Date.now()}_006`,
    "content": "What is the y-intercept of y = 2x - 7?",
    "type": "multiple_choice",
    "options": ["2", "-7", "7", "-2"],
    "correctAnswer": "-7",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "In y = mx + b form, b is the y-intercept, so y-intercept = -7"
  },
  {
    "_id": `med9_${Date.now()}_007`,
    "content": "Expand: (x + 4)(x - 2)",
    "type": "multiple_choice",
    "options": ["x² + 2x - 8", "x² - 2x + 8", "x² + 2x + 8", "x² - 2x - 8"],
    "correctAnswer": "x² + 2x - 8",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Use FOIL: x² - 2x + 4x - 8 = x² + 2x - 8"
  },
  {
    "_id": `med9_${Date.now()}_008`,
    "content": "Solve for y: 2y - 3x = 12",
    "type": "multiple_choice",
    "options": ["y = (3x + 12)/2", "y = (12 + 3x)/2", "y = 6 + 3x/2", "y = 12 - 3x/2"],
    "correctAnswer": "y = 6 + 3x/2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Add 3x to both sides: 2y = 12 + 3x, then divide by 2: y = 6 + 3x/2"
  },
  {
    "_id": `med9_${Date.now()}_009`,
    "content": "Find the distance between points (1, 2) and (4, 6)",
    "type": "multiple_choice",
    "options": ["5", "7", "√7", "√25"],
    "correctAnswer": "5",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Use distance formula: d = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5"
  },
  {
    "_id": `med9_${Date.now()}_010`,
    "content": "Simplify: √48",
    "type": "multiple_choice",
    "options": ["4√3", "6√2", "3√16", "2√12"],
    "correctAnswer": "4√3",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "√48 = √(16 × 3) = √16 × √3 = 4√3"
  },
  {
    "_id": `med9_${Date.now()}_011`,
    "content": "If f(x) = 2x + 3, find f(5)",
    "type": "multiple_choice",
    "options": ["10", "13", "8", "11"],
    "correctAnswer": "13",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Substitute x = 5: f(5) = 2(5) + 3 = 10 + 3 = 13"
  },
  {
    "_id": `med9_${Date.now()}_012`,
    "content": "Solve the inequality: 3x - 5 > 7",
    "type": "multiple_choice",
    "options": ["x > 4", "x < 4", "x > 2", "x < 2"],
    "correctAnswer": "x > 4",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Add 5 to both sides: 3x > 12, then divide by 3: x > 4"
  },
  {
    "_id": `med9_${Date.now()}_013`,
    "content": "Find the midpoint of the segment from (2, 8) to (6, 4)",
    "type": "multiple_choice",
    "options": ["(4, 6)", "(8, 12)", "(4, 2)", "(2, 6)"],
    "correctAnswer": "(4, 6)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Midpoint formula: ((x₁+x₂)/2, (y₁+y₂)/2) = ((2+6)/2, (8+4)/2) = (4, 6)"
  },
  {
    "_id": `med9_${Date.now()}_014`,
    "content": "Factor: x² + 7x + 12",
    "type": "multiple_choice",
    "options": ["(x + 3)(x + 4)", "(x + 2)(x + 6)", "(x + 1)(x + 12)", "(x - 3)(x - 4)"],
    "correctAnswer": "(x + 3)(x + 4)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Find two numbers that multiply to 12 and add to 7: 3 and 4"
  },
  {
    "_id": `med9_${Date.now()}_015`,
    "content": "Simplify: (x⁴)³",
    "type": "multiple_choice",
    "options": ["x⁷", "x¹²", "3x⁴", "x⁴³"],
    "correctAnswer": "x¹²",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Use power rule: (xᵃ)ᵇ = xᵃᵇ, so (x⁴)³ = x⁴ˣ³ = x¹²"
  },
  {
    "_id": `med9_${Date.now()}_016`,
    "content": "What is the vertex of y = x² - 4x + 3?",
    "type": "multiple_choice",
    "options": ["(2, -1)", "(-2, 1)", "(4, 3)", "(-4, -3)"],
    "correctAnswer": "(2, -1)",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "x-coordinate: x = -b/2a = 4/2 = 2, y-coordinate: y = (2)² - 4(2) + 3 = -1"
  },
  {
    "_id": `med9_${Date.now()}_017`,
    "content": "Solve: |x - 3| = 5",
    "type": "multiple_choice",
    "options": ["x = 8, -2", "x = 2, 8", "x = -8, 2", "x = 3, 5"],
    "correctAnswer": "x = 8, -2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "x - 3 = 5 or x - 3 = -5, so x = 8 or x = -2"
  },
  {
    "_id": `med9_${Date.now()}_018`,
    "content": "Find the equation of the line with slope 3 passing through (1, 5)",
    "type": "multiple_choice",
    "options": ["y = 3x + 2", "y = 3x - 2", "y = 3x + 5", "y = 3x + 8"],
    "correctAnswer": "y = 3x + 2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Use point-slope form: y - 5 = 3(x - 1), simplify: y = 3x + 2"
  },
  {
    "_id": `med9_${Date.now()}_019`,
    "content": "Simplify: 3√2 + 5√2",
    "type": "multiple_choice",
    "options": ["8√2", "15√2", "8√4", "√34"],
    "correctAnswer": "8√2",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Combine like terms: (3 + 5)√2 = 8√2"
  },
  {
    "_id": `med9_${Date.now()}_020`,
    "content": "If the perimeter of a rectangle is 24 and the length is 8, what is the width?",
    "type": "multiple_choice",
    "options": ["4", "6", "8", "16"],
    "correctAnswer": "4",
    "subject": "Mathematics",
    "grade": 9,
    "difficulty": "medium",
    "explanation": "Perimeter = 2(length + width), so 24 = 2(8 + w), 12 = 8 + w, w = 4"
  }
];

// Update both locations
const locations = [
  '/workspaces/AWSQCLI/testace-app/public/questions/9_medium_math.json',
  '/workspaces/AWSQCLI/testace-app/frontend/public/questions/9_medium_math.json'
];

for (const location of locations) {
  if (fs.existsSync(location)) {
    fs.writeFileSync(location, JSON.stringify(grade9MediumMath, null, 2));
    console.log(`✅ Updated ${location} with 20 proper medium-level questions`);
  }
}

console.log('\n🎯 GRADE 9 MEDIUM MATH CREATED WITH 20 PROPER QUESTIONS!');
console.log('✅ Topics: Linear equations, factoring, graphing, quadratics');
console.log('✅ Functions, inequalities, radicals, coordinate geometry');
console.log('✅ Perfect medium difficulty for Grade 9 students');
console.log('\n📝 Refresh your browser - Grade 9 medium math should now show 20 questions!');
