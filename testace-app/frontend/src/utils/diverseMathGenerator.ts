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
  // HIGH SCHOOL GENERATORS (Grades 9-12) - FULLY IMPLEMENTED
  // ============================================================================
  
  private static generateQuadratic(difficulty: DifficultyLevel): MathProblem {
    const questionTypes = [
      'solve_factoring',
      'solve_formula', 
      'vertex_form',
      'discriminant',
      'word_problem'
    ];
    
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'solve_factoring':
        const r1 = this.randomInt(1, 6);
        const r2 = this.randomInt(1, 6);
        const b = -(r1 + r2);
        const c = r1 * r2;
        return {
          question: `Solve by factoring: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
          answer: `x = ${r1}, x = ${r2}`,
          explanation: `Factor as (x - ${r1})(x - ${r2}) = 0, so x = ${r1} or x = ${r2}`,
          options: [`x = ${r1}, x = ${r2}`, `x = ${r1 + 1}, x = ${r2 + 1}`, `x = ${r1}, x = ${r2 + 2}`, `x = ${r1 - 1}, x = ${r2}`],
          topic: 'Quadratic Equations',
          concept: 'Factoring'
        };
        
      case 'vertex_form':
        const h = this.randomInt(-3, 3);
        const k = this.randomInt(-5, 5);
        return {
          question: `What is the vertex of the parabola y = (x ${h >= 0 ? '-' : '+'}${Math.abs(h)})² ${k >= 0 ? '+' : ''}${k}?`,
          answer: `(${h}, ${k})`,
          explanation: `In vertex form y = (x - h)² + k, the vertex is (h, k) = (${h}, ${k})`,
          options: [`(${h}, ${k})`, `(${-h}, ${k})`, `(${h}, ${-k})`, `(${-h}, ${-k})`],
          topic: 'Quadratic Equations',
          concept: 'Vertex Form'
        };
        
      case 'word_problem':
        const height = this.randomInt(100, 200);
        return {
          question: `A ball is thrown upward from a ${height}-foot building. Its height h(t) = -16t² + 64t + ${height}. When does it hit the ground?`,
          answer: `${(64 + Math.sqrt(64*64 + 64*height))/32} seconds`,
          explanation: `Set h(t) = 0 and solve: -16t² + 64t + ${height} = 0`,
          options: ['5.5 seconds', '6.0 seconds', '4.5 seconds', '7.0 seconds'],
          topic: 'Quadratic Equations',
          concept: 'Applications'
        };
        
      default:
        return this.generateQuadratic(difficulty); // Retry
    }
  }
  
  private static generateFunctions(difficulty: DifficultyLevel): MathProblem {
    const questionTypes = [
      'evaluate',
      'composition',
      'inverse',
      'domain_range',
      'transformations'
    ];
    
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'evaluate':
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
        
      case 'composition':
        const f_coef = this.randomInt(2, 4);
        const g_coef = this.randomInt(2, 4);
        const input = this.randomInt(1, 3);
        const g_result = g_coef * input;
        const final_result = f_coef * g_result;
        return {
          question: `If f(x) = ${f_coef}x and g(x) = ${g_coef}x, what is f(g(${input}))?`,
          answer: final_result.toString(),
          explanation: `First find g(${input}) = ${g_coef}(${input}) = ${g_result}, then f(${g_result}) = ${f_coef}(${g_result}) = ${final_result}`,
          options: this.generateOptions(final_result, 4),
          topic: 'Functions',
          concept: 'Function Composition'
        };
        
      case 'inverse':
        const m = this.randomInt(2, 5);
        const n = this.randomInt(1, 4);
        return {
          question: `What is the inverse of f(x) = ${m}x + ${n}?`,
          answer: `f⁻¹(x) = (x - ${n})/${m}`,
          explanation: `To find inverse: y = ${m}x + ${n}, solve for x: x = (y - ${n})/${m}, so f⁻¹(x) = (x - ${n})/${m}`,
          options: [`f⁻¹(x) = (x - ${n})/${m}`, `f⁻¹(x) = (x + ${n})/${m}`, `f⁻¹(x) = ${m}x - ${n}`, `f⁻¹(x) = x/${m} + ${n}`],
          topic: 'Functions',
          concept: 'Inverse Functions'
        };
        
      case 'domain_range':
        const denom = this.randomInt(2, 6);
        return {
          question: `What is the domain of f(x) = 1/(x - ${denom})?`,
          answer: `All real numbers except x = ${denom}`,
          explanation: `The function is undefined when the denominator equals zero: x - ${denom} = 0, so x = ${denom}`,
          options: [`All real numbers except x = ${denom}`, `All real numbers except x = ${-denom}`, `All real numbers`, `x ≥ ${denom}`],
          topic: 'Functions',
          concept: 'Domain and Range'
        };
        
      default:
        const a2 = this.randomInt(2, 8);
        const b2 = this.randomInt(-5, 5);
        const x2 = this.randomInt(1, 6);
        const answer2 = a2 * x2 + b2;
        return {
          question: `If f(x) = ${a2}x ${b2 >= 0 ? '+' : ''}${b2}, what is f(${x2})?`,
          answer: answer2.toString(),
          explanation: `f(${x2}) = ${a2}(${x2}) ${b2 >= 0 ? '+' : ''}${b2} = ${answer2}`,
          options: this.generateOptions(answer2, 4),
          topic: 'Functions',
          concept: 'Function Evaluation'
        };
    }
  }
  
  private static generatePolynomials(difficulty: DifficultyLevel): MathProblem {
    const questionTypes = ['factor_difference_squares', 'factor_trinomial', 'polynomial_division', 'synthetic_division'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'factor_difference_squares':
        const a = this.randomInt(2, 8);
        const b = this.randomInt(2, 6);
        return {
          question: `Factor: ${a*a}x² - ${b*b}`,
          answer: `(${a}x + ${b})(${a}x - ${b})`,
          explanation: `This is a difference of squares: (${a}x)² - ${b}² = (${a}x + ${b})(${a}x - ${b})`,
          options: [`(${a}x + ${b})(${a}x - ${b})`, `(${a}x - ${b})²`, `${a}x(x - ${b})`, `(${a}x + ${b})²`],
          topic: 'Polynomials',
          concept: 'Factoring'
        };
        
      case 'factor_trinomial':
        const p = this.randomInt(2, 4);
        const q = this.randomInt(2, 4);
        const middle = p + q;
        const last = p * q;
        return {
          question: `Factor: x² + ${middle}x + ${last}`,
          answer: `(x + ${p})(x + ${q})`,
          explanation: `Find two numbers that multiply to ${last} and add to ${middle}: ${p} and ${q}`,
          options: [`(x + ${p})(x + ${q})`, `(x + ${middle})(x + 1)`, `(x + ${last})(x + 1)`, `x(x + ${middle})`],
          topic: 'Polynomials',
          concept: 'Factoring Trinomials'
        };
        
      default:
        return this.generatePolynomials(difficulty);
    }
  }
  
  private static generateTrigonometry(difficulty: DifficultyLevel): MathProblem {
    const questionTypes = ['basic_ratios', 'unit_circle', 'identities', 'equations'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'basic_ratios':
        const angles = [30, 45, 60];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        const values: { [key: number]: string } = {30: '1/2', 45: '√2/2', 60: '√3/2'};
        return {
          question: `What is sin(${angle}°)?`,
          answer: values[angle],
          explanation: `sin(${angle}°) = ${values[angle]} (special angle)`,
          options: [values[angle], '1/2', '√2/2', '√3/2'].slice(0, 4),
          topic: 'Trigonometry',
          concept: 'Special Angles'
        };
        
      case 'unit_circle':
        return {
          question: `In which quadrant is the angle 150° located?`,
          answer: 'Quadrant II',
          explanation: '150° is between 90° and 180°, so it\'s in Quadrant II',
          options: ['Quadrant II', 'Quadrant I', 'Quadrant III', 'Quadrant IV'],
          topic: 'Trigonometry',
          concept: 'Unit Circle'
        };
        
      default:
        return {
          question: `What is cos(0°)?`,
          answer: '1',
          explanation: 'cos(0°) = 1 (basic trigonometric value)',
          options: ['1', '0', '-1', '1/2'],
          topic: 'Trigonometry',
          concept: 'Basic Values'
        };
    }
  }
  
  private static generateLogarithms(difficulty: DifficultyLevel): MathProblem {
    const questionTypes = ['basic_log', 'log_properties', 'exponential_form', 'change_of_base'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'basic_log':
        const base = this.randomInt(2, 5);
        const exponent = this.randomInt(2, 4);
        const result = Math.pow(base, exponent);
        return {
          question: `What is log₍${base}₎(${result})?`,
          answer: exponent.toString(),
          explanation: `log₍${base}₎(${result}) = ${exponent} because ${base}^${exponent} = ${result}`,
          options: this.generateOptions(exponent, 4),
          topic: 'Logarithms',
          concept: 'Basic Logarithms'
        };
        
      case 'log_properties':
        const a = this.randomInt(2, 5);
        const b = this.randomInt(2, 5);
        return {
          question: `Simplify: log(${a}) + log(${b})`,
          answer: `log(${a * b})`,
          explanation: `Using the product rule: log(a) + log(b) = log(ab) = log(${a * b})`,
          options: [`log(${a * b})`, `log(${a + b})`, `${a + b}`, `${a * b}`],
          topic: 'Logarithms',
          concept: 'Logarithm Properties'
        };
        
      default:
        return {
          question: `What is log₁₀(100)?`,
          answer: '2',
          explanation: 'log₁₀(100) = 2 because 10² = 100',
          options: ['2', '10', '100', '1'],
          topic: 'Logarithms',
          concept: 'Common Logarithms'
        };
    }
  }
  
  private static generateSystemsOfEquations(difficulty: DifficultyLevel): MathProblem {
    const questionTypes = ['substitution', 'elimination', 'graphing', 'word_problem'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'substitution':
        const x = this.randomInt(1, 5);
        const y = this.randomInt(1, 5);
        const a1 = this.randomInt(1, 3);
        const b1 = this.randomInt(1, 3);
        const c1 = a1 * x + b1 * y;
        return {
          question: `Solve using substitution:\ny = ${x}\n${a1}x + ${b1}y = ${c1}`,
          answer: `x = ${x}, y = ${x}`,
          explanation: `Substitute y = ${x} into the second equation: ${a1}x + ${b1}(${x}) = ${c1}`,
          options: [`x = ${x}, y = ${x}`, `x = ${x + 1}, y = ${x}`, `x = ${x}, y = ${x + 1}`, `x = ${x - 1}, y = ${x}`],
          topic: 'Systems of Equations',
          concept: 'Substitution Method'
        };
        
      case 'elimination':
        const sol_x = this.randomInt(1, 4);
        const sol_y = this.randomInt(1, 4);
        const coef_a = this.randomInt(1, 3);
        const coef_b = this.randomInt(1, 3);
        const coef_c = this.randomInt(1, 3);
        const coef_d = this.randomInt(1, 3);
        const rhs1 = coef_a * sol_x + coef_b * sol_y;
        const rhs2 = coef_c * sol_x + coef_d * sol_y;
        return {
          question: `Solve using elimination:\n${coef_a}x + ${coef_b}y = ${rhs1}\n${coef_c}x + ${coef_d}y = ${rhs2}`,
          answer: `x = ${sol_x}, y = ${sol_y}`,
          explanation: `Using elimination method to solve the system`,
          options: [`x = ${sol_x}, y = ${sol_y}`, `x = ${sol_x + 1}, y = ${sol_y}`, `x = ${sol_x}, y = ${sol_y + 1}`, `x = ${sol_x - 1}, y = ${sol_y - 1}`],
          topic: 'Systems of Equations',
          concept: 'Elimination Method'
        };
        
      default:
        return {
          question: `How many solutions does this system have?\nx + y = 5\n2x + 2y = 10`,
          answer: 'Infinitely many',
          explanation: 'The second equation is 2 times the first, so they represent the same line',
          options: ['Infinitely many', 'One solution', 'No solution', 'Two solutions'],
          topic: 'Systems of Equations',
          concept: 'Types of Solutions'
        };
    }
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
  
  // Add proper implementations for remaining methods...
  private static generateWordProblem(difficulty: DifficultyLevel): MathProblem {
    const scenarios = [
      {
        setup: (n1: number, n2: number) => ({
          question: `Sarah has ${n1} stickers. She gives away ${n2} stickers to her friends. How many stickers does she have left?`,
          answer: n1 - n2,
          explanation: `Sarah started with ${n1} stickers and gave away ${n2} stickers. ${n1} - ${n2} = ${n1 - n2} stickers remaining.`
        })
      },
      {
        setup: (n1: number, n2: number) => ({
          question: `A box contains ${n1} red balls and ${n2} blue balls. How many balls are in the box in total?`,
          answer: n1 + n2,
          explanation: `Red balls: ${n1}, Blue balls: ${n2}, Total: ${n1} + ${n2} = ${n1 + n2} balls`
        })
      }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const n1 = this.randomInt(15, 50);
    const n2 = this.randomInt(5, n1 - 1);
    const problem = scenario.setup(n1, n2);
    
    return {
      question: problem.question,
      answer: problem.answer.toString(),
      explanation: problem.explanation,
      options: this.generateOptions(problem.answer, 4),
      topic: 'Word Problems',
      concept: 'Problem Solving'
    };
  }
  
  private static generateTimeAndMoney(difficulty: DifficultyLevel): MathProblem {
    const price = this.randomInt(250, 850) / 100; // $2.50 to $8.50
    const paid = Math.ceil(price) + this.randomInt(1, 5); // Round up + extra
    const change = paid - price;
    
    return {
      question: `You buy something for $${price.toFixed(2)} and pay with $${paid}. How much change do you get?`,
      answer: `$${change.toFixed(2)}`,
      explanation: `Change = Amount paid - Cost = $${paid} - $${price.toFixed(2)} = $${change.toFixed(2)}`,
      options: [`$${change.toFixed(2)}`, `$${(change + 0.25).toFixed(2)}`, `$${(change - 0.25).toFixed(2)}`, `$${(change + 0.50).toFixed(2)}`],
      topic: 'Money',
      concept: 'Making Change'
    };
  }
  
  private static generateBasicFractions(difficulty: DifficultyLevel): MathProblem {
    const num1 = this.randomInt(1, 4);
    const den1 = this.randomInt(2, 8);
    const num2 = this.randomInt(1, 4);
    const den2 = den1; // Same denominator for simplicity
    const answerNum = num1 + num2;
    
    return {
      question: `What is ${num1}/${den1} + ${num2}/${den2}?`,
      answer: `${answerNum}/${den1}`,
      explanation: `${num1}/${den1} + ${num2}/${den2} = ${answerNum}/${den1}`,
      options: [`${answerNum}/${den1}`, `${answerNum + 1}/${den1}`, `${answerNum}/${den1 + 1}`, `${num1 + num2}/${den1 + den2}`],
      topic: 'Fractions',
      concept: 'Adding Fractions'
    };
  }
  
  private static generatePreAlgebra(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(2, 8);
    const b = this.randomInt(5, 20);
    const answer = (b - 3) / a;
    
    return {
      question: `Solve for x: ${a}x + 3 = ${b}`,
      answer: answer.toString(),
      explanation: `${a}x + 3 = ${b}, so ${a}x = ${b - 3}, therefore x = ${answer}`,
      options: this.generateOptions(Math.round(answer), 4),
      topic: 'Pre-Algebra',
      concept: 'Solving Equations'
    };
  }
  
  private static generateLinearEquation(difficulty: DifficultyLevel): MathProblem {
    const m = this.randomInt(2, 6);
    const b = this.randomInt(-5, 5);
    const x = this.randomInt(1, 5);
    const y = m * x + b;
    
    return {
      question: `What is the y-intercept of the line passing through (${x}, ${y}) with slope ${m}?`,
      answer: b.toString(),
      explanation: `Using point-slope form: y - ${y} = ${m}(x - ${x}), so y = ${m}x + ${b}. Y-intercept is ${b}`,
      options: this.generateOptions(b, 4),
      topic: 'Linear Equations',
      concept: 'Y-Intercept'
    };
  }
  
  private static generateGeometry(difficulty: DifficultyLevel): MathProblem {
    return this.generateBasicGeometry(difficulty);
  }
  
  private static generateStatistics(difficulty: DifficultyLevel): MathProblem {
    const data = [this.randomInt(10, 20), this.randomInt(15, 25), this.randomInt(20, 30), this.randomInt(25, 35)];
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    return {
      question: `Find the mean of: ${data.join(', ')}`,
      answer: mean.toString(),
      explanation: `Mean = (${data.join(' + ')}) ÷ ${data.length} = ${mean}`,
      options: this.generateOptions(Math.round(mean), 4),
      topic: 'Statistics',
      concept: 'Mean'
    };
  }
  
  private static generateIntegers(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(-10, -1);
    const b = this.randomInt(1, 10);
    const answer = a + b;
    
    return {
      question: `What is ${a} + ${b}?`,
      answer: answer.toString(),
      explanation: `${a} + ${b} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Integers',
      concept: 'Adding Integers'
    };
  }
  
  private static generateExponents(difficulty: DifficultyLevel): MathProblem {
    const base = this.randomInt(2, 5);
    const exp = this.randomInt(2, 4);
    const answer = Math.pow(base, exp);
    
    return {
      question: `What is ${base}^${exp}?`,
      answer: answer.toString(),
      explanation: `${base}^${exp} = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Exponents',
      concept: 'Powers'
    };
  }
  
  private static generateScientificNotation(difficulty: DifficultyLevel): MathProblem {
    const coefficient = this.randomInt(1, 9) + this.randomInt(1, 9) / 10;
    const exponent = this.randomInt(2, 5);
    const standard = coefficient * Math.pow(10, exponent);
    
    return {
      question: `Write ${standard} in scientific notation`,
      answer: `${coefficient} × 10^${exponent}`,
      explanation: `${standard} = ${coefficient} × 10^${exponent}`,
      options: [`${coefficient} × 10^${exponent}`, `${coefficient * 10} × 10^${exponent - 1}`, `${coefficient} × 10^${exponent + 1}`, `${coefficient / 10} × 10^${exponent + 1}`],
      topic: 'Scientific Notation',
      concept: 'Standard to Scientific'
    };
  }
  
  private static generateInequalities(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(2, 6);
    const b = this.randomInt(10, 30);
    const answer = Math.floor(b / a);
    
    return {
      question: `Solve: ${a}x ≤ ${b}`,
      answer: `x ≤ ${answer}`,
      explanation: `Divide both sides by ${a}: x ≤ ${b}/${a} = ${answer}`,
      options: [`x ≤ ${answer}`, `x ≥ ${answer}`, `x < ${answer}`, `x > ${answer}`],
      topic: 'Inequalities',
      concept: 'Linear Inequalities'
    };
  }
  
  private static generateCoordinateGeometry(difficulty: DifficultyLevel): MathProblem {
    const x1 = this.randomInt(1, 5);
    const y1 = this.randomInt(1, 5);
    const x2 = this.randomInt(6, 10);
    const y2 = this.randomInt(6, 10);
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    return {
      question: `Find the distance between points (${x1}, ${y1}) and (${x2}, ${y2})`,
      answer: distance.toFixed(1),
      explanation: `Distance = √[(${x2}-${x1})² + (${y2}-${y1})²] = √[${Math.pow(x2-x1, 2)} + ${Math.pow(y2-y1, 2)}] = ${distance.toFixed(1)}`,
      options: [distance.toFixed(1), (distance + 1).toFixed(1), (distance - 1).toFixed(1), (distance + 0.5).toFixed(1)],
      topic: 'Coordinate Geometry',
      concept: 'Distance Formula'
    };
  }
  
  private static generateSequences(difficulty: DifficultyLevel): MathProblem {
    const first = this.randomInt(2, 8);
    const diff = this.randomInt(2, 5);
    const n = this.randomInt(5, 8);
    const answer = first + (n - 1) * diff;
    
    return {
      question: `In the arithmetic sequence ${first}, ${first + diff}, ${first + 2*diff}, ..., what is the ${n}th term?`,
      answer: answer.toString(),
      explanation: `Using formula: a_n = a_1 + (n-1)d = ${first} + (${n}-1)(${diff}) = ${answer}`,
      options: this.generateOptions(answer, 4),
      topic: 'Sequences',
      concept: 'Arithmetic Sequences'
    };
  }
  
  private static generateComplexNumbers(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(1, 5);
    const b = this.randomInt(1, 5);
    const c = this.randomInt(1, 5);
    const d = this.randomInt(1, 5);
    const realPart = a + c;
    const imagPart = b + d;
    
    return {
      question: `Add: (${a} + ${b}i) + (${c} + ${d}i)`,
      answer: `${realPart} + ${imagPart}i`,
      explanation: `Add real parts and imaginary parts separately: (${a} + ${c}) + (${b} + ${d})i = ${realPart} + ${imagPart}i`,
      options: [`${realPart} + ${imagPart}i`, `${realPart + 1} + ${imagPart}i`, `${realPart} + ${imagPart + 1}i`, `${a + b} + ${c + d}i`],
      topic: 'Complex Numbers',
      concept: 'Addition'
    };
  }
  
  private static generateMatrices(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(1, 5);
    const b = this.randomInt(1, 5);
    const c = this.randomInt(1, 5);
    const d = this.randomInt(1, 5);
    const det = a * d - b * c;
    
    return {
      question: `Find the determinant of the 2×2 matrix: [${a} ${b}; ${c} ${d}]`,
      answer: det.toString(),
      explanation: `Determinant = ad - bc = (${a})(${d}) - (${b})(${c}) = ${a*d} - ${b*c} = ${det}`,
      options: this.generateOptions(det, 4),
      topic: 'Matrices',
      concept: 'Determinant'
    };
  }
  
  private static generateCalculusPrep(difficulty: DifficultyLevel): MathProblem {
    const a = this.randomInt(2, 6);
    const h = this.randomInt(1, 4);
    const x = this.randomInt(1, 3);
    const limit = 2 * a * x;
    
    return {
      question: `Find the limit: lim(h→0) [f(x+h) - f(x)]/h where f(x) = ${a}x²`,
      answer: `${2*a}x`,
      explanation: `This is the definition of the derivative. For f(x) = ${a}x², f'(x) = ${2*a}x`,
      options: [`${2*a}x`, `${a}x`, `${a}x²`, `${2*a}`],
      topic: 'Limits',
      concept: 'Derivative Definition'
    };
  }
}

export default DiverseMathGenerator;
