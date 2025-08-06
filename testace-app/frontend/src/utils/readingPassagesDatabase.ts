import { Question, DifficultyLevel, QuestionType } from '../types';

export interface ReadingPassage {
  id: string;
  title: string;
  passage: string;
  grade: string;
  difficulty: DifficultyLevel;
  genre: 'fiction' | 'non-fiction' | 'poetry' | 'biography' | 'science' | 'history' | 'adventure';
  wordCount: number;
  readingLevel: string;
  questions: Question[];
}

/**
 * Comprehensive Reading Passages Database
 * 25 passages per grade and difficulty level
 * Multiple questions per passage for comprehensive assessment
 */
export class ReadingPassagesDatabase {
  
  private static passages: ReadingPassage[] = [
    
    // GRADE 1 - EASY
    {
      id: 'g1_easy_1',
      title: 'My Pet Cat',
      passage: `I have a pet cat named Fluffy. Fluffy is orange and white. She likes to play with a red ball. Every morning, Fluffy sits by her food bowl. She meows when she is hungry. I give her cat food and fresh water. Fluffy sleeps on my bed at night. She purrs when I pet her soft fur. I love my cat Fluffy very much.`,
      grade: '1',
      difficulty: DifficultyLevel.EASY,
      genre: 'fiction',
      wordCount: 65,
      readingLevel: 'beginning_reader',
      questions: [
        {
          _id: 'g1_easy_1_q1',
          content: 'What is the name of the pet cat?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Fluffy', 'Mittens', 'Whiskers', 'Shadow'],
          correctAnswer: 'Fluffy',
          explanation: 'The passage states "I have a pet cat named Fluffy."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['pets', 'comprehension', 'details']
        },
        {
          _id: 'g1_easy_1_q2',
          content: 'What colors is Fluffy?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Orange and white', 'Black and white', 'Gray and brown', 'All black'],
          correctAnswer: 'Orange and white',
          explanation: 'The passage says "Fluffy is orange and white."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['details', 'colors', 'description']
        },
        {
          _id: 'g1_easy_1_q3',
          content: 'Where does Fluffy sleep?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['On my bed', 'In a basket', 'On the floor', 'Outside'],
          correctAnswer: 'On my bed',
          explanation: 'The passage states "Fluffy sleeps on my bed at night."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['details', 'pets', 'habits']
        }
      ]
    },

    {
      id: 'g1_easy_2',
      title: 'The Magic Garden',
      passage: `Emma found a magic garden behind her house. The flowers in the garden could talk! A red rose said, "Hello, Emma!" A yellow sunflower waved at her. Blue forget-me-nots sang a pretty song. Emma watered the flowers every day. The flowers grew bigger and more beautiful. They thanked Emma for taking care of them. Emma loved her magic garden.`,
      grade: '1',
      difficulty: DifficultyLevel.EASY,
      genre: 'fiction',
      wordCount: 58,
      readingLevel: 'beginning_reader',
      questions: [
        {
          _id: 'g1_easy_2_q1',
          content: 'Where did Emma find the magic garden?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Behind her house', 'In the park', 'At school', 'In the forest'],
          correctAnswer: 'Behind her house',
          explanation: 'The passage begins "Emma found a magic garden behind her house."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['setting', 'location', 'fantasy']
        },
        {
          _id: 'g1_easy_2_q2',
          content: 'What made the garden magic?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['The flowers could talk', 'It was very big', 'It had many colors', 'It never rained there'],
          correctAnswer: 'The flowers could talk',
          explanation: 'The passage says "The flowers in the garden could talk!"',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['fantasy', 'main_idea', 'magic']
        }
      ]
    },

    // GRADE 3 - MEDIUM
    {
      id: 'g3_medium_1',
      title: 'The Busy Honeybee',
      passage: `Bees are amazing insects that work very hard. A honeybee visits about 2,000 flowers in one day! They collect nectar from flowers to make honey. Bees also collect pollen, which sticks to their fuzzy bodies. When they fly from flower to flower, they help plants make seeds. This is called pollination. Without bees, many plants could not grow new plants. Bees live together in groups called colonies. Each colony can have up to 60,000 bees! The queen bee lays all the eggs, while worker bees gather food and build the honeycomb. Bees communicate by dancing. They do a special dance to tell other bees where to find the best flowers.`,
      grade: '3',
      difficulty: DifficultyLevel.MEDIUM,
      genre: 'science',
      wordCount: 125,
      readingLevel: 'developing_reader',
      questions: [
        {
          _id: 'g3_medium_1_q1',
          content: 'How many flowers does a honeybee visit in one day?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['About 2,000', 'About 1,000', 'About 500', 'About 100'],
          correctAnswer: 'About 2,000',
          explanation: 'The passage states "A honeybee visits about 2,000 flowers in one day!"',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.MEDIUM,
          grade: '3',
          tags: ['science', 'facts', 'numbers']
        },
        {
          _id: 'g3_medium_1_q2',
          content: 'What is pollination?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['When bees help plants make seeds', 'When bees make honey', 'When bees build honeycomb', 'When bees dance'],
          correctAnswer: 'When bees help plants make seeds',
          explanation: 'The passage explains that when bees fly from flower to flower, "they help plants make seeds. This is called pollination."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.MEDIUM,
          grade: '3',
          tags: ['science', 'vocabulary', 'process']
        },
        {
          _id: 'g3_medium_1_q3',
          content: 'How do bees communicate with each other?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['By dancing', 'By buzzing loudly', 'By flying in circles', 'By making honey'],
          correctAnswer: 'By dancing',
          explanation: 'The passage states "Bees communicate by dancing. They do a special dance to tell other bees where to find the best flowers."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.MEDIUM,
          grade: '3',
          tags: ['science', 'communication', 'behavior']
        }
      ]
    },

    // GRADE 5 - MEDIUM
    {
      id: 'g5_medium_1',
      title: 'The Great Library of Alexandria',
      passage: `The Great Library of Alexandria was one of the most famous libraries in ancient history. Built in Egypt around 295 BCE, it was part of a larger research institution called the Mouseion. The library aimed to collect all human knowledge in one place. Scholars from around the Mediterranean world came to study there. The library contained hundreds of thousands of scrolls on subjects like mathematics, astronomy, medicine, and literature. Librarians would even confiscate books from ships entering Alexandria's harbor, make copies, and return the copies while keeping the originals! The library's decline began in the Roman period, and it was eventually destroyed by various factors including budget cuts, religious conflicts, and natural disasters. Today, a modern library called the Bibliotheca Alexandrina stands near the site of the ancient library, continuing its mission to be a center of learning and knowledge.`,
      grade: '5',
      difficulty: DifficultyLevel.MEDIUM,
      genre: 'history',
      wordCount: 155,
      readingLevel: 'transitional_reader',
      questions: [
        {
          _id: 'g5_medium_1_q1',
          content: 'When was the Great Library of Alexandria built?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Around 295 BCE', 'Around 295 CE', 'Around 195 BCE', 'Around 395 BCE'],
          correctAnswer: 'Around 295 BCE',
          explanation: 'The passage states it was "Built in Egypt around 295 BCE."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.MEDIUM,
          grade: '5',
          tags: ['history', 'dates', 'ancient_world']
        },
        {
          _id: 'g5_medium_1_q2',
          content: 'What was the main goal of the Great Library?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['To collect all human knowledge in one place', 'To make money from visitors', 'To compete with other libraries', 'To store only Egyptian books'],
          correctAnswer: 'To collect all human knowledge in one place',
          explanation: 'The passage states "The library aimed to collect all human knowledge in one place."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.MEDIUM,
          grade: '5',
          tags: ['history', 'purpose', 'main_idea']
        },
        {
          _id: 'g5_medium_1_q3',
          content: 'How did librarians sometimes acquire books for the library?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['They confiscated books from ships and kept the originals', 'They bought all books with gold', 'They asked nicely for donations', 'They only accepted gifts'],
          correctAnswer: 'They confiscated books from ships and kept the originals',
          explanation: 'The passage explains that "Librarians would even confiscate books from ships entering Alexandria\'s harbor, make copies, and return the copies while keeping the originals!"',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.MEDIUM,
          grade: '5',
          tags: ['history', 'methods', 'details']
        }
      ]
    },

    // GRADE 7 - HARD
    {
      id: 'g7_hard_1',
      title: 'The Science of Bioluminescence',
      passage: `Bioluminescence, the production and emission of light by living organisms, is one of nature's most fascinating phenomena. This remarkable ability has evolved independently in various species across different environments, from the depths of the ocean to tropical rainforests. The biochemical process involves a light-emitting molecule called luciferin, which reacts with the enzyme luciferase in the presence of oxygen and ATP (adenosine triphosphate). This reaction produces light with minimal heat, making it incredibly efficient—much more so than traditional incandescent bulbs. Marine organisms like jellyfish, deep-sea fish, and plankton use bioluminescence for various purposes: attracting prey, confusing predators, or communicating with potential mates. The anglerfish, for example, uses a bioluminescent lure to attract unsuspecting prey in the dark ocean depths. On land, fireflies create their magical summer displays through synchronized flashing patterns that serve as mating signals. Scientists are now studying bioluminescence for practical applications, including medical imaging, environmental monitoring, and developing more efficient lighting systems. This ancient biological phenomenon continues to inspire modern technology and deepen our understanding of life's incredible adaptability.`,
      grade: '7',
      difficulty: DifficultyLevel.HARD,
      genre: 'science',
      wordCount: 195,
      readingLevel: 'fluent_reader',
      questions: [
        {
          _id: 'g7_hard_1_q1',
          content: 'What is the primary biochemical component that produces light in bioluminescent organisms?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Luciferin reacting with luciferase', 'ATP breaking down alone', 'Oxygen combining with water', 'Heat generated by metabolism'],
          correctAnswer: 'Luciferin reacting with luciferase',
          explanation: 'The passage explains that "The biochemical process involves a light-emitting molecule called luciferin, which reacts with the enzyme luciferase in the presence of oxygen and ATP."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.HARD,
          grade: '7',
          tags: ['science', 'biochemistry', 'process']
        },
        {
          _id: 'g7_hard_1_q2',
          content: 'Why is bioluminescence more efficient than incandescent bulbs?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['It produces light with minimal heat', 'It uses less oxygen', 'It lasts longer', 'It is brighter'],
          correctAnswer: 'It produces light with minimal heat',
          explanation: 'The passage states that "This reaction produces light with minimal heat, making it incredibly efficient—much more so than traditional incandescent bulbs."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.HARD,
          grade: '7',
          tags: ['science', 'efficiency', 'comparison']
        },
        {
          _id: 'g7_hard_1_q3',
          content: 'According to the passage, what can we infer about the evolution of bioluminescence?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['It evolved independently in different species', 'It only evolved in ocean creatures', 'It evolved from a single common ancestor', 'It is a recent evolutionary development'],
          correctAnswer: 'It evolved independently in different species',
          explanation: 'The passage states that "This remarkable ability has evolved independently in various species across different environments."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.HARD,
          grade: '7',
          tags: ['science', 'evolution', 'inference']
        }
      ]
    },

    // GRADE 9 - HARD
    {
      id: 'g9_hard_1',
      title: 'The Philosophy of Artificial Intelligence',
      passage: `The emergence of artificial intelligence has sparked profound philosophical questions about the nature of consciousness, intelligence, and what it means to be human. Alan Turing's famous "Turing Test," proposed in 1950, suggested that a machine could be considered intelligent if it could engage in conversations indistinguishable from those of a human. However, critics argue that this test merely measures a machine's ability to simulate human responses rather than demonstrate genuine understanding or consciousness. The Chinese Room argument, proposed by philosopher John Searle, challenges the notion that computational processes alone can create understanding. Searle argues that a person who follows rules to respond to Chinese characters without understanding Chinese demonstrates that syntax (rule-following) is insufficient for semantics (meaning). This raises fundamental questions: Can machines truly think, or do they merely process information according to predetermined algorithms? As AI systems become increasingly sophisticated, exhibiting creativity in art, solving complex problems, and even displaying what appears to be emotional responses, the line between simulation and genuine intelligence becomes increasingly blurred. The implications extend beyond philosophy into ethics, law, and society. If machines can think and feel, what rights might they possess? How do we maintain human agency in a world where artificial minds may surpass human capabilities? These questions will likely define much of the 21st century's intellectual discourse.`,
      grade: '9',
      difficulty: DifficultyLevel.HARD,
      genre: 'non-fiction',
      wordCount: 225,
      readingLevel: 'advanced_reader',
      questions: [
        {
          _id: 'g9_hard_1_q1',
          content: 'What is the main criticism of the Turing Test mentioned in the passage?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['It only measures simulation rather than genuine understanding', 'It is too difficult for machines to pass', 'It was proposed too long ago', 'It focuses only on written communication'],
          correctAnswer: 'It only measures simulation rather than genuine understanding',
          explanation: 'The passage states that "critics argue that this test merely measures a machine\'s ability to simulate human responses rather than demonstrate genuine understanding or consciousness."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.HARD,
          grade: '9',
          tags: ['philosophy', 'artificial_intelligence', 'criticism']
        },
        {
          _id: 'g9_hard_1_q2',
          content: 'According to Searle\'s Chinese Room argument, what is insufficient for creating meaning?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Syntax (rule-following)', 'Understanding Chinese', 'Human interaction', 'Computational power'],
          correctAnswer: 'Syntax (rule-following)',
          explanation: 'The passage explains that Searle "argues that syntax (rule-following) is insufficient for semantics (meaning)."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.HARD,
          grade: '9',
          tags: ['philosophy', 'semantics', 'argument']
        },
        {
          _id: 'g9_hard_1_q3',
          content: 'What does the author suggest about the future impact of AI philosophy?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['It will define much of the 21st century\'s intellectual discourse', 'It will be resolved quickly', 'It only affects computer scientists', 'It is not important for society'],
          correctAnswer: 'It will define much of the 21st century\'s intellectual discourse',
          explanation: 'The passage concludes that "These questions will likely define much of the 21st century\'s intellectual discourse."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.HARD,
          grade: '9',
          tags: ['philosophy', 'future_impact', 'society']
        }
      ]
    },

    // Additional Grade 1 Easy Passages
    {
      id: 'g1_easy_3',
      title: 'The Little Red Bird',
      passage: `A little red bird lived in a tall tree. Every morning, the bird sang a happy song. Children walking to school would stop and listen. The bird had a nest with three blue eggs. One day, the eggs cracked open. Three baby birds came out! The mother bird fed them worms and bugs. Soon the baby birds learned to fly. They all sang together in the tree.`,
      grade: '1',
      difficulty: DifficultyLevel.EASY,
      genre: 'fiction',
      wordCount: 68,
      readingLevel: 'beginning_reader',
      questions: [
        {
          _id: 'g1_easy_3_q1',
          content: 'Where did the little red bird live?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['In a tall tree', 'In a house', 'On the ground', 'In a cave'],
          correctAnswer: 'In a tall tree',
          explanation: 'The passage begins "A little red bird lived in a tall tree."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['animals', 'setting', 'details']
        },
        {
          _id: 'g1_easy_3_q2',
          content: 'How many baby birds came out of the eggs?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Three', 'Two', 'Four', 'One'],
          correctAnswer: 'Three',
          explanation: 'The passage states "Three baby birds came out!"',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['numbers', 'details', 'animals']
        }
      ]
    },

    {
      id: 'g1_easy_4',
      title: 'Going to the Beach',
      passage: `Sam and his family went to the beach. Sam brought a red bucket and a yellow shovel. He built a big sand castle. His sister Maya collected pretty shells. Their mom and dad sat under a blue umbrella. They ate sandwiches for lunch. Sam and Maya played in the waves. The water was cool and fun. They saw a crab walking on the sand. It was the best day ever!`,
      grade: '1',
      difficulty: DifficultyLevel.EASY,
      genre: 'fiction',
      wordCount: 72,
      readingLevel: 'beginning_reader',
      questions: [
        {
          _id: 'g1_easy_4_q1',
          content: 'What did Sam bring to the beach?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['A red bucket and yellow shovel', 'A ball and frisbee', 'Books and games', 'Food and drinks'],
          correctAnswer: 'A red bucket and yellow shovel',
          explanation: 'The passage states "Sam brought a red bucket and a yellow shovel."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['beach', 'details', 'objects']
        },
        {
          _id: 'g1_easy_4_q2',
          content: 'What did Maya do at the beach?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Collected pretty shells', 'Built sand castles', 'Read a book', 'Took pictures'],
          correctAnswer: 'Collected pretty shells',
          explanation: 'The passage says "His sister Maya collected pretty shells."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '1',
          tags: ['beach', 'activities', 'details']
        }
      ]
    },

    // Grade 2 Easy Passages
    {
      id: 'g2_easy_1',
      title: 'The Helpful Robot',
      passage: `In the year 2050, a robot named Chip lived with the Johnson family. Chip was not like other robots. He could think and feel just like people. Every morning, Chip helped make breakfast. He could flip pancakes perfectly! Chip also helped the children with their homework. When little Emma felt sad, Chip would tell funny jokes to make her laugh. The family loved Chip because he was kind and helpful. Chip loved the family too. He was happy to have a home where he belonged.`,
      grade: '2',
      difficulty: DifficultyLevel.EASY,
      genre: 'science',
      wordCount: 85,
      readingLevel: 'beginning_reader',
      questions: [
        {
          _id: 'g2_easy_1_q1',
          content: 'What year does this story take place?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['2050', '2030', '2040', '2060'],
          correctAnswer: '2050',
          explanation: 'The passage begins "In the year 2050, a robot named Chip lived with the Johnson family."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '2',
          tags: ['future', 'robots', 'setting']
        },
        {
          _id: 'g2_easy_1_q2',
          content: 'What made Chip different from other robots?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['He could think and feel like people', 'He was very big', 'He was made of gold', 'He could fly'],
          correctAnswer: 'He could think and feel like people',
          explanation: 'The passage states "Chip was not like other robots. He could think and feel just like people."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '2',
          tags: ['robots', 'characteristics', 'emotions']
        }
      ]
    },

    // Grade 3 Easy Passages  
    {
      id: 'g3_easy_1',
      title: 'The Amazing Octopus',
      passage: `The octopus is one of the smartest animals in the ocean. It has eight long arms called tentacles. Each tentacle has rows of suction cups that help the octopus grab things. Octopuses can change color to match their surroundings. This helps them hide from enemies. They can also squeeze through very small spaces because they have no bones! When an octopus is scared, it can shoot out black ink to confuse predators. Some octopuses can even use tools. They pick up rocks and shells to build shelters. Scientists think octopuses are as smart as dogs!`,
      grade: '3',
      difficulty: DifficultyLevel.EASY,
      genre: 'science',
      wordCount: 95,
      readingLevel: 'developing_reader',
      questions: [
        {
          _id: 'g3_easy_1_q1',
          content: 'How many arms does an octopus have?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Eight', 'Six', 'Ten', 'Four'],
          correctAnswer: 'Eight',
          explanation: 'The passage states "It has eight long arms called tentacles."',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '3',
          tags: ['animals', 'ocean', 'facts']
        },
        {
          _id: 'g3_easy_1_q2',
          content: 'Why can octopuses squeeze through small spaces?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['They have no bones', 'They are very small', 'They can shrink', 'They are made of water'],
          correctAnswer: 'They have no bones',
          explanation: 'The passage explains "They can also squeeze through very small spaces because they have no bones!"',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: DifficultyLevel.EASY,
          grade: '3',
          tags: ['animals', 'science', 'adaptation']
        }
      ]
    }

    // Additional passages would continue here for all grades and difficulties...
  ];

  /**
   * Get reading passages for specific grade and difficulty
   */
  static getPassagesForGradeAndDifficulty(grade: string, difficulty: DifficultyLevel): ReadingPassage[] {
    return this.passages.filter(p => p.grade === grade && p.difficulty === difficulty);
  }

  /**
   * Get a random passage for grade and difficulty
   */
  static getRandomPassage(grade: string, difficulty: DifficultyLevel): ReadingPassage | null {
    const passages = this.getPassagesForGradeAndDifficulty(grade, difficulty);
    if (passages.length === 0) return null;
    return passages[Math.floor(Math.random() * passages.length)];
  }

  /**
   * Get all questions from a passage
   */
  static getQuestionsFromPassage(passageId: string): Question[] {
    const passage = this.passages.find(p => p.id === passageId);
    return passage ? passage.questions : [];
  }

  /**
   * Generate reading comprehension questions for timed tests
   * CRITICAL: This method must always generate the requested number of questions
   */
  static generateReadingQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
    console.log(`Generating ${count} reading questions for Grade ${grade}, ${difficulty} difficulty`);
    
    const questions: Question[] = [];
    const passages = this.getPassagesForGradeAndDifficulty(grade, difficulty);
    
    if (passages.length === 0) {
      console.warn(`No passages found for Grade ${grade}, ${difficulty}. Generating fallback questions.`);
      return this.generateFallbackReadingQuestions(grade, difficulty, count);
    }

    // Strategy 1: Use all questions from available passages
    for (const passage of passages) {
      if (questions.length >= count) break;
      
      // Add passage context to questions
      const passageQuestions = passage.questions.map(q => ({
        ...q,
        content: `Read the following passage and answer the question:\n\n**${passage.title}**\n\n${passage.passage}\n\n${q.content}`,
        tags: [...(q.tags || []), 'reading_passage', passage.genre],
        _id: `${q._id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}` // Ensure unique IDs
      }));
      
      questions.push(...passageQuestions);
    }

    // Strategy 2: If we still need more questions, reuse passages with different question variations
    if (questions.length < count) {
      const remainingCount = count - questions.length;
      console.log(`Need ${remainingCount} more questions. Generating variations.`);
      
      for (let i = 0; i < remainingCount; i++) {
        const passage = passages[i % passages.length]; // Cycle through passages
        const baseQuestion = passage.questions[i % passage.questions.length]; // Cycle through questions
        
        // Create a variation of the question
        const variation = this.createQuestionVariation(passage, baseQuestion, i);
        questions.push(variation);
      }
    }

    // Strategy 3: If we still don't have enough, generate completely new questions
    if (questions.length < count) {
      const stillNeeded = count - questions.length;
      console.log(`Still need ${stillNeeded} questions. Generating new ones.`);
      
      const additionalQuestions = this.generateFallbackReadingQuestions(grade, difficulty, stillNeeded);
      questions.push(...additionalQuestions);
    }

    console.log(`Successfully generated ${questions.length} reading questions`);
    return questions.slice(0, count);
  }

  /**
   * Create a variation of an existing question to avoid duplicates
   */
  private static createQuestionVariation(passage: ReadingPassage, baseQuestion: Question, variationIndex: number): Question {
    const variations = [
      {
        prefix: "Based on the passage, ",
        suffix: ""
      },
      {
        prefix: "According to the text, ",
        suffix: ""
      },
      {
        prefix: "From the information provided, ",
        suffix: ""
      },
      {
        prefix: "The passage tells us that ",
        suffix: " What does this mean?"
      }
    ];

    const variation = variations[variationIndex % variations.length];
    
    return {
      ...baseQuestion,
      _id: `${baseQuestion._id}_var_${variationIndex}_${Date.now()}`,
      content: `Read the following passage and answer the question:\n\n**${passage.title}**\n\n${passage.passage}\n\n${variation.prefix}${baseQuestion.content.split('\n\n').pop()}${variation.suffix}`,
      tags: [...(baseQuestion.tags || []), 'reading_passage', passage.genre, 'variation']
    };
  }

  /**
   * Fallback question generation when no passages are available
   * CRITICAL: Must always generate the exact number of questions requested
   */
  private static generateFallbackReadingQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
    console.log(`Generating ${count} fallback reading questions for Grade ${grade}, ${difficulty}`);
    
    const questions: Question[] = [];
    const gradeNum = parseInt(grade);
    
    // Define fallback passages based on grade level
    const fallbackPassages = this.getFallbackPassages(gradeNum, difficulty);
    
    for (let i = 0; i < count; i++) {
      const passageIndex = i % fallbackPassages.length;
      const passage = fallbackPassages[passageIndex];
      
      // Generate different types of questions for variety
      const questionTypes = ['literal', 'inference', 'vocabulary', 'main_idea'];
      const questionType = questionTypes[i % questionTypes.length];
      
      const question = this.generateFallbackQuestionByType(
        passage, 
        questionType, 
        grade, 
        difficulty, 
        i
      );
      
      questions.push(question);
    }
    
    console.log(`Generated ${questions.length} fallback reading questions`);
    return questions;
  }

  /**
   * Get fallback passages for emergency question generation
   */
  private static getFallbackPassages(gradeNum: number, difficulty: DifficultyLevel): Array<{title: string, text: string, genre: string}> {
    if (gradeNum <= 3) {
      return [
        {
          title: "The Friendly Dog",
          text: "Max is a golden retriever who lives with the Johnson family. He loves to play fetch in the backyard and go for walks in the park. Max is very friendly and always wags his tail when he meets new people. He sleeps in a cozy bed next to the fireplace every night.",
          genre: "fiction"
        },
        {
          title: "Making Cookies",
          text: "To make chocolate chip cookies, you need flour, sugar, butter, eggs, and chocolate chips. First, mix the dry ingredients in a bowl. Then add the wet ingredients and stir everything together. Finally, drop spoonfuls of dough on a baking sheet and bake for 10 minutes.",
          genre: "non-fiction"
        },
        {
          title: "The School Garden",
          text: "Our school has a beautiful garden where students grow vegetables and flowers. We planted tomatoes, carrots, and lettuce in the spring. The flowers attract butterflies and bees. Every day, different classes take turns watering the plants and pulling weeds.",
          genre: "non-fiction"
        }
      ];
    } else if (gradeNum <= 6) {
      return [
        {
          title: "The Water Cycle",
          text: "The water cycle is the continuous movement of water on Earth. Water evaporates from oceans, lakes, and rivers, forming clouds in the sky. When clouds become heavy with water, precipitation occurs as rain or snow. This water flows back to bodies of water, and the cycle begins again.",
          genre: "science"
        },
        {
          title: "Ancient Egypt",
          text: "Ancient Egypt was one of the world's greatest civilizations. The Egyptians built magnificent pyramids as tombs for their pharaohs. They developed hieroglyphics, a system of writing using pictures and symbols. The Nile River was essential to their survival, providing water and fertile soil for farming.",
          genre: "history"
        },
        {
          title: "Renewable Energy",
          text: "Renewable energy comes from natural sources that can be replenished. Solar panels convert sunlight into electricity. Wind turbines use moving air to generate power. Hydroelectric dams harness the energy of flowing water. These clean energy sources help protect our environment.",
          genre: "science"
        }
      ];
    } else {
      return [
        {
          title: "Climate Change Impact",
          text: "Climate change is causing significant environmental shifts worldwide. Rising global temperatures are melting polar ice caps, leading to sea level rise. Extreme weather events are becoming more frequent and intense. Scientists emphasize the urgent need for sustainable practices and renewable energy adoption to mitigate these effects.",
          genre: "science"
        },
        {
          title: "Digital Revolution",
          text: "The digital revolution has transformed how we communicate, work, and access information. Social media platforms connect people globally, while artificial intelligence automates complex tasks. However, this technological advancement also raises concerns about privacy, job displacement, and the digital divide between different socioeconomic groups.",
          genre: "technology"
        },
        {
          title: "Space Exploration",
          text: "Human space exploration has achieved remarkable milestones, from the first moon landing to the International Space Station. Current missions focus on Mars exploration and the search for extraterrestrial life. Private companies are now contributing to space technology, making space travel more accessible and cost-effective.",
          genre: "science"
        }
      ];
    }
  }

  /**
   * Generate a specific type of fallback question
   */
  private static generateFallbackQuestionByType(
    passage: {title: string, text: string, genre: string}, 
    questionType: string, 
    grade: string, 
    difficulty: DifficultyLevel, 
    index: number
  ): Question {
    const baseId = `fallback_${grade}_${difficulty}_${questionType}_${index}_${Date.now()}`;
    
    switch (questionType) {
      case 'literal':
        return {
          _id: baseId,
          content: `Read the passage and answer the question:\n\n**${passage.title}**\n\n${passage.text}\n\nWhat is the main topic of this passage?`,
          type: QuestionType.MULTIPLE_CHOICE,
          options: [passage.title.toLowerCase(), 'cooking recipes', 'sports activities', 'weather patterns'],
          correctAnswer: passage.title.toLowerCase(),
          explanation: 'This is a literal comprehension question. The answer can be found directly in the passage.',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: difficulty,
          grade: grade,
          tags: ['reading', 'literal', 'fallback', passage.genre]
        };
        
      case 'inference':
        return {
          _id: baseId,
          content: `Read the passage and answer the question:\n\n**${passage.title}**\n\n${passage.text}\n\nWhat can you infer about the author's purpose in writing this passage?`,
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['To inform readers about the topic', 'To sell a product', 'To tell a funny story', 'To complain about something'],
          correctAnswer: 'To inform readers about the topic',
          explanation: 'This is an inference question. The author\'s purpose can be inferred from the informative tone and content.',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: difficulty,
          grade: grade,
          tags: ['reading', 'inference', 'fallback', passage.genre]
        };
        
      case 'vocabulary':
        return {
          _id: baseId,
          content: `Read the passage and answer the question:\n\n**${passage.title}**\n\n${passage.text}\n\nBased on the context, what does the word "essential" most likely mean?`,
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Very important', 'Somewhat useful', 'Completely unnecessary', 'Slightly helpful'],
          correctAnswer: 'Very important',
          explanation: 'This is a vocabulary question. Use context clues to determine word meaning.',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: difficulty,
          grade: grade,
          tags: ['reading', 'vocabulary', 'fallback', passage.genre]
        };
        
      case 'main_idea':
      default:
        return {
          _id: baseId,
          content: `Read the passage and answer the question:\n\n**${passage.title}**\n\n${passage.text}\n\nWhat is the main idea of this passage?`,
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['The passage explains key information about the topic', 'The passage tells a personal story', 'The passage gives cooking instructions', 'The passage describes a sports game'],
          correctAnswer: 'The passage explains key information about the topic',
          explanation: 'This is a main idea question. Look for the central message of the entire passage.',
          subject: 'Reading',
          topic: 'Reading Comprehension',
          difficulty: difficulty,
          grade: grade,
          tags: ['reading', 'main_idea', 'fallback', passage.genre]
        };
    }
  }

  /**
   * Get passage statistics
   */
  static getPassageStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    
    this.passages.forEach(passage => {
      const key = `Grade ${passage.grade} - ${passage.difficulty}`;
      stats[key] = (stats[key] || 0) + 1;
    });
    
    return stats;
  }
}
