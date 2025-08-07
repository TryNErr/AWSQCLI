import { Question, DifficultyLevel, QuestionType } from '../types';
import { ReadingPassage } from './readingPassagesDatabase';
import grade1And2ReadingPassages from './expandedReadingPassagesGrade1-2';
import grade3And4ReadingPassages from './expandedReadingPassagesGrade3-4';
import grade5And6ReadingPassages from './expandedReadingPassagesGrade5-6';
import grade7And8ReadingPassages from './expandedReadingPassagesGrade7-8';
import grade9To12ReadingPassages from './expandedReadingPassagesGrade9-12';
import additionalReadingPassages from './additionalReadingPassages';
import bonusReadingPassages from './bonusReadingPassages';
import extraReadingPassages from './extraReadingPassages';
import finalReadingPassages from './finalReadingPassages';

/**
 * Comprehensive Reading Database with 200+ Passages
 * 
 * This database provides extensive variety in reading comprehension questions
 * to ensure timed tests never run out of content. Includes:
 * 
 * - 50+ passages for Grades 1-2 (beginning readers)
 * - 50+ passages for Grades 3-4 (developing readers) 
 * - 50+ passages for Grades 5-6 (fluent readers)
 * - 50+ passages for Grades 7-8 (advanced readers)
 * - 50+ passages for Grades 9-12 (college-prep readers)
 * 
 * Genres covered:
 * - Fiction (adventure, fantasy, realistic fiction)
 * - Non-fiction (science, history, biography)
 * - Poetry and literature
 * - Informational texts
 * 
 * Each passage includes 2-4 comprehension questions testing:
 * - Literal comprehension (details, facts)
 * - Inferential thinking (cause/effect, predictions)
 * - Critical analysis (main idea, author's purpose)
 * - Vocabulary in context
 */

// Master Reading Database - Combines all expanded passages
export const comprehensiveReadingDatabase: ReadingPassage[] = [
  ...grade1And2ReadingPassages,
  ...grade3And4ReadingPassages,
  ...grade5And6ReadingPassages,
  ...grade7And8ReadingPassages,
  ...grade9To12ReadingPassages,
  ...additionalReadingPassages,
  ...bonusReadingPassages,
  ...extraReadingPassages,
  ...finalReadingPassages
];

/**
 * Utility functions for accessing reading passages
 */
export class ComprehensiveReadingDatabase {
  
  /**
   * Get all passages for a specific grade
   */
  static getPassagesByGrade(grade: string): ReadingPassage[] {
    return comprehensiveReadingDatabase.filter(passage => passage.grade === grade);
  }
  
  /**
   * Get passages by difficulty level
   */
  static getPassagesByDifficulty(difficulty: DifficultyLevel): ReadingPassage[] {
    return comprehensiveReadingDatabase.filter(passage => passage.difficulty === difficulty);
  }
  
  /**
   * Get passages by genre
   */
  static getPassagesByGenre(genre: string): ReadingPassage[] {
    return comprehensiveReadingDatabase.filter(passage => passage.genre === genre);
  }
  
  /**
   * Get passages by grade and difficulty
   */
  static getPassagesByGradeAndDifficulty(grade: string, difficulty: DifficultyLevel): ReadingPassage[] {
    return comprehensiveReadingDatabase.filter(
      passage => passage.grade === grade && passage.difficulty === difficulty
    );
  }
  
  /**
   * Get random passages with filters
   */
  static getRandomPassages(
    count: number,
    filters: {
      grade?: string;
      difficulty?: DifficultyLevel;
      genre?: string;
    } = {}
  ): ReadingPassage[] {
    let filteredPassages = comprehensiveReadingDatabase;
    
    if (filters.grade) {
      filteredPassages = filteredPassages.filter(p => p.grade === filters.grade);
    }
    
    if (filters.difficulty) {
      filteredPassages = filteredPassages.filter(p => p.difficulty === filters.difficulty);
    }
    
    if (filters.genre) {
      filteredPassages = filteredPassages.filter(p => p.genre === filters.genre);
    }
    
    // Shuffle and return requested count
    const shuffled = [...filteredPassages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  /**
   * Get all questions from passages (for question pool)
   */
  static getAllQuestions(): Question[] {
    const allQuestions: Question[] = [];
    
    comprehensiveReadingDatabase.forEach(passage => {
      allQuestions.push(...passage.questions);
    });
    
    return allQuestions;
  }
  
  /**
   * Get questions by grade and difficulty
   */
  static getQuestionsByGradeAndDifficulty(grade: string, difficulty: DifficultyLevel): Question[] {
    const passages = this.getPassagesByGradeAndDifficulty(grade, difficulty);
    const questions: Question[] = [];
    
    passages.forEach(passage => {
      questions.push(...passage.questions);
    });
    
    return questions;
  }
  
  /**
   * Get database statistics
   */
  static getStatistics() {
    const stats = {
      totalPassages: comprehensiveReadingDatabase.length,
      totalQuestions: this.getAllQuestions().length,
      byGrade: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byGenre: {} as Record<string, number>,
      averageQuestionsPerPassage: 0,
      averageWordsPerPassage: 0
    };
    
    let totalWords = 0;
    
    comprehensiveReadingDatabase.forEach(passage => {
      // Count by grade
      stats.byGrade[passage.grade] = (stats.byGrade[passage.grade] || 0) + 1;
      
      // Count by difficulty
      stats.byDifficulty[passage.difficulty] = (stats.byDifficulty[passage.difficulty] || 0) + 1;
      
      // Count by genre
      stats.byGenre[passage.genre] = (stats.byGenre[passage.genre] || 0) + 1;
      
      // Add to word count
      totalWords += passage.wordCount;
    });
    
    stats.averageQuestionsPerPassage = Math.round(stats.totalQuestions / stats.totalPassages * 100) / 100;
    stats.averageWordsPerPassage = Math.round(totalWords / stats.totalPassages);
    
    return stats;
  }
}

// Export the comprehensive database as default
export default comprehensiveReadingDatabase;
