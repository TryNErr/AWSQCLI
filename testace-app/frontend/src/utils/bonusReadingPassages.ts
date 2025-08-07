import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Bonus Reading Passages to Ensure 200+ Questions
 * Additional high-quality passages across all grades with 4-5 questions each
 */

export const bonusReadingPassages: ReadingPassage[] = [
  
  // GRADE 1 BONUS PASSAGES
  {
    id: 'g1_easy_bonus_1',
    title: 'The Little Garden',
    passage: `Sara planted seeds in her little garden. She planted tomato seeds, carrot seeds, and flower seeds. Every day, Sara watered her garden with a small watering can. She pulled out the weeds that tried to grow. After many days, tiny green plants started to grow. Sara was so excited! The tomatoes grew big and red. The carrots grew long and orange underground. The flowers bloomed in many pretty colors. Sara picked the vegetables for dinner and gave flowers to her mom.`,
    grade: '1',
    difficulty: DifficultyLevel.EASY,
    genre: 'fiction',
    wordCount: 78,
    readingLevel: 'beginning_reader',
    questions: [
      {
        _id: 'g1_easy_bonus_1_q1',
        content: 'What three types of seeds did Sara plant?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Tomato, carrot, and flower seeds', 'Apple, corn, and grass seeds', 'Bean, pea, and rose seeds', 'Lettuce, radish, and daisy seeds'],
        correctAnswer: 'Tomato, carrot, and flower seeds',
        explanation: 'The passage states "She planted tomato seeds, carrot seeds, and flower seeds."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['gardening', 'plants', 'details'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_bonus_1_q2',
        content: 'What did Sara do every day?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Watered her garden', 'Picked flowers', 'Ate vegetables', 'Planted more seeds'],
        correctAnswer: 'Watered her garden',
        explanation: 'The passage says "Every day, Sara watered her garden with a small watering can."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['gardening', 'routine', 'care'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_bonus_1_q3',
        content: 'What color did the tomatoes become?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Red', 'Green', 'Yellow', 'Purple'],
        correctAnswer: 'Red',
        explanation: 'The passage states "The tomatoes grew big and red."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['colors', 'plants', 'growth'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g1_easy_bonus_1_q4',
        content: 'Who did Sara give flowers to?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Her mom', 'Her dad', 'Her teacher', 'Her friend'],
        correctAnswer: 'Her mom',
        explanation: 'The passage ends with "gave flowers to her mom."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.EASY,
        grade: '1',
        tags: ['family', 'sharing', 'kindness'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 3 BONUS PASSAGES
  {
    id: 'g3_medium_bonus_1',
    title: 'The Amazing Monarch Butterfly Migration',
    passage: `Every year, millions of monarch butterflies make one of nature's most incredible journeys. These orange and black butterflies travel up to 3,000 miles from Canada and the northern United States to the mountains of central Mexico. What makes this migration so amazing is that the butterflies that fly south have never been to Mexico before! They use the sun, wind patterns, and magnetic fields to navigate. The journey takes several months, and the butterflies stop along the way to rest and feed on nectar from flowers. When they reach Mexico, they cluster together on oyamel fir trees in such large numbers that the tree branches bend under their weight. In spring, the butterflies begin the journey north, but they don't make it all the way back. Instead, they lay eggs along the route, and their children and grandchildren continue the journey home. Scientists are still studying how these tiny creatures can navigate such vast distances with such precision.`,
    grade: '3',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'science',
    wordCount: 168,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g3_medium_bonus_1_q1',
        content: 'How far do monarch butterflies travel during migration?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Up to 3,000 miles', 'Up to 1,000 miles', 'Up to 500 miles', 'Up to 100 miles'],
        correctAnswer: 'Up to 3,000 miles',
        explanation: 'The passage states "These orange and black butterflies travel up to 3,000 miles."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'animals', 'migration'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_bonus_1_q2',
        content: 'What do monarchs use to navigate?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Sun, wind patterns, and magnetic fields', 'Only the sun', 'Maps and compasses', 'Other butterflies'],
        correctAnswer: 'Sun, wind patterns, and magnetic fields',
        explanation: 'The passage explains "They use the sun, wind patterns, and magnetic fields to navigate."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'navigation', 'nature'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_bonus_1_q3',
        content: 'What happens when monarchs reach Mexico?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They cluster on trees in large numbers', 'They build nests', 'They hibernate underground', 'They fly back immediately'],
        correctAnswer: 'They cluster on trees in large numbers',
        explanation: 'The passage states "they cluster together on oyamel fir trees in such large numbers that the tree branches bend under their weight."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'behavior', 'destination'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g3_medium_bonus_1_q4',
        content: 'Do the same butterflies that fly south return north?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['No, their children and grandchildren continue the journey', 'Yes, they make the complete round trip', 'Only some of them return', 'They never return north'],
        correctAnswer: 'No, their children and grandchildren continue the journey',
        explanation: 'The passage explains "they don\'t make it all the way back. Instead, they lay eggs along the route, and their children and grandchildren continue the journey home."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '3',
        tags: ['science', 'life cycle', 'generations'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 5 BONUS PASSAGES
  {
    id: 'g5_hard_bonus_1',
    title: 'The Science of Earthquakes',
    passage: `Earthquakes are one of nature's most powerful and unpredictable forces, capable of reshaping landscapes and affecting millions of lives in mere seconds. These seismic events occur when stress builds up along fault lines—cracks in the Earth's crust where tectonic plates meet. The Earth's outer layer consists of massive plates that constantly move, though usually so slowly that we don't notice. However, when these plates get stuck against each other, pressure accumulates over years or even centuries. Eventually, the stress becomes too great, and the plates suddenly slip, releasing enormous amounts of energy in the form of seismic waves. Scientists measure earthquake intensity using the Richter scale, which ranges from 1 to 10. Each number represents a tenfold increase in magnitude, meaning a magnitude 7 earthquake is ten times stronger than a magnitude 6. The most devastating earthquakes typically occur along the "Ring of Fire," a zone of seismic activity that circles the Pacific Ocean. Countries like Japan, Chile, and California experience frequent earthquakes due to their location along active fault lines. While we cannot prevent earthquakes, scientists use seismographs to detect and study them, helping communities prepare for these natural disasters through building codes, emergency plans, and early warning systems.`,
    grade: '5',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 218,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g5_hard_bonus_1_q1',
        content: 'What causes earthquakes to occur?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Stress builds up along fault lines until plates suddenly slip', 'Underground explosions', 'Heavy rainfall', 'Ocean waves'],
        correctAnswer: 'Stress builds up along fault lines until plates suddenly slip',
        explanation: 'The passage explains that earthquakes occur "when stress builds up along fault lines" and "the plates suddenly slip, releasing enormous amounts of energy."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['science', 'geology', 'cause and effect'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_hard_bonus_1_q2',
        content: 'How does the Richter scale work?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Each number represents a tenfold increase in magnitude', 'Each number represents a twofold increase', 'Higher numbers mean weaker earthquakes', 'It only measures earthquake duration'],
        correctAnswer: 'Each number represents a tenfold increase in magnitude',
        explanation: 'The passage states "Each number represents a tenfold increase in magnitude, meaning a magnitude 7 earthquake is ten times stronger than a magnitude 6."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['science', 'measurement', 'mathematics'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_hard_bonus_1_q3',
        content: 'What is the "Ring of Fire"?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A zone of seismic activity around the Pacific Ocean', 'A volcanic crater', 'A type of earthquake', 'A scientific instrument'],
        correctAnswer: 'A zone of seismic activity around the Pacific Ocean',
        explanation: 'The passage describes the Ring of Fire as "a zone of seismic activity that circles the Pacific Ocean."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['science', 'geography', 'terminology'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g5_hard_bonus_1_q4',
        content: 'How do scientists help communities prepare for earthquakes?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Through building codes, emergency plans, and early warning systems', 'By preventing earthquakes from happening', 'By moving people away from fault lines', 'By predicting exact earthquake times'],
        correctAnswer: 'Through building codes, emergency plans, and early warning systems',
        explanation: 'The passage concludes that scientists help "communities prepare for these natural disasters through building codes, emergency plans, and early warning systems."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '5',
        tags: ['science', 'safety', 'preparation'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 8 BONUS PASSAGES
  {
    id: 'g8_hard_bonus_1',
    title: 'The Psychology of Memory and Learning',
    passage: `Human memory is far more complex and malleable than most people realize, functioning not as a perfect recording device but as a dynamic system that constantly reconstructs and reinterprets our experiences. Neuroscientists have identified three main types of memory: sensory memory, which briefly holds information from our senses; short-term memory, which can hold about seven pieces of information for roughly 20 seconds; and long-term memory, which has virtually unlimited capacity and can store information for a lifetime. The process of transferring information from short-term to long-term memory, called consolidation, is influenced by factors such as repetition, emotional significance, and the connections we make between new information and existing knowledge. Interestingly, each time we recall a memory, we don't simply retrieve a stored file—we actually reconstruct the memory based on various cues and our current state of mind. This reconstruction process means that memories can be altered, distorted, or even completely fabricated without our awareness. Research has shown that eyewitness testimony, once considered highly reliable in legal proceedings, can be surprisingly inaccurate due to the reconstructive nature of memory. Understanding how memory works has profound implications for education, as effective learning strategies must align with the brain's natural processes. Techniques such as spaced repetition, elaborative rehearsal, and connecting new information to prior knowledge can significantly improve retention and recall.`,
    grade: '8',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 248,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g8_hard_bonus_1_q1',
        content: 'What are the three main types of memory?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Sensory, short-term, and long-term memory', 'Visual, auditory, and tactile memory', 'Conscious, unconscious, and subconscious memory', 'Recent, distant, and forgotten memory'],
        correctAnswer: 'Sensory, short-term, and long-term memory',
        explanation: 'The passage identifies "three main types of memory: sensory memory, which briefly holds information from our senses; short-term memory, which can hold about seven pieces of information for roughly 20 seconds; and long-term memory."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'memory', 'classification'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_bonus_1_q2',
        content: 'What happens when we recall a memory?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['We reconstruct the memory based on cues and current state of mind', 'We retrieve an exact copy of the stored memory', 'We always remember it perfectly', 'We forget other memories'],
        correctAnswer: 'We reconstruct the memory based on cues and current state of mind',
        explanation: 'The passage explains "each time we recall a memory, we don\'t simply retrieve a stored file—we actually reconstruct the memory based on various cues and our current state of mind."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'memory', 'process'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_bonus_1_q3',
        content: 'Why can eyewitness testimony be unreliable?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Because memory reconstruction can alter or distort memories', 'Because people lie in court', 'Because witnesses are usually too far away', 'Because events happen too quickly'],
        correctAnswer: 'Because memory reconstruction can alter or distort memories',
        explanation: 'The passage states that "eyewitness testimony, once considered highly reliable in legal proceedings, can be surprisingly inaccurate due to the reconstructive nature of memory."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'legal system', 'reliability'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_bonus_1_q4',
        content: 'What learning techniques can improve memory retention?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Spaced repetition, elaborative rehearsal, and connecting to prior knowledge', 'Only reading information once', 'Memorizing without understanding', 'Studying only right before tests'],
        correctAnswer: 'Spaced repetition, elaborative rehearsal, and connecting to prior knowledge',
        explanation: 'The passage concludes that "Techniques such as spaced repetition, elaborative rehearsal, and connecting new information to prior knowledge can significantly improve retention and recall."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'learning', 'education'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 11 BONUS PASSAGES
  {
    id: 'g11_hard_bonus_1',
    title: 'The Ethics of Genetic Engineering in Agriculture',
    passage: `The development of genetically modified organisms (GMOs) in agriculture represents one of the most contentious scientific advances of the modern era, raising fundamental questions about food security, environmental stewardship, and corporate control over the global food supply. Proponents argue that genetic engineering offers unprecedented opportunities to address world hunger by creating crops that are more nutritious, resistant to pests and diseases, and capable of thriving in harsh environmental conditions. Golden rice, engineered to contain beta-carotene and address vitamin A deficiency in developing countries, exemplifies the potential humanitarian benefits of this technology. Similarly, drought-resistant crops could help farmers adapt to climate change and feed growing populations in water-scarce regions. However, critics raise serious concerns about the long-term ecological and social implications of widespread GMO adoption. They argue that genetically modified crops could lead to the development of "superweeds" and "superbugs" as pests evolve resistance to engineered traits, potentially creating new agricultural challenges that require even more intensive interventions. Environmental scientists worry about the impact on biodiversity, as genetically uniform crops replace traditional varieties that have evolved over millennia. Perhaps most troubling to some observers is the concentration of seed production in the hands of a few multinational corporations, which could give these companies unprecedented control over global food systems. Farmers in developing countries, who have traditionally saved and shared seeds, may become dependent on purchasing new seeds each season, potentially undermining food sovereignty and traditional agricultural practices. The debate over GMOs reflects broader tensions between technological optimism and precautionary principles, between corporate interests and public goods, and between short-term solutions and long-term sustainability.`,
    grade: '11',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 298,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g11_hard_bonus_1_q1',
        content: 'What is Golden rice designed to address?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Vitamin A deficiency in developing countries', 'Drought resistance', 'Pest resistance', 'Increased crop yield'],
        correctAnswer: 'Vitamin A deficiency in developing countries',
        explanation: 'The passage states "Golden rice, engineered to contain beta-carotene and address vitamin A deficiency in developing countries."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['science', 'nutrition', 'global health'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g11_hard_bonus_1_q2',
        content: 'What are "superweeds" and "superbugs" in the context of GMOs?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Pests that evolve resistance to engineered traits', 'Beneficial insects that help crops', 'New types of genetically modified plants', 'Laboratory-created organisms'],
        correctAnswer: 'Pests that evolve resistance to engineered traits',
        explanation: 'The passage explains that critics worry GMO crops "could lead to the development of \'superweeds\' and \'superbugs\' as pests evolve resistance to engineered traits."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['science', 'evolution', 'agriculture'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g11_hard_bonus_1_q3',
        content: 'What concern do critics have about corporate control of seeds?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It could undermine food sovereignty and traditional practices', 'It will make seeds too expensive', 'It will reduce crop quality', 'It will eliminate all traditional farming'],
        correctAnswer: 'It could undermine food sovereignty and traditional practices',
        explanation: 'The passage states that corporate control "may become dependent on purchasing new seeds each season, potentially undermining food sovereignty and traditional agricultural practices."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['economics', 'agriculture', 'social issues'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g11_hard_bonus_1_q4',
        content: 'What broader tensions does the GMO debate reflect?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Technological optimism vs. precautionary principles, corporate vs. public interests', 'Only scientific disagreements', 'Only economic concerns', 'Only environmental issues'],
        correctAnswer: 'Technological optimism vs. precautionary principles, corporate vs. public interests',
        explanation: 'The passage concludes that the debate "reflects broader tensions between technological optimism and precautionary principles, between corporate interests and public goods, and between short-term solutions and long-term sustainability."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['ethics', 'philosophy', 'society'],
        createdBy: 'bonus-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default bonusReadingPassages;
