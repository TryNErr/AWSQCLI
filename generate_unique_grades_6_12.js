#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive unique question generators
class QuestionGenerator {
  constructor() {
    this.usedQuestions = new Set();
  }

  // Math question generators with unique variations
  generateMathQuestions(grade, difficulty, count = 50) {
    const questions = [];
    const generators = this.getMathGenerators(grade, difficulty);
    
    while (questions.length < count) {
      for (const generator of generators) {
        if (questions.length >= count) break;
        
        const question = generator();
        const questionKey = `${question.content}_${question.correctAnswer}`;
        
        if (!this.usedQuestions.has(questionKey)) {
          this.usedQuestions.add(questionKey);
          questions.push({
            "_id": `math_${grade}_${difficulty}_${String(questions.length + 1).padStart(3, '0')}`,
            "content": question.content,
            "type": "multiple_choice",
            "options": question.options,
            "correctAnswer": question.correctAnswer,
            "subject": "math",
            "grade": String(grade),
            "difficulty": difficulty,
            "explanation": question.explanation,
            "_cacheBreaker": `${Date.now()}_${questions.length + 1}`
          });
        }
      }
    }
    
    return questions;
  }

  getMathGenerators(grade, difficulty) {
    const generators = [];
    
    if (difficulty === 'easy') {
      // Basic arithmetic with variations
      for (let i = 1; i <= 20; i++) {
        generators.push(() => {
          const a = Math.floor(Math.random() * 50) + grade * 5;
          const b = Math.floor(Math.random() * 30) + grade * 2;
          const sum = a + b;
          return {
            content: `What is ${a} + ${b}?`,
            options: [String(sum - 2), String(sum), String(sum + 3), String(sum + 5)],
            correctAnswer: String(sum),
            explanation: `${a} + ${b} = ${sum}`
          };
        });
      }

      // Percentage problems
      for (let i = 1; i <= 15; i++) {
        generators.push(() => {
          const percent = [10, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 7)];
          const number = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
          const result = (percent / 100) * number;
          return {
            content: `What is ${percent}% of ${number}?`,
            options: [String(result - 10), String(result), String(result + 15), String(result + 25)],
            correctAnswer: String(result),
            explanation: `${percent}% of ${number} = ${percent/100} × ${number} = ${result}`
          };
        });
      }

      // Simple equations
      for (let i = 1; i <= 15; i++) {
        generators.push(() => {
          const x = Math.floor(Math.random() * 15) + 2;
          const coeff = Math.floor(Math.random() * 8) + 2;
          const product = coeff * x;
          return {
            content: `Solve: ${coeff}x = ${product}`,
            options: [`x = ${x - 1}`, `x = ${x}`, `x = ${x + 1}`, `x = ${x + 2}`],
            correctAnswer: `x = ${x}`,
            explanation: `x = ${product} ÷ ${coeff} = ${x}`
          };
        });
      }
    }

    if (difficulty === 'medium') {
      // Linear equations with two steps
      for (let i = 1; i <= 20; i++) {
        generators.push(() => {
          const x = Math.floor(Math.random() * 12) + 3;
          const a = Math.floor(Math.random() * 5) + 2;
          const b = Math.floor(Math.random() * 20) + 5;
          const result = a * x + b;
          return {
            content: `Solve: ${a}x + ${b} = ${result}`,
            options: [`x = ${x - 1}`, `x = ${x}`, `x = ${x + 1}`, `x = ${x + 2}`],
            correctAnswer: `x = ${x}`,
            explanation: `${a}x = ${result} - ${b} = ${result - b}, so x = ${result - b} ÷ ${a} = ${x}`
          };
        });
      }

      // Quadratic expressions (for higher grades)
      if (grade >= 8) {
        for (let i = 1; i <= 15; i++) {
          generators.push(() => {
            const base = Math.floor(Math.random() * 8) + 2;
            const square = base * base;
            return {
              content: `What is ${base}²?`,
              options: [String(square - 3), String(square), String(square + 4), String(square + 8)],
              correctAnswer: String(square),
              explanation: `${base}² = ${base} × ${base} = ${square}`
            };
          });
        }
      }

      // Geometry - area and perimeter
      for (let i = 1; i <= 15; i++) {
        generators.push(() => {
          const length = Math.floor(Math.random() * 10) + grade;
          const width = Math.floor(Math.random() * 8) + grade - 2;
          const area = length * width;
          return {
            content: `What is the area of a rectangle with length ${length} cm and width ${width} cm?`,
            options: [`${area - 5} cm²`, `${area} cm²`, `${area + 8} cm²`, `${length + width} cm²`],
            correctAnswer: `${area} cm²`,
            explanation: `Area = length × width = ${length} × ${width} = ${area} cm²`
          };
        });
      }
    }

    if (difficulty === 'hard') {
      // Advanced algebra (grade 9+)
      if (grade >= 9) {
        for (let i = 1; i <= 15; i++) {
          generators.push(() => {
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 10) + 2;
            const c = Math.floor(Math.random() * 8) + 1;
            const discriminant = b * b - 4 * a * c;
            return {
              content: `Find the discriminant of ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
              options: [String(discriminant - 4), String(discriminant), String(discriminant + 6), String(discriminant + 12)],
              correctAnswer: String(discriminant),
              explanation: `Discriminant = b² - 4ac = (${b})² - 4(${a})(${c}) = ${b*b} - ${4*a*c} = ${discriminant}`
            };
          });
        }

        // Trigonometry
        const trigValues = [
          { angle: '30°', sin: '1/2', cos: '√3/2', tan: '1/√3' },
          { angle: '45°', sin: '√2/2', cos: '√2/2', tan: '1' },
          { angle: '60°', sin: '√3/2', cos: '1/2', tan: '√3' }
        ];

        for (let i = 0; i < trigValues.length; i++) {
          const trig = trigValues[i];
          generators.push(() => ({
            content: `What is sin(${trig.angle})?`,
            options: ['1/2', '√2/2', '√3/2', '1'],
            correctAnswer: trig.sin,
            explanation: `sin(${trig.angle}) = ${trig.sin}`
          }));
          
          generators.push(() => ({
            content: `What is cos(${trig.angle})?`,
            options: ['1/2', '√2/2', '√3/2', '1'],
            correctAnswer: trig.cos,
            explanation: `cos(${trig.angle}) = ${trig.cos}`
          }));
        }
      }

      // Function operations
      for (let i = 1; i <= 20; i++) {
        generators.push(() => {
          const a = Math.floor(Math.random() * 5) + 1;
          const b = Math.floor(Math.random() * 8) + 2;
          const x = Math.floor(Math.random() * 6) + 2;
          const result = a * x * x + b * x;
          return {
            content: `If f(x) = ${a}x² + ${b}x, what is f(${x})?`,
            options: [String(result - 5), String(result), String(result + 8), String(result + 15)],
            correctAnswer: String(result),
            explanation: `f(${x}) = ${a}(${x})² + ${b}(${x}) = ${a * x * x} + ${b * x} = ${result}`
          };
        });
      }
    }

    return generators;
  }

  // English question generators
  generateEnglishQuestions(grade, difficulty, count = 50) {
    const questions = [];
    const generators = this.getEnglishGenerators(grade, difficulty);
    
    while (questions.length < count) {
      for (const generator of generators) {
        if (questions.length >= count) break;
        
        const question = generator();
        const questionKey = `${question.content}_${question.correctAnswer}`;
        
        if (!this.usedQuestions.has(questionKey)) {
          this.usedQuestions.add(questionKey);
          questions.push({
            "_id": `english_${grade}_${difficulty}_${String(questions.length + 1).padStart(3, '0')}`,
            "content": question.content,
            "type": "multiple_choice",
            "options": question.options,
            "correctAnswer": question.correctAnswer,
            "subject": "english",
            "grade": String(grade),
            "difficulty": difficulty,
            "explanation": question.explanation,
            "_cacheBreaker": `${Date.now()}_${questions.length + 1}`
          });
        }
      }
    }
    
    return questions;
  }

  getEnglishGenerators(grade, difficulty) {
    const generators = [];
    
    // Grammar questions
    const grammarRules = [
      { rule: "subject-verb agreement", examples: [
        { correct: "The dog runs fast", incorrect: "The dog run fast", explanation: "Singular subjects take singular verbs" },
        { correct: "The cats are sleeping", incorrect: "The cats is sleeping", explanation: "Plural subjects take plural verbs" }
      ]},
      { rule: "past tense", examples: [
        { correct: "I walked to school", incorrect: "I walk to school yesterday", explanation: "Use past tense for past actions" },
        { correct: "She sang beautifully", incorrect: "She singed beautifully", explanation: "Sang is the past tense of sing" }
      ]}
    ];

    for (let i = 0; i < 20; i++) {
      generators.push(() => {
        const words = ['quickly', 'slowly', 'carefully', 'loudly', 'quietly', 'happily', 'sadly', 'eagerly'];
        const word = words[Math.floor(Math.random() * words.length)];
        return {
          content: `What type of word is '${word}'?`,
          options: ['noun', 'verb', 'adjective', 'adverb'],
          correctAnswer: 'adverb',
          explanation: `'${word}' is an adverb because it describes how an action is performed`
        };
      });
    }

    // Vocabulary questions
    const synonymPairs = [
      ['big', 'large'], ['small', 'tiny'], ['happy', 'joyful'], ['sad', 'sorrowful'],
      ['fast', 'quick'], ['slow', 'gradual'], ['bright', 'brilliant'], ['dark', 'dim']
    ];

    for (let i = 0; i < synonymPairs.length; i++) {
      const pair = synonymPairs[i];
      generators.push(() => ({
        content: `Which word is a synonym for '${pair[0]}'?`,
        options: [pair[1], 'opposite', 'different', 'unrelated'],
        correctAnswer: pair[1],
        explanation: `'${pair[1]}' means the same as '${pair[0]}'`
      }));
    }

    // Sentence types
    const sentenceTypes = [
      { sentence: 'What time is it?', type: 'interrogative', explanation: 'Questions are interrogative sentences' },
      { sentence: 'Close the door.', type: 'imperative', explanation: 'Commands are imperative sentences' },
      { sentence: 'The sky is blue.', type: 'declarative', explanation: 'Statements are declarative sentences' }
    ];

    for (let i = 0; i < sentenceTypes.length; i++) {
      const st = sentenceTypes[i];
      generators.push(() => ({
        content: `What type of sentence is: '${st.sentence}'?`,
        options: ['declarative', 'interrogative', 'imperative', 'exclamatory'],
        correctAnswer: st.type,
        explanation: st.explanation
      }));
    }

    return generators;
  }

  // Reading comprehension generators
  generateReadingQuestions(grade, difficulty, count = 50) {
    const questions = [];
    const passages = this.getReadingPassages(grade, difficulty);
    
    let passageIndex = 0;
    while (questions.length < count) {
      const passage = passages[passageIndex % passages.length];
      
      for (const question of passage.questions) {
        if (questions.length >= count) break;
        
        const questionKey = `${question.content}_${question.correctAnswer}`;
        if (!this.usedQuestions.has(questionKey)) {
          this.usedQuestions.add(questionKey);
          questions.push({
            "_id": `reading_${grade}_${difficulty}_${String(questions.length + 1).padStart(3, '0')}`,
            "content": question.content,
            "type": "multiple_choice",
            "options": question.options,
            "correctAnswer": question.correctAnswer,
            "subject": "reading",
            "grade": String(grade),
            "difficulty": difficulty,
            "explanation": question.explanation,
            "passage": passage.text,
            "_cacheBreaker": `${Date.now()}_${questions.length + 1}`
          });
        }
      }
      passageIndex++;
    }
    
    return questions;
  }

  getReadingPassages(grade, difficulty) {
    const passages = [
      {
        text: "Climate change is one of the most pressing issues of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Scientists around the world are working to understand these changes and develop solutions to reduce greenhouse gas emissions.",
        questions: [
          {
            content: "What is causing ice caps to melt according to the passage?",
            options: ["Rising global temperatures", "Weather patterns", "Scientists", "Greenhouse gases"],
            correctAnswer: "Rising global temperatures",
            explanation: "The passage states that rising global temperatures are causing ice caps to melt"
          },
          {
            content: "What are scientists working to develop?",
            options: ["Weather patterns", "Solutions to reduce greenhouse gas emissions", "Ice caps", "Sea levels"],
            correctAnswer: "Solutions to reduce greenhouse gas emissions",
            explanation: "The passage mentions scientists are developing solutions to reduce greenhouse gas emissions"
          }
        ]
      },
      {
        text: "The human brain is an incredibly complex organ containing approximately 86 billion neurons. Each neuron can form thousands of connections with other neurons, creating a vast network that enables thought, memory, and consciousness. Researchers continue to discover new aspects of how the brain functions.",
        questions: [
          {
            content: "Approximately how many neurons does the human brain contain?",
            options: ["86 million", "86 billion", "86 thousand", "86 trillion"],
            correctAnswer: "86 billion",
            explanation: "The passage clearly states the brain contains approximately 86 billion neurons"
          },
          {
            content: "What do neuron connections enable according to the passage?",
            options: ["Research", "Discovery", "Thought, memory, and consciousness", "Complexity"],
            correctAnswer: "Thought, memory, and consciousness",
            explanation: "The passage states the network enables thought, memory, and consciousness"
          }
        ]
      }
    ];

    // Add more passages based on grade and difficulty
    if (grade >= 9) {
      passages.push({
        text: "Artificial intelligence has revolutionized many industries, from healthcare to transportation. Machine learning algorithms can now diagnose diseases, predict market trends, and even drive cars autonomously. However, these advances also raise important ethical questions about privacy, job displacement, and the role of human decision-making in an increasingly automated world.",
        questions: [
          {
            content: "According to the passage, what can machine learning algorithms do?",
            options: ["Only drive cars", "Diagnose diseases, predict trends, and drive cars", "Just predict markets", "Only raise questions"],
            correctAnswer: "Diagnose diseases, predict trends, and drive cars",
            explanation: "The passage lists all three capabilities of machine learning algorithms"
          },
          {
            content: "What concerns does AI advancement raise?",
            options: ["Technical issues", "Ethical questions about privacy and jobs", "Cost problems", "Speed limitations"],
            correctAnswer: "Ethical questions about privacy and jobs",
            explanation: "The passage mentions ethical questions about privacy, job displacement, and human decision-making"
          }
        ]
      });
    }

    return passages;
  }

  // Mathematical reasoning generators
  generateMathReasoningQuestions(grade, difficulty, count = 50) {
    const questions = [];
    const generators = this.getMathReasoningGenerators(grade, difficulty);
    
    while (questions.length < count) {
      for (const generator of generators) {
        if (questions.length >= count) break;
        
        const question = generator();
        const questionKey = `${question.content}_${question.correctAnswer}`;
        
        if (!this.usedQuestions.has(questionKey)) {
          this.usedQuestions.add(questionKey);
          questions.push({
            "_id": `mathematical-reasoning_${grade}_${difficulty}_${String(questions.length + 1).padStart(3, '0')}`,
            "content": question.content,
            "type": "multiple_choice",
            "options": question.options,
            "correctAnswer": question.correctAnswer,
            "subject": "mathematical-reasoning",
            "grade": String(grade),
            "difficulty": difficulty,
            "explanation": question.explanation,
            "_cacheBreaker": `${Date.now()}_${questions.length + 1}`
          });
        }
      }
    }
    
    return questions;
  }

  getMathReasoningGenerators(grade, difficulty) {
    const generators = [];
    
    // Pattern recognition
    for (let i = 1; i <= 20; i++) {
      generators.push(() => {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 2;
        const sequence = [start, start + diff, start + 2*diff, start + 3*diff];
        const next = start + 4*diff;
        
        return {
          content: `What comes next in the sequence: ${sequence.join(', ')}, ?`,
          options: [String(next - 2), String(next), String(next + 3), String(next + 5)],
          correctAnswer: String(next),
          explanation: `The sequence increases by ${diff} each time: ${next}`
        };
      });
    }

    // Logic problems
    for (let i = 1; i <= 15; i++) {
      generators.push(() => {
        const numbers = [2, 3, 5, 7, 11, 13, 17, 19, 23];
        const nonPrime = [4, 6, 8, 9, 10, 12, 14, 15, 16];
        const oddOne = nonPrime[Math.floor(Math.random() * nonPrime.length)];
        const primes = numbers.slice(0, 3);
        
        return {
          content: `Which number doesn't belong: ${primes[0]}, ${primes[1]}, ${oddOne}, ${primes[2]}?`,
          options: [String(primes[0]), String(primes[1]), String(oddOne), String(primes[2])],
          correctAnswer: String(oddOne),
          explanation: `${oddOne} is not a prime number, while the others are prime`
        };
      });
    }

    // Word problems
    for (let i = 1; i <= 15; i++) {
      generators.push(() => {
        const rate = Math.floor(Math.random() * 5) + 2;
        const time = Math.floor(Math.random() * 6) + 3;
        const total = rate * time;
        
        return {
          content: `If it takes ${rate} people ${time} hours to complete a job, how many hours would it take ${rate * 2} people?`,
          options: [String(time), String(time / 2), String(time * 2), String(time + 2)],
          correctAnswer: String(time / 2),
          explanation: `With twice as many people, the job takes half the time: ${time / 2} hours`
        };
      });
    }

    return generators;
  }

  // Thinking skills generators
  generateThinkingSkillsQuestions(grade, difficulty, count = 50) {
    const questions = [];
    const generators = this.getThinkingSkillsGenerators(grade, difficulty);
    
    while (questions.length < count) {
      for (const generator of generators) {
        if (questions.length >= count) break;
        
        const question = generator();
        const questionKey = `${question.content}_${question.correctAnswer}`;
        
        if (!this.usedQuestions.has(questionKey)) {
          this.usedQuestions.add(questionKey);
          questions.push({
            "_id": `thinking-skills_${grade}_${difficulty}_${String(questions.length + 1).padStart(3, '0')}`,
            "content": question.content,
            "type": "multiple_choice",
            "options": question.options,
            "correctAnswer": question.correctAnswer,
            "subject": "thinking-skills",
            "grade": String(grade),
            "difficulty": difficulty,
            "explanation": question.explanation,
            "_cacheBreaker": `${Date.now()}_${questions.length + 1}`
          });
        }
      }
    }
    
    return questions;
  }

  getThinkingSkillsGenerators(grade, difficulty) {
    const generators = [];
    
    // Logical reasoning
    for (let i = 1; i <= 20; i++) {
      generators.push(() => {
        const animals = ['cats', 'dogs', 'birds', 'fish'];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        
        return {
          content: `If all ${animal} are animals, and some animals are pets, what can we conclude?`,
          options: [`All ${animal} are pets`, `Some ${animal} are pets`, `No ${animal} are pets`, `Some ${animal} might be pets`],
          correctAnswer: `Some ${animal} might be pets`,
          explanation: `We cannot be certain, but it's possible some ${animal} could be pets`
        };
      });
    }

    // Analogies
    const analogies = [
      { a: 'book', b: 'read', c: 'music', d: 'listen', explanation: 'Books are read, music is listened to' },
      { a: 'pen', b: 'write', c: 'brush', d: 'paint', explanation: 'Pens are used to write, brushes are used to paint' },
      { a: 'car', b: 'drive', c: 'plane', d: 'fly', explanation: 'Cars are driven, planes are flown' }
    ];

    for (let i = 0; i < analogies.length; i++) {
      const analogy = analogies[i];
      generators.push(() => ({
        content: `${analogy.a} is to ${analogy.b} as ${analogy.c} is to ?`,
        options: [analogy.d, 'move', 'use', 'hold'],
        correctAnswer: analogy.d,
        explanation: analogy.explanation
      }));
    }

    // Critical thinking
    for (let i = 1; i <= 15; i++) {
      generators.push(() => {
        const scenarios = [
          { situation: 'All students in the class passed the test', conclusion: 'The test was easy', validity: 'Cannot be determined', explanation: 'Students passing doesn\'t necessarily mean the test was easy' },
          { situation: 'It rained every day this week', conclusion: 'It will rain tomorrow', validity: 'Cannot be determined', explanation: 'Past weather doesn\'t guarantee future weather' }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        return {
          content: `Given: "${scenario.situation}". Conclusion: "${scenario.conclusion}". Is this conclusion valid?`,
          options: ['Yes, definitely', 'No, definitely not', 'Cannot be determined', 'Sometimes true'],
          correctAnswer: scenario.validity,
          explanation: scenario.explanation
        };
      });
    }

    return generators;
  }
}

// Main generation function
function generateAllUniqueGrades6to12() {
  console.log('🚀 Generating UNIQUE questions for Grades 6-12...');
  
  const subjects = ['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'];
  const difficulties = ['easy', 'medium', 'hard'];
  const questionsDir = path.join(__dirname, 'testace-app/frontend/public/questions');
  
  let totalGenerated = 0;

  for (let grade = 6; grade <= 12; grade++) {
    console.log(`\n📚 Generating Grade ${grade} UNIQUE questions...`);
    
    for (const subject of subjects) {
      for (const difficulty of difficulties) {
        const generator = new QuestionGenerator();
        let questions = [];
        
        switch (subject) {
          case 'math':
            questions = generator.generateMathQuestions(grade, difficulty, 50);
            break;
          case 'english':
            questions = generator.generateEnglishQuestions(grade, difficulty, 50);
            break;
          case 'reading':
            questions = generator.generateReadingQuestions(grade, difficulty, 50);
            break;
          case 'mathematical-reasoning':
            questions = generator.generateMathReasoningQuestions(grade, difficulty, 50);
            break;
          case 'thinking-skills':
            questions = generator.generateThinkingSkillsQuestions(grade, difficulty, 50);
            break;
        }
        
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(questionsDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
        console.log(`✅ Generated ${questions.length} UNIQUE questions for Grade ${grade} ${difficulty} ${subject}`);
        totalGenerated += questions.length;
      }
    }
  }
  
  console.log(`\n🎉 SUCCESS! Generated ${totalGenerated} UNIQUE questions total for Grades 6-12`);
  console.log('📁 All files saved to testace-app/frontend/public/questions/');
  console.log(`📊 Total files created: ${7 * 5 * 3} files (7 grades × 5 subjects × 3 difficulties)`);
  console.log('✅ NO DUPLICATE QUESTIONS - Each question is unique!');
}

// Run the generator
generateAllUniqueGrades6to12();
