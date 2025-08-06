import { DifficultyLevel, QuestionType, Question } from '../../../types';

/**
 * Enhanced Thinking Skills Questions
 * 
 * Based on analysis of Grade 4 OC Thinking Skills paper, these questions
 * cover sophisticated thinking skills across all grade levels:
 * 
 * Categories:
 * 1. Pattern Recognition & Sequences
 * 2. Spatial Reasoning & Directions  
 * 3. Logical Deduction & Syllogisms
 * 4. Problem Solving & Constraints
 * 5. Critical Thinking & Argument Analysis
 * 6. Sequential Logic & Ordering
 * 7. Mathematical Reasoning
 * 8. Assumption Identification
 */

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 8000; // Start from 8000 to avoid conflicts
  return () => (counter++).toString();
})();

// Grade 1-3: Foundation Thinking Skills
const foundationThinkingSkills: Question[] = [
  {
    _id: generateId(),
    content: 'Look at this pattern: Red, Blue, Red, Blue, Red, ?\n\nWhat comes next?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Blue', 'Red', 'Green', 'Yellow'],
    correctAnswer: 'Blue',
    explanation: 'The pattern alternates between Red and Blue. After Red comes Blue.',
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty: DifficultyLevel.EASY,
    grade: '1',
    tags: ['pattern', 'sequence', 'colors'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'The toy box is next to the bed. The bed is next to the window.\n\nWhat is next to the window?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['The bed', 'The door', 'The chair', 'The table'],
    correctAnswer: 'The bed',
    explanation: 'If the bed is next to the window, then the bed is what is next to the window.',
    subject: 'Thinking Skills',
    topic: 'Spatial Reasoning',
    difficulty: DifficultyLevel.EASY,
    grade: '2',
    tags: ['spatial', 'position', 'logic'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'All cats say "meow". Fluffy is a cat.\n\nWhat does Fluffy say?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Meow', 'Woof', 'Chirp', 'Moo'],
    correctAnswer: 'Meow',
    explanation: 'If all cats say "meow" and Fluffy is a cat, then Fluffy says "meow".',
    subject: 'Thinking Skills',
    topic: 'Simple Logic',
    difficulty: DifficultyLevel.EASY,
    grade: '3',
    tags: ['logic', 'deduction', 'animals'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Grade 4-6: Intermediate Thinking Skills
const intermediateThinkingSkills: Question[] = [
  {
    _id: generateId(),
    content: 'A painter needs to paint rooms. Each room needs 3 liters of paint. The painter has 15 liters of paint.\n\nHow many complete rooms can be painted?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['4 rooms', '5 rooms', '6 rooms', '3 rooms'],
    correctAnswer: '5 rooms',
    explanation: '15 liters ÷ 3 liters per room = 5 complete rooms.',
    subject: 'Thinking Skills',
    topic: 'Problem Solving',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '4',
    tags: ['problem-solving', 'division', 'practical-math'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'In a town, the library is north of the school. The school is east of the park. The hospital is south of the school.\n\nWhat is west of the hospital?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['The park', 'The library', 'The school', 'Nothing mentioned'],
    correctAnswer: 'The park',
    explanation: 'The park is west of the school, and the hospital is directly south of the school, so the park is west of the hospital.',
    subject: 'Thinking Skills',
    topic: 'Spatial Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '5',
    tags: ['spatial', 'directions', 'mapping'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'All students who failed the test are in small classes. Maria is in a large class.\n\nWhat can we conclude about Maria?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Maria passed the test', 'Maria failed the test', 'Maria might have failed', 'We cannot tell'],
    correctAnswer: 'Maria passed the test',
    explanation: 'If all students who failed are in small classes, and Maria is in a large class, then Maria must have passed.',
    subject: 'Thinking Skills',
    topic: 'Logical Deduction',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '6',
    tags: ['logic', 'deduction', 'contrapositive'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Grade 7-9: Advanced Thinking Skills
const advancedThinkingSkills: Question[] = [
  {
    _id: generateId(),
    content: 'In a race: Alex finished before Ben and Carol. Diana finished before Alex but after Emma.\n\nWhich of the following must be true?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Emma finished before Ben', 'Carol finished last', 'Diana finished second', 'Alex finished first'],
    correctAnswer: 'Emma finished before Ben',
    explanation: 'Order: Emma → Diana → Alex → Ben/Carol. Emma definitely finished before Ben.',
    subject: 'Thinking Skills',
    topic: 'Sequential Logic',
    difficulty: DifficultyLevel.HARD,
    grade: '7',
    tags: ['ordering', 'sequence', 'logical-deduction'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Jake: "Video games cause violence because many violent people play video games."\n\nWhat is the main flaw in Jake\'s reasoning?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Correlation does not imply causation', 'Video games are not violent', 'Not all gamers are violent', 'The sample size is too small'],
    correctAnswer: 'Correlation does not imply causation',
    explanation: 'Just because violent people play video games doesn\'t mean video games cause violence. This confuses correlation with causation.',
    subject: 'Thinking Skills',
    topic: 'Critical Thinking',
    difficulty: DifficultyLevel.HARD,
    grade: '8',
    tags: ['critical-thinking', 'logical-fallacies', 'causation'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'A team of 8 people pass a ball. A girl starts and passes to a boy. Later, a boy starts and passes to another boy.\n\nWhat must be true about the team?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['There are at least 2 boys', 'There are exactly 4 boys and 4 girls', 'There are more boys than girls', 'There are at least 3 girls'],
    correctAnswer: 'There are at least 2 boys',
    explanation: 'Since a boy passed to another boy, there must be at least 2 boys. We also know there\'s at least 1 girl.',
    subject: 'Thinking Skills',
    topic: 'Mathematical Reasoning',
    difficulty: DifficultyLevel.HARD,
    grade: '9',
    tags: ['math-reasoning', 'logic', 'constraints'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Grade 10-12: Expert Thinking Skills
const expertThinkingSkills: Question[] = [
  {
    _id: generateId(),
    content: 'Five colored boxes are arranged: Purple is 2 places from Blue and immediately left of Green. Yellow is rightmost and next to Blue. The treasure is left of Blue and not Yellow.\n\nWhich box contains the treasure?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Red', 'Purple', 'Green', 'Blue'],
    correctAnswer: 'Red',
    explanation: 'Working through constraints: Purple-Green-Red-Blue-Yellow. Red is left of Blue and not Yellow, so Red contains the treasure.',
    subject: 'Thinking Skills',
    topic: 'Complex Constraints',
    difficulty: DifficultyLevel.HARD,
    grade: '10',
    tags: ['constraints', 'logic-puzzle', 'deduction'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Dr. Smith: "This new medicine is effective because 80% of patients who took it recovered."\n\nWhich assumption is Dr. Smith making?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Patients wouldn\'t recover without the medicine', 'The medicine has no side effects', '80% is a high recovery rate', 'All patients took the medicine correctly'],
    correctAnswer: 'Patients wouldn\'t recover without the medicine',
    explanation: 'Dr. Smith assumes the recovery is due to the medicine, not considering that patients might recover naturally without treatment.',
    subject: 'Thinking Skills',
    topic: 'Assumption Analysis',
    difficulty: DifficultyLevel.HARD,
    grade: '11',
    tags: ['assumptions', 'medical-reasoning', 'causation'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'A study claims: "Students who eat breakfast score higher on tests." The study compared 100 breakfast-eaters with 100 non-breakfast-eaters.\n\nWhat additional information would most strengthen this conclusion?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Controlling for socioeconomic factors', 'Testing more students', 'Using different types of breakfast', 'Measuring different subjects'],
    correctAnswer: 'Controlling for socioeconomic factors',
    explanation: 'Socioeconomic status could be a confounding variable - wealthier families might both provide breakfast and better educational support.',
    subject: 'Thinking Skills',
    topic: 'Research Analysis',
    difficulty: DifficultyLevel.HARD,
    grade: '12',
    tags: ['research-methods', 'confounding-variables', 'causation'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Additional sophisticated questions across all categories
const sophisticatedQuestions: Question[] = [
  {
    _id: generateId(),
    content: 'If 3 machines produce 300 widgets in 3 hours, how many widgets can 5 machines produce in 5 hours?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['833 widgets', '500 widgets', '750 widgets', '1000 widgets'],
    correctAnswer: '833 widgets',
    explanation: 'Rate per machine per hour: 300÷(3×3)=33.33 widgets. 5 machines × 5 hours × 33.33 = 833 widgets.',
    subject: 'Thinking Skills',
    topic: 'Proportional Reasoning',
    difficulty: DifficultyLevel.HARD,
    grade: '8',
    tags: ['proportions', 'rates', 'mathematical-reasoning'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Workshop schedule: Dance (10:30-11:30), Singing (11:45-12:45), Art (1:00-2:00), Drama (2:30-3:30).\n\nMaximum workshops one person can attend?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['4 workshops', '3 workshops', '2 workshops', '1 workshop'],
    correctAnswer: '4 workshops',
    explanation: 'All workshops have sufficient gaps: 15 minutes between Dance-Singing, 15 minutes between Singing-Art, 30 minutes between Art-Drama.',
    subject: 'Thinking Skills',
    topic: 'Scheduling Logic',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '6',
    tags: ['scheduling', 'time-management', 'optimization'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Sarah: "I saw only 9 students with casts at assembly. Since 12 students were injured last week, 3 must have recovered."\n\nWhat assumption did Sarah make?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['All injured students attended assembly', 'Injured students always wear casts', 'No new students were injured', 'Casts are always visible'],
    correctAnswer: 'All injured students attended assembly',
    explanation: 'Sarah assumed all 12 injured students were at the assembly, but some might have been absent for various reasons.',
    subject: 'Thinking Skills',
    topic: 'Assumption Identification',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '7',
    tags: ['assumptions', 'logical-reasoning', 'attendance'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'A cube made of smaller cubes is shown from one angle where you can see 3 faces.\n\nHow many faces of the cube are hidden from this viewpoint?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['3 faces', '2 faces', '4 faces', '1 face'],
    correctAnswer: '3 faces',
    explanation: 'A cube has 6 faces total. If 3 faces are visible from one viewpoint, then 6 - 3 = 3 faces are hidden.',
    subject: 'Thinking Skills',
    topic: '3D Visualization',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '5',
    tags: ['3d-visualization', 'geometry', 'spatial-reasoning'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Pattern: 2, 6, 18, 54, ?\n\nWhat number comes next?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['162', '108', '72', '216'],
    correctAnswer: '162',
    explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.',
    subject: 'Thinking Skills',
    topic: 'Number Patterns',
    difficulty: DifficultyLevel.MEDIUM,
    grade: '4',
    tags: ['number-patterns', 'multiplication', 'sequences'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Tom: "Electric cars are better for the environment because they produce zero emissions."\n\nWhich statement best challenges Tom\'s argument?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Electricity production may create emissions', 'Electric cars are more expensive', 'Electric cars are slower', 'Gasoline cars are more reliable'],
    correctAnswer: 'Electricity production may create emissions',
    explanation: 'While electric cars don\'t produce direct emissions, the electricity they use might come from fossil fuel power plants that do create emissions.',
    subject: 'Thinking Skills',
    topic: 'Argument Analysis',
    difficulty: DifficultyLevel.HARD,
    grade: '9',
    tags: ['argument-analysis', 'environmental-reasoning', 'indirect-effects'],
    createdBy: 'enhanced-system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Combine all questions
const allEnhancedThinkingSkills: Question[] = [
  ...foundationThinkingSkills,
  ...intermediateThinkingSkills,
  ...advancedThinkingSkills,
  ...expertThinkingSkills,
  ...sophisticatedQuestions
];

// Create grade-specific exports
export const grade1EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '1');
export const grade2EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '2');
export const grade3EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '3');
export const grade4EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '4');
export const grade5EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '5');
export const grade6EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '6');
export const grade7EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '7');
export const grade8EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '8');
export const grade9EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '9');
export const grade10EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '10');
export const grade11EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '11');
export const grade12EnhancedThinkingSkills = allEnhancedThinkingSkills.filter(q => q.grade === '12');

// Export all questions
export const enhancedThinkingSkillsQuestions = allEnhancedThinkingSkills;

export default enhancedThinkingSkillsQuestions;
