// Helper function to generate unique IDs with a specific prefix
export const createIdGenerator = (startFrom: number) => {
  let counter = startFrom;
  return () => (counter++).toString();
};

// Create specific generators for each question type
export const generateMathId = createIdGenerator(2000);
export const generateThinkingSkillsId = createIdGenerator(3000);
export const generateEnglishId = createIdGenerator(4000);
export const generateMathematicalReasoningId = createIdGenerator(5000);

// General ID generator for enhanced questions
export const generateId = createIdGenerator(6000);
