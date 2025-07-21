// This script tests the filter changes by examining the questions in the Practice component
(function() {
  // Function to check if the Practice component is loaded
  function isPracticeComponentLoaded() {
    // Check if the Practice component's state is available in React DevTools
    // This is a simplified check and might not work in all cases
    return document.querySelector('.MuiGrid-container') !== null;
  }
  
  // Function to log the current questions
  function logCurrentQuestions() {
    // Get all question cards
    const questionCards = document.querySelectorAll('.MuiCard-root');
    console.log(`Found ${questionCards.length} questions on the page`);
    
    // Log the content of each question
    questionCards.forEach((card, index) => {
      const content = card.querySelector('h6')?.textContent || 'No content found';
      console.log(`Question ${index + 1}: ${content.substring(0, 50)}...`);
    });
  }
  
  // Check if the Practice component is loaded
  if (isPracticeComponentLoaded()) {
    console.log('Practice component is loaded');
    logCurrentQuestions();
    
    console.log('\nInstructions for testing:');
    console.log('1. Change the Subject filter to "Thinking Skills"');
    console.log('2. Change the Grade filter to "5"');
    console.log('3. Change the Difficulty filter to "Easy"');
    console.log('4. Observe if ALL questions change according to the filters');
    console.log('5. Click the "Generate Thinking Skills" button');
    console.log('6. Observe if the questions are shuffled');
  } else {
    console.log('Practice component is not loaded. Please navigate to the Practice page first.');
  }
})();
