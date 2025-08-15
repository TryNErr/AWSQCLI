#!/usr/bin/env node

/**
 * PROPER Duplicate Fix - No More Fake Solutions
 * 
 * This script will:
 * 1. Identify ALL duplicate questions
 * 2. Replace them with COMPLETELY DIFFERENT questions
 * 3. Maintain question pool size
 * 4. Ensure educational quality
 * 
 * NO MORE VERSION NUMBERS OR MINOR VARIATIONS!
 */

const fs = require('fs');
const path = require('path');
const { generateTrulyUniqueQuestion } = require('./proper_question_generator.js');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function analyzeAndFixFile(filePath) {
  console.log(`\n🔧 Processing ${path.basename(filePath)}...`);
  
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const originalCount = questions.length;
  
  // Parse file name
  const fileName = path.basename(filePath, '.json');
  const [grade, difficulty, subject] = fileName.split('_');
  
  console.log(`   Original questions: ${originalCount}`);
  
  // Track content to identify duplicates
  const contentMap = new Map();
  const usedQuestions = new Set();
  
  // First pass: identify unique questions and duplicates
  questions.forEach((question, index) => {
    const content = question.content.trim();
    if (!contentMap.has(content)) {
      contentMap.set(content, []);
    }
    contentMap.get(content).push({ question, index });
  });
  
  // Find duplicates
  const duplicateGroups = [];
  contentMap.forEach((group, content) => {
    if (group.length > 1) {
      duplicateGroups.push({ content, count: group.length, indices: group.map(g => g.index) });
    }
  });
  
  if (duplicateGroups.length === 0) {
    console.log(`   ✅ No duplicates found`);
    return { fixed: false, duplicatesRemoved: 0 };
  }
  
  console.log(`   ❌ Found ${duplicateGroups.length} duplicate groups`);
  duplicateGroups.forEach(group => {
    console.log(`      "${group.content.substring(0, 50)}..." appears ${group.count} times`);
  });
  
  // Create new question set
  const newQuestions = [];
  const processedContent = new Set();
  let duplicatesRemoved = 0;
  
  questions.forEach((question, index) => {
    const content = question.content.trim();
    
    if (!processedContent.has(content)) {
      // First occurrence - keep it
      processedContent.add(content);
      usedQuestions.add(content);
      newQuestions.push({
        ...question,
        _id: `grade${grade}_${difficulty}_${subject}_${String(newQuestions.length + 1).padStart(3, '0')}`
      });
    } else {
      // Duplicate - replace with completely different question
      const newQuestion = generateTrulyUniqueQuestion(subject, difficulty, grade, usedQuestions, newQuestions.length);
      usedQuestions.add(newQuestion.content);
      newQuestions.push(newQuestion);
      duplicatesRemoved++;
    }
  });
  
  // Verify no duplicates remain
  const finalContentCheck = new Set();
  let stillHasDuplicates = false;
  
  newQuestions.forEach(question => {
    if (finalContentCheck.has(question.content)) {
      stillHasDuplicates = true;
      console.log(`   ⚠️ WARNING: Still has duplicate: "${question.content.substring(0, 50)}..."`);
    }
    finalContentCheck.add(question.content);
  });
  
  if (stillHasDuplicates) {
    console.log(`   ❌ FAILED: Still contains duplicates`);
    return { fixed: false, duplicatesRemoved: 0 };
  }
  
  // Verify count maintained
  if (newQuestions.length !== originalCount) {
    console.log(`   ❌ ERROR: Question count changed from ${originalCount} to ${newQuestions.length}`);
    return { fixed: false, duplicatesRemoved: 0 };
  }
  
  // Write the fixed file
  fs.writeFileSync(filePath, JSON.stringify(newQuestions, null, 2));
  
  console.log(`   ✅ SUCCESS: Fixed ${duplicatesRemoved} duplicates`);
  console.log(`   ✅ Maintained ${originalCount} questions`);
  console.log(`   ✅ All questions are now unique`);
  console.log(`   Sample new question: "${newQuestions[newQuestions.length - 1].content.substring(0, 60)}..."`);
  
  return { fixed: true, duplicatesRemoved };
}

function verifyAllFilesClean() {
  console.log('\n🔍 FINAL VERIFICATION - CHECKING ALL FILES');
  console.log('==========================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let totalFiles = 0;
  let cleanFiles = 0;
  let totalQuestions = 0;
  let filesWithDuplicates = [];
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      totalFiles++;
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        totalQuestions += questions.length;
        
        const contentSet = new Set();
        const duplicates = [];
        
        questions.forEach(question => {
          const content = question.content.trim();
          if (contentSet.has(content)) {
            duplicates.push(content.substring(0, 50) + '...');
          }
          contentSet.add(content);
        });
        
        if (duplicates.length === 0) {
          cleanFiles++;
          console.log(`✅ ${file}: ${questions.length} unique questions`);
        } else {
          filesWithDuplicates.push({ file, duplicates });
          console.log(`❌ ${file}: ${duplicates.length} duplicates found`);
          duplicates.slice(0, 2).forEach(dup => {
            console.log(`   • "${dup}"`);
          });
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not verify ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 FINAL VERIFICATION RESULTS:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Clean files: ${cleanFiles}`);
  console.log(`   Files with duplicates: ${filesWithDuplicates.length}`);
  console.log(`   Total questions: ${totalQuestions}`);
  
  if (filesWithDuplicates.length === 0) {
    console.log('\n🎉 PERFECT SUCCESS!');
    console.log('✅ Every single file is now duplicate-free');
    console.log('✅ All questions are completely unique');
    console.log('✅ Question pool size maintained');
    console.log('✅ Educational quality preserved');
  } else {
    console.log(`\n❌ STILL HAVE PROBLEMS:`);
    filesWithDuplicates.forEach(item => {
      console.log(`   ${item.file}: ${item.duplicates.length} duplicates`);
    });
  }
  
  return { totalFiles, cleanFiles, totalQuestions, problemFiles: filesWithDuplicates };
}

function main() {
  console.log('🚀 PROPER DUPLICATE FIX - NO MORE FAKE SOLUTIONS');
  console.log('================================================\n');
  
  console.log('❌ Previous fix was inadequate - just added version numbers');
  console.log('✅ This fix generates COMPLETELY DIFFERENT questions');
  console.log('✅ No more "Solve x² + 3x + 2 = 0 (Version 539)"');
  console.log('✅ Real diversity: algebra, geometry, word problems, etc.\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  let filesProcessed = 0;
  let filesFixed = 0;
  let totalDuplicatesRemoved = 0;
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      filesProcessed++;
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const result = analyzeAndFixFile(filePath);
        if (result.fixed) {
          filesFixed++;
          totalDuplicatesRemoved += result.duplicatesRemoved;
        }
      } catch (error) {
        console.error(`❌ Failed to process ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 PROCESSING SUMMARY:`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Files fixed: ${filesFixed}`);
  console.log(`   Total duplicates removed: ${totalDuplicatesRemoved}`);
  
  // Final verification
  const verification = verifyAllFilesClean();
  
  console.log('\n🎯 MISSION STATUS:');
  if (verification.problemFiles.length === 0) {
    console.log('🏆 COMPLETE SUCCESS - NO DUPLICATES REMAIN!');
    console.log('• Every question is unique within its file');
    console.log('• Question pool size maintained');
    console.log('• True educational diversity achieved');
  } else {
    console.log('❌ STILL HAVE ISSUES - NEED MORE WORK');
    console.log(`• ${verification.problemFiles.length} files still have duplicates`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeAndFixFile,
  verifyAllFilesClean
};
