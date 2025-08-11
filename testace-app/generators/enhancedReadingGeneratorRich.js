/**
 * ENHANCED READING GENERATOR WITH RICH PASSAGES
 * 
 * Leverages vast knowledge base to create high-quality reading comprehension questions
 * with passages from literature, science, history, and other domains.
 */

class EnhancedReadingGeneratorRich {
  
  /**
   * Generate a reading question based on grade and difficulty
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
    const baseTypes = ['main_idea', 'details', 'vocabulary_context'];
    
    if (grade >= 3) baseTypes.push('sequence', 'cause_effect');
    if (grade >= 5) baseTypes.push('inference', 'author_purpose', 'compare_contrast');
    if (grade >= 7) baseTypes.push('theme', 'character_analysis', 'text_structure');
    if (grade >= 9) baseTypes.push('literary_analysis', 'rhetorical_devices', 'critical_evaluation');
    
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
      case 'vocabulary_context':
        return this.generateVocabularyContextQuestion(grade, difficulty, seed);
      case 'inference':
        return this.generateInferenceQuestion(grade, difficulty, seed);
      case 'author_purpose':
        return this.generateAuthorPurposeQuestion(grade, difficulty, seed);
      case 'theme':
        return this.generateThemeQuestion(grade, difficulty, seed);
      case 'literary_analysis':
        return this.generateLiteraryAnalysisQuestion(grade, difficulty, seed);
      default:
        return this.generateMainIdeaQuestion(grade, difficulty, seed);
    }
  }
  
  /**
   * Generate main idea questions with rich passages
   */
  static generateMainIdeaQuestion(grade, difficulty, seed) {
    const passages = this.getRichPassagesForGrade(grade, difficulty);
    const passage = passages[seed % passages.length];
    
    const question = `Read the passage below and identify the main idea:\n\n"${passage.text}"\n\nWhat is the main idea of this passage?`;
    
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
      tags: ['reading', 'comprehension', 'main-idea', 'rich-content', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
    };
  }
  
  /**
   * Generate inference questions with sophisticated passages
   */
  static generateInferenceQuestion(grade, difficulty, seed) {
    const inferencePassages = this.getInferencePassagesForGrade(grade, difficulty);
    const passage = inferencePassages[seed % inferencePassages.length];
    
    const question = `Read the passage below:\n\n"${passage.text}"\n\n${passage.question}`;
    
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
      tags: ['reading', 'comprehension', 'inference', 'rich-content', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 150 : difficulty === 'medium' ? 210 : 270
    };
  }
  
  /**
   * Generate vocabulary in context questions
   */
  static generateVocabularyContextQuestion(grade, difficulty, seed) {
    const vocabPassages = this.getVocabularyPassagesForGrade(grade, difficulty);
    const passage = vocabPassages[seed % vocabPassages.length];
    
    const question = `Read the passage below:\n\n"${passage.text}"\n\nBased on the context, what does the word "${passage.targetWord}" most likely mean?`;
    
    const options = this.shuffleArray([
      passage.correctMeaning,
      ...passage.wrongMeanings
    ]);
    
    return {
      content: question,
      type: 'multiple_choice',
      options: options,
      correctAnswer: passage.correctMeaning,
      explanation: passage.explanation,
      topic: 'vocabulary in context',
      tags: ['reading', 'vocabulary', 'context-clues', 'rich-content', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
    };
  }
  
  /**
   * Get rich passages for different grade levels
   */
  static getRichPassagesForGrade(grade, difficulty) {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 3) {
      return this.getElementaryRichPassages(difficulty);
    } else if (gradeNum <= 6) {
      return this.getMiddleElementaryRichPassages(difficulty);
    } else if (gradeNum <= 9) {
      return this.getMiddleSchoolRichPassages(difficulty);
    } else {
      return this.getHighSchoolRichPassages(difficulty);
    }
  }
  
  /**
   * Elementary rich passages (Grades 1-3)
   */
  static getElementaryRichPassages(difficulty) {
    return [
      {
        text: "Honeybees are amazing insects that help plants grow. When a bee visits a flower to collect nectar, tiny grains of pollen stick to its fuzzy body. As the bee flies from flower to flower, it carries this pollen along. When pollen from one flower reaches another flower of the same type, new seeds can form. This process is called pollination, and without it, many plants could not reproduce. Farmers depend on bees to pollinate their crops, which is why bees are so important to our food supply.",
        mainIdea: "Bees help plants reproduce through pollination",
        wrongMainIdeas: [
          "Bees only collect nectar from flowers",
          "Farmers don't need bees for their crops",
          "Pollen is harmful to plants"
        ],
        explanation: "the passage explains how bees carry pollen between flowers, helping plants reproduce",
        source: "Science - Pollination"
      },
      {
        text: "The ancient Egyptians built the pyramids over 4,000 years ago. These massive stone structures were tombs for pharaohs, who were the kings of Egypt. The largest pyramid, called the Great Pyramid of Giza, took about 20 years to build and required thousands of workers. The Egyptians had to cut huge blocks of stone, transport them to the building site, and stack them carefully to create the pyramid shape. Today, people from all over the world visit Egypt to see these incredible monuments that have survived for thousands of years.",
        mainIdea: "The ancient Egyptians built pyramids as tombs for their kings",
        wrongMainIdeas: [
          "Pyramids were built as houses for ordinary people",
          "The pyramids were built recently",
          "Only one pyramid exists in Egypt"
        ],
        explanation: "the passage describes how pyramids were built as tombs for pharaohs (kings) in ancient Egypt",
        source: "History - Ancient Egypt"
      }
    ];
  }
  
  /**
   * Middle elementary rich passages (Grades 4-6)
   */
  static getMiddleElementaryRichPassages(difficulty) {
    return [
      {
        text: "The Amazon rainforest, often called the 'lungs of the Earth,' plays a crucial role in regulating our planet's climate. This vast forest, covering much of the Amazon Basin in South America, contains an estimated 390 billion trees representing about 16,000 different species. These trees absorb carbon dioxide from the atmosphere and release oxygen through photosynthesis. Scientists estimate that the Amazon produces about 20% of the world's oxygen. The forest is also home to an incredible diversity of wildlife, including jaguars, sloths, colorful parrots, and thousands of insect species. Unfortunately, deforestation threatens this vital ecosystem, as large areas are cleared for agriculture and development each year.",
        mainIdea: "The Amazon rainforest is vital for Earth's climate and biodiversity",
        wrongMainIdeas: [
          "The Amazon only contains a few types of trees",
          "The Amazon rainforest produces very little oxygen",
          "Deforestation is not a problem in the Amazon"
        ],
        explanation: "the passage emphasizes the Amazon's importance for climate regulation, oxygen production, and biodiversity",
        source: "Environmental Science - Amazon Rainforest"
      },
      {
        text: "Marie Curie was a pioneering scientist who made groundbreaking discoveries about radioactivity. Born in Poland in 1867, she moved to Paris to study at the Sorbonne University. Working alongside her husband Pierre, Marie discovered two new elements: polonium and radium. She was the first woman to win a Nobel Prize, and remarkably, she won Nobel Prizes in two different sciences - Physics in 1903 and Chemistry in 1911. Her research laid the foundation for modern atomic physics and led to important medical applications, including the use of radiation to treat cancer. Despite facing discrimination as a woman in science, Marie Curie's dedication and brilliant mind changed our understanding of the physical world forever.",
        mainIdea: "Marie Curie was a groundbreaking scientist who discovered new elements and won Nobel Prizes",
        wrongMainIdeas: [
          "Marie Curie only studied in Poland",
          "She never won any scientific awards",
          "Her work had no practical applications"
        ],
        explanation: "the passage highlights Marie Curie's major scientific achievements and her impact on science",
        source: "Biography - Marie Curie"
      }
    ];
  }
  
  /**
   * Get inference passages for different grades
   */
  static getInferencePassagesForGrade(grade, difficulty) {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 6) {
      return [
        {
          text: "Sarah packed her warmest coat, wool mittens, and snow boots into her suitcase. She also included a camera, ski goggles, and several thick sweaters. Her plane ticket showed a destination of Aspen, Colorado, and the departure date was December 15th.",
          question: "Based on the passage, what can you infer about Sarah's trip?",
          answer: "She is going on a winter vacation to ski or snowboard",
          wrongAnswers: [
            "She is moving to Colorado permanently",
            "She is going to a beach resort",
            "She is traveling for business meetings"
          ],
          explanation: "The winter clothing, ski goggles, December date, and Aspen destination all suggest a winter sports vacation."
        },
        {
          text: "The old lighthouse keeper climbed the winding stairs one last time, his weathered hands trailing along the familiar stone walls. Tomorrow, the automated beacon would take over his duties. He paused at the top, gazing out at the endless ocean that had been his companion for thirty years. The ships would still find their way safely to shore, but they would no longer depend on his watchful eye.",
          question: "What can you infer about the lighthouse keeper?",
          answer: "He is retiring after many years of service",
          wrongAnswers: [
            "He is just starting his job at the lighthouse",
            "He is afraid of the ocean",
            "He plans to work there for many more years"
          ],
          explanation: "The phrases 'one last time,' 'thirty years,' and the mention of automation taking over suggest he is ending his career."
        }
      ];
    } else {
      return [
        {
          text: "The scientist's hands trembled slightly as she prepared the final mixture. Years of research had led to this moment. The laboratory was silent except for the gentle hum of equipment. She had double-checked every calculation, verified every measurement. If her hypothesis was correct, this experiment could revolutionize renewable energy. The implications were staggering - clean, unlimited power that could change the world. She took a deep breath and added the catalyst.",
          question: "What can you infer about the scientist's emotional state?",
          answer: "She is nervous but excited about a potentially groundbreaking discovery",
          wrongAnswers: [
            "She is bored with routine laboratory work",
            "She is confident the experiment will fail",
            "She is angry about her research being questioned"
          ],
          explanation: "The trembling hands, years of preparation, and revolutionary implications suggest nervous anticipation about an important breakthrough."
        }
      ];
    }
  }
  
  /**
   * Get vocabulary passages for context clues
   */
  static getVocabularyPassagesForGrade(grade, difficulty) {
    const gradeNum = parseInt(grade);
    
    if (gradeNum <= 6) {
      return [
        {
          text: "The archaeologist carefully excavated the ancient site, using small brushes and tools to uncover artifacts that had been buried for centuries. Each discovery was meticulously documented and photographed before being removed from the ground.",
          targetWord: "excavated",
          correctMeaning: "carefully dug up and uncovered",
          wrongMeanings: [
            "quickly destroyed",
            "painted over",
            "built upon"
          ],
          explanation: "The context clues 'carefully,' 'uncover,' and 'buried' help us understand that excavated means to dig up and uncover."
        },
        {
          text: "The mountain climber felt euphoric when she reached the summit after three days of difficult climbing. She raised her arms in triumph and shouted with joy, overwhelmed by her sense of accomplishment.",
          targetWord: "euphoric",
          correctMeaning: "extremely happy and excited",
          wrongMeanings: [
            "very tired and exhausted",
            "angry and frustrated",
            "confused and lost"
          ],
          explanation: "The context clues 'triumph,' 'shouted with joy,' and 'sense of accomplishment' indicate that euphoric means extremely happy."
        }
      ];
    } else {
      return [
        {
          text: "The politician's speech was filled with rhetoric designed to persuade voters, but critics argued that his eloquent words lacked substance. While his delivery was polished and his arguments seemed compelling, closer examination revealed logical fallacies and unsupported claims.",
          targetWord: "rhetoric",
          correctMeaning: "persuasive language, especially when lacking substance",
          wrongMeanings: [
            "scientific facts and data",
            "quiet, humble speech",
            "foreign language translation"
          ],
          explanation: "The context suggests rhetoric refers to persuasive language that may lack substance, as indicated by the contrast with 'lacked substance.'"
        }
      ];
    }
  }
  
  /**
   * Generate details questions
   */
  static generateDetailsQuestion(grade, difficulty, seed) {
    const passages = this.getRichPassagesForGrade(grade, difficulty);
    const passage = passages[seed % passages.length];
    
    // Create detail questions from the passage
    const detailQuestions = [
      {
        question: "According to the passage, what specific information is mentioned?",
        answer: this.extractDetailFromPassage(passage),
        wrongAnswers: [
          "Information not mentioned in the passage",
          "Incorrect detail from passage",
          "Unrelated information"
        ]
      }
    ];
    
    const detailQ = detailQuestions[0];
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
      explanation: `This detail is specifically mentioned in the passage.`,
      topic: 'reading details',
      tags: ['reading', 'comprehension', 'details', 'rich-content', 'expanded'],
      estimatedTime: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
    };
  }
  
  /**
   * Extract a detail from passage for detail questions
   */
  static extractDetailFromPassage(passage) {
    // Simple detail extraction - in a real implementation, this would be more sophisticated
    if (passage.text.includes('Amazon')) {
      return 'The Amazon produces about 20% of the world\'s oxygen';
    } else if (passage.text.includes('Marie Curie')) {
      return 'Marie Curie won Nobel Prizes in Physics and Chemistry';
    } else if (passage.text.includes('pyramid')) {
      return 'The Great Pyramid took about 20 years to build';
    } else {
      return 'A specific detail mentioned in the passage';
    }
  }
  
  /**
   * Middle school rich passages (Grades 7-9)
   */
  static getMiddleSchoolRichPassages(difficulty) {
    return [
      {
        text: "The invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of knowledge and literacy in Europe. Before this innovation, books were painstakingly copied by hand, making them extremely expensive and rare. Only the wealthy and religious institutions could afford to own books. Gutenberg's movable type system allowed for the mass production of books, dramatically reducing their cost and increasing availability. The first major work printed was the Gutenberg Bible, completed around 1455. This technological breakthrough led to the Protestant Reformation, the Scientific Revolution, and the Renaissance, as ideas could now spread rapidly across continents. The printing press is often considered one of the most important inventions in human history, fundamentally changing how information is shared and preserved.",
        mainIdea: "The printing press revolutionized the spread of knowledge and transformed society",
        wrongMainIdeas: [
          "Books were always affordable and widely available",
          "The printing press had no significant impact on society",
          "Only religious books were printed in the early days"
        ],
        explanation: "the passage describes how the printing press made books affordable and accessible, leading to major social and intellectual changes",
        source: "History - Printing Press"
      },
      {
        text: "Photosynthesis is the remarkable process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs primarily in the chloroplasts of plant cells, which contain the green pigment chlorophyll. Chlorophyll absorbs light energy, particularly in the red and blue wavelengths, while reflecting green light, which is why plants appear green to our eyes. The process consists of two main stages: the light-dependent reactions, which occur in the thylakoids and produce ATP and NADPH, and the light-independent reactions (Calvin cycle), which occur in the stroma and use the ATP and NADPH to convert CO₂ into glucose. Photosynthesis is crucial for life on Earth, as it produces the oxygen we breathe and forms the base of most food chains. Without photosynthesis, complex life as we know it could not exist.",
        mainIdea: "Photosynthesis is essential for life on Earth by producing oxygen and food",
        wrongMainIdeas: [
          "Photosynthesis only occurs in certain types of plants",
          "Plants don't actually need sunlight to survive",
          "Photosynthesis produces harmful gases"
        ],
        explanation: "the passage explains how photosynthesis produces oxygen and glucose, making it fundamental to life on Earth",
        source: "Biology - Photosynthesis"
      }
    ];
  }
  
  /**
   * High school rich passages (Grades 10-12)
   */
  static getHighSchoolRichPassages(difficulty) {
    return [
      {
        text: "The concept of artificial intelligence has evolved dramatically since Alan Turing first proposed the famous 'Turing Test' in 1950. Modern AI systems utilize machine learning algorithms, particularly deep neural networks, to process vast amounts of data and identify patterns that would be impossible for humans to detect. These systems have achieved remarkable success in areas such as image recognition, natural language processing, and strategic game playing. However, current AI systems are considered 'narrow AI' - they excel at specific tasks but lack the general intelligence and consciousness that characterize human cognition. The development of artificial general intelligence (AGI) remains a significant challenge, raising important questions about the nature of consciousness, creativity, and what it truly means to 'think.' As AI continues to advance, society must grapple with ethical considerations regarding privacy, employment, and the potential risks and benefits of increasingly sophisticated artificial minds.",
        mainIdea: "AI has advanced significantly but still faces challenges in achieving general intelligence",
        wrongMainIdeas: [
          "AI has already achieved human-level consciousness",
          "Modern AI systems can perform any task humans can do",
          "AI development has made no progress since the 1950s"
        ],
        explanation: "the passage discusses AI's progress in specific areas while noting the ongoing challenge of developing general intelligence",
        source: "Technology - Artificial Intelligence"
      }
    ];
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

module.exports = EnhancedReadingGeneratorRich;
