/**
 * ENHANCED READING COMPREHENSION GENERATOR
 * 
 * Generates diverse reading comprehension questions with:
 * - Age-appropriate passages
 * - Vocabulary questions
 * - Main idea identification
 * - Detail comprehension
 * - Inference questions
 */

class EnhancedReadingGenerator {
  
  /**
   * Generate a reading comprehension question
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
    const baseTypes = ['main_idea', 'details', 'vocabulary'];
    
    if (grade >= 3) baseTypes.push('sequence', 'cause_effect');
    if (grade >= 5) baseTypes.push('inference', 'author_purpose');
    if (grade >= 7) baseTypes.push('theme', 'character_analysis');
    if (grade >= 9) baseTypes.push('literary_devices', 'critical_analysis');
    
    return baseTypes;
  }
  
  /**
   * Generate question by type
   */
  static generateByType(type, grade, difficulty, seed) {
    switch (type) {
      case 'main_idea':
        return this.generateMainIdeaQuestion(grade, difficulty, seed);
      case 'details':
        return this.generateDetailsQuestion(grade, difficulty, seed);
      case 'vocabulary':
        return this.generateVocabularyQuestion(grade, difficulty, seed);
      case 'inference':
        return this.generateInferenceQuestion(grade, difficulty, seed);
      case 'sequence':
        return this.generateSequenceQuestion(grade, difficulty, seed);
      case 'cause_effect':
        return this.generateCauseEffectQuestion(grade, difficulty, seed);
      case 'author_purpose':
        return this.generateAuthorPurposeQuestion(grade, difficulty, seed);
      default:
        return this.generateMainIdeaQuestion(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate main idea questions
   */
  static generateMainIdeaQuestion(grade, difficulty, seed) {
    const passages = this.getPassagesForGrade(grade, difficulty);
    const passage = passages[seed % passages.length];
    
    const question = `Read the passage and identify the main idea:\n\n"${passage.text}"\n\nWhat is the main idea of this passage?`;
    
    const options = this.shuffleArray([
      passage.mainIdea,
      ...passage.wrongMainIdeas
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: passage.mainIdea,
      explanation: `The main idea is "${passage.mainIdea}" because ${passage.explanation}`,
      topic: 'main idea',
      tags: ['reading', 'comprehension', 'main-idea', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180
    };
  }
  
  /**
   * Generate detail questions
   */
  static generateDetailsQuestion(grade, difficulty, seed) {
    const passages = this.getPassagesForGrade(grade, difficulty);
    const passage = passages[seed % passages.length];
    
    const detailQuestions = passage.detailQuestions || [];
    if (detailQuestions.length === 0) {
      return this.generateMainIdeaQuestion(grade, difficulty, seed);
    }
    
    const detailQ = detailQuestions[seed % detailQuestions.length];
    const question = `Read the passage:\n\n"${passage.text}"\n\n${detailQ.question}`;
    
    const options = this.shuffleArray([
      detailQ.answer,
      ...detailQ.wrongAnswers
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: detailQ.answer,
      explanation: detailQ.explanation,
      topic: 'reading details',
      tags: ['reading', 'comprehension', 'details', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180
    };
  }
  
  /**
   * Generate vocabulary questions
   */
  static generateVocabularyQuestion(grade, difficulty, seed) {
    const vocabularyWords = this.getVocabularyForGrade(grade, difficulty);
    const word = vocabularyWords[seed % vocabularyWords.length];
    
    const question = `What does the word "${word.word}" mean in this sentence?\n\n"${word.sentence}"`;
    
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
      tags: ['reading', 'vocabulary', 'word-meaning', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    };
  }
  
  /**
   * Generate inference questions
   */
  static generateInferenceQuestion(grade, difficulty, seed) {
    const inferencePassages = [
      {
        text: "Sarah looked at the dark clouds gathering overhead. She quickly grabbed her umbrella and hurried inside.",
        question: "What can you infer about the weather?",
        answer: "It's likely going to rain",
        wrongAnswers: ["It's sunny", "It's snowing", "It's very hot"],
        explanation: "The dark clouds and Sarah grabbing an umbrella suggest rain is coming."
      },
      {
        text: "Tom studied for hours every night. He made flashcards, took practice tests, and asked his teacher for help. When the test results came back, he had a big smile on his face.",
        question: "What can you infer about Tom's test results?",
        answer: "He did well on the test",
        wrongAnswers: ["He failed the test", "He didn't take the test", "He was confused"],
        explanation: "Tom's hard work and big smile suggest he was happy with his good results."
      },
      {
        text: "The dog's tail was wagging, and it kept bringing its leash to its owner. It ran to the door and back several times.",
        question: "What does the dog want?",
        answer: "To go for a walk",
        wrongAnswers: ["To eat food", "To take a nap", "To play inside"],
        explanation: "The wagging tail, bringing the leash, and running to the door all suggest the dog wants a walk."
      }
    ];
    
    const passage = inferencePassages[seed % inferencePassages.length];
    const question = `Read the passage:\n\n"${passage.text}"\n\n${passage.question}`;
    
    const options = this.shuffleArray([
      passage.answer,
      ...passage.wrongAnswers
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      topic: 'inference',
      tags: ['reading', 'comprehension', 'inference', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180
    };
  }
  
  /**
   * Get passages appropriate for grade level
   */
  static getPassagesForGrade(grade, difficulty) {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 3) {
      return this.getElementaryPassages(difficulty);
    } else if (gradeNum <= 6) {
      return this.getMiddleElementaryPassages(difficulty);
    } else if (gradeNum <= 9) {
      return this.getMiddleSchoolPassages(difficulty);
    } else {
      return this.getHighSchoolPassages(difficulty);
    }
  }
  
  /**
   * Elementary passages (Grades 1-3)
   */
  static getElementaryPassages(difficulty) {
    return [
      {
        text: "Cats are popular pets. They are soft and furry. Cats like to play with toys. They also like to sleep in sunny spots. Many cats purr when they are happy.",
        mainIdea: "Cats make good pets and have interesting behaviors",
        wrongMainIdeas: [
          "All cats are the same color",
          "Cats don't like people",
          "Cats only eat fish"
        ],
        explanation: "the passage describes various positive qualities and behaviors of cats as pets",
        detailQuestions: [
          {
            question: "Where do cats like to sleep?",
            answer: "In sunny spots",
            wrongAnswers: ["In cold places", "Under water", "In the rain"],
            explanation: "The passage states that cats like to sleep in sunny spots."
          }
        ]
      },
      {
        text: "Plants need water, sunlight, and air to grow. Without these things, plants will die. People take care of plants by watering them and putting them in sunny places.",
        mainIdea: "Plants need certain things to survive and grow",
        wrongMainIdeas: [
          "Plants don't need anything to grow",
          "Only water is needed for plants",
          "Plants grow better in darkness"
        ],
        explanation: "the passage explains what plants need to survive and how people help them",
        detailQuestions: [
          {
            question: "What three things do plants need to grow?",
            answer: "Water, sunlight, and air",
            wrongAnswers: ["Only water", "Only sunlight", "Food and toys"],
            explanation: "The passage clearly states plants need water, sunlight, and air."
          }
        ]
      }
    ];
  }
  
  /**
   * Middle elementary passages (Grades 4-6)
   */
  static getMiddleElementaryPassages(difficulty) {
    return [
      {
        text: "The rainforest is home to many different animals and plants. Monkeys swing from tree to tree, colorful birds fly overhead, and insects buzz around the forest floor. The trees in the rainforest are very tall and create a thick canopy that blocks most sunlight from reaching the ground. This unique environment supports more species than any other habitat on Earth.",
        mainIdea: "Rainforests are diverse ecosystems with many species",
        wrongMainIdeas: [
          "Rainforests only have monkeys",
          "Rainforests are empty of life",
          "Rainforests are the same as deserts"
        ],
        explanation: "the passage describes the variety of life and unique characteristics of rainforest ecosystems",
        detailQuestions: [
          {
            question: "What blocks sunlight from reaching the forest floor?",
            answer: "The thick canopy of tall trees",
            wrongAnswers: ["Clouds", "Mountains", "Animals"],
            explanation: "The passage mentions that tall trees create a thick canopy that blocks sunlight."
          }
        ]
      }
    ];
  }
  
  /**
   * Get vocabulary words for grade level
   */
  static getVocabularyForGrade(grade, difficulty) {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 3) {
      return this.getElementaryVocabulary(difficulty);
    } else if (gradeNum <= 6) {
      return this.getMiddleElementaryVocabulary(difficulty);
    } else if (gradeNum <= 9) {
      return this.getMiddleSchoolVocabulary(difficulty);
    } else {
      return this.getHighSchoolVocabulary(difficulty);
    }
  }
  
  /**
   * Elementary vocabulary
   */
  static getElementaryVocabulary(difficulty) {
    return [
      {
        word: "enormous",
        sentence: "The elephant was enormous compared to the mouse.",
        meaning: "very large",
        wrongMeanings: ["very small", "very fast", "very slow"],
        explanation: "Enormous means extremely large in size."
      },
      {
        word: "delighted",
        sentence: "Sarah was delighted when she received the gift.",
        meaning: "very happy",
        wrongMeanings: ["very sad", "very angry", "very tired"],
        explanation: "Delighted means feeling great pleasure and happiness."
      },
      {
        word: "swift",
        sentence: "The swift rabbit ran across the field.",
        meaning: "fast",
        wrongMeanings: ["slow", "lazy", "tired"],
        explanation: "Swift means moving or capable of moving at high speed."
      }
    ];
  }
  
  /**
   * Middle elementary vocabulary
   */
  static getMiddleElementaryVocabulary(difficulty) {
    return [
      {
        word: "magnificent",
        sentence: "The castle looked magnificent against the sunset.",
        meaning: "impressive and beautiful",
        wrongMeanings: ["ugly and broken", "small and plain", "dark and scary"],
        explanation: "Magnificent means extremely beautiful, elaborate, or impressive."
      },
      {
        word: "cautious",
        sentence: "The cautious driver slowed down in the rain.",
        meaning: "careful and alert",
        wrongMeanings: ["reckless and fast", "sleepy and tired", "happy and excited"],
        explanation: "Cautious means being careful to avoid potential problems or dangers."
      }
    ];
  }
  
  /**
   * Generate sequence questions
   */
  static generateSequenceQuestion(grade, difficulty, seed) {
    const sequencePassages = [
      {
        text: "First, Sarah put on her shoes. Then, she grabbed her backpack. Next, she walked to the bus stop. Finally, she got on the school bus.",
        question: "What did Sarah do after putting on her shoes?",
        answer: "She grabbed her backpack",
        wrongAnswers: ["She walked to the bus stop", "She got on the bus", "She went to sleep"],
        explanation: "The passage states that after putting on her shoes, Sarah grabbed her backpack."
      }
    ];
    
    const passage = sequencePassages[seed % sequencePassages.length];
    const question = `Read the passage:\n\n"${passage.text}"\n\n${passage.question}`;
    
    const options = this.shuffleArray([
      passage.answer,
      ...passage.wrongAnswers
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      topic: 'sequence',
      tags: ['reading', 'comprehension', 'sequence', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180
    };
  }
  
  /**
   * Generate cause and effect questions
   */
  static generateCauseEffectQuestion(grade, difficulty, seed) {
    const causeEffectPassages = [
      {
        text: "It started raining heavily. Because of the rain, the soccer game was cancelled.",
        question: "Why was the soccer game cancelled?",
        answer: "Because it was raining heavily",
        wrongAnswers: ["Because it was too hot", "Because no one came", "Because the field was being repaired"],
        explanation: "The passage clearly states the game was cancelled because of the heavy rain."
      }
    ];
    
    const passage = causeEffectPassages[seed % causeEffectPassages.length];
    const question = `Read the passage:\n\n"${passage.text}"\n\n${passage.question}`;
    
    const options = this.shuffleArray([
      passage.answer,
      ...passage.wrongAnswers
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      topic: 'cause and effect',
      tags: ['reading', 'comprehension', 'cause-effect', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180
    };
  }
  
  /**
   * Generate author purpose questions
   */
  static generateAuthorPurposeQuestion(grade, difficulty, seed) {
    const purposePassages = [
      {
        text: "Remember to brush your teeth twice a day and floss regularly. This will help keep your teeth healthy and prevent cavities.",
        question: "What is the author's purpose in writing this passage?",
        answer: "To give advice about dental care",
        wrongAnswers: ["To tell a story", "To describe teeth", "To entertain readers"],
        explanation: "The author is giving instructions and advice about how to care for teeth."
      }
    ];
    
    const passage = purposePassages[seed % purposePassages.length];
    const question = `Read the passage:\n\n"${passage.text}"\n\n${passage.question}`;
    
    const options = this.shuffleArray([
      passage.answer,
      ...passage.wrongAnswers
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      topic: 'author purpose',
      tags: ['reading', 'comprehension', 'author-purpose', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180
    };
  }
  
  // Placeholder methods for higher grades
  static getMiddleSchoolPassages(difficulty) {
    return this.getMiddleElementaryPassages(difficulty);
  }
  
  static getHighSchoolPassages(difficulty) {
    return this.getMiddleElementaryPassages(difficulty);
  }
  
  static getMiddleSchoolVocabulary(difficulty) {
    return this.getMiddleElementaryVocabulary(difficulty);
  }
  
  static getHighSchoolVocabulary(difficulty) {
    return this.getMiddleElementaryVocabulary(difficulty);
  }
}

module.exports = EnhancedReadingGenerator;
