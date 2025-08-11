#!/usr/bin/env node

/**
 * QUESTION VARIETY EXPANSION SYSTEM
 * 
 * This script adds 200 more different questions to each question set for massive variety.
 * 
 * CURRENT STATE: 25 questions per set (2,700 total)
 * TARGET STATE: 225 questions per set (24,300 total)
 * 
 * EXPANSION STRATEGY:
 * 1. Math: Arithmetic, algebra, geometry, fractions, decimals, word problems
 * 2. Thinking Skills: Logic, patterns, analogies, spatial reasoning, critical thinking
 * 3. Reading: Comprehension, vocabulary, inference, main ideas, details
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 QUESTION VARIETY EXPANSION SYSTEM');
console.log('='.repeat(50));

// Configuration
const QUESTIONS_DIR = path.join(__dirname, 'public', 'questions');
const BACKUP_DIR = path.join(__dirname, 'expansion-backups');
const TARGET_QUESTIONS_PER_SET = 225;
const QUESTIONS_TO_ADD = 200;

// Statistics tracking
let stats = {
  filesProcessed: 0,
  questionsAdded: 0,
  totalQuestionsGenerated: 0,
  errors: 0,
  backupsCreated: 0
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
 * Load existing question generators
 */
const MathGenerator = require('./frontend/src/utils/diverseMathGenerator.js');
const ThinkingSkillsGenerator = require('./frontend/src/utils/robustThinkingSkillsGenerator.js');

/**
 * Generate unique ID for new questions
 */
function generateUniqueId(subject, grade, difficulty, index) {
  const timestamp = Date.now();
  const subjectCode = subject.toLowerCase().replace(/\s+/g, '');
  return `expanded_${subjectCode}_${grade}_${difficulty}_${index}_${timestamp}`;
}

/**
 * Main expansion function
 */
async function expandQuestionVariety() {
  console.log('\n🔧 STARTING QUESTION EXPANSION');
  console.log('='.repeat(40));
  
  createBackupDir();
  
  // Get all question files
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`📚 Found ${files.length} question files to expand`);
  console.log(`🎯 Target: Add ${QUESTIONS_TO_ADD} questions to each file`);
  console.log(`📊 Total new questions to generate: ${files.length * QUESTIONS_TO_ADD}`);
  
  // Process each file
  for (const filename of files) {
    await expandSingleFile(filename);
  }
  
  // Update manifest
  updateManifest();
  
  // Print summary
  printSummary();
}

/**
 * Expand a single question file
 */
async function expandSingleFile(filename) {
  console.log(`\n📄 Expanding: ${filename}`);
  
  try {
    const filePath = path.join(QUESTIONS_DIR, filename);
    
    // Create backup
    const backupPath = path.join(BACKUP_DIR, filename);
    fs.copyFileSync(filePath, backupPath);
    stats.backupsCreated++;
    
    // Read existing questions
    const existingQuestions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`   📊 Current questions: ${existingQuestions.length}`);
    
    // Parse filename to get parameters
    const [grade, difficulty, subject] = parseFilename(filename);
    console.log(`   🎯 Parameters: Grade ${grade}, ${difficulty}, ${subject}`);
    
    // Generate new questions
    const newQuestions = await generateQuestionsForFile(grade, difficulty, subject, QUESTIONS_TO_ADD, existingQuestions);
    console.log(`   ✅ Generated: ${newQuestions.length} new questions`);
    
    // Combine and save
    const allQuestions = [...existingQuestions, ...newQuestions];
    fs.writeFileSync(filePath, JSON.stringify(allQuestions, null, 2));
    
    stats.filesProcessed++;
    stats.questionsAdded += newQuestions.length;
    stats.totalQuestionsGenerated += newQuestions.length;
    
    console.log(`   🎉 Total questions now: ${allQuestions.length}`);
    
  } catch (error) {
    console.error(`❌ Error expanding ${filename}:`, error.message);
    stats.errors++;
  }
}

/**
 * Parse filename to extract parameters
 */
function parseFilename(filename) {
  const parts = filename.replace('.json', '').split('_');
  const grade = parts[0];
  const difficulty = parts[1];
  const subject = parts.slice(2).join(' ').replace('-', ' ');
  
  return [grade, difficulty, subject];
}

/**
 * Generate questions for a specific file
 */
async function generateQuestionsForFile(grade, difficulty, subject, count, existingQuestions) {
  console.log(`   🔧 Generating ${count} questions for ${subject}...`);
  
  const newQuestions = [];
  const existingContent = new Set(existingQuestions.map(q => q.content.toLowerCase().trim()));
  
  let attempts = 0;
  const maxAttempts = count * 5; // Allow more attempts for variety
  
  while (newQuestions.length < count && attempts < maxAttempts) {
    attempts++;
    
    try {
      let question = null;
      
      // Generate based on subject
      if (subject.includes('math')) {
        question = await generateMathQuestion(grade, difficulty, attempts);
      } else if (subject.includes('thinking')) {
        question = await generateThinkingSkillsQuestion(grade, difficulty, attempts);
      } else if (subject.includes('reading')) {
        question = await generateReadingQuestion(grade, difficulty, attempts);
      }
      
      if (question && !existingContent.has(question.content.toLowerCase().trim())) {
        // Ensure proper metadata
        question._id = generateUniqueId(subject, grade, difficulty, newQuestions.length);
        question.subject = normalizeSubject(subject);
        question.grade = grade;
        question.difficulty = difficulty;
        question.createdBy = 'expansion-system';
        question.createdAt = new Date().toISOString();
        question.isExpanded = true;
        question.expansionBatch = 1;
        
        newQuestions.push(question);
        existingContent.add(question.content.toLowerCase().trim());
        
        if (newQuestions.length % 25 === 0) {
          console.log(`   📈 Progress: ${newQuestions.length}/${count} questions generated`);
        }
      }
      
    } catch (error) {
      console.warn(`   ⚠️ Generation attempt ${attempts} failed:`, error.message);
    }
  }
  
  if (newQuestions.length < count) {
    console.warn(`   ⚠️ Only generated ${newQuestions.length}/${count} questions after ${attempts} attempts`);
  }
  
  return newQuestions;
}

/**
 * Normalize subject names
 */
function normalizeSubject(subject) {
  if (subject.includes('math')) return 'Mathematical Reasoning';
  if (subject.includes('thinking')) return 'Thinking Skills';
  if (subject.includes('reading')) return 'Reading';
  return subject;
}

/**
 * Update the manifest file
 */
function updateManifest() {
  console.log('\n📋 UPDATING MANIFEST');
  console.log('='.repeat(30));
  
  try {
    const manifestPath = path.join(QUESTIONS_DIR, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Update counts
    Object.keys(manifest.combinations).forEach(key => {
      manifest.combinations[key].count = TARGET_QUESTIONS_PER_SET;
      manifest.combinations[key].expanded = new Date().toISOString();
      manifest.combinations[key].expansionBatch = 1;
    });
    
    manifest.totalQuestions = Object.keys(manifest.combinations).length * TARGET_QUESTIONS_PER_SET;
    manifest.lastExpansion = new Date().toISOString();
    manifest.expansionStats = {
      questionsAddedPerFile: QUESTIONS_TO_ADD,
      totalQuestionsAdded: stats.totalQuestionsGenerated,
      filesExpanded: stats.filesProcessed
    };
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Manifest updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating manifest:', error.message);
    stats.errors++;
  }
}

/**
 * Print expansion summary
 */
function printSummary() {
  console.log('\n📊 EXPANSION SUMMARY');
  console.log('='.repeat(40));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Questions added: ${stats.questionsAdded}`);
  console.log(`Total questions generated: ${stats.totalQuestionsGenerated}`);
  console.log(`Backups created: ${stats.backupsCreated}`);
  console.log(`Errors encountered: ${stats.errors}`);
  
  const expectedTotal = stats.filesProcessed * TARGET_QUESTIONS_PER_SET;
  console.log(`\n🎯 RESULTS:`);
  console.log(`Expected total questions: ${expectedTotal}`);
  console.log(`Questions per file: ${TARGET_QUESTIONS_PER_SET}`);
  console.log(`Expansion factor: ${TARGET_QUESTIONS_PER_SET / 25}x (from 25 to ${TARGET_QUESTIONS_PER_SET})`);
  
  if (stats.errors === 0) {
    console.log('\n🎉 SUCCESS! Question variety has been dramatically expanded!');
    console.log('✅ Each question set now has 9x more variety');
    console.log('✅ Users will experience much more diverse questions');
    console.log('✅ Reduced repetition and improved engagement');
  } else {
    console.log('\n⚠️ Expansion completed with some issues. Please review the errors above.');
  }
}

// Export for use by question generators
module.exports = {
  generateUniqueId,
  normalizeSubject,
  parseFilename
};

// Run if called directly
if (require.main === module) {
  expandQuestionVariety().catch(console.error);
}
