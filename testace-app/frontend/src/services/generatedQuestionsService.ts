import { Question } from '../types';

const STORAGE_KEY = 'generated_questions';

export const getGeneratedQuestions = (): Question[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving generated questions:', error);
    return [];
  }
};

export const saveGeneratedQuestions = (questions: Question[]): void => {
  try {
    // Get existing questions
    const existingQuestions = getGeneratedQuestions();
    
    // Create a Set of existing question IDs for quick lookup
    const existingIds = new Set(existingQuestions.map(q => q._id));
    
    // Filter out any new questions that have duplicate IDs
    const newQuestions = questions.filter(q => !existingIds.has(q._id));
    
    // Combine existing and new questions
    const allQuestions = [...existingQuestions, ...newQuestions];
    
    // Keep only the last 1000 questions to prevent localStorage from getting too full
    const limitedQuestions = allQuestions.slice(-1000);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedQuestions));
  } catch (error) {
    console.error('Error saving generated questions:', error);
  }
};

export const clearGeneratedQuestions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing generated questions:', error);
  }
};
