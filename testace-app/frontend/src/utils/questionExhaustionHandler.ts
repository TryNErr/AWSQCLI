/**
 * QUESTION EXHAUSTION HANDLER
 * 
 * Handles cases where users have exhausted available questions
 * by providing progressive expansion strategies.
 */

import { Question, DifficultyLevel } from '../types';

export type DifficultyString = 'easy' | 'medium' | 'hard';

export interface QuestionExpansionStrategy {
  questions: Question[];
  strategy: 'difficulty_expansion' | 'grade_expansion' | 'subject_expansion' | 'generated_questions';
  description: string;
  originalCriteria: {
    grade: number;
    subject: string;
    difficulty: DifficultyString;
  };
  expandedCriteria: {
    grades?: number[];
    subjects?: string[];
    difficulties?: DifficultyString[];
  };
}

export interface ExhaustionRequest {
  grade: number;
  subject: string;
  difficulty: DifficultyString;
  userId?: string;
}

export class ProgressiveQuestionHandler {
  
  /**
   * Main handler for question exhaustion scenarios
   */
  static async handleQuestionExhaustion(request: ExhaustionRequest): Promise<QuestionExpansionStrategy> {
    const { grade, subject, difficulty } = request;
    
    // Strategy 1: Try expanding difficulty levels
    const difficultyExpansion = await this.tryDifficultyExpansion(request);
    if (difficultyExpansion.questions.length > 0) {
      return difficultyExpansion;
    }
    
    // Strategy 2: Try expanding to adjacent grades
    const gradeExpansion = await this.tryGradeExpansion(request);
    if (gradeExpansion.questions.length > 0) {
      return gradeExpansion;
    }
    
    // Strategy 3: Try expanding to related subjects
    const subjectExpansion = await this.trySubjectExpansion(request);
    if (subjectExpansion.questions.length > 0) {
      return subjectExpansion;
    }
    
    // Strategy 4: Generate new questions (fallback)
    return await this.generateFallbackQuestions(request);
  }
  
  /**
   * Try expanding difficulty levels (easier/harder)
   */
  private static async tryDifficultyExpansion(request: ExhaustionRequest): Promise<QuestionExpansionStrategy> {
    const { grade, subject, difficulty } = request;
    const difficulties: DifficultyString[] = ['easy', 'medium', 'hard'];
    const expandedDifficulties = difficulties.filter(d => d !== difficulty);
    
    const questions: Question[] = [];
    
    for (const newDifficulty of expandedDifficulties) {
      try {
        const filename = `${grade}_${newDifficulty}_${subject}.json`;
        const response = await fetch(`/questions/${filename}`);
        
        if (response.ok) {
          const difficultyQuestions: Question[] = await response.json();
          questions.push(...difficultyQuestions.slice(0, 10)); // Limit per difficulty
        }
      } catch (error) {
        console.warn(`Could not load ${newDifficulty} questions:`, error);
      }
    }
    
    return {
      questions,
      strategy: 'difficulty_expansion',
      description: `Expanded to include ${expandedDifficulties.join(' and ')} difficulty levels`,
      originalCriteria: { grade, subject, difficulty },
      expandedCriteria: { difficulties: expandedDifficulties }
    };
  }
  
  /**
   * Try expanding to adjacent grades
   */
  private static async tryGradeExpansion(request: ExhaustionRequest): Promise<QuestionExpansionStrategy> {
    const { grade, subject, difficulty } = request;
    const adjacentGrades = [grade - 1, grade + 1].filter(g => g >= 1 && g <= 12);
    
    const questions: Question[] = [];
    
    for (const newGrade of adjacentGrades) {
      try {
        const filename = `${newGrade}_${difficulty}_${subject}.json`;
        const response = await fetch(`/questions/${filename}`);
        
        if (response.ok) {
          const gradeQuestions: Question[] = await response.json();
          questions.push(...gradeQuestions.slice(0, 10)); // Limit per grade
        }
      } catch (error) {
        console.warn(`Could not load Grade ${newGrade} questions:`, error);
      }
    }
    
    return {
      questions,
      strategy: 'grade_expansion',
      description: `Expanded to include Grade ${adjacentGrades.join(' and ')} questions`,
      originalCriteria: { grade, subject, difficulty },
      expandedCriteria: { grades: adjacentGrades }
    };
  }
  
  /**
   * Try expanding to related subjects
   */
  private static async trySubjectExpansion(request: ExhaustionRequest): Promise<QuestionExpansionStrategy> {
    const { grade, subject, difficulty } = request;
    const relatedSubjects = this.getRelatedSubjects(subject);
    
    const questions: Question[] = [];
    
    for (const newSubject of relatedSubjects) {
      try {
        const filename = `${grade}_${difficulty}_${newSubject}.json`;
        const response = await fetch(`/questions/${filename}`);
        
        if (response.ok) {
          const subjectQuestions: Question[] = await response.json();
          questions.push(...subjectQuestions.slice(0, 5)); // Limit per subject
        }
      } catch (error) {
        console.warn(`Could not load ${newSubject} questions:`, error);
      }
    }
    
    return {
      questions,
      strategy: 'subject_expansion',
      description: `Expanded to include related subjects: ${relatedSubjects.join(', ')}`,
      originalCriteria: { grade, subject, difficulty },
      expandedCriteria: { subjects: relatedSubjects }
    };
  }
  
  /**
   * Generate fallback questions when all else fails
   */
  private static async generateFallbackQuestions(request: ExhaustionRequest): Promise<QuestionExpansionStrategy> {
    const { grade, subject, difficulty } = request;
    
    // Generate basic questions as fallback
    const questions: Question[] = this.createBasicQuestions(grade, subject, difficulty);
    
    return {
      questions,
      strategy: 'generated_questions',
      description: 'Generated new practice questions to continue your learning',
      originalCriteria: { grade, subject, difficulty },
      expandedCriteria: {}
    };
  }
  
  /**
   * Get related subjects for expansion
   */
  private static getRelatedSubjects(subject: string): string[] {
    const subjectMap: Record<string, string[]> = {
      'mathematics': ['numeracy', 'mathematical_reasoning'],
      'numeracy': ['mathematics', 'mathematical_reasoning'],
      'mathematical_reasoning': ['mathematics', 'numeracy'],
      'english': ['reading', 'language'],
      'reading': ['english', 'language'],
      'language': ['english', 'reading'],
      'thinking_skills': ['english', 'mathematics'],
      'science': ['mathematics', 'thinking_skills'],
      'history': ['english', 'thinking_skills'],
      'geography': ['english', 'thinking_skills']
    };
    
    return subjectMap[subject] || ['english', 'mathematics'];
  }
  
  /**
   * Create basic fallback questions
   */
  private static createBasicQuestions(grade: number, subject: string, difficulty: DifficultyString): Question[] {
    const questions: Question[] = [];
    
    for (let i = 1; i <= 5; i++) {
      questions.push({
        _id: `generated_${subject}_${grade}_${difficulty}_${i}_${Date.now()}`,
        content: `Practice Question ${i} for Grade ${grade} ${subject}`,
        type: 'multiple_choice' as any, // Using any to avoid enum issues
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: `This is a generated practice question to help you continue learning ${subject}.`,
        difficulty: difficulty as any, // Using any to avoid enum conversion issues
        subject,
        grade: grade.toString(),
        topic: `${subject} practice`,
        tags: ['generated', 'practice'],
        createdBy: 'system',
        createdAt: new Date(),
        isGenerated: true,
        generatedAt: new Date(),
        generationMethod: 'exhaustion_fallback'
      });
    }
    
    return questions;
  }
  
  /**
   * Get user-friendly message for exhaustion scenario
   */
  static getExhaustionMessage(strategy: QuestionExpansionStrategy): string {
    switch (strategy.strategy) {
      case 'difficulty_expansion':
        return `Great progress! You've completed all ${strategy.originalCriteria.difficulty} questions. We've included some ${strategy.expandedCriteria.difficulties?.join(' and ')} questions to keep you challenged.`;
      
      case 'grade_expansion':
        return `Excellent work! You've mastered Grade ${strategy.originalCriteria.grade} questions. Here are some questions from nearby grades to expand your knowledge.`;
      
      case 'subject_expansion':
        return `Amazing! You've completed all ${strategy.originalCriteria.subject} questions. We've added some related subject questions to broaden your learning.`;
      
      case 'generated_questions':
        return `Outstanding progress! You've completed all available questions. We've created some new practice questions just for you.`;
      
      default:
        return 'Keep up the great work! Here are some additional questions to continue your learning journey.';
    }
  }
}

export default ProgressiveQuestionHandler;
