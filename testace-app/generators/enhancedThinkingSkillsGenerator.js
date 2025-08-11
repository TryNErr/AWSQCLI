/**
 * ENHANCED THINKING SKILLS QUESTION GENERATOR
 * 
 * Generates diverse thinking skills questions covering:
 * Logic, Patterns, Analogies, Spatial Reasoning, Critical Thinking, Problem Solving
 */

class EnhancedThinkingSkillsGenerator {
  
  /**
   * Generate a thinking skills question
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
    const baseTypes = ['patterns', 'analogies', 'logic_basic'];
    
    if (grade >= 3) baseTypes.push('spatial_basic', 'categorization');
    if (grade >= 5) baseTypes.push('sequences', 'relationships');
    if (grade >= 7) baseTypes.push('logic_advanced', 'critical_thinking');
    if (grade >= 9) baseTypes.push('deductive_reasoning', 'problem_solving');
    if (grade >= 11) baseTypes.push('abstract_reasoning', 'complex_logic');
    
    if (difficulty === 'hard') {
      baseTypes.push('multi_step_logic', 'advanced_patterns');
    }
    
    return baseTypes;
  }
  
  /**
   * Generate question by type
   */
  static generateByType(type, grade, difficulty, seed) {
    switch (type) {
      case 'patterns':
        return this.generatePatterns(grade, difficulty, seed);
      case 'analogies':
        return this.generateAnalogies(grade, difficulty, seed);
      case 'logic_basic':
        return this.generateBasicLogic(grade, difficulty, seed);
      case 'logic_advanced':
        return this.generateAdvancedLogic(grade, difficulty, seed);
      case 'sequences':
        return this.generateSequences(grade, difficulty, seed);
      case 'spatial_basic':
        return this.generateSpatialReasoning(grade, difficulty, seed);
      case 'critical_thinking':
        return this.generateCriticalThinking(grade, difficulty, seed);
      case 'categorization':
        return this.generateCategorization(grade, difficulty, seed);
      case 'relationships':
        return this.generateRelationships(grade, difficulty, seed);
      case 'deductive_reasoning':
        return this.generateDeductiveReasoning(grade, difficulty, seed);
      default:
        return this.generatePatterns(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate pattern questions
   */
  static generatePatterns(grade, difficulty, seed) {
    const patternTypes = ['number', 'shape', 'letter', 'color'];
    const patternType = patternTypes[seed % patternTypes.length];
    
    switch (patternType) {
      case 'number':
        return this.generateNumberPattern(grade, difficulty, seed);
      case 'shape':
        return this.generateShapePattern(grade, difficulty, seed);
      case 'letter':
        return this.generateLetterPattern(grade, difficulty, seed);
      default:
        return this.generateNumberPattern(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate number pattern questions
   */
  static generateNumberPattern(grade, difficulty, seed) {
    const patterns = [
      { type: 'arithmetic', rule: 'add' },
      { type: 'arithmetic', rule: 'subtract' },
      { type: 'geometric', rule: 'multiply' },
      { type: 'fibonacci', rule: 'fibonacci' },
      { type: 'squares', rule: 'square' },
      { type: 'cubes', rule: 'cube' }
    ];
    
    const pattern = patterns[seed % patterns.length];
    let sequence, answer, rule;
    
    switch (pattern.rule) {
      case 'add':
        const addStep = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5;
        const start = Math.floor(Math.random() * 10) + 1;
        sequence = [start, start + addStep, start + 2*addStep, start + 3*addStep];
        answer = start + 4*addStep;
        rule = `Add ${addStep} each time`;
        break;
        
      case 'multiply':
        const multStep = difficulty === 'easy' ? 2 : 3;
        const startMult = Math.floor(Math.random() * 5) + 1;
        sequence = [startMult, startMult * multStep, startMult * multStep * multStep];
        answer = startMult * Math.pow(multStep, 3);
        rule = `Multiply by ${multStep} each time`;
        break;
        
      case 'square':
        sequence = [1, 4, 9, 16];
        answer = 25;
        rule = 'Perfect squares: 1², 2², 3², 4², 5²';
        break;
        
      default:
        const step = 2;
        sequence = [2, 4, 6, 8];
        answer = 10;
        rule = 'Add 2 each time';
    }
    
    const question = `What comes next in the sequence: ${sequence.join(', ')}, ___?`;
    
    const wrongAnswers = [
      String(answer + 1),
      String(answer - 1),
      String(answer + 2)
    ];
    
    const options = this.shuffleArray([String(answer), ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: String(answer),
      explanation: rule,
      topic: 'number patterns',
      tags: ['thinking-skills', 'patterns', 'sequences', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate analogy questions
   */
  static generateAnalogies(grade, difficulty, seed) {
    const analogies = [
      // Animal analogies
      { a: 'Cat', b: 'Kitten', c: 'Dog', d: 'Puppy', explanation: 'Cat is to Kitten as Dog is to Puppy (adult to baby)' },
      { a: 'Bird', b: 'Nest', c: 'Bee', d: 'Hive', explanation: 'Bird is to Nest as Bee is to Hive (animal to home)' },
      { a: 'Fish', b: 'Water', c: 'Bird', d: 'Air', explanation: 'Fish is to Water as Bird is to Air (animal to environment)' },
      
      // Object analogies
      { a: 'Book', b: 'Read', c: 'Music', d: 'Listen', explanation: 'Book is to Read as Music is to Listen (object to action)' },
      { a: 'Pen', b: 'Write', c: 'Brush', d: 'Paint', explanation: 'Pen is to Write as Brush is to Paint (tool to action)' },
      { a: 'Key', b: 'Lock', c: 'Password', d: 'Computer', explanation: 'Key is to Lock as Password is to Computer (access method)' },
      
      // Time analogies
      { a: 'Morning', b: 'Breakfast', c: 'Evening', d: 'Dinner', explanation: 'Morning is to Breakfast as Evening is to Dinner (time to meal)' },
      { a: 'Spring', b: 'Flowers', c: 'Winter', d: 'Snow', explanation: 'Spring is to Flowers as Winter is to Snow (season to characteristic)' },
      
      // Size analogies
      { a: 'Big', b: 'Small', c: 'Tall', d: 'Short', explanation: 'Big is to Small as Tall is to Short (opposite pairs)' },
      { a: 'Giant', b: 'Large', c: 'Tiny', d: 'Small', explanation: 'Giant is to Large as Tiny is to Small (extreme to moderate)' }
    ];
    
    const analogy = analogies[seed % analogies.length];
    const question = `${analogy.a} is to ${analogy.b} as ${analogy.c} is to ___?`;
    
    // Generate wrong answers
    const wrongAnswers = this.generateAnalogyWrongAnswers(analogy.d, seed);
    const options = this.shuffleArray([analogy.d, ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: analogy.d,
      explanation: analogy.explanation,
      topic: 'analogies',
      tags: ['thinking-skills', 'analogies', 'relationships', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate basic logic questions
   */
  static generateBasicLogic(grade, difficulty, seed) {
    const logicTypes = ['if_then', 'all_some', 'true_false', 'ordering'];
    const logicType = logicTypes[seed % logicTypes.length];
    
    switch (logicType) {
      case 'if_then':
        return this.generateIfThenLogic(grade, difficulty, seed);
      case 'ordering':
        return this.generateOrderingLogic(grade, difficulty, seed);
      default:
        return this.generateIfThenLogic(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate if-then logic questions
   */
  static generateIfThenLogic(grade, difficulty, seed) {
    const scenarios = [
      {
        condition: 'it rains',
        result: 'the ground gets wet',
        question: 'If it rains, then the ground gets wet. It is raining. What can we conclude?',
        answer: 'The ground is wet',
        wrong: ['It is sunny', 'The ground is dry', 'Nothing can be concluded']
      },
      {
        condition: 'you study hard',
        result: 'you get good grades',
        question: 'If you study hard, then you get good grades. Sarah got good grades. What can we conclude?',
        answer: 'Sarah might have studied hard',
        wrong: ['Sarah definitely studied hard', 'Sarah did not study', 'Sarah is lazy']
      },
      {
        condition: 'all birds can fly',
        result: 'penguins are birds',
        question: 'If all birds can fly, and penguins are birds, what can we conclude?',
        answer: 'This creates a logical problem (penguins cannot fly)',
        wrong: ['Penguins can fly', 'Penguins are not birds', 'All statements are true']
      }
    ];
    
    const scenario = scenarios[seed % scenarios.length];
    
    const options = this.shuffleArray([scenario.answer, ...scenario.wrong]);
    
    return {
      content: scenario.question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: scenario.answer,
      explanation: `This tests logical reasoning and the ability to draw valid conclusions from given premises.`,
      topic: 'logical reasoning',
      tags: ['thinking-skills', 'logic', 'reasoning', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 120 : 150
    };
  }
  
  /**
   * Generate spatial reasoning questions
   */
  static generateSpatialReasoning(grade, difficulty, seed) {
    const spatialTypes = ['rotation', 'reflection', 'folding', 'perspective'];
    const spatialType = spatialTypes[seed % spatialTypes.length];
    
    // For now, generate text-based spatial questions
    const questions = [
      {
        content: 'If you rotate the letter "b" 180 degrees, what letter do you get?',
        answer: 'q',
        wrong: ['d', 'p', 'b'],
        explanation: 'Rotating "b" 180 degrees gives "q"'
      },
      {
        content: 'If you flip the letter "d" horizontally (like a mirror), what do you get?',
        answer: 'b',
        wrong: ['p', 'q', 'd'],
        explanation: 'Flipping "d" horizontally gives "b"'
      },
      {
        content: 'You are facing North. You turn right 90 degrees, then right again 90 degrees. Which direction are you facing?',
        answer: 'South',
        wrong: ['North', 'East', 'West'],
        explanation: 'North → right 90° → East → right 90° → South'
      }
    ];
    
    const question = questions[seed % questions.length];
    const options = this.shuffleArray([question.answer, ...question.wrong]);
    
    return {
      content: question.content,
      type: 'multiple_choice',
      options: options,
      correctAnswer: question.answer,
      explanation: question.explanation,
      topic: 'spatial reasoning',
      tags: ['thinking-skills', 'spatial', 'visualization', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 120 : 150
    };
  }
  
  /**
   * Generate categorization questions
   */
  static generateCategorization(grade, difficulty, seed) {
    const categories = [
      {
        items: ['Apple', 'Banana', 'Orange', 'Carrot'],
        oddOne: 'Carrot',
        category: 'fruits',
        explanation: 'Carrot is a vegetable, while the others are fruits'
      },
      {
        items: ['Dog', 'Cat', 'Bird', 'Fish'],
        oddOne: 'Fish',
        category: 'land animals',
        explanation: 'Fish lives in water, while others live on land'
      },
      {
        items: ['Red', 'Blue', 'Green', 'Circle'],
        oddOne: 'Circle',
        category: 'colors',
        explanation: 'Circle is a shape, while others are colors'
      },
      {
        items: ['Car', 'Bicycle', 'Train', 'House'],
        oddOne: 'House',
        category: 'vehicles',
        explanation: 'House is a building, while others are vehicles'
      }
    ];
    
    const category = categories[seed % categories.length];
    const question = `Which one does not belong with the others: ${category.items.join(', ')}?`;
    
    // Generate wrong answers (other items from the list)
    const wrongAnswers = category.items.filter(item => item !== category.oddOne).slice(0, 3);
    const options = this.shuffleArray([category.oddOne, ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: category.oddOne,
      explanation: category.explanation,
      topic: 'categorization',
      tags: ['thinking-skills', 'categorization', 'classification', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate sequence questions
   */
  static generateSequences(grade, difficulty, seed) {
    return this.generatePatterns(grade, difficulty, seed);
  }
  
  /**
   * Generate sequence questions (alias for patterns)
   */
  static generateSequenceQuestion(grade, difficulty, seed) {
    return this.generateSequences(grade, difficulty, seed);
  }
  
  /**
   * Generate relationships questions
   */
  static generateRelationships(grade, difficulty, seed) {
    return this.generateAnalogies(grade, difficulty, seed);
  }
  
  /**
   * Generate deductive reasoning questions
   */
  static generateDeductiveReasoning(grade, difficulty, seed) {
    return this.generateBasicLogic(grade, difficulty, seed);
  }
  
  /**
   * Utility functions
   */
  static generateAnalogyWrongAnswers(correct, seed) {
    const commonWords = [
      'Tree', 'House', 'Car', 'Book', 'Sun', 'Moon', 'Star', 'Ocean',
      'Mountain', 'River', 'Fire', 'Ice', 'Wind', 'Rain', 'Snow', 'Cloud'
    ];
    
    const wrong = [];
    let attempts = 0;
    
    while (wrong.length < 3 && attempts < 20) {
      const word = commonWords[(seed + attempts) % commonWords.length];
      if (word !== correct && !wrong.includes(word)) {
        wrong.push(word);
      }
      attempts++;
    }
    
    // Fill remaining slots if needed
    while (wrong.length < 3) {
      wrong.push(`Option ${wrong.length + 1}`);
    }
    
    return wrong;
  }
  
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = EnhancedThinkingSkillsGenerator;
