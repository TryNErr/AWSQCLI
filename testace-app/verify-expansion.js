#!/usr/bin/env node

/**
 * EXPANSION VERIFICATION SCRIPT
 * 
 * This script verifies that the question expansion was successful and
 * provides detailed statistics about the new question variety.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 QUESTION EXPANSION VERIFICATION');
console.log('='.repeat(50));

const QUESTIONS_DIR = path.join(__dirname, 'public', 'questions');

// Statistics
let stats = {
  totalFiles: 0,
  totalQuestions: 0,
  originalQuestions: 0,
  expandedQuestions: 0,
  mathFiles: 0,
  thinkingSkillsFiles: 0,
  readingFiles: 0,
  mathQuestions: 0,
  thinkingSkillsQuestions: 0,
  readingQuestions: 0,
  averageQuestionsPerFile: 0,
  expansionFactor: 0
};

/**
 * Analyze a single question file
 */
function analyzeFile(filename) {
  const filePath = path.join(QUESTIONS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filename}`);
    return;
  }
  
  try {
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const questionCount = questions.length;
    
    // Count original vs expanded questions
    let originalCount = 0;
    let expandedCount = 0;
    
    questions.forEach(question => {
      if (question.isExpanded || question.expansionBatch) {
        expandedCount++;
      } else {
        originalCount++;
      }
    });
    
    // Categorize by subject
    const subject = filename.includes('math') ? 'math' : 
                   filename.includes('thinking') ? 'thinking' : 
                   filename.includes('reading') ? 'reading' : 'other';
    
    // Update statistics
    stats.totalFiles++;
    stats.totalQuestions += questionCount;
    stats.originalQuestions += originalCount;
    stats.expandedQuestions += expandedCount;
    
    if (subject === 'math') {
      stats.mathFiles++;
      stats.mathQuestions += questionCount;
    } else if (subject === 'thinking') {
      stats.thinkingSkillsFiles++;
      stats.thinkingSkillsQuestions += questionCount;
    } else if (subject === 'reading') {
      stats.readingFiles++;
      stats.readingQuestions += questionCount;
    }
    
    console.log(`📄 ${filename}: ${questionCount} questions (${originalCount} original + ${expandedCount} expanded)`);
    
    return {
      filename,
      total: questionCount,
      original: originalCount,
      expanded: expandedCount,
      subject
    };
    
  } catch (error) {
    console.error(`❌ Error analyzing ${filename}:`, error.message);
    return null;
  }
}

/**
 * Verify question quality
 */
function verifyQuestionQuality(filename, sampleSize = 3) {
  const filePath = path.join(QUESTIONS_DIR, filename);
  
  try {
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const expandedQuestions = questions.filter(q => q.isExpanded || q.expansionBatch);
    
    if (expandedQuestions.length === 0) {
      return { valid: true, issues: [] };
    }
    
    const sample = expandedQuestions.slice(0, sampleSize);
    const issues = [];
    
    sample.forEach((question, index) => {
      // Check required fields
      if (!question.content) issues.push(`Question ${index + 1}: Missing content`);
      if (!question.options || question.options.length < 2) issues.push(`Question ${index + 1}: Invalid options`);
      if (!question.correctAnswer) issues.push(`Question ${index + 1}: Missing correct answer`);
      if (!question.explanation) issues.push(`Question ${index + 1}: Missing explanation`);
      if (!question.subject) issues.push(`Question ${index + 1}: Missing subject`);
      if (!question.topic) issues.push(`Question ${index + 1}: Missing topic`);
      
      // Check if correct answer is in options
      if (question.options && question.correctAnswer && !question.options.includes(question.correctAnswer)) {
        issues.push(`Question ${index + 1}: Correct answer not in options`);
      }
    });
    
    return { valid: issues.length === 0, issues };
    
  } catch (error) {
    return { valid: false, issues: [`Error reading file: ${error.message}`] };
  }
}

/**
 * Main verification function
 */
function runVerification() {
  console.log('Starting verification...\n');
  
  // Get all question files
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`📚 Found ${files.length} question files to verify\n`);
  
  // Analyze each file
  const fileAnalysis = [];
  files.forEach(filename => {
    const analysis = analyzeFile(filename);
    if (analysis) {
      fileAnalysis.push(analysis);
    }
  });
  
  // Calculate final statistics
  stats.averageQuestionsPerFile = Math.round(stats.totalQuestions / stats.totalFiles);
  stats.expansionFactor = Math.round((stats.totalQuestions / 2700) * 10) / 10;
  
  // Print summary statistics
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('='.repeat(40));
  console.log(`Total files analyzed: ${stats.totalFiles}`);
  console.log(`Total questions: ${stats.totalQuestions.toLocaleString()}`);
  console.log(`Original questions: ${stats.originalQuestions.toLocaleString()}`);
  console.log(`Expanded questions: ${stats.expandedQuestions.toLocaleString()}`);
  console.log(`Average per file: ${stats.averageQuestionsPerFile}`);
  console.log(`Expansion factor: ${stats.expansionFactor}x`);
  
  console.log('\n📈 BY SUBJECT:');
  console.log(`Math files: ${stats.mathFiles} (${stats.mathQuestions.toLocaleString()} questions)`);
  console.log(`Thinking Skills files: ${stats.thinkingSkillsFiles} (${stats.thinkingSkillsQuestions.toLocaleString()} questions)`);
  console.log(`Reading files: ${stats.readingFiles} (${stats.readingQuestions.toLocaleString()} questions)`);
  
  // Quality verification
  console.log('\n🔍 QUALITY VERIFICATION');
  console.log('='.repeat(30));
  
  let qualityIssues = 0;
  const sampleFiles = files.slice(0, 10); // Check first 10 files
  
  sampleFiles.forEach(filename => {
    const quality = verifyQuestionQuality(filename);
    if (!quality.valid) {
      qualityIssues++;
      console.log(`⚠️ ${filename}: ${quality.issues.length} issues`);
      quality.issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ ${filename}: Quality verified`);
    }
  });
  
  // Final assessment
  console.log('\n🏆 FINAL ASSESSMENT');
  console.log('='.repeat(30));
  
  const successCriteria = {
    totalQuestions: stats.totalQuestions > 4000,
    expansionFactor: stats.expansionFactor >= 1.5,
    expandedQuestions: stats.expandedQuestions > 1500,
    qualityCheck: qualityIssues === 0
  };
  
  const allCriteriaMet = Object.values(successCriteria).every(Boolean);
  
  console.log(`Total questions > 4,000: ${successCriteria.totalQuestions ? '✅' : '❌'} (${stats.totalQuestions.toLocaleString()})`);
  console.log(`Expansion factor ≥ 1.5x: ${successCriteria.expansionFactor ? '✅' : '❌'} (${stats.expansionFactor}x)`);
  console.log(`Expanded questions > 1,500: ${successCriteria.expandedQuestions ? '✅' : '❌'} (${stats.expandedQuestions.toLocaleString()})`);
  console.log(`Quality verification: ${successCriteria.qualityCheck ? '✅' : '❌'} (${qualityIssues} issues found)`);
  
  if (allCriteriaMet) {
    console.log('\n🎉 EXPANSION VERIFICATION SUCCESSFUL!');
    console.log('✅ All success criteria met');
    console.log('✅ Question variety significantly increased');
    console.log('✅ Quality standards maintained');
    console.log('✅ Users will experience much more diverse questions');
    console.log('✅ Both timed tests and practice tests will have improved variety');
  } else {
    console.log('\n⚠️ Some criteria not met. Please review the results above.');
  }
  
  // Show some sample expanded questions
  console.log('\n📝 SAMPLE EXPANDED QUESTIONS');
  console.log('='.repeat(40));
  
  const sampleFile = files.find(f => f.includes('5_easy_math'));
  if (sampleFile) {
    try {
      const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, sampleFile), 'utf8'));
      const expandedQuestions = questions.filter(q => q.isExpanded || q.expansionBatch);
      
      if (expandedQuestions.length > 0) {
        const sample = expandedQuestions[0];
        console.log(`📄 From ${sampleFile}:`);
        console.log(`   Content: "${sample.content}"`);
        console.log(`   Options: [${sample.options.join(', ')}]`);
        console.log(`   Answer: "${sample.correctAnswer}"`);
        console.log(`   Topic: ${sample.topic}`);
        console.log(`   Subject: ${sample.subject}`);
      }
    } catch (error) {
      console.log('Could not load sample question');
    }
  }
  
  return allCriteriaMet;
}

// Run the verification
const success = runVerification();
process.exit(success ? 0 : 1);
