/**
 * INTEGRATION HELPER FOR QUESTION EXHAUSTION HANDLER
 * 
 * This provides a simple interface to integrate exhaustion handling
 * with existing question loading systems WITHOUT breaking current functionality.
 */

import { Question } from '../types';
import { ProgressiveQuestionHandler, QuestionExpansionStrategy, DifficultyString } from './questionExhaustionHandler';

export interface EnhancedQuestionRequest {
  grade: number;
  subject: string;
  difficulty: DifficultyString;
  userId?: string;
  requestedCount: number;
}

export interface EnhancedQuestionResponse {
  questions: Question[];
  isExpanded: boolean;
  expansionStrategy?: QuestionExpansionStrategy;
  message?: string;
}

/**
 * Enhanced question loader that handles exhaustion gracefully
 * This is a DROP-IN REPLACEMENT for existing question loading
 */
export async function loadQuestionsWithExhaustionHandling(
  request: EnhancedQuestionRequest
): Promise<EnhancedQuestionResponse> {
  
  const { grade, subject, difficulty, userId, requestedCount } = request;
  
  try {
    // Step 1: Try to load questions normally (EXISTING BEHAVIOR)
    const normalQuestions = await loadNormalQuestions(grade, subject, difficulty, userId);
    
    // Step 2: If we have enough questions, return them (NO CHANGE)
    if (normalQuestions.length >= requestedCount) {
      return {
        questions: normalQuestions.slice(0, requestedCount),
        isExpanded: false
      };
    }
    
    // Step 3: If questions are exhausted, handle gracefully (NEW ENHANCEMENT)
    if (normalQuestions.length === 0) {
      console.log(`🎯 Questions exhausted for Grade ${grade} ${difficulty} ${subject}, expanding...`);
      
      const expansionStrategy = await ProgressiveQuestionHandler.handleQuestionExhaustion({
        grade,
        subject,
        difficulty,
        userId
      });
      
      return {
        questions: expansionStrategy.questions.slice(0, requestedCount),
        isExpanded: true,
        expansionStrategy,
        message: ProgressiveQuestionHandler.getExhaustionMessage(expansionStrategy)
      };
    }
    
    // Step 4: If we have some but not enough, combine with expansion (SMART ENHANCEMENT)
    const needed = requestedCount - normalQuestions.length;
    const expansionStrategy = await ProgressiveQuestionHandler.handleQuestionExhaustion({
      grade,
      subject,
      difficulty,
      userId
    });
    
    const combinedQuestions = [
      ...normalQuestions,
      ...expansionStrategy.questions.slice(0, needed)
    ];
    
    return {
      questions: combinedQuestions,
      isExpanded: true,
      expansionStrategy,
      message: `Great progress! Including some ${expansionStrategy.description.toLowerCase()} to keep you learning.`
    };
    
  } catch (error) {
    console.error('Error in enhanced question loading:', error);
    
    // FALLBACK: Return empty array (same as current behavior)
    return {
      questions: [],
      isExpanded: false
    };
  }
}

/**
 * Load questions using existing system (preserves current functionality)
 */
async function loadNormalQuestions(
  grade: number, 
  subject: string, 
  difficulty: DifficultyString, 
  userId?: string
): Promise<Question[]> {
  try {
    const filename = `${grade}_${difficulty}_${subject}.json`;
    const response = await fetch(`/questions/${filename}`);
    
    if (!response.ok) {
      return [];
    }
    
    const allQuestions: Question[] = await response.json();
    
    // Filter out answered questions if user tracking is enabled
    if (userId) {
      const answeredIds = getAnsweredQuestionIds(userId);
      return allQuestions.filter(q => !answeredIds.includes(q._id));
    }
    
    return allQuestions;
  } catch (error) {
    console.warn(`Could not load normal questions: ${error}`);
    return [];
  }
}

/**
 * Helper function to get answered question IDs (integrates with existing system)
 */
function getAnsweredQuestionIds(userId: string): string[] {
  try {
    const stored = localStorage.getItem(`answeredQuestions_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Simple usage example for existing components:
 * 
 * // BEFORE (existing code):
 * const questions = await loadQuestions(grade, subject, difficulty);
 * 
 * // AFTER (enhanced with exhaustion handling):
 * const result = await loadQuestionsWithExhaustionHandling({
 *   grade, subject, difficulty, userId, requestedCount: 20
 * });
 * 
 * if (result.isExpanded && result.message) {
 *   showUserMessage(result.message); // Optional: show expansion message
 * }
 * 
 * return result.questions; // Use questions as normal
 */

export default loadQuestionsWithExhaustionHandling;