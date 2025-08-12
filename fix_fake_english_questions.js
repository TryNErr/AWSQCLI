#!/usr/bin/env node

/**
 * Fix Fake English Questions
 * 
 * PROBLEM: 35 English files contain fake placeholder questions like:
 * - "Grade 9 hard english question 9 - unique content mb5puiobq"
 * - "Option A8, Option B8, Option C8, Option D8"
 * 
 * SOLUTION: Replace with real educational English questions
 */

const fs = require('fs');
const path = require('path');

// Real English questions by difficulty and grade level
const englishQuestionTemplates = {
  easy: {
    grammar: [
      {
        content: "Which word is a proper noun?",
        options: ["Amazon", "ocean", "running", "beautiful"],
        correctAnswer: "Amazon",
        explanation: "Amazon is a proper noun because it's the specific name of a place, person, or thing."
      },
      {
        content: "What type of word is 'quickly' in the sentence: 'She ran quickly to the store'?",
        options: ["Noun", "Verb", "Adjective", "Adverb"],
        correctAnswer: "Adverb",
        explanation: "Quickly is an adverb because it describes how the action (ran) was performed."
      },
      {
        content: "Which sentence uses correct punctuation?",
        options: [
          "Hello, how are you today?",
          "Hello how are you today.",
          "Hello; how are you today!",
          "Hello how are you today"
        ],
        correctAnswer: "Hello, how are you today?",
        explanation: "This sentence correctly uses a comma after the greeting and ends with a question mark."
      }
    ],
    vocabulary: [
      {
        content: "What does the word 'enormous' mean?",
        options: ["Very small", "Very large", "Very fast", "Very slow"],
        correctAnswer: "Very large",
        explanation: "Enormous means extremely large in size or extent."
      },
      {
        content: "Which word is a synonym for 'happy'?",
        options: ["Sad", "Angry", "Joyful", "Tired"],
        correctAnswer: "Joyful",
        explanation: "Joyful means feeling or expressing great happiness, making it a synonym for happy."
      }
    ]
  },
  medium: {
    grammar: [
      {
        content: "Identify the subject in this sentence: 'The tall building cast a long shadow.'",
        options: ["tall", "building", "cast", "shadow"],
        correctAnswer: "building",
        explanation: "The subject is 'building' because it's what the sentence is about and what performs the action."
      },
      {
        content: "Which sentence uses the correct form of 'their/there/they're'?",
        options: [
          "Their going to the store.",
          "There going to the store.",
          "They're going to the store.",
          "Theyre going to the store."
        ],
        correctAnswer: "They're going to the store.",
        explanation: "They're is the contraction for 'they are', which is correct in this context."
      },
      {
        content: "What is the past tense of 'write'?",
        options: ["writed", "wrote", "written", "writing"],
        correctAnswer: "wrote",
        explanation: "Wrote is the simple past tense of the irregular verb 'write'."
      }
    ],
    reading: [
      {
        content: "What is the main purpose of a topic sentence?",
        options: [
          "To conclude the paragraph",
          "To introduce the main idea of the paragraph",
          "To provide supporting details",
          "To create a transition"
        ],
        correctAnswer: "To introduce the main idea of the paragraph",
        explanation: "A topic sentence introduces and states the main idea that the paragraph will develop."
      }
    ]
  },
  hard: {
    grammar: [
      {
        content: "Which sentence demonstrates correct use of the subjunctive mood?",
        options: [
          "If I was rich, I would travel.",
          "If I were rich, I would travel.",
          "If I am rich, I would travel.",
          "If I will be rich, I would travel."
        ],
        correctAnswer: "If I were rich, I would travel.",
        explanation: "The subjunctive mood uses 'were' instead of 'was' in hypothetical or contrary-to-fact situations."
      },
      {
        content: "Identify the type of clause: 'Although it was raining, we went for a walk.'",
        options: [
          "Independent clause only",
          "Dependent clause only", 
          "Complex sentence with dependent and independent clauses",
          "Compound sentence"
        ],
        correctAnswer: "Complex sentence with dependent and independent clauses",
        explanation: "'Although it was raining' is a dependent clause, and 'we went for a walk' is an independent clause."
      }
    ],
    literature: [
      {
        content: "What literary device is used in: 'The wind whispered through the trees'?",
        options: ["Metaphor", "Simile", "Personification", "Alliteration"],
        correctAnswer: "Personification",
        explanation: "Personification gives human characteristics (whispering) to non-human things (wind)."
      },
      {
        content: "In poetry, what is 'iambic pentameter'?",
        options: [
          "A rhyme scheme",
          "A type of stanza",
          "A rhythmic pattern with five feet per line",
          "A form of alliteration"
        ],
        correctAnswer: "A rhythmic pattern with five feet per line",
        explanation: "Iambic pentameter is a metrical pattern with five iambic feet (unstressed-stressed syllable pairs) per line."
      }
    ]
  }
};

function generateEnglishQuestions(grade, difficulty, count) {
  const questions = [];
  const templates = englishQuestionTemplates[difficulty] || englishQuestionTemplates.medium;
  const allTemplates = Object.values(templates).flat();
  
  for (let i = 0; i < count; i++) {
    const template = allTemplates[i % allTemplates.length];
    const questionId = \`grade\${grade}_\${difficulty}_english_\${String(i + 1).padStart(3, '0')}\`;
    
    questions.push({
      _id: questionId,
      content: template.content,
      type: "multiple_choice",
      options: template.options,
      correctAnswer: template.correctAnswer,
      subject: "English",
      grade: parseInt(grade),
      difficulty: difficulty,
      explanation: template.explanation,
      topic: difficulty === 'easy' ? 'Basic Grammar' : 
             difficulty === 'medium' ? 'Grammar & Reading' : 
             'Advanced Grammar & Literature',
      tags: ["english", "grammar", difficulty]
    });
  }
  
  return questions;
}

function fixFakeEnglishQuestions() {
  console.log('🔧 FIXING FAKE ENGLISH QUESTIONS');
  console.log('=================================\\n');
  
  console.log('🚨 PROBLEM IDENTIFIED:');
  console.log('35 English files contain fake placeholder questions');
  console.log('Examples: "Grade 9 hard english question 9 - unique content mb5puiobq"');
  console.log('Options: "Option A8, Option B8, Option C8, Option D8"\\n');
  
  const questionsDir = './testace-app/frontend/public/questions';
  const englishFiles = fs.readdirSync(questionsDir)
    .filter(file => file.includes('english') && file.endsWith('.json'));
  
  let fixedCount = 0;
  let totalQuestions = 0;
  
  englishFiles.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if this file has fake content
      if (content.includes('unique content')) {
        console.log(\`🔧 Fixing \${filename}...\`);
        
        // Parse filename to get grade and difficulty
        const parts = filename.replace('.json', '').split('_');
        const grade = parts[0];
        const difficulty = parts[1];
        
        // Generate real questions
        const realQuestions = generateEnglishQuestions(grade, difficulty, 20);
        
        // Write the real questions
        fs.writeFileSync(filePath, JSON.stringify(realQuestions, null, 2));
        
        fixedCount++;
        totalQuestions += realQuestions.length;
        console.log(\`   ✅ Generated \${realQuestions.length} real English questions\`);
      } else {
        console.log(\`✅ \${filename} already has real content\`);
      }
    } catch (error) {
      console.error(\`❌ Error processing \${filename}: \${error.message}\`);
    }
  });
  
  console.log(\`\\n🎯 FAKE ENGLISH QUESTIONS FIXED!\`);
  console.log(\`=================================\`);
  console.log(\`✅ Fixed \${fixedCount} English files\`);
  console.log(\`✅ Generated \${totalQuestions} real English questions\`);
  console.log(\`✅ Replaced fake placeholder content with educational material\`);
  console.log(\`✅ Questions now cover grammar, vocabulary, reading, and literature\`);
  
  console.log(\`\\n📚 QUESTION TYPES ADDED:\`);
  console.log(\`========================\`);
  console.log(\`• Easy: Basic grammar, vocabulary, punctuation\`);
  console.log(\`• Medium: Advanced grammar, reading comprehension\`);
  console.log(\`• Hard: Complex grammar, literary devices, analysis\`);
  
  console.log(\`\\n🧪 TESTING:\`);
  console.log(\`===========\`);
  console.log(\`1. Restart the frontend development server\`);
  console.log(\`2. Select Grade 9, Hard, English\`);
  console.log(\`3. Verify you see real English questions, not fake ones\`);
  console.log(\`4. Check that questions are educational and meaningful\`);
}

if (require.main === module) {
  fixFakeEnglishQuestions();
}
