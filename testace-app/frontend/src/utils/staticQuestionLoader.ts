import { Question, DifficultyLevel } from '../types';

/**
 * STATIC QUESTION LOADER
 * 
 * Loads questions from pre-generated static JSON files.
 * This provides instant loading with no generation delays.
 * 
 * Benefits:
 * - Instant loading (no generation time)
 * - No hanging issues
 * - Predictable performance
 * - Build-time generation ensures quality
 */

interface QuestionManifest {
  generated: string;
  totalCombinations: number;
  totalQuestions: number;
  combinations: {
    [key: string]: {
      filename: string;
      count: number;
      generated: string;
    };
  };
}

interface QuestionCache {
  [key: string]: Question[];
}

export class StaticQuestionLoader {
  private static cache: QuestionCache = {};
  private static manifest: QuestionManifest | null = null;
  private static loadingPromises: Map<string, Promise<Question[]>> = new Map();

  /**
   * Load questions for a specific combination
   */
  static async getQuestions(
    grade: string, 
    difficulty: DifficultyLevel, 
    subject?: string, 
    count: number = 20
  ): Promise<Question[]> {
    const normalizedSubject = this.normalizeSubject(subject || 'math');
    const key = this.getKey(grade, difficulty, normalizedSubject);
    
    // Check cache first
    if (this.cache[key]) {
      console.log(`📦 Using cached questions for ${key}`);
      return this.selectQuestions(this.cache[key], count);
    }
    
    // Check if loading is in progress
    if (this.loadingPromises.has(key)) {
      console.log(`⏳ Waiting for ongoing load for ${key}`);
      const questions = await this.loadingPromises.get(key)!;
      return this.selectQuestions(questions, count);
    }
    
    // Load questions from file
    console.log(`📁 Loading questions from file for ${key}`);
    const loadPromise = this.loadQuestionsFromFile(key);
    this.loadingPromises.set(key, loadPromise);
    
    try {
      const questions = await loadPromise;
      this.cache[key] = questions;
      console.log(`✅ Loaded ${questions.length} questions for ${key}`);
      return this.selectQuestions(questions, count);
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  /**
   * Load questions from static JSON file
   */
  private static async loadQuestionsFromFile(key: string): Promise<Question[]> {
    try {
      const filename = `${key}.json`;
      const response = await fetch(`/questions/${filename}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load questions file: ${filename} (${response.status})`);
      }
      
      const questions: Question[] = await response.json();
      return questions;
      
    } catch (error) {
      console.error(`Failed to load questions for ${key}:`, error);
      
      // Return empty array - the system will fall back to generation
      return [];
    }
  }

  /**
   * Select and shuffle questions
   */
  private static selectQuestions(questions: Question[], count: number): Question[] {
    if (questions.length === 0) {
      return [];
    }
    
    const shuffled = this.shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Load the manifest file to see what's available
   */
  static async loadManifest(): Promise<QuestionManifest | null> {
    if (this.manifest) {
      return this.manifest;
    }
    
    try {
      const response = await fetch('/questions/manifest.json');
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }
      
      this.manifest = await response.json();
      console.log(`📋 Loaded question manifest: ${this.manifest?.totalQuestions} questions in ${this.manifest?.totalCombinations} combinations`);
      return this.manifest;
      
    } catch (error) {
      console.error('Failed to load question manifest:', error);
      return null;
    }
  }

  /**
   * Check if questions are available for a combination
   */
  static async hasQuestions(grade: string, difficulty: DifficultyLevel, subject?: string): Promise<boolean> {
    const manifest = await this.loadManifest();
    if (!manifest) return false;
    
    const normalizedSubject = this.normalizeSubject(subject || 'math');
    const key = this.getKey(grade, difficulty, normalizedSubject);
    
    return key in manifest.combinations;
  }

  /**
   * Get statistics about available questions
   */
  static async getStatistics(): Promise<{ [key: string]: number } | null> {
    const manifest = await this.loadManifest();
    if (!manifest) return null;
    
    const stats: { [key: string]: number } = {};
    for (const [key, info] of Object.entries(manifest.combinations)) {
      stats[key] = info.count;
    }
    
    return stats;
  }

  /**
   * Preload common combinations
   */
  static async preloadCommon(): Promise<void> {
    const commonCombinations = [
      { grade: '9', difficulty: 'hard' as DifficultyLevel, subject: 'thinking-skills' },
      { grade: '9', difficulty: 'medium' as DifficultyLevel, subject: 'math' },
      { grade: '10', difficulty: 'hard' as DifficultyLevel, subject: 'math' },
      { grade: '8', difficulty: 'medium' as DifficultyLevel, subject: 'reading' },
      { grade: '11', difficulty: 'hard' as DifficultyLevel, subject: 'thinking-skills' },
    ];

    console.log('🔄 Preloading common question combinations...');
    
    const promises = commonCombinations.map(combo => 
      this.getQuestions(combo.grade, combo.difficulty, combo.subject, 15)
        .catch(error => console.warn(`Preload failed for ${combo.grade}-${combo.difficulty}-${combo.subject}:`, error))
    );

    await Promise.all(promises);
    console.log('✅ Common combinations preloaded');
  }

  /**
   * Clear cache (useful for testing)
   */
  static clearCache(): void {
    this.cache = {};
    this.manifest = null;
    console.log('🗑️ Cleared static question cache');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    for (const [key, questions] of Object.entries(this.cache)) {
      stats[key] = questions.length;
    }
    return stats;
  }

  // Utility methods
  private static getKey(grade: string, difficulty: DifficultyLevel, subject: string): string {
    return `${grade}_${difficulty}_${subject}`;
  }

  private static normalizeSubject(subject: string): string {
    const normalized = subject.toLowerCase().trim();
    if (normalized.includes('math')) return 'math';
    if (normalized.includes('thinking')) return 'thinking-skills';
    if (normalized.includes('reading')) return 'reading';
    return 'math';
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

export default StaticQuestionLoader;
