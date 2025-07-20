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
  weakAreas: string[];
  strongAreas: string[];
  totalStudyTime: number;
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
  subject: string;
  topic?: string;  // Make topic optional
  difficulty: DifficultyLevel;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints?: string[];  // Make hints optional
  timeLimit?: number;
  tags: string[];
  createdBy: string;
  createdAt: Date;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  ESSAY = 'essay',
  MATH = 'math'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Test Session Types
export interface TestSession {
  _id: string;
  userId: string;
  mode: TestMode;
  questions: string[];
  answers: UserAnswer[];
  startTime: Date;
  endTime?: Date;
  timeLimit?: number;
  score?: number;
  completed: boolean;
  subject?: string;
  difficulty?: DifficultyLevel;
}

export enum TestMode {
  PRACTICE = 'practice',
  TIMED = 'timed',
  DAILY_CHALLENGE = 'daily_challenge'
}

export interface UserAnswer {
  questionId: string;
  answer: string | number;
  timeSpent: number;
  isCorrect: boolean;
  timestamp: Date;
}

// Analytics Types
export interface Analytics {
  userId: string;
  subject: string;
  topic: string;
  accuracy: number;
  averageTime: number;
  questionsAttempted: number;
  lastAttempt: Date;
  improvementTrend: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  streak: number;
  totalQuestions: number;
}

// Writing Critique Types
export interface WritingSubmission {
  _id: string;
  userId: string;
  title: string;
  content: string;
  type: WritingType;
  submittedAt: Date;
  critique?: WritingCritique;
  status: CritiqueStatus;
}

export enum WritingType {
  ESSAY = 'essay',
  PARAGRAPH = 'paragraph',
  CREATIVE = 'creative',
  ARGUMENTATIVE = 'argumentative'
}

export enum CritiqueStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface WritingCritique {
  overallScore: number;
  grammar: CritiqueSection;
  structure: CritiqueSection;
  clarity: CritiqueSection;
  vocabulary: CritiqueSection;
  suggestions: string[];
  strengths: string[];
  areasForImprovement: string[];
  processedAt: Date;
}

export interface CritiqueSection {
  score: number;
  feedback: string;
  examples?: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Socket Events
export interface SocketEvents {
  // Client to Server
  'join-room': (room: string) => void;
  'leave-room': (room: string) => void;
  'start-session': (sessionData: Partial<TestSession>) => void;
  'submit-answer': (answer: UserAnswer) => void;
  'end-session': (sessionId: string) => void;

  // Server to Client
  'session-started': (session: TestSession) => void;
  'question-update': (question: Question) => void;
  'answer-result': (result: { correct: boolean; explanation: string }) => void;
  'session-ended': (results: TestSession) => void;
  'leaderboard-update': (leaderboard: LeaderboardEntry[]) => void;
}

// Configuration Types
export interface AppConfig {
  database: {
    url: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  openai: {
    apiKey: string;
    model: string;
  };
  server: {
    port: number;
    cors: {
      origin: string[];
    };
  };
}
