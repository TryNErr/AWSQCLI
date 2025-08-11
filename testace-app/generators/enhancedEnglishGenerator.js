/**
 * ENHANCED ENGLISH QUESTION GENERATOR
 * 
 * Leverages vast knowledge base to create rich English questions covering:
 * - Grammar and syntax
 * - Vocabulary and word usage
 * - Literary analysis
 * - Writing mechanics
 * - Language conventions
 */

class EnhancedEnglishGenerator {
  
  /**
   * Generate an English question based on grade and difficulty
   */
  static generateQuestion(grade, difficulty, seed = 0) {
    const gradeNum = parseInt(grade);
    
    const questionTypes = this.getQuestionTypesForGrade(gradeNum, difficulty);
    const typeIndex = seed % questionTypes.length;
    const questionType = questionTypes[typeIndex];
    
    return this.generateByType(questionType, gradeNum, difficulty, seed);
  }
  
  /**
   * Get available question types for grade and difficulty
   */
  static getQuestionTypesForGrade(grade, difficulty) {
    const baseTypes = ['grammar', 'vocabulary', 'sentence_structure'];
    
    if (grade >= 3) baseTypes.push('punctuation', 'capitalization');
    if (grade >= 5) baseTypes.push('parts_of_speech', 'synonyms_antonyms');
    if (grade >= 7) baseTypes.push('literary_devices', 'figurative_language');
    if (grade >= 9) baseTypes.push('rhetoric', 'writing_style', 'text_analysis');
    if (grade >= 11) baseTypes.push('advanced_grammar', 'literary_criticism');
    
    return baseTypes;
  }
  
  /**
   * Generate question by type
   */
  static generateByType(type, grade, difficulty, seed) {
    switch (type) {
      case 'grammar':
        return this.generateGrammarQuestion(grade, difficulty, seed);
      case 'vocabulary':
        return this.generateVocabularyQuestion(grade, difficulty, seed);
      case 'sentence_structure':
        return this.generateSentenceStructureQuestion(grade, difficulty, seed);
      case 'punctuation':
        return this.generatePunctuationQuestion(grade, difficulty, seed);
      case 'parts_of_speech':
        return this.generatePartsOfSpeechQuestion(grade, difficulty, seed);
      case 'synonyms_antonyms':
        return this.generateSynonymsAntonymsQuestion(grade, difficulty, seed);
      case 'literary_devices':
        return this.generateLiteraryDevicesQuestion(grade, difficulty, seed);
      case 'figurative_language':
        return this.generateFigurativeLanguageQuestion(grade, difficulty, seed);
      case 'text_analysis':
        return this.generateTextAnalysisQuestion(grade, difficulty, seed);
      default:
        return this.generateGrammarQuestion(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate grammar questions
   */
  static generateGrammarQuestion(grade, difficulty, seed) {
    const grammarRules = [
      {
        rule: 'Subject-Verb Agreement',
        incorrect: 'The dogs runs in the park.',
        correct: 'The dogs run in the park.',
        explanation: 'Plural subjects require plural verbs. "Dogs" is plural, so use "run" not "runs".'
      },
      {
        rule: 'Pronoun Agreement',
        incorrect: 'Each student must bring their book.',
        correct: 'Each student must bring his or her book.',
        explanation: '"Each student" is singular, so the pronoun should be singular too.'
      },
      {
        rule: 'Verb Tense Consistency',
        incorrect: 'She walked to the store and buys milk.',
        correct: 'She walked to the store and bought milk.',
        explanation: 'Keep verb tenses consistent within a sentence. Both actions happened in the past.'
      },
      {
        rule: 'Apostrophe Usage',
        incorrect: "The cats toy is missing.",
        correct: "The cat's toy is missing.",
        explanation: 'Use an apostrophe to show possession. The toy belongs to the cat.'
      },
      {
        rule: 'Double Negative',
        incorrect: "I don't have no money.",
        correct: "I don't have any money.",
        explanation: 'Avoid double negatives. Use "don\'t have any" instead of "don\'t have no".'
      }
    ];
    
    const rule = grammarRules[seed % grammarRules.length];
    const question = `Which sentence is grammatically correct?`;
    
    const options = this.shuffleArray([
      rule.correct,
      rule.incorrect,
      this.generateDistractor(rule.correct, 1),
      this.generateDistractor(rule.correct, 2)
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: rule.correct,
      explanation: `${rule.explanation} (Rule: ${rule.rule})`,
      topic: 'grammar',
      tags: ['english', 'grammar', rule.rule.toLowerCase().replace(/\s+/g, '-'), 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate vocabulary questions with rich context
   */
  static generateVocabularyQuestion(grade, difficulty, seed) {
    const vocabularyWords = this.getVocabularyByGrade(grade, difficulty);
    const word = vocabularyWords[seed % vocabularyWords.length];
    
    const question = `What does "${word.word}" mean in this context?\n\n"${word.sentence}"`;
    
    const options = this.shuffleArray([
      word.meaning,
      ...word.wrongMeanings
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: word.meaning,
      explanation: `"${word.word}" means ${word.meaning}. ${word.explanation}`,
      topic: 'vocabulary',
      tags: ['english', 'vocabulary', 'context-clues', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate literary devices questions
   */
  static generateLiteraryDevicesQuestion(grade, difficulty, seed) {
    const literaryDevices = [
      {
        device: 'Metaphor',
        example: 'Her voice is music to my ears.',
        explanation: 'A metaphor directly compares two unlike things without using "like" or "as".',
        wrongDevices: ['Simile', 'Personification', 'Alliteration']
      },
      {
        device: 'Simile',
        example: 'He runs like the wind.',
        explanation: 'A simile compares two unlike things using "like" or "as".',
        wrongDevices: ['Metaphor', 'Hyperbole', 'Onomatopoeia']
      },
      {
        device: 'Personification',
        example: 'The wind whispered through the trees.',
        explanation: 'Personification gives human characteristics to non-human things.',
        wrongDevices: ['Metaphor', 'Simile', 'Alliteration']
      },
      {
        device: 'Alliteration',
        example: 'Peter Piper picked a peck of pickled peppers.',
        explanation: 'Alliteration is the repetition of initial consonant sounds.',
        wrongDevices: ['Assonance', 'Metaphor', 'Hyperbole']
      },
      {
        device: 'Hyperbole',
        example: 'I have told you a million times!',
        explanation: 'Hyperbole is deliberate exaggeration for emphasis or effect.',
        wrongDevices: ['Metaphor', 'Simile', 'Irony']
      }
    ];
    
    const device = literaryDevices[seed % literaryDevices.length];
    const question = `What literary device is used in this sentence?\n\n"${device.example}"`;
    
    const options = this.shuffleArray([
      device.device,
      ...device.wrongDevices
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: device.device,
      explanation: device.explanation,
      topic: 'literary devices',
      tags: ['english', 'literary-devices', device.device.toLowerCase(), 'expanded'],
      estimatedTime: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 120 : 150
    };
  }
  
  /**
   * Generate parts of speech questions
   */
  static generatePartsOfSpeechQuestion(grade, difficulty, seed) {
    const sentences = [
      {
        sentence: 'The quick brown fox jumps over the lazy dog.',
        word: 'quick',
        partOfSpeech: 'Adjective',
        explanation: '"Quick" describes the fox, making it an adjective.',
        wrongParts: ['Noun', 'Verb', 'Adverb']
      },
      {
        sentence: 'She sings beautifully in the choir.',
        word: 'beautifully',
        partOfSpeech: 'Adverb',
        explanation: '"Beautifully" describes how she sings, making it an adverb.',
        wrongParts: ['Adjective', 'Noun', 'Verb']
      },
      {
        sentence: 'The children played happily in the garden.',
        word: 'children',
        partOfSpeech: 'Noun',
        explanation: '"Children" names a group of people, making it a noun.',
        wrongParts: ['Verb', 'Adjective', 'Adverb']
      },
      {
        sentence: 'We will travel to Paris next summer.',
        word: 'travel',
        partOfSpeech: 'Verb',
        explanation: '"Travel" shows action, making it a verb.',
        wrongParts: ['Noun', 'Adjective', 'Preposition']
      }
    ];
    
    const example = sentences[seed % sentences.length];
    const question = `In the sentence "${example.sentence}", what part of speech is the word "${example.word}"?`;
    
    const options = this.shuffleArray([
      example.partOfSpeech,
      ...example.wrongParts
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: example.partOfSpeech,
      explanation: example.explanation,
      topic: 'parts of speech',
      tags: ['english', 'grammar', 'parts-of-speech', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate synonyms and antonyms questions
   */
  static generateSynonymsAntonymsQuestion(grade, difficulty, seed) {
    const wordPairs = [
      {
        word: 'happy',
        synonym: 'joyful',
        antonym: 'sad',
        wrongOptions: ['angry', 'tired', 'confused'],
        type: seed % 2 === 0 ? 'synonym' : 'antonym'
      },
      {
        word: 'difficult',
        synonym: 'challenging',
        antonym: 'easy',
        wrongOptions: ['simple', 'boring', 'interesting'],
        type: seed % 2 === 0 ? 'synonym' : 'antonym'
      },
      {
        word: 'enormous',
        synonym: 'huge',
        antonym: 'tiny',
        wrongOptions: ['medium', 'colorful', 'round'],
        type: seed % 2 === 0 ? 'synonym' : 'antonym'
      }
    ];
    
    const pair = wordPairs[seed % wordPairs.length];
    const isLookingForSynonym = pair.type === 'synonym';
    const correctAnswer = isLookingForSynonym ? pair.synonym : pair.antonym;
    const questionType = isLookingForSynonym ? 'synonym' : 'antonym';
    
    const question = `Which word is a ${questionType} for "${pair.word}"?`;
    
    const wrongOptions = isLookingForSynonym ? 
      [pair.antonym, ...pair.wrongOptions.slice(0, 2)] :
      [pair.synonym, ...pair.wrongOptions.slice(0, 2)];
    
    const options = this.shuffleArray([correctAnswer, ...wrongOptions]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: correctAnswer,
      explanation: `"${correctAnswer}" is a ${questionType} for "${pair.word}" because they have ${isLookingForSynonym ? 'similar' : 'opposite'} meanings.`,
      topic: `${questionType}s`,
      tags: ['english', 'vocabulary', questionType, 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Get vocabulary words by grade level
   */
  static getVocabularyByGrade(grade, difficulty) {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 3) {
      return [
        {
          word: 'gigantic',
          sentence: 'The gigantic elephant trumpeted loudly at the zoo.',
          meaning: 'extremely large',
          wrongMeanings: ['very small', 'very loud', 'very fast'],
          explanation: 'Gigantic means extremely large in size.'
        },
        {
          word: 'furious',
          sentence: 'Mom was furious when she saw the broken vase.',
          meaning: 'very angry',
          wrongMeanings: ['very happy', 'very sad', 'very tired'],
          explanation: 'Furious means extremely angry or enraged.'
        }
      ];
    } else if (gradeNum <= 6) {
      return [
        {
          word: 'magnificent',
          sentence: 'The magnificent castle stood proudly on the hilltop.',
          meaning: 'impressively beautiful or grand',
          wrongMeanings: ['very old', 'very small', 'very dark'],
          explanation: 'Magnificent means extremely beautiful, elaborate, or impressive.'
        },
        {
          word: 'treacherous',
          sentence: 'The mountain path was treacherous in the winter snow.',
          meaning: 'dangerous and unpredictable',
          wrongMeanings: ['very beautiful', 'very short', 'very wide'],
          explanation: 'Treacherous means involving hidden or unpredictable dangers.'
        }
      ];
    } else {
      return [
        {
          word: 'eloquent',
          sentence: 'The senator gave an eloquent speech about environmental protection.',
          meaning: 'fluent and persuasive in speaking',
          wrongMeanings: ['very quiet', 'very boring', 'very short'],
          explanation: 'Eloquent means fluent or persuasive in speaking or writing.'
        },
        {
          word: 'meticulous',
          sentence: 'The scientist was meticulous in recording every detail of the experiment.',
          meaning: 'showing great attention to detail',
          wrongMeanings: ['very careless', 'very fast', 'very lazy'],
          explanation: 'Meticulous means showing great attention to detail; very careful and precise.'
        }
      ];
    }
  }
  
  /**
   * Generate distractors for grammar questions
   */
  static generateDistractor(correctSentence, variant) {
    const distractors = [
      correctSentence.replace(/\./g, '!'),
      correctSentence.replace(/\b(a|an|the)\b/g, ''),
      correctSentence.replace(/\b(is|are|was|were)\b/g, 'be')
    ];
    
    return distractors[variant % distractors.length] || correctSentence;
  }
  
  /**
   * Utility function to shuffle array
   */
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = EnhancedEnglishGenerator;
