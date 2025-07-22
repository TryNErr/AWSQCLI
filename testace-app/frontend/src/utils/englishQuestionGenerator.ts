import { Question, DifficultyLevel, QuestionType } from '../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 4000; // Start from 4000 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to ensure options are unique
const ensureUniqueOptions = (correctAnswer: string, wrongOptions: string[]): string[] => {
  const uniqueWrongOptions = Array.from(new Set(wrongOptions));
  const filteredWrongOptions = uniqueWrongOptions.filter(option => option !== correctAnswer);
  
  while (filteredWrongOptions.length < 3) {
    const suffix = ` (${filteredWrongOptions.length + 1})`;
    let newOption = correctAnswer + suffix;
    if (!filteredWrongOptions.includes(newOption)) {
      filteredWrongOptions.push(newOption);
    }
  }
  
  return shuffleArray([correctAnswer, ...filteredWrongOptions.slice(0, 3)]);
};

// Generate grammar questions
const generateGrammarQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple grammar rules (articles, singular/plural, basic tenses)
      const grammarTypes = ["articles", "plurals", "tenses"];
      const grammarType = grammarTypes[getRandomInt(0, grammarTypes.length - 1)];
      
      if (grammarType === "articles") {
        const nouns = [
          { word: "apple", article: "an" },
          { word: "book", article: "a" },
          { word: "umbrella", article: "an" },
          { word: "dog", article: "a" }
        ];
        const selectedNoun = nouns[getRandomInt(0, nouns.length - 1)];
        
        question = `Which article (a/an) should be used before the word "${selectedNoun.word}"?`;
        answer = selectedNoun.article;
        explanation = `Use "${selectedNoun.article}" before words that ${selectedNoun.article === "an" ? "start with a vowel sound" : "start with a consonant sound"}.`;
        
        options = ensureUniqueOptions(answer, ["a", "an", "the"]);
      } else if (grammarType === "plurals") {
        const words = [
          { singular: "cat", plural: "cats" },
          { singular: "box", plural: "boxes" },
          { singular: "baby", plural: "babies" },
          { singular: "child", plural: "children" }
        ];
        const selectedWord = words[getRandomInt(0, words.length - 1)];
        
        question = `What is the plural form of "${selectedWord.singular}"?`;
        answer = selectedWord.plural;
        explanation = `The plural of "${selectedWord.singular}" is "${selectedWord.plural}".`;
        
        const wrongOptions = words.filter(w => w !== selectedWord).map(w => w.plural);
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const sentences = [
          { present: "I walk to school", past: "I walked to school" },
          { present: "She plays tennis", past: "She played tennis" },
          { present: "They sing songs", past: "They sang songs" }
        ];
        const selectedSentence = sentences[getRandomInt(0, sentences.length - 1)];
        
        question = `What is the past tense of "${selectedSentence.present}"?`;
        answer = selectedSentence.past;
        explanation = `The past tense of "${selectedSentence.present}" is "${selectedSentence.past}".`;
        
        const wrongOptions = sentences.filter(s => s !== selectedSentence).map(s => s.past);
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // More complex grammar (verb tenses, pronouns, prepositions)
      const grammarTypes = ["verb-tenses", "pronouns", "prepositions"];
      const grammarType = grammarTypes[getRandomInt(0, grammarTypes.length - 1)];
      
      if (grammarType === "verb-tenses") {
        const verbs = [
          { base: "go", present: "goes", past: "went", future: "will go", presentPerfect: "has gone" },
          { base: "eat", present: "eats", past: "ate", future: "will eat", presentPerfect: "has eaten" },
          { base: "write", present: "writes", past: "wrote", future: "will write", presentPerfect: "has written" }
        ];
        const selectedVerb = verbs[getRandomInt(0, verbs.length - 1)];
        const tenses = ["present", "past", "future", "presentPerfect"];
        const selectedTense = tenses[getRandomInt(0, tenses.length - 1)];
        
        question = `What is the ${selectedTense.replace(/([A-Z])/g, " $1").toLowerCase()} form of "${selectedVerb.base}" in the sentence "He ___ to school"?`;
        answer = selectedVerb[selectedTense as keyof typeof selectedVerb] as string;
        explanation = `The ${selectedTense.replace(/([A-Z])/g, " $1").toLowerCase()} form of "${selectedVerb.base}" is "${answer}".`;
        
        const wrongOptions = verbs.filter(v => v !== selectedVerb).map(v => v[selectedTense as keyof typeof v] as string);
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (grammarType === "pronouns") {
        const pronounCases = [
          { subject: "he", object: "him", possessive: "his" },
          { subject: "she", object: "her", possessive: "hers" },
          { subject: "they", object: "them", possessive: "theirs" }
        ];
        const selectedCase = pronounCases[getRandomInt(0, pronounCases.length - 1)];
        const types = ["subject", "object", "possessive"];
        const selectedType = types[getRandomInt(0, types.length - 1)];
        
        question = `Which pronoun should be used as a ${selectedType} pronoun in "The book belongs to ___"?`;
        answer = selectedCase[selectedType as keyof typeof selectedCase];
        explanation = `Use "${answer}" as a ${selectedType} pronoun.`;
        
        const wrongOptions = pronounCases.filter(p => p !== selectedCase).map(p => p[selectedType as keyof typeof p]);
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const prepositions = [
          { sentence: "The book is ___ the table", answer: "on", context: "location on a surface" },
          { sentence: "She went ___ the store", answer: "to", context: "direction" },
          { sentence: "The cat is ___ the box", answer: "in", context: "location inside something" }
        ];
        const selectedPrep = prepositions[getRandomInt(0, prepositions.length - 1)];
        
        question = `Which preposition fits in this sentence: "${selectedPrep.sentence}"?`;
        answer = selectedPrep.answer;
        explanation = `Use "${selectedPrep.answer}" for ${selectedPrep.context}.`;
        
        const wrongOptions = ["in", "on", "at", "to"].filter(p => p !== selectedPrep.answer);
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex grammar (conditionals, reported speech, passive voice)
      const grammarTypes = ["conditionals", "reported-speech", "passive-voice"];
      const grammarType = grammarTypes[getRandomInt(0, grammarTypes.length - 1)];
      
      if (grammarType === "conditionals") {
        const conditionals = [
          {
            type: "First Conditional",
            sentence: "If it ___ tomorrow, we will stay home",
            answer: "rains",
            explanation: "Use present simple in the if-clause for first conditional (possible future)"
          },
          {
            type: "Second Conditional",
            sentence: "If I ___ rich, I would buy a house",
            answer: "were",
            explanation: "Use past simple in the if-clause for second conditional (imaginary present/future)"
          },
          {
            type: "Third Conditional",
            sentence: "If you ___ harder, you would have passed",
            answer: "had studied",
            explanation: "Use past perfect in the if-clause for third conditional (imaginary past)"
          }
        ];
        const selectedCond = conditionals[getRandomInt(0, conditionals.length - 1)];
        
        question = `${selectedCond.type}: Complete this sentence: "${selectedCond.sentence}"`;
        answer = selectedCond.answer;
        explanation = selectedCond.explanation;
        
        const wrongOptions = ["would rain", "will rain", "had rained", "was", "would be", "studied", "would study"];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (grammarType === "reported-speech") {
        const speeches = [
          {
            direct: "\"I am happy,\" she said.",
            reported: "She said that she ___ happy",
            answer: "was",
            explanation: "Change present simple (am) to past simple (was) in reported speech"
          },
          {
            direct: "\"I will help you,\" he said.",
            reported: "He said that he ___ help me",
            answer: "would",
            explanation: "Change will to would in reported speech"
          },
          {
            direct: "\"I have finished,\" they said.",
            reported: "They said that they ___ finished",
            answer: "had",
            explanation: "Change present perfect (have) to past perfect (had) in reported speech"
          }
        ];
        const selectedSpeech = speeches[getRandomInt(0, speeches.length - 1)];
        
        question = `Change to reported speech: ${selectedSpeech.direct}\n${selectedSpeech.reported}`;
        answer = selectedSpeech.answer;
        explanation = selectedSpeech.explanation;
        
        const wrongOptions = ["is", "will", "has", "were", "did"];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const passiveVoice = [
          {
            active: "They build houses.",
            passive: "Houses ___ built.",
            answer: "are",
            explanation: "Use \"are\" for present simple passive voice"
          },
          {
            active: "Someone stole my bike.",
            passive: "My bike ___ stolen.",
            answer: "was",
            explanation: "Use \"was\" for past simple passive voice"
          },
          {
            active: "They will announce the results.",
            passive: "The results ___ announced.",
            answer: "will be",
            explanation: "Use \"will be\" for future simple passive voice"
          }
        ];
        const selectedPassive = passiveVoice[getRandomInt(0, passiveVoice.length - 1)];
        
        question = `Change to passive voice: ${selectedPassive.active}\n${selectedPassive.passive}`;
        answer = selectedPassive.answer;
        explanation = selectedPassive.explanation;
        
        const wrongOptions = ["is", "were", "has been", "had been"];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    default: {
      question = "Which is the correct form of the verb? \"She ___ to school every day.\"";
      answer = "goes";
      explanation = "Use \"goes\" with third-person singular subjects in present simple tense.";
      options = ensureUniqueOptions(answer, ["go", "went", "going"]);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: "English",
    topic: "Grammar",
    difficulty,
    tags: ["grammar", "language", gradeNum <= 5 ? "elementary" : gradeNum <= 8 ? "middle school" : "high school"],
    grade,
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ["Think about the grammar rules you know", "Consider the context of the sentence"]
  };
};

// Generate vocabulary questions
const generateVocabularyQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  const vocabularyByGrade = {
    elementary: {
      words: [
        { word: "happy", meaning: "feeling or showing pleasure", synonyms: ["glad", "joyful", "cheerful"] },
        { word: "big", meaning: "of considerable size", synonyms: ["large", "huge", "enormous"] },
        { word: "small", meaning: "of a size that is less than normal", synonyms: ["tiny", "little", "miniature"] }
      ]
    },
    middle: {
      words: [
        { word: "abundant", meaning: "existing in large quantities", synonyms: ["plentiful", "copious", "ample"] },
        { word: "peculiar", meaning: "strange or unusual", synonyms: ["odd", "weird", "bizarre"] },
        { word: "magnificent", meaning: "extremely beautiful or impressive", synonyms: ["splendid", "grand", "majestic"] }
      ]
    },
    high: {
      words: [
        { word: "ephemeral", meaning: "lasting for a very short time", synonyms: ["transient", "fleeting", "momentary"] },
        { word: "ubiquitous", meaning: "present everywhere", synonyms: ["omnipresent", "universal", "pervasive"] },
        { word: "surreptitious", meaning: "kept secret", synonyms: ["clandestine", "covert", "furtive"] }
      ]
    }
  };
  
  const gradeLevel = gradeNum <= 5 ? "elementary" : gradeNum <= 8 ? "middle" : "high";
  const words = vocabularyByGrade[gradeLevel as keyof typeof vocabularyByGrade].words;
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Word meanings
      const selectedWord = words[getRandomInt(0, words.length - 1)];
      
      question = `What is the meaning of the word "${selectedWord.word}"?`;
      answer = selectedWord.meaning;
      explanation = `"${selectedWord.word}" means ${selectedWord.meaning}. Some synonyms are: ${selectedWord.synonyms.join(", ")}.`;
      
      const wrongOptions = words.filter(w => w !== selectedWord).map(w => w.meaning);
      options = ensureUniqueOptions(answer, wrongOptions);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // Synonyms
      const selectedWord = words[getRandomInt(0, words.length - 1)];
      const selectedSynonym = selectedWord.synonyms[getRandomInt(0, selectedWord.synonyms.length - 1)];
      
      question = `Which word is a synonym for "${selectedWord.word}"?`;
      answer = selectedSynonym;
      explanation = `"${selectedSynonym}" is a synonym for "${selectedWord.word}". They both mean ${selectedWord.meaning}.`;
      
      const wrongOptions = words.filter(w => w !== selectedWord).map(w => w.synonyms[0]);
      options = ensureUniqueOptions(answer, wrongOptions);
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Context and usage
      const selectedWord = words[getRandomInt(0, words.length - 1)];
      const contexts = [
        `The ${selectedWord.word} nature of the event surprised everyone.`,
        `She displayed a(n) ${selectedWord.word} attitude throughout the day.`,
        `The situation became increasingly ${selectedWord.word} as time went on.`
      ];
      const selectedContext = contexts[getRandomInt(0, contexts.length - 1)];
      
      question = `In the sentence "${selectedContext}", what could replace the word "${selectedWord.word}" without changing the meaning?`;
      answer = selectedWord.synonyms[0];
      explanation = `"${selectedWord.synonyms[0]}" can replace "${selectedWord.word}" because they are synonyms, both meaning ${selectedWord.meaning}.`;
      
      const wrongOptions = words.filter(w => w !== selectedWord).map(w => w.synonyms[0]);
      options = ensureUniqueOptions(answer, wrongOptions);
      break;
    }
    
    default: {
      const selectedWord = words[0];
      question = `What does "${selectedWord.word}" mean?`;
      answer = selectedWord.meaning;
      explanation = `"${selectedWord.word}" means ${selectedWord.meaning}.`;
      options = ensureUniqueOptions(answer, words.slice(1).map(w => w.meaning));
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: "English",
    topic: "Vocabulary",
    difficulty,
    tags: ["vocabulary", "words", gradeNum <= 5 ? "elementary" : gradeNum <= 8 ? "middle school" : "high school"],
    grade,
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ["Think about the context", "Consider similar words you know"]
  };
};

// Generate comprehension questions
const generateComprehensionQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  const passages = {
    elementary: {
      text: "Sarah loves to read books. Every Saturday, she goes to the library with her mother. They spend hours looking at different books. Sarah's favorite books are about animals. She dreams of becoming a veterinarian when she grows up.",
      questions: [
        {
          question: "What does Sarah like to do?",
          answer: "Read books",
          explanation: "The passage clearly states that \"Sarah loves to read books.\"",
          options: ["Play sports", "Watch TV", "Draw pictures"]
        },
        {
          question: "When does Sarah go to the library?",
          answer: "Every Saturday",
          explanation: "According to the passage, \"Every Saturday, she goes to the library with her mother.\"",
          options: ["Every Sunday", "Every Friday", "Every Monday"]
        }
      ]
    },
    middle: {
      text: "The Amazon rainforest is home to millions of species of plants and animals. It produces about 20% of the world's oxygen, which is why it is often called the \"lungs of the Earth.\" However, deforestation threatens this vital ecosystem. Each year, thousands of acres are lost to logging and farming.",
      questions: [
        {
          question: "Why is the Amazon rainforest called the \"lungs of the Earth\"?",
          answer: "It produces 20% of the world's oxygen",
          explanation: "The passage states that it \"produces about 20% of the world's oxygen, which is why it is often called the 'lungs of the Earth.'\"",
          options: ["It is very large", "It has many trees", "It is very old"]
        },
        {
          question: "What threatens the Amazon rainforest?",
          answer: "Deforestation",
          explanation: "According to the passage, \"deforestation threatens this vital ecosystem.\"",
          options: ["Climate change", "Tourism", "Pollution"]
        }
      ]
    },
    high: {
      text: "Artificial Intelligence (AI) has made significant strides in recent years, revolutionizing various industries from healthcare to transportation. While AI offers numerous benefits, including increased efficiency and accuracy, it also raises ethical concerns. Questions about privacy, job displacement, and decision-making accountability continue to spark debate among experts and the public alike.",
      questions: [
        {
          question: "What is the main impact of AI according to the passage?",
          answer: "Revolutionizing various industries",
          explanation: "The passage states that AI is \"revolutionizing various industries from healthcare to transportation.\"",
          options: ["Creating new jobs", "Solving all problems", "Replacing human workers"]
        },
        {
          question: "What concerns does AI raise according to the passage?",
          answer: "Privacy, job displacement, and accountability",
          explanation: "The passage mentions \"questions about privacy, job displacement, and decision-making accountability.\"",
          options: ["Cost and maintenance", "Environmental impact", "Technical limitations"]
        }
      ]
    }
  };
  
  const gradeLevel = gradeNum <= 5 ? "elementary" : gradeNum <= 8 ? "middle" : "high";
  const passage = passages[gradeLevel as keyof typeof passages];
  const selectedQuestion = passage.questions[getRandomInt(0, passage.questions.length - 1)];
  
  question = `${passage.text}\n\n${selectedQuestion.question}`;
  answer = selectedQuestion.answer;
  explanation = selectedQuestion.explanation;
  options = ensureUniqueOptions(answer, selectedQuestion.options);
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: "English",
    topic: "Reading Comprehension",
    difficulty,
    tags: ["comprehension", "reading", gradeNum <= 5 ? "elementary" : gradeNum <= 8 ? "middle school" : "high school"],
    grade,
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ["Read the passage carefully", "Look for specific details in the text"]
  };
};

// Main function to generate English questions
export const generateEnglishQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 5
): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    // Choose a question type based on a random distribution
    const questionType = Math.random();
    
    if (questionType < 0.33) {
      questions.push(generateGrammarQuestion(grade, difficulty));
    } else if (questionType < 0.67) {
      questions.push(generateVocabularyQuestion(grade, difficulty));
    } else {
      questions.push(generateComprehensionQuestion(grade, difficulty));
    }
  }
  
  return questions;
};
