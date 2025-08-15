const fs = require('fs');
const path = require('path');

console.log('🧹 CLEARING ALL CACHES AND FORCING FRESH QUESTIONS...');

// Add cache-busting to question files by updating their timestamps
const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json') && file !== 'version.json');

for (const file of files) {
  const filePath = path.join(questionsDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    // Check if questions is an array
    if (Array.isArray(questions)) {
      // Add a cache-busting timestamp to each question
      const timestamp = Date.now();
      questions.forEach((question, index) => {
        question._cacheBreaker = `${timestamp}_${index}`;
      });
      
      fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
      console.log(`✅ Updated ${file}`);
    } else {
      console.log(`⚠️  Skipping ${file} - not an array`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${file}: ${error.message}`);
  }
}

// Create a version file to force frontend refresh
const versionFile = '/workspaces/AWSQCLI/testace-app/frontend/public/questions/version.json';
fs.writeFileSync(versionFile, JSON.stringify({
  version: Date.now(),
  message: "Questions updated with proper challenging content - NO MORE sin(30°) in Grade 12!",
  timestamp: new Date().toISOString(),
  grade12_hard_math: "Now has calculus, limits, derivatives, integrals",
  grade9_hard_math: "Now has systems of equations, advanced algebra",
  grade1_easy_math: "Now has age-appropriate counting and basic arithmetic"
}, null, 2));

console.log('✅ Created version file to force refresh');
console.log('\n🎯 CACHE CLEARING COMPLETE!');
console.log('📝 Next steps:');
console.log('1. Restart your development server');
console.log('2. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
console.log('3. Clear browser localStorage if needed');
console.log('4. You should now see:');
console.log('   - Grade 12 hard math: Advanced calculus questions');
console.log('   - Grade 9 hard math: Complex algebra and systems');
console.log('   - Grade 1 easy math: Simple counting with emojis');
console.log('   - NO MORE "What is sin(30°)?" anywhere!');
