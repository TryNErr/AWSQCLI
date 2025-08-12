#!/usr/bin/env node

/**
 * Fix PracticeSession Back Navigation
 */

const fs = require('fs');

function fixPracticeSessionNavigation() {
  console.log('🔙 FIXING PRACTICE SESSION BACK NAVIGATION');
  console.log('==========================================\n');
  
  try {
    let content = fs.readFileSync('./testace-app/frontend/src/pages/Practice/PracticeSession.tsx', 'utf8');
    
    // Add smart navigation function
    const smartNavigationFunction = `
  // Smart navigation back to the correct practice screen
  const handleBackToPractice = () => {
    // Get URL parameters to determine where user came from
    const urlParams = new URLSearchParams(window.location.search);
    const hasFilters = urlParams.has('grade') || urlParams.has('difficulty') || urlParams.has('subject');
    
    if (hasFilters) {
      console.log('🔙 Navigating back to Enhanced Practice with filters');
      navigate('/practice/enhanced');
    } else {
      console.log('🔙 Navigating back to main Practice page');
      navigate('/practice');
    }
  };`;
    
    // Insert after the component definition
    const insertAfter = 'const PracticeSession: React.FC = () => {';
    if (content.includes(insertAfter)) {
      content = content.replace(insertAfter, insertAfter + smartNavigationFunction);
      console.log('✅ Added smart navigation function to PracticeSession');
    }
    
    // Replace the hardcoded navigation
    content = content.replace(
      "onClick={() => navigate('/practice')}",
      'onClick={handleBackToPractice}'
    );
    
    console.log('✅ Replaced hardcoded navigation in PracticeSession');
    
    fs.writeFileSync('./testace-app/frontend/src/pages/Practice/PracticeSession.tsx', content);
    
    console.log('\\n🎯 PracticeSession Navigation Fixed!');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  fixPracticeSessionNavigation();
}
