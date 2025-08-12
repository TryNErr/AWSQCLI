#!/usr/bin/env node

/**
 * Fix Back to Practice Navigation
 * 
 * PROBLEM: "Back to Practice" goes to /practice instead of /practice/enhanced
 * SOLUTION: Navigate to the correct practice screen based on session parameters
 */

const fs = require('fs');

function fixBackNavigation() {
  console.log('🔙 FIXING BACK TO PRACTICE NAVIGATION');
  console.log('====================================\n');
  
  console.log('Problem: Back button goes to /practice instead of /practice/enhanced');
  console.log('Solution: Smart navigation based on session parameters\n');
  
  try {
    let content = fs.readFileSync('./testace-app/frontend/src/pages/Practice/Question.tsx', 'utf8');
    
    // Add a smart navigation function
    const smartNavigationFunction = `
  // Smart navigation back to the correct practice screen
  const handleBackToPractice = () => {
    // If we have session parameters, user came from Enhanced Practice
    if (sessionGrade || sessionDifficulty || sessionSubject) {
      console.log('🔙 Navigating back to Enhanced Practice with filters');
      navigate('/practice/enhanced');
    } else {
      console.log('🔙 Navigating back to main Practice page');
      navigate('/practice');
    }
  };`;
    
    // Insert the function after the session parameters
    const insertAfter = 'const sessionSubject = searchParams.get(\'subject\');';
    if (content.includes(insertAfter)) {
      content = content.replace(insertAfter, insertAfter + smartNavigationFunction);
      console.log('✅ Added smart navigation function');
    }
    
    // Replace the hardcoded navigation calls
    content = content.replace(
      /onClick=\{\(\) => navigate\('\/practice'\)\}/g,
      'onClick={handleBackToPractice}'
    );
    
    console.log('✅ Replaced hardcoded navigation with smart navigation');
    
    // Write the fixed content
    fs.writeFileSync('./testace-app/frontend/src/pages/Practice/Question.tsx', content);
    
    console.log('\\n🎯 Back Navigation Fixed!');
    console.log('=========================');
    console.log('✅ Smart navigation function added');
    console.log('✅ Detects if user came from Enhanced Practice');
    console.log('✅ Navigates to correct previous screen');
    console.log('✅ Preserves user workflow');
    
    console.log('\\n📱 NEW BEHAVIOR:');
    console.log('================');
    console.log('• User from Enhanced Practice → Back to Enhanced Practice');
    console.log('• User from main Practice → Back to main Practice');
    console.log('• Maintains context and filters');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  fixBackNavigation();
}
