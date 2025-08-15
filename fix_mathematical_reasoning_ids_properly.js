const fs = require('fs');

console.log('🔧 FIXING MATHEMATICAL REASONING IDs TO MATCH EXISTING QUESTION PATTERNS...');

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const difficulties = ['easy', 'medium', 'hard'];

// Map difficulty names to their short forms
const difficultyMap = {
  'easy': 'easy',
  'medium': 'med', 
  'hard': 'hard'
};

let filesFixed = 0;

for (const grade of grades) {
  for (const difficulty of difficulties) {
    const filename = `${grade}_${difficulty}_mathematical-reasoning.json`;
    const mathFilename = `${grade}_${difficulty}_math.json`;
    
    const locations = [
      `/workspaces/AWSQCLI/testace-app/public/questions/${filename}`,
      `/workspaces/AWSQCLI/testace-app/frontend/public/questions/${filename}`
    ];
    
    const mathLocations = [
      `/workspaces/AWSQCLI/testace-app/public/questions/${mathFilename}`,
      `/workspaces/AWSQCLI/testace-app/frontend/public/questions/${mathFilename}`
    ];
    
    // Get timestamp from corresponding math file
    let mathTimestamp = Date.now();
    for (const mathLocation of mathLocations) {
      if (fs.existsSync(mathLocation)) {
        try {
          const mathContent = fs.readFileSync(mathLocation, 'utf8');
          const mathQuestions = JSON.parse(mathContent);
          if (mathQuestions.length > 0 && mathQuestions[0]._id) {
            // Extract timestamp from math question ID
            const mathId = mathQuestions[0]._id;
            const timestampMatch = mathId.match(/_(\d+)_/);
            if (timestampMatch) {
              mathTimestamp = timestampMatch[1];
              break;
            }
          }
        } catch (error) {
          console.log(`Could not read math file ${mathLocation}`);
        }
      }
    }
    
    for (const location of locations) {
      if (fs.existsSync(location)) {
        const content = fs.readFileSync(location, 'utf8');
        const questions = JSON.parse(content);
        
        // Fix the IDs to match the expected format
        const shortDifficulty = difficultyMap[difficulty];
        questions.forEach((question, index) => {
          // Format: {shortDifficulty}{grade}_{timestamp}_{number}
          // Example: med9_1755260776579_012
          question._id = `${shortDifficulty}${grade}_${mathTimestamp}_${String(index + 1).padStart(3, '0')}`;
        });
        
        fs.writeFileSync(location, JSON.stringify(questions, null, 2));
        filesFixed++;
        
        console.log(`✅ Fixed ${filename} - using timestamp ${mathTimestamp}`);
      }
    }
  }
}

console.log(`\n🎯 MATHEMATICAL REASONING IDs PROPERLY FIXED!`);
console.log(`✅ Fixed ${filesFixed} files with correct ID format and timestamps`);
console.log(`✅ IDs now match existing question patterns`);
console.log(`✅ Example formats:`);
console.log(`   - Easy: easy9_${Date.now()}_001`);
console.log(`   - Medium: med9_${Date.now()}_012`);
console.log(`   - Hard: hard9_${Date.now()}_020`);
console.log(`\n📝 Mathematical Reasoning questions should now load with correct IDs!`);
