import { Question } from '../types';

export function generateNumberPatternQuestion(grade: number, difficulty: number): Question {
  const patterns = [
    { sequence: [2, 4, 6, 8], next: 10, rule: 'Add 2' },
    { sequence: [1, 3, 6, 10], next: 15, rule: 'Add increasing numbers' }
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const options = [
    pattern.next.toString(),
    (pattern.next + 2).toString(),
    (pattern.next - 2).toString(),
    (pattern.next * 2).toString()
  ];

  return {
    id: `math-pattern-${Date.now()}`,
    type: 'number-pattern',
    question: `What comes next in the sequence: ${pattern.sequence.join(', ')}, ?`,
    options: options,
    correctAnswer: pattern.next.toString(),
    grade,
    difficulty,
    subject: 'Mathematical Reasoning'
  };
}
