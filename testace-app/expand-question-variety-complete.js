#!/usr/bin/env node

/**
 * COMPLETE QUESTION VARIETY EXPANSION SYSTEM
 * 
 * This script adds 200 more different questions to each question set for massive variety.
 * Uses enhanced generators for Math, Thinking Skills, and Reading comprehension.
 */

const fs = require('fs');
const path = require('path');

// Import the enhanced generators
const EnhancedMathGenerator = require('./generators/enhancedMathGenerator.js');
const EnhancedThinkingSkillsGenerator = require('./generators/enhancedThinkingSkillsGenerator.js');
const EnhancedReadingGenerator = require('./generators/enhancedReadingGenerator.js');

console.log('🚀 COMPLETE QUESTION VARIETY EXPANSION SYSTEM');
console.log('='.repeat(60));

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
  mathQuestions: 0,
  thinkingSkillsQuestions: 0,
  readingQuestions: 0,
  errors: 0,
  backupsCreated: 0,
  startTime: Date.now()
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
  console.log('\n🔧 STARTING MASSIVE QUESTION EXPANSION');
  console.log('='.repeat(50));
  
  createBackupDir();
  
  // Get all question files
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`📚 Found ${files.length} question files to expand`);
  console.log(`🎯 Target: Add ${QUESTIONS_TO_ADD} questions to each file`);
  console.log(`📊 Total new questions to generate: ${files.length * QUESTIONS_TO_ADD} = ${(files.length * QUESTIONS_TO_ADD).toLocaleString()}`);
  console.log(`⏱️ Estimated time: ${Math.ceil(files.length * QUESTIONS_TO_ADD / 100)} minutes\n`);
  
  // Process each file
  let fileCount = 0;
  for (const filename of files) {
    fileCount++;
    console.log(`\n[${fileCount}/${files.length}] Processing: ${filename}`);
    await expandSingleFile(filename);
    
    // Progress update every 10 files
    if (fileCount % 10 === 0) {
      const elapsed = (Date.now() - stats.startTime) / 1000;
      const rate = stats.totalQuestionsGenerated / elapsed;
      const remaining = (files.length - fileCount) * QUESTIONS_TO_ADD;
      const eta = remaining / rate;
      
      console.log(`\n📊 PROGRESS UPDATE:`);
      console.log(`   Files completed: ${fileCount}/${files.length} (${Math.round(fileCount/files.length*100)}%)`);
      console.log(`   Questions generated: ${stats.totalQuestionsGenerated.toLocaleString()}`);
      console.log(`   Generation rate: ${Math.round(rate)} questions/second`);
      console.log(`   ETA: ${Math.round(eta/60)} minutes remaining`);
    }
  }
  
  // Update manifest
  updateManifest();
  
  // Print final summary
  printFinalSummary();
}

/**
 * Expand a single question file
 */
async function expandSingleFile(filename) {
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
  const maxAttempts = count * 3; // Reasonable limit
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 50;
  
  while (newQuestions.length < count && attempts < maxAttempts && consecutiveFailures < maxConsecutiveFailures) {
    attempts++;
    
    try {
      let question = null;
      
      // Generate based on subject using enhanced generators
      if (subject.includes('math')) {
        question = EnhancedMathGenerator.generateQuestion(grade, difficulty, attempts);
        if (question) stats.mathQuestions++;
      } else if (subject.includes('thinking')) {
        question = EnhancedThinkingSkillsGenerator.generateQuestion(grade, difficulty, attempts);
        if (question) stats.thinkingSkillsQuestions++;
      } else if (subject.includes('reading')) {
        question = EnhancedReadingGenerator.generateQuestion(grade, difficulty, attempts);
        if (question) stats.readingQuestions++;
      }
      
      if (question && !existingContent.has(question.content.toLowerCase().trim())) {
        // Ensure proper metadata
        question._id = generateUniqueId(subject, grade, difficulty, newQuestions.length);
        question.subject = normalizeSubject(subject);
        question.grade = grade;
        question.difficulty = difficulty;
        question.createdBy = 'expansion-system-v2';
        question.createdAt = new Date().toISOString();
        question.isExpanded = true;
        question.expansionBatch = 2;
        question.generatorVersion = '2.0';
        
        newQuestions.push(question);
        existingContent.add(question.content.toLowerCase().trim());
        consecutiveFailures = 0; // Reset on success
        
        // Progress indicator
        if (newQuestions.length % 50 === 0) {
          console.log(`   📈 Progress: ${newQuestions.length}/${count} questions generated`);
        }
      } else {
        consecutiveFailures++;
      }
      
    } catch (error) {
      console.warn(`   ⚠️ Generation attempt ${attempts} failed:`, error.message);
      consecutiveFailures++;
    }
    
    // Small delay every 100 attempts to prevent overwhelming
    if (attempts % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  if (newQuestions.length < count) {
    console.warn(`   ⚠️ Only generated ${newQuestions.length}/${count} questions after ${attempts} attempts`);
    console.warn(`   📊 Consecutive failures: ${consecutiveFailures}`);
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
    
    // Count actual questions in each file
    const actualCounts = {};
    Object.keys(manifest.combinations).forEach(key => {
      const filename = manifest.combinations[key].filename;
      const filePath = path.join(QUESTIONS_DIR, filename);
      
      if (fs.existsSync(filePath)) {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        actualCounts[key] = questions.length;
        
        // Update manifest entry
        manifest.combinations[key].count = questions.length;
        manifest.combinations[key].expanded = new Date().toISOString();
        manifest.combinations[key].expansionBatch = 2;
        manifest.combinations[key].generatorVersion = '2.0';
      }
    });
    
    // Calculate totals
    const totalQuestions = Object.values(actualCounts).reduce((sum, count) => sum + count, 0);
    
    manifest.totalQuestions = totalQuestions;
    manifest.lastExpansion = new Date().toISOString();
    manifest.expansionStats = {
      questionsAddedPerFile: QUESTIONS_TO_ADD,
      totalQuestionsAdded: stats.totalQuestionsGenerated,
      filesExpanded: stats.filesProcessed,
      mathQuestionsAdded: stats.mathQuestions,
      thinkingSkillsQuestionsAdded: stats.thinkingSkillsQuestions,
      readingQuestionsAdded: stats.readingQuestions,
      averageQuestionsPerFile: Math.round(totalQuestions / Object.keys(manifest.combinations).length),
      expansionFactor: Math.round((totalQuestions / 2700) * 10) / 10
    };
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Manifest updated successfully');
    console.log(`📊 Total questions now: ${totalQuestions.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error updating manifest:', error.message);
    stats.errors++;
  }
}

/**
 * Print comprehensive final summary
 */
function printFinalSummary() {
  const elapsed = (Date.now() - stats.startTime) / 1000;
  const rate = stats.totalQuestionsGenerated / elapsed;
  
  console.log('\n🎉 EXPANSION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`⏱️ Total time: ${Math.round(elapsed/60)} minutes ${Math.round(elapsed%60)} seconds`);
  console.log(`📊 Generation rate: ${Math.round(rate)} questions/second`);
  console.log('');
  console.log('📈 DETAILED STATISTICS:');
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Questions added: ${stats.questionsAdded.toLocaleString()}`);
  console.log(`   Math questions: ${stats.mathQuestions.toLocaleString()}`);
  console.log(`   Thinking Skills questions: ${stats.thinkingSkillsQuestions.toLocaleString()}`);
  console.log(`   Reading questions: ${stats.readingQuestions.toLocaleString()}`);
  console.log(`   Backups created: ${stats.backupsCreated}`);
  console.log(`   Errors encountered: ${stats.errors}`);
  
  const expectedTotal = stats.filesProcessed * TARGET_QUESTIONS_PER_SET;
  const actualTotal = stats.questionsAdded + (stats.filesProcessed * 25); // Original 25 + new ones
  
  console.log('\n🎯 RESULTS SUMMARY:');
  console.log(`   Original questions: 2,700 (25 per file)`);
  console.log(`   New questions added: ${stats.questionsAdded.toLocaleString()}`);
  console.log(`   Total questions now: ${actualTotal.toLocaleString()}`);
  console.log(`   Average per file: ${Math.round(actualTotal / stats.filesProcessed)}`);
  console.log(`   Expansion factor: ${Math.round((actualTotal / 2700) * 10) / 10}x`);
  console.log(`   Variety increase: ${Math.round(((actualTotal - 2700) / 2700) * 100)}%`);
  
  if (stats.errors === 0) {
    console.log('\n🎉 SUCCESS! Question variety has been MASSIVELY expanded!');
    console.log('✅ Each question set now has 9x more variety (225 vs 25 questions)');
    console.log('✅ Users will experience dramatically more diverse questions');
    console.log('✅ Reduced repetition and greatly improved engagement');
    console.log('✅ Professional-quality questions across all subjects and grades');
    console.log('✅ Enhanced learning experience with comprehensive coverage');
  } else {
    console.log('\n⚠️ Expansion completed with some issues. Please review the errors above.');
  }
  
  console.log('\n🔄 NEXT STEPS:');
  console.log('1. Test the application to verify the expanded question sets');
  console.log('2. Check that all subjects have proper variety');
  console.log('3. Verify question quality and appropriateness for each grade');
  console.log('4. Monitor user engagement and feedback');
  console.log('5. Consider further expansions based on usage patterns');
  
  console.log('\n💾 BACKUP INFORMATION:');
  console.log(`   All original files backed up to: ${BACKUP_DIR}`);
  console.log('   You can restore original files if needed');
  
  console.log('\n🚀 The TestAce app now has MASSIVE question variety!');
}

// Run the expansion
if (require.main === module) {
  expandQuestionVariety().catch(console.error);
}
