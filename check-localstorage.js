// This script can be run in the browser console to check and fix the localStorage data
function checkAndFixLocalStorage() {
  const contextKey = 'testace_user_context';
  const storedContext = localStorage.getItem(contextKey);
  
  console.log('Current localStorage data:', storedContext);
  
  if (storedContext) {
    try {
      const parsedContext = JSON.parse(storedContext);
      console.log('Parsed context:', parsedContext);
      
      // Check if grade is a number and convert it to string
      if (typeof parsedContext.grade === 'number') {
        console.log('Converting grade from number to string');
        parsedContext.grade = String(parsedContext.grade);
        localStorage.setItem(contextKey, JSON.stringify(parsedContext));
        console.log('Fixed localStorage data:', JSON.stringify(parsedContext));
      }
    } catch (error) {
      console.error('Error parsing user context:', error);
    }
  }
}

checkAndFixLocalStorage();
