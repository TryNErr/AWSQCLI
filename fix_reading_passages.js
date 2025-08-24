#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive passages for different grade levels
const passages = {
  elementary: [
    {
      text: "Bees are amazing insects that help plants grow. They fly from flower to flower collecting nectar, which they use to make honey. When bees visit flowers, pollen sticks to their fuzzy bodies. As they move from flower to flower, they spread this pollen around, helping plants make seeds. Without bees, many of our favorite fruits and vegetables wouldn't exist!",
      questions: [
        {
          content: "What do bees collect from flowers?",
          options: ["Water", "Nectar", "Leaves", "Seeds"],
          answer: "Nectar",
          explanation: "The passage states that bees collect nectar from flowers to make honey"
        },
        {
          content: "How do bees help plants?",
          options: ["By eating insects", "By spreading pollen", "By making noise", "By building nests"],
          answer: "By spreading pollen",
          explanation: "The passage explains that bees spread pollen as they move from flower to flower, helping plants make seeds"
        }
      ]
    },
    {
      text: "The ocean is home to many incredible creatures. Dolphins are smart marine mammals that live in groups called pods. They use clicking sounds to talk to each other and to find food underwater. Dolphins are very playful and often jump out of the water. They breathe air through a blowhole on top of their heads, just like whales do.",
      questions: [
        {
          content: "What are groups of dolphins called?",
          options: ["Herds", "Flocks", "Pods", "Schools"],
          answer: "Pods",
          explanation: "The passage states that dolphins live in groups called pods"
        },
        {
          content: "How do dolphins breathe?",
          options: ["Through gills", "Through their mouth", "Through a blowhole", "Through their skin"],
          answer: "Through a blowhole",
          explanation: "The passage mentions that dolphins breathe air through a blowhole on top of their heads"
        }
      ]
    }
  ],
  middle: [
    {
      text: "The Amazon rainforest is often called the 'lungs of the Earth' because it produces about 20% of the world's oxygen. This vast forest covers over 2 million square miles and is home to millions of species of plants and animals. Many of these species haven't even been discovered yet by scientists. The rainforest also plays a crucial role in regulating Earth's climate by absorbing carbon dioxide from the atmosphere.",
      questions: [
        {
          content: "Why is the Amazon rainforest called the 'lungs of the Earth'?",
          options: ["It's very large", "It produces oxygen", "It has many animals", "It regulates temperature"],
          answer: "It produces oxygen",
          explanation: "The passage states the Amazon is called 'lungs of the Earth' because it produces about 20% of the world's oxygen"
        },
        {
          content: "What does the passage suggest about species in the Amazon?",
          options: ["All species are known", "Many species are undiscovered", "There are few species", "Scientists aren't interested"],
          answer: "Many species are undiscovered",
          explanation: "The passage states 'Many of these species haven't even been discovered yet by scientists'"
        }
      ]
    },
    {
      text: "Marie Curie was a pioneering scientist who made groundbreaking discoveries about radioactivity. She was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different sciences - physics and chemistry. Born in Poland, she moved to Paris to study at the Sorbonne University. Despite facing discrimination as a woman in science, she persevered and made discoveries that changed our understanding of atoms and elements.",
      questions: [
        {
          content: "What makes Marie Curie unique among Nobel Prize winners?",
          options: ["She was Polish", "She studied in Paris", "She won in two different sciences", "She studied radioactivity"],
          answer: "She won in two different sciences",
          explanation: "The passage states she was 'the only person to win Nobel Prizes in two different sciences - physics and chemistry'"
        },
        {
          content: "What challenge did Marie Curie face in her career?",
          options: ["Language barriers", "Lack of education", "Discrimination as a woman", "Financial problems"],
          answer: "Discrimination as a woman",
          explanation: "The passage mentions 'Despite facing discrimination as a woman in science, she persevered'"
        }
      ]
    }
  ],
  high: [
    {
      text: "Artificial intelligence has revolutionized many industries, from healthcare to transportation. Machine learning algorithms can now diagnose diseases, predict market trends, and even drive cars autonomously. However, these advances also raise important ethical questions about privacy, job displacement, and the role of human decision-making in an increasingly automated world. As AI becomes more sophisticated, society must carefully consider how to harness its benefits while addressing its potential risks.",
      questions: [
        {
          content: "According to the passage, what can machine learning algorithms do?",
          options: ["Only drive cars", "Diagnose diseases, predict trends, and drive cars", "Just predict markets", "Only raise questions"],
          answer: "Diagnose diseases, predict trends, and drive cars",
          explanation: "The passage lists all three capabilities of machine learning algorithms"
        },
        {
          content: "What concerns does AI advancement raise?",
          options: ["Technical issues", "Ethical questions about privacy and jobs", "Cost problems", "Speed limitations"],
          answer: "Ethical questions about privacy and jobs",
          explanation: "The passage mentions ethical questions about privacy, job displacement, and human decision-making"
        }
      ]
    },
    {
      text: "Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, caused primarily by increased greenhouse gas emissions from human activities, are leading to more frequent extreme weather events, rising sea levels, and shifts in precipitation patterns. Scientists warn that without immediate and substantial action to reduce carbon emissions, the consequences could be catastrophic for ecosystems and human societies worldwide.",
      questions: [
        {
          content: "What is the primary cause of rising global temperatures?",
          options: ["Natural cycles", "Solar activity", "Greenhouse gas emissions from human activities", "Ocean currents"],
          answer: "Greenhouse gas emissions from human activities",
          explanation: "The passage states that rising temperatures are 'caused primarily by increased greenhouse gas emissions from human activities'"
        },
        {
          content: "What do scientists warn about the future?",
          options: ["Temperatures will stabilize", "Consequences could be catastrophic without action", "The problem will solve itself", "Only animals will be affected"],
          answer: "Consequences could be catastrophic without action",
          explanation: "The passage mentions scientists warn that without action to reduce emissions, 'the consequences could be catastrophic'"
        }
      ]
    }
  ]
};

function getPassagesForGrade(grade) {
  if (grade <= 5) return passages.elementary;
  if (grade <= 8) return passages.middle;
  return passages.high;
}

function fixReadingFile(grade, difficulty) {
  const questionsDir = path.join(__dirname, 'testace-app/frontend/public/questions');
  const filename = `${grade}_${difficulty}_reading.json`;
  const filepath = path.join(questionsDir, filename);
  
  const gradePassages = getPassagesForGrade(grade);
  const questions = [];
  
  // Generate 50 questions with proper passages
  for (let i = 0; i < 50; i++) {
    const passageIndex = Math.floor(i / 25) % gradePassages.length; // 25 questions per passage
    const questionIndex = Math.floor(i / 12.5) % 2; // Alternate between 2 questions per passage
    
    const passage = gradePassages[passageIndex];
    const question = passage.questions[questionIndex % passage.questions.length];
    
    questions.push({
      "_id": `reading_${grade}_${difficulty}_${String(i + 1).padStart(3, '0')}`,
      "content": question.content,
      "type": "multiple_choice",
      "options": question.options,
      "correctAnswer": question.answer,
      "subject": "reading",
      "grade": String(grade),
      "difficulty": difficulty,
      "explanation": question.explanation,
      "passage": passage.text,
      "_cacheBreaker": `${Date.now()}_${i + 1}`
    });
  }
  
  fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
  return questions.length;
}

function fixAllReadingFiles() {
  console.log('🔧 Fixing ALL reading questions to include passages...');
  
  const difficulties = ['easy', 'medium', 'hard'];
  let totalFixed = 0;
  
  for (let grade = 1; grade <= 12; grade++) {
    console.log(`\n📚 Fixing Grade ${grade} reading questions...`);
    
    for (const difficulty of difficulties) {
      const count = fixReadingFile(grade, difficulty);
      console.log(`✅ Fixed ${count} reading questions for Grade ${grade} ${difficulty} - ALL have passages now`);
      totalFixed += count;
    }
  }
  
  console.log(`\n🎉 SUCCESS! Fixed ${totalFixed} reading questions total`);
  console.log('✅ ALL reading questions now have proper passage fields!');
}

// Run the fix
fixAllReadingFiles();
