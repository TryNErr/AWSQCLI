import { DifficultyLevel, QuestionType, Question } from '../../../types';
import { 
  enhancedThinkingSkillsQuestions,
  grade1EnhancedThinkingSkills,
  grade2EnhancedThinkingSkills,
  grade3EnhancedThinkingSkills,
  grade4EnhancedThinkingSkills,
  grade5EnhancedThinkingSkills,
  grade6EnhancedThinkingSkills,
  grade7EnhancedThinkingSkills,
  grade8EnhancedThinkingSkills,
  grade9EnhancedThinkingSkills,
  grade10EnhancedThinkingSkills,
  grade11EnhancedThinkingSkills,
  grade12EnhancedThinkingSkills
} from './enhancedThinkingSkills';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 600; // Start from 600 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Legacy base thinking skills questions (kept for compatibility)
const legacyThinkingSkillsQuestions: Question[] = [
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
  {
    _id: generateId(),
    content: 'Look at this pattern: Circle, Square, Triangle, Circle, Square, ?\n\nWhat shape comes next?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Triangle', 'Circle', 'Square', 'Diamond'],
    correctAnswer: 'Triangle',
    explanation: 'The pattern repeats every 3 shapes: Circle, Square, Triangle. After Square comes Triangle.',
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty: DifficultyLevel.EASY,
    tags: ['pattern', 'sequence', 'shapes'],
    grade: '3',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'If it takes 2 people 4 hours to paint a fence, how long would it take 4 people to paint the same fence?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['2 hours', '4 hours', '8 hours', '1 hour'],
    correctAnswer: '2 hours',
    explanation: 'With twice as many people (4 instead of 2), the job takes half the time (2 hours instead of 4).',
    subject: 'Thinking Skills',
    topic: 'Problem Solving',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['problem-solving', 'proportions', 'work-rate'],
    grade: '6',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Combine legacy and enhanced questions for comprehensive coverage
const baseThinkingSkillsQuestions: Question[] = [
  ...legacyThinkingSkillsQuestions,
  ...enhancedThinkingSkillsQuestions
];

// Create grade-specific question arrays combining both legacy and enhanced
export const grade1ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '1'),
  ...grade1EnhancedThinkingSkills
];

export const grade2ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '2'),
  ...grade2EnhancedThinkingSkills
];

export const grade3ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '3'),
  ...grade3EnhancedThinkingSkills
];

export const grade4ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '4'),
  ...grade4EnhancedThinkingSkills
];

export const grade5ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '5'),
  ...grade5EnhancedThinkingSkills
];

export const grade6ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '6'),
  ...grade6EnhancedThinkingSkills
];

export const grade7ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '7'),
  ...grade7EnhancedThinkingSkills
];

export const grade8ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '8'),
  ...grade8EnhancedThinkingSkills
];

export const grade9ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '9'),
  ...grade9EnhancedThinkingSkills
];

export const grade10ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '10'),
  ...grade10EnhancedThinkingSkills
];

export const grade11ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '11'),
  ...grade11EnhancedThinkingSkills
];

export const grade12ThinkingSkillsQuestions = [
  ...baseThinkingSkillsQuestions.filter(q => q.grade === '12'),
  ...grade12EnhancedThinkingSkills
];

// Export all thinking skills questions
export const thinkingSkillsQuestions = baseThinkingSkillsQuestions;
