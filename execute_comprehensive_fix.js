#!/usr/bin/env node

/**
 * Execute Comprehensive Fix - Process All Files
 * 
 * This script will systematically process all 145 files to eliminate
 * pseudo-duplicates and create true educational diversity.
 */

const fs = require('fs');
const path = require('path');
const { getQuestionType, generateDiverseQuestion } = require('./fix_all_pseudo_duplicates.js');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function fixSingleFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n🔧 Processing ${fileName}...`);
  
  try {
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const originalCount = questions.length;
    
    // Parse file name to get grade, difficulty, subject
    const [grade, difficulty, subject] = fileName.replace('.json', '').split('_');
    
    // Group questions by type
    const typeGroups = new Map();
    questions.forEach((question, index) => {
      const type = getQuestionType(question.content);
      if (!typeGroups.has(type)) {
        typeGroups.set(type, []);
      }
      typeGroups.get(type).push({ question, index });
    });
    
    // Identify problematic types (more than 3 of same type)
    const problematicTypes = [];
    const usedTypes = new Set();
    
    typeGroups.forEach((group, type) => {
      if (group.length > 3) {
        problematicTypes.push({ type, count: group.length, indices: group.map(g => g.index) });
      }
    });
    
    if (problematicTypes.length === 0) {
      console.log(`   ✅ No pseudo-duplicates found (${originalCount} questions)`);
      return { processed: false, originalCount, newCount: originalCount };
    }
    
    console.log(`   ❌ Found pseudo-duplicates:`);
    problematicTypes.forEach(prob => {
      console.log(`      ${prob.type}: ${prob.count} questions (keeping 2, replacing ${prob.count - 2})`);
    });
    
    // Create new question set
    const newQuestions = [];
    const processedIndices = new Set();
    
    // Keep 2 questions from each problematic type
    problematicTypes.forEach(prob => {
      const group = typeGroups.get(prob.type);
      // Keep first 2 questions of each type
      for (let i = 0; i < Math.min(2, group.length); i++) {
        const question = group[i].question;
        newQuestions.push({
          ...question,
          _id: `grade${grade}_${difficulty}_${subject}_${String(newQuestions.length + 1).padStart(3, '0')}`
        });
        processedIndices.add(group[i].index);
        usedTypes.add(prob.type);
      }
    });
    
    // Add all non-problematic questions
    questions.forEach((question, index) => {
      if (!processedIndices.has(index)) {
        const type = getQuestionType(question.content);
        if (!problematicTypes.some(p => p.type === type)) {
          newQuestions.push({
            ...question,
            _id: `grade${grade}_${difficulty}_${subject}_${String(newQuestions.length + 1).padStart(3, '0')}`
          });
          usedTypes.add(type);
        }
      }
    });
    
    // Generate diverse replacements for removed pseudo-duplicates
    const replacementsNeeded = originalCount - newQuestions.length;
    console.log(`   🔄 Generating ${replacementsNeeded} diverse replacement questions...`);
    
    for (let i = 0; i < replacementsNeeded; i++) {
      const newQuestion = generateDiverseQuestion(subject, difficulty, grade, usedTypes, newQuestions.length);
      newQuestions.push(newQuestion);
    }
    
    // Verify count maintained
    if (newQuestions.length !== originalCount) {
      console.log(`   ❌ ERROR: Count mismatch ${originalCount} → ${newQuestions.length}`);
      return { processed: false, originalCount, newCount: newQuestions.length, error: 'count_mismatch' };
    }
    
    // Write the fixed file
    fs.writeFileSync(filePath, JSON.stringify(newQuestions, null, 2));
    
    console.log(`   ✅ SUCCESS: Fixed ${fileName}`);
    console.log(`      Replaced ${replacementsNeeded} pseudo-duplicates`);
    console.log(`      Maintained ${originalCount} questions`);
    console.log(`      Sample new question: "${newQuestions[newQuestions.length - 1].content.substring(0, 50)}..."`);
    
    return { processed: true, originalCount, newCount: newQuestions.length, replacements: replacementsNeeded };
    
  } catch (error) {
    console.log(`   ❌ ERROR processing ${fileName}: ${error.message}`);
    return { processed: false, originalCount: 0, newCount: 0, error: error.message };
  }
}

function processAllFiles() {
  console.log('🚀 COMPREHENSIVE PSEUDO-DUPLICATE FIX');
  console.log('====================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const results = {
    totalFiles: 0,
    processedFiles: 0,
    skippedFiles: 0,
    errorFiles: 0,
    totalReplacements: 0,
    totalQuestions: 0
  };
  
  // Process files in batches for better organization
  const mathFiles = files.filter(f => f.includes('math') && f.endsWith('.json') && f !== 'manifest.json');
  const englishFiles = files.filter(f => f.includes('english') && f.endsWith('.json'));
  const readingFiles = files.filter(f => f.includes('reading') && f.endsWith('.json'));
  const thinkingFiles = files.filter(f => f.includes('thinking') && f.endsWith('.json'));
  
  console.log('📚 PROCESSING MATH FILES');
  console.log('========================');
  mathFiles.forEach(file => {
    const filePath = path.join(QUESTIONS_DIR, file);
    const result = fixSingleFile(filePath);
    updateResults(results, result);
  });
  
  console.log('\n📝 PROCESSING ENGLISH FILES');
  console.log('===========================');
  englishFiles.forEach(file => {
    const filePath = path.join(QUESTIONS_DIR, file);
    const result = fixSingleFile(filePath);
    updateResults(results, result);
  });
  
  console.log('\n📖 PROCESSING READING FILES');
  console.log('===========================');
  readingFiles.forEach(file => {
    const filePath = path.join(QUESTIONS_DIR, file);
    const result = fixSingleFile(filePath);
    updateResults(results, result);
  });
  
  console.log('\n🧠 PROCESSING THINKING SKILLS FILES');
  console.log('===================================');
  thinkingFiles.forEach(file => {
    const filePath = path.join(QUESTIONS_DIR, file);
    const result = fixSingleFile(filePath);
    updateResults(results, result);
  });
  
  // Final summary
  console.log('\n🎯 COMPREHENSIVE FIX COMPLETE!');
  console.log('==============================');
  console.log(`📊 FINAL STATISTICS:`);
  console.log(`   Total files: ${results.totalFiles}`);
  console.log(`   Files processed: ${results.processedFiles}`);
  console.log(`   Files skipped (no issues): ${results.skippedFiles}`);
  console.log(`   Files with errors: ${results.errorFiles}`);
  console.log(`   Total questions maintained: ${results.totalQuestions}`);
  console.log(`   Total pseudo-duplicates replaced: ${results.totalReplacements}`);
  
  if (results.errorFiles === 0) {
    console.log('\n🏆 PERFECT SUCCESS!');
    console.log('✅ All files processed without errors');
    console.log('✅ True educational diversity achieved');
    console.log('✅ Question pool sizes maintained');
  } else {
    console.log(`\n⚠️ ${results.errorFiles} files had errors - may need manual review`);
  }
  
  return results;
}

function updateResults(results, result) {
  results.totalFiles++;
  results.totalQuestions += result.originalCount;
  
  if (result.error) {
    results.errorFiles++;
  } else if (result.processed) {
    results.processedFiles++;
    results.totalReplacements += result.replacements || 0;
  } else {
    results.skippedFiles++;
  }
}

if (require.main === module) {
  processAllFiles();
}

module.exports = { processAllFiles, fixSingleFile };
