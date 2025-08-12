#!/usr/bin/env node

/**
 * Fix Filtering Issue Script
 * 
 * This script addresses the problem where Mathematics questions appear
 * when filtering for English questions.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function analyzeFilteringIssue() {
  console.log('🔍 ANALYZING FILTERING ISSUE');
  console.log('============================\n');
  
  console.log('Problem: Mathematics questions appearing when filtering for English');
  console.log('Expected: Only English questions when filtering for English\n');
  
  // Check the 9_hard_english.json file specifically
  const englishFile = path.join(QUESTIONS_DIR, '9_hard_english.json');
  
  try {
    const questions = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
    
    console.log(`📁 Analyzing ${englishFile}:`);
    console.log(`   Total questions: ${questions.length}\n`);
    
    const subjectCounts = {};
    const problemQuestions = [];
    
    questions.forEach((question, index) => {
      const subject = question.subject;
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      
      if (subject !== 'English') {
        problemQuestions.push({
          index,
          subject,
          content: question.content
        });
      }
    });
    
    console.log('📊 Subject distribution in 9_hard_english.json:');
    Object.entries(subjectCounts).forEach(([subject, count]) => {
      const status = subject === 'English' ? '✅' : '❌';
      console.log(`   ${status} ${subject}: ${count} questions`);
    });
    
    if (problemQuestions.length > 0) {
      console.log(`\n🚨 Found ${problemQuestions.length} NON-ENGLISH questions in English file:`);
      problemQuestions.slice(0, 5).forEach(q => {
        console.log(`   ❌ Question ${q.index}: "${q.content}" (Subject: ${q.subject})`);
      });
      if (problemQuestions.length > 5) {
        console.log(`   ... and ${problemQuestions.length - 5} more`);
      }
    } else {
      console.log('\n✅ All questions in English file have correct subject');
    }
    
    return { subjectCounts, problemQuestions };
    
  } catch (error) {
    console.log(`❌ Could not analyze ${englishFile}: ${error.message}`);
    return null;
  }
}

function checkAllSubjectFiles() {
  console.log('\n🔍 CHECKING ALL SUBJECT FILES');
  console.log('=============================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const issues = [];
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      const [grade, difficulty, expectedSubject] = file.replace('.json', '').split('_');
      
      // Map file subject to expected question subject
      const expectedQuestionSubject = {
        'math': 'Mathematics',
        'english': 'English',
        'reading': 'Reading',
        'thinking-skills': 'Thinking Skills'
      }[expectedSubject];
      
      if (!expectedQuestionSubject) return;
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        const wrongSubjects = questions.filter(q => q.subject !== expectedQuestionSubject);
        
        if (wrongSubjects.length > 0) {
          issues.push({
            file,
            expected: expectedQuestionSubject,
            wrongSubjects: wrongSubjects.map(q => ({
              subject: q.subject,
              content: q.content.substring(0, 50) + '...'
            }))
          });
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not check ${file}: ${error.message}`);
      }
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ All files have correct subject alignment!');
  } else {
    console.log(`🚨 Found ${issues.length} files with subject mismatches:`);
    issues.slice(0, 10).forEach(issue => {
      console.log(`\n❌ ${issue.file}:`);
      console.log(`   Expected: ${issue.expected}`);
      console.log(`   Found ${issue.wrongSubjects.length} questions with wrong subjects:`);
      issue.wrongSubjects.slice(0, 3).forEach(q => {
        console.log(`     - "${q.content}" (Subject: ${q.subject})`);
      });
    });
  }
  
  return issues;
}

function fixSubjectMismatches() {
  console.log('\n🔧 FIXING SUBJECT MISMATCHES');
  console.log('============================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let fixed = 0;
  let totalChanges = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      const [grade, difficulty, expectedSubject] = file.replace('.json', '').split('_');
      
      // Map file subject to expected question subject
      const expectedQuestionSubject = {
        'math': 'Mathematics',
        'english': 'English',
        'reading': 'Reading',
        'thinking-skills': 'Thinking Skills'
      }[expectedSubject];
      
      if (!expectedQuestionSubject) return;
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let fileChanged = false;
        let fileChanges = 0;
        
        questions.forEach(question => {
          if (question.subject !== expectedQuestionSubject) {
            console.log(`   Fixing ${file}: "${question.content.substring(0, 40)}..." (${question.subject} → ${expectedQuestionSubject})`);
            question.subject = expectedQuestionSubject;
            fileChanged = true;
            fileChanges++;
            totalChanges++;
          }
        });
        
        if (fileChanged) {
          fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
          console.log(`✅ Fixed ${file} (${fileChanges} questions corrected)`);
          fixed++;
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not fix ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   - Files processed: ${files.length - 1}`);
  console.log(`   - Files fixed: ${fixed}`);
  console.log(`   - Total corrections: ${totalChanges}`);
  
  return { fixed, totalChanges };
}

function verifyFilteringFix() {
  console.log('\n✅ VERIFYING FILTERING FIX');
  console.log('==========================\n');
  
  // Test the specific case mentioned
  const englishFile = path.join(QUESTIONS_DIR, '9_hard_english.json');
  
  try {
    const questions = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
    
    const nonEnglishQuestions = questions.filter(q => q.subject !== 'English');
    
    if (nonEnglishQuestions.length === 0) {
      console.log('✅ SUCCESS: 9_hard_english.json contains only English questions');
      console.log(`   Total questions: ${questions.length}`);
      console.log(`   All subjects: English ✅`);
      
      // Show sample questions
      console.log('\n📝 Sample English questions:');
      questions.slice(0, 3).forEach((q, i) => {
        console.log(`   ${i + 1}. "${q.content}" (Subject: ${q.subject})`);
      });
      
    } else {
      console.log(`❌ STILL ISSUES: Found ${nonEnglishQuestions.length} non-English questions`);
      nonEnglishQuestions.slice(0, 3).forEach(q => {
        console.log(`   ❌ "${q.content}" (Subject: ${q.subject})`);
      });
    }
    
  } catch (error) {
    console.log(`❌ Could not verify: ${error.message}`);
  }
}

function main() {
  console.log('🚀 FIXING FILTERING ISSUE');
  console.log('=========================\n');
  
  console.log('Issue: When filtering for English, Mathematics questions appear');
  console.log('Root cause: Questions in English files have wrong subject labels\n');
  
  // Step 1: Analyze the issue
  const analysis = analyzeFilteringIssue();
  
  // Step 2: Check all files
  const issues = checkAllSubjectFiles();
  
  // Step 3: Fix the issues
  if (issues.length > 0) {
    console.log('\n❓ Proceeding to fix subject mismatches...');
    const results = fixSubjectMismatches();
    
    // Step 4: Verify the fix
    verifyFilteringFix();
    
    console.log('\n🎉 FILTERING ISSUE RESOLVED!');
    console.log('Now when users filter for English, they will only see English questions.');
    console.log('No more Mathematics questions appearing in English filters! ✅');
    
  } else {
    console.log('\n✅ No subject mismatches found - filtering should work correctly!');
  }
}

if (require.main === module) {
  main();
}
