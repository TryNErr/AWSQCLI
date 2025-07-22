// User Types
export interface BaseUser {
  id: string;
  email: string;
  name: string;
  grade: string;
  role?: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageScore: number;
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
  best: number;
  lastActivity?: Date;
  dailyGoal?: number;
}

// Question Types
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  _id: string;
  content: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  hints?: string[];
}

// Test Types
export enum TestMode {
  PRACTICE = 'PRACTICE',
  TIMED = 'TIMED',
  CHALLENGE = 'CHALLENGE'
}

export interface TestSession {
  id: string;
  mode: TestMode;
  questions: Question[];
  startTime: Date;
  endTime?: Date;
  score?: number;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Analytics Types
export interface Analytics {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  timeSpent: number;
  subjectBreakdown: { [key: string]: number };
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

// Writing Types
export enum WritingType {
  ESSAY = 'ESSAY',
  STORY = 'STORY',
  REPORT = 'REPORT'
}

export enum CritiqueStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface WritingSubmission {
  id: string;
  type: WritingType;
  prompt: string;
  content: string;
  userId: string;
  submittedAt: Date;
  status: CritiqueStatus;
}

export interface CritiqueSection {
  title: string;
  content: string;
  score: number;
}

export interface WritingCritique {
  submissionId: string;
  sections: CritiqueSection[];
  overallScore: number;
  feedback: string;
  completedAt: Date;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Socket Events
export enum SocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  JOIN_ROOM = 'joinRoom',
  LEAVE_ROOM = 'leaveRoom',
  NEW_MESSAGE = 'newMessage',
  USER_JOINED = 'userJoined',
  USER_LEFT = 'userLeft'
}

// App Configuration
export interface AppConfig {
  apiUrl: string;
  socketUrl: string;
  version: string;
  environment: 'development' | 'production';
}
