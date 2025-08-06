import { Question, DifficultyLevel, QuestionType } from '../types';

/**
 * Enhanced Reading Question Generator
 * 
 * Based on NAPLAN reading assessments, this generator creates
 * comprehensive reading comprehension questions:
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
   * Generate enhanced reading questions
   */
  static generateQuestions(config: ReadingConfig): Question[] {
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
        'literal_comprehension', 'simple_inference', 'vocabulary_basic',
        'character_identification', 'sequence_events', 'main_idea_simple'
      ];
    } else if (grade <= 6) {
      return [
        'literal_comprehension', 'inferential_reading', 'vocabulary_context',
        'text_structure', 'author_purpose', 'compare_contrast', 'main_ideas'
      ];
    } else if (grade <= 9) {
      return [
        'critical_analysis', 'inferential_complex', 'vocabulary_advanced',
        'author_perspective', 'text_analysis', 'theme_identification', 'literary_devices'
      ];
    } else {
      return [
        'critical_evaluation', 'complex_inference', 'sophisticated_vocabulary',
        'rhetorical_analysis', 'comparative_literature', 'thematic_analysis', 'stylistic_analysis'
      ];
    }
  }

  private static selectQuestionType(types: string[]): string {
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateQuestionByType(type: string, grade: number, difficulty: DifficultyLevel): Question {
    switch (type) {
      case 'literal_comprehension':
      case 'simple_inference':
        return this.generateLiteralComprehensionQuestion(grade, difficulty);
      case 'vocabulary_basic':
      case 'vocabulary_context':
        return this.generateVocabularyQuestion(grade, difficulty);
      case 'inferential_reading':
      case 'inferential_complex':
        return this.generateInferentialQuestion(grade, difficulty);
      case 'author_purpose':
      case 'author_perspective':
        return this.generateAuthorPurposeQuestion(grade, difficulty);
      case 'text_structure':
      case 'text_analysis':
        return this.generateTextStructureQuestion(grade, difficulty);
      case 'main_ideas':
      case 'main_idea_simple':
        return this.generateMainIdeaQuestion(grade, difficulty);
      case 'critical_analysis':
      case 'critical_evaluation':
        return this.generateCriticalAnalysisQuestion(grade, difficulty);
      default:
        return this.generateLiteralComprehensionQuestion(grade, difficulty);
    }
  }

  /**
   * Literal Comprehension Questions
   */
  private static generateLiteralComprehensionQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: 'Boots the Cat\n\nMina and Jack have a cat named Boots. Boots is white with black feet. Mina and Jack keep lots of toys for Boots in a big box. There is a toy that looks like a carrot and there is a green ball too. Sometimes Boots visits Grandma and Grandpa\'s house. Grandma likes to toss a toy mouse for Boots. She gives Boots cat treats that look like little fish. Boots likes playing in the toy box the most!',
        question: 'What does Boots like doing the most?',
        answer: 'Playing in the toy box',
        explanation: 'The text clearly states "Boots likes playing in the toy box the most!"',
        options: ['Playing in the toy box', 'Visiting Grandma and Grandpa', 'Eating fish treats', 'Playing with the green ball']
      },
      {
        text: 'Seahorses\n\nSeahorses live in the ocean. They are fish but some people think that seahorses look a bit like \'land\' horses. A group of seahorses is called a herd. Baby seahorses are called fry. Female seahorses lay eggs but it is the male seahorses that look after the eggs. Male seahorses keep the eggs in pouches at the front of their bodies.',
        question: 'What are baby seahorses called?',
        answer: 'Fry',
        explanation: 'The text directly states "Baby seahorses are called fry."',
        options: ['Fry', 'Foals', 'Pups', 'Calves']
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: passage.options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      subject: 'Reading',
      topic: 'Literal Comprehension',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['reading-comprehension', 'literal', 'facts'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Vocabulary Questions
   */
  private static generateVocabularyQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const contexts = [
      {
        text: 'The Terracotta Army\n\nFarmers digging a well in 1974 made an incredible discovery. What they had stumbled upon was one of the most significant archaeological finds of the 20th century - the Terracotta Army. This vast underground army consists of thousands of life-sized clay soldiers, each with unique facial features and expressions.',
        question: 'In this context, what does "stumbled upon" mean?',
        answer: 'Discovered by accident',
        explanation: 'The farmers were digging a well and accidentally found the Terracotta Army, so "stumbled upon" means discovered by accident.',
        options: ['Discovered by accident', 'Searched for carefully', 'Fell over something', 'Walked quickly toward']
      },
      {
        text: 'The Great Blondin\n\nBlondin was a daring tightrope walker who performed incredible feats above Niagara Falls. More than 25,000 onlookers gathered to watch his performances. The writer includes this information to show how fascinated people were by what Blondin was doing.',
        question: 'What does "daring" mean in this context?',
        answer: 'Brave and willing to take risks',
        explanation: 'Someone who walks on a tightrope above dangerous falls must be brave and willing to take risks.',
        options: ['Brave and willing to take risks', 'Foolish and careless', 'Skilled and experienced', 'Famous and popular']
      }
    ];

    const context = contexts[Math.floor(Math.random() * contexts.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${context.text}\n\n${context.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: context.options,
      correctAnswer: context.answer,
      explanation: context.explanation,
      subject: 'Reading',
      topic: 'Vocabulary in Context',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['vocabulary', 'context-clues', 'word-meaning'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Inferential Reading Questions
   */
  private static generateInferentialQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: 'The Terracotta Army\n\nThe construction of Emperor Qin Shi Huang\'s tomb began when he became emperor at age 13. The tomb was designed to protect the emperor in the afterlife, similar to how Egyptian pharaohs were buried with things they would have used while alive. Each of the thousands of terracotta soldiers has different facial features, showing the incredible craftsmanship of ancient Chinese artisans.',
        question: 'Why does the text compare Emperor Qin Shi Huang to Egyptian pharaohs?',
        answer: 'Both were buried with things they would have used while alive',
        explanation: 'The text makes this comparison to show that both cultures buried their rulers with items for the afterlife.',
        options: ['Both were buried with things they would have used while alive', 'Both became rulers at a young age', 'Both built elaborate tombs in China', 'Both possessed terracotta armies']
      },
      {
        text: 'Ocean Cleanup\n\nMarine biologists have noticed that sea turtles are increasingly found with plastic debris in their stomachs. Many seabirds are also building nests with plastic materials instead of natural materials. Fish populations in areas with high plastic pollution show signs of stress and reduced reproduction rates.',
        question: 'What can we infer about the impact of plastic pollution on marine life?',
        answer: 'It is harming multiple species in different ways',
        explanation: 'The passage shows plastic affecting turtles (ingestion), birds (nesting), and fish (stress/reproduction), indicating widespread harm.',
        options: ['It is harming multiple species in different ways', 'It only affects large marine animals', 'It is helping animals build better nests', 'It has no significant impact on ocean life']
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: passage.options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      subject: 'Reading',
      topic: 'Inferential Reading',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['inference', 'reading-between-lines', 'critical-thinking'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Author's Purpose Questions
   */
  private static generateAuthorPurposeQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: 'Climate Change Action\n\nEvery day, we make choices that affect our planet. When we turn off lights, use reusable bags, or walk instead of driving, we reduce our carbon footprint. These small actions might seem insignificant, but when millions of people make these choices, the impact is enormous. The time to act is now - our planet\'s future depends on the decisions we make today.',
        question: 'What is the author\'s main purpose in writing this passage?',
        answer: 'To persuade readers to take action on climate change',
        explanation: 'The author uses persuasive language like "The time to act is now" and emphasizes how individual actions can make a difference.',
        options: ['To persuade readers to take action on climate change', 'To explain the science behind climate change', 'To describe the effects of global warming', 'To compare different environmental policies']
      },
      {
        text: 'The Life Cycle of Butterflies\n\nButterflies undergo complete metamorphosis, which consists of four distinct stages. First, the adult butterfly lays eggs on a leaf. Next, caterpillars hatch from the eggs and begin eating the leaf. Then, the caterpillar forms a chrysalis around itself. Finally, the adult butterfly emerges from the chrysalis, ready to start the cycle again.',
        question: 'What is the author\'s main purpose?',
        answer: 'To inform readers about butterfly metamorphosis',
        explanation: 'The author presents factual information in a clear, sequential manner to educate readers about the butterfly life cycle.',
        options: ['To inform readers about butterfly metamorphosis', 'To persuade people to protect butterflies', 'To entertain with a story about butterflies', 'To compare butterflies to other insects']
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: passage.options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      subject: 'Reading',
      topic: 'Author\'s Purpose',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['authors-purpose', 'persuade', 'inform', 'entertain'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Text Structure Questions
   */
  private static generateTextStructureQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: 'Renewable vs. Non-Renewable Energy\n\nRenewable energy sources, such as solar and wind power, can be replenished naturally and will never run out. In contrast, non-renewable energy sources like coal and oil take millions of years to form and will eventually be depleted. While renewable energy is cleaner for the environment, non-renewable sources currently provide most of the world\'s energy because they are more established and often cheaper to use.',
        question: 'How is this passage organized?',
        answer: 'Compare and contrast',
        explanation: 'The passage compares renewable and non-renewable energy sources, showing their similarities and differences.',
        options: ['Compare and contrast', 'Chronological order', 'Problem and solution', 'Cause and effect']
      },
      {
        text: 'How to Plant a Garden\n\nFirst, choose a sunny location for your garden. Next, prepare the soil by removing weeds and adding compost. Then, plant your seeds according to the package directions. After planting, water the seeds gently. Finally, maintain your garden by watering regularly and removing weeds as they appear.',
        question: 'What text structure does the author use?',
        answer: 'Sequential/Process',
        explanation: 'The passage uses sequence words like "First," "Next," "Then," and "Finally" to show the steps in order.',
        options: ['Sequential/Process', 'Compare and contrast', 'Problem and solution', 'Description']
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: passage.options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      subject: 'Reading',
      topic: 'Text Structure',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['text-structure', 'organization', 'sequence'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Main Idea Questions
   */
  private static generateMainIdeaQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: 'Bees are essential pollinators that help plants reproduce. Without bees, many of the fruits and vegetables we eat would not exist. Unfortunately, bee populations are declining due to pesticide use, habitat loss, and disease. Scientists and farmers are working together to create bee-friendly environments and reduce harmful chemicals. Protecting bees is crucial for maintaining our food supply and healthy ecosystems.',
        question: 'What is the main idea of this passage?',
        answer: 'Bees are important and need protection',
        explanation: 'The passage explains why bees are essential and discusses efforts to protect them from various threats.',
        options: ['Bees are important and need protection', 'Pesticides are harmful to all insects', 'Farmers should stop using chemicals', 'Scientists study bee behavior']
      },
      {
        text: 'Ancient Libraries\n\nThe Library of Alexandria was one of the most famous libraries in ancient times. It contained hundreds of thousands of scrolls and attracted scholars from around the world. The library served as a center of learning where people could study mathematics, astronomy, medicine, and literature. Although the original library no longer exists, its legacy continues to inspire modern libraries and educational institutions.',
        question: 'What is the main idea?',
        answer: 'The Library of Alexandria was an important center of learning',
        explanation: 'The passage focuses on the library\'s role as a major educational center and its lasting influence.',
        options: ['The Library of Alexandria was an important center of learning', 'Ancient scrolls were made of papyrus', 'Modern libraries are better than ancient ones', 'Scholars traveled long distances in ancient times']
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: passage.options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      subject: 'Reading',
      topic: 'Main Ideas',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['main-idea', 'central-theme', 'comprehension'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Critical Analysis Questions
   */
  private static generateCriticalAnalysisQuestion(grade: number, difficulty: DifficultyLevel): Question {
    const passages = [
      {
        text: 'Social Media and Teenagers\n\nA recent study claims that teenagers who spend more than 3 hours daily on social media are 70% more likely to experience anxiety. The study surveyed 1,000 teenagers from urban areas over a 6-month period. However, the researchers did not account for other factors that might contribute to anxiety, such as academic pressure, family situations, or pre-existing mental health conditions.',
        question: 'What is a limitation of this study?',
        answer: 'It didn\'t consider other factors that might cause anxiety',
        explanation: 'The passage states that researchers didn\'t account for other potential causes of anxiety, which is a significant limitation.',
        options: ['It didn\'t consider other factors that might cause anxiety', 'The sample size was too small', 'It only studied urban teenagers', 'The study period was too short']
      },
      {
        text: 'Electric Cars: The Future of Transportation\n\nElectric cars produce zero emissions and are much quieter than traditional vehicles. They are clearly the best choice for environmentally conscious consumers. With government incentives and falling battery prices, electric cars will soon replace all gasoline vehicles. Everyone should buy an electric car to save the planet.',
        question: 'What makes this argument weak?',
        answer: 'It ignores potential drawbacks of electric cars',
        explanation: 'The argument is one-sided and doesn\'t consider limitations like charging infrastructure, battery disposal, or electricity sources.',
        options: ['It ignores potential drawbacks of electric cars', 'It provides too many statistics', 'It doesn\'t mention government incentives', 'It focuses too much on environmental benefits']
      }
    ];

    const passage = passages[Math.floor(Math.random() * passages.length)];

    return {
      _id: this.generateId(),
      content: `Read the passage and answer the question.\n\n${passage.text}\n\n${passage.question}`,
      type: QuestionType.MULTIPLE_CHOICE,
      options: passage.options,
      correctAnswer: passage.answer,
      explanation: passage.explanation,
      subject: 'Reading',
      topic: 'Critical Analysis',
      difficulty: difficulty,
      grade: grade.toString(),
      tags: ['critical-analysis', 'evaluation', 'bias', 'argument-analysis'],
      createdBy: 'enhanced-reading-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Export convenience function
export function generateEnhancedReadingQuestions(
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 1
): Question[] {
  return EnhancedReadingGenerator.generateQuestions({
    grade,
    difficulty,
    questionCount: count
  });
}

export default EnhancedReadingGenerator;
