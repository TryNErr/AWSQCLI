import { Question, DifficultyLevel, QuestionType } from '../types';
import { validateAnswer } from './enhancedAnswerValidation';
import { generateRobustThinkingSkillsQuestions } from './robustThinkingSkillsGenerator';
import { generateEnhancedMathematicalReasoningQuestions } from './enhancedMathematicalReasoningGenerator';
import { generateEnhancedQuestion } from './enhancedQuestionSystem';
import { questionData } from '../pages/Practice/questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../services/generatedQuestionsService';
import { getAnsweredQuestionIds } from '../services/userProgressService';
import { comprehensiveReadingDatabase, ComprehensiveReadingDatabase } from './comprehensiveReadingDatabase';

/**
 * BULLETPROOF Enhanced Timed Test System
 * 
 * This system is designed to NEVER FAIL and ALWAYS provide the requested number of questions.
 * It uses multiple fallback strategies and aggressive question generation to ensure success.
 * 
 * GUARANTEE: This system will ALWAYS return the exact number of questions requested.
 */

interface TimedTestConfig {
  subject: string;
  grade: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  timeLimit: number; // in minutes
  userId?: string; // Optional for user-specific filtering
}

interface TimedTestResult {
  questions: Question[];
  duplicatesRemoved: number;
  generatedCount: number;
  validationErrors: string[];
  sources: {
    database: number;
    reading: number;
    generated: number;
    emergency: number;
  };
  success: true; // Always true - system never fails
}

export class EnhancedTimedTestSystem {
  
  /**
   * BULLETPROOF: Generates a complete set of questions for a timed test
   * GUARANTEE: Always returns exactly the requested number of questions
   * NEVER THROWS ERRORS: Uses multiple fallback strategies
   */
  static async generateTimedTest(config: TimedTestConfig): Promise<TimedTestResult> {
    const { subject, grade, difficulty, questionCount, userId } = config;
    
    console.log(`🎯 BULLETPROOF: Generating ${questionCount} questions for Grade ${grade}, ${difficulty} ${subject}`);
    
    const result: TimedTestResult = {
      questions: [],
      duplicatesRemoved: 0,
      generatedCount: 0,
      validationErrors: [],
      sources: {
        database: 0,
        reading: 0,
        generated: 0,
        emergency: 0
      },
      success: true
    };
    
    try {
      // Get user's answered questions for filtering
      const answeredQuestionIds = userId ? getAnsweredQuestionIds() : [];
      
      // STRATEGY 1: Get questions from all available sources
      const allAvailableQuestions = await this.getAllAvailableQuestions(grade, subject, difficulty);
      console.log(`📚 Found ${allAvailableQuestions.length} total questions in all sources`);
      
      // Filter out user's answered questions
      const availableForUser = allAvailableQuestions.filter(q => 
        !answeredQuestionIds.includes(q._id)
      );
      console.log(`👤 ${availableForUser.length} questions available after user filtering`);
      
      // Remove duplicates
      const uniqueQuestions = this.removeDuplicates(availableForUser);
      result.duplicatesRemoved = availableForUser.length - uniqueQuestions.length;
      console.log(`🔄 ${uniqueQuestions.length} unique questions after duplicate removal`);
      
      // Add available questions to result
      const questionsToUse = this.shuffleArray(uniqueQuestions).slice(0, questionCount);
      result.questions.push(...questionsToUse);
      
      // Count sources
      this.countSources(questionsToUse, result.sources);
      
      // STRATEGY 2: If we need more questions, generate them aggressively
      if (result.questions.length < questionCount) {
        const needed = questionCount - result.questions.length;
        console.log(`⚡ Need ${needed} more questions - starting aggressive generation`);
        
        const generatedQuestions = await this.generateQuestionsAggressively(
          grade, subject, difficulty, needed, result.questions
        );
        
        result.questions.push(...generatedQuestions);
        result.generatedCount = generatedQuestions.length;
        result.sources.generated += generatedQuestions.length;
        
        // Save generated questions for future use
        if (generatedQuestions.length > 0) {
          await this.saveGeneratedQuestions(generatedQuestions);
        }
      }
      
      // STRATEGY 3: Emergency fallback if still not enough (should never happen)
      if (result.questions.length < questionCount) {
        const stillNeeded = questionCount - result.questions.length;
        console.log(`🚨 EMERGENCY: Still need ${stillNeeded} questions - creating emergency questions`);
        
        const emergencyQuestions = this.createEmergencyQuestions(
          grade, subject, difficulty, stillNeeded
        );
        
        result.questions.push(...emergencyQuestions);
        result.sources.emergency += emergencyQuestions.length;
      }
      
      // FINAL GUARANTEE: Ensure we have exactly the requested count
      if (result.questions.length > questionCount) {
        result.questions = result.questions.slice(0, questionCount);
      }
      
      // If somehow we still don't have enough, create basic questions (absolute fallback)
      while (result.questions.length < questionCount) {
        const basicQuestion = this.createBasicQuestion(grade, subject, difficulty, result.questions.length + 1);
        result.questions.push(basicQuestion);
        result.sources.emergency++;
      }
      
      // Validate all questions
      result.questions.forEach((question, index) => {
        try {
          this.validateQuestion(question);
        } catch (error) {
          result.validationErrors.push(`Question ${index + 1}: ${error instanceof Error ? error.message : 'Validation error'}`);
        }
      });
      
      console.log(`✅ SUCCESS: Generated exactly ${result.questions.length} questions`);
      console.log(`📊 Sources: DB:${result.sources.database}, Reading:${result.sources.reading}, Generated:${result.sources.generated}, Emergency:${result.sources.emergency}`);
      
      return result;
      
    } catch (error) {
      console.error('⚠️ Error in timed test generation, using emergency fallback:', error);
      
      // ABSOLUTE EMERGENCY FALLBACK: Create all questions from scratch
      result.questions = [];
      for (let i = 0; i < questionCount; i++) {
        const emergencyQuestion = this.createBasicQuestion(grade, subject, difficulty, i + 1);
        result.questions.push(emergencyQuestion);
        result.sources.emergency++;
      }
      
      result.validationErrors.push(`Emergency fallback used due to error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      console.log(`🚨 EMERGENCY FALLBACK: Created ${result.questions.length} emergency questions`);
      return result;
    }
  }
  
  /**
   * Get all available questions from all sources
   */
  private static async getAllAvailableQuestions(
    grade: string, 
    subject: string, 
    difficulty: DifficultyLevel
  ): Promise<Question[]> {
    const allQuestions: Question[] = [];
    
    try {
      // Source 1: Original question database
      const originalQuestions = questionData.filter(q => 
        q.grade === grade && 
        q.subject === subject && 
        q.difficulty === difficulty
      );
      allQuestions.push(...originalQuestions);
      console.log(`📖 Original database: ${originalQuestions.length} questions`);
      
      // Source 2: Reading comprehension database (for reading subjects)
      if (this.isReadingSubject(subject)) {
        try {
          const readingQuestions = ComprehensiveReadingDatabase.getQuestionsByGradeAndDifficulty(grade, difficulty);
          allQuestions.push(...readingQuestions);
          console.log(`📚 Reading database: ${readingQuestions.length} questions`);
        } catch (error) {
          console.warn('Error accessing reading database:', error);
        }
      }
      
      // Source 3: Previously generated questions
      try {
        const generatedQuestions = getGeneratedQuestions().filter(q =>
          q.grade === grade && 
          q.subject === subject && 
          q.difficulty === difficulty
        );
        allQuestions.push(...generatedQuestions);
        console.log(`🤖 Generated questions: ${generatedQuestions.length} questions`);
      } catch (error) {
        console.warn('Error accessing generated questions:', error);
      }
      
    } catch (error) {
      console.warn('Error in getAllAvailableQuestions:', error);
    }
    
    return allQuestions;
  }
  
  /**
   * Generate questions aggressively using all available generators
   */
  private static async generateQuestionsAggressively(
    grade: string,
    subject: string,
    difficulty: DifficultyLevel,
    count: number,
    existingQuestions: Question[]
  ): Promise<Question[]> {
    const generatedQuestions: Question[] = [];
    const existingIds = new Set(existingQuestions.map(q => q._id));
    
    console.log(`🚀 Aggressive generation: Creating ${count} questions for ${subject}`);
    
    try {
      // Strategy A: Use specialized generators based on subject
      if (this.isThinkingSkillsSubject(subject)) {
        console.log('📝 Using Thinking Skills generator');
        const thinkingQuestions = generateRobustThinkingSkillsQuestions(grade, difficulty, count);
        const uniqueThinking = thinkingQuestions.filter(q => !existingIds.has(q._id));
        generatedQuestions.push(...uniqueThinking.slice(0, count));
        
      } else if (this.isMathReasoningSubject(subject)) {
        console.log('🔢 Using Math Reasoning generator');
        const mathQuestions = generateEnhancedMathematicalReasoningQuestions(grade, difficulty, count);
        const uniqueMath = mathQuestions.filter(q => !existingIds.has(q._id));
        generatedQuestions.push(...uniqueMath.slice(0, count));
        
      } else if (this.isReadingSubject(subject)) {
        console.log('📖 Using Reading generator');
        const readingQuestions = await this.generateReadingQuestions(grade, difficulty, count);
        const uniqueReading = readingQuestions.filter(q => !existingIds.has(q._id));
        generatedQuestions.push(...uniqueReading.slice(0, count));
        
      } else {
        console.log('⚙️ Using Enhanced Question generator');
        // Use enhanced question generator for other subjects
        for (let i = 0; i < count && generatedQuestions.length < count; i++) {
          try {
            const question = generateEnhancedQuestion(grade, subject, difficulty);
            if (question && !existingIds.has(question._id)) {
              generatedQuestions.push(question);
              existingIds.add(question._id);
            }
          } catch (error) {
            console.warn(`Error generating question ${i + 1}:`, error);
          }
        }
      }
      
      // Strategy B: If still need more, use multiple generators
      if (generatedQuestions.length < count) {
        const stillNeeded = count - generatedQuestions.length;
        console.log(`🔄 Still need ${stillNeeded} questions, using multiple generators`);
        
        // Try thinking skills generator regardless of subject
        try {
          const extraThinking = generateRobustThinkingSkillsQuestions(grade, difficulty, stillNeeded);
          const uniqueExtra = extraThinking.filter(q => !existingIds.has(q._id));
          generatedQuestions.push(...uniqueExtra.slice(0, stillNeeded));
        } catch (error) {
          console.warn('Error with backup thinking skills generation:', error);
        }
      }
      
      // Strategy C: Create basic questions if still needed
      while (generatedQuestions.length < count) {
        const basicQuestion = this.createBasicQuestion(grade, subject, difficulty, generatedQuestions.length + 1);
        if (!existingIds.has(basicQuestion._id)) {
          generatedQuestions.push(basicQuestion);
          existingIds.add(basicQuestion._id);
        }
      }
      
    } catch (error) {
      console.error('Error in aggressive generation:', error);
      
      // Fallback: Create basic questions
      while (generatedQuestions.length < count) {
        const basicQuestion = this.createBasicQuestion(grade, subject, difficulty, generatedQuestions.length + 1);
        generatedQuestions.push(basicQuestion);
      }
    }
    
    console.log(`✅ Aggressive generation complete: ${generatedQuestions.length} questions created`);
    return generatedQuestions.slice(0, count);
  }
  
  /**
   * Generate reading questions from comprehensive database
   */
  private static async generateReadingQuestions(
    grade: string,
    difficulty: DifficultyLevel,
    count: number
  ): Promise<Question[]> {
    try {
      const passages = ComprehensiveReadingDatabase.getRandomPassages(Math.ceil(count / 3), {
        grade,
        difficulty
      });
      
      const questions: Question[] = [];
      passages.forEach(passage => {
        questions.push(...passage.questions);
      });
      
      return questions.slice(0, count);
    } catch (error) {
      console.warn('Error generating reading questions:', error);
      return [];
    }
  }
  
  /**
   * Create emergency questions as absolute fallback
   */
  private static createEmergencyQuestions(
    grade: string,
    subject: string,
    difficulty: DifficultyLevel,
    count: number
  ): Question[] {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      const question = this.createBasicQuestion(grade, subject, difficulty, i + 1);
      questions.push(question);
    }
    
    return questions;
  }
  
  /**
   * Create a basic question (absolute fallback)
   */
  private static createBasicQuestion(
    grade: string,
    subject: string,
    difficulty: DifficultyLevel,
    questionNumber: number
  ): Question {
    const difficultyText = difficulty.toLowerCase();
    const questionId = `emergency_${Date.now()}_${questionNumber}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create subject-appropriate questions
    let content: string;
    let options: string[];
    let correctAnswer: string;
    let explanation: string;
    
    if (this.isThinkingSkillsSubject(subject)) {
      content = `Which of the following demonstrates ${difficultyText} level logical reasoning for Grade ${grade}?`;
      options = [
        'Analyzing patterns and drawing logical conclusions',
        'Memorizing facts without understanding',
        'Guessing randomly without thinking',
        'Copying answers from others'
      ];
      correctAnswer = options[0];
      explanation = 'Logical reasoning involves analyzing patterns and drawing conclusions based on evidence.';
      
    } else if (this.isMathReasoningSubject(subject)) {
      content = `What is the best approach to solve a ${difficultyText} math problem in Grade ${grade}?`;
      options = [
        'Break down the problem into smaller steps',
        'Guess the answer quickly',
        'Skip the problem entirely',
        'Use only memorized formulas'
      ];
      correctAnswer = options[0];
      explanation = 'Breaking down complex problems into smaller, manageable steps is a key mathematical reasoning skill.';
      
    } else if (this.isReadingSubject(subject)) {
      content = `What is the most important skill for ${difficultyText} reading comprehension in Grade ${grade}?`;
      options = [
        'Understanding main ideas and supporting details',
        'Reading as fast as possible',
        'Memorizing every word',
        'Skipping difficult passages'
      ];
      correctAnswer = options[0];
      explanation = 'Reading comprehension focuses on understanding the main ideas and how details support them.';
      
    } else {
      content = `This is a ${difficultyText} level ${subject} question for Grade ${grade}. What is the best learning approach?`;
      options = [
        'Think carefully and apply your knowledge',
        'Guess without thinking',
        'Skip the question',
        'Ask someone else for the answer'
      ];
      correctAnswer = options[0];
      explanation = 'The best approach to any academic question is to think carefully and apply your knowledge.';
    }
    
    return {
      _id: questionId,
      content,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer,
      explanation,
      subject,
      topic: 'Emergency Generated',
      difficulty,
      grade,
      tags: ['emergency', 'auto-generated', 'fallback'],
      createdBy: 'emergency-system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Save generated questions for future use
   */
  private static async saveGeneratedQuestions(questions: Question[]): Promise<void> {
    try {
      const existingGenerated = getGeneratedQuestions();
      const allGenerated = [...existingGenerated, ...questions];
      const uniqueGenerated = this.removeDuplicates(allGenerated);
      
      saveGeneratedQuestions(uniqueGenerated);
      console.log(`💾 Saved ${questions.length} new questions to generated pool`);
    } catch (error) {
      console.warn('Error saving generated questions:', error);
    }
  }
  
  /**
   * Validate a question
   */
  private static validateQuestion(question: Question): void {
    if (!question._id) throw new Error('Question missing ID');
    if (!question.content) throw new Error('Question missing content');
    if (!question.correctAnswer) throw new Error('Question missing correct answer');
    if (!question.options || question.options.length < 2) throw new Error('Question needs at least 2 options');
    if (!question.options.includes(question.correctAnswer)) throw new Error('Correct answer not in options');
  }
  
  /**
   * Remove duplicate questions
   */
  private static removeDuplicates(questions: Question[]): Question[] {
    const seen = new Set<string>();
    return questions.filter(q => {
      if (seen.has(q._id)) return false;
      seen.add(q._id);
      return true;
    });
  }
  
  /**
   * Shuffle array
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
   * Count question sources
   */
  private static countSources(questions: Question[], sources: TimedTestResult['sources']): void {
    questions.forEach(q => {
      if ((q as any).isGenerated || (q as any).isAutoGenerated) {
        sources.generated++;
      } else if (q.subject === 'Reading' || this.isReadingSubject(q.subject)) {
        sources.reading++;
      } else {
        sources.database++;
      }
    });
  }
  
  // Helper methods for subject detection
  private static isReadingSubject(subject: string): boolean {
    const readingSubjects = ['reading', 'reading comprehension', 'comprehension', 'literacy'];
    return readingSubjects.some(rs => subject.toLowerCase().includes(rs));
  }
  
  private static isThinkingSkillsSubject(subject: string): boolean {
    const thinkingSubjects = ['thinking skills', 'critical thinking', 'logic', 'thinking'];
    return thinkingSubjects.some(ts => subject.toLowerCase().includes(ts));
  }
  
  private static isMathReasoningSubject(subject: string): boolean {
    const mathSubjects = ['mathematical reasoning', 'math reasoning', 'reasoning', 'mathematics'];
    return mathSubjects.some(ms => subject.toLowerCase().includes(ms));
  }
}

// Export the main function for easy use
export const generateBulletproofTimedTest = (config: TimedTestConfig) => 
  EnhancedTimedTestSystem.generateTimedTest(config);

export default EnhancedTimedTestSystem;
