import { Question, DifficultyLevel, QuestionType } from '../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 2000; // Start from 2000 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to format a fraction
const formatFraction = (numerator: number, denominator: number): string => {
  // Find the greatest common divisor (GCD)
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const divisor = gcd(Math.abs(numerator), denominator);
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = denominator / divisor;
  
  if (simplifiedDenominator === 1) {
    return simplifiedNumerator.toString();
  }
  
  return `${simplifiedNumerator}/${simplifiedDenominator}`;
};

// Generate addition questions
const generateAdditionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  let num1: number, num2: number;
  const gradeNum = parseInt(grade);
  
  switch (difficulty) {
    case DifficultyLevel.EASY:
      num1 = getRandomInt(1, 10 * gradeNum);
      num2 = getRandomInt(1, 10 * gradeNum);
      break;
    case DifficultyLevel.MEDIUM:
      num1 = getRandomInt(10 * gradeNum, 20 * gradeNum);
      num2 = getRandomInt(10 * gradeNum, 20 * gradeNum);
      break;
    case DifficultyLevel.HARD:
      num1 = getRandomInt(20 * gradeNum, 50 * gradeNum);
      num2 = getRandomInt(20 * gradeNum, 50 * gradeNum);
      break;
  }
  
  const answer = num1 + num2;
  
  // Generate wrong options
  const wrongOptions: number[] = [];
  while (wrongOptions.length < 3) {
    const offset = getRandomInt(1, Math.max(5, Math.floor(answer * 0.2)));
    const wrongAnswer = Math.random() < 0.5 ? answer + offset : answer - offset;
    if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
      wrongOptions.push(wrongAnswer);
    }
  }
  
  const options = shuffleArray([answer.toString(), ...wrongOptions.map(o => o.toString())]);
  
  // In generateAdditionQuestion function
  // In generateAdditionQuestion function
  return {
    _id: generateId(),
    content: `What is ${num1} + ${num2}?`,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer.toString(),
    explanation: `Let's solve this step by step:

1. We need to add ${num1} and ${num2}
2. Starting with ${num1}:
   ${num1 > num2 
     ? `- Add ${num2} to ${num1}
   - ${num1} + ${num2} = ${answer}`
     : `- Add ${num1} to ${num2}
   - ${num2} + ${num1} = ${answer}`}

The answer is ${answer}.

Tip: When adding larger numbers, you can:
- Break them into tens and ones
- Add the ones first, then the tens
- Or use the column method`,
    subject: 'Math',
    topic: 'Addition',
    difficulty,
    tags: ['addition', 'arithmetic', 'mental math'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate subtraction questions
const generateSubtractionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  let num1: number, num2: number;
  const gradeNum = parseInt(grade);
  
  switch (difficulty) {
    case DifficultyLevel.EASY:
      num1 = getRandomInt(5, 10 * gradeNum);
      num2 = getRandomInt(1, num1 - 1); // Ensure positive result
      break;
    case DifficultyLevel.MEDIUM:
      num1 = getRandomInt(10 * gradeNum, 20 * gradeNum);
      num2 = getRandomInt(5 * gradeNum, num1 - 1);
      break;
    case DifficultyLevel.HARD:
      num1 = getRandomInt(20 * gradeNum, 50 * gradeNum);
      num2 = getRandomInt(10 * gradeNum, num1 - 1);
      break;
  }
  
  const answer = num1 - num2;
  
  // Generate wrong options
  const wrongOptions: number[] = [];
  while (wrongOptions.length < 3) {
    const offset = getRandomInt(1, Math.max(5, Math.floor(answer * 0.2)));
    const wrongAnswer = Math.random() < 0.5 ? answer + offset : answer - offset;
    if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
      wrongOptions.push(wrongAnswer);
    }
  }
  
  const options = shuffleArray([answer.toString(), ...wrongOptions.map(o => o.toString())]);
  
  // In generateSubtractionQuestion function
  // In generateSubtractionQuestion function
  return {
    _id: generateId(),
    content: `What is ${num1} - ${num2}?`,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer.toString(),
    explanation: `Let's solve this step by step:

1. We start with ${num1}
2. We need to subtract ${num2} from it
3. Breaking it down:
   ${num1 >= 10 ? 
     `- ${num1} can be written as ${Math.floor(num1/10) * 10} + ${num1 % 10}
   - First subtract ${Math.min(num2, num1 % 10)} from ${num1 % 10}
   - Then subtract the remaining ${Math.max(0, num2 - (num1 % 10))} from ${Math.floor(num1/10) * 10}`
     : `- Simply count down ${num2} from ${num1}`}
4. ${num1} - ${num2} = ${answer}

The answer is ${answer}.

Tip: When subtracting:
- Make sure the larger number is first
- You can break down larger numbers into tens and ones
- Or use the column method for bigger numbers`,
    subject: 'Math',
    topic: 'Subtraction',
    difficulty,
    tags: ['subtraction', 'arithmetic', 'mental math'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate multiplication questions
const generateMultiplicationQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  let num1: number, num2: number;
  const gradeNum = parseInt(grade);
  
  switch (difficulty) {
    case DifficultyLevel.EASY:
      num1 = getRandomInt(1, Math.min(10, gradeNum * 2));
      num2 = getRandomInt(1, Math.min(10, gradeNum * 2));
      break;
    case DifficultyLevel.MEDIUM:
      num1 = getRandomInt(2, Math.min(12, gradeNum * 2));
      num2 = getRandomInt(2, Math.min(12, gradeNum * 2));
      break;
    case DifficultyLevel.HARD:
      num1 = getRandomInt(5, Math.min(20, gradeNum * 3));
      num2 = getRandomInt(5, Math.min(20, gradeNum * 3));
      break;
  }
  
  const answer = num1 * num2;
  
  // Generate wrong options
  const wrongOptions: number[] = [];
  while (wrongOptions.length < 3) {
    const offset = getRandomInt(1, Math.max(5, Math.floor(answer * 0.2)));
    const wrongAnswer = Math.random() < 0.5 ? answer + offset : answer - offset;
    if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
      wrongOptions.push(wrongAnswer);
    }
  }
  
  const options = shuffleArray([answer.toString(), ...wrongOptions.map(o => o.toString())]);
  
  // In generateMultiplicationQuestion function
  // In generateMultiplicationQuestion function
  return {
    _id: generateId(),
    content: `What is ${num1} × ${num2}?`,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer.toString(),
    explanation: `Let's solve this step by step:

1. We need to multiply ${num1} by ${num2}
2. This means we add ${num1} to itself ${num2} times
3. Breaking it down:
   ${num1 <= 5 || num2 <= 5 ?
     `- ${num1} + ${num1} + ... (${num2} times)
   - ${Array(num2).fill(num1).join(' + ')} = ${answer}`
     : `- We can use the multiplication table
   - ${num1} × ${num2} can be broken down as:
   - ${num1} × ${Math.floor(num2/2)} = ${num1 * Math.floor(num2/2)}
   - ${num1} × ${num2 - Math.floor(num2/2)} = ${num1 * (num2 - Math.floor(num2/2))}
   - Total: ${num1 * Math.floor(num2/2)} + ${num1 * (num2 - Math.floor(num2/2))} = ${answer}`}

The answer is ${answer}.

Tips for multiplication:
- Break down larger numbers into smaller ones
- Use known multiplication facts
- Remember that multiplication is repeated addition
- ${num1} × ${num2} is the same as ${num2} × ${num1}`,
    subject: 'Math',
    topic: 'Multiplication',
    difficulty,
    tags: ['multiplication', 'arithmetic', 'mental math'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate division questions
const generateDivisionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  let divisor: number, quotient: number;
  const gradeNum = parseInt(grade);
  
  switch (difficulty) {
    case DifficultyLevel.EASY:
      divisor = getRandomInt(1, Math.min(10, gradeNum * 2));
      quotient = getRandomInt(1, Math.min(10, gradeNum * 2));
      break;
    case DifficultyLevel.MEDIUM:
      divisor = getRandomInt(2, Math.min(12, gradeNum * 2));
      quotient = getRandomInt(2, Math.min(12, gradeNum * 2));
      break;
    case DifficultyLevel.HARD:
      divisor = getRandomInt(2, Math.min(20, gradeNum * 3));
      quotient = getRandomInt(2, Math.min(20, gradeNum * 3));
      break;
  }
  
  const dividend = divisor * quotient;
  const answer = quotient;
  
  // Generate wrong options
  const wrongOptions: number[] = [];
  while (wrongOptions.length < 3) {
    const offset = getRandomInt(1, Math.max(2, Math.floor(answer * 0.2)));
    const wrongAnswer = Math.random() < 0.5 ? answer + offset : answer - offset;
    if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
      wrongOptions.push(wrongAnswer);
    }
  }
  
  const options = shuffleArray([answer.toString(), ...wrongOptions.map(o => o.toString())]);
  
  // In generateDivisionQuestion function
  // In generateDivisionQuestion function
  return {
    _id: generateId(),
    content: `What is ${dividend} ÷ ${divisor}?`,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer.toString(),
    explanation: `Let's solve this step by step:

1. We need to divide ${dividend} by ${divisor}
2. This means we need to find how many groups of ${divisor} make up ${dividend}
3. Method:
   ${divisor <= 5 ?
     `- Count by ${divisor}s until we reach ${dividend}:
   - ${Array.from({length: quotient}, (_, i) => divisor * (i + 1)).join(', ')}
   - We counted ${quotient} times to reach ${dividend}`
     : `- We can use related multiplication facts:
   - ${divisor} × ${quotient} = ${dividend}
   - Therefore, ${dividend} ÷ ${divisor} = ${quotient}`}

The answer is ${quotient}.

Tips for division:
- Division is the opposite of multiplication
- ${dividend} ÷ ${divisor} = ${quotient} means ${divisor} × ${quotient} = ${dividend}
- You can use repeated subtraction: keep subtracting ${divisor} from ${dividend} until you reach 0
- The number of times you subtract is your answer`,
    subject: 'Math',
    topic: 'Division',
    difficulty,
    tags: ['division', 'arithmetic', 'mental math'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate fraction questions
const generateFractionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  // Only generate fraction questions for grade 3 and above
  if (gradeNum < 3) {
    return generateAdditionQuestion(grade, difficulty);
  }
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple fraction comparison
      const denominator = getRandomInt(2, 10);
      const numerator1 = getRandomInt(1, denominator - 1);
      const numerator2 = getRandomInt(1, denominator - 1);
      
      question = `Which fraction is larger: ${numerator1}/${denominator} or ${numerator2}/${denominator}?`;
      
      if (numerator1 > numerator2) {
        answer = `${numerator1}/${denominator}`;
        explanation = `${numerator1}/${denominator} is larger than ${numerator2}/${denominator} because ${numerator1} > ${numerator2} while the denominators are the same.`;
      } else {
        answer = `${numerator2}/${denominator}`;
        explanation = `${numerator2}/${denominator} is larger than ${numerator1}/${denominator} because ${numerator2} > ${numerator1} while the denominators are the same.`;
      }
      
      options = shuffleArray([
        `${numerator1}/${denominator}`,
        `${numerator2}/${denominator}`,
        'They are equal',
        'Cannot be determined'
      ]);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // Fraction addition with same denominator
      const denominator = getRandomInt(2, 12);
      const numerator1 = getRandomInt(1, denominator - 1);
      const numerator2 = getRandomInt(1, denominator - 1);
      const sum = numerator1 + numerator2;
      
      question = `What is ${numerator1}/${denominator} + ${numerator2}/${denominator}?`;
      
      if (sum > denominator) {
        const wholePart = Math.floor(sum / denominator);
        const remainder = sum % denominator;
        if (remainder === 0) {
          answer = wholePart.toString();
          explanation = `${numerator1}/${denominator} + ${numerator2}/${denominator} = ${sum}/${denominator} = ${wholePart}`;
        } else {
          answer = `${wholePart} ${remainder}/${denominator}`;
          explanation = `${numerator1}/${denominator} + ${numerator2}/${denominator} = ${sum}/${denominator} = ${wholePart} ${remainder}/${denominator}`;
        }
      } else {
        const simplified = formatFraction(sum, denominator);
        answer = simplified;
        explanation = `${numerator1}/${denominator} + ${numerator2}/${denominator} = ${sum}/${denominator} = ${simplified}`;
      }
      
      // Generate wrong options
      const wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const wrongNumerator = getRandomInt(1, denominator * 2);
        const wrongDenominator = getRandomInt(Math.max(2, denominator - 3), denominator + 3);
        const wrongAnswer = formatFraction(wrongNumerator, wrongDenominator);
        
        if (!wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
          wrongOptions.push(wrongAnswer);
        }
      }
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Fraction multiplication
      const denominator1 = getRandomInt(2, 10);
      const denominator2 = getRandomInt(2, 10);
      const numerator1 = getRandomInt(1, denominator1 - 1);
      const numerator2 = getRandomInt(1, denominator2 - 1);
      
      const resultNumerator = numerator1 * numerator2;
      const resultDenominator = denominator1 * denominator2;
      const simplified = formatFraction(resultNumerator, resultDenominator);
      
      question = `What is ${numerator1}/${denominator1} × ${numerator2}/${denominator2}?`;
      answer = simplified;
      explanation = `${numerator1}/${denominator1} × ${numerator2}/${denominator2} = (${numerator1} × ${numerator2})/(${denominator1} × ${denominator2}) = ${resultNumerator}/${resultDenominator} = ${simplified}`;
      
      // Generate wrong options
      const wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const wrongNumerator = getRandomInt(1, resultDenominator);
        const wrongDenominator = getRandomInt(Math.max(2, resultDenominator - 5), resultDenominator + 5);
        const wrongAnswer = formatFraction(wrongNumerator, wrongDenominator);
        
        if (!wrongOptions.includes(wrongAnswer) && wrongAnswer !== answer) {
          wrongOptions.push(wrongAnswer);
        }
      }
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    default: {
      // Default case to satisfy TypeScript
      const denominator = getRandomInt(2, 10);
      const numerator = getRandomInt(1, denominator - 1);
      question = `What is ${numerator}/${denominator} as a decimal?`;
      answer = (numerator / denominator).toFixed(2);
      explanation = `${numerator}/${denominator} = ${numerator} ÷ ${denominator} = ${answer}`;
      options = shuffleArray([
        answer,
        (numerator / (denominator + 1)).toFixed(2),
        (numerator / (denominator - 1)).toFixed(2),
        ((numerator + 1) / denominator).toFixed(2)
      ]);
    }
  }
  
  // In generateFractionQuestion function
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Math',
    topic: 'Fractions',
    difficulty,
    tags: ['fractions', 'arithmetic'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate algebra questions
const generateAlgebraQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  
  // Only generate algebra questions for grade 6 and above
  if (gradeNum < 6) {
    return generateMultiplicationQuestion(grade, difficulty);
  }
  
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple one-step equation
      const x = getRandomInt(1, 10);
      const b = getRandomInt(1, 20);
      const a = getRandomInt(1, 5);
      const rightSide = a * x + b;
      
      question = `Solve for x: ${a}x + ${b} = ${rightSide}`;
      answer = x.toString();
      explanation = `${a}x + ${b} = ${rightSide}\n${a}x = ${rightSide - b}\nx = ${x}`;
      
      // Generate wrong options
      const wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const offset = getRandomInt(1, 3);
        const wrongAnswer = Math.random() < 0.5 ? x + offset : x - offset;
        if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer.toString()) && wrongAnswer !== x) {
          wrongOptions.push(wrongAnswer.toString());
        }
      }
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // Two-step equation
      const x = getRandomInt(1, 10);
      const a = getRandomInt(2, 5);
      const b = getRandomInt(1, 10);
      const rightSide = getRandomInt(5, 30);
      const c = rightSide - a * x + b;
      
      question = `Solve for x: ${a}x - ${b} = ${c}`;
      answer = x.toString();
      explanation = `${a}x - ${b} = ${c}\n${a}x = ${c} + ${b}\n${a}x = ${c + b}\nx = ${(c + b) / a}`;
      
      // Generate wrong options
      const wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const offset = getRandomInt(1, 3);
        const wrongAnswer = Math.random() < 0.5 ? x + offset : x - offset;
        if (wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer.toString()) && wrongAnswer !== x) {
          wrongOptions.push(wrongAnswer.toString());
        }
      }
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Quadratic equation with integer solutions
      const x1 = getRandomInt(1, 5);
      const x2 = getRandomInt(-5, 5);
      const a = 1;
      const b = -(x1 + x2);
      const c = x1 * x2;
      
      question = `Solve the quadratic equation: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`;
      answer = `x = ${x1}, x = ${x2}`;
      explanation = `${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0\nUsing the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\nx = (${-b} ± √(${b}² - 4 × ${a} × ${c})) / (2 × ${a})\nx = (${-b} ± √(${b * b - 4 * a * c})) / ${2 * a}\nx = ${x1} or x = ${x2}`;
      
      // Generate wrong options
      options = shuffleArray([
        `x = ${x1}, x = ${x2}`,
        `x = ${x1 + 1}, x = ${x2 - 1}`,
        `x = ${x1 - 1}, x = ${x2 + 1}`,
        `x = ${x1 + 2}, x = ${x2 - 2}`
      ]);
      break;
    }
    
    default: {
      // Default case to satisfy TypeScript
      const x = getRandomInt(1, 10);
      const a = getRandomInt(1, 5);
      const b = getRandomInt(1, 10);
      const rightSide = a * x + b;
      
      question = `Solve for x: ${a}x + ${b} = ${rightSide}`;
      answer = x.toString();
      explanation = `${a}x + ${b} = ${rightSide}\n${a}x = ${rightSide - b}\nx = ${x}`;
      
      options = shuffleArray([
        x.toString(),
        (x + 1).toString(),
        (x - 1).toString(),
        (x + 2).toString()
      ]);
    }
  }
  
  // In generateAlgebraQuestion function
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Math',
    topic: 'Algebra',
    difficulty,
    tags: ['algebra', 'equations'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate geometry questions
const generateGeometryQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  
  // Only generate geometry questions for grade 4 and above
  if (gradeNum < 4) {
    return generateAdditionQuestion(grade, difficulty);
  }
  
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Area of rectangle
      const length = getRandomInt(2, 10);
      const width = getRandomInt(2, 10);
      const area = length * width;
      
      question = `What is the area of a rectangle with length ${length} cm and width ${width} cm?`;
      answer = `${area} cm²`;
      explanation = `The area of a rectangle is calculated by multiplying length × width. So, ${length} cm × ${width} cm = ${area} cm².`;
      
      // Generate wrong options
      const wrongOptions: string[] = [
        `${length + width} cm²`,
        `${2 * (length + width)} cm²`,
        `${length * length} cm²`
      ];
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // Perimeter of rectangle
      const length = getRandomInt(5, 15);
      const width = getRandomInt(3, 10);
      const perimeter = 2 * (length + width);
      
      question = `What is the perimeter of a rectangle with length ${length} cm and width ${width} cm?`;
      answer = `${perimeter} cm`;
      explanation = `The perimeter of a rectangle is calculated by 2 × (length + width). So, 2 × (${length} cm + ${width} cm) = 2 × ${length + width} cm = ${perimeter} cm.`;
      
      // Generate wrong options
      const wrongOptions: string[] = [
        `${length * width} cm`,
        `${length + width} cm`,
        `${2 * length * width} cm`
      ];
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Area of circle
      const radius = getRandomInt(1, 10);
      const area = Math.PI * radius * radius;
      const roundedArea = Math.round(area * 100) / 100;
      
      question = `What is the area of a circle with radius ${radius} cm? (Use π = 3.14)`;
      answer = `${roundedArea} cm²`;
      explanation = `The area of a circle is calculated using the formula A = πr². So, A = 3.14 × ${radius}² = 3.14 × ${radius * radius} = ${roundedArea} cm².`;
      
      // Generate wrong options
      const wrongOptions: string[] = [
        `${Math.round(2 * Math.PI * radius * 100) / 100} cm²`,
        `${Math.round(Math.PI * radius * 100) / 100} cm²`,
        `${radius * radius} cm²`
      ];
      
      options = shuffleArray([answer, ...wrongOptions]);
      break;
    }
    
    default: {
      // Default case to satisfy TypeScript
      const side = getRandomInt(2, 10);
      const area = side * side;
      
      question = `What is the area of a square with side length ${side} cm?`;
      answer = `${area} cm²`;
      explanation = `The area of a square is calculated by side × side. So, ${side} cm × ${side} cm = ${area} cm².`;
      
      options = shuffleArray([
        `${area} cm²`,
        `${4 * side} cm²`,
        `${2 * side} cm²`,
        `${side + side} cm²`
      ]);
    }
  }
  
  // In generateGeometryQuestion function
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Math',
    topic: 'Geometry',
    difficulty,
    tags: ['geometry', 'area', 'perimeter'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Main function to generate math questions
export const generateMathQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 20
): Question[] => {
  const questions: Question[] = [];
  const gradeNum = parseInt(grade);
  
  for (let i = 0; i < count; i++) {
    // Choose a question type based on grade level
    const questionType = Math.random();
    
    if (gradeNum <= 2) {
      // Grades 1-2: Basic arithmetic
      if (questionType < 0.5) {
        questions.push(generateAdditionQuestion(grade, difficulty));
      } else {
        questions.push(generateSubtractionQuestion(grade, difficulty));
      }
    } else if (gradeNum <= 5) {
      // Grades 3-5: Arithmetic and basic fractions
      if (questionType < 0.25) {
        questions.push(generateAdditionQuestion(grade, difficulty));
      } else if (questionType < 0.5) {
        questions.push(generateSubtractionQuestion(grade, difficulty));
      } else if (questionType < 0.75) {
        questions.push(generateMultiplicationQuestion(grade, difficulty));
      } else {
        questions.push(generateDivisionQuestion(grade, difficulty));
      }
    } else if (gradeNum <= 8) {
      // Grades 6-8: Arithmetic, fractions, basic algebra, geometry
      if (questionType < 0.2) {
        questions.push(generateMultiplicationQuestion(grade, difficulty));
      } else if (questionType < 0.4) {
        questions.push(generateDivisionQuestion(grade, difficulty));
      } else if (questionType < 0.6) {
        questions.push(generateFractionQuestion(grade, difficulty));
      } else if (questionType < 0.8) {
        questions.push(generateAlgebraQuestion(grade, difficulty));
      } else {
        questions.push(generateGeometryQuestion(grade, difficulty));
      }
    } else {
      // Grades 9-12: Algebra, geometry, advanced math
      if (questionType < 0.33) {
        questions.push(generateAlgebraQuestion(grade, difficulty));
      } else if (questionType < 0.66) {
        questions.push(generateGeometryQuestion(grade, difficulty));
      } else {
        questions.push(generateFractionQuestion(grade, difficulty));
      }
    }
  }
  
  return questions;
};
