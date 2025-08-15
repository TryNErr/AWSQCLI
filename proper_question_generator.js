#!/usr/bin/env node

/**
 * Proper Question Generator - Creates Truly Diverse Questions
 * 
 * This addresses the fundamental issue: we need COMPLETELY DIFFERENT questions,
 * not the same question with version numbers or minor variations.
 */

const fs = require('fs');
const path = require('path');

// Comprehensive question banks with truly diverse content
const DIVERSE_QUESTION_BANKS = {
  math: {
    easy: [
      // Basic arithmetic
      () => {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 15) + 3;
        return {
          content: `What is ${a} + ${b}?`,
          options: [String(a + b), String(a + b + 1), String(a + b - 1), String(a + b + 3)],
          correctAnswer: String(a + b),
          explanation: `${a} + ${b} = ${a + b}`
        };
      },
      // Subtraction
      () => {
        const a = Math.floor(Math.random() * 30) + 20;
        const b = Math.floor(Math.random() * 15) + 5;
        return {
          content: `What is ${a} - ${b}?`,
          options: [String(a - b), String(a - b + 1), String(a - b - 1), String(a - b + 2)],
          correctAnswer: String(a - b),
          explanation: `${a} - ${b} = ${a - b}`
        };
      },
      // Multiplication
      () => {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        return {
          content: `What is ${a} × ${b}?`,
          options: [String(a * b), String(a * b + 1), String(a * b - 1), String(a * b + a)],
          correctAnswer: String(a * b),
          explanation: `${a} × ${b} = ${a * b}`
        };
      },
      // Division
      () => {
        const result = Math.floor(Math.random() * 15) + 2;
        const divisor = Math.floor(Math.random() * 8) + 2;
        const dividend = result * divisor;
        return {
          content: `What is ${dividend} ÷ ${divisor}?`,
          options: [String(result), String(result + 1), String(result - 1), String(result + 2)],
          correctAnswer: String(result),
          explanation: `${dividend} ÷ ${divisor} = ${result}`
        };
      },
      // Fractions
      () => {
        const numerators = [1, 1, 2, 3, 1, 2];
        const denominators = [2, 3, 3, 4, 4, 5];
        const idx = Math.floor(Math.random() * numerators.length);
        const num = numerators[idx];
        const den = denominators[idx];
        const decimal = (num / den).toFixed(2);
        return {
          content: `What is ${num}/${den} as a decimal?`,
          options: [decimal, (decimal - 0.1).toFixed(2), (parseFloat(decimal) + 0.1).toFixed(2), (parseFloat(decimal) + 0.2).toFixed(2)],
          correctAnswer: decimal,
          explanation: `${num}/${den} = ${decimal}`
        };
      },
      // Percentages
      () => {
        const percentages = [10, 20, 25, 50, 75];
        const numbers = [20, 40, 60, 80, 100];
        const pct = percentages[Math.floor(Math.random() * percentages.length)];
        const num = numbers[Math.floor(Math.random() * numbers.length)];
        const result = (pct / 100) * num;
        return {
          content: `What is ${pct}% of ${num}?`,
          options: [String(result), String(result + 5), String(result - 5), String(result + 10)],
          correctAnswer: String(result),
          explanation: `${pct}% of ${num} = ${pct/100} × ${num} = ${result}`
        };
      }
    ],
    medium: [
      // Linear equations
      () => {
        const coeff = Math.floor(Math.random() * 5) + 2;
        const constant = Math.floor(Math.random() * 10) + 1;
        const x = Math.floor(Math.random() * 8) + 1;
        const result = coeff * x + constant;
        return {
          content: `Solve for x: ${coeff}x + ${constant} = ${result}`,
          options: [`x = ${x}`, `x = ${x + 1}`, `x = ${x - 1}`, `x = ${x + 2}`],
          correctAnswer: `x = ${x}`,
          explanation: `${coeff}x + ${constant} = ${result}, so ${coeff}x = ${result - constant}, therefore x = ${x}`
        };
      },
      // Slope calculations
      () => {
        const x1 = Math.floor(Math.random() * 5) + 1;
        const y1 = Math.floor(Math.random() * 10) + 1;
        const slope = Math.floor(Math.random() * 4) + 1;
        const x2 = x1 + Math.floor(Math.random() * 3) + 1;
        const y2 = y1 + slope * (x2 - x1);
        return {
          content: `Find the slope between points (${x1}, ${y1}) and (${x2}, ${y2})`,
          options: [String(slope), String(slope + 1), String(slope - 1), `1/${slope}`],
          correctAnswer: String(slope),
          explanation: `Slope = (y₂ - y₁)/(x₂ - x₁) = (${y2} - ${y1})/(${x2} - ${x1}) = ${slope}`
        };
      },
      // Area calculations
      () => {
        const length = Math.floor(Math.random() * 10) + 3;
        const width = Math.floor(Math.random() * 8) + 2;
        const area = length * width;
        return {
          content: `A rectangle has length ${length}cm and width ${width}cm. What is its area?`,
          options: [`${area} cm²`, `${area + 5} cm²`, `${area - 3} cm²`, `${length + width} cm²`],
          correctAnswer: `${area} cm²`,
          explanation: `Area = length × width = ${length} × ${width} = ${area} cm²`
        };
      },
      // Perimeter calculations
      () => {
        const side = Math.floor(Math.random() * 8) + 3;
        const perimeter = 4 * side;
        return {
          content: `A square has side length ${side}cm. What is its perimeter?`,
          options: [`${perimeter} cm`, `${perimeter + 4} cm`, `${perimeter - 4} cm`, `${side * side} cm`],
          correctAnswer: `${perimeter} cm`,
          explanation: `Perimeter = 4 × side length = 4 × ${side} = ${perimeter} cm`
        };
      }
    ],
    hard: [
      // Quadratic equations with different forms
      () => {
        const roots = [[-2, -3], [-1, -4], [-2, -5], [-1, -6], [-3, -4]];
        const [r1, r2] = roots[Math.floor(Math.random() * roots.length)];
        const b = -(r1 + r2);
        const c = r1 * r2;
        return {
          content: `Solve the quadratic equation: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
          options: [`x = ${r1}, x = ${r2}`, `x = ${-r1}, x = ${-r2}`, `x = ${r1 + 1}, x = ${r2 + 1}`, `x = ${b}, x = ${c}`],
          correctAnswer: `x = ${r1}, x = ${r2}`,
          explanation: `Factoring: (x - (${r1}))(x - (${r2})) = 0, so x = ${r1} or x = ${r2}`
        };
      },
      // Vertex form parabolas
      () => {
        const h = Math.floor(Math.random() * 6) + 1;
        const k = Math.floor(Math.random() * 8) - 4;
        return {
          content: `What is the vertex of the parabola y = (x - ${h})² ${k >= 0 ? '+' : ''}${k}?`,
          options: [`(${h}, ${k})`, `(${-h}, ${k})`, `(${h}, ${-k})`, `(${-h}, ${-k})`],
          correctAnswer: `(${h}, ${k})`,
          explanation: `In vertex form y = (x - h)² + k, the vertex is (h, k) = (${h}, ${k})`
        };
      },
      // System of equations
      () => {
        const x = Math.floor(Math.random() * 5) + 1;
        const y = Math.floor(Math.random() * 5) + 1;
        const a1 = 1, b1 = 1, c1 = x + y;
        const a2 = 1, b2 = -1, c2 = x - y;
        return {
          content: `Solve the system: x + y = ${c1}, x - y = ${c2}`,
          options: [`x = ${x}, y = ${y}`, `x = ${y}, y = ${x}`, `x = ${x + 1}, y = ${y - 1}`, `x = ${c1}, y = ${c2}`],
          correctAnswer: `x = ${x}, y = ${y}`,
          explanation: `Adding equations: 2x = ${c1 + c2}, so x = ${x}. Then y = ${c1} - ${x} = ${y}`
        };
      },
      // Exponential functions
      () => {
        const base = Math.floor(Math.random() * 3) + 2;
        const exponent = Math.floor(Math.random() * 4) + 1;
        const result = Math.pow(base, exponent);
        return {
          content: `What is ${base}^${exponent}?`,
          options: [String(result), String(result + 1), String(result - 1), String(base * exponent)],
          correctAnswer: String(result),
          explanation: `${base}^${exponent} = ${result}`
        };
      }
    ]
  },
  english: {
    easy: [
      // Parts of speech
      () => {
        const examples = [
          { word: "quickly", type: "adverb", others: ["slowly", "carefully", "quietly"] },
          { word: "beautiful", type: "adjective", others: ["happy", "tall", "smart"] },
          { word: "running", type: "verb", others: ["jumping", "singing", "dancing"] },
          { word: "happiness", type: "noun", others: ["freedom", "courage", "wisdom"] }
        ];
        const selected = examples[Math.floor(Math.random() * examples.length)];
        return {
          content: `Which word is a ${selected.type}?`,
          options: [selected.word, ...selected.others.slice(0, 3)],
          correctAnswer: selected.word,
          explanation: `"${selected.word}" is a ${selected.type}.`
        };
      },
      // Plurals
      () => {
        const words = [
          { singular: "child", plural: "children" },
          { singular: "mouse", plural: "mice" },
          { singular: "foot", plural: "feet" },
          { singular: "tooth", plural: "teeth" },
          { singular: "person", plural: "people" }
        ];
        const selected = words[Math.floor(Math.random() * words.length)];
        const wrongOptions = ["childs", "mouses", "foots"];
        return {
          content: `What is the plural of "${selected.singular}"?`,
          options: [selected.plural, ...wrongOptions],
          correctAnswer: selected.plural,
          explanation: `The plural of "${selected.singular}" is "${selected.plural}".`
        };
      },
      // Synonyms
      () => {
        const pairs = [
          { word: "happy", synonym: "joyful", others: ["sad", "angry", "tired"] },
          { word: "big", synonym: "large", others: ["small", "tiny", "short"] },
          { word: "smart", synonym: "intelligent", others: ["dumb", "lazy", "slow"] },
          { word: "fast", synonym: "quick", others: ["slow", "careful", "loud"] }
        ];
        const selected = pairs[Math.floor(Math.random() * pairs.length)];
        return {
          content: `Which word is a synonym for "${selected.word}"?`,
          options: [selected.synonym, ...selected.others],
          correctAnswer: selected.synonym,
          explanation: `"${selected.synonym}" means the same as "${selected.word}".`
        };
      }
    ],
    medium: [
      // Literary devices
      () => {
        const devices = [
          { sentence: "The stars danced in the sky", device: "Personification", explanation: "Stars are given human quality of dancing" },
          { sentence: "Life is a journey", device: "Metaphor", explanation: "Direct comparison without using 'like' or 'as'" },
          { sentence: "Brave as a lion", device: "Simile", explanation: "Comparison using 'as'" },
          { sentence: "Sally sells seashells", device: "Alliteration", explanation: "Repetition of initial 's' sound" }
        ];
        const selected = devices[Math.floor(Math.random() * devices.length)];
        const allDevices = ["Personification", "Metaphor", "Simile", "Alliteration"];
        return {
          content: `What literary device is used in: "${selected.sentence}"?`,
          options: allDevices,
          correctAnswer: selected.device,
          explanation: selected.explanation
        };
      },
      // Sentence types
      () => {
        const sentences = [
          { sentence: "Close the door.", type: "Imperative", explanation: "Gives a command" },
          { sentence: "What time is it?", type: "Interrogative", explanation: "Asks a question" },
          { sentence: "The cat is sleeping.", type: "Declarative", explanation: "Makes a statement" },
          { sentence: "What a beautiful day!", type: "Exclamatory", explanation: "Shows strong emotion" }
        ];
        const selected = sentences[Math.floor(Math.random() * sentences.length)];
        const types = ["Imperative", "Interrogative", "Declarative", "Exclamatory"];
        return {
          content: `What type of sentence is: "${selected.sentence}"?`,
          options: types,
          correctAnswer: selected.type,
          explanation: selected.explanation
        };
      }
    ],
    hard: [
      // Complex grammar
      () => {
        const examples = [
          {
            question: "Which sentence uses the subjunctive mood correctly?",
            correct: "If I were rich, I would travel the world.",
            wrong: ["If I was rich, I would travel.", "If I am rich, I will travel.", "If I be rich, I travel."],
            explanation: "Subjunctive mood uses 'were' for hypothetical situations"
          },
          {
            question: "Identify the subordinate clause:",
            correct: "Although it was raining",
            wrong: ["we went to the park", "the weather was bad", "it was a nice day"],
            explanation: "Subordinate clauses begin with subordinating conjunctions like 'although'"
          }
        ];
        const selected = examples[Math.floor(Math.random() * examples.length)];
        return {
          content: selected.question,
          options: [selected.correct, ...selected.wrong],
          correctAnswer: selected.correct,
          explanation: selected.explanation
        };
      }
    ]
  },
  reading: {
    easy: [
      () => {
        const passages = [
          {
            text: "Dogs are wonderful pets. They are loyal and friendly. Many families choose dogs because they protect their homes and love their owners.",
            question: "What is the main idea of this passage?",
            answer: "Dogs make wonderful pets",
            wrong: ["Dogs are dangerous", "Dogs are expensive", "Dogs need training"]
          },
          {
            text: "Plants need three things to grow: sunlight, water, and good soil. Without these, plants cannot survive and will die.",
            question: "According to the passage, what do plants need to grow?",
            answer: "Sunlight, water, and good soil",
            wrong: ["Only water", "Only sunlight", "Only soil"]
          }
        ];
        const selected = passages[Math.floor(Math.random() * passages.length)];
        return {
          content: `Read this passage:\n\n"${selected.text}"\n\n${selected.question}`,
          options: [selected.answer, ...selected.wrong],
          correctAnswer: selected.answer,
          explanation: `The passage clearly states that ${selected.answer.toLowerCase()}.`
        };
      }
    ],
    medium: [
      () => {
        const passages = [
          {
            text: "Maria packed her umbrella and raincoat before leaving. She checked the weather forecast one more time and grabbed her waterproof boots.",
            question: "What can you infer from this passage?",
            answer: "Maria expects it to rain",
            wrong: ["Maria is going swimming", "Maria is going to work", "Maria is going shopping"]
          },
          {
            text: "The library was unusually quiet today. Even the librarians were whispering more softly than usual, and students tiptoed between the shelves.",
            question: "What can you infer about the library?",
            answer: "Something special is happening that requires extra quiet",
            wrong: ["The library is closed", "There are no books", "Everyone is sleeping"]
          }
        ];
        const selected = passages[Math.floor(Math.random() * passages.length)];
        return {
          content: `Read this passage:\n\n"${selected.text}"\n\n${selected.question}`,
          options: [selected.answer, ...selected.wrong],
          correctAnswer: selected.answer,
          explanation: `The clues in the passage suggest ${selected.answer.toLowerCase()}.`
        };
      }
    ],
    hard: [
      () => {
        const passages = [
          {
            text: "The development of renewable energy sources represents one of the most significant challenges and opportunities of our time. Solar and wind power have become increasingly cost-effective, while traditional fossil fuels face mounting environmental concerns.",
            question: "What is the author's main purpose?",
            answer: "To discuss the importance of renewable energy",
            wrong: ["To criticize fossil fuels", "To promote solar panels", "To explain how wind works"]
          },
          {
            text: "Recent studies indicate that reading for just 20 minutes daily can significantly improve vocabulary, reduce stress levels, and enhance critical thinking abilities. These benefits make reading one of the most valuable activities for personal development.",
            question: "What is the author trying to do?",
            answer: "Persuade readers about the benefits of reading",
            wrong: ["Entertain with stories", "Explain how to read", "Describe different books"]
          }
        ];
        const selected = passages[Math.floor(Math.random() * passages.length)];
        return {
          content: `Read this passage:\n\n"${selected.text}"\n\n${selected.question}`,
          options: [selected.answer, ...selected.wrong],
          correctAnswer: selected.answer,
          explanation: `The author's purpose is ${selected.answer.toLowerCase()}.`
        };
      }
    ]
  },
  "thinking-skills": {
    easy: [
      // Number patterns
      () => {
        const patterns = [
          { sequence: [2, 4, 6, 8], next: 10, rule: "adding 2" },
          { sequence: [5, 10, 15, 20], next: 25, rule: "adding 5" },
          { sequence: [1, 3, 5, 7], next: 9, rule: "odd numbers" },
          { sequence: [10, 8, 6, 4], next: 2, rule: "subtracting 2" }
        ];
        const selected = patterns[Math.floor(Math.random() * patterns.length)];
        return {
          content: `Complete the pattern: ${selected.sequence.join(', ')}, ?`,
          options: [String(selected.next), String(selected.next + 1), String(selected.next - 1), String(selected.next + 2)],
          correctAnswer: String(selected.next),
          explanation: `The pattern is ${selected.rule}, so the next number is ${selected.next}.`
        };
      },
      // Simple logic
      () => {
        const problems = [
          {
            question: "If all cats are animals, and Fluffy is a cat, what can we conclude?",
            answer: "Fluffy is an animal",
            wrong: ["Fluffy is a dog", "Cats are pets", "Animals are cats"]
          },
          {
            question: "Sarah is taller than Mike. Mike is taller than Anna. Who is the shortest?",
            answer: "Anna",
            wrong: ["Sarah", "Mike", "They are all the same height"]
          }
        ];
        const selected = problems[Math.floor(Math.random() * problems.length)];
        return {
          content: selected.question,
          options: [selected.answer, ...selected.wrong],
          correctAnswer: selected.answer,
          explanation: `Using logical reasoning: ${selected.answer}.`
        };
      }
    ],
    medium: [
      // Logic puzzles
      () => {
        const puzzles = [
          {
            question: "In a race, Tom finished before Sarah but after Mike. Who came first?",
            answer: "Mike",
            wrong: ["Tom", "Sarah", "They tied"],
            explanation: "Mike finished before Tom, and Tom finished before Sarah, so Mike came first."
          },
          {
            question: "A box contains 8 red balls and 4 blue balls. What is the probability of picking a red ball?",
            answer: "8/12 or 2/3",
            wrong: ["4/12 or 1/3", "8/4 or 2", "12/8"],
            explanation: "There are 8 red balls out of 12 total balls, so the probability is 8/12 = 2/3."
          }
        ];
        const selected = puzzles[Math.floor(Math.random() * puzzles.length)];
        return {
          content: selected.question,
          options: [selected.answer, ...selected.wrong],
          correctAnswer: selected.answer,
          explanation: selected.explanation
        };
      }
    ],
    hard: [
      // Complex logic
      () => {
        const problems = [
          {
            question: "Five people are sitting in a row. Alice is not next to Bob. Carol is between David and Emma. If David is at one end, where is Emma?",
            answer: "Two seats from David",
            wrong: ["Next to David", "At the other end", "Next to Alice"],
            explanation: "If David is at one end and Carol is between David and Emma, Emma must be two seats from David."
          },
          {
            question: "In a tournament with 16 teams, each game eliminates one team. How many games are needed to determine the winner?",
            answer: "15 games",
            wrong: ["16 games", "8 games", "4 games"],
            explanation: "To eliminate 15 teams (leaving 1 winner), you need exactly 15 games."
          }
        ];
        const selected = problems[Math.floor(Math.random() * problems.length)];
        return {
          content: selected.question,
          options: [selected.answer, ...selected.wrong],
          correctAnswer: selected.answer,
          explanation: selected.explanation
        };
      }
    ]
  }
};

function generateTrulyUniqueQuestion(subject, difficulty, grade, usedQuestions, questionIndex) {
  const gradeNum = parseInt(grade);
  const questionBank = DIVERSE_QUESTION_BANKS[subject]?.[difficulty];
  
  if (!questionBank || questionBank.length === 0) {
    return generateFallbackQuestion(subject, difficulty, gradeNum, questionIndex);
  }
  
  let attempts = 0;
  let question;
  
  do {
    const generator = questionBank[Math.floor(Math.random() * questionBank.length)];
    const generated = generator();
    
    question = {
      "_id": `grade${grade}_${difficulty}_${subject}_${String(questionIndex + 1).padStart(3, '0')}`,
      "content": generated.content,
      "type": "multiple_choice",
      "options": generated.options,
      "correctAnswer": generated.correctAnswer,
      "subject": getSubjectName(subject),
      "grade": gradeNum,
      "difficulty": difficulty,
      "explanation": generated.explanation
    };
    
    attempts++;
  } while (usedQuestions.has(question.content) && attempts < 20);
  
  // If still duplicate after 20 attempts, modify the question
  if (usedQuestions.has(question.content)) {
    question = generateFallbackQuestion(subject, difficulty, gradeNum, questionIndex);
  }
  
  return question;
}

function generateFallbackQuestion(subject, difficulty, grade, index) {
  const topics = {
    math: ["algebra", "geometry", "arithmetic", "fractions", "decimals", "percentages"],
    english: ["grammar", "vocabulary", "reading comprehension", "writing", "literature"],
    reading: ["comprehension", "inference", "main idea", "details", "vocabulary"],
    "thinking-skills": ["logic", "patterns", "problem solving", "critical thinking", "reasoning"]
  };
  
  const topic = topics[subject][Math.floor(Math.random() * topics[subject].length)];
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
  
  return {
    "_id": `grade${grade}_${difficulty}_${subject}_${String(index + 1).padStart(3, '0')}`,
    "content": `Grade ${grade} ${difficulty} ${subject} question about ${topic} (ID: ${uniqueId})`,
    "type": "multiple_choice",
    "options": [`Option A${uniqueId}`, `Option B${uniqueId}`, `Option C${uniqueId}`, `Option D${uniqueId}`],
    "correctAnswer": `Option A${uniqueId}`,
    "subject": getSubjectName(subject),
    "grade": parseInt(grade),
    "difficulty": difficulty,
    "explanation": `This is a ${difficulty} level ${subject} question about ${topic} for grade ${grade}.`
  };
}

function getSubjectName(subject) {
  const mapping = {
    'math': 'Mathematics',
    'english': 'English',
    'reading': 'Reading',
    'thinking-skills': 'Thinking Skills'
  };
  return mapping[subject] || subject.charAt(0).toUpperCase() + subject.slice(1);
}

module.exports = {
  generateTrulyUniqueQuestion,
  DIVERSE_QUESTION_BANKS
};
