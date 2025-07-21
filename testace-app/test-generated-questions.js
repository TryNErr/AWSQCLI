// This script tests the generated questions functionality
// Run this in the browser console to verify that generated questions are working correctly

(function() {
  // Clear existing generated questions
  localStorage.removeItem('testace_generated_questions');
  
  // Create a test question
  const testQuestion = {
    _id: '3000',
    content: 'Test Question: What is 2+2?',
    type: 'MULTIPLE_CHOICE',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: 'Basic addition: 2+2=4',
    subject: 'Math',
    topic: 'Addition',
    difficulty: 'EASY',
    tags: ['math', 'addition', 'elementary'],
    grade: '5',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    isGenerated: true
  };
  
  // Save the test question to localStorage
  const generatedQuestionsKey = 'testace_generated_questions';
  localStorage.setItem(generatedQuestionsKey, JSON.stringify([testQuestion]));
  
  console.log('Test question created with ID 3000');
  console.log('You can now navigate to /practice/question/3000 to test');
})();
