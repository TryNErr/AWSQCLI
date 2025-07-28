import { Question } from '../types';

export function generateGrammarQuestion(grade: number, difficulty: number): Question {
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
