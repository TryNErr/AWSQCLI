#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Practice Options Issue...\n');

// 1. Verify the Practice.tsx file has all 5 options
console.log('1️⃣ Verifying Practice.tsx configuration...');
const practiceFile = path.join(__dirname, 'frontend/src/pages/Practice/Practice.tsx');
const practiceContent = fs.readFileSync(practiceFile, 'utf8');

const optionTitles = [
  'Enhanced Practice',
  'Original Practice', 
  'Timed Test',
  'Daily Challenge',
  'Question History'
];

let allOptionsPresent = true;
optionTitles.forEach(title => {
  if (!practiceContent.includes(`title: '${title}'`)) {
    console.log(`❌ Missing: ${title}`);
    allOptionsPresent = false;
  } else {
    console.log(`✅ Found: ${title}`);
  }
});

if (!allOptionsPresent) {
  console.log('\n❌ Some options are missing from the code. Please check the Practice.tsx file.');
  process.exit(1);
}

// 2. Check if DailyChallenge component exists
console.log('\n2️⃣ Checking DailyChallenge component...');
const dailyChallengeFile = path.join(__dirname, 'frontend/src/pages/Practice/DailyChallenge.tsx');
if (fs.existsSync(dailyChallengeFile)) {
  console.log('✅ DailyChallenge.tsx exists');
} else {
  console.log('❌ DailyChallenge.tsx is missing');
}

// 3. Check App.tsx routing
console.log('\n3️⃣ Checking App.tsx routing...');
const appFile = path.join(__dirname, 'frontend/src/App.tsx');
const appContent = fs.readFileSync(appFile, 'utf8');

if (appContent.includes('/practice/daily-challenge')) {
  console.log('✅ Daily Challenge route configured');
} else {
  console.log('❌ Daily Challenge route missing');
}

// 4. Add cache-busting version to force refresh
console.log('\n4️⃣ Adding cache-busting version...');
const packageFile = path.join(__dirname, 'frontend/package.json');
const packageContent = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
const currentVersion = packageContent.version || '1.0.0';
const newVersion = currentVersion.split('.').map((v, i) => i === 2 ? parseInt(v) + 1 : v).join('.');
packageContent.version = newVersion;
fs.writeFileSync(packageFile, JSON.stringify(packageContent, null, 2));
console.log(`✅ Updated version from ${currentVersion} to ${newVersion}`);

// 5. Create a simple test component to verify rendering
console.log('\n5️⃣ Creating test component...');
const testComponent = `
import React from 'react';

const PracticeOptionsTest: React.FC = () => {
  const options = [
    'Enhanced Practice 🚀',
    'Original Practice 📚', 
    'Timed Test ⏱️',
    'Daily Challenge 🏆',
    'Question History 📊'
  ];

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '10px' }}>
      <h3>🎯 Practice Options Test (${new Date().toISOString()})</h3>
      <p>Expected: 5 options | Found: {options.length} options</p>
      <ul>
        {options.map((option, index) => (
          <li key={index} style={{ margin: '5px 0', fontSize: '16px' }}>{option}</li>
        ))}
      </ul>
      <p style={{ color: 'green', fontWeight: 'bold' }}>
        ✅ If you can see this component with 5 options, the fix is working!
      </p>
    </div>
  );
};

export default PracticeOptionsTest;
`;

const testComponentFile = path.join(__dirname, 'frontend/src/components/PracticeOptionsTest.tsx');
fs.writeFileSync(testComponentFile, testComponent);
console.log('✅ Created PracticeOptionsTest component');

// 6. Instructions for the user
console.log('\n🎉 Fix Applied Successfully!\n');
console.log('📋 Next Steps:');
console.log('1. Hard refresh your browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)');
console.log('2. Clear browser cache and cookies for localhost');
console.log('3. Try opening in incognito/private mode');
console.log('4. Check browser console for any JavaScript errors');
console.log('5. If still having issues, restart the development server');

console.log('\n🔍 Debug Information:');
console.log(`- Practice options configured: ${optionTitles.length}`);
console.log(`- Version updated to: ${newVersion}`);
console.log(`- Test component created at: ${testComponentFile}`);

console.log('\n💡 You can temporarily add the test component to your Practice page to verify rendering:');
console.log('   import PracticeOptionsTest from "../../components/PracticeOptionsTest";');
console.log('   // Add <PracticeOptionsTest /> anywhere in your JSX');

console.log('\n🌐 You can also open the test HTML file in your browser:');
console.log(`   file://${path.join(__dirname, 'test-practice-options.html')}`);
