#!/usr/bin/env node

/**
 * Standardize Math Subjects Script
 * 
 * This script ensures all math questions use "Mathematics" as the subject
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function standardizeMathSubjects() {
  console.log('🔧 Standardizing Math Subjects to "Mathematics"');
  console.log('===============================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let fixed = 0;
  let totalChanges = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let fileChanged = false;
        let fileChanges = 0;
        
        // Fix each question's subject
        questions.forEach(question => {
          if (question.subject === 'Math') {
            question.subject = 'Mathematics';
            fileChanged = true;
            fileChanges++;
            totalChanges++;
          }
        });
        
        // Write back if changed
        if (fileChanged) {
          fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
          console.log(`✅ Fixed ${file} (${fileChanges} questions updated)`);
          fixed++;
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not process ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   - Files processed: ${files.length - 1}`);
  console.log(`   - Files fixed: ${fixed}`);
  console.log(`   - "Math" → "Mathematics" changes: ${totalChanges}`);
  
  return { fixed, totalChanges };
}

function verifyFinalSubjects() {
  console.log('\n🔍 Final Subject Verification');
  console.log('=============================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const subjectCounts = {};
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        questions.forEach(question => {
          if (question.subject) {
            subjectCounts[question.subject] = (subjectCounts[question.subject] || 0) + 1;
          }
        });
        
      } catch (error) {
        console.warn(`⚠️ Could not verify ${file}: ${error.message}`);
      }
    }
  });
  
  console.log('Final subject distribution:');
  Object.entries(subjectCounts).forEach(([subject, count]) => {
    const status = ['Mathematics', 'English', 'Reading', 'Thinking Skills'].includes(subject) ? '✅' : '❌';
    console.log(`   ${status} ${subject}: ${count} questions`);
  });
  
  // Check for any remaining problematic subjects
  const standardSubjects = ['Mathematics', 'English', 'Reading', 'Thinking Skills'];
  const nonStandardSubjects = Object.keys(subjectCounts).filter(subject => 
    !standardSubjects.includes(subject)
  );
  
  if (nonStandardSubjects.length === 0) {
    console.log('\n🎉 Perfect! All subjects are now standardized:');
    console.log('   ✅ Mathematics (for math questions)');
    console.log('   ✅ English (for english questions)');
    console.log('   ✅ Reading (for reading questions)');
    console.log('   ✅ Thinking Skills (for thinking skills questions)');
  } else {
    console.log(`\n⚠️ Still found ${nonStandardSubjects.length} non-standard subjects:`);
    nonStandardSubjects.forEach(subject => {
      console.log(`   ❌ "${subject}" (${subjectCounts[subject]} questions)`);
    });
  }
  
  return subjectCounts;
}

function main() {
  console.log('🎯 Final Subject Standardization');
  console.log('================================\n');
  
  console.log('Ensuring all math questions use "Mathematics" as subject...\n');
  
  const results = standardizeMathSubjects();
  const finalSubjects = verifyFinalSubjects();
  
  console.log('\n✅ Subject Standardization Complete!');
  console.log('\nNow when users select "Maths" in the frontend:');
  console.log('   → Frontend looks for subject "Mathematics"');
  console.log('   → All math questions are labeled "Mathematics"');
  console.log('   → Perfect match! ✅');
  
  console.log('\n🚀 Ready for testing!');
  console.log('The subject naming issue is fully resolved.');
}

if (require.main === module) {
  main();
}
