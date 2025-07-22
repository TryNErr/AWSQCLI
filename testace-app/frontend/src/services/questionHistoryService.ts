export interface QuestionAttempt {
  questionId: string;
  subject: string;
  difficulty: string;
  grade: string;
  isCorrect: boolean;
  timestamp: string;
  userAnswer: string;
  correctAnswer: string;
}

interface QuestionStats {
  total: number;
  correct: number;
  bySubject: { [key: string]: { total: number; correct: number } };
  byDifficulty: { [key: string]: { total: number; correct: number } };
}

// Record a question attempt
export const recordQuestionAttempt = (
  questionId: string,
  subject: string,
  difficulty: string,
  grade: string,
  isCorrect: boolean,
  userAnswer: string,
  correctAnswer: string
): void => {
  const historyKey = 'question_history';
  const existingHistory = localStorage.getItem(historyKey);
  const history: QuestionAttempt[] = existingHistory ? JSON.parse(existingHistory) : [];

  // Add new attempt
  history.push({
    questionId,
    subject,
    difficulty,
    grade,
    isCorrect,
    userAnswer,
    correctAnswer,
    timestamp: new Date().toISOString()
  });

  // Keep only last 100 attempts
  if (history.length > 100) {
    history.shift();
  }

  localStorage.setItem(historyKey, JSON.stringify(history));
};

// Get all question attempts
export const getQuestionAttempts = (): QuestionAttempt[] => {
  const historyKey = 'question_history';
  const history = localStorage.getItem(historyKey);
  return history ? JSON.parse(history) : [];
};

// Get question attempt history for a specific subject
export const getSubjectQuestionHistory = (subject: string): QuestionAttempt[] => {
  const history = getQuestionAttempts();
  return history.filter(attempt => attempt.subject === subject);
};

// Get recent question attempts (last n attempts)
export const getRecentQuestionAttempts = (limit: number = 10): QuestionAttempt[] => {
  const history = getQuestionAttempts();
  return history.slice(-limit);
};

// Get performance statistics
export const getQuestionStats = (): QuestionStats => {
  const history = getQuestionAttempts();
  const stats: QuestionStats = {
    total: history.length,
    correct: history.filter(attempt => attempt.isCorrect).length,
    bySubject: {},
    byDifficulty: {}
  };

  history.forEach(attempt => {
    // Subject stats
    if (!stats.bySubject[attempt.subject]) {
      stats.bySubject[attempt.subject] = { total: 0, correct: 0 };
    }
    stats.bySubject[attempt.subject].total++;
    if (attempt.isCorrect) {
      stats.bySubject[attempt.subject].correct++;
    }

    // Difficulty stats
    if (!stats.byDifficulty[attempt.difficulty]) {
      stats.byDifficulty[attempt.difficulty] = { total: 0, correct: 0 };
    }
    stats.byDifficulty[attempt.difficulty].total++;
    if (attempt.isCorrect) {
      stats.byDifficulty[attempt.difficulty].correct++;
    }
  });

  return stats;
};

// Get performance trend data
export const getPerformanceTrend = (days: number = 7): { date: string; correct: number; total: number }[] => {
  const history = getQuestionAttempts();
  const trend: { [key: string]: { correct: number; total: number } } = {};
  
  // Initialize dates
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    trend[dateStr] = { correct: 0, total: 0 };
  }

  // Fill in actual data
  history.forEach(attempt => {
    const date = new Date(attempt.timestamp).toISOString().split('T')[0];
    if (trend[date]) {
      trend[date].total++;
      if (attempt.isCorrect) {
        trend[date].correct++;
      }
    }
  });

  // Convert to array and sort by date
  return Object.entries(trend)
    .map(([date, stats]) => ({
      date,
      ...stats
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Get subject performance data
export const getSubjectPerformance = (): { subject: string; correct: number; total: number }[] => {
  const stats = getQuestionStats();
  return Object.entries(stats.bySubject).map(([subject, data]) => ({
    subject,
    ...data
  }));
};

// Get difficulty level performance data
export const getDifficultyPerformance = (): { difficulty: string; correct: number; total: number }[] => {
  const stats = getQuestionStats();
  return Object.entries(stats.byDifficulty).map(([difficulty, data]) => ({
    difficulty,
    ...data
  }));
};
