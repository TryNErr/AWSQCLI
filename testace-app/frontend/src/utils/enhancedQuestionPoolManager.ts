import { Question, DifficultyLevel, QuestionType } from '../types';
import { generateEnhancedQuestion } from './enhancedQuestionSystem';
import { generateEnhancedMathematicalReasoningQuestions } from './enhancedMathematicalReasoningGenerator';
import { validateAnswer } from './enhancedAnswerValidation';
import { questionData } from '../pages/Practice/questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../services/generatedQuestionsService';
import { getAnsweredQuestionIds } from '../services/userProgressService';
import { getEffectiveConfig, QuestionGenerationConfig } from '../config/questionGenerationConfig';

/**
 * Enhanced Question Pool Manager
 * Ensures timed tests always have sufficient questions by implementing:
 * 1. Flexible difficulty matching (allows adjacent difficulties when needed)
 * 2. Aggressive question generation
 * 3. Cross-subject fallback
 * 4. Emergency question creation
 */

interface QuestionPoolConfig {
  grade: string;
  difficulty: DifficultyLevel;
  subject: string;
  targetCount: number;
  minAcceptableCount: number;
}

interface QuestionPoolResult {
  questions: Question[];
  exactMatches: number;
  flexibleMatches: number;
  generatedCount: number;
  warnings: string[];
}

export class EnhancedQuestionPoolManager {
  
  /**
   * Gets questions for timed tests with guaranteed minimum count
   * Uses multiple strategies to ensure sufficient questions
   */
  static async getQuestionsForTimedTest(config: QuestionPoolConfig): Promise<QuestionPoolResult> {
    const { grade, difficulty, subject, targetCount, minAcceptableCount } = config;
    
    // Get effective configuration for this context
    const effectiveConfig = getEffectiveConfig(subject, grade);
    
    console.log(`Getting questions for timed test: Grade ${grade}, ${difficulty} ${subject}, target: ${targetCount}`);
    console.log(`Using config:`, {
      maxAttempts: effectiveConfig.timedTest.maxGenerationAttempts,
      requestMultiplier: effectiveConfig.timedTest.requestMultiplier,
      minPoolSize: effectiveConfig.questionPool.minPoolSize
    });
    
    const result: QuestionPoolResult = {
      questions: [],
      exactMatches: 0,
      flexibleMatches: 0,
      generatedCount: 0,
      warnings: []
    };
    
    // Strategy 1: Get exact matches
    const exactMatches = await this.getExactMatches(grade, difficulty, subject);
    result.questions.push(...exactMatches);
    result.exactMatches = exactMatches.length;
    
    console.log(`Strategy 1 - Exact matches: ${exactMatches.length} questions`);
    
    // Strategy 2: If not enough, get flexible matches (adjacent difficulties)
    if (result.questions.length < targetCount && effectiveConfig.generation.flexibleDifficultyEnabled) {
      const flexibleMatches = await this.getFlexibleMatches(grade, difficulty, subject, result.questions);
      result.questions.push(...flexibleMatches);
      result.flexibleMatches = flexibleMatches.length;
      
      console.log(`Strategy 2 - Flexible matches: ${flexibleMatches.length} questions`);
    }
    
    // Strategy 3: Generate new questions aggressively
    if (result.questions.length < targetCount && effectiveConfig.generation.aggressiveGenerationEnabled) {
      const questionsNeeded = targetCount - result.questions.length;
      const questionsToGenerate = Math.min(
        questionsNeeded * effectiveConfig.timedTest.requestMultiplier,
        effectiveConfig.timedTest.maxGenerationAttempts
      );
      
      const generatedQuestions = await this.generateQuestionsAggressively(
        grade, difficulty, subject, questionsToGenerate, effectiveConfig
      );
      
      // Filter out duplicates and add to pool
      const uniqueGenerated = this.removeDuplicates(generatedQuestions, result.questions);
      result.questions.push(...uniqueGenerated.slice(0, questionsNeeded));
      result.generatedCount = uniqueGenerated.length;
      
      console.log(`Strategy 3 - Generated: ${uniqueGenerated.length} questions`);
    }
    
    // Strategy 4: Cross-subject fallback if still not enough
    if (result.questions.length < minAcceptableCount && effectiveConfig.generation.crossSubjectFallbackEnabled) {
      const crossSubjectQuestions = await this.getCrossSubjectQuestions(
        grade, difficulty, result.questions, minAcceptableCount - result.questions.length
      );
      result.questions.push(...crossSubjectQuestions);
      
      if (crossSubjectQuestions.length > 0) {
        result.warnings.push(`Added ${crossSubjectQuestions.length} questions from other subjects to meet minimum requirement`);
      }
      
      console.log(`Strategy 4 - Cross-subject: ${crossSubjectQuestions.length} questions`);
    }
    
    // Strategy 5: Emergency generation if still insufficient
    if (result.questions.length < minAcceptableCount && effectiveConfig.generation.emergencyGenerationEnabled) {
      const emergencyQuestions = await this.generateEmergencyQuestions(
        grade, difficulty, subject, minAcceptableCount - result.questions.length, effectiveConfig
      );
      result.questions.push(...emergencyQuestions);
      
      if (emergencyQuestions.length > 0) {
        result.warnings.push(`Generated ${emergencyQuestions.length} emergency questions to meet minimum requirement`);
      }
      
      console.log(`Strategy 5 - Emergency: ${emergencyQuestions.length} questions`);
    }

    // Final emergency check - if we still don't have enough questions, generate basic ones
    if (result.questions.length < minAcceptableCount) {
      const emergencyCount = minAcceptableCount - result.questions.length;
      console.log(`Generating ${emergencyCount} basic emergency questions...`);
      
      const basicQuestions = this.generateBasicEmergencyQuestions(
        grade, difficulty, subject, emergencyCount
      );
      
      result.questions.push(...basicQuestions);
      result.generatedCount += basicQuestions.length;
      result.warnings.push(`Generated ${basicQuestions.length} basic emergency questions to meet minimum requirement`);
      
      console.log(`Emergency basic generation: ${basicQuestions.length} questions`);
    }

    // Final shuffle and limit to target count
    result.questions = this.shuffleArray(result.questions).slice(0, targetCount);
    
    console.log(`Final result: ${result.questions.length} questions for timed test`);
    
    return result;
  }
  
  /**
   * Gets questions that exactly match the criteria
   */
  private static async getExactMatches(
    grade: string, 
    difficulty: DifficultyLevel, 
    subject: string
  ): Promise<Question[]> {
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    return allQuestions.filter(q => {
      const gradeMatch = q.grade === grade;
      const difficultyMatch = q.difficulty === difficulty;
      const subjectMatch = q.subject === subject;
      const notAnswered = !answeredQuestionIds.includes(q._id);
      
      return gradeMatch && difficultyMatch && subjectMatch && notAnswered;
    });
  }
  
  /**
   * Gets questions with flexible difficulty matching
   */
  private static async getFlexibleMatches(
    grade: string,
    difficulty: DifficultyLevel,
    subject: string,
    existingQuestions: Question[]
  ): Promise<Question[]> {
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    const answeredQuestionIds = getAnsweredQuestionIds();
    const existingIds = new Set(existingQuestions.map(q => q._id));
    
    // Define adjacent difficulties
    const adjacentDifficulties: DifficultyLevel[] = [];
    
    switch (difficulty) {
      case DifficultyLevel.EASY:
        adjacentDifficulties.push(DifficultyLevel.MEDIUM);
        break;
      case DifficultyLevel.MEDIUM:
        adjacentDifficulties.push(DifficultyLevel.EASY, DifficultyLevel.HARD);
        break;
      case DifficultyLevel.HARD:
        adjacentDifficulties.push(DifficultyLevel.MEDIUM);
        break;
    }
    
    return allQuestions.filter(q => {
      const gradeMatch = q.grade === grade;
      const difficultyMatch = adjacentDifficulties.includes(q.difficulty);
      const subjectMatch = q.subject === subject;
      const notAnswered = !answeredQuestionIds.includes(q._id);
      const notDuplicate = !existingIds.has(q._id);
      
      return gradeMatch && difficultyMatch && subjectMatch && notAnswered && notDuplicate;
    });
  }
  
  /**
   * Generates questions aggressively with multiple attempts
   */
  private static async generateQuestionsAggressively(
    grade: string,
    difficulty: DifficultyLevel,
    subject: string,
    count: number,
    config: QuestionGenerationConfig
  ): Promise<Question[]> {
    const newQuestions: Question[] = [];
    const maxAttempts = config.timedTest.maxGenerationAttempts;
    let attempts = 0;
    
    console.log(`Aggressively generating ${count} questions for ${subject} (max attempts: ${maxAttempts})`);
    
    while (newQuestions.length < count && attempts < maxAttempts) {
      attempts++;
      
      try {
        let question: Question;
        
        // Handle different subjects
        if (subject.toLowerCase().includes('mathematical reasoning') || 
            subject.toLowerCase().includes('math reasoning') ||
            subject.toLowerCase() === 'reasoning') {
          const mathReasoningQuestions = generateEnhancedMathematicalReasoningQuestions(grade, difficulty, 1);
          question = mathReasoningQuestions[0];
        } else {
          question = generateEnhancedQuestion(grade, subject, difficulty);
        }
        
        // Validate and add metadata
        if (this.validateGeneratedQuestion(question, grade, difficulty, subject, config)) {
          (question as any).isGenerated = true;
          (question as any).generatedAt = new Date();
          (question as any).generationMethod = 'aggressive-pool-manager';
          
          newQuestions.push(question);
          
          if (newQuestions.length % 10 === 0) {
            console.log(`Generated ${newQuestions.length}/${count} questions (${attempts} attempts)`);
          }
        }
      } catch (error) {
        if (attempts % 50 === 0) {
          console.warn(`Generation attempt ${attempts} failed:`, error);
        }
      }
    }
    
    // Save generated questions
    if (newQuestions.length > 0) {
      const existingGenerated = getGeneratedQuestions();
      saveGeneratedQuestions([...existingGenerated, ...newQuestions]);
    }
    
    console.log(`Aggressive generation completed: ${newQuestions.length}/${count} questions in ${attempts} attempts`);
    
    return newQuestions;
  }
  
  /**
   * Gets questions from other subjects as fallback
   */
  private static async getCrossSubjectQuestions(
    grade: string,
    difficulty: DifficultyLevel,
    existingQuestions: Question[],
    count: number
  ): Promise<Question[]> {
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    const answeredQuestionIds = getAnsweredQuestionIds();
    const existingIds = new Set(existingQuestions.map(q => q._id));
    
    const crossSubjectQuestions = allQuestions.filter(q => {
      const gradeMatch = q.grade === grade;
      const difficultyMatch = q.difficulty === difficulty;
      const notAnswered = !answeredQuestionIds.includes(q._id);
      const notDuplicate = !existingIds.has(q._id);
      
      return gradeMatch && difficultyMatch && notAnswered && notDuplicate;
    });
    
    return this.shuffleArray(crossSubjectQuestions).slice(0, count);
  }
  
  /**
   * Generates emergency questions with relaxed validation
   */
  private static async generateEmergencyQuestions(
    grade: string,
    difficulty: DifficultyLevel,
    subject: string,
    count: number,
    config: QuestionGenerationConfig
  ): Promise<Question[]> {
    const emergencyQuestions: Question[] = [];
    const subjects = ['Math', 'English', 'Thinking Skills', 'Mathematical Reasoning'];
    const maxAttempts = Math.min(count * 3, config.timedTest.maxGenerationAttempts);
    
    console.log(`Generating ${count} emergency questions (max attempts: ${maxAttempts})`);
    
    for (let i = 0; i < maxAttempts && emergencyQuestions.length < count; i++) {
      try {
        // Cycle through subjects for variety
        const currentSubject = subjects[i % subjects.length];
        const question = generateEnhancedQuestion(grade, currentSubject, difficulty);
        
        if (question) {
          (question as any).isGenerated = true;
          (question as any).generatedAt = new Date();
          (question as any).generationMethod = 'emergency-pool-manager';
          emergencyQuestions.push(question);
        }
      } catch (error) {
        // Continue trying with other subjects
        console.warn(`Emergency generation attempt ${i} failed:`, error);
      }
    }
    
    return emergencyQuestions;
  }

  /**
   * Generates basic emergency questions for any question count (5-50)
   */
  private static generateBasicEmergencyQuestions(
    grade: string,
    difficulty: DifficultyLevel,
    subject: string,
    count: number
  ): Question[] {
    const questions: Question[] = [];
    
    console.log(`Generating ${count} basic emergency questions for ${subject}, Grade ${grade}, ${difficulty}`);
    
    for (let i = 0; i < count; i++) {
      const questionNumber = i + 1;
      let question: Question;
      
      if (subject.toLowerCase().includes('math')) {
        // Generate math questions with appropriate difficulty
        let num1, num2, operation, correctAnswer;
        
        switch (difficulty) {
          case DifficultyLevel.EASY:
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            operation = '+';
            correctAnswer = num1 + num2;
            break;
          case DifficultyLevel.MEDIUM:
            num1 = Math.floor(Math.random() * 20) + 10;
            num2 = Math.floor(Math.random() * 20) + 10;
            operation = Math.random() > 0.5 ? '+' : '-';
            correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
            break;
          case DifficultyLevel.HARD:
            num1 = Math.floor(Math.random() * 50) + 20;
            num2 = Math.floor(Math.random() * 20) + 5;
            operation = Math.random() > 0.5 ? '×' : '÷';
            correctAnswer = operation === '×' ? num1 * num2 : Math.floor(num1 / num2);
            break;
          default:
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            operation = '+';
            correctAnswer = num1 + num2;
        }
        
        // Generate distractors
        const options = [correctAnswer.toString()];
        while (options.length < 4) {
          let distractor;
          if (operation === '+') {
            distractor = correctAnswer + Math.floor(Math.random() * 10) - 5;
          } else if (operation === '-') {
            distractor = correctAnswer + Math.floor(Math.random() * 10) - 5;
          } else {
            distractor = correctAnswer + Math.floor(Math.random() * 20) - 10;
          }
          
          if (distractor > 0 && !options.includes(distractor.toString())) {
            options.push(distractor.toString());
          }
        }
        
        // Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [options[j], options[k]] = [options[k], options[j]];
        }
        
        question = {
          _id: `emergency_math_${Date.now()}_${i}`,
          content: `What is ${num1} ${operation} ${num2}?`,
          subject: subject,
          difficulty: difficulty,
          grade: grade,
          type: QuestionType.MULTIPLE_CHOICE,
          options: options,
          correctAnswer: correctAnswer.toString(),
          explanation: `${num1} ${operation} ${num2} = ${correctAnswer}`,
          topic: 'Basic Math',
          timeLimit: 60,
          tags: ['emergency', 'basic', 'generated'],
          createdBy: 'emergency-system',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Question;
      } else {
        // Generic question for other subjects with grade-appropriate content
        const gradeNum = parseInt(grade);
        let questionContent, options;
        
        if (gradeNum <= 5) {
          questionContent = `Elementary Question ${questionNumber}: Which of the following is correct for ${subject}?`;
          options = ['Option A (Correct)', 'Option B', 'Option C', 'Option D'];
        } else if (gradeNum <= 8) {
          questionContent = `Middle School Question ${questionNumber}: What is the best answer for this ${subject} question?`;
          options = ['Correct Answer', 'Incorrect Option 1', 'Incorrect Option 2', 'Incorrect Option 3'];
        } else {
          questionContent = `High School Question ${questionNumber}: Which statement about ${subject} is most accurate?`;
          options = ['The most accurate statement', 'Less accurate option', 'Incorrect statement', 'Misleading option'];
        }
        
        question = {
          _id: `emergency_generic_${Date.now()}_${i}`,
          content: questionContent,
          subject: subject,
          difficulty: difficulty,
          grade: grade,
          type: QuestionType.MULTIPLE_CHOICE,
          options: options,
          correctAnswer: options[0],
          explanation: 'This is an emergency generated question to ensure test completeness.',
          topic: 'General Knowledge',
          timeLimit: 60,
          tags: ['emergency', 'basic', 'generated'],
          createdBy: 'emergency-system',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Question;
      }
      
      questions.push(question);
    }
    
    console.log(`✅ Generated ${questions.length} emergency questions`);
    return questions;
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
   * Remove duplicate questions
   */
  private static removeDuplicates(newQuestions: Question[], existingQuestions: Question[]): Question[] {
    const existingIds = new Set(existingQuestions.map(q => q._id));
    return newQuestions.filter(q => !existingIds.has(q._id));
  }

  /**
   * Validate generated question
   */
  private static validateGeneratedQuestion(
    question: Question,
    grade: string,
    difficulty: DifficultyLevel,
    subject: string,
    config: QuestionGenerationConfig
  ): boolean {
    if (!question || !question.content || !question.options || question.options.length < 2) {
      return false;
    }

    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
      return false;
    }

    return true;
  }
}

export default EnhancedQuestionPoolManager;
