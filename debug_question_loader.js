
/**
 * DEBUG QUESTION LOADER
 * 
 * Use this to debug what questions are being loaded for each subject filter
 */

function debugQuestionLoading(grade, difficulty, subject) {
  console.log(`🎯 DEBUG: Loading questions for Grade ${grade}, ${difficulty}, ${subject}`);
  
  // Simulate the loading process
  const expectedFile = `${grade}_${difficulty}_${subject.toLowerCase().replace(' ', '-')}.json`;
  console.log(`📁 Expected file: ${expectedFile}`);
  
  // Load and analyze
  fetch(`/questions/${expectedFile}`)
    .then(response => response.json())
    .then(questions => {
      console.log(`📊 Loaded ${questions.length} questions from ${expectedFile}`);
      
      // Check subjects
      const subjects = [...new Set(questions.map(q => q.subject))];
      console.log(`🏷️ Subjects found: ${subjects.join(', ')}`);
      
      // Check for mismatches
      const expectedSubject = getExpectedSubject(subject);
      const mismatches = questions.filter(q => q.subject !== expectedSubject);
      
      if (mismatches.length > 0) {
        console.log(`🚨 Found ${mismatches.length} questions with wrong subject:`);
        mismatches.slice(0, 3).forEach(q => {
          console.log(`   ❌ "${q.content.substring(0, 40)}..." (Expected: ${expectedSubject}, Got: ${q.subject})`);
        });
      } else {
        console.log(`✅ All questions have correct subject: ${expectedSubject}`);
      }
    })
    .catch(error => {
      console.log(`❌ Failed to load ${expectedFile}: ${error.message}`);
    });
}

function getExpectedSubject(requestedSubject) {
  const mapping = {
    'english': 'English',
    'math': 'Mathematics', 
    'mathematics': 'Mathematics',
    'reading': 'Reading',
    'thinking skills': 'Thinking Skills',
    'thinking-skills': 'Thinking Skills'
  };
  
  return mapping[requestedSubject.toLowerCase()] || requestedSubject;
}

// Add to your frontend for debugging
window.debugQuestionLoading = debugQuestionLoading;
