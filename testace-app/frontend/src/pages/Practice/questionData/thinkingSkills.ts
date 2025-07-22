import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 600; // Start from 600 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Base thinking skills questions
const baseThinkingSkillsQuestions: Question[] = [
  {
    _id: generateId(),
    content: 'If all cats have tails, and Fluffy is a cat, what can we conclude?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Fluffy has a tail',
      'Some cats have tails',
      'Fluffy might have a tail',
      'All tails belong to cats'
    ],
    correctAnswer: 'Fluffy has a tail',
    explanation: 'This is a logical syllogism. If all cats have tails (major premise) and Fluffy is a cat (minor premise), then Fluffy must have a tail (conclusion).',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'deduction', 'syllogism'],
    grade: '5',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... other base questions
];

// Create grade-specific question arrays
export const grade1ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '1');
export const grade2ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '2');
export const grade3ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '3');
export const grade4ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '4');
export const grade5ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '5');
export const grade6ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '6');
export const grade7ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '7');
export const grade8ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '8');
export const grade9ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '9');
export const grade10ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '10');
export const grade11ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '11');
export const grade12ThinkingSkillsQuestions = baseThinkingSkillsQuestions.filter(q => q.grade === '12');

// Export all thinking skills questions
export const thinkingSkillsQuestions = baseThinkingSkillsQuestions;
