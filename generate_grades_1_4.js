#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Grade 1 Questions
const grade1Questions = {
  math: {
    easy: [
      {
        content: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "2 + 3 = 5. Count: 2, 3, 4, 5."
      },
      {
        content: "How many fingers do you have on one hand?",
        options: ["4", "5", "6", "10"],
        correctAnswer: "5",
        explanation: "Each hand has 5 fingers."
      },
      {
        content: "What comes after 7?",
        options: ["6", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "The number sequence is 6, 7, 8, 9..."
      },
      {
        content: "Which is bigger: 3 or 5?",
        options: ["3", "5", "They are the same", "Cannot tell"],
        correctAnswer: "5",
        explanation: "5 is bigger than 3."
      },
      {
        content: "What is 10 - 1?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "10 - 1 = 9. Take away 1 from 10."
      }
    ],
    medium: [
      {
        content: "What is 6 + 4?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "6 + 4 = 10. Count up from 6: 7, 8, 9, 10."
      },
      {
        content: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "A triangle has 3 sides."
      },
      {
        content: "What is 8 - 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "8 - 3 = 5. Count back from 8: 7, 6, 5."
      },
      {
        content: "Which number is missing: 1, 2, _, 4?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "The sequence is 1, 2, 3, 4."
      },
      {
        content: "How many wheels does a bicycle have?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "A bicycle has 2 wheels."
      }
    ],
    hard: [
      {
        content: "What is 7 + 5?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "7 + 5 = 12. Use your fingers or count up."
      },
      {
        content: "What is 15 - 6?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "15 - 6 = 9. Count back 6 from 15."
      },
      {
        content: "How many corners does a square have?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "A square has 4 corners."
      },
      {
        content: "What is half of 10?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "Half of 10 is 5. 10 ÷ 2 = 5."
      },
      {
        content: "If you have 3 apples and get 4 more, how many do you have?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "3 + 4 = 7 apples in total."
      }
    ]
  },
  english: {
    easy: [
      {
        content: "Which letter comes after 'B'?",
        options: ["A", "C", "D", "E"],
        correctAnswer: "C",
        explanation: "The alphabet goes A, B, C, D..."
      },
      {
        content: "What sound does 'C' make in 'Cat'?",
        options: ["S sound", "K sound", "T sound", "A sound"],
        correctAnswer: "K sound",
        explanation: "In 'cat', the letter C makes a 'k' sound."
      },
      {
        content: "How many letters are in the word 'dog'?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "D-O-G has 3 letters."
      },
      {
        content: "Which word rhymes with 'cat'?",
        options: ["dog", "hat", "big", "run"],
        correctAnswer: "hat",
        explanation: "Cat and hat both end with the 'at' sound."
      },
      {
        content: "What is the first letter of your name if your name is 'Sam'?",
        options: ["A", "M", "S", "N"],
        correctAnswer: "S",
        explanation: "Sam starts with the letter S."
      }
    ],
    medium: [
      {
        content: "Which word is a noun?",
        options: ["run", "happy", "book", "quickly"],
        correctAnswer: "book",
        explanation: "A noun is a person, place, or thing. Book is a thing."
      },
      {
        content: "What is the opposite of 'big'?",
        options: ["huge", "small", "tall", "wide"],
        correctAnswer: "small",
        explanation: "Big and small are opposites."
      },
      {
        content: "Which sentence is correct?",
        options: ["I am happy.", "i am happy", "I am happy", "I Am Happy."],
        correctAnswer: "I am happy.",
        explanation: "Sentences start with a capital letter and end with a period."
      },
      {
        content: "How many syllables are in 'elephant'?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "El-e-phant has 3 syllables."
      },
      {
        content: "Which word means the same as 'happy'?",
        options: ["sad", "glad", "angry", "tired"],
        correctAnswer: "glad",
        explanation: "Happy and glad both mean feeling good."
      }
    ],
    hard: [
      {
        content: "Which word is spelled correctly?",
        options: ["frend", "friend", "freind", "frind"],
        correctAnswer: "friend",
        explanation: "The correct spelling is 'friend'."
      },
      {
        content: "What type of word is 'running' in 'The boy is running'?",
        options: ["noun", "verb", "adjective", "adverb"],
        correctAnswer: "verb",
        explanation: "Running is an action word, which is a verb."
      },
      {
        content: "Which sentence uses correct punctuation?",
        options: ["What is your name", "What is your name.", "What is your name?", "what is your name?"],
        correctAnswer: "What is your name?",
        explanation: "Questions end with a question mark and start with a capital letter."
      },
      {
        content: "What is the plural of 'mouse'?",
        options: ["mouses", "mice", "mouse", "mousies"],
        correctAnswer: "mice",
        explanation: "The plural of mouse is mice."
      },
      {
        content: "Which word has a silent letter?",
        options: ["cat", "dog", "knee", "sun"],
        correctAnswer: "knee",
        explanation: "In 'knee', the 'k' is silent."
      }
    ]
  }
};

// Generate questions for all grades and subjects
function generateAllGrades() {
  console.log('🚀 Generating questions for Grades 1-4...');
  
  const subjects = ['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'];
  const difficulties = ['easy', 'medium', 'hard'];
  const questionsDir = path.join(__dirname, 'testace-app/frontend/public/questions');
  
  let totalGenerated = 0;

  for (let grade = 1; grade <= 4; grade++) {
    console.log(`\n📚 Generating Grade ${grade} questions...`);
    
    for (const subject of subjects) {
      for (const difficulty of difficulties) {
        const questions = generateQuestionsForGradeSubjectDifficulty(grade, subject, difficulty);
        
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(questionsDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
        console.log(`✅ Generated ${questions.length} questions for Grade ${grade} ${difficulty} ${subject}`);
        totalGenerated += questions.length;
      }
    }
  }
  
  console.log(`\n🎉 Complete! Generated ${totalGenerated} questions total for Grades 1-4`);
  console.log('📁 All files saved to testace-app/frontend/public/questions/');
}

function generateQuestionsForGradeSubjectDifficulty(grade, subject, difficulty) {
  const questions = [];
  
  // Get base questions based on grade and subject
  let baseQuestions = getBaseQuestions(grade, subject, difficulty);
  
  // Generate 50 questions by cycling through base questions
  for (let i = 0; i < 50; i++) {
    const questionIndex = i % baseQuestions.length;
    const baseQuestion = baseQuestions[questionIndex];
    
    questions.push({
      "_id": `${subject}_${grade}_${difficulty}_${String(i + 1).padStart(3, '0')}`,
      "content": baseQuestion.content,
      "type": "multiple_choice",
      "options": baseQuestion.options,
      "correctAnswer": baseQuestion.correctAnswer,
      "subject": subject,
      "grade": String(grade),
      "difficulty": difficulty,
      "explanation": baseQuestion.explanation,
      "_cacheBreaker": `${Date.now()}_${i + 1}`,
      ...(baseQuestion.passage && { "passage": baseQuestion.passage })
    });
  }
  
  return questions;
}

function getBaseQuestions(grade, subject, difficulty) {
  // Math questions by grade and difficulty
  const mathQuestions = {
    1: {
      easy: [
        { content: "What is 1 + 1?", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "1 + 1 = 2" },
        { content: "What is 3 + 2?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "3 + 2 = 5" },
        { content: "How many dots are there: • • •", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "Count the dots: 1, 2, 3" },
        { content: "What is 5 - 1?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "5 - 1 = 4" },
        { content: "Which number is bigger: 2 or 4?", options: ["2", "4", "Same", "Can't tell"], correctAnswer: "4", explanation: "4 is bigger than 2" }
      ],
      medium: [
        { content: "What is 4 + 3?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "4 + 3 = 7" },
        { content: "What is 6 - 2?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "6 - 2 = 4" },
        { content: "How many sides does a circle have?", options: ["0", "1", "2", "3"], correctAnswer: "0", explanation: "A circle has no straight sides" },
        { content: "What comes next: 2, 4, 6, ?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "The pattern adds 2 each time" },
        { content: "How many legs does a dog have?", options: ["2", "3", "4", "5"], correctAnswer: "4", explanation: "Dogs have 4 legs" }
      ],
      hard: [
        { content: "What is 5 + 4?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "5 + 4 = 9" },
        { content: "What is 10 - 3?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "10 - 3 = 7" },
        { content: "If you have 2 toys and get 3 more, how many toys do you have?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "2 + 3 = 5 toys" },
        { content: "What is double 3?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "Double 3 means 3 + 3 = 6" },
        { content: "How many minutes are in 1 hour?", options: ["50", "60", "70", "80"], correctAnswer: "60", explanation: "There are 60 minutes in 1 hour" }
      ]
    },
    2: {
      easy: [
        { content: "What is 6 + 3?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "6 + 3 = 9" },
        { content: "What is 8 - 2?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "8 - 2 = 6" },
        { content: "How many days are in a week?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "A week has 7 days" },
        { content: "What is 2 × 3?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "2 × 3 = 6" },
        { content: "Which is an even number?", options: ["3", "5", "7", "8"], correctAnswer: "8", explanation: "8 is even because it can be divided by 2" }
      ],
      medium: [
        { content: "What is 12 + 5?", options: ["16", "17", "18", "19"], correctAnswer: "17", explanation: "12 + 5 = 17" },
        { content: "What is 15 - 7?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "15 - 7 = 8" },
        { content: "How many cents are in a quarter?", options: ["20", "25", "30", "35"], correctAnswer: "25", explanation: "A quarter is worth 25 cents" },
        { content: "What is 4 × 2?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "4 × 2 = 8" },
        { content: "What time is shown: 3:00?", options: ["2 o'clock", "3 o'clock", "4 o'clock", "5 o'clock"], correctAnswer: "3 o'clock", explanation: "3:00 means 3 o'clock" }
      ],
      hard: [
        { content: "What is 18 + 14?", options: ["30", "31", "32", "33"], correctAnswer: "32", explanation: "18 + 14 = 32" },
        { content: "What is 25 - 9?", options: ["15", "16", "17", "18"], correctAnswer: "16", explanation: "25 - 9 = 16" },
        { content: "How many inches are in a foot?", options: ["10", "11", "12", "13"], correctAnswer: "12", explanation: "There are 12 inches in 1 foot" },
        { content: "What is 6 × 3?", options: ["17", "18", "19", "20"], correctAnswer: "18", explanation: "6 × 3 = 18" },
        { content: "What is 20 ÷ 4?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "20 ÷ 4 = 5" }
      ]
    }
  };

  // Add more grades and subjects...
  if (grade <= 2 && subject === 'math' && mathQuestions[grade] && mathQuestions[grade][difficulty]) {
    return mathQuestions[grade][difficulty];
  }

  // Default questions for other combinations
  return getDefaultQuestions(grade, subject, difficulty);
}

function getDefaultQuestions(grade, subject, difficulty) {
  const defaultSets = {
    math: [
      { content: `What is ${grade + 1} + ${grade}?`, options: [`${grade}`, `${grade + 1}`, `${2 * grade + 1}`, `${2 * grade + 2}`], correctAnswer: `${2 * grade + 1}`, explanation: `${grade + 1} + ${grade} = ${2 * grade + 1}` },
      { content: `What is ${grade + 5} - ${grade}?`, options: [`${grade - 1}`, `5`, `${grade + 1}`, `10`], correctAnswer: "5", explanation: `${grade + 5} - ${grade} = 5` },
      { content: `How many sides does a rectangle have?`, options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "A rectangle has 4 sides" },
      { content: `What is ${grade} × 2?`, options: [`${grade}`, `${grade * 2}`, `${grade * 2 + 1}`, `${grade * 3}`], correctAnswer: `${grade * 2}`, explanation: `${grade} × 2 = ${grade * 2}` },
      { content: `Which number comes after ${grade + 10}?`, options: [`${grade + 9}`, `${grade + 10}`, `${grade + 11}`, `${grade + 12}`], correctAnswer: `${grade + 11}`, explanation: `After ${grade + 10} comes ${grade + 11}` }
    ],
    english: [
      { content: "Which word is a noun?", options: ["run", "happy", "table", "quickly"], correctAnswer: "table", explanation: "A noun names a person, place, or thing. Table is a thing." },
      { content: "What is the opposite of 'hot'?", options: ["warm", "cold", "cool", "freezing"], correctAnswer: "cold", explanation: "Hot and cold are opposites." },
      { content: "Which sentence is correct?", options: ["i like dogs", "I like dogs.", "I Like Dogs", "i like dogs."], correctAnswer: "I like dogs.", explanation: "Sentences start with capital letters and end with periods." },
      { content: "How many vowels are in 'apple'?", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "Apple has vowels 'a' and 'e'." },
      { content: "Which word rhymes with 'tree'?", options: ["car", "bee", "dog", "sun"], correctAnswer: "bee", explanation: "Tree and bee both end with the 'ee' sound." }
    ],
    reading: [
      { 
        passage: "Tom has a red ball. He likes to play with his ball in the park. The ball bounces high when Tom throws it.",
        content: "What color is Tom's ball?", 
        options: ["blue", "red", "green", "yellow"], 
        correctAnswer: "red", 
        explanation: "The passage says Tom has a red ball." 
      },
      { 
        passage: "Sara loves to read books. She goes to the library every week. Her favorite books are about animals.",
        content: "How often does Sara go to the library?", 
        options: ["every day", "every week", "every month", "every year"], 
        correctAnswer: "every week", 
        explanation: "The passage says Sara goes to the library every week." 
      },
      { 
        passage: "The sun is bright today. Birds are singing in the trees. Children are playing outside.",
        content: "What are the birds doing?", 
        options: ["flying", "singing", "sleeping", "eating"], 
        correctAnswer: "singing", 
        explanation: "The passage says birds are singing in the trees." 
      },
      { 
        passage: "Mom made cookies for the class party. She made chocolate chip and sugar cookies. Everyone loved them.",
        content: "What kinds of cookies did Mom make?", 
        options: ["only chocolate chip", "only sugar", "chocolate chip and sugar", "oatmeal and sugar"], 
        correctAnswer: "chocolate chip and sugar", 
        explanation: "The passage mentions both chocolate chip and sugar cookies." 
      },
      { 
        passage: "The cat sat on the mat. It was a fluffy orange cat. The cat was taking a nap in the warm sun.",
        content: "Where was the cat sitting?", 
        options: ["on a chair", "on the mat", "on the bed", "on the floor"], 
        correctAnswer: "on the mat", 
        explanation: "The passage says the cat sat on the mat." 
      }
    ],
    "mathematical-reasoning": [
      { content: "If you have 3 red balls and 2 blue balls, how many balls do you have in total?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "3 + 2 = 5 balls total" },
      { content: "What comes next in the pattern: 1, 3, 5, ?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "The pattern adds 2 each time: 1, 3, 5, 7" },
      { content: "If a box has 10 toys and you take out 3, how many are left?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "10 - 3 = 7 toys left" },
      { content: "Which shape has the most sides?", options: ["triangle", "square", "pentagon", "circle"], correctAnswer: "pentagon", explanation: "A pentagon has 5 sides, more than triangle (3) or square (4)" },
      { content: "If you buy 2 apples for 10 cents each, how much do you spend?", options: ["15 cents", "20 cents", "25 cents", "30 cents"], correctAnswer: "20 cents", explanation: "2 × 10 cents = 20 cents" }
    ],
    "thinking-skills": [
      { content: "Which one doesn't belong: cat, dog, bird, car?", options: ["cat", "dog", "bird", "car"], correctAnswer: "car", explanation: "Cat, dog, and bird are animals. Car is not an animal." },
      { content: "If all flowers are pretty and roses are flowers, then roses are:", options: ["red", "pretty", "big", "small"], correctAnswer: "pretty", explanation: "Since all flowers are pretty and roses are flowers, roses must be pretty." },
      { content: "What comes next: A, B, C, ?", options: ["B", "C", "D", "E"], correctAnswer: "D", explanation: "The alphabet continues: A, B, C, D" },
      { content: "Which is the odd one out: 2, 4, 6, 7?", options: ["2", "4", "6", "7"], correctAnswer: "7", explanation: "2, 4, and 6 are even numbers. 7 is odd." },
      { content: "If you turn a square 90 degrees, what shape do you get?", options: ["triangle", "circle", "square", "rectangle"], correctAnswer: "square", explanation: "A square looks the same when rotated 90 degrees." }
    ]
  };

  return defaultSets[subject] || defaultSets.math;
}

// Run the generator
generateAllGrades();
