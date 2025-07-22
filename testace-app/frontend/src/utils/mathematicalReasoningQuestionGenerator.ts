import { Question, DifficultyLevel, QuestionType } from '../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 5000; // Start from 5000 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to ensure options are unique
const ensureUniqueOptions = (correctAnswer: string, wrongOptions: string[]): string[] => {
  const uniqueWrongOptions = Array.from(new Set(wrongOptions));
  const filteredWrongOptions = uniqueWrongOptions.filter(option => option !== correctAnswer);
  
  while (filteredWrongOptions.length < 3) {
    const suffix = ` (${filteredWrongOptions.length + 1})`;
    let newOption = correctAnswer + suffix;
    if (!filteredWrongOptions.includes(newOption)) {
      filteredWrongOptions.push(newOption);
    }
  }
  
  return shuffleArray([correctAnswer, ...filteredWrongOptions.slice(0, 3)]);
};

// Generate number pattern questions
const generateNumberPatternQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple arithmetic sequences
      const start = getRandomInt(1, 10);
      const increment = getRandomInt(2, 5);
      const sequence = Array.from({ length: 4 }, (_, i) => start + i * increment);
      const nextNumber = start + 4 * increment;
      
      question = `What number comes next in this sequence? ${sequence.join(', ')}, ?`;
      answer = nextNumber.toString();
      explanation = `This is an arithmetic sequence that increases by ${increment} each time. After ${sequence[sequence.length - 1]}, the next number would be ${nextNumber}.`;
      
      const wrongOptions = [
        (nextNumber + increment).toString(),
        (nextNumber - increment).toString(),
        (nextNumber * 2).toString()
      ];
      options = ensureUniqueOptions(answer, wrongOptions);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // Geometric sequences or more complex arithmetic patterns
      const patternType = Math.random() < 0.5 ? 'geometric' : 'complex-arithmetic';
      
      if (patternType === 'geometric') {
        const start = getRandomInt(1, 5);
        const multiplier = getRandomInt(2, 3);
        const sequence = Array.from({ length: 4 }, (_, i) => start * Math.pow(multiplier, i));
        const nextNumber = start * Math.pow(multiplier, 4);
        
        question = `What number comes next in this sequence? ${sequence.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `This is a geometric sequence that multiplies by ${multiplier} each time. After ${sequence[sequence.length - 1]}, the next number would be ${nextNumber}.`;
        
        const wrongOptions = [
          (nextNumber + multiplier).toString(),
          (nextNumber - multiplier).toString(),
          (sequence[sequence.length - 1] + sequence[sequence.length - 1]).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const start = getRandomInt(1, 10);
        const increment1 = getRandomInt(2, 4);
        const increment2 = getRandomInt(3, 5);
        const sequence = [start];
        let currentIncrement = increment1;
        
        for (let i = 1; i < 4; i++) {
          sequence.push(sequence[i - 1] + currentIncrement);
          currentIncrement = currentIncrement === increment1 ? increment2 : increment1;
        }
        
        const nextNumber = sequence[sequence.length - 1] + currentIncrement;
        
        question = `What number comes next in this sequence? ${sequence.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `This sequence alternates between adding ${increment1} and ${increment2}. After ${sequence[sequence.length - 1]}, we add ${currentIncrement} to get ${nextNumber}.`;
        
        const wrongOptions = [
          (nextNumber + Math.max(increment1, increment2)).toString(),
          (nextNumber - Math.min(increment1, increment2)).toString(),
          (sequence[sequence.length - 1] * 2).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex patterns (quadratic, Fibonacci, etc.)
      const patternType = Math.random() < 0.5 ? 'quadratic' : 'fibonacci';
      
      if (patternType === 'quadratic') {
        const a = getRandomInt(1, 2);
        const sequence = Array.from({ length: 4 }, (_, i) => a * i * i);
        const nextNumber = a * 16; // n=4, so 4*4=16
        
        question = `What number comes next in this sequence? ${sequence.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `This is a quadratic sequence where each number is ${a} times the square of its position (starting from 0). The next position is 4, so the next number is ${a} × 4² = ${nextNumber}.`;
        
        const wrongOptions = [
          (nextNumber + a).toString(),
          (sequence[sequence.length - 1] * 2).toString(),
          (Math.pow(sequence[sequence.length - 1], 2)).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const sequence = [1, 1];
        for (let i = 2; i < 5; i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        const nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        
        question = `What number comes next in this sequence? ${sequence.slice(0, -1).join(', ')}, ?`;
        answer = sequence[sequence.length - 1].toString();
        explanation = `This is a Fibonacci-like sequence where each number is the sum of the two previous numbers. After ${sequence[sequence.length - 2]} and ${sequence[sequence.length - 3]}, the next number would be ${sequence[sequence.length - 1]}.`;
        
        const wrongOptions = [
          nextNumber.toString(),
          (sequence[sequence.length - 1] + 1).toString(),
          (sequence[sequence.length - 2] * 2).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    default: {
      const sequence = [2, 4, 6, 8];
      const nextNumber = 10;
      
      question = `What number comes next in this sequence? ${sequence.join(', ')}, ?`;
      answer = nextNumber.toString();
      explanation = `This is a simple arithmetic sequence that increases by 2 each time.`;
      
      const wrongOptions = ['12', '14', '16'];
      options = ensureUniqueOptions(answer, wrongOptions);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Mathematical Reasoning',
    topic: 'Number Patterns',
    difficulty,
    tags: ['patterns', 'sequences', gradeNum <= 5 ? 'elementary' : gradeNum <= 8 ? 'middle school' : 'high school'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for a pattern in how the numbers change', 'Try to identify the rule that generates each number']
  };
};

// Generate logical reasoning questions
const generateLogicalReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple if-then statements or basic logic
      const scenarios = [
        {
          premise: 'All squares are rectangles.',
          fact: 'Shape A is a square.',
          conclusion: 'Shape A is a rectangle.',
          explanation: 'Since all squares are rectangles, and Shape A is a square, it must also be a rectangle.'
        },
        {
          premise: 'All multiples of 4 are even numbers.',
          fact: 'Number X is a multiple of 4.',
          conclusion: 'Number X is even.',
          explanation: 'Since all multiples of 4 are even numbers, and Number X is a multiple of 4, it must be even.'
        }
      ];
      
      const selectedScenario = scenarios[getRandomInt(0, scenarios.length - 1)];
      
      question = `Given: ${selectedScenario.premise}\n${selectedScenario.fact}\nWhat can we conclude?`;
      answer = selectedScenario.conclusion;
      explanation = selectedScenario.explanation;
      
      const wrongOptions = [
        'We cannot make any conclusion',
        'The premise is false',
        'We need more information'
      ];
      options = ensureUniqueOptions(answer, wrongOptions);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // More complex logical relationships
      const scenarios = [
        {
          setup: 'In a race, Tom finished before Jerry. Jerry finished before Mike.',
          question: 'Who finished last?',
          answer: 'Mike',
          explanation: 'If Tom finished before Jerry, and Jerry finished before Mike, then Mike must have finished last.',
          wrongOptions: ['Tom', 'Jerry', 'Cannot be determined']
        },
        {
          setup: 'Red marbles are heavier than blue marbles. Blue marbles are heavier than green marbles.',
          question: 'Which marbles are the lightest?',
          answer: 'Green marbles',
          explanation: 'If red > blue and blue > green in terms of weight, then green marbles must be the lightest.',
          wrongOptions: ['Red marbles', 'Blue marbles', 'Cannot be determined']
        }
      ];
      
      const selectedScenario = scenarios[getRandomInt(0, scenarios.length - 1)];
      
      question = `${selectedScenario.setup}\n${selectedScenario.question}`;
      answer = selectedScenario.answer;
      explanation = selectedScenario.explanation;
      options = ensureUniqueOptions(answer, selectedScenario.wrongOptions);
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex logical puzzles
      const puzzles = [
        {
          setup: 'Three boxes are labeled "Apples", "Oranges", and "Mixed". All labels are wrong. Each box contains either only apples, only oranges, or a mix of both.',
          question: 'If you can look in only one box to determine the contents of all boxes, which box should you look in?',
          answer: 'The box labeled "Mixed"',
          explanation: 'Since all labels are wrong, the "Mixed" box must contain either only apples or only oranges. Once you know which fruit it contains, you can determine the contents of the other boxes.',
          wrongOptions: ['The box labeled "Apples"', 'The box labeled "Oranges"', 'Any box will work']
        },
        {
          setup: 'Five houses are painted in different colors. The green house is next to the white house. The red house is on one end. The yellow house is exactly between two other houses.',
          question: 'Where must the blue house be?',
          answer: 'Next to the red house',
          explanation: "Since the yellow house is between two others, it can't be on an end. The red house is on one end, and the green and white houses must be next to each other. This means the blue house must be next to the red house.",
          wrongOptions: ['Next to the green house', 'Next to the yellow house', 'On the other end']
        }
      ];
      
      const selectedPuzzle = puzzles[getRandomInt(0, puzzles.length - 1)];
      
      question = `${selectedPuzzle.setup}\n${selectedPuzzle.question}`;
      answer = selectedPuzzle.answer;
      explanation = selectedPuzzle.explanation;
      options = ensureUniqueOptions(answer, selectedPuzzle.wrongOptions);
      break;
    }
    
    default: {
      question = 'If all A are B, and all B are C, what can we conclude?';
      answer = 'All A are C';
      explanation = 'This is a transitive relationship. If A implies B, and B implies C, then A must imply C.';
      
      const wrongOptions = [
        'All C are A',
        'No A are C',
        'We cannot conclude anything'
      ];
      options = ensureUniqueOptions(answer, wrongOptions);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Mathematical Reasoning',
    topic: 'Logical Reasoning',
    difficulty,
    tags: ['logic', 'reasoning', gradeNum <= 5 ? 'elementary' : gradeNum <= 8 ? 'middle school' : 'high school'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Break down the logical steps', 'Consider what must be true based on the given information']
  };
};

// Generate spatial reasoning questions
const generateSpatialReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple shape rotations and patterns
      const shapes = ['square', 'triangle', 'circle', 'rectangle'];
      const rotations = ['90 degrees clockwise', '180 degrees', 'reflected horizontally'];
      
      const selectedShape = shapes[getRandomInt(0, shapes.length - 1)];
      const selectedRotation = rotations[getRandomInt(0, rotations.length - 1)];
      
      question = `If a ${selectedShape} is rotated ${selectedRotation}, what will it look like?`;
      
      if (selectedShape === 'circle') {
        answer = 'The same as before';
        explanation = 'A circle looks the same no matter how it is rotated.';
        options = ensureUniqueOptions(answer, [
          'A different circle',
          'An oval',
          'It depends on the size'
        ]);
      } else {
        answer = `A ${selectedShape} rotated ${selectedRotation}`;
        explanation = `When a ${selectedShape} is rotated ${selectedRotation}, it maintains its shape but changes its orientation.`;
        options = ensureUniqueOptions(answer, [
          'A different shape',
          'Half the original size',
          'Twice the original size'
        ]);
      }
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // 3D shapes and transformations
      const shapes3D = ['cube', 'cylinder', 'sphere', 'cone'];
      const views = ['top', 'front', 'side'];
      
      const selectedShape = shapes3D[getRandomInt(0, shapes3D.length - 1)];
      const selectedView = views[getRandomInt(0, views.length - 1)];
      
      question = `What shape would you see if you looked at a ${selectedShape} from the ${selectedView} view?`;
      
      if (selectedShape === 'cube') {
        answer = 'A square';
        explanation = `A cube appears as a square from any ${selectedView} view.`;
      } else if (selectedShape === 'cylinder') {
        answer = selectedView === 'top' ? 'A circle' : 'A rectangle';
        explanation = `A cylinder appears as a circle from the top view and a rectangle from the side or front view.`;
      } else if (selectedShape === 'sphere') {
        answer = 'A circle';
        explanation = 'A sphere appears as a circle from any view.';
      } else {
        answer = selectedView === 'top' ? 'A circle' : 'A triangle';
        explanation = `A cone appears as a circle from the top view and a triangle from the side or front view.`;
      }
      
      options = ensureUniqueOptions(answer, ['A square', 'A circle', 'A triangle', 'A rectangle'].filter(o => o !== answer));
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex spatial problems
      const problems = [
        {
          setup: 'A cube is painted red on all faces. It is then cut into 27 smaller equal-sized cubes.',
          question: 'How many small cubes have exactly two red faces?',
          answer: '12',
          explanation: 'The edge cubes (not corners) have exactly two red faces. There are 12 such cubes (4 on each of the 3 edges).',
          wrongOptions: ['8', '6', '9']
        },
        {
          setup: 'A rectangular prism is made up of 24 unit cubes. Its length is twice its width, and its height is twice its width.',
          question: 'What are the dimensions of the prism?',
          answer: '4 × 2 × 2',
          explanation: 'If the width is x, then length is 2x and height is 2x. The volume is 24, so x × 2x × 2x = 24. Therefore x = 2, giving dimensions 4 × 2 × 2.',
          wrongOptions: ['6 × 2 × 2', '3 × 2 × 4', '8 × 2 × 1']
        }
      ];
      
      const selectedProblem = problems[getRandomInt(0, problems.length - 1)];
      
      question = `${selectedProblem.setup}\n${selectedProblem.question}`;
      answer = selectedProblem.answer;
      explanation = selectedProblem.explanation;
      options = ensureUniqueOptions(answer, selectedProblem.wrongOptions);
      break;
    }
    
    default: {
      question = 'What shape would you see if you looked at a cube from directly above?';
      answer = 'A square';
      explanation = 'When viewed from directly above, a cube appears as a square because you are looking at one of its faces.';
      
      const wrongOptions = ['A circle', 'A rectangle', 'A triangle'];
      options = ensureUniqueOptions(answer, wrongOptions);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Mathematical Reasoning',
    topic: 'Spatial Reasoning',
    difficulty,
    tags: ['spatial', 'geometry', gradeNum <= 5 ? 'elementary' : gradeNum <= 8 ? 'middle school' : 'high school'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Visualize the shapes in your mind', 'Think about how shapes look from different angles']
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
