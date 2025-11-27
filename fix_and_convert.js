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
    const fixedQuestions = questions.map(q => ({
        content: q.content || q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer || q.correct_answer,
        explanation: q.explanation || '',
        subject: q.subject || 'General',
        grade: q.grade || 1,
        difficulty: q.difficulty || 'medium',
        passage: q.passage || null
    })).filter(q => q.content && q.options.length > 0 && q.correctAnswer);
    
    // Write to Quiz_App
    fs.writeFileSync(outputFile, JSON.stringify(fixedQuestions, null, 2));
    
    console.log(`✅ Converted ${fixedQuestions.length} questions to ${outputFile}`);
    
} catch (error) {
    console.error('Error:', error.message);
}
