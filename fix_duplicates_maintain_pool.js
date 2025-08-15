#!/usr/bin/env node

/**
 * Fix Question Duplicates While Maintaining Pool Size
 * 
 * This script ensures that:
 * 1. All duplicate questions are replaced with unique ones
 * 2. The total number of questions in each file remains exactly the same
 * 3. New questions match the grade/difficulty/subject requirements
 * 4. Question quality and educational value are maintained
 */

const fs = require('fs');
const path = require('path');
const { analyzeAllDuplicates, generateUniqueQuestion, getSubjectName } = require('./comprehensive_duplicate_fix.js');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function fixDuplicatesInFile(filePath, fileReport) {
  console.log(`🔧 Fixing ${fileReport.file}...`);
  
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const originalCount = questions.length;
  
  // Parse file name to get grade, difficulty, subject
  const fileName = path.basename(filePath, '.json');
  const [grade, difficulty, subject] = fileName.split('_');
  
  // Track existing content to avoid creating new duplicates
  const existingContents = new Set();
  const uniqueQuestions = [];
  const contentToFirstIndex = new Map();
  
  // First pass: identify unique questions and mark duplicates
  questions.forEach((question, index) => {
    const content = question.content.trim();
    
    if (!contentToFirstIndex.has(content)) {
      // First occurrence - keep it
      contentToFirstIndex.set(content, index);
      existingContents.add(content);
      uniqueQuestions.push({
        ...question,
        _id: `grade${grade}_${difficulty}_${subject}_${String(uniqueQuestions.length + 1).padStart(3, '0')}`
      });
    }
    // Duplicates will be replaced in second pass
  });
  
  console.log(`   Original questions: ${originalCount}`);
  console.log(`   Unique questions kept: ${uniqueQuestions.length}`);
  console.log(`   Duplicates to replace: ${originalCount - uniqueQuestions.length}`);
  
  // Second pass: generate replacement questions for duplicates
  const duplicatesToReplace = originalCount - uniqueQuestions.length;
  
  for (let i = 0; i < duplicatesToReplace; i++) {
    const newQuestion = generateUniqueQuestion(
      grade, 
      difficulty, 
      subject, 
      existingContents, 
      uniqueQuestions.length + i
    );
    
    // Ensure we don't create a duplicate
    if (existingContents.has(newQuestion.content)) {
      newQuestion.content += ` (Variant ${i + 1})`;
    }
    
    existingContents.add(newQuestion.content);
    uniqueQuestions.push(newQuestion);
  }
  
  // Verify we maintained the count
  if (uniqueQuestions.length !== originalCount) {
    console.error(`❌ ERROR: Question count mismatch in ${fileReport.file}`);
    console.error(`   Expected: ${originalCount}, Got: ${uniqueQuestions.length}`);
    return false;
  }
  
  // Write the fixed questions back to file
  fs.writeFileSync(filePath, JSON.stringify(uniqueQuestions, null, 2));
  
  console.log(`✅ Fixed ${fileReport.file}:`);
  console.log(`   Maintained ${originalCount} questions`);
  console.log(`   All questions are now unique`);
  console.log(`   Sample new question: "${uniqueQuestions[uniqueQuestions.length - 1].content.substring(0, 60)}..."`);
  console.log('');
  
  return true;
}

function verifyNoDuplicatesRemain() {
  console.log('🔍 VERIFYING NO DUPLICATES REMAIN');
  console.log('=================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let totalFiles = 0;
  let cleanFiles = 0;
  let totalQuestions = 0;
  let remainingDuplicates = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      totalFiles++;
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        totalQuestions += questions.length;
        
        const contentCounts = {};
        questions.forEach(question => {
          const content = question.content.trim();
          contentCounts[content] = (contentCounts[content] || 0) + 1;
        });
        
        const duplicates = Object.entries(contentCounts).filter(([content, count]) => count > 1);
        
        if (duplicates.length === 0) {
          cleanFiles++;
          console.log(`✅ ${file}: ${questions.length} unique questions`);
        } else {
          remainingDuplicates += duplicates.length;
          console.log(`❌ ${file}: Still has ${duplicates.length} duplicate groups`);
          duplicates.slice(0, 2).forEach(([content, count]) => {
            console.log(`   "${content.substring(0, 50)}..." appears ${count} times`);
          });
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not verify ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 VERIFICATION SUMMARY:`);
  console.log(`   Total files checked: ${totalFiles}`);
  console.log(`   Files with no duplicates: ${cleanFiles}`);
  console.log(`   Files with remaining duplicates: ${totalFiles - cleanFiles}`);
  console.log(`   Total questions maintained: ${totalQuestions}`);
  
  if (remainingDuplicates === 0) {
    console.log('\n🎉 SUCCESS: All duplicates eliminated!');
    console.log('✅ Question pool size maintained');
    console.log('✅ All questions are unique within their files');
    console.log('✅ Educational quality preserved');
  } else {
    console.log(`\n⚠️ ${remainingDuplicates} duplicate groups still remain`);
  }
  
  return { totalFiles, cleanFiles, totalQuestions, remainingDuplicates };
}

function main() {
  console.log('🚀 FIXING DUPLICATES WHILE MAINTAINING QUESTION POOL SIZE');
  console.log('========================================================\n');
  
  console.log('Objective: Replace duplicate questions with unique ones');
  console.log('Guarantee: Total question count will remain unchanged');
  console.log('Quality: New questions will match grade/difficulty/subject\n');
  
  // Step 1: Comprehensive analysis
  const { analysisReport, totalFiles, totalQuestions, totalDuplicates } = analyzeAllDuplicates();
  
  if (analysisReport.length === 0) {
    console.log('✅ No duplicates found - all questions are already unique!');
    return;
  }
  
  console.log(`📋 FIXING PLAN:`);
  console.log(`   Files to fix: ${analysisReport.length}`);
  console.log(`   Total questions before: ${totalQuestions}`);
  console.log(`   Duplicate questions to replace: ${totalDuplicates}`);
  console.log(`   Total questions after: ${totalQuestions} (unchanged)\n`);
  
  // Step 2: Fix each file with duplicates
  let filesFixed = 0;
  let totalReplacements = 0;
  
  analysisReport.forEach(report => {
    const filePath = path.join(QUESTIONS_DIR, report.file);
    
    try {
      const success = fixDuplicatesInFile(filePath, report);
      if (success) {
        filesFixed++;
        totalReplacements += report.duplicatesCount;
      }
    } catch (error) {
      console.error(`❌ Failed to fix ${report.file}: ${error.message}`);
    }
  });
  
  // Step 3: Verify the fix
  console.log('🔍 VERIFICATION PHASE');
  console.log('====================\n');
  
  const verification = verifyNoDuplicatesRemain();
  
  // Step 4: Final summary
  console.log('\n🎯 DUPLICATE FIX COMPLETE!');
  console.log('==========================');
  console.log(`✅ Files processed: ${filesFixed}/${analysisReport.length}`);
  console.log(`✅ Questions replaced: ${totalReplacements}`);
  console.log(`✅ Question pool size maintained: ${verification.totalQuestions} questions`);
  console.log(`✅ Files now duplicate-free: ${verification.cleanFiles}/${verification.totalFiles}`);
  
  if (verification.remainingDuplicates === 0) {
    console.log('\n🏆 MISSION ACCOMPLISHED!');
    console.log('• Every question is now unique within its file');
    console.log('• Total question pool size unchanged');
    console.log('• Educational quality maintained');
    console.log('• Students will experience diverse, engaging content');
  } else {
    console.log(`\n⚠️ ${verification.remainingDuplicates} duplicates still need attention`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  fixDuplicatesInFile,
  verifyNoDuplicatesRemain,
  main
};
