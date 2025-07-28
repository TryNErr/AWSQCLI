import { Question, DifficultyLevel, QuestionType } from '../types';
import { ensureUniqueOptions, shuffleArray, getRandomInt } from './questionUtils';
import { generateThinkingSkillsId } from './idGenerator';

// Pattern question templates
const patternQuestions = {
  easy: [
    {
      content: "Which shape comes next in the pattern: Circle, Square, Circle, Square, ?",
      options: ["Triangle", "Circle", "Rectangle", "Pentagon"],
      correctAnswer: "Circle",
      explanation: "The pattern alternates between Circle and Square, so Circle comes next."
    }
  ],
  medium: [
    {
      content: "What comes next: Red-Big, Blue-Small, Red-Big, Blue-Small, ?",
      options: ["Green-Medium", "Red-Big", "Blue-Big", "Red-Small"],
      correctAnswer: "Red-Big",
      explanation: "The pattern repeats every two items: Red-Big, Blue-Small."
    }
  ],
  hard: [
    {
      content: "In the sequence A1, B4, C9, D16, what comes next?",
      options: ["E20", "E25", "F25", "E24"],
      correctAnswer: "E25",
      explanation: "Letters advance by 1, numbers are perfect squares: A=1², B=4², C=9², D=16², so E=25²."
    }
  ]
};

// Logical reasoning question templates
const logicalReasoningQuestions = {
  easy: [
    {
      content: "All birds can fly. Penguins are birds. Can penguins fly?",
      options: ["Yes, always", "No, never", "Sometimes", "The statement is incorrect"],
      correctAnswer: "The statement is incorrect",
      explanation: "The premise 'All birds can fly' is false because penguins are birds that cannot fly."
    }
  ],
  medium: [
    {
      content: "If it rains, the ground gets wet. The ground is wet. What can we conclude?",
      options: ["It rained", "It might have rained", "It didn't rain", "Nothing definite"],
      correctAnswer: "Nothing definite",
      explanation: "The ground could be wet for other reasons (sprinkler, spill, etc.). We cannot conclude it rained."
    }
  ],
  hard: [
    {
      content: "In a class, some students like math, some like science. If 15 like math, 12 like science, and 5 like both, how many students are there if everyone likes at least one subject?",
      options: ["22", "27", "32", "Cannot determine"],
      correctAnswer: "22",
      explanation: "Using set theory: Total = Math + Science - Both = 15 + 12 - 5 = 22 students."
    }
  ]
};

// Problem solving question templates
const problemSolvingQuestions = {
  easy: [
    {
      content: "You have 3 apples and give away 1. How many do you have left?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      explanation: "3 apples - 1 apple given away = 2 apples remaining."
    }
  ],
  medium: [
    {
      content: "A farmer has chickens and cows. If there are 20 heads and 56 legs total, how many chickens are there?",
      options: ["8", "12", "16", "18"],
      correctAnswer: "12",
      explanation: "Let c=chickens, w=cows. c+w=20, 2c+4w=56. Solving: w=8, c=12."
    }
  ],
  hard: [
    {
      content: "Three friends split a bill. If they each pay $15 and get $3 change back, but the waiter keeps $2 as tip, what was the original bill?",
      options: ["$39", "$40", "$42", "$45"],
      correctAnswer: "$40",
      explanation: "Each paid $12 after change ($15-$3). Total paid: $36. Plus $2 tip to waiter: $36+$2=$38. But the bill was $40, waiter kept $2 from the $3 change per person."
    }
  ]
};

// Function to generate pattern questions
const generatePatternQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof patternQuestions;
  const questions = patternQuestions[difficultyKey] || patternQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateThinkingSkillsId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'Thinking Skills',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Pattern Recognition',
    tags: ['patterns', 'thinking', 'analysis'],
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
    _id: generateThinkingSkillsId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'Thinking Skills',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Logical Reasoning',
    tags: ['logic', 'reasoning', 'critical thinking'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to generate problem solving questions
const generateProblemSolvingQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof problemSolvingQuestions;
  const questions = problemSolvingQuestions[difficultyKey] || problemSolvingQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateThinkingSkillsId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'Thinking Skills',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Problem Solving',
    tags: ['problem solving', 'analysis', 'critical thinking'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Main function to generate thinking skills questions
export const generateThinkingSkillsQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 5
): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    // Choose a question type based on a random distribution
    const questionType = Math.random();
    
    if (questionType < 0.33) {
      questions.push(generatePatternQuestion(grade, difficulty));
    } else if (questionType < 0.67) {
      questions.push(generateLogicalReasoningQuestion(grade, difficulty));
    } else {
      questions.push(generateProblemSolvingQuestion(grade, difficulty));
    }
  }
  
  return questions;
};
