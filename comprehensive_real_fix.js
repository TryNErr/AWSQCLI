#!/usr/bin/env node

/**
 * Comprehensive Real Fix - Apply to All Files
 * 
 * Now that we've proven the concept works, apply the real fix to all files
 * that have pseudo-duplicates (same question types with minor variations)
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

function normalizeQuestionContent(content) {
  return content
    .replace(/\(Version \d+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getQuestionType(content) {
  const normalized = normalizeQuestionContent(content);
  
  // Math question types
  if (normalized.includes('solve the quadratic') || (normalized.includes('solve') && normalized.includes('x²'))) {
    return 'quadratic';
  }
  if (normalized.includes('what is') && normalized.includes('×') && !normalized.includes('matrix')) {
    return 'basic_multiplication';
  }
  if (normalized.includes('what is') && normalized.includes('+')) {
    return 'basic_addition';
  }
  if (normalized.includes('what is') && normalized.includes('-')) {
    return 'basic_subtraction';
  }
  if (normalized.includes('what is') && normalized.includes('÷')) {
    return 'basic_division';
  }
  if (normalized.includes('what is') && normalized.includes('%')) {
    return 'percentage';
  }
  if (normalized.includes('solve for x:') && !normalized.includes('x²')) {
    return 'linear_equation';
  }
  if (normalized.includes('system')) {
    return 'system_equations';
  }
  if (normalized.includes('slope')) {
    return 'slope';
  }
  if (normalized.includes('area') || normalized.includes('perimeter')) {
    return 'geometry_area';
  }
  if (normalized.includes('vertex')) {
    return 'vertex';
  }
  if (normalized.includes('factor')) {
    return 'factoring';
  }
  
  // English question types
  if (normalized.includes('which word is a noun')) {
    return 'noun_identification';
  }
  if (normalized.includes('past tense of')) {
    return 'past_tense';
  }
  if (normalized.includes('correct punctuation')) {
    return 'punctuation';
  }
  if (normalized.includes('literary device')) {
    return 'literary_device';
  }
  if (normalized.includes('subordinate clause')) {
    return 'subordinate_clause';
  }
  if (normalized.includes('subjunctive mood')) {
    return 'subjunctive_mood';
  }
  if (normalized.includes('adjective in this sentence')) {
    return 'adjective_identification';
  }
  if (normalized.includes('type of sentence')) {
    return 'sentence_type';
  }
  if (normalized.includes('should be capitalized')) {
    return 'capitalization';
  }
  
  // Reading question types
  if (normalized.includes('main idea')) {
    return 'main_idea';
  }
  if (normalized.includes('what can you infer')) {
    return 'inference';
  }
  if (normalized.includes('author\'s purpose') || normalized.includes('author\'s main purpose')) {
    return 'author_purpose';
  }
  
  // Thinking skills
  if (normalized.includes('complete the pattern')) {
    return 'pattern_completion';
  }
  if (normalized.includes('snail climbs')) {
    return 'snail_problem';
  }
  if (normalized.includes('tournament') && normalized.includes('games')) {
    return 'tournament_problem';
  }
  if (normalized.includes('friends sit in a row')) {
    return 'seating_arrangement';
  }
  if (normalized.includes('sequence follows the rule')) {
    return 'sequence_rule';
  }
  
  return 'other';
}

function scanAllFilesForPseudoDuplicates() {
  console.log('🔍 SCANNING ALL FILES FOR PSEUDO-DUPLICATES');
  console.log('===========================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const problemFiles = [];
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const filePath = path.join(QUESTIONS_DIR, file);
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Group by question type
      const typeGroups = new Map();
      questions.forEach(question => {
        const type = getQuestionType(question.content);
        if (!typeGroups.has(type)) {
          typeGroups.set(type, []);
        }
        typeGroups.get(type).push(question);
      });
      
      // Find problematic types (more than 3 of same type)
      const problems = [];
      typeGroups.forEach((group, type) => {
        if (group.length > 3) {
          problems.push({ type, count: group.length });
        }
      });
      
      if (problems.length > 0) {
        problemFiles.push({ file, problems, totalQuestions: questions.length });
        console.log(`❌ ${file}:`);
        problems.forEach(prob => {
          console.log(`   ${prob.type}: ${prob.count} questions`);
        });
      } else {
        console.log(`✅ ${file}: No pseudo-duplicates`);
      }
    }
  });
  
  console.log(`\n📊 SCAN RESULTS:`);
  console.log(`   Files with pseudo-duplicates: ${problemFiles.length}`);
  console.log(`   Clean files: ${files.length - 1 - problemFiles.length}`); // -1 for manifest.json
  
  return problemFiles;
}

function main() {
  console.log('🚀 COMPREHENSIVE PSEUDO-DUPLICATE DETECTION');
  console.log('==========================================\n');
  
  const problemFiles = scanAllFilesForPseudoDuplicates();
  
  if (problemFiles.length === 0) {
    console.log('\n🎉 SUCCESS: No pseudo-duplicates found in any files!');
    console.log('✅ All files have true question diversity');
  } else {
    console.log(`\n⚠️ Found ${problemFiles.length} files with pseudo-duplicates`);
    console.log('These files need the same treatment as 9_hard_math.json');
    
    problemFiles.forEach(item => {
      console.log(`\n${item.file}:`);
      item.problems.forEach(prob => {
        console.log(`  • ${prob.type}: ${prob.count} similar questions`);
      });
    });
  }
}

if (require.main === module) {
  main();
}
