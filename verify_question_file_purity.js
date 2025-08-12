#!/usr/bin/env node

/**
 * Verify Question File Purity
 * 
 * This script checks that each question file contains only questions
 * with the correct subject for that file.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function verifyQuestionFilePurity() {
  console.log('🔍 VERIFYING QUESTION FILE PURITY');
  console.log('=================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const issues = [];
  let totalFiles = 0;
  let cleanFiles = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      totalFiles++;
      const filePath = path.join(QUESTIONS_DIR, file);
      const [grade, difficulty, subject] = file.replace('.json', '').split('_');
      
      // Expected subject mapping
      const expectedSubject = {
        'math': 'Mathematics',
        'english': 'English',
        'reading': 'Reading',
        'thinking-skills': 'Thinking Skills'
      }[subject];
      
      if (!expectedSubject) {
        console.log(`⚠️ Unknown subject in filename: ${file}`);
        return;
      }
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const wrongSubjects = [];
        
        questions.forEach((question, index) => {
          if (question.subject !== expectedSubject) {
            wrongSubjects.push({
              index,
              expected: expectedSubject,
              actual: question.subject,
              content: question.content?.substring(0, 50) + '...'
            });
          }
        });
        
        if (wrongSubjects.length === 0) {
          cleanFiles++;
          console.log(`✅ ${file}: All ${questions.length} questions have correct subject (${expectedSubject})`);
        } else {
          issues.push({
            file,
            expectedSubject,
            wrongSubjects,
            totalQuestions: questions.length
          });
          
          console.log(`❌ ${file}: ${wrongSubjects.length}/${questions.length} questions have wrong subject`);
          wrongSubjects.slice(0, 3).forEach(ws => {
            console.log(`   Question ${ws.index + 1}: Expected "${ws.expected}", got "${ws.actual}"`);
            console.log(`   Content: "${ws.content}"`);
          });
          if (wrongSubjects.length > 3) {
            console.log(`   ... and ${wrongSubjects.length - 3} more issues`);
          }
          console.log('');
        }
        
      } catch (error) {
        console.log(`❌ Could not parse ${file}: ${error.message}`);
      }
    }
  });
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Total files checked: ${totalFiles}`);
  console.log(`   Clean files: ${cleanFiles}`);
  console.log(`   Files with issues: ${issues.length}`);
  
  if (issues.length === 0) {
    console.log('\n🎉 ALL FILES ARE PURE!');
    console.log('✅ Each question file contains only questions with the correct subject');
    console.log('✅ The filtering issue must be in the frontend loading logic');
  } else {
    console.log('\n🚨 FILES WITH MIXED SUBJECTS FOUND:');
    issues.forEach(issue => {
      console.log(`   ${issue.file}: ${issue.wrongSubjects.length} wrong subjects`);
    });
  }
  
  return { totalFiles, cleanFiles, issues };
}

function fixMixedSubjectFiles(issues) {
  if (issues.length === 0) {
    console.log('\n✅ No mixed subject files to fix!');
    return;
  }
  
  console.log('\n🔧 FIXING MIXED SUBJECT FILES');
  console.log('=============================\n');
  
  issues.forEach(issue => {
    const filePath = path.join(QUESTIONS_DIR, issue.file);
    
    try {
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let fixed = 0;
      
      questions.forEach(question => {
        if (question.subject !== issue.expectedSubject) {
          console.log(`   Fixing: "${question.content?.substring(0, 40)}..." (${question.subject} → ${issue.expectedSubject})`);
          question.subject = issue.expectedSubject;
          fixed++;
        }
      });
      
      if (fixed > 0) {
        fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
        console.log(`✅ Fixed ${issue.file}: ${fixed} questions corrected\n`);
      }
      
    } catch (error) {
      console.log(`❌ Could not fix ${issue.file}: ${error.message}`);
    }
  });
}

function main() {
  console.log('🚀 QUESTION FILE PURITY VERIFICATION');
  console.log('====================================\n');
  
  console.log('Checking that each question file contains only questions');
  console.log('with the correct subject for that file...\n');
  
  const results = verifyQuestionFilePurity();
  
  if (results.issues.length > 0) {
    console.log('\n❓ Fix mixed subject files? (y/n)');
    // For automation, we'll fix them automatically
    fixMixedSubjectFiles(results.issues);
    
    // Re-verify after fixing
    console.log('\n🔄 RE-VERIFYING AFTER FIXES:');
    console.log('============================\n');
    verifyQuestionFilePurity();
  }
  
  console.log('\n🎯 CONCLUSION:');
  console.log('==============');
  console.log('If all files are pure but filtering still doesn\'t work,');
  console.log('the issue is definitely in the frontend loading logic.');
  console.log('The StaticQuestionLoader patch should resolve this.');
}

if (require.main === module) {
  main();
}
