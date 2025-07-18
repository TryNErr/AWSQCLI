// Import shared types
import {
  User,
  UserProfile,
  UserStats,
  StreakData,
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
  PaginatedResponse,
  SocketEvents,
  AppConfig
} from '../../shared/types';

// Export all shared types
export {
  User,
  UserProfile,
  UserStats,
  StreakData,
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
  PaginatedResponse,
  SocketEvents,
  AppConfig
};

// Extended Question type with frontend-specific properties
export interface Question extends BaseQuestion {
  isGenerated?: boolean;
}
