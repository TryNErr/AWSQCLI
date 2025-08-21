const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Get all question files
const files = fs.readdirSync(questionsDir)
  .filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'version.json')
  .sort();

console.log(`📁 Found ${files.length} question files`);

// Create new manifest
const manifest = {
  generated: new Date().toISOString(),
  totalCombinations: files.length,
  totalQuestions: 0,
  type: "comprehensive-database",
  combinations: {}
};

// Process each file
files.forEach(filename => {
  try {
    const filePath = path.join(questionsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    const key = filename.replace('.json', '');
    manifest.combinations[key] = {
      filename: filename,
      count: questions.length,
      generated: new Date().toISOString(),
      type: "authentic"
    };
    
    manifest.totalQuestions += questions.length;
    console.log(`✅ ${filename}: ${questions.length} questions`);
    
  } catch (error) {
    console.log(`❌ Error processing ${filename}: ${error.message}`);
  }
});

// Write updated manifest
const manifestPath = path.join(questionsDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n📋 Updated manifest.json:`);
console.log(`   Total files: ${manifest.totalCombinations}`);
console.log(`   Total questions: ${manifest.totalQuestions}`);
console.log(`   Generated: ${manifest.generated}`);

// Check specific Grade 5 entries
console.log(`\n🔍 Grade 5 entries in manifest:`);
Object.keys(manifest.combinations)
  .filter(key => key.startsWith('5_'))
  .forEach(key => {
    const entry = manifest.combinations[key];
    console.log(`   ${key}: ${entry.count} questions`);
  });
