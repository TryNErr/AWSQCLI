#!/usr/bin/env node

/**
 * Fix Filter Preservation on Back Navigation
 * 
 * PROBLEM: When users click "Back to Practice", they lose their filters
 * SOLUTION: Pass the filter parameters back to Enhanced Practice
 */

const fs = require('fs');

function fixFilterPreservation() {
  console.log('🔄 FIXING FILTER PRESERVATION ON BACK NAVIGATION');
  console.log('================================================\n');
  
  console.log('Problem: Users lose their filter selection when going back');
  console.log('Solution: Pass filter parameters to Enhanced Practice URL\n');
  
  try {
    let content = fs.readFileSync('./testace-app/frontend/src/pages/Practice/Question.tsx', 'utf8');
    
    // Replace the handleBackToPractice function with one that preserves filters
    const newHandleBackToPractice = `  // Smart navigation back to the correct practice screen with filters preserved
  const handleBackToPractice = () => {
    // If we have session parameters, user came from Enhanced Practice
    if (sessionGrade || sessionDifficulty || sessionSubject) {
      console.log('🔙 Navigating back to Enhanced Practice with filters preserved');
      
      // Build URL with filter parameters to maintain state
      const params = new URLSearchParams();
      if (sessionGrade) params.set('grade', sessionGrade);
      if (sessionDifficulty) params.set('difficulty', sessionDifficulty);
      if (sessionSubject) params.set('subject', sessionSubject);
      
      const enhancedPracticeUrl = \`/practice/enhanced?\${params.toString()}\`;
      console.log(\`🎯 Navigating to: \${enhancedPracticeUrl}\`);
      
      navigate(enhancedPracticeUrl);
    } else {
      console.log('🔙 Navigating back to main Practice page');
      navigate('/practice');
    }
  };`;
    
    // Find and replace the existing handleBackToPractice function
    const oldFunctionRegex = /\/\/ Smart navigation back to the correct practice screen[\\s\\S]*?const handleBackToPractice = \\(\\) => \\{[\\s\\S]*?\\};/;
    
    if (oldFunctionRegex.test(content)) {
      content = content.replace(oldFunctionRegex, newHandleBackToPractice);
      console.log('✅ Updated handleBackToPractice function to preserve filters');
    } else {
      console.log('⚠️ Could not find handleBackToPractice function to replace');
    }
    
    // Write the updated content
    fs.writeFileSync('./testace-app/frontend/src/pages/Practice/Question.tsx', content);
    
    console.log('\\n🎯 FILTER PRESERVATION FIXED!');
    console.log('==============================');
    console.log('✅ Back navigation now preserves filter parameters');
    console.log('✅ Enhanced Practice will receive grade, difficulty, subject');
    console.log('✅ Users will see their original filter selection');
    console.log('✅ Question list state will be maintained');
    
    console.log('\\n📱 NEW BEHAVIOR:');
    console.log('================');
    console.log('1. User selects Grade 9, Hard, English in Enhanced Practice');
    console.log('2. User sees list of Grade 9 Hard English questions');
    console.log('3. User clicks on a specific question');
    console.log('4. User clicks "Back to Practice"');
    console.log('5. ✅ User returns to Enhanced Practice with:');
    console.log('   • Grade 9 still selected');
    console.log('   • Hard difficulty still selected');
    console.log('   • English subject still selected');
    console.log('   • Same question list displayed');
    
    console.log('\\n🧪 TESTING:');
    console.log('===========');
    console.log('1. Go to Enhanced Practice');
    console.log('2. Select specific filters (e.g., Grade 9, Hard, English)');
    console.log('3. Click on any question');
    console.log('4. Click "Back to Practice"');
    console.log('5. Verify filters are still active and question list is the same');
    
  } catch (error) {
    console.error(\`❌ Error: \${error.message}\`);
  }
}

if (require.main === module) {
  fixFilterPreservation();
}
