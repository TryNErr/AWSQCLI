import { Question, DifficultyLevel } from '../types';
import { getQuestionsForPractice } from './enhancedQuestionMaintenance';
import { validateAnswer } from './enhancedAnswerValidation';

/**
 * Enhanced Timed Test System
 * Ensures no duplicate questions and professional answer options
 * Integrates with the enhanced question maintenance system
 */

interface TimedTestConfig {
  subject: string;
  grade: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  timeLimit: number; // in minutes
}

interface TimedTestResult {
  questions: Question[];
  duplicatesRemoved: number;
  generatedCount: number;
  validationErrors: string[];
}

export class EnhancedTimedTestSystem {
  
  /**
   * Generates a complete set of questions for a timed test
   * Ensures no duplicates and validates all answers
   */
  static async generateTimedTest(config: TimedTestConfig): Promise<TimedTestResult> {
    const { subject, grade, difficulty, questionCount } = config;
    
    console.log(`Generating timed test: ${questionCount} questions for Grade ${grade}, ${difficulty} ${subject}`);
    
    // Get questions using the enhanced maintenance system
    // Request more than needed to allow for filtering
    const requestCount = Math.max(questionCount * 2, 50);
    
    try {
      const allQuestions = await getQuestionsForPractice({
        grade,
        difficulty,
        subject,
        count: requestCount
      });
      
      console.log(`Retrieved ${allQuestions.length} questions from pool`);
      
      // If we still don't have enough questions, this is a critical error
      if (allQuestions.length === 0) {
        throw new Error(`No questions available for Grade ${grade}, ${difficulty} difficulty, ${subject}. The enhanced question maintenance system should have generated questions automatically.`);
      }
      
      // Remove duplicates and validate questions
      const processedResult = this.processQuestionsForTest(allQuestions, questionCount);
      
      console.log(`Processed result:`, {
        finalCount: processedResult.questions.length,
        duplicatesRemoved: processedResult.duplicatesRemoved,
        generatedCount: processedResult.generatedCount,
        validationErrors: processedResult.validationErrors.length
      });
      
      // If we still don't have enough questions after processing, warn but continue
      if (processedResult.questions.length < questionCount) {
        console.warn(`Only ${processedResult.questions.length} questions available, requested ${questionCount}`);
        processedResult.validationErrors.push(`Only ${processedResult.questions.length} questions available out of ${questionCount} requested`);
      }
      
      return processedResult;
      
    } catch (error) {
      console.error('Error generating timed test:', error);
      
      // Provide more helpful error message
      if (error instanceof Error && error.message.includes('No questions available')) {
        throw new Error(`Failed to generate timed test: No questions available for Grade ${grade}, ${difficulty} difficulty, ${subject}. This may be due to a configuration issue with the question generators.`);
      }
      
      throw new Error(`Failed to generate timed test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Processes questions to remove duplicates and ensure quality
   */
  private static processQuestionsForTest(
    questions: Question[], 
    targetCount: number
  ): TimedTestResult {
    const seenContent = new Set<string>();
    const seenAnswers = new Set<string>();
    const uniqueQuestions: Question[] = [];
    const validationErrors: string[] = [];
    let duplicatesRemoved = 0;
    let generatedCount = 0;
    
    for (const question of questions) {
      // Create a normalized version of the question content for comparison
      const normalizedContent = this.normalizeQuestionContent(question.content);
      
      // Check for duplicate content
      if (seenContent.has(normalizedContent)) {
        duplicatesRemoved++;
        console.log(`Removed duplicate question: ${question.content.substring(0, 50)}...`);
        continue;
      }
      
      // Validate question structure and answers
      const validation = this.validateQuestionForTest(question);
      if (!validation.isValid) {
        validationErrors.push(`Question "${question.content.substring(0, 50)}...": ${validation.error}`);
        continue;
      }
      
      // Check for professional answer options (no placeholders)
      if (this.hasUnprofessionalAnswers(question)) {
        validationErrors.push(`Question has unprofessional answers: ${question.content.substring(0, 50)}...`);
        continue;
      }
      
      // Avoid questions with identical answer sets
      const answerSignature = this.createAnswerSignature(question.options);
      if (seenAnswers.has(answerSignature)) {
        duplicatesRemoved++;
        console.log(`Removed question with duplicate answer set: ${question.content.substring(0, 50)}...`);
        continue;
      }
      
      // Add to unique questions
      seenContent.add(normalizedContent);
      seenAnswers.add(answerSignature);
      uniqueQuestions.push(question);
      
      if ((question as any).isGenerated) {
        generatedCount++;
      }
      
      // Stop when we have enough questions
      if (uniqueQuestions.length >= targetCount) {
        break;
      }
    }
    
    return {
      questions: uniqueQuestions,
      duplicatesRemoved,
      generatedCount,
      validationErrors
    };
  }
  
  /**
   * Normalizes question content for duplicate detection
   */
  private static normalizeQuestionContent(content: string): string {
    return content
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();
  }
  
  /**
   * Creates a signature for answer options to detect duplicate answer sets
   */
  private static createAnswerSignature(options: string[]): string {
    return options
      .map(opt => opt.toLowerCase().trim())
      .sort()
      .join('|');
  }
  
  /**
   * Validates a question for use in timed tests
   */
  private static validateQuestionForTest(question: Question): { isValid: boolean; error?: string } {
    // Check basic structure
    if (!question.content || question.content.trim().length === 0) {
      return { isValid: false, error: 'Empty question content' };
    }
    
    if (!question.options || question.options.length < 2) {
      return { isValid: false, error: 'Insufficient answer options' };
    }
    
    if (!question.correctAnswer || question.correctAnswer.trim().length === 0) {
      return { isValid: false, error: 'Missing correct answer' };
    }
    
    // Check that correct answer is in options
    if (!question.options.includes(question.correctAnswer)) {
      return { isValid: false, error: 'Correct answer not found in options' };
    }
    
    // Validate the answer using enhanced validation
    try {
      const validation = validateAnswer(question, question.correctAnswer);
      if (!validation.isCorrect || validation.confidence < 0.8) {
        return { isValid: false, error: 'Answer validation failed' };
      }
    } catch (error) {
      return { isValid: false, error: `Validation error: ${error}` };
    }
    
    return { isValid: true };
  }
  
  /**
   * Checks for unprofessional answer options
   */
  private static hasUnprofessionalAnswers(question: Question): boolean {
    const unprofessionalPatterns = [
      /wrong\s*answer\s*\d*/i,
      /option\s*[a-d]\s*$/i,
      /choice\s*\d+/i,
      /answer\s*\d+/i,
      /placeholder/i,
      /test\s*option/i,
      /dummy/i,
      /^[a-d]\.?\s*$/i, // Just "A.", "B.", etc.
      /^option\s*$/i,
      /^answer\s*$/i,
      /^\s*$/, // Empty or whitespace only
      /lorem\s*ipsum/i,
      /sample\s*text/i,
      /example\s*answer/i
    ];
    
    return question.options.some(option => 
      unprofessionalPatterns.some(pattern => pattern.test(option.trim()))
    );
  }
  
  /**
   * Distributes questions across difficulty levels for balanced tests
   */
  static distributeQuestionsByDifficulty(
    questions: Question[],
    targetCount: number,
    primaryDifficulty: DifficultyLevel
  ): Question[] {
    // Group questions by difficulty
    const questionsByDifficulty = {
      [DifficultyLevel.EASY]: questions.filter(q => q.difficulty === DifficultyLevel.EASY),
      [DifficultyLevel.MEDIUM]: questions.filter(q => q.difficulty === DifficultyLevel.MEDIUM),
      [DifficultyLevel.HARD]: questions.filter(q => q.difficulty === DifficultyLevel.HARD)
    };
    
    // Define distribution based on primary difficulty
    let distribution: { [key in DifficultyLevel]: number };
    
    switch (primaryDifficulty) {
      case DifficultyLevel.EASY:
        distribution = {
          [DifficultyLevel.EASY]: 0.6,
          [DifficultyLevel.MEDIUM]: 0.3,
          [DifficultyLevel.HARD]: 0.1
        };
        break;
      case DifficultyLevel.MEDIUM:
        distribution = {
          [DifficultyLevel.EASY]: 0.2,
          [DifficultyLevel.MEDIUM]: 0.6,
          [DifficultyLevel.HARD]: 0.2
        };
        break;
      case DifficultyLevel.HARD:
        distribution = {
          [DifficultyLevel.EASY]: 0.1,
          [DifficultyLevel.MEDIUM]: 0.3,
          [DifficultyLevel.HARD]: 0.6
        };
        break;
      default:
        distribution = {
          [DifficultyLevel.EASY]: 0.33,
          [DifficultyLevel.MEDIUM]: 0.34,
          [DifficultyLevel.HARD]: 0.33
        };
    }
    
    // Select questions according to distribution
    const selectedQuestions: Question[] = [];
    
    for (const [difficulty, ratio] of Object.entries(distribution)) {
      const difficultyLevel = difficulty as DifficultyLevel;
      const targetForDifficulty = Math.floor(targetCount * ratio);
      const availableQuestions = questionsByDifficulty[difficultyLevel];
      
      // Shuffle and take the required number
      const shuffled = this.shuffleArray(availableQuestions);
      const selected = shuffled.slice(0, Math.min(targetForDifficulty, shuffled.length));
      
      selectedQuestions.push(...selected);
    }
    
    // If we don't have enough questions, fill with any available questions
    if (selectedQuestions.length < targetCount) {
      const allAvailable = questions.filter(q => !selectedQuestions.includes(q));
      const shuffled = this.shuffleArray(allAvailable);
      const needed = targetCount - selectedQuestions.length;
      selectedQuestions.push(...shuffled.slice(0, needed));
    }
    
    // Final shuffle to mix difficulties
    return this.shuffleArray(selectedQuestions).slice(0, targetCount);
  }
  
  /**
   * Validates a complete test for quality assurance
   */
  static validateCompleteTest(questions: Question[]): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for minimum question count
    if (questions.length < 10) {
      issues.push(`Test has only ${questions.length} questions (minimum recommended: 10)`);
    }
    
    // Check for duplicates
    const contentSet = new Set();
    let duplicates = 0;
    
    questions.forEach(q => {
      const normalized = this.normalizeQuestionContent(q.content);
      if (contentSet.has(normalized)) {
        duplicates++;
      } else {
        contentSet.add(normalized);
      }
    });
    
    if (duplicates > 0) {
      issues.push(`Found ${duplicates} duplicate questions`);
    }
    
    // Check difficulty distribution
    const difficultyCount = {
      [DifficultyLevel.EASY]: 0,
      [DifficultyLevel.MEDIUM]: 0,
      [DifficultyLevel.HARD]: 0
    };
    
    questions.forEach(q => {
      difficultyCount[q.difficulty]++;
    });
    
    const totalQuestions = questions.length;
    const easyPercent = (difficultyCount[DifficultyLevel.EASY] / totalQuestions) * 100;
    const mediumPercent = (difficultyCount[DifficultyLevel.MEDIUM] / totalQuestions) * 100;
    const hardPercent = (difficultyCount[DifficultyLevel.HARD] / totalQuestions) * 100;
    
    if (easyPercent > 80) {
      recommendations.push('Test may be too easy - consider adding more medium/hard questions');
    }
    
    if (hardPercent > 80) {
      recommendations.push('Test may be too difficult - consider adding more easy/medium questions');
    }
    
    // Check for answer validation
    let invalidAnswers = 0;
    questions.forEach(q => {
      try {
        const validation = validateAnswer(q, q.correctAnswer);
        if (!validation.isCorrect) {
          invalidAnswers++;
        }
      } catch (error) {
        invalidAnswers++;
      }
    });
    
    if (invalidAnswers > 0) {
      issues.push(`${invalidAnswers} questions have invalid answers`);
    }
    
    // Check for unprofessional content
    let unprofessionalCount = 0;
    questions.forEach(q => {
      if (this.hasUnprofessionalAnswers(q)) {
        unprofessionalCount++;
      }
    });
    
    if (unprofessionalCount > 0) {
      issues.push(`${unprofessionalCount} questions have unprofessional answer options`);
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
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
   * Gets test statistics for monitoring
   */
  static getTestStatistics(questions: Question[]): {
    totalQuestions: number;
    byDifficulty: Record<string, number>;
    bySubject: Record<string, number>;
    byTopic: Record<string, number>;
    generatedCount: number;
    averageOptionsPerQuestion: number;
  } {
    const stats = {
      totalQuestions: questions.length,
      byDifficulty: {} as Record<string, number>,
      bySubject: {} as Record<string, number>,
      byTopic: {} as Record<string, number>,
      generatedCount: 0,
      averageOptionsPerQuestion: 0
    };
    
    let totalOptions = 0;
    
    questions.forEach(q => {
      // Count by difficulty
      stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
      
      // Count by subject
      const subject = q.subject || 'Unknown';
      stats.bySubject[subject] = (stats.bySubject[subject] || 0) + 1;
      
      // Count by topic
      const topic = q.topic || 'Unknown';
      stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
      
      // Count generated questions
      if ((q as any).isGenerated) {
        stats.generatedCount++;
      }
      
      // Count options
      totalOptions += q.options.length;
    });
    
    stats.averageOptionsPerQuestion = questions.length > 0 ? totalOptions / questions.length : 0;
    
    return stats;
  }
}

// Export convenience functions
export const generateTimedTest = (config: TimedTestConfig) => 
  EnhancedTimedTestSystem.generateTimedTest(config);

export const validateCompleteTest = (questions: Question[]) => 
  EnhancedTimedTestSystem.validateCompleteTest(questions);

export const distributeQuestionsByDifficulty = (
  questions: Question[],
  targetCount: number,
  primaryDifficulty: DifficultyLevel
) => EnhancedTimedTestSystem.distributeQuestionsByDifficulty(questions, targetCount, primaryDifficulty);

export const getTestStatistics = (questions: Question[]) => 
  EnhancedTimedTestSystem.getTestStatistics(questions);

export default EnhancedTimedTestSystem;
