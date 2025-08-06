import { Question, DifficultyLevel, QuestionType } from '../types';

/**
 * Enhanced Language Conventions Question Generator
 * 
 * Based on NAPLAN language conventions assessments, this generator creates
 * comprehensive language and grammar questions:
 * 
 * Categories:
 * 1. Spelling & Word Recognition
 * 2. Grammar & Sentence Structure
 * 3. Punctuation & Capitalization
 * 4. Parts of Speech
 * 5. Verb Tenses & Agreement
 * 6. Sentence Types & Complexity
 * 7. Word Usage & Vocabulary
 * 8. Language Conventions in Context
 */

interface LanguageConfig {
  grade: string;
  difficulty: DifficultyLevel;
  questionCount: number;
}

export class EnhancedLanguageGenerator {
  
  private static generateId(): string {
    return `language_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate enhanced language conventions questions
   */
  static generateQuestions(config: LanguageConfig): Question[] {
    const { grade, difficulty, questionCount } = config;
    const questions: Question[] = [];
    const gradeNum = parseInt(grade);
    
    // Define question type distribution based on grade level
    const questionTypes = this.getQuestionTypeDistribution(gradeNum);
    
    for (let i = 0; i < questionCount; i++) {
      const questionType = this.selectQuestionType(questionTypes);
      const question = this.generateQuestionByType(questionType, gradeNum, difficulty);
      questions.push(question);
    }
    
    return questions;
  }

  private static getQuestionTypeDistribution(grade: number): string[] {
    if (grade <= 3) {
      return [
        'basic_spelling', 'simple_grammar', 'basic_punctuation',
        'sentence_completion', 'word_recognition', 'capitalization'
      ];
    } else if (grade <= 6) {
      return [
        'spelling_patterns', 'grammar_rules', 'punctuation_rules',
        'sentence_structure', 'verb_tenses', 'parts_of_speech'
      ];
    } else if (grade <= 9) {
      return [
        'advanced_spelling', 'complex_grammar', 'advanced_punctuation',
        'sentence_variety', 'subject_verb_agreement', 'word_usage'
      ];
    } else {
      return [
        'sophisticated_spelling', 'advanced_grammar', 'complex_punctuation',
        'sentence_complexity', 'advanced_usage', 'style_conventions'
      ];
    }
  }

  private static selectQuestionType(types: string[]): string {
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateQuestionByType(type: string, grade: number, difficulty: DifficultyLevel): Question {
    switch (type) {
      case 'basic_spelling':
      case 'spelling_patterns':
      case 'advanced_spelling':
        return this.generateSpellingQuestion(grade, difficulty);
      case 'simple_grammar':
      case 'grammar_rules':
      case 'complex_grammar':
        return this.generateGrammarQuestion(grade, difficulty);
      case 'basic_punctuation':
      case 'punctuation_rules':
      case 'advanced_punctuation':
        return this.generatePunctuationQuestion(grade, difficulty);
      case 'sentence_completion':
      case 'sentence_structure':
      case 'sentence_variety':
        return this.generateSentenceQuestion(grade, difficulty);
      case 'verb_tenses':
      case 'subject_verb_agreement':
        return this.generateVerbQuestion(grade, difficulty);
      case 'parts_of_speech':
      case 'word_usage':
        return this.generatePartsOfSpeechQuestion(grade, difficulty);
      default:
        return this.generateSpellingQuestion(grade, difficulty);
    }
  }

  /**
   * Spelling Questions
   */
  private static generateSpellingQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const spellingErrors = [
      // Grade 3 level
      { incorrect: 'buss', correct: 'bus', sentence: 'I go to school on a buss.' },
      { incorrect: 'bloo', correct: 'blue', sentence: 'He has bloo eyes.' },
      { incorrect: 'spott', correct: 'spot', sentence: 'We found a cool spott under a tree.' },
      { incorrect: 'blak', correct: 'black', sentence: 'He is wearing blak shoes.' },
      { incorrect: 'jumpping', correct: 'jumping', sentence: 'I love jumpping on the trampoline.' },
      { incorrect: 'bred', correct: 'bread', sentence: 'I put honey on my bred.' },
      { incorrect: 'dri', correct: 'dry', sentence: 'I will wash and dri the plates.' },
      { incorrect: 'teespoon', correct: 'teaspoon', sentence: 'I used a teespoon to stir my drink.' },
      { incorrect: 'nise', correct: 'nice', sentence: 'My nise friend helped me.' },
      { incorrect: 'supamarket', correct: 'supermarket', sentence: 'We went to the supamarket to do the shopping.' },
      { incorrect: 'cornor', correct: 'corner', sentence: 'The shop is on the cornor of our street.' },
      { incorrect: 'jentle', correct: 'gentle', sentence: 'A jentle breeze was blowing.' },
      
      // Grade 9 level
      { incorrect: 'offerring', correct: 'offering', sentence: 'The shop was offerring free gift-wrapping.' },
      { incorrect: 'reneweble', correct: 'renewable', sentence: 'Solar energy is a reneweble resource.' },
      { incorrect: 'improvize', correct: 'improvise', sentence: 'Farmers sometimes have to improvize when machinery breaks down.' },
      { incorrect: 'circuler', correct: 'circular', sentence: 'They cut the wood with a circuler saw.' },
      { incorrect: 'misrable', correct: 'miserable', sentence: 'The rain made the campers misrable.' },
      { incorrect: 'moisen', correct: 'moisten', sentence: 'We added water to moisen the soil around the plant.' },
      { incorrect: 'protene', correct: 'protein', sentence: 'Eggs provide protene in a diet.' },
      { incorrect: 'incite', correct: 'insight', sentence: 'We gained incite into another culture through our exchange student.' },
      { incorrect: 'broshures', correct: 'brochures', sentence: 'The library has a rack of broshures about many subjects.' },
      { incorrect: 'optomist', correct: 'optimist', sentence: 'An optomist is someone who is always positive.' },
      { incorrect: 'audatorium', correct: 'auditorium', sentence: 'The school play was held in the audatorium.' },
      { incorrect: 'quarel', correct: 'quarrel', sentence: 'I knew my brothers would quarel over who should walk the dog.' },
      { incorrect: 'enigmar', correct: 'enigma', sentence: 'My brother is a complete enigmar as I never know what he is thinking.' },
      { incorrect: 'gnoring', correct: 'gnawing', sentence: 'The mouse was gnoring at the hard cheese.' },
      { incorrect: 'hightened', correct: 'heightened', sentence: 'The scary music hightened the suspense in the movie.' },
      { incorrect: 'graphick', correct: 'graphic', sentence: 'The graphick designer is responsible for the layout of the magazine.' },
      { incorrect: 'teckniques', correct: 'techniques', sentence: 'The experienced chef demonstrated cooking teckniques to the apprentices.' },
      { incorrect: 'futureistic', correct: 'futuristic', sentence: 'The futureistic cars used innovative concepts and materials.' },
      { incorrect: 'caos', correct: 'chaos', sentence: 'There was caos on all routes into the city when a hailstorm disrupted transport.' },
      { incorrect: 'unanounced', correct: 'unannounced', sentence: 'The guests arrived unanounced but we were delighted to see them.' }
    ];

    const error = spellingErrors[Math.floor(Math.random() * spellingErrors.length)];
    
    // Generate distractors
    const distractors = this.generateSpellingDistractors(error.correct, grade);
    const options = [error.correct, ...distractors].sort(() => Math.random() - 0.5);

    return {
      _id: this.generateId(),
      content: `Find the spelling mistake in this sentence and choose the correct spelling:\n\n"${error.sentence}"\n\nWhat is the correct spelling of the underlined word?`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: options,
      correctAnswer: error.correct,
      explanation: `The correct spelling is "${error.correct}". The word "${error.incorrect}" is misspelled.`,
      subject: 'English',
      topic: 'Spelling',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['spelling', 'word-recognition', 'language-conventions'],
      createdBy: 'enhanced-language-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Grammar Questions
   */
  private static generateGrammarQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const grammarProblems = [
      {
        question: 'Which is a correct sentence?',
        correct: 'Grass is green.',
        options: ['The sun are hot.', 'The rocks is hard.', 'Grass is green.', 'Water are wet.'],
        explanation: 'Singular subjects take singular verbs. "Grass" is singular, so it takes "is".'
      },
      {
        question: 'Which word completes this sentence correctly?\n\n"I like going ___ the city."',
        correct: 'to',
        options: ['as', 'so', 'to', 'of'],
        explanation: 'The preposition "to" is correct when indicating direction or destination.'
      },
      {
        question: 'Choose the sentence with correct subject-verb agreement.',
        correct: 'The students are studying for their exams.',
        options: ['The students is studying for their exams.', 'The students are studying for their exams.', 'The student are studying for their exams.', 'The students was studying for their exams.'],
        explanation: '"Students" is plural, so it requires the plural verb "are".'
      },
      {
        question: 'Which sentence uses the correct verb tense?',
        correct: 'Yesterday, I walked to school.',
        options: ['Yesterday, I walk to school.', 'Yesterday, I walked to school.', 'Yesterday, I will walk to school.', 'Yesterday, I am walking to school.'],
        explanation: '"Yesterday" indicates past time, so the past tense "walked" is correct.'
      }
    ];

    const problem = grammarProblems[Math.floor(Math.random() * grammarProblems.length)];

    return {
      _id: this.generateId(),
      content: problem.question,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.correct,
      explanation: problem.explanation,
      subject: 'English',
      topic: 'Grammar',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['grammar', 'sentence-structure', 'verb-agreement'],
      createdBy: 'enhanced-language-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Punctuation Questions
   */
  private static generatePunctuationQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const punctuationProblems = [
      {
        question: 'Which sentence is punctuated correctly?',
        correct: 'Sarah asked, "What time is it?"',
        options: ['Sarah asked "What time is it?"', 'Sarah asked, "What time is it?"', 'Sarah asked, "What time is it"?', 'Sarah asked "What time is it"?'],
        explanation: 'Direct quotes require a comma before the opening quotation mark and the question mark goes inside the closing quotation mark.'
      },
      {
        question: 'Choose the correctly punctuated sentence.',
        correct: 'I need to buy apples, oranges, and bananas.',
        options: ['I need to buy apples oranges and bananas.', 'I need to buy apples, oranges and bananas.', 'I need to buy apples, oranges, and bananas.', 'I need to buy, apples, oranges, and bananas.'],
        explanation: 'Items in a series are separated by commas, with a comma before the final "and" (Oxford comma).'
      },
      {
        question: 'Which sentence uses apostrophes correctly?',
        correct: 'The dog\'s bone was buried in the yard.',
        options: ['The dogs\' bone was buried in the yard.', 'The dog\'s bone was buried in the yard.', 'The dogs bone was buried in the yard.', 'The dog\'s\' bone was buried in the yard.'],
        explanation: 'For a singular possessive, add an apostrophe and "s" after the noun.'
      }
    ];

    const problem = punctuationProblems[Math.floor(Math.random() * punctuationProblems.length)];

    return {
      _id: this.generateId(),
      content: problem.question,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.correct,
      explanation: problem.explanation,
      subject: 'English',
      topic: 'Punctuation',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['punctuation', 'apostrophes', 'quotation-marks', 'commas'],
      createdBy: 'enhanced-language-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Sentence Structure Questions
   */
  private static generateSentenceQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const sentenceProblems = [
      {
        question: 'Which is a complete sentence?',
        correct: 'The cat slept on the warm windowsill.',
        options: ['Running through the park.', 'The cat slept on the warm windowsill.', 'Because it was raining.', 'Under the old oak tree.'],
        explanation: 'A complete sentence has a subject and predicate. "The cat slept on the warm windowsill" has both.'
      },
      {
        question: 'Choose the sentence that combines these ideas best:\n\n"The storm was fierce. The power went out."',
        correct: 'The storm was so fierce that the power went out.',
        options: ['The storm was fierce, the power went out.', 'The storm was fierce and the power went out.', 'The storm was so fierce that the power went out.', 'The storm was fierce, so the power went out.'],
        explanation: 'This option shows the cause-and-effect relationship most clearly with "so...that".'
      },
      {
        question: 'Which sentence has the most effective word order?',
        correct: 'Quietly, the cat crept through the tall grass.',
        options: ['The cat quietly crept through the tall grass.', 'Quietly, the cat crept through the tall grass.', 'The cat crept quietly through the tall grass.', 'Through the tall grass, the cat quietly crept.'],
        explanation: 'Starting with the adverb "Quietly" creates emphasis and better sentence flow.'
      }
    ];

    const problem = sentenceProblems[Math.floor(Math.random() * sentenceProblems.length)];

    return {
      _id: this.generateId(),
      content: problem.question,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.correct,
      explanation: problem.explanation,
      subject: 'English',
      topic: 'Sentence Structure',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['sentence-structure', 'complete-sentences', 'word-order'],
      createdBy: 'enhanced-language-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Verb Questions
   */
  private static generateVerbQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const verbProblems = [
      {
        question: 'Choose the correct verb form:\n\n"Neither the teacher nor the students ___ ready for the test."',
        correct: 'were',
        options: ['was', 'were', 'is', 'are'],
        explanation: 'With "neither...nor," the verb agrees with the subject closer to it. "Students" is plural, so "were" is correct.'
      },
      {
        question: 'Which sentence uses the correct verb tense?',
        correct: 'By next year, I will have graduated from high school.',
        options: ['By next year, I will graduate from high school.', 'By next year, I will have graduated from high school.', 'By next year, I graduated from high school.', 'By next year, I have graduated from high school.'],
        explanation: 'Future perfect tense ("will have graduated") is used for actions that will be completed by a specific future time.'
      },
      {
        question: 'Select the sentence with correct subject-verb agreement.',
        correct: 'Each of the books has its own unique story.',
        options: ['Each of the books have its own unique story.', 'Each of the books has its own unique story.', 'Each of the books have their own unique story.', 'Each of the books are having its own unique story.'],
        explanation: '"Each" is singular, so it takes the singular verb "has," regardless of the prepositional phrase "of the books."'
      }
    ];

    const problem = verbProblems[Math.floor(Math.random() * verbProblems.length)];

    return {
      _id: this.generateId(),
      content: problem.question,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.correct,
      explanation: problem.explanation,
      subject: 'English',
      topic: 'Verb Usage',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['verbs', 'subject-verb-agreement', 'verb-tenses'],
      createdBy: 'enhanced-language-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Parts of Speech Questions
   */
  private static generatePartsOfSpeechQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const partsOfSpeechProblems = [
      {
        question: 'In the sentence "The bright sun shone warmly on the garden," what part of speech is "warmly"?',
        correct: 'Adverb',
        options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
        explanation: '"Warmly" modifies the verb "shone," describing how the sun shone, making it an adverb.'
      },
      {
        question: 'Which word in this sentence is a preposition?\n\n"The book under the table belongs to Sarah."',
        correct: 'under',
        options: ['book', 'under', 'table', 'belongs'],
        explanation: '"Under" shows the relationship between "book" and "table," making it a preposition.'
      },
      {
        question: 'What part of speech is the word "running" in this sentence?\n\n"Running is my favorite form of exercise."',
        correct: 'Noun (gerund)',
        options: ['Verb', 'Adjective', 'Noun (gerund)', 'Adverb'],
        explanation: '"Running" functions as the subject of the sentence, making it a gerund (a verb form used as a noun).'
      }
    ];

    const problem = partsOfSpeechProblems[Math.floor(Math.random() * partsOfSpeechProblems.length)];

    return {
      _id: this.generateId(),
      content: problem.question,
      type: QuestionType.MULTIPLE_CHOICE,
      options: problem.options,
      correctAnswer: problem.correct,
      explanation: problem.explanation,
      subject: 'English',
      topic: 'Parts of Speech',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['parts-of-speech', 'grammar', 'word-function'],
      createdBy: 'enhanced-language-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Helper method to generate spelling distractors
  private static generateSpellingDistractors(correct: string, grade: number): string[] {
    const commonMistakes: Record<string, string[]> = {
      'bus': ['buss', 'buz', 'busse'],
      'blue': ['bloo', 'bleu', 'bluw'],
      'spot': ['spott', 'spoht', 'spat'],
      'black': ['blak', 'blac', 'bleck'],
      'jumping': ['jumpping', 'jumpeng', 'jumoing'],
      'bread': ['bred', 'braed', 'bredd'],
      'dry': ['dri', 'drie', 'drye'],
      'teaspoon': ['teespoon', 'teaspon', 'teaspoun'],
      'nice': ['nise', 'niece', 'nyce'],
      'supermarket': ['supamarket', 'supermarkit', 'supermarcket'],
      'corner': ['cornor', 'cornar', 'cornner'],
      'gentle': ['jentle', 'gentil', 'gentell'],
      'offering': ['offerring', 'ofering', 'offring'],
      'renewable': ['reneweble', 'renewabel', 'renewible'],
      'improvise': ['improvize', 'improvice', 'improwise'],
      'circular': ['circuler', 'circullar', 'circler'],
      'miserable': ['misrable', 'miserabel', 'misarable'],
      'moisten': ['moisen', 'moistin', 'moistten'],
      'protein': ['protene', 'protien', 'protean'],
      'insight': ['incite', 'insigt', 'insigth'],
      'brochures': ['broshures', 'brochurs', 'broshurs'],
      'optimist': ['optomist', 'optimest', 'optamist']
    };

    const mistakes = commonMistakes[correct.toLowerCase()] || [
      correct.replace(/e$/, ''), // Remove final e
      correct + 'e', // Add extra e
      correct.replace(/s$/, 'z') // Replace s with z
    ];

    return mistakes.slice(0, 3);
  }
}

// Export convenience function
export function generateEnhancedLanguageQuestions(
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 1
): Question[] {
  return EnhancedLanguageGenerator.generateQuestions({
    grade,
    difficulty,
    questionCount: count
  });
}

export default EnhancedLanguageGenerator;
