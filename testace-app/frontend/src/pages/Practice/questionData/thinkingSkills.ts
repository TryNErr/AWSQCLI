import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 1000; // Start from 1000 to avoid ID conflicts with other question sets
  return () => (counter++).toString();
})();

// Thinking Skills questions for Grade 1
export const grade1ThinkingSkillsQuestions: Question[] = [
  // Grade 1 - Easy
  {
    _id: generateId(),
    content: 'Which shape comes next in this pattern? Circle, Square, Circle, Square, ?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Triangle', 'Circle', 'Square', 'Rectangle'],
    correctAnswer: 'Circle',
    explanation: 'The pattern repeats: Circle, Square, Circle, Square. So the next shape is Circle.',
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty: DifficultyLevel.EASY,
    tags: ['patterns', 'sequences', 'elementary'],
    grade: '1',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for a repeating pattern', 'The shapes follow a specific order']
  },
  // Grade 1 - Medium
  {
    _id: generateId(),
    content: 'If all dogs have tails, and Spot is a dog, what can we say about Spot?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Spot is brown', 'Spot has a tail', 'Spot likes to bark', 'Spot likes to play'],
    correctAnswer: 'Spot has a tail',
    explanation: 'This is a simple logical deduction. If all dogs have tails, and Spot is a dog, then Spot must have a tail.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['logic', 'deduction', 'elementary'],
    grade: '1',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about what is true for all dogs', 'Use the information given to make a conclusion']
  },
  // Grade 1 - Hard
  {
    _id: generateId(),
    content: 'If today is Monday, what day will it be after 3 days?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    correctAnswer: 'Thursday',
    explanation: 'Starting from Monday, after 3 days it would be Thursday (Monday → Tuesday → Wednesday → Thursday).',
    subject: 'Thinking Skills',
    topic: 'Calendar Reasoning',
    difficulty: DifficultyLevel.HARD,
    tags: ['time', 'calendar', 'elementary'],
    grade: '1',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Count forward from Monday', 'Remember the days of the week in order']
  }
];

// Thinking Skills questions for Grade 2
export const grade2ThinkingSkillsQuestions: Question[] = [
  // Grade 2 - Easy
  {
    _id: generateId(),
    content: 'Which number comes next in this pattern? 2, 4, 6, 8, ?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['9', '10', '12', '14'],
    correctAnswer: '10',
    explanation: 'The pattern is counting by 2s (adding 2 each time). After 8, the next number would be 10.',
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty: DifficultyLevel.EASY,
    tags: ['patterns', 'sequences', 'numbers', 'elementary'],
    grade: '2',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look at how the numbers are increasing', 'Find the difference between consecutive numbers']
  },
  // Grade 2 - Medium
  {
    _id: generateId(),
    content: 'Tom is taller than Sam. Sam is taller than Max. Who is the shortest?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Tom', 'Sam', 'Max', 'Cannot be determined'],
    correctAnswer: 'Max',
    explanation: 'If Tom is taller than Sam, and Sam is taller than Max, then Max must be the shortest of the three.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['logic', 'comparison', 'elementary'],
    grade: '2',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Compare the heights in order', 'Think about who is shorter than whom']
  },
  // Grade 2 - Hard
  {
    _id: generateId(),
    content: 'If you have 2 red balls, 3 blue balls, and 1 green ball in a bag, what is the minimum number of balls you need to take out to be sure you have at least one blue ball?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['1', '3', '4', '6'],
    correctAnswer: '4',
    explanation: 'In the worst case, you might pick all the red and green balls first (2 red + 1 green = 3 balls) before getting a blue ball. So you need to pick 3+1=4 balls to be sure you have at least one blue ball.',
    subject: 'Thinking Skills',
    topic: 'Problem Solving',
    difficulty: DifficultyLevel.HARD,
    tags: ['probability', 'problem solving', 'elementary'],
    grade: '2',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about the worst possible scenario', 'Consider which balls you might pick first']
  }
];

// Thinking Skills questions for Grade 3
export const grade3ThinkingSkillsQuestions: Question[] = [
  // Grade 3 - Easy
  {
    _id: generateId(),
    content: 'Which of these is different from the others?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Apple', 'Banana', 'Carrot', 'Orange'],
    correctAnswer: 'Carrot',
    explanation: 'Apple, Banana, and Orange are all fruits, while Carrot is a vegetable.',
    subject: 'Thinking Skills',
    topic: 'Classification',
    difficulty: DifficultyLevel.EASY,
    tags: ['categorization', 'odd one out', 'elementary'],
    grade: '3',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about what category each item belongs to', 'Look for the item that doesn\'t fit with the others']
  },
  // Grade 3 - Medium
  {
    _id: generateId(),
    content: 'If a half of a number is 6 more than a third of the same number, what is the number?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['12', '18', '24', '36'],
    correctAnswer: '36',
    explanation: 'Let\'s call the number x. Then we have: x/2 = x/3 + 6. Multiply all terms by 6: 3x = 2x + 36. So x = 36.',
    subject: 'Thinking Skills',
    topic: 'Algebraic Thinking',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['algebra', 'equations', 'elementary'],
    grade: '3',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Set up an equation using fractions', 'Compare what happens when you take half versus a third of the number']
  },
  // Grade 3 - Hard
  {
    _id: generateId(),
    content: 'A farmer has chickens and cows. There are 8 animals in total with 22 legs. How many chickens does the farmer have?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['3', '5', '6', '7'],
    correctAnswer: '5',
    explanation: 'Chickens have 2 legs and cows have 4 legs. If we have c chickens and (8-c) cows, then: 2c + 4(8-c) = 22. Simplifying: 2c + 32 - 4c = 22, so -2c = -10, and c = 5.',
    subject: 'Thinking Skills',
    topic: 'Problem Solving',
    difficulty: DifficultyLevel.HARD,
    tags: ['word problems', 'algebra', 'elementary'],
    grade: '3',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Count the total number of legs for each type of animal', 'Set up an equation using the total number of animals and legs']
  }
];

// Thinking Skills questions for Grade 4
export const grade4ThinkingSkillsQuestions: Question[] = [
  // Grade 4 - Easy
  {
    _id: generateId(),
    content: 'If you rearrange the letters "NEMO", you would get the name of a:',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['City', 'Animal', 'Country', 'Food'],
    correctAnswer: 'Animal',
    explanation: 'The letters in "NEMO" can be rearranged to spell "OMEN", which is not an animal. However, "NEMO" itself is the name of a fish (as in the movie Finding Nemo).',
    subject: 'Thinking Skills',
    topic: 'Word Problems',
    difficulty: DifficultyLevel.EASY,
    tags: ['anagrams', 'word puzzles', 'elementary'],
    grade: '4',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about the word as it is', 'Consider famous characters with this name']
  },
  // Grade 4 - Medium
  {
    _id: generateId(),
    content: 'If the day after tomorrow is Sunday, what day was it yesterday?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    correctAnswer: 'Thursday',
    explanation: 'If the day after tomorrow is Sunday, then tomorrow is Saturday, today is Friday, and yesterday was Thursday.',
    subject: 'Thinking Skills',
    topic: 'Calendar Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['time', 'calendar', 'elementary'],
    grade: '4',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Work backwards from the future day', 'Map out each day in sequence']
  },
  // Grade 4 - Hard
  {
    _id: generateId(),
    content: 'In a race, Jack finished ahead of Mike, Peter finished behind Simon, and Mike finished ahead of Simon. Who finished last?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Jack', 'Mike', 'Peter', 'Simon'],
    correctAnswer: 'Peter',
    explanation: 'From the given information, we know: Jack > Mike > Simon > Peter (where ">" means "finished ahead of"). So Peter finished last.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.HARD,
    tags: ['logic', 'ordering', 'elementary'],
    grade: '4',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Create an ordering of all the racers', 'Use each clue to determine relative positions']
  }
];

// Thinking Skills questions for Grade 5
export const grade5ThinkingSkillsQuestions: Question[] = [
  // Grade 5 - Easy
  {
    _id: generateId(),
    content: 'Which statement logically follows from these premises? All cats have whiskers. Fluffy is a cat.',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'All animals with whiskers are cats',
      'Fluffy has whiskers',
      'Some cats don\'t have whiskers',
      'Fluffy might have whiskers'
    ],
    correctAnswer: 'Fluffy has whiskers',
    explanation: 'This is a syllogism. If all cats have whiskers, and Fluffy is a cat, then it logically follows that Fluffy has whiskers.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'syllogisms', 'elementary'],
    grade: '5',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Consider what properties all cats must have', 'Use the transitive property of logic']
  },
  // Grade 5 - Medium
  {
    _id: generateId(),
    content: 'What comes next in this sequence? 1, 4, 9, 16, 25, ?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['30', '36', '42', '49'],
    correctAnswer: '36',
    explanation: 'These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25, so the next number would be 6² = 36.',
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['patterns', 'sequences', 'elementary'],
    grade: '5',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for a mathematical relationship', 'Consider operations like squaring or taking roots']
  },
  // Grade 5 - Hard
  {
    _id: generateId(),
    content: 'A box contains 4 red marbles, 3 blue marbles, and 5 green marbles. If you draw 2 marbles at random without replacement, what is the probability of drawing a red marble and then a blue marble?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['4/12 × 3/11', '3/12 × 4/11', '7/12 × 5/11', '4/12 × 5/11'],
    correctAnswer: '4/12 × 3/11',
    explanation: 'The probability of drawing a red marble first is 4/12. After drawing a red marble, there are 11 marbles left, of which 3 are blue. So the probability of drawing a blue marble second is 3/11. The probability of both events occurring is 4/12 × 3/11 = 1/11.',
    subject: 'Thinking Skills',
    topic: 'Probability',
    difficulty: DifficultyLevel.HARD,
    tags: ['probability', 'combinatorics', 'elementary'],
    grade: '5',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Calculate the probability of each event separately', 'Remember that the second draw depends on what happened in the first draw']
  }
];

// Thinking Skills questions for Grade 6
export const grade6ThinkingSkillsQuestions: Question[] = [
  // Grade 6 - Easy
  {
    _id: generateId(),
    content: 'If the following statement is true, which conclusion must also be true? "If it is raining, then the ground is wet." The ground is wet.',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'It is raining',
      'It is not raining',
      'It might be raining',
      'It cannot be determined whether it is raining'
    ],
    correctAnswer: 'It cannot be determined whether it is raining',
    explanation: 'This is an example of the fallacy of affirming the consequent. If P → Q and Q is true, we cannot conclude whether P is true or false. The ground could be wet for other reasons (like a sprinkler).',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'conditionals', 'middle school'],
    grade: '6',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about other reasons the ground might be wet', 'Consider the difference between necessary and sufficient conditions']
  },
  // Grade 6 - Medium
  {
    _id: generateId(),
    content: 'In a certain code, APPLE is written as 1-16-16-12-5. How would ORANGE be written in the same code?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['15-18-1-14-7-5', '15-18-14-7-5', '15-18-1-14-5', '15-18-1-14-7'],
    correctAnswer: '15-18-1-14-7-5',
    explanation: 'In this code, each letter is replaced by its position in the alphabet: A=1, P=16, L=12, E=5. Similarly, O=15, R=18, A=1, N=14, G=7, E=5. So ORANGE would be 15-18-1-14-7-5.',
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['codes', 'patterns', 'middle school'],
    grade: '6',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for a relationship between the letters and numbers', 'Consider the position of each letter in the alphabet']
  },
  // Grade 6 - Hard
  {
    _id: generateId(),
    content: 'Five people – Alex, Bella, Carlos, Diana, and Ethan – are sitting in a row. If Alex is not sitting next to Bella, Carlos is sitting next to Diana, and Ethan is at one end, which of the following must be true?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Alex is sitting at one end',
      'Bella is sitting in the middle',
      'Carlos is sitting next to Ethan',
      'Diana is sitting next to Ethan'
    ],
    correctAnswer: 'Carlos is sitting next to Ethan',
    explanation: 'Since Ethan is at one end and Carlos is next to Diana, there are limited possibilities. If Carlos and Diana are together, and Alex and Bella are not together, then either Carlos or Diana must be next to Ethan. Working through the possibilities, we find that Carlos must be next to Ethan.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.HARD,
    tags: ['logic', 'ordering', 'middle school'],
    grade: '6',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Draw out the possible seating arrangements', 'Use the constraints to eliminate possibilities']
  }
];
// Thinking Skills questions for Grade 7
export const grade7ThinkingSkillsQuestions: Question[] = [
  // Grade 7 - Easy
  {
    _id: generateId(),
    content: 'Which of the following is an example of a non sequitur fallacy?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'All humans are mortal. Socrates is human. Therefore, Socrates is mortal.',
      'The weather forecast said it would rain, but it didn\'t. Therefore, weather forecasts are always wrong.',
      'She got an A on the test, so she must be very intelligent.',
      'The restaurant was crowded, so the food must be good.'
    ],
    correctAnswer: 'The restaurant was crowded, so the food must be good.',
    explanation: 'A non sequitur fallacy occurs when the conclusion doesn\'t logically follow from the premises. The fact that a restaurant is crowded doesn\'t necessarily mean the food is good (there could be other reasons for the crowd).',
    subject: 'Thinking Skills',
    topic: 'Logical Fallacies',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'fallacies', 'middle school'],
    grade: '7',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for conclusions that don\'t necessarily follow from the premises', 'Identify where the logical connection is weak']
  },
  // Grade 7 - Medium
  {
    _id: generateId(),
    content: 'If the following statement is true, which conclusion must also be true? "If it is raining, then the ground is wet." The ground is not wet.',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'It is raining',
      'It is not raining',
      'The ground is dry',
      'It might be raining'
    ],
    correctAnswer: 'It is not raining',
    explanation: 'This is an example of modus tollens (denying the consequent). If P → Q and not Q, then not P. Here, P is "it is raining" and Q is "the ground is wet". Since the ground is not wet, it cannot be raining.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['logic', 'conditionals', 'middle school'],
    grade: '7',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about the contrapositive of the statement', 'Consider what must be true if the ground is not wet']
  },
  // Grade 7 - Hard
  {
    _id: generateId(),
    content: 'In a survey, 65% of respondents said they prefer product A, and 55% said they prefer product B. What is the minimum percentage of respondents who must prefer both products?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['0%', '20%', '35%', '45%'],
    correctAnswer: '20%',
    explanation: 'Let\'s call the percentage who prefer both products x. We know that (percentage who prefer A) + (percentage who prefer B) - (percentage who prefer both) = (percentage who prefer at least one). Since the maximum percentage is 100%, we have: 65% + 55% - x ≤ 100%. Solving for x: x ≥ 65% + 55% - 100% = 20%. So at least 20% must prefer both products.',
    subject: 'Thinking Skills',
    topic: 'Set Theory',
    difficulty: DifficultyLevel.HARD,
    tags: ['logic', 'sets', 'middle school'],
    grade: '7',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Use the inclusion-exclusion principle', 'Consider the maximum possible percentage of people who could prefer at least one product']
  }
];

// Thinking Skills questions for Grade 8
export const grade8ThinkingSkillsQuestions: Question[] = [
  // Grade 8 - Easy
  {
    _id: generateId(),
    content: 'In a valid deductive argument:',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'The premises must be true',
      'The conclusion must be true',
      'If the premises are true, the conclusion must be true',
      'The premises and conclusion must be related to the same topic'
    ],
    correctAnswer: 'If the premises are true, the conclusion must be true',
    explanation: 'A valid deductive argument is one where the conclusion necessarily follows from the premises. This means that if the premises are true, the conclusion must also be true. The actual truth of the premises is a separate issue.',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'arguments', 'middle school'],
    grade: '8',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about the relationship between premises and conclusion', 'Consider what makes an argument valid versus sound']
  },
  // Grade 8 - Medium
  {
    _id: generateId(),
    content: 'Which of the following best exemplifies the principle of Occam\'s Razor?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'The most complex explanation is usually correct',
      'The simplest explanation that fits the evidence is usually best',
      'Truth is relative to the observer',
      'Scientific theories should be tested through experimentation'
    ],
    correctAnswer: 'The simplest explanation that fits the evidence is usually best',
    explanation: 'Occam\'s Razor is the principle that states that among competing hypotheses, the one with the fewest assumptions should be selected. In other words, the simplest explanation that fits the evidence is usually the best.',
    subject: 'Thinking Skills',
    topic: 'Scientific Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['philosophy', 'science', 'middle school'],
    grade: '8',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about how scientists choose between competing theories', 'Consider the role of simplicity in explanation']
  },
  // Grade 8 - Hard
  {
    _id: generateId(),
    content: 'A box contains 3 red balls, 4 blue balls, and 5 green balls. If you draw 2 balls at random without replacement, what is the probability of drawing a red ball and then a blue ball?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['3/12', '12/132', '3/12 × 4/11', '7/12'],
    correctAnswer: '3/12 × 4/11',
    explanation: 'The probability of drawing a red ball first is 3/12. After drawing a red ball, there are 11 balls left, of which 4 are blue. So the probability of drawing a blue ball second is 4/11. The probability of both events occurring is 3/12 × 4/11 = 1/11.',
    subject: 'Thinking Skills',
    topic: 'Probability',
    difficulty: DifficultyLevel.HARD,
    tags: ['probability', 'combinatorics', 'middle school'],
    grade: '8',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Calculate the probability of each event separately', 'Remember that the second draw depends on what happened in the first draw']
  }
];

// Thinking Skills questions for Grade 9
export const grade9ThinkingSkillsQuestions: Question[] = [
  // Grade 9 - Easy
  {
    _id: generateId(),
    content: 'Which of the following is an example of confirmation bias?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Changing your opinion when presented with new evidence',
      'Only remembering the times when your horoscope was accurate',
      'Preferring one scientific theory over another because it has more supporting evidence',
      'Believing something because an expert said it was true'
    ],
    correctAnswer: 'Only remembering the times when your horoscope was accurate',
    explanation: 'Confirmation bias is the tendency to search for, interpret, favor, and recall information in a way that confirms one\'s preexisting beliefs. Only remembering when a horoscope was accurate while forgetting the times it was wrong is a classic example of this bias.',
    subject: 'Thinking Skills',
    topic: 'Cognitive Biases',
    difficulty: DifficultyLevel.EASY,
    tags: ['psychology', 'biases', 'high school'],
    grade: '9',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for selective attention to evidence', 'Consider how people might ignore information that contradicts their beliefs']
  },
  // Grade 9 - Medium
  {
    _id: generateId(),
    content: 'Which of the following statements is logically equivalent to "If I study, then I will pass the exam"?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'If I pass the exam, then I studied',
      'If I do not study, then I will not pass the exam',
      'If I do not pass the exam, then I did not study',
      'I will study and pass the exam'
    ],
    correctAnswer: 'If I do not pass the exam, then I did not study',
    explanation: 'The contrapositive of "If P, then Q" is "If not Q, then not P," and these are logically equivalent. So "If I study, then I will pass the exam" is equivalent to "If I do not pass the exam, then I did not study."',
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['logic', 'conditionals', 'high school'],
    grade: '9',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Consider the contrapositive of the statement', 'Remember that "if P then Q" is equivalent to "if not Q then not P"']
  },
  // Grade 9 - Hard
  {
    _id: generateId(),
    content: 'In how many ways can 5 different books be arranged on a shelf?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['5', '25', '120', '720'],
    correctAnswer: '120',
    explanation: 'This is a permutation problem. The number of ways to arrange 5 different books is 5! = 5 × 4 × 3 × 2 × 1 = 120.',
    subject: 'Thinking Skills',
    topic: 'Combinatorics',
    difficulty: DifficultyLevel.HARD,
    tags: ['permutations', 'counting', 'high school'],
    grade: '9',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about how many options you have for the first position, then the second, and so on', 'This is a factorial calculation']
  }
];
// Thinking Skills questions for Grade 10
export const grade10ThinkingSkillsQuestions: Question[] = [
  // Grade 10 - Easy
  {
    _id: generateId(),
    content: 'Which of the following is an example of an ad hominem fallacy?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Everyone believes that climate change is real, so it must be true',
      'We shouldn\'t listen to his argument about economics because he dropped out of college',
      'If we allow students to use calculators, they\'ll never learn basic math',
      'Either we reduce carbon emissions or the planet will warm by 2 degrees'
    ],
    correctAnswer: 'We shouldn\'t listen to his argument about economics because he dropped out of college',
    explanation: 'An ad hominem fallacy attacks the person making the argument rather than addressing the argument itself. Dismissing someone\'s economic argument because they dropped out of college attacks their character/credentials rather than their actual points.',
    subject: 'Thinking Skills',
    topic: 'Logical Fallacies',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'fallacies', 'high school'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for an attack on the person rather than their argument', 'Consider whether personal characteristics are being used to dismiss ideas']
  },
  // Grade 10 - Medium
  {
    _id: generateId(),
    content: 'In a formal debate, which of the following is NOT a valid form of refutation?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Pointing out logical fallacies in the opponent\'s argument',
      'Presenting counter-evidence that contradicts the opponent\'s claims',
      'Showing that the opponent\'s premises don\'t support their conclusion',
      'Mentioning that the opponent has changed their position on the issue in the past'
    ],
    correctAnswer: 'Mentioning that the opponent has changed their position on the issue in the past',
    explanation: 'In formal debate, refutation should address the argument itself, not the person making it. Pointing out that someone changed their position in the past is a form of ad hominem attack (specifically the tu quoque or "you too" fallacy) and doesn\'t address the current argument\'s merits.',
    subject: 'Thinking Skills',
    topic: 'Argumentation',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['debate', 'logic', 'high school'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Consider which option focuses on the person rather than the argument', 'Think about what makes a refutation valid in formal debate']
  },
  // Grade 10 - Hard
  {
    _id: generateId(),
    content: 'In a logic puzzle, you encounter three people: Amy, Bob, and Cal. One always tells the truth, one always lies, and one alternates between truth and lies (starting with a truth today). They make the following statements:\nAmy: "Bob is the one who always lies."\nBob: "Cal is not the one who always tells the truth."\nCal: "I always tell the truth."\nWho always lies?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Amy', 'Bob', 'Cal', 'Cannot be determined'],
    correctAnswer: 'Cal',
    explanation: 'Let\'s analyze each possibility. If Amy always tells the truth, then Bob always lies, and Cal alternates. But then Cal\'s statement "I always tell the truth" would be a lie (since Cal alternates), which is inconsistent. If Bob always tells the truth, then Cal is not the truth-teller, and Amy\'s statement is a lie, making Amy the liar. But this means Cal alternates, and Cal\'s statement would be a lie, which is consistent. If Cal always tells the truth, then Cal\'s statement is true, but Bob\'s statement would be a lie, making Bob the liar. But then Amy\'s statement would be true, making Amy the truth-teller. This is inconsistent because we can\'t have two truth-tellers. Therefore, Cal must be the liar.',
    subject: 'Thinking Skills',
    topic: 'Logic Puzzles',
    difficulty: DifficultyLevel.HARD,
    tags: ['puzzles', 'deduction', 'high school'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Try each possibility and check for consistency', 'Remember that the alternating person starts with truth today']
  }
];

// Thinking Skills questions for Grade 11
export const grade11ThinkingSkillsQuestions: Question[] = [
  // Grade 11 - Easy
  {
    _id: generateId(),
    content: 'Which of the following is an example of a straw man fallacy?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Sarah says we should increase funding for public transportation, but that would mean higher taxes',
      'John argues for stricter gun control, but his opponent responds by saying John wants to take away everyone\'s constitutional rights',
      'If we allow students to use calculators in math class, they\'ll never learn basic arithmetic',
      'The mayor must be corrupt because three of his associates were convicted of fraud'
    ],
    correctAnswer: 'John argues for stricter gun control, but his opponent responds by saying John wants to take away everyone\'s constitutional rights',
    explanation: 'A straw man fallacy involves misrepresenting someone\'s argument to make it easier to attack. The opponent exaggerates John\'s position on gun control (which could involve background checks, waiting periods, etc.) to make it seem like he wants to eliminate constitutional rights entirely.',
    subject: 'Thinking Skills',
    topic: 'Logical Fallacies',
    difficulty: DifficultyLevel.EASY,
    tags: ['logic', 'fallacies', 'high school'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for a misrepresentation or exaggeration of someone\'s position', 'Consider which response doesn\'t address the actual argument made']
  },
  // Grade 11 - Medium
  {
    _id: generateId(),
    content: 'In a study of correlation versus causation, researchers found that ice cream sales and drowning deaths both increase during summer months. Which conclusion is most valid?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Eating ice cream causes people to drown',
      'Drowning causes people to buy more ice cream',
      'Both ice cream sales and drowning are influenced by a third factor: warm weather',
      'There is no relationship between ice cream sales and drowning deaths'
    ],
    correctAnswer: 'Both ice cream sales and drowning are influenced by a third factor: warm weather',
    explanation: 'This is a classic example of correlation not implying causation. Both ice cream sales and drowning deaths increase during summer months because of a common cause: warm weather. People buy more ice cream when it\'s hot, and more people swim (leading to more drowning accidents) when it\'s hot.',
    subject: 'Thinking Skills',
    topic: 'Statistical Reasoning',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['statistics', 'causation', 'high school'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Consider whether there could be a common cause for both phenomena', 'Remember that correlation does not imply causation']
  },
  // Grade 11 - Hard
  {
    _id: generateId(),
    content: 'In a certain town, 60% of the residents like coffee, 70% like tea, and 40% like both coffee and tea. What percentage of the residents like neither coffee nor tea?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['0%', '10%', '30%', '40%'],
    correctAnswer: '10%',
    explanation: 'Using the inclusion-exclusion principle: P(coffee OR tea) = P(coffee) + P(tea) - P(coffee AND tea) = 60% + 70% - 40% = 90%. Therefore, P(neither coffee nor tea) = 100% - P(coffee OR tea) = 100% - 90% = 10%.',
    subject: 'Thinking Skills',
    topic: 'Set Theory',
    difficulty: DifficultyLevel.HARD,
    tags: ['probability', 'sets', 'high school'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Use the inclusion-exclusion principle', 'Calculate the percentage who like at least one beverage first']
  }
];

// Thinking Skills questions for Grade 12
export const grade12ThinkingSkillsQuestions: Question[] = [
  // Grade 12 - Easy
  {
    _id: generateId(),
    content: 'Which of the following is an example of the gambler\'s fallacy?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Believing that a coin that has landed on heads five times in a row is "due" to land on tails next',
      'Thinking that wearing your lucky socks will help you win at poker',
      'Calculating the odds of winning before placing a bet',
      'Quitting while you\'re ahead to secure your winnings'
    ],
    correctAnswer: 'Believing that a coin that has landed on heads five times in a row is "due" to land on tails next',
    explanation: 'The gambler\'s fallacy is the mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is an independent event with a 50% chance of heads, regardless of previous flips.',
    subject: 'Thinking Skills',
    topic: 'Probability Fallacies',
    difficulty: DifficultyLevel.EASY,
    tags: ['probability', 'fallacies', 'high school'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Think about independence of events', 'Consider which option involves a misunderstanding of probability']
  },
  // Grade 12 - Medium
  {
    _id: generateId(),
    content: 'In formal logic, which of the following statements is the contrapositive of "If it is raining, then the ground is wet"?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'If the ground is wet, then it is raining',
      'If it is not raining, then the ground is not wet',
      'If the ground is not wet, then it is not raining',
      'If the ground is wet, then it is not raining'
    ],
    correctAnswer: 'If the ground is not wet, then it is not raining',
    explanation: 'The contrapositive of a conditional statement "If P, then Q" is "If not Q, then not P." For the statement "If it is raining (P), then the ground is wet (Q)," the contrapositive is "If the ground is not wet (not Q), then it is not raining (not P)."',
    subject: 'Thinking Skills',
    topic: 'Formal Logic',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['logic', 'conditionals', 'high school'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['The contrapositive involves negating both parts and reversing the order', 'Remember that the contrapositive is logically equivalent to the original statement']
  },
  // Grade 12 - Hard
  {
    _id: generateId(),
    content: 'A researcher wants to test whether a new teaching method improves student performance. Which of the following experimental designs would be most valid?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Compare test scores before and after implementing the new method with the same group of students',
      'Survey teachers about whether they think the new method is effective',
      'Randomly assign students to either the new method or the traditional method and compare their test scores',
      'Implement the new method in schools where test scores are low and see if they improve'
    ],
    correctAnswer: 'Randomly assign students to either the new method or the traditional method and compare their test scores',
    explanation: 'This is a randomized controlled trial, which is the gold standard for experimental design. Random assignment helps ensure that the groups are comparable at baseline, so any differences in outcomes can be attributed to the intervention (the new teaching method) rather than to pre-existing differences between the groups.',
    subject: 'Thinking Skills',
    topic: 'Research Methods',
    difficulty: DifficultyLevel.HARD,
    tags: ['research', 'methodology', 'high school'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Consider which design best controls for confounding variables', 'Think about the importance of having a control group and random assignment']
  }
];

// Export all Thinking Skills questions combined
export const allThinkingSkillsQuestions: Question[] = [
  ...grade1ThinkingSkillsQuestions,
  ...grade2ThinkingSkillsQuestions,
  ...grade3ThinkingSkillsQuestions,
  ...grade4ThinkingSkillsQuestions,
  ...grade5ThinkingSkillsQuestions,
  ...grade6ThinkingSkillsQuestions,
  ...grade7ThinkingSkillsQuestions,
  ...grade8ThinkingSkillsQuestions,
  ...grade9ThinkingSkillsQuestions,
  ...grade10ThinkingSkillsQuestions,
  ...grade11ThinkingSkillsQuestions,
  ...grade12ThinkingSkillsQuestions
];
