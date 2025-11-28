const fs = require('fs');

const inputFile = './combined_json_output.json';
const outputFile = './Quiz_App/public/fixed_questions.json';

try {
    // Read and fix encoding issues
    let rawData = fs.readFileSync(inputFile, 'utf8');
    
    // Remove BOM and fix common encoding issues
    rawData = rawData.replace(/^\uFEFF/, '') // Remove BOM
        .replace(/\r\n/g, '\n') // Fix line endings
        .replace(/ΓÇ»/g, ' ')
        .replace(/ΓÇæ/g, '-')
        .replace(/ΓÇô/g, '–')
        .replace(/ΓÇö/g, '—');
    
    const questions = JSON.parse(rawData);
    console.log(`Processing ${questions.length} questions...`);
    
    // Convert to Quiz_App format
    const fixedQuestions = questions.map(q => {
        // Ensure grade is always an integer (fix string/number inconsistency)
        let grade = q.grade || 1;
        if (typeof grade === 'string') {
            grade = parseInt(grade) || 1;
        }
        
        return {
            content: q.content || q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer || q.correct_answer,
            explanation: q.explanation || '',
            subject: q.subject || 'General',
            grade: grade,
            difficulty: q.difficulty || 'medium',
            passage: q.passage || null
        };
    }).filter(q => q.content && q.options.length > 0 && q.correctAnswer && !q.subject.includes('ΓÇª') && q.subject !== 'General' && q.difficulty !== '{difficulty}');
    
    // Write to Quiz_App
    fs.writeFileSync(outputFile, JSON.stringify(fixedQuestions, null, 2));
    
    // Create filter metadata for faster loading
    const subjects = {};
    const grades = {};
    const difficulties = {};
    
    fixedQuestions.forEach(q => {
        subjects[q.subject] = (subjects[q.subject] || 0) + 1;
        grades[q.grade] = (grades[q.grade] || 0) + 1;
        difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
    });
    
    const metadata = {
        subjects: Object.keys(subjects).sort(),
        grades: Object.keys(grades).map(Number).sort((a, b) => a - b),
        difficulties: Object.keys(difficulties).sort(),
        totalQuestions: fixedQuestions.length
    };
    
    fs.writeFileSync('./Quiz_App/public/filter_metadata.json', JSON.stringify(metadata, null, 2));
    
    console.log(`✅ Converted ${fixedQuestions.length} questions to ${outputFile}`);
    console.log('🔧 Grade data types normalized to integers (fixes duplicate Grade 4/4 issue)');
    console.log('🚀 Filter metadata created for faster loading');
    
} catch (error) {
    console.error('Error:', error.message);
}
