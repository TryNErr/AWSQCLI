import { Question, DifficultyLevel, QuestionType } from '../types';
import { shuffleArray, getRandomInt } from './questionUtils';
import { generateId } from './idGenerator';

// Enhanced Math Question Generator with Challenging, Grade-Appropriate Questions
// Based on Common Core Standards, Cambridge Assessment, and International Curricula

interface MathConcept {
  concept: string;
  gradeRange: number[];
  difficultyFactors: {
    easy: any;
    medium: any;
    hard: any;
  };
}

// Grade-specific mathematical concepts and their complexity
const mathConcepts: Record<string, MathConcept[]> = {
  "1": [
    {
      concept: "addition_within_20",
      gradeRange: [1, 2],
      difficultyFactors: {
        easy: { range: [1, 10], carryOver: false },
        medium: { range: [5, 20], carryOver: true },
        hard: { range: [10, 20], wordProblems: true }
      }
    },
    {
      concept: "place_value",
      gradeRange: [1, 3],
      difficultyFactors: {
        easy: { digits: 2, concepts: ["tens", "ones"] },
        medium: { digits: 3, concepts: ["hundreds", "tens", "ones"] },
        hard: { digits: 3, comparison: true }
      }
    }
  ],
  "2": [
    {
      concept: "addition_subtraction_100",
      gradeRange: [2, 3],
      difficultyFactors: {
        easy: { range: [10, 50], operations: ["addition"] },
        medium: { range: [20, 100], operations: ["addition", "subtraction"] },
        hard: { range: [50, 100], multiStep: true }
      }
    },
    {
      concept: "measurement_time",
      gradeRange: [2, 4],
      difficultyFactors: {
        easy: { units: ["hours"], precision: "hour" },
        medium: { units: ["hours", "minutes"], precision: "15min" },
        hard: { units: ["hours", "minutes"], elapsed: true }
      }
    }
  ],
  "3": [
    {
      concept: "multiplication_division",
      gradeRange: [3, 5],
      difficultyFactors: {
        easy: { factors: [2, 3, 4, 5], singleDigit: true },
        medium: { factors: [6, 7, 8, 9], arrays: true },
        hard: { factors: [1, 12], wordProblems: true, multiStep: true }
      }
    },
    {
      concept: "fractions_basic",
      gradeRange: [3, 5],
      difficultyFactors: {
        easy: { denominators: [2, 3, 4], visual: true },
        medium: { denominators: [5, 6, 8], comparison: true },
        hard: { denominators: [10, 12], equivalent: true }
      }
    }
  ],
  "4": [
    {
      concept: "multi_digit_arithmetic",
      gradeRange: [4, 6],
      difficultyFactors: {
        easy: { digits: 2, operations: ["addition", "subtraction"] },
        medium: { digits: 3, operations: ["multiplication"], factors: [1, 9] },
        hard: { digits: 4, operations: ["division"], remainders: true }
      }
    },
    {
      concept: "decimal_operations",
      gradeRange: [4, 6],
      difficultyFactors: {
        easy: { places: 1, operations: ["addition"] },
        medium: { places: 2, operations: ["subtraction"] },
        hard: { places: 2, operations: ["multiplication"], factors: [10, 100] }
      }
    }
  ],
  "5": [
    {
      concept: "fraction_operations",
      gradeRange: [5, 7],
      difficultyFactors: {
        easy: { operations: ["addition"], sameDenominator: true },
        medium: { operations: ["subtraction"], differentDenominator: true },
        hard: { operations: ["multiplication", "division"], mixedNumbers: true }
      }
    },
    {
      concept: "algebraic_thinking",
      gradeRange: [5, 8],
      difficultyFactors: {
        easy: { variables: 1, operations: ["addition", "subtraction"] },
        medium: { variables: 1, operations: ["multiplication", "division"] },
        hard: { variables: 2, systems: true }
      }
    }
  ]
};

// Enhanced question generators for each concept
class EnhancedMathQuestionGenerator {
  
  // Generate challenging addition questions with real-world contexts
  static generateAdvancedAddition(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    const contexts = [
      "shopping", "sports", "travel", "cooking", "science", "nature"
    ];
    const context = contexts[getRandomInt(0, contexts.length - 1)];
    
    let num1: number, num2: number, num3: number | null = null;
    let questionText: string;
    let explanation: string;
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        num1 = getRandomInt(15, 35 * gradeNum);
        num2 = getRandomInt(12, 28 * gradeNum);
        break;
      case DifficultyLevel.MEDIUM:
        num1 = getRandomInt(45, 85 * gradeNum);
        num2 = getRandomInt(38, 72 * gradeNum);
        num3 = getRandomInt(25, 45 * gradeNum);
        break;
      case DifficultyLevel.HARD:
        num1 = getRandomInt(125, 275 * gradeNum);
        num2 = getRandomInt(98, 234 * gradeNum);
        num3 = getRandomInt(67, 156 * gradeNum);
        break;
    }
    
    // Create contextual word problems
    switch (context) {
      case "shopping":
        if (num3) {
          questionText = `Sarah bought a book for $${num1}, a pen for $${num2}, and a notebook for $${num3}. How much did she spend in total?`;
          explanation = `To find the total cost, we add all three amounts:\n$${num1} + $${num2} + $${num3} = $${num1 + num2 + num3}`;
        } else {
          questionText = `Tom bought a shirt for $${num1} and pants for $${num2}. What was his total cost?`;
          explanation = `Total cost = $${num1} + $${num2} = $${num1 + num2}`;
        }
        break;
      case "sports":
        if (num3) {
          questionText = `In a basketball game, Team A scored ${num1} points in the first half, ${num2} points in the third quarter, and ${num3} points in the fourth quarter. What was their total score?`;
          explanation = `Total score = ${num1} + ${num2} + ${num3} = ${num1 + num2 + num3} points`;
        } else {
          questionText = `A runner completed ${num1} meters in the first lap and ${num2} meters in the second lap. What is the total distance?`;
          explanation = `Total distance = ${num1} + ${num2} = ${num1 + num2} meters`;
        }
        break;
      default:
        questionText = num3 ? 
          `Calculate: ${num1} + ${num2} + ${num3}` : 
          `Calculate: ${num1} + ${num2}`;
        explanation = num3 ? 
          `${num1} + ${num2} + ${num3} = ${num1 + num2 + num3}` : 
          `${num1} + ${num2} = ${num1 + num2}`;
    }
    
    const answer = num3 ? num1 + num2 + num3 : num1 + num2;
    
    // Generate sophisticated wrong options
    const wrongOptions: number[] = [];
    const errorTypes = [
      answer + getRandomInt(5, 15), // Addition error
      answer - getRandomInt(3, 12), // Subtraction error
      Math.floor(answer * 1.1), // 10% increase
      Math.floor(answer * 0.9), // 10% decrease
    ];
    
    errorTypes.forEach(option => {
      if (option > 0 && option !== answer && !wrongOptions.includes(option)) {
        wrongOptions.push(option);
      }
    });
    
    while (wrongOptions.length < 3) {
      const offset = getRandomInt(8, 25);
      const wrongAnswer = Math.random() < 0.5 ? answer + offset : answer - offset;
      if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
        wrongOptions.push(wrongAnswer);
      }
    }
    
    const options = shuffleArray([answer.toString(), ...wrongOptions.slice(0, 3).map(o => o.toString())]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer.toString(),
      explanation,
      subject: 'Math',
      topic: 'Advanced Addition',
      difficulty,
      tags: ['addition', 'word-problems', 'real-world', context],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate challenging fraction questions
  static generateAdvancedFractions(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    // Helper functions for fraction operations
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };
    
    const lcm = (a: number, b: number): number => {
      return Math.abs(a * b) / gcd(a, b);
    };
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Equivalent fractions
        const baseFraction = [2, 3, 4, 5][getRandomInt(0, 3)];
        const multiplier = getRandomInt(2, 4);
        const num1 = 1 * multiplier;
        const den1 = baseFraction * multiplier;
        
        questionText = `Which fraction is equivalent to ${num1}/${den1}?`;
        answer = `1/${baseFraction}`;
        explanation = `${num1}/${den1} = ${num1 / multiplier}/${den1 / multiplier} = 1/${baseFraction}`;
        break;
        
      case DifficultyLevel.MEDIUM:
        // Adding fractions with different denominators
        const den2 = [4, 6, 8, 12][getRandomInt(0, 3)];
        const den3 = [3, 5, 9, 15][getRandomInt(0, 3)];
        const num2 = getRandomInt(1, den2 - 1);
        const num3 = getRandomInt(1, den3 - 1);
        
        const commonDen = lcm(den2, den3);
        const newNum2 = num2 * (commonDen / den2);
        const newNum3 = num3 * (commonDen / den3);
        const resultNum = newNum2 + newNum3;
        
        // Simplify result
        const resultGcd = gcd(resultNum, commonDen);
        const finalNum = resultNum / resultGcd;
        const finalDen = commonDen / resultGcd;
        
        questionText = `What is ${num2}/${den2} + ${num3}/${den3}?`;
        answer = finalDen === 1 ? finalNum.toString() : `${finalNum}/${finalDen}`;
        explanation = `Convert to common denominator ${commonDen}: ${newNum2}/${commonDen} + ${newNum3}/${commonDen} = ${resultNum}/${commonDen} = ${answer}`;
        break;
        
      case DifficultyLevel.HARD:
        // Mixed number operations
        const whole1 = getRandomInt(2, 5);
        const fNum1 = getRandomInt(1, 3);
        const fDen1 = getRandomInt(4, 8);
        const whole2 = getRandomInt(1, 4);
        const fNum2 = getRandomInt(1, 3);
        const fDen2 = getRandomInt(4, 8);
        
        questionText = `A recipe calls for ${whole1} ${fNum1}/${fDen1} cups of flour and ${whole2} ${fNum2}/${fDen2} cups of sugar. How much more flour than sugar is needed?`;
        
        // Convert to improper fractions
        const improper1 = whole1 * fDen1 + fNum1;
        const improper2 = whole2 * fDen2 + fNum2;
        
        // Subtract (assuming flour > sugar for positive result)
        const commonDen2 = lcm(fDen1, fDen2);
        const newImp1 = improper1 * (commonDen2 / fDen1);
        const newImp2 = improper2 * (commonDen2 / fDen2);
        const diffNum = Math.abs(newImp1 - newImp2);
        
        // Convert back to mixed number
        const wholeResult = Math.floor(diffNum / commonDen2);
        const fracResult = diffNum % commonDen2;
        
        answer = fracResult === 0 ? wholeResult.toString() : 
                wholeResult === 0 ? `${fracResult}/${commonDen2}` : 
                `${wholeResult} ${fracResult}/${commonDen2}`;
        
        explanation = `Convert to improper fractions, find common denominator, subtract, then convert back to mixed number.`;
        break;
    }
    
    // Generate wrong options for fractions
    const wrongOptions: string[] = [];
    // Add common fraction mistakes
    wrongOptions.push("1/2", "2/3", "3/4", "1/4", "5/6", "7/8");
    
    const options = shuffleArray([answer, ...wrongOptions.filter(opt => opt !== answer).slice(0, 3)]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: 'Advanced Fractions',
      difficulty,
      tags: ['fractions', 'operations', 'mixed-numbers'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate algebraic thinking questions
  static generateAlgebraicThinking(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    // Adjust complexity based on grade level
    if (gradeNum <= 5) {
      // Elementary algebra
      switch (difficulty) {
        case DifficultyLevel.EASY:
          // Simple patterns and sequences
          const start = getRandomInt(3, 15);
          const increment = getRandomInt(2, 7);
          const sequence = [start, start + increment, start + 2*increment, start + 3*increment];
          const nextValue = start + 4*increment;
          
          questionText = `What comes next in this pattern: ${sequence.join(', ')}, ?`;
          answer = nextValue.toString();
          explanation = `This is an arithmetic sequence with a common difference of ${increment}. Each term increases by ${increment}.`;
          break;
          
        case DifficultyLevel.MEDIUM:
          // Simple equations
          const coefficient = getRandomInt(2, 8);
          const constant = getRandomInt(10, 30);
          const result = getRandomInt(20, 50);
          const variable = Math.floor((result - constant) / coefficient);
          
          questionText = `If ${coefficient}x + ${constant} = ${result}, what is the value of x?`;
          answer = variable.toString();
          explanation = `Solve: ${coefficient}x + ${constant} = ${result}\n${coefficient}x = ${result} - ${constant}\n${coefficient}x = ${result - constant}\nx = ${variable}`;
          break;
          
        case DifficultyLevel.HARD:
          // Two-step word problems with variables
          const pricePerItem = getRandomInt(3, 12);
          const fixedCost = getRandomInt(15, 35);
          const totalCost = getRandomInt(50, 100);
          const items = Math.floor((totalCost - fixedCost) / pricePerItem);
          
          questionText = `A store charges $${fixedCost} for delivery plus $${pricePerItem} per item. If the total cost is $${totalCost}, how many items were ordered?`;
          answer = items.toString();
          explanation = `Let x = number of items\nEquation: ${pricePerItem}x + ${fixedCost} = ${totalCost}\n${pricePerItem}x = ${totalCost - fixedCost}\nx = ${items}`;
          break;
      }
    } else if (gradeNum <= 8) {
      // Middle school algebra
      switch (difficulty) {
        case DifficultyLevel.EASY:
          // Linear equations
          const a = getRandomInt(2, 6);
          const b = getRandomInt(5, 20);
          const c = getRandomInt(15, 40);
          const x = Math.floor((c - b) / a);
          
          questionText = `Solve for x: ${a}x + ${b} = ${c}`;
          answer = x.toString();
          explanation = `${a}x + ${b} = ${c}\n${a}x = ${c} - ${b}\n${a}x = ${c - b}\nx = ${x}`;
          break;
          
        case DifficultyLevel.MEDIUM:
          // Systems of equations
          const x1 = getRandomInt(2, 8);
          const y1 = getRandomInt(1, 6);
          const eq1Result = 2*x1 + 3*y1;
          const eq2Result = x1 + 2*y1;
          
          questionText = `Solve the system:\n2x + 3y = ${eq1Result}\nx + 2y = ${eq2Result}`;
          answer = `x = ${x1}, y = ${y1}`;
          explanation = `Using substitution or elimination method:\nFrom equation 2: x = ${eq2Result} - 2y\nSubstitute into equation 1: 2(${eq2Result} - 2y) + 3y = ${eq1Result}\nSolving: x = ${x1}, y = ${y1}`;
          break;
          
        case DifficultyLevel.HARD:
          // Quadratic equations
          const root1 = getRandomInt(1, 5);
          const root2 = getRandomInt(1, 5);
          const quadA = 1;
          const quadB = -(root1 + root2);
          const quadC = root1 * root2;
          
          questionText = `Solve: x² ${quadB >= 0 ? '+' : ''}${quadB}x ${quadC >= 0 ? '+' : ''}${quadC} = 0`;
          answer = `x = ${Math.min(root1, root2)} or x = ${Math.max(root1, root2)}`;
          explanation = `Using factoring or quadratic formula:\n(x - ${root1})(x - ${root2}) = 0\nTherefore x = ${root1} or x = ${root2}`;
          break;
      }
    } else {
      // High school algebra (grades 9-12)
      switch (difficulty) {
        case DifficultyLevel.EASY:
          // Function evaluation
          const funcA = getRandomInt(2, 5);
          const funcB = getRandomInt(1, 10);
          const inputX = getRandomInt(1, 8);
          const outputY = funcA * inputX + funcB;
          
          questionText = `If f(x) = ${funcA}x + ${funcB}, find f(${inputX})`;
          answer = outputY.toString();
          explanation = `f(${inputX}) = ${funcA}(${inputX}) + ${funcB} = ${funcA * inputX} + ${funcB} = ${outputY}`;
          break;
          
        case DifficultyLevel.MEDIUM:
          // Exponential functions
          const base = getRandomInt(2, 4);
          const exponent = getRandomInt(2, 4);
          const expResult = Math.pow(base, exponent);
          
          questionText = `If 2^x = ${Math.pow(2, exponent)}, what is the value of x?`;
          answer = exponent.toString();
          explanation = `Since 2^x = ${Math.pow(2, exponent)} = 2^${exponent}, we have x = ${exponent}`;
          break;
          
        case DifficultyLevel.HARD:
          // Logarithmic functions
          const logBase = 3;
          const logArg = Math.pow(logBase, 3);
          const logResult = 3;
          
          questionText = `Solve: log₃(x) = 3`;
          answer = logArg.toString();
          explanation = `If log₃(x) = 3, then 3³ = x\nTherefore x = 27`;
          break;
      }
    }
    
    // Generate wrong options
    const wrongOptions: string[] = [];
    const correctNum = parseInt(answer.split(' ')[0]) || parseInt(answer);
    [correctNum - 2, correctNum - 1, correctNum + 1, correctNum + 2, correctNum * 2, Math.floor(correctNum / 2)]
      .forEach(opt => {
        if (opt > 0 && opt !== correctNum && !wrongOptions.includes(opt.toString())) {
          wrongOptions.push(opt.toString());
        }
      });
    
    const options = shuffleArray([answer, ...wrongOptions.slice(0, 3)]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: gradeNum <= 5 ? 'Algebraic Thinking' : gradeNum <= 8 ? 'Algebra' : 'Advanced Algebra',
      difficulty,
      tags: ['algebra', 'patterns', 'equations', 'problem-solving'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate geometry questions for higher grades
  static generateGeometry(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    if (gradeNum <= 8) {
      // Basic geometry
      switch (difficulty) {
        case DifficultyLevel.EASY:
          const length = getRandomInt(5, 15);
          const width = getRandomInt(3, 12);
          const area = length * width;
          
          questionText = `What is the area of a rectangle with length ${length} units and width ${width} units?`;
          answer = `${area} square units`;
          explanation = `Area of rectangle = length × width = ${length} × ${width} = ${area} square units`;
          break;
          
        case DifficultyLevel.MEDIUM:
          const radius = getRandomInt(3, 10);
          const circumference = Math.round(2 * Math.PI * radius * 100) / 100;
          
          questionText = `What is the circumference of a circle with radius ${radius} units? (Use π ≈ 3.14)`;
          answer = `${circumference} units`;
          explanation = `Circumference = 2πr = 2 × 3.14 × ${radius} = ${circumference} units`;
          break;
          
        case DifficultyLevel.HARD:
          const base = getRandomInt(6, 12);
          const height = getRandomInt(4, 10);
          const triangleArea = (base * height) / 2;
          
          questionText = `A triangle has a base of ${base} units and height of ${height} units. What is its area?`;
          answer = `${triangleArea} square units`;
          explanation = `Area of triangle = ½ × base × height = ½ × ${base} × ${height} = ${triangleArea} square units`;
          break;
      }
    } else {
      // Advanced geometry (grades 9-12)
      switch (difficulty) {
        case DifficultyLevel.EASY:
          const sideA = 3;
          const sideB = 4;
          const hypotenuse = 5;
          
          questionText = `In a right triangle with legs of length 3 and 4, what is the length of the hypotenuse?`;
          answer = "5";
          explanation = `Using Pythagorean theorem: c² = a² + b²\nc² = 3² + 4² = 9 + 16 = 25\nc = √25 = 5`;
          break;
          
        case DifficultyLevel.MEDIUM:
          const angle = 30;
          const opposite = 0.5;
          
          questionText = `In a right triangle, if one angle is 30° and the hypotenuse is 1, what is sin(30°)?`;
          answer = "0.5";
          explanation = `sin(30°) = opposite/hypotenuse = 0.5/1 = 0.5`;
          break;
          
        case DifficultyLevel.HARD:
          const vectorA = [3, 4];
          const vectorB = [1, 2];
          const dotProduct = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
          
          questionText = `Find the dot product of vectors A = (3, 4) and B = (1, 2)`;
          answer = dotProduct.toString();
          explanation = `Dot product = A·B = (3)(1) + (4)(2) = 3 + 8 = ${dotProduct}`;
          break;
      }
    }
    
    const options = [answer, "Wrong option 1", "Wrong option 2", "Wrong option 3"];
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: gradeNum <= 8 ? 'Geometry' : 'Advanced Geometry',
      difficulty,
      tags: ['geometry', 'shapes', 'measurement'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate calculus questions for grades 11-12
  static generateCalculus(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Basic derivatives
        const coeff = getRandomInt(2, 8);
        const power = getRandomInt(2, 5);
        const newCoeff = coeff * power;
        const newPower = power - 1;
        
        questionText = `Find the derivative of f(x) = ${coeff}x^${power}`;
        answer = `${newCoeff}x^${newPower}`;
        explanation = `Using power rule: d/dx[ax^n] = nax^(n-1)\nf'(x) = ${power} × ${coeff}x^${power-1} = ${newCoeff}x^${newPower}`;
        break;
        
      case DifficultyLevel.MEDIUM:
        // Chain rule
        const innerCoeff = getRandomInt(2, 5);
        const outerPower = getRandomInt(2, 4);
        
        questionText = `Find the derivative of f(x) = (${innerCoeff}x + 1)^${outerPower}`;
        answer = `${outerPower * innerCoeff}(${innerCoeff}x + 1)^${outerPower - 1}`;
        explanation = `Using chain rule: d/dx[f(g(x))] = f'(g(x)) × g'(x)\nf'(x) = ${outerPower}(${innerCoeff}x + 1)^${outerPower-1} × ${innerCoeff} = ${outerPower * innerCoeff}(${innerCoeff}x + 1)^${outerPower-1}`;
        break;
        
      case DifficultyLevel.HARD:
        // Integration
        const integrandCoeff = getRandomInt(2, 6);
        const integrandPower = getRandomInt(1, 4);
        const resultCoeff = integrandCoeff / (integrandPower + 1);
        const resultPower = integrandPower + 1;
        
        questionText = `Find ∫${integrandCoeff}x^${integrandPower} dx`;
        answer = `${resultCoeff}x^${resultPower} + C`;
        explanation = `Using power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C\n∫${integrandCoeff}x^${integrandPower} dx = ${integrandCoeff} × x^${resultPower}/${resultPower} + C = ${resultCoeff}x^${resultPower} + C`;
        break;
    }
    
    const options = [answer, "Wrong option 1", "Wrong option 2", "Wrong option 3"];
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: 'Calculus',
      difficulty,
      tags: ['calculus', 'derivatives', 'integration'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Main function to generate enhanced math questions
export const generateEnhancedMathQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  const questionTypes = [];
  
  // Add appropriate question types based on grade level
  if (gradeNum >= 1) questionTypes.push('addition');
  if (gradeNum >= 3) questionTypes.push('fractions');
  if (gradeNum >= 4) questionTypes.push('algebraic');
  if (gradeNum >= 6) questionTypes.push('geometry');
  if (gradeNum >= 11) questionTypes.push('calculus');
  
  const questionType = questionTypes[getRandomInt(0, questionTypes.length - 1)];
  
  switch (questionType) {
    case 'addition':
      return EnhancedMathQuestionGenerator.generateAdvancedAddition(grade, difficulty);
    case 'fractions':
      return EnhancedMathQuestionGenerator.generateAdvancedFractions(grade, difficulty);
    case 'algebraic':
      return EnhancedMathQuestionGenerator.generateAlgebraicThinking(grade, difficulty);
    case 'geometry':
      return EnhancedMathQuestionGenerator.generateGeometry(grade, difficulty);
    case 'calculus':
      return EnhancedMathQuestionGenerator.generateCalculus(grade, difficulty);
    default:
      return EnhancedMathQuestionGenerator.generateAdvancedAddition(grade, difficulty);
  }
};
