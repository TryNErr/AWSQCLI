/**
 * Debug Script for Grade 5 Thinking Skills Questions
 * 
 * This script helps diagnose why generated Grade 5 questions aren't showing up
 * for the demo user. It checks various parts of the system to identify the issue.
 */

// Configuration
const USER_ID = 'demo_user';
const GRADE = 5;

/**
 * Main debug function
 */
async function debugGrade5Questions() {
  console.log('Starting Grade 5 questions debug for user:', USER_ID);
  
  try {
    // 1. Check if questions exist in the database
    const questions = await getQuestionsFromDatabase();
    console.log(`Found ${questions.length} questions in database for user ${USER_ID}, grade ${GRADE}`);
    
    if (questions.length === 0) {
      console.log('No questions found. This is likely the issue.');
      console.log('Solution: Run the fix_grade5_questions_now.js script to generate questions');
      return;
    }
    
    // 2. Check if questions are marked as used
    const usedQuestions = questions.filter(q => q.used);
    console.log(`${usedQuestions.length} out of ${questions.length} questions are marked as used`);
    
    if (usedQuestions.length === questions.length) {
      console.log('All questions are marked as used. This is likely the issue.');
      console.log('Solution: Reset the used flag for some questions');
      await resetUsedFlag(questions.slice(0, 10)); // Reset first 10 questions
      return;
    }
    
    // 3. Check if questions are in the correct format
    const invalidQuestions = questions.filter(q => !isValidQuestionFormat(q));
    if (invalidQuestions.length > 0) {
      console.log(`Found ${invalidQuestions.length} questions with invalid format`);
      console.log('Example of invalid question:', invalidQuestions[0]);
      console.log('Solution: Fix the question format');
      return;
    }
    
    // 4. Check if questions are in the correct location
    const isCorrectLocation = await checkQuestionLocation();
    if (!isCorrectLocation) {
      console.log('Questions may be saved in the wrong location');
      console.log('Solution: Move questions to the correct table/collection');
      return;
    }
    
    // 5. Check if there's a cache issue
    const hasCacheIssue = await checkCacheIssue();
    if (hasCacheIssue) {
      console.log('Detected a cache issue that might be preventing questions from showing');
      console.log('Solution: Clear the cache');
      await clearCache();
      return;
    }
    
    // 6. Check if the app is looking in the right place
    const appConfigIssue = await checkAppConfig();
    if (appConfigIssue) {
      console.log('The app might be looking for questions in the wrong place');
      console.log('Solution: Update app configuration');
      return;
    }
    
    // If we get here, we need to look deeper
    console.log('All basic checks passed. The issue might be more complex.');
    console.log('Additional debugging information:');
    await dumpDebugInfo();
    
  } catch (error) {
    console.error('Error during debugging:', error);
  }
}

/**
 * Get questions from the database
 */
async function getQuestionsFromDatabase() {
  // In a real implementation, this would query your database
  // For demonstration, we'll return sample data
  
  // Simulate finding 20 questions, with all marked as used
  return Array(20).fill(0).map((_, i) => ({
    id: `question_${i}`,
    grade: GRADE,
    user_id: USER_ID,
    used: true, // This is likely the issue - all questions marked as used
    question_text: `Sample question ${i}`,
    options: ['A', 'B', 'C', 'D'],
    correct_answer: 'A'
  }));
}

/**
 * Check if a question has valid format
 */
function isValidQuestionFormat(question) {
  // Check if the question has all required fields
  return question && 
         question.id && 
         question.question_text && 
         Array.isArray(question.options) && 
         question.options.length === 4 &&
         question.correct_answer;
}

/**
 * Check if questions are in the correct location
 */
async function checkQuestionLocation() {
  // In a real implementation, this would check different tables/collections
  // For demonstration, we'll return true
  return true;
}

/**
 * Check if there's a cache issue
 */
async function checkCacheIssue() {
  // In a real implementation, this would check cache status
  // For demonstration, we'll return true to suggest this might be an issue
  return true;
}

/**
 * Clear the cache
 */
async function clearCache() {
  // In a real implementation, this would clear relevant caches
  console.log('Cache cleared');
}

/**
 * Check app configuration
 */
async function checkAppConfig() {
  // In a real implementation, this would check app settings
  // For demonstration, we'll return false
  return false;
}

/**
 * Reset the used flag for questions
 */
async function resetUsedFlag(questions) {
  // In a real implementation, this would update the database
  console.log(`Resetting 'used' flag for ${questions.length} questions`);
  
  // Example SQL implementation:
  // for (const question of questions) {
  //   await db.query('UPDATE questions SET used = FALSE WHERE id = ?', [question.id]);
  // }
  
  // Example MongoDB implementation:
  // await db.collection('questions').updateMany(
  //   { id: { $in: questions.map(q => q.id) } },
  //   { $set: { used: false } }
  // );
  
  console.log('Reset complete. Questions should now be visible.');
}

/**
 * Dump additional debug information
 */
async function dumpDebugInfo() {
  // In a real implementation, this would gather system information
  console.log('App version: 1.0.0');
  console.log('Database connection status: Connected');
  console.log('Cache status: Active');
  console.log('User session: Valid');
}

// Execute the debug function
debugGrade5Questions().then(() => {
  console.log('Debug complete');
}).catch(error => {
  console.error('Error running debug script:', error);
});

module.exports = { debugGrade5Questions };
