const fs = require('fs');

console.log('🔧 FIXING MATHEMATICAL REASONING QUESTION IDs TO MATCH EXPECTED FORMAT...');

// The app expects IDs in format: {difficulty}{grade}_{timestamp}_{number}
// But I created them as: mathreason_{grade}_{difficulty}_{timestamp}_{number}

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const difficulties = ['easy', 'medium', 'hard'];

let filesFixed = 0;

for (const grade of grades) {
  for (const difficulty of difficulties) {
    const filename = `${grade}_${difficulty}_mathematical-reasoning.json`;
    const locations = [
      `/workspaces/AWSQCLI/testace-app/public/questions/${filename}`,
      `/workspaces/AWSQCLI/testace-app/frontend/public/questions/${filename}`
    ];
    
    for (const location of locations) {
      if (fs.existsSync(location)) {
        const content = fs.readFileSync(location, 'utf8');
        const questions = JSON.parse(content);
        
        // Fix the IDs to match the expected format
        const timestamp = Date.now();
        questions.forEach((question, index) => {
          // Change from: mathreason_11_easy_1755262499669_001
          // To: easy11_1755262499669_001
          question._id = `${difficulty}${grade}_${timestamp}_${String(index + 1).padStart(3, '0')}`;
        });
        
        fs.writeFileSync(location, JSON.stringify(questions, null, 2));
        filesFixed++;
      }
    }
  }
}

console.log(`\n🎯 MATHEMATICAL REASONING IDs FIXED!`);
console.log(`✅ Fixed ${filesFixed} files with correct ID format`);
console.log(`✅ IDs now match expected format: {difficulty}{grade}_{timestamp}_{number}`);
console.log(`✅ Example: easy11_${Date.now()}_001`);
console.log(`\n📝 Mathematical Reasoning questions should now load properly!`);
