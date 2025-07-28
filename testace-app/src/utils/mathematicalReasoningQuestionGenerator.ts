import { Question } from '../types';

// Number pattern question generator
function generateNumberPatternQuestion(grade: number, difficulty: number): Question {
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

// Logical reasoning question generator
function generateLogicalReasoningQuestion(grade: number, difficulty: number): Question {
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

// Spatial reasoning question generator
function generateSpatialReasoningQuestion(grade: number, difficulty: number): Question {
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

// Main Mathematical Reasoning questions generator
export function generateMathematicalReasoningQuestions(count: number, grade: number, difficulty: number): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();

  while (questions.length < count) {
    const questionType = Math.random();
    let newQuestion: Question;
    
    if (questionType < 0.33) {
      newQuestion = generateNumberPatternQuestion(grade, difficulty);
    } else if (questionType < 0.67) {
      newQuestion = generateLogicalReasoningQuestion(grade, difficulty);
    } else {
      newQuestion = generateSpatialReasoningQuestion(grade, difficulty);
    }
    
    if (!usedQuestions.has(newQuestion.question)) {
      questions.push(newQuestion);
      usedQuestions.add(newQuestion.question);
    }
  }
  
  return questions;
}
