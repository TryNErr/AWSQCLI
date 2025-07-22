import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 400; // Start from 400 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Questions for grades 7-9
export const grade7to9Questions: Question[] = [
  {
    _id: generateId(),
    content: 'Solve for x: 2x + 5 = 13',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: 'Subtract 5 from both sides: 2x = 8\nDivide both sides by 2: x = 4',
    subject: 'Math',
    topic: 'Algebra',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['algebra', 'equations', 'linear equations'],
    grade: '7',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the square root of 144?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['10', '11', '12', '13'],
    correctAnswer: '12',
    explanation: '12 × 12 = 144, so √144 = 12',
    subject: 'Math',
    topic: 'Number Theory',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['square roots', 'perfect squares'],
    grade: '8',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the slope of the line passing through points (2,3) and (4,7)?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['1', '2', '3', '4'],
    correctAnswer: '2',
    explanation: 'Slope = (y₂-y₁)/(x₂-x₁) = (7-3)/(4-2) = 4/2 = 2',
    subject: 'Math',
    topic: 'Coordinate Geometry',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['geometry', 'slope', 'coordinates'],
    grade: '8',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Simplify: (x² + 2x) + (3x² - x)',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['4x² + x', '4x² + 3x', '4x² - x', '4x² + 2x'],
    correctAnswer: '4x² + x',
    explanation: 'Combine like terms: (x² + 3x²) + (2x - x) = 4x² + x',
    subject: 'Math',
    topic: 'Algebra',
    difficulty: DifficultyLevel.HARD,
    tags: ['algebra', 'polynomials', 'like terms'],
    grade: '9',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the area of a triangle with base 8 units and height 6 units?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['24', '48', '12', '36'],
    correctAnswer: '24',
    explanation: 'Area of triangle = (1/2) × base × height = (1/2) × 8 × 6 = 24 square units',
    subject: 'Math',
    topic: 'Geometry',
    difficulty: DifficultyLevel.EASY,
    tags: ['geometry', 'area', 'triangles'],
    grade: '7',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
