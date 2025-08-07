import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Expanded Reading Passages for Grades 5-6
 * Advanced passages with complex themes, vocabulary, and critical thinking questions
 */

export const grade5And6ReadingPassages: ReadingPassage[] = [
  
  // GRADE 5 - MEDIUM TO HARD PASSAGES
  {
    id: 'g5_medium_science_4',
    title: 'The Mystery of Black Holes',
    passage: `Black holes are among the most mysterious objects in the universe. They are regions in space where gravity is so strong that nothing, not even light, can escape once it gets too close. This is why they appear completely black to us. Black holes form when massive stars, much larger than our sun, reach the end of their lives and collapse under their own gravity. The boundary around a black hole is called the event horizon. Once something crosses this invisible line, it can never return. Scientists cannot see black holes directly, but they can detect them by observing how they affect nearby stars and gas. Matter spiraling into a black hole heats up and glows brightly, creating what astronomers call an accretion disk. Some black holes are millions of times more massive than our sun and sit at the centers of galaxies. Despite their fearsome reputation, black holes play an important role in shaping the universe and may have helped form the galaxies we see today.`,
    grade: '5',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'science',
    wordCount: 178,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g5_medium_science_4_q1',
        content: 'Why do black holes appear black?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Nothing, not even light, can escape from them', 'They are made of dark matter', 'They are very cold', 'They are covered in black dust'],
        correctAnswer: 'Nothing, not even light, can escape from them',
        explanation: 'The passage explains that black holes "are regions in space where gravity is so strong that nothing, not even light, can escape once it gets too close. This is why they appear completely black to us."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '5',
        tags: ['science', 'astronomy', 'cause and effect'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_medium_science_4_q2',
        content: 'What is the event horizon?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['The boundary around a black hole', 'The center of a black hole', 'A type of star', 'The edge of the universe'],
        correctAnswer: 'The boundary around a black hole',
        explanation: 'The passage states "The boundary around a black hole is called the event horizon."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '5',
        tags: ['science', 'vocabulary', 'definitions'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_medium_science_4_q3',
        content: 'How do scientists detect black holes if they can\'t see them directly?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['By observing how they affect nearby stars and gas', 'By using special black hole telescopes', 'By listening to sounds they make', 'By measuring their temperature'],
        correctAnswer: 'By observing how they affect nearby stars and gas',
        explanation: 'The passage explains "Scientists cannot see black holes directly, but they can detect them by observing how they affect nearby stars and gas."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '5',
        tags: ['science', 'methods', 'inference'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g5_hard_history_2',
    title: 'The Underground Railroad',
    passage: `The Underground Railroad was not actually a railroad with trains and tracks. Instead, it was a secret network of people who helped enslaved African Americans escape to freedom in the northern states and Canada during the 1800s. The network got its name because it operated in secret, like a railroad running underground. People who helped runaway slaves were called "conductors," and the safe houses where escapees could rest and hide were called "stations." One of the most famous conductors was Harriet Tubman, who made 19 trips into the South and helped about 70 people escape to freedom. She was never caught and never lost a single person. The journey north was extremely dangerous. Escapees traveled mostly at night, following the North Star and using coded songs and quilts to communicate. If caught, runaway slaves faced severe punishment, and those who helped them could be fined or imprisoned. Despite these risks, thousands of brave people participated in the Underground Railroad, believing that freedom was worth any danger. This network played a crucial role in the fight against slavery and helped approximately 100,000 people reach freedom.`,
    grade: '5',
    difficulty: DifficultyLevel.HARD,
    genre: 'history',
    wordCount: 198,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g5_hard_history_2_q1',
        content: 'Why was it called the Underground Railroad?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It operated in secret, like a railroad running underground', 'It used actual underground tunnels', 'It was built below ground level', 'It only operated during underground mining'],
        correctAnswer: 'It operated in secret, like a railroad running underground',
        explanation: 'The passage explains "The network got its name because it operated in secret, like a railroad running underground."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['history', 'metaphor', 'reasoning'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_hard_history_2_q2',
        content: 'What made Harriet Tubman\'s work as a conductor remarkable?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['She was never caught and never lost a person', 'She was the only conductor', 'She worked during the day', 'She used trains for transportation'],
        correctAnswer: 'She was never caught and never lost a person',
        explanation: 'The passage states "She was never caught and never lost a single person."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['history', 'biography', 'achievement'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_hard_history_2_q3',
        content: 'Approximately how many people reached freedom through the Underground Railroad?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['100,000', '70,000', '50,000', '200,000'],
        correctAnswer: '100,000',
        explanation: 'The passage concludes "This network played a crucial role in the fight against slavery and helped approximately 100,000 people reach freedom."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['history', 'statistics', 'impact'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 6 - HARD PASSAGES
  {
    id: 'g6_hard_science_5',
    title: 'The Fascinating World of Bioluminescence',
    passage: `In the depths of the ocean and the darkness of forests, some of nature's most spectacular light shows occur without electricity or fire. Bioluminescence is the ability of living organisms to produce their own light through chemical reactions within their bodies. This remarkable phenomenon occurs when a chemical called luciferin reacts with an enzyme called luciferase in the presence of oxygen, creating light with very little heat. Fireflies are perhaps the most familiar bioluminescent creatures to land-dwellers, using their flashing lights to communicate with potential mates. Each species has its own unique flashing pattern, like a secret code. In the ocean, bioluminescence serves many purposes. Deep-sea anglerfish use a glowing lure to attract prey in the pitch-black depths. Some jellyfish create stunning displays of blue light when disturbed, possibly to startle predators or attract larger predators to eat whatever is threatening them. Certain bacteria, fungi, and even some plants can produce their own light. Scientists are now studying bioluminescence to develop new technologies, including more efficient lighting systems and medical imaging techniques. This natural phenomenon continues to inspire researchers and remind us of the incredible diversity and ingenuity of life on Earth.`,
    grade: '6',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 208,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g6_hard_science_5_q1',
        content: 'What chemicals are involved in bioluminescence?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Luciferin and luciferase', 'Chlorophyll and oxygen', 'Carbon and hydrogen', 'Protein and glucose'],
        correctAnswer: 'Luciferin and luciferase',
        explanation: 'The passage explains "This remarkable phenomenon occurs when a chemical called luciferin reacts with an enzyme called luciferase in the presence of oxygen."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'chemistry', 'processes'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_science_5_q2',
        content: 'How do fireflies use bioluminescence?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['To communicate with potential mates', 'To scare away predators', 'To find food', 'To navigate in darkness'],
        correctAnswer: 'To communicate with potential mates',
        explanation: 'The passage states "Fireflies are perhaps the most familiar bioluminescent creatures to land-dwellers, using their flashing lights to communicate with potential mates."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'animal behavior', 'communication'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_science_5_q3',
        content: 'What are scientists hoping to develop by studying bioluminescence?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['More efficient lighting and medical imaging techniques', 'Better fishing equipment', 'Stronger building materials', 'Faster transportation methods'],
        correctAnswer: 'More efficient lighting and medical imaging techniques',
        explanation: 'The passage mentions "Scientists are now studying bioluminescence to develop new technologies, including more efficient lighting systems and medical imaging techniques."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'technology', 'applications'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g6_hard_literature_1',
    title: 'The Power of Perseverance',
    passage: `Maria stared at the blank canvas before her, paintbrush trembling in her hand. For months, she had dreamed of creating a masterpiece for the school art competition, but every attempt ended in frustration. Her paintings never matched the vivid images in her mind. "Maybe I'm just not talented enough," she whispered to herself, ready to give up once again. Just then, her art teacher, Ms. Rodriguez, approached quietly. "You know, Maria," she said gently, "I've been watching you work, and I see something special in your dedication. Talent isn't just about natural ability—it's about persistence and the willingness to learn from mistakes." Ms. Rodriguez showed Maria paintings by famous artists, pointing out how many had struggled for years before creating their celebrated works. "Van Gogh sold only one painting during his lifetime," she explained. "Monet was rejected from art school. What made them great wasn't immediate success, but their refusal to quit." Inspired by these words, Maria picked up her brush with renewed determination. She realized that each "failed" painting had taught her something valuable about color, composition, and technique. With this new perspective, she began to paint not for perfection, but for the joy of creating and learning. Three weeks later, Maria's painting won second place in the competition, but more importantly, she had discovered that the journey of improvement was more rewarding than any prize.`,
    grade: '6',
    difficulty: DifficultyLevel.HARD,
    genre: 'fiction',
    wordCount: 248,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g6_hard_literature_1_q1',
        content: 'What was Maria\'s main problem at the beginning of the story?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Her paintings never matched her mental images', 'She didn\'t have enough art supplies', 'Other students were making fun of her', 'She was running out of time for the competition'],
        correctAnswer: 'Her paintings never matched her mental images',
        explanation: 'The passage states "Her paintings never matched the vivid images in her mind."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['literature', 'character', 'conflict'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_literature_1_q2',
        content: 'What lesson did Ms. Rodriguez teach Maria about talent?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Talent includes persistence and learning from mistakes', 'Talent is only about natural ability', 'Talent doesn\'t matter in art', 'Talent can\'t be developed'],
        correctAnswer: 'Talent includes persistence and learning from mistakes',
        explanation: 'Ms. Rodriguez explains "Talent isn\'t just about natural ability—it\'s about persistence and the willingness to learn from mistakes."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['literature', 'theme', 'lesson'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_literature_1_q3',
        content: 'What was more important to Maria than winning the competition?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Discovering that the journey of improvement was rewarding', 'Getting praise from her teacher', 'Beating other students', 'Finishing her painting quickly'],
        correctAnswer: 'Discovering that the journey of improvement was rewarding',
        explanation: 'The passage concludes "she had discovered that the journey of improvement was more rewarding than any prize."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['literature', 'theme', 'character growth'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default grade5And6ReadingPassages;
