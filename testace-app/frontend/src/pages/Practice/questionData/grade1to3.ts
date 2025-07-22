import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 100; // Start from 100 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Questions for grades 1-3
export const grade1to3Questions: Question[] = [
  {
    _id: generateId(),
    content: 'What is 5 + 3?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['7', '8', '9', '6'],
    correctAnswer: '8',
    explanation: 'When we add 5 and 3, we get 8',
    subject: 'Math',
    topic: 'Addition',
    difficulty: DifficultyLevel.EASY,
    tags: ['addition', 'basic math'],
    grade: '1',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is 10 - 4?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['5', '6', '7', '8'],
    correctAnswer: '6',
    explanation: 'When we subtract 4 from 10, we get 6',
    subject: 'Math',
    topic: 'Subtraction',
    difficulty: DifficultyLevel.EASY,
    tags: ['subtraction', 'basic math'],
    grade: '1',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is 2 × 3?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['4', '5', '6', '7'],
    correctAnswer: '6',
    explanation: 'When we multiply 2 by 3, we get 6',
    subject: 'Math',
    topic: 'Multiplication',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['multiplication', 'basic math'],
    grade: '2',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is 8 ÷ 2?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    explanation: 'When we divide 8 by 2, we get 4',
    subject: 'Math',
    topic: 'Division',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['division', 'basic math'],
    grade: '3',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What number comes after 17?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['16', '17', '18', '19'],
    correctAnswer: '18',
    explanation: 'In counting numbers, 18 comes after 17',
    subject: 'Math',
    topic: 'Number Sequence',
    difficulty: DifficultyLevel.EASY,
    tags: ['counting', 'numbers'],
    grade: '1',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
