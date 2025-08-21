import { Question, DifficultyLevel } from '../types';

// Cache for loaded questions to avoid repeated fetches
const questionCache = new Map<string, Question[]>();

/**
 * Loads questions from static JSON files in the public/questions directory
 */
export class StaticQuestionLoader {
  
  /**
   * Load questions for a specific grade, difficulty, and subject
   */
  static async loadQuestions(grade: number, difficulty: DifficultyLevel, subject: string): Promise<Question[]> {
    const cacheKey = `${grade}_${difficulty}_${subject}`;
    
    // Check cache first
    if (questionCache.has(cacheKey)) {
      return questionCache.get(cacheKey)!;
    }
    
    try {
      const filename = `${grade}_${difficulty}_${subject}.json`;
      const response = await fetch(`/questions/${filename}`);
      
      if (!response.ok) {
        console.warn(`Failed to load questions from ${filename}: ${response.status}`);
        return [];
      }
      
      const questions: any[] = await response.json();
      
      // Validate and normalize questions
      const validQuestions: Question[] = questions.filter(q => 
        q._id && 
        q.content && 
        q.options && 
        q.correctAnswer &&
        q.subject &&
        q.grade &&
        q.difficulty
      ).map(q => ({
        ...q,
        // Ensure consistent field names and types
        subject: this.normalizeSubject(q.subject),
        grade: q.grade.toString(), // Convert to string to match Question type
        difficulty: q.difficulty as DifficultyLevel
      }));
      
      // Cache the results
      questionCache.set(cacheKey, validQuestions);
      
      console.log(`✅ Loaded ${validQuestions.length} questions for Grade ${grade} ${difficulty} ${subject}`);
      return validQuestions;
      
    } catch (error) {
      console.error(`Error loading questions for ${cacheKey}:`, error);
      return [];
    }
  }
  
  /**
   * Load all questions for a specific grade and difficulty across all subjects
   */
  static async loadAllSubjects(grade: number, difficulty: DifficultyLevel): Promise<Question[]> {
    const subjects = ['math', 'english', 'reading', 'thinking-skills', 'mathematical-reasoning'];
    const allQuestions: Question[] = [];
    
    for (const subject of subjects) {
      const questions = await this.loadQuestions(grade, difficulty, subject);
      allQuestions.push(...questions);
    }
    
    return allQuestions;
  }
  
  /**
   * Get questions with filtering
   */
  static async getQuestions(filters: {
    grade?: number;
    difficulty?: DifficultyLevel;
    subject?: string;
    count?: number;
  } = {}): Promise<Question[]> {
    const { grade, difficulty, subject, count } = filters;
    
    let questions: Question[] = [];
    
    if (grade && difficulty && subject) {
      // Load specific combination
      questions = await this.loadQuestions(grade, difficulty, subject);
    } else if (grade && difficulty) {
      // Load all subjects for grade/difficulty
      questions = await this.loadAllSubjects(grade, difficulty);
    } else {
      // Load multiple combinations
      const grades = grade ? [grade] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const difficulties = difficulty ? [difficulty] : ['easy', 'medium', 'hard'] as DifficultyLevel[];
      const subjects = subject ? [subject] : ['math', 'english', 'reading', 'thinking-skills', 'mathematical-reasoning'];
      
      for (const g of grades) {
        for (const d of difficulties) {
          for (const s of subjects) {
            const qs = await this.loadQuestions(g, d, s);
            questions.push(...qs);
          }
        }
      }
    }
    
    // Apply additional filtering
    let filteredQuestions = questions;
    
    if (subject && !filters.subject) {
      filteredQuestions = filteredQuestions.filter(q => 
        this.normalizeSubject(q.subject) === this.normalizeSubject(subject)
      );
    }
    
    // Shuffle and limit if count specified
    if (count && count > 0) {
      filteredQuestions = this.shuffleArray([...filteredQuestions]).slice(0, count);
    }
    
    return filteredQuestions;
  }
  
  /**
   * Get random questions
   */
  static async getRandomQuestions(options: {
    count?: number;
    grade?: number;
    difficulty?: DifficultyLevel;
    subject?: string;
  } = {}): Promise<Question[]> {
    const { count = 10, ...filters } = options;
    const questions = await this.getQuestions({ ...filters, count });
    return this.shuffleArray(questions).slice(0, count);
  }
  
  /**
   * Check if questions are available for specific criteria
   */
  static async areQuestionsAvailable(grade: number, difficulty: DifficultyLevel, subject: string): Promise<boolean> {
    const questions = await this.loadQuestions(grade, difficulty, subject);
    return questions.length > 0;
  }
  
  /**
   * Get available subjects for a grade/difficulty
   */
  static async getAvailableSubjects(grade: number, difficulty: DifficultyLevel): Promise<string[]> {
    const subjects = ['math', 'english', 'reading', 'thinking-skills', 'mathematical-reasoning'];
    const availableSubjects: string[] = [];
    
    for (const subject of subjects) {
      const isAvailable = await this.areQuestionsAvailable(grade, difficulty, subject);
      if (isAvailable) {
        availableSubjects.push(subject);
      }
    }
    
    return availableSubjects;
  }
  
  /**
   * Clear cache (useful for development/testing)
   */
  static clearCache(): void {
    questionCache.clear();
    console.log('📝 Question cache cleared');
  }
  
  /**
   * Normalize subject names to match file naming convention
   */
  private static normalizeSubject(subject: string): string {
    const normalized = subject.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    // Handle common variations
    const subjectMap: { [key: string]: string } = {
      'mathematics': 'math',
      'maths': 'math',
      'language': 'english',
      'language-arts': 'english',
      'comprehension': 'reading',
      'reading-comprehension': 'reading',
      'critical-thinking': 'thinking-skills',
      'logic': 'thinking-skills',
      'reasoning': 'mathematical-reasoning',
      'math-reasoning': 'mathematical-reasoning'
    };
    
    return subjectMap[normalized] || normalized;
  }
  
  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Export convenience functions
export const loadQuestions = (grade: number, difficulty: DifficultyLevel, subject: string) => 
  StaticQuestionLoader.loadQuestions(grade, difficulty, subject);

export const getQuestions = (filters: Parameters<typeof StaticQuestionLoader.getQuestions>[0] = {}) => 
  StaticQuestionLoader.getQuestions(filters);

export const getRandomQuestions = (options: Parameters<typeof StaticQuestionLoader.getRandomQuestions>[0] = {}) => 
  StaticQuestionLoader.getRandomQuestions(options);

export const areQuestionsAvailable = (grade: number, difficulty: DifficultyLevel, subject: string) => 
  StaticQuestionLoader.areQuestionsAvailable(grade, difficulty, subject);

export default StaticQuestionLoader;
