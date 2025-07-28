import { Question, DifficultyLevel } from '../types';
import { ValidationError, MathValidationError, LogicalValidationError, LanguageValidationError } from './errors';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a question's answer options and correct answer
 */
export const validateQuestion = (question: Question): ValidationResult => {
  const errors: string[] = [];

  try {
    // Check if options array exists and has content
    if (!Array.isArray(question.options) || question.options.length === 0) {
      throw new ValidationError('Question must have answer options');
    }

    // Check for duplicate options
    const uniqueOptions = new Set(question.options);
    if (uniqueOptions.size !== question.options.length) {
      throw new ValidationError('Duplicate answer options found');
    }

    // Check if correct answer exists in options
    if (!question.options.includes(question.correctAnswer)) {
      throw new ValidationError('Correct answer must be one of the options');
    }

    // Check for empty or invalid options
    question.options.forEach((option, index) => {
      if (!option || option.trim() === '') {
        throw new ValidationError(`Option ${index + 1} is empty or invalid`);
      }
    });

    // Subject-specific validations
    switch (question.subject.toLowerCase()) {
      case 'math':
        validateMathQuestion(question, errors);
        break;
      case 'english':
        validateEnglishQuestion(question, errors);
        break;
      case 'thinking skills':
        validateThinkingSkillsQuestion(question, errors);
        break;
    }
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      errors.push(error.message);
    } else if (error instanceof Error) {
      errors.push(`Unexpected error: ${error.message}`);
    } else {
      errors.push('Unknown validation error occurred');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates mathematical answer options and solutions
 */
const validateMathQuestion = (question: Question, errors: string[]) => {
  const { options, correctAnswer, content } = question;

  try {
    // Check for mathematical consistency
    options.forEach(option => {
      // Validate numerical answers
      if (isNumericalAnswer(option)) {
        if (!isValidNumber(option)) {
          throw new MathValidationError(`Invalid numerical answer: ${option}`);
        }
      }

      // Check for mathematical expressions
      if (containsMathExpression(option)) {
        if (!isValidMathExpression(option)) {
          throw new MathValidationError(`Invalid mathematical expression: ${option}`);
        }
      }
    });

    // Verify mathematical solution if provided
    if (question.solution) {
      try {
        validateMathSolution(content, correctAnswer, question.solution);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new MathValidationError(`Invalid solution: ${errorMessage}`);
      }
    }

    // Check for common math formatting issues
    if (containsMathFormatting(content)) {
      validateMathFormatting(content, errors);
    }
  } catch (error: unknown) {
    if (error instanceof MathValidationError) {
      errors.push(error.message);
    } else if (error instanceof Error) {
      errors.push(`Math validation error: ${error.message}`);
    }
  }
};

/**
 * Validates English language answer options
 */
const validateEnglishQuestion = (question: Question, errors: string[]) => {
  const { options, content } = question;

  try {
    // Check for grammatical consistency
    options.forEach(option => {
      if (containsGrammaticalErrors(option)) {
        throw new LanguageValidationError(`Grammatical error in option: ${option}`);
      }
    });

    // Validate question context
    if (!isValidEnglishContext(content, options)) {
      throw new LanguageValidationError('Question context and options are inconsistent');
    }

    // Check for spelling errors
    options.forEach(option => {
      const spellingErrors = checkSpelling(option);
      if (spellingErrors.length > 0) {
        throw new LanguageValidationError(`Spelling errors in option: ${option}`);
      }
    });
  } catch (error: unknown) {
    if (error instanceof LanguageValidationError) {
      errors.push(error.message);
    } else if (error instanceof Error) {
      errors.push(`Language validation error: ${error.message}`);
    }
  }
};

/**
 * Validates thinking skills question logic
 */
const validateThinkingSkillsQuestion = (question: Question, errors: string[]) => {
  const { options, content, correctAnswer } = question;

  try {
    // Check logical consistency
    if (!isLogicallyConsistent(content, options, correctAnswer)) {
      throw new LogicalValidationError('Logical inconsistency between question and answers');
    }

    // Validate reasoning path if solution is provided
    if (question.solution && !isValidReasoningPath(content, correctAnswer, question.solution)) {
      throw new LogicalValidationError('Invalid reasoning path in solution');
    }

    // Check for ambiguity
    if (hasAmbiguousOptions(options)) {
      throw new LogicalValidationError('Answer options contain ambiguity');
    }
  } catch (error: unknown) {
    if (error instanceof LogicalValidationError) {
      errors.push(error.message);
    } else if (error instanceof Error) {
      errors.push(`Logical validation error: ${error.message}`);
    }
  }
};

// Helper functions for mathematical validation
const isNumericalAnswer = (answer: string): boolean => {
  return /^-?\d*\.?\d+$/.test(answer.trim());
};

const isValidNumber = (number: string): boolean => {
  const parsed = parseFloat(number);
  return !isNaN(parsed) && isFinite(parsed);
};

const containsMathExpression = (text: string): boolean => {
  return /[\+\-\*\/\(\)\^\√]/.test(text);
};

const isValidMathExpression = (expression: string): boolean => {
  try {
    // Basic validation - can be expanded based on needs
    return !expression.match(/[^0-9\+\-\*\/\(\)\^\√\.\s]/);
  } catch {
    return false;
  }
};

const validateMathSolution = (question: string, answer: string, solution: string): void => {
  // Implement solution validation logic
  // Throw MathValidationError if validation fails
};

const containsMathFormatting = (text: string): boolean => {
  return /[\{\}\[\]\$]/.test(text);
};

const validateMathFormatting = (text: string, errors: string[]): void => {
  // Check for balanced delimiters
  const delimiters = text.match(/[\{\}\[\]\$]/g) || [];
  if (delimiters.length % 2 !== 0) {
    errors.push('Unbalanced mathematical formatting delimiters');
  }
};

// Helper functions for English validation
const containsGrammaticalErrors = (text: string): boolean => {
  // Implement grammar checking logic
  return false;
};

const isValidEnglishContext = (question: string, options: string[]): boolean => {
  // Implement context validation logic
  return true;
};

const checkSpelling = (text: string): string[] => {
  // Implement spell checking logic
  return [];
};

// Helper functions for thinking skills validation
const isLogicallyConsistent = (question: string, options: string[], answer: string): boolean => {
  // Implement logical consistency checking
  return true;
};

const isValidReasoningPath = (question: string, answer: string, solution: string): boolean => {
  // Implement reasoning path validation
  return true;
};

const hasAmbiguousOptions = (options: string[]): boolean => {
  // Implement ambiguity checking
  return false;
};
