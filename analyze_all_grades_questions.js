const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

function analyzeQuestionFile(filename) {
    const filePath = path.join(questionsDir, filename);
    
    if (!fs.existsSync(filePath)) {
        return { error: `File not found: ${filename}` };
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const questions = JSON.parse(content);
        
        const analysis = {
            filename,
            totalQuestions: questions.length,
            hasRealContent: true,
            issues: [],
            fakeQuestions: 0,
            sampleContent: []
        };
        
        // Analyze all questions for template/fake content
        questions.forEach((q, index) => {
            let isFake = false;
            const issues = [];
            
            // Check for template content patterns
            if (q.content && (
                q.content.includes('Question ') && q.content.includes('Grade ') && q.content.includes('level') ||
                q.content.includes('Challenging') && q.content.includes('question for Grade') ||
                q.content.includes('What is an important concept') ||
                q.content.includes('Which skill is essential') ||
                q.content.match(/^(Easy|Medium|Hard|Challenging).*(question|concept|skill).*(Grade \d+)/i)
            )) {
                isFake = true;
                issues.push('Template content pattern');
            }
            
            // Check for generic options
            if (q.options && (
                q.options.includes('Option A') || 
                q.options.includes('Option B') ||
                q.options.includes('Concept A') ||
                q.options.includes('Skill 1') ||
                q.options.some(opt => opt.match(/^(Option|Concept|Skill) [A-D1-4]$/))
            )) {
                isFake = true;
                issues.push('Generic template options');
            }
            
            // Check for template explanations
            if (q.explanation && (
                q.explanation.includes('This is a properly challenging') ||
                q.explanation.includes('This tests understanding of') ||
                q.explanation.includes('appropriate for Grade') ||
                q.explanation.match(/This is.*(properly|appropriately).*(challenging|tests)/i)
            )) {
                isFake = true;
                issues.push('Template explanation');
            }
            
            if (isFake) {
                analysis.fakeQuestions++;
                if (analysis.sampleContent.length < 3) {
                    analysis.sampleContent.push({
                        index: index + 1,
                        content: q.content.substring(0, 80) + '...',
                        issues: issues
                    });
                }
            }
        });
        
        if (analysis.fakeQuestions > 0) {
            analysis.hasRealContent = false;
            analysis.issues.push(`${analysis.fakeQuestions} fake/template questions found`);
        }
        
        return analysis;
        
    } catch (error) {
        return { error: `Error parsing ${filename}: ${error.message}` };
    }
}

// Get all question files
const allFiles = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'version.json');

console.log('=== COMPREHENSIVE QUESTION QUALITY ANALYSIS ===\n');

const results = {
    good: [],
    needsFix: [],
    errors: []
};

const gradeStats = {};

allFiles.forEach(filename => {
    const analysis = analyzeQuestionFile(filename);
    
    if (analysis.error) {
        results.errors.push(filename);
        console.log(`❌ ${filename}: ${analysis.error}`);
        return;
    }
    
    // Extract grade and subject info
    const match = filename.match(/^(\d+)_(easy|medium|hard)_(.+)\.json$/);
    if (match) {
        const [, grade, difficulty, subject] = match;
        if (!gradeStats[grade]) gradeStats[grade] = { good: 0, bad: 0, total: 0 };
        gradeStats[grade].total++;
        
        if (analysis.hasRealContent) {
            gradeStats[grade].good++;
        } else {
            gradeStats[grade].bad++;
        }
    }
    
    if (analysis.hasRealContent) {
        results.good.push(filename);
        console.log(`✅ ${filename}: ${analysis.totalQuestions} authentic questions`);
    } else {
        results.needsFix.push({
            filename,
            analysis
        });
        console.log(`🚨 ${filename}: ${analysis.fakeQuestions}/${analysis.totalQuestions} fake questions`);
        if (analysis.sampleContent.length > 0) {
            console.log(`   Sample: "${analysis.sampleContent[0].content}"`);
        }
    }
});

console.log('\n=== SUMMARY BY GRADE ===');
Object.keys(gradeStats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(grade => {
    const stats = gradeStats[grade];
    const percentage = Math.round((stats.good / stats.total) * 100);
    console.log(`Grade ${grade}: ${stats.good}/${stats.total} files good (${percentage}%)`);
});

console.log('\n=== OVERALL SUMMARY ===');
console.log(`✅ Good Files: ${results.good.length}`);
console.log(`🚨 Need Fixing: ${results.needsFix.length}`);
console.log(`❌ Errors: ${results.errors.length}`);

if (results.needsFix.length > 0) {
    console.log('\n📋 FILES THAT NEED FIXING:');
    results.needsFix.forEach(item => {
        console.log(`   🔧 ${item.filename} (${item.analysis.fakeQuestions} fake questions)`);
    });
    
    console.log('\n🎯 PRIORITY ORDER (most fake questions first):');
    results.needsFix
        .sort((a, b) => b.analysis.fakeQuestions - a.analysis.fakeQuestions)
        .forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.filename} - ${item.analysis.fakeQuestions} fake questions`);
        });
}

// Export results for use by fixing script
const exportData = {
    needsFix: results.needsFix.map(item => ({
        filename: item.filename,
        fakeQuestions: item.analysis.fakeQuestions,
        totalQuestions: item.analysis.totalQuestions,
        sampleContent: item.analysis.sampleContent
    })),
    timestamp: new Date().toISOString()
};

fs.writeFileSync('/workspaces/AWSQCLI/question_analysis_results.json', JSON.stringify(exportData, null, 2));
console.log('\n💾 Analysis results saved to question_analysis_results.json');
