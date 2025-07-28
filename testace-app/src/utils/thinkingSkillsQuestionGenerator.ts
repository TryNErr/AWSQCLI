import { Question } from '../types';

// Pattern question generator
function generatePatternQuestion(grade: number, difficulty: number): Question {
  const pattern = 'RED, BLUE, GREEN, RED, BLUE, GREEN';
  const options = ['RED', 'BLUE', 'GREEN', 'YELLOW'];

  return {
    id: `thinking-pattern-${Date.now()}`,
    type: 'pattern',
    question: `${pattern}\nWhat comes next in the pattern?`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Thinking Skills'
  };
}

// Logical reasoning question generator
function generateLogicalReasoningQuestion(grade: number, difficulty: number): Question {
  const premise = 'If all birds can fly, and a penguin is a bird,';
  const options = [
    'The premise is false because not all birds can fly',
    'A penguin can fly',
    'Some birds cannot fly',
    'Not enough information'
  ];

  return {
    id: `thinking-logic-${Date.now()}`,
    type: 'logical-reasoning',
    question: `${premise}\nWhat is the correct conclusion?`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Thinking Skills'
  };
}

// Problem solving question generator
function generateProblemSolvingQuestion(grade: number, difficulty: number): Question {
  const scenario = 'If it takes 2 painters 4 hours to paint a room,';
  const options = ['2 hours', '8 hours', '1 hour', '6 hours'];

  return {
    id: `thinking-problem-${Date.now()}`,
    type: 'problem-solving',
    question: `${scenario}\nhow long would it take 4 painters to paint the same room?`,
    options: options,
    correctAnswer: options[0],
    grade,
    difficulty,
    subject: 'Thinking Skills'
  };
}

// Main Thinking Skills questions generator
export function generateThinkingSkillsQuestions(count: number, grade: number, difficulty: number): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();

  while (questions.length < count) {
    const questionType = Math.random();
    let newQuestion: Question;
    
    if (questionType < 0.33) {
      newQuestion = generatePatternQuestion(grade, difficulty);
    } else if (questionType < 0.67) {
      newQuestion = generateLogicalReasoningQuestion(grade, difficulty);
    } else {
      newQuestion = generateProblemSolvingQuestion(grade, difficulty);
    }
    
    if (!usedQuestions.has(newQuestion.question)) {
      questions.push(newQuestion);
      usedQuestions.add(newQuestion.question);
    }
  }
  
  return questions;
}
