import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 300; // Start from 300 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Questions for grades 10-12
export const grade10to12Questions: Question[] = [
  {
    _id: generateId(),
    content: 'What is the derivative of f(x) = x³ + 2x² - 4x + 1?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['3x² + 4x - 4', '3x² + 2x - 4', '3x² + 4x - 1', '3x² + 4'],
    correctAnswer: '3x² + 4x - 4',
    explanation: 'Using the power rule and constant rule: f\'(x) = 3x² + 4x - 4',
    subject: 'Math',
    topic: 'Calculus',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'derivatives', 'polynomials'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Solve the complex equation: z² + 4z + 13 = 0',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'z = -2 ± 3i',
      'z = -2 ± 2i',
      'z = -2 ± √13i',
      'z = 2 ± 3i'
    ],
    correctAnswer: 'z = -2 ± 3i',
    explanation: 'Using the quadratic formula: z = (-b ± √(b² - 4ac))/2a where a=1, b=4, c=13. This gives z = (-4 ± √(16 - 52))/2 = (-4 ± √-36)/2 = -2 ± 3i',
    subject: 'Math',
    topic: 'Complex Numbers',
    difficulty: DifficultyLevel.HARD,
    tags: ['complex numbers', 'quadratic equations', 'algebra'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Find the limit: lim(x→∞) (x² + 2x)/(x² + 1)',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['0', '1', '2', '∞'],
    correctAnswer: '1',
    explanation: 'Divide numerator and denominator by highest power (x²). This gives lim(x→∞) (1 + 2/x)/(1 + 1/x²) = 1',
    subject: 'Math',
    topic: 'Limits',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'limits', 'rational functions'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the volume of a cone with radius 3 units and height 4 units?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['12π', '36π', '12', '36'],
    correctAnswer: '12π',
    explanation: 'The volume of a cone is V = (1/3)πr²h. Here, r=3 and h=4, so V = (1/3)π(3)²(4) = (1/3)π(9)(4) = 12π cubic units',
    subject: 'Math',
    topic: 'Geometry',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['geometry', 'volume', '3D shapes'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the probability of getting exactly 2 heads in 5 coin flips?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['5/16', '10/32', '0.3125', '0.4'],
    correctAnswer: '10/32',
    explanation: 'Using the binomial probability formula: C(5,2) * (1/2)² * (1/2)³ = 10 * (1/4) * (1/8) = 10/32',
    subject: 'Math',
    topic: 'Probability',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['probability', 'binomial', 'combinations'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
