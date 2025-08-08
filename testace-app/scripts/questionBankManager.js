#!/usr/bin/env node

/**
 * QUESTION BANK MANAGER
 * 
 * Manages question banks and adds more questions when they're running low.
 * Can add 100 more questions to any specific combination.
 * 
 * Usage:
 * - Check status: node scripts/questionBankManager.js status
 * - Add questions: node scripts/questionBankManager.js add 9 hard thinking-skills 100
 * - Check low banks: node scripts/questionBankManager.js check-low
 * - Auto-refill low banks: node scripts/questionBankManager.js auto-refill
 */

const fs = require('fs');
const path = require('path');
const BuildTimeQuestionGenerator = require('./generateQuestionFiles');

class QuestionBankManager {
  
  constructor() {
    this.questionsDir = path.join(__dirname, '../public/questions');
    this.manifestPath = path.join(this.questionsDir, 'manifest.json');
    this.lowThreshold = 10; // Consider bank "low" if < 10 questions
  }
  
  /**
   * Get current status of all question banks
   */
  async getStatus() {
    if (!fs.existsSync(this.manifestPath)) {
      console.log('❌ No manifest found. Run question generation first.');
      return null;
    }
    
    const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
    
    console.log('📊 Question Bank Status:');
    console.log(`   Generated: ${manifest.generated}`);
    console.log(`   Total combinations: ${manifest.totalCombinations}`);
    console.log(`   Total questions: ${manifest.totalQuestions}`);
    console.log('');
    
    const lowBanks = [];
    const stats = {
      total: 0,
      low: 0,
      empty: 0,
      healthy: 0
    };
    
    for (const [key, info] of Object.entries(manifest.combinations)) {
      const [grade, difficulty, subject] = key.split('_');
      const status = info.count === 0 ? '❌ EMPTY' : 
                    info.count < this.lowThreshold ? '⚠️  LOW' : '✅ OK';
      
      console.log(`   ${key.padEnd(20)} ${info.count.toString().padStart(3)} questions ${status}`);
      
      if (info.count === 0) {
        stats.empty++;
      } else if (info.count < this.lowThreshold) {
        stats.low++;
        lowBanks.push(key);
      } else {
        stats.healthy++;
      }
      stats.total++;
    }
    
    console.log('');
    console.log('📈 Summary:');
    console.log(`   Healthy banks: ${stats.healthy}`);
    console.log(`   Low banks: ${stats.low}`);
    console.log(`   Empty banks: ${stats.empty}`);
    
    if (lowBanks.length > 0) {
      console.log('');
      console.log('⚠️  Banks needing attention:');
      lowBanks.forEach(bank => console.log(`   - ${bank}`));
    }
    
    return { manifest, lowBanks, stats };
  }
  
  /**
   * Add more questions to a specific combination
   */
  async addQuestions(grade, difficulty, subject, count = 100) {
    console.log(`🔧 Adding ${count} questions to ${grade}_${difficulty}_${subject}...`);
    
    try {
      // Generate new questions
      const newQuestions = await BuildTimeQuestionGenerator.generateQuestionsForCombination(
        grade, difficulty, subject
      );
      
      if (newQuestions.length === 0) {
        console.log('❌ Failed to generate new questions');
        return false;
      }
      
      // Load existing questions
      const filename = `${grade}_${difficulty}_${subject}.json`;
      const filepath = path.join(this.questionsDir, filename);
      
      let existingQuestions = [];
      if (fs.existsSync(filepath)) {
        existingQuestions = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      }
      
      // Combine and deduplicate
      const combinedQuestions = [...existingQuestions, ...newQuestions.slice(0, count)];
      const uniqueQuestions = this.deduplicateQuestions(combinedQuestions);
      
      // Write back to file
      fs.writeFileSync(filepath, JSON.stringify(uniqueQuestions, null, 2));
      
      // Update manifest
      await this.updateManifest(grade, difficulty, subject, uniqueQuestions.length);
      
      const added = uniqueQuestions.length - existingQuestions.length;
      console.log(`✅ Added ${added} new questions (${existingQuestions.length} → ${uniqueQuestions.length})`);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to add questions:', error);
      return false;
    }
  }
  
  /**
   * Auto-refill all low question banks
   */
  async autoRefill() {
    console.log('🔄 Auto-refilling low question banks...');
    
    const status = await this.getStatus();
    if (!status || status.lowBanks.length === 0) {
      console.log('✅ No banks need refilling');
      return;
    }
    
    console.log(`📝 Refilling ${status.lowBanks.length} low banks...`);
    
    let successCount = 0;
    for (const bankKey of status.lowBanks) {
      const [grade, difficulty, subject] = bankKey.split('_');
      
      console.log(`\n🔧 Refilling ${bankKey}...`);
      const success = await this.addQuestions(grade, difficulty, subject, 100);
      
      if (success) {
        successCount++;
      }
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 Auto-refill complete: ${successCount}/${status.lowBanks.length} banks refilled`);
  }
  
  /**
   * Update the manifest file
   */
  async updateManifest(grade, difficulty, subject, newCount) {
    if (!fs.existsSync(this.manifestPath)) {
      console.warn('⚠️ Manifest not found, creating new one');
      return;
    }
    
    const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
    const key = `${grade}_${difficulty}_${subject}`;
    
    const oldCount = manifest.combinations[key]?.count || 0;
    
    manifest.combinations[key] = {
      filename: `${key}.json`,
      count: newCount,
      generated: new Date().toISOString()
    };
    
    // Update totals
    manifest.totalQuestions = manifest.totalQuestions - oldCount + newCount;
    manifest.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
  }
  
  /**
   * Remove duplicate questions based on content
   */
  deduplicateQuestions(questions) {
    const seen = new Set();
    const unique = [];
    
    for (const question of questions) {
      const key = question.content.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(question);
      }
    }
    
    return unique;
  }
  
  /**
   * Backup question banks
   */
  async backup() {
    const backupDir = path.join(this.questionsDir, 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Copy all question files
    const files = fs.readdirSync(this.questionsDir);
    let copiedFiles = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const sourcePath = path.join(this.questionsDir, file);
        const destPath = path.join(backupPath, file);
        
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
        
        fs.copyFileSync(sourcePath, destPath);
        copiedFiles++;
      }
    }
    
    console.log(`💾 Backup created: ${backupPath} (${copiedFiles} files)`);
    return backupPath;
  }
}

// CLI Interface
async function main() {
  const manager = new QuestionBankManager();
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'status':
      await manager.getStatus();
      break;
      
    case 'add':
      if (args.length < 4) {
        console.log('Usage: node questionBankManager.js add <grade> <difficulty> <subject> [count]');
        console.log('Example: node questionBankManager.js add 9 hard thinking-skills 100');
        process.exit(1);
      }
      const [, grade, difficulty, subject, countStr] = args;
      const count = parseInt(countStr) || 100;
      await manager.addQuestions(grade, difficulty, subject, count);
      break;
      
    case 'check-low':
      const status = await manager.getStatus();
      if (status && status.lowBanks.length > 0) {
        console.log(`\n⚠️  ${status.lowBanks.length} banks are running low`);
        process.exit(1); // Exit with error code for CI/CD
      } else {
        console.log('\n✅ All banks are healthy');
      }
      break;
      
    case 'auto-refill':
      await manager.autoRefill();
      break;
      
    case 'backup':
      await manager.backup();
      break;
      
    default:
      console.log('Question Bank Manager');
      console.log('');
      console.log('Commands:');
      console.log('  status                                    Show status of all question banks');
      console.log('  add <grade> <difficulty> <subject> [count]  Add questions to specific bank');
      console.log('  check-low                                Check for low question banks');
      console.log('  auto-refill                              Automatically refill low banks');
      console.log('  backup                                   Create backup of all question banks');
      console.log('');
      console.log('Examples:');
      console.log('  node questionBankManager.js status');
      console.log('  node questionBankManager.js add 9 hard thinking-skills 100');
      console.log('  node questionBankManager.js auto-refill');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = QuestionBankManager;
