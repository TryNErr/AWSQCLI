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
  reason: string;
}

/**
 * Comprehensive patterns for basic arithmetic operations
 */
const BASIC_ARITHMETIC_PATTERNS = [
  // Simple decimal operations
  /^\d+\.?\d*\s*[+\-×÷*\/]\s*\d+\.?\d*$/,
  
  // Simple fraction addition/subtraction with same denominator
  /^\d+\/\d+\s*[+\-]\s*\d+\/\d+$/,
  
  // Basic word problems with simple addition/subtraction
  /there are \d+.*and \d+.*how many.*total/i,
  /\d+.*and \d+.*how many.*altogether/i,
  /\d+.*plus \d+/i,
  /\d+.*minus \d+/i,
  
  // Simple multiplication tables
  /^\d{1,2}\s*[×*]\s*\d{1,2}$/,
  
  // Basic percentage calculations
  /\d+%\s*of\s*\d+/i,
  
  // Simple area/perimeter of basic shapes
  /area.*rectangle.*\d+.*\d+/i,
  /perimeter.*square.*\d+/i,
  
  // Basic unit conversions
  /convert.*\d+.*to/i,
  
  // Simple money calculations
  /\$\d+\.?\d*.*\$\d+\.?\d*/,
];

/**
 * Patterns that indicate medium complexity
 */
const MEDIUM_COMPLEXITY_PATTERNS = [
  // Basic algebra with one variable
  /solve.*[a-z]\s*[=+\-]/i,
  /find.*[a-z].*=/i,
  
  // Multi-step word problems
  /first.*then.*finally/i,
  /each.*how many.*total/i,
  
  // Basic geometry with formulas
  /area.*triangle/i,
  /volume.*cube/i,
  /circumference.*circle/i,
  
  // Fraction operations with different denominators
  /\d+\/\d+\s*[+\-]\s*\d+\/\d+.*\d+\/\d+/,
  
  // Basic coordinate geometry
  /coordinate.*point/i,
  /distance.*between/i,
];

/**
 * Patterns that indicate hard complexity
 */
const HARD_COMPLEXITY_PATTERNS = [
  // Advanced algebra
  /quadratic|x²|x\^2/i,
  /simultaneous.*equation/i,
  /system.*equation/i,
  
  // Advanced geometry
  /sphere.*volume/i,
  /cone.*volume/i,
  /surface area.*prism/i,
  
  // Trigonometry
  /sin|cos|tan|sine|cosine|tangent/i,
  
  // Advanced functions
  /logarithm|log|ln/i,
  /exponential/i,
  /derivative|integral/i,
  
  // Complex word problems
  /compound interest/i,
  /probability.*and.*probability/i,
  /permutation|combination/i,
];

/**
 * Assess the actual difficulty of a question based on its content
 */
export const assessQuestionDifficulty = (question: Question): DifficultyAssessment => {
  const content = question.content.toLowerCase();
  const grade = parseInt(question.grade);
  
  let conceptComplexity = 1;
  let operationComplexity = 1;
  let reason = "Basic assessment";
  
  // Check for hard complexity first
  if (HARD_COMPLEXITY_PATTERNS.some(pattern => pattern.test(content))) {
    conceptComplexity = 3;
    operationComplexity = 3;
    reason = "Advanced mathematical concepts detected";
  }
  // Check for medium complexity
  else if (MEDIUM_COMPLEXITY_PATTERNS.some(pattern => pattern.test(content))) {
    conceptComplexity = 2;
    operationComplexity = 2;
    reason = "Intermediate mathematical concepts detected";
  }
  // Check for basic arithmetic
  else if (BASIC_ARITHMETIC_PATTERNS.some(pattern => pattern.test(content))) {
    conceptComplexity = 1;
    operationComplexity = 1;
    reason = "Basic arithmetic operation detected";
  }
  
  // Special cases for specific grade levels
  if (grade >= 9) {
    // For Grade 9+, basic arithmetic should definitely be Easy
    if (BASIC_ARITHMETIC_PATTERNS.some(pattern => pattern.test(content))) {
      conceptComplexity = 1;
      operationComplexity = 1;
      reason = `Basic arithmetic inappropriate as Hard for Grade ${grade}`;
    }
  }
  
  if (grade >= 10) {
    // For Grade 10+, even some medium complexity should be Easy
    if (conceptComplexity <= 2 && BASIC_ARITHMETIC_PATTERNS.some(pattern => pattern.test(content))) {
      conceptComplexity = 1;
      operationComplexity = 1;
      reason = `Simple operations inappropriate as Hard for Grade ${grade}`;
    }
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
  
  // Check if current difficulty is grade-appropriate
  const gradeAppropriate = isGradeAppropriate(question, suggestedDifficulty, grade);
  
  return {
    conceptComplexity,
    operationComplexity,
    gradeAppropriate,
    suggestedDifficulty,
    reason
  };
};

/**
 * Enhanced grade-appropriate validation
 */
const isGradeAppropriate = (question: Question, difficulty: DifficultyLevel, grade: number): boolean => {
  const content = question.content.toLowerCase();
  
  // Grade 9+ specific checks
  if (grade >= 9) {
    // These should NEVER be Hard for Grade 9+
    const inappropriateForGrade9Hard = [
      /^\d+\/\d+\s*[+\-]\s*\d+\/\d+$/, // Simple fraction addition like "1/12 + 10/12"
      /^\d+\.?\d*\s*[+\-×÷*\/]\s*\d+\.?\d*$/, // Simple arithmetic
      /there are \d+.*and \d+.*how many.*total/i, // Simple word problems
      /\d+.*plus \d+/i,
      /\d+.*minus \d+/i,
      /what is \d+.*[+\-×÷*\/].*\d+/i,
    ];
    
    if (question.difficulty === DifficultyLevel.HARD && 
        inappropriateForGrade9Hard.some(pattern => pattern.test(content))) {
      return false;
    }
  }
  
  // Grade 10+ specific checks
  if (grade >= 10) {
    // Even more basic operations should not be Hard for Grade 10+
    const inappropriateForGrade10Hard = [
      ...BASIC_ARITHMETIC_PATTERNS,
      /count.*total/i,
      /how many.*altogether/i,
      /simple.*addition/i,
      /basic.*subtraction/i,
    ];
    
    if (question.difficulty === DifficultyLevel.HARD && 
        inappropriateForGrade10Hard.some(pattern => pattern.test(content))) {
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
    
    console.log(`🔧 Fixing difficulty for Grade ${question.grade}: "${question.content}" from ${question.difficulty} to ${assessment.suggestedDifficulty}`);
    console.log(`   Reason: ${assessment.reason}`);
    
    return {
      ...question,
      difficulty: assessment.suggestedDifficulty,
      tags: [...(question.tags || []), 'difficulty-corrected', `corrected-${question.difficulty}-to-${assessment.suggestedDifficulty}`]
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
 * Enhanced validation for Grade 9+ and 10+ specifically
 */
export const validateHighGradeDifficulty = (question: Question): boolean => {
  const grade = parseInt(question.grade);
  if (grade < 9) return true;
  
  const content = question.content.toLowerCase();
  
  // Comprehensive list of operations that should NOT be Hard for high school students
  const inappropriateHardPatterns = [
    // Basic arithmetic
    /^\d+\.?\d*\s*[+\-×÷*\/]\s*\d+\.?\d*$/,
    
    // Simple fractions with same denominator
    /^\d+\/\d+\s*[+\-]\s*\d+\/\d+$/,
    
    // Basic word problems
    /there are \d+.*and \d+.*how many.*total/i,
    /\d+ dogs and \d+ cats.*how many animals/i,
    /\d+.*plus \d+.*equals/i,
    /what is \d+.*[+\-×÷*\/].*\d+/i,
    
    // Simple counting problems
    /count.*how many/i,
    /total.*animals/i,
    /altogether.*how many/i,
    
    // Basic percentage (single step)
    /^\d+%\s*of\s*\d+$/i,
    
    // Simple unit conversions
    /convert \d+ .* to .*/i,
  ];
  
  const isInappropriate = inappropriateHardPatterns.some(pattern => pattern.test(content));
  
  if (isInappropriate && question.difficulty === DifficultyLevel.HARD) {
    console.warn(`❌ Grade ${grade} question "${question.content}" is inappropriately marked as Hard`);
    console.warn(`   This should be Easy or Medium at most for Grade ${grade} students`);
    return false;
  }
  
  return true;
};

/**
 * Get appropriate difficulty for specific question types by grade
 */
export const getAppropriateGradeDifficulty = (content: string, grade: number): DifficultyLevel => {
  const contentLower = content.toLowerCase();
  
  // For Grade 9+
  if (grade >= 9) {
    // Basic arithmetic should be Easy
    if (BASIC_ARITHMETIC_PATTERNS.some(pattern => pattern.test(contentLower))) {
      return DifficultyLevel.EASY;
    }
    
    // Medium complexity operations should be Medium
    if (MEDIUM_COMPLEXITY_PATTERNS.some(pattern => pattern.test(contentLower))) {
      return DifficultyLevel.MEDIUM;
    }
    
    // Only truly advanced concepts should be Hard
    if (HARD_COMPLEXITY_PATTERNS.some(pattern => pattern.test(contentLower))) {
      return DifficultyLevel.HARD;
    }
  }
  
  // Default fallback
  return DifficultyLevel.MEDIUM;
};
