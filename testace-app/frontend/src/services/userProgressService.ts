// Type definitions
interface SubjectProgress {
  total: number;
  correct: number;
  percentage?: number;
}

interface DifficultyProgress {
  total: number;
  correct: number;
}

interface Progress {
  total: number;
  correct: number;
  byDifficulty: {
    easy: DifficultyProgress;
    medium: DifficultyProgress;
    hard: DifficultyProgress;
  };
  byGrade: Record<string, SubjectProgress>;
}

interface OverallProgress {
  totalQuestions: number;
  correctAnswers: number;
  bySubject: Record<string, SubjectProgress>;
  byDifficulty: {
    easy: DifficultyProgress;
    medium: DifficultyProgress;
    hard: DifficultyProgress;
  };
}

// Get answered question IDs from localStorage
export const getAnsweredQuestionIds = (): string[] => {
  const storedIds = localStorage.getItem('answeredQuestionIds');
  return storedIds ? JSON.parse(storedIds) : [];
};

// Save answered question IDs to localStorage
export const saveAnsweredQuestionIds = (ids: string[]): void => {
  localStorage.setItem('answeredQuestionIds', JSON.stringify(ids));
};

// Add a single answered question ID
export const addAnsweredQuestionId = (id: string): void => {
  const existingIds = getAnsweredQuestionIds();
  const uniqueIds = Array.from(new Set([...existingIds, id]));
  saveAnsweredQuestionIds(uniqueIds);
};

// Check if a question has been answered correctly
export const isQuestionAnswered = (id: string): boolean => {
  const answeredIds = getAnsweredQuestionIds();
  return answeredIds.includes(id);
};

// Mark a question as answered and record the result
export const markQuestionAnswered = (
  questionId: string,
  isCorrect: boolean,
  subject: string,
  difficulty: string,
  grade: string
): void => {
  if (isCorrect) {
    addAnsweredQuestionId(questionId);
  }

  // Get existing progress data
  const progressKey = `progress_${subject.toLowerCase()}`;
  const existingProgress = localStorage.getItem(progressKey);
  const progress: Progress = existingProgress ? JSON.parse(existingProgress) : {
    total: 0,
    correct: 0,
    byDifficulty: {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    },
    byGrade: {}
  };

  // Update overall stats
  progress.total += 1;
  if (isCorrect) {
    progress.correct += 1;
  }

  // Update difficulty stats
  const difficultyLevel = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
  progress.byDifficulty[difficultyLevel].total += 1;
  if (isCorrect) {
    progress.byDifficulty[difficultyLevel].correct += 1;
  }

  // Update grade stats
  if (!progress.byGrade[grade]) {
    progress.byGrade[grade] = { total: 0, correct: 0 };
  }
  progress.byGrade[grade].total += 1;
  if (isCorrect) {
    progress.byGrade[grade].correct += 1;
  }

  // Save updated progress
  localStorage.setItem(progressKey, JSON.stringify(progress));
};

// Record math session score
export const recordMathSessionScore = (
  score: number,
  total: number,
  difficulty: string,
  grade: string
): void => {
  const sessionsKey = 'math_sessions';
  const existingSessions = localStorage.getItem(sessionsKey);
  const sessions = existingSessions ? JSON.parse(existingSessions) : [];

  // Add new session
  sessions.push({
    date: new Date().toISOString(),
    score,
    total,
    difficulty,
    grade,
    percentage: (score / total) * 100
  });

  // Keep only last 50 sessions
  if (sessions.length > 50) {
    sessions.shift();
  }

  localStorage.setItem(sessionsKey, JSON.stringify(sessions));
};

// Get progress for a specific subject
export const getSubjectProgress = (subject: string): Progress | null => {
  const progressKey = `progress_${subject.toLowerCase()}`;
  const progress = localStorage.getItem(progressKey);
  return progress ? JSON.parse(progress) : null;
};

// Get all math session scores
export const getMathSessionScores = () => {
  const sessionsKey = 'math_sessions';
  const sessions = localStorage.getItem(sessionsKey);
  return sessions ? JSON.parse(sessions) : [];
};

// Get overall progress across all subjects
export const getOverallProgress = (): OverallProgress => {
  const subjects = ['Math', 'English', 'Thinking Skills', 'Mathematical Reasoning'];
  const overallProgress: OverallProgress = {
    totalQuestions: 0,
    correctAnswers: 0,
    bySubject: {},
    byDifficulty: {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    }
  };

  subjects.forEach(subject => {
    const progress = getSubjectProgress(subject);
    if (progress) {
      overallProgress.totalQuestions += progress.total;
      overallProgress.correctAnswers += progress.correct;
      overallProgress.bySubject[subject] = {
        total: progress.total,
        correct: progress.correct,
        percentage: progress.total > 0 ? (progress.correct / progress.total) * 100 : 0
      };

      // Aggregate difficulty stats
      Object.keys(progress.byDifficulty).forEach(difficulty => {
        const diffLevel = difficulty as 'easy' | 'medium' | 'hard';
        overallProgress.byDifficulty[diffLevel].total += progress.byDifficulty[diffLevel].total;
        overallProgress.byDifficulty[diffLevel].correct += progress.byDifficulty[diffLevel].correct;
      });
    }
  });

  return overallProgress;
};
