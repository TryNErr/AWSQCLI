// This script examines the question with ID 3008 to identify duplicate answers
(function() {
  const generatedQuestionsKey = 'testace_generated_questions';
  const questions = JSON.parse(localStorage.getItem(generatedQuestionsKey) || '[]');
  const question = questions.find(q => q._id === '3008');
  
  if (question) {
    console.log('Question ID 3008:');
    console.log('Content:', question.content);
    console.log('Options:', question.options);
    console.log('Correct Answer:', question.correctAnswer);
    
    // Check for duplicate options
    const uniqueOptions = new Set(question.options);
    if (uniqueOptions.size < question.options.length) {
      console.log('DUPLICATE OPTIONS DETECTED!');
      console.log('Unique options count:', uniqueOptions.size);
      console.log('Total options count:', question.options.length);
    }
  } else {
    console.log('Question with ID 3008 not found');
  }
})();
