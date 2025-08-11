#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📚 Generating English Question Files...\n');

// English question templates for different grades and difficulties
const englishQuestionTemplates = {
  easy: [
    {
      content: "Which word is a noun?",
      options: ["run", "happy", "dog", "quickly"],
      correctAnswer: "dog",
      explanation: "A noun is a person, place, or thing. 'Dog' is a thing, making it a noun."
    },
    {
      content: "What is the past tense of 'walk'?",
      options: ["walking", "walked", "walks", "walker"],
      correctAnswer: "walked",
      explanation: "The past tense of 'walk' is 'walked'. We add -ed to regular verbs to form the past tense."
    },
    {
      content: "Which sentence uses correct punctuation?",
      options: ["Hello how are you", "Hello, how are you?", "Hello how are you.", "Hello? how are you"],
      correctAnswer: "Hello, how are you?",
      explanation: "Questions should end with a question mark, and we use a comma after greetings."
    }
  ],
  medium: [
    {
      content: "Which word is an adjective in this sentence: 'The beautiful flower bloomed.'?",
      options: ["The", "beautiful", "flower", "bloomed"],
      correctAnswer: "beautiful",
      explanation: "An adjective describes a noun. 'Beautiful' describes the flower."
    },
    {
      content: "What type of sentence is this: 'Please close the door.'?",
      options: ["Statement", "Question", "Command", "Exclamation"],
      correctAnswer: "Command",
      explanation: "This is a command (imperative sentence) because it tells someone to do something."
    },
    {
      content: "Which word should be capitalized: 'i went to sydney last week'?",
      options: ["went", "sydney", "last", "week"],
      correctAnswer: "sydney",
      explanation: "Sydney is a proper noun (city name) and should always be capitalized."
    }
  ],
  hard: [
    {
      content: "Identify the subordinate clause: 'Although it was raining, we went to the park.'",
      options: ["Although it was raining", "it was raining", "we went to the park", "to the park"],
      correctAnswer: "Although it was raining",
      explanation: "A subordinate clause begins with a subordinating conjunction like 'although' and cannot stand alone."
    },
    {
      content: "What literary device is used in 'The wind whispered through the trees'?",
      options: ["Metaphor", "Simile", "Personification", "Alliteration"],
      correctAnswer: "Personification",
      explanation: "Personification gives human qualities (whispering) to non-human things (wind)."
    },
    {
      content: "Which sentence uses the subjunctive mood correctly?",
      options: ["If I was rich, I would travel.", "If I were rich, I would travel.", "If I am rich, I will travel.", "If I will be rich, I would travel."],
      correctAnswer: "If I were rich, I would travel.",
      explanation: "The subjunctive mood uses 'were' instead of 'was' in hypothetical situations."
    }
  ]
};

// Generate questions for each grade and difficulty
const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const difficulties = ['easy', 'medium', 'hard'];

const questionsDir = path.join(__dirname, 'public/questions');

// Ensure questions directory exists
if (!fs.existsSync(questionsDir)) {
  fs.mkdirSync(questionsDir, { recursive: true });
}

let totalGenerated = 0;

grades.forEach(grade => {
  difficulties.forEach(difficulty => {
    const filename = `${grade}_${difficulty}_english.json`;
    const filepath = path.join(questionsDir, filename);
    
    // Generate 25 questions for this combination
    const questions = [];
    const templates = englishQuestionTemplates[difficulty] || englishQuestionTemplates.medium;
    
    for (let i = 0; i < 25; i++) {
      const template = templates[i % templates.length];
      const question = {
        _id: `eng_${grade}_${difficulty}_${i + 1}`,
        content: template.content,
        type: 'multiple_choice',
        subject: 'English',
        topic: 'Grammar and Language',
        difficulty: difficulty,
        grade: grade,
        options: template.options,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        hints: [`Think about ${difficulty === 'easy' ? 'basic' : difficulty === 'medium' ? 'intermediate' : 'advanced'} English grammar rules.`],
        timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
        tags: ['english', 'grammar', 'language'],
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        isGenerated: true,
        generatedAt: new Date().toISOString(),
        generationMethod: 'english-template-system'
      };
      
      questions.push(question);
    }
    
    // Write to file
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
    console.log(`✅ Generated ${filename}: ${questions.length} questions`);
    totalGenerated += questions.length;
  });
});

// Update manifest file
const manifestPath = path.join(questionsDir, 'manifest.json');
let manifest = {};

if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

// Add English combinations to manifest
grades.forEach(grade => {
  difficulties.forEach(difficulty => {
    const key = `${grade}_${difficulty}_english`;
    manifest.combinations = manifest.combinations || {};
    manifest.combinations[key] = {
      filename: `${key}.json`,
      count: 25,
      generated: new Date().toISOString()
    };
  });
});

manifest.totalCombinations = Object.keys(manifest.combinations).length;
manifest.totalQuestions = Object.values(manifest.combinations).reduce((sum, combo) => sum + combo.count, 0);
manifest.generated = new Date().toISOString();

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n🎉 English Question Generation Complete!`);
console.log(`   - Generated ${totalGenerated} English questions`);
console.log(`   - Updated manifest with ${grades.length * difficulties.length} new combinations`);
console.log(`   - Total combinations in manifest: ${manifest.totalCombinations}`);
console.log(`   - Total questions in manifest: ${manifest.totalQuestions}`);

console.log('\n📋 Available Subjects Now:');
console.log('   1. Math (mathematics, calculations)');
console.log('   2. English (grammar, language) - NEW!');
console.log('   3. Reading (comprehension, passages)');
console.log('   4. Thinking Skills (logic, reasoning)');
console.log('   5. Mathematical Reasoning (advanced math concepts)');

console.log('\n🔄 Next Steps:');
console.log('   1. Restart the development server');
console.log('   2. Go to Enhanced Practice page');
console.log('   3. Select any grade and difficulty');
console.log('   4. Choose from all 5 subject options');
console.log('   5. Verify that each subject shows relevant questions');
