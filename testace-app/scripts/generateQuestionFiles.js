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
      
      questions.push(question);
    }
    
    return questions;
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
    const topics = ['quadratic', 'functions', 'trigonometry', 'logarithms'];
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
  
  static generateThinkingSkillsQuestions(grade, difficulty, count) {
    const questions = [];
    
    const templates = [
      {
        pattern: 'logical_sequence',
        content: 'What comes next in the sequence: 2, 4, 8, 16, ___?',
        options: ['32', '24', '20', '18'],
        correctAnswer: '32',
        explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32'
      },
      {
        pattern: 'pattern_recognition',
        content: 'If CAT = 3-1-20, what does DOG equal?',
        options: ['4-15-7', '4-14-7', '3-15-7', '4-15-8'],
        correctAnswer: '4-15-7',
        explanation: 'Each letter corresponds to its position in the alphabet: D=4, O=15, G=7'
      },
      {
        pattern: 'logical_reasoning',
        content: 'All roses are flowers. Some flowers are red. Therefore:',
        options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
        correctAnswer: 'Cannot be determined',
        explanation: 'We cannot determine if roses are red from the given information'
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      questions.push({
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
        tags: ['thinking-skills', 'logic', 'build-time-generated'],
        createdBy: 'build-time-generator',
        createdAt: new Date().toISOString()
      });
    }
    
    return questions;
  }
  
  static generateReadingQuestions(grade, difficulty, count) {
    const questions = [];
    
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
