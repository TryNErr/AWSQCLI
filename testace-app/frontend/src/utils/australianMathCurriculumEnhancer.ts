/**
 * Australian Mathematics Curriculum Enhanced Question Generator
 * Based on Australian Curriculum Mathematics standards and educational best practices.
 * 
 * Covers all strands: Number and Algebra, Measurement and Geometry, Statistics and Probability
 */

import { Question, DifficultyLevel, QuestionType } from '../types';
import { ensureUniqueOptions, shuffleArray, getRandomInt } from './questionUtils';
import { generateMathematicalReasoningId } from './idGenerator';

// Australian Curriculum Mathematics Strands for Year 9
export class AustralianMathCurriculumGenerator {
  
  /**
   * Generate mathematics questions based on Australian Curriculum Year 9 standards
   */
  static generateMathQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const strands = [
      'number_and_algebra',
      'measurement_and_geometry', 
      'statistics_and_probability'
    ];
    
    const strand = strands[getRandomInt(0, strands.length - 1)];
    
    let question: Question;
    switch (strand) {
      case 'number_and_algebra':
        question = this.generateNumberAlgebraQuestion(grade, difficulty);
        break;
      case 'measurement_and_geometry':
        question = this.generateMeasurementGeometryQuestion(grade, difficulty);
        break;
      case 'statistics_and_probability':
        question = this.generateStatisticsProbabilityQuestion(grade, difficulty);
        break;
      default:
        question = this.generateNumberAlgebraQuestion(grade, difficulty);
    }
    
    // Fix difficulty for Grade 9+ if needed
    if (parseInt(grade) >= 9) {
      question = this.validateAndFixGrade9Difficulty(question);
    }
    
    return question;
  }
  
  /**
   * Enhanced validation and fix difficulty for Grade 9+ questions
   */
  private static validateAndFixGrade9Difficulty(question: Question): Question {
    const content = question.content.toLowerCase();
    const grade = parseInt(question.grade);
    
    // Comprehensive patterns for operations that should NOT be Hard for Grade 9+
    const inappropriateHardPatterns = [
      /^\d+\.?\d*\s*[×*+\-÷\/]\s*\d+\.?\d*$/, // Simple arithmetic like "2.2 × 2"
      /^\d+\/\d+\s*[+\-]\s*\d+\/\d+$/, // Simple fractions like "1/12 + 10/12"
      /there are \d+.*and \d+.*how many.*total/i, // Simple word problems
      /\d+ dogs and \d+ cats.*how many animals/i, // Pet store problems
      /what is \d+.*[+\-×÷*\/].*\d+/i, // Basic "what is" questions
      /count.*total/i, // Simple counting
      /altogether.*how many/i, // Basic addition word problems
      /^\d+%\s*of\s*\d+$/i, // Simple percentage (single step)
    ];
    
    const isInappropriateHard = inappropriateHardPatterns.some(pattern => pattern.test(content));
    
    if (isInappropriateHard && question.difficulty === DifficultyLevel.HARD) {
      console.log(`🔧 Correcting Grade ${grade} question from Hard to Easy: "${question.content}"`);
      
      return {
        ...question,
        difficulty: DifficultyLevel.EASY,
        tags: [...(question.tags || []), 'difficulty-corrected-comprehensive', `grade-${grade}-auto-fixed`]
      };
    }
    
    // For Grade 10+, be even more strict
    if (grade >= 10) {
      const veryBasicPatterns = [
        /^\d+\s*[+\-]\s*\d+$/, // Single digit addition/subtraction
        /count/i, // Any counting problems
        /how many.*total/i, // Basic totaling
      ];
      
      if (veryBasicPatterns.some(pattern => pattern.test(content)) && 
          question.difficulty === DifficultyLevel.HARD) {
        
        console.log(`🔧 Correcting Grade ${grade} basic question from Hard to Easy: "${question.content}"`);
        
        return {
          ...question,
          difficulty: DifficultyLevel.EASY,
          tags: [...(question.tags || []), 'grade10-plus-corrected']
        };
      }
    }
    
    return question;
  }
  
  /**
   * Generate Number and Algebra questions
   */
  private static generateNumberAlgebraQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const topics = [
      'index_laws',
      'scientific_notation',
      'direct_proportion',
      'linear_equations',
      'coordinate_geometry',
      'simple_interest'
    ];
    
    const topic = topics[getRandomInt(0, topics.length - 1)];
    
    switch (topic) {
      case 'index_laws':
        return this.generateIndexLawsQuestion(grade, difficulty);
      case 'scientific_notation':
        return this.generateScientificNotationQuestion(grade, difficulty);
      case 'direct_proportion':
        return this.generateDirectProportionQuestion(grade, difficulty);
      case 'linear_equations':
        return this.generateLinearEquationsQuestion(grade, difficulty);
      case 'coordinate_geometry':
        return this.generateCoordinateGeometryQuestion(grade, difficulty);
      case 'simple_interest':
        return this.generateSimpleInterestQuestion(grade, difficulty);
      default:
        return this.generateIndexLawsQuestion(grade, difficulty);
    }
  }
  
  /**
   * Generate Measurement and Geometry questions
   */
  private static generateMeasurementGeometryQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const topics = [
      'surface_area_volume',
      'similarity',
      'pythagoras_theorem',
      'trigonometry_basic',
      'area_perimeter'
    ];
    
    const topic = topics[getRandomInt(0, topics.length - 1)];
    
    switch (topic) {
      case 'surface_area_volume':
        return this.generateSurfaceAreaVolumeQuestion(grade, difficulty);
      case 'similarity':
        return this.generateSimilarityQuestion(grade, difficulty);
      case 'pythagoras_theorem':
        return this.generatePythagorasQuestion(grade, difficulty);
      case 'trigonometry_basic':
        return this.generateBasicTrigonometryQuestion(grade, difficulty);
      case 'area_perimeter':
        return this.generateAreaPerimeterQuestion(grade, difficulty);
      default:
        return this.generateSurfaceAreaVolumeQuestion(grade, difficulty);
    }
  }
  
  /**
   * Generate Statistics and Probability questions
   */
  private static generateStatisticsProbabilityQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const topics = [
      'data_analysis',
      'probability_experiments',
      'relative_frequency',
      'statistical_measures'
    ];
    
    const topic = topics[getRandomInt(0, topics.length - 1)];
    
    switch (topic) {
      case 'data_analysis':
        return this.generateDataAnalysisQuestion(grade, difficulty);
      case 'probability_experiments':
        return this.generateProbabilityExperimentsQuestion(grade, difficulty);
      case 'relative_frequency':
        return this.generateRelativeFrequencyQuestion(grade, difficulty);
      case 'statistical_measures':
        return this.generateStatisticalMeasuresQuestion(grade, difficulty);
      default:
        return this.generateDataAnalysisQuestion(grade, difficulty);
    }
  }
  
  /**
   * Index Laws Questions
   */
  private static generateIndexLawsQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const questions = {
      [DifficultyLevel.EASY]: [
        {
          question: "Simplify: 3² × 3³",
          options: ["3⁵", "3⁶", "9⁵", "9⁶"],
          answer: "3⁵",
          explanation: "When multiplying powers with the same base, add the indices: 3² × 3³ = 3²⁺³ = 3⁵"
        },
        {
          question: "What is 2⁴?",
          options: ["8", "16", "32", "64"],
          answer: "16",
          explanation: "2⁴ = 2 × 2 × 2 × 2 = 16"
        }
      ],
      [DifficultyLevel.MEDIUM]: [
        {
          question: "Simplify: (x³)² ÷ x⁴",
          options: ["x²", "x⁶", "x¹⁰", "x"],
          answer: "x²",
          explanation: "(x³)² = x⁶, then x⁶ ÷ x⁴ = x⁶⁻⁴ = x²"
        },
        {
          question: "If 5ˣ = 125, what is the value of x?",
          options: ["2", "3", "4", "5"],
          answer: "3",
          explanation: "125 = 5³, so x = 3"
        }
      ],
      [DifficultyLevel.HARD]: [
        {
          question: "Simplify: (2a²b³)³ ÷ (4a³b)",
          options: ["2ab⁸", "2a³b⁸", "ab⁸", "2a⁻¹b⁸"],
          answer: "2a³b⁸",
          explanation: "(2a²b³)³ = 8a⁶b⁹, then 8a⁶b⁹ ÷ 4a³b = 2a³b⁸"
        }
      ]
    };
    
    const questionSet = questions[difficulty] || questions[DifficultyLevel.MEDIUM];
    const selected = questionSet[getRandomInt(0, questionSet.length - 1)];
    
    return {
      _id: generateMathematicalReasoningId(),
      content: selected.question,
      options: shuffleArray([...selected.options]),
      correctAnswer: selected.answer,
      explanation: selected.explanation,
      difficulty,
      subject: 'Math',
      grade,
      type: QuestionType.MULTIPLE_CHOICE,
      topic: 'Index Laws',
      tags: ['australian-curriculum', 'number-algebra', 'indices'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Scientific Notation Questions
   */
  private static generateScientificNotationQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const questions = {
      [DifficultyLevel.EASY]: [
        {
          question: "Express 4500 in scientific notation:",
          options: ["4.5 × 10³", "45 × 10²", "4.5 × 10⁴", "0.45 × 10⁴"],
          answer: "4.5 × 10³",
          explanation: "Move the decimal point 3 places to the left: 4500 = 4.5 × 10³"
        },
        {
          question: "What is 3.2 × 10² in standard form?",
          options: ["32", "320", "3200", "0.032"],
          answer: "320",
          explanation: "3.2 × 10² = 3.2 × 100 = 320"
        }
      ],
      [DifficultyLevel.MEDIUM]: [
        {
          question: "Express 0.00067 in scientific notation:",
          options: ["6.7 × 10⁻⁴", "6.7 × 10⁻³", "67 × 10⁻⁵", "6.7 × 10⁴"],
          answer: "6.7 × 10⁻⁴",
          explanation: "Move the decimal point 4 places to the right: 0.00067 = 6.7 × 10⁻⁴"
        },
        {
          question: "Calculate: (2 × 10³) × (3 × 10⁴)",
          options: ["6 × 10⁷", "6 × 10¹²", "5 × 10⁷", "6 × 10⁶"],
          answer: "6 × 10⁷",
          explanation: "(2 × 3) × (10³ × 10⁴) = 6 × 10⁷"
        }
      ],
      [DifficultyLevel.HARD]: [
        {
          question: "Calculate: (8 × 10⁶) ÷ (2 × 10⁻³)",
          options: ["4 × 10⁹", "4 × 10³", "16 × 10³", "4 × 10⁻⁹"],
          answer: "4 × 10⁹",
          explanation: "(8 ÷ 2) × (10⁶ ÷ 10⁻³) = 4 × 10⁶⁻⁽⁻³⁾ = 4 × 10⁹"
        }
      ]
    };
    
    const questionSet = questions[difficulty] || questions[DifficultyLevel.MEDIUM];
    const selected = questionSet[getRandomInt(0, questionSet.length - 1)];
    
    return {
      _id: generateMathematicalReasoningId(),
      content: selected.question,
      options: shuffleArray([...selected.options]),
      correctAnswer: selected.answer,
      explanation: selected.explanation,
      difficulty,
      subject: 'Math',
      grade,
      type: QuestionType.MULTIPLE_CHOICE,
      topic: 'Scientific Notation',
      tags: ['australian-curriculum', 'number-algebra', 'scientific-notation'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Linear Equations Questions
   */
  private static generateLinearEquationsQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const questions = {
      [DifficultyLevel.EASY]: [
        {
          question: "Solve for x: 2x + 5 = 13",
          options: ["x = 4", "x = 6", "x = 8", "x = 9"],
          answer: "x = 4",
          explanation: "2x = 13 - 5 = 8, so x = 4"
        },
        {
          question: "Solve for y: 3y - 7 = 14",
          options: ["y = 5", "y = 7", "y = 9", "y = 11"],
          answer: "y = 7",
          explanation: "3y = 14 + 7 = 21, so y = 7"
        }
      ],
      [DifficultyLevel.MEDIUM]: [
        {
          question: "Solve for x: 2(x - 3) = 4x + 2",
          options: ["x = -4", "x = -2", "x = 2", "x = 4"],
          answer: "x = -4",
          explanation: "2x - 6 = 4x + 2, so -6 - 2 = 4x - 2x, -8 = 2x, x = -4"
        },
        {
          question: "Solve for a: (a + 2)/3 = (a - 1)/2",
          options: ["a = 7", "a = 8", "a = 9", "a = 10"],
          answer: "a = 8",
          explanation: "Cross multiply: 2(a + 2) = 3(a - 1), 2a + 4 = 3a - 3, 7 = a"
        }
      ],
      [DifficultyLevel.HARD]: [
        {
          question: "Solve for x: 3/(x-1) + 2/(x+1) = 1",
          options: ["x = 5", "x = 6", "x = 7", "x = 8"],
          answer: "x = 5",
          explanation: "Multiply through by (x-1)(x+1): 3(x+1) + 2(x-1) = (x-1)(x+1), solve to get x = 5"
        }
      ]
    };
    
    const questionSet = questions[difficulty] || questions[DifficultyLevel.MEDIUM];
    const selected = questionSet[getRandomInt(0, questionSet.length - 1)];
    
    return {
      _id: generateMathematicalReasoningId(),
      content: selected.question,
      options: shuffleArray([...selected.options]),
      correctAnswer: selected.answer,
      explanation: selected.explanation,
      difficulty,
      subject: 'Math',
      grade,
      type: QuestionType.MULTIPLE_CHOICE,
      topic: 'Linear Equations',
      tags: ['australian-curriculum', 'number-algebra', 'equations'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Surface Area and Volume Questions
   */
  private static generateSurfaceAreaVolumeQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const questions = {
      [DifficultyLevel.EASY]: [
        {
          question: "Find the volume of a rectangular prism with length 6 cm, width 4 cm, and height 3 cm:",
          options: ["72 cm³", "52 cm³", "36 cm³", "24 cm³"],
          answer: "72 cm³",
          explanation: "Volume = length × width × height = 6 × 4 × 3 = 72 cm³"
        },
        {
          question: "What is the surface area of a cube with side length 5 cm?",
          options: ["150 cm²", "125 cm²", "100 cm²", "75 cm²"],
          answer: "150 cm²",
          explanation: "Surface area = 6 × side² = 6 × 5² = 6 × 25 = 150 cm²"
        }
      ],
      [DifficultyLevel.MEDIUM]: [
        {
          question: "A cylindrical tank has radius 3 m and height 8 m. Find its volume: (Use π ≈ 3.14)",
          options: ["226.08 m³", "150.72 m³", "75.36 m³", "301.44 m³"],
          answer: "226.08 m³",
          explanation: "Volume = πr²h = 3.14 × 3² × 8 = 3.14 × 9 × 8 = 226.08 m³"
        },
        {
          question: "Find the surface area of a triangular prism with triangular base area 12 cm², base perimeter 14 cm, and height 10 cm:",
          options: ["164 cm²", "140 cm²", "124 cm²", "180 cm²"],
          answer: "164 cm²",
          explanation: "Surface area = 2 × base area + perimeter × height = 2 × 12 + 14 × 10 = 24 + 140 = 164 cm²"
        }
      ],
      [DifficultyLevel.HARD]: [
        {
          question: "A cone has base radius 6 cm and slant height 10 cm. Find its total surface area: (Use π ≈ 3.14)",
          options: ["301.44 cm²", "188.4 cm²", "113.04 cm²", "226.08 cm²"],
          answer: "301.44 cm²",
          explanation: "Surface area = πr² + πrl = π × 6² + π × 6 × 10 = 36π + 60π = 96π ≈ 301.44 cm²"
        }
      ]
    };
    
    const questionSet = questions[difficulty] || questions[DifficultyLevel.MEDIUM];
    const selected = questionSet[getRandomInt(0, questionSet.length - 1)];
    
    return {
      _id: generateMathematicalReasoningId(),
      content: selected.question,
      options: shuffleArray([...selected.options]),
      correctAnswer: selected.answer,
      explanation: selected.explanation,
      difficulty,
      subject: 'Math',
      grade,
      type: QuestionType.MULTIPLE_CHOICE,
      topic: 'Surface Area and Volume',
      tags: ['australian-curriculum', 'measurement-geometry', 'volume', 'surface-area'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Probability Experiments Questions
   */
  private static generateProbabilityExperimentsQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const questions = {
      [DifficultyLevel.EASY]: [
        {
          question: "A fair six-sided die is rolled. What is the probability of rolling a number greater than 4?",
          options: ["1/6", "2/6", "3/6", "4/6"],
          answer: "2/6",
          explanation: "Numbers greater than 4 are 5 and 6. So probability = 2/6 = 1/3"
        },
        {
          question: "A bag contains 3 red balls and 7 blue balls. What is the probability of drawing a red ball?",
          options: ["3/10", "7/10", "3/7", "1/3"],
          answer: "3/10",
          explanation: "Probability = number of red balls / total balls = 3/10"
        }
      ],
      [DifficultyLevel.MEDIUM]: [
        {
          question: "Two coins are tossed. What is the probability of getting exactly one head?",
          options: ["1/4", "1/2", "3/4", "1/3"],
          answer: "1/2",
          explanation: "Possible outcomes: HH, HT, TH, TT. Exactly one head: HT, TH. Probability = 2/4 = 1/2"
        },
        {
          question: "A card is drawn from a standard deck of 52 cards. What is the probability it's either a heart or a face card?",
          options: ["11/26", "22/52", "25/52", "16/52"],
          answer: "11/26",
          explanation: "Hearts: 13, Face cards: 12, Face cards that are hearts: 3. Total = 13 + 12 - 3 = 22. Probability = 22/52 = 11/26"
        }
      ],
      [DifficultyLevel.HARD]: [
        {
          question: "Three dice are rolled. What is the probability that the sum is 10?",
          options: ["27/216", "25/216", "21/216", "30/216"],
          answer: "27/216",
          explanation: "Count all combinations that sum to 10: (1,3,6), (1,4,5), (2,2,6), (2,3,5), (2,4,4), (3,3,4) and their permutations. Total = 27 ways out of 216 possible outcomes."
        }
      ]
    };
    
    const questionSet = questions[difficulty] || questions[DifficultyLevel.MEDIUM];
    const selected = questionSet[getRandomInt(0, questionSet.length - 1)];
    
    return {
      _id: generateMathematicalReasoningId(),
      content: selected.question,
      options: shuffleArray([...selected.options]),
      correctAnswer: selected.answer,
      explanation: selected.explanation,
      difficulty,
      subject: 'Math',
      grade,
      type: QuestionType.MULTIPLE_CHOICE,
      topic: 'Probability',
      tags: ['australian-curriculum', 'statistics-probability', 'experiments'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Additional helper methods for other question types would go here...
  // (Continuing with similar patterns for remaining topics)
  
  /**
   * Generate coordinate geometry questions
   */
  private static generateCoordinateGeometryQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for coordinate geometry questions
    return this.generateIndexLawsQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate simple interest questions
   */
  private static generateSimpleInterestQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for simple interest questions
    return this.generateIndexLawsQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate similarity questions
   */
  private static generateSimilarityQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for similarity questions
    return this.generateSurfaceAreaVolumeQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate Pythagoras theorem questions
   */
  private static generatePythagorasQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for Pythagoras questions
    return this.generateSurfaceAreaVolumeQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate basic trigonometry questions
   */
  private static generateBasicTrigonometryQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for trigonometry questions
    return this.generateSurfaceAreaVolumeQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate area and perimeter questions
   */
  private static generateAreaPerimeterQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for area/perimeter questions
    return this.generateSurfaceAreaVolumeQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate data analysis questions
   */
  private static generateDataAnalysisQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for data analysis questions
    return this.generateProbabilityExperimentsQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate relative frequency questions
   */
  private static generateRelativeFrequencyQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for relative frequency questions
    return this.generateProbabilityExperimentsQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate statistical measures questions
   */
  private static generateStatisticalMeasuresQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for statistical measures questions
    return this.generateProbabilityExperimentsQuestion(grade, difficulty); // Placeholder
  }
  
  /**
   * Generate direct proportion questions
   */
  private static generateDirectProportionQuestion(grade: string, difficulty: DifficultyLevel): Question {
    // Implementation for direct proportion questions
    return this.generateIndexLawsQuestion(grade, difficulty); // Placeholder
  }
}
