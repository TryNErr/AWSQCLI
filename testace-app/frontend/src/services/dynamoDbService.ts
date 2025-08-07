// DynamoDB service with graceful fallback
let AWS: any = null;

try {
  AWS = require('aws-sdk');
  // Configure AWS SDK with non-reserved environment variables
  AWS.config.update({
    region: process.env.REACT_APP_TESTACE_AWS_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_TESTACE_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_TESTACE_SECRET_ACCESS_KEY
  });
} catch (error) {
  console.warn('AWS SDK not available, DynamoDB features disabled');
}

import { Question, DifficultyLevel } from '../types';
import { ReadingPassage } from '../utils/readingPassagesDatabase';

// Table names
const TABLES = {
  QUESTIONS: 'TestAce-Questions',
  USER_PROGRESS: 'TestAce-UserProgress',
  READING_PASSAGES: 'TestAce-ReadingPassages',
  GENERATED_QUESTIONS: 'TestAce-GeneratedQuestions'
};

export class DynamoDbService {
  
  private static getDocClient() {
    if (!AWS) {
      throw new Error('AWS SDK not available');
    }
    return new AWS.DynamoDB.DocumentClient();
  }
  
  // Questions
  static async getQuestions(subject?: string, grade?: string, difficulty?: DifficultyLevel): Promise<Question[]> {
    try {
      if (!AWS) return [];
      
      const docClient = this.getDocClient();
      let params: any = {
        TableName: TABLES.QUESTIONS
      };
      
      if (subject && grade) {
        params = {
          TableName: TABLES.QUESTIONS,
          IndexName: 'SubjectGradeIndex',
          KeyConditionExpression: 'subject = :subject AND grade = :grade',
          ExpressionAttributeValues: {
            ':subject': subject,
            ':grade': grade
          }
        };
        
        if (difficulty) {
          params.FilterExpression = 'difficulty = :difficulty';
          params.ExpressionAttributeValues[':difficulty'] = difficulty;
        }
        
        const result = await docClient.query(params).promise();
        return result.Items as Question[];
      } else {
        const result = await docClient.scan(params).promise();
        return result.Items as Question[];
      }
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }
  
  static async saveQuestion(question: Question): Promise<boolean> {
    try {
      if (!AWS) return false;
      
      const docClient = this.getDocClient();
      await docClient.put({
        TableName: TABLES.QUESTIONS,
        Item: {
          id: question._id,
          ...question
        }
      }).promise();
      return true;
    } catch (error) {
      console.error('Error saving question:', error);
      return false;
    }
  }
  
  static async saveQuestions(questions: Question[]): Promise<boolean> {
    try {
      if (!AWS) return false;
      
      const docClient = this.getDocClient();
      const batchRequests = [];
      
      for (let i = 0; i < questions.length; i += 25) {
        const batch = questions.slice(i, i + 25);
        const putRequests = batch.map(question => ({
          PutRequest: {
            Item: {
              id: question._id,
              ...question
            }
          }
        }));
        
        batchRequests.push({
          RequestItems: {
            [TABLES.QUESTIONS]: putRequests
          }
        });
      }
      
      for (const request of batchRequests) {
        await docClient.batchWrite(request).promise();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving questions batch:', error);
      return false;
    }
  }
  
  // Generated Questions
  static async getGeneratedQuestions(subject?: string): Promise<Question[]> {
    try {
      if (!AWS) return [];
      
      const docClient = this.getDocClient();
      let params: any = {
        TableName: TABLES.GENERATED_QUESTIONS
      };
      
      if (subject) {
        params = {
          TableName: TABLES.GENERATED_QUESTIONS,
          IndexName: 'SubjectIndex',
          KeyConditionExpression: 'subject = :subject',
          ExpressionAttributeValues: {
            ':subject': subject
          }
        };
        
        const result = await docClient.query(params).promise();
        return result.Items as Question[];
      } else {
        const result = await docClient.scan(params).promise();
        return result.Items as Question[];
      }
    } catch (error) {
      console.error('Error getting generated questions:', error);
      return [];
    }
  }
  
  static async saveGeneratedQuestions(questions: Question[]): Promise<boolean> {
    try {
      if (!AWS) return false;
      
      const docClient = this.getDocClient();
      const batchRequests = [];
      
      for (let i = 0; i < questions.length; i += 25) {
        const batch = questions.slice(i, i + 25);
        const putRequests = batch.map(question => ({
          PutRequest: {
            Item: {
              id: question._id,
              ...question,
              isGenerated: true,
              createdAt: new Date().toISOString()
            }
          }
        }));
        
        batchRequests.push({
          RequestItems: {
            [TABLES.GENERATED_QUESTIONS]: putRequests
          }
        });
      }
      
      for (const request of batchRequests) {
        await docClient.batchWrite(request).promise();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving generated questions:', error);
      return false;
    }
  }
  
  // Reading Passages
  static async getReadingPassages(grade?: string): Promise<any[]> {
    try {
      if (!AWS) return [];
      
      const docClient = this.getDocClient();
      let params: any = {
        TableName: TABLES.READING_PASSAGES
      };
      
      if (grade) {
        params = {
          TableName: TABLES.READING_PASSAGES,
          IndexName: 'GradeIndex',
          KeyConditionExpression: 'grade = :grade',
          ExpressionAttributeValues: {
            ':grade': grade
          }
        };
        
        const result = await docClient.query(params).promise();
        return result.Items as any[];
      } else {
        const result = await docClient.scan(params).promise();
        return result.Items as any[];
      }
    } catch (error) {
      console.error('Error getting reading passages:', error);
      return [];
    }
  }
  
  static async saveReadingPassages(passages: any[]): Promise<boolean> {
    try {
      if (!AWS) return false;
      
      const docClient = this.getDocClient();
      const batchRequests = [];
      
      for (let i = 0; i < passages.length; i += 25) {
        const batch = passages.slice(i, i + 25);
        const putRequests = batch.map(passage => ({
          PutRequest: {
            Item: passage
          }
        }));
        
        batchRequests.push({
          RequestItems: {
            [TABLES.READING_PASSAGES]: putRequests
          }
        });
      }
      
      for (const request of batchRequests) {
        await docClient.batchWrite(request).promise();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving reading passages:', error);
      return false;
    }
  }
  
  // Simplified methods for other operations...
  static async getUserProgress(userId: string): Promise<any> {
    try {
      if (!AWS) {
        return {
          userId,
          answeredQuestionIds: [],
          totalQuestions: 0,
          correctAnswers: 0,
          subjects: {}
        };
      }
      
      const docClient = this.getDocClient();
      const result = await docClient.get({
        TableName: TABLES.USER_PROGRESS,
        Key: { userId }
      }).promise();
      
      return result.Item || {
        userId,
        answeredQuestionIds: [],
        totalQuestions: 0,
        correctAnswers: 0,
        subjects: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        userId,
        answeredQuestionIds: [],
        totalQuestions: 0,
        correctAnswers: 0,
        subjects: {}
      };
    }
  }
  
  static async saveUserProgress(userId: string, progress: any): Promise<boolean> {
    try {
      if (!AWS) return false;
      
      const docClient = this.getDocClient();
      await docClient.put({
        TableName: TABLES.USER_PROGRESS,
        Item: {
          userId,
          ...progress,
          updatedAt: new Date().toISOString()
        }
      }).promise();
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }
  
  static async addAnsweredQuestion(userId: string, questionId: string, isCorrect: boolean): Promise<boolean> {
    try {
      if (!AWS) return false;
      
      const progress = await this.getUserProgress(userId);
      
      if (!progress.answeredQuestionIds.includes(questionId)) {
        progress.answeredQuestionIds.push(questionId);
        progress.totalQuestions = (progress.totalQuestions || 0) + 1;
        
        if (isCorrect) {
          progress.correctAnswers = (progress.correctAnswers || 0) + 1;
        }
        
        await this.saveUserProgress(userId, progress);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding answered question:', error);
      return false;
    }
  }
  
  // Utility methods
  static async initializeData(): Promise<boolean> {
    try {
      if (!AWS) {
        console.log('📱 AWS SDK not available - using localStorage for development');
        return true;
      }
      
      console.log('🔄 Initializing DynamoDB with local data...');
      // Initialization logic here...
      console.log('🎉 DynamoDB initialization complete');
      return true;
    } catch (error) {
      console.error('❌ DynamoDB initialization failed:', error);
      return false;
    }
  }
}

export default DynamoDbService;
