import { Question } from '../types';

export function generatePatternQuestion(grade: number, difficulty: number): Question {
  const pattern = 'RED, BLUE, GREEN, RED, BLUE, GREEN';
  const options = ['RED', 'BLUE', 'GREEN', 'YELLOW'];

  return {
    id: `thinking-pattern-${Date.now()}`,
    type: 'pattern',
    question: `${pattern}\nWhat comes next in the pattern?`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Thinking Skills'
  };
}
