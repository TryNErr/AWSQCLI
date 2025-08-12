
/**
 * FILTERING TEST SUITE
 * 
 * Test cases to verify subject filtering works correctly
 */

const filteringTests = [
  {
    name: 'English Filter Test',
    grade: '9',
    difficulty: 'hard',
    subject: 'English',
    expectedSubject: 'English',
    shouldNotContain: ['Mathematics', 'Reading', 'Thinking Skills']
  },
  {
    name: 'Math Filter Test', 
    grade: '9',
    difficulty: 'hard',
    subject: 'Mathematics',
    expectedSubject: 'Mathematics',
    shouldNotContain: ['English', 'Reading', 'Thinking Skills']
  },
  {
    name: 'Reading Filter Test',
    grade: '9', 
    difficulty: 'hard',
    subject: 'Reading',
    expectedSubject: 'Reading',
    shouldNotContain: ['Mathematics', 'English', 'Thinking Skills']
  }
];

function runFilteringTests() {
  console.log('🧪 Running Filtering Tests...');
  
  filteringTests.forEach(test => {
    console.log(`\n📋 ${test.name}:`);
    
    // Load questions for this filter
    const filename = `${test.grade}_${test.difficulty}_${test.subject.toLowerCase().replace(' ', '-')}.json`;
    
    fetch(`/questions/${filename}`)
      .then(response => response.json())
      .then(questions => {
        console.log(`   📊 Loaded ${questions.length} questions`);
        
        // Test 1: All questions should have expected subject
        const correctSubject = questions.filter(q => q.subject === test.expectedSubject);
        const wrongSubject = questions.filter(q => q.subject !== test.expectedSubject);
        
        console.log(`   ✅ Correct subject (${test.expectedSubject}): ${correctSubject.length}`);
        
        if (wrongSubject.length > 0) {
          console.log(`   ❌ Wrong subject: ${wrongSubject.length}`);
          wrongSubject.forEach(q => {
            console.log(`      - "${q.content.substring(0, 30)}..." (Subject: ${q.subject})`);
          });
        }
        
        // Test 2: Should not contain forbidden subjects
        test.shouldNotContain.forEach(forbiddenSubject => {
          const forbidden = questions.filter(q => q.subject === forbiddenSubject);
          if (forbidden.length > 0) {
            console.log(`   🚨 Contains forbidden subject ${forbiddenSubject}: ${forbidden.length} questions`);
          }
        });
        
        // Test result
        const passed = wrongSubject.length === 0;
        console.log(`   ${passed ? '✅ PASSED' : '❌ FAILED'}`);
      })
      .catch(error => {
        console.log(`   ❌ Test failed to load: ${error.message}`);
      });
  });
}

// Add to your frontend for testing
window.runFilteringTests = runFilteringTests;
