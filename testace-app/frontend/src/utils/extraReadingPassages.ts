import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Extra Reading Passages to Reach 200+ Questions Target
 * High-quality passages with 5 questions each across all grades
 */

export const extraReadingPassages: ReadingPassage[] = [
  
  // GRADE 2 PASSAGES
  {
    id: 'g2_medium_extra_1',
    title: 'The Helpful Dolphin',
    passage: `Dolphins are some of the smartest animals in the ocean. They live in groups called pods and help each other find food and stay safe. Dolphins can jump high out of the water and do flips in the air. They make clicking sounds to talk to each other and to find fish in the dark water. Sometimes dolphins help people who are lost at sea. They swim around the person and make noise to get help. Dolphins have smooth skin and a long nose called a snout. Baby dolphins stay close to their mothers for two years to learn how to hunt and survive.`,
    grade: '2',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'science',
    wordCount: 98,
    readingLevel: 'developing_reader',
    questions: [
      {
        _id: 'g2_medium_extra_1_q1',
        content: 'What are groups of dolphins called?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Pods', 'Herds', 'Flocks', 'Packs'],
        correctAnswer: 'Pods',
        explanation: 'The passage states "They live in groups called pods."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['animals', 'vocabulary', 'groups'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_medium_extra_1_q2',
        content: 'How do dolphins communicate?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They make clicking sounds', 'They wave their fins', 'They change colors', 'They splash water'],
        correctAnswer: 'They make clicking sounds',
        explanation: 'The passage explains "They make clicking sounds to talk to each other."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['animals', 'communication', 'behavior'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_medium_extra_1_q3',
        content: 'What is a dolphin\'s long nose called?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A snout', 'A beak', 'A trunk', 'A horn'],
        correctAnswer: 'A snout',
        explanation: 'The passage states "They have smooth skin and a long nose called a snout."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['animals', 'anatomy', 'vocabulary'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_medium_extra_1_q4',
        content: 'How long do baby dolphins stay with their mothers?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Two years', 'One year', 'Six months', 'Three years'],
        correctAnswer: 'Two years',
        explanation: 'The passage says "Baby dolphins stay close to their mothers for two years."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['animals', 'family', 'time'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g2_medium_extra_1_q5',
        content: 'How do dolphins sometimes help people?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They swim around lost people and make noise to get help', 'They give people rides', 'They bring people food', 'They teach people to swim'],
        correctAnswer: 'They swim around lost people and make noise to get help',
        explanation: 'The passage explains "Sometimes dolphins help people who are lost at sea. They swim around the person and make noise to get help."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '2',
        tags: ['animals', 'helping', 'rescue'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 4 PASSAGES
  {
    id: 'g4_medium_extra_1',
    title: 'The Ancient Library of Alexandria',
    passage: `The Library of Alexandria was one of the most famous libraries in the ancient world. Built in Egypt over 2,000 years ago, it was designed to collect all human knowledge. Scholars from many countries came to study there, bringing books and scrolls from their homelands. The library contained hundreds of thousands of scrolls on subjects like mathematics, astronomy, medicine, and literature. It was part of a larger institution called the Museum, which was like a university where great thinkers lived and worked. Unfortunately, the library was gradually destroyed over many centuries due to wars, fires, and neglect. Some of the world's greatest knowledge was lost forever. Today, a new Library of Alexandria has been built in the same Egyptian city to honor the memory of the ancient library and continue its mission of preserving knowledge.`,
    grade: '4',
    difficulty: DifficultyLevel.MEDIUM,
    genre: 'history',
    wordCount: 148,
    readingLevel: 'fluent_reader',
    questions: [
      {
        _id: 'g4_medium_extra_1_q1',
        content: 'Where was the Library of Alexandria built?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Egypt', 'Greece', 'Rome', 'Babylon'],
        correctAnswer: 'Egypt',
        explanation: 'The passage states "Built in Egypt over 2,000 years ago."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['history', 'geography', 'ancient world'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_medium_extra_1_q2',
        content: 'What was the library\'s main purpose?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['To collect all human knowledge', 'To store only Egyptian books', 'To teach children to read', 'To preserve religious texts'],
        correctAnswer: 'To collect all human knowledge',
        explanation: 'The passage explains "it was designed to collect all human knowledge."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['history', 'purpose', 'knowledge'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_medium_extra_1_q3',
        content: 'What was the Museum?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A university where great thinkers lived and worked', 'A place to display artifacts', 'A temple for worship', 'A marketplace for books'],
        correctAnswer: 'A university where great thinkers lived and worked',
        explanation: 'The passage describes the Museum as "like a university where great thinkers lived and worked."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['history', 'education', 'institutions'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_medium_extra_1_q4',
        content: 'What caused the library\'s destruction?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Wars, fires, and neglect', 'Only earthquakes', 'Only floods', 'Only theft'],
        correctAnswer: 'Wars, fires, and neglect',
        explanation: 'The passage states "the library was gradually destroyed over many centuries due to wars, fires, and neglect."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['history', 'destruction', 'causes'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g4_medium_extra_1_q5',
        content: 'What has been built in modern times?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A new Library of Alexandria', 'A museum about ancient Egypt', 'A school for historians', 'A monument to scholars'],
        correctAnswer: 'A new Library of Alexandria',
        explanation: 'The passage concludes "Today, a new Library of Alexandria has been built in the same Egyptian city."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.MEDIUM,
        grade: '4',
        tags: ['history', 'modern times', 'preservation'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 6 PASSAGES
  {
    id: 'g6_hard_extra_1',
    title: 'The Science of Sleep',
    passage: `Sleep is one of the most important activities for human health, yet scientists are still discovering exactly why we need it. During sleep, our brains go through different stages, including REM (Rapid Eye Movement) sleep, when most dreaming occurs. While we sleep, our brains consolidate memories, moving important information from short-term to long-term storage. Sleep also allows our bodies to repair tissues, release growth hormones, and strengthen our immune systems. Most teenagers need about 9 hours of sleep per night, but many get much less due to homework, activities, and electronic devices. Lack of sleep can affect concentration, mood, and academic performance. It can also weaken the immune system, making people more likely to get sick. Sleep researchers have found that the blue light from phones and computers can interfere with natural sleep patterns by suppressing melatonin, a hormone that helps us feel sleepy. Creating good sleep habits, like keeping a regular bedtime and avoiding screens before sleep, can significantly improve both physical and mental health.`,
    grade: '6',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 188,
    readingLevel: 'advanced_reader',
    questions: [
      {
        _id: 'g6_hard_extra_1_q1',
        content: 'What happens to memories during sleep?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They are consolidated and moved to long-term storage', 'They are completely erased', 'They become confused', 'They are only stored temporarily'],
        correctAnswer: 'They are consolidated and moved to long-term storage',
        explanation: 'The passage explains "our brains consolidate memories, moving important information from short-term to long-term storage."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'memory', 'brain function'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_extra_1_q2',
        content: 'How much sleep do most teenagers need?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['About 9 hours per night', 'About 6 hours per night', 'About 12 hours per night', 'About 7 hours per night'],
        correctAnswer: 'About 9 hours per night',
        explanation: 'The passage states "Most teenagers need about 9 hours of sleep per night."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'health', 'teenagers'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_extra_1_q3',
        content: 'What is melatonin?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A hormone that helps us feel sleepy', 'A type of blue light', 'A sleep disorder', 'A brain wave'],
        correctAnswer: 'A hormone that helps us feel sleepy',
        explanation: 'The passage describes melatonin as "a hormone that helps us feel sleepy."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'hormones', 'sleep'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_extra_1_q4',
        content: 'How does blue light from screens affect sleep?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It suppresses melatonin and interferes with sleep patterns', 'It helps people fall asleep faster', 'It has no effect on sleep', 'It only affects adults'],
        correctAnswer: 'It suppresses melatonin and interferes with sleep patterns',
        explanation: 'The passage explains that blue light "can interfere with natural sleep patterns by suppressing melatonin."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'technology', 'sleep disruption'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g6_hard_extra_1_q5',
        content: 'What are some consequences of lack of sleep?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Affected concentration, mood, academic performance, and weakened immune system', 'Only feeling tired', 'Better academic performance', 'Increased energy'],
        correctAnswer: 'Affected concentration, mood, academic performance, and weakened immune system',
        explanation: 'The passage lists multiple effects: "Lack of sleep can affect concentration, mood, and academic performance. It can also weaken the immune system."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '6',
        tags: ['science', 'health consequences', 'sleep deprivation'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 10 PASSAGES
  {
    id: 'g10_hard_extra_1',
    title: 'The Impact of Social Media on Democracy',
    passage: `The rise of social media platforms has fundamentally altered the landscape of democratic discourse, creating both opportunities for greater civic engagement and serious challenges to informed decision-making. On one hand, these platforms have democratized information sharing, allowing ordinary citizens to participate in political conversations, organize grassroots movements, and hold leaders accountable in ways previously impossible. Social media has enabled rapid mobilization of social movements, from the Arab Spring to climate activism, giving voice to marginalized communities and facilitating global awareness of local issues. However, the same technologies that empower democratic participation also create vulnerabilities that can undermine democratic institutions. The algorithmic curation of content creates "echo chambers" where users primarily encounter information that confirms their existing beliefs, leading to increased political polarization. The speed and scale of social media also make it an ideal vehicle for disinformation campaigns, where false or misleading information can spread faster than fact-checkers can respond. Foreign actors have exploited these vulnerabilities to interfere in elections and sow discord in democratic societies. Additionally, the concentration of power in the hands of a few tech companies raises questions about who controls the flow of information in democratic societies. As democracies grapple with these challenges, they must find ways to preserve the benefits of digital connectivity while protecting the integrity of democratic processes and institutions.`,
    grade: '10',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 248,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g10_hard_extra_1_q1',
        content: 'How has social media democratized information sharing?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It allows ordinary citizens to participate in political conversations and organize movements', 'It only benefits politicians', 'It restricts access to information', 'It eliminates the need for traditional media'],
        correctAnswer: 'It allows ordinary citizens to participate in political conversations and organize movements',
        explanation: 'The passage explains that social media has "democratized information sharing, allowing ordinary citizens to participate in political conversations, organize grassroots movements, and hold leaders accountable."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['politics', 'social media', 'democracy'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_extra_1_q2',
        content: 'What are "echo chambers" in the context of social media?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Spaces where users encounter information that confirms existing beliefs', 'Loud social media posts', 'Private messaging systems', 'Audio-only social platforms'],
        correctAnswer: 'Spaces where users encounter information that confirms existing beliefs',
        explanation: 'The passage defines echo chambers as places "where users primarily encounter information that confirms their existing beliefs."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['social media', 'psychology', 'information'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_extra_1_q3',
        content: 'Why is social media ideal for disinformation campaigns?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['False information can spread faster than fact-checkers can respond', 'It\'s too expensive for fact-checkers', 'People don\'t read social media', 'It only reaches small audiences'],
        correctAnswer: 'False information can spread faster than fact-checkers can respond',
        explanation: 'The passage states "The speed and scale of social media also make it an ideal vehicle for disinformation campaigns, where false or misleading information can spread faster than fact-checkers can respond."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['social media', 'misinformation', 'speed'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_extra_1_q4',
        content: 'What concern does the passage raise about tech companies?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['The concentration of power in controlling information flow', 'They don\'t make enough profit', 'They hire too many employees', 'They don\'t innovate enough'],
        correctAnswer: 'The concentration of power in controlling information flow',
        explanation: 'The passage mentions "the concentration of power in the hands of a few tech companies raises questions about who controls the flow of information in democratic societies."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['technology', 'power', 'democracy'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_extra_1_q5',
        content: 'What challenge do democracies face regarding social media?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Preserving benefits while protecting democratic integrity', 'Banning all social media platforms', 'Making social media more expensive', 'Reducing internet access'],
        correctAnswer: 'Preserving benefits while protecting democratic integrity',
        explanation: 'The passage concludes that democracies "must find ways to preserve the benefits of digital connectivity while protecting the integrity of democratic processes and institutions."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['democracy', 'balance', 'challenges'],
        createdBy: 'extra-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default extraReadingPassages;
