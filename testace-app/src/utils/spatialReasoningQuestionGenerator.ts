import { Question } from '../types';

export function generateSpatialReasoningQuestion(grade: number, difficulty: number): Question {
  const options = ['cube', 'sphere', 'cylinder', 'cone'];

  return {
    id: `math-spatial-${Date.now()}`,
    type: 'spatial-reasoning',
    question: 'If you fold this 2D shape, what 3D shape will you get?',
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Mathematical Reasoning'
  };
}
