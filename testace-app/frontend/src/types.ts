// Import shared types
import {
  BaseUser,
  UserProfile as BaseUserProfile,
  UserStats as BaseUserStats,
  StreakData as BaseStreakData,
  Question as BaseQuestion,
  QuestionType,
  DifficultyLevel,
  TestSession,
  TestMode,
  UserAnswer,
  Analytics,
  LeaderboardEntry,
  WritingSubmission,
  WritingType,
  CritiqueStatus,
  WritingCritique,
  CritiqueSection,
  ApiResponse,
  PaginatedResponse as BasePaginatedResponse,
  SocketEvents,
  AppConfig
} from './shared-types';

// Export all shared types
export { QuestionType, DifficultyLevel };
export type { 
  TestSession,
  TestMode,
  UserAnswer,
  Analytics,
  LeaderboardEntry,
  WritingSubmission,
  WritingType,
  CritiqueStatus,
  WritingCritique,
  CritiqueSection,
  ApiResponse,
  SocketEvents,
  AppConfig
};

// Extended User types with frontend-specific properties
export interface User extends BaseUser {
  streaks: {
    current: number;
    best: number;
    lastActivity?: Date;
  };
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  stats: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    averageScore: number;
  };
}

export interface UserProfile extends BaseUserProfile {
  // Additional frontend-specific properties can be added here
}

export interface UserStats extends BaseUserStats {
  subjectStats: { [subject: string]: SubjectStats };
}

export interface SubjectStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}

export interface StreakData extends BaseStreakData {
  // Additional frontend-specific properties can be added here
}

// Extended Question type with frontend-specific properties
export interface Question extends BaseQuestion {
  isGenerated?: boolean;
  updatedAt?: Date;
  grade: string; // Made grade required by removing the optional ?
}

// Extended PaginatedResponse type
export interface PaginatedResponse<T> extends BasePaginatedResponse<T> {
  // Additional frontend-specific properties can be added here
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
