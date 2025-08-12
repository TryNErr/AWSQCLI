#!/usr/bin/env node

/**
 * Fix Subject Naming Script
 * 
 * This script fixes the subject naming inconsistency where math questions
 * are labeled as "Mathematical Reasoning" instead of "Mathematics"
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

// Subject mapping - what the files currently have vs what they should have
const SUBJECT_MAPPING = {
  'Mathematical Reasoning': 'Mathematics',
  'English Language Arts': 'English',
  'Thinking Skills': 'Thinking Skills',
  'Reading Comprehension': 'Reading'
};

function fixSubjectNaming() {
  console.log('🔧 Fixing Subject Naming Issues');
  console.log('================================\n');
  
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
          if (question.subject && SUBJECT_MAPPING[question.subject]) {
            const oldSubject = question.subject;
            question.subject = SUBJECT_MAPPING[question.subject];
            
            if (oldSubject !== question.subject) {
              fileChanged = true;
              fileChanges++;
              totalChanges++;
            }
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
  console.log(`   - Files processed: ${files.length - 1} (excluding manifest.json)`);
  console.log(`   - Files fixed: ${fixed}`);
  console.log(`   - Total subject changes: ${totalChanges}`);
  
  return { fixed, totalChanges };
}

function verifySubjectNames() {
  console.log('\n🔍 Verifying Subject Names');
  console.log('==========================\n');
  
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
  
  console.log('Subject distribution:');
  Object.entries(subjectCounts).forEach(([subject, count]) => {
    console.log(`   - ${subject}: ${count} questions`);
  });
  
  // Check for any remaining problematic subjects
  const problematicSubjects = Object.keys(subjectCounts).filter(subject => 
    !['Mathematics', 'English', 'Reading', 'Thinking Skills'].includes(subject)
  );
  
  if (problematicSubjects.length > 0) {
    console.log(`\n⚠️ Found ${problematicSubjects.length} non-standard subjects:`);
    problematicSubjects.forEach(subject => {
      console.log(`   - "${subject}" (${subjectCounts[subject]} questions)`);
    });
  } else {
    console.log('\n✅ All subjects are now properly named!');
  }
  
  return subjectCounts;
}

function showBeforeAfter() {
  console.log('\n📋 Before/After Comparison');
  console.log('==========================\n');
  
  console.log('❌ BEFORE (Problematic):');
  console.log('   - "Mathematical Reasoning" (should be "Mathematics")');
  console.log('   - "English Language Arts" (should be "English")');
  console.log('   - "Reading Comprehension" (should be "Reading")');
  
  console.log('\n✅ AFTER (Fixed):');
  console.log('   - "Mathematics" ✅');
  console.log('   - "English" ✅');
  console.log('   - "Reading" ✅');
  console.log('   - "Thinking Skills" ✅');
  
  console.log('\n🎯 Frontend Expectations:');
  console.log('   - When user selects "Maths", frontend looks for "Mathematics"');
  console.log('   - When user selects "English", frontend looks for "English"');
  console.log('   - When user selects "Reading", frontend looks for "Reading"');
  console.log('   - When user selects "Thinking Skills", frontend looks for "Thinking Skills"');
}

function main() {
  console.log('🚀 Starting Subject Naming Fix');
  console.log('==============================\n');
  
  console.log('Issue: Math questions are labeled as "Mathematical Reasoning"');
  console.log('but the frontend expects "Mathematics" when user selects "Maths".\n');
  
  showBeforeAfter();
  
  const results = fixSubjectNaming();
  const subjectCounts = verifySubjectNames();
  
  console.log('\n✅ Subject Naming Fix Complete!');
  console.log('\nNow when users select "Maths" in the frontend,');
  console.log('they will see questions labeled as "Mathematics" ✅');
  
  if (results.totalChanges > 0) {
    console.log('\n🎉 Ready for testing! The subject naming issue is resolved.');
  } else {
    console.log('\n📝 No changes were needed - subjects were already correctly named.');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  fixSubjectNaming,
  verifySubjectNames,
  SUBJECT_MAPPING
};
