import { Question } from '../types';

export function generateProblemSolvingQuestion(grade: number, difficulty: number): Question {
  const scenario = 'If it takes 2 painters 4 hours to paint a room,';
  const options = ['2 hours', '8 hours', '1 hour', '6 hours'];

  return {
    id: `thinking-problem-${Date.now()}`,
    type: 'problem-solving',
    question: `${scenario}\nhow long would it take 4 painters to paint the same room?`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Thinking Skills'
  };
}
