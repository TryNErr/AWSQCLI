const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

// Patterns that indicate fake/template questions
const fakePatterns = [
    /challenging.*question.*for.*grade/i,
    /sample.*question/i,
    /placeholder/i,
    /template/i,
    /example.*question/i,
    /test.*question/i,
    /question.*\d+.*for.*grade/i,
    /this.*is.*a.*question/i,
    /insert.*question.*here/i,
    /add.*question.*content/i,
    /question.*content.*here/i,
    /\[.*question.*\]/i,
    /lorem ipsum/i,
    /dummy.*question/i,
    /fake.*question/i
];

// Generic option patterns
const genericOptionPatterns = [
    /^option\s*[a-d]$/i,
    /^choice\s*[a-d]$/i,
    /^answer\s*[a-d]$/i,
    /^[a-d]$/,
    /option.*\d+/i,
    /choice.*\d+/i
];

// Generic explanation patterns
const genericExplanationPatterns = [
    /explanation.*for.*question/i,
    /this.*is.*the.*correct.*answer/i,
    /answer.*explanation/i,
    /detailed.*explanation/i,
    /explanation.*here/i,
    /insert.*explanation/i
];

function isFakeQuestion(question) {
    const content = question.content || '';
    const explanation = question.explanation || '';
    const options = question.options || [];
    
    // Check content for fake patterns
    for (const pattern of fakePatterns) {
        if (pattern.test(content)) {
            return { reason: 'fake_content', pattern: pattern.toString() };
        }
    }
    
    // Check for generic options
    let genericOptions = 0;
    for (const option of options) {
        for (const pattern of genericOptionPatterns) {
            if (pattern.test(option)) {
                genericOptions++;
                break;
            }
        }
    }
    
    if (genericOptions >= 3) {
        return { reason: 'generic_options', count: genericOptions };
    }
    
    // Check explanation for generic patterns
    for (const pattern of genericExplanationPatterns) {
        if (pattern.test(explanation)) {
            return { reason: 'generic_explanation', pattern: pattern.toString() };
        }
    }
    
    return null;
}

function analyzeFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        const questions = data.questions || [];
        
        const fakeQuestions = [];
        
        questions.forEach((question, index) => {
            const fakeCheck = isFakeQuestion(question);
            if (fakeCheck) {
                fakeQuestions.push({
                    index,
                    id: question._id,
                    content: question.content?.substring(0, 100) + '...',
                    reason: fakeCheck.reason,
                    details: fakeCheck
                });
            }
        });
        
        return {
            file: path.basename(filePath),
            totalQuestions: questions.length,
            fakeQuestions: fakeQuestions.length,
            fakeDetails: fakeQuestions
        };
    } catch (error) {
        return {
            file: path.basename(filePath),
            error: error.message
        };
    }
}

function main() {
    console.log('🔍 Identifying remaining fake/template questions...\n');
    
    const files = fs.readdirSync(questionsDir)
        .filter(file => file.endsWith('.json') && file !== 'manifest.json')
        .sort();
    
    let totalFiles = 0;
    let filesWithFakes = 0;
    let totalFakeQuestions = 0;
    const problemFiles = [];
    
    files.forEach(file => {
        const filePath = path.join(questionsDir, file);
        const analysis = analyzeFile(filePath);
        
        totalFiles++;
        
        if (analysis.error) {
            console.log(`❌ Error analyzing ${file}: ${analysis.error}`);
            return;
        }
        
        if (analysis.fakeQuestions > 0) {
            filesWithFakes++;
            totalFakeQuestions += analysis.fakeQuestions;
            problemFiles.push(analysis);
            
            console.log(`📝 ${file}:`);
            console.log(`   Total questions: ${analysis.totalQuestions}`);
            console.log(`   Fake questions: ${analysis.fakeQuestions}`);
            
            analysis.fakeDetails.forEach(fake => {
                console.log(`   - Q${fake.index + 1}: ${fake.reason} - ${fake.content}`);
            });
            console.log('');
        }
    });
    
    console.log('📊 SUMMARY:');
    console.log(`   Total files analyzed: ${totalFiles}`);
    console.log(`   Files with fake questions: ${filesWithFakes}`);
    console.log(`   Total fake questions found: ${totalFakeQuestions}`);
    
    if (problemFiles.length > 0) {
        console.log('\n🎯 Files that need fixing:');
        problemFiles.forEach(file => {
            console.log(`   - ${file.file}: ${file.fakeQuestions} fake questions`);
        });
        
        // Save detailed report
        fs.writeFileSync(
            '/workspaces/AWSQCLI/fake_questions_report.json',
            JSON.stringify(problemFiles, null, 2)
        );
        console.log('\n📄 Detailed report saved to: fake_questions_report.json');
    } else {
        console.log('\n🎉 No fake questions found! All questions appear to be authentic.');
    }
}

main();
