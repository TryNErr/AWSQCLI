import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 500; // Start from 500 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Additional questions by difficulty level
export const additionalEasyQuestions: Question[] = [
  // Easy questions - Math
  {
    _id: generateId(),
    content: 'What is 12 + 8?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['18', '19', '20', '21'],
    correctAnswer: '20',
    explanation: '12 + 8 = 20',
    subject: 'Math',
    difficulty: DifficultyLevel.EASY,
    tags: ['addition', 'arithmetic'],
    grade: '3',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const additionalMediumQuestions: Question[] = [
  // Medium questions - Math
  {
    _id: generateId(),
    content: 'What is the value of 3² + 4²?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['25', '49', '16', '9'],
    correctAnswer: '25',
    explanation: '3² = 9 and 4² = 16, so 3² + 4² = 9 + 16 = 25',
    subject: 'Math',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['exponents', 'arithmetic'],
    grade: '6',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const additionalHardQuestions: Question[] = [
  // Hard questions - Math
  {
    _id: generateId(),
    content: 'Solve for x: 2x² - 5x - 3 = 0',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['x = 3 or x = -0.5', 'x = 3 or x = 0.5', 'x = -3 or x = 0.5', 'x = -3 or x = -0.5'],
    correctAnswer: 'x = 3 or x = -0.5',
    explanation: 'Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a where a=2, b=-5, c=-3. This gives x = (5 ± √(25 + 24)) / 4 = (5 ± √49) / 4 = (5 ± 7) / 4, so x = 3 or x = -0.5',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['algebra', 'quadratic equations'],
    grade: '9',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
