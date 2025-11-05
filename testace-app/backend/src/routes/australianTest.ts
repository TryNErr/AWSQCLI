import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Question, DifficultyLevel } from '../../../shared/types';

const router = express.Router();

interface AustralianTestFormat {
  name: string;
  totalQuestions: number;
  sections: TestSection[];
  timeLimit: number;
  description: string;
}

interface TestSection {
  name: string;
  subject: string;
  questionCount: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface GeneratedTest {
  id: string;
  format: string;
  grade: string;
  questions: Question[];
  sections: TestSectionResult[];
  totalQuestions: number;
  estimatedTime: number;
  createdAt: Date;
}

interface TestSectionResult {
  name: string;
  subject: string;
  questions: Question[];
  startIndex: number;
  endIndex: number;
}

const AUSTRALIAN_TEST_FORMATS: Record<string, AustralianTestFormat> = {
  'opportunity-class': {
    name: 'Opportunity Class Test',
    totalQuestions: 40,
    timeLimit: 165,
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
    timeLimit: 180,
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

class AustralianTestGenerator {
  private allQuestions: Question[] = [];
  private isLoaded = false;

  async loadQuestions(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const questionsPath = path.join(__dirname, '../../../combined_json_output.json');
      const data = await fs.readFile(questionsPath, 'utf-8');
      this.allQuestions = JSON.parse(data);
      this.isLoaded = true;
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
    return mapping[subject.toLowerCase()] || subject.toLowerCase();
  }

  private getQuestionsByGradeAndSubject(grade: string, subject: string): Question[] {
    return this.allQuestions.filter(q => {
      const questionGrade = String(q.grade || '').toLowerCase();
      const targetGrade = grade.toLowerCase();
      const questionSubject = this.mapSubjectToSection(q.subject);
      
      return questionGrade === targetGrade && questionSubject === subject;
    });
  }

  private selectQuestionsByDifficulty(
    questions: Question[], 
    distribution: { easy: number; medium: number; hard: number }
  ): Question[] {
    const selected: Question[] = [];
    
    const byDifficulty = {
      easy: questions.filter(q => q.difficulty === DifficultyLevel.EASY),
      medium: questions.filter(q => q.difficulty === DifficultyLevel.MEDIUM),
      hard: questions.filter(q => q.difficulty === DifficultyLevel.HARD)
    };

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
      let availableQuestions = this.getQuestionsByGradeAndSubject(grade, section.subject);
      
      availableQuestions = availableQuestions.filter(q => 
        !excludeAnsweredQuestions.includes(q._id)
      );

      if (availableQuestions.length < section.questionCount) {
        console.warn(`Insufficient questions for ${section.name}. Available: ${availableQuestions.length}, Required: ${section.questionCount}`);
      }

      const sectionQuestions = this.selectQuestionsByDifficulty(
        availableQuestions, 
        section.difficultyDistribution
      );

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
}

const testGenerator = new AustralianTestGenerator();

// Generate Australian test
router.post('/generate', async (req, res) => {
  try {
    const { format, grade, excludeQuestions = [] } = req.body;

    if (!format || !grade) {
      return res.status(400).json({
        error: 'Format and grade are required'
      });
    }

    const generatedTest = await testGenerator.generateTest(format, grade, excludeQuestions);
    
    res.json({
      success: true,
      test: generatedTest
    });
  } catch (error) {
    console.error('Error generating Australian test:', error);
    res.status(500).json({
      error: 'Failed to generate test',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get available test formats
router.get('/formats', (req, res) => {
  res.json({
    success: true,
    formats: AUSTRALIAN_TEST_FORMATS
  });
});

// Validate test generation
router.post('/validate', async (req, res) => {
  try {
    const { format, grade } = req.body;

    if (!format || !grade) {
      return res.status(400).json({
        error: 'Format and grade are required'
      });
    }

    await testGenerator.loadQuestions();
    
    const testFormat = AUSTRALIAN_TEST_FORMATS[format];
    if (!testFormat) {
      return res.status(400).json({
        error: `Unknown test format: ${format}`
      });
    }

    const issues: string[] = [];
    const recommendations: string[] = [];
    let totalAvailable = 0;

    for (const section of testFormat.sections) {
      const available = testGenerator['getQuestionsByGradeAndSubject'](grade, section.subject).length;
      totalAvailable += available;
      
      if (available < section.questionCount) {
        issues.push(`${section.name}: Need ${section.questionCount}, have ${available}`);
      } else if (available < section.questionCount * 2) {
        recommendations.push(`${section.name}: Limited questions (${available}). Consider adding more.`);
      }
    }

    const canGenerate = issues.length === 0 && totalAvailable >= testFormat.totalQuestions;

    if (!canGenerate && issues.length === 0) {
      issues.push(`Insufficient total questions. Need ${testFormat.totalQuestions}, have ${totalAvailable}`);
    }

    res.json({
      success: true,
      validation: {
        canGenerate,
        issues,
        recommendations
      }
    });
  } catch (error) {
    console.error('Error validating test generation:', error);
    res.status(500).json({
      error: 'Failed to validate test generation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
