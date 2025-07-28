import { DifficultyLevel } from '../types';
import { calculateSuccessRate, getSubjectPerformance } from './questionStats';

interface AdaptiveSettings {
  targetSuccessRate: number;
  adjustmentThreshold: number;
  minQuestionsRequired: number;
}

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

const DEFAULT_SETTINGS: AdaptiveSettings = {
  targetSuccessRate: 70, // Aim for 70% success rate
  adjustmentThreshold: 15, // Adjust if success rate differs by 15%
  minQuestionsRequired: 10 // Minimum questions needed before adjusting
};

export const getDifficultyKey = (difficulty: DifficultyLevel): keyof DifficultyDistribution => {
  switch (difficulty) {
    case DifficultyLevel.EASY: return 'easy';
    case DifficultyLevel.MEDIUM: return 'medium';
    case DifficultyLevel.HARD: return 'hard';
    default: return 'medium';
  }
};

export const getDefaultDistribution = (difficulty: string): DifficultyDistribution => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return { easy: 60, medium: 30, hard: 10 };
    case 'hard':
      return { easy: 10, medium: 30, hard: 60 };
    default:
      return { easy: 30, medium: 40, hard: 30 };
  }
};

/**
 * Calculate recommended difficulty distribution based on performance
 */
export const calculateAdaptiveDistribution = (
  subject: string,
  currentDifficulty: string,
  settings: AdaptiveSettings = DEFAULT_SETTINGS
): DifficultyDistribution | null => {
  const stats = getSubjectPerformance(subject);
  if (!stats?.performance) return null;

  const successRates: DifficultyDistribution = {
    easy: calculateSuccessRate(subject, DifficultyLevel.EASY),
    medium: calculateSuccessRate(subject, DifficultyLevel.MEDIUM),
    hard: calculateSuccessRate(subject, DifficultyLevel.HARD)
  };

  // Check if we have enough data
  const hasEnoughData = Object.values(stats.performance).every(
    p => p.totalAttempts >= settings.minQuestionsRequired
  );

  if (!hasEnoughData) {
    return getDefaultDistribution(currentDifficulty);
  }

  // Adjust distribution based on performance
  const distribution = getDefaultDistribution(currentDifficulty);
  const currentRate = successRates[currentDifficulty.toLowerCase() as keyof DifficultyDistribution];
  
  // If success rate is too high, increase difficulty
  if (currentRate > settings.targetSuccessRate + settings.adjustmentThreshold) {
    return increaseDifficulty(distribution);
  }
  
  // If success rate is too low, decrease difficulty
  if (currentRate < settings.targetSuccessRate - settings.adjustmentThreshold) {
    return decreaseDifficulty(distribution);
  }

  return distribution;
};

/**
 * Get recommended difficulty level based on performance
 */
export const getRecommendedDifficulty = (
  subject: string,
  settings: AdaptiveSettings = DEFAULT_SETTINGS
): string => {
  const stats = getSubjectPerformance(subject);
  if (!stats?.performance) return 'medium';

  const successRates: DifficultyDistribution = {
    easy: calculateSuccessRate(subject, DifficultyLevel.EASY),
    medium: calculateSuccessRate(subject, DifficultyLevel.MEDIUM),
    hard: calculateSuccessRate(subject, DifficultyLevel.HARD)
  };

  // Find the difficulty level closest to the target success rate
  const targetRate = settings.targetSuccessRate;
  const differences = Object.entries(successRates).map(([difficulty, rate]) => ({
    difficulty,
    difference: Math.abs(rate - targetRate)
  }));

  const recommended = differences.reduce((prev, curr) => 
    curr.difference < prev.difference ? curr : prev
  );

  return recommended.difficulty;
};

// Helper functions
const increaseDifficulty = (distribution: DifficultyDistribution): DifficultyDistribution => {
  // Shift 10% of questions towards harder difficulties
  return {
    easy: Math.max(distribution.easy - 10, 0),
    medium: distribution.medium,
    hard: Math.min(distribution.hard + 10, 100)
  };
};

const decreaseDifficulty = (distribution: DifficultyDistribution): DifficultyDistribution => {
  // Shift 10% of questions towards easier difficulties
  return {
    easy: Math.min(distribution.easy + 10, 100),
    medium: distribution.medium,
    hard: Math.max(distribution.hard - 10, 0)
  };
};
