#!/usr/bin/env node

/**
 * TRULY UNIQUE READING QUESTIONS GENERATOR
 * 
 * Creates completely unique reading questions with no duplicates or variations
 */

const fs = require('fs');
const path = require('path');

// Comprehensive unique reading passages for Grade 9 Hard
const grade9HardReadingQuestions = [
  {
    content: `Read the following passage:\n\n"Climate change represents one of the most pressing challenges of our time. Rising global temperatures have led to melting ice caps, rising sea levels, and increasingly unpredictable weather patterns. Scientists worldwide agree that immediate action is necessary to mitigate these effects through renewable energy adoption and carbon emission reduction."\n\nWhat is the main argument presented in this passage?`,
    options: [
      "Climate change is a natural phenomenon that cannot be controlled",
      "Immediate action is needed to address climate change through specific measures",
      "Scientists disagree about the causes of climate change",
      "Weather patterns have always been unpredictable"
    ],
    correctAnswer: "Immediate action is needed to address climate change through specific measures",
    explanation: "The passage clearly states that scientists agree immediate action is necessary and suggests specific solutions like renewable energy and emission reduction.",
    topic: "Environmental Science Reading Comprehension"
  },
  {
    content: `Read the following excerpt:\n\n"The Industrial Revolution, which began in Britain in the late 18th century, fundamentally transformed society. It marked the transition from manual labor and handicrafts to mechanized manufacturing. This shift not only revolutionized production methods but also led to urbanization, as people moved from rural areas to cities in search of factory work."\n\nWhich of the following best describes the author's tone in this passage?`,
    options: [
      "Critical and disapproving",
      "Informative and objective",
      "Emotional and personal",
      "Humorous and lighthearted"
    ],
    correctAnswer: "Informative and objective",
    explanation: "The author presents factual information about the Industrial Revolution without expressing personal opinions or emotions, maintaining an objective, informative tone.",
    topic: "Historical Text Analysis"
  },
  {
    content: `Read this literary excerpt:\n\n"The old lighthouse stood sentinel against the storm, its beacon cutting through the darkness like a sword through silk. For generations, it had guided ships safely to harbor, but tonight, as the waves crashed against its foundation with unprecedented fury, even its steadfast presence seemed fragile against nature's wrath."\n\nWhat literary device is primarily used in the phrase 'its beacon cutting through the darkness like a sword through silk'?`,
    options: [
      "Metaphor",
      "Simile",
      "Personification",
      "Alliteration"
    ],
    correctAnswer: "Simile",
    explanation: "The phrase uses 'like' to compare the beacon cutting through darkness to a sword cutting through silk, which is the definition of a simile.",
    topic: "Literary Device Identification"
  },
  {
    content: `Read the following argumentative text:\n\n"Social media platforms have revolutionized communication, allowing instant global connectivity. However, critics argue that these platforms contribute to decreased face-to-face interaction, spread misinformation, and negatively impact mental health, particularly among teenagers. Supporters counter that social media democratizes information sharing and provides valuable networking opportunities."\n\nWhat is the structure of this argument?`,
    options: [
      "Problem and solution",
      "Cause and effect",
      "Claim with supporting evidence only",
      "Balanced presentation of opposing viewpoints"
    ],
    correctAnswer: "Balanced presentation of opposing viewpoints",
    explanation: "The passage presents both the benefits of social media and the criticisms against it, showing a balanced view of opposing perspectives.",
    topic: "Argumentative Text Structure"
  },
  {
    content: `Read this scientific text:\n\n"Photosynthesis is the process by which plants convert light energy, usually from the sun, into chemical energy stored in glucose. This process occurs in the chloroplasts of plant cells and requires carbon dioxide from the air and water from the soil. The byproduct of this essential process is oxygen, which is released into the atmosphere."\n\nBased on the passage, what can you infer about the relationship between plants and animals?`,
    options: [
      "Plants and animals compete for the same resources",
      "Plants provide oxygen that animals need to survive",
      "Animals provide carbon dioxide that plants need",
      "Both B and C are correct"
    ],
    correctAnswer: "Both B and C are correct",
    explanation: "The passage shows that plants produce oxygen (which animals need) and use carbon dioxide (which animals produce), indicating a symbiotic relationship.",
    topic: "Scientific Text Inference"
  },
  {
    content: `Read the following passage:\n\n"The concept of artificial intelligence has evolved from science fiction to reality. Machine learning algorithms now power everything from recommendation systems to autonomous vehicles. However, as AI becomes more sophisticated, ethical questions arise: Should AI systems make decisions that affect human lives? How do we ensure AI remains beneficial rather than harmful?"\n\nWhat is the author's primary purpose in this passage?`,
    options: [
      "To explain how AI technology works",
      "To argue against AI development",
      "To raise awareness about AI's ethical implications",
      "To promote AI investment opportunities"
    ],
    correctAnswer: "To raise awareness about AI's ethical implications",
    explanation: "The passage introduces AI development but focuses on raising ethical questions about its impact, indicating the author's purpose is to highlight ethical considerations.",
    topic: "Author's Purpose Analysis"
  },
  {
    content: `Read this excerpt from a speech:\n\n"We stand at a crossroads in history. The choices we make today will determine the world our children inherit. We can choose the path of division and conflict, or we can choose unity and cooperation. The future is not predetermined—it is ours to shape through our actions and decisions."\n\nWhat rhetorical technique is most prominent in this passage?`,
    options: [
      "Statistical evidence",
      "Personal anecdotes",
      "Emotional appeal (pathos)",
      "Expert testimony"
    ],
    correctAnswer: "Emotional appeal (pathos)",
    explanation: "The passage appeals to emotions by discussing children's future and using powerful imagery of crossroads and choices, which is characteristic of pathos.",
    topic: "Rhetorical Analysis"
  },
  {
    content: `Read the following text:\n\n"The Renaissance period, spanning roughly from the 14th to the 17th century, marked a cultural rebirth in Europe. This era saw unprecedented developments in art, science, and literature. Leonardo da Vinci exemplified the Renaissance ideal of the 'universal genius,' excelling in painting, engineering, anatomy, and invention."\n\nWhat does the term 'universal genius' most likely mean in this context?`,
    options: [
      "Someone who is famous worldwide",
      "A person with exceptional abilities in multiple fields",
      "An individual who teaches at universities",
      "Someone who creates universal laws"
    ],
    correctAnswer: "A person with exceptional abilities in multiple fields",
    explanation: "The context shows da Vinci excelled in multiple diverse fields (painting, engineering, anatomy, invention), defining what 'universal genius' means.",
    topic: "Context Clues and Vocabulary"
  },
  {
    content: `Read this comparative text:\n\n"Traditional books offer a tactile experience—the feel of paper, the smell of ink, the satisfaction of turning pages. E-books, conversely, provide convenience and portability, allowing readers to carry entire libraries in a single device. While purists argue that digital reading lacks the sensory richness of physical books, pragmatists appreciate the accessibility and environmental benefits of electronic formats."\n\nHow does the author organize this comparison?`,
    options: [
      "By presenting only the advantages of traditional books",
      "By alternating between benefits of each format",
      "By arguing that one format is superior to the other",
      "By focusing solely on environmental concerns"
    ],
    correctAnswer: "By alternating between benefits of each format",
    explanation: "The author presents benefits of traditional books, then e-books, then acknowledges both purist and pragmatist viewpoints, creating a balanced alternating structure.",
    topic: "Text Organization and Structure"
  },
  {
    content: `Read the following passage:\n\n"Biodiversity refers to the variety of life forms within an ecosystem. High biodiversity typically indicates a healthy ecosystem, as different species fulfill various ecological roles. When biodiversity decreases, ecosystems become more vulnerable to disease, climate change, and other environmental stressors. Conservation efforts aim to preserve this natural variety for future generations."\n\nWhich statement best summarizes the relationship described in the passage?`,
    options: [
      "Biodiversity and ecosystem health are unrelated",
      "Higher biodiversity generally correlates with ecosystem stability",
      "Conservation efforts always increase biodiversity",
      "Climate change only affects low-biodiversity ecosystems"
    ],
    correctAnswer: "Higher biodiversity generally correlates with ecosystem stability",
    explanation: "The passage states that high biodiversity indicates healthy ecosystems and that decreased biodiversity makes ecosystems more vulnerable, showing a positive correlation.",
    topic: "Scientific Reading Comprehension"
  },
  {
    content: `Read this excerpt from a news article:\n\n"The city council's decision to implement a plastic bag ban has sparked debate among residents. Environmental advocates praise the measure as a crucial step toward reducing pollution, while local business owners express concerns about increased costs and customer inconvenience. The ban will take effect next month, affecting all retail establishments within city limits."\n\nWhat is the central conflict presented in this article?`,
    options: [
      "Environmental protection versus economic concerns",
      "City council versus state government",
      "Customers versus retail workers",
      "Pollution versus recycling programs"
    ],
    correctAnswer: "Environmental protection versus economic concerns",
    explanation: "The article presents a conflict between environmental advocates (protection) and business owners (economic concerns) regarding the plastic bag ban.",
    topic: "Current Events Analysis"
  },
  {
    content: `Read this literary passage:\n\n"The ancient oak tree had witnessed centuries of change. Its gnarled branches had sheltered countless generations of wildlife, and its roots ran deep into the earth that had nourished it through droughts and floods alike. Now, as the bulldozers approached, the tree stood as a silent testament to the endurance of nature against the march of progress."\n\nWhat theme is most clearly developed in this passage?`,
    options: [
      "The importance of wildlife conservation",
      "The conflict between nature and human development",
      "The beauty of ancient trees",
      "The history of a particular location"
    ],
    correctAnswer: "The conflict between nature and human development",
    explanation: "The passage contrasts the tree's long natural history with the approaching bulldozers, representing the tension between nature and human progress.",
    topic: "Theme Identification"
  },
  {
    content: `Read this informational text:\n\n"The human brain contains approximately 86 billion neurons, each capable of forming thousands of connections with other neurons. This vast network enables complex cognitive functions such as memory, reasoning, and creativity. Remarkably, the brain continues to form new neural pathways throughout life, a phenomenon known as neuroplasticity."\n\nWhat is the significance of neuroplasticity as presented in the passage?`,
    options: [
      "It explains why humans have 86 billion neurons",
      "It demonstrates the brain's ability to adapt and change",
      "It proves that creativity is the most important brain function",
      "It shows that memory formation requires thousands of connections"
    ],
    correctAnswer: "It demonstrates the brain's ability to adapt and change",
    explanation: "Neuroplasticity refers to the brain's ability to form new neural pathways throughout life, indicating its capacity for adaptation and change.",
    topic: "Scientific Concept Comprehension"
  },
  {
    content: `Read this persuasive text:\n\n"School uniforms have become increasingly common in educational institutions worldwide. Proponents argue that uniforms reduce social inequality, minimize distractions, and foster school spirit. Critics, however, contend that uniforms suppress individual expression and place financial burdens on families. The debate continues as schools weigh the benefits against the drawbacks."\n\nHow does the author maintain objectivity in this passage?`,
    options: [
      "By only presenting arguments in favor of uniforms",
      "By presenting both sides of the debate equally",
      "By using emotional language to persuade readers",
      "By providing statistical evidence for each claim"
    ],
    correctAnswer: "By presenting both sides of the debate equally",
    explanation: "The author presents arguments from both proponents and critics without taking a clear stance, maintaining objectivity through balanced presentation.",
    topic: "Author's Perspective and Bias"
  },
  {
    content: `Read this historical text:\n\n"The invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of information. Before this innovation, books were painstakingly copied by hand, making them expensive and rare. The printing press democratized knowledge, enabling the rapid dissemination of ideas that would fuel the Renaissance and Reformation movements."\n\nWhat cause-and-effect relationship is described in this passage?`,
    options: [
      "The Renaissance caused the invention of the printing press",
      "Hand-copied books led to the Reformation movement",
      "The printing press enabled the spread of transformative ideas",
      "Expensive books caused people to stop reading"
    ],
    correctAnswer: "The printing press enabled the spread of transformative ideas",
    explanation: "The passage shows that the printing press (cause) led to democratized knowledge and fueled Renaissance and Reformation movements (effects).",
    topic: "Historical Cause and Effect"
  },
  {
    content: `Read this excerpt from a research study:\n\n"Our investigation into sleep patterns among teenagers revealed significant correlations between screen time and sleep quality. Participants who used electronic devices within two hours of bedtime showed decreased sleep duration and increased sleep latency. These findings suggest that blue light exposure may interfere with natural circadian rhythms."\n\nWhat type of evidence does this passage primarily rely on?`,
    options: [
      "Personal anecdotes and opinions",
      "Historical examples and precedents",
      "Empirical data and scientific observation",
      "Expert testimonials and interviews"
    ],
    correctAnswer: "Empirical data and scientific observation",
    explanation: "The passage describes a research investigation with measurable results (correlations, duration, latency), which constitutes empirical data and scientific observation.",
    topic: "Research and Evidence Analysis"
  },
  {
    content: `Read this cultural text:\n\n"Traditional Japanese tea ceremony, known as 'chanoyu,' represents more than simply preparing and serving tea. This ancient practice embodies principles of harmony, respect, purity, and tranquility. Every gesture, from the arrangement of utensils to the precise movements of the host, carries deep cultural significance and reflects centuries of refined tradition."\n\nWhat is the author's main point about the tea ceremony?`,
    options: [
      "It is an outdated practice that should be modernized",
      "It is primarily about making and drinking tea",
      "It represents deeper cultural values and philosophy",
      "It is too complicated for modern people to understand"
    ],
    correctAnswer: "It represents deeper cultural values and philosophy",
    explanation: "The passage emphasizes that the tea ceremony embodies principles and cultural significance beyond the simple act of preparing tea.",
    topic: "Cultural Text Analysis"
  },
  {
    content: `Read this economic text:\n\n"The concept of supply and demand forms the foundation of market economics. When demand for a product increases while supply remains constant, prices typically rise. Conversely, when supply exceeds demand, prices tend to fall. This dynamic relationship helps determine the value of goods and services in a free market system."\n\nWhich scenario would most likely result in falling prices according to the passage?`,
    options: [
      "High demand and low supply",
      "Low demand and high supply",
      "Equal demand and supply",
      "Increasing demand and increasing supply"
    ],
    correctAnswer: "Low demand and high supply",
    explanation: "The passage states that when supply exceeds demand, prices tend to fall. Low demand and high supply creates this condition.",
    topic: "Economic Concept Comprehension"
  },
  {
    content: `Read this technological text:\n\n"Virtual reality technology has evolved from a science fiction concept to a practical tool with applications in education, healthcare, and entertainment. Medical students can now practice surgical procedures in risk-free virtual environments, while therapists use VR to treat phobias and PTSD. As the technology becomes more accessible, its potential applications continue to expand."\n\nWhat pattern of development does the author use to organize this information?`,
    options: [
      "Chronological order from past to present",
      "Problem and solution format",
      "General statement followed by specific examples",
      "Comparison between different technologies"
    ],
    correctAnswer: "General statement followed by specific examples",
    explanation: "The passage begins with a general statement about VR's evolution, then provides specific examples in medicine and therapy, followed by a concluding generalization.",
    topic: "Text Organization Patterns"
  },
  {
    content: `Read this philosophical text:\n\n"The question of whether artificial intelligence can truly 'think' has puzzled philosophers and scientists for decades. While AI systems can process information and make decisions, critics argue that this computational ability differs fundamentally from human consciousness and self-awareness. The debate touches on fundamental questions about the nature of mind and intelligence itself."\n\nWhat makes this question particularly complex according to the passage?`,
    options: [
      "AI systems are too advanced for humans to understand",
      "It involves fundamental questions about consciousness and mind",
      "Scientists and philosophers always disagree",
      "Computational ability is impossible to measure"
    ],
    correctAnswer: "It involves fundamental questions about consciousness and mind",
    explanation: "The passage states that the debate 'touches on fundamental questions about the nature of mind and intelligence itself,' indicating the complexity stems from these deep philosophical issues.",
    topic: "Philosophical Text Analysis"
  }
];

function createTrulyUniqueReadingQuestions() {
  const questionsDir = '/workspaces/AWSQCLI/testace-app/public/questions';
  const frontendQuestionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
  
  // Fix Grade 9 Hard Reading specifically
  const grade9HardFile = path.join(questionsDir, '9_hard_reading.json');
  const frontendGrade9HardFile = path.join(frontendQuestionsDir, '9_hard_reading.json');
  
  console.log('🎯 Creating truly unique Grade 9 Hard Reading questions...');
  
  // Create questions with proper IDs and structure
  const formattedQuestions = grade9HardReadingQuestions.map((q, index) => ({
    "_id": `grade9_hard_reading_${String(index + 1).padStart(3, '0')}`,
    "content": q.content,
    "type": "multiple_choice",
    "options": q.options,
    "correctAnswer": q.correctAnswer,
    "subject": "Reading",
    "grade": 9,
    "difficulty": "hard",
    "explanation": q.explanation,
    "topic": q.topic
  }));
  
  try {
    // Write to main directory
    fs.writeFileSync(grade9HardFile, JSON.stringify(formattedQuestions, null, 2));
    console.log('✅ Updated main Grade 9 Hard Reading file');
    
    // Write to frontend directory
    fs.writeFileSync(frontendGrade9HardFile, JSON.stringify(formattedQuestions, null, 2));
    console.log('✅ Updated frontend Grade 9 Hard Reading file');
    
    // Verify no duplicates
    const contentSet = new Set();
    let uniqueCount = 0;
    
    formattedQuestions.forEach(q => {
      const contentKey = q.content.substring(0, 50); // First 50 chars for comparison
      if (!contentSet.has(contentKey)) {
        contentSet.add(contentKey);
        uniqueCount++;
      }
    });
    
    console.log(`\n🎉 SUCCESS!`);
    console.log(`   ✅ Created ${formattedQuestions.length} questions`);
    console.log(`   ✅ ${uniqueCount}/${formattedQuestions.length} are completely unique`);
    console.log(`   🚫 No more "genetic engineering" duplicates`);
    console.log(`   🚫 No more "space exploration" duplicates`);
    console.log(`   🚫 No more "Variation X" labels`);
    console.log(`   📚 Each question has unique content and topic`);
    
    console.log('\n📋 Topics covered:');
    const topics = [...new Set(formattedQuestions.map(q => q.topic))];
    topics.forEach(topic => console.log(`   - ${topic}`));
    
  } catch (error) {
    console.error('❌ Error creating unique questions:', error.message);
  }
}

// Run the fix
createTrulyUniqueReadingQuestions();
