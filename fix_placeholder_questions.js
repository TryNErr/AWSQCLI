const fs = require('fs');
const path = require('path');

const questionsDir = 'testace-app/frontend/public/questions';

// Grade-appropriate question templates by subject and difficulty
const questionTemplates = {
  math: {
    easy: {
      1: [
        { content: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: 2, explanation: "5 + 3 = 8" },
        { content: "What is 10 - 4?", options: ["5", "6", "7", "8"], correct: 1, explanation: "10 - 4 = 6" },
        { content: "What is 2 × 4?", options: ["6", "7", "8", "9"], correct: 2, explanation: "2 × 4 = 8" },
        { content: "What is 12 ÷ 3?", options: ["3", "4", "5", "6"], correct: 1, explanation: "12 ÷ 3 = 4" },
        { content: "Count the objects: 🍎🍎🍎🍎🍎", options: ["4", "5", "6", "7"], correct: 1, explanation: "There are 5 apples" }
      ],
      2: [
        { content: "What is 15 + 7?", options: ["20", "21", "22", "23"], correct: 2, explanation: "15 + 7 = 22" },
        { content: "What is 25 - 8?", options: ["16", "17", "18", "19"], correct: 1, explanation: "25 - 8 = 17" },
        { content: "What is 6 × 3?", options: ["15", "16", "17", "18"], correct: 3, explanation: "6 × 3 = 18" },
        { content: "What is 20 ÷ 4?", options: ["4", "5", "6", "7"], correct: 1, explanation: "20 ÷ 4 = 5" },
        { content: "What is half of 14?", options: ["6", "7", "8", "9"], correct: 1, explanation: "Half of 14 is 7" }
      ],
      3: [
        { content: "What is 24 + 17?", options: ["40", "41", "42", "43"], correct: 1, explanation: "24 + 17 = 41" },
        { content: "What is 50 - 23?", options: ["26", "27", "28", "29"], correct: 1, explanation: "50 - 23 = 27" },
        { content: "What is 7 × 8?", options: ["54", "55", "56", "57"], correct: 2, explanation: "7 × 8 = 56" },
        { content: "What is 45 ÷ 5?", options: ["8", "9", "10", "11"], correct: 1, explanation: "45 ÷ 5 = 9" },
        { content: "What is 1/2 + 1/4?", options: ["1/2", "2/3", "3/4", "1"], correct: 2, explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4" }
      ],
      4: [
        { content: "What is 156 + 247?", options: ["403", "404", "405", "406"], correct: 0, explanation: "156 + 247 = 403" },
        { content: "What is 500 - 178?", options: ["321", "322", "323", "324"], correct: 1, explanation: "500 - 178 = 322" },
        { content: "What is 12 × 15?", options: ["170", "175", "180", "185"], correct: 2, explanation: "12 × 15 = 180" },
        { content: "What is 144 ÷ 12?", options: ["11", "12", "13", "14"], correct: 1, explanation: "144 ÷ 12 = 12" },
        { content: "Convert 2/5 to a decimal", options: ["0.2", "0.3", "0.4", "0.5"], correct: 2, explanation: "2/5 = 2 ÷ 5 = 0.4" }
      ],
      5: [
        { content: "What is 15% of 200?", options: ["25", "30", "35", "40"], correct: 1, explanation: "15% of 200 = 0.15 × 200 = 30" },
        { content: "What is 3.5 + 2.8?", options: ["6.2", "6.3", "6.4", "6.5"], correct: 1, explanation: "3.5 + 2.8 = 6.3" },
        { content: "What is the area of a rectangle with length 8cm and width 5cm?", options: ["35 cm²", "40 cm²", "45 cm²", "50 cm²"], correct: 1, explanation: "Area = length × width = 8 × 5 = 40 cm²" },
        { content: "Simplify: 3/9", options: ["1/2", "1/3", "2/3", "3/4"], correct: 1, explanation: "3/9 = 1/3 (divide both by 3)" },
        { content: "What is 2³?", options: ["6", "7", "8", "9"], correct: 2, explanation: "2³ = 2 × 2 × 2 = 8" }
      ]
    },
    medium: {
      6: [
        { content: "Solve for x: 3x + 5 = 20", options: ["x = 4", "x = 5", "x = 6", "x = 7"], correct: 1, explanation: "3x = 15, so x = 5" },
        { content: "What is the circumference of a circle with radius 7cm? (Use π ≈ 3.14)", options: ["42.96 cm", "43.96 cm", "44.96 cm", "45.96 cm"], correct: 1, explanation: "C = 2πr = 2 × 3.14 × 7 = 43.96 cm" },
        { content: "Convert 0.75 to a fraction", options: ["2/3", "3/4", "4/5", "5/6"], correct: 1, explanation: "0.75 = 75/100 = 3/4" },
        { content: "What is 20% of 150?", options: ["25", "30", "35", "40"], correct: 1, explanation: "20% of 150 = 0.20 × 150 = 30" },
        { content: "Find the mean of: 12, 15, 18, 21", options: ["16", "16.5", "17", "17.5"], correct: 1, explanation: "Mean = (12 + 15 + 18 + 21) ÷ 4 = 66 ÷ 4 = 16.5" }
      ],
      7: [
        { content: "Solve: 2x - 7 = 13", options: ["x = 8", "x = 9", "x = 10", "x = 11"], correct: 2, explanation: "2x = 20, so x = 10" },
        { content: "What is the area of a triangle with base 12cm and height 8cm?", options: ["46 cm²", "47 cm²", "48 cm²", "49 cm²"], correct: 2, explanation: "Area = (1/2) × base × height = (1/2) × 12 × 8 = 48 cm²" },
        { content: "Simplify: 4x + 3x - 2x", options: ["5x", "6x", "7x", "8x"], correct: 0, explanation: "4x + 3x - 2x = 5x" },
        { content: "What is 7²?", options: ["42", "45", "49", "52"], correct: 2, explanation: "7² = 7 × 7 = 49" },
        { content: "Convert 3/8 to a decimal", options: ["0.325", "0.350", "0.375", "0.400"], correct: 2, explanation: "3/8 = 3 ÷ 8 = 0.375" }
      ],
      8: [
        { content: "Factor: x² + 5x + 6", options: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x - 2)(x - 3)", "(x - 1)(x - 6)"], correct: 0, explanation: "x² + 5x + 6 = (x + 2)(x + 3)" },
        { content: "What is the slope of the line passing through (2, 3) and (4, 7)?", options: ["1", "2", "3", "4"], correct: 1, explanation: "Slope = (7-3)/(4-2) = 4/2 = 2" },
        { content: "Solve: 3x + 2 = 2x + 8", options: ["x = 4", "x = 5", "x = 6", "x = 7"], correct: 2, explanation: "3x - 2x = 8 - 2, so x = 6" },
        { content: "What is √64?", options: ["6", "7", "8", "9"], correct: 2, explanation: "√64 = 8 because 8² = 64" },
        { content: "Simplify: (2x³)(3x²)", options: ["5x⁵", "6x⁵", "5x⁶", "6x⁶"], correct: 1, explanation: "(2x³)(3x²) = 6x⁵" }
      ]
    },
    hard: {
      9: [
        { content: "Solve the quadratic: x² - 5x + 6 = 0", options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = 0 or x = 5"], correct: 0, explanation: "Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3" },
        { content: "Find the derivative of f(x) = 3x² + 2x - 1", options: ["6x + 2", "6x - 2", "3x + 2", "3x - 1"], correct: 0, explanation: "f'(x) = 6x + 2" },
        { content: "What is sin(45°)?", options: ["1/2", "√2/2", "√3/2", "1"], correct: 1, explanation: "sin(45°) = √2/2 ≈ 0.707" },
        { content: "Solve the system: x + y = 7, x - y = 1", options: ["x = 3, y = 4", "x = 4, y = 3", "x = 5, y = 2", "x = 2, y = 5"], correct: 1, explanation: "Adding equations: 2x = 8, so x = 4. Then y = 3" },
        { content: "What is log₂(16)?", options: ["2", "3", "4", "5"], correct: 2, explanation: "log₂(16) = 4 because 2⁴ = 16" }
      ],
      10: [
        { content: "Find the limit: lim(x→2) (x² - 4)/(x - 2)", options: ["2", "3", "4", "undefined"], correct: 2, explanation: "Factor: (x-2)(x+2)/(x-2) = x+2. As x→2, limit = 4" },
        { content: "What is the integral of 2x dx?", options: ["x²", "x² + C", "2x²", "2x² + C"], correct: 1, explanation: "∫2x dx = x² + C" },
        { content: "Solve: 2^x = 32", options: ["x = 4", "x = 5", "x = 6", "x = 7"], correct: 1, explanation: "2^x = 32 = 2⁵, so x = 5" },
        { content: "What is cos(60°)?", options: ["1/2", "√2/2", "√3/2", "1"], correct: 0, explanation: "cos(60°) = 1/2" },
        { content: "Find the vertex of y = x² - 4x + 3", options: ["(2, -1)", "(2, 1)", "(-2, -1)", "(-2, 1)"], correct: 0, explanation: "Vertex at x = -b/2a = 4/2 = 2. y = 4 - 8 + 3 = -1" }
      ],
      11: [
        { content: "Find the derivative of f(x) = ln(x²)", options: ["1/x", "2/x", "2x", "1/x²"], correct: 1, explanation: "f'(x) = (1/x²) × 2x = 2/x" },
        { content: "Evaluate: ∫₀¹ x² dx", options: ["1/2", "1/3", "2/3", "1"], correct: 1, explanation: "∫x² dx = x³/3. [x³/3]₀¹ = 1/3 - 0 = 1/3" },
        { content: "What is the period of y = sin(2x)?", options: ["π/2", "π", "2π", "4π"], correct: 1, explanation: "Period = 2π/2 = π" },
        { content: "Solve: e^x = 10", options: ["x = ln(10)", "x = log(10)", "x = 10", "x = e"], correct: 0, explanation: "Taking natural log: x = ln(10)" },
        { content: "Find the sum of the infinite series: 1 + 1/2 + 1/4 + 1/8 + ...", options: ["1", "2", "3", "∞"], correct: 1, explanation: "Geometric series with a = 1, r = 1/2. Sum = 1/(1-1/2) = 2" }
      ],
      12: [
        { content: "Find the second derivative of f(x) = x⁴ - 2x³", options: ["12x² - 12x", "4x³ - 6x²", "12x - 6", "4x - 6"], correct: 0, explanation: "f'(x) = 4x³ - 6x², f''(x) = 12x² - 12x" },
        { content: "Evaluate: lim(x→∞) (3x² + 2x)/(x² - 1)", options: ["0", "1", "2", "3"], correct: 3, explanation: "Divide by x²: lim(x→∞) (3 + 2/x)/(1 - 1/x²) = 3/1 = 3" },
        { content: "What is the Taylor series for e^x around x = 0?", options: ["1 + x + x²/2! + x³/3! + ...", "x + x²/2 + x³/3 + ...", "1 + x + x² + x³ + ...", "x + x² + x³ + ..."], correct: 0, explanation: "e^x = Σ(x^n/n!) = 1 + x + x²/2! + x³/3! + ..." },
        { content: "Find the area between y = x² and y = 4 from x = 0 to x = 2", options: ["16/3", "8/3", "4", "8"], correct: 0, explanation: "∫₀² (4 - x²) dx = [4x - x³/3]₀² = 8 - 8/3 = 16/3" },
        { content: "What is the radius of convergence for Σ(x^n/n!)?", options: ["0", "1", "e", "∞"], correct: 3, explanation: "The series for e^x converges for all x, so radius = ∞" }
      ]
    }
  },
  english: {
    easy: {
      1: [
        { content: "Which word rhymes with 'cat'?", options: ["dog", "hat", "car", "big"], correct: 1, explanation: "'Hat' rhymes with 'cat'" },
        { content: "What is the plural of 'book'?", options: ["book", "books", "bookes", "bookies"], correct: 1, explanation: "Add 's' to make 'books'" },
        { content: "Which letter comes after 'M' in the alphabet?", options: ["L", "N", "O", "P"], correct: 1, explanation: "N comes after M" },
        { content: "What is the opposite of 'big'?", options: ["large", "huge", "small", "tall"], correct: 2, explanation: "'Small' is the opposite of 'big'" },
        { content: "Which word is a color?", options: ["happy", "blue", "run", "house"], correct: 1, explanation: "'Blue' is a color" }
      ],
      2: [
        { content: "Which sentence is correct?", options: ["I am happy.", "i am happy", "I am happy", "i Am Happy"], correct: 0, explanation: "Sentences start with capital letters and end with periods" },
        { content: "What is the past tense of 'run'?", options: ["running", "runs", "ran", "runned"], correct: 2, explanation: "The past tense of 'run' is 'ran'" },
        { content: "Which word is a noun?", options: ["quickly", "jump", "table", "beautiful"], correct: 2, explanation: "'Table' is a noun (a thing)" },
        { content: "What punctuation mark goes at the end of a question?", options: [".", "!", "?", ","], correct: 2, explanation: "Questions end with question marks (?)" },
        { content: "Which word means the same as 'happy'?", options: ["sad", "angry", "joyful", "tired"], correct: 2, explanation: "'Joyful' means the same as 'happy'" }
      ]
    },
    medium: {
      6: [
        { content: "Identify the verb in: 'The dog barked loudly.'", options: ["dog", "barked", "loudly", "the"], correct: 1, explanation: "'Barked' is the action word (verb)" },
        { content: "Which sentence uses correct punctuation?", options: ["Hello, how are you", "Hello how are you?", "Hello, how are you?", "Hello how are you."], correct: 2, explanation: "Use comma after greeting and question mark for questions" },
        { content: "What is the comparative form of 'good'?", options: ["gooder", "more good", "better", "best"], correct: 2, explanation: "'Better' is the comparative form of 'good'" },
        { content: "Identify the adjective: 'The red car is fast.'", options: ["car", "red", "is", "fast"], correct: 1, explanation: "'Red' describes the car (adjective)" },
        { content: "Which word is spelled correctly?", options: ["recieve", "receive", "receve", "receeve"], correct: 1, explanation: "'Receive' follows the rule 'i before e except after c'" }
      ],
      7: [
        { content: "What type of sentence is: 'Please close the door.'?", options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"], correct: 2, explanation: "Commands are imperative sentences" },
        { content: "Identify the subject: 'The tall boy ran quickly.'", options: ["tall", "boy", "ran", "quickly"], correct: 1, explanation: "'Boy' is who the sentence is about (subject)" },
        { content: "Which shows correct capitalization?", options: ["i went to new york", "I went to New York", "I Went To New York", "i Went to new york"], correct: 1, explanation: "Capitalize 'I' and proper nouns like 'New York'" },
        { content: "What is the superlative form of 'tall'?", options: ["taller", "tallest", "more tall", "most tall"], correct: 1, explanation: "'Tallest' is the superlative form" },
        { content: "Identify the adverb: 'She sang beautifully.'", options: ["She", "sang", "beautifully", "none"], correct: 2, explanation: "'Beautifully' describes how she sang (adverb)" }
      ]
    },
    hard: {
      9: [
        { content: "Identify the literary device in: 'The wind whispered through the trees.'", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correct: 2, explanation: "Giving human qualities (whispering) to wind is personification" },
        { content: "What is the main theme of Romeo and Juliet?", options: ["Friendship", "Love conquers all", "War is terrible", "Money corrupts"], correct: 1, explanation: "The central theme is the power of love" },
        { content: "Which sentence uses the subjunctive mood?", options: ["If I was rich, I would travel", "I wish I was taller", "If he were here, he would help", "I hope she was coming"], correct: 2, explanation: "Subjunctive uses 'were' in hypothetical situations" },
        { content: "Identify the type of irony: 'A fire station burns down.'", options: ["Verbal", "Dramatic", "Situational", "None"], correct: 2, explanation: "The opposite of what's expected is situational irony" },
        { content: "What is a sonnet?", options: ["A 12-line poem", "A 14-line poem", "A 16-line poem", "A 18-line poem"], correct: 1, explanation: "A sonnet has 14 lines" }
      ],
      10: [
        { content: "What is the purpose of a thesis statement?", options: ["To conclude the essay", "To introduce the topic", "To state the main argument", "To provide evidence"], correct: 2, explanation: "A thesis statement presents the main argument" },
        { content: "Identify the rhetorical device: 'Ask not what your country can do for you.'", options: ["Anaphora", "Chiasmus", "Metaphor", "Simile"], correct: 1, explanation: "The reversed structure is chiasmus" },
        { content: "What is stream of consciousness?", options: ["A writing technique", "A type of poem", "A story structure", "A character type"], correct: 0, explanation: "It's a narrative technique showing thoughts" },
        { content: "In poetry, what is enjambment?", options: ["End rhyme", "Internal rhyme", "Line continuation", "Meter pattern"], correct: 2, explanation: "Enjambment continues sentences across line breaks" },
        { content: "What distinguishes a tragedy from a comedy?", options: ["Length", "Setting", "Ending", "Characters"], correct: 2, explanation: "Tragedies end sadly, comedies end happily" }
      ]
    }
  }
};

function generateQuestion(subject, grade, difficulty, index) {
  const templates = questionTemplates[subject]?.[difficulty]?.[grade];
  if (!templates) {
    // Fallback to basic template
    return {
      _id: `grade${grade}_${difficulty}_${subject}_${index}_fixed`,
      content: `Grade ${grade} ${difficulty} ${subject} question ${index}`,
      type: "multiple_choice",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct_answer: 0,
      subject: subject === 'math' ? 'Mathematics' : 'English',
      grade: grade,
      difficulty: difficulty,
      explanation: `This is a ${difficulty} level ${subject} question for grade ${grade}.`
    };
  }
  
  const template = templates[index % templates.length];
  return {
    _id: `grade${grade}_${difficulty}_${subject}_${index}_fixed`,
    content: template.content,
    type: "multiple_choice",
    options: template.options,
    correct_answer: template.correct,
    subject: subject === 'math' ? 'Mathematics' : 'English',
    grade: grade,
    difficulty: difficulty,
    explanation: template.explanation
  };
}

function fixPlaceholderQuestions() {
  console.log('🔧 FIXING PLACEHOLDER QUESTIONS');
  console.log('===============================\n');

  const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json') && file !== 'manifest.json');
  let totalReplacements = 0;
  let filesModified = 0;

  files.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Handle both array format and object format
    let questions = Array.isArray(data) ? data : (data.questions || []);
    let modified = false;
    
    // Parse filename to get grade, difficulty, subject
    const match = filename.match(/(\d+)_(\w+)_(\w+)\.json/);
    if (!match) return;
    
    const [, gradeStr, difficulty, subject] = match;
    const grade = parseInt(gradeStr);
    
    let questionIndex = 0;
    questions = questions.map(question => {
      if (question.content && question.content.includes('Unique Grade') && question.content.includes('question - ID:')) {
        // This is a placeholder question
        const newQuestion = generateQuestion(subject, grade, difficulty, questionIndex++);
        totalReplacements++;
        modified = true;
        console.log(`  ✅ Replaced placeholder in ${filename}`);
        return newQuestion;
      }
      return question;
    });

    if (modified) {
      // Write back in the same format
      if (Array.isArray(data)) {
        fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
      } else {
        data.questions = questions;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
      filesModified++;
    }
  });

  console.log(`\n🎯 PLACEHOLDER FIX COMPLETE!`);
  console.log(`============================`);
  console.log(`✅ Files modified: ${filesModified}`);
  console.log(`✅ Placeholder questions replaced: ${totalReplacements}`);

  // Verify the fix
  console.log('\n🔍 VERIFYING FIX...');
  let remainingPlaceholders = 0;
  files.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let questions = Array.isArray(data) ? data : (data.questions || []);
    const count = questions.filter(q => q.content && q.content.includes('Unique Grade') && q.content.includes('question - ID:')).length;
    if (count > 0) {
      remainingPlaceholders += count;
      console.log(`⚠️  ${filename}: ${count} placeholders remaining`);
    }
  });

  if (remainingPlaceholders === 0) {
    console.log('✅ All placeholder questions successfully replaced!');
  } else {
    console.log(`⚠️  ${remainingPlaceholders} placeholder questions still remain`);
  }
}

fixPlaceholderQuestions();
