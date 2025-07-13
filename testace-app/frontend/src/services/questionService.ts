import api from './authService';
import { Question, QuestionType, DifficultyLevel, PaginatedResponse } from '../types';

interface QuestionFilters {
  page?: number;
  limit?: number;
  subject?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  type?: QuestionType;
  search?: string;
}

interface RandomQuestionOptions {
  count?: number;
  subject?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  type?: QuestionType;
}

interface AdaptiveQuestionOptions {
  count?: number;
  difficulty?: DifficultyLevel;
}

export const questionService = {
  async getQuestions(filters: QuestionFilters = {}): Promise<PaginatedResponse<Question>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/questions?${params.toString()}`);
    return response.data;
  },

  async getQuestionById(id: string): Promise<Question> {
    const response = await api.get(`/questions/${id}`);
    return response.data.data;
  },

  async getRandomQuestions(options: RandomQuestionOptions = {}): Promise<Question[]> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/questions/random?${params.toString()}`);
    return response.data.data;
  },

  async getAdaptiveQuestions(options: AdaptiveQuestionOptions = {}): Promise<Question[]> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/questions/adaptive?${params.toString()}`);
    return response.data.data;
  },

  async createQuestion(questionData: Omit<Question, '_id' | 'createdBy' | 'createdAt'>): Promise<Question> {
    const response = await api.post('/questions', questionData);
    return response.data.data;
  },

  async updateQuestion(id: string, questionData: Partial<Question>): Promise<Question> {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data.data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await api.delete(`/questions/${id}`);
  },

  async getSubjects(): Promise<string[]> {
    const response = await api.get('/questions/meta/subjects');
    return response.data.data;
  },

  async getTopics(subject: string): Promise<string[]> {
    const response = await api.get(`/questions/meta/topics/${subject}`);
    return response.data.data;
  },

  async getQuestionStats(): Promise<any> {
    const response = await api.get('/questions/meta/stats');
    return response.data.data;
  },
};
