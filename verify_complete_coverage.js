#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define expected grades and difficulties
const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const SUBJECTS = ['thinking-skills']; // Can be extended for other subjects

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

function verifyQuestionFile(filePath, expectedGrade, expectedDifficulty, expectedSubject) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    const issues = [];
    
    // Check if file has questions
    if (!Array.isArray(questions) || questions.length === 0) {
      issues.push('No questions found');
      return { valid: false, issues, questionCount: 0 };
    }
    
    // Check each question
    questions.forEach((question, index) => {
      // Check for fake content
      if (question.content && question.content.includes('varied content')) {
        issues.push(`Question ${index + 1}: Contains fake "varied content"`);
      }
      
      // Check for fake options
      if (question.options && question.options.some(opt => /^Option [A-D]\d+$/.test(opt))) {
        issues.push(`Question ${index + 1}: Contains fake options like "Option A0"`);
      }
      
      // Check required fields
      if (!question._id) issues.push(`Question ${index + 1}: Missing _id`);
      if (!question.content) issues.push(`Question ${index + 1}: Missing content`);
      if (!question.options || !Array.isArray(question.options)) {
        issues.push(`Question ${index + 1}: Missing or invalid options`);
      }
      if (!question.correctAnswer) issues.push(`Question ${index + 1}: Missing correctAnswer`);
      if (!question.explanation) issues.push(`Question ${index + 1}: Missing explanation`);
      
      // Check metadata
      if (question.grade !== expectedGrade) {
        issues.push(`Question ${index + 1}: Grade mismatch (expected ${expectedGrade}, got ${question.grade})`);
      }
      if (question.difficulty !== expectedDifficulty) {
        issues.push(`Question ${index + 1}: Difficulty mismatch (expected ${expectedDifficulty}, got ${question.difficulty})`);
      }
      if (question.subject !== 'Thinking Skills') {
        issues.push(`Question ${index + 1}: Subject mismatch (expected "Thinking Skills", got "${question.subject}")`);
      }
    });
    
    return {
      valid: issues.length === 0,
      issues,
      questionCount: questions.length
    };
    
  } catch (error) {
    return {
      valid: false,
      issues: [`Error reading file: ${error.message}`],
      questionCount: 0
    };
  }
}

function main() {
  console.log('🔍 Verifying complete coverage of all grades and difficulties...\n');
  
  let totalFiles = 0;
  let validFiles = 0;
  let totalQuestions = 0;
  const allIssues = [];
  
  // Check each combination
  for (const grade of GRADES) {
    for (const difficulty of DIFFICULTIES) {
      for (const subject of SUBJECTS) {
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filePath = path.join(questionsDir, filename);
        
        totalFiles++;
        
        if (!fs.existsSync(filePath)) {
          allIssues.push(`❌ Missing file: ${filename}`);
          continue;
        }
        
        const result = verifyQuestionFile(filePath, grade, difficulty, subject);
        totalQuestions += result.questionCount;
        
        if (result.valid) {
          validFiles++;
          console.log(`✅ ${filename} - ${result.questionCount} questions`);
        } else {
          console.log(`❌ ${filename} - Issues found:`);
          result.issues.forEach(issue => {
            console.log(`   - ${issue}`);
            allIssues.push(`${filename}: ${issue}`);
          });
        }
      }
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`Total expected files: ${totalFiles}`);
  console.log(`Valid files: ${validFiles}`);
  console.log(`Invalid files: ${totalFiles - validFiles}`);
  console.log(`Total questions: ${totalQuestions}`);
  
  if (allIssues.length > 0) {
    console.log('\n🚨 Issues found:');
    allIssues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('\n🎉 All files are valid! Complete coverage achieved.');
  }
  
  // Generate coverage matrix
  console.log('\n📋 Coverage Matrix:');
  console.log('Grade | Easy | Medium | Hard');
  console.log('------|------|--------|-----');
  
  for (const grade of GRADES) {
    const row = [grade.toString().padStart(5)];
    for (const difficulty of DIFFICULTIES) {
      const filename = `${grade}_${difficulty}_thinking-skills.json`;
      const filePath = path.join(questionsDir, filename);
      const exists = fs.existsSync(filePath);
      
      if (exists) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const questions = JSON.parse(content);
          const hasRealQuestions = !content.includes('varied content');
          row.push(hasRealQuestions ? '  ✅  ' : '  ❌  ');
        } catch {
          row.push('  ❌  ');
        }
      } else {
        row.push('  ❌  ');
      }
    }
    console.log(row.join(' | '));
  }
  
  return allIssues.length === 0;
}

// Run verification
if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { verifyQuestionFile };
