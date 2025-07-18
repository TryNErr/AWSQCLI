import { DifficultyLevel, QuestionType, Question } from '../../../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 300; // Start from 300 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Questions for grades 10-12
export const grade10to12Questions: Question[] = [
  // Grade 10 - Math
  {
    _id: generateId(),
    content: 'Solve the quadratic equation: 2x² + 5x - 3 = 0',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['x = -3, x = 1/2', 'x = 3, x = -1/2', 'x = -3, x = -1/2', 'x = 3, x = 1/2'],
    correctAnswer: 'x = -3, x = 1/2',
    explanation: 'Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a, where a = 2, b = 5, c = -3. x = (-5 ± √(25 + 24)) / 4 = (-5 ± √49) / 4 = (-5 ± 7) / 4. So x = (-5 + 7) / 4 = 1/2 or x = (-5 - 7) / 4 = -3.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['algebra', 'quadratic equations'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the value of sin(30°)?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['1/4', '1/3', '1/2', '√3/2'],
    correctAnswer: '1/2',
    explanation: 'The sine of 30° (or π/6 radians) is 1/2. This is one of the standard trigonometric values.',
    subject: 'Math',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['trigonometry', 'angles'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the domain of the function f(x) = √(x - 2)?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['x ≥ 0', 'x ≥ 2', 'x > 0', 'x > 2'],
    correctAnswer: 'x ≥ 2',
    explanation: 'For the square root function to be defined in the real number system, the expression inside the square root must be non-negative. So, x - 2 ≥ 0, which means x ≥ 2.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['functions', 'domain'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the equation of a circle with center (2, -3) and radius 4?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      '(x - 2)² + (y + 3)² = 16',
      '(x - 2)² + (y - 3)² = 16',
      '(x + 2)² + (y - 3)² = 16',
      '(x + 2)² + (y + 3)² = 16'
    ],
    correctAnswer: '(x - 2)² + (y + 3)² = 16',
    explanation: 'The equation of a circle with center (h, k) and radius r is (x - h)² + (y - k)² = r². With center (2, -3) and radius 4, we get (x - 2)² + (y - (-3))² = 4², which simplifies to (x - 2)² + (y + 3)² = 16.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['geometry', 'circles'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Simplify the expression: log₃(27)',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['1', '2', '3', '9'],
    correctAnswer: '3',
    explanation: 'log₃(27) = log₃(3³) = 3. This is because if log₃(x) = y, then 3^y = x. Here, 3³ = 27, so log₃(27) = 3.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['logarithms', 'algebra'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Grade 10 - Science
  {
    _id: generateId(),
    content: 'Which of these is the correct formula for calculating acceleration?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Acceleration = Velocity × Time',
      'Acceleration = Velocity ÷ Time',
      'Acceleration = Change in velocity ÷ Time',
      'Acceleration = Distance ÷ Time²'
    ],
    correctAnswer: 'Acceleration = Change in velocity ÷ Time',
    explanation: 'Acceleration is the rate of change of velocity with respect to time. It is calculated as the change in velocity divided by the time taken for that change.',
    subject: 'Science',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['physics', 'motion'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the main function of the Golgi apparatus in a cell?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Energy production',
      'Protein synthesis',
      'Processing and packaging proteins',
      'Breaking down waste materials'
    ],
    correctAnswer: 'Processing and packaging proteins',
    explanation: 'The Golgi apparatus is responsible for processing, sorting, and packaging proteins and lipids for storage in the cell or secretion outside the cell.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['biology', 'cells'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Which of these elements has the highest electronegativity?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Sodium (Na)', 'Carbon (C)', 'Oxygen (O)', 'Fluorine (F)'],
    correctAnswer: 'Fluorine (F)',
    explanation: 'Fluorine (F) has the highest electronegativity of all elements on the periodic table, making it the most electronegative element.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['chemistry', 'periodic table'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the difference between an ionic and a covalent bond?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Ionic bonds involve sharing electrons, while covalent bonds involve transferring electrons',
      'Ionic bonds involve transferring electrons, while covalent bonds involve sharing electrons',
      'Ionic bonds occur between metals, while covalent bonds occur between non-metals',
      'Ionic bonds are stronger than covalent bonds'
    ],
    correctAnswer: 'Ionic bonds involve transferring electrons, while covalent bonds involve sharing electrons',
    explanation: 'In ionic bonding, one atom transfers electrons to another atom, creating oppositely charged ions that attract each other. In covalent bonding, atoms share electron pairs to achieve a more stable electron configuration.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['chemistry', 'bonding'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Which of these is NOT a greenhouse gas?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Carbon dioxide (CO₂)', 'Methane (CH₄)', 'Nitrogen (N₂)', 'Water vapor (H₂O)'],
    correctAnswer: 'Nitrogen (N₂)',
    explanation: 'Nitrogen (N₂) is not a greenhouse gas. The main greenhouse gases include carbon dioxide, methane, water vapor, nitrous oxide, and ozone.',
    subject: 'Science',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['environmental science', 'atmosphere'],
    grade: '10',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Grade 11 - Math
  {
    _id: generateId(),
    content: 'What is the derivative of f(x) = 3x² - 2x + 1?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['f\'(x) = 6x - 2', 'f\'(x) = 3x² - 2', 'f\'(x) = 6x² - 2x', 'f\'(x) = 6x - 2x'],
    correctAnswer: 'f\'(x) = 6x - 2',
    explanation: 'To find the derivative, we use the power rule: d/dx(x^n) = n·x^(n-1). So, d/dx(3x²) = 3·2·x^(2-1) = 6x, d/dx(-2x) = -2, and d/dx(1) = 0. Adding these together: f\'(x) = 6x - 2 + 0 = 6x - 2.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'derivatives'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the value of cos(60°)?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['1/4', '1/3', '1/2', '√3/2'],
    correctAnswer: '1/2',
    explanation: 'The cosine of 60° (or π/3 radians) is 1/2. This is one of the standard trigonometric values.',
    subject: 'Math',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['trigonometry', 'angles'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the sum of the infinite geometric series 3 + 3/2 + 3/4 + 3/8 + ... ?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['3', '6', '9', '12'],
    correctAnswer: '6',
    explanation: 'This is an infinite geometric series with first term a = 3 and common ratio r = 1/2. The sum of such a series is given by a/(1-r) = 3/(1-1/2) = 3/(1/2) = 6.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['series', 'sequences'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the value of sin²(θ) + cos²(θ) for any angle θ?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['0', '1/2', '1', '2'],
    correctAnswer: '1',
    explanation: 'The Pythagorean identity states that sin²(θ) + cos²(θ) = 1 for any angle θ. This is a fundamental trigonometric identity.',
    subject: 'Math',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['trigonometry', 'identities'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Find the integral of f(x) = 2x + 3.',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['F(x) = x² + 3x + C', 'F(x) = 2x² + 3x + C', 'F(x) = x² + 3x', 'F(x) = x² + 3'],
    correctAnswer: 'F(x) = x² + 3x + C',
    explanation: 'To find the integral, we use the power rule: ∫x^n dx = x^(n+1)/(n+1) + C. So, ∫(2x + 3) dx = ∫2x dx + ∫3 dx = 2·x²/2 + 3x + C = x² + 3x + C, where C is the constant of integration.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'integrals'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Grade 11 - Science
  {
    _id: generateId(),
    content: 'Which of these is Newton\'s Second Law of Motion?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'An object at rest stays at rest unless acted upon by an external force',
      'Force equals mass times acceleration',
      'For every action, there is an equal and opposite reaction',
      'Energy cannot be created or destroyed'
    ],
    correctAnswer: 'Force equals mass times acceleration',
    explanation: 'Newton\'s Second Law of Motion states that the force acting on an object is equal to the mass of the object times its acceleration (F = ma).',
    subject: 'Science',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['physics', 'motion'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the main function of mRNA in protein synthesis?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'To store genetic information',
      'To carry amino acids to the ribosome',
      'To carry genetic information from DNA to the ribosome',
      'To catalyze the formation of peptide bonds'
    ],
    correctAnswer: 'To carry genetic information from DNA to the ribosome',
    explanation: 'Messenger RNA (mRNA) carries genetic information copied from DNA in the form of a series of three-base code "words" (codons), each of which specifies a particular amino acid in protein synthesis.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['biology', 'genetics'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Which of these is an example of a buffer solution?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Pure water',
      'Sodium chloride solution',
      'Acetic acid and sodium acetate solution',
      'Sugar solution'
    ],
    correctAnswer: 'Acetic acid and sodium acetate solution',
    explanation: 'A buffer solution contains a weak acid and its conjugate base (or a weak base and its conjugate acid) that can resist changes in pH when small amounts of acid or base are added. Acetic acid and sodium acetate form a common buffer system.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['chemistry', 'solutions'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the function of the nephron in the kidney?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'To produce hormones',
      'To filter blood and form urine',
      'To store urine',
      'To regulate blood pressure'
    ],
    correctAnswer: 'To filter blood and form urine',
    explanation: 'Nephrons are the functional units of the kidney that filter blood, reabsorb useful substances, and produce urine to eliminate waste products from the body.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['biology', 'human body'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Which of these is a correct statement about isotopes?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Isotopes of an element have different numbers of protons',
      'Isotopes of an element have different numbers of neutrons',
      'Isotopes of an element have different chemical properties',
      'Isotopes of an element have different numbers of electrons'
    ],
    correctAnswer: 'Isotopes of an element have different numbers of neutrons',
    explanation: 'Isotopes are atoms of the same element (same number of protons) that have different numbers of neutrons. This results in different atomic masses but similar chemical properties.',
    subject: 'Science',
    difficulty: DifficultyLevel.MEDIUM,
    tags: ['chemistry', 'atoms'],
    grade: '11',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Grade 12 - Math
  {
    _id: generateId(),
    content: 'What is the limit of (sin x)/x as x approaches 0?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['0', '1', 'π', 'Undefined'],
    correctAnswer: '1',
    explanation: 'The limit of (sin x)/x as x approaches 0 is 1. This is a well-known limit in calculus that can be proven using the squeeze theorem or by using L\'Hôpital\'s rule.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'limits'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the value of ∫₀¹ x² dx?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['1/2', '1/3', '2/3', '1'],
    correctAnswer: '1/3',
    explanation: '∫₀¹ x² dx = [x³/3]₀¹ = 1³/3 - 0³/3 = 1/3 - 0 = 1/3.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'integrals'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the solution to the differential equation dy/dx = 2x with the initial condition y(0) = 3?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['y = x² + 3', 'y = 2x + 3', 'y = x² + 2', 'y = 2x² + 3'],
    correctAnswer: 'y = x² + 3',
    explanation: 'To solve dy/dx = 2x, we integrate both sides: y = ∫2x dx = x² + C. Using the initial condition y(0) = 3, we get 3 = 0² + C, so C = 3. Therefore, y = x² + 3.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['calculus', 'differential equations'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the value of the determinant of the matrix [[2, 3], [1, 4]]?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['5', '7', '8', '11'],
    correctAnswer: '5',
    explanation: 'For a 2×2 matrix [[a, b], [c, d]], the determinant is ad - bc. So for [[2, 3], [1, 4]], the determinant is 2×4 - 3×1 = 8 - 3 = 5.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['linear algebra', 'matrices'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the probability of getting exactly 2 heads in 5 tosses of a fair coin?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['5/32', '10/32', '15/32', '20/32'],
    correctAnswer: '10/32',
    explanation: 'Using the binomial probability formula: P(X = k) = (n choose k) × p^k × (1-p)^(n-k), where n = 5, k = 2, p = 0.5. So P(X = 2) = (5 choose 2) × 0.5² × 0.5³ = 10 × 0.25 × 0.125 = 10/32 = 5/16.',
    subject: 'Math',
    difficulty: DifficultyLevel.HARD,
    tags: ['probability', 'statistics'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Grade 12 - Science
  {
    _id: generateId(),
    content: 'Which of these is the correct formula for calculating the force of gravity between two objects?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'F = ma',
      'F = G(m₁m₂)/r²',
      'F = kx',
      'F = μN'
    ],
    correctAnswer: 'F = G(m₁m₂)/r²',
    explanation: 'Newton\'s Law of Universal Gravitation states that the gravitational force between two objects is directly proportional to the product of their masses and inversely proportional to the square of the distance between them: F = G(m₁m₂)/r², where G is the gravitational constant.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['physics', 'gravity'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the function of ATP in cellular metabolism?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'To store genetic information',
      'To transport oxygen in the blood',
      'To store and transfer energy',
      'To catalyze protein synthesis'
    ],
    correctAnswer: 'To store and transfer energy',
    explanation: 'Adenosine triphosphate (ATP) is the primary energy carrier in cells. It stores energy in its high-energy phosphate bonds and releases it when needed for cellular processes.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['biology', 'metabolism'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Which of these is a correct statement about entropy?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Entropy always decreases in a closed system',
      'Entropy is a measure of the order in a system',
      'Entropy tends to increase in a spontaneous process',
      'Entropy is conserved in all processes'
    ],
    correctAnswer: 'Entropy tends to increase in a spontaneous process',
    explanation: 'According to the Second Law of Thermodynamics, the entropy (a measure of disorder or randomness) of an isolated system tends to increase over time. Spontaneous processes are characterized by an increase in the total entropy of the system and its surroundings.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['chemistry', 'thermodynamics'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'What is the function of the Krebs cycle in cellular respiration?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'To break down glucose into pyruvate',
      'To generate ATP without using oxygen',
      'To convert pyruvate into acetyl-CoA',
      'To generate NADH and FADH₂ for the electron transport chain'
    ],
    correctAnswer: 'To generate NADH and FADH₂ for the electron transport chain',
    explanation: 'The Krebs cycle (also known as the citric acid cycle or TCA cycle) is a series of chemical reactions in cellular respiration that generates NADH and FADH₂, which carry electrons to the electron transport chain for ATP production.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['biology', 'cellular respiration'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: generateId(),
    content: 'Which of these is a correct statement about quantum mechanics?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      'Electrons have fixed positions around the nucleus',
      'The position and momentum of a particle can be simultaneously determined with perfect accuracy',
      'Light can behave as both a particle and a wave',
      'Energy is always continuous, never quantized'
    ],
    correctAnswer: 'Light can behave as both a particle and a wave',
    explanation: 'Wave-particle duality is a central concept in quantum mechanics, which states that all particles exhibit both wave and particle properties. Light, for example, can behave as electromagnetic waves or as particles called photons, depending on the experimental setup.',
    subject: 'Science',
    difficulty: DifficultyLevel.HARD,
    tags: ['physics', 'quantum mechanics'],
    grade: '12',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];
