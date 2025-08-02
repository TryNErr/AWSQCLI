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

// Enhanced difficulty levels with more granular control and grade-specific scaling
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
    baseComplexity: 1.8,  // Increased from 1.5 for more challenge
    timeConstraint: 0.6,  // Reduced from 0.7 for more time pressure
    conceptDepth: 1.6,    // Increased from 1.4 for deeper concepts
    gradeOffset: 1.0      // Increased from 0.5 - full grade level above
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
 * Generate question difficulty parameters with enhanced Grade 9+ scaling
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

  // Apply additional modifiers for hard difficulty with special Grade 9+ scaling
  if (difficulty === 'hard') {
    // Significant complexity increase for Grade 9+
    if (grade >= 9) {
      params.complexity *= (1.5 + (grade - 9) / 10); // Much more aggressive scaling
      params.conceptLevel *= (1.4 + (grade - 9) / 12); // Deeper concepts for high school
      params.timeAllowed *= (0.8 - (grade - 9) / 20); // More time pressure
    } else {
      // Standard scaling for lower grades
      params.complexity *= (1 + (grade / 20));
      params.conceptLevel *= (1 + (grade / 15));
      params.timeAllowed *= (1 - (grade / 24));
    }

    // Special handling for Thinking Skills in Grade 9+
    if (subject === 'Thinking Skills' && grade >= 9) {
      params.complexity *= 1.3; // Extra complexity for thinking skills
      params.conceptLevel *= 1.2; // More sophisticated concepts
    }
  }

  // Ensure minimum challenge levels for Grade 9+
  if (grade >= 9) {
    params.complexity = Math.max(params.complexity, 1.2); // Minimum complexity
    params.conceptLevel = Math.max(params.conceptLevel, 1.1); // Minimum concept depth
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
 * Get question complexity modifiers based on difficulty parameters with Grade 9+ enhancements
 */
export const getQuestionModifiers = (params: QuestionParameters) => {
  return {
    // Number of steps required to solve - more for high school
    stepCount: Math.ceil(params.complexity * (params.gradeLevel >= 9 ? 4 : 3)),
    
    // Complexity of mathematical operations
    operationComplexity: Math.min(2.0, params.complexity * params.gradeLevel / (params.gradeLevel >= 9 ? 6 : 8)),
    
    // Number of concepts combined in one question - more integration for Grade 9+
    conceptIntegration: Math.ceil(params.conceptLevel * (params.gradeLevel >= 9 ? 3 : 2)),
    
    // Time pressure factor
    timeFactor: params.timeAllowed,
    
    // Whether to include advanced grade-level concepts - lower threshold for Grade 9+
    includeAdvancedConcepts: params.gradeLevel >= 9 ? params.conceptLevel > 1.0 : params.conceptLevel > 1.2,
    
    // Complexity of language used in the question - more sophisticated for high school
    languageComplexity: Math.min(2.0, (params.gradeLevel / (params.gradeLevel >= 9 ? 8 : 12)) * params.complexity),
    
    // Whether to include multi-step reasoning (especially important for Grade 9+)
    requiresMultiStepReasoning: params.gradeLevel >= 9 && params.complexity > 1.3,
    
    // Abstract thinking requirement
    abstractThinkingLevel: params.gradeLevel >= 9 ? Math.min(1.5, params.conceptLevel) : Math.min(1.0, params.conceptLevel)
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
