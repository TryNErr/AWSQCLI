#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Grade 5 hard question subjects
const subjects = ['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'];

function generateQuestion(subject, questionNum) {
    let prompt;
    
    switch(subject) {
        case 'math':
            prompt = `Create a challenging Grade 5 math question. Include: question text, 4 multiple choice options (A,B,C,D), correct answer, and explanation. Topics: fractions, decimals, geometry, word problems, measurement. Format as JSON with fields: content, options, correctAnswer, explanation.`;
            break;
        case 'english':
            prompt = `Create a challenging Grade 5 English question. Include: question text, 4 multiple choice options (A,B,C,D), correct answer, and explanation. Topics: grammar, vocabulary, sentence structure, parts of speech. Format as JSON with fields: content, options, correctAnswer, explanation.`;
            break;
        case 'reading':
            prompt = `Create a challenging Grade 5 reading comprehension question with a short passage. Include: passage text, question, 4 multiple choice options (A,B,C,D), correct answer, and explanation. Format as JSON with fields: passage, content, options, correctAnswer, explanation.`;
            break;
        case 'mathematical-reasoning':
            prompt = `Create a challenging Grade 5 mathematical reasoning question. Include: question text, 4 multiple choice options (A,B,C,D), correct answer, and explanation. Topics: logic, patterns, problem solving, critical thinking with numbers. Format as JSON with fields: content, options, correctAnswer, explanation.`;
            break;
        case 'thinking-skills':
            prompt = `Create a challenging Grade 5 thinking skills question. Include: question text, 4 multiple choice options (A,B,C,D), correct answer, and explanation. Topics: logical reasoning, pattern recognition, critical thinking, problem solving. Format as JSON with fields: content, options, correctAnswer, explanation.`;
            break;
    }

    try {
        console.log(`Generating ${subject} question ${questionNum}...`);
        
        const result = execSync(`echo "${prompt}" | ollama run llama3.2:3b --format json`, {
            encoding: 'utf8',
            timeout: 120000 // 2 minute timeout
        });

        // Parse the JSON response
        const questionData = JSON.parse(result.trim());
        
        // Format to match TestAce structure
        const formattedQuestion = {
            "_id": `${subject}_5_hard_${String(questionNum).padStart(3, '0')}`,
            "content": questionData.content,
            "type": "multiple_choice",
            "options": Array.isArray(questionData.options) ? questionData.options : 
                     [questionData.options.A, questionData.options.B, questionData.options.C, questionData.options.D],
            "correctAnswer": questionData.correctAnswer,
            "subject": subject,
            "grade": "5",
            "difficulty": "hard",
            "explanation": questionData.explanation,
            "_cacheBreaker": `${Date.now()}_${questionNum}`
        };

        // Add passage for reading questions
        if (subject === 'reading' && questionData.passage) {
            formattedQuestion.passage = questionData.passage;
        }

        return formattedQuestion;
        
    } catch (error) {
        console.error(`Failed to generate ${subject} question ${questionNum}:`, error.message);
        return null;
    }
}

function generateQuestionsForSubject(subject, count = 50) {
    const questions = [];
    
    console.log(`\n🎯 Generating ${count} Grade 5 hard ${subject} questions...`);
    
    for (let i = 1; i <= count; i++) {
        const question = generateQuestion(subject, i);
        
        if (question) {
            questions.push(question);
            console.log(`✅ Generated question ${i}/${count}`);
        } else {
            console.log(`❌ Failed question ${i}/${count} - skipping`);
        }
        
        // Small delay to avoid overwhelming Ollama
        if (i % 5 === 0) {
            console.log(`Pausing briefly...`);
            execSync('sleep 3');
        }
    }
    
    // Save to file
    const filename = `5_hard_${subject}.json`;
    const filepath = path.join(__dirname, 'testace-app/frontend/public/questions', filename);
    
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
    console.log(`\n✅ Saved ${questions.length} questions to ${filename}`);
    
    return questions;
}

// Main execution
const args = process.argv.slice(2);
const subject = args[0] || 'math';
const count = parseInt(args[1]) || 50;

if (!subjects.includes(subject)) {
    console.error(`Invalid subject. Use: ${subjects.join(', ')}`);
    process.exit(1);
}

console.log(`🚀 Starting Grade 5 hard ${subject} question generation with Llama 3.2...`);
generateQuestionsForSubject(subject, count);
