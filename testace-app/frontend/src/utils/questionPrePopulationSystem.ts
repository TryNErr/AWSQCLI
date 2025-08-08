import { Question, DifficultyLevel } from '../types';
import DiverseMathGenerator from './diverseMathGenerator';
import BulletproofMathGenerator from './bulletproofMathGenerator';
import { generateRobustThinkingSkillsQuestions } from './robustThinkingSkillsGenerator';
import { comprehensiveReadingDatabase } from './comprehensiveReadingDatabase';

/**
 * QUESTION PRE-POPULATION SYSTEM
 * 
 * Pre-generates questions for all common combinations at server startup
 * to eliminate on-the-fly generation delays and hanging issues.
 * 
 * Benefits:
 * - Instant question loading (no generation delays)
 * - No hanging issues during user selection
 * - Predictable performance
 * - Better user experience
 */

interface QuestionCombination {
  grade: string;
  difficulty: DifficultyLevel;
  subject: string;
  count: number;
}

interface PrePopulatedQuestions {
  [key: string]: Question[]; // key format: "grade_difficulty_subject"
}

export class QuestionPrePopulationSystem {
  private static prePopulatedQuestions: PrePopulatedQuestions = {};
  private static isInitialized = false;
  private static initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the pre-population system - call this at app startup
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private static async performInitialization(): Promise<void> {
    console.log('🚀 Starting Question Pre-Population System...');
    const startTime = Date.now();

    // Define all combinations to pre-populate
    const combinations = this.getCommonCombinations();
    
    console.log(`📊 Pre-populating ${combinations.length} question combinations...`);

    // Pre-populate all combinations
    for (const combo of combinations) {
      try {
        const key = this.getKey(combo.grade, combo.difficulty, combo.subject);
        const questions = await this.generateQuestionsForCombination(combo);
        this.prePopulatedQuestions[key] = questions;
        
        console.log(`✅ Pre-populated ${questions.length} questions for ${key}`);
      } catch (error) {
        console.error(`❌ Failed to pre-populate ${combo.grade}-${combo.difficulty}-${combo.subject}:`, error);
        // Continue with other combinations even if one fails
      }
    }

    const endTime = Date.now();
    const totalQuestions = Object.values(this.prePopulatedQuestions).reduce((sum, questions) => sum + questions.length, 0);
    
    console.log(`🎉 Pre-population complete!`);
    console.log(`   - Total combinations: ${Object.keys(this.prePopulatedQuestions).length}`);
    console.log(`   - Total questions: ${totalQuestions}`);
    console.log(`   - Time taken: ${endTime - startTime}ms`);

    this.isInitialized = true;
  }

  /**
   * Get pre-populated questions instantly (no generation delay)
   */
  static getQuestions(grade: string, difficulty: DifficultyLevel, subject?: string, count: number = 20): Question[] {
    if (!this.isInitialized) {
      console.warn('⚠️ Pre-population system not initialized. Falling back to on-demand generation.');
      return [];
    }

    const normalizedSubject = this.normalizeSubject(subject || 'math');
    const key = this.getKey(grade, difficulty, normalizedSubject);
    
    const questions = this.prePopulatedQuestions[key] || [];
    
    if (questions.length === 0) {
      console.warn(`⚠️ No pre-populated questions found for ${key}`);
      return [];
    }

    // Return shuffled subset
    const shuffled = this.shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Check if questions are available for a combination
   */
  static hasQuestions(grade: string, difficulty: DifficultyLevel, subject?: string): boolean {
    if (!this.isInitialized) return false;
    
    const normalizedSubject = this.normalizeSubject(subject || 'math');
    const key = this.getKey(grade, difficulty, normalizedSubject);
    
    return (this.prePopulatedQuestions[key]?.length || 0) > 0;
  }

  /**
   * Get statistics about pre-populated questions
   */
  static getStatistics(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    
    for (const [key, questions] of Object.entries(this.prePopulatedQuestions)) {
      stats[key] = questions.length;
    }
    
    return stats;
  }

  /**
   * Define all common grade/difficulty/subject combinations
   */
  private static getCommonCombinations(): QuestionCombination[] {
    const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const difficulties = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD];
    const subjects = ['math', 'thinking skills', 'reading'];
    const questionsPerCombination = 25; // Generate 25 questions per combination

    const combinations: QuestionCombination[] = [];

    for (const grade of grades) {
      for (const difficulty of difficulties) {
        for (const subject of subjects) {
          combinations.push({
            grade,
            difficulty,
            subject,
            count: questionsPerCombination
          });
        }
      }
    }

    return combinations;
  }

  /**
   * Generate questions for a specific combination
   */
  private static async generateQuestionsForCombination(combo: QuestionCombination): Promise<Question[]> {
    const { grade, difficulty, subject, count } = combo;
    const questions: Question[] = [];

    try {
      if (subject === 'math') {
        // Generate diverse math questions
        for (let i = 0; i < count; i++) {
          try {
            const question = DiverseMathGenerator.generateQuestion(grade, difficulty);
            questions.push(question);
          } catch (error) {
            // Fallback to bulletproof generator
            try {
              const question = BulletproofMathGenerator.generateQuestion(grade, difficulty);
              questions.push(question);
            } catch (fallbackError) {
              console.warn(`Failed to generate math question ${i} for ${grade}-${difficulty}:`, fallbackError);
            }
          }
        }
      } else if (subject === 'thinking skills') {
        // Generate thinking skills questions in batches
        const batchSize = 5;
        const batches = Math.ceil(count / batchSize);
        
        for (let batch = 0; batch < batches; batch++) {
          const batchCount = Math.min(batchSize, count - questions.length);
          try {
            const batchQuestions = generateRobustThinkingSkillsQuestions(grade, difficulty, batchCount);
            questions.push(...batchQuestions);
          } catch (error) {
            console.warn(`Failed to generate thinking skills batch ${batch} for ${grade}-${difficulty}:`, error);
          }
        }
      } else if (subject === 'reading') {
        // Generate reading questions from passages
        const gradeNum = parseInt(grade);
        const suitablePassages = comprehensiveReadingDatabase.filter(passage => {
          const passageGrade = parseInt(passage.grade);
          return Math.abs(passageGrade - gradeNum) <= 1;
        });

        if (suitablePassages.length > 0) {
          for (let i = 0; i < count && questions.length < count; i++) {
            try {
              const passage = suitablePassages[i % suitablePassages.length];
              const questionFromPassage = passage.questions[Math.floor(Math.random() * passage.questions.length)];
              
              const question: Question = {
                _id: `pre_reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                content: `${passage.title}\n\n${passage.passage}\n\nQuestion: ${questionFromPassage.content}`,
                type: questionFromPassage.type,
                options: questionFromPassage.options,
                correctAnswer: questionFromPassage.correctAnswer,
                explanation: questionFromPassage.explanation,
                subject: 'Reading',
                topic: passage.genre,
                difficulty,
                grade,
                tags: ['reading', 'comprehension', 'pre-populated'],
                createdBy: 'pre-population-system',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              questions.push(question);
            } catch (error) {
              console.warn(`Failed to generate reading question ${i} for ${grade}-${difficulty}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error generating questions for ${grade}-${difficulty}-${subject}:`, error);
    }

    // Ensure we have at least some questions, even if not the full count
    if (questions.length === 0) {
      console.warn(`No questions generated for ${grade}-${difficulty}-${subject}, creating emergency math questions`);
      
      // Emergency fallback: generate basic math questions
      for (let i = 0; i < Math.min(count, 10); i++) {
        try {
          const question = BulletproofMathGenerator.generateQuestion(grade, difficulty);
          question.subject = subject; // Keep original subject for filtering
          question.tags = [...(question.tags || []), 'emergency', 'pre-populated'];
          questions.push(question);
        } catch (error) {
          console.error(`Emergency question generation failed:`, error);
          break;
        }
      }
    }

    return questions;
  }

  /**
   * Generate a unique key for grade/difficulty/subject combination
   */
  private static getKey(grade: string, difficulty: DifficultyLevel, subject: string): string {
    return `${grade}_${difficulty}_${subject}`;
  }

  /**
   * Normalize subject names
   */
  private static normalizeSubject(subject: string): string {
    const normalized = subject.toLowerCase().trim();
    
    if (normalized.includes('math')) return 'math';
    if (normalized.includes('thinking')) return 'thinking skills';
    if (normalized.includes('reading')) return 'reading';
    
    return 'math'; // Default fallback
  }

  /**
   * Shuffle array utility
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  /**
   * Force refresh of pre-populated questions (for admin use)
   */
  static async refresh(): Promise<void> {
    console.log('🔄 Refreshing pre-populated questions...');
    this.prePopulatedQuestions = {};
    this.isInitialized = false;
    this.initializationPromise = null;
    
    await this.initialize();
  }

  /**
   * Get memory usage statistics
   */
  static getMemoryUsage(): { combinations: number; totalQuestions: number; estimatedMemoryMB: number } {
    const combinations = Object.keys(this.prePopulatedQuestions).length;
    const totalQuestions = Object.values(this.prePopulatedQuestions).reduce((sum, questions) => sum + questions.length, 0);
    
    // Rough estimate: ~2KB per question
    const estimatedMemoryMB = (totalQuestions * 2) / 1024;
    
    return {
      combinations,
      totalQuestions,
      estimatedMemoryMB: Math.round(estimatedMemoryMB * 100) / 100
    };
  }
}

export default QuestionPrePopulationSystem;
