const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Get all reading files
const readingFiles = fs.readdirSync(questionsDir)
  .filter(f => f.includes('_reading.json'))
  .sort();

console.log(`🔍 Checking duplicates in ${readingFiles.length} reading files...\n`);

const duplicateReport = [];
let totalFiles = 0;
let filesWithDuplicates = 0;
let totalDuplicates = 0;

readingFiles.forEach(filename => {
  try {
    const filePath = path.join(questionsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    totalFiles++;
    
    // Check for duplicates by content
    const contentMap = new Map();
    const duplicates = [];
    
    questions.forEach((q, index) => {
      // Use first 100 characters of content as key for duplicate detection
      const contentKey = q.content ? q.content.substring(0, 100).trim() : `empty_${index}`;
      
      if (contentMap.has(contentKey)) {
        duplicates.push({
          index: index + 1,
          duplicateOf: contentMap.get(contentKey) + 1,
          content: contentKey
        });
      } else {
        contentMap.set(contentKey, index);
      }
    });
    
    const uniqueQuestions = contentMap.size;
    const duplicateCount = duplicates.length;
    
    if (duplicateCount > 0) {
      filesWithDuplicates++;
      totalDuplicates += duplicateCount;
      
      console.log(`❌ ${filename}:`);
      console.log(`   Total questions: ${questions.length}`);
      console.log(`   Unique questions: ${uniqueQuestions}`);
      console.log(`   Duplicates: ${duplicateCount}`);
      console.log(`   Quality: ${Math.round((uniqueQuestions / questions.length) * 100)}% unique`);
      
      duplicateReport.push({
        filename,
        totalQuestions: questions.length,
        uniqueQuestions,
        duplicates: duplicateCount,
        qualityPercent: Math.round((uniqueQuestions / questions.length) * 100)
      });
      
      // Show first few duplicates
      duplicates.slice(0, 3).forEach(dup => {
        console.log(`     Question ${dup.index} = Question ${dup.duplicateOf}`);
      });
      if (duplicates.length > 3) {
        console.log(`     ... and ${duplicates.length - 3} more duplicates`);
      }
    } else {
      console.log(`✅ ${filename}: ${questions.length} questions, all unique`);
    }
    
  } catch (error) {
    console.log(`❌ ${filename}: Error reading file - ${error.message}`);
  }
});

console.log(`\n📊 DUPLICATE SUMMARY:`);
console.log(`   Total reading files: ${totalFiles}`);
console.log(`   Files with duplicates: ${filesWithDuplicates}`);
console.log(`   Files with unique content: ${totalFiles - filesWithDuplicates}`);
console.log(`   Total duplicate questions: ${totalDuplicates}`);

if (duplicateReport.length > 0) {
  console.log(`\n🔧 FILES NEEDING DUPLICATE REMOVAL:`);
  duplicateReport
    .sort((a, b) => a.qualityPercent - b.qualityPercent) // Worst quality first
    .forEach(report => {
      console.log(`   ${report.filename}: ${report.qualityPercent}% unique (${report.duplicates} duplicates)`);
    });
  
  console.log(`\n⚠️  QUALITY IMPACT:`);
  const avgQuality = duplicateReport.reduce((sum, r) => sum + r.qualityPercent, 0) / duplicateReport.length;
  console.log(`   Average uniqueness: ${Math.round(avgQuality)}%`);
  console.log(`   Educational value significantly reduced by duplicates`);
}

// Export results for fixing
const exportData = {
  filesWithDuplicates: duplicateReport,
  summary: {
    totalFiles,
    filesWithDuplicates,
    totalDuplicates,
    averageQuality: duplicateReport.length > 0 ? Math.round(duplicateReport.reduce((sum, r) => sum + r.qualityPercent, 0) / duplicateReport.length) : 100
  },
  timestamp: new Date().toISOString()
};

fs.writeFileSync('/workspaces/AWSQCLI/reading_duplicates_report.json', JSON.stringify(exportData, null, 2));
console.log(`\n💾 Duplicate report saved to reading_duplicates_report.json`);
