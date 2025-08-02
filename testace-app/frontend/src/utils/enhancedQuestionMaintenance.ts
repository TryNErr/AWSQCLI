import { Question, DifficultyLevel } from '../types';
import { generateEnhancedQuestion } from './enhancedQuestionSystem';
import { validateAnswer } from './enhancedAnswerValidation';
import { questionData } from '../pages/Practice/questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../services/generatedQuestionsService';
import { getAnsweredQuestionIds } from '../services/userProgressService';

/**
 * Enhanced Question Maintenance System
 * Ensures grade and difficulty selections are maintained throughout practice sessions
 * Generates new questions when needed instead of falling back to random questions
 */

interface QuestionGenerationConfig {
  grade: string;
  difficulty: DifficultyLevel;
  subject?: string;
  minQuestionsRequired: number;
  maxQuestionsToGenerate: number;
}

interface QuestionPool {
  available: Question[];
  generated: Question[];
  total: number;
  needsGeneration: boolean;
}

export class EnhancedQuestionMaintenance {
  
  /**
   * Maintains a consistent pool of questions for the specified criteria
   * Generates new questions when the pool runs low
   */
  static async maintainQuestionPool(config: QuestionGenerationConfig): Promise<QuestionPool> {
    const { grade, difficulty, subject, minQuestionsRequired, maxQuestionsToGenerate } = config;
    
    console.log(`Maintaining question pool for Grade ${grade}, ${difficulty} difficulty${subject ? `, ${subject}` : ''}`);
    
    // Get all existing questions (static + generated)
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    // Apply STRICT filtering - only questions matching EXACT criteria
    const availableQuestions = allQuestions.filter(q => {
      const gradeMatch = q.grade === grade;
      const difficultyMatch = q.difficulty === difficulty;
      const subjectMatch = !subject || q.subject === subject;
      const notAnswered = !answeredQuestionIds.includes(q._id);
      
      return gradeMatch && difficultyMatch && subjectMatch && notAnswered;
    });
    
    console.log(`Found ${availableQuestions.length} existing questions matching criteria`);
    
    let generatedQuestions: Question[] = [];
    let needsGeneration = availableQuestions.length < minQuestionsRequired;
    
    if (needsGeneration) {
      const questionsToGenerate = Math.min(
        maxQuestionsToGenerate,
        minQuestionsRequired - availableQuestions.length
      );
      
      console.log(`Generating ${questionsToGenerate} new questions to maintain pool`);
      
      generatedQuestions = await this.generateQuestionsForCriteria({
        grade,
        difficulty,
        subject,
        count: questionsToGenerate
      });
      
      // Validate all generated questions before adding to pool
      const validatedQuestions = this.validateGeneratedQuestions(generatedQuestions);
      
      // Save validated questions to localStorage
      const existingGenerated = getGeneratedQuestions();
      saveGeneratedQuestions([...existingGenerated, ...validatedQuestions]);
      
      console.log(`Generated and validated ${validatedQuestions.length} new questions`);
    }
    
    const totalAvailable = [...availableQuestions, ...generatedQuestions];
    
    return {
      available: availableQuestions,
      generated: generatedQuestions,
      total: totalAvailable.length,
      needsGeneration: totalAvailable.length < minQuestionsRequired
    };
  }
  
  /**
   * Generates questions for specific criteria with enhanced validation
   */
  private static async generateQuestionsForCriteria(config: {
    grade: string;
    difficulty: DifficultyLevel;
    subject?: string;
    count: number;
  }): Promise<Question[]> {
    const { grade, difficulty, subject, count } = config;
    const newQuestions: Question[] = [];
    const maxAttempts = count * 3; // Allow multiple attempts per question
    let attempts = 0;
    
    while (newQuestions.length < count && attempts < maxAttempts) {
      attempts++;
      
      try {
        let question: Question;
        
        if (subject) {
          // Generate for specific subject
          question = generateEnhancedQuestion(grade, subject, difficulty);
        } else {
          // Distribute across all available subjects
          const subjects = ['Math', 'English', 'Thinking Skills'];
          const selectedSubject = subjects[newQuestions.length % subjects.length];
          question = generateEnhancedQuestion(grade, selectedSubject, difficulty);
        }
        
        // Ensure question meets exact criteria
        if (this.validateQuestionCriteria(question, grade, difficulty, subject)) {
          // Add generation metadata
          question.isGenerated = true;
          question.generatedAt = new Date();
          question.generationMethod = 'enhanced-maintenance';
          
          // Validate the answer is correct
          if (this.validateQuestionAnswer(question)) {
            newQuestions.push(question);
            console.log(`Generated valid question ${newQuestions.length}/${count}: ${question.content.substring(0, 50)}...`);
          } else {
            console.warn(`Generated question has invalid answer, skipping: ${question.content.substring(0, 50)}...`);
          }
        } else {
          console.warn(`Generated question doesn't match criteria, skipping: ${question.content.substring(0, 50)}...`);
        }
      } catch (error) {
        console.error(`Error generating question (attempt ${attempts}):`, error);
      }
    }
    
    if (newQuestions.length < count) {
      console.warn(`Only generated ${newQuestions.length} out of ${count} requested questions after ${attempts} attempts`);
    }
    
    return newQuestions;
  }
  
  /**
   * Validates that a question meets the exact criteria
   */
  private static validateQuestionCriteria(
    question: Question,
    grade: string,
    difficulty: DifficultyLevel,
    subject?: string
  ): boolean {
    const gradeMatch = question.grade === grade;
    const difficultyMatch = question.difficulty === difficulty;
    const subjectMatch = !subject || question.subject === subject;
    
    return gradeMatch && difficultyMatch && subjectMatch;
  }
  
  /**
   * Validates that a question's answer is correct
   */
  private static validateQuestionAnswer(question: Question): boolean {
    try {
      // Use the enhanced answer validation system
      const validation = validateAnswer(question, question.correctAnswer);
      
      // Question is valid if its own correct answer validates as correct
      return validation.isCorrect && validation.confidence > 0.8;
    } catch (error) {
      console.error('Error validating question answer:', error);
      return false;
    }
  }
  
  /**
   * Validates all generated questions and filters out invalid ones
   */
  private static validateGeneratedQuestions(questions: Question[]): Question[] {
    const validQuestions: Question[] = [];
    
    for (const question of questions) {
      // Check basic question structure
      if (!question.content || !question.correctAnswer || !question.options || question.options.length < 2) {
        console.warn(`Invalid question structure: ${question.content?.substring(0, 50)}...`);
        continue;
      }
      
      // Check that correct answer is in options
      if (!question.options.includes(question.correctAnswer)) {
        console.warn(`Correct answer not in options: ${question.content.substring(0, 50)}...`);
        continue;
      }
      
      // Validate the answer using enhanced validation
      if (!this.validateQuestionAnswer(question)) {
        console.warn(`Question answer validation failed: ${question.content.substring(0, 50)}...`);
        continue;
      }
      
      // Check for duplicate content
      const isDuplicate = validQuestions.some(vq => 
        vq.content.toLowerCase().trim() === question.content.toLowerCase().trim()
      );
      
      if (isDuplicate) {
        console.warn(`Duplicate question content: ${question.content.substring(0, 50)}...`);
        continue;
      }
      
      validQuestions.push(question);
    }
    
    console.log(`Validated ${validQuestions.length} out of ${questions.length} generated questions`);
    return validQuestions;
  }
  
  /**
   * Gets questions for practice session with strict criteria maintenance
   */
  static async getQuestionsForPractice(config: {
    grade: string;
    difficulty: DifficultyLevel;
    subject?: string;
    count: number;
  }): Promise<Question[]> {
    const { grade, difficulty, subject, count } = config;
    
    // Maintain question pool
    const pool = await this.maintainQuestionPool({
      grade,
      difficulty,
      subject,
      minQuestionsRequired: Math.max(count, 20), // Ensure we have enough questions
      maxQuestionsToGenerate: 30 // Generate extra questions for variety
    });
    
    // Get all available questions from the pool
    const allAvailable = [...pool.available, ...pool.generated];
    
    if (allAvailable.length === 0) {
      throw new Error(`No questions available for Grade ${grade}, ${difficulty} difficulty${subject ? `, ${subject}` : ''}`);
    }
    
    // Shuffle and return requested count
    const shuffled = this.shuffleArray(allAvailable);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    console.log(`Selected ${selected.length} questions for practice from pool of ${allAvailable.length}`);
    
    return selected;
  }
  
  /**
   * Monitors question pool health and triggers maintenance when needed
   */
  static async monitorQuestionPool(config: {
    grade: string;
    difficulty: DifficultyLevel;
    subject?: string;
  }): Promise<{
    status: 'healthy' | 'low' | 'critical';
    availableCount: number;
    recommendedAction: string;
  }> {
    const { grade, difficulty, subject } = config;
    
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    const availableQuestions = allQuestions.filter(q => {
      const gradeMatch = q.grade === grade;
      const difficultyMatch = q.difficulty === difficulty;
      const subjectMatch = !subject || q.subject === subject;
      const notAnswered = !answeredQuestionIds.includes(q._id);
      
      return gradeMatch && difficultyMatch && subjectMatch && notAnswered;
    });
    
    const count = availableQuestions.length;
    
    if (count >= 20) {
      return {
        status: 'healthy',
        availableCount: count,
        recommendedAction: 'No action needed'
      };
    } else if (count >= 10) {
      return {
        status: 'low',
        availableCount: count,
        recommendedAction: 'Consider generating more questions soon'
      };
    } else {
      return {
        status: 'critical',
        availableCount: count,
        recommendedAction: 'Generate questions immediately'
      };
    }
  }
  
  /**
   * Cleans up old or invalid generated questions
   */
  static cleanupGeneratedQuestions(): void {
    const generated = getGeneratedQuestions();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Remove questions older than a week or with invalid structure
    const validQuestions = generated.filter(q => {
      // Keep recent questions
      if (q.generatedAt && new Date(q.generatedAt) > oneWeekAgo) {
        return true;
      }
      
      // Keep questions with valid structure regardless of age
      return q.content && q.correctAnswer && q.options && q.options.length >= 2;
    });
    
    if (validQuestions.length !== generated.length) {
      console.log(`Cleaned up ${generated.length - validQuestions.length} old/invalid generated questions`);
      saveGeneratedQuestions(validQuestions);
    }
  }
  
  /**
   * Utility function to shuffle array
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
   * Gets statistics about question pool health
   */
  static getQuestionPoolStats(): {
    totalStatic: number;
    totalGenerated: number;
    byGrade: Record<string, number>;
    byDifficulty: Record<string, number>;
    bySubject: Record<string, number>;
  } {
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    
    const stats = {
      totalStatic: questionData.length,
      totalGenerated: getGeneratedQuestions().length,
      byGrade: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      bySubject: {} as Record<string, number>
    };
    
    allQuestions.forEach(q => {
      // Count by grade
      const grade = q.grade || 'unknown';
      stats.byGrade[grade] = (stats.byGrade[grade] || 0) + 1;
      
      // Count by difficulty
      const difficulty = q.difficulty || 'unknown';
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
      
      // Count by subject
      const subject = q.subject || 'unknown';
      stats.bySubject[subject] = (stats.bySubject[subject] || 0) + 1;
    });
    
    return stats;
  }
}

// Export convenience functions
export const maintainQuestionPool = (config: QuestionGenerationConfig) => 
  EnhancedQuestionMaintenance.maintainQuestionPool(config);

export const getQuestionsForPractice = (config: {
  grade: string;
  difficulty: DifficultyLevel;
  subject?: string;
  count: number;
}) => EnhancedQuestionMaintenance.getQuestionsForPractice(config);

export const monitorQuestionPool = (config: {
  grade: string;
  difficulty: DifficultyLevel;
  subject?: string;
}) => EnhancedQuestionMaintenance.monitorQuestionPool(config);

export const cleanupGeneratedQuestions = () => 
  EnhancedQuestionMaintenance.cleanupGeneratedQuestions();

export const getQuestionPoolStats = () => 
  EnhancedQuestionMaintenance.getQuestionPoolStats();

export default EnhancedQuestionMaintenance;
