#!/usr/bin/env node

/**
 * BUILD-TIME QUESTION GENERATOR
 * 
 * Generates 2,700+ questions as static JSON files during build process.
 * This eliminates all runtime generation and provides instant loading.
 * 
 * Usage: node scripts/generateQuestionFiles.js
 */

const fs = require('fs');
const path = require('path');

// We'll need to create simplified versions of our generators for Node.js
const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const SUBJECTS = ['math', 'thinking-skills', 'reading'];
const QUESTIONS_PER_COMBINATION = 25;

class BuildTimeQuestionGenerator {
  
  
  /**
   * Check if a question file already contains real (non-fake) questions
   */
  static hasRealQuestions(filePath) {
    try {
      if (!fs.existsSync(filePath)) return false;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const questions = JSON.parse(content);
      
      if (!Array.isArray(questions) || questions.length === 0) return false;
      
      // Check if questions are fake (contain generic patterns)
      const firstQuestion = questions[0];
      if (!firstQuestion.content) return false;
      
      // Fake question patterns to detect
      const fakePatterns = [
        /Grade \d+ \w+ \w+ question \d+/,
        /Option [A-D]\d*$/,
        /varied content/i
      ];
      
      const isFake = fakePatterns.some(pattern => 
        pattern.test(firstQuestion.content) || 
        (firstQuestion.options && firstQuestion.options.some(opt => pattern.test(opt)))
      );
      
      return !isFake; // Return true if NOT fake (i.e., has real questions)
    } catch (error) {
      return false;
    }
  }

  static async generateAllQuestions() {
    console.log('🚀 Starting build-time question generation...');
    const startTime = Date.now();
    
    const outputDir = path.join(__dirname, '../public/questions');
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let totalQuestions = 0;
    const manifest = {};
    
    // Generate questions for each combination
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        for (const subject of SUBJECTS) {
          try {
            console.log(`📝 Generating ${subject} questions for Grade ${grade}, ${difficulty}...`);
            
            const questions = await this.generateQuestionsForCombination(grade, difficulty, subject);
            const filename = `${grade}_${difficulty}_${subject}.json`;
            const filepath = path.join(outputDir, filename);
            
            // Write questions to file
            fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
            
            // Update manifest
            const key = `${grade}_${difficulty}_${subject}`;
            manifest[key] = {
              filename,
              count: questions.length,
              generated: new Date().toISOString()
            };
            
            totalQuestions += questions.length;
            console.log(`✅ Generated ${questions.length} questions for ${key}`);
            
          } catch (error) {
            console.error(`❌ Failed to generate questions for ${grade}-${difficulty}-${subject}:`, error);
          }
        }
      }
    }
    
    // Write manifest file
    const manifestPath = path.join(outputDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify({
      generated: new Date().toISOString(),
      totalCombinations: Object.keys(manifest).length,
      totalQuestions,
      combinations: manifest
    }, null, 2));
    
    const endTime = Date.now();
    console.log(`🎉 Question generation complete!`);
    console.log(`   - Total combinations: ${Object.keys(manifest).length}`);
    console.log(`   - Total questions: ${totalQuestions}`);
    console.log(`   - Time taken: ${endTime - startTime}ms`);
    console.log(`   - Output directory: ${outputDir}`);
  }
  
  static async generateQuestionsForCombination(grade, difficulty, subject) {
    const questions = [];
    
    if (subject === 'math') {
      questions.push(...this.generateMathQuestions(grade, difficulty, QUESTIONS_PER_COMBINATION));
    } else if (subject === 'thinking-skills') {
      questions.push(...this.generateThinkingSkillsQuestions(grade, difficulty, QUESTIONS_PER_COMBINATION));
    } else if (subject === 'reading') {
      questions.push(...this.generateReadingQuestions(grade, difficulty, QUESTIONS_PER_COMBINATION));
    }
    
    return questions;
  }
  
  static generateMathQuestions(grade, difficulty, count) {
    const questions = [];
    const gradeNum = parseInt(grade);
    
    for (let i = 0; i < count; i++) {
      let question;
      
      if (gradeNum <= 5) {
        question = this.generateElementaryMath(gradeNum, difficulty, i);
      } else if (gradeNum <= 8) {
        question = this.generateMiddleSchoolMath(gradeNum, difficulty, i);
      } else {
        question = this.generateHighSchoolMath(gradeNum, difficulty, i);
      }
      
      // Add timed test optimization tags
      question.tags = [...(question.tags || []), 'timed-test-ready'];
      question.estimatedTime = this.estimateQuestionTime(question, difficulty);
      
      questions.push(question);
    }
    
    return questions;
  }
  
  /**
   * Estimate time needed to solve a question (for timed test optimization)
   */
  static estimateQuestionTime(question, difficulty) {
    let baseTime = 60; // 60 seconds base time
    
    // Adjust based on difficulty
    if (difficulty === 'easy') baseTime = 45;
    else if (difficulty === 'hard') baseTime = 90;
    
    // Adjust based on question complexity
    if (question.content.length > 100) baseTime += 15;
    if (question.topic.includes('algebra') || question.topic.includes('trigonometry')) baseTime += 20;
    
    return baseTime;
  }
  
  static generateElementaryMath(grade, difficulty, index) {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[index % operations.length];
    
    let a, b, answer, question, explanation;
    
    const range = difficulty === 'easy' ? [1, 20] : difficulty === 'medium' ? [10, 50] : [20, 100];
    
    switch (operation) {
      case '+':
        a = this.randomInt(range[0], range[1]);
        b = this.randomInt(range[0], range[1]);
        answer = a + b;
        question = `What is ${a} + ${b}?`;
        explanation = `${a} + ${b} = ${answer}`;
        break;
        
      case '-':
        a = this.randomInt(range[0], range[1]);
        b = this.randomInt(1, a);
        answer = a - b;
        question = `What is ${a} - ${b}?`;
        explanation = `${a} - ${b} = ${answer}`;
        break;
        
      case '×':
        a = this.randomInt(2, 12);
        b = this.randomInt(2, 12);
        answer = a * b;
        question = `What is ${a} × ${b}?`;
        explanation = `${a} × ${b} = ${answer}`;
        break;
        
      case '÷':
        b = this.randomInt(2, 12);
        answer = this.randomInt(2, 15);
        a = b * answer;
        question = `What is ${a} ÷ ${b}?`;
        explanation = `${a} ÷ ${b} = ${answer}`;
        break;
    }
    
    return {
      _id: `build_math_${grade}_${difficulty}_${index}`,
      content: question,
      type: 'multiple_choice',
      options: this.generateMathOptions(answer),
      correctAnswer: answer.toString(),
      explanation,
      subject: 'Mathematical Reasoning',
      topic: `${operation === '+' ? 'Addition' : operation === '-' ? 'Subtraction' : operation === '×' ? 'Multiplication' : 'Division'}`,
      difficulty,
      grade,
      tags: ['mathematics', 'build-time-generated'],
      createdBy: 'build-time-generator',
      createdAt: new Date().toISOString()
    };
  }
  
  static generateMiddleSchoolMath(grade, difficulty, index) {
    const topics = ['algebra', 'equations', 'ratios', 'percentages'];
    const topic = topics[index % topics.length];
    
    switch (topic) {
      case 'algebra':
        const x = this.randomInt(1, 10);
        const a = this.randomInt(2, 8);
        const b = this.randomInt(5, 20);
        const result = a * x + b;
        return {
          _id: `build_math_${grade}_${difficulty}_${index}`,
          content: `Solve for x: ${a}x + ${b} = ${result}`,
          type: 'multiple_choice',
          options: this.generateMathOptions(x),
          correctAnswer: x.toString(),
          explanation: `${a}x + ${b} = ${result}, so ${a}x = ${result - b}, therefore x = ${x}`,
          subject: 'Mathematical Reasoning',
          topic: 'Algebra',
          difficulty,
          grade,
          tags: ['mathematics', 'algebra', 'build-time-generated'],
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      case 'percentages':
        const whole = this.randomInt(50, 200);
        const percent = this.randomInt(10, 90);
        const answer = Math.round((percent / 100) * whole);
        return {
          _id: `build_math_${grade}_${difficulty}_${index}`,
          content: `What is ${percent}% of ${whole}?`,
          type: 'multiple_choice',
          options: this.generateMathOptions(answer),
          correctAnswer: answer.toString(),
          explanation: `${percent}% of ${whole} = (${percent}/100) × ${whole} = ${answer}`,
          subject: 'Mathematical Reasoning',
          topic: 'Percentages',
          difficulty,
          grade,
          tags: ['mathematics', 'percentages', 'build-time-generated'],
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      default:
        return this.generateElementaryMath(grade, difficulty, index);
    }
  }
  
  static generateHighSchoolMath(grade, difficulty, index) {
    const gradeNum = parseInt(grade);
    
    // For Grade 9 Hard, create genuinely challenging questions
    if (gradeNum === 9 && difficulty === 'hard') {
      return this.generateGrade9HardMath(index);
    }
    
    const topics = ['quadratic', 'functions', 'trigonometry', 'logarithms', 'systems', 'inequalities'];
    const topic = topics[index % topics.length];
    
    switch (topic) {
      case 'functions':
        const a = this.randomInt(2, 8);
        const b = this.randomInt(-5, 5);
        const x = this.randomInt(1, 6);
        const answer = a * x + b;
        return {
          _id: `build_math_${grade}_${difficulty}_${index}`,
          content: `If f(x) = ${a}x ${b >= 0 ? '+' : ''}${b}, what is f(${x})?`,
          type: 'multiple_choice',
          options: this.generateMathOptions(answer),
          correctAnswer: answer.toString(),
          explanation: `f(${x}) = ${a}(${x}) ${b >= 0 ? '+' : ''}${b} = ${answer}`,
          subject: 'Mathematical Reasoning',
          topic: 'Functions',
          difficulty,
          grade,
          tags: ['mathematics', 'functions', 'build-time-generated'],
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      case 'trigonometry':
        const angles = [30, 45, 60];
        const angle = angles[index % angles.length];
        const values = {30: '1/2', 45: '√2/2', 60: '√3/2'};
        return {
          _id: `build_math_${grade}_${difficulty}_${index}`,
          content: `What is sin(${angle}°)?`,
          type: 'multiple_choice',
          options: [values[angle], '1/2', '√2/2', '√3/2'],
          correctAnswer: values[angle],
          explanation: `sin(${angle}°) = ${values[angle]} (special angle)`,
          subject: 'Mathematical Reasoning',
          topic: 'Trigonometry',
          difficulty,
          grade,
          tags: ['mathematics', 'trigonometry', 'build-time-generated'],
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      default:
        return this.generateMiddleSchoolMath(grade, difficulty, index);
    }
  }
  
  /**
   * Generate genuinely challenging Grade 9 Hard mathematics questions
   */
  static generateGrade9HardMath(index) {
    const hardTopics = [
      'quadratic_equations',
      'systems_of_equations', 
      'exponential_functions',
      'radical_expressions',
      'rational_functions',
      'complex_inequalities',
      'polynomial_factoring',
      'logarithmic_equations',
      'trigonometric_identities',
      'coordinate_geometry',
      'sequences_and_series',
      'probability_combinations'
    ];
    
    const topic = hardTopics[index % hardTopics.length];
    
    switch (topic) {
      case 'quadratic_equations':
        // Solve ax² + bx + c = 0 using quadratic formula
        const a = this.randomInt(2, 5);
        const b = this.randomInt(-8, 8);
        const c = this.randomInt(-6, 6);
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant >= 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          const solutions = discriminant === 0 ? [x1.toFixed(1)] : [x1.toFixed(1), x2.toFixed(1)].sort();
          
          return {
            _id: `build_math_9_hard_${index}`,
            content: `Solve for x: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
            type: 'multiple_choice',
            options: [
              solutions.join(', '),
              `${(x1 + 1).toFixed(1)}, ${(x2 + 1).toFixed(1)}`,
              `${(x1 - 1).toFixed(1)}, ${(x2 - 1).toFixed(1)}`,
              'No real solutions'
            ],
            correctAnswer: solutions.join(', '),
            explanation: `Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. Solutions: ${solutions.join(', ')}`,
            subject: 'Mathematical Reasoning',
            topic: 'Quadratic Equations',
            difficulty: 'hard',
            grade: '9',
            tags: ['mathematics', 'quadratic', 'hard', 'build-time-generated'],
            estimatedTime: 120,
            createdBy: 'build-time-generator',
            createdAt: new Date().toISOString()
          };
        }
        break;
        
      case 'systems_of_equations':
        // Solve system: ax + by = c, dx + ey = f
        const a1 = this.randomInt(2, 5);
        const b1 = this.randomInt(2, 5);
        const a2 = this.randomInt(2, 5);
        const b2 = this.randomInt(2, 5);
        
        // Ensure unique solution
        if (a1 * b2 !== a2 * b1) {
          const x = this.randomInt(1, 4);
          const y = this.randomInt(1, 4);
          const c1 = a1 * x + b1 * y;
          const c2 = a2 * x + b2 * y;
          
          return {
            _id: `build_math_9_hard_${index}`,
            content: `Solve the system of equations:\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
            type: 'multiple_choice',
            options: [
              `x = ${x}, y = ${y}`,
              `x = ${x + 1}, y = ${y}`,
              `x = ${x}, y = ${y + 1}`,
              `x = ${x - 1}, y = ${y - 1}`
            ],
            correctAnswer: `x = ${x}, y = ${y}`,
            explanation: `Using substitution or elimination method: x = ${x}, y = ${y}`,
            subject: 'Mathematical Reasoning',
            topic: 'Systems of Equations',
            difficulty: 'hard',
            grade: '9',
            tags: ['mathematics', 'systems', 'hard', 'build-time-generated'],
            estimatedTime: 150,
            createdBy: 'build-time-generator',
            createdAt: new Date().toISOString()
          };
        }
        break;
        
      case 'exponential_functions':
        // Exponential growth/decay problems
        const base = [2, 3, 4, 5][index % 4];
        const exponent = this.randomInt(3, 6);
        const result = Math.pow(base, exponent);
        
        return {
          _id: `build_math_9_hard_${index}`,
          content: `If a bacteria culture doubles every hour and starts with 100 bacteria, how many bacteria will there be after ${exponent} hours?`,
          type: 'multiple_choice',
          options: [
            `${100 * Math.pow(2, exponent)}`,
            `${100 * Math.pow(2, exponent - 1)}`,
            `${100 * Math.pow(2, exponent + 1)}`,
            `${100 * exponent * 2}`
          ],
          correctAnswer: `${100 * Math.pow(2, exponent)}`,
          explanation: `Using exponential growth formula: N = N₀ × 2^t = 100 × 2^${exponent} = ${100 * Math.pow(2, exponent)}`,
          subject: 'Mathematical Reasoning',
          topic: 'Exponential Functions',
          difficulty: 'hard',
          grade: '9',
          tags: ['mathematics', 'exponential', 'hard', 'build-time-generated'],
          estimatedTime: 135,
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      case 'radical_expressions':
        // Simplify radical expressions
        const radicand = [18, 32, 50, 72, 98][index % 5];
        const simplified = this.simplifyRadical(radicand);
        
        return {
          _id: `build_math_9_hard_${index}`,
          content: `Simplify √${radicand}`,
          type: 'multiple_choice',
          options: [
            simplified,
            `√${radicand}`,
            `${Math.floor(Math.sqrt(radicand))}√${radicand % Math.floor(Math.sqrt(radicand))}`,
            `${Math.ceil(Math.sqrt(radicand))}`
          ],
          correctAnswer: simplified,
          explanation: `√${radicand} = ${simplified} (factor out perfect squares)`,
          subject: 'Mathematical Reasoning',
          topic: 'Radical Expressions',
          difficulty: 'hard',
          grade: '9',
          tags: ['mathematics', 'radicals', 'hard', 'build-time-generated'],
          estimatedTime: 90,
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      case 'rational_functions':
        // Rational function domain problems
        const denom_a = this.randomInt(1, 3);
        const denom_b = this.randomInt(-5, 5);
        const restriction = -denom_b / denom_a;
        
        return {
          _id: `build_math_9_hard_${index}`,
          content: `What is the domain of f(x) = 1/(${denom_a}x ${denom_b >= 0 ? '+' : ''}${denom_b})?`,
          type: 'multiple_choice',
          options: [
            `All real numbers except x = ${restriction}`,
            `All real numbers except x = ${-restriction}`,
            `All real numbers`,
            `x ≥ ${restriction}`
          ],
          correctAnswer: `All real numbers except x = ${restriction}`,
          explanation: `The denominator cannot equal zero: ${denom_a}x ${denom_b >= 0 ? '+' : ''}${denom_b} ≠ 0, so x ≠ ${restriction}`,
          subject: 'Mathematical Reasoning',
          topic: 'Rational Functions',
          difficulty: 'hard',
          grade: '9',
          tags: ['mathematics', 'rational', 'hard', 'build-time-generated'],
          estimatedTime: 105,
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
        
      default:
        // Fallback to complex polynomial factoring
        const p = this.randomInt(2, 4);
        const q = this.randomInt(2, 4);
        const expanded_a = 1;
        const expanded_b = p + q;
        const expanded_c = p * q;
        
        return {
          _id: `build_math_9_hard_${index}`,
          content: `Factor completely: x² + ${expanded_b}x + ${expanded_c}`,
          type: 'multiple_choice',
          options: [
            `(x + ${p})(x + ${q})`,
            `(x - ${p})(x - ${q})`,
            `(x + ${p})(x - ${q})`,
            `Cannot be factored`
          ],
          correctAnswer: `(x + ${p})(x + ${q})`,
          explanation: `Find two numbers that multiply to ${expanded_c} and add to ${expanded_b}: ${p} and ${q}`,
          subject: 'Mathematical Reasoning',
          topic: 'Polynomial Factoring',
          difficulty: 'hard',
          grade: '9',
          tags: ['mathematics', 'factoring', 'hard', 'build-time-generated'],
          estimatedTime: 120,
          createdBy: 'build-time-generator',
          createdAt: new Date().toISOString()
        };
    }
    
    // Fallback if no case matches
    return this.generateMiddleSchoolMath('9', 'hard', index);
  }
  
  /**
   * Simplify radical expressions
   */
  static simplifyRadical(n) {
    let factor = 1;
    let remaining = n;
    
    for (let i = 2; i * i <= n; i++) {
      while (remaining % (i * i) === 0) {
        factor *= i;
        remaining /= (i * i);
      }
    }
    
    if (factor === 1) {
      return `√${n}`;
    } else if (remaining === 1) {
      return factor.toString();
    } else {
      return `${factor}√${remaining}`;
    }
  }
  
  static generateThinkingSkillsQuestions(grade, difficulty, count) {
    const questions = [];
    const gradeNum = parseInt(grade);
    
    // For Grade 9 Hard, create genuinely challenging thinking skills questions
    if (gradeNum === 9 && difficulty === 'hard') {
      return this.generateGrade9HardThinkingSkills(count);
    }
    
    const templates = [
      {
        pattern: 'logical_sequence',
        content: 'What comes next in the sequence: 2, 4, 8, 16, ___?',
        options: ['32', '24', '20', '18'],
        correctAnswer: '32',
        explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
        estimatedTime: 75
      },
      {
        pattern: 'pattern_recognition',
        content: 'If CAT = 3-1-20, what does DOG equal?',
        options: ['4-15-7', '4-14-7', '3-15-7', '4-15-8'],
        correctAnswer: '4-15-7',
        explanation: 'Each letter corresponds to its position in the alphabet: D=4, O=15, G=7',
        estimatedTime: 90
      },
      {
        pattern: 'logical_reasoning',
        content: 'All roses are flowers. Some flowers are red. Therefore:',
        options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
        correctAnswer: 'Cannot be determined',
        explanation: 'We cannot determine if roses are red from the given information',
        estimatedTime: 60
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const question = {
        _id: `build_thinking_${grade}_${difficulty}_${i}`,
        content: template.content,
        type: 'multiple_choice',
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        subject: 'Thinking Skills',
        topic: template.pattern.replace('_', ' '),
        difficulty,
        grade,
        tags: ['thinking-skills', 'logic', 'build-time-generated', 'timed-test-ready'],
        estimatedTime: template.estimatedTime,
        createdBy: 'build-time-generator',
        createdAt: new Date().toISOString()
      };
      
      questions.push(question);
    }
    
    return questions;
  }
  
  /**
   * Generate genuinely challenging Grade 9 Hard thinking skills questions
   */
  static generateGrade9HardThinkingSkills(count) {
    const questions = [];
    
    const hardTemplates = [
      {
        pattern: 'complex_logical_reasoning',
        content: 'In a group of 100 people, 70 like coffee, 60 like tea, and 40 like both. If someone is chosen at random and likes coffee, what is the probability they also like tea?',
        options: ['4/7', '2/5', '3/5', '1/2'],
        correctAnswer: '4/7',
        explanation: 'P(tea|coffee) = P(both)/P(coffee) = (40/100)/(70/100) = 40/70 = 4/7',
        estimatedTime: 180
      },
      {
        pattern: 'advanced_pattern_recognition',
        content: 'In the sequence 1, 4, 9, 16, 25, 36, what is the 10th term?',
        options: ['100', '81', '64', '121'],
        correctAnswer: '100',
        explanation: 'This is the sequence of perfect squares: n². The 10th term is 10² = 100',
        estimatedTime: 120
      },
      {
        pattern: 'complex_syllogism',
        content: 'All mathematicians are logical. Some logical people are creative. All creative people are innovative. Therefore:',
        options: ['All mathematicians are innovative', 'Some mathematicians might be innovative', 'No mathematicians are creative', 'All innovative people are mathematicians'],
        correctAnswer: 'Some mathematicians might be innovative',
        explanation: 'We cannot conclude all mathematicians are innovative, but some might be through the logical→creative→innovative chain',
        estimatedTime: 150
      },
      {
        pattern: 'spatial_reasoning',
        content: 'A cube is painted red on all faces, then cut into 27 smaller cubes of equal size. How many small cubes have exactly 2 red faces?',
        options: ['12', '8', '6', '4'],
        correctAnswer: '12',
        explanation: 'Cubes with exactly 2 red faces are on the edges but not corners. A 3×3×3 cube has 12 such edge cubes',
        estimatedTime: 200
      },
      {
        pattern: 'analytical_reasoning',
        content: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        options: ['5 minutes', '100 minutes', '20 minutes', '1 minute'],
        correctAnswer: '5 minutes',
        explanation: 'Each machine makes 1 widget in 5 minutes. 100 machines can make 100 widgets in the same 5 minutes',
        estimatedTime: 135
      },
      {
        pattern: 'logical_deduction',
        content: 'In a certain code, MONDAY is written as NPOEBZ. How is FRIDAY written in the same code?',
        options: ['GSJEBZ', 'GSJFBZ', 'GQJEBZ', 'GSJDAY'],
        correctAnswer: 'GSJEBZ',
        explanation: 'Each letter is shifted by +1 in the alphabet: F→G, R→S, I→J, D→E, A→B, Y→Z',
        estimatedTime: 165
      },
      {
        pattern: 'mathematical_logic',
        content: 'If x² - 5x + 6 = 0, and y² - 7y + 12 = 0, what is the maximum possible value of x + y?',
        options: ['7', '6', '5', '8'],
        correctAnswer: '7',
        explanation: 'x² - 5x + 6 = 0 gives x = 2 or 3. y² - 7y + 12 = 0 gives y = 3 or 4. Maximum x + y = 3 + 4 = 7',
        estimatedTime: 210
      },
      {
        pattern: 'probability_reasoning',
        content: 'A bag contains 3 red balls, 4 blue balls, and 5 green balls. If 3 balls are drawn without replacement, what is the probability that all 3 are different colors?',
        options: ['60/220', '1/4', '3/11', '5/22'],
        correctAnswer: '60/220',
        explanation: 'P = (3×4×5)/(12×11×10) × 3! = 60/1320 × 6 = 360/1320 = 60/220',
        estimatedTime: 240
      },
      {
        pattern: 'abstract_reasoning',
        content: 'In a certain pattern: ★ = +5, ☆ = ×2, ◇ = -3. What is the result of applying ★☆◇ to the number 4?',
        options: ['15', '12', '18', '21'],
        correctAnswer: '15',
        explanation: 'Apply operations left to right: 4 + 5 = 9, then 9 × 2 = 18, then 18 - 3 = 15',
        estimatedTime: 120
      },
      {
        pattern: 'critical_thinking',
        content: 'A study shows that students who eat breakfast score higher on tests. Which conclusion is most valid?',
        options: ['Eating breakfast causes better test scores', 'Students should be required to eat breakfast', 'There is a correlation between breakfast and test scores', 'Breakfast is the most important meal'],
        correctAnswer: 'There is a correlation between breakfast and test scores',
        explanation: 'Correlation does not imply causation. The study shows a relationship but not necessarily that breakfast causes better scores',
        estimatedTime: 120
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = hardTemplates[i % hardTemplates.length];
      const question = {
        _id: `build_thinking_9_hard_${i}`,
        content: template.content,
        type: 'multiple_choice',
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        subject: 'Thinking Skills',
        topic: template.pattern.replace(/_/g, ' '),
        difficulty: 'hard',
        grade: '9',
        tags: ['thinking-skills', 'logic', 'hard', 'challenging', 'build-time-generated', 'timed-test-ready'],
        estimatedTime: template.estimatedTime,
        createdBy: 'build-time-generator',
        createdAt: new Date().toISOString()
      };
      
      questions.push(question);
    }
    
    return questions;
  }
  
  static generateReadingQuestions(grade, difficulty, count) {
    const questions = [];
    const gradeNum = parseInt(grade);
    
    // For Grade 9 Hard, create genuinely challenging reading questions
    if (gradeNum === 9 && difficulty === 'hard') {
      return this.generateGrade9HardReading(count);
    }
    
    const passages = [
      {
        title: 'The Solar System',
        text: 'The solar system consists of the Sun and all the objects that orbit around it. There are eight planets in our solar system. Mercury is the closest planet to the Sun, while Neptune is the farthest. Earth is the third planet from the Sun and the only known planet that supports life.',
        question: 'Which planet is closest to the Sun?',
        options: ['Earth', 'Mercury', 'Venus', 'Mars'],
        correctAnswer: 'Mercury',
        explanation: 'According to the passage, Mercury is the closest planet to the Sun.'
      },
      {
        title: 'Photosynthesis',
        text: 'Photosynthesis is the process by which plants make their own food. Plants use sunlight, water, and carbon dioxide to create glucose and oxygen. This process is essential for life on Earth because it produces the oxygen we breathe and forms the base of most food chains.',
        question: 'What do plants need for photosynthesis?',
        options: ['Sunlight, water, and carbon dioxide', 'Sunlight and water only', 'Water and carbon dioxide only', 'Sunlight only'],
        correctAnswer: 'Sunlight, water, and carbon dioxide',
        explanation: 'The passage states that plants use sunlight, water, and carbon dioxide for photosynthesis.'
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const passage = passages[i % passages.length];
      questions.push({
        _id: `build_reading_${grade}_${difficulty}_${i}`,
        content: `${passage.title}\n\n${passage.text}\n\nQuestion: ${passage.question}`,
        type: 'multiple_choice',
        options: passage.options,
        correctAnswer: passage.correctAnswer,
        explanation: passage.explanation,
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty,
        grade,
        tags: ['reading', 'comprehension', 'build-time-generated'],
        createdBy: 'build-time-generator',
        createdAt: new Date().toISOString()
      });
    }
    
    return questions;
  }
  
  /**
   * Generate genuinely challenging Grade 9 Hard reading comprehension questions
   */
  static generateGrade9HardReading(count) {
    const questions = [];
    
    const hardPassages = [
      {
        title: 'The Paradox of Choice in Modern Society',
        text: 'Psychologist Barry Schwartz argues that while some choice is undoubtedly better than none, more is not always better than less. The explosion of choice in modern society—from breakfast cereals to career paths—has created a paradox. Rather than liberating us, this abundance of options often leads to anxiety, regret, and paralysis. Schwartz distinguishes between "maximizers," who seek the absolute best option, and "satisficers," who seek options that are "good enough." Research suggests that satisficers tend to be happier and less stressed than maximizers, who often suffer from buyer\'s remorse and endless second-guessing. This phenomenon challenges the fundamental assumption of classical economics that more choices always lead to greater welfare and satisfaction.',
        question: 'According to the passage, what is the main difference between maximizers and satisficers?',
        options: [
          'Maximizers seek the best option while satisficers seek good enough options',
          'Maximizers are happier than satisficers',
          'Satisficers make faster decisions than maximizers',
          'Maximizers have more choices available to them'
        ],
        correctAnswer: 'Maximizers seek the best option while satisficers seek good enough options',
        explanation: 'The passage explicitly states that maximizers "seek the absolute best option" while satisficers "seek options that are \'good enough.\'"',
        estimatedTime: 180
      },
      {
        title: 'Quantum Entanglement and Information Theory',
        text: 'Quantum entanglement, described by Einstein as "spooky action at a distance," represents one of the most counterintuitive phenomena in physics. When two particles become entangled, measuring the state of one particle instantaneously affects the state of its partner, regardless of the distance separating them. This phenomenon has profound implications for information theory and cryptography. Quantum entanglement enables quantum computing, where entangled qubits can exist in multiple states simultaneously, potentially solving certain problems exponentially faster than classical computers. However, entanglement is fragile and easily disrupted by environmental interference, a challenge known as decoherence. Recent advances in quantum error correction and the development of quantum networks suggest that practical quantum communication systems may soon become reality, revolutionizing how we process and transmit information.',
        question: 'What is the primary challenge mentioned regarding the practical application of quantum entanglement?',
        options: [
          'The distance between entangled particles',
          'Environmental interference causing decoherence',
          'The speed of quantum communication',
          'The cost of quantum computers'
        ],
        correctAnswer: 'Environmental interference causing decoherence',
        explanation: 'The passage states that "entanglement is fragile and easily disrupted by environmental interference, a challenge known as decoherence."',
        estimatedTime: 200
      },
      {
        title: 'The Rhetoric of Scientific Discourse',
        text: 'Scientific writing, often perceived as objective and neutral, actually employs sophisticated rhetorical strategies to persuade readers of its validity. The passive voice, for instance, creates an impression of objectivity by removing the human agent from experimental descriptions. Phrases like "the data suggest" rather than "we conclude" further distance the researcher from subjective interpretation. However, this apparent neutrality masks the inherently argumentative nature of scientific discourse. Scientists must convince peers that their methodology is sound, their interpretations valid, and their conclusions significant. The peer review process itself is fundamentally rhetorical, involving persuasion, critique, and negotiation. Understanding the rhetorical dimensions of science does not diminish its authority but rather reveals the complex social processes through which scientific knowledge is constructed and validated.',
        question: 'According to the passage, how does the use of passive voice in scientific writing serve a rhetorical purpose?',
        options: [
          'It makes the writing more concise and easier to read',
          'It creates an impression of objectivity by removing the human agent',
          'It follows traditional academic writing conventions',
          'It emphasizes the importance of the experimental results'
        ],
        correctAnswer: 'It creates an impression of objectivity by removing the human agent',
        explanation: 'The passage explicitly states that "The passive voice, for instance, creates an impression of objectivity by removing the human agent from experimental descriptions."',
        estimatedTime: 190
      },
      {
        title: 'Cognitive Biases in Decision Making',
        text: 'Human decision-making is systematically influenced by cognitive biases—mental shortcuts that can lead to errors in judgment. The availability heuristic causes people to overestimate the likelihood of events that are easily recalled, often because they are recent or emotionally salient. For example, after seeing news reports about airplane crashes, people may overestimate the danger of flying despite statistical evidence that air travel is safer than driving. Confirmation bias leads individuals to seek information that confirms their existing beliefs while ignoring contradictory evidence. The anchoring effect occurs when people rely too heavily on the first piece of information encountered when making decisions. These biases evolved as adaptive mechanisms for quick decision-making in ancestral environments but can be maladaptive in modern contexts requiring careful analysis of complex information. Understanding these biases is crucial for improving decision-making in fields ranging from medicine to finance.',
        question: 'Which cognitive bias is illustrated by the airplane crash example in the passage?',
        options: [
          'Confirmation bias',
          'Anchoring effect',
          'Availability heuristic',
          'Survivorship bias'
        ],
        correctAnswer: 'Availability heuristic',
        explanation: 'The passage uses the airplane crash example to illustrate the availability heuristic, where people "overestimate the likelihood of events that are easily recalled."',
        estimatedTime: 170
      },
      {
        title: 'The Economics of Attention in Digital Media',
        text: 'In the digital age, human attention has become a scarce and valuable commodity. Social media platforms, search engines, and streaming services compete intensely for user engagement, employing sophisticated algorithms designed to capture and maintain attention. This "attention economy" has transformed how information is produced, distributed, and consumed. Content creators optimize for metrics like clicks, views, and time spent, often prioritizing sensational or emotionally provocative material over nuanced analysis. The result is an information ecosystem that rewards brevity, controversy, and immediate gratification while penalizing complexity and depth. This shift has profound implications for democratic discourse, as citizens increasingly consume information in fragmented, decontextualized formats. The challenge for educators and policymakers is to develop media literacy skills that enable individuals to navigate this attention-driven landscape while maintaining the capacity for sustained, critical thinking.',
        question: 'What does the passage suggest is the primary consequence of the attention economy on information quality?',
        options: [
          'Information becomes more accessible to everyone',
          'Content prioritizes sensational material over nuanced analysis',
          'Digital platforms become more profitable',
          'Users spend more time consuming media'
        ],
        correctAnswer: 'Content prioritizes sensational material over nuanced analysis',
        explanation: 'The passage states that content creators "often prioritizing sensational or emotionally provocative material over nuanced analysis" as a result of the attention economy.',
        estimatedTime: 185
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const passage = hardPassages[i % hardPassages.length];
      const question = {
        _id: `build_reading_9_hard_${i}`,
        content: `${passage.title}\n\n${passage.text}\n\nQuestion: ${passage.question}`,
        type: 'multiple_choice',
        options: passage.options,
        correctAnswer: passage.correctAnswer,
        explanation: passage.explanation,
        subject: 'Reading',
        topic: 'Advanced Reading Comprehension',
        difficulty: 'hard',
        grade: '9',
        tags: ['reading', 'comprehension', 'hard', 'challenging', 'build-time-generated', 'timed-test-ready'],
        estimatedTime: passage.estimatedTime,
        createdBy: 'build-time-generator',
        createdAt: new Date().toISOString()
      };
      
      questions.push(question);
    }
    
    return questions;
  }
  
  static generateMathOptions(correctAnswer) {
    const options = [correctAnswer.toString()];
    const variations = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + 2,
      correctAnswer - 2,
      correctAnswer * 2,
      Math.floor(correctAnswer / 2)
    ].filter(opt => opt > 0 && opt !== correctAnswer);
    
    // Add 3 random variations
    for (let i = 0; i < 3 && i < variations.length; i++) {
      options.push(variations[i].toString());
    }
    
    // Shuffle options
    return this.shuffleArray(options);
  }
  
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  static shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

// Run the generator
if (require.main === module) {
  BuildTimeQuestionGenerator.generateAllQuestions()
    .then(() => {
      console.log('✅ Build-time question generation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Build-time question generation failed:', error);
      process.exit(1);
    });
}

module.exports = BuildTimeQuestionGenerator;
