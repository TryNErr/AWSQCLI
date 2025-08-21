const fs = require('fs');
const path = require('path');

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';

function analyzeQuestionQuality(question, index) {
    const issues = [];
    
    // Check required fields
    if (!question._id) issues.push('missing_id');
    if (!question.content || question.content.trim().length < 10) issues.push('insufficient_content');
    if (!question.options || question.options.length !== 4) issues.push('invalid_options');
    if (!question.correctAnswer) issues.push('missing_correct_answer');
    if (!question.explanation || question.explanation.trim().length < 10) issues.push('insufficient_explanation');
    if (!question.subject) issues.push('missing_subject');
    if (!question.grade) issues.push('missing_grade');
    if (!question.difficulty) issues.push('missing_difficulty');
    
    // Check for template/placeholder content
    const templatePatterns = [
        /question.*\d+.*for.*grade/i,
        /challenging.*question.*for.*grade/i,
        /sample.*question/i,
        /placeholder/i,
        /template/i,
        /example.*question/i,
        /test.*question/i,
        /this.*is.*a.*question/i,
        /insert.*question/i,
        /add.*question/i,
        /lorem ipsum/i,
        /dummy/i,
        /fake/i,
        /\[.*question.*\]/i,
        /question.*content.*here/i
    ];
    
    for (const pattern of templatePatterns) {
        if (pattern.test(question.content || '')) {
            issues.push('template_content');
            break;
        }
    }
    
    // Check for generic options
    const genericOptions = (question.options || []).filter(option => 
        /^(option|choice|answer)\s*[a-d]$/i.test(option) || 
        /^[a-d]$/.test(option) ||
        /option.*\d+/i.test(option) ||
        /choice.*\d+/i.test(option)
    );
    
    if (genericOptions.length >= 2) {
        issues.push('generic_options');
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(question.options || []);
    if (uniqueOptions.size !== (question.options || []).length) {
        issues.push('duplicate_options');
    }
    
    // Check correct answer validity
    if (question.correctAnswer && question.options) {
        const correctAnswer = question.correctAnswer;
        if (!question.options.includes(correctAnswer)) {
            issues.push('invalid_correct_answer');
        }
    }
    
    return issues;
}

function checkForDuplicates(questions) {
    const duplicates = [];
    const seen = new Map();
    
    questions.forEach((question, index) => {
        const content = question.content?.trim().toLowerCase();
        if (content && seen.has(content)) {
            duplicates.push({
                current: index,
                duplicate_of: seen.get(content),
                content: question.content?.substring(0, 50) + '...'
            });
        } else if (content) {
            seen.set(content, index);
        }
    });
    
    return duplicates;
}

function analyzeFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Handle both array format and object format
        let questions = [];
        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                questions = parsed;
            } else if (parsed.questions && Array.isArray(parsed.questions)) {
                questions = parsed.questions;
            } else {
                return {
                    file: path.basename(filePath),
                    error: 'Invalid JSON structure - no questions array found'
                };
            }
        } catch (parseError) {
            return {
                file: path.basename(filePath),
                error: `JSON parse error: ${parseError.message}`
            };
        }
        
        let totalIssues = 0;
        const issueTypes = {};
        const questionIssues = [];
        
        questions.forEach((question, index) => {
            const issues = analyzeQuestionQuality(question, index);
            if (issues.length > 0) {
                totalIssues += issues.length;
                questionIssues.push({
                    index: index + 1,
                    id: question._id,
                    issues: issues,
                    content: question.content?.substring(0, 60) + '...'
                });
                
                issues.forEach(issue => {
                    issueTypes[issue] = (issueTypes[issue] || 0) + 1;
                });
            }
        });
        
        const duplicates = checkForDuplicates(questions);
        
        return {
            file: path.basename(filePath),
            totalQuestions: questions.length,
            questionsWithIssues: questionIssues.length,
            totalIssues,
            issueTypes,
            duplicates: duplicates.length,
            duplicateDetails: duplicates,
            questionIssues: questionIssues.slice(0, 5) // Show first 5 issues
        };
    } catch (error) {
        return {
            file: path.basename(filePath),
            error: error.message
        };
    }
}

function main() {
    console.log('🔍 Running comprehensive quality check on all question files...\n');
    
    const files = fs.readdirSync(questionsDir)
        .filter(file => file.endsWith('.json') && file !== 'manifest.json' && file !== 'version.json')
        .sort();
    
    let totalFiles = 0;
    let filesWithIssues = 0;
    let totalQuestions = 0;
    let totalIssues = 0;
    let totalDuplicates = 0;
    const allIssueTypes = {};
    const problemFiles = [];
    
    console.log(`Found ${files.length} question files to analyze...\n`);
    
    files.forEach(file => {
        const filePath = path.join(questionsDir, file);
        const analysis = analyzeFile(filePath);
        
        totalFiles++;
        
        if (analysis.error) {
            console.log(`❌ Error analyzing ${file}: ${analysis.error}`);
            return;
        }
        
        totalQuestions += analysis.totalQuestions;
        totalIssues += analysis.totalIssues;
        totalDuplicates += analysis.duplicates;
        
        // Aggregate issue types
        Object.keys(analysis.issueTypes).forEach(issueType => {
            allIssueTypes[issueType] = (allIssueTypes[issueType] || 0) + analysis.issueTypes[issueType];
        });
        
        if (analysis.questionsWithIssues > 0 || analysis.duplicates > 0) {
            filesWithIssues++;
            problemFiles.push(analysis);
            
            console.log(`📝 ${file}:`);
            console.log(`   Questions: ${analysis.totalQuestions}, Issues: ${analysis.totalIssues}, Duplicates: ${analysis.duplicates}`);
            
            if (analysis.questionIssues.length > 0) {
                console.log('   Sample issues:');
                analysis.questionIssues.forEach(q => {
                    console.log(`   - Q${q.index}: ${q.issues.join(', ')} - ${q.content}`);
                });
            }
            
            if (analysis.duplicates > 0) {
                console.log(`   - ${analysis.duplicates} duplicate questions found`);
            }
            console.log('');
        } else {
            // Show progress for clean files
            console.log(`✅ ${file}: ${analysis.totalQuestions} questions - all good`);
        }
    });
    
    console.log('\n📊 OVERALL SUMMARY:');
    console.log(`   Total files: ${totalFiles}`);
    console.log(`   Total questions: ${totalQuestions}`);
    console.log(`   Files with issues: ${filesWithIssues}`);
    console.log(`   Total issues found: ${totalIssues}`);
    console.log(`   Total duplicates: ${totalDuplicates}`);
    
    if (Object.keys(allIssueTypes).length > 0) {
        console.log('\n🔍 Issue breakdown:');
        Object.entries(allIssueTypes)
            .sort(([,a], [,b]) => b - a)
            .forEach(([issue, count]) => {
                console.log(`   - ${issue}: ${count}`);
            });
    }
    
    const qualityScore = totalQuestions > 0 ? 
        Math.round(((totalQuestions - totalIssues) / totalQuestions) * 100) : 100;
    
    console.log(`\n🎯 Overall Quality Score: ${qualityScore}%`);
    
    if (problemFiles.length === 0) {
        console.log('\n🎉 Excellent! All question files are high quality with no issues found!');
    } else {
        console.log(`\n⚠️  ${problemFiles.length} files need attention.`);
        
        // Save detailed report
        fs.writeFileSync(
            '/workspaces/AWSQCLI/quality_report.json',
            JSON.stringify(problemFiles, null, 2)
        );
        console.log('📄 Detailed report saved to: quality_report.json');
    }
}

main();
