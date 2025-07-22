import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 200; // Start from 200 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Questions for grades 4-6
export const grade4to6Questions: Question[] = [
  {
    _id: generateId(),
    content: 'What is the least common multiple (LCM) of 6 and 8?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['24', '12', '48', '36'],
    correctAnswer: '24',
    explanation: 'List multiples of 6: 6, 12, 18, 24, 30...\nList multiples of 8: 8, 16, 24, 32...\nThe first number that appears in both lists is 24',
    subject: 'Math',
    topic: 'Number Theory',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['lcm', 'multiples', 'factors'],
    grade: '4',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is 3/4 + 1/2?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['5/4', '4/6', '1 1/4', '2/6'],
    correctAnswer: '5/4',
    explanation: 'Convert to equivalent fractions with common denominator: 3/4 = 6/8, 1/2 = 4/8. Then add: 6/8 + 4/8 = 10/8 = 5/4',
    subject: 'Math',
    topic: 'Fractions',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['fractions', 'addition', 'equivalent fractions'],
    grade: '5',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the area of a rectangle with length 7 units and width 5 units?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['35', '24', '12', '30'],
    correctAnswer: '35',
    explanation: 'The area of a rectangle is length × width. So, 7 × 5 = 35 square units',
    subject: 'Math',
    topic: 'Geometry',
    difficulty: DifficultyLevel.EASY,
    tags: ['geometry', 'area', 'rectangles'],
    grade: '4',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is 15% of 80?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['12', '15', '8', '10'],
    correctAnswer: '12',
    explanation: '15% = 15/100. So, 15% of 80 = (15/100) × 80 = 12',
    subject: 'Math',
    topic: 'Percentages',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['percentages', 'multiplication', 'fractions'],
    grade: '6',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the perimeter of a square with side length 6 units?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['24', '36', '12', '18'],
    correctAnswer: '24',
    explanation: 'The perimeter of a square is 4 times the side length. So, 4 × 6 = 24 units',
    subject: 'Math',
    topic: 'Geometry',
    difficulty: DifficultyLevel.EASY,
    tags: ['geometry', 'perimeter', 'squares'],
    grade: '4',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
