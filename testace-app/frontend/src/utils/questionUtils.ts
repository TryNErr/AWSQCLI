/**
 * Generates alternative options for a given answer
 */
const generateAlternativeOption = (
  correctAnswer: string,
  existingOptions: string[],
  index: number
): string => {
  // For numerical answers
  if (typeof correctAnswer === 'string' && !isNaN(Number(correctAnswer))) {
    const num = Number(correctAnswer);
    const variations = [
      num + 1,
      num - 1,
      num * 2,
      Math.floor(num / 2),
      num + 2,
      num - 2
    ];
    return variations[index % variations.length].toString();
  }

  // For text answers
  const variations = [
    'None of the above',
    'Cannot be determined',
    'All of the above',
    'Not enough information',
    'More than one of the above',
    'None of these'
  ];
  return variations[index % variations.length];
}

/**
 * Ensures options are unique without adding numbers
 */
export const ensureUniqueOptions = (correctAnswer: string, wrongOptions: string[]): string[] => {
  // Remove duplicates and options that match the correct answer
  const uniqueWrongOptions = Array.from(new Set(
    wrongOptions.filter(option => 
      option !== correctAnswer && 
      option.trim() !== '' &&
      !option.includes('(') && 
      !option.includes(')')
    )
  ));

  // Generate more options if needed
  const finalWrongOptions: string[] = [...uniqueWrongOptions];
  while (finalWrongOptions.length < 3) {
    const newOption = generateAlternativeOption(
      correctAnswer,
      finalWrongOptions,
      finalWrongOptions.length
    );
    if (!finalWrongOptions.includes(newOption) && newOption !== correctAnswer) {
      finalWrongOptions.push(newOption);
    }
  }

  // Take only the first 3 wrong options and shuffle with correct answer
  return shuffleArray([correctAnswer, ...finalWrongOptions.slice(0, 3)]);
};

/**
 * Shuffles an array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generates a random integer between min and max (inclusive)
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
