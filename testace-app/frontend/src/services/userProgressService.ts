// This service manages user progress for questions
// In a real application, this would be connected to a backend API
// For now, we'll use localStorage to persist data

interface UserProgress {
  answeredQuestions: Record<string, boolean>; // questionId -> correct
  mathSessionScores: Array<{
    grade: string;
    difficulty: string;
    score: number;
    total: number;
    date: string;
  }>;
}

// Get the current user's ID (in a real app, this would come from authentication)
const getCurrentUserId = (): string => {
  return localStorage.getItem('userId') || 'demo-user';
};

// Initialize user progress
const initUserProgress = (): UserProgress => {
  return {
    answeredQuestions: {},
    mathSessionScores: []
  };
};

// Get user progress from localStorage
const getUserProgress = (): UserProgress => {
  const userId = getCurrentUserId();
  const progressKey = `testace_user_progress_${userId}`;
  
  const storedProgress = localStorage.getItem(progressKey);
  if (storedProgress) {
    try {
      return JSON.parse(storedProgress);
    } catch (error) {
      console.error('Error parsing user progress:', error);
      return initUserProgress();
    }
  }
  
  return initUserProgress();
};

// Save user progress to localStorage
const saveUserProgress = (progress: UserProgress): void => {
  const userId = getCurrentUserId();
  const progressKey = `testace_user_progress_${userId}`;
  
  localStorage.setItem(progressKey, JSON.stringify(progress));
};

// Mark a question as answered
export const markQuestionAnswered = (questionId: string, correct: boolean): void => {
  const progress = getUserProgress();
  progress.answeredQuestions[questionId] = correct;
  saveUserProgress(progress);
};

// Check if a question has been answered
export const isQuestionAnswered = (questionId: string): boolean => {
  const progress = getUserProgress();
  return !!progress.answeredQuestions[questionId];
};

// Get all answered question IDs
export const getAnsweredQuestionIds = (): string[] => {
  const progress = getUserProgress();
  return Object.keys(progress.answeredQuestions);
};

// Record a math session score
export const recordMathSessionScore = (
  grade: string,
  difficulty: string,
  score: number,
  total: number
): void => {
  const progress = getUserProgress();
  progress.mathSessionScores.push({
    grade,
    difficulty,
    score,
    total,
    date: new Date().toISOString()
  });
  saveUserProgress(progress);
};

// Get math session scores
export const getMathSessionScores = () => {
  const progress = getUserProgress();
  return progress.mathSessionScores;
};

// Reset user progress (for testing)
export const resetUserProgress = (): void => {
  const userId = getCurrentUserId();
  const progressKey = `testace_user_progress_${userId}`;
  localStorage.removeItem(progressKey);
};
