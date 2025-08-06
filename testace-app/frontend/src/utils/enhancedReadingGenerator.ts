import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassagesDatabase } from './readingPassagesDatabase';

/**
 * Enhanced Reading Question Generator
 * 
 * Based on NAPLAN reading assessments and comprehensive reading passages,
 * this generator creates high-quality reading comprehension questions:
 * 
 * Categories:
 * 1. Literal Comprehension
 * 2. Inferential Reading
 * 3. Critical Analysis
 * 4. Vocabulary in Context
 * 5. Text Structure & Purpose
 * 6. Author's Intent & Perspective
 * 7. Compare & Contrast
 * 8. Main Ideas & Supporting Details
 */

interface ReadingConfig {
  grade: string;
  difficulty: DifficultyLevel;
  questionCount: number;
}

export class EnhancedReadingGenerator {
  
  private static generateId(): string {
    return `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate reading comprehension questions using high-quality passages
   * CRITICAL: Must always generate the exact number of questions requested
   */
  static generateReadingQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
    console.log(`Generating ${count} reading questions for Grade ${grade}, ${difficulty} difficulty`);
    
    try {
      // First, try to get questions from our curated passages database
      const passageQuestions = ReadingPassagesDatabase.generateReadingQuestions(grade, difficulty, count);
      
      if (passageQuestions.length >= count) {
        console.log(`Generated ${passageQuestions.length} questions from reading passages database`);
        return passageQuestions.slice(0, count);
      }
      
      // If we need more questions, supplement with generated ones
      const remainingCount = count - passageQuestions.length;
      console.log(`Need ${remainingCount} more questions. Generating supplementary questions.`);
      
      const additionalQuestions = this.generateSupplementaryQuestions(grade, difficulty, remainingCount);
      
      const allQuestions = [...passageQuestions, ...additionalQuestions];
      console.log(`Generated ${allQuestions.length} total reading questions (${passageQuestions.length} from passages, ${additionalQuestions.length} supplementary)`);
      
      // Ensure we have exactly the requested count
      if (allQuestions.length < count) {
        console.warn(`Still short ${count - allQuestions.length} questions. Generating emergency questions.`);
        const emergencyQuestions = this.generateEmergencyQuestions(grade, difficulty, count - allQuestions.length);
        allQuestions.push(...emergencyQuestions);
      }
      
      return allQuestions.slice(0, count);
      
    } catch (error) {
      console.error('Error in reading question generation:', error);
      // Emergency fallback - generate basic questions
      console.log('Using emergency fallback question generation');
      return this.generateEmergencyQuestions(grade, difficulty, count);
    }
  }

  /**
   * Generate emergency questions when all other methods fail
   * This method MUST always succeed and generate the requested number of questions
   */
  private static generateEmergencyQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
    console.log(`Generating ${count} emergency reading questions`);
    
    const questions: Question[] = [];
    const questionTemplates = [
      {
        passage: "Reading is an important skill that helps us learn new information and enjoy stories. Good readers can understand what they read and remember important details. Practice makes reading easier and more fun.",
        question: "According to the passage, what makes reading easier?",
        answer: "Practice",
        distractors: ["Watching TV", "Playing games", "Sleeping more"]
      },
      {
        passage: "Libraries are wonderful places where people can borrow books, use computers, and attend programs. Most libraries are free to use and welcome people of all ages. Librarians are there to help you find what you need.",
        question: "What do librarians do?",
        answer: "Help you find what you need",
        distractors: ["Sell books", "Cook food", "Fix computers only"]
      },
      {
        passage: "Exercise is good for your body and mind. It helps keep your muscles strong and your heart healthy. Regular exercise can also help you feel happier and sleep better at night.",
        question: "What are two benefits of exercise mentioned in the passage?",
        answer: "Keeps muscles strong and heart healthy",
        distractors: ["Makes you taller and smarter", "Helps you eat more and work less", "Makes you famous and rich"]
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = questionTemplates[i % questionTemplates.length];
      
      questions.push({
        _id: `emergency_reading_${grade}_${difficulty}_${i}_${Date.now()}`,
        content: `Read the passage and answer the question:\n\n${template.passage}\n\n${template.question}`,
        type: QuestionType.MULTIPLE_CHOICE,
        options: [template.answer, ...template.distractors].sort(() => Math.random() - 0.5),
        correctAnswer: template.answer,
        explanation: `This is a reading comprehension question. The answer can be found in the passage.`,
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: difficulty,
        grade: grade,
        tags: ['reading', 'emergency', 'comprehension']
      });
    }
    
    console.log(`Successfully generated ${questions.length} emergency reading questions`);
    return questions;
  }

  /**
   * Generate supplementary reading questions when passages database doesn't have enough
   */
  private static generateSupplementaryQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      const questionType = this.selectQuestionType(grade, difficulty);
      const question = this.generateQuestionByType(questionType, grade, difficulty);
      if (question) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  /**
   * Select appropriate question type based on grade and difficulty
   */
  private static selectQuestionType(grade: string, difficulty: DifficultyLevel): string {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 2) {
      const types = ['literal', 'vocabulary', 'sequence'];
      return types[Math.floor(Math.random() * types.length)];
    } else if (gradeNum <= 5) {
      const types = ['literal', 'inference', 'vocabulary', 'main_idea', 'sequence'];
      return types[Math.floor(Math.random() * types.length)];
    } else {
      const types = ['literal', 'inference', 'vocabulary', 'main_idea', 'critical', 'author_intent', 'compare'];
      return types[Math.floor(Math.random() * types.length)];
    }
  }

  /**
   * Generate a question based on type
   */
  private static generateQuestionByType(type: string, grade: string, difficulty: DifficultyLevel): Question | null {
    switch (type) {
      case 'literal':
        return this.generateLiteralQuestion(grade, difficulty);
      case 'inference':
        return this.generateInferenceQuestion(grade, difficulty);
      case 'vocabulary':
        return this.generateVocabularyQuestion(grade, difficulty);
      case 'main_idea':
        return this.generateMainIdeaQuestion(grade, difficulty);
      case 'sequence':
        return this.generateSequenceQuestion(grade, difficulty);
      case 'critical':
        return this.generateCriticalThinkingQuestion(grade, difficulty);
      case 'author_intent':
        return this.generateAuthorIntentQuestion(grade, difficulty);
      case 'compare':
        return this.generateCompareContrastQuestion(grade, difficulty);
      default:
        return this.generateLiteralQuestion(grade, difficulty);
    }
  }

  /**
   * Generate literal comprehension questions
   */
  private static generateLiteralQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: "Sarah found a beautiful butterfly in her garden. The butterfly had orange and black wings with white spots. It landed on a red flower and stayed there for a long time.",
        question: "What colors were on the butterfly's wings?",
        answer: "Orange and black with white spots",
        distractors: ["Red and yellow with black spots", "Blue and green with white spots", "Purple and pink with gold spots"]
      },
      {
        text: "The library opens at 9:00 AM and closes at 6:00 PM on weekdays. On Saturdays, it opens at 10:00 AM and closes at 4:00 PM. The library is closed on Sundays.",
        question: "What time does the library close on weekdays?",
        answer: "6:00 PM",
        distractors: ["4:00 PM", "5:00 PM", "7:00 PM"]
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];
    
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: [passage.answer, ...passage.distractors].sort(() => Math.random() - 0.5),
      correctAnswer: passage.answer,
      explanation: `This is a literal comprehension question. The answer can be found directly in the passage.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['literal', 'comprehension', 'details']
    };
  }

  /**
   * Generate inference questions
   */
  private static generateInferenceQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: "Tom packed his umbrella, raincoat, and waterproof boots. He checked the weather app one more time before leaving the house.",
        question: "What can we infer about the weather?",
        answer: "It was going to rain",
        distractors: ["It was sunny", "It was snowing", "It was very hot"]
      },
      {
        text: "Maria studied for three hours every night for two weeks. She made flashcards, took practice tests, and asked her teacher for extra help. On test day, she arrived early and brought extra pencils.",
        question: "How did Maria probably feel about the test?",
        answer: "She was well-prepared and confident",
        distractors: ["She was unprepared and worried", "She didn't care about the test", "She forgot about the test"]
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];
    
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: [passage.answer, ...passage.distractors].sort(() => Math.random() - 0.5),
      correctAnswer: passage.answer,
      explanation: `This is an inference question. The answer is not directly stated but can be figured out from clues in the passage.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['inference', 'comprehension', 'critical_thinking']
    };
  }

  /**
   * Generate vocabulary in context questions
   */
  private static generateVocabularyQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: "The ancient castle was magnificent, with tall towers reaching toward the sky and beautiful gardens surrounding it.",
        question: "In this passage, what does 'magnificent' mean?",
        answer: "Very impressive and beautiful",
        distractors: ["Very old and broken", "Very small and simple", "Very dark and scary"]
      },
      {
        text: "The scientist was perplexed by the unusual results of her experiment. She had never seen anything like it before.",
        question: "What does 'perplexed' mean in this context?",
        answer: "Confused and puzzled",
        distractors: ["Happy and excited", "Angry and upset", "Bored and tired"]
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];
    
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: [passage.answer, ...passage.distractors].sort(() => Math.random() - 0.5),
      correctAnswer: passage.answer,
      explanation: `This is a vocabulary question. Use context clues in the passage to determine the meaning of the word.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['vocabulary', 'context_clues', 'word_meaning']
    };
  }

  /**
   * Generate main idea questions
   */
  private static generateMainIdeaQuestion(grade: string, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: "Recycling helps protect our environment in many ways. It reduces the amount of waste in landfills. It saves natural resources like trees and water. It also reduces pollution in our air and water. Everyone can help by recycling paper, plastic, and glass.",
        question: "What is the main idea of this passage?",
        answer: "Recycling helps protect the environment",
        distractors: ["Landfills are full of waste", "Trees and water are natural resources", "People should recycle glass"]
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];
    
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: [passage.answer, ...passage.distractors].sort(() => Math.random() - 0.5),
      correctAnswer: passage.answer,
      explanation: `This is a main idea question. Look for the central message that the entire passage is about.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['main_idea', 'comprehension', 'central_message']
    };
  }

  /**
   * Generate sequence questions
   */
  private static generateSequenceQuestion(grade: string, difficulty: DifficultyLevel): Question {
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\nTo make a peanut butter sandwich, first get two slices of bread. Next, spread peanut butter on one slice. Then, spread jelly on the other slice. Finally, put the two slices together.\n\nWhat do you do after spreading peanut butter on one slice?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['Spread jelly on the other slice', 'Get two slices of bread', 'Put the slices together', 'Eat the sandwich'],
      correctAnswer: 'Spread jelly on the other slice',
      explanation: `This is a sequence question. Follow the order of steps described in the passage.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['sequence', 'order', 'following_directions']
    };
  }

  /**
   * Generate critical thinking questions
   */
  private static generateCriticalThinkingQuestion(grade: string, difficulty: DifficultyLevel): Question {
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\nThe town council wants to build a new shopping mall where the old park is located. Some people think this is a good idea because it will bring jobs and money to the town. Other people think it's a bad idea because children need a place to play and the trees provide clean air.\n\nWhat is the main conflict in this situation?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['Economic benefits versus environmental and community needs', 'Old buildings versus new buildings', 'Adults versus children', 'Money versus jobs'],
      correctAnswer: 'Economic benefits versus environmental and community needs',
      explanation: `This is a critical thinking question. Analyze the different viewpoints and identify the central conflict.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['critical_thinking', 'analysis', 'conflict']
    };
  }

  /**
   * Generate author intent questions
   */
  private static generateAuthorIntentQuestion(grade: string, difficulty: DifficultyLevel): Question {
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\n"Don't forget to brush your teeth twice a day! Brushing removes harmful bacteria that can cause cavities. It also keeps your breath fresh and your smile bright. Make brushing a fun part of your daily routine!"\n\nWhat is the author's main purpose in writing this passage?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['To persuade readers to brush their teeth regularly', 'To explain how toothbrushes are made', 'To tell a story about going to the dentist', 'To describe different types of toothpaste'],
      correctAnswer: 'To persuade readers to brush their teeth regularly',
      explanation: `This is an author's purpose question. The author is trying to convince readers to develop good dental hygiene habits.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['author_purpose', 'persuasion', 'intent']
    };
  }

  /**
   * Generate compare and contrast questions
   */
  private static generateCompareContrastQuestion(grade: string, difficulty: DifficultyLevel): Question {
    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question:\n\nDogs and cats are both popular pets, but they are quite different. Dogs are usually more social and love to play with their owners. They need to be walked every day and enjoy being around people. Cats are more independent and like to spend time alone. They don't need to be walked and can take care of themselves more easily.\n\nHow are dogs and cats similar according to this passage?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['They are both popular pets', 'They both need to be walked', 'They both like to be alone', 'They both are very social'],
      correctAnswer: 'They are both popular pets',
      explanation: `This is a compare and contrast question. Look for what the passage says is the same about both animals.`,
      subject: 'Reading',
      topic: 'Reading Comprehension',
      difficulty: difficulty,
      grade: grade,
      tags: ['compare_contrast', 'similarities', 'differences']
    };
  }
}

/**
 * Export function for backward compatibility
 */
export const generateEnhancedReadingQuestions = (grade: string, difficulty: DifficultyLevel, count: number): Question[] => {
  return EnhancedReadingGenerator.generateReadingQuestions(grade, difficulty, count);
};
