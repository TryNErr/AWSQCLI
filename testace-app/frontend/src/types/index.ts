// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  profile: UserProfile;
  stats: UserStats;
  streaks: StreakData;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  grade?: string;
  subjects: string[];
  targetTests: string[];
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  subjectStats: { [subject: string]: SubjectStats };
}

export interface SubjectStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: Date;
}

// Question Types
export interface Question {
  _id: string;
  content: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  difficulty: DifficultyLevel;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Test Types
export interface Test {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  subject: string;
  difficulty: DifficultyLevel;
  createdBy: string;
  createdAt: Date;
}

export interface TestResult {
  _id: string;
  user: string;
  test: string;
  answers: Answer[];
  score: number;
  timeSpent: number;
  completedAt: Date;
}

export interface Answer {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}
