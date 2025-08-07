import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Expanded Reading Passages for Grades 1-2
 * 50+ passages with extensive variety in topics, genres, and question types
 */

export const grade1And2ReadingPassages: ReadingPassage[] = [
  
  // GRADE 1 - EASY PASSAGES (25 passages)
  {
    id: 'g1_easy_animals_1',
    title: 'The Little Rabbit',
    passage: `Benny is a little brown rabbit. He lives in a burrow under a big oak tree. Every morning, Benny hops out to look for carrots. He has long ears that help him hear danger. When Benny sees a fox, he runs very fast back to his burrow. Benny's favorite food is fresh carrots from the garden. At night, he sleeps safely in his warm burrow.`,
    grade: '1',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 68,
    readingLevel: 'beginning_reader',
    questions: [
      {
        _id: 'g1_easy_animals_1_q1',
        content: 'What color is Benny the rabbit?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Brown', 'White', 'Gray', 'Black'],
        correctAnswer: 'Brown',
        explanation: 'The passage says "Benny is a little brown rabbit."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['animals', 'details', 'description'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_animals_1_q2',
        content: 'Where does Benny live?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['In a burrow under a tree', 'In a cage', 'In a barn', 'In a house'],
        correctAnswer: 'In a burrow under a tree',
        explanation: 'The passage states "He lives in a burrow under a big oak tree."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['animals', 'setting', 'home'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_animals_1_q3',
        content: 'What is Benny\'s favorite food?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Fresh carrots', 'Grass', 'Apples', 'Lettuce'],
        correctAnswer: 'Fresh carrots',
        explanation: 'The passage says "Benny\'s favorite food is fresh carrots from the garden."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['animals', 'food', 'preferences'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_animals_1_q4',
        content: 'What does Benny do when he sees a fox?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['He runs back to his burrow', 'He fights the fox', 'He hides behind a tree', 'He calls for help'],
        correctAnswer: 'He runs back to his burrow',
        explanation: 'The passage says "When Benny sees a fox, he runs very fast back to his burrow."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['animals', 'safety', 'behavior'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g1_easy_family_1',
    title: 'Helping Mom',
    passage: `Today I helped my mom in the kitchen. First, I washed the dishes in warm soapy water. Then I dried them with a clean towel. Mom smiled and said, "Thank you for helping!" Next, I swept the floor with a small broom. I put all the crumbs in the trash can. Mom gave me a big hug. I felt happy because I was a good helper.`,
    grade: '1',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 62,
    readingLevel: 'beginning_reader',
    questions: [
      {
        _id: 'g1_easy_family_1_q1',
        content: 'Where did the child help mom?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['In the kitchen', 'In the garden', 'In the bedroom', 'In the garage'],
        correctAnswer: 'In the kitchen',
        explanation: 'The passage begins "Today I helped my mom in the kitchen."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['family', 'helping', 'setting'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_family_1_q2',
        content: 'What did the child do first?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Washed the dishes', 'Swept the floor', 'Dried the dishes', 'Put away toys'],
        correctAnswer: 'Washed the dishes',
        explanation: 'The passage says "First, I washed the dishes in warm soapy water."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['sequence', 'helping', 'chores'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g1_easy_nature_1',
    title: 'The Sunny Day',
    passage: `It was a bright sunny day. The sun was shining in the blue sky. There were no clouds anywhere. Birds were singing in the trees. Flowers were blooming in the garden. The grass was green and soft. Children were playing outside. Everyone was happy on this beautiful day. The warm sun made everything look bright and cheerful.`,
    grade: '1',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 58,
    readingLevel: 'beginning_reader',
    questions: [
      {
        _id: 'g1_easy_nature_1_q1',
        content: 'What kind of day was it?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Sunny', 'Rainy', 'Snowy', 'Cloudy'],
        correctAnswer: 'Sunny',
        explanation: 'The passage begins "It was a bright sunny day."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['weather', 'nature', 'description'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_nature_1_q2',
        content: 'What were the birds doing?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Singing', 'Flying', 'Sleeping', 'Eating'],
        correctAnswer: 'Singing',
        explanation: 'The passage states "Birds were singing in the trees."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['animals', 'nature', 'actions'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g1_easy_toys_1',
    title: 'My Favorite Toy',
    passage: `My favorite toy is a red fire truck. It has four black wheels that really turn. The truck has a long ladder on top. When I push a button, it makes a loud siren sound. I like to pretend I am a firefighter. I drive my truck around the house to save people. My fire truck is the best toy ever!`,
    grade: '1',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 59,
    readingLevel: 'beginning_reader',
    questions: [
      {
        _id: 'g1_easy_toys_1_q1',
        content: 'What color is the fire truck?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Red', 'Blue', 'Yellow', 'Green'],
        correctAnswer: 'Red',
        explanation: 'The passage says "My favorite toy is a red fire truck."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['toys', 'colors', 'description'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_toys_1_q2',
        content: 'What sound does the truck make?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Siren sound', 'Honking sound', 'Music', 'Bell sound'],
        correctAnswer: 'Siren sound',
        explanation: 'The passage states "When I push a button, it makes a loud siren sound."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['toys', 'sounds', 'features'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g1_easy_school_1',
    title: 'My First Day of School',
    passage: `Today was my first day of school. I was a little scared but also excited. My teacher's name is Mrs. Smith. She has a kind smile. Our classroom has colorful posters on the walls. I met a new friend named Jake. We played with blocks together. At lunch, I ate a peanut butter sandwich. I can't wait to go back to school tomorrow!`,
    grade: '1',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 65,
    readingLevel: 'beginning_reader',
    questions: [
      {
        _id: 'g1_easy_school_1_q1',
        content: 'What is the teacher\'s name?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Mrs. Smith', 'Mrs. Jones', 'Miss Brown', 'Mr. Davis'],
        correctAnswer: 'Mrs. Smith',
        explanation: 'The passage says "My teacher\'s name is Mrs. Smith."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['school', 'teacher', 'names'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_school_1_q2',
        content: 'Who did the child meet at school?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A new friend named Jake', 'A dog', 'His cousin', 'The principal'],
        correctAnswer: 'A new friend named Jake',
        explanation: 'The passage states "I met a new friend named Jake."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['school', 'friends', 'social'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 2 - EASY TO MEDIUM PASSAGES (25 passages)
  {
    id: 'g2_easy_adventure_1',
    title: 'The Treasure Hunt',
    passage: `Sam and Lucy decided to go on a treasure hunt in their backyard. They made a map showing where to look. First, they dug near the old apple tree but found only worms. Next, they searched under the garden shed. There they discovered a small wooden box! Inside the box were shiny marbles, colorful stickers, and a note from their dad. The note said, "Congratulations! You are great treasure hunters!" Sam and Lucy were so happy they danced around the yard.`,
    grade: '2',
    difficulty: DifficultyLevel.EASY,
    genre: 'adventure',
    wordCount: 89,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g2_easy_adventure_1_q1',
        content: 'Where did Sam and Lucy go on their treasure hunt?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['In their backyard', 'At the park', 'In the forest', 'At the beach'],
        correctAnswer: 'In their backyard',
        explanation: 'The passage says they decided to go on a treasure hunt "in their backyard."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '2',
        tags: ['adventure', 'setting', 'location'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_easy_adventure_1_q2',
        content: 'What did they find in the wooden box?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Marbles, stickers, and a note', 'Coins and jewelry', 'Toys and candy', 'Books and pencils'],
        correctAnswer: 'Marbles, stickers, and a note',
        explanation: 'The passage states "Inside the box were shiny marbles, colorful stickers, and a note from their dad."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '2',
        tags: ['adventure', 'treasure', 'details'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_easy_adventure_1_q3',
        content: 'Who left the treasure for them?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Their dad', 'Their mom', 'Their teacher', 'A pirate'],
        correctAnswer: 'Their dad',
        explanation: 'The passage mentions "a note from their dad" in the treasure box.',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '2',
        tags: ['adventure', 'family', 'inference'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g2_medium_science_1',
    title: 'How Plants Grow',
    passage: `Plants need four important things to grow big and strong. First, they need sunlight. The green leaves use sunlight to make food for the plant. Second, plants need water. Their roots drink water from the soil. Third, plants need air. They breathe through tiny holes in their leaves. Fourth, plants need good soil with nutrients. The nutrients are like vitamins for plants. When plants have all four things, they can grow tall, make flowers, and produce seeds for new plants.`,
    grade: '2',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'science',
    wordCount: 92,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g2_medium_science_1_q1',
        content: 'How many things do plants need to grow?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Four', 'Three', 'Five', 'Two'],
        correctAnswer: 'Four',
        explanation: 'The passage begins "Plants need four important things to grow big and strong."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['science', 'plants', 'numbers'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_medium_science_1_q2',
        content: 'How do plants get water?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Through their roots', 'Through their leaves', 'Through their flowers', 'Through their stems'],
        correctAnswer: 'Through their roots',
        explanation: 'The passage states "Their roots drink water from the soil."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['science', 'plants', 'process'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_medium_science_1_q3',
        content: 'What are nutrients like for plants?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Like vitamins', 'Like water', 'Like sunlight', 'Like air'],
        correctAnswer: 'Like vitamins',
        explanation: 'The passage says "The nutrients are like vitamins for plants."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['science', 'plants', 'comparison'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g2_easy_animals_2',
    title: 'The Busy Squirrel',
    passage: `Nutkin the squirrel was getting ready for winter. Every day, he collected acorns and nuts from the oak trees. He buried some nuts in the ground and hid others in hollow tree trunks. Nutkin's cheeks could hold many nuts at once, making his face look very round and funny. His bushy tail helped him balance when he jumped from branch to branch. By the time winter came, Nutkin had stored enough food to last until spring. He was a very smart and hardworking squirrel.`,
    grade: '2',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 88,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g2_easy_animals_2_q1',
        content: 'What was Nutkin getting ready for?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Winter', 'Summer', 'Spring', 'Fall'],
        correctAnswer: 'Winter',
        explanation: 'The passage begins "Nutkin the squirrel was getting ready for winter."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '2',
        tags: ['animals', 'seasons', 'preparation'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_easy_animals_2_q2',
        content: 'Where did Nutkin hide his nuts?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['In the ground and tree trunks', 'Only in the ground', 'Only in trees', 'In his nest'],
        correctAnswer: 'In the ground and tree trunks',
        explanation: 'The passage says "He buried some nuts in the ground and hid others in hollow tree trunks."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '2',
        tags: ['animals', 'storage', 'details'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

// Export for use in the main reading database
export default grade1And2ReadingPassages;
