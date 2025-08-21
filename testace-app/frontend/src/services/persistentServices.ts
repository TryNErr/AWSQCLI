import DynamoDbService from './dynamoDbService';
import StaticQuestionLoader from './staticQuestionLoader';
import { Question, DifficultyLevel } from '../types';

// Environment check
const USE_DYNAMODB = process.env.REACT_APP_USE_DYNAMODB === 'true' || process.env.NODE_ENV === 'production';

// Current user ID (in production, get from auth context)
const getCurrentUserId = (): string => {
  return localStorage.getItem('currentUserId') || 'anonymous-user';
};

// Persistent User Progress Service
export class PersistentUserProgressService {
  
  static async getAnsweredQuestionIds(): Promise<string[]> {
    if (USE_DYNAMODB) {
      const userId = getCurrentUserId();
      const progress = await DynamoDbService.getUserProgress(userId);
      return progress.answeredQuestionIds || [];
    } else {
      // Fallback to localStorage
      const storedIds = localStorage.getItem('answeredQuestionIds');
      return storedIds ? JSON.parse(storedIds) : [];
    }
  }
  
  static async addAnsweredQuestionId(questionId: string, isCorrect: boolean = true): Promise<void> {
    if (USE_DYNAMODB) {
      const userId = getCurrentUserId();
      await DynamoDbService.addAnsweredQuestion(userId, questionId, isCorrect);
    } else {
      // Fallback to localStorage
      const existingIds = await this.getAnsweredQuestionIds();
      const uniqueIds = Array.from(new Set([...existingIds, questionId]));
      localStorage.setItem('answeredQuestionIds', JSON.stringify(uniqueIds));
    }
  }
  
  static async getUserProgress(): Promise<any> {
    if (USE_DYNAMODB) {
      const userId = getCurrentUserId();
      return await DynamoDbService.getUserProgress(userId);
    } else {
      // Fallback to localStorage
      const answeredIds = await this.getAnsweredQuestionIds();
      return {
        userId: getCurrentUserId(),
        answeredQuestionIds: answeredIds,
        totalQuestions: answeredIds.length,
        correctAnswers: answeredIds.length, // Assume all are correct for localStorage
        subjects: {}
      };
    }
  }
}

// Persistent Question Service
export class PersistentQuestionService {
  
  static async getQuestions(subject?: string, grade?: string, difficulty?: DifficultyLevel): Promise<Question[]> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.getQuestions(subject, grade, difficulty);
    } else {
      // Use static question loader for local development
      try {
        console.log(`🔍 Loading questions: Grade ${grade}, Difficulty ${difficulty}, Subject ${subject}`);
        
        const filters: any = {};
        if (grade) filters.grade = parseInt(grade);
        if (difficulty) filters.difficulty = difficulty;
        if (subject) filters.subject = subject;
        
        const questions = await StaticQuestionLoader.getQuestions(filters);
        
        console.log(`✅ Found ${questions.length} questions matching criteria`);
        return questions;
        
      } catch (error) {
        console.error('Error loading static questions:', error);
        
        // Fallback to old questionData if static loader fails
        try {
          const { questionData } = await import('../pages/Practice/questionData');
          return questionData.filter((q: Question) => {
            if (subject && q.subject !== subject) return false;
            if (grade && q.grade.toString() !== grade) return false;
            if (difficulty && q.difficulty !== difficulty) return false;
            return true;
          });
        } catch (fallbackError) {
          console.error('Error loading fallback questions:', fallbackError);
          return [];
        }
      }
    }
  }
  
  static async saveQuestion(question: Question): Promise<boolean> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.saveQuestion(question);
    } else {
      // For localStorage, we can't persist new questions
      console.warn('Cannot save questions to localStorage - using DynamoDB in production');
      return false;
    }
  }
  
  static async saveQuestions(questions: Question[]): Promise<boolean> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.saveQuestions(questions);
    } else {
      console.warn('Cannot save questions to localStorage - using DynamoDB in production');
      return false;
    }
  }
}

// Persistent Generated Questions Service
export class PersistentGeneratedQuestionsService {
  
  static async getGeneratedQuestions(): Promise<Question[]> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.getGeneratedQuestions();
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem('generatedQuestions');
      return stored ? JSON.parse(stored) : [];
    }
  }
  
  static async saveGeneratedQuestions(questions: Question[]): Promise<boolean> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.saveGeneratedQuestions(questions);
    } else {
      // Fallback to localStorage
      localStorage.setItem('generatedQuestions', JSON.stringify(questions));
      return true;
    }
  }
  
  static async addGeneratedQuestions(questions: Question[]): Promise<boolean> {
    const existing = await this.getGeneratedQuestions();
    const combined = [...existing, ...questions];
    
    // Remove duplicates
    const unique = combined.filter((q, index, arr) => 
      arr.findIndex(item => item._id === q._id) === index
    );
    
    return await this.saveGeneratedQuestions(unique);
  }
}

// Persistent Reading Passages Service
export class PersistentReadingPassagesService {
  
  static async getReadingPassages(grade?: string): Promise<any[]> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.getReadingPassages(grade);
    } else {
      // Fallback to local data
      try {
        const { comprehensiveReadingDatabase } = await import('../utils/comprehensiveReadingDatabase');
        return grade 
          ? comprehensiveReadingDatabase.filter((p: any) => p.grade === grade)
          : comprehensiveReadingDatabase;
      } catch (error) {
        console.error('Error loading local reading passages:', error);
        return [];
      }
    }
  }
  
  static async saveReadingPassages(passages: any[]): Promise<boolean> {
    if (USE_DYNAMODB) {
      return await DynamoDbService.saveReadingPassages(passages);
    } else {
      console.warn('Cannot save reading passages to localStorage - using DynamoDB in production');
      return false;
    }
  }
}

// Initialize data on first load
export const initializePersistentData = async (): Promise<boolean> => {
  if (USE_DYNAMODB) {
    console.log('🔄 Initializing DynamoDB data...');
    return await DynamoDbService.initializeData();
  } else {
    console.log('📱 Using localStorage for development');
    return true;
  }
};

// Export convenience functions that match existing API
export const getAnsweredQuestionIds = () => PersistentUserProgressService.getAnsweredQuestionIds();
export const addAnsweredQuestionId = (id: string) => PersistentUserProgressService.addAnsweredQuestionId(id);
export const getGeneratedQuestions = () => PersistentGeneratedQuestionsService.getGeneratedQuestions();
export const saveGeneratedQuestions = (questions: Question[]) => PersistentGeneratedQuestionsService.saveGeneratedQuestions(questions);

export default {
  PersistentUserProgressService,
  PersistentQuestionService,
  PersistentGeneratedQuestionsService,
  PersistentReadingPassagesService,
  initializePersistentData
};
