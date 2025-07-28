import { Question } from '../types';

export function generateVocabularyQuestion(grade: number, difficulty: number): Question {
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
