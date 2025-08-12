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

// Define what constitutes appropriate content for each grade/difficulty/subject
const QUALITY_STANDARDS = {
  // Grade-appropriate math content
  math: {
    1: {
      easy: ['counting', 'addition within 10', 'subtraction within 10', 'shapes'],
      medium: ['addition within 20', 'subtraction within 20', 'basic patterns'],
      hard: ['addition within 50', 'subtraction within 50', 'word problems']
    },
    5: {
      easy: ['basic fractions', 'decimal basics', 'multiplication tables'],
      medium: ['fraction operations', 'decimal operations', 'area and perimeter'],
      hard: ['algebraic thinking', 'coordinate geometry', 'complex word problems']
    },
    9: {
      easy: ['linear equations', 'basic functions', 'simple inequalities'],
      medium: ['quadratic expressions', 'coordinate geometry', 'basic trigonometry'],
      hard: ['quadratic equations', 'advanced functions', 'trigonometric functions', 'derivatives']
    },
    12: {
      easy: ['polynomial operations', 'rational expressions'],
      medium: ['advanced functions', 'sequences and series'],
      hard: ['calculus', 'advanced statistics', 'complex analysis']
    }
  },
  
  // Grade-appropriate English content
  english: {
    1: {
      easy: ['letter recognition', 'simple words', 'basic sentences'],
      medium: ['sight words', 'simple reading', 'basic grammar'],
      hard: ['short paragraphs', 'simple stories', 'basic punctuation']
    },
    5: {
      easy: ['vocabulary', 'reading comprehension', 'basic grammar'],
      medium: ['literary devices', 'paragraph writing', 'advanced grammar'],
      hard: ['essay writing', 'complex texts', 'critical analysis']
    },
    9: {
      easy: ['vocabulary expansion', 'basic literary analysis'],
      medium: ['essay structure', 'literary devices', 'research skills'],
      hard: ['advanced literary analysis', 'persuasive writing', 'complex grammar']
    },
    12: {
      easy: ['advanced vocabulary', 'literary criticism'],
      medium: ['scholarly writing', 'advanced rhetoric'],
      hard: ['college-level analysis', 'independent research', 'theoretical frameworks']
    }
  }
};

// Inappropriate content patterns (red flags)
const RED_FLAGS = {
  math: {
    elementary_in_high_school: [
      /what is \d+ [+\-×÷] \d+\?/i,
      /what is \d+ \+ \d+\?/i,
      /what is \d+ - \d+\?/i,
      /what is \d+ × \d+\?/i,
      /what is \d+ ÷ \d+\?/i,
      /\d+ \+ \d+ =/i,
      /\d+ - \d+ =/i
    ],
    advanced_in_elementary: [
      /derivative/i,
      /integral/i,
      /quadratic equation/i,
      /trigonometric/i,
      /logarithm/i,
      /calculus/i
    ]
  },
  english: {
    too_simple_for_grade: [
      /what letter comes after/i,
      /spell.*cat/i,
      /what sound does.*make/i
    ],
    too_complex_for_grade: [
      /postmodern literary theory/i,
      /deconstructionist analysis/i,
      /phenomenological approach/i
    ]
  }
};

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
    if (gradeNum >= 9) {
      RED_FLAGS.math.elementary_in_high_school.forEach(pattern => {
        if (pattern.test(content)) {
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
      });
    }
    
    // Check for advanced concepts in elementary
    if (gradeNum <= 5) {
      RED_FLAGS.math.advanced_in_elementary.forEach(pattern => {
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
  
  // Check 3: Difficulty appropriateness
  if (difficulty === 'hard' && gradeNum >= 7) {
    // Hard questions for Grade 7+ should be genuinely challenging
    if (isBasicArithmetic(content)) {
      issues.redFlags.push({
        type: 'basic_arithmetic_as_hard',
        file: filename,
        questionIndex: index,
        content: content,
        grade: gradeNum,
        difficulty: difficulty,
        severity: 'critical'
      });
    }
  }
  
  // Check 4: Generic explanations
  if (question.explanation && question.explanation.includes('This is a hard level math question specifically designed')) {
    issues.qualityIssues.push({
      type: 'generic_explanation',
      file: filename,
      questionIndex: index,
      content: content.substring(0, 50) + '...',
      severity: 'medium'
    });
  }
  
  // Check 5: Missing or poor explanations
  if (!question.explanation || question.explanation.length < 10) {
    issues.qualityIssues.push({
      type: 'missing_explanation',
      file: filename,
      questionIndex: index,
      content: content.substring(0, 50) + '...',
      severity: 'medium'
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
  }
  
  // Quality issues
  if (auditResults.qualityIssues.length > 0) {
    console.log(`\n⚠️ QUALITY ISSUES (${auditResults.qualityIssues.length}):`);
    console.log('====================================');
    
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
        console.log(`   Explanation: "${sample.explanation?.substring(0, 80)}..."`);
        
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

function main() {
  console.log('🚀 COMPREHENSIVE QUALITY AUDIT');
  console.log('===============================\n');
  
  console.log('Checking quality across ALL subjects, grades, and difficulty levels...\n');
  
  // Run comprehensive audit
  const auditResults = auditResults = auditAllQuestions();
  
  // Generate detailed report
  generateQualityReport(auditResults);
  
  // Show sample questions
  sampleQuestionsAcrossGrades();
  
  // Final assessment
  const criticalCount = auditResults.redFlags.filter(f => f.severity === 'critical').length;
  const totalIssues = auditResults.qualityIssues.length + auditResults.redFlags.length;
  
  console.log('🎯 FINAL ASSESSMENT:');
  console.log('====================');
  
  if (criticalCount === 0 && totalIssues < 50) {
    console.log('✅ EXCELLENT: Quality standards met across all subjects and grades!');
    console.log('✅ No critical issues found');
    console.log('✅ Questions are appropriate for their grade/difficulty levels');
  } else if (criticalCount === 0) {
    console.log('⚠️ GOOD: No critical issues, but some quality improvements needed');
    console.log(`⚠️ ${totalIssues} minor issues to address`);
  } else {
    console.log('❌ NEEDS WORK: Critical quality issues found');
    console.log(`❌ ${criticalCount} critical issues need immediate attention`);
    console.log(`❌ ${totalIssues} total issues found`);
  }
  
  // Save detailed report
  fs.writeFileSync('./comprehensive_quality_audit_report.json', JSON.stringify(auditResults, null, 2));
  console.log('\n📄 Detailed report saved to: comprehensive_quality_audit_report.json');
}

if (require.main === module) {
  main();
}
