import { Question, DifficultyLevel } from '../types';

interface ValidationResult {
  isCorrect: boolean;
  explanation: string;
  confidence: number; // 0-1 scale
  alternativeAnswers?: string[];
  commonMistakes?: string[];
}

/**
 * Enhanced Answer Validation System
 * Provides rigorous validation for mathematical answers with multiple formats
 */
export class EnhancedAnswerValidator {
  
  /**
   * Validates mathematical answers with comprehensive checking
   */
  static validateMathAnswer(question: Question, userAnswer: string): ValidationResult {
    const correctAnswer = question.correctAnswer;
    
    // Normalize both answers for comparison
    const normalizedUser = this.normalizeMathAnswer(userAnswer);
    const normalizedCorrect = this.normalizeMathAnswer(correctAnswer);
    
    // Direct match check
    if (normalizedUser === normalizedCorrect) {
      return {
        isCorrect: true,
        explanation: question.explanation || 'Correct answer!',
        confidence: 1.0
      };
    }
    
    // Check for mathematically equivalent expressions
    const equivalenceResult = this.checkMathematicalEquivalence(normalizedUser, normalizedCorrect);
    if (equivalenceResult.isEquivalent) {
      return {
        isCorrect: true,
        explanation: question.explanation || 'Mathematically equivalent answer!',
        confidence: equivalenceResult.confidence,
        alternativeAnswers: [correctAnswer]
      };
    }
    
    // Check for acceptable alternative formats
    const alternativeResult = this.checkAlternativeFormats(userAnswer, correctAnswer);
    if (alternativeResult.isAcceptable) {
      return {
        isCorrect: true,
        explanation: question.explanation || 'Acceptable alternative format!',
        confidence: alternativeResult.confidence,
        alternativeAnswers: alternativeResult.alternatives
      };
    }
    
    // Analyze common mistakes
    const mistakeAnalysis = this.analyzeMathMistakes(question, userAnswer, correctAnswer);
    
    return {
      isCorrect: false,
      explanation: question.explanation || `The correct answer is ${correctAnswer}`,
      confidence: 1.0,
      commonMistakes: mistakeAnalysis.mistakes
    };
  }
  
  /**
   * Normalizes mathematical expressions for comparison
   */
  private static normalizeMathAnswer(answer: string): string {
    return answer
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[×]/g, '*') // Replace × with *
      .replace(/[÷]/g, '/') // Replace ÷ with /
      .replace(/\+\-/g, '-') // Replace +- with -
      .replace(/\-\+/g, '-') // Replace -+ with -
      .replace(/\(\+/g, '(') // Remove + after opening parenthesis
      .replace(/\+\)/g, ')') // Remove + before closing parenthesis
      .replace(/^[\+]/, '') // Remove leading +
      .replace(/(\d)([a-z])/gi, '$1*$2') // Add * between number and variable
      .replace(/([a-z])(\d)/gi, '$1*$2') // Add * between variable and number
      .replace(/\)\(/g, ')*(') // Add * between parentheses
      .replace(/(\d)\(/g, '$1*(') // Add * between number and parenthesis
      .replace(/\)(\d)/g, ')*$1'); // Add * between parenthesis and number
  }
  
  /**
   * Checks for mathematical equivalence between expressions
   */
  private static checkMathematicalEquivalence(expr1: string, expr2: string): { isEquivalent: boolean; confidence: number } {
    try {
      // Handle fractions
      const fractionResult = this.compareFractions(expr1, expr2);
      if (fractionResult.isEquivalent) {
        return fractionResult;
      }
      
      // Handle decimals
      const decimalResult = this.compareDecimals(expr1, expr2);
      if (decimalResult.isEquivalent) {
        return decimalResult;
      }
      
      // Handle percentages
      const percentResult = this.comparePercentages(expr1, expr2);
      if (percentResult.isEquivalent) {
        return percentResult;
      }
      
      // Handle algebraic expressions
      const algebraResult = this.compareAlgebraicExpressions(expr1, expr2);
      if (algebraResult.isEquivalent) {
        return algebraResult;
      }
      
      // Handle numeric values with tolerance
      const numericResult = this.compareNumericValues(expr1, expr2);
      if (numericResult.isEquivalent) {
        return numericResult;
      }
      
      return { isEquivalent: false, confidence: 0 };
    } catch (error) {
      console.warn('Error in mathematical equivalence check:', error);
      return { isEquivalent: false, confidence: 0 };
    }
  }
  
  /**
   * Compares fractions for equivalence
   */
  private static compareFractions(expr1: string, expr2: string): { isEquivalent: boolean; confidence: number } {
    const fractionRegex = /^(-?\d+)\/(\d+)$/;
    const mixedRegex = /^(-?\d+)\s+(\d+)\/(\d+)$/;
    
    const parseFraction = (expr: string): number | null => {
      // Handle mixed numbers
      const mixedMatch = expr.match(mixedRegex);
      if (mixedMatch) {
        const whole = parseInt(mixedMatch[1]);
        const num = parseInt(mixedMatch[2]);
        const den = parseInt(mixedMatch[3]);
        return whole + (num / den);
      }
      
      // Handle simple fractions
      const fracMatch = expr.match(fractionRegex);
      if (fracMatch) {
        const num = parseInt(fracMatch[1]);
        const den = parseInt(fracMatch[2]);
        return num / den;
      }
      
      // Handle whole numbers
      const wholeMatch = expr.match(/^-?\d+$/);
      if (wholeMatch) {
        return parseInt(expr);
      }
      
      // Handle decimals
      const decimalMatch = expr.match(/^-?\d*\.?\d+$/);
      if (decimalMatch) {
        return parseFloat(expr);
      }
      
      return null;
    };
    
    const val1 = parseFraction(expr1);
    const val2 = parseFraction(expr2);
    
    if (val1 !== null && val2 !== null) {
      const tolerance = 0.0001;
      const isEquivalent = Math.abs(val1 - val2) < tolerance;
      return { isEquivalent, confidence: isEquivalent ? 0.95 : 0 };
    }
    
    return { isEquivalent: false, confidence: 0 };
  }
  
  /**
   * Compares decimal values with appropriate tolerance
   */
  private static compareDecimals(expr1: string, expr2: string): { isEquivalent: boolean; confidence: number } {
    const decimalRegex = /^-?\d*\.?\d+$/;
    
    if (decimalRegex.test(expr1) && decimalRegex.test(expr2)) {
      const val1 = parseFloat(expr1);
      const val2 = parseFloat(expr2);
      
      if (!isNaN(val1) && !isNaN(val2)) {
        // Determine appropriate tolerance based on decimal places
        const decimalPlaces1 = (expr1.split('.')[1] || '').length;
        const decimalPlaces2 = (expr2.split('.')[1] || '').length;
        const maxDecimalPlaces = Math.max(decimalPlaces1, decimalPlaces2);
        const tolerance = Math.pow(10, -(maxDecimalPlaces + 1));
        
        const isEquivalent = Math.abs(val1 - val2) < tolerance;
        return { isEquivalent, confidence: isEquivalent ? 0.98 : 0 };
      }
    }
    
    return { isEquivalent: false, confidence: 0 };
  }
  
  /**
   * Compares percentage values
   */
  private static comparePercentages(expr1: string, expr2: string): { isEquivalent: boolean; confidence: number } {
    const percentRegex = /^(\d*\.?\d+)%$/;
    const decimalRegex = /^0?\.\d+$/;
    
    const parsePercent = (expr: string): number | null => {
      const percentMatch = expr.match(percentRegex);
      if (percentMatch) {
        return parseFloat(percentMatch[1]) / 100;
      }
      
      const decimalMatch = expr.match(decimalRegex);
      if (decimalMatch) {
        return parseFloat(expr);
      }
      
      return null;
    };
    
    const val1 = parsePercent(expr1);
    const val2 = parsePercent(expr2);
    
    if (val1 !== null && val2 !== null) {
      const tolerance = 0.001;
      const isEquivalent = Math.abs(val1 - val2) < tolerance;
      return { isEquivalent, confidence: isEquivalent ? 0.95 : 0 };
    }
    
    return { isEquivalent: false, confidence: 0 };
  }
  
  /**
   * Compares algebraic expressions
   */
  private static compareAlgebraicExpressions(expr1: string, expr2: string): { isEquivalent: boolean; confidence: number } {
    // Simple algebraic equivalence checks
    const algebraicPatterns = [
      // Commutative property: a+b = b+a
      { pattern1: /^(\w+)\+(\w+)$/, pattern2: /^(\w+)\+(\w+)$/, check: (m1: RegExpMatchArray, m2: RegExpMatchArray) => 
        (m1[1] === m2[1] && m1[2] === m2[2]) || (m1[1] === m2[2] && m1[2] === m2[1]) },
      
      // Multiplication: 2x = x*2 = 2*x
      { pattern1: /^(\d+)([a-z])$/i, pattern2: /^([a-z])\*(\d+)$/i, check: (m1: RegExpMatchArray, m2: RegExpMatchArray) => 
        m1[1] === m2[2] && m1[2] === m2[1] },
      
      // Distributive property: 2(x+3) = 2x+6
      // This would require more complex parsing
    ];
    
    for (const pattern of algebraicPatterns) {
      const match1 = expr1.match(pattern.pattern1);
      const match2 = expr2.match(pattern.pattern2);
      
      if (match1 && match2 && pattern.check(match1, match2)) {
        return { isEquivalent: true, confidence: 0.9 };
      }
    }
    
    return { isEquivalent: false, confidence: 0 };
  }
  
  /**
   * Compares numeric values with appropriate tolerance
   */
  private static compareNumericValues(expr1: string, expr2: string): { isEquivalent: boolean; confidence: number } {
    const num1 = parseFloat(expr1);
    const num2 = parseFloat(expr2);
    
    if (!isNaN(num1) && !isNaN(num2)) {
      // Use relative tolerance for large numbers, absolute for small numbers
      const maxVal = Math.max(Math.abs(num1), Math.abs(num2));
      const tolerance = maxVal > 1 ? maxVal * 0.001 : 0.001;
      
      const isEquivalent = Math.abs(num1 - num2) < tolerance;
      return { isEquivalent, confidence: isEquivalent ? 0.95 : 0 };
    }
    
    return { isEquivalent: false, confidence: 0 };
  }
  
  /**
   * Checks for acceptable alternative formats
   */
  private static checkAlternativeFormats(userAnswer: string, correctAnswer: string): { 
    isAcceptable: boolean; 
    confidence: number; 
    alternatives: string[] 
  } {
    const alternatives: string[] = [];
    
    // Generate alternative formats for the correct answer
    const alternativeFormats = this.generateAlternativeFormats(correctAnswer);
    alternatives.push(...alternativeFormats);
    
    // Check if user answer matches any alternative
    const normalizedUser = this.normalizeMathAnswer(userAnswer);
    const isAcceptable = alternativeFormats.some(alt => 
      this.normalizeMathAnswer(alt) === normalizedUser
    );
    
    return {
      isAcceptable,
      confidence: isAcceptable ? 0.9 : 0,
      alternatives
    };
  }
  
  /**
   * Generates alternative formats for a given answer
   */
  private static generateAlternativeFormats(answer: string): string[] {
    const alternatives: string[] = [];
    const normalized = this.normalizeMathAnswer(answer);
    
    // Try to parse as number and generate alternatives
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      // Decimal alternatives
      if (num % 1 === 0) {
        alternatives.push(num.toString());
        alternatives.push(num.toFixed(1));
        alternatives.push(num.toFixed(2));
      } else {
        alternatives.push(num.toString());
        alternatives.push(num.toFixed(2));
        alternatives.push(num.toFixed(3));
      }
      
      // Fraction alternatives for simple decimals
      if (num === 0.5) alternatives.push('1/2');
      if (num === 0.25) alternatives.push('1/4');
      if (num === 0.75) alternatives.push('3/4');
      if (num === 0.33 || num === 0.333) alternatives.push('1/3');
      if (num === 0.67 || num === 0.667) alternatives.push('2/3');
    }
    
    // Fraction alternatives
    const fractionMatch = answer.match(/^(\d+)\/(\d+)$/);
    if (fractionMatch) {
      const num = parseInt(fractionMatch[1]);
      const den = parseInt(fractionMatch[2]);
      const decimal = num / den;
      
      alternatives.push(decimal.toString());
      alternatives.push(decimal.toFixed(2));
      alternatives.push(decimal.toFixed(3));
      
      // Simplified fraction
      const gcd = this.greatestCommonDivisor(num, den);
      if (gcd > 1) {
        alternatives.push(`${num/gcd}/${den/gcd}`);
      }
    }
    
    return [...new Set(alternatives)]; // Remove duplicates
  }
  
  /**
   * Analyzes common mathematical mistakes
   */
  private static analyzeMathMistakes(question: Question, userAnswer: string, correctAnswer: string): { mistakes: string[] } {
    const mistakes: string[] = [];
    
    // Common arithmetic mistakes
    const userNum = parseFloat(userAnswer);
    const correctNum = parseFloat(correctAnswer);
    
    if (!isNaN(userNum) && !isNaN(correctNum)) {
      const difference = Math.abs(userNum - correctNum);
      
      // Off by one error
      if (difference === 1) {
        mistakes.push('Off by one error - check your calculation carefully');
      }
      
      // Sign error
      if (userNum === -correctNum) {
        mistakes.push('Sign error - check positive/negative signs');
      }
      
      // Order of magnitude error
      if (Math.abs(userNum / correctNum - 10) < 0.1 || Math.abs(correctNum / userNum - 10) < 0.1) {
        mistakes.push('Order of magnitude error - check decimal placement');
      }
      
      // Common fraction mistakes
      if (question.content.includes('fraction') || question.content.includes('/')) {
        if (userNum > 1 && correctNum < 1) {
          mistakes.push('Remember to convert improper fractions to proper fractions if needed');
        }
      }
    }
    
    // Subject-specific mistakes
    if (question.subject.toLowerCase().includes('math')) {
      if (question.content.includes('area') && userAnswer !== correctAnswer) {
        mistakes.push('For area problems, make sure to multiply length × width');
      }
      
      if (question.content.includes('perimeter') && userAnswer !== correctAnswer) {
        mistakes.push('For perimeter, add all sides together');
      }
      
      if (question.content.includes('%') || question.content.includes('percent')) {
        mistakes.push('Remember to convert between percentages and decimals correctly');
      }
    }
    
    return { mistakes };
  }
  
  /**
   * Calculates greatest common divisor
   */
  private static greatestCommonDivisor(a: number, b: number): number {
    return b === 0 ? a : this.greatestCommonDivisor(b, a % b);
  }
}

/**
 * Enhanced validation function for use in components
 */
export const validateAnswer = (question: Question, userAnswer: string): ValidationResult => {
  if (question.subject.toLowerCase().includes('math')) {
    return EnhancedAnswerValidator.validateMathAnswer(question, userAnswer);
  }
  
  // For non-math questions, use simple validation
  const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  
  return {
    isCorrect,
    explanation: question.explanation || (isCorrect ? 'Correct!' : `The correct answer is ${question.correctAnswer}`),
    confidence: 1.0
  };
};

export default EnhancedAnswerValidator;
