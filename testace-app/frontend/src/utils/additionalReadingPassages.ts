import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Additional Reading Passages for Comprehensive Coverage
 * Ensures variety across all grades, topics, and genres
 */

export const additionalReadingPassages: ReadingPassage[] = [
  
  // POETRY PASSAGES
  {
    id: 'g5_medium_poetry_1',
    title: 'The Road Not Taken by Robert Frost (Excerpt Analysis)',
    passage: `Robert Frost's famous poem "The Road Not Taken" contains the well-known lines: "Two roads diverged in a yellow wood, / And sorry I could not travel both / And be one traveler, long I stood / And looked down one as far as I could / To where it bent in the undergrowth." This poem is often misunderstood as simply encouraging people to take the unconventional path. However, a closer reading reveals more complexity. The speaker stands at a fork in the road, unable to see where either path leads due to the "undergrowth." He notes that both paths are "really about the same" and "equally lay." The famous final lines—"I took the one less traveled by, / And that has made all the difference"—are spoken by an older version of the speaker, imagining how he might tell this story "ages and ages hence." Frost suggests that people often create meaningful narratives about their choices after the fact, even when those choices were made with incomplete information and may have been largely arbitrary.`,
    grade: '5',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'poetry',
    wordCount: 168,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g5_medium_poetry_1_q1',
        content: 'Why couldn\'t the speaker see where the paths led?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Because of the undergrowth', 'Because it was dark', 'Because he was blind', 'Because of fog'],
        correctAnswer: 'Because of the undergrowth',
        explanation: 'The passage states the speaker looked "To where it bent in the undergrowth," indicating the undergrowth blocked his view.',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '5',
        tags: ['poetry', 'analysis', 'symbolism'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_medium_poetry_1_q2',
        content: 'What does the passage suggest about how people view their past choices?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['People create meaningful narratives about choices after the fact', 'People always regret their choices', 'People never think about past choices', 'People always make perfect choices'],
        correctAnswer: 'People create meaningful narratives about choices after the fact',
        explanation: 'The passage concludes that "people often create meaningful narratives about their choices after the fact, even when those choices were made with incomplete information."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '5',
        tags: ['poetry', 'theme', 'human nature'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // BIOGRAPHY PASSAGES
  {
    id: 'g6_medium_biography_3',
    title: 'Marie Curie: Pioneer in Science',
    passage: `Marie Curie, born Maria Skłodowska in Poland in 1867, overcame tremendous obstacles to become one of the most celebrated scientists in history. Growing up in Russian-controlled Poland, she was denied access to higher education because she was a woman. Determined to pursue her studies, she made a pact with her sister: she would work to support her sister's medical studies in Paris, and then her sister would return the favor. After years of working as a governess, Marie finally traveled to Paris in 1891 to study physics and mathematics at the Sorbonne. Living in poverty, she often survived on bread and butter, sometimes fainting from hunger during lectures. Despite these hardships, she graduated first in her physics degree and second in mathematics. Marie's groundbreaking research on radioactivity—a term she coined—led to the discovery of two new elements: polonium (named after her homeland) and radium. She became the first woman to win a Nobel Prize when she shared the 1903 Physics Prize with her husband Pierre and Henri Becquerel. After Pierre's tragic death in 1906, Marie continued their research alone, becoming the first female professor at the Sorbonne. In 1911, she won an unprecedented second Nobel Prize, this time in Chemistry, making her the only person to win Nobel Prizes in two different scientific fields. During World War I, she developed mobile X-ray units, nicknamed "petites Curies," which helped save countless lives on the battlefield.`,
    grade: '6',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'biography',
    wordCount: 258,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g6_medium_biography_3_q1',
        content: 'What pact did Marie make with her sister?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They would take turns supporting each other\'s education', 'They would study the same subjects', 'They would move to Paris together', 'They would become business partners'],
        correctAnswer: 'They would take turns supporting each other\'s education',
        explanation: 'The passage states "she would work to support her sister\'s medical studies in Paris, and then her sister would return the favor."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '6',
        tags: ['biography', 'family', 'sacrifice'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_medium_biography_3_q2',
        content: 'What makes Marie Curie unique among Nobel Prize winners?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['She\'s the only person to win Nobel Prizes in two different scientific fields', 'She was the youngest winner ever', 'She won three Nobel Prizes', 'She was the first person to win a Nobel Prize'],
        correctAnswer: 'She\'s the only person to win Nobel Prizes in two different scientific fields',
        explanation: 'The passage states she won Nobel Prizes in Physics and Chemistry, "making her the only person to win Nobel Prizes in two different scientific fields."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '6',
        tags: ['biography', 'achievement', 'science'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // ADVENTURE/FICTION PASSAGES
  {
    id: 'g7_medium_adventure_3',
    title: 'The Lost City Discovery',
    passage: `Dr. Elena Rodriguez had spent three years studying satellite images and ancient maps, convinced that a lost Mayan city lay hidden beneath the dense canopy of the Guatemalan rainforest. Her colleagues at the university thought she was chasing shadows, but Elena's grandmother had told her stories passed down through generations about a city called Yax Muul—"Green Mound"—that had vanished into the jungle centuries ago. Armed with ground-penetrating radar and a small team of graduate students, Elena finally received permission to explore the remote region. The first week yielded nothing but mosquito bites and skeptical looks from her team. Then, on the eighth day, the radar detected unusual geometric patterns beneath the forest floor. As they carefully cleared away centuries of vegetation and soil, the outline of a stone plaza began to emerge. Elena's heart raced as she recognized the distinctive architectural style of the Late Classic period. But the real discovery came when they uncovered a series of hieroglyphic inscriptions that seemed to tell the story of the city's abandonment. According to the glyphs, the inhabitants had fled not because of war or drought, as was common with other Mayan cities, but because of a series of earthquakes that had made the ground unstable. The inscriptions also mentioned a hidden chamber containing the city's most precious artifacts, sealed away for future generations to discover. As Elena translated the final glyph, she realized it contained coordinates—not to treasure, but to a library of stone tablets that could revolutionize understanding of Mayan civilization.`,
    grade: '7',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'adventure',
    wordCount: 278,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g7_medium_adventure_3_q1',
        content: 'What initially motivated Dr. Rodriguez to search for the lost city?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Stories her grandmother told her', 'A treasure map she found', 'Orders from the university', 'A dream she had'],
        correctAnswer: 'Stories her grandmother told her',
        explanation: 'The passage states "Elena\'s grandmother had told her stories passed down through generations about a city called Yax Muul."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '7',
        tags: ['adventure', 'motivation', 'family history'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g7_medium_adventure_3_q2',
        content: 'According to the hieroglyphic inscriptions, why did the inhabitants abandon the city?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Because of earthquakes that made the ground unstable', 'Because of war with neighboring cities', 'Because of a severe drought', 'Because of disease'],
        correctAnswer: 'Because of earthquakes that made the ground unstable',
        explanation: 'The passage states "the inhabitants had fled not because of war or drought, as was common with other Mayan cities, but because of a series of earthquakes that had made the ground unstable."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '7',
        tags: ['adventure', 'history', 'cause and effect'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // SCIENCE PASSAGES - Environmental Science
  {
    id: 'g8_hard_science_9',
    title: 'Microplastics: The Invisible Pollution Crisis',
    passage: `Microplastics—plastic particles smaller than 5 millimeters—have emerged as one of the most pervasive and insidious forms of environmental pollution on Earth. These tiny fragments, invisible to the naked eye, are now found everywhere from the deepest ocean trenches to the highest mountain peaks, and even in the air we breathe and the food we eat. The sources of microplastics are diverse and often surprising. While some originate from the breakdown of larger plastic items like bottles and bags, others come from synthetic textiles that shed microscopic fibers during washing, car tires that wear down on roads, and personal care products that contain plastic microbeads. Every time we wash synthetic clothing, thousands of plastic fibers flow down the drain and eventually reach waterways. A single load of laundry can release up to 700,000 microplastic fibers into the environment. The environmental impact of microplastics extends throughout the food chain. Marine organisms, from tiny zooplankton to large whales, ingest these particles, mistaking them for food. The plastics can cause physical damage to digestive systems and may act as vectors for toxic chemicals that accumulate in tissues. When larger animals consume contaminated prey, these toxins become concentrated through bioaccumulation, potentially reaching dangerous levels in top predators, including humans. Recent studies have detected microplastics in human blood, lungs, and placental tissue, raising concerns about potential health effects that scientists are only beginning to understand. The challenge of addressing microplastic pollution is compounded by its ubiquity and the difficulty of removing such small particles from the environment once they're released.`,
    grade: '8',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 288,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g8_hard_science_9_q1',
        content: 'What are microplastics?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Plastic particles smaller than 5 millimeters', 'Plastic particles larger than 5 millimeters', 'Only plastic from bottles and bags', 'Plastic that dissolves in water'],
        correctAnswer: 'Plastic particles smaller than 5 millimeters',
        explanation: 'The passage defines microplastics as "plastic particles smaller than 5 millimeters."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['science', 'environment', 'pollution'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_science_9_q2',
        content: 'How many microplastic fibers can a single load of laundry release?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Up to 700,000', 'Up to 70,000', 'Up to 7,000', 'Up to 700'],
        correctAnswer: 'Up to 700,000',
        explanation: 'The passage states "A single load of laundry can release up to 700,000 microplastic fibers into the environment."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['science', 'statistics', 'pollution'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // CURRENT EVENTS/SOCIAL ISSUES
  {
    id: 'g10_hard_social_1',
    title: 'The Future of Work in an Automated World',
    passage: `The rapid advancement of artificial intelligence and robotics is fundamentally reshaping the global economy, creating both unprecedented opportunities and significant challenges for workers across all industries. Unlike previous technological revolutions that primarily affected manual labor, today's automation threatens to displace cognitive work as well, from legal research and medical diagnosis to financial analysis and creative tasks. Machine learning algorithms can now process vast amounts of data, recognize patterns, and make decisions with speed and accuracy that often surpass human capabilities. This technological shift is not merely theoretical—it's already transforming industries. In manufacturing, robots perform assembly tasks with precision and consistency. In finance, algorithms execute trades in milliseconds and assess loan applications. In transportation, autonomous vehicles are being tested on roads worldwide. Even creative fields are experiencing disruption, with AI systems generating music, writing articles, and creating visual art. However, the impact of automation is not uniformly distributed across the workforce. Workers in routine, predictable jobs—whether blue-collar or white-collar—face the highest risk of displacement. Conversely, occupations requiring complex problem-solving, creativity, emotional intelligence, and interpersonal skills remain relatively secure. This creates a bifurcated labor market where high-skilled workers benefit from technological augmentation while low- and middle-skilled workers face potential obsolescence. The societal implications are profound. Mass unemployment could lead to social unrest and political instability. Alternatively, automation could free humans from mundane tasks, allowing for more meaningful work and increased leisure time. The outcome depends largely on how societies choose to manage this transition through education, policy, and economic restructuring.`,
    grade: '10',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 288,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g10_hard_social_1_q1',
        content: 'How does current automation differ from previous technological revolutions?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It affects both manual and cognitive work', 'It only affects manual labor', 'It only affects cognitive work', 'It doesn\'t affect any jobs'],
        correctAnswer: 'It affects both manual and cognitive work',
        explanation: 'The passage states "Unlike previous technological revolutions that primarily affected manual labor, today\'s automation threatens to displace cognitive work as well."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['technology', 'economics', 'social change'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_social_1_q2',
        content: 'Which types of jobs are most at risk from automation?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Routine, predictable jobs', 'Creative jobs only', 'Jobs requiring emotional intelligence', 'Complex problem-solving jobs'],
        correctAnswer: 'Routine, predictable jobs',
        explanation: 'The passage states "Workers in routine, predictable jobs—whether blue-collar or white-collar—face the highest risk of displacement."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['technology', 'employment', 'risk assessment'],
        createdBy: 'additional-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default additionalReadingPassages;
