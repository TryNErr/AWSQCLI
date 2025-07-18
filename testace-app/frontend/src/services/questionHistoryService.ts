// This service manages the history of questions answered by the user
// In a real application, this would be connected to a backend API
// For now, we'll use localStorage to persist data

import { Question } from '../types';

export interface QuestionAttempt {
  questionId: string;
  question: string;
  subject: string;
  grade?: string;
  difficulty: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

interface QuestionHistory {
  attempts: QuestionAttempt[];
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    bySubject: Record<string, { total: number; correct: number }>;
    byGrade: Record<string, { total: number; correct: number }>;
    byDifficulty: Record<string, { total: number; correct: number }>;
  };
}

// Get the current user's ID (in a real app, this would come from authentication)
const getCurrentUserId = (): string => {
  return localStorage.getItem('userId') || 'demo-user';
};

// Initialize question history
const initQuestionHistory = (): QuestionHistory => {
  return {
    attempts: [],
    stats: {
      totalAttempts: 0,
      correctAttempts: 0,
      bySubject: {},
      byGrade: {},
      byDifficulty: {}
    }
  };
};

// Get question history from localStorage
export const getQuestionHistory = (): QuestionHistory => {
  const userId = getCurrentUserId();
  const historyKey = `testace_question_history_${userId}`;
  
  const storedHistory = localStorage.getItem(historyKey);
  if (storedHistory) {
    try {
      return JSON.parse(storedHistory);
    } catch (error) {
      console.error('Error parsing question history:', error);
      return initQuestionHistory();
    }
  }
  
  return initQuestionHistory();
};

// Save question history to localStorage
const saveQuestionHistory = (history: QuestionHistory): void => {
  const userId = getCurrentUserId();
  const historyKey = `testace_question_history_${userId}`;
  
  localStorage.setItem(historyKey, JSON.stringify(history));
};

// Record a question attempt
export const recordQuestionAttempt = (
  question: Question,
  userAnswer: string,
  isCorrect: boolean
): void => {
  const history = getQuestionHistory();
  
  // Create the attempt record
  const attempt: QuestionAttempt = {
    questionId: question._id,
    question: question.content,
    subject: question.subject,
    grade: question.grade,
    difficulty: question.difficulty,
    userAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    timestamp: new Date().toISOString()
  };
  
  // Add to attempts array (at the beginning for most recent first)
  history.attempts.unshift(attempt);
  
  // Update overall stats
  history.stats.totalAttempts++;
  if (isCorrect) {
    history.stats.correctAttempts++;
  }
  
  // Update subject stats
  if (!history.stats.bySubject[question.subject]) {
    history.stats.bySubject[question.subject] = { total: 0, correct: 0 };
  }
  history.stats.bySubject[question.subject].total++;
  if (isCorrect) {
    history.stats.bySubject[question.subject].correct++;
  }
  
  // Update grade stats (if grade is available)
  if (question.grade) {
    if (!history.stats.byGrade[question.grade]) {
      history.stats.byGrade[question.grade] = { total: 0, correct: 0 };
    }
    history.stats.byGrade[question.grade].total++;
    if (isCorrect) {
      history.stats.byGrade[question.grade].correct++;
    }
  }
  
  // Update difficulty stats
  if (!history.stats.byDifficulty[question.difficulty]) {
    history.stats.byDifficulty[question.difficulty] = { total: 0, correct: 0 };
  }
  history.stats.byDifficulty[question.difficulty].total++;
  if (isCorrect) {
    history.stats.byDifficulty[question.difficulty].correct++;
  }
  
  // Save the updated history
  saveQuestionHistory(history);
};

// Get question attempts (with optional filtering)
export const getQuestionAttempts = (
  limit?: number,
  subject?: string,
  grade?: string,
  difficulty?: string
): QuestionAttempt[] => {
  const history = getQuestionHistory();
  
  let filteredAttempts = history.attempts;
  
  // Apply filters if provided
  if (subject) {
    filteredAttempts = filteredAttempts.filter(attempt => attempt.subject === subject);
  }
  
  if (grade) {
    filteredAttempts = filteredAttempts.filter(attempt => attempt.grade === grade);
  }
  
  if (difficulty) {
    filteredAttempts = filteredAttempts.filter(attempt => attempt.difficulty === difficulty);
  }
  
  // Apply limit if provided
  if (limit && limit > 0) {
    filteredAttempts = filteredAttempts.slice(0, limit);
  }
  
  return filteredAttempts;
};

// Get question statistics
export const getQuestionStats = () => {
  const history = getQuestionHistory();
  return history.stats;
};

// Clear question history (for testing)
export const clearQuestionHistory = (): void => {
  const userId = getCurrentUserId();
  const historyKey = `testace_question_history_${userId}`;
  localStorage.removeItem(historyKey);
};
