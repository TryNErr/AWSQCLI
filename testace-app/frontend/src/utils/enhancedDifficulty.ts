import { DifficultyLevel } from '../types';
import { calculateSuccessRate, getSubjectPerformance } from './questionStats';

interface DifficultySettings {
  baseComplexity: number;
  timeConstraint: number;
  conceptDepth: number;
  gradeOffset: number;
}

interface QuestionParameters {
  complexity: number;
  timeAllowed: number;
  conceptLevel: number;
  gradeLevel: number;
}

// Enhanced difficulty levels with more granular control
const DIFFICULTY_SETTINGS: { [key: string]: DifficultySettings } = {
  easy: {
    baseComplexity: 0.5,
    timeConstraint: 1.5,  // 150% of standard time
    conceptDepth: 0.6,
    gradeOffset: -0.5     // Half a grade level below
  },
  medium: {
    baseComplexity: 1.0,
    timeConstraint: 1.0,  // Standard time
    conceptDepth: 1.0,
    gradeOffset: 0        // At grade level
  },
  hard: {
    baseComplexity: 1.5,
    timeConstraint: 0.7,  // 70% of standard time
    conceptDepth: 1.4,
    gradeOffset: 0.5      // Half a grade level above
  }
};

// Subject-specific difficulty modifiers
const SUBJECT_MODIFIERS: { [key: string]: number } = {
  'Math': 1.2,           // Math questions get extra complexity
  'English': 1.0,
  'Science': 1.1,
  'Thinking Skills': 1.3 // Thinking skills questions are more challenging
};

/**
 * Calculate the effective difficulty level based on multiple factors
 */
export const calculateEffectiveDifficulty = (
  baseLevel: DifficultyLevel,
  grade: number,
  subject: string,
  recentPerformance: number
): QuestionParameters => {
  const settings = DIFFICULTY_SETTINGS[baseLevel.toLowerCase()];
  const subjectModifier = SUBJECT_MODIFIERS[subject] || 1.0;

  // Calculate performance-based adjustment (-0.2 to +0.2)
  const performanceAdjustment = ((recentPerformance - 70) / 100) * 0.4;

  // Calculate grade-relative complexity
  const gradeComplexity = Math.min(1.5, Math.max(0.5, 
    (settings.baseComplexity + performanceAdjustment) * subjectModifier
  ));

  // Calculate effective grade level (including offset)
  const effectiveGrade = Math.max(1, grade + settings.gradeOffset);

  return {
    complexity: gradeComplexity,
    timeAllowed: settings.timeConstraint,
    conceptLevel: settings.conceptDepth,
    gradeLevel: effectiveGrade
  };
};

/**
 * Generate question difficulty parameters
 */
export const generateQuestionParameters = (
  difficulty: string,
  grade: number,
  subject: string,
  userStats: any
): QuestionParameters => {
  const baseLevel = difficulty as DifficultyLevel;
  const recentPerformance = calculateRecentPerformance(userStats);

  const params = calculateEffectiveDifficulty(baseLevel, grade, subject, recentPerformance);

  // Apply additional modifiers for hard difficulty
  if (difficulty === 'hard') {
    // Increase complexity based on user's grade level
    params.complexity *= (1 + (grade / 20)); // Higher grades get progressively harder

    // Add grade-appropriate advanced concepts
    params.conceptLevel *= (1 + (grade / 15));

    // Reduce time for higher grades
    params.timeAllowed *= (1 - (grade / 24));
  }

  return params;
};

/**
 * Calculate user's recent performance trend
 */
const calculateRecentPerformance = (userStats: any): number => {
  if (!userStats || !userStats.recentScores || userStats.recentScores.length === 0) {
    return 70; // Default to 70% if no history
  }

  // Weight recent scores more heavily
  const weightedScores = userStats.recentScores
    .slice(-5) // Last 5 attempts
    .map((score: number, index: number) => ({
      score,
      weight: (index + 1) / 15 // More recent = higher weight
    }));

  const totalWeight = weightedScores.reduce((sum: number, item: any) => sum + item.weight, 0);
  const weightedAverage = weightedScores.reduce((sum: number, item: any) => 
    sum + (item.score * item.weight), 0) / totalWeight;

  return weightedAverage;
};

/**
 * Get question complexity modifiers based on difficulty parameters
 */
export const getQuestionModifiers = (params: QuestionParameters) => {
  return {
    // Number of steps required to solve
    stepCount: Math.ceil(params.complexity * 3),
    
    // Complexity of mathematical operations
    operationComplexity: Math.min(1.5, params.complexity * params.gradeLevel / 8),
    
    // Number of concepts combined in one question
    conceptIntegration: Math.ceil(params.conceptLevel * 2),
    
    // Time pressure factor
    timeFactor: params.timeAllowed,
    
    // Whether to include advanced grade-level concepts
    includeAdvancedConcepts: params.conceptLevel > 1.2,
    
    // Complexity of language used in the question
    languageComplexity: Math.min(1.5, (params.gradeLevel / 12) * params.complexity)
  };
};

/**
 * Adjust time limit based on question complexity
 */
export const calculateTimeLimit = (baseTime: number, params: QuestionParameters): number => {
  const complexityFactor = 1 + ((params.complexity - 1) * 0.5);
  const gradeFactor = 1 - ((params.gradeLevel - 1) * 0.02);
  const conceptFactor = 1 + ((params.conceptLevel - 1) * 0.3);

  return Math.round(baseTime * params.timeAllowed * complexityFactor * gradeFactor * conceptFactor);
};
