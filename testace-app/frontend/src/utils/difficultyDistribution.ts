import { Question, DifficultyLevel } from '../types';

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

// Default distributions based on selected difficulty level
const DIFFICULTY_DISTRIBUTIONS: { [key: string]: DifficultyDistribution } = {
  easy: { easy: 60, medium: 30, hard: 10 },
  medium: { easy: 30, medium: 40, hard: 30 },
  hard: { easy: 10, medium: 30, hard: 60 }
};

/**
 * Calculates how many questions of each difficulty should be included
 * based on the total number of questions needed and selected difficulty level
 */
export const calculateQuestionDistribution = (
  totalQuestions: number,
  selectedDifficulty: string
): DifficultyDistribution => {
  const distribution = DIFFICULTY_DISTRIBUTIONS[selectedDifficulty.toLowerCase()];
  
  return {
    easy: Math.round((distribution.easy / 100) * totalQuestions),
    medium: Math.round((distribution.medium / 100) * totalQuestions),
    hard: Math.round((distribution.hard / 100) * totalQuestions)
  };
};

/**
 * Filters and sorts questions to match the desired difficulty distribution
 */
export const distributeQuestionsByDifficulty = (
  questions: Question[],
  totalNeeded: number,
  selectedDifficulty: string
): Question[] => {
  // Calculate how many questions we need of each difficulty
  const distribution = calculateQuestionDistribution(totalNeeded, selectedDifficulty);
  
  // Group questions by difficulty
  const groupedQuestions = {
    easy: questions.filter(q => q.difficulty === DifficultyLevel.EASY),
    medium: questions.filter(q => q.difficulty === DifficultyLevel.MEDIUM),
    hard: questions.filter(q => q.difficulty === DifficultyLevel.HARD)
  };

  // Select questions according to distribution
  const selectedQuestions: Question[] = [];

  // Helper function to get random questions from an array
  const getRandomQuestions = (arr: Question[], count: number): Question[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Select questions for each difficulty level
  Object.entries(distribution).forEach(([difficulty, count]) => {
    const availableQuestions = groupedQuestions[difficulty as keyof typeof groupedQuestions];
    
    // If we don't have enough questions of the desired difficulty,
    // supplement with questions from adjacent difficulty levels
    if (availableQuestions.length < count) {
      const selected = availableQuestions;
      let remaining = count - selected.length;
      
      // Try to get remaining questions from adjacent difficulty levels
      if (difficulty === 'easy') {
        // For easy, supplement with medium questions
        const mediumQuestions = getRandomQuestions(groupedQuestions.medium, remaining);
        selected.push(...mediumQuestions);
      } else if (difficulty === 'hard') {
        // For hard, supplement with medium questions
        const mediumQuestions = getRandomQuestions(groupedQuestions.medium, remaining);
        selected.push(...mediumQuestions);
      } else {
        // For medium, supplement with a mix of easy and hard
        const easyQuestions = getRandomQuestions(groupedQuestions.easy, Math.ceil(remaining / 2));
        const hardQuestions = getRandomQuestions(groupedQuestions.hard, Math.floor(remaining / 2));
        selected.push(...easyQuestions, ...hardQuestions);
      }
      
      selectedQuestions.push(...selected);
    } else {
      // If we have enough questions, randomly select the desired number
      const selected = getRandomQuestions(availableQuestions, count);
      selectedQuestions.push(...selected);
    }
  });

  // Shuffle the final selection to mix difficulties
  return selectedQuestions.sort(() => 0.5 - Math.random());
};
