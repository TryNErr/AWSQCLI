import { Question } from '../types';

// Grammar question generator
function generateGrammarQuestion(grade: number, difficulty: number): Question {
  const grammarPatterns = [
    { type: 'parts of speech', options: ['noun', 'verb', 'adjective', 'adverb'] },
    { type: 'tenses', options: ['present', 'past', 'future', 'present perfect'] }
  ];

  const pattern = grammarPatterns[Math.floor(Math.random() * grammarPatterns.length)];
  const options = pattern.options;
  
  return {
    id: `english-grammar-${Date.now()}`,
    type: 'grammar',
    question: `Choose the correct ${pattern.type} for the sentence:`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'English'
  };
}

// Vocabulary question generator
function generateVocabularyQuestion(grade: number, difficulty: number): Question {
  const words = [
    { word: 'diligent', meaning: 'hardworking and careful' },
    { word: 'benevolent', meaning: 'kind and generous' }
  ];

  const selected = words[Math.floor(Math.random() * words.length)];
  const options = [selected.meaning, ...words.filter(w => w !== selected).map(w => w.meaning)];

  return {
    id: `english-vocab-${Date.now()}`,
    type: 'vocabulary',
    question: `What is the meaning of '${selected.word}'?`,
    options: options,
    correctAnswer: selected.meaning,
    grade,
    difficulty,
    subject: 'English'
  };
}

// Comprehension question generator
function generateComprehensionQuestion(grade: number, difficulty: number): Question {
  const passage = 'The sun was setting behind the mountains, painting the sky in beautiful shades of orange and purple.';
  const options = ['Evening', 'Morning', 'Noon', 'Midnight'];

  return {
    id: `english-comprehension-${Date.now()}`,
    type: 'comprehension',
    question: 'What time of day is described in the passage?',
    passage,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'English'
  };
}

// Main English questions generator
export function generateEnglishQuestions(count: number, grade: number, difficulty: number): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();

  while (questions.length < count) {
    const questionType = Math.random();
    let newQuestion: Question;
    
    if (questionType < 0.33) {
      newQuestion = generateGrammarQuestion(grade, difficulty);
    } else if (questionType < 0.67) {
      newQuestion = generateVocabularyQuestion(grade, difficulty);
    } else {
      newQuestion = generateComprehensionQuestion(grade, difficulty);
    }
    
    if (!usedQuestions.has(newQuestion.question)) {
      questions.push(newQuestion);
      usedQuestions.add(newQuestion.question);
    }
  }

  return questions;
}
