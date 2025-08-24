#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseQuestionResponse(response, subject, questionNum) {
    try {
        // Extract question content
        const questionMatch = response.match(/\*\*Question:\*\*\s*(.*?)(?=\n\*\*|$)/s);
        const content = questionMatch ? questionMatch[1].trim() : '';

        // Extract options
        const optionMatches = response.match(/\*\*([A-D])\)\*\*\s*(.*?)(?=\n\*\*|$)/g);
        const options = [];
        
        if (optionMatches) {
            optionMatches.forEach(match => {
                const optionText = match.replace(/\*\*[A-D]\)\*\*\s*/, '').trim();
                options.push(optionText);
            });
        }

        // Extract correct answer
        const answerMatch = response.match(/\*\*Correct answer:\*\*\s*([A-D])/i);
        const correctAnswer = answerMatch ? answerMatch[1] : 'A';

        // Extract explanation
        const explanationMatch = response.match(/\*\*Explanation:\*\*\s*(.*?)$/s);
        const explanation = explanationMatch ? explanationMatch[1].trim() : '';

        // Extract passage for reading questions
        let passage = null;
        if (subject === 'reading') {
            const passageMatch = response.match(/\*\*Passage:\*\*\s*(.*?)(?=\n\*\*Question:|$)/s);
            passage = passageMatch ? passageMatch[1].trim() : null;
        }

        // Format to TestAce structure
        const question = {
            "_id": `${subject}_5_hard_${String(questionNum).padStart(3, '0')}`,
            "content": content,
            "type": "multiple_choice",
            "options": options.length === 4 ? options : ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": correctAnswer,
            "subject": subject,
            "grade": "5",
            "difficulty": "hard",
            "explanation": explanation,
            "_cacheBreaker": `${Date.now()}_${questionNum}`
        };

        if (passage) {
            question.passage = passage;
        }

        return question;
    } catch (error) {
        console.error(`Error parsing response: ${error.message}`);
        return null;
    }
}

function generateQuestion(subject, questionNum) {
    let prompt;
    
    switch(subject) {
        case 'math':
            prompt = `Create a challenging Grade 5 math question about fractions, decimals, geometry, or word problems.

Format:
**Question:** [write the question here]
**A)** [option A]
**B)** [option B] 
**C)** [option C]
**D)** [option D]
**Correct answer:** [A, B, C, or D]
**Explanation:** [explain why the answer is correct]`;
            break;
            
        case 'english':
            prompt = `Create a challenging Grade 5 English question about grammar, vocabulary, or sentence structure.

Format:
**Question:** [write the question here]
**A)** [option A]
**B)** [option B]
**C)** [option C] 
**D)** [option D]
**Correct answer:** [A, B, C, or D]
**Explanation:** [explain why the answer is correct]`;
            break;
            
        case 'reading':
            prompt = `Create a challenging Grade 5 reading comprehension question with a short passage.

Format:
**Passage:** [write a short passage here]
**Question:** [write the question about the passage]
**A)** [option A]
**B)** [option B]
**C)** [option C]
**D)** [option D]
**Correct answer:** [A, B, C, or D]
**Explanation:** [explain why the answer is correct]`;
            break;
            
        case 'mathematical-reasoning':
            prompt = `Create a challenging Grade 5 mathematical reasoning question involving logic, patterns, or problem solving.

Format:
**Question:** [write the question here]
**A)** [option A]
**B)** [option B]
**C)** [option C]
**D)** [option D]
**Correct answer:** [A, B, C, or D]
**Explanation:** [explain why the answer is correct]`;
            break;
            
        case 'thinking-skills':
            prompt = `Create a challenging Grade 5 thinking skills question involving logical reasoning, pattern recognition, or critical thinking.

Format:
**Question:** [write the question here]
**A)** [option A]
**B)** [option B]
**C)** [option C]
**D)** [option D]
**Correct answer:** [A, B, C, or D]
**Explanation:** [explain why the answer is correct]`;
            break;
    }

    try {
        console.log(`🔄 Generating ${subject} question ${questionNum}...`);
        
        const result = execSync(`echo "${prompt}" | ollama run llama3.2:3b`, {
            encoding: 'utf8',
            timeout: 90000 // 90 second timeout
        });

        const question = parseQuestionResponse(result, subject, questionNum);
        
        if (question && question.content && question.options.length === 4) {
            console.log(`✅ Generated question ${questionNum}: "${question.content.substring(0, 50)}..."`);
            return question;
        } else {
            console.log(`⚠️  Question ${questionNum} had parsing issues, skipping`);
            return null;
        }
        
    } catch (error) {
        console.error(`❌ Failed to generate ${subject} question ${questionNum}: ${error.message}`);
        return null;
    }
}

function generateQuestionsForSubject(subject, count = 50) {
    const questions = [];
    
    console.log(`\n🎯 Generating ${count} Grade 5 hard ${subject} questions using Llama 3.2...`);
    
    for (let i = 1; i <= count; i++) {
        const question = generateQuestion(subject, i);
        
        if (question) {
            questions.push(question);
        }
        
        // Small delay every 3 questions to avoid overwhelming
        if (i % 3 === 0) {
            console.log(`📊 Progress: ${questions.length}/${i} successful, pausing briefly...`);
            execSync('sleep 2');
        }
    }
    
    // Save to file
    const filename = `5_hard_${subject}.json`;
    const filepath = path.join(__dirname, 'testace-app/frontend/public/questions', filename);
    
    fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
    console.log(`\n✅ Completed! Saved ${questions.length} questions to ${filename}`);
    console.log(`📈 Success rate: ${Math.round((questions.length/count)*100)}%`);
    
    return questions;
}

// Main execution
const args = process.argv.slice(2);
const subject = args[0] || 'math';
const count = parseInt(args[1]) || 50;

const subjects = ['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'];

if (!subjects.includes(subject)) {
    console.error(`Invalid subject. Use: ${subjects.join(', ')}`);
    process.exit(1);
}

console.log(`🚀 Starting Grade 5 hard ${subject} question generation...`);
console.log(`⚡ Using Llama 3.2 (fast mode, no JSON formatting)`);
generateQuestionsForSubject(subject, count);
