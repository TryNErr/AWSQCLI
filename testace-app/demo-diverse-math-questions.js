#!/usr/bin/env node

/**
 * Practical demonstration of diverse math question generation
 * Shows actual examples of the variety students will now experience
 */

console.log('🎲 DIVERSE MATH QUESTIONS DEMO\n');
console.log('Simulating what students will now experience...\n');

// Simulate the weighted random selection for Grade 5, Medium difficulty
const grade5MediumCategories = [
  { name: 'Basic Addition', weight: 15, example: 'What is 47 + 83?' },
  { name: 'Basic Subtraction', weight: 15, example: 'What is 92 - 38?' },
  { name: 'Multiplication', weight: 15, example: 'What is 12 × 7?' },
  { name: 'Division', weight: 15, example: 'What is 84 ÷ 6?' },
  { name: 'Word Problems', weight: 20, example: 'Sarah has 25 stickers. She gives away 8 stickers. How many does she have left?' },
  { name: 'Number Patterns', weight: 8, example: 'What comes next in this pattern? 2, 4, 6, ___' },
  { name: 'Geometry Basics', weight: 8, example: 'What is the area of a rectangle with length 6 and width 4?' },
  { name: 'Time & Money', weight: 7, example: 'How much change do you get from $10 if you buy something for $6.50?' },
  { name: 'Fractions', weight: 5, example: 'What is 1/2 + 1/4?' }
];

console.log('📚 GRADE 5, MEDIUM DIFFICULTY - Question Variety:');
console.log('Instead of always getting the same type, students now see:\n');

grade5MediumCategories.forEach((category, index) => {
  console.log(`${index + 1}. ${category.name} (${category.weight}% chance)`);
  console.log(`   Example: "${category.example}"`);
  console.log('');
});

console.log('🎓 GRADE 8, MEDIUM DIFFICULTY - Advanced Variety:');
const grade8Categories = [
  { name: 'Linear Equations', example: 'Solve for x: 3x + 5 = 17' },
  { name: 'Ratios & Proportions', example: 'If 3:4 = 9:x, what is x?' },
  { name: 'Percentages', example: 'What is 25% of 80?' },
  { name: 'Geometry', example: 'What is the area of a circle with radius 5?' },
  { name: 'Statistics', example: 'Find the mean of: 12, 15, 18, 21, 24' },
  { name: 'Probability', example: 'What is the probability of rolling a 6 on a fair die?' }
];

grade8Categories.forEach((category, index) => {
  console.log(`${index + 1}. ${category.name}`);
  console.log(`   Example: "${category.example}"`);
  console.log('');
});

console.log('🏆 GRADE 11, HARD DIFFICULTY - College Prep Variety:');
const grade11Categories = [
  { name: 'Quadratic Equations', example: 'Solve: x² - 5x + 6 = 0' },
  { name: 'Functions', example: 'If f(x) = 2x + 3, what is f(4)?' },
  { name: 'Trigonometry', example: 'What is sin(30°)?' },
  { name: 'Logarithms', example: 'What is log₂(8)?' },
  { name: 'Systems of Equations', example: 'Solve: 2x + y = 7, x - y = 2' },
  { name: 'Polynomials', example: 'Factor: x² - 9' }
];

grade11Categories.forEach((category, index) => {
  console.log(`${index + 1}. ${category.name}`);
  console.log(`   Example: "${category.example}"`);
  console.log('');
});

console.log('🔄 COMPARISON: Old vs New System\n');

console.log('❌ OLD SYSTEM - Repetitive Experience:');
console.log('   Student practices Grade 5, Medium 10 times:');
console.log('   1. Word Problem: "Tom has 15 apples..."');
console.log('   2. Word Problem: "Lisa has 20 books..."');
console.log('   3. Word Problem: "There are 12 cars..."');
console.log('   4. Word Problem: "Sarah bought 8 pencils..."');
console.log('   5. Word Problem: "The store has 25 items..."');
console.log('   Result: Student gets bored and disengaged 😴\n');

console.log('✅ NEW SYSTEM - Diverse Experience:');
console.log('   Student practices Grade 5, Medium 10 times:');
console.log('   1. Word Problem: "Tom has 15 apples..."');
console.log('   2. Multiplication: "What is 8 × 9?"');
console.log('   3. Number Pattern: "What comes next: 5, 10, 15, ___?"');
console.log('   4. Geometry: "Area of 7×3 rectangle?"');
console.log('   5. Division: "What is 72 ÷ 8?"');
console.log('   6. Addition: "What is 156 + 89?"');
console.log('   7. Time & Money: "Change from $20 for $13.75?"');
console.log('   8. Subtraction: "What is 200 - 87?"');
console.log('   9. Fractions: "What is 2/3 + 1/6?"');
console.log('   10. Word Problem: "Lisa has 20 books..."');
console.log('   Result: Student stays engaged and learns more! 🚀\n');

console.log('📈 EDUCATIONAL BENEFITS:');
console.log('   ✅ Comprehensive skill development');
console.log('   ✅ Prevents learning gaps');
console.log('   ✅ Maintains student interest');
console.log('   ✅ Better test preparation');
console.log('   ✅ Builds mathematical confidence');
console.log('   ✅ Mirrors real curriculum variety\n');

console.log('🎯 IMPLEMENTATION FEATURES:');
console.log('   ✅ Weighted random selection (not purely random)');
console.log('   ✅ Grade-appropriate question types');
console.log('   ✅ Difficulty-adjusted complexity');
console.log('   ✅ Fallback system for reliability');
console.log('   ✅ Maintains duplicate prevention');
console.log('   ✅ Professional question quality\n');

console.log('🌟 Your TestAce app now provides truly diverse math practice!');
console.log('Students will experience the variety they need to excel in mathematics.');
