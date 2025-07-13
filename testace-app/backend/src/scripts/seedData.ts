import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Question from '../models/Question';
import { QuestionType, DifficultyLevel } from '../../../shared/types';

dotenv.config();

const sampleQuestions = [
  // Math Questions
  {
    content: "What is 15% of 200?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "Mathematics",
    topic: "Percentages",
    difficulty: DifficultyLevel.EASY,
    options: ["25", "30", "35", "40"],
    correctAnswer: "30",
    explanation: "To find 15% of 200, multiply 200 by 0.15: 200 × 0.15 = 30",
    hints: ["Convert percentage to decimal", "15% = 0.15"],
    timeLimit: 60,
    tags: ["percentage", "basic-math"]
  },
  {
    content: "Solve for x: 2x + 5 = 17",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "Mathematics",
    topic: "Algebra",
    difficulty: DifficultyLevel.MEDIUM,
    options: ["4", "6", "8", "10"],
    correctAnswer: "6",
    explanation: "2x + 5 = 17, so 2x = 12, therefore x = 6",
    hints: ["Subtract 5 from both sides", "Then divide by 2"],
    timeLimit: 90,
    tags: ["algebra", "equations"]
  },
  {
    content: "What is the derivative of x³ + 2x² - 5x + 3?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: DifficultyLevel.HARD,
    options: ["3x² + 4x - 5", "x² + 4x - 5", "3x² + 2x - 5", "3x² + 4x + 5"],
    correctAnswer: "3x² + 4x - 5",
    explanation: "Using power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(3) = 0",
    hints: ["Use the power rule", "The derivative of a constant is 0"],
    timeLimit: 120,
    tags: ["calculus", "derivatives"]
  },

  // Science Questions
  {
    content: "What is the chemical symbol for gold?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "Science",
    topic: "Chemistry",
    difficulty: DifficultyLevel.EASY,
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au",
    explanation: "Gold's chemical symbol is Au, from the Latin word 'aurum'",
    hints: ["Think of the Latin name for gold", "It starts with 'A'"],
    timeLimit: 45,
    tags: ["chemistry", "elements"]
  },
  {
    content: "What is Newton's second law of motion?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "Science",
    topic: "Physics",
    difficulty: DifficultyLevel.MEDIUM,
    options: ["F = ma", "E = mc²", "v = u + at", "s = ut + ½at²"],
    correctAnswer: "F = ma",
    explanation: "Newton's second law states that Force equals mass times acceleration (F = ma)",
    hints: ["It relates force, mass, and acceleration", "F = ?"],
    timeLimit: 60,
    tags: ["physics", "newton-laws"]
  },

  // English Questions
  {
    content: "Which of the following is a synonym for 'ubiquitous'?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "English",
    topic: "Vocabulary",
    difficulty: DifficultyLevel.MEDIUM,
    options: ["Rare", "Omnipresent", "Temporary", "Specific"],
    correctAnswer: "Omnipresent",
    explanation: "Ubiquitous means present everywhere at the same time, which is synonymous with omnipresent",
    hints: ["Think about something that exists everywhere", "The prefix 'omni-' means all"],
    timeLimit: 60,
    tags: ["vocabulary", "synonyms"]
  },
  {
    content: "Identify the literary device: 'The wind whispered through the trees'",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "English",
    topic: "Literature",
    difficulty: DifficultyLevel.EASY,
    options: ["Metaphor", "Simile", "Personification", "Alliteration"],
    correctAnswer: "Personification",
    explanation: "Personification gives human characteristics (whispering) to non-human things (wind)",
    hints: ["The wind is given a human action", "What human quality is attributed to the wind?"],
    timeLimit: 45,
    tags: ["literature", "literary-devices"]
  },

  // History Questions
  {
    content: "In which year did World War II end?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "History",
    topic: "World Wars",
    difficulty: DifficultyLevel.EASY,
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: "1945",
    explanation: "World War II ended in 1945 with the surrender of Japan in September",
    hints: ["It was in the mid-1940s", "Japan surrendered after the atomic bombs"],
    timeLimit: 45,
    tags: ["world-war-2", "dates"]
  },
  {
    content: "Who was the first President of the United States?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "History",
    topic: "American History",
    difficulty: DifficultyLevel.EASY,
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correctAnswer: "George Washington",
    explanation: "George Washington was the first President of the United States, serving from 1789 to 1797",
    hints: ["He was a general in the Revolutionary War", "He's on the $1 bill"],
    timeLimit: 30,
    tags: ["american-history", "presidents"]
  },

  // Geography Questions
  {
    content: "What is the capital of Australia?",
    type: QuestionType.MULTIPLE_CHOICE,
    subject: "Geography",
    topic: "World Capitals",
    difficulty: DifficultyLevel.MEDIUM,
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: "Canberra",
    explanation: "Canberra is the capital of Australia, though Sydney and Melbourne are larger cities",
    hints: ["It's not the largest city", "It was specifically built to be the capital"],
    timeLimit: 45,
    tags: ["geography", "capitals"]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testace');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = new User({
      username: 'demo',
      email: 'demo@testace.com',
      password: hashedPassword,
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        grade: '12',
        subjects: ['Mathematics', 'Science', 'English'],
        targetTests: ['SAT', 'ACT']
      },
      stats: {
        totalQuestions: 150,
        correctAnswers: 120,
        accuracy: 80,
        averageTime: 45,
        weakAreas: ['Calculus', 'Physics'],
        strongAreas: ['Algebra', 'Chemistry'],
        totalStudyTime: 7200 // 2 hours in seconds
      },
      streaks: {
        current: 5,
        longest: 12,
        lastActivity: new Date()
      }
    });

    await demoUser.save();
    console.log('Created demo user');

    // Create sample questions
    const questionsWithCreator = sampleQuestions.map(q => ({
      ...q,
      createdBy: demoUser._id
    }));

    await Question.insertMany(questionsWithCreator);
    console.log(`Created ${sampleQuestions.length} sample questions`);

    // Create additional users for leaderboard
    const additionalUsers = [
      {
        username: 'alice_student',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
        profile: {
          firstName: 'Alice',
          lastName: 'Johnson',
          grade: '11',
          subjects: ['Mathematics', 'Science'],
          targetTests: ['SAT']
        },
        stats: {
          totalQuestions: 200,
          correctAnswers: 180,
          accuracy: 90,
          averageTime: 40,
          weakAreas: ['Geometry'],
          strongAreas: ['Algebra', 'Biology'],
          totalStudyTime: 10800
        },
        streaks: {
          current: 8,
          longest: 15,
          lastActivity: new Date()
        }
      },
      {
        username: 'bob_learner',
        email: 'bob@example.com',
        password: await bcrypt.hash('password123', 10),
        profile: {
          firstName: 'Bob',
          lastName: 'Smith',
          grade: '12',
          subjects: ['English', 'History'],
          targetTests: ['ACT']
        },
        stats: {
          totalQuestions: 100,
          correctAnswers: 75,
          accuracy: 75,
          averageTime: 50,
          weakAreas: ['Literature'],
          strongAreas: ['Grammar', 'World History'],
          totalStudyTime: 5400
        },
        streaks: {
          current: 3,
          longest: 7,
          lastActivity: new Date()
        }
      }
    ];

    await User.insertMany(additionalUsers);
    console.log('Created additional users for testing');

    console.log('Database seeded successfully!');
    console.log('\nDemo credentials:');
    console.log('Email: demo@testace.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
