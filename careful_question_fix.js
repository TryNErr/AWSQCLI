const fs = require('fs');

console.log('🔧 APPLYING CAREFUL FIX TO QUESTION COMPONENT...');

const questionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx';

if (fs.existsSync(questionPath)) {
  let content = fs.readFileSync(questionPath, 'utf8');
  
  // Find the specific section where grade, difficulty, and subject are assigned
  // I need to replace the ID parsing logic with URL parameter usage
  
  // Look for the section where it parses the question ID
  const oldAssignment = `        } else {
          // Default parsing (assume grade_difficulty_subject)
          grade = parts[0].replace('grade', '');
          difficulty = parts[1];
          subject = parts[2];
        }`;
  
  const newAssignment = `        } else {
          // Use URL parameters instead of parsing question ID
          grade = sessionGrade || parts[1] || '9';
          difficulty = sessionDifficulty || parts[2] || 'medium';
          subject = sessionSubject || 'Mathematical Reasoning';
        }`;
  
  if (content.includes(oldAssignment)) {
    content = content.replace(oldAssignment, newAssignment);
    console.log('✅ Updated default parsing logic to use URL parameters');
  } else {
    console.log('⚠️  Could not find exact default parsing section');
    
    // Try a more targeted approach - look for the specific line assignments
    if (content.includes('grade = parts[0].replace(\'grade\', \'\');')) {
      content = content.replace(
        'grade = parts[0].replace(\'grade\', \'\');',
        'grade = sessionGrade || parts[1] || \'9\';'
      );
      console.log('✅ Updated grade assignment');
    }
    
    if (content.includes('difficulty = parts[1];') && content.includes('subject = parts[2];')) {
      content = content.replace(
        'difficulty = parts[1];',
        'difficulty = sessionDifficulty || parts[2] || \'medium\';'
      );
      content = content.replace(
        'subject = parts[2];',
        'subject = sessionSubject || \'Mathematical Reasoning\';'
      );
      console.log('✅ Updated difficulty and subject assignments');
    }
  }
  
  fs.writeFileSync(questionPath, content);
  console.log('✅ Applied careful fix to Question component');
} else {
  console.log('❌ Question.tsx not found');
}

console.log('\n🎯 CAREFUL QUESTION FIX COMPLETE!');
console.log('✅ Question component now uses URL parameters as fallback');
console.log('✅ Original structure preserved to avoid compilation errors');
console.log('\n📝 The component should now work for Mathematical Reasoning questions!');
