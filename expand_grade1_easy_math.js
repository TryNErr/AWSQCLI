const fs = require('fs');

console.log('📚 EXPANDING GRADE 1 EASY MATH TO 20 AGE-APPROPRIATE QUESTIONS...');

// Grade 1 Easy Math - Perfect for 6-7 year olds
const grade1EasyMath = [
  {
    "_id": `basic1_${Date.now()}_001`,
    "content": "Count the apples: 🍎🍎🍎. How many apples are there?",
    "type": "multiple_choice",
    "options": ["2", "3", "4", "5"],
    "correctAnswer": "3",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "Count each apple: 1, 2, 3"
  },
  {
    "_id": `basic1_${Date.now()}_002`,
    "content": "What comes after 7? 5, 6, 7, ___",
    "type": "multiple_choice",
    "options": ["6", "8", "9", "10"],
    "correctAnswer": "8",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "The next number in counting order after 7 is 8"
  },
  {
    "_id": `basic1_${Date.now()}_003`,
    "content": "Which shape has 3 sides?",
    "type": "multiple_choice",
    "options": ["Circle", "Square", "Triangle", "Rectangle"],
    "correctAnswer": "Triangle",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "A triangle has exactly 3 sides"
  },
  {
    "_id": `basic1_${Date.now()}_004`,
    "content": "2 + 1 = ?",
    "type": "multiple_choice",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "3",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "When you add 2 and 1 together, you get 3"
  },
  {
    "_id": `basic1_${Date.now()}_005`,
    "content": "Which number is bigger: 5 or 3?",
    "type": "multiple_choice",
    "options": ["3", "5", "They are the same", "Cannot tell"],
    "correctAnswer": "5",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "5 is greater than 3"
  },
  {
    "_id": `basic1_${Date.now()}_006`,
    "content": "Count the stars: ⭐⭐⭐⭐⭐. How many stars?",
    "type": "multiple_choice",
    "options": ["4", "5", "6", "7"],
    "correctAnswer": "5",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "Count each star: 1, 2, 3, 4, 5"
  },
  {
    "_id": `basic1_${Date.now()}_007`,
    "content": "4 - 2 = ?",
    "type": "multiple_choice",
    "options": ["1", "2", "3", "6"],
    "correctAnswer": "2",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "When you take away 2 from 4, you have 2 left"
  },
  {
    "_id": `basic1_${Date.now()}_008`,
    "content": "How many wheels does a bicycle have? 🚲",
    "type": "multiple_choice",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "2",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "A bicycle has 2 wheels"
  },
  {
    "_id": `basic1_${Date.now()}_009`,
    "content": "What number comes before 5? ___, 5, 6",
    "type": "multiple_choice",
    "options": ["3", "4", "6", "7"],
    "correctAnswer": "4",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "The number that comes before 5 is 4"
  },
  {
    "_id": `basic1_${Date.now()}_010`,
    "content": "Count the fingers: ✋. How many fingers?",
    "type": "multiple_choice",
    "options": ["4", "5", "6", "10"],
    "correctAnswer": "5",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "One hand has 5 fingers"
  },
  {
    "_id": `basic1_${Date.now()}_011`,
    "content": "3 + 2 = ?",
    "type": "multiple_choice",
    "options": ["4", "5", "6", "1"],
    "correctAnswer": "5",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "3 plus 2 equals 5"
  },
  {
    "_id": `basic1_${Date.now()}_012`,
    "content": "Which is the smallest number?",
    "type": "multiple_choice",
    "options": ["7", "2", "9", "5"],
    "correctAnswer": "2",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "2 is the smallest number among the choices"
  },
  {
    "_id": `basic1_${Date.now()}_013`,
    "content": "Count the dots: • • • •. How many dots?",
    "type": "multiple_choice",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "4",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "Count each dot: 1, 2, 3, 4"
  },
  {
    "_id": `basic1_${Date.now()}_014`,
    "content": "5 - 1 = ?",
    "type": "multiple_choice",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "4",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "When you take away 1 from 5, you get 4"
  },
  {
    "_id": `basic1_${Date.now()}_015`,
    "content": "How many sides does a square have?",
    "type": "multiple_choice",
    "options": ["2", "3", "4", "5"],
    "correctAnswer": "4",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "A square has 4 equal sides"
  },
  {
    "_id": `basic1_${Date.now()}_016`,
    "content": "What number is missing? 1, 2, ___, 4",
    "type": "multiple_choice",
    "options": ["2", "3", "4", "5"],
    "correctAnswer": "3",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "The missing number between 2 and 4 is 3"
  },
  {
    "_id": `basic1_${Date.now()}_017`,
    "content": "1 + 1 = ?",
    "type": "multiple_choice",
    "options": ["1", "2", "3", "0"],
    "correctAnswer": "2",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "1 plus 1 equals 2"
  },
  {
    "_id": `basic1_${Date.now()}_018`,
    "content": "Count the hearts: ❤️❤️. How many hearts?",
    "type": "multiple_choice",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "2",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "Count each heart: 1, 2"
  },
  {
    "_id": `basic1_${Date.now()}_019`,
    "content": "Which number is the biggest?",
    "type": "multiple_choice",
    "options": ["3", "1", "8", "5"],
    "correctAnswer": "8",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "8 is the biggest number among the choices"
  },
  {
    "_id": `basic1_${Date.now()}_020`,
    "content": "How many eyes do you have? 👀",
    "type": "multiple_choice",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "2",
    "subject": "Mathematics",
    "grade": 1,
    "difficulty": "easy",
    "explanation": "People have 2 eyes"
  }
];

// Update both locations
const locations = [
  '/workspaces/AWSQCLI/testace-app/public/questions/1_easy_math.json',
  '/workspaces/AWSQCLI/testace-app/frontend/public/questions/1_easy_math.json'
];

for (const location of locations) {
  if (fs.existsSync(location)) {
    fs.writeFileSync(location, JSON.stringify(grade1EasyMath, null, 2));
    console.log(`✅ Updated ${location} with 20 age-appropriate questions`);
  }
}

console.log('\n🎯 GRADE 1 EASY MATH EXPANDED TO 20 QUESTIONS!');
console.log('✅ Perfect for 6-7 year olds learning basic math');
console.log('✅ Topics: counting, basic addition/subtraction, shapes, number recognition');
console.log('✅ Uses fun emojis and relatable examples');
console.log('\n📝 Refresh your browser to see all 20 questions!');
