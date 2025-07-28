import { Question } from '../types';

export function generateLogicalReasoningQuestion(grade: number, difficulty: number): Question {
  const premise = 'All cats have tails. Fluffy is a cat.';
  const options = ['Fluffy has a tail', 'Fluffy has no tail', 'Some cats have no tails', 'Not enough information'];

  return {
    id: `math-logic-${Date.now()}`,
    type: 'logical-reasoning',
    question: `${premise}\nWhat can we conclude?`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Mathematical Reasoning'
  };
}
