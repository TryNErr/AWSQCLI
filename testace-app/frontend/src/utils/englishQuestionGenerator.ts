import { Question, DifficultyLevel, QuestionType } from '../types';
import { ensureUniqueOptions, shuffleArray, getRandomInt } from './questionUtils';
import { generateEnglishId } from './idGenerator';

// Grammar question templates
const grammarQuestions = {
  easy: [
    {
      content: "Choose the correct verb form: 'She _____ to school every day.'",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: "goes",
      explanation: "With third person singular subjects (she, he, it), we add 's' to the verb in present tense."
    },
    {
      content: "Which sentence is correct?",
      options: ["I am happy.", "I are happy.", "I is happy.", "I be happy."],
      correctAnswer: "I am happy.",
      explanation: "The correct form of 'be' with 'I' is 'am'."
    }
  ],
  medium: [
    {
      content: "Choose the correct past tense: 'Yesterday, I _____ my homework.'",
      options: ["do", "did", "done", "doing"],
      correctAnswer: "did",
      explanation: "The past tense of 'do' is 'did'."
    },
    {
      content: "Which sentence uses the correct preposition?",
      options: ["I am good in math.", "I am good at math.", "I am good on math.", "I am good with math."],
      correctAnswer: "I am good at math.",
      explanation: "We use 'good at' when talking about skills or abilities."
    }
  ],
  hard: [
    {
      content: "Choose the sentence with correct subject-verb agreement:",
      options: [
        "Neither the teacher nor the students was ready.",
        "Neither the teacher nor the students were ready.",
        "Neither the teacher nor the students is ready.",
        "Neither the teacher nor the students are ready."
      ],
      correctAnswer: "Neither the teacher nor the students were ready.",
      explanation: "With 'neither...nor', the verb agrees with the subject closest to it (students = plural)."
    }
  ]
};

// Vocabulary question templates
const vocabularyQuestions = {
  easy: [
    {
      content: "What does 'happy' mean?",
      options: ["sad", "joyful", "angry", "tired"],
      correctAnswer: "joyful",
      explanation: "'Happy' means feeling joy or pleasure."
    },
    {
      content: "Choose the synonym for 'big':",
      options: ["small", "large", "tiny", "little"],
      correctAnswer: "large",
      explanation: "'Large' is a synonym for 'big', both meaning of great size."
    }
  ],
  medium: [
    {
      content: "What does 'curious' mean?",
      options: ["bored", "eager to learn", "sleepy", "angry"],
      correctAnswer: "eager to learn",
      explanation: "'Curious' means having a desire to learn or know more about something."
    },
    {
      content: "Choose the antonym for 'brave':",
      options: ["courageous", "fearless", "cowardly", "bold"],
      correctAnswer: "cowardly",
      explanation: "'Cowardly' is the opposite of 'brave'."
    }
  ],
  hard: [
    {
      content: "What does 'meticulous' mean?",
      options: ["careless", "very careful and precise", "quick", "lazy"],
      correctAnswer: "very careful and precise",
      explanation: "'Meticulous' means showing great attention to detail; very careful and precise."
    }
  ]
};

// Comprehension question templates
const comprehensionQuestions = {
  easy: [
    {
      content: "Read: 'The cat sat on the mat.' Where did the cat sit?",
      options: ["on the chair", "on the mat", "on the table", "on the floor"],
      correctAnswer: "on the mat",
      explanation: "The sentence clearly states 'The cat sat on the mat.'"
    }
  ],
  medium: [
    {
      content: "Read: 'Sarah loves reading books. She reads every night before bed.' What can we infer about Sarah?",
      options: ["She dislikes books", "She enjoys reading", "She only reads in the morning", "She never reads"],
      correctAnswer: "She enjoys reading",
      explanation: "The text says Sarah 'loves reading books' and reads regularly, showing she enjoys it."
    }
  ],
  hard: [
    {
      content: "Read: 'The ancient library contained thousands of manuscripts, each one a treasure trove of knowledge from civilizations long past.' What does 'treasure trove' suggest about the manuscripts?",
      options: ["They are worthless", "They are valuable sources of information", "They are difficult to read", "They are very old"],
      correctAnswer: "They are valuable sources of information",
      explanation: "A 'treasure trove' metaphorically suggests something very valuable, in this case, valuable knowledge."
    }
  ]
};

// Function to generate grammar questions
const generateGrammarQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof grammarQuestions;
  const questions = grammarQuestions[difficultyKey] || grammarQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateEnglishId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'English',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Grammar',
    tags: ['grammar', 'english'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to generate vocabulary questions
const generateVocabularyQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof vocabularyQuestions;
  const questions = vocabularyQuestions[difficultyKey] || vocabularyQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateEnglishId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'English',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Vocabulary',
    tags: ['vocabulary', 'english'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to generate comprehension questions
const generateComprehensionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const difficultyKey = difficulty.toLowerCase() as keyof typeof comprehensionQuestions;
  const questions = comprehensionQuestions[difficultyKey] || comprehensionQuestions.easy;
  const template = questions[getRandomInt(0, questions.length - 1)];
  
  return {
    _id: generateEnglishId(),
    content: template.content,
    options: shuffleArray([...template.options]),
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    subject: 'English',
    grade,
    type: QuestionType.MULTIPLE_CHOICE,
    topic: 'Reading Comprehension',
    tags: ['comprehension', 'reading', 'english'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Main function to generate English questions
export const generateEnglishQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 5
): Question[] => {
  const questions: Question[] = [];
  const generatedContents = new Set<string>(); // Track question content to ensure uniqueness
  
  let attempts = 0;
  const maxAttempts = count * 3; // Limit attempts to prevent infinite loops
  
  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Choose a question type based on a random distribution
    const questionType = Math.random();
    
    let newQuestion;
    if (questionType < 0.33) {
      newQuestion = generateGrammarQuestion(grade, difficulty);
    } else if (questionType < 0.67) {
      newQuestion = generateVocabularyQuestion(grade, difficulty);
    } else {
      newQuestion = generateComprehensionQuestion(grade, difficulty);
    }
    
    // Check if this question content is unique in our current batch
    if (!generatedContents.has(newQuestion.content)) {
      generatedContents.add(newQuestion.content);
      questions.push(newQuestion);
    }
  }
  
  // If we couldn't generate enough unique questions, fill with slightly modified versions
  if (questions.length < count) {
    const baseLength = questions.length;
    for (let i = 0; i < count - baseLength; i++) {
      const index = i % baseLength; // Cycle through existing questions
      const baseQuestion = {...questions[index]};
      
      // Modify the question slightly to make it unique
      baseQuestion._id = generateEnglishId();
      baseQuestion.content = `${baseQuestion.content} (Variant ${i+1})`;
      questions.push(baseQuestion);
    }
  }
  
  return questions;
};
