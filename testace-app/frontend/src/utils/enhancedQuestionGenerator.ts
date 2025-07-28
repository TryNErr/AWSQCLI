import { Question, DifficultyLevel } from '../types';
import {
  generateQuestionParameters,
  getQuestionModifiers,
  calculateTimeLimit
} from './enhancedDifficulty';

interface QuestionTemplate {
  baseComplexity: number;
  conceptLevel: number;
  timeRequired: number;
  generateQuestion: (modifiers: any) => Question;
}

/**
 * Enhanced question generation with difficulty scaling
 */
export const generateEnhancedQuestions = (
  subject: string,
  grade: number,
  difficulty: DifficultyLevel,
  count: number,
  userStats: any,
  templates: QuestionTemplate[]
): Question[] => {
  const questions: Question[] = [];
  const params = generateQuestionParameters(difficulty, grade, subject, userStats);
  const modifiers = getQuestionModifiers(params);

  // Sort templates by complexity
  const sortedTemplates = [...templates].sort((a, b) => {
    const aComplexity = a.baseComplexity * a.conceptLevel;
    const bComplexity = b.baseComplexity * b.conceptLevel;
    return aComplexity - bComplexity;
  });

  // Select templates based on difficulty parameters
  const selectedTemplates = sortedTemplates.filter(template => {
    const templateComplexity = template.baseComplexity * template.conceptLevel;
    return templateComplexity <= params.complexity * 1.2 &&
           templateComplexity >= params.complexity * 0.8;
  });

  // Generate questions with appropriate difficulty scaling
  for (let i = 0; i < count; i++) {
    // Select template based on position in test (gradually increase difficulty)
    const progressFactor = i / count;
    const templateIndex = Math.min(
      selectedTemplates.length - 1,
      Math.floor(progressFactor * selectedTemplates.length)
    );
    
    const template = selectedTemplates[templateIndex];
    
    // Apply progressive difficulty scaling
    const scaledModifiers = {
      ...modifiers,
      complexity: modifiers.operationComplexity * (1 + progressFactor * 0.2),
      conceptIntegration: modifiers.conceptIntegration + Math.floor(progressFactor * 2),
      languageComplexity: modifiers.languageComplexity * (1 + progressFactor * 0.1)
    };

    // Generate question with scaled difficulty
    const question = template.generateQuestion(scaledModifiers);
    
    // Calculate appropriate time limit
    const timeLimit = calculateTimeLimit(template.timeRequired, params);
    
    questions.push({
      ...question,
      timeLimit,
      difficulty,
      grade: params.gradeLevel.toString(), // Convert number to string
      subject
    });
  }

  return questions;
};

/**
 * Apply difficulty-based transformations to question content
 */
export const applyDifficultyTransformations = (
  question: Question,
  params: any
): Question => {
  const modifiers = getQuestionModifiers(params);

  return {
    ...question,
    content: enhanceQuestionContent(question.content, modifiers),
    options: enhanceOptions(question.options, modifiers),
    explanation: question.explanation ? enhanceExplanation(question.explanation, modifiers) : undefined
  };
};

/**
 * Enhance question content based on difficulty
 */
const enhanceQuestionContent = (content: string, modifiers: any): string => {
  if (modifiers.conceptIntegration > 1) {
    content = addIntegratedConcepts(content, modifiers.conceptIntegration);
  }

  if (modifiers.languageComplexity > 1.2) {
    content = increaseLanguageComplexity(content, modifiers.languageComplexity);
  }

  if (modifiers.includeAdvancedConcepts) {
    content = addAdvancedElements(content);
  }

  return content;
};

/**
 * Enhance answer options based on difficulty
 */
const enhanceOptions = (options: string[], modifiers: any): string[] => {
  // Make distractors more sophisticated for higher difficulties
  if (modifiers.complexity > 1.2) {
    return options.map(option => 
      modifiers.includeAdvancedConcepts ? 
        addAdvancedElements(option) : 
        option
    );
  }
  return options;
};

/**
 * Enhance explanation based on difficulty
 */
const enhanceExplanation = (explanation: string, modifiers: any): string => {
  if (modifiers.conceptIntegration > 1) {
    explanation = addConceptConnections(explanation, modifiers.conceptIntegration);
  }

  if (modifiers.includeAdvancedConcepts) {
    explanation = addAdvancedExplanation(explanation);
  }

  return explanation;
};

/**
 * Helper functions for content enhancement
 */
const addIntegratedConcepts = (content: string, level: number): string => {
  // Add cross-concept relationships and applications
  return content; // Implement based on subject-specific logic
};

const increaseLanguageComplexity = (content: string, level: number): string => {
  // Increase vocabulary and sentence structure complexity
  return content; // Implement based on subject-specific logic
};

const addAdvancedElements = (content: string): string => {
  // Add advanced concept elements
  return content; // Implement based on subject-specific logic
};

const addConceptConnections = (explanation: string, level: number): string => {
  // Add connections between different concepts
  return explanation; // Implement based on subject-specific logic
};

const addAdvancedExplanation = (explanation: string): string => {
  // Add advanced concept explanations
  return explanation; // Implement based on subject-specific logic
};
