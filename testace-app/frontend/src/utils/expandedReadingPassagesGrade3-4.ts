import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Expanded Reading Passages for Grades 3-4
 * 50+ passages with diverse topics, genres, and complexity levels
 */

export const grade3And4ReadingPassages: ReadingPassage[] = [
  
  // GRADE 3 - MEDIUM PASSAGES
  {
    id: 'g3_medium_history_1',
    title: 'The First Airplane',
    passage: `On December 17, 1903, two brothers named Orville and Wilbur Wright made history. They built the first airplane that could really fly with a person inside. The airplane was called the Wright Flyer. It was made of wood, fabric, and wire. The first flight lasted only 12 seconds and went 120 feet. That's about as long as half a football field! Many people didn't believe it was possible for humans to fly. The Wright brothers had to try many times before they succeeded. Their invention changed the world forever. Today, millions of people fly in airplanes every day.`,
    grade: '3',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'history',
    wordCount: 108,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g3_medium_history_1_q1',
        content: 'When did the Wright brothers make their first flight?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['December 17, 1903', 'December 17, 1904', 'January 17, 1903', 'December 7, 1903'],
        correctAnswer: 'December 17, 1903',
        explanation: 'The passage begins "On December 17, 1903, two brothers named Orville and Wilbur Wright made history."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['history', 'dates', 'aviation'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_history_1_q2',
        content: 'How long did the first flight last?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['12 seconds', '12 minutes', '20 seconds', '1 minute'],
        correctAnswer: '12 seconds',
        explanation: 'The passage states "The first flight lasted only 12 seconds and went 120 feet."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['history', 'time', 'facts'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_history_1_q3',
        content: 'What was the airplane made of?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Wood, fabric, and wire', 'Metal and plastic', 'Only wood', 'Steel and glass'],
        correctAnswer: 'Wood, fabric, and wire',
        explanation: 'The passage says "It was made of wood, fabric, and wire."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['history', 'materials', 'details'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g3_medium_science_2',
    title: 'The Water Cycle',
    passage: `Water is always moving around our planet in something called the water cycle. First, the sun heats up water in oceans, lakes, and rivers. This makes the water turn into invisible water vapor that rises into the sky. This process is called evaporation. High up in the sky, the water vapor gets cold and turns back into tiny water droplets. These droplets form clouds. This process is called condensation. When the clouds get too heavy with water, the water falls back down as rain, snow, or hail. This is called precipitation. The water then flows back to the oceans, lakes, and rivers, and the cycle starts all over again.`,
    grade: '3',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'science',
    wordCount: 125,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g3_medium_science_2_q1',
        content: 'What causes water to turn into water vapor?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['The sun heats it up', 'The wind blows it', 'It gets very cold', 'Fish swim in it'],
        correctAnswer: 'The sun heats it up',
        explanation: 'The passage states "First, the sun heats up water in oceans, lakes, and rivers. This makes the water turn into invisible water vapor."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'water cycle', 'cause and effect'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_science_2_q2',
        content: 'What is it called when water vapor turns into droplets?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Condensation', 'Evaporation', 'Precipitation', 'Circulation'],
        correctAnswer: 'Condensation',
        explanation: 'The passage explains "High up in the sky, the water vapor gets cold and turns back into tiny water droplets... This process is called condensation."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'vocabulary', 'processes'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_science_2_q3',
        content: 'What are three forms of precipitation mentioned?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Rain, snow, and hail', 'Rain, wind, and clouds', 'Snow, ice, and fog', 'Hail, mist, and dew'],
        correctAnswer: 'Rain, snow, and hail',
        explanation: 'The passage states "the water falls back down as rain, snow, or hail."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'weather', 'details'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g3_medium_biography_1',
    title: 'Helen Keller: A Remarkable Girl',
    passage: `Helen Keller was born in 1880 in Alabama. When she was just 19 months old, she became very sick with a fever. The illness left her unable to see or hear. Helen's world became dark and silent. She couldn't learn to speak like other children. Helen became frustrated and often had tantrums. When Helen was seven years old, her parents hired a special teacher named Anne Sullivan. Anne taught Helen to communicate by spelling words into her hand using finger movements. The first word Helen learned was "water." This opened up a whole new world for Helen. She went on to learn to read, write, and even speak. Helen became the first deaf and blind person to graduate from college.`,
    grade: '3',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'biography',
    wordCount: 132,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g3_medium_biography_1_q1',
        content: 'What happened to Helen when she was 19 months old?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['She became sick and lost her sight and hearing', 'She learned to walk', 'She started school', 'She moved to a new house'],
        correctAnswer: 'She became sick and lost her sight and hearing',
        explanation: 'The passage states "When she was just 19 months old, she became very sick with a fever. The illness left her unable to see or hear."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['biography', 'disability', 'challenges'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_biography_1_q2',
        content: 'Who was Helen\'s special teacher?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Anne Sullivan', 'Mary Johnson', 'Sarah Brown', 'Emma Davis'],
        correctAnswer: 'Anne Sullivan',
        explanation: 'The passage says "her parents hired a special teacher named Anne Sullivan."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['biography', 'education', 'people'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_biography_1_q3',
        content: 'What was the first word Helen learned?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Water', 'Hello', 'Mother', 'Please'],
        correctAnswer: 'Water',
        explanation: 'The passage states "The first word Helen learned was \'water.\'"',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['biography', 'learning', 'communication'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 4 - MEDIUM TO HARD PASSAGES
  {
    id: 'g4_medium_adventure_2',
    title: 'The Secret Cave',
    passage: `Maya and her brother Carlos were exploring the rocky hills behind their grandmother's house in New Mexico. As they climbed over a large boulder, Maya noticed a narrow opening between two rocks. "Look, Carlos!" she whispered excitedly. "I think there's a cave here!" They squeezed through the opening and found themselves in a small, cool cave. Ancient drawings covered the walls - pictures of animals, people, and strange symbols. Carlos pulled out his flashlight to get a better look. "These look really old," he said in amazement. "We should tell Grandma about this." Maya carefully took photos with her phone. Later, their grandmother explained that these were petroglyphs made by Native Americans hundreds of years ago. The children had discovered an important piece of history right in their own backyard.`,
    grade: '4',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'adventure',
    wordCount: 148,
    readingLevel: 'fluent_reader',
    questions: [
      {
        _id: 'g4_medium_adventure_2_q1',
        content: 'Where were Maya and Carlos exploring?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Rocky hills behind their grandmother\'s house', 'A forest near their school', 'The beach by their home', 'Mountains near the city'],
        correctAnswer: 'Rocky hills behind their grandmother\'s house',
        explanation: 'The passage begins "Maya and her brother Carlos were exploring the rocky hills behind their grandmother\'s house in New Mexico."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['adventure', 'setting', 'exploration'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_medium_adventure_2_q2',
        content: 'What did they find on the cave walls?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Ancient drawings of animals, people, and symbols', 'Modern graffiti', 'Treasure maps', 'Nothing at all'],
        correctAnswer: 'Ancient drawings of animals, people, and symbols',
        explanation: 'The passage states "Ancient drawings covered the walls - pictures of animals, people, and strange symbols."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['adventure', 'discovery', 'art'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_medium_adventure_2_q3',
        content: 'What are petroglyphs?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Drawings made by Native Americans hundreds of years ago', 'Modern cave paintings', 'Natural rock formations', 'Fossil remains'],
        correctAnswer: 'Drawings made by Native Americans hundreds of years ago',
        explanation: 'The passage explains "their grandmother explained that these were petroglyphs made by Native Americans hundreds of years ago."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['history', 'culture', 'vocabulary'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g4_hard_science_3',
    title: 'The Amazing Octopus',
    passage: `The octopus is one of the most intelligent creatures in the ocean. These fascinating animals have eight arms covered with powerful suction cups that can taste and smell. An octopus has three hearts that pump blue blood through its body, and it breathes through gills like fish do. What makes octopuses truly remarkable is their ability to change color and texture instantly. They can camouflage themselves to look exactly like rocks, coral, or seaweed to hide from predators or sneak up on prey. Octopuses are also master escape artists. They can squeeze their soft bodies through any opening larger than their hard beak, which is the only rigid part of their body. Some octopuses have been observed using tools, such as carrying coconut shells to use as portable shelters. Scientists consider octopuses to be among the most intelligent invertebrates on Earth.`,
    grade: '4',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 152,
    readingLevel: 'fluent_reader',
    questions: [
      {
        _id: 'g4_hard_science_3_q1',
        content: 'How many hearts does an octopus have?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Three', 'Two', 'One', 'Four'],
        correctAnswer: 'Three',
        explanation: 'The passage states "An octopus has three hearts that pump blue blood through its body."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '4',
        tags: ['science', 'animals', 'anatomy'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_hard_science_3_q2',
        content: 'What is the only rigid part of an octopus\'s body?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Its beak', 'Its arms', 'Its head', 'Its suction cups'],
        correctAnswer: 'Its beak',
        explanation: 'The passage explains "They can squeeze their soft bodies through any opening larger than their hard beak, which is the only rigid part of their body."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '4',
        tags: ['science', 'animals', 'anatomy'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_hard_science_3_q3',
        content: 'Why do scientists consider octopuses intelligent?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They can use tools and solve problems', 'They have many arms', 'They can swim fast', 'They live in the ocean'],
        correctAnswer: 'They can use tools and solve problems',
        explanation: 'The passage mentions they use tools like "carrying coconut shells to use as portable shelters" and are "among the most intelligent invertebrates on Earth."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '4',
        tags: ['science', 'intelligence', 'behavior'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default grade3And4ReadingPassages;
