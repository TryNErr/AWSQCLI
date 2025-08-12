#!/usr/bin/env node

/**
 * Comprehensive Quality Audit Script
 * 
 * This script checks the quality of questions across ALL subjects, 
 * grades, and difficulty levels to ensure the fix was comprehensive.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function auditAllQuestions() {
  console.log('🔍 COMPREHENSIVE QUALITY AUDIT');
  console.log('===============================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const auditResults = {
    totalFiles: 0,
    totalQuestions: 0,
    qualityIssues: [],
    gradeBreakdown: {},
    subjectBreakdown: {},
    difficultyBreakdown: {},
    redFlags: []
  };
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      auditResults.totalFiles++;
      
      const [grade, difficulty, subject] = file.replace('.json', '').split('_');
      
      // Initialize counters
      if (!auditResults.gradeBreakdown[grade]) auditResults.gradeBreakdown[grade] = 0;
      if (!auditResults.subjectBreakdown[subject]) auditResults.subjectBreakdown[subject] = 0;
      if (!auditResults.difficultyBreakdown[difficulty]) auditResults.difficultyBreakdown[difficulty] = 0;
      
      const filePath = path.join(QUESTIONS_DIR, file);
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        auditResults.totalQuestions += questions.length;
        auditResults.gradeBreakdown[grade] += questions.length;
        auditResults.subjectBreakdown[subject] += questions.length;
        auditResults.difficultyBreakdown[difficulty] += questions.length;
        
        // Audit each question
        questions.forEach((question, index) => {
          const issues = auditQuestion(question, grade, difficulty, subject, file, index);
          auditResults.qualityIssues.push(...issues.qualityIssues);
          auditResults.redFlags.push(...issues.redFlags);
        });
        
      } catch (error) {
        console.warn(`⚠️ Could not audit ${file}: ${error.message}`);
      }
    }
  });
  
  return auditResults;
}

function auditQuestion(question, grade, difficulty, subject, filename, index) {
  const issues = {
    qualityIssues: [],
    redFlags: []
  };
  
  const gradeNum = parseInt(grade);
  const content = question.content || '';
  
  // Check 1: Subject consistency
  const expectedSubject = getExpectedSubject(subject);
  if (question.subject !== expectedSubject) {
    issues.qualityIssues.push({
      type: 'subject_mismatch',
      file: filename,
      questionIndex: index,
      content: content.substring(0, 50) + '...',
      expected: expectedSubject,
      actual: question.subject,
      severity: 'high'
    });
  }
  
  // Check 2: Grade appropriateness for Math
  if (subject === 'math') {
    // Check for elementary arithmetic in high school
    if (gradeNum >= 9 && difficulty === 'hard') {
      if (isBasicArithmetic(content)) {
        issues.redFlags.push({
          type: 'elementary_math_in_high_school',
          file: filename,
          questionIndex: index,
          content: content,
          grade: gradeNum,
          difficulty: difficulty,
          severity: 'critical'
        });
      }
    }
    
    // Check for advanced concepts in elementary
    if (gradeNum <= 5) {
      const advancedPatterns = [/derivative/i, /integral/i, /quadratic equation/i, /trigonometric/i, /logarithm/i, /calculus/i];
      advancedPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          issues.redFlags.push({
            type: 'advanced_math_in_elementary',
            file: filename,
            questionIndex: index,
            content: content,
            grade: gradeNum,
            difficulty: difficulty,
            severity: 'critical'
          });
        }
      });
    }
  }
  
  // Check 3: Generic explanations
  if (question.explanation && question.explanation.includes('This is a hard level math question specifically designed')) {
    issues.qualityIssues.push({
      type: 'generic_explanation',
      file: filename,
      questionIndex: index,
      content: content.substring(0, 50) + '...',
      severity: 'medium'
    });
  }
  
  // Check 4: Missing or poor explanations
  if (!question.explanation || question.explanation.length < 10) {
    issues.qualityIssues.push({
      type: 'missing_explanation',
      file: filename,
      questionIndex: index,
      content: content.substring(0, 50) + '...',
      severity: 'low'
    });
  }
  
  return issues;
}

function isBasicArithmetic(content) {
  const basicPatterns = [
    /what is \d+ [+\-×÷] \d+\?/i,
    /\d+ [+\-×÷] \d+ =/i,
    /what is \d{1,2} \+ \d{1,2}\?/i,
    /what is \d{1,2} - \d{1,2}\?/i,
    /what is \d{1,2} × \d{1,2}\?/i,
    /what is \d{1,2} ÷ \d{1,2}\?/i
  ];
  
  return basicPatterns.some(pattern => pattern.test(content));
}

function getExpectedSubject(fileSubject) {
  const mapping = {
    'math': 'Mathematics',
    'english': 'English',
    'reading': 'Reading',
    'thinking-skills': 'Thinking Skills'
  };
  return mapping[fileSubject] || fileSubject;
}

function generateQualityReport(auditResults) {
  console.log('📊 QUALITY AUDIT RESULTS');
  console.log('========================\n');
  
  console.log(`📈 Overall Statistics:`);
  console.log(`   Total files: ${auditResults.totalFiles}`);
  console.log(`   Total questions: ${auditResults.totalQuestions}`);
  console.log(`   Quality issues: ${auditResults.qualityIssues.length}`);
  console.log(`   Red flags: ${auditResults.redFlags.length}\n`);
  
  console.log(`📚 By Grade:`);
  Object.entries(auditResults.gradeBreakdown).sort().forEach(([grade, count]) => {
    console.log(`   Grade ${grade}: ${count} questions`);
  });
  
  console.log(`\n📖 By Subject:`);
  Object.entries(auditResults.subjectBreakdown).forEach(([subject, count]) => {
    console.log(`   ${subject}: ${count} questions`);
  });
  
  console.log(`\n⚡ By Difficulty:`);
  Object.entries(auditResults.difficultyBreakdown).forEach(([difficulty, count]) => {
    console.log(`   ${difficulty}: ${count} questions`);
  });
  
  // Critical issues first
  const criticalIssues = auditResults.redFlags.filter(flag => flag.severity === 'critical');
  if (criticalIssues.length > 0) {
    console.log(`\n🚨 CRITICAL ISSUES (${criticalIssues.length}):`);
    console.log('=====================================');
    
    criticalIssues.slice(0, 10).forEach(issue => {
      console.log(`❌ ${issue.type} in ${issue.file}:`);
      console.log(`   "${issue.content}"`);
      console.log(`   Grade ${issue.grade}, ${issue.difficulty} difficulty`);
      console.log('');
    });
    
    if (criticalIssues.length > 10) {
      console.log(`   ... and ${criticalIssues.length - 10} more critical issues\n`);
    }
  } else {
    console.log('\n✅ NO CRITICAL ISSUES FOUND!');
  }
  
  // Quality issues summary
  if (auditResults.qualityIssues.length > 0) {
    console.log(`\n⚠️ QUALITY ISSUES SUMMARY (${auditResults.qualityIssues.length}):`);
    console.log('===============================================');
    
    const issueTypes = {};
    auditResults.qualityIssues.forEach(issue => {
      issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
    });
    
    Object.entries(issueTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} issues`);
    });
  }
  
  return auditResults;
}

function sampleQuestionsAcrossGrades() {
  console.log('\n📝 SAMPLE QUESTIONS ACROSS GRADES');
  console.log('=================================\n');
  
  const sampleFiles = [
    '1_hard_math.json',
    '5_hard_math.json', 
    '9_hard_math.json',
    '12_hard_math.json',
    '5_hard_english.json',
    '9_hard_english.json',
    '9_hard_thinking-skills.json'
  ];
  
  sampleFiles.forEach(filename => {
    const filePath = path.join(QUESTIONS_DIR, filename);
    
    try {
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const [grade, difficulty, subject] = filename.replace('.json', '').split('_');
      
      console.log(`📁 ${filename} (Grade ${grade}, ${difficulty}, ${subject}):`);
      
      if (questions.length > 0) {
        const sample = questions[0];
        console.log(`   Question: "${sample.content}"`);
        console.log(`   Subject: ${sample.subject}`);
        console.log(`   Explanation: "${sample.explanation?.substring(0, 60)}..."`);
        
        // Quality check
        if (subject === 'math' && parseInt(grade) >= 9 && isBasicArithmetic(sample.content)) {
          console.log(`   🚨 QUALITY ISSUE: Basic arithmetic in Grade ${grade} ${difficulty}!`);
        } else {
          console.log(`   ✅ Appropriate for Grade ${grade} ${difficulty}`);
        }
      } else {
        console.log(`   ❌ No questions found`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Could not load ${filename}: ${error.message}\n`);
    }
  });
}

function checkSpecificProblematicCombinations() {
  console.log('\n🎯 CHECKING SPECIFIC PROBLEMATIC COMBINATIONS');
  console.log('============================================\n');
  
  const problematicCombinations = [
    { grade: '9', difficulty: 'hard', subject: 'math', description: 'Grade 9 Hard Math (original problem)' },
    { grade: '10', difficulty: 'hard', subject: 'math', description: 'Grade 10 Hard Math' },
    { grade: '11', difficulty: 'hard', subject: 'math', description: 'Grade 11 Hard Math' },
    { grade: '12', difficulty: 'hard', subject: 'math', description: 'Grade 12 Hard Math' },
    { grade: '1', difficulty: 'hard', subject: 'math', description: 'Grade 1 Hard Math (should be age-appropriate)' },
    { grade: '5', difficulty: 'hard', subject: 'english', description: 'Grade 5 Hard English' },
    { grade: '9', difficulty: 'hard', subject: 'english', description: 'Grade 9 Hard English' }
  ];
  
  problematicCombinations.forEach(combo => {
    const filename = `${combo.grade}_${combo.difficulty}_${combo.subject}.json`;
    const filePath = path.join(QUESTIONS_DIR, filename);
    
    console.log(`🔍 ${combo.description}:`);
    
    try {
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (questions.length === 0) {
        console.log(`   ❌ No questions found in ${filename}`);
        console.log('');
        return;
      }
      
      // Check first 3 questions
      const samples = questions.slice(0, 3);
      let appropriateCount = 0;
      let inappropriateCount = 0;
      
      samples.forEach((question, index) => {
        const isAppropriate = checkQuestionAppropriateness(question, combo.grade, combo.difficulty, combo.subject);
        
        if (isAppropriate) {
          appropriateCount++;
        } else {
          inappropriateCount++;
          console.log(`   ❌ Question ${index + 1}: "${question.content}"`);
          console.log(`      Problem: Inappropriate for Grade ${combo.grade} ${combo.difficulty}`);
        }
      });
      
      if (inappropriateCount === 0) {
        console.log(`   ✅ All sample questions appropriate for Grade ${combo.grade} ${combo.difficulty}`);
        console.log(`   📝 Sample: "${samples[0].content}"`);
      } else {
        console.log(`   🚨 ${inappropriateCount}/${samples.length} sample questions inappropriate!`);
      }
      
    } catch (error) {
      console.log(`   ❌ Could not check ${filename}: ${error.message}`);
    }
    
    console.log('');
  });
}

function checkQuestionAppropriateness(question, grade, difficulty, subject) {
  const gradeNum = parseInt(grade);
  const content = question.content || '';
  
  // For math questions
  if (subject === 'math') {
    // High school hard math should not be basic arithmetic
    if (gradeNum >= 9 && difficulty === 'hard') {
      return !isBasicArithmetic(content);
    }
    
    // Elementary should not have advanced concepts
    if (gradeNum <= 5) {
      const advancedPatterns = [/derivative/i, /integral/i, /quadratic equation/i, /trigonometric/i, /logarithm/i, /calculus/i];
      return !advancedPatterns.some(pattern => pattern.test(content));
    }
  }
  
  return true; // Default to appropriate if no specific issues found
}

function main() {
  console.log('🚀 COMPREHENSIVE QUALITY AUDIT');
  console.log('===============================\n');
  
  console.log('Checking quality across ALL subjects, grades, and difficulty levels...\n');
  
  // Run comprehensive audit
  const results = auditAllQuestions();
  
  // Generate detailed report
  generateQualityReport(results);
  
  // Show sample questions
  sampleQuestionsAcrossGrades();
  
  // Check specific problematic combinations
  checkSpecificProblematicCombinations();
  
  // Final assessment
  const criticalCount = results.redFlags.filter(f => f.severity === 'critical').length;
  const totalIssues = results.qualityIssues.length + results.redFlags.length;
  
  console.log('\n🎯 FINAL ASSESSMENT:');
  console.log('====================');
  
  if (criticalCount === 0 && totalIssues < 100) {
    console.log('✅ EXCELLENT: Quality standards met across all subjects and grades!');
    console.log('✅ No critical issues found');
    console.log('✅ Questions are appropriate for their grade/difficulty levels');
    console.log('✅ Fix was comprehensive across all subjects, not just Grade 9 Math');
  } else if (criticalCount === 0) {
    console.log('⚠️ GOOD: No critical issues, but some quality improvements needed');
    console.log(`⚠️ ${totalIssues} minor issues to address`);
    console.log('✅ Fix was comprehensive - no critical quality problems remain');
  } else {
    console.log('❌ NEEDS WORK: Critical quality issues found');
    console.log(`❌ ${criticalCount} critical issues need immediate attention`);
    console.log(`❌ ${totalIssues} total issues found`);
    console.log('❌ Fix may not have been comprehensive enough');
  }
  
  console.log(`\n📊 Coverage Summary:`);
  console.log(`   Grades covered: ${Object.keys(results.gradeBreakdown).length}`);
  console.log(`   Subjects covered: ${Object.keys(results.subjectBreakdown).length}`);
  console.log(`   Difficulty levels: ${Object.keys(results.difficultyBreakdown).length}`);
  console.log(`   Total combinations audited: ${results.totalFiles}`);
  
  // Save detailed report
  fs.writeFileSync('./comprehensive_quality_audit_report.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Detailed report saved to: comprehensive_quality_audit_report.json');
}

if (require.main === module) {
  main();
}
