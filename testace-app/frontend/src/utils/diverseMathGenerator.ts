import { Question, DifficultyLevel, QuestionType } from '../types';

/**
 * DIVERSE Mathematical Question Generator
 * 
 * FOCUS: Maximum variety in question types and mathematical concepts
 * GOAL: Expose students to diverse mathematical thinking, not just variations of the same problem
 * APPROACH: Weighted random selection from multiple question categories per grade/difficulty
 */

interface MathProblem {
  question: string;
  answer: string;
  explanation: string;
  options: string[];
  topic: string;
  concept: string;
}

interface QuestionCategory {
  name: string;
  weight: number;
  generator: () => MathProblem;
}

export class DiverseMathGenerator {
  
  /**
   * Generate a diverse mathematical question with variety prioritized over repetition
   */
  static generateQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    
    // Get all available question categories for this grade/difficulty
    const categories = this.getQuestionCategories(gradeNum, difficulty);
    
    // Select category using weighted random selection
    const selectedCategory = this.selectWeightedRandom(categories);
    
    // Generate the problem
    const problem = selectedCategory.generator();
    
    return {
      _id: `diverse_math_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: problem.question,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Mathematical Reasoning',
      topic: problem.topic,
      difficulty,
      grade,
      tags: ['mathematics', 'diverse', problem.concept.toLowerCase()],
      createdBy: 'diverse-math-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Get all available question categories for a grade/difficulty combination
   */
  private static getQuestionCategories(grade: number, difficulty: DifficultyLevel): QuestionCategory[] {
    if (grade <= 5) {
      return this.getElementaryCategories(grade, difficulty);
    } else if (grade <= 8) {
      return this.getMiddleSchoolCategories(grade, difficulty);
    } else {
      return this.getHighSchoolCategories(grade, difficulty);
    }
  }
  
  /**
   * Elementary Math Categories (Grades 1-5) - 8+ different types
   */
  private static getElementaryCategories(grade: number, difficulty: DifficultyLevel): QuestionCategory[] {
    const categories: QuestionCategory[] = [
      {
        name: 'Basic Addition',
        weight: 15,
        generator: () => this.generateAddition(difficulty)
      },
      {
        name: 'Basic Subtraction', 
        weight: 15,
        generator: () => this.generateSubtraction(difficulty)
      },
      {
        name: 'Multiplication',
        weight: 15,
        generator: () => this.generateMultiplication(difficulty)
      },
      {
        name: 'Division',
        weight: 15,
        generator: () => this.generateDivision(difficulty)
      },
      {
        name: 'Word Problems',
        weight: 12,
        generator: () => this.generateWordProblem(difficulty)
      },
      {
        name: 'Number Patterns',
        weight: 8,
        generator: () => this.generateNumberPattern(difficulty)
      },
      {
        name: 'Geometry Basics',
        weight: 8,
        generator: () => this.generateBasicGeometry(difficulty)
      },
      {
        name: 'Time & Money',
        weight: 7,
        generator: () => this.generateTimeAndMoney(difficulty)
      },
      {
        name: 'Fractions',
        weight: 5,
        generator: () => this.generateBasicFractions(difficulty)
      }
    ];
    
    // Adjust weights based on difficulty
    if (difficulty === DifficultyLevel.HARD) {
      categories.find(c => c.name === 'Fractions')!.weight = 15;
      categories.find(c => c.name === 'Word Problems')!.weight = 20;
    }
    
    return categories;
  }
  
  /**
   * Middle School Categories (Grades 6-8) - 10+ different types
   */
  private static getMiddleSchoolCategories(grade: number, difficulty: DifficultyLevel): QuestionCategory[] {
    return [
      {
        name: 'Pre-Algebra',
        weight: 18,
        generator: () => this.generatePreAlgebra(difficulty)
      },
      {
        name: 'Linear Equations',
        weight: 16,
        generator: () => this.generateLinearEquation(difficulty)
      },
      {
        name: 'Ratios & Proportions',
        weight: 14,
        generator: () => this.generateRatiosProportions(difficulty)
      },
      {
        name: 'Percentages',
        weight: 12,
        generator: () => this.generatePercentages(difficulty)
      },
      {
        name: 'Geometry',
        weight: 10,
        generator: () => this.generateGeometry(difficulty)
      },
      {
        name: 'Statistics',
        weight: 8,
        generator: () => this.generateStatistics(difficulty)
      },
      {
        name: 'Probability',
        weight: 8,
        generator: () => this.generateProbability(difficulty)
      },
      {
        name: 'Integers',
        weight: 7,
        generator: () => this.generateIntegers(difficulty)
      },
      {
        name: 'Exponents',
        weight: 4,
        generator: () => this.generateExponents(difficulty)
      },
      {
        name: 'Scientific Notation',
        weight: 3,
        generator: () => this.generateScientificNotation(difficulty)
      }
    ];
  }
  
  /**
   * High School Categories (Grades 9-12) - 12+ different types
   */
  private static getHighSchoolCategories(grade: number, difficulty: DifficultyLevel): QuestionCategory[] {
    return [
      {
        name: 'Quadratic Equations',
        weight: 16,
        generator: () => this.generateQuadratic(difficulty)
      },
      {
        name: 'Functions',
        weight: 14,
        generator: () => this.generateFunctions(difficulty)
      },
      {
        name: 'Polynomials',
        weight: 12,
        generator: () => this.generatePolynomials(difficulty)
      },
      {
        name: 'Trigonometry',
        weight: 10,
        generator: () => this.generateTrigonometry(difficulty)
      },
      {
        name: 'Logarithms',
        weight: 8,
        generator: () => this.generateLogarithms(difficulty)
      },
      {
        name: 'Systems of Equations',
        weight: 8,
        generator: () => this.generateSystemsOfEquations(difficulty)
      },
      {
        name: 'Inequalities',
        weight: 8,
        generator: () => this.generateInequalities(difficulty)
      },
      {
        name: 'Coordinate Geometry',
        weight: 7,
        generator: () => this.generateCoordinateGeometry(difficulty)
      },
      {
        name: 'Sequences & Series',
        weight: 6,
        generator: () => this.generateSequences(difficulty)
      },
      {
        name: 'Complex Numbers',
        weight: 5,
        generator: () => this.generateComplexNumbers(difficulty)
      },
      {
        name: 'Matrices',
        weight: 4,
        generator: () => this.generateMatrices(difficulty)
      },
      {
        name: 'Calculus Prep',
        weight: 2,
        generator: () => this.generateCalculusPrep(difficulty)
      }
    ];
  }
  
  /**
   * Weighted random selection
   */
  private static selectWeightedRandom(categories: QuestionCategory[]): QuestionCategory {
    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const category of categories) {
      random -= category.weight;
      if (random <= 0) {
        return category;
      }
    }
    
    return categories[0]; // Fallback
  }
  
  // ============================================================================
  // ELEMENTARY MATH GENERATORS (Grades 1-5)
  // ============================================================================
  
  private static generateAddition(difficulty: DifficultyLevel): MathProblem {
    const range = difficulty === DifficultyLevel.EASY ? [1, 20] : 
                  difficulty === DifficultyLevel.MEDIUM ? [10, 100] : [50, 500];
    
    const a = this.randomInt(range[0], range[1]);
    const b = this.randomInt(range[0], range[1]);
    const answer = a + b;
    
    return {
      question: `What is ${a} + ${b}?`,
      answer: answer.toString(),
      explanation: `${a} + ${b} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Addition',
      concept: 'Basic Arithmetic'
    };
  }
  
  private static generateNumberPattern(difficulty: DifficultyLevel): MathProblem {
    const patterns = [
      { rule: (n: number) => n + 2, start: 2, name: 'add 2' },
      { rule: (n: number) => n + 3, start: 1, name: 'add 3' },
      { rule: (n: number) => n + 5, start: 5, name: 'add 5' },
      { rule: (n: number) => n * 2, start: 1, name: 'multiply by 2' },
      { rule: (n: number) => n + 10, start: 10, name: 'add 10' }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const sequence = [pattern.start];
    
    for (let i = 0; i < 4; i++) {
      sequence.push(pattern.rule(sequence[sequence.length - 1]));
    }
    
    const answer = sequence[sequence.length - 1];
    const questionSequence = sequence.slice(0, -1);
    
    return {
      question: `What comes next in this pattern? ${questionSequence.join(', ')}, ___`,
      answer: answer.toString(),
      explanation: `The pattern is ${pattern.name}. So ${questionSequence[questionSequence.length - 1]} ${pattern.name.includes('add') ? '+' : '×'} ${pattern.name.split(' ')[1]} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Number Patterns',
      concept: 'Pattern Recognition'
    };
  }
  
  private static generateBasicGeometry(difficulty: DifficultyLevel): MathProblem {
    const shapes = [
      { name: 'rectangle', sides: 4, formula: 'length × width' },
      { name: 'square', sides: 4, formula: 'side × side' },
      { name: 'triangle', sides: 3, formula: '½ × base × height' }
    ];
    
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    if (shape.name === 'rectangle') {
      const length = this.randomInt(3, 12);
      const width = this.randomInt(2, 8);
      const area = length * width;
      
      return {
        question: `What is the area of a rectangle with length ${length} and width ${width}?`,
        answer: area.toString(),
        explanation: `Area of rectangle = length × width = ${length} × ${width} = ${area}`,
        options: this.generateOptions(area, 4),
        topic: 'Geometry',
        concept: 'Area Calculation'
      };
    } else {
      const side = this.randomInt(3, 10);
      const perimeter = side * shape.sides;
      
      return {
        question: `What is the perimeter of a ${shape.name} with each side measuring ${side} units?`,
        answer: perimeter.toString(),
        explanation: `Perimeter = ${shape.sides} × ${side} = ${perimeter}`,
        options: this.generateOptions(perimeter, 4),
        topic: 'Geometry',
        concept: 'Perimeter Calculation'
      };
    }
  }
  
  // ============================================================================
  // MIDDLE SCHOOL GENERATORS (Grades 6-8)
  // ============================================================================
  
  private static generateRatiosProportions(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(2, 8);
    const b = this.randomInt(3, 12);
    const multiplier = this.randomInt(2, 6);
    const c = a * multiplier;
    const answer = b * multiplier;
    
    return {
      question: `If ${a} : ${b} = ${c} : x, what is the value of x?`,
      answer: answer.toString(),
      explanation: `Since ${a} × ${multiplier} = ${c}, we need ${b} × ${multiplier} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Ratios & Proportions',
      concept: 'Proportional Reasoning'
    };
  }
  
  private static generatePercentages(difficulty: DifficultyLevel): MathProblem {
    const whole = this.randomInt(50, 200);
    const percent = this.randomInt(10, 90);
    const answer = Math.round((percent / 100) * whole);
    
    return {
      question: `What is ${percent}% of ${whole}?`,
      answer: answer.toString(),
      explanation: `${percent}% of ${whole} = (${percent}/100) × ${whole} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Percentages',
      concept: 'Percentage Calculation'
    };
  }
  
  private static generateProbability(difficulty: DifficultyLevel): MathProblem {
    const scenarios = [
      {
        setup: () => {
          const total = this.randomInt(8, 20);
          const favorable = this.randomInt(2, total - 2);
          return {
            question: `A bag contains ${total} balls. ${favorable} are red and the rest are blue. What is the probability of drawing a red ball?`,
            answer: `${favorable}/${total}`,
            explanation: `Probability = favorable outcomes / total outcomes = ${favorable}/${total}`
          };
        }
      }
    ];
    
    const scenario = scenarios[0].setup();
    
    return {
      question: scenario.question,
      answer: scenario.answer,
      explanation: scenario.explanation,
      options: [scenario.answer, `${this.randomInt(1, 5)}/${this.randomInt(6, 15)}`, `${this.randomInt(1, 3)}/${this.randomInt(4, 8)}`, `${this.randomInt(2, 7)}/${this.randomInt(8, 12)}`],
      topic: 'Probability',
      concept: 'Basic Probability'
    };
  }
  
  // ============================================================================
  // HIGH SCHOOL GENERATORS (Grades 9-12)
  // ============================================================================
  
  private static generateQuadratic(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(1, 3);
    const b = this.randomInt(-6, 6);
    const c = this.randomInt(-8, 8);
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant >= 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      
      const answer = discriminant === 0 ? x1.toFixed(1) : `${x1.toFixed(1)}, ${x2.toFixed(1)}`;
      
      return {
        question: `Solve for x: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
        answer: answer,
        explanation: `Using the quadratic formula: x = (-b ± √(b²-4ac)) / 2a`,
        options: [answer, `${(x1 + 1).toFixed(1)}`, `${(x1 - 1).toFixed(1)}`, `${(x1 + 2).toFixed(1)}`],
        topic: 'Quadratic Equations',
        concept: 'Quadratic Formula'
      };
    } else {
      return this.generateQuadratic(difficulty); // Retry if no real solutions
    }
  }
  
  private static generateFunctions(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(2, 8);
    const b = this.randomInt(-5, 5);
    const x = this.randomInt(1, 6);
    const answer = a * x + b;
    
    return {
      question: `If f(x) = ${a}x ${b >= 0 ? '+' : ''}${b}, what is f(${x})?`,
      answer: answer.toString(),
      explanation: `f(${x}) = ${a}(${x}) ${b >= 0 ? '+' : ''}${b} = ${a * x} ${b >= 0 ? '+' : ''}${b} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Functions',
      concept: 'Function Evaluation'
    };
  }
  
  // ============================================================================
  // UTILITY METHODS
  // ============================================================================
  
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  private static generateOptions(correctAnswer: number, count: number): string[] {
    const options = [correctAnswer.toString()];
    const used = new Set([correctAnswer]);
    
    while (options.length < count) {
      const variation = correctAnswer + this.randomInt(-5, 5);
      if (!used.has(variation) && variation > 0) {
        options.push(variation.toString());
        used.add(variation);
      }
    }
    
    return this.shuffleArray(options);
  }
  
  private static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // Placeholder implementations for remaining generators
  private static generateSubtraction(difficulty: DifficultyLevel): MathProblem {
    const range = difficulty === DifficultyLevel.EASY ? [1, 20] : [10, 100];
    const a = this.randomInt(range[0], range[1]);
    const b = this.randomInt(1, a);
    const answer = a - b;
    
    return {
      question: `What is ${a} - ${b}?`,
      answer: answer.toString(),
      explanation: `${a} - ${b} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Subtraction',
      concept: 'Basic Arithmetic'
    };
  }
  
  private static generateMultiplication(difficulty: DifficultyLevel): MathProblem {
    const range = difficulty === DifficultyLevel.EASY ? [2, 12] : [5, 25];
    const a = this.randomInt(range[0], range[1]);
    const b = this.randomInt(2, 12);
    const answer = a * b;
    
    return {
      question: `What is ${a} × ${b}?`,
      answer: answer.toString(),
      explanation: `${a} × ${b} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Multiplication',
      concept: 'Basic Arithmetic'
    };
  }
  
  private static generateDivision(difficulty: DifficultyLevel): MathProblem {
    const b = this.randomInt(2, 12);
    const answer = this.randomInt(2, 15);
    const a = b * answer;
    
    return {
      question: `What is ${a} ÷ ${b}?`,
      answer: answer.toString(),
      explanation: `${a} ÷ ${b} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Division',
      concept: 'Basic Arithmetic'
    };
  }
  
  // Add placeholder implementations for all other methods...
  private static generateWordProblem(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateTimeAndMoney(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateBasicFractions(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generatePreAlgebra(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateLinearEquation(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateGeometry(difficulty: DifficultyLevel): MathProblem {
    return this.generateBasicGeometry(difficulty);
  }
  
  private static generateStatistics(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateIntegers(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateExponents(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateScientificNotation(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generatePolynomials(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateTrigonometry(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateLogarithms(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateSystemsOfEquations(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateInequalities(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateCoordinateGeometry(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateSequences(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateComplexNumbers(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateMatrices(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
  
  private static generateCalculusPrep(difficulty: DifficultyLevel): MathProblem {
    return this.generateAddition(difficulty); // Simplified for now
  }
}

export default DiverseMathGenerator;
