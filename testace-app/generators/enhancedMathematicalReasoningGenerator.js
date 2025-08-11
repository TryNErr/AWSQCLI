/**
 * ENHANCED MATHEMATICAL REASONING GENERATOR
 * 
 * Creates sophisticated mathematical reasoning questions that go beyond basic arithmetic
 * to include problem-solving, logical thinking, and real-world applications.
 */

class EnhancedMathematicalReasoningGenerator {
  
  /**
   * Generate a mathematical reasoning question
   */
  static generateQuestion(grade, difficulty, seed = 0) {
    const gradeNum = parseInt(grade);
    
    const questionTypes = this.getQuestionTypesForGrade(gradeNum, difficulty);
    const typeIndex = seed % questionTypes.length;
    const questionType = questionTypes[typeIndex];
    
    return this.generateByType(questionType, gradeNum, difficulty, seed);
  }
  
  /**
   * Get available question types for grade and difficulty
   */
  static getQuestionTypesForGrade(grade, difficulty) {
    const baseTypes = ['word_problems', 'pattern_recognition', 'logical_reasoning'];
    
    if (grade >= 3) baseTypes.push('measurement_reasoning', 'data_interpretation');
    if (grade >= 5) baseTypes.push('proportional_reasoning', 'geometric_reasoning');
    if (grade >= 7) baseTypes.push('algebraic_reasoning', 'statistical_reasoning');
    if (grade >= 9) baseTypes.push('advanced_problem_solving', 'mathematical_modeling');
    if (grade >= 11) baseTypes.push('calculus_reasoning', 'proof_reasoning');
    
    return baseTypes;
  }
  
  /**
   * Generate question by type
   */
  static generateByType(type, grade, difficulty, seed) {
    switch (type) {
      case 'word_problems':
        return this.generateComplexWordProblem(grade, difficulty, seed);
      case 'pattern_recognition':
        return this.generatePatternRecognitionProblem(grade, difficulty, seed);
      case 'logical_reasoning':
        return this.generateLogicalReasoningProblem(grade, difficulty, seed);
      case 'proportional_reasoning':
        return this.generateProportionalReasoningProblem(grade, difficulty, seed);
      case 'geometric_reasoning':
        return this.generateGeometricReasoningProblem(grade, difficulty, seed);
      case 'algebraic_reasoning':
        return this.generateAlgebraicReasoningProblem(grade, difficulty, seed);
      case 'statistical_reasoning':
        return this.generateStatisticalReasoningProblem(grade, difficulty, seed);
      case 'data_interpretation':
        return this.generateDataInterpretationProblem(grade, difficulty, seed);
      default:
        return this.generateComplexWordProblem(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate complex word problems with real-world contexts
   */
  static generateComplexWordProblem(grade, difficulty, seed) {
    const contexts = [
      'environmental_science',
      'economics',
      'engineering',
      'medicine',
      'sports_analytics',
      'urban_planning'
    ];
    
    const context = contexts[seed % contexts.length];
    const problems = this.getWordProblemsByContext(context, grade, difficulty);
    const problem = problems[seed % problems.length];
    
    return {
      content: problem.question,
      type: 'multiple_choice',
      options: this.shuffleArray([problem.answer, ...problem.wrongAnswers]),
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      topic: 'mathematical reasoning',
      tags: ['mathematical-reasoning', 'word-problems', context, 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
    };
  }
  
  /**
   * Generate pattern recognition problems
   */
  static generatePatternRecognitionProblem(grade, difficulty, seed) {
    const patterns = [
      {
        type: 'fibonacci',
        sequence: [1, 1, 2, 3, 5, 8],
        next: 13,
        rule: 'Each number is the sum of the two preceding numbers (Fibonacci sequence)',
        wrongAnswers: ['11', '12', '15']
      },
      {
        type: 'geometric',
        sequence: [2, 6, 18, 54],
        next: 162,
        rule: 'Each number is multiplied by 3',
        wrongAnswers: ['108', '144', '180']
      },
      {
        type: 'quadratic',
        sequence: [1, 4, 9, 16, 25],
        next: 36,
        rule: 'Perfect squares: 1², 2², 3², 4², 5², 6²',
        wrongAnswers: ['30', '32', '35']
      },
      {
        type: 'alternating',
        sequence: [2, 5, 4, 7, 6, 9],
        next: 8,
        rule: 'Two alternating patterns: +3 and +2',
        wrongAnswers: ['10', '11', '12']
      }
    ];
    
    const pattern = patterns[seed % patterns.length];
    const question = `Analyze the pattern in this sequence: ${pattern.sequence.join(', ')}\n\nWhat is the next number in the sequence?`;
    
    const options = this.shuffleArray([String(pattern.next), ...pattern.wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: String(pattern.next),
      explanation: pattern.rule,
      topic: 'pattern recognition',
      tags: ['mathematical-reasoning', 'patterns', pattern.type, 'expanded'],
      estimatedTime: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 120 : 180
    };
  }
  
  /**
   * Generate logical reasoning problems
   */
  static generateLogicalReasoningProblem(grade, difficulty, seed) {
    const logicProblems = [
      {
        question: "In a school, all students who play basketball also play soccer. Maria plays basketball. What can we conclude about Maria?",
        answer: "Maria plays soccer",
        wrongAnswers: [
          "Maria doesn't play soccer",
          "Maria only plays basketball",
          "We cannot determine if Maria plays soccer"
        ],
        explanation: "Since all basketball players also play soccer, and Maria plays basketball, she must also play soccer."
      },
      {
        question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        answer: "5 minutes",
        wrongAnswers: [
          "100 minutes",
          "20 minutes",
          "25 minutes"
        ],
        explanation: "Each machine makes 1 widget in 5 minutes. So 100 machines would make 100 widgets in the same 5 minutes."
      },
      {
        question: "A farmer has chickens and cows. In total, there are 30 heads and 74 legs. How many chickens are there?",
        answer: "23 chickens",
        wrongAnswers: [
          "15 chickens",
          "20 chickens",
          "25 chickens"
        ],
        explanation: "Let c = chickens, w = cows. c + w = 30, 2c + 4w = 74. Solving: w = 7, c = 23."
      }
    ];
    
    const problem = logicProblems[seed % logicProblems.length];
    
    return {
      content: problem.question,
      type: 'multiple_choice',
      options: this.shuffleArray([problem.answer, ...problem.wrongAnswers]),
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      topic: 'logical reasoning',
      tags: ['mathematical-reasoning', 'logic', 'problem-solving', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 150 : difficulty === 'medium' ? 210 : 270
    };
  }
  
  /**
   * Generate proportional reasoning problems
   */
  static generateProportionalReasoningProblem(grade, difficulty, seed) {
    const proportionProblems = [
      {
        question: "A recipe for 4 people calls for 2 cups of flour. How many cups of flour are needed to serve 10 people?",
        answer: "5 cups",
        wrongAnswers: ["4 cups", "6 cups", "8 cups"],
        explanation: "Set up a proportion: 2 cups / 4 people = x cups / 10 people. Cross multiply: 2 × 10 = 4 × x, so x = 5 cups."
      },
      {
        question: "If a car travels 240 miles in 4 hours, how far will it travel in 7 hours at the same speed?",
        answer: "420 miles",
        wrongAnswers: ["350 miles", "400 miles", "450 miles"],
        explanation: "Speed = 240 ÷ 4 = 60 mph. Distance in 7 hours = 60 × 7 = 420 miles."
      },
      {
        question: "A map scale shows that 1 inch represents 50 miles. If two cities are 3.5 inches apart on the map, what is the actual distance between them?",
        answer: "175 miles",
        wrongAnswers: ["150 miles", "200 miles", "225 miles"],
        explanation: "1 inch = 50 miles, so 3.5 inches = 3.5 × 50 = 175 miles."
      }
    ];
    
    const problem = proportionProblems[seed % proportionProblems.length];
    
    return {
      content: problem.question,
      type: 'multiple_choice',
      options: this.shuffleArray([problem.answer, ...problem.wrongAnswers]),
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      topic: 'proportional reasoning',
      tags: ['mathematical-reasoning', 'proportions', 'ratios', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
    };
  }
  
  /**
   * Generate data interpretation problems
   */
  static generateDataInterpretationProblem(grade, difficulty, seed) {
    const dataProblems = [
      {
        question: "A survey of 100 students showed their favorite subjects:\nMath: 35 students\nScience: 28 students\nEnglish: 22 students\nHistory: 15 students\n\nWhat percentage of students chose Math as their favorite subject?",
        answer: "35%",
        wrongAnswers: ["30%", "40%", "25%"],
        explanation: "35 out of 100 students chose Math, which equals 35/100 = 35%."
      },
      {
        question: "The temperature readings for a week were: 72°F, 75°F, 68°F, 71°F, 74°F, 69°F, 73°F. What is the average temperature for the week?",
        answer: "71.7°F",
        wrongAnswers: ["70.5°F", "72.3°F", "73.1°F"],
        explanation: "Sum = 72+75+68+71+74+69+73 = 502. Average = 502 ÷ 7 = 71.7°F."
      }
    ];
    
    const problem = dataProblems[seed % dataProblems.length];
    
    return {
      content: problem.question,
      type: 'multiple_choice',
      options: this.shuffleArray([problem.answer, ...problem.wrongAnswers]),
      correctAnswer: problem.answer,
      explanation: problem.explanation,
      topic: 'data interpretation',
      tags: ['mathematical-reasoning', 'data', 'statistics', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
    };
  }
  
  /**
   * Get word problems by context
   */
  static getWordProblemsByContext(context, grade, difficulty) {
    switch (context) {
      case 'environmental_science':
        return [
          {
            question: "A solar panel array produces 1,200 kilowatt-hours (kWh) of electricity per month. If the average household uses 900 kWh per month, how many households can this solar array power?",
            answer: "1.33 households (or 1 household with excess)",
            wrongAnswers: ["2 households", "0.75 households", "3 households"],
            explanation: "1,200 ÷ 900 = 1.33, so it can fully power 1 household with 300 kWh excess."
          },
          {
            question: "A forest absorbs 25 tons of CO₂ per hectare per year. If a city wants to offset 500 tons of CO₂ emissions annually, how many hectares of forest are needed?",
            answer: "20 hectares",
            wrongAnswers: ["15 hectares", "25 hectares", "30 hectares"],
            explanation: "500 tons ÷ 25 tons per hectare = 20 hectares needed."
          }
        ];
        
      case 'economics':
        return [
          {
            question: "A company's profit increased from $50,000 to $65,000 over one year. What was the percentage increase in profit?",
            answer: "30%",
            wrongAnswers: ["25%", "35%", "20%"],
            explanation: "Increase = $65,000 - $50,000 = $15,000. Percentage = ($15,000 ÷ $50,000) × 100% = 30%."
          }
        ];
        
      case 'sports_analytics':
        return [
          {
            question: "A basketball player has made 18 out of 24 free throw attempts this season. What is their free throw percentage?",
            answer: "75%",
            wrongAnswers: ["70%", "80%", "85%"],
            explanation: "18 ÷ 24 = 0.75 = 75%."
          }
        ];
        
      default:
        return [
          {
            question: "A recipe calls for ingredients in the ratio 3:2:1 (flour:sugar:butter). If you use 6 cups of flour, how much sugar do you need?",
            answer: "4 cups",
            wrongAnswers: ["3 cups", "5 cups", "6 cups"],
            explanation: "The ratio is 3:2, so if flour is 6 cups (double the ratio), sugar is 4 cups (double the ratio)."
          }
        ];
    }
  }
  
  /**
   * Utility function to shuffle array
   */
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = EnhancedMathematicalReasoningGenerator;
