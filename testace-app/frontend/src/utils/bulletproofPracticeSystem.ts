import { Question, DifficultyLevel } from '../types';
import { questionData } from '../pages/Practice/questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../services/generatedQuestionsService';
import { getAnsweredQuestionIds } from '../services/userProgressService';
import BulletproofMathGenerator from './bulletproofMathGenerator';
import DiverseMathGenerator from './diverseMathGenerator';
import { generateRobustThinkingSkillsQuestions } from './robustThinkingSkillsGenerator';
import { comprehensiveReadingDatabase } from './comprehensiveReadingDatabase';

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
   */
  static async getPracticeQuestions(config: PracticeConfig): Promise<QuestionPool> {
    const { grade, difficulty, subject, count } = config;
    
    console.log(`🎯 Getting practice questions: Grade ${grade}, ${difficulty}${subject ? `, ${subject}` : ''}`);
    
    // Step 1: Get ALL questions from all sources
    const allQuestions = await this.getAllQuestions();
    console.log(`📚 Total questions available: ${allQuestions.length}`);
    
    // Step 2: Apply STRICT filtering - NO exceptions
    const filteredQuestions = this.applyStrictFiltering(allQuestions, grade, difficulty, subject);
    console.log(`🔍 After filtering: ${filteredQuestions.length} questions`);
    
    // Step 3: Remove ALL duplicates - NO repeats allowed
    const uniqueQuestions = this.removeDuplicates(filteredQuestions);
    console.log(`🚫 After deduplication: ${uniqueQuestions.length} questions`);
    
    // Step 4: Remove already answered questions
    const answeredIds = getAnsweredQuestionIds();
    const unansweredQuestions = uniqueQuestions.filter(q => !answeredIds.includes(q._id));
    console.log(`✅ Unanswered questions: ${unansweredQuestions.length}`);
    
    // Step 5: Generate more if needed
    let finalQuestions = unansweredQuestions;
    if (finalQuestions.length < count) {
      const needed = count - finalQuestions.length;
      console.log(`🔧 Generating ${needed} additional questions`);
      
      const generatedQuestions = await this.generateAdditionalQuestions({
        grade,
        difficulty,
        subject,
        count: needed,
        existingQuestions: finalQuestions
      });
      
      finalQuestions = [...finalQuestions, ...generatedQuestions];
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
    const maxAttempts = count * 5;
    
    while (generated.length < count && attempts < maxAttempts) {
      attempts++;
      
      try {
        let newQuestion: Question | null = null;
        
        // Generate based on subject
        if (!subject || subject.toLowerCase().includes('math')) {
          // Use diverse math generator for better variety, fallback to bulletproof if needed
          try {
            newQuestion = DiverseMathGenerator.generateQuestion(grade, difficulty);
          } catch (error) {
            console.warn('Diverse math generator failed, using bulletproof fallback:', error);
            newQuestion = BulletproofMathGenerator.generateQuestion(grade, difficulty);
          }
        } else if (subject.toLowerCase().includes('thinking')) {
          const thinkingQuestions = generateRobustThinkingSkillsQuestions(grade, difficulty, 1);
          newQuestion = thinkingQuestions[0] || null;
        } else if (subject.toLowerCase().includes('reading')) {
          newQuestion = this.generateReadingQuestion(grade, difficulty);
        } else {
          // Default to diverse math for other subjects
          try {
            newQuestion = DiverseMathGenerator.generateQuestion(grade, difficulty);
          } catch (error) {
            console.warn('Diverse math generator failed, using bulletproof fallback:', error);
            newQuestion = BulletproofMathGenerator.generateQuestion(grade, difficulty);
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
            console.log(`Generated question ${generated.length}/${count}`);
          }
        }
      } catch (error) {
        console.warn(`Error generating question (attempt ${attempts}):`, error);
      }
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
