import { Question, DifficultyLevel, QuestionType } from '../types';
import { shuffleArray, getRandomInt } from './questionUtils';
import { generateId } from './idGenerator';

// Enhanced Thinking Skills Question Generator
// Based on Cambridge Thinking Skills Assessment, Critical Thinking Standards, and Cognitive Science Research

interface CognitiveChallenge {
  type: string;
  description: string;
  skillsAssessed: string[];
  gradeAppropriate: number[];
}

// Cognitive skills framework
const cognitiveSkills: Record<string, CognitiveChallenge> = {
  "logical_reasoning": {
    type: "Logical Reasoning",
    description: "Analyzing arguments, identifying assumptions, drawing valid conclusions",
    skillsAssessed: ["deduction", "induction", "assumption identification"],
    gradeAppropriate: [3, 4, 5, 6, 7, 8]
  },
  "pattern_recognition": {
    type: "Pattern Recognition",
    description: "Identifying sequences, relationships, and underlying structures",
    skillsAssessed: ["sequence analysis", "relationship mapping", "rule extraction"],
    gradeAppropriate: [1, 2, 3, 4, 5, 6]
  },
  "spatial_reasoning": {
    type: "Spatial Reasoning",
    description: "Mental manipulation of objects, understanding spatial relationships",
    skillsAssessed: ["mental rotation", "spatial visualization", "geometric reasoning"],
    gradeAppropriate: [2, 3, 4, 5, 6, 7]
  },
  "critical_analysis": {
    type: "Critical Analysis",
    description: "Evaluating information, identifying bias, assessing evidence",
    skillsAssessed: ["evidence evaluation", "bias detection", "argument analysis"],
    gradeAppropriate: [4, 5, 6, 7, 8]
  }
};

class EnhancedThinkingSkillsGenerator {
  
  // Generate advanced logical reasoning questions
  static generateLogicalReasoning(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Basic syllogistic reasoning
        const premises = [
          {
            premise1: "All birds have feathers.",
            premise2: "Robins are birds.",
            conclusion: "Robins have feathers.",
            question: "If all birds have feathers, and robins are birds, what can we conclude about robins?"
          },
          {
            premise1: "All students in this class like math.",
            premise2: "Sarah is a student in this class.",
            conclusion: "Sarah likes math.",
            question: "If all students in this class like math, and Sarah is in this class, what can we conclude?"
          }
        ];
        
        const premise = premises[getRandomInt(0, premises.length - 1)];
        questionText = premise.question;
        options = [premise.conclusion, "We cannot conclude anything", "The opposite is true", "More information is needed"];
        answer = premise.conclusion;
        explanation = `This is a valid logical deduction. From the premises "${premise.premise1}" and "${premise.premise2}", we can logically conclude "${premise.conclusion}".`;
        break;
        
      case DifficultyLevel.MEDIUM:
        // Conditional reasoning and logical fallacies
        const scenarios = [
          {
            scenario: "If it rains, then the ground gets wet. The ground is wet.",
            question: "What can we conclude?",
            options: ["It definitely rained", "It might have rained", "It didn't rain", "The ground is always wet"],
            correct: "It might have rained",
            explanation: "This is the fallacy of affirming the consequent. While rain causes wet ground, wet ground doesn't prove it rained (could be sprinklers, etc.)."
          },
          {
            scenario: "All professional athletes are physically fit. Maria is physically fit.",
            question: "What can we conclude about Maria?",
            options: ["Maria is a professional athlete", "Maria might be a professional athlete", "Maria is not a professional athlete", "We cannot determine if Maria is a professional athlete"],
            correct: "We cannot determine if Maria is a professional athlete",
            explanation: "Being physically fit is necessary for professional athletes, but not sufficient. Many non-athletes are also physically fit."
          }
        ];
        
        const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];
        questionText = `${scenario.scenario}\n\n${scenario.question}`;
        options = scenario.options;
        answer = scenario.correct;
        explanation = scenario.explanation;
        break;
        
      case DifficultyLevel.HARD:
        // Complex logical puzzles
        const puzzles = [
          {
            setup: "In a debate tournament, there are four participants: Alex, Beth, Carlos, and Diana. We know:\n• Alex beats everyone who Beth beats\n• Beth beats Carlos\n• Diana beats Alex\n• Carlos beats Diana",
            question: "Who has the best overall record?",
            options: ["Alex", "Beth", "Carlos", "Diana"],
            correct: "Alex",
            explanation: "Alex beats Beth and Carlos (since Alex beats everyone Beth beats, and Beth beats Carlos). Diana beats Alex, but Carlos beats Diana. Alex has 2 wins, others have 1 each."
          },
          {
            setup: "A company has three departments: Sales, Marketing, and IT. Each department has exactly 3 employees. We know:\n• No employee works in more than one department\n• Exactly 2 employees in Sales have college degrees\n• Exactly 1 employee in Marketing has a college degree\n• Exactly 2 employees in IT have college degrees\n• There are more employees with college degrees than without",
            question: "How many employees have college degrees?",
            options: ["4", "5", "6", "7"],
            correct: "5",
            explanation: "Sales: 2 with degrees, Marketing: 1 with degree, IT: 2 with degrees. Total: 2+1+2=5 employees with degrees out of 9 total."
          }
        ];
        
        const puzzle = puzzles[getRandomInt(0, puzzles.length - 1)];
        questionText = `${puzzle.setup}\n\n${puzzle.question}`;
        options = puzzle.options;
        answer = puzzle.correct;
        explanation = puzzle.explanation;
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'Thinking Skills',
      topic: 'Logical Reasoning',
      difficulty,
      tags: ['logic', 'reasoning', 'deduction', 'critical-thinking'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate advanced pattern recognition questions
  static generatePatternRecognition(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Arithmetic sequences with context
        const start = getRandomInt(5, 20);
        const diff = getRandomInt(3, 8);
        const sequence = [start, start + diff, start + 2*diff, start + 3*diff, start + 4*diff];
        const next = start + 5*diff;
        
        questionText = `A scientist records temperatures each hour: ${sequence.slice(0, 4).join('°, ')}°, ?°\n\nWhat temperature should be recorded next?`;
        options = [next.toString(), (next + 2).toString(), (next - 3).toString(), (next * 2).toString()];
        answer = next.toString();
        explanation = `The temperature increases by ${diff}° each hour. Following this pattern: ${sequence[3]}° + ${diff}° = ${next}°.`;
        break;
        
      case DifficultyLevel.MEDIUM:
        // Geometric and algebraic patterns
        const patterns = [
          {
            sequence: [2, 6, 18, 54],
            rule: "multiply by 3",
            next: 162,
            context: "bacteria population doubles every hour"
          },
          {
            sequence: [1, 4, 9, 16],
            rule: "perfect squares",
            next: 25,
            context: "square garden plots"
          },
          {
            sequence: [3, 7, 15, 31],
            rule: "2n + 1 pattern",
            next: 63,
            context: "computer memory allocation"
          }
        ];
        
        const pattern = patterns[getRandomInt(0, patterns.length - 1)];
        questionText = `In a ${pattern.context} study, researchers observe this sequence: ${pattern.sequence.join(', ')}, ?\n\nWhat comes next?`;
        
        // Generate plausible wrong answers
        const wrongAnswers = [
          pattern.next + getRandomInt(5, 15),
          pattern.next - getRandomInt(3, 10),
          pattern.next * 2,
          Math.floor(pattern.next / 2)
        ].filter(x => x > 0 && x !== pattern.next).slice(0, 3);
        
        options = [pattern.next.toString(), ...wrongAnswers.map(x => x.toString())];
        answer = pattern.next.toString();
        explanation = `This sequence follows the rule: ${pattern.rule}. Therefore, the next value is ${pattern.next}.`;
        break;
        
      case DifficultyLevel.HARD:
        // Complex multi-dimensional patterns
        const complexPatterns = [
          {
            description: "Matrix pattern",
            setup: "In a 3×3 grid, each row and column follows a specific rule:\nRow 1: 2, 8, 32\nRow 2: 3, 12, 48\nRow 3: 4, ?, 64",
            question: "What number should replace the question mark?",
            options: ["16", "20", "24", "28"],
            correct: "16",
            explanation: "Each number in a row is multiplied by 4 to get the next number. In row 3: 4 × 4 = 16."
          },
          {
            description: "Fibonacci-like sequence",
            setup: "A sequence where each term is the sum of the two preceding terms, but starting with different numbers:\n5, 8, 13, 21, 34, ?",
            question: "What is the next number in the sequence?",
            options: ["42", "47", "55", "63"],
            correct: "55",
            explanation: "This follows the Fibonacci pattern: 5+8=13, 8+13=21, 13+21=34, 21+34=55."
          }
        ];
        
        const complexPattern = complexPatterns[getRandomInt(0, complexPatterns.length - 1)];
        questionText = `${complexPattern.setup}\n\n${complexPattern.question}`;
        options = complexPattern.options;
        answer = complexPattern.correct;
        explanation = complexPattern.explanation;
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'Thinking Skills',
      topic: 'Pattern Recognition',
      difficulty,
      tags: ['patterns', 'sequences', 'mathematical-thinking', 'analysis'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate spatial reasoning questions
  static generateSpatialReasoning(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Basic spatial relationships
        questionText = "If you are facing North and turn 90 degrees clockwise, which direction are you now facing?";
        options = ["North", "South", "East", "West"];
        answer = "East";
        explanation = "When facing North, a 90-degree clockwise turn takes you to face East.";
        break;
        
      case DifficultyLevel.MEDIUM:
        // Mental rotation and folding
        const foldingProblems = [
          {
            setup: "A square piece of paper is folded in half twice, creating a smaller square. A hole is punched through all layers.",
            question: "When the paper is unfolded, how many holes will there be?",
            options: ["1", "2", "4", "8"],
            correct: "4",
            explanation: "Folding twice creates 4 layers. One punch creates 4 holes when unfolded."
          },
          {
            setup: "A cube is painted red on all faces, then cut into 27 smaller cubes (3×3×3).",
            question: "How many small cubes have exactly 2 red faces?",
            options: ["8", "12", "6", "0"],
            correct: "12",
            explanation: "Cubes with 2 red faces are on the edges but not corners. A 3×3×3 cube has 12 edge cubes."
          }
        ];
        
        const foldingProblem = foldingProblems[getRandomInt(0, foldingProblems.length - 1)];
        questionText = `${foldingProblem.setup}\n\n${foldingProblem.question}`;
        options = foldingProblem.options;
        answer = foldingProblem.correct;
        explanation = foldingProblem.explanation;
        break;
        
      case DifficultyLevel.HARD:
        // Complex 3D visualization
        const visualizationProblems = [
          {
            setup: "A 4×4×4 cube is built from unit cubes. A tunnel is drilled straight through from the center of one face to the center of the opposite face, removing a 2×2 cross-section of cubes.",
            question: "How many unit cubes remain?",
            options: ["48", "52", "56", "60"],
            correct: "56",
            explanation: "Original cube: 64 cubes. Tunnel removes 2×2×4 = 16 cubes, but the center 2×2×2 = 8 cubes are counted twice, so 64 - 8 = 56 remain."
          },
          {
            setup: "An ant walks on the surface of a cube from one corner to the diagonally opposite corner.",
            question: "What is the shortest path the ant can take? (If the cube has side length 1)",
            options: ["√2", "√3", "√5", "2"],
            correct: "√5",
            explanation: "The ant can 'unfold' the cube faces. The shortest path is the hypotenuse of a 2×1 rectangle: √(2² + 1²) = √5."
          }
        ];
        
        const vizProblem = visualizationProblems[getRandomInt(0, visualizationProblems.length - 1)];
        questionText = `${vizProblem.setup}\n\n${vizProblem.question}`;
        options = vizProblem.options;
        answer = vizProblem.correct;
        explanation = vizProblem.explanation;
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'Thinking Skills',
      topic: 'Spatial Reasoning',
      difficulty,
      tags: ['spatial', 'visualization', '3d-thinking', 'geometry'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate critical analysis questions
  static generateCriticalAnalysis(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Basic argument evaluation
        questionText = `Argument: "All my friends have smartphones, so smartphones must be necessary for happiness."\n\nWhat is the main flaw in this reasoning?`;
        options = [
          "The conclusion doesn't follow from the premise",
          "The premise is false",
          "There are no flaws",
          "The argument is too short"
        ];
        answer = "The conclusion doesn't follow from the premise";
        explanation = "This is a logical fallacy. Having smartphones doesn't prove they're necessary for happiness - there could be many other factors involved.";
        break;
        
      case DifficultyLevel.MEDIUM:
        // Evidence evaluation
        const scenarios = [
          {
            scenario: "A study claims that students who eat breakfast score higher on tests. The study surveyed 100 students from one wealthy school district.",
            question: "What is a major limitation of this study?",
            options: [
              "The sample size is too small",
              "The sample is not representative of all students",
              "The study doesn't prove causation",
              "All of the above"
            ],
            correct: "All of the above",
            explanation: "The study has multiple limitations: small sample size, limited to one wealthy district (not representative), and correlation doesn't prove causation."
          }
        ];
        
        const scenario = scenarios[0];
        questionText = `${scenario.scenario}\n\n${scenario.question}`;
        options = scenario.options;
        answer = scenario.correct;
        explanation = scenario.explanation;
        break;
        
      case DifficultyLevel.HARD:
        // Complex argument analysis
        const complexArguments = [
          {
            argument: "Politician's speech: 'Crime rates have decreased by 15% since I took office. This proves that my tough-on-crime policies are working. My opponent wants to reduce police funding, which will obviously lead to more crime.'",
            question: "Which logical fallacy is most prominent in this argument?",
            options: [
              "Ad hominem attack",
              "False cause (post hoc)",
              "Straw man argument",
              "Appeal to authority"
            ],
            correct: "False cause (post hoc)",
            explanation: "The politician assumes that because crime decreased after taking office, their policies caused the decrease. This is the 'post hoc ergo propter hoc' fallacy - correlation doesn't imply causation."
          }
        ];
        
        const complexArg = complexArguments[0];
        questionText = `${complexArg.argument}\n\n${complexArg.question}`;
        options = complexArg.options;
        answer = complexArg.correct;
        explanation = complexArg.explanation;
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'Thinking Skills',
      topic: 'Critical Analysis',
      difficulty,
      tags: ['critical-thinking', 'argument-analysis', 'logical-fallacies', 'evidence'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Main function to generate enhanced thinking skills questions
export const generateEnhancedThinkingSkillsQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  const questionTypes = [];
  
  // Add appropriate question types based on grade level
  if (gradeNum >= 1) questionTypes.push('pattern');
  if (gradeNum >= 2) questionTypes.push('spatial');
  if (gradeNum >= 3) questionTypes.push('logical');
  if (gradeNum >= 4) questionTypes.push('critical');
  
  const questionType = questionTypes[getRandomInt(0, questionTypes.length - 1)];
  
  switch (questionType) {
    case 'logical':
      return EnhancedThinkingSkillsGenerator.generateLogicalReasoning(grade, difficulty);
    case 'pattern':
      return EnhancedThinkingSkillsGenerator.generatePatternRecognition(grade, difficulty);
    case 'spatial':
      return EnhancedThinkingSkillsGenerator.generateSpatialReasoning(grade, difficulty);
    case 'critical':
      return EnhancedThinkingSkillsGenerator.generateCriticalAnalysis(grade, difficulty);
    default:
      return EnhancedThinkingSkillsGenerator.generatePatternRecognition(grade, difficulty);
  }
};
