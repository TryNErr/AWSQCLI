#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Practice Options Configuration...\n');

// Read the Practice.tsx file
const practiceFilePath = path.join(__dirname, 'frontend/src/pages/Practice/Practice.tsx');

try {
  const practiceContent = fs.readFileSync(practiceFilePath, 'utf8');
  
  // Extract the practiceOptions array
  const optionsMatch = practiceContent.match(/const practiceOptions = \[([\s\S]*?)\];/);
  
  if (!optionsMatch) {
    console.error('❌ Could not find practiceOptions array in Practice.tsx');
    process.exit(1);
  }
  
  const optionsContent = optionsMatch[1];
  
  // Count the number of options by counting title occurrences
  const titleMatches = optionsContent.match(/title: '[^']+'/g) || [];
  const optionCount = titleMatches.length;
  
  console.log(`📊 Found ${optionCount} practice options:`);
  
  titleMatches.forEach((title, index) => {
    const cleanTitle = title.replace(/title: '([^']+)'/, '$1');
    console.log(`  ${index + 1}. ${cleanTitle}`);
  });
  
  // Check for specific options
  const expectedOptions = [
    'Enhanced Practice',
    'Original Practice', 
    'Timed Test',
    'Daily Challenge',
    'Question History'
  ];
  
  console.log('\n🎯 Checking for expected options:');
  
  expectedOptions.forEach(expectedOption => {
    const found = optionsContent.includes(`title: '${expectedOption}'`);
    console.log(`  ${found ? '✅' : '❌'} ${expectedOption}`);
  });
  
  // Check grid layout
  const gridMatch = practiceContent.match(/<Grid item xs=\{12\} sm=\{6\} md=\{4\} lg=\{2\.4\}/);
  console.log(`\n📐 Grid Layout: ${gridMatch ? '✅ Configured for 5 items (lg={2.4})' : '❌ Not optimized for 5 items'}`);
  
  // Check imports
  const timerImport = practiceContent.includes('Timer,');
  console.log(`🔧 Timer Icon Import: ${timerImport ? '✅' : '❌'}`);
  
  if (optionCount === 5 && expectedOptions.every(opt => optionsContent.includes(`title: '${opt}'`))) {
    console.log('\n🎉 SUCCESS: All 5 practice options are correctly configured!');
    
    console.log('\n💡 If you still see only 3 options in the browser:');
    console.log('   1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('   2. Check browser developer console for errors');
    console.log('   3. Ensure the development server restarted after changes');
    console.log('   4. Try opening in an incognito/private window');
    
  } else {
    console.log('\n❌ ISSUE: Configuration is incomplete');
  }
  
} catch (error) {
  console.error('❌ Error reading Practice.tsx:', error.message);
  process.exit(1);
}
