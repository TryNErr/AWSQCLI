export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK'
}

export interface Question {
  _id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  solution?: string;
  difficulty: DifficultyLevel;
  subject: string;
  grade: string;
  type: QuestionType;
  topic?: string;
  tags?: string[];
  hints?: string[];
  timeLimit?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  grade: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  streaks: {
    current: number;
    best: number;
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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
