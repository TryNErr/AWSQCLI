/**
 * ENHANCED MATH QUESTION GENERATOR
 * 
 * Generates diverse mathematical questions across all grade levels and difficulties.
 * Covers: Arithmetic, Algebra, Geometry, Fractions, Decimals, Word Problems, Statistics
 */

class EnhancedMathGenerator {
  
  /**
   * Generate a math question based on grade and difficulty
   */
  static generateQuestion(grade, difficulty, seed = 0) {
    const gradeNum = parseInt(grade);
    
    // Select question type based on grade and difficulty
    const questionTypes = this.getQuestionTypesForGrade(gradeNum, difficulty);
    const typeIndex = seed % questionTypes.length;
    const questionType = questionTypes[typeIndex];
    
    return this.generateByType(questionType, gradeNum, difficulty, seed);
  }
  
  /**
   * Get available question types for grade and difficulty
   */
  static getQuestionTypesForGrade(grade, difficulty) {
    const baseTypes = ['arithmetic', 'word_problems'];
    
    if (grade >= 3) baseTypes.push('fractions', 'measurement');
    if (grade >= 4) baseTypes.push('decimals', 'basic_geometry');
    if (grade >= 6) baseTypes.push('percentages', 'ratios');
    if (grade >= 7) baseTypes.push('algebra_basic', 'statistics_basic');
    if (grade >= 9) baseTypes.push('algebra_advanced', 'geometry_advanced');
    if (grade >= 11) baseTypes.push('calculus_basic', 'trigonometry');
    
    // Add difficulty-specific types
    if (difficulty === 'hard') {
      baseTypes.push('complex_word_problems', 'multi_step');
    }
    
    return baseTypes;
  }
  
  /**
   * Generate question by specific type
   */
  static generateByType(type, grade, difficulty, seed) {
    switch (type) {
      case 'arithmetic':
        return this.generateArithmetic(grade, difficulty, seed);
      case 'word_problems':
        return this.generateWordProblem(grade, difficulty, seed);
      case 'fractions':
        return this.generateFractions(grade, difficulty, seed);
      case 'decimals':
        return this.generateDecimals(grade, difficulty, seed);
      case 'percentages':
        return this.generatePercentages(grade, difficulty, seed);
      case 'algebra_basic':
        return this.generateBasicAlgebra(grade, difficulty, seed);
      case 'algebra_advanced':
        return this.generateAdvancedAlgebra(grade, difficulty, seed);
      case 'basic_geometry':
        return this.generateBasicGeometry(grade, difficulty, seed);
      case 'geometry_advanced':
        return this.generateAdvancedGeometry(grade, difficulty, seed);
      case 'statistics_basic':
        return this.generateBasicStatistics(grade, difficulty, seed);
      case 'measurement':
        return this.generateMeasurement(grade, difficulty, seed);
      case 'ratios':
        return this.generateRatios(grade, difficulty, seed);
      default:
        return this.generateArithmetic(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate arithmetic questions
   */
  static generateArithmetic(grade, difficulty, seed) {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[seed % operations.length];
    
    let range, a, b, answer, question;
    
    switch (difficulty) {
      case 'easy':
        range = Math.min(20, grade * 5);
        a = Math.floor(Math.random() * range) + 1;
        b = Math.floor(Math.random() * range) + 1;
        break;
      case 'medium':
        range = Math.min(100, grade * 10);
        a = Math.floor(Math.random() * range) + 1;
        b = Math.floor(Math.random() * range) + 1;
        break;
      case 'hard':
        range = Math.min(1000, grade * 50);
        a = Math.floor(Math.random() * range) + 1;
        b = Math.floor(Math.random() * range) + 1;
        break;
    }
    
    switch (operation) {
      case '+':
        answer = a + b;
        question = `What is ${a} + ${b}?`;
        break;
      case '-':
        if (a < b) [a, b] = [b, a]; // Ensure positive result
        answer = a - b;
        question = `What is ${a} - ${b}?`;
        break;
      case '×':
        answer = a * b;
        question = `What is ${a} × ${b}?`;
        break;
      case '÷':
        answer = a;
        a = a * b; // Ensure clean division
        question = `What is ${a} ÷ ${b}?`;
        break;
    }
    
    const wrongAnswers = this.generateWrongAnswers(answer, 3);
    const options = this.shuffleArray([String(answer), ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: String(answer),
      explanation: `${question.replace('What is ', '')} = ${answer}`,
      topic: 'arithmetic',
      tags: ['mathematics', 'arithmetic', operation, 'expanded'],
      estimatedTime: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60
    };
  }
  
  /**
   * Generate word problems
   */
  static generateWordProblem(grade, difficulty, seed) {
    const scenarios = [
      'shopping', 'school', 'sports', 'cooking', 'travel', 'animals', 'books', 'games'
    ];
    const scenario = scenarios[seed % scenarios.length];
    
    const range = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
    const a = Math.floor(Math.random() * range) + 1;
    const b = Math.floor(Math.random() * range) + 1;
    
    let question, answer, explanation;
    
    switch (scenario) {
      case 'shopping':
        answer = a + b;
        question = `Sarah bought ${a} apples and ${b} oranges. How many fruits did she buy in total?`;
        explanation = `${a} + ${b} = ${answer} fruits`;
        break;
      case 'school':
        answer = a - b;
        if (a < b) {
          answer = b - a;
          question = `There were ${b} students in class. ${a} students went home early. How many students remained?`;
          explanation = `${b} - ${a} = ${answer} students`;
        } else {
          question = `There were ${a} students in class. ${b} students went home early. How many students remained?`;
          explanation = `${a} - ${b} = ${answer} students`;
        }
        break;
      case 'sports':
        answer = a * b;
        question = `A basketball team scored ${a} points in each of ${b} games. How many points did they score in total?`;
        explanation = `${a} × ${b} = ${answer} points`;
        break;
      default:
        answer = a + b;
        question = `Tom has ${a} stickers and gets ${b} more. How many stickers does he have now?`;
        explanation = `${a} + ${b} = ${answer} stickers`;
    }
    
    const wrongAnswers = this.generateWrongAnswers(answer, 3);
    const options = this.shuffleArray([String(answer), ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: String(answer),
      explanation: explanation,
      topic: 'word problems',
      tags: ['mathematics', 'word-problems', scenario, 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate fraction questions
   */
  static generateFractions(grade, difficulty, seed) {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[seed % operations.length];
    
    // Generate fractions based on difficulty
    let num1, den1, num2, den2;
    
    if (difficulty === 'easy') {
      den1 = [2, 3, 4, 5][seed % 4];
      den2 = den1; // Same denominator for easy
      num1 = Math.floor(Math.random() * den1) + 1;
      num2 = Math.floor(Math.random() * den2) + 1;
    } else {
      den1 = Math.floor(Math.random() * 8) + 2;
      den2 = Math.floor(Math.random() * 8) + 2;
      num1 = Math.floor(Math.random() * den1) + 1;
      num2 = Math.floor(Math.random() * den2) + 1;
    }
    
    let answerNum, answerDen, question;
    
    switch (operation) {
      case '+':
        if (den1 === den2) {
          answerNum = num1 + num2;
          answerDen = den1;
        } else {
          answerNum = num1 * den2 + num2 * den1;
          answerDen = den1 * den2;
        }
        question = `What is ${num1}/${den1} + ${num2}/${den2}?`;
        break;
      case '-':
        if (den1 === den2) {
          answerNum = Math.abs(num1 - num2);
          answerDen = den1;
        } else {
          answerNum = Math.abs(num1 * den2 - num2 * den1);
          answerDen = den1 * den2;
        }
        question = `What is ${num1}/${den1} - ${num2}/${den2}?`;
        break;
      case '×':
        answerNum = num1 * num2;
        answerDen = den1 * den2;
        question = `What is ${num1}/${den1} × ${num2}/${den2}?`;
        break;
      case '÷':
        answerNum = num1 * den2;
        answerDen = den1 * num2;
        question = `What is ${num1}/${den1} ÷ ${num2}/${den2}?`;
        break;
    }
    
    // Simplify fraction
    const gcd = this.findGCD(answerNum, answerDen);
    answerNum /= gcd;
    answerDen /= gcd;
    
    const correctAnswer = answerDen === 1 ? String(answerNum) : `${answerNum}/${answerDen}`;
    
    // Generate wrong answers
    const wrongAnswers = [
      `${answerNum + 1}/${answerDen}`,
      `${answerNum}/${answerDen + 1}`,
      `${Math.max(1, answerNum - 1)}/${answerDen}`
    ];
    
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: correctAnswer,
      explanation: `${question.replace('What is ', '')} = ${correctAnswer}`,
      topic: 'fractions',
      tags: ['mathematics', 'fractions', operation, 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate basic algebra questions
   */
  static generateBasicAlgebra(grade, difficulty, seed) {
    const variable = ['x', 'y', 'n', 'a'][seed % 4];
    
    let coefficient, constant, answer, question;
    
    if (difficulty === 'easy') {
      coefficient = Math.floor(Math.random() * 5) + 1;
      constant = Math.floor(Math.random() * 20) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
    } else {
      coefficient = Math.floor(Math.random() * 10) + 1;
      constant = Math.floor(Math.random() * 50) + 1;
      answer = Math.floor(Math.random() * 20) + 1;
    }
    
    const result = coefficient * answer + constant;
    question = `If ${coefficient}${variable} + ${constant} = ${result}, what is ${variable}?`;
    
    const wrongAnswers = this.generateWrongAnswers(answer, 3);
    const options = this.shuffleArray([String(answer), ...wrongAnswers]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: String(answer),
      explanation: `${coefficient}${variable} = ${result} - ${constant} = ${result - constant}, so ${variable} = ${result - constant}/${coefficient} = ${answer}`,
      topic: 'basic algebra',
      tags: ['mathematics', 'algebra', 'equations', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 90 : 120
    };
  }
  
  /**
   * Utility functions
   */
  static generateWrongAnswers(correct, count) {
    const wrong = [];
    const variations = [
      correct + 1, correct - 1, correct + 2, correct - 2,
      correct * 2, Math.floor(correct / 2), correct + 10, correct - 10
    ];
    
    for (let i = 0; i < count && i < variations.length; i++) {
      if (variations[i] > 0 && variations[i] !== correct) {
        wrong.push(String(variations[i]));
      }
    }
    
    // Fill remaining slots if needed
    while (wrong.length < count) {
      const random = Math.floor(Math.random() * 100) + 1;
      if (random !== correct && !wrong.includes(String(random))) {
        wrong.push(String(random));
      }
    }
    
    return wrong.slice(0, count);
  }
  
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  static findGCD(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
}

module.exports = EnhancedMathGenerator;
