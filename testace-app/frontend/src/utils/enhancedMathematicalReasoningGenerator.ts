import { Question, DifficultyLevel, QuestionType } from '../types';
import { ensureUniqueOptions, shuffleArray, getRandomInt } from './questionUtils';
import { generateMathematicalReasoningId } from './idGenerator';

/**
 * Enhanced Mathematical Reasoning Question Generator
 * Generates diverse, non-repetitive questions for Grade 9 Mathematical Reasoning
 * Includes: Number Patterns, Logical Reasoning, Spatial Reasoning, Problem Solving
 */

// Grade-specific complexity factors
const gradeComplexityFactors: Record<string, number> = {
  '1': 0.1, '2': 0.2, '3': 0.3, '4': 0.4, '5': 0.5,
  '6': 0.6, '7': 0.7, '8': 0.8, '9': 1.0, '10': 1.2,
  '11': 1.4, '12': 1.6
};

// Question type distribution for variety
const questionTypeDistribution = {
  numberPatterns: 0.25,
  logicalReasoning: 0.25,
  spatialReasoning: 0.20,
  problemSolving: 0.15,
  sequenceAnalysis: 0.15
};

/**
 * Generate dynamic number pattern questions
 */
const generateNumberPatternQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const complexityFactor = gradeComplexityFactors[grade] || 1.0;
  const gradeNum = parseInt(grade);
  
  let pattern: number[];
  let nextValue: number;
  let explanation: string;
  let content: string;
  
  switch (difficulty) {
    case DifficultyLevel.EASY:
      // Simple arithmetic sequences
      const diff = getRandomInt(2, 5);
      const start = getRandomInt(1, 20);
      pattern = [start, start + diff, start + 2*diff, start + 3*diff, start + 4*diff];
      nextValue = start + 5*diff;
      content = `What comes next in the pattern: ${pattern.slice(0, 4).join(', ')}, ?`;
      explanation = `This is an arithmetic sequence with a common difference of ${diff}. Each term increases by ${diff}.`;
      break;
      
    case DifficultyLevel.MEDIUM:
      if (Math.random() < 0.5) {
        // Geometric sequences
        const ratio = getRandomInt(2, 4);
        const start = getRandomInt(1, 5);
        pattern = [start];
        for (let i = 1; i < 5; i++) {
          pattern.push(pattern[i-1] * ratio);
        }
        nextValue = pattern[4] * ratio;
        content = `Find the next number in the sequence: ${pattern.slice(0, 4).join(', ')}, ?`;
        explanation = `This is a geometric sequence where each term is multiplied by ${ratio} to get the next term.`;
      } else {
        // Quadratic sequences
        const a = getRandomInt(1, 3);
        pattern = [];
        for (let n = 1; n <= 5; n++) {
          pattern.push(a * n * n);
        }
        nextValue = a * 6 * 6;
        content = `What is the next term: ${pattern.slice(0, 4).join(', ')}, ?`;
        explanation = `This follows the pattern n² × ${a}, where n is the position number.`;
      }
      break;
      
    case DifficultyLevel.HARD:
      if (gradeNum >= 9) {
        // Complex patterns (Fibonacci-like, polynomial)
        if (Math.random() < 0.6) {
          // Modified Fibonacci
          const a = getRandomInt(1, 3);
          const b = getRandomInt(1, 3);
          pattern = [a, b];
          for (let i = 2; i < 5; i++) {
            pattern.push(pattern[i-1] + pattern[i-2]);
          }
          nextValue = pattern[4] + pattern[3];
          content = `Find the pattern and next number: ${pattern.slice(0, 4).join(', ')}, ?`;
          explanation = `Each term is the sum of the two preceding terms (like Fibonacci sequence).`;
        } else {
          // Polynomial pattern
          pattern = [];
          for (let n = 1; n <= 5; n++) {
            pattern.push(n*n*n - n*n + n);
          }
          nextValue = 6*6*6 - 6*6 + 6;
          content = `Determine the next value: ${pattern.slice(0, 4).join(', ')}, ?`;
          explanation = `This follows the pattern n³ - n² + n for position n.`;
        }
      } else {
        // Simpler hard pattern for lower grades
        const diff1 = getRandomInt(2, 4);
        const diff2 = getRandomInt(1, 2);
        pattern = [getRandomInt(1, 10)];
        let currentDiff = diff1;
        for (let i = 1; i < 5; i++) {
          pattern.push(pattern[i-1] + currentDiff);
          currentDiff += diff2;
        }
        nextValue = pattern[4] + currentDiff;
        content = `Find the next number: ${pattern.slice(0, 4).join(', ')}, ?`;
        explanation = `The differences between consecutive terms increase by ${diff2} each time.`;
      }
      break;
  }
  
  // Generate distractors
  const distractors = generatePatternDistractors(nextValue, pattern);
  const options = shuffleArray([nextValue.toString(), ...distractors]);
  
  return {
    _id: generateMathematicalReasoningId(),
    content,
    options,
    correctAnswer: nextValue.toString(),
    explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Number Patterns',
    tags: ['patterns', 'sequences', 'reasoning', `grade-${grade}`],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Generate logical reasoning questions
 */
const generateLogicalReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  const logicalScenarios = getLogicalScenarios(gradeNum, difficulty);
  const scenario = logicalScenarios[getRandomInt(0, logicalScenarios.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: scenario.content,
    options: shuffleArray([...scenario.options]),
    correctAnswer: scenario.correctAnswer,
    explanation: scenario.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Logical Reasoning',
    tags: ['logic', 'reasoning', 'deduction', `grade-${grade}`],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Generate spatial reasoning questions
 */
const generateSpatialReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  const spatialScenarios = getSpatialScenarios(gradeNum, difficulty);
  const scenario = spatialScenarios[getRandomInt(0, spatialScenarios.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: scenario.content,
    options: shuffleArray([...scenario.options]),
    correctAnswer: scenario.correctAnswer,
    explanation: scenario.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Spatial Reasoning',
    tags: ['spatial', 'geometry', 'visualization', `grade-${grade}`],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Generate problem solving questions
 */
const generateProblemSolvingQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  const problemScenarios = getProblemSolvingScenarios(gradeNum, difficulty);
  const scenario = problemScenarios[getRandomInt(0, problemScenarios.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: scenario.content,
    options: shuffleArray([...scenario.options]),
    correctAnswer: scenario.correctAnswer,
    explanation: scenario.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Problem Solving',
    tags: ['problem-solving', 'analysis', 'reasoning', `grade-${grade}`],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Generate sequence analysis questions
 */
const generateSequenceAnalysisQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  const sequenceScenarios = getSequenceAnalysisScenarios(gradeNum, difficulty);
  const scenario = sequenceScenarios[getRandomInt(0, sequenceScenarios.length - 1)];
  
  return {
    _id: generateMathematicalReasoningId(),
    content: scenario.content,
    options: shuffleArray([...scenario.options]),
    correctAnswer: scenario.correctAnswer,
    explanation: scenario.explanation,
    difficulty,
    subject: 'Mathematical Reasoning',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Sequence Analysis',
    tags: ['sequences', 'analysis', 'patterns', `grade-${grade}`],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Helper function to generate pattern distractors
 */
const generatePatternDistractors = (correctAnswer: number, pattern: number[]): string[] => {
  const distractors: string[] = [];
  
  // Common wrong answers
  distractors.push((correctAnswer + getRandomInt(1, 5)).toString());
  distractors.push((correctAnswer - getRandomInt(1, 5)).toString());
  
  // Pattern-based wrong answers
  if (pattern.length >= 2) {
    const lastDiff = pattern[pattern.length - 1] - pattern[pattern.length - 2];
    distractors.push((pattern[pattern.length - 1] + lastDiff + getRandomInt(1, 3)).toString());
  }
  
  // Ensure unique distractors
  const uniqueDistractors = [...new Set(distractors)].filter(d => d !== correctAnswer.toString());
  return uniqueDistractors.slice(0, 3);
};

/**
 * Get logical reasoning scenarios based on grade and difficulty
 */
const getLogicalScenarios = (grade: number, difficulty: DifficultyLevel) => {
  const scenarios = [];
  
  if (difficulty === DifficultyLevel.EASY) {
    scenarios.push(
      {
        content: "If all roses are flowers, and some flowers are red, which statement must be true?",
        options: ["All roses are red", "Some roses might be red", "No roses are red", "All flowers are roses"],
        correctAnswer: "Some roses might be red",
        explanation: "Since all roses are flowers and some flowers are red, it's possible that some roses are red, but not certain."
      },
      {
        content: "In a class, every student who plays soccer also plays basketball. If Maria plays soccer, what can we conclude?",
        options: ["Maria doesn't play basketball", "Maria plays basketball", "Maria might play basketball", "We cannot determine anything"],
        correctAnswer: "Maria plays basketball",
        explanation: "Since every soccer player also plays basketball, and Maria plays soccer, she must play basketball."
      },
      {
        content: "If it's raining, then the ground is wet. The ground is wet. What can we conclude?",
        options: ["It is raining", "It might be raining", "It is not raining", "The ground is not wet"],
        correctAnswer: "It might be raining",
        explanation: "Wet ground could be caused by rain or other factors. We cannot conclude it's definitely raining."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.MEDIUM) {
    scenarios.push(
      {
        content: "In a tournament, Team A beats Team B, Team B beats Team C, and Team C beats Team D. If Team A plays Team D, what is most likely?",
        options: ["Team D will win", "Team A will win", "It will be a tie", "Cannot be determined"],
        correctAnswer: "Team A will win",
        explanation: "Based on the transitive property of the wins, Team A is likely stronger than Team D."
      },
      {
        content: "All mathematicians are logical. Some logical people are creative. John is a mathematician. Which conclusion is valid?",
        options: ["John is creative", "John might be creative", "John is not creative", "All creative people are mathematicians"],
        correctAnswer: "John might be creative",
        explanation: "John is logical (being a mathematician), and some logical people are creative, so John might be creative."
      },
      {
        content: "If a number is divisible by 6, it's divisible by both 2 and 3. Number N is divisible by 6. What must be true?",
        options: ["N is odd", "N is divisible by 12", "N is divisible by 2 and 3", "N is prime"],
        correctAnswer: "N is divisible by 2 and 3",
        explanation: "By definition, if N is divisible by 6, it must be divisible by both 2 and 3."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.HARD && grade >= 9) {
    scenarios.push(
      {
        content: "In a logic puzzle, if P implies Q, and Q implies R, and NOT R is true, what can we conclude about P?",
        options: ["P is true", "P is false", "P might be true or false", "We need more information"],
        correctAnswer: "P is false",
        explanation: "Using modus tollens: if P→Q and Q→R, then P→R. Since NOT R is true, P must be false."
      },
      {
        content: "Five friends sit in a row. Alice is not at either end. Bob is to the right of Charlie. David is between Alice and Eve. If Charlie is at the left end, what is the seating order?",
        options: ["Charlie, Bob, Alice, David, Eve", "Charlie, Alice, David, Bob, Eve", "Charlie, Bob, David, Alice, Eve", "Charlie, David, Alice, Bob, Eve"],
        correctAnswer: "Charlie, Bob, Alice, David, Eve",
        explanation: "Working through the constraints: Charlie (left end), Bob (right of Charlie), Alice (not at ends), David (between Alice and Eve)."
      },
      {
        content: "In a group of 100 people, 60 like coffee, 40 like tea, and 25 like both. How many like neither coffee nor tea?",
        options: ["15", "25", "35", "45"],
        correctAnswer: "25",
        explanation: "Using set theory: |Coffee ∪ Tea| = 60 + 40 - 25 = 75. So 100 - 75 = 25 like neither."
      }
    );
  }
  
  return scenarios;
};

/**
 * Get spatial reasoning scenarios
 */
const getSpatialScenarios = (grade: number, difficulty: DifficultyLevel) => {
  const scenarios = [];
  
  if (difficulty === DifficultyLevel.EASY) {
    scenarios.push(
      {
        content: "How many triangles can you count in a square divided by both diagonals?",
        options: ["4", "6", "8", "12"],
        correctAnswer: "8",
        explanation: "The diagonals create 8 triangles: 4 small triangles and 4 larger triangles formed by combining adjacent small ones."
      },
      {
        content: "If you rotate a square 90 degrees clockwise, how many times do you need to repeat this to get back to the original position?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "A square has 4-fold rotational symmetry, so 4 rotations of 90° each (360° total) returns to original."
      },
      {
        content: "A cube is painted red on all faces, then cut into 27 smaller cubes. How many small cubes have exactly 2 red faces?",
        options: ["8", "12", "16", "20"],
        correctAnswer: "12",
        explanation: "The edge cubes (not corners or face centers) have exactly 2 painted faces. There are 12 edges on a cube."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.MEDIUM) {
    scenarios.push(
      {
        content: "A rectangular piece of paper is folded in half twice, then a circular hole is punched. When unfolded, how many holes will there be?",
        options: ["2", "4", "6", "8"],
        correctAnswer: "4",
        explanation: "Folding twice creates 4 layers. One punch creates 4 holes when unfolded."
      },
      {
        content: "In a 3D coordinate system, how many unit cubes fit exactly in a 3×3×3 cube?",
        options: ["9", "18", "27", "36"],
        correctAnswer: "27",
        explanation: "A 3×3×3 cube contains 3³ = 27 unit cubes."
      },
      {
        content: "If you look at a pyramid from directly above, what shape do you see?",
        options: ["Triangle", "Square", "Circle", "Depends on the base"],
        correctAnswer: "Depends on the base",
        explanation: "The top view of a pyramid shows the shape of its base (square, triangle, etc.)."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.HARD && grade >= 9) {
    scenarios.push(
      {
        content: "A regular octahedron has how many faces, edges, and vertices respectively?",
        options: ["6, 10, 8", "8, 12, 6", "8, 18, 12", "12, 18, 8"],
        correctAnswer: "8, 12, 6",
        explanation: "A regular octahedron has 8 triangular faces, 12 edges, and 6 vertices. Verified by Euler's formula: V - E + F = 2."
      },
      {
        content: "In 4D space, a tesseract (4D cube) has how many 3D faces?",
        options: ["6", "8", "12", "16"],
        correctAnswer: "8",
        explanation: "A tesseract has 8 cubic faces, just as a cube has 6 square faces and a square has 4 line segments."
      },
      {
        content: "If you slice a cone with a plane parallel to its base, what shape is the cross-section?",
        options: ["Triangle", "Circle", "Ellipse", "Parabola"],
        correctAnswer: "Circle",
        explanation: "A plane parallel to the base of a cone creates a circular cross-section, similar to but smaller than the base."
      }
    );
  }
  
  return scenarios;
};

/**
 * Get problem solving scenarios
 */
const getProblemSolvingScenarios = (grade: number, difficulty: DifficultyLevel) => {
  const scenarios = [];
  
  if (difficulty === DifficultyLevel.EASY) {
    scenarios.push(
      {
        content: "A farmer has chickens and cows. He counts 30 heads and 74 legs. How many chickens does he have?",
        options: ["16", "18", "20", "23"],
        correctAnswer: "23",
        explanation: "Let c = chickens, w = cows. c + w = 30, 2c + 4w = 74. Solving: w = 7, c = 23."
      },
      {
        content: "Three consecutive even numbers sum to 48. What is the largest number?",
        options: ["14", "16", "18", "20"],
        correctAnswer: "18",
        explanation: "Let the numbers be n, n+2, n+4. Then n + (n+2) + (n+4) = 48, so 3n + 6 = 48, n = 14. The largest is 18."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.MEDIUM) {
    scenarios.push(
      {
        content: "A clock shows 3:15. What is the angle between the hour and minute hands?",
        options: ["0°", "7.5°", "15°", "22.5°"],
        correctAnswer: "7.5°",
        explanation: "At 3:15, minute hand is at 90°, hour hand is at 97.5° (3.25 × 30°). Difference is 7.5°."
      },
      {
        content: "In how many ways can 5 people sit around a circular table?",
        options: ["24", "60", "120", "240"],
        correctAnswer: "24",
        explanation: "For circular arrangements, fix one person and arrange the rest: (5-1)! = 4! = 24 ways."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.HARD && grade >= 9) {
    scenarios.push(
      {
        content: "A password consists of 4 digits. How many passwords have at least one repeated digit?",
        options: ["4464", "5040", "4536", "4960"],
        correctAnswer: "4960",
        explanation: "Total passwords: 10⁴ = 10000. Passwords with no repeats: 10×9×8×7 = 5040. With repeats: 10000 - 5040 = 4960."
      },
      {
        content: "If log₂(x) + log₂(y) = 5 and log₂(x) - log₂(y) = 1, what is xy?",
        options: ["16", "24", "32", "48"],
        correctAnswer: "32",
        explanation: "From the equations: log₂(x) = 3, log₂(y) = 2. So x = 8, y = 4, and xy = 32."
      }
    );
  }
  
  return scenarios;
};

/**
 * Get sequence analysis scenarios
 */
const getSequenceAnalysisScenarios = (grade: number, difficulty: DifficultyLevel) => {
  const scenarios = [];
  
  if (difficulty === DifficultyLevel.EASY) {
    scenarios.push(
      {
        content: "In the sequence 2, 6, 18, 54, ..., what is the 6th term?",
        options: ["162", "216", "324", "486"],
        correctAnswer: "486",
        explanation: "Each term is multiplied by 3. The 5th term is 162, so the 6th term is 162 × 3 = 486."
      },
      {
        content: "What is the sum of the first 5 terms of the sequence 3, 7, 11, 15, ...?",
        options: ["35", "45", "55", "65"],
        correctAnswer: "55",
        explanation: "This is arithmetic with first term 3 and common difference 4. Sum = 3 + 7 + 11 + 15 + 19 = 55."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.MEDIUM) {
    scenarios.push(
      {
        content: "In the sequence where aₙ = n² - 2n + 3, what is a₅?",
        options: ["18", "20", "22", "24"],
        correctAnswer: "18",
        explanation: "a₅ = 5² - 2(5) + 3 = 25 - 10 + 3 = 18."
      },
      {
        content: "The sequence 1, 4, 9, 16, 25, ... represents what type of numbers?",
        options: ["Prime numbers", "Perfect squares", "Triangular numbers", "Fibonacci numbers"],
        correctAnswer: "Perfect squares",
        explanation: "These are 1², 2², 3², 4², 5², ... which are perfect squares."
      }
    );
  }
  
  if (difficulty === DifficultyLevel.HARD && grade >= 9) {
    scenarios.push(
      {
        content: "For the recursive sequence aₙ = 2aₙ₋₁ - aₙ₋₂ with a₁ = 1, a₂ = 3, what is a₅?",
        options: ["7", "9", "11", "13"],
        correctAnswer: "9",
        explanation: "a₃ = 2(3) - 1 = 5, a₄ = 2(5) - 3 = 7, a₅ = 2(7) - 5 = 9."
      },
      {
        content: "What is the limit of the sequence aₙ = (3n² + 2n)/(n² + 1) as n approaches infinity?",
        options: ["0", "2", "3", "∞"],
        correctAnswer: "3",
        explanation: "Dividing numerator and denominator by n²: (3 + 2/n)/(1 + 1/n²) → 3/1 = 3 as n → ∞."
      }
    );
  }
  
  return scenarios;
};

/**
 * Main function to generate enhanced mathematical reasoning questions
 */
export const generateEnhancedMathematicalReasoningQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 5
): Question[] => {
  const questions: Question[] = [];
  const usedQuestionIds = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let question: Question;
    let attempts = 0;
    
    // Ensure variety by cycling through question types
    do {
      const questionType = Math.random();
      
      if (questionType < questionTypeDistribution.numberPatterns) {
        question = generateNumberPatternQuestion(grade, difficulty);
      } else if (questionType < questionTypeDistribution.numberPatterns + questionTypeDistribution.logicalReasoning) {
        question = generateLogicalReasoningQuestion(grade, difficulty);
      } else if (questionType < questionTypeDistribution.numberPatterns + questionTypeDistribution.logicalReasoning + questionTypeDistribution.spatialReasoning) {
        question = generateSpatialReasoningQuestion(grade, difficulty);
      } else if (questionType < questionTypeDistribution.numberPatterns + questionTypeDistribution.logicalReasoning + questionTypeDistribution.spatialReasoning + questionTypeDistribution.problemSolving) {
        question = generateProblemSolvingQuestion(grade, difficulty);
      } else {
        question = generateSequenceAnalysisQuestion(grade, difficulty);
      }
      
      attempts++;
    } while (usedQuestionIds.has(question.content) && attempts < 10);
    
    usedQuestionIds.add(question.content);
    questions.push(question);
  }
  
  return questions;
};
