// ID ranges for different question types
const ID_RANGES = {
  'math': 2000,
  'thinking-skills': 3000,
  'english': 4000,
  'mathematical-reasoning': 5000
};

let counters: { [key: string]: number } = {};

export function generateUniqueId(type: keyof typeof ID_RANGES): string {
  if (!counters[type]) {
    counters[type] = 0;
  }
  
  counters[type]++;
  return `${type}-${ID_RANGES[type] + counters[type]}`;
}
