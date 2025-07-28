import { Question, DifficultyLevel, QuestionType } from '../types';
import { ensureUniqueOptions, shuffleArray, getRandomInt } from './questionUtils';
import { generateMathematicalReasoningId } from './idGenerator';

// Number pattern question templates
const numberPatternQuestions = {
  easy: [
    {
      content: "What comes next in the pattern: 2, 4, 6, 8, ?",
      options: ["9", "10", "11", "12"],
      correctAnswer: "10",
      explanation: "This is an even number pattern, increasing by 2 each time."
    },
    {
      content: "Complete the pattern: 1, 3, 5, 7, ?",
      options: ["8", "9", "10", "11"],
      correctAnswer: "9",
      explanation: "This is an odd number pattern, increasing by 2 each time."
    }
  ],
  medium: [
    {
      content: "What comes next: 3, 6, 12, 24, ?",
      options: ["36", "48", "50", "72"],
      correctAnswer: "48",
      explanation: "Each number is multiplied by 2 to get the next number."
    }
  ],
  hard: [
    {
      content: "Find the next number: 1, 1, 2, 3, 5, 8, ?",
      options: ["11", "13", "15", "16"],
      correctAnswer: "13",
      explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones."
    }
  ]
};

// Logical reasoning question templates
const logicalReasoningQuestions = {
  easy: [
    {
      content: "If all cats are animals, and Fluffy is a cat, then:",
      options: ["Fluffy is not an animal", "Fluffy is an animal", "Fluffy might be an animal", "We cannot tell"],
      correctAnswer: "Fluffy is an animal",
      explanation: "Since all cats are animals and Fluffy is a cat, Fluffy must be an animal."
    }
  ],
  medium: [
    {
      content: "Tom is taller than Sam. Sam is taller than Ben. Who is the shortest?",
      options: ["Tom", "Sam", "Ben", "Cannot determine"],
      correctAnswer: "Ben",
      explanation: "If Tom > Sam > Ben, then Ben is the shortest."
    }
  ],
  hard: [
    {
      content: "In a group of 5 friends, if each friend shakes hands with every other friend exactly once, how many handshakes occur?",
      options: ["8", "10", "12", "15"],
      correctAnswer: "10",
      explanation: "With 5 people, the number of handshakes is 5×4÷2 = 10 (combination formula)."
    }
  ]
};

// Spatial reasoning question templates
const spatialReasoningQuestions = {
  easy: [
    {
      content: "How many squares are in a 2×2 grid?",
      options: ["4", "5", "6", "8"],
      correctAnswer: "5",
      explanation: "There are 4 small squares and 1 large square (2×2), totaling 5 squares."
    }
  ],
  medium: [
    {
      content: "If you fold a square piece of paper in half twice and cut a small triangle from the corner, how many holes will there be when you unfold it?",
      options: ["1", "2", "4", "8"],
      correctAnswer: "4",
      explanation: "Folding twice creates 4 layers, so one cut creates 4 holes when unfolded."
    }
  ],
  hard: [
    {
      content: "A cube has how many faces, edges, and vertices in total?",
      options: ["20", "24", "26", "28"],
      correctAnswer: "26",
      explanation: "A cube has 6 faces + 12 edges + 8 vertices = 26 total."
    }
  ]
};

// Function to generate number pattern questions
const generateNumberPatternQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof numberPatternQuestions;
  const questions = numberPatternQuestions[difficultyKey] || numberPatternQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Number Patterns',
    tags: ['patterns', 'numbers', 'reasoning'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to generate logical reasoning questions
const generateLogicalReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof logicalReasoningQuestions;
  const questions = logicalReasoningQuestions[difficultyKey] || logicalReasoningQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Logical Reasoning',
    tags: ['logic', 'reasoning', 'deduction'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to generate spatial reasoning questions
const generateSpatialReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof spatialReasoningQuestions;
  const questions = spatialReasoningQuestions[difficultyKey] || spatialReasoningQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Spatial Reasoning',
    tags: ['spatial', 'geometry', 'visualization'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Main function to generate mathematical reasoning questions
export const generateMathematicalReasoningQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 5
): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    // Choose a question type based on a random distribution
    const questionType = Math.random();
    
    if (questionType < 0.33) {
      questions.push(generateNumberPatternQuestion(grade, difficulty));
    } else if (questionType < 0.67) {
      questions.push(generateLogicalReasoningQuestion(grade, difficulty));
    } else {
      questions.push(generateSpatialReasoningQuestion(grade, difficulty));
    }
  }
  
  return questions;
};
