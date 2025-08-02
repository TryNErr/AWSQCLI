export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_blank'
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
  isGenerated?: boolean;
  generatedAt?: Date;
  generationMethod?: string;
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
