const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Grade 1 appropriate English questions
const grade1EnglishQuestions = {
  easy: [
    {
      content: "Which letter comes after 'B'?",
      options: ["A", "C", "D", "E"],
      correctAnswer: "C",
      explanation: "The alphabet goes A, B, C, D, E..."
    },
    {
      content: "What sound does the letter 'M' make?",
      options: ["mmm", "nnn", "sss", "zzz"],
      correctAnswer: "mmm",
      explanation: "The letter 'M' makes the 'mmm' sound."
    },
    {
      content: "Which word rhymes with 'cat'?",
      options: ["dog", "hat", "car", "big"],
      correctAnswer: "hat",
      explanation: "Cat and hat both end with the 'at' sound."
    },
    {
      content: "How many letters are in the word 'dog'?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
      explanation: "The word 'dog' has 3 letters: d-o-g."
    },
    {
      content: "Which letter comes first in the alphabet?",
      options: ["B", "A", "C", "D"],
      correctAnswer: "A",
      explanation: "A is the first letter of the alphabet."
    },
    {
      content: "What is the first sound in the word 'sun'?",
      options: ["s", "u", "n", "t"],
      correctAnswer: "s",
      explanation: "The word 'sun' starts with the 's' sound."
    },
    {
      content: "Which word starts with the letter 'B'?",
      options: ["apple", "ball", "cat", "dog"],
      correctAnswer: "ball",
      explanation: "Ball starts with the letter 'B'."
    },
    {
      content: "How many words are in this sentence: 'I like cats'?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
      explanation: "The sentence has 3 words: I, like, cats."
    },
    {
      content: "Which letter makes the 'ssss' sound?",
      options: ["M", "S", "T", "P"],
      correctAnswer: "S",
      explanation: "The letter 'S' makes the 'ssss' sound."
    },
    {
      content: "What comes at the end of a sentence?",
      options: ["comma", "period", "question", "letter"],
      correctAnswer: "period",
      explanation: "A period (.) comes at the end of a sentence."
    }
  ],
  medium: [
    {
      content: "Which word has the long 'a' sound?",
      options: ["cat", "cake", "cap", "can"],
      correctAnswer: "cake",
      explanation: "Cake has the long 'a' sound (ay), while the others have short 'a'."
    },
    {
      content: "What type of letter is 'A'?",
      options: ["consonant", "vowel", "number", "symbol"],
      correctAnswer: "vowel",
      explanation: "A, E, I, O, U are vowels. All other letters are consonants."
    },
    {
      content: "Which word is a noun?",
      options: ["run", "jump", "book", "happy"],
      correctAnswer: "book",
      explanation: "A noun is a person, place, or thing. Book is a thing."
    },
    {
      content: "What do we call words that sound the same?",
      options: ["rhyming words", "big words", "small words", "funny words"],
      correctAnswer: "rhyming words",
      explanation: "Words that sound the same, like 'cat' and 'hat', are rhyming words."
    },
    {
      content: "Which sentence starts with a capital letter?",
      options: ["the dog runs.", "The dog runs.", "THE DOG RUNS.", "the Dog runs."],
      correctAnswer: "The dog runs.",
      explanation: "Sentences should start with a capital letter."
    },
    {
      content: "What sound do the letters 'th' make together?",
      options: ["t-h", "th", "s", "f"],
      correctAnswer: "th",
      explanation: "The letters 't' and 'h' together make the 'th' sound."
    },
    {
      content: "Which word has two syllables?",
      options: ["cat", "dog", "happy", "run"],
      correctAnswer: "happy",
      explanation: "Happy has two parts: hap-py. That means it has two syllables."
    },
    {
      content: "What do we call the small letters?",
      options: ["big letters", "lowercase letters", "uppercase letters", "number letters"],
      correctAnswer: "lowercase letters",
      explanation: "Small letters like 'a', 'b', 'c' are called lowercase letters."
    },
    {
      content: "Which word means the opposite of 'big'?",
      options: ["huge", "large", "small", "tall"],
      correctAnswer: "small",
      explanation: "Small is the opposite of big."
    },
    {
      content: "What comes at the end of a question?",
      options: ["period", "question mark", "comma", "exclamation mark"],
      correctAnswer: "question mark",
      explanation: "Questions end with a question mark (?)."
    }
  ]
};

function fixGrade1EnglishFile(filename, difficulty) {
  const filePath = path.join(questionsDir, filename);
  
  console.log(`📝 Fixing ${filename}...`);
  
  const baseQuestions = grade1EnglishQuestions[difficulty];
  const newQuestions = [];
  
  // Generate 20 questions by cycling through the base questions
  for (let i = 0; i < 20; i++) {
    const baseQuestion = baseQuestions[i % baseQuestions.length];
    
    const questionObj = {
      "_id": `english_1_${difficulty}_${Date.now()}_${i + 1}`,
      "content": baseQuestion.content,
      "type": "multiple_choice",
      "options": baseQuestion.options,
      "correctAnswer": baseQuestion.correctAnswer,
      "subject": "english",
      "grade": 1,
      "difficulty": difficulty,
      "explanation": baseQuestion.explanation,
      "_cacheBreaker": `${Date.now()}_${i}`
    };
    
    newQuestions.push(questionObj);
  }
  
  // Write the fixed questions
  try {
    fs.writeFileSync(filePath, JSON.stringify(newQuestions, null, 2));
    console.log(`   ✅ Fixed ${filename} with ${newQuestions.length} authentic Grade 1 questions`);
    return true;
  } catch (error) {
    console.log(`   ❌ Error writing ${filename}: ${error.message}`);
    return false;
  }
}

console.log('🔧 Fixing Grade 1 English questions...\n');

let fixedCount = 0;

// Fix the two problematic files
if (fixGrade1EnglishFile('1_easy_english.json', 'easy')) {
  fixedCount++;
}

if (fixGrade1EnglishFile('1_medium_english.json', 'medium')) {
  fixedCount++;
}

console.log(`\n🎉 COMPLETED: Fixed ${fixedCount}/2 Grade 1 English files!`);
console.log('📊 All easy and medium difficulty questions are now authentic!');
