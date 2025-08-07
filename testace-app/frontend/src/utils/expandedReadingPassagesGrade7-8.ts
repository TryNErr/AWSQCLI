import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Expanded Reading Passages for Grades 7-8
 * Sophisticated passages with complex themes, advanced vocabulary, and analytical thinking questions
 */

export const grade7And8ReadingPassages: ReadingPassage[] = [
  
  // GRADE 7 - HARD PASSAGES
  {
    id: 'g7_hard_science_6',
    title: 'The Quantum World: Where Reality Gets Strange',
    passage: `In the bizarre realm of quantum physics, the fundamental rules that govern our everyday world simply don't apply. At the subatomic level, particles can exist in multiple states simultaneously, a phenomenon called superposition. Imagine a coin that is both heads and tails at the same time until someone observes it—only then does it "choose" one state or the other. This isn't science fiction; it's the reality of quantum mechanics. Even stranger is quantum entanglement, where two particles become mysteriously connected across vast distances. When one particle's state changes, its entangled partner instantly responds, regardless of the space between them. Einstein famously called this "spooky action at a distance" because it seemed to violate the speed of light limit. However, decades of experiments have confirmed that quantum entanglement is real. These quantum properties aren't just scientific curiosities—they're revolutionizing technology. Quantum computers harness superposition to process information in ways that could solve problems impossible for traditional computers. Quantum cryptography uses entanglement to create unbreakable codes. As we delve deeper into the quantum world, we're discovering that reality at its most fundamental level is far stranger and more wonderful than we ever imagined.`,
    grade: '7',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 218,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g7_hard_science_6_q1',
        content: 'What is superposition in quantum physics?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Particles existing in multiple states simultaneously', 'Particles moving faster than light', 'Particles becoming invisible', 'Particles splitting into smaller pieces'],
        correctAnswer: 'Particles existing in multiple states simultaneously',
        explanation: 'The passage defines superposition as when "particles can exist in multiple states simultaneously."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '7',
        tags: ['science', 'physics', 'concepts'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g7_hard_science_6_q2',
        content: 'Why did Einstein call quantum entanglement "spooky action at a distance"?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It seemed to violate the speed of light limit', 'It only happened at night', 'It involved ghosts', 'It was discovered on Halloween'],
        correctAnswer: 'It seemed to violate the speed of light limit',
        explanation: 'The passage explains that Einstein called it this "because it seemed to violate the speed of light limit."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '7',
        tags: ['science', 'history', 'reasoning'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g7_hard_science_6_q3',
        content: 'How are quantum properties being used in technology?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['In quantum computers and cryptography', 'Only in theoretical research', 'In time travel machines', 'In teleportation devices'],
        correctAnswer: 'In quantum computers and cryptography',
        explanation: 'The passage mentions "Quantum computers harness superposition" and "Quantum cryptography uses entanglement to create unbreakable codes."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '7',
        tags: ['science', 'technology', 'applications'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g7_hard_history_3',
    title: 'The Renaissance: A Cultural Revolution',
    passage: `The Renaissance, spanning roughly from the 14th to the 17th century, marked one of the most transformative periods in human history. Beginning in Italy and spreading throughout Europe, this cultural movement represented a dramatic shift from the medieval worldview to a new emphasis on humanism, scientific inquiry, and artistic expression. The term "Renaissance" means "rebirth," reflecting the renewed interest in classical Greek and Roman learning that had been largely forgotten during the Middle Ages. This period produced some of history's most celebrated figures: Leonardo da Vinci, whose notebooks reveal a mind that seamlessly blended art and science; Michelangelo, whose sculptures and paintings redefined artistic beauty; and Galileo Galilei, whose telescopic observations challenged the very foundations of medieval cosmology. The Renaissance wasn't merely about individual genius, however. It was fueled by several key factors: the growth of wealthy merchant cities that could patronize the arts, the invention of the printing press that democratized knowledge, and the fall of Constantinople in 1453, which sent Greek scholars fleeing westward with precious manuscripts. Perhaps most importantly, Renaissance thinkers developed a new confidence in human potential and reason. This intellectual revolution laid the groundwork for the Scientific Revolution and the Enlightenment, fundamentally changing how humans understood themselves and their place in the universe.`,
    grade: '7',
    difficulty: DifficultyLevel.HARD,
    genre: 'history',
    wordCount: 238,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g7_hard_history_3_q1',
        content: 'What does the term "Renaissance" mean?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Rebirth', 'Revolution', 'Renewal', 'Reform'],
        correctAnswer: 'Rebirth',
        explanation: 'The passage states "The term \'Renaissance\' means \'rebirth,\' reflecting the renewed interest in classical Greek and Roman learning."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '7',
        tags: ['history', 'vocabulary', 'etymology'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g7_hard_history_3_q2',
        content: 'What event in 1453 contributed to the Renaissance?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['The fall of Constantinople', 'The invention of the printing press', 'The birth of Leonardo da Vinci', 'The discovery of America'],
        correctAnswer: 'The fall of Constantinople',
        explanation: 'The passage mentions "the fall of Constantinople in 1453, which sent Greek scholars fleeing westward with precious manuscripts."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '7',
        tags: ['history', 'cause and effect', 'dates'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g7_hard_history_3_q3',
        content: 'What was the most important change in thinking during the Renaissance?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['New confidence in human potential and reason', 'Belief in magic and superstition', 'Focus only on religious matters', 'Rejection of all classical learning'],
        correctAnswer: 'New confidence in human potential and reason',
        explanation: 'The passage states "Perhaps most importantly, Renaissance thinkers developed a new confidence in human potential and reason."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '7',
        tags: ['history', 'philosophy', 'main idea'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 8 - HARD PASSAGES
  {
    id: 'g8_hard_literature_2',
    title: 'The Paradox of Choice in Modern Society',
    passage: `In today's consumer-driven society, we are constantly told that having more choices is inherently better. Supermarket aisles overflow with dozens of cereal brands, streaming services offer thousands of movies, and career counselors encourage students to "keep their options open." Yet psychological research reveals a troubling paradox: while some choice is essential for well-being, too much choice can actually decrease satisfaction and increase anxiety. Psychologist Barry Schwartz coined the term "choice overload" to describe this phenomenon. When faced with an overwhelming array of options, people often experience decision paralysis, spending excessive time deliberating without reaching a conclusion. Even when they do choose, they frequently suffer from "buyer's remorse," wondering if they made the optimal decision. This anxiety is compounded by what researchers call the "opportunity cost" of choice—the nagging feeling that by selecting one option, we've missed out on potentially better alternatives. The proliferation of social media has intensified this problem by providing constant glimpses into the lives and choices of others, fostering a culture of comparison and FOMO (fear of missing out). Ironically, societies with fewer choices often report higher levels of life satisfaction. The key to navigating our choice-rich world may lie not in having unlimited options, but in learning to set boundaries, accept "good enough" decisions, and focus on what truly matters to our individual well-being.`,
    grade: '8',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 248,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g8_hard_literature_2_q1',
        content: 'What is the main paradox described in the passage?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Too much choice can decrease satisfaction despite being considered better', 'People don\'t want any choices at all', 'Choices are always bad for society', 'More choices always lead to happiness'],
        correctAnswer: 'Too much choice can decrease satisfaction despite being considered better',
        explanation: 'The passage explains the paradox: "while some choice is essential for well-being, too much choice can actually decrease satisfaction and increase anxiety."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'paradox', 'main idea'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_literature_2_q2',
        content: 'What does "opportunity cost" refer to in this context?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['The feeling of missing out on better alternatives', 'The actual price of making a choice', 'The time spent making decisions', 'The cost of having too many options'],
        correctAnswer: 'The feeling of missing out on better alternatives',
        explanation: 'The passage defines opportunity cost as "the nagging feeling that by selecting one option, we\'ve missed out on potentially better alternatives."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'vocabulary', 'concepts'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_literature_2_q3',
        content: 'According to the passage, what might be key to navigating a choice-rich world?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Setting boundaries and accepting "good enough" decisions', 'Always choosing the most expensive option', 'Avoiding all choices completely', 'Asking others to make all decisions'],
        correctAnswer: 'Setting boundaries and accepting "good enough" decisions',
        explanation: 'The passage concludes that the key "may lie not in having unlimited options, but in learning to set boundaries, accept \'good enough\' decisions, and focus on what truly matters."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['psychology', 'solutions', 'critical thinking'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g8_hard_science_7',
    title: 'CRISPR: The Gene-Editing Revolution',
    passage: `CRISPR-Cas9, often simply called CRISPR, represents one of the most significant scientific breakthroughs of the 21st century. This revolutionary gene-editing technology allows scientists to make precise changes to DNA with unprecedented accuracy and efficiency. The acronym CRISPR stands for "Clustered Regularly Interspaced Short Palindromic Repeats," referring to DNA sequences found in bacteria that serve as a primitive immune system. Scientists Jennifer Doudna and Emmanuelle Charpentier, who won the 2020 Nobel Prize in Chemistry for their work, discovered how to harness this bacterial defense mechanism as a powerful tool for genetic engineering. The CRISPR system works like molecular scissors, guided by a piece of RNA to find and cut specific DNA sequences. Once the DNA is cut, scientists can either remove problematic genes, insert new ones, or allow the cell's natural repair mechanisms to fix genetic defects. The potential applications are staggering: treating genetic diseases like sickle cell anemia and Huntington's disease, developing more nutritious crops, and even potentially eliminating malaria by modifying mosquito populations. However, this power comes with profound ethical questions. The ability to edit human embryos raises concerns about creating "designer babies" and exacerbating social inequalities. As CRISPR technology continues to advance, society must grapple with fundamental questions about the limits of human intervention in the genetic code that defines life itself.`,
    grade: '8',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 258,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g8_hard_science_7_q1',
        content: 'What does the acronym CRISPR stand for?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Clustered Regularly Interspaced Short Palindromic Repeats', 'Cellular Repair In Systematic Protein Reactions', 'Chemical Reactions In Scientific Protein Research', 'Controlled Regulation In Systematic Protein Repair'],
        correctAnswer: 'Clustered Regularly Interspaced Short Palindromic Repeats',
        explanation: 'The passage explicitly states "The acronym CRISPR stands for \'Clustered Regularly Interspaced Short Palindromic Repeats.\'"',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['science', 'vocabulary', 'acronyms'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_science_7_q2',
        content: 'Who won the 2020 Nobel Prize in Chemistry for CRISPR work?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Jennifer Doudna and Emmanuelle Charpentier', 'Watson and Crick', 'Marie and Pierre Curie', 'Einstein and Bohr'],
        correctAnswer: 'Jennifer Doudna and Emmanuelle Charpentier',
        explanation: 'The passage states "Scientists Jennifer Doudna and Emmanuelle Charpentier, who won the 2020 Nobel Prize in Chemistry for their work."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['science', 'history', 'recognition'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g8_hard_science_7_q3',
        content: 'What ethical concern is raised about CRISPR technology?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Creating "designer babies" and social inequalities', 'Making food too expensive', 'Causing environmental pollution', 'Reducing job opportunities'],
        correctAnswer: 'Creating "designer babies" and social inequalities',
        explanation: 'The passage mentions "The ability to edit human embryos raises concerns about creating \'designer babies\' and exacerbating social inequalities."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '8',
        tags: ['science', 'ethics', 'implications'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default grade7And8ReadingPassages;
