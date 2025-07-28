import { Question, DifficultyLevel } from '../types';

interface PerformanceMetrics {
  correctCount: number;
  totalAttempts: number;
  averageTime: number;
  lastAttempted: string;
}

interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  performance?: {
    easy: PerformanceMetrics;
    medium: PerformanceMetrics;
    hard: PerformanceMetrics;
  };
}

interface SubjectStats {
  [subject: string]: DifficultyStats;
}

interface QuestionAttempt {
  questionId: string;
  correct: boolean;
  timeSpent: number;
  difficulty: DifficultyLevel;
  subject: string;
  timestamp: string;
}

/**
 * Track an individual question attempt
 */
export const trackQuestionAttempt = (
  question: Question,
  correct: boolean,
  timeSpent: number
): void => {
  const attempt: QuestionAttempt = {
    questionId: question._id,
    correct,
    timeSpent,
    difficulty: question.difficulty,
    subject: question.subject,
    timestamp: new Date().toISOString()
  };

  // Store attempt history
  const history = localStorage.getItem('questionAttemptHistory');
  const attempts: QuestionAttempt[] = history ? JSON.parse(history) : [];
  attempts.push(attempt);
  localStorage.setItem('questionAttemptHistory', JSON.stringify(attempts));

  // Update performance metrics
  updatePerformanceMetrics(attempt);
};

/**
 * Update performance metrics based on question attempt
 */
const updatePerformanceMetrics = (attempt: QuestionAttempt): void => {
  const stats = localStorage.getItem('questionStats');
  const allStats: SubjectStats = stats ? JSON.parse(stats) : {};

  if (!allStats[attempt.subject]) {
    allStats[attempt.subject] = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0,
      performance: {
        easy: createEmptyMetrics(),
        medium: createEmptyMetrics(),
        hard: createEmptyMetrics()
      }
    };
  }

  const difficultyKey = getDifficultyKey(attempt.difficulty);
  const performance = allStats[attempt.subject].performance![difficultyKey];

  // Update metrics
  performance.totalAttempts++;
  if (attempt.correct) performance.correctCount++;
  performance.averageTime = updateAverage(
    performance.averageTime,
    attempt.timeSpent,
    performance.totalAttempts
  );
  performance.lastAttempted = attempt.timestamp;

  localStorage.setItem('questionStats', JSON.stringify(allStats));
};

/**
 * Calculate and store difficulty distribution statistics
 */
export const trackQuestionStats = (questions: Question[]): void => {
  const existingStats = localStorage.getItem('questionStats');
  const stats: SubjectStats = existingStats ? JSON.parse(existingStats) : {};
  
  questions.forEach(question => {
    if (!stats[question.subject]) {
      stats[question.subject] = {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
        performance: {
          easy: createEmptyMetrics(),
          medium: createEmptyMetrics(),
          hard: createEmptyMetrics()
        }
      };
    }
    
    const subjectStats = stats[question.subject];
    subjectStats.total++;
    
    switch (question.difficulty) {
      case DifficultyLevel.EASY:
        subjectStats.easy++;
        break;
      case DifficultyLevel.MEDIUM:
        subjectStats.medium++;
        break;
      case DifficultyLevel.HARD:
        subjectStats.hard++;
        break;
    }
  });
  
  localStorage.setItem('questionStats', JSON.stringify(stats));
};

/**
 * Get performance metrics for a subject
 */
export const getSubjectPerformance = (subject: string): DifficultyStats | null => {
  const stats = localStorage.getItem('questionStats');
  if (!stats) return null;
  
  const parsedStats: SubjectStats = JSON.parse(stats);
  return parsedStats[subject] || null;
};

/**
 * Get recent question attempt history
 */
export const getRecentAttempts = (
  limit: number = 10,
  subject?: string
): QuestionAttempt[] => {
  const history = localStorage.getItem('questionAttemptHistory');
  if (!history) return [];

  const attempts: QuestionAttempt[] = JSON.parse(history);
  const filtered = subject 
    ? attempts.filter(a => a.subject === subject)
    : attempts;

  return filtered
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

/**
 * Calculate success rate for a difficulty level
 */
export const calculateSuccessRate = (
  subject: string,
  difficulty: DifficultyLevel
): number => {
  const stats = getSubjectPerformance(subject);
  if (!stats?.performance) return 0;

  const metrics = stats.performance[getDifficultyKey(difficulty)];
  return metrics.totalAttempts > 0
    ? (metrics.correctCount / metrics.totalAttempts) * 100
    : 0;
};

// Helper functions
const createEmptyMetrics = (): PerformanceMetrics => ({
  correctCount: 0,
  totalAttempts: 0,
  averageTime: 0,
  lastAttempted: ''
});

const getDifficultyKey = (difficulty: DifficultyLevel): 'easy' | 'medium' | 'hard' => {
  switch (difficulty) {
    case DifficultyLevel.EASY: return 'easy';
    case DifficultyLevel.MEDIUM: return 'medium';
    case DifficultyLevel.HARD: return 'hard';
    default: return 'medium';
  }
};

const updateAverage = (
  currentAvg: number,
  newValue: number,
  totalCount: number
): number => {
  return ((currentAvg * (totalCount - 1)) + newValue) / totalCount;
};
