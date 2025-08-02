/**
 * Question Difficulty Assessment and Correction System
 * Fixes incorrectly classified question difficulties
 */

import { Question, DifficultyLevel } from '../types';

interface DifficultyAssessment {
  conceptComplexity: number;
  operationComplexity: number;
  gradeAppropriate: boolean;
  suggestedDifficulty: DifficultyLevel;
}

/**
 * Assess the actual difficulty of a question based on its content
 */
export const assessQuestionDifficulty = (question: Question): DifficultyAssessment => {
  const content = question.content.toLowerCase();
  const grade = parseInt(question.grade);
  
  // Check for basic arithmetic operations
  const hasBasicArithmetic = /\d+\.?\d*\s*[+\-×÷*\/]\s*\d+\.?\d*/.test(content);
  const hasSimpleDecimals = /\d+\.\d{1,2}\s*[×*]\s*\d+(?!\.)/.test(content);
  const hasComplexOperations = /\^|\√|sin|cos|tan|log|ln/.test(content);
  const hasAlgebra = /[a-z]\s*[=+\-×÷*\/]|solve.*for|find.*x|equation/.test(content);
  const hasGeometry = /area|volume|perimeter|angle|triangle|circle|sphere|cone/.test(content);
  const hasAdvancedMath = /simultaneous|quadratic|derivative|integral|matrix/.test(content);
  
  let conceptComplexity = 0;
  let operationComplexity = 0;
  
  // Assess concept complexity
  if (hasBasicArithmetic && !hasAlgebra && !hasGeometry) {
    conceptComplexity = 1; // Basic arithmetic
  } else if (hasAlgebra && !hasAdvancedMath) {
    conceptComplexity = 2; // Basic algebra
  } else if (hasGeometry && !hasAdvancedMath) {
    conceptComplexity = 2; // Basic geometry
  } else if (hasAdvancedMath) {
    conceptComplexity = 3; // Advanced concepts
  } else {
    conceptComplexity = 1; // Default to basic
  }
  
  // Assess operation complexity
  if (hasSimpleDecimals && !hasComplexOperations) {
    operationComplexity = 1; // Simple decimal operations
  } else if (hasBasicArithmetic && !hasComplexOperations) {
    operationComplexity = 1; // Basic operations
  } else if (hasComplexOperations) {
    operationComplexity = 3; // Complex operations
  } else {
    operationComplexity = 2; // Moderate operations
  }
  
  // Determine appropriate difficulty
  let suggestedDifficulty: DifficultyLevel;
  const totalComplexity = conceptComplexity + operationComplexity;
  
  if (totalComplexity <= 2) {
    suggestedDifficulty = DifficultyLevel.EASY;
  } else if (totalComplexity <= 4) {
    suggestedDifficulty = DifficultyLevel.MEDIUM;
  } else {
    suggestedDifficulty = DifficultyLevel.HARD;
  }
  
  // Special cases for Grade 9+
  if (grade >= 9) {
    // Simple decimal multiplication should be Easy for Grade 9
    if (hasSimpleDecimals && !hasAlgebra && !hasGeometry) {
      suggestedDifficulty = DifficultyLevel.EASY;
    }
    // Basic algebra should be Medium for Grade 9
    else if (hasAlgebra && !hasAdvancedMath) {
      suggestedDifficulty = DifficultyLevel.MEDIUM;
    }
  }
  
  // Check if current difficulty is grade-appropriate
  const gradeAppropriate = isGradeAppropriate(question, suggestedDifficulty, grade);
  
  return {
    conceptComplexity,
    operationComplexity,
    gradeAppropriate,
    suggestedDifficulty
  };
};

/**
 * Check if a difficulty level is appropriate for the grade
 */
const isGradeAppropriate = (question: Question, difficulty: DifficultyLevel, grade: number): boolean => {
  const content = question.content.toLowerCase();
  
  // Grade 9+ specific checks
  if (grade >= 9) {
    // Simple arithmetic should not be Hard for Grade 9+
    if (difficulty === DifficultyLevel.HARD && /^\d+\.?\d*\s*[×*]\s*\d+\.?\d*$/.test(content.replace(/[^0-9×*.]/g, ''))) {
      return false;
    }
  }
  
  return true;
};

/**
 * Fix question difficulty if it's incorrectly classified
 */
export const fixQuestionDifficulty = (question: Question): Question => {
  const assessment = assessQuestionDifficulty(question);
  
  // If the current difficulty is inappropriate, fix it
  if (!assessment.gradeAppropriate || 
      (question.difficulty === DifficultyLevel.HARD && assessment.suggestedDifficulty !== DifficultyLevel.HARD)) {
    
    return {
      ...question,
      difficulty: assessment.suggestedDifficulty,
      tags: [...(question.tags || []), 'difficulty-corrected']
    };
  }
  
  return question;
};

/**
 * Batch fix multiple questions
 */
export const fixQuestionDifficulties = (questions: Question[]): Question[] => {
  return questions.map(fixQuestionDifficulty);
};

/**
 * Validate question difficulty for Grade 9+ specifically
 */
export const validateGrade9Difficulty = (question: Question): boolean => {
  if (parseInt(question.grade) < 9) return true;
  
  const content = question.content.toLowerCase();
  
  // These should NOT be Hard for Grade 9+
  const simplePatterns = [
    /^\d+\.?\d*\s*[×*]\s*\d+\.?\d*/, // Simple multiplication like "2.2 × 2"
    /^\d+\.?\d*\s*[+]\s*\d+\.?\d*/, // Simple addition
    /^\d+\.?\d*\s*[-]\s*\d+\.?\d*/, // Simple subtraction
    /^\d+\.?\d*\s*[÷\/]\s*\d+\.?\d*/ // Simple division
  ];
  
  const isSimpleOperation = simplePatterns.some(pattern => pattern.test(content));
  
  if (isSimpleOperation && question.difficulty === DifficultyLevel.HARD) {
    console.warn(`Grade ${question.grade} question "${question.content}" is incorrectly marked as Hard`);
    return false;
  }
  
  return true;
};
