// This script can be run in the browser console to reset the localStorage data
function resetLocalStorage() {
  const contextKey = 'testace_user_context';
  
  // Default user context with grade as string
  const defaultUserContext = {
    userId: 'demo-user',
    username: 'Demo User',
    grade: '5', // Default to grade 5 as a string
    subjects: ['Math', 'Science', 'English'],
    lastActive: new Date().toISOString()
  };
  
  // Reset the localStorage data
  localStorage.setItem(contextKey, JSON.stringify(defaultUserContext));
  console.log('Reset localStorage data:', JSON.stringify(defaultUserContext));
}

resetLocalStorage();
