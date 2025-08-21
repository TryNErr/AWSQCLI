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
            sampleQuestions: [],
            issues: []
        };
        
        // Check first 3 questions for template/fake content
        for (let i = 0; i < Math.min(3, questions.length); i++) {
            const q = questions[i];
            analysis.sampleQuestions.push({
                id: q._id,
                content: q.content.substring(0, 100) + (q.content.length > 100 ? '...' : ''),
                hasRealOptions: q.options && !q.options.some(opt => opt.includes('Option'))
            });
            
            // Check for template content
            if (q.content.includes('Question ') && q.content.includes('Grade 5') && q.content.includes('level')) {
                analysis.hasRealContent = false;
                analysis.issues.push('Contains template content');
            }
            
            if (q.options && q.options.some(opt => opt === 'Option A' || opt === 'Option B')) {
                analysis.hasRealContent = false;
                analysis.issues.push('Contains template options');
            }
        }
        
        return analysis;
        
    } catch (error) {
        return { error: `Error parsing ${filename}: ${error.message}` };
    }
}

console.log('=== Grade 5 Question Quality Analysis ===\n');

const grade5Files = [
    '5_easy_math.json',
    '5_medium_math.json', 
    '5_hard_math.json',
    '5_easy_english.json',
    '5_medium_english.json',
    '5_hard_english.json',
    '5_easy_thinking-skills.json',
    '5_medium_thinking-skills.json',
    '5_hard_thinking-skills.json',
    '5_easy_reading.json',
    '5_medium_reading.json',
    '5_hard_reading.json',
    '5_easy_mathematical-reasoning.json',
    '5_medium_mathematical-reasoning.json',
    '5_hard_mathematical-reasoning.json'
];

const results = {
    fixed: [],
    alreadyGood: [],
    stillNeedWork: [],
    notFound: []
};

grade5Files.forEach(filename => {
    const analysis = analyzeQuestionFile(filename);
    
    if (analysis.error) {
        results.notFound.push(filename);
        console.log(`❌ ${filename}: ${analysis.error}`);
        return;
    }
    
    if (analysis.hasRealContent && analysis.issues.length === 0) {
        results.alreadyGood.push(filename);
        console.log(`✅ ${filename}: ${analysis.totalQuestions} real questions`);
    } else if (analysis.hasRealContent) {
        results.fixed.push(filename);
        console.log(`🔧 ${filename}: ${analysis.totalQuestions} questions (minor issues: ${analysis.issues.join(', ')})`);
    } else {
        results.stillNeedWork.push(filename);
        console.log(`🚨 ${filename}: ${analysis.totalQuestions} questions - NEEDS WORK (${analysis.issues.join(', ')})`);
        console.log(`   Sample: "${analysis.sampleQuestions[0]?.content}"`);
    }
});

console.log('\n=== SUMMARY ===');
console.log(`✅ Already Good: ${results.alreadyGood.length} files`);
console.log(`🔧 Recently Fixed: ${results.fixed.length} files`);
console.log(`🚨 Still Need Work: ${results.stillNeedWork.length} files`);
console.log(`❌ Not Found: ${results.notFound.length} files`);

if (results.stillNeedWork.length > 0) {
    console.log('\n📋 Files that still need real content:');
    results.stillNeedWork.forEach(file => console.log(`   - ${file}`));
}

if (results.fixed.length > 0) {
    console.log('\n🎉 Recently improved files:');
    results.fixed.forEach(file => console.log(`   - ${file}`));
}
