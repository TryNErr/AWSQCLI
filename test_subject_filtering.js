
// Test script to verify filtering works
// Add this to your browser console when testing the Enhanced Practice page

function testSubjectFiltering() {
  console.log('🧪 Testing Subject Filtering...');
  
  // This should only return English questions
  StaticQuestionLoader.getQuestions('9', 'hard', 'English', 5)
    .then(questions => {
      console.log('📊 Results for Grade 9, Hard, English:');
      questions.forEach((q, i) => {
        const status = q.subject === 'English' ? '✅' : '❌';
        console.log(`  ${i+1}. ${status} "${q.content.substring(0, 40)}..." (Subject: ${q.subject})`);
      });
      
      const englishCount = questions.filter(q => q.subject === 'English').length;
      const nonEnglishCount = questions.length - englishCount;
      
      console.log(`\n📈 Summary: ${englishCount} English, ${nonEnglishCount} non-English`);
      
      if (nonEnglishCount === 0) {
        console.log('🎉 SUCCESS: Perfect subject filtering!');
      } else {
        console.log('❌ FAILURE: Subject filtering not working');
      }
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
    });
}

// Run the test
testSubjectFiltering();
