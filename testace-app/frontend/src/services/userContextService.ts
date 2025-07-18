// This service manages user context information like grade level
// In a real application, this would be connected to a backend API
// For now, we'll use localStorage to persist data

interface UserContext {
  userId: string;
  username: string;
  grade: string;
  subjects: string[];
  lastActive: string;
}

// Initialize with default values
const defaultUserContext: UserContext = {
  userId: 'demo-user',
  username: 'Demo User',
  grade: '5', // Default to grade 5 (must be a string)
  subjects: ['Math', 'Science', 'English'],
  lastActive: new Date().toISOString()
};

// Get user context from localStorage
export const getUserContext = (): UserContext => {
  const contextKey = 'testace_user_context';
  
  const storedContext = localStorage.getItem(contextKey);
  if (storedContext) {
    try {
      return JSON.parse(storedContext);
    } catch (error) {
      console.error('Error parsing user context:', error);
      return defaultUserContext;
    }
  }
  
  return defaultUserContext;
};

// Save user context to localStorage
export const saveUserContext = (context: Partial<UserContext>): UserContext => {
  const contextKey = 'testace_user_context';
  const currentContext = getUserContext();
  
  const updatedContext = {
    ...currentContext,
    ...context,
    lastActive: new Date().toISOString()
  };
  
  localStorage.setItem(contextKey, JSON.stringify(updatedContext));
  return updatedContext;
};

// Get user's grade
export const getUserGrade = (): string => {
  const grade = getUserContext().grade;
  // Ensure we always return a string
  return typeof grade === 'string' ? grade : String(grade);
};

// Update user's grade
export const updateUserGrade = (grade: string): void => {
  // Ensure grade is stored as a string
  const gradeStr = String(grade);
  saveUserContext({ grade: gradeStr });
};

// Initialize user context if it doesn't exist
export const initializeUserContext = (): void => {
  const contextKey = 'testace_user_context';
  if (!localStorage.getItem(contextKey)) {
    localStorage.setItem(contextKey, JSON.stringify(defaultUserContext));
  }
};
