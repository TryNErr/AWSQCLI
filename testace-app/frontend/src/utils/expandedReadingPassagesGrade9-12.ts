import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';

/**
 * Expanded Reading Passages for Grades 9-12
 * College-preparatory level passages with sophisticated themes, advanced vocabulary,
 * and complex analytical thinking questions
 */

export const grade9To12ReadingPassages: ReadingPassage[] = [
  
  // GRADE 9 - HARD PASSAGES
  {
    id: 'g9_hard_literature_4',
    title: 'The Psychology of Social Media and Identity Formation',
    passage: `The ubiquity of social media platforms has fundamentally altered the landscape of adolescent identity formation, creating both unprecedented opportunities for self-expression and novel psychological challenges. Traditional developmental psychology posited that identity formation occurred primarily through face-to-face interactions within relatively stable social groups. However, the digital age has introduced a complex matrix of virtual identities, curated personas, and algorithmic feedback loops that profoundly influence how young people perceive themselves and their place in society. Social media platforms encourage users to present idealized versions of themselves, carefully selecting photos, crafting witty captions, and highlighting achievements while concealing struggles and imperfections. This curation process, while allowing for creative self-expression, can lead to what psychologists term "compare and despair" syndrome, where individuals constantly measure their authentic, unfiltered lives against others' highlight reels. The phenomenon is exacerbated by algorithmic systems that prioritize engagement over well-being, often amplifying content that generates strong emotional responses, including envy, anger, or inadequacy. Furthermore, the quantification of social approval through likes, shares, and comments transforms social validation into a measurable commodity, potentially creating addictive feedback loops that can undermine intrinsic self-worth. Research indicates that heavy social media use correlates with increased rates of anxiety, depression, and body dysmorphia among teenagers, particularly young women. However, these platforms also provide valuable spaces for marginalized communities to find support, for creative individuals to showcase their talents, and for socially isolated teens to maintain connections. The challenge for educators, parents, and policymakers lies in helping young people navigate this digital landscape mindfully, developing critical media literacy skills while harnessing the positive potential of these powerful communication tools.`,
    grade: '9',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 298,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g9_hard_literature_4_q1',
        content: 'What is "compare and despair" syndrome?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Measuring authentic life against others\' highlight reels', 'Being unable to use social media', 'Comparing different social media platforms', 'Feeling despair about technology'],
        correctAnswer: 'Measuring authentic life against others\' highlight reels',
        explanation: 'The passage defines this as when "individuals constantly measure their authentic, unfiltered lives against others\' highlight reels."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '9',
        tags: ['psychology', 'social media', 'mental health'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g9_hard_literature_4_q2',
        content: 'How do algorithmic systems potentially harm users according to the passage?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They prioritize engagement over well-being and amplify strong emotional responses', 'They make social media too expensive', 'They prevent users from posting content', 'They only show positive content'],
        correctAnswer: 'They prioritize engagement over well-being and amplify strong emotional responses',
        explanation: 'The passage states algorithms "prioritize engagement over well-being, often amplifying content that generates strong emotional responses, including envy, anger, or inadequacy."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '9',
        tags: ['technology', 'algorithms', 'psychology'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g9_hard_literature_4_q3',
        content: 'What positive aspects of social media does the passage acknowledge?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Support for marginalized communities, creative showcases, and social connections', 'Only entertainment value', 'Improved academic performance', 'Better physical health'],
        correctAnswer: 'Support for marginalized communities, creative showcases, and social connections',
        explanation: 'The passage mentions platforms "provide valuable spaces for marginalized communities to find support, for creative individuals to showcase their talents, and for socially isolated teens to maintain connections."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '9',
        tags: ['social media', 'benefits', 'community'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  {
    id: 'g9_hard_science_8',
    title: 'Climate Change and Ocean Acidification',
    passage: `While much public attention focuses on rising global temperatures and melting ice caps, one of the most insidious consequences of increased atmospheric carbon dioxide is ocean acidification, often called "the other CO2 problem." The world's oceans act as a massive carbon sink, absorbing approximately 30% of human-produced carbon dioxide emissions. When CO2 dissolves in seawater, it forms carbonic acid, which lowers the ocean's pH level. Since the Industrial Revolution, ocean pH has dropped from 8.2 to 8.1—a seemingly small change that actually represents a 30% increase in acidity due to the logarithmic nature of the pH scale. This acidification process has profound implications for marine ecosystems, particularly organisms that build shells or skeletons from calcium carbonate, such as corals, mollusks, and certain plankton species. As seawater becomes more acidic, it becomes increasingly difficult for these organisms to extract the carbonate ions necessary for shell and skeleton formation. Existing shells may even begin to dissolve in highly acidic conditions. Coral reefs, often called the "rainforests of the sea" due to their incredible biodiversity, are especially vulnerable. Acidification weakens coral skeletons and impairs their ability to recover from bleaching events caused by rising water temperatures. The collapse of coral ecosystems would have cascading effects throughout marine food webs, potentially devastating fish populations that billions of people depend on for protein. Furthermore, the microscopic organisms at the base of marine food chains—including pteropods and coccolithophores—are showing signs of shell dissolution in increasingly acidic waters. The economic implications are staggering: the global shellfish industry, worth billions of dollars annually, faces an uncertain future as oysters, mussels, and other commercially important species struggle to build and maintain their protective shells in changing ocean chemistry.`,
    grade: '9',
    difficulty: DifficultyLevel.HARD,
    genre: 'science',
    wordCount: 318,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g9_hard_science_8_q1',
        content: 'Why is ocean acidification called "the other CO2 problem"?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It\'s a major consequence of CO2 emissions that receives less attention than global warming', 'It only affects CO2 levels in the ocean', 'It\'s the second most important environmental issue', 'It\'s caused by a different type of CO2'],
        correctAnswer: 'It\'s a major consequence of CO2 emissions that receives less attention than global warming',
        explanation: 'The passage introduces it as "the other CO2 problem" while noting that "much public attention focuses on rising global temperatures," implying this issue gets less attention despite being equally serious.',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '9',
        tags: ['climate change', 'ocean science', 'environmental issues'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g9_hard_science_8_q2',
        content: 'What does a pH drop from 8.2 to 8.1 represent in terms of acidity increase?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['30% increase', '10% increase', '1% increase', '50% increase'],
        correctAnswer: '30% increase',
        explanation: 'The passage states "ocean pH has dropped from 8.2 to 8.1—a seemingly small change that actually represents a 30% increase in acidity due to the logarithmic nature of the pH scale."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '9',
        tags: ['chemistry', 'pH scale', 'mathematics'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g9_hard_science_8_q3',
        content: 'Why are coral reefs particularly vulnerable to ocean acidification?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Acidification weakens coral skeletons and impairs recovery from bleaching', 'Corals can only live in very deep water', 'Corals don\'t need calcium carbonate', 'Acidification makes water too cold for corals'],
        correctAnswer: 'Acidification weakens coral skeletons and impairs recovery from bleaching',
        explanation: 'The passage explains "Acidification weakens coral skeletons and impairs their ability to recover from bleaching events caused by rising water temperatures."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '9',
        tags: ['marine biology', 'coral reefs', 'ecosystem impacts'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 10 - HARD PASSAGES
  {
    id: 'g10_hard_history_4',
    title: 'The Silk Road: Ancient Globalization',
    passage: `Long before the term "globalization" entered common parlance, an intricate network of trade routes known as the Silk Road facilitated unprecedented cultural, technological, and economic exchange across Eurasia for over 1,400 years. Stretching approximately 4,000 miles from Chang'an (modern-day Xi'an) in China to Constantinople (Istanbul) and Mediterranean ports, this network was never a single road but rather a complex web of interconnected routes that adapted to political upheavals, geographical challenges, and economic opportunities. The Silk Road's significance extended far beyond the luxury goods that gave it its name. While Chinese silk, Indian spices, and Central Asian horses were indeed valuable commodities, the routes served as conduits for revolutionary innovations that would reshape civilizations. Paper-making technology traveled westward from China, eventually reaching Europe and transforming literacy and record-keeping. Mathematical concepts, including the decimal system and algebra, flowed along these routes, as did astronomical knowledge and medical practices. Religious ideas also traversed these paths: Buddhism spread from India to China and beyond, while Islam expanded eastward, creating syncretic traditions that blended local customs with new spiritual practices. The Silk Road fostered the development of cosmopolitan cities like Samarkand, Bukhara, and Kashgar, where merchants, scholars, and artisans from diverse cultures interacted, creating vibrant multicultural societies. These urban centers became laboratories of innovation, where different traditions merged to produce new art forms, architectural styles, and intellectual movements. The network's decline began in the 15th century due to several factors: the rise of maritime trade routes that bypassed overland passages, the fragmentation of the Mongol Empire that had provided political stability, and the Ottoman Empire's control over traditional routes, which motivated European powers to seek alternative paths to Asian markets. This search for new routes ultimately led to the Age of Exploration and the "discovery" of the Americas, demonstrating how the Silk Road's legacy continued to shape world history even after its decline.`,
    grade: '10',
    difficulty: DifficultyLevel.HARD,
    genre: 'history',
    wordCount: 348,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g10_hard_history_4_q1',
        content: 'What does the passage suggest about the nature of the Silk Road?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['It was a complex web of interconnected routes, not a single road', 'It was one continuous highway', 'It only connected China and Europe', 'It was primarily used for military purposes'],
        correctAnswer: 'It was a complex web of interconnected routes, not a single road',
        explanation: 'The passage states "this network was never a single road but rather a complex web of interconnected routes that adapted to political upheavals, geographical challenges, and economic opportunities."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['history', 'trade', 'geography'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_history_4_q2',
        content: 'According to the passage, what made cities like Samarkand and Bukhara significant?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['They became laboratories of innovation where diverse cultures merged', 'They were the largest cities in the world', 'They controlled all trade routes', 'They were military strongholds'],
        correctAnswer: 'They became laboratories of innovation where diverse cultures merged',
        explanation: 'The passage describes these cities as "laboratories of innovation, where different traditions merged to produce new art forms, architectural styles, and intellectual movements."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['history', 'cultural exchange', 'cities'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g10_hard_history_4_q3',
        content: 'What factors contributed to the Silk Road\'s decline in the 15th century?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Maritime trade routes, Mongol Empire fragmentation, and Ottoman control', 'Natural disasters and climate change', 'Lack of valuable goods to trade', 'Wars between China and Europe'],
        correctAnswer: 'Maritime trade routes, Mongol Empire fragmentation, and Ottoman control',
        explanation: 'The passage lists "the rise of maritime trade routes that bypassed overland passages, the fragmentation of the Mongol Empire that had provided political stability, and the Ottoman Empire\'s control over traditional routes" as causes of decline.',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '10',
        tags: ['history', 'cause and effect', 'decline'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 11 - HARD PASSAGES
  {
    id: 'g11_hard_literature_5',
    title: 'The Philosophy of Artificial Intelligence and Consciousness',
    passage: `As artificial intelligence systems become increasingly sophisticated, humanity faces profound philosophical questions that challenge our fundamental understanding of consciousness, intelligence, and what it means to be human. The rapid advancement of machine learning algorithms, particularly large language models and neural networks, has produced systems capable of generating human-like text, solving complex problems, and even displaying what appears to be creativity. This progress has reignited ancient philosophical debates about the nature of mind and consciousness, forcing us to confront questions that have puzzled thinkers for millennia. The Chinese Room argument, proposed by philosopher John Searle in 1980, illustrates the central paradox of AI consciousness. Searle imagined a person in a room who receives Chinese characters through a slot, consults a comprehensive rule book to determine the appropriate response, and sends back Chinese characters without understanding their meaning. From the outside, this system appears to understand Chinese perfectly, yet the person inside comprehends nothing. Searle argued that this demonstrates how computers can simulate understanding without genuine comprehension—they manipulate symbols according to rules but lack true semantic understanding. Critics of Searle's argument contend that consciousness might emerge from sufficiently complex information processing, regardless of the substrate. They argue that if an AI system can respond appropriately to any situation, demonstrate learning and adaptation, and exhibit consistent behavioral patterns indistinguishable from conscious beings, then the question of "genuine" consciousness becomes meaningless. This perspective, known as functionalism, suggests that consciousness is defined by what it does rather than what it is made of. The implications of these debates extend far beyond academic philosophy. If AI systems achieve consciousness, they would presumably deserve moral consideration, rights, and protections. How would society determine when an AI has crossed this threshold? What ethical obligations would we have toward conscious machines? Furthermore, the development of artificial consciousness might fundamentally alter human self-perception, potentially diminishing the uniqueness we attribute to human experience and cognition. As we stand on the precipice of potentially creating artificial minds, these questions demand urgent consideration, for the answers will shape not only the future of technology but the very essence of what we consider to be conscious, intelligent life.`,
    grade: '11',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 378,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g11_hard_literature_5_q1',
        content: 'What is the main point of Searle\'s Chinese Room argument?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Computers can simulate understanding without genuine comprehension', 'Chinese is impossible for computers to understand', 'Rooms can become conscious', 'All AI systems are conscious'],
        correctAnswer: 'Computers can simulate understanding without genuine comprehension',
        explanation: 'The passage explains that Searle\'s argument demonstrates "how computers can simulate understanding without genuine comprehension—they manipulate symbols according to rules but lack true semantic understanding."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['philosophy', 'artificial intelligence', 'consciousness'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g11_hard_literature_5_q2',
        content: 'What is functionalism\'s perspective on consciousness?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Consciousness is defined by what it does rather than what it\'s made of', 'Only biological beings can be conscious', 'Consciousness requires a physical brain', 'Consciousness is impossible to define'],
        correctAnswer: 'Consciousness is defined by what it does rather than what it\'s made of',
        explanation: 'The passage states that functionalism "suggests that consciousness is defined by what it does rather than what it is made of."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['philosophy', 'functionalism', 'consciousness'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g11_hard_literature_5_q3',
        content: 'What ethical implications does the passage suggest if AI achieves consciousness?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['AI systems would deserve moral consideration, rights, and protections', 'AI would become dangerous to humans', 'AI would replace all human workers', 'AI would solve all ethical problems'],
        correctAnswer: 'AI systems would deserve moral consideration, rights, and protections',
        explanation: 'The passage states "If AI systems achieve consciousness, they would presumably deserve moral consideration, rights, and protections."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '11',
        tags: ['ethics', 'artificial intelligence', 'rights'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // GRADE 12 - HARD PASSAGES
  {
    id: 'g12_hard_literature_6',
    title: 'The Economics of Inequality in the 21st Century',
    passage: `The dramatic increase in economic inequality over the past four decades represents one of the most significant socioeconomic transformations of the modern era, with implications that extend far beyond mere statistics to fundamentally reshape political systems, social cohesion, and democratic governance itself. French economist Thomas Piketty's seminal work "Capital in the Twenty-First Century" demonstrated that when the rate of return on capital exceeds economic growth rates (r > g), wealth becomes increasingly concentrated among those who already possess significant assets. This mathematical relationship, which Piketty argues has been the historical norm except during periods of major disruption like world wars, suggests that extreme inequality is not an aberration but rather the natural tendency of capitalist systems in the absence of deliberate intervention. The mechanisms driving contemporary inequality are multifaceted and interconnected. Technological advancement, while generating tremendous aggregate wealth, has disproportionately benefited those with the skills, education, and capital to leverage new innovations, while simultaneously displacing workers in routine cognitive and manual tasks. Globalization has created a worldwide labor market that has lifted millions out of poverty in developing nations while simultaneously pressuring wages for middle-class workers in developed countries who now compete with lower-cost international labor. Financial deregulation and the growth of complex financial instruments have enabled unprecedented capital accumulation among financial elites while increasing systemic risk for the broader economy. Perhaps most concerning is the self-reinforcing nature of extreme inequality. Wealthy individuals and families can invest in superior education for their children, purchase political influence through campaign contributions and lobbying, and access exclusive networks that perpetuate advantage across generations. Meanwhile, those with limited resources face barriers to social mobility including inadequate educational opportunities, limited access to capital for entrepreneurship, and the psychological stress of economic insecurity that can impair cognitive function and decision-making. The political ramifications of extreme inequality are becoming increasingly apparent in democratic societies worldwide. As economic power concentrates, political power follows, potentially undermining the principle of equal representation that forms the foundation of democratic governance. Research suggests that extreme inequality correlates with political polarization, social unrest, and the erosion of trust in institutions—trends that threaten the stability of democratic systems. Addressing these challenges requires comprehensive policy responses that may include progressive taxation, investment in education and infrastructure, strengthening of social safety nets, and reforms to campaign finance and lobbying regulations. However, implementing such measures faces significant political obstacles, as those who benefit most from current arrangements possess disproportionate influence over policy-making processes.`,
    grade: '12',
    difficulty: DifficultyLevel.HARD,
    genre: 'non-fiction',
    wordCount: 428,
    readingLevel: 'college_prep',
    questions: [
      {
        _id: 'g12_hard_literature_6_q1',
        content: 'What does Piketty\'s formula r > g represent?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['When return on capital exceeds economic growth, wealth concentrates among asset owners', 'When growth exceeds returns, inequality decreases', 'A mathematical error in economic theory', 'The relationship between risk and reward'],
        correctAnswer: 'When return on capital exceeds economic growth, wealth concentrates among asset owners',
        explanation: 'The passage explains that "when the rate of return on capital exceeds economic growth rates (r > g), wealth becomes increasingly concentrated among those who already possess significant assets."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '12',
        tags: ['economics', 'inequality', 'theory'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g12_hard_literature_6_q2',
        content: 'According to the passage, why is extreme inequality self-reinforcing?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Wealthy families can invest in education, political influence, and exclusive networks', 'Poor people don\'t work hard enough', 'Government policies always favor the wealthy', 'Technology only benefits rich people'],
        correctAnswer: 'Wealthy families can invest in education, political influence, and exclusive networks',
        explanation: 'The passage states that "Wealthy individuals and families can invest in superior education for their children, purchase political influence through campaign contributions and lobbying, and access exclusive networks that perpetuate advantage across generations."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '12',
        tags: ['economics', 'social mobility', 'inequality'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'g12_hard_literature_6_q3',
        content: 'What political consequences of extreme inequality does the passage identify?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Political polarization, social unrest, and erosion of trust in institutions', 'Improved democratic participation', 'Better government efficiency', 'Increased international cooperation'],
        correctAnswer: 'Political polarization, social unrest, and erosion of trust in institutions',
        explanation: 'The passage states that "extreme inequality correlates with political polarization, social unrest, and the erosion of trust in institutions—trends that threaten the stability of democratic systems."',
        subject: 'Reading',
        topic: 'Reading Comprehension',
        difficulty: DifficultyLevel.HARD,
        grade: '12',
        tags: ['politics', 'democracy', 'social consequences'],
        createdBy: 'expanded-system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export default grade9To12ReadingPassages;
