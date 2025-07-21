import { Question, DifficultyLevel, QuestionType } from '../types';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 3000; // Start from 3000 to avoid ID conflicts
  return () => (counter++).toString();
})();

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to ensure options are unique
const ensureUniqueOptions = (correctAnswer: string, wrongOptions: string[]): string[] => {
  // First, remove any duplicates within wrong options
  const uniqueWrongOptions = Array.from(new Set(wrongOptions));
  
  // Then, remove any wrong options that match the correct answer
  const filteredWrongOptions = uniqueWrongOptions.filter(option => option !== correctAnswer);
  
  // If we don't have enough wrong options, generate more
  while (filteredWrongOptions.length < 3) {
    // Generate a suffix to make the option unique
    const suffix = ` (${filteredWrongOptions.length + 1})`;
    let newOption = correctAnswer + suffix;
    
    // Make sure this new option is also unique
    if (!filteredWrongOptions.includes(newOption)) {
      filteredWrongOptions.push(newOption);
    }
  }
  
  // Take only the first 3 wrong options to ensure we have exactly 4 options total
  return shuffleArray([correctAnswer, ...filteredWrongOptions.slice(0, 3)]);
};

// Generate logical reasoning questions
const generateLogicalReasoningQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple syllogism
      const categories = [
        { category: 'animals', examples: ['dogs', 'cats', 'birds', 'fish'] },
        { category: 'fruits', examples: ['apples', 'bananas', 'oranges', 'grapes'] },
        { category: 'vehicles', examples: ['cars', 'bikes', 'buses', 'trains'] },
        { category: 'furniture', examples: ['chairs', 'tables', 'beds', 'sofas'] }
      ];
      
      const selectedCategory = categories[getRandomInt(0, categories.length - 1)];
      const selectedExample = selectedCategory.examples[getRandomInt(0, selectedCategory.examples.length - 1)];
      const property = ['have colors', 'need space', 'have weight', 'can be counted'][getRandomInt(0, 3)];
      const name = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey'][getRandomInt(0, 4)];
      
      question = `Which statement logically follows from these premises? All ${selectedCategory.category} ${property}. ${name} has a ${selectedExample.slice(0, -1)}.`;
      answer = `${name}s ${selectedExample.slice(0, -1)} ${property.replace('have', 'has')}`;
      explanation = `This is a syllogism. If all ${selectedCategory.category} ${property}, and ${name} has a ${selectedExample.slice(0, -1)} (which is a type of ${selectedCategory.category.slice(0, -1)}), then it logically follows that ${name}s ${selectedExample.slice(0, -1)} ${property.replace('have', 'has')}.`;
      
      const wrongOptions = [
        `All things that ${property} are ${selectedCategory.category}`,
        `Some ${selectedCategory.category} do not ${property}`,
        `${name} might have a ${selectedCategory.examples[getRandomInt(0, selectedCategory.examples.length - 1)].slice(0, -1)}`
      ];
      options = ensureUniqueOptions(answer, wrongOptions);
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // Conditional reasoning
      const scenarios = [
        {
          condition: 'it is raining',
          consequence: 'the ground is wet',
          options: [
            'If the ground is wet, then it is raining',
            'If it is not raining, then the ground is not wet',
            'If the ground is not wet, then it is not raining',
            'It cannot be determined whether it is raining'
          ],
          correctIndex: 2,
          explanation: 'This is the contrapositive of the original statement. If P implies Q, then not Q implies not P. So if "it is raining implies the ground is wet", then "the ground is not wet implies it is not raining".'
        },
        {
          condition: 'you study hard',
          consequence: 'you will pass the exam',
          options: [
            'If you pass the exam, then you studied hard',
            'If you do not study hard, then you will not pass the exam',
            'If you do not pass the exam, then you did not study hard',
            'You will study hard and pass the exam'
          ],
          correctIndex: 2,
          explanation: 'This is the contrapositive of the original statement. If P implies Q, then not Q implies not P. So if "you study hard implies you will pass the exam", then "you do not pass the exam implies you did not study hard".'
        }
      ];
      
      const selectedScenario = scenarios[getRandomInt(0, scenarios.length - 1)];
      
      question = `If the following statement is true, which conclusion must also be true? "If ${selectedScenario.condition}, then ${selectedScenario.consequence}."`;
      answer = selectedScenario.options[selectedScenario.correctIndex];
      explanation = selectedScenario.explanation;
      
      options = selectedScenario.options;
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex logical puzzles
      const puzzles = [
        {
          question: 'Three friends - Alex, Bailey, and Casey - each have a different favorite color: red, blue, or green. Alex does not like green. Bailey likes blue. What color does Casey like?',
          options: ['Red', 'Blue', 'Green', 'Cannot be determined'],
          correctIndex: 2,
          explanation: 'Since Bailey likes blue and Alex does not like green, Alex must like red. This means Casey must like green.'
        },
        {
          question: 'In a race, Jack finished ahead of Mike, Peter finished behind Simon, and Mike finished ahead of Simon. Who finished last?',
          options: ['Jack', 'Mike', 'Peter', 'Simon'],
          correctIndex: 2,
          explanation: 'From the given information, we know: Jack finished ahead of Mike, Mike finished ahead of Simon, Simon finished ahead of Peter. So Peter finished last.'
        },
        {
          question: 'Five people - Alex, Bella, Carlos, Diana, and Ethan - are sitting in a row. If Alex is not sitting next to Bella, Carlos is sitting next to Diana, and Ethan is at one end, which of the following must be true?',
          options: [
            'Alex is sitting at one end',
            'Bella is sitting in the middle',
            'Carlos is sitting next to Ethan',
            'Diana is sitting next to Ethan'
          ],
          correctIndex: 2,
          explanation: 'Since Ethan is at one end and Carlos is next to Diana, there are limited possibilities. If Carlos and Diana are together, and Alex and Bella are not together, then either Carlos or Diana must be next to Ethan. Working through the possibilities, we find that Carlos must be next to Ethan.'
        }
      ];
      
      const selectedPuzzle = puzzles[getRandomInt(0, puzzles.length - 1)];
      
      question = selectedPuzzle.question;
      answer = selectedPuzzle.options[selectedPuzzle.correctIndex];
      explanation = selectedPuzzle.explanation;
      
      options = selectedPuzzle.options;
      break;
    }
    
    default: {
      // Default case to satisfy TypeScript
      question = 'If all birds can fly, and a penguin is a bird, what can we conclude?';
      answer = 'A penguin can fly';
      explanation = 'This is a syllogism, but it\'s actually flawed because the premise "all birds can fly" is false. Some birds, like penguins, cannot fly.';
      
      const wrongOptions = [
        'A penguin cannot fly',
        'Some birds cannot fly',
        'All penguins are birds'
      ];
      options = ensureUniqueOptions(answer, wrongOptions);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Thinking Skills',
    topic: 'Logical Reasoning',
    difficulty,
    tags: ['logic', 'reasoning', gradeNum <= 5 ? 'elementary' : gradeNum <= 8 ? 'middle school' : 'high school'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Consider what must be true based on the given information', 'Think about logical relationships between statements']
  };
};

// Generate pattern recognition questions
const generatePatternQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple pattern with shapes or numbers
      const patternTypes = ['shape', 'number'];
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      
      if (patternType === 'shape') {
        const shapes = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Star'];
        const pattern = [];
        const patternLength = getRandomInt(2, 3);
        
        for (let i = 0; i < patternLength; i++) {
          pattern.push(shapes[getRandomInt(0, shapes.length - 1)]);
        }
        
        const fullPattern = [...pattern, ...pattern, ...pattern];
        const nextIndex = fullPattern.length - 1;
        const nextShape = fullPattern[nextIndex % patternLength];
        
        question = `Which shape comes next in this pattern? ${fullPattern.slice(0, -1).join(', ')}, ?`;
        answer = nextShape;
        explanation = `The pattern repeats: ${pattern.join(', ')}. So the next shape is ${nextShape}.`;
        
        // Generate wrong options
        const wrongOptions = shapes.filter(shape => shape !== nextShape).slice(0, 3);
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        // Number pattern (counting by 1s, 2s, 5s, or 10s)
        const increment = [1, 2, 5, 10][getRandomInt(0, 3)];
        const start = getRandomInt(1, 10);
        const pattern = [];
        
        for (let i = 0; i < 5; i++) {
          pattern.push(start + i * increment);
        }
        
        const nextNumber = start + 5 * increment;
        
        question = `What number comes next in this pattern? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `The pattern is counting by ${increment}s. After ${pattern[pattern.length - 1]}, the next number would be ${nextNumber}.`;
        
        // Generate wrong options
        const wrongOptions = [
          (nextNumber + increment).toString(),
          (nextNumber - 1).toString(),
          (nextNumber + getRandomInt(2, 5)).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // More complex number patterns
      const patternTypes = ['arithmetic', 'geometric', 'fibonacci'];
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      
      if (patternType === 'arithmetic') {
        // Arithmetic sequence with varying increment
        const increment = getRandomInt(2, 5);
        const start = getRandomInt(1, 10);
        const pattern = [];
        
        for (let i = 0; i < 5; i++) {
          pattern.push(start + i * increment);
        }
        
        const nextNumber = start + 5 * increment;
        
        question = `What number comes next in this pattern? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `This is an arithmetic sequence with a common difference of ${increment}. The next number is ${pattern[pattern.length - 1]} + ${increment} = ${nextNumber}.`;
        
        // Generate wrong options
        const wrongOptions = [
          (nextNumber + increment).toString(),
          (nextNumber - increment).toString(),
          (pattern[pattern.length - 1] * 2).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (patternType === 'geometric') {
        // Geometric sequence
        const multiplier = getRandomInt(2, 3);
        const start = getRandomInt(1, 5);
        const pattern = [];
        
        for (let i = 0; i < 5; i++) {
          pattern.push(start * Math.pow(multiplier, i));
        }
        
        const nextNumber = start * Math.pow(multiplier, 5);
        
        question = `What number comes next in this pattern? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `This is a geometric sequence with a common ratio of ${multiplier}. The next number is ${pattern[pattern.length - 1]} × ${multiplier} = ${nextNumber}.`;
        
        // Generate wrong options
        const wrongOptions = [
          (nextNumber + multiplier).toString(),
          (pattern[pattern.length - 1] + pattern[pattern.length - 1]).toString(),
          (nextNumber + getRandomInt(1, 5)).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        // Fibonacci-like sequence
        const start1 = getRandomInt(1, 5);
        const start2 = getRandomInt(1, 5);
        const pattern = [start1, start2];
        
        for (let i = 2; i < 5; i++) {
          pattern.push(pattern[i - 1] + pattern[i - 2]);
        }
        
        const nextNumber = pattern[pattern.length - 1] + pattern[pattern.length - 2];
        
        question = `What number comes next in this pattern? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `In this pattern, each number is the sum of the two previous numbers. So the next number is ${pattern[pattern.length - 1]} + ${pattern[pattern.length - 2]} = ${nextNumber}.`;
        
        // Generate wrong options
        const wrongOptions = [
          (nextNumber + 1).toString(),
          (pattern[pattern.length - 1] * 2).toString(),
          (pattern[pattern.length - 1] + 1).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex patterns or sequences
      const patternTypes = ['square', 'cube', 'triangular', 'prime'];
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      
      if (patternType === 'square') {
        // Square numbers
        const pattern = [1, 4, 9, 16, 25];
        const nextNumber = 36; // 6²
        
        question = `What comes next in this sequence? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25, so the next number would be 6² = 36.`;
        
        // Generate wrong options
        const wrongOptions = ['30', '49', '42'];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (patternType === 'cube') {
        // Cube numbers
        const pattern = [1, 8, 27, 64, 125];
        const nextNumber = 216; // 6³
        
        question = `What comes next in this sequence? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `These are cube numbers: 1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64, 5³ = 125, so the next number would be 6³ = 216.`;
        
        // Generate wrong options
        const wrongOptions = ['150', '200', '250'];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (patternType === 'triangular') {
        // Triangular numbers
        const pattern = [1, 3, 6, 10, 15];
        const nextNumber = 21; // 6th triangular number
        
        question = `What comes next in this sequence? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `These are triangular numbers: 1, 1+2=3, 3+3=6, 6+4=10, 10+5=15, so the next number would be 15+6=21.`;
        
        // Generate wrong options
        const wrongOptions = ['18', '20', '25'];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        // Prime numbers
        const pattern = [2, 3, 5, 7, 11];
        const nextNumber = 13; // Next prime
        
        question = `What comes next in this sequence? ${pattern.join(', ')}, ?`;
        answer = nextNumber.toString();
        explanation = `These are prime numbers. The next prime number after 11 is 13.`;
        
        // Generate wrong options
        const wrongOptions = ['12', '14', '15'];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    default: {
      // Default case to satisfy TypeScript
      const pattern = [2, 4, 6, 8];
      const nextNumber = 10;
      
      question = `What number comes next in this pattern? ${pattern.join(', ')}, ?`;
      answer = nextNumber.toString();
      explanation = `The pattern is counting by 2s. After ${pattern[pattern.length - 1]}, the next number would be ${nextNumber}.`;
      
      const wrongOptions = [
        (nextNumber + 2).toString(),
        (nextNumber - 1).toString(),
        (nextNumber + 1).toString()
      ];
      options = ensureUniqueOptions(answer, wrongOptions);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Thinking Skills',
    topic: 'Pattern Recognition',
    difficulty,
    tags: ['patterns', 'sequences', gradeNum <= 5 ? 'elementary' : gradeNum <= 8 ? 'middle school' : 'high school'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Look for a pattern in the sequence', 'Consider different types of mathematical relationships']
  };
};
// Generate problem-solving questions
const generateProblemSolvingQuestion = (grade: string, difficulty: DifficultyLevel): Question => {
  const gradeNum = parseInt(grade);
  let question: string, answer: string, explanation: string;
  let options: string[];
  
  switch (difficulty) {
    case DifficultyLevel.EASY: {
      // Simple word problems
      const problemTypes = ['age', 'counting', 'comparison'];
      const problemType = problemTypes[getRandomInt(0, problemTypes.length - 1)];
      
      if (problemType === 'age') {
        const currentAge = getRandomInt(5, 10);
        // const yearsAgo = getRandomInt(1, 3); // Removed unused variable
        const futureYears = getRandomInt(1, 5);
        
        question = `Sam is ${currentAge} years old now. How old will Sam be in ${futureYears} years?`;
        answer = (currentAge + futureYears).toString();
        explanation = `Sam is currently ${currentAge} years old. In ${futureYears} years, Sam will be ${currentAge} + ${futureYears} = ${currentAge + futureYears} years old.`;
        
        const wrongOptions = [
          (currentAge + futureYears + 1).toString(),
          (currentAge + futureYears - 1).toString(),
          (currentAge * 2).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (problemType === 'counting') {
        const totalObjects = getRandomInt(10, 20);
        const objectType1 = ['apples', 'oranges', 'books', 'pencils'][getRandomInt(0, 3)];
        const objectType2 = ['bananas', 'grapes', 'notebooks', 'pens'][getRandomInt(0, 3)];
        const count1 = getRandomInt(3, totalObjects - 3);
        const count2 = totalObjects - count1;
        
        question = `Sarah has ${count1} ${objectType1} and ${count2} ${objectType2}. How many items does she have in total?`;
        answer = totalObjects.toString();
        explanation = `Sarah has ${count1} ${objectType1} and ${count2} ${objectType2}. The total number of items is ${count1} + ${count2} = ${totalObjects}.`;
        
        const wrongOptions = [
          (totalObjects + 1).toString(),
          (totalObjects - 1).toString(),
          (count1 * 2).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const num1 = getRandomInt(5, 15);
        const num2 = getRandomInt(5, 15);
        const difference = Math.abs(num1 - num2);
        
        question = `John has ${num1} marbles. Jane has ${num2} marbles. How many more marbles does ${num1 > num2 ? 'John' : 'Jane'} have than ${num1 > num2 ? 'Jane' : 'John'}?`;
        answer = difference.toString();
        explanation = `John has ${num1} marbles and Jane has ${num2} marbles. The difference is |${num1} - ${num2}| = ${difference}.`;
        
        const wrongOptions = [
          (difference + 1).toString(),
          (difference - 1).toString(),
          (num1 + num2).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.MEDIUM: {
      // More complex word problems
      const problemTypes = ['mixture', 'rate', 'probability'];
      const problemType = problemTypes[getRandomInt(0, problemTypes.length - 1)];
      
      if (problemType === 'mixture') {
        const container1 = getRandomInt(3, 8);
        const container2 = getRandomInt(3, 8);
        const total = container1 + container2;
        
        question = `A teacher has ${container1} red markers and ${container2} blue markers. What fraction of the markers are red?`;
        answer = `${container1}/${total}`;
        explanation = `The teacher has ${container1} red markers out of ${total} total markers. So the fraction of red markers is ${container1}/${total}.`;
        
        const wrongOptions = [
          `${container2}/${total}`,
          `${container1}/${container2}`,
          `${container2}/${container1}`
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (problemType === 'rate') {
        const distance = getRandomInt(10, 50) * 5; // Make it divisible by 5
        const time = getRandomInt(1, 5);
        const speed = distance / time;
        
        question = `A car travels ${distance} miles in ${time} hours. What is its average speed in miles per hour?`;
        answer = speed.toString();
        explanation = `Average speed = distance ÷ time = ${distance} miles ÷ ${time} hours = ${speed} miles per hour.`;
        
        const wrongOptions = [
          (speed + 5).toString(),
          (speed - 5).toString(),
          (distance * time).toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const redBalls = getRandomInt(2, 5);
        const blueBalls = getRandomInt(2, 5);
        const total = redBalls + blueBalls;
        
        question = `A bag contains ${redBalls} red balls and ${blueBalls} blue balls. If you pick one ball at random, what is the probability of picking a red ball?`;
        answer = `${redBalls}/${total}`;
        explanation = `The probability of picking a red ball is the number of red balls divided by the total number of balls: ${redBalls}/${total}.`;
        
        const wrongOptions = [
          `${blueBalls}/${total}`,
          `${redBalls}/${blueBalls}`,
          `${total}/${redBalls}`
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    case DifficultyLevel.HARD: {
      // Complex problem-solving
      const problemTypes = ['combination', 'logic', 'optimization'];
      const problemType = problemTypes[getRandomInt(0, problemTypes.length - 1)];
      
      if (problemType === 'combination') {
        const redMarbles = getRandomInt(2, 5);
        const blueMarbles = getRandomInt(2, 5);
        const greenMarbles = getRandomInt(1, 3);
        const total = redMarbles + blueMarbles + greenMarbles;
        
        question = `A bag contains ${redMarbles} red marbles, ${blueMarbles} blue marbles, and ${greenMarbles} green marbles. If you draw 2 marbles at random without replacement, what is the probability of drawing a red marble and then a blue marble?`;
        answer = `${redMarbles}/${total} × ${blueMarbles}/${total-1}`;
        explanation = `The probability of drawing a red marble first is ${redMarbles}/${total}. After drawing a red marble, there are ${total-1} marbles left, of which ${blueMarbles} are blue. So the probability of drawing a blue marble second is ${blueMarbles}/${total-1}. The probability of both events occurring is ${redMarbles}/${total} × ${blueMarbles}/${total-1} = ${(redMarbles*blueMarbles)/(total*(total-1))}.`;
        
        const wrongOptions = [
          `${blueMarbles}/${total} × ${redMarbles}/${total-1}`,
          `${redMarbles+blueMarbles}/${total} × ${total-1}/${total}`,
          `${redMarbles}/${total} × ${blueMarbles}/${total}`
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else if (problemType === 'logic') {
        const animals = getRandomInt(5, 15);
        const legs = animals * 4 - getRandomInt(1, animals) * 2; // Some animals have 2 legs instead of 4
        const twoLeggedAnimals = (animals * 4 - legs) / 2;
        const fourLeggedAnimals = animals - twoLeggedAnimals;
        
        question = `A farmer has chickens and cows. There are ${animals} animals in total with ${legs} legs. How many chickens does the farmer have?`;
        answer = twoLeggedAnimals.toString();
        explanation = `Let us call the number of chickens c and the number of cows (${animals} - c). Chickens have 2 legs and cows have 4 legs. So: 2c + 4(${animals} - c) = ${legs}. Simplifying: 2c + ${4*animals} - 4c = ${legs}, so -2c = ${legs - 4*animals}, and c = ${twoLeggedAnimals}.`;
        
        const wrongOptions = [
          (twoLeggedAnimals + 1).toString(),
          (twoLeggedAnimals - 1).toString(),
          fourLeggedAnimals.toString()
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      } else {
        const items = getRandomInt(3, 6);
        const capacity = getRandomInt(5, 10);
        const values = Array.from({length: items}, () => getRandomInt(1, 5));
        const weights = Array.from({length: items}, () => getRandomInt(1, 5));
        
        // Simple greedy solution for knapsack (not always optimal but good enough for our purpose)
        const valuePerWeight = values.map((v, i) => ({index: i, ratio: v/weights[i]}));
        valuePerWeight.sort((a, b) => b.ratio - a.ratio);
        
        let totalValue = 0;
        let remainingCapacity = capacity;
        const selectedItems = [];
        
        for (const item of valuePerWeight) {
          if (weights[item.index] <= remainingCapacity) {
            selectedItems.push(item.index);
            totalValue += values[item.index];
            remainingCapacity -= weights[item.index];
          }
        }
        
        question = `You have a backpack that can hold ${capacity} pounds. You have ${items} items with the following weights and values: ${weights.map((w, i) => `Item ${i+1}: ${w} pounds, $${values[i]}`).join('; ')}. What is the maximum value you can carry?`;
        answer = `$${totalValue}`;
        explanation = `To maximize value, you should select items with the highest value-to-weight ratio first. In this case, the optimal selection is: ${selectedItems.map(i => `Item ${i+1}`).join(', ')}. This gives a total value of $${totalValue}.`;
        
        const wrongOptions = [
          `$${totalValue + getRandomInt(1, 5)}`,
          `$${Math.max(0, totalValue - getRandomInt(1, 5))}`,
          `$${values.reduce((sum, v) => sum + v, 0)}`
        ];
        options = ensureUniqueOptions(answer, wrongOptions);
      }
      break;
    }
    
    default: {
      // Default case to satisfy TypeScript
      question = 'If you have 3 red balls and 2 blue balls in a bag, what is the probability of drawing a red ball?';
      answer = '3/5';
      explanation = 'The probability is the number of favorable outcomes divided by the total number of possible outcomes. There are 3 red balls out of 5 total balls, so the probability is 3/5.';
      
      const wrongOptions = ['2/5', '3/2', '2/3'];
      options = ensureUniqueOptions(answer, wrongOptions);
    }
  }
  
  return {
    _id: generateId(),
    content: question,
    type: QuestionType.MULTIPLE_CHOICE,
    options,
    correctAnswer: answer,
    explanation,
    subject: 'Thinking Skills',
    topic: 'Problem Solving',
    difficulty,
    tags: ['problem solving', 'word problems', gradeNum <= 5 ? 'elementary' : gradeNum <= 8 ? 'middle school' : 'high school'],
    grade,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    hints: ['Break down the problem into smaller parts', 'Identify what information is given and what you need to find']
  };
};
// Main function to generate thinking skills questions
export const generateThinkingSkillsQuestions = (
  grade: string,
  difficulty: DifficultyLevel,
  count: number = 5
): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    // Choose a question type based on a random distribution
    const questionType = Math.random();
    
    if (questionType < 0.33) {
      questions.push(generatePatternQuestion(grade, difficulty));
    } else if (questionType < 0.67) {
      questions.push(generateLogicalReasoningQuestion(grade, difficulty));
    } else {
      questions.push(generateProblemSolvingQuestion(grade, difficulty));
    }
  }
  
  return questions;
};
