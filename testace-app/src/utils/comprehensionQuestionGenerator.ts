import { Question } from '../types';

export function generateComprehensionQuestion(grade: number, difficulty: number): Question {
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
