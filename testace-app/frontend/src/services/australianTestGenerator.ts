/**
 * Australian Test Generator Service
 * Generates test sets from available questions following Australian test formats
 */

import { Question, DifficultyLevel } from '../types';

export interface AustralianTestFormat {
  name: string;
  totalQuestions: number;
  sections: TestSection[];
  timeLimit: number; // in minutes
  description: string;
}

export interface TestSection {
  name: string;
  subject: string;
  questionCount: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface GeneratedTest {
  id: string;
  format: string;
  grade: string;
  questions: Question[];
  sections: TestSectionResult[];
  totalQuestions: number;
  estimatedTime: number;
  createdAt: Date;
}

export interface TestSectionResult {
  name: string;
  subject: string;
  questions: Question[];
  startIndex: number;
  endIndex: number;
}

// Australian Test Formats
export const AUSTRALIAN_TEST_FORMATS: Record<string, AustralianTestFormat> = {
  'opportunity-class': {
    name: 'Opportunity Class Test',
    totalQuestions: 40,
    timeLimit: 165, // 2 hours 45 minutes
    description: 'For gifted students in Years 4-5',
    sections: [
      {
        name: 'Thinking Skills',
        subject: 'thinking-skills',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      },
      {
        name: 'Reading',
        subject: 'reading',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      },
      {
        name: 'Mathematics',
        subject: 'math',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      },
      {
        name: 'English',
        subject: 'english',
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      }
    ]
  },
  'selective-school': {
    name: 'Selective School Test',
    totalQuestions: 50,
    timeLimit: 180, // 3 hours
    description: 'For entry into selective high schools',
    sections: [
      {
        name: 'Thinking Skills',
        subject: 'thinking-skills',
        questionCount: 13,
        difficultyDistribution: { easy: 3, medium: 6, hard: 4 }
      },
      {
        name: 'Reading',
        subject: 'reading',
        questionCount: 12,
        difficultyDistribution: { easy: 3, medium: 6, hard: 3 }
      },
      {
        name: 'Mathematics',
        subject: 'math',
        questionCount: 13,
        difficultyDistribution: { easy: 3, medium: 6, hard: 4 }
      },
      {
        name: 'English',
        subject: 'english',
        questionCount: 12,
        difficultyDistribution: { easy: 3, medium: 6, hard: 3 }
      }
    ]
  }
};

class AustralianTestGeneratorService {
  private allQuestions: Question[] = [];
  private isLoaded = false;

  async loadQuestions(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Try multiple paths in case of different deployment scenarios
      const paths = ['/combined_json_output.json', './combined_json_output.json', '/public/combined_json_output.json'];
      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const path of paths) {
        try {
          response = await fetch(path);
          if (response.ok) break;
        } catch (error) {
          lastError = error as Error;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Failed to load questions from any path. Last error: ${lastError?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Questions file is empty or invalid format');
      }
      
      this.allQuestions = data;
      this.isLoaded = true;
      console.log(`Loaded ${data.length} questions successfully`);
    } catch (error) {
      console.error('Error loading questions:', error);
      throw error;
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private mapSubjectToSection(subject: string): string {
    const mapping: Record<string, string> = {
      'thinking_skills': 'thinking-skills',
      'thinking-skills': 'thinking-skills',
      'mathematical-reasoning': 'thinking-skills',
      'reading': 'reading',
      'math': 'math',
      'mathematics': 'math',
      'english': 'english'
    };
    return mapping[subject?.toLowerCase() || ''] || subject?.toLowerCase() || '';
  }

  private getQuestionsByGradeAndSubject(grade: string, subject: string): Question[] {
    return this.allQuestions.filter(q => {
      const questionGrade = String(q.grade || '').toLowerCase();
      const targetGrade = grade.toLowerCase();
      const questionSubject = this.mapSubjectToSection(q.subject || '');
      
      return questionGrade === targetGrade && questionSubject === subject;
    });
  }

  private selectQuestionsByDifficulty(
    questions: Question[], 
    distribution: { easy: number; medium: number; hard: number }
  ): Question[] {
    const selected: Question[] = [];
    
    // Group by difficulty
    const byDifficulty = {
      easy: questions.filter(q => q.difficulty === DifficultyLevel.EASY),
      medium: questions.filter(q => q.difficulty === DifficultyLevel.MEDIUM),
      hard: questions.filter(q => q.difficulty === DifficultyLevel.HARD)
    };

    // Select from each difficulty level
    Object.entries(distribution).forEach(([difficulty, count]) => {
      const availableQuestions = byDifficulty[difficulty as keyof typeof byDifficulty];
      const shuffled = this.shuffleArray(availableQuestions);
      selected.push(...shuffled.slice(0, count));
    });

    return this.shuffleArray(selected);
  }

  async generateTest(
    formatName: string, 
    grade: string, 
    excludeAnsweredQuestions: string[] = []
  ): Promise<GeneratedTest> {
    await this.loadQuestions();

    const format = AUSTRALIAN_TEST_FORMATS[formatName];
    if (!format) {
      throw new Error(`Unknown test format: ${formatName}`);
    }

    const testSections: TestSectionResult[] = [];
    const allTestQuestions: Question[] = [];
    let currentIndex = 0;

    for (const section of format.sections) {
      // Get available questions for this section
      let availableQuestions = this.getQuestionsByGradeAndSubject(grade, section.subject);
      
      // Filter out already answered questions
      availableQuestions = availableQuestions.filter(q => 
        !excludeAnsweredQuestions.includes(q._id)
      );

      if (availableQuestions.length < section.questionCount) {
        console.warn(`Insufficient questions for ${section.name}. Available: ${availableQuestions.length}, Required: ${section.questionCount}`);
      }

      // Select questions based on difficulty distribution
      const sectionQuestions = this.selectQuestionsByDifficulty(
        availableQuestions, 
        section.difficultyDistribution
      );

      // Take only what we need, up to the section requirement
      const finalSectionQuestions = sectionQuestions.slice(0, section.questionCount);
      
      testSections.push({
        name: section.name,
        subject: section.subject,
        questions: finalSectionQuestions,
        startIndex: currentIndex,
        endIndex: currentIndex + finalSectionQuestions.length - 1
      });

      allTestQuestions.push(...finalSectionQuestions);
      currentIndex += finalSectionQuestions.length;
    }

    return {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      format: formatName,
      grade,
      questions: allTestQuestions,
      sections: testSections,
      totalQuestions: allTestQuestions.length,
      estimatedTime: format.timeLimit,
      createdAt: new Date()
    };
  }

  getAvailableQuestionCounts(grade: string): Record<string, number> {
    const counts: Record<string, number> = {};
    
    ['thinking-skills', 'reading', 'math', 'english'].forEach(subject => {
      counts[subject] = this.getQuestionsByGradeAndSubject(grade, subject).length;
    });

    return counts;
  }

  getTestFormats(): AustralianTestFormat[] {
    return Object.values(AUSTRALIAN_TEST_FORMATS);
  }

  validateTestGeneration(formatName: string, grade: string): {
    canGenerate: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const format = AUSTRALIAN_TEST_FORMATS[formatName];
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!format) {
      issues.push(`Unknown test format: ${formatName}`);
      return { canGenerate: false, issues, recommendations };
    }

    const availableCounts = this.getAvailableQuestionCounts(grade);
    let totalAvailable = 0;

    format.sections.forEach(section => {
      const available = availableCounts[section.subject] || 0;
      totalAvailable += available;
      
      if (available < section.questionCount) {
        issues.push(`${section.name}: Need ${section.questionCount}, have ${available}`);
      } else if (available < section.questionCount * 2) {
        recommendations.push(`${section.name}: Limited questions (${available}). Consider adding more.`);
      }
    });

    const canGenerate = issues.length === 0 && totalAvailable >= format.totalQuestions;

    if (!canGenerate && issues.length === 0) {
      issues.push(`Insufficient total questions. Need ${format.totalQuestions}, have ${totalAvailable}`);
    }

    return { canGenerate, issues, recommendations };
  }
}

export default new AustralianTestGeneratorService();
