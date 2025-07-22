export interface QuestionAttempt {
  questionId: string;
  subject: string;
  difficulty: string;
  grade: string;
  isCorrect: boolean;
  timestamp: string;
  userAnswer: string;
  correctAnswer: string;
  content?: string;
  options?: string[];
  explanation?: string;
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
  correctAnswer: string,
  content?: string,
  options?: string[],
  explanation?: string
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
    content,
    options,
    explanation,
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

// Get full question details including options and explanation
export const getQuestionDetails = (questionId: string): any => {
  console.log(`Searching for question details for ID: ${questionId}`);
  
  // First check in the question history itself
  const historyKey = 'question_history';
  const historyStr = localStorage.getItem(historyKey);
  if (historyStr) {
    try {
      const history = JSON.parse(historyStr);
      const historyItem = history.find((h: QuestionAttempt) => 
        h.questionId === questionId && h.content && h.options);
      
      if (historyItem && historyItem.content && historyItem.options) {
        console.log(`Found question details in history for ID: ${questionId}`);
        return {
          content: historyItem.content,
          options: historyItem.options,
          explanation: historyItem.explanation || "No explanation available.",
          subject: historyItem.subject,
          difficulty: historyItem.difficulty,
          grade: historyItem.grade
        };
      }
    } catch (error) {
      console.error('Error parsing question history:', error);
    }
  }
  
  // Then check in generated questions
  const generatedQuestionsStr = localStorage.getItem('generated_questions');
  if (generatedQuestionsStr) {
    try {
      const generatedQuestions = JSON.parse(generatedQuestionsStr);
      const question = generatedQuestions.find((q: any) => q._id === questionId);
      if (question) {
        console.log(`Found question details in generated questions for ID: ${questionId}`);
        return {
          content: question.content,
          options: question.options,
          explanation: question.explanation,
          subject: question.subject,
          difficulty: question.difficulty,
          grade: question.grade
        };
      }
    } catch (error) {
      console.error('Error parsing generated questions:', error);
    }
  }
  
  // Then check in question data (if available)
  try {
    const questionDataStr = localStorage.getItem('question_data');
    if (questionDataStr) {
      const questionData = JSON.parse(questionDataStr);
      const question = questionData.find((q: any) => q._id === questionId);
      if (question) {
        console.log(`Found question details in question data for ID: ${questionId}`);
        return {
          content: question.content,
          options: question.options,
          explanation: question.explanation,
          subject: question.subject,
          difficulty: question.difficulty,
          grade: question.grade
        };
      }
    }
  } catch (error) {
    console.error('Error getting question details from question data:', error);
  }
  
  // If we can't find the question, log and return null
  console.warn(`Could not find question details for ID: ${questionId}`);
  return null;
};
