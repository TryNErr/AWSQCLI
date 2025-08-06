import { Question, DifficultyLevel, QuestionType } from '../types';

/**
 * Enhanced Thinking Skills Question Generator
 * 
 * Based on analysis of Grade 4 OC Thinking Skills paper, this generator creates
 * sophisticated thinking skills questions across multiple categories:
 * 
 * 1. Pattern Recognition & Sequences
 * 2. Spatial Reasoning & Directions
 * 3. Logical Deduction & Syllogisms
 * 4. Problem Solving & Constraints
 * 5. Critical Thinking & Argument Analysis
 * 6. Sequential Logic & Ordering
 * 7. Mathematical Reasoning
 * 8. Assumption Identification
 */

interface ThinkingSkillsConfig {
  grade: string;
  difficulty: DifficultyLevel;
  questionCount: number;
}

export class EnhancedThinkingSkillsGenerator {
  
  private static generateId(): string {
    return `thinking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate enhanced thinking skills questions
   */
  static generateQuestions(config: ThinkingSkillsConfig): Question[] {
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
        'pattern', 'pattern', 'spatial', 'simple_logic', 'simple_logic',
        'ordering', 'basic_problem', 'visual_pattern'
      ];
    } else if (grade <= 6) {
      return [
        'pattern', 'spatial', 'logical_deduction', 'problem_solving',
        'critical_thinking', 'ordering', 'mathematical_reasoning', 'constraints'
      ];
    } else if (grade <= 9) {
      return [
        'complex_pattern', 'spatial_3d', 'logical_deduction', 'problem_solving',
        'critical_thinking', 'argument_analysis', 'mathematical_reasoning',
        'assumption_identification', 'constraints'
      ];
    } else {
      return [
        'complex_pattern', 'spatial_3d', 'advanced_logic', 'complex_problem_solving',
        'argument_analysis', 'assumption_identification', 'mathematical_reasoning',
        'constraints', 'hypothesis_testing'
      ];
    }
  }

  private static selectQuestionType(types: string[]): string {
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateQuestionByType(type: string, grade: number, difficulty: DifficultyLevel): Question {
    switch (type) {
      case 'pattern':
      case 'complex_pattern':
        return this.generatePatternQuestion(grade, difficulty);
      case 'spatial':
      case 'spatial_3d':
        return this.generateSpatialQuestion(grade, difficulty);
      case 'logical_deduction':
      case 'advanced_logic':
        return this.generateLogicalDeductionQuestion(grade, difficulty);
      case 'problem_solving':
      case 'complex_problem_solving':
        return this.generateProblemSolvingQuestion(grade, difficulty);
      case 'critical_thinking':
      case 'argument_analysis':
        return this.generateCriticalThinkingQuestion(grade, difficulty);
      case 'ordering':
        return this.generateOrderingQuestion(grade, difficulty);
      case 'mathematical_reasoning':
        return this.generateMathematicalReasoningQuestion(grade, difficulty);
      case 'constraints':
        return this.generateConstraintsQuestion(grade, difficulty);
      case 'assumption_identification':
        return this.generateAssumptionQuestion(grade, difficulty);
      default:
        return this.generatePatternQuestion(grade, difficulty);
    }
  }

  /**
   * Pattern Recognition Questions
   */
  private static generatePatternQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const patterns = [
      {
        sequence: ['Circle', 'Square', 'Triangle', 'Circle', 'Square', '?'],
        answer: 'Triangle',
        explanation: 'The pattern repeats every 3 shapes: Circle, Square, Triangle.'
      },
      {
        sequence: ['2', '4', '8', '16', '?'],
        answer: '32',
        explanation: 'Each number is double the previous number (×2 pattern).'
      },
      {
        sequence: ['A', 'C', 'E', 'G', '?'],
        answer: 'I',
        explanation: 'The pattern skips one letter each time (every other letter).'
      },
      {
        sequence: ['Red-Blue', 'Blue-Green', 'Green-Yellow', 'Yellow-?'],
        answer: 'Red',
        explanation: 'Each pair shares one color with the next, cycling through Red, Blue, Green, Yellow.'
      }
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const sequenceStr = pattern.sequence.slice(0, -1).join(', ') + ', ' + pattern.sequence[pattern.sequence.length - 1];
    
    // Generate distractors
    const distractors = this.generatePatternDistractors(pattern.answer, grade);
    const options = [pattern.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `Look at this sequence: ${sequenceStr}\n\nWhat should replace the question mark?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: pattern.answer,
      explanation: pattern.explanation,
      subject: 'Thinking Skills',
      topic: 'Pattern Recognition',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['pattern', 'sequence', 'logic'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Spatial Reasoning Questions
   */
  private static generateSpatialQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const scenarios = [
      {
        setup: 'In a town, the library is north of the school. The school is east of the park. The hospital is south of the school.',
        question: 'What is west of the hospital?',
        answer: 'The park',
        explanation: 'The park is west of the school, and the hospital is directly south of the school, so the park is west of the hospital.'
      },
      {
        setup: 'Sarah walks 3 blocks north, then 2 blocks east, then 1 block south.',
        question: 'How many blocks is Sarah from her starting point?',
        answer: '2√2 blocks (approximately 2.8 blocks)',
        explanation: 'Sarah is 2 blocks north and 2 blocks east from start. Using Pythagorean theorem: √(2² + 2²) = 2√2.'
      },
      {
        setup: 'A cube has 6 faces. If you can see 3 faces from one viewpoint,',
        question: 'how many faces are hidden from view?',
        answer: '3 faces',
        explanation: 'If 3 faces are visible from one viewpoint, then 6 - 3 = 3 faces must be hidden.'
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const distractors = this.generateSpatialDistractors(scenario.answer, grade);
    const options = [scenario.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${scenario.setup}\n\n${scenario.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: scenario.answer,
      explanation: scenario.explanation,
      subject: 'Thinking Skills',
      topic: 'Spatial Reasoning',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['spatial', 'direction', 'visualization'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Logical Deduction Questions
   */
  private static generateLogicalDeductionQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const scenarios = [
      {
        premise: 'All students who did not pass the exam are in small classes this year. Tom is in a large class this year.',
        question: 'What can we conclude about Tom?',
        answer: 'Tom passed the exam',
        explanation: 'If all students who failed are in small classes, and Tom is in a large class, then Tom must have passed.'
      },
      {
        premise: 'If it rains, the ground gets wet. The ground is not wet.',
        question: 'What can we conclude?',
        answer: 'It did not rain',
        explanation: 'This uses modus tollens: If P then Q, not Q, therefore not P.'
      },
      {
        premise: 'Every bird can fly. Penguins are birds. Penguins cannot fly.',
        question: 'What is wrong with this reasoning?',
        answer: 'The first statement is false',
        explanation: 'The premise "Every bird can fly" is incorrect, as penguins are birds that cannot fly.'
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const distractors = this.generateLogicalDistractors(scenario.answer, grade);
    const options = [scenario.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${scenario.premise}\n\n${scenario.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: scenario.answer,
      explanation: scenario.explanation,
      subject: 'Thinking Skills',
      topic: 'Logical Deduction',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['logic', 'deduction', 'reasoning'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Problem Solving Questions
   */
  private static generateProblemSolvingQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'A painter needs to paint rooms. Each room requires 2 liters of green paint, 1 liter of blue paint, and 1 liter of yellow paint. The painter has 10 liters of green, 8 liters of blue, and 6 liters of yellow.',
        question: 'How many complete rooms can be painted?',
        answer: '4 rooms',
        explanation: 'Green: 10÷2=5 rooms, Blue: 8÷1=8 rooms, Yellow: 6÷1=6 rooms. Limited by yellow paint: 4 complete rooms.'
      },
      {
        setup: 'In a workshop schedule, Dance is 10:30-11:30, Singing is 11:45-12:45, and Art is 1:00-2:00. Each workshop is exactly 1 hour.',
        question: 'If someone attends Dance and wants to attend one more workshop, which is possible?',
        answer: 'Singing or Art',
        explanation: 'Dance ends at 11:30, Singing starts at 11:45 (15-minute gap), Art starts at 1:00. Both are possible.'
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];
    const distractors = this.generateProblemDistractors(problem.answer, grade);
    const options = [problem.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Thinking Skills',
      topic: 'Problem Solving',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['problem-solving', 'constraints', 'optimization'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Critical Thinking Questions
   */
  private static generateCriticalThinkingQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const scenarios = [
      {
        argument: 'Maya: "Electric cars are better for the environment because they produce no emissions."',
        question: 'Which of the following best challenges Maya\'s argument?',
        answer: 'Electricity production may create emissions',
        explanation: 'While electric cars don\'t produce direct emissions, the electricity they use might come from fossil fuel power plants.'
      },
      {
        argument: 'Alex: "All my friends like pizza, so everyone in our school must like pizza."',
        question: 'What is the main flaw in Alex\'s reasoning?',
        answer: 'Small sample size generalization',
        explanation: 'Alex is making a hasty generalization from a small sample (friends) to a large population (whole school).'
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const distractors = this.generateCriticalThinkingDistractors(scenario.answer, grade);
    const options = [scenario.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${scenario.argument}\n\n${scenario.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: scenario.answer,
      explanation: scenario.explanation,
      subject: 'Thinking Skills',
      topic: 'Critical Thinking',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['critical-thinking', 'argument-analysis', 'fallacies'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Ordering/Sequencing Questions
   */
  private static generateOrderingQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const scenarios = [
      {
        setup: 'In a race: Leo finished before Emily and Roy. Georgia finished before Leo but after Simon.',
        question: 'Which of the following must be true?',
        answer: 'Simon finished before Emily',
        explanation: 'Order: Simon → Georgia → Leo → Emily/Roy. Simon definitely finished before Emily.'
      },
      {
        setup: 'Five books are arranged: Math is left of Science. English is right of Math but left of History. Art is rightmost.',
        question: 'What is the order from left to right?',
        answer: 'Math, English, Science, History, Art',
        explanation: 'Following the constraints: Math < English < History, Math < Science, Art is rightmost.'
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const distractors = this.generateOrderingDistractors(scenario.answer, grade);
    const options = [scenario.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${scenario.setup}\n\n${scenario.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: scenario.answer,
      explanation: scenario.explanation,
      subject: 'Thinking Skills',
      topic: 'Sequential Logic',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['ordering', 'sequence', 'constraints'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Mathematical Reasoning Questions
   */
  private static generateMathematicalReasoningQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const problems = [
      {
        setup: 'A team of 7 people pass a ball. A girl starts and passes to a boy. Later, a boy starts and passes to another boy.',
        question: 'What must be true about the team composition?',
        answer: 'There are at least 2 boys on the team',
        explanation: 'Since a boy passed to another boy, there must be at least 2 boys. We know there\'s at least 1 girl too.'
      },
      {
        setup: 'If 3 machines can produce 300 items in 3 hours,',
        question: 'how many items can 5 machines produce in 5 hours?',
        answer: '833 items',
        explanation: 'Rate per machine per hour: 300÷(3×3)=33.33 items. 5 machines × 5 hours × 33.33 = 833 items.'
      }
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];
    const distractors = this.generateMathReasoningDistractors(problem.answer, grade);
    const options = [problem.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${problem.setup}\n\n${problem.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      subject: 'Thinking Skills',
      topic: 'Mathematical Reasoning',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['math-reasoning', 'proportions', 'logic'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Constraints/Scheduling Questions
   */
  private static generateConstraintsQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const scenarios = [
      {
        setup: 'Five colored boxes: Purple is 2 places from Blue and immediately left of Green. Yellow is rightmost and next to Blue. The treasure is left of Blue and not Yellow.',
        question: 'Which box contains the treasure?',
        answer: 'Red',
        explanation: 'Order: Purple-Green-Red-Blue-Yellow. Red is left of Blue and not Yellow, so Red has the treasure.'
      },
      {
        setup: 'Workshop times: A (10-11), B (11:30-12:30), C (1-2), D (2:30-3:30). No overlapping attendance.',
        question: 'Maximum workshops one person can attend?',
        answer: '4 workshops',
        explanation: 'All workshops have gaps between them: 10-11, 11:30-12:30, 1-2, 2:30-3:30. All 4 can be attended.'
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const distractors = this.generateConstraintsDistractors(scenario.answer, grade);
    const options = [scenario.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${scenario.setup}\n\n${scenario.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: scenario.answer,
      explanation: scenario.explanation,
      subject: 'Thinking Skills',
      topic: 'Constraints & Logic',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['constraints', 'logic-puzzle', 'scheduling'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Assumption Identification Questions
   */
  private static generateAssumptionQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const scenarios = [
      {
        statement: 'Frank: "I saw 9 people with casts at assembly today. Since 12 students were injured last week, 3 must have recovered."',
        question: 'What assumption did Frank make?',
        answer: 'All injured students attended the assembly',
        explanation: 'Frank assumed all 12 injured students were at the assembly, but some might have been absent.'
      },
      {
        statement: 'Lisa: "The new restaurant must be expensive because it has fancy decorations."',
        question: 'What is Lisa assuming?',
        answer: 'Fancy decorations indicate high prices',
        explanation: 'Lisa assumes there\'s a direct correlation between decoration quality and menu prices.'
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const distractors = this.generateAssumptionDistractors(scenario.answer, grade);
    const options = [scenario.answer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `${scenario.statement}\n\n${scenario.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: scenario.answer,
      explanation: scenario.explanation,
      subject: 'Thinking Skills',
      topic: 'Assumption Analysis',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['assumptions', 'critical-thinking', 'reasoning-flaws'],
      createdBy: 'enhanced-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Distractor generation methods
  private static generatePatternDistractors(correct: string, grade: number): string[] {
    const distractors = ['Circle', 'Square', 'Triangle', 'Diamond', '64', '24', '28', 'B', 'D', 'F', 'Blue', 'Green', 'Purple'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateSpatialDistractors(correct: string, grade: number): string[] {
    const distractors = ['The library', 'The school', 'The hospital', '1 block', '3 blocks', '4 blocks', '2 faces', '4 faces', '5 faces'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateLogicalDistractors(correct: string, grade: number): string[] {
    const distractors = ['Tom failed the exam', 'We cannot determine this', 'Tom might have passed', 'It might have rained', 'The ground is always wet', 'The second statement is false'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateProblemDistractors(correct: string, grade: number): string[] {
    const distractors = ['3 rooms', '5 rooms', '6 rooms', 'Dance only', 'Singing only', 'Art only', 'All three workshops'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateCriticalThinkingDistractors(correct: string, grade: number): string[] {
    const distractors = ['Electric cars are too expensive', 'Maya is completely correct', 'Electric cars are slower', 'Large sample size error', 'Circular reasoning', 'False analogy'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateOrderingDistractors(correct: string, grade: number): string[] {
    const distractors = ['Roy finished before Emily', 'Leo finished first', 'Georgia finished last', 'Math, Science, English, History, Art', 'English, Math, Science, Art, History'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateMathReasoningDistractors(correct: string, grade: number): string[] {
    const distractors = ['There are exactly 3 boys', 'There are more girls than boys', 'There are 4 girls and 3 boys', '500 items', '750 items', '1000 items'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateConstraintsDistractors(correct: string, grade: number): string[] {
    const distractors = ['Purple', 'Blue', 'Green', 'Yellow', '1 workshop', '2 workshops', '3 workshops'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }

  private static generateAssumptionDistractors(correct: string, grade: number): string[] {
    const distractors = ['All students wear casts when injured', 'The assembly was mandatory', 'Casts are always visible', 'Expensive restaurants are always good', 'Decorations don\'t matter'];
    return distractors.filter(d => d !== correct).slice(0, 3);
  }
}

// Export convenience function
export function generateEnhancedThinkingSkillsQuestions(
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 1
): Question[] {
  return EnhancedThinkingSkillsGenerator.generateQuestions({
    grade,
    difficulty,
    questionCount: count
  });
}

export default EnhancedThinkingSkillsGenerator;
