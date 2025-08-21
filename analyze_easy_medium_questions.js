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
            sampleContent: [],
            questionTypes: new Set()
        };
        
        // Analyze all questions for template/fake content
        questions.forEach((q, index) => {
            let isFake = false;
            const issues = [];
            
            // Track question types
            if (q.content) {
                if (q.content.length < 30) analysis.questionTypes.add('very_short');
                if (q.content.includes('What is') && q.content.length < 50) analysis.questionTypes.add('generic_what_is');
                if (q.content.includes('Which') && q.content.length < 40) analysis.questionTypes.add('generic_which');
            }
            
            // Check for template content patterns
            if (q.content && (
                q.content.includes('Question ') && q.content.includes('Grade ') && q.content.includes('level') ||
                q.content.includes('Challenging') && q.content.includes('question for Grade') ||
                q.content.includes('What is an important concept') ||
                q.content.includes('Which skill is essential') ||
                q.content.includes('Easy') && q.content.includes('question for Grade') ||
                q.content.includes('Medium') && q.content.includes('question for Grade') ||
                q.content.match(/^(Easy|Medium|Hard|Challenging).*(question|concept|skill).*(Grade \d+)/i) ||
                q.content.match(/^Grade \d+ (easy|medium|hard) .* question \d+$/i)
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
                q.options.some(opt => opt.match(/^(Option|Concept|Skill) [A-D1-4]$/)) ||
                q.options.some(opt => opt === 'A' || opt === 'B' || opt === 'C' || opt === 'D')
            )) {
                isFake = true;
                issues.push('Generic template options');
            }
            
            // Check for template explanations
            if (q.explanation && (
                q.explanation.includes('This is a properly challenging') ||
                q.explanation.includes('This tests understanding of') ||
                q.explanation.includes('appropriate for Grade') ||
                q.explanation.match(/This is.*(properly|appropriately).*(challenging|tests)/i) ||
                q.explanation.match(/This is a Grade \d+ (easy|medium|hard)/i)
            )) {
                isFake = true;
                issues.push('Template explanation');
            }
            
            // Check for very generic content
            if (q.content && q.content.length < 25 && !q.content.includes('?')) {
                issues.push('Very short/generic content');
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

// Get all easy and medium question files
const allFiles = fs.readdirSync(questionsDir).filter(f => 
    f.endsWith('.json') && 
    f !== 'manifest.json' && 
    f !== 'version.json' &&
    (f.includes('_easy_') || f.includes('_medium_'))
);

console.log('=== EASY & MEDIUM DIFFICULTY ANALYSIS ===\n');

const results = {
    good: [],
    needsFix: [],
    errors: [],
    byDifficulty: { easy: { good: 0, bad: 0 }, medium: { good: 0, bad: 0 } }
};

const gradeStats = {};

allFiles.forEach(filename => {
    const analysis = analyzeQuestionFile(filename);
    
    if (analysis.error) {
        results.errors.push(filename);
        console.log(`❌ ${filename}: ${analysis.error}`);
        return;
    }
    
    // Extract grade, difficulty, and subject info
    const match = filename.match(/^(\d+)_(easy|medium)_(.+)\.json$/);
    if (match) {
        const [, grade, difficulty, subject] = match;
        if (!gradeStats[grade]) gradeStats[grade] = { easy: { good: 0, bad: 0 }, medium: { good: 0, bad: 0 } };
        
        if (analysis.hasRealContent) {
            gradeStats[grade][difficulty].good++;
            results.byDifficulty[difficulty].good++;
        } else {
            gradeStats[grade][difficulty].bad++;
            results.byDifficulty[difficulty].bad++;
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

console.log('\n=== SUMMARY BY DIFFICULTY ===');
console.log(`Easy Questions: ${results.byDifficulty.easy.good} good, ${results.byDifficulty.easy.bad} need fixing`);
console.log(`Medium Questions: ${results.byDifficulty.medium.good} good, ${results.byDifficulty.medium.bad} need fixing`);

console.log('\n=== SUMMARY BY GRADE (Easy/Medium only) ===');
Object.keys(gradeStats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(grade => {
    const stats = gradeStats[grade];
    const easyTotal = stats.easy.good + stats.easy.bad;
    const mediumTotal = stats.medium.good + stats.medium.bad;
    const easyPercent = easyTotal > 0 ? Math.round((stats.easy.good / easyTotal) * 100) : 100;
    const mediumPercent = mediumTotal > 0 ? Math.round((stats.medium.good / mediumTotal) * 100) : 100;
    
    console.log(`Grade ${grade}: Easy ${stats.easy.good}/${easyTotal} (${easyPercent}%), Medium ${stats.medium.good}/${mediumTotal} (${mediumPercent}%)`);
});

console.log('\n=== OVERALL SUMMARY ===');
console.log(`✅ Good Files: ${results.good.length}`);
console.log(`🚨 Need Fixing: ${results.needsFix.length}`);
console.log(`❌ Errors: ${results.errors.length}`);

if (results.needsFix.length > 0) {
    console.log('\n📋 EASY/MEDIUM FILES THAT NEED FIXING:');
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

// Export results for fixing
const exportData = {
    needsFix: results.needsFix.map(item => ({
        filename: item.filename,
        fakeQuestions: item.analysis.fakeQuestions,
        totalQuestions: item.analysis.totalQuestions,
        sampleContent: item.analysis.sampleContent
    })),
    timestamp: new Date().toISOString()
};

fs.writeFileSync('/workspaces/AWSQCLI/easy_medium_analysis_results.json', JSON.stringify(exportData, null, 2));
console.log('\n💾 Easy/Medium analysis results saved to easy_medium_analysis_results.json');
