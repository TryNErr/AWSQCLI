// This script resets the demo user's answered questions in localStorage
// to allow testing of the Thinking Skills question generation

(function() {
  // Get current localStorage data
  const userProgressKey = 'testace_user_progress';
  const userProgress = JSON.parse(localStorage.getItem(userProgressKey) || '{}');
  
  // Reset answered questions for Thinking Skills
  if (userProgress.answeredQuestions) {
    userProgress.answeredQuestions = userProgress.answeredQuestions.filter(q => {
      // Keep questions that are not Thinking Skills
      return !q.subject || q.subject !== 'Thinking Skills';
    });
    
    // Save back to localStorage
    localStorage.setItem(userProgressKey, JSON.stringify(userProgress));
    console.log('Successfully reset Thinking Skills questions for demo user');
  } else {
    console.log('No answered questions found in user progress');
  }
})();
