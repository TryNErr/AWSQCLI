import { Question, DifficultyLevel } from '../types';
// import DiverseMathGenerator from './diverseMathGenerator'; // DISABLED - using static JSON files only
import BulletproofMathGenerator from './bulletproofMathGenerator';
import { generateRobustThinkingSkillsQuestions } from './robustThinkingSkillsGenerator';
import { comprehensiveReadingDatabase } from './comprehensiveReadingDatabase';

/**
 * LAZY QUESTION LOADER
 * 
 * Simple solution that generates questions in small batches as needed
 * instead of pre-generating everything at startup.
 * 
 * Benefits:
 * - Fast app startup (no blocking)
 * - Generates questions on-demand in small batches
 * - Caches generated questions for reuse
 * - Much lighter than pre-population
 */

interface QuestionCache {
  [key: string]: Question[]; // key format: "grade_difficulty_subject"
}

interface GenerationRequest {
  grade: string;
  difficulty: DifficultyLevel;
  subject: string;
  count: number;
}

export class LazyQuestionLoader {
  private static cache: QuestionCache = {};
  private static generationPromises: Map<string, Promise<Question[]>> = new Map();

  /**
   * Get questions with lazy loading - generates only what's needed
   */
  static async getQuestions(grade: string, difficulty: DifficultyLevel, subject?: string, count: number = 20): Promise<Question[]> {
    const normalizedSubject = this.normalizeSubject(subject || 'math');
    const key = this.getKey(grade, difficulty, normalizedSubject);
    
    // Check cache first
    const cached = this.cache[key] || [];
    if (cached.length >= count) {
      console.log(`📦 Using ${cached.length} cached questions for ${key}`);
      return this.shuffleArray([...cached]).slice(0, count);
    }
    
    // Check if generation is already in progress
    if (this.generationPromises.has(key)) {
      console.log(`⏳ Waiting for ongoing generation for ${key}`);
      const generated = await this.generationPromises.get(key)!;
      return this.shuffleArray([...generated]).slice(0, count);
    }
    
    // Generate new questions
    console.log(`🔧 Generating questions for ${key} (cached: ${cached.length}, needed: ${count})`);
    const generationPromise = this.generateQuestions({
      grade,
      difficulty,
      subject: normalizedSubject,
      count: Math.max(count, 15) // Generate a few extra for future use
    });
    
    this.generationPromises.set(key, generationPromise);
    
    try {
      const generated = await generationPromise;
      
      // Cache the results
      this.cache[key] = [...cached, ...generated];
      
      console.log(`✅ Generated and cached ${generated.length} questions for ${key}`);
      
      return this.shuffleArray([...generated]).slice(0, count);
      
    } finally {
      this.generationPromises.delete(key);
    }
  }

  /**
   * Generate questions for a specific combination
   */
  private static async generateQuestions(request: GenerationRequest): Promise<Question[]> {
    const { grade, difficulty, subject, count } = request;
    const questions: Question[] = [];
    const maxAttempts = count * 3; // Reasonable limit
    let attempts = 0;

    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      
      try {
        let newQuestion: Question | null = null;

        if (subject === 'math') {
          // Generate math questions
          try {
            newQuestion = null as any; // Disabled: generateQuestion - using static JSON files only
          } catch (error) {
            newQuestion = BulletproofMathGenerator.generateQuestion(grade, difficulty);
          }
        } else if (subject === 'thinking skills') {
          // Generate thinking skills questions in small batches
          const batchSize = Math.min(3, count - questions.length);
          try {
            const batch = generateRobustThinkingSkillsQuestions(grade, difficulty, batchSize);
            questions.push(...batch);
            continue; // Skip individual question processing
          } catch (error) {
            console.warn('Thinking skills generation failed:', error);
            // Fallback to math question
            try {
              newQuestion = null as any; // Disabled: generateQuestion - using static JSON files only
              if (newQuestion && newQuestion !== null) {
                newQuestion.subject = 'Thinking Skills';
                newQuestion.topic = 'Problem Solving';
              }
            } catch (mathError) {
              console.warn('Math fallback also failed:', mathError);
            }
          }
        } else if (subject === 'reading') {
          // Generate reading questions
          newQuestion = this.generateReadingQuestion(grade, difficulty);
          if (!newQuestion) {
            // Fallback to math question
            try {
              newQuestion = null as any; // Disabled: generateQuestion - using static JSON files only
              if (newQuestion && newQuestion !== null) {
                newQuestion.subject = 'Reading';
                newQuestion.topic = 'Reading Comprehension';
              }
            } catch (mathError) {
              console.warn('Reading fallback failed:', mathError);
            }
          }
        }

        if (newQuestion && newQuestion !== null) {
          // Check for duplicates
          const isDuplicate = questions.some(q => 
            q.content.toLowerCase().trim() === newQuestion!.content.toLowerCase().trim()
          );
          
          if (!isDuplicate) {
            questions.push(newQuestion);
          }
        }

      } catch (error) {
        console.warn(`Question generation attempt ${attempts} failed:`, error);
      }
    }

    if (questions.length === 0) {
      console.warn(`Failed to generate any questions for ${grade}-${difficulty}-${subject}`);
      // Emergency: generate at least one basic math question
      try {
        const emergency = BulletproofMathGenerator.generateQuestion(grade, difficulty);
        emergency.subject = subject;
        emergency.tags = [...(emergency.tags || []), 'emergency'];
        questions.push(emergency);
      } catch (emergencyError) {
        console.error('Emergency question generation failed:', emergencyError);
      }
    }

    return questions;
  }

  /**
   * Generate reading question from passages
   */
  private static generateReadingQuestion(grade: string, difficulty: DifficultyLevel): Question | null {
    try {
      const gradeNum = parseInt(grade);
      const suitablePassages = comprehensiveReadingDatabase.filter(passage => {
        const passageGrade = parseInt(passage.grade);
        return Math.abs(passageGrade - gradeNum) <= 1;
      });

      if (suitablePassages.length === 0) return null;

      const passage = suitablePassages[Math.floor(Math.random() * suitablePassages.length)];
      const question = passage.questions[Math.floor(Math.random() * passage.questions.length)];

      return {
        _id: `lazy_reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: `${passage.title}\n\n${passage.passage}\n\nQuestion: ${question.content}`,
        type: question.type,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        subject: 'Reading',
        topic: passage.genre,
        difficulty,
        grade,
        tags: ['reading', 'comprehension', 'lazy-loaded'],
        createdBy: 'lazy-question-loader',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating reading question:', error);
      return null;
    }
  }

  /**
   * Clear cache for a specific combination (useful for testing)
   */
  static clearCache(grade?: string, difficulty?: DifficultyLevel, subject?: string): void {
    if (grade && difficulty && subject) {
      const key = this.getKey(grade, difficulty, this.normalizeSubject(subject));
      delete this.cache[key];
      console.log(`🗑️ Cleared cache for ${key}`);
    } else {
      this.cache = {};
      console.log('🗑️ Cleared entire question cache');
    }
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

  /**
   * Preload questions for common combinations (optional, lightweight)
   */
  static async preloadCommon(): Promise<void> {
    const commonCombinations = [
      { grade: '9', difficulty: 'hard' as DifficultyLevel, subject: 'thinking skills' },
      { grade: '9', difficulty: 'medium' as DifficultyLevel, subject: 'math' },
      { grade: '10', difficulty: 'hard' as DifficultyLevel, subject: 'math' },
      // Add more common combinations as needed
    ];

    console.log('🔄 Preloading common question combinations...');
    
    const promises = commonCombinations.map(combo => 
      this.getQuestions(combo.grade, combo.difficulty, combo.subject, 15)
        .catch(error => console.warn(`Preload failed for ${combo.grade}-${combo.difficulty}-${combo.subject}:`, error))
    );

    await Promise.all(promises);
    console.log('✅ Common combinations preloaded');
  }

  // Utility methods
  private static getKey(grade: string, difficulty: DifficultyLevel, subject: string): string {
    return `${grade}_${difficulty}_${subject}`;
  }

  private static normalizeSubject(subject: string): string {
    const normalized = subject.toLowerCase().trim();
    if (normalized.includes('math')) return 'math';
    if (normalized.includes('thinking')) return 'thinking skills';
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

export default LazyQuestionLoader;
