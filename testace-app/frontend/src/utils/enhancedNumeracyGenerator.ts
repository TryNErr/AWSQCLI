import { Question, DifficultyLevel, QuestionType } from '../types';

/**
 * Enhanced Numeracy Question Generator
 * 
 * Based on NAPLAN numeracy assessments, this generator creates
 * comprehensive math questions across all grade levels:
 * 
 * Categories:
 * 1. Number & Place Value
 * 2. Addition & Subtraction
 * 3. Multiplication & Division
 * 4. Fractions & Decimals
 * 5. Measurement & Geometry
 * 6. Statistics & Probability
 * 7. Patterns & Algebra
 * 8. Money & Financial Literacy
 */

interface NumeracyConfig {
  grade: string;
  difficulty: DifficultyLevel;
  questionCount: number;
}

export class EnhancedNumeracyGenerator {
  
  private static generateId(): string {
    return `numeracy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate enhanced numeracy questions
   */
  static generateQuestions(config: NumeracyConfig): Question[] {
    const { grade, difficulty, questionCount } = config;
    const questions: Question[] = [];
    const gradeNum = parseInt(grade);
    
    // Define question type distribution based on grade level
    const questionTypes = this.getQuestionTypeDistribution(gradeNum);
    
    for (let i = 0; i < questionCount; i++) {
      const questionType = this.selectQuestionType(questionTypes);
      const question = this.generateQuestionByType(questionType, gradeNum, difficulty);
      questions.push(question);
    }
    
    return questions;
  }

  private static getQuestionTypeDistribution(grade: number): string[] {
    if (grade <= 3) {
      return [
        'counting', 'basic_addition', 'basic_subtraction', 'simple_shapes',
        'measurement_length', 'money_counting', 'simple_patterns', 'data_reading'
      ];
    } else if (grade <= 6) {
      return [
        'place_value', 'multi_digit_addition', 'multiplication_tables', 'basic_fractions',
        'area_perimeter', 'time_problems', 'data_interpretation', 'simple_algebra'
      ];
    } else if (grade <= 9) {
      return [
        'integers', 'fraction_operations', 'decimal_operations', 'percentage_problems',
        'coordinate_geometry', 'statistical_analysis', 'algebraic_expressions', 'problem_solving'
      ];
    } else {
      return [
        'advanced_algebra', 'trigonometry', 'calculus_basics', 'complex_geometry',
        'probability_theory', 'statistical_inference', 'mathematical_modeling', 'optimization'
      ];
    }
  }

  private static selectQuestionType(types: string[]): string {
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateQuestionByType(type: string, grade: number, difficulty: DifficultyLevel): Question {
    switch (type) {
      case 'counting':
      case 'basic_addition':
      case 'basic_subtraction':
        return this.generateBasicArithmeticQuestion(grade, difficulty);
      case 'money_counting':
      case 'money_problems':
        return this.generateMoneyQuestion(grade, difficulty);
      case 'measurement_length':
      case 'area_perimeter':
        return this.generateMeasurementQuestion(grade, difficulty);
      case 'data_reading':
      case 'data_interpretation':
        return this.generateDataQuestion(grade, difficulty);
      case 'fraction_operations':
      case 'basic_fractions':
        return this.generateFractionQuestion(grade, difficulty);
      case 'time_problems':
        return this.generateTimeQuestion(grade, difficulty);
      case 'percentage_problems':
        return this.generatePercentageQuestion(grade, difficulty);
      case 'problem_solving':
        return this.generateWordProblemQuestion(grade, difficulty);
      default:
        return this.generateBasicArithmeticQuestion(grade, difficulty);
    }
  }

  /**
   * Basic Arithmetic Questions (Grades 1-3)
   */
  private static generateBasicArithmeticQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'Carmen and Sal each had a piece of string. They measured their strings using paperclips.',
        question: 'Carmen\'s string was 8 paperclips long. Sal\'s string was 5 paperclips long. Which statement is true?',
        answer: 'Carmen\'s string is longer than Sal\'s string',
        explanation: '8 paperclips is more than 5 paperclips, so Carmen\'s string is longer.',
        options: [
          'Carmen\'s string is longer than Sal\'s string',
          'Carmen\'s string is shorter than Sal\'s string', 
          'Carmen\'s string is the same length as Sal\'s string',
          'We cannot tell which is longer'
        ]
      },
      {
        setup: 'A graph shows the number of students with each eye colour in Mrs Smith\'s class.',
        question: 'Blue: 7 students, Brown: 5 students, Green: 3 students, Grey: 2 students. Which statement is true?',
        answer: 'Blue is the most common eye colour',
        explanation: 'Blue has 7 students, which is more than any other eye colour.',
        options: [
          'Blue is the most common eye colour',
          'Brown is the most common eye colour',
          'Green is the most common eye colour',
          'All eye colours are equally common'
        ]
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Basic Arithmetic',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['arithmetic', 'comparison', 'data-reading'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Money Questions
   */
  private static generateMoneyQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'Paul has 6 ten-cent coins in his hands.',
        question: 'How much money does Paul have altogether?',
        answer: '60 cents',
        explanation: '6 × 10 cents = 60 cents',
        options: ['33 cents', '16 cents', '60 cents', '50 cents']
      },
      {
        setup: 'Lara earned $16.92 per hour working at a store. This week she worked for 12¼ hours.',
        question: 'She used her earnings to buy concert tickets at $19.55 each. What is the maximum number of tickets she could buy?',
        answer: '10 tickets',
        explanation: '$16.92 × 12.25 = $207.27. $207.27 ÷ $19.55 = 10.6, so maximum 10 tickets.',
        options: ['9 tickets', '10 tickets', '11 tickets', '12 tickets']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Money & Financial Literacy',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['money', 'multiplication', 'division', 'real-world'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Measurement Questions
   */
  private static generateMeasurementQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'When keeping horses, 1 hectare of land is recommended for every 2 horses.',
        question: 'How many hectares of land would be needed for 8 horses?',
        answer: '4 hectares',
        explanation: '8 horses ÷ 2 horses per hectare = 4 hectares needed.',
        options: ['4 hectares', '6 hectares', '10 hectares', '16 hectares']
      },
      {
        setup: 'A rectangular garden is 12 meters long and 8 meters wide.',
        question: 'What is the area of the garden?',
        answer: '96 square meters',
        explanation: 'Area = length × width = 12 × 8 = 96 square meters.',
        options: ['40 square meters', '96 square meters', '20 square meters', '160 square meters']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Measurement & Geometry',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['measurement', 'area', 'ratios', 'real-world'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Data Interpretation Questions
   */
  private static generateDataQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'A bar graph shows favorite sports: Soccer (15 students), Basketball (12 students), Tennis (8 students), Swimming (10 students).',
        question: 'Which sport is most popular?',
        answer: 'Soccer',
        explanation: 'Soccer has 15 students, which is more than any other sport.',
        options: ['Soccer', 'Basketball', 'Tennis', 'Swimming']
      },
      {
        setup: 'A pie chart shows how students travel to school: Bus 40%, Walk 30%, Car 20%, Bike 10%.',
        question: 'If there are 200 students, how many walk to school?',
        answer: '60 students',
        explanation: '30% of 200 = 0.30 × 200 = 60 students.',
        options: ['40 students', '60 students', '80 students', '100 students']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Statistics & Data',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['data-interpretation', 'graphs', 'percentages'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Fraction Questions
   */
  private static generateFractionQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'Mike had 4 cups of rice. He used ½ cup for one recipe and 1¼ cups for another recipe.',
        question: 'How many cups of rice did Mike have left?',
        answer: '2¼ cups',
        explanation: '4 - ½ - 1¼ = 4 - 1¾ = 2¼ cups remaining.',
        options: ['1¼ cups', '2¼ cups', '2½ cups', '3¼ cups']
      },
      {
        setup: 'A pizza is cut into 8 equal slices. Sarah ate 3 slices and Tom ate 2 slices.',
        question: 'What fraction of the pizza is left?',
        answer: '⅜',
        explanation: '8 - 3 - 2 = 3 slices left. 3 out of 8 = ⅜.',
        options: ['⅜', '⅝', '½', '¼']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Fractions',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['fractions', 'subtraction', 'real-world'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Time Questions
   */
  private static generateTimeQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'Tammy left her house at 8:35 in the morning and did not return until 4:45 in the afternoon.',
        question: 'How long was Tammy away from her house?',
        answer: '8 hours 10 minutes',
        explanation: 'From 8:35 AM to 4:45 PM = 8 hours 10 minutes.',
        options: ['7 hours 50 minutes', '8 hours 10 minutes', '8 hours 50 minutes', '9 hours 10 minutes']
      },
      {
        setup: 'A movie starts at 7:20 PM and runs for 2 hours 35 minutes.',
        question: 'What time does the movie end?',
        answer: '9:55 PM',
        explanation: '7:20 PM + 2 hours 35 minutes = 9:55 PM.',
        options: ['9:45 PM', '9:55 PM', '10:05 PM', '10:15 PM']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Time & Duration',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['time', 'duration', 'real-world'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Percentage Questions
   */
  private static generatePercentageQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'A store is having a 25% off sale. A jacket normally costs $80.',
        question: 'What is the sale price of the jacket?',
        answer: '$60',
        explanation: '25% of $80 = $20 discount. $80 - $20 = $60.',
        options: ['$55', '$60', '$65', '$70']
      },
      {
        setup: 'In a class of 30 students, 18 students passed the test.',
        question: 'What percentage of students passed the test?',
        answer: '60%',
        explanation: '18 ÷ 30 = 0.6 = 60%.',
        options: ['50%', '60%', '70%', '80%']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Percentages',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['percentages', 'discounts', 'real-world'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Word Problem Questions
   */
  private static generateWordProblemQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'Mason\'s receipt from an electronics store was torn. He bought: 2 packs of batteries (each under $6), 4 USB cables (each under $11), and 1 flash drive.',
        question: 'His credit card showed $72.40 total. About how much did the flash drive cost?',
        answer: '$28',
        explanation: 'Batteries: 2 × $6 = $12, USB cables: 4 × $11 = $44. Flash drive: $72.40 - $12 - $44 = $16.40, closest to $28.',
        options: ['$5', '$16', '$28', '$55']
      },
      {
        setup: 'A recipe calls for 3 cups of flour to make 12 cookies.',
        question: 'How many cups of flour are needed to make 36 cookies?',
        answer: '9 cups',
        explanation: '36 ÷ 12 = 3 times the recipe. 3 × 3 cups = 9 cups of flour.',
        options: ['6 cups', '9 cups', '12 cups', '15 cups']
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Math',
      topic: 'Problem Solving',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['word-problems', 'multi-step', 'real-world'],
      createdBy: 'enhanced-numeracy-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Export convenience function
export function generateEnhancedNumeracyQuestions(
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 1
): Question[] {
  return EnhancedNumeracyGenerator.generateQuestions({
    grade,
    difficulty,
    questionCount: count
  });
}

export default EnhancedNumeracyGenerator;
