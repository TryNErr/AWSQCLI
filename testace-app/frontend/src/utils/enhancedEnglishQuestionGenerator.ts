import { Question, DifficultyLevel, QuestionType } from '../types';
import { shuffleArray, getRandomInt } from './questionUtils';
import { generateId } from './idGenerator';

// Enhanced English Question Generator
// Based on Common Core ELA Standards, Cambridge English, and International Curricula

interface LiteraryPassage {
  text: string;
  gradeLevel: number[];
  themes: string[];
  vocabulary: string[];
}

// Grade-appropriate literary passages and texts
const literaryPassages: Record<string, LiteraryPassage[]> = {
  "1-2": [
    {
      text: "The little seed was planted deep in the rich, dark soil. Day after day, it waited patiently. The warm sun shone down, and gentle rain fell. Slowly, a tiny green shoot pushed through the earth. The seed had become a beautiful plant.",
      gradeLevel: [1, 2],
      themes: ["growth", "patience", "nature"],
      vocabulary: ["planted", "patiently", "gentle", "shoot"]
    }
  ],
  "3-4": [
    {
      text: "Maya discovered an old, leather-bound journal hidden beneath the floorboards of her grandmother's attic. The pages were yellowed with age, and the ink had faded to a soft brown. As she carefully turned each page, she realized these were her great-grandmother's memories from when she was Maya's age. The stories transported Maya to a different time, when children played with wooden toys and wrote letters by candlelight.",
      gradeLevel: [3, 4],
      themes: ["family history", "discovery", "time periods"],
      vocabulary: ["leather-bound", "floorboards", "yellowed", "faded", "transported", "candlelight"]
    }
  ],
  "5-6": [
    {
      text: "The ancient lighthouse stood defiantly against the relentless waves that crashed against the rocky shore. For over a century, it had guided countless ships safely through treacherous waters. Captain Morrison, the lighthouse keeper, climbed the spiral staircase each evening to light the beacon. He understood that his vigilance meant the difference between life and death for sailors navigating the perilous coastline during storms.",
      gradeLevel: [5, 6],
      themes: ["duty", "perseverance", "maritime history"],
      vocabulary: ["defiantly", "relentless", "treacherous", "vigilance", "perilous", "navigating"]
    }
  ]
};

// Advanced vocabulary by grade level
const advancedVocabulary: Record<string, { word: string; definition: string; synonyms: string[]; antonyms: string[]; }[]> = {
  "3": [
    { word: "magnificent", definition: "extremely beautiful or impressive", synonyms: ["splendid", "glorious", "superb"], antonyms: ["ordinary", "plain", "dull"] },
    { word: "peculiar", definition: "strange or unusual", synonyms: ["odd", "bizarre", "curious"], antonyms: ["normal", "typical", "ordinary"] },
    { word: "tremendous", definition: "very large or great", synonyms: ["enormous", "immense", "colossal"], antonyms: ["tiny", "small", "minute"] }
  ],
  "4": [
    { word: "meticulous", definition: "showing great attention to detail", synonyms: ["careful", "precise", "thorough"], antonyms: ["careless", "sloppy", "hasty"] },
    { word: "resilient", definition: "able to recover quickly from difficulties", synonyms: ["tough", "adaptable", "flexible"], antonyms: ["fragile", "brittle", "weak"] },
    { word: "eloquent", definition: "fluent and persuasive in speaking or writing", synonyms: ["articulate", "expressive", "fluent"], antonyms: ["inarticulate", "tongue-tied", "unclear"] }
  ],
  "5": [
    { word: "ambiguous", definition: "having more than one possible meaning", synonyms: ["unclear", "vague", "confusing"], antonyms: ["clear", "definite", "unambiguous"] },
    { word: "tenacious", definition: "holding firmly to something; persistent", synonyms: ["determined", "persistent", "stubborn"], antonyms: ["yielding", "flexible", "weak-willed"] },
    { word: "innovative", definition: "introducing new ideas or methods", synonyms: ["creative", "original", "inventive"], antonyms: ["traditional", "conventional", "outdated"] }
  ]
};

// Complex grammar concepts by grade
const grammarConcepts: Record<string, any> = {
  "3": {
    concepts: ["subject-verb agreement", "irregular verbs", "comparative adjectives"],
    examples: {
      "subject-verb agreement": [
        { sentence: "The dogs _____ in the park.", options: ["runs", "run", "running", "ran"], correct: "run" },
        { sentence: "She _____ her homework every day.", options: ["do", "does", "doing", "did"], correct: "does" }
      ]
    }
  },
  "4": {
    concepts: ["complex sentences", "relative pronouns", "modal verbs"],
    examples: {
      "complex sentences": [
        { sentence: "Choose the complex sentence:", options: [
          "I like pizza.",
          "I like pizza, and she likes pasta.",
          "I like pizza because it tastes good.",
          "I like pizza; she likes pasta."
        ], correct: "I like pizza because it tastes good." }
      ]
    }
  },
  "5": {
    concepts: ["subjunctive mood", "parallel structure", "advanced punctuation"],
    examples: {
      "parallel structure": [
        { sentence: "She enjoys reading, writing, and _____.", options: ["to paint", "painting", "she paints", "paint"], correct: "painting" }
      ]
    }
  }
};

class EnhancedEnglishQuestionGenerator {
  
  // Generate advanced reading comprehension questions
  static generateAdvancedComprehension(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let passageKey = "1-2";
    
    if (gradeNum >= 5) passageKey = "5-6";
    else if (gradeNum >= 3) passageKey = "3-4";
    
    const passages = literaryPassages[passageKey];
    const passage = passages[getRandomInt(0, passages.length - 1)];
    
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Literal comprehension
        if (passageKey === "3-4") {
          questionText = `Read the passage:\n\n"${passage.text}"\n\nWhat did Maya find in her grandmother's attic?`;
          options = ["A wooden toy", "An old journal", "A candle", "A letter"];
          answer = "An old journal";
          explanation = "The passage states that 'Maya discovered an old, leather-bound journal hidden beneath the floorboards.'";
        } else {
          questionText = `Read the passage:\n\n"${passage.text}"\n\nWhat happened to the seed?`;
          options = ["It died", "It became a plant", "It was eaten", "It was moved"];
          answer = "It became a plant";
          explanation = "The passage concludes with 'The seed had become a beautiful plant.'";
        }
        break;
        
      case DifficultyLevel.MEDIUM:
        // Inferential comprehension
        if (passageKey === "5-6") {
          questionText = `Read the passage:\n\n"${passage.text}"\n\nWhat can you infer about Captain Morrison's character?`;
          options = ["He is careless", "He is dedicated to his duty", "He dislikes his job", "He is afraid of storms"];
          answer = "He is dedicated to his duty";
          explanation = "The passage shows Morrison climbing the stairs each evening and understanding that 'his vigilance meant the difference between life and death,' indicating dedication.";
        } else {
          questionText = `Read the passage:\n\n"${passage.text}"\n\nHow did Maya likely feel when reading the journal?`;
          options = ["Bored", "Confused", "Fascinated", "Angry"];
          answer = "Fascinated";
          explanation = "The phrase 'The stories transported Maya to a different time' suggests she was captivated and fascinated by what she read.";
        }
        break;
        
      case DifficultyLevel.HARD:
        // Analytical comprehension
        if (passageKey === "5-6") {
          questionText = `Read the passage:\n\n"${passage.text}"\n\nWhat literary device is used in 'stood defiantly against the relentless waves'?`;
          options = ["Simile", "Metaphor", "Personification", "Alliteration"];
          answer = "Personification";
          explanation = "The lighthouse is given human qualities ('stood defiantly'), which is personification - attributing human characteristics to non-human things.";
        } else {
          questionText = `Read the passage:\n\n"${passage.text}"\n\nWhat theme is most prominent in this passage?`;
          options = ["Friendship", "The connection between past and present", "Adventure", "Competition"];
          answer = "The connection between past and present";
          explanation = "The passage explores how Maya connects with her great-grandmother's experiences, bridging different time periods and generations.";
        }
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'English',
      topic: 'Advanced Reading Comprehension',
      difficulty,
      tags: ['reading', 'comprehension', 'analysis', 'literature'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate sophisticated vocabulary questions
  static generateAdvancedVocabulary(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    const vocabLevel = Math.min(5, Math.max(3, gradeNum)).toString();
    const vocabulary = advancedVocabulary[vocabLevel] || advancedVocabulary["3"];
    
    const word = vocabulary[getRandomInt(0, vocabulary.length - 1)];
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Definition matching
        questionText = `What does "${word.word}" mean?`;
        options = [word.definition, "very small", "extremely loud", "completely wrong"];
        answer = word.definition;
        explanation = `"${word.word}" means ${word.definition}.`;
        break;
        
      case DifficultyLevel.MEDIUM:
        // Synonym identification
        questionText = `Which word is a synonym for "${word.word}"?`;
        options = [word.synonyms[0], word.antonyms[0], "beautiful", "difficult"];
        answer = word.synonyms[0];
        explanation = `"${word.synonyms[0]}" is a synonym for "${word.word}" because both words mean ${word.definition}.`;
        break;
        
      case DifficultyLevel.HARD:
        // Context usage
        const contexts = [
          `The scientist's _____ research led to groundbreaking discoveries.`,
          `Her _____ attention to detail impressed everyone.`,
          `The _____ design revolutionized the industry.`
        ];
        const context = contexts[getRandomInt(0, contexts.length - 1)];
        
        questionText = `Choose the word that best completes the sentence:\n\n"${context}"`;
        options = [word.word, word.antonyms[0], "simple", "quick"];
        answer = word.word;
        explanation = `"${word.word}" fits best because it means ${word.definition}, which makes sense in this context.`;
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'English',
      topic: 'Advanced Vocabulary',
      difficulty,
      tags: ['vocabulary', 'definitions', 'synonyms', 'context'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate complex grammar questions
  static generateAdvancedGrammar(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    const grammarLevel = Math.min(5, Math.max(3, gradeNum)).toString();
    const concepts = grammarConcepts[grammarLevel] || grammarConcepts["3"];
    
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Basic grammar rules
        questionText = "Choose the sentence with correct subject-verb agreement:";
        options = [
          "The team are playing well.",
          "The team is playing well.",
          "The team were playing well.",
          "The team be playing well."
        ];
        answer = "The team is playing well.";
        explanation = "Collective nouns like 'team' are usually treated as singular, so we use 'is' not 'are'.";
        break;
        
      case DifficultyLevel.MEDIUM:
        // Complex sentence structures
        questionText = "Identify the type of sentence: 'Although it was raining, we decided to go hiking because we had planned this trip for months.'";
        options = ["Simple sentence", "Compound sentence", "Complex sentence", "Compound-complex sentence"];
        answer = "Compound-complex sentence";
        explanation = "This sentence has multiple independent clauses ('we decided to go hiking') and dependent clauses ('Although it was raining', 'because we had planned this trip'), making it compound-complex.";
        break;
        
      case DifficultyLevel.HARD:
        // Advanced grammar concepts
        questionText = "Choose the sentence that correctly uses the subjunctive mood:";
        options = [
          "If I was rich, I would travel the world.",
          "If I were rich, I would travel the world.",
          "If I am rich, I would travel the world.",
          "If I will be rich, I would travel the world."
        ];
        answer = "If I were rich, I would travel the world.";
        explanation = "The subjunctive mood uses 'were' instead of 'was' in hypothetical or contrary-to-fact situations.";
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'English',
      topic: 'Advanced Grammar',
      difficulty,
      tags: ['grammar', 'syntax', 'sentence-structure', 'language-rules'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Generate creative writing and analysis questions
  static generateWritingAnalysis(grade: string, difficulty: DifficultyLevel): Question {
    const gradeNum = parseInt(grade);
    let questionText: string;
    let answer: string;
    let explanation: string;
    let options: string[];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        // Basic writing elements
        questionText = "What is the main purpose of a topic sentence in a paragraph?";
        options = [
          "To end the paragraph",
          "To introduce the main idea",
          "To provide examples",
          "To ask questions"
        ];
        answer = "To introduce the main idea";
        explanation = "A topic sentence introduces the main idea that the rest of the paragraph will support and develop.";
        break;
        
      case DifficultyLevel.MEDIUM:
        // Literary devices and techniques
        questionText = "In the sentence 'The wind whispered secrets through the trees,' what literary device is being used?";
        options = ["Simile", "Metaphor", "Personification", "Hyperbole"];
        answer = "Personification";
        explanation = "Personification gives human qualities (whispering secrets) to non-human things (the wind).";
        break;
        
      case DifficultyLevel.HARD:
        // Advanced literary analysis
        questionText = "Which narrative technique would be most effective for creating suspense in a mystery story?";
        options = [
          "Third-person omniscient narrator",
          "First-person limited narrator",
          "Stream of consciousness",
          "Multiple perspectives"
        ];
        answer = "First-person limited narrator";
        explanation = "A first-person limited narrator creates suspense because readers only know what the narrator knows, maintaining mystery and uncertainty.";
        break;
    }
    
    return {
      _id: generateId(),
      content: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      options: shuffleArray(options),
      correctAnswer: answer,
      explanation,
      subject: 'English',
      topic: 'Writing and Literary Analysis',
      difficulty,
      tags: ['writing', 'literary-devices', 'analysis', 'composition'],
      grade,
      createdBy: 'enhanced-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Main function to generate enhanced English questions
export const generateEnhancedEnglishQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const questionTypes = ['comprehension', 'vocabulary', 'grammar', 'writing'];
  const questionType = questionTypes[getRandomInt(0, questionTypes.length - 1)];
  
  switch (questionType) {
    case 'comprehension':
      return EnhancedEnglishQuestionGenerator.generateAdvancedComprehension(grade, difficulty);
    case 'vocabulary':
      return EnhancedEnglishQuestionGenerator.generateAdvancedVocabulary(grade, difficulty);
    case 'grammar':
      return EnhancedEnglishQuestionGenerator.generateAdvancedGrammar(grade, difficulty);
    case 'writing':
      return EnhancedEnglishQuestionGenerator.generateWritingAnalysis(grade, difficulty);
    default:
      return EnhancedEnglishQuestionGenerator.generateAdvancedComprehension(grade, difficulty);
  }
};
