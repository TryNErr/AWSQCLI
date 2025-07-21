import { Question } from '../types';

const GENERATED_QUESTIONS_KEY = 'testace_generated_questions';

// Get all generated questions from localStorage
export const getGeneratedQuestions = (): Question[] => {
  try {
    const storedQuestions = localStorage.getItem(GENERATED_QUESTIONS_KEY);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  } catch (error) {
    console.error('Error retrieving generated questions:', error);
    return [];
  }
};

// Save a generated question to localStorage
export const saveGeneratedQuestion = (question: Question): void => {
  try {
    const questions = getGeneratedQuestions();
    
    // Check if question with this ID already exists
    const existingIndex = questions.findIndex(q => q._id === question._id);
    
    if (existingIndex >= 0) {
      // Update existing question
      questions[existingIndex] = question;
    } else {
      // Add new question
      questions.push(question);
    }
    
    localStorage.setItem(GENERATED_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving generated question:', error);
  }
};

// Save multiple generated questions to localStorage
export const saveGeneratedQuestions = (questions: Question[]): void => {
  try {
    const existingQuestions = getGeneratedQuestions();
    
    // Merge questions, replacing any with the same ID
    const mergedQuestions = [...existingQuestions];
    
    questions.forEach(question => {
      const existingIndex = mergedQuestions.findIndex(q => q._id === question._id);
      if (existingIndex >= 0) {
        mergedQuestions[existingIndex] = question;
      } else {
        mergedQuestions.push(question);
      }
    });
    
    localStorage.setItem(GENERATED_QUESTIONS_KEY, JSON.stringify(mergedQuestions));
  } catch (error) {
    console.error('Error saving generated questions:', error);
  }
};

// Get a specific generated question by ID
export const getGeneratedQuestionById = (id: string): Question | null => {
  try {
    const questions = getGeneratedQuestions();
    return questions.find(q => q._id === id) || null;
  } catch (error) {
    console.error('Error retrieving generated question by ID:', error);
    return null;
  }
};

// Clear all generated questions
export const clearGeneratedQuestions = (): void => {
  try {
    localStorage.removeItem(GENERATED_QUESTIONS_KEY);
  } catch (error) {
    console.error('Error clearing generated questions:', error);
  }
};
