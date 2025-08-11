#!/usr/bin/env node

/**
 * QUESTION FILE REORGANIZATION SCRIPT
 * 
 * This script physically moves questions to their correct files based on their subject field.
 * This completes the subject categorization fix by ensuring questions are in the right files.
 */

const fs = require('fs');
const path = require('path');

console.log('📁 QUESTION FILE REORGANIZATION');
console.log('='.repeat(40));

const QUESTIONS_DIR = path.join(__dirname, 'public', 'questions');
const BACKUP_DIR = path.join(__dirname, 'question-reorganization-backups');

// Statistics
let stats = {
  filesProcessed: 0,
  questionsMoved: 0,
  filesCreated: 0,
  filesUpdated: 0,
  errors: 0
};

/**
 * Create backup directory
 */
function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * Get the correct filename for a question
 */
function getCorrectFilename(question) {
  const grade = question.grade;
  const difficulty = question.difficulty;
  const subject = question.subject.toLowerCase();
  
  let subjectPart;
  if (subject.includes('math') || subject === 'mathematical reasoning') {
    subjectPart = 'math';
  } else if (subject.includes('thinking')) {
    subjectPart = 'thinking-skills';
  } else if (subject.includes('reading')) {
    subjectPart = 'reading';
  } else if (subject.includes('english')) {
    subjectPart = 'english';
  } else {
    subjectPart = subject.replace(/\s+/g, '-');
  }
  
  return `${grade}_${difficulty}_${subjectPart}.json`;
}

/**
 * Reorganize questions from all files
 */
function reorganizeQuestions() {
  console.log('\n🔄 REORGANIZING QUESTIONS');
  console.log('='.repeat(30));
  
  // First, collect all questions from all files
  const allQuestions = [];
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`📚 Reading questions from ${files.length} files...`);
  
  // Read all questions
  files.forEach(filename => {
    try {
      const filePath = path.join(QUESTIONS_DIR, filename);
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (Array.isArray(questions)) {
        questions.forEach(question => {
          question.originalFile = filename;
          allQuestions.push(question);
        });
        stats.filesProcessed++;
      }
    } catch (error) {
      console.error(`❌ Error reading ${filename}:`, error.message);
      stats.errors++;
    }
  });
  
  console.log(`📊 Collected ${allQuestions.length} questions from ${stats.filesProcessed} files`);
  
  // Create backup of all files
  console.log('\n💾 Creating backups...');
  files.forEach(filename => {
    const sourcePath = path.join(QUESTIONS_DIR, filename);
    const backupPath = path.join(BACKUP_DIR, filename);
    fs.copyFileSync(sourcePath, backupPath);
  });
  
  // Group questions by their correct filename
  const questionsByFile = {};
  let questionsMoved = 0;
  
  allQuestions.forEach(question => {
    const correctFilename = getCorrectFilename(question);
    const originalFilename = question.originalFile;
    
    if (!questionsByFile[correctFilename]) {
      questionsByFile[correctFilename] = [];
    }
    
    // Remove the temporary originalFile property
    delete question.originalFile;
    
    questionsByFile[correctFilename].push(question);
    
    if (correctFilename !== originalFilename) {
      questionsMoved++;
    }
  });
  
  console.log(`\n📋 Questions will be distributed across ${Object.keys(questionsByFile).length} files`);
  console.log(`🔄 ${questionsMoved} questions need to be moved to correct files`);
  
  // Write questions to their correct files
  console.log('\n✍️ Writing reorganized files...');
  
  Object.entries(questionsByFile).forEach(([filename, questions]) => {
    try {
      const filePath = path.join(QUESTIONS_DIR, filename);
      const existedBefore = fs.existsSync(filePath);
      
      // Sort questions by ID for consistency
      questions.sort((a, b) => a._id.localeCompare(b._id));
      
      fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
      
      if (existedBefore) {
        stats.filesUpdated++;
        console.log(`✅ Updated ${filename} with ${questions.length} questions`);
      } else {
        stats.filesCreated++;
        console.log(`🆕 Created ${filename} with ${questions.length} questions`);
      }
      
    } catch (error) {
      console.error(`❌ Error writing ${filename}:`, error.message);
      stats.errors++;
    }
  });
  
  stats.questionsMoved = questionsMoved;
}

/**
 * Validate the reorganization
 */
function validateReorganization() {
  console.log('\n🔍 VALIDATING REORGANIZATION');
  console.log('='.repeat(30));
  
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  let totalQuestions = 0;
  let correctlyPlaced = 0;
  let misplaced = 0;
  
  files.forEach(filename => {
    try {
      const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, filename), 'utf8'));
      
      if (Array.isArray(questions)) {
        totalQuestions += questions.length;
        
        questions.forEach(question => {
          const correctFilename = getCorrectFilename(question);
          
          if (correctFilename === filename) {
            correctlyPlaced++;
          } else {
            misplaced++;
            console.log(`⚠️ Question in wrong file: ${question._id} in ${filename}, should be in ${correctFilename}`);
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error validating ${filename}:`, error.message);
    }
  });
  
  console.log(`📊 Validation results:`);
  console.log(`   Total questions: ${totalQuestions}`);
  console.log(`   Correctly placed: ${correctlyPlaced}`);
  console.log(`   Misplaced: ${misplaced}`);
  
  return misplaced === 0;
}

/**
 * Main execution
 */
function main() {
  console.log('Starting question file reorganization...\n');
  
  createBackupDir();
  reorganizeQuestions();
  const isValid = validateReorganization();
  
  console.log('\n📊 REORGANIZATION SUMMARY');
  console.log('='.repeat(30));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Questions moved: ${stats.questionsMoved}`);
  console.log(`Files created: ${stats.filesCreated}`);
  console.log(`Files updated: ${stats.filesUpdated}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Validation: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (isValid && stats.errors === 0) {
    console.log('\n🎉 SUCCESS! Question files have been reorganized correctly.');
    console.log('✅ All questions are now in their correct files based on subject');
    console.log('✅ Mathematical questions are in math files');
    console.log('✅ Thinking skills questions are in thinking-skills files');
    console.log('✅ Reading questions are in reading files');
    console.log('\n🔄 The subject categorization fix is now complete!');
  } else {
    console.log('\n⚠️ There were issues with the reorganization.');
    console.log('Please check the validation results above.');
  }
}

main();
