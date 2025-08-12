#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// COMPREHENSIVE UNIQUE QUESTION DATABASE
// No duplications - each question is unique and grade-appropriate

const UNIQUE_QUESTIONS = {
  // THINKING SKILLS - Unique questions for each grade
  'thinking-skills': {
    9: {
      easy: [
        { content: "Expand: 3(x + 4)", options: ["3x + 4", "3x + 12", "x + 12", "3x + 7"], correctAnswer: "3x + 12", explanation: "3(x + 4) = 3x + 3(4) = 3x + 12." },
        { content: "What is the gradient of the line y = 2x + 5?", options: ["2", "5", "2x", "7"], correctAnswer: "2", explanation: "In y = mx + c form, the gradient is m = 2." },
        { content: "Solve for x: x + 7 = 15", options: ["6", "7", "8", "22"], correctAnswer: "8", explanation: "x + 7 = 15, so x = 15 - 7 = 8." },
        { content: "What is 15% of 200?", options: ["25", "30", "35", "40"], correctAnswer: "30", explanation: "15% of 200 = 0.15 × 200 = 30." },
        { content: "If 2x = 16, what is x?", options: ["6", "7", "8", "32"], correctAnswer: "8", explanation: "2x = 16, so x = 16 ÷ 2 = 8." },
        { content: "What is the next term in the sequence: 5, 8, 11, 14, ?", options: ["16", "17", "18", "19"], correctAnswer: "17", explanation: "The sequence increases by 3 each time: 14 + 3 = 17." },
        { content: "A triangle has angles 60° and 80°. What is the third angle?", options: ["40°", "50°", "60°", "140°"], correctAnswer: "40°", explanation: "Angles in a triangle sum to 180°: 180° - 60° - 80° = 40°." },
        { content: "What is 25% of 80?", options: ["15", "20", "25", "30"], correctAnswer: "20", explanation: "25% = 1/4, so 25% of 80 = 80 ÷ 4 = 20." },
        { content: "If y = x + 3, what is y when x = 5?", options: ["2", "8", "15", "53"], correctAnswer: "8", explanation: "Substitute x = 5: y = 5 + 3 = 8." },
        { content: "Round 47.3 to the nearest whole number.", options: ["47", "48", "50", "40"], correctAnswer: "47", explanation: "47.3 is closer to 47 than to 48." },
        { content: "What is the perimeter of a square with side length 6cm?", options: ["12cm", "18cm", "24cm", "36cm"], correctAnswer: "24cm", explanation: "Perimeter of square = 4 × side = 4 × 6 = 24cm." },
        { content: "Solve: 3x + 2 = 14", options: ["x = 3", "x = 4", "x = 5", "x = 16"], correctAnswer: "x = 4", explanation: "3x + 2 = 14, so 3x = 12, therefore x = 4." },
        { content: "What is the area of a circle with radius 3? (Use π ≈ 3.14)", options: ["18.84", "28.26", "37.68", "113.04"], correctAnswer: "28.26", explanation: "Area = πr² = 3.14 × 3² = 3.14 × 9 = 28.26." },
        { content: "If a = 4 and b = 7, what is a + 2b?", options: ["15", "18", "22", "28"], correctAnswer: "18", explanation: "a + 2b = 4 + 2(7) = 4 + 14 = 18." },
        { content: "What is 40% of 150?", options: ["50", "60", "70", "80"], correctAnswer: "60", explanation: "40% of 150 = 0.40 × 150 = 60." },
        { content: "A rectangle has length 9cm and width 4cm. What is its area?", options: ["13 cm²", "26 cm²", "36 cm²", "81 cm²"], correctAnswer: "36 cm²", explanation: "Area = length × width = 9 × 4 = 36 cm²." },
        { content: "What is the value of 2³?", options: ["6", "8", "9", "23"], correctAnswer: "8", explanation: "2³ = 2 × 2 × 2 = 8." },
        { content: "If 5x = 35, what is x?", options: ["6", "7", "8", "30"], correctAnswer: "7", explanation: "5x = 35, so x = 35 ÷ 5 = 7." },
        { content: "What is the mean of: 10, 12, 14, 16?", options: ["12", "13", "14", "15"], correctAnswer: "13", explanation: "Mean = (10 + 12 + 14 + 16) ÷ 4 = 52 ÷ 4 = 13." },
        { content: "A cube has side length 5cm. What is its volume?", options: ["15 cm³", "25 cm³", "75 cm³", "125 cm³"], correctAnswer: "125 cm³", explanation: "Volume of cube = side³ = 5³ = 125 cm³." }
      ],
      medium: [
        { content: "Solve: 2x + 3 = 11", options: ["x = 3", "x = 4", "x = 5", "x = 7"], correctAnswer: "x = 4", explanation: "2x + 3 = 11, so 2x = 8, therefore x = 4." },
        { content: "Factorise: x² - 9", options: ["(x - 3)²", "(x + 3)²", "(x - 3)(x + 3)", "x(x - 9)"], correctAnswer: "(x - 3)(x + 3)", explanation: "x² - 9 is a difference of squares: x² - 3² = (x - 3)(x + 3)." },
        { content: "If the gradient of a line is 3 and it passes through (0, 2), what is its equation?", options: ["y = 3x + 2", "y = 2x + 3", "y = 3x - 2", "y = x + 5"], correctAnswer: "y = 3x + 2", explanation: "Using y = mx + c with m = 3 and c = 2: y = 3x + 2." },
        { content: "A cylinder has radius 4cm and height 6cm. What is its volume? (Use π ≈ 3.14)", options: ["75.36 cm³", "150.72 cm³", "301.44 cm³", "602.88 cm³"], correctAnswer: "301.44 cm³", explanation: "Volume = πr²h = 3.14 × 4² × 6 = 3.14 × 16 × 6 = 301.44 cm³." },
        { content: "Solve the simultaneous equations: x + y = 7 and x - y = 1", options: ["x = 3, y = 4", "x = 4, y = 3", "x = 5, y = 2", "x = 2, y = 5"], correctAnswer: "x = 4, y = 3", explanation: "Add equations: 2x = 8, so x = 4. Substitute: 4 + y = 7, so y = 3." },
        { content: "What is the area of a triangle with base 8cm and height 5cm?", options: ["13 cm²", "20 cm²", "40 cm²", "80 cm²"], correctAnswer: "20 cm²", explanation: "Area = ½ × base × height = ½ × 8 × 5 = 20 cm²." },
        { content: "If sin θ = 0.5, what is θ? (θ is acute)", options: ["30°", "45°", "60°", "90°"], correctAnswer: "30°", explanation: "sin 30° = 0.5." },
        { content: "Expand: (x + 3)(x + 2)", options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6x + 6"], correctAnswer: "x² + 5x + 6", explanation: "(x + 3)(x + 2) = x² + 2x + 3x + 6 = x² + 5x + 6." },
        { content: "What is the circumference of a circle with diameter 10cm? (Use π ≈ 3.14)", options: ["15.7cm", "31.4cm", "62.8cm", "314cm"], correctAnswer: "31.4cm", explanation: "Circumference = πd = 3.14 × 10 = 31.4cm." },
        { content: "If 3x - 5 = 16, what is x?", options: ["x = 6", "x = 7", "x = 8", "x = 11"], correctAnswer: "x = 7", explanation: "3x - 5 = 16, so 3x = 21, therefore x = 7." },
        { content: "What is the range of the data: 12, 8, 15, 10, 20?", options: ["8", "10", "12", "13"], correctAnswer: "12", explanation: "Range = highest - lowest = 20 - 8 = 12." },
        { content: "A right triangle has legs of 3cm and 4cm. What is the hypotenuse?", options: ["5cm", "6cm", "7cm", "25cm"], correctAnswer: "5cm", explanation: "Using Pythagoras: c² = 3² + 4² = 9 + 16 = 25, so c = 5cm." },
        { content: "What is 3² + 4²?", options: ["7", "14", "25", "49"], correctAnswer: "25", explanation: "3² + 4² = 9 + 16 = 25." },
        { content: "If y = 2x - 1, what is y when x = 6?", options: ["11", "12", "13", "17"], correctAnswer: "11", explanation: "y = 2(6) - 1 = 12 - 1 = 11." },
        { content: "What is the median of: 5, 8, 12, 15, 20?", options: ["8", "10", "12", "15"], correctAnswer: "12", explanation: "The median is the middle value when arranged in order: 12." },
        { content: "Solve: x/4 = 7", options: ["x = 3", "x = 11", "x = 28", "x = 4"], correctAnswer: "x = 28", explanation: "x/4 = 7, so x = 7 × 4 = 28." },
        { content: "What is the surface area of a cube with side 4cm?", options: ["16 cm²", "64 cm²", "96 cm²", "256 cm²"], correctAnswer: "96 cm²", explanation: "Surface area = 6 × side² = 6 × 4² = 6 × 16 = 96 cm²." },
        { content: "If cos θ = 0.6, what is sin θ? (θ is acute)", options: ["0.4", "0.6", "0.8", "1.0"], correctAnswer: "0.8", explanation: "Using sin²θ + cos²θ = 1: sin²θ = 1 - 0.36 = 0.64, so sin θ = 0.8." },
        { content: "What is the probability of rolling a 6 on a fair die?", options: ["1/2", "1/3", "1/6", "1/12"], correctAnswer: "1/6", explanation: "There is 1 favorable outcome out of 6 possible outcomes." },
        { content: "Simplify: 2x + 3x - x", options: ["4x", "5x", "6x", "2x"], correctAnswer: "4x", explanation: "2x + 3x - x = (2 + 3 - 1)x = 4x." }
      ],
      hard: [
        { content: "Solve: x² - 5x + 6 = 0", options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 5, 1"], correctAnswer: "x = 2, 3", explanation: "Factoring: (x - 2)(x - 3) = 0, so x = 2 or x = 3." },
        { content: "If log₂(x) = 3, what is x?", options: ["6", "8", "9", "23"], correctAnswer: "8", explanation: "log₂(x) = 3 means 2³ = x, so x = 8." },
        { content: "What is the derivative of f(x) = x³?", options: ["3x", "3x²", "x²", "3x³"], correctAnswer: "3x²", explanation: "Using the power rule: d/dx(x³) = 3x²." },
        { content: "Solve the inequality: 2x + 3 > 11", options: ["x > 4", "x > 7", "x < 4", "x < 7"], correctAnswer: "x > 4", explanation: "2x + 3 > 11, so 2x > 8, therefore x > 4." },
        { content: "What is the sum of the first 10 positive integers?", options: ["45", "50", "55", "100"], correctAnswer: "55", explanation: "Sum = n(n+1)/2 = 10(11)/2 = 55." },
        { content: "If 2^x = 32, what is x?", options: ["4", "5", "6", "16"], correctAnswer: "5", explanation: "2⁵ = 32, so x = 5." },
        { content: "What is the area of a sector with radius 6cm and central angle 60°?", options: ["6π cm²", "3π cm²", "18π cm²", "36π cm²"], correctAnswer: "6π cm²", explanation: "Area = (θ/360°) × πr² = (60°/360°) × π × 6² = (1/6) × 36π = 6π cm²." },
        { content: "Solve: 3x² - 12 = 0", options: ["x = ±2", "x = ±3", "x = ±4", "x = ±6"], correctAnswer: "x = ±2", explanation: "3x² = 12, so x² = 4, therefore x = ±2." },
        { content: "What is the inverse of the function f(x) = 2x + 1?", options: ["f⁻¹(x) = (x-1)/2", "f⁻¹(x) = (x+1)/2", "f⁻¹(x) = 2x - 1", "f⁻¹(x) = x/2 + 1"], correctAnswer: "f⁻¹(x) = (x-1)/2", explanation: "Let y = 2x + 1. Solve for x: x = (y-1)/2. So f⁻¹(x) = (x-1)/2." },
        { content: "What is the distance between points (1, 2) and (4, 6)?", options: ["3", "4", "5", "7"], correctAnswer: "5", explanation: "Distance = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5." },
        { content: "If tan θ = 1, what is θ? (0° < θ < 90°)", options: ["30°", "45°", "60°", "90°"], correctAnswer: "45°", explanation: "tan 45° = 1." },
        { content: "What is the coefficient of x² in the expansion of (x + 2)³?", options: ["3", "6", "8", "12"], correctAnswer: "6", explanation: "(x + 2)³ = x³ + 3x²(2) + 3x(2²) + 2³. The x² term is 3x²(2) = 6x²." },
        { content: "Solve: |x - 3| = 5", options: ["x = 8", "x = -2", "x = 8 or -2", "x = 2 or 8"], correctAnswer: "x = 8 or -2", explanation: "|x - 3| = 5 means x - 3 = 5 or x - 3 = -5, so x = 8 or x = -2." },
        { content: "What is the period of the function f(x) = sin(2x)?", options: ["π/2", "π", "2π", "4π"], correctAnswer: "π", explanation: "For sin(kx), the period is 2π/k. So for sin(2x), period = 2π/2 = π." },
        { content: "If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, what is P(A ∩ B)?", options: ["0.12", "0.7", "0.1", "0.58"], correctAnswer: "0.12", explanation: "For independent events: P(A ∩ B) = P(A) × P(B) = 0.3 × 0.4 = 0.12." },
        { content: "What is the sum of an arithmetic sequence with first term 5, last term 25, and 6 terms?", options: ["90", "120", "150", "180"], correctAnswer: "90", explanation: "Sum = n(first + last)/2 = 6(5 + 25)/2 = 6(30)/2 = 90." },
        { content: "Solve: log(x) + log(x + 3) = 1", options: ["x = 2", "x = 3", "x = 5", "x = 7"], correctAnswer: "x = 2", explanation: "log(x(x+3)) = 1, so x(x+3) = 10, x² + 3x - 10 = 0, (x+5)(x-2) = 0. Since x > 0, x = 2." },
        { content: "What is the area under the curve y = x² from x = 0 to x = 2?", options: ["4/3", "8/3", "4", "8"], correctAnswer: "8/3", explanation: "∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3." },
        { content: "If the roots of x² + px + q = 0 are 2 and 3, what is p + q?", options: ["1", "11", "5", "-1"], correctAnswer: "1", explanation: "If roots are 2 and 3, then x² - 5x + 6 = 0. So p = -5, q = 6, and p + q = 1." },
        { content: "What is the maximum value of f(x) = -x² + 4x + 1?", options: ["1", "3", "5", "9"], correctAnswer: "5", explanation: "Complete the square: f(x) = -(x-2)² + 5. Maximum value is 5 at x = 2." }
      ]
    }
  }
};

function createUniqueQuestions() {
  console.log('🔧 Fixing question duplications with unique content...\n');
  
  const questionsDir = '/workspaces/AWSQCLI/testace-app/public/questions';
  const frontendQuestionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
  
  // Fix Grade 9 Thinking Skills specifically
  const grade = 9;
  const subject = 'thinking-skills';
  const difficulties = ['easy', 'medium', 'hard'];
  
  for (const difficulty of difficulties) {
    const filename = `${grade}_${difficulty}_${subject}.json`;
    
    if (UNIQUE_QUESTIONS[subject][grade] && UNIQUE_QUESTIONS[subject][grade][difficulty]) {
      const uniqueQuestions = UNIQUE_QUESTIONS[subject][grade][difficulty];
      
      const questions = uniqueQuestions.map((q, index) => ({
        _id: `grade${grade}_${difficulty}_${subject}_${String(index + 1).padStart(3, '0')}`,
        content: q.content,
        type: "multiple_choice",
        options: q.options,
        correctAnswer: q.correctAnswer,
        subject: "Thinking Skills",
        grade: grade,
        difficulty: difficulty,
        explanation: q.explanation
      }));
      
      // Write to both directories
      [questionsDir, frontendQuestionsDir].forEach(dir => {
        const filePath = path.join(dir, filename);
        fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
      });
      
      console.log(`✅ Fixed ${filename} with ${questions.length} UNIQUE questions`);
      console.log(`   Sample: "${questions[0].content}"`);
      console.log(`   Sample: "${questions[1].content}"`);
      console.log(`   Sample: "${questions[2].content}"`);
    }
  }
  
  console.log('\n🎉 Grade 9 Thinking Skills duplications eliminated!');
  console.log('📚 Each question is now unique and educationally valuable.');
}

// Run the fix
if (require.main === module) {
  createUniqueQuestions();
}

module.exports = { createUniqueQuestions, UNIQUE_QUESTIONS };
