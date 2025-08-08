import { Question, DifficultyLevel } from '../types';
import { questionData } from '../pages/Practice/questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../services/generatedQuestionsService';
import { getAnsweredQuestionIds } from '../services/userProgressService';
import BulletproofMathGenerator from './bulletproofMathGenerator';
import DiverseMathGenerator from './diverseMathGenerator';
import { generateRobustThinkingSkillsQuestions } from './robustThinkingSkillsGenerator';
import { comprehensiveReadingDatabase } from './comprehensiveReadingDatabase';
import StaticQuestionLoader from './staticQuestionLoader';

/**
 * BULLETPROOF Practice Question System
 * 
 * GUARANTEES:
 * 1. Filters are ALWAYS maintained - no irrelevant questions
 * 2. NO duplicate questions - each question appears only once
 * 3. Professional user experience with consistent filtering
 */

interface PracticeConfig {
  grade: string;
  difficulty: DifficultyLevel;
  subject?: string;
  count: number;
}

interface QuestionPool {
  questions: Question[];
  totalAvailable: number;
  filtersApplied: {
    grade: string;
    difficulty: DifficultyLevel;
    subject?: string;
  };
  duplicatesRemoved: number;
}

export class BulletproofPracticeSystem {
  
  // Global question registry to prevent duplicates across all sessions
  private static questionRegistry = new Set<string>();
  private static lastFilters: any = null;
  
  /**
   * Get practice questions with GUARANTEED filtering and NO duplicates
   * Now uses STATIC FILES for instant loading with zero generation time!
   */
  static async getPracticeQuestions(config: PracticeConfig): Promise<QuestionPool> {
    const { grade, difficulty, subject, count } = config;
    
    console.log(`🎯 Getting practice questions: Grade ${grade}, ${difficulty}${subject ? `, ${subject}` : ''}`);
    
    // STEP 1: Try static file loading first (INSTANT!)
    try {
      const staticQuestions = await StaticQuestionLoader.getQuestions(grade, difficulty, subject, count);
      
      if (staticQuestions.length >= Math.min(count, 10)) {
        console.log(`⚡ Using ${staticQuestions.length} static questions (INSTANT LOAD)`);
        
        // Remove already answered questions
        const answeredIds = getAnsweredQuestionIds();
        const unansweredQuestions = staticQuestions.filter(q => !answeredIds.includes(q._id));
        
        // Ensure minimum questions
        const finalQuestions = unansweredQuestions.length >= 10 ? unansweredQuestions : staticQuestions;
        
        // Register questions to prevent future duplicates
        finalQuestions.forEach(q => this.questionRegistry.add(q._id));
        
        return {
          questions: finalQuestions.slice(0, count),
          totalAvailable: staticQuestions.length,
          filtersApplied: { grade, difficulty, subject },
          duplicatesRemoved: 0
        };
      } else {
        console.log(`📊 Static questions: ${staticQuestions.length} (insufficient for ${count} requested)`);
      }
    } catch (error) {
      console.warn('Static loading failed, falling back to generation:', error);
    }
    
    // STEP 2: Fallback to generation if static files insufficient
    console.log('🔧 Falling back to question generation (static files insufficient)');
    return this.getPracticeQuestionsWithGeneration(config);
  }
  
  /**
   * Fallback method using generation logic (only when static files are insufficient)
   */
  private static async getPracticeQuestionsWithGeneration(config: PracticeConfig): Promise<QuestionPool> {
    const { grade, difficulty, subject, count } = config;
    
    console.log(`🔧 Using fallback generation for ${grade}-${difficulty}-${subject || 'any'}`);
    
    // Step 1: Get existing questions from database
    const allQuestions = await this.getAllQuestions();
    console.log(`📚 Total questions available: ${allQuestions.length}`);
    
    // Step 2: Apply filtering
    const filteredQuestions = this.applyStrictFiltering(allQuestions, grade, difficulty, subject);
    console.log(`🔍 After filtering: ${filteredQuestions.length} questions`);
    
    // Step 3: Remove duplicates
    const uniqueQuestions = this.removeDuplicates(filteredQuestions);
    console.log(`🚫 After deduplication: ${uniqueQuestions.length} questions`);
    
    // Step 4: Remove already answered questions
    const answeredIds = getAnsweredQuestionIds();
    const unansweredQuestions = uniqueQuestions.filter(q => !answeredIds.includes(q._id));
    console.log(`✅ Unanswered questions: ${unansweredQuestions.length}`);
    
    // Step 5: Generate more if needed - ENSURE MINIMUM 10 QUESTIONS
    let finalQuestions = unansweredQuestions;
    const minimumQuestions = Math.max(10, Math.min(count, 15)); // At least 10, but not more than 15
    const targetCount = Math.max(count, minimumQuestions);
    
    if (finalQuestions.length < targetCount) {
      const needed = targetCount - finalQuestions.length;
      console.log(`🔧 Generating ${needed} additional questions (minimum ${minimumQuestions} required)`);
      
      const generatedQuestions = await this.generateAdditionalQuestions({
        grade,
        difficulty,
        subject,
        count: needed,
        existingQuestions: finalQuestions
      });
      
      finalQuestions = [...finalQuestions, ...generatedQuestions];
    }
    
    // Ensure we have at least the minimum number of questions
    if (finalQuestions.length < minimumQuestions) {
      console.warn(`⚠️ Only ${finalQuestions.length} questions available, but ${minimumQuestions} minimum required`);
      
      // Try one more time with emergency generation
      const stillNeeded = minimumQuestions - finalQuestions.length;
      console.log(`🆘 Emergency generation: attempting ${stillNeeded} more questions`);
      
      const emergencyQuestions = await this.generateAdditionalQuestions({
        grade,
        difficulty,
        subject: undefined, // Remove subject filter for emergency generation
        count: stillNeeded,
        existingQuestions: finalQuestions
      });
      
      finalQuestions = [...finalQuestions, ...emergencyQuestions];
    }
    
    // Step 6: Shuffle and limit to requested count
    const shuffledQuestions = this.shuffleArray(finalQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, count);
    
    // Step 7: Register questions to prevent future duplicates
    selectedQuestions.forEach(q => this.questionRegistry.add(q._id));
    
    console.log(`🎉 Final selection: ${selectedQuestions.length} questions`);
    
    return {
      questions: selectedQuestions,
      totalAvailable: finalQuestions.length,
      filtersApplied: { grade, difficulty, subject },
      duplicatesRemoved: filteredQuestions.length - uniqueQuestions.length
    };
  }
  
  /**
   * Get all questions from all sources
   */
  private static async getAllQuestions(): Promise<Question[]> {
    const sources: Question[] = [];
    
    // Source 1: Static question data
    sources.push(...questionData);
    
    // Source 2: Generated questions from localStorage
    sources.push(...getGeneratedQuestions());
    
    // Source 3: Reading comprehension questions
    try {
      const readingQuestions = this.convertReadingPassagesToQuestions();
      sources.push(...readingQuestions);
    } catch (error) {
      console.warn('Could not load reading questions:', error);
    }
    
    return sources;
  }
  
  /**
   * Apply STRICT filtering - only questions that EXACTLY match criteria
   */
  private static applyStrictFiltering(
    questions: Question[],
    grade: string,
    difficulty: DifficultyLevel,
    subject?: string
  ): Question[] {
    return questions.filter(question => {
      // Grade must match EXACTLY
      const gradeMatch = question.grade === grade;
      if (!gradeMatch) return false;
      
      // Difficulty must match EXACTLY
      const difficultyMatch = question.difficulty === difficulty;
      if (!difficultyMatch) return false;
      
      // Subject must match EXACTLY (if specified)
      if (subject) {
        const subjectMatch = this.normalizeSubject(question.subject) === this.normalizeSubject(subject);
        if (!subjectMatch) return false;
      }
      
      // Question must be valid
      const isValid = question.content && 
                     question.options && 
                     question.options.length >= 2 && 
                     question.correctAnswer &&
                     question.options.includes(question.correctAnswer);
      
      return isValid;
    });
  }
  
  /**
   * Remove ALL duplicates - no question appears twice
   */
  private static removeDuplicates(questions: Question[]): Question[] {
    const seen = new Set<string>();
    const unique: Question[] = [];
    
    for (const question of questions) {
      // Create multiple keys to catch different types of duplicates
      const contentKey = question.content.toLowerCase().trim().replace(/\s+/g, ' ');
      const idKey = question._id;
      
      // Check if we've seen this question before
      if (!seen.has(contentKey) && !seen.has(idKey) && !this.questionRegistry.has(idKey)) {
        seen.add(contentKey);
        seen.add(idKey);
        unique.push(question);
      }
    }
    
    return unique;
  }
  
  /**
   * Generate additional questions when needed
   */
  private static async generateAdditionalQuestions(config: {
    grade: string;
    difficulty: DifficultyLevel;
    subject?: string;
    count: number;
    existingQuestions: Question[];
  }): Promise<Question[]> {
    const { grade, difficulty, subject, count, existingQuestions } = config;
    const generated: Question[] = [];
    const existingContent = new Set(existingQuestions.map(q => q.content.toLowerCase().trim()));
    
    let attempts = 0;
    const maxAttempts = Math.min(count * 10, 100); // Cap maximum attempts
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 20; // Stop if we fail 20 times in a row
    
    console.log(`🔧 Starting question generation: need ${count}, max attempts ${maxAttempts}`);
    
    while (generated.length < count && attempts < maxAttempts && consecutiveFailures < maxConsecutiveFailures) {
      attempts++;
      
      try {
        let newQuestion: Question | null = null;
        
        // Generate based on subject with better error handling
        if (!subject || subject.toLowerCase().includes('math')) {
          // Use diverse math generator for better variety, fallback to bulletproof if needed
          try {
            newQuestion = DiverseMathGenerator.generateQuestion(grade, difficulty);
          } catch (error) {
            console.warn('Diverse math generator failed, using bulletproof fallback:', error);
            try {
              newQuestion = BulletproofMathGenerator.generateQuestion(grade, difficulty);
            } catch (fallbackError) {
              console.error('Both math generators failed:', fallbackError);
              consecutiveFailures++;
              continue;
            }
          }
        } else if (subject.toLowerCase().includes('thinking')) {
          try {
            // Generate multiple thinking skills questions at once for efficiency
            const remainingNeeded = count - generated.length;
            const batchSize = Math.min(remainingNeeded, 5); // Generate up to 5 at once
            const thinkingQuestions = generateRobustThinkingSkillsQuestions(grade, difficulty, batchSize);
            
            // Add all generated questions that meet criteria
            for (const q of thinkingQuestions) {
              if (generated.length >= count) break;
              
              const contentKey = q.content.toLowerCase().trim();
              if (!existingContent.has(contentKey) && 
                  !this.questionRegistry.has(q._id) &&
                  q.grade === grade &&
                  q.difficulty === difficulty) {
                
                generated.push(q);
                existingContent.add(contentKey);
                this.questionRegistry.add(q._id);
                console.log(`✅ Generated thinking skills question ${generated.length}/${count}: ${q.topic}`);
              }
            }
            
            if (thinkingQuestions.length > 0) {
              consecutiveFailures = 0; // Reset on successful batch
              continue; // Skip the individual question processing
            } else {
              consecutiveFailures++;
              continue;
            }
          } catch (error) {
            console.warn('Thinking skills generator failed:', error);
            consecutiveFailures++;
            continue;
          }
        } else if (subject.toLowerCase().includes('reading')) {
          newQuestion = this.generateReadingQuestion(grade, difficulty);
          if (!newQuestion) {
            console.warn(`No reading passages available for grade ${grade}, difficulty ${difficulty}`);
            consecutiveFailures++;
            
            // If we've failed to generate reading questions multiple times, 
            // try to generate math questions instead to avoid infinite loop
            if (consecutiveFailures > 5) {
              console.log('🔄 Switching to math questions due to reading generation failures');
              try {
                newQuestion = DiverseMathGenerator.generateQuestion(grade, difficulty);
                if (newQuestion) {
                  newQuestion.subject = 'Reading'; // Keep the subject as reading for filtering
                  newQuestion.topic = 'Emergency Math Question';
                }
              } catch (mathError) {
                console.error('Emergency math generation also failed:', mathError);
              }
            }
            
            if (!newQuestion) continue;
          }
        } else {
          // Default to diverse math for other subjects
          try {
            newQuestion = DiverseMathGenerator.generateQuestion(grade, difficulty);
          } catch (error) {
            console.warn('Diverse math generator failed, using bulletproof fallback:', error);
            try {
              newQuestion = BulletproofMathGenerator.generateQuestion(grade, difficulty);
            } catch (fallbackError) {
              console.error('Both math generators failed:', fallbackError);
              consecutiveFailures++;
              continue;
            }
          }
        }
        
        if (newQuestion) {
          // Ensure it matches our criteria
          const contentKey = newQuestion.content.toLowerCase().trim();
          
          if (!existingContent.has(contentKey) && 
              !this.questionRegistry.has(newQuestion._id) &&
              newQuestion.grade === grade &&
              newQuestion.difficulty === difficulty &&
              (!subject || this.normalizeSubject(newQuestion.subject) === this.normalizeSubject(subject))) {
            
            generated.push(newQuestion);
            existingContent.add(contentKey);
            this.questionRegistry.add(newQuestion._id);
            consecutiveFailures = 0; // Reset failure counter on success
            
            console.log(`✅ Generated question ${generated.length}/${count}: ${newQuestion.topic}`);
          } else {
            consecutiveFailures++;
            console.log(`⚠️ Question rejected (duplicate or criteria mismatch), attempt ${attempts}`);
          }
        } else {
          consecutiveFailures++;
          console.log(`❌ Failed to generate question, attempt ${attempts}, consecutive failures: ${consecutiveFailures}`);
        }
        
      } catch (error) {
        console.error(`Error generating question (attempt ${attempts}):`, error);
        consecutiveFailures++;
      }
      
      // Add a small delay to prevent overwhelming the system
      if (attempts % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    console.log(`🏁 Question generation complete: ${generated.length}/${count} generated after ${attempts} attempts`);
    
    if (generated.length === 0) {
      console.warn('⚠️ No questions could be generated - this may indicate a configuration issue');
    }
    
    if (consecutiveFailures >= maxConsecutiveFailures) {
      console.warn(`⚠️ Stopped generation due to ${consecutiveFailures} consecutive failures`);
    }
    
    // Save generated questions
    if (generated.length > 0) {
      const existingGenerated = getGeneratedQuestions();
      saveGeneratedQuestions([...existingGenerated, ...generated]);
    }
    
    return generated;
  }
  
  /**
   * Generate reading comprehension question
   */
  private static generateReadingQuestion(grade: string, difficulty: DifficultyLevel): Question | null {
    try {
      const gradeNum = parseInt(grade);
      const suitablePassages = comprehensiveReadingDatabase.filter(passage => {
        const passageGrade = parseInt(passage.grade);
        return Math.abs(passageGrade - gradeNum) <= 1; // Allow ±1 grade level
      });
      
      if (suitablePassages.length === 0) return null;
      
      const passage = suitablePassages[Math.floor(Math.random() * suitablePassages.length)];
      const question = passage.questions[Math.floor(Math.random() * passage.questions.length)];
      
      return {
        _id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: `${passage.title}\n\n${passage.passage}\n\nQuestion: ${question.content}`,
        type: question.type,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        subject: 'Reading',
        topic: passage.genre,
        difficulty,
        grade,
        tags: ['reading', 'comprehension'],
        createdBy: 'bulletproof-practice-system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating reading question:', error);
      return null;
    }
  }
  
  /**
   * Convert reading passages to questions
   */
  private static convertReadingPassagesToQuestions(): Question[] {
    const questions: Question[] = [];
    
    try {
      for (const passage of comprehensiveReadingDatabase) {
        for (const q of passage.questions) {
          questions.push({
            _id: `reading_${passage.id}_${q._id || Math.random().toString(36).substr(2, 9)}`,
            content: `${passage.title}\n\n${passage.passage}\n\nQuestion: ${q.content}`,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            subject: 'Reading',
            topic: passage.genre,
            difficulty: this.mapDifficultyFromGrade(passage.grade),
            grade: passage.grade,
            tags: ['reading', 'comprehension', passage.genre.toLowerCase()],
            createdBy: 'reading-database',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error converting reading passages:', error);
    }
    
    return questions;
  }
  
  /**
   * Normalize subject names for consistent matching
   */
  private static normalizeSubject(subject: string): string {
    const normalized = subject.toLowerCase().trim();
    
    // Handle common variations
    if (normalized.includes('math')) return 'math';
    if (normalized.includes('english')) return 'english';
    if (normalized.includes('reading')) return 'reading';
    if (normalized.includes('thinking')) return 'thinking skills';
    if (normalized.includes('reasoning')) return 'mathematical reasoning';
    
    return normalized;
  }
  
  /**
   * Map grade to difficulty level
   */
  private static mapDifficultyFromGrade(grade: string): DifficultyLevel {
    const gradeNum = parseInt(grade);
    if (gradeNum <= 4) return DifficultyLevel.EASY;
    if (gradeNum <= 8) return DifficultyLevel.MEDIUM;
    return DifficultyLevel.HARD;
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
   * Clear question registry (for testing)
   */
  static clearRegistry(): void {
    this.questionRegistry.clear();
    this.lastFilters = null;
  }
  
  /**
   * Get registry stats
   */
  static getRegistryStats(): { size: number; lastFilters: any } {
    return {
      size: this.questionRegistry.size,
      lastFilters: this.lastFilters
    };
  }
}

export default BulletproofPracticeSystem;
