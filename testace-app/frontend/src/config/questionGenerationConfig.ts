/**
 * Configuration for Enhanced Question Generation
 * Addresses the issue of insufficient questions for timed tests
 */

export interface QuestionGenerationConfig {
  // Timed Test Configuration
  timedTest: {
    targetQuestionCount: number, // Default, but will be overridden by user settings
    minAcceptableQuestionCount: number, // Accept as low as 5 questions minimum
    maxGenerationAttempts: number, // Increased for better success rate
    requestMultiplier: number // Request 4x target count for better filtering
  },
  
  questionPool: {
    minPoolSize: number, // Maintain at least 50 questions per criteria
    maxPoolSize: number, // Cap at 200 to avoid memory issues
    regenerationThreshold: number, // Generate more when pool drops below 20
    batchGenerationSize: number // Generate 25 questions at a time
  },
  
  generation: {
    aggressiveGenerationEnabled: true,
    crossSubjectFallbackEnabled: true,
    emergencyGenerationEnabled: true,
    flexibleDifficultyEnabled: true
  },
  
  quality: {
    minAnswerValidationConfidence: 0.7, // Slightly lower for more questions
    maxDuplicateRate: 0.05, // Allow up to 5% duplicates if needed
    professionalAnswersRequired: true,
    structureValidationEnabled: true
  },
  
  performance: {
    maxConcurrentGenerations: 5,
    generationTimeoutMs: 30000, // 30 second timeout per generation
    cacheGeneratedQuestions: true,
    preloadQuestionPools: false // Disable preloading to avoid startup delays
  }
};

// Default configuration
export const DEFAULT_QUESTION_GENERATION_CONFIG: QuestionGenerationConfig = {
  timedTest: {
    targetQuestionCount: 30,
    minAcceptableQuestionCount: 5,
    maxGenerationAttempts: 200,
    requestMultiplier: 4
  },
  
  questionPool: {
    minPoolSize: 50,
    maxPoolSize: 200,
    regenerationThreshold: 20,
    batchGenerationSize: 25
  },
  
  generation: {
    aggressiveGenerationEnabled: true,
    crossSubjectFallbackEnabled: true,
    emergencyGenerationEnabled: true,
    flexibleDifficultyEnabled: true
  },
  
  quality: {
    minAnswerValidationConfidence: 0.7,
    maxDuplicateRate: 0.05,
    professionalAnswersRequired: true,
    structureValidationEnabled: true
  },
  
  performance: {
    maxConcurrentGenerations: 5,
    generationTimeoutMs: 30000,
    cacheGeneratedQuestions: true,
    preloadQuestionPools: false
  }
};

// Subject-specific configurations
export const SUBJECT_SPECIFIC_CONFIGS: Record<string, Partial<QuestionGenerationConfig>> = {
  'Mathematical Reasoning': {
    timedTest: {
      targetQuestionCount: 30,
      minAcceptableQuestionCount: 20, // Math reasoning is harder to generate
      maxGenerationAttempts: 200,
      requestMultiplier: 4
    },
    questionPool: {
      minPoolSize: 40,
      maxPoolSize: 200,
      regenerationThreshold: 20,
      batchGenerationSize: 20
    }
  },
  
  'Thinking Skills': {
    timedTest: {
      targetQuestionCount: 30,
      minAcceptableQuestionCount: 25,
      maxGenerationAttempts: 175,
      requestMultiplier: 3
    },
    questionPool: {
      minPoolSize: 45,
      maxPoolSize: 200,
      regenerationThreshold: 20,
      batchGenerationSize: 22
    }
  },
  
  'Math': {
    timedTest: {
      targetQuestionCount: 30,
      minAcceptableQuestionCount: 28, // Math questions are easier to generate
      maxGenerationAttempts: 120,
      requestMultiplier: 2.5
    },
    questionPool: {
      minPoolSize: 60,
      maxPoolSize: 200,
      regenerationThreshold: 20,
      batchGenerationSize: 30
    }
  },
  
  'English': {
    timedTest: {
      targetQuestionCount: 30,
      minAcceptableQuestionCount: 27,
      maxGenerationAttempts: 130,
      requestMultiplier: 2.5
    },
    questionPool: {
      minPoolSize: 55,
      maxPoolSize: 200,
      regenerationThreshold: 20,
      batchGenerationSize: 28
    }
  }
};

// Grade-specific adjustments
export const GRADE_SPECIFIC_ADJUSTMENTS: Record<string, Partial<QuestionGenerationConfig>> = {
  // Elementary grades (1-5) - easier to generate
  '1': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 100, requestMultiplier: 4 } },
  '2': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 100, requestMultiplier: 4 } },
  '3': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 110, requestMultiplier: 4 } },
  '4': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 110, requestMultiplier: 4 } },
  '5': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 120, requestMultiplier: 4 } },
  
  // Middle grades (6-8) - moderate difficulty
  '6': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 140, requestMultiplier: 4 } },
  '7': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 150, requestMultiplier: 4 } },
  '8': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 160, requestMultiplier: 4 } },
  
  // High school grades (9-12) - more complex, need more attempts
  '9': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 180, requestMultiplier: 4 } },
  '10': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 190, requestMultiplier: 4 } },
  '11': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 200, requestMultiplier: 4 } },
  '12': { timedTest: { targetQuestionCount: 30, minAcceptableQuestionCount: 5, maxGenerationAttempts: 220, requestMultiplier: 4 } }
};

/**
 * Gets the effective configuration for a specific context
 */
export function getEffectiveConfig(
  subject: string,
  grade: string,
  baseConfig: QuestionGenerationConfig = DEFAULT_QUESTION_GENERATION_CONFIG
): QuestionGenerationConfig {
  let effectiveConfig = { ...baseConfig };
  
  // Apply subject-specific overrides
  if (SUBJECT_SPECIFIC_CONFIGS[subject]) {
    effectiveConfig = mergeConfigs(effectiveConfig, SUBJECT_SPECIFIC_CONFIGS[subject]);
  }
  
  // Apply grade-specific adjustments
  if (GRADE_SPECIFIC_ADJUSTMENTS[grade]) {
    effectiveConfig = mergeConfigs(effectiveConfig, GRADE_SPECIFIC_ADJUSTMENTS[grade]);
  }
  
  return effectiveConfig;
}

/**
 * Merges configuration objects deeply
 */
function mergeConfigs(
  base: QuestionGenerationConfig,
  override: Partial<QuestionGenerationConfig>
): QuestionGenerationConfig {
  const result = { ...base };
  
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key as keyof QuestionGenerationConfig] = {
        ...result[key as keyof QuestionGenerationConfig],
        ...value
      } as any;
    } else {
      result[key as keyof QuestionGenerationConfig] = value as any;
    }
  }
  
  return result;
}

/**
 * Validates configuration values
 */
export function validateConfig(config: QuestionGenerationConfig): string[] {
  const errors: string[] = [];
  
  if (config.timedTest.minAcceptableQuestionCount > config.timedTest.targetQuestionCount) {
    errors.push('minAcceptableQuestionCount cannot be greater than targetQuestionCount');
  }
  
  if (config.timedTest.maxGenerationAttempts < config.timedTest.targetQuestionCount) {
    errors.push('maxGenerationAttempts should be at least equal to targetQuestionCount');
  }
  
  if (config.quality.minAnswerValidationConfidence < 0 || config.quality.minAnswerValidationConfidence > 1) {
    errors.push('minAnswerValidationConfidence must be between 0 and 1');
  }
  
  if (config.quality.maxDuplicateRate < 0 || config.quality.maxDuplicateRate > 1) {
    errors.push('maxDuplicateRate must be between 0 and 1');
  }
  
  return errors;
}

export default DEFAULT_QUESTION_GENERATION_CONFIG;
