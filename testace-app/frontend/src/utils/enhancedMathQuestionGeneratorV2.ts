import { Question, DifficultyLevel, QuestionType } from '../types';
import { shuffleArray, getRandomInt } from './questionUtils';
import { generateId } from './idGenerator';
import { validateAnswer } from './enhancedAnswerValidation';

/**
 * Enhanced Math Question Generator V2
 * Focuses on generating mathematically accurate questions with validated answers
 * Implements rigorous checking to ensure all generated questions have correct answers
 */

interface MathQuestionTemplate {
  type: 'arithmetic' | 'word_problem' | 'fraction' | 'decimal' | 'algebra' | 'geometry';
  grade: string;
  difficulty: DifficultyLevel;
  generator: (grade: string, difficulty: DifficultyLevel) => Question;
}

export class EnhancedMathQuestionGeneratorV2 {
  
  /**
   * Main entry point for generating math questions
   */
  static generateMathQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    
    // Select appropriate question types based on grade level
    const availableTypes = this.getAvailableQuestionTypes(gradeNum, difficulty);
    const selectedType = availableTypes[getRandomInt(0, availableTypes.length - 1)];
    
    let question: Question;
    let attempts = 0;
    const maxAttempts = 5;
    
    // Generate question with validation
    do {
      attempts++;
      question = selectedType.generator(grade, difficulty);
      
      // Validate the generated question
      if (this.validateGeneratedQuestion(question)) {
        break;
      }
      
      console.warn(`Generated question failed validation (attempt ${attempts}):`, question.content);
    } while (attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      console.error('Failed to generate valid question after maximum attempts');
      // Fallback to simple arithmetic
      question = this.generateSimpleArithmetic(grade, difficulty);
    }
    
    return question;
  }
  
  /**
   * Gets available question types based on grade and difficulty
   */
  private static getAvailableQuestionTypes(grade: number, difficulty: DifficultyLevel): MathQuestionTemplate[] {
    const templates: MathQuestionTemplate[] = [];
    
    // Basic arithmetic (all grades)
    templates.push({
      type: 'arithmetic',
      grade: grade.toString(),
      difficulty,
      generator: this.generateArithmetic
    });
    
    // Word problems (grade 2+)
    if (grade >= 2) {
      templates.push({
        type: 'word_problem',
        grade: grade.toString(),
        difficulty,
        generator: this.generateWordProblem
      });
    }
    
    // Fractions (grade 3+)
    if (grade >= 3) {
      templates.push({
        type: 'fraction',
        grade: grade.toString(),
        difficulty,
        generator: this.generateFractionQuestion
      });
    }
    
    // Decimals (grade 4+)
    if (grade >= 4) {
      templates.push({
        type: 'decimal',
        grade: grade.toString(),
        difficulty,
        generator: this.generateDecimalQuestion
      });
    }
    
    // Algebra (grade 6+)
    if (grade >= 6) {
      templates.push({
        type: 'algebra',
        grade: grade.toString(),
        difficulty,
        generator: this.generateAlgebraQuestion
      });
    }
    
    // Geometry (grade 5+)
    if (grade >= 5) {
      templates.push({
        type: 'geometry',
        grade: grade.toString(),
        difficulty,
        generator: this.generateGeometryQuestion
      });
    }
    
    return templates;
  }
  
  /**
   * Validates that a generated question has the correct answer
   */
  private static validateGeneratedQuestion(question: Question): boolean {
    try {
      // Check basic structure
      if (!question.content || !question.correctAnswer || !question.options || question.options.length < 2) {
        return false;
      }
      
      // Check that correct answer is in options
      if (!question.options.includes(question.correctAnswer)) {
        return false;
      }
      
      // Use enhanced validation to verify the answer
      const validation = validateAnswer(question, question.correctAnswer);
      
      return validation.isCorrect && validation.confidence > 0.8;
    } catch (error) {
      console.error('Error validating generated question:', error);
      return false;
    }
  }
  
  /**
   * Generates arithmetic questions with verified answers
   */
  private static generateArithmetic = (grade: string, difficulty: DifficultyLevel): Question => {
    const gradeNum = parseInt(grade);
    
    // Determine operation and number ranges based on grade and difficulty
    const operations = gradeNum <= 2 ? ['addition', 'subtraction'] : 
                      gradeNum <= 4 ? ['addition', 'subtraction', 'multiplication'] :
                      ['addition', 'subtraction', 'multiplication', 'division'];
    
    const operation = operations[getRandomInt(0, operations.length - 1)];
    
    let num1: number, num2: number, answer: number;
    let questionText: string;
    let explanation: string;
    
    switch (operation) {
      case 'addition':
        const addRange = this.getNumberRange(gradeNum, difficulty);
        num1 = getRandomInt(addRange.min, addRange.max);
        num2 = getRandomInt(addRange.min, addRange.max);
        answer = num1 + num2;
        questionText = `What is ${num1} + ${num2}?`;
        explanation = `${num1} + ${num2} = ${answer}`;
        break;
        
      case 'subtraction':
        const subRange = this.getNumberRange(gradeNum, difficulty);
        num1 = getRandomInt(subRange.min + 10, subRange.max);
        num2 = getRandomInt(subRange.min, num1); // Ensure positive result
        answer = num1 - num2;
        questionText = `What is ${num1} - ${num2}?`;
        explanation = `${num1} - ${num2} = ${answer}`;
        break;
        
      case 'multiplication':
        const multRange = this.getMultiplicationRange(gradeNum, difficulty);
        num1 = getRandomInt(multRange.factor1.min, multRange.factor1.max);
        num2 = getRandomInt(multRange.factor2.min, multRange.factor2.max);
        answer = num1 * num2;
        questionText = `What is ${num1} × ${num2}?`;
        explanation = `${num1} × ${num2} = ${answer}`;
        break;
        
      case 'division':
        const divRange = this.getMultiplicationRange(gradeNum, difficulty);
        num2 = getRandomInt(divRange.factor2.min, divRange.factor2.max);
        const quotient = getRandomInt(divRange.factor1.min, divRange.factor1.max);
        num1 = num2 * quotient; // Ensure exact division
        answer = quotient;
        questionText = `What is ${num1} ÷ ${num2}?`;
        explanation = `${num1} ÷ ${num2} = ${answer}`;
        break;
        
      default:
        // Fallback to addition
        num1 = getRandomInt(1, 20);
        num2 = getRandomInt(1, 20);
        answer = num1 + num2;
        questionText = `What is ${num1} + ${num2}?`;
        explanation = `${num1} + ${num2} = ${answer}`;
    }
    
    // Generate wrong options
    const wrongOptions = this.generateArithmeticWrongOptions(answer, operation);
    const options = shuffleArray([answer.toString(), ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer.toString(),
      explanation,
      subject: 'Math',
      topic: `${operation.charAt(0).toUpperCase() + operation.slice(1)}`,
      difficulty,
      tags: ['arithmetic', operation, 'basic-math'],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  /**
   * Generates word problems with verified answers
   */
  private static generateWordProblem = (grade: string, difficulty: DifficultyLevel): Question => {
    const gradeNum = parseInt(grade);
    const contexts = ['shopping', 'animals', 'toys', 'food', 'sports', 'school'];
    const context = contexts[getRandomInt(0, contexts.length - 1)];
    
    const range = this.getNumberRange(gradeNum, difficulty);
    
    let questionText: string;
    let answer: number;
    let explanation: string;
    
    switch (context) {
      case 'shopping':
        const item1Price = getRandomInt(range.min, range.max);
        const item2Price = getRandomInt(range.min, range.max);
        answer = item1Price + item2Price;
        questionText = `Sarah bought a book for $${item1Price} and a pen for $${item2Price}. How much did she spend in total?`;
        explanation = `Total cost = $${item1Price} + $${item2Price} = $${answer}`;
        break;
        
      case 'animals':
        const dogs = getRandomInt(range.min, range.max);
        const cats = getRandomInt(range.min, range.max);
        answer = dogs + cats;
        questionText = `At the pet store, there are ${dogs} dogs and ${cats} cats. How many animals are there in total?`;
        explanation = `Total animals = ${dogs} + ${cats} = ${answer}`;
        break;
        
      case 'toys':
        const initialToys = getRandomInt(range.min + 5, range.max);
        const givenAway = getRandomInt(range.min, initialToys - 1);
        answer = initialToys - givenAway;
        questionText = `Tom had ${initialToys} toys. He gave away ${givenAway} toys to his friends. How many toys does he have left?`;
        explanation = `Toys left = ${initialToys} - ${givenAway} = ${answer}`;
        break;
        
      default:
        const num1 = getRandomInt(range.min, range.max);
        const num2 = getRandomInt(range.min, range.max);
        answer = num1 + num2;
        questionText = `There are ${num1} red balls and ${num2} blue balls. How many balls are there in total?`;
        explanation = `Total balls = ${num1} + ${num2} = ${answer}`;
    }
    
    const wrongOptions = this.generateArithmeticWrongOptions(answer, 'addition');
    const options = shuffleArray([answer.toString(), ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer.toString(),
      explanation,
      subject: 'Math',
      topic: 'Word Problems',
      difficulty,
      tags: ['word-problems', 'real-world', context],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  /**
   * Generates fraction questions with verified answers
   */
  private static generateFractionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
    const gradeNum = parseInt(grade);
    
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    if (difficulty === DifficultyLevel.EASY) {
      // Simple fraction identification
      const denominator = [2, 3, 4, 5, 6, 8][getRandomInt(0, 5)];
      const numerator = getRandomInt(1, denominator - 1);
      
      questionText = `What fraction of this shape is shaded if ${numerator} out of ${denominator} equal parts are shaded?`;
      answer = `${numerator}/${denominator}`;
      explanation = `When ${numerator} out of ${denominator} equal parts are shaded, the fraction is ${numerator}/${denominator}`;
      
    } else if (difficulty === DifficultyLevel.MEDIUM) {
      // Equivalent fractions
      const baseDen = [2, 3, 4, 5][getRandomInt(0, 3)];
      const baseNum = 1;
      const multiplier = getRandomInt(2, 4);
      
      const equivNum = baseNum * multiplier;
      const equivDen = baseDen * multiplier;
      
      questionText = `Which fraction is equivalent to ${baseNum}/${baseDen}?`;
      answer = `${equivNum}/${equivDen}`;
      explanation = `${baseNum}/${baseDen} = ${baseNum} × ${multiplier}/${baseDen} × ${multiplier} = ${equivNum}/${equivDen}`;
      
    } else {
      // Adding fractions with same denominator
      const denominator = [4, 6, 8, 12][getRandomInt(0, 3)];
      const num1 = getRandomInt(1, Math.floor(denominator / 2));
      const num2 = getRandomInt(1, denominator - num1 - 1);
      const resultNum = num1 + num2;
      
      questionText = `What is ${num1}/${denominator} + ${num2}/${denominator}?`;
      answer = `${resultNum}/${denominator}`;
      explanation = `${num1}/${denominator} + ${num2}/${denominator} = ${num1 + num2}/${denominator} = ${resultNum}/${denominator}`;
    }
    
    const wrongOptions = this.generateFractionWrongOptions(answer);
    const options = shuffleArray([answer, ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: 'Fractions',
      difficulty,
      tags: ['fractions', 'rational-numbers'],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  /**
   * Generates decimal questions with verified answers
   */
  private static generateDecimalQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    if (difficulty === DifficultyLevel.EASY) {
      // Simple decimal addition
      const num1 = (getRandomInt(10, 99) / 10);
      const num2 = (getRandomInt(10, 99) / 10);
      const result = Math.round((num1 + num2) * 10) / 10;
      
      questionText = `What is ${num1} + ${num2}?`;
      answer = result.toString();
      explanation = `${num1} + ${num2} = ${result}`;
      
    } else if (difficulty === DifficultyLevel.MEDIUM) {
      // Decimal subtraction
      const num1 = (getRandomInt(50, 99) / 10);
      const num2 = (getRandomInt(10, Math.floor(num1 * 10)) / 10);
      const result = Math.round((num1 - num2) * 10) / 10;
      
      questionText = `What is ${num1} - ${num2}?`;
      answer = result.toString();
      explanation = `${num1} - ${num2} = ${result}`;
      
    } else {
      // Decimal multiplication
      const num1 = (getRandomInt(10, 50) / 10);
      const num2 = getRandomInt(2, 9);
      const result = Math.round(num1 * num2 * 10) / 10;
      
      questionText = `What is ${num1} × ${num2}?`;
      answer = result.toString();
      explanation = `${num1} × ${num2} = ${result}`;
    }
    
    const wrongOptions = this.generateDecimalWrongOptions(parseFloat(answer));
    const options = shuffleArray([answer, ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: 'Decimals',
      difficulty,
      tags: ['decimals', 'arithmetic'],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  /**
   * Generates algebra questions with verified answers
   */
  private static generateAlgebraQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    if (difficulty === DifficultyLevel.EASY) {
      // Simple linear equation: x + a = b
      const a = getRandomInt(5, 20);
      const x = getRandomInt(1, 15);
      const b = x + a;
      
      questionText = `Solve for x: x + ${a} = ${b}`;
      answer = x.toString();
      explanation = `x + ${a} = ${b}\nx = ${b} - ${a}\nx = ${x}`;
      
    } else if (difficulty === DifficultyLevel.MEDIUM) {
      // Linear equation: ax + b = c
      const a = getRandomInt(2, 8);
      const b = getRandomInt(5, 20);
      const x = getRandomInt(1, 10);
      const c = a * x + b;
      
      questionText = `Solve for x: ${a}x + ${b} = ${c}`;
      answer = x.toString();
      explanation = `${a}x + ${b} = ${c}\n${a}x = ${c} - ${b}\n${a}x = ${c - b}\nx = ${x}`;
      
    } else {
      // System of equations (simple)
      const x = getRandomInt(1, 8);
      const y = getRandomInt(1, 8);
      const eq1Result = 2 * x + y;
      const eq2Result = x + y;
      
      questionText = `Solve the system:\n2x + y = ${eq1Result}\nx + y = ${eq2Result}`;
      answer = `x = ${x}, y = ${y}`;
      explanation = `From the second equation: y = ${eq2Result} - x\nSubstitute into first: 2x + (${eq2Result} - x) = ${eq1Result}\nSolving: x = ${x}, y = ${y}`;
    }
    
    const wrongOptions = this.generateAlgebraWrongOptions(answer);
    const options = shuffleArray([answer, ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: 'Algebra',
      difficulty,
      tags: ['algebra', 'equations', 'solving'],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  /**
   * Generates geometry questions with verified answers
   */
  private static generateGeometryQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
    let questionText: string;
    let answer: string;
    let explanation: string;
    
    if (difficulty === DifficultyLevel.EASY) {
      // Area of rectangle
      const length = getRandomInt(3, 12);
      const width = getRandomInt(2, 10);
      const area = length * width;
      
      questionText = `What is the area of a rectangle with length ${length} units and width ${width} units?`;
      answer = `${area} square units`;
      explanation = `Area = length × width = ${length} × ${width} = ${area} square units`;
      
    } else if (difficulty === DifficultyLevel.MEDIUM) {
      // Perimeter of rectangle
      const length = getRandomInt(5, 15);
      const width = getRandomInt(3, 12);
      const perimeter = 2 * (length + width);
      
      questionText = `What is the perimeter of a rectangle with length ${length} units and width ${width} units?`;
      answer = `${perimeter} units`;
      explanation = `Perimeter = 2 × (length + width) = 2 × (${length} + ${width}) = 2 × ${length + width} = ${perimeter} units`;
      
    } else {
      // Area of triangle
      const base = getRandomInt(4, 16);
      const height = getRandomInt(3, 12);
      const area = (base * height) / 2;
      
      questionText = `What is the area of a triangle with base ${base} units and height ${height} units?`;
      answer = `${area} square units`;
      explanation = `Area = (base × height) ÷ 2 = (${base} × ${height}) ÷ 2 = ${base * height} ÷ 2 = ${area} square units`;
    }
    
    const wrongOptions = this.generateGeometryWrongOptions(answer);
    const options = shuffleArray([answer, ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer,
      explanation,
      subject: 'Math',
      topic: 'Geometry',
      difficulty,
      tags: ['geometry', 'area', 'perimeter'],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  /**
   * Fallback simple arithmetic generator
   */
  private static generateSimpleArithmetic = (grade: string, difficulty: DifficultyLevel): Question => {
    const num1 = getRandomInt(1, 20);
    const num2 = getRandomInt(1, 20);
    const answer = num1 + num2;
    
    const wrongOptions = [
      (answer + 1).toString(),
      (answer - 1).toString(),
      (answer + 2).toString()
    ];
    
    const options = shuffleArray([answer.toString(), ...wrongOptions]);
    
    return {
      _id: generateId(),
      content: `What is ${num1} + ${num2}?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer: answer.toString(),
      explanation: `${num1} + ${num2} = ${answer}`,
      subject: 'Math',
      topic: 'Addition',
      difficulty,
      tags: ['arithmetic', 'addition'],
      grade,
      createdBy: 'enhanced-system-v2',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  // Helper methods for generating number ranges and wrong options
  
  private static getNumberRange(grade: number, difficulty: DifficultyLevel): { min: number; max: number } {
    const baseRange = {
      1: { min: 1, max: 20 },
      2: { min: 1, max: 50 },
      3: { min: 1, max: 100 },
      4: { min: 1, max: 500 },
      5: { min: 1, max: 1000 }
    };
    
    const range = baseRange[Math.min(grade, 5) as keyof typeof baseRange] || baseRange[5];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return { min: range.min, max: Math.floor(range.max * 0.5) };
      case DifficultyLevel.MEDIUM:
        return { min: Math.floor(range.max * 0.3), max: Math.floor(range.max * 0.8) };
      case DifficultyLevel.HARD:
        return { min: Math.floor(range.max * 0.5), max: range.max };
      default:
        return range;
    }
  }
  
  private static getMultiplicationRange(grade: number, difficulty: DifficultyLevel): {
    factor1: { min: number; max: number };
    factor2: { min: number; max: number };
  } {
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return {
          factor1: { min: 1, max: 5 },
          factor2: { min: 1, max: 10 }
        };
      case DifficultyLevel.MEDIUM:
        return {
          factor1: { min: 2, max: 9 },
          factor2: { min: 2, max: 12 }
        };
      case DifficultyLevel.HARD:
        return {
          factor1: { min: 5, max: 15 },
          factor2: { min: 3, max: 15 }
        };
      default:
        return {
          factor1: { min: 1, max: 10 },
          factor2: { min: 1, max: 10 }
        };
    }
  }
  
  private static generateArithmeticWrongOptions(correctAnswer: number, operation: string): string[] {
    const options: string[] = [];
    
    // Common mistake patterns
    options.push((correctAnswer + 1).toString());
    options.push((correctAnswer - 1).toString());
    
    if (operation === 'addition') {
      options.push((correctAnswer + 10).toString());
    } else if (operation === 'subtraction') {
      options.push((correctAnswer + 2).toString());
    } else if (operation === 'multiplication') {
      options.push((correctAnswer + correctAnswer % 10).toString());
    } else if (operation === 'division') {
      options.push((correctAnswer * 2).toString());
    }
    
    // Ensure we have enough unique options
    while (options.length < 3) {
      const offset = getRandomInt(2, 8);
      const wrongAnswer = Math.random() < 0.5 ? correctAnswer + offset : Math.max(1, correctAnswer - offset);
      if (!options.includes(wrongAnswer.toString()) && wrongAnswer !== correctAnswer) {
        options.push(wrongAnswer.toString());
      }
    }
    
    return options.slice(0, 3);
  }
  
  private static generateFractionWrongOptions(correctAnswer: string): string[] {
    const options: string[] = [];
    
    // Parse the correct fraction
    const parts = correctAnswer.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0]);
      const den = parseInt(parts[1]);
      
      // Common fraction mistakes
      options.push(`${num + 1}/${den}`);
      options.push(`${num}/${den + 1}`);
      options.push(`${den}/${num}`); // Inverted fraction
    } else {
      // Fallback options
      options.push('1/2', '1/3', '2/3');
    }
    
    return options.slice(0, 3);
  }
  
  private static generateDecimalWrongOptions(correctAnswer: number): string[] {
    const options: string[] = [];
    
    options.push((correctAnswer + 0.1).toFixed(1));
    options.push((correctAnswer - 0.1).toFixed(1));
    options.push((correctAnswer * 10).toFixed(1));
    
    return options.slice(0, 3);
  }
  
  private static generateAlgebraWrongOptions(correctAnswer: string): string[] {
    const options: string[] = [];
    
    if (correctAnswer.includes(',')) {
      // System of equations
      options.push('x = 1, y = 1');
      options.push('x = 2, y = 3');
      options.push('x = 0, y = 0');
    } else {
      // Single variable
      const num = parseInt(correctAnswer);
      if (!isNaN(num)) {
        options.push((num + 1).toString());
        options.push((num - 1).toString());
        options.push((num * 2).toString());
      }
    }
    
    return options.slice(0, 3);
  }
  
  private static generateGeometryWrongOptions(correctAnswer: string): string[] {
    const options: string[] = [];
    
    // Extract the numeric value
    const numMatch = correctAnswer.match(/(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      const unit = correctAnswer.replace(num.toString(), '').trim();
      
      options.push(`${num + 2} ${unit}`);
      options.push(`${num - 2} ${unit}`);
      options.push(`${num * 2} ${unit}`);
    }
    
    return options.slice(0, 3);
  }
}

// Export the main generation function
export const generateEnhancedMathQuestionV2 = (grade: string, difficulty: DifficultyLevel): Question => {
  return EnhancedMathQuestionGeneratorV2.generateMathQuestion(grade, difficulty);
};

export default EnhancedMathQuestionGeneratorV2;
