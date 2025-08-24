#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Grade 5 hard question topics for variety
const mathTopics = [
    "fractions with different denominators",
    "decimal multiplication and division", 
    "area and perimeter of complex shapes",
    "multi-step word problems with money",
    "converting between fractions and decimals",
    "finding patterns in number sequences",
    "calculating volume of rectangular prisms",
    "solving problems with elapsed time",
    "working with mixed numbers",
    "interpreting data from graphs and charts"
];

const englishTopics = [
    "identifying main idea and supporting details",
    "understanding figurative language and metaphors", 
    "analyzing character motivations and traits",
    "distinguishing fact from opinion",
    "understanding cause and effect relationships",
    "identifying author's purpose and tone",
    "making inferences from text clues",
    "understanding story structure and plot",
    "analyzing poetry elements like rhyme and rhythm",
    "comparing and contrasting different texts"
];

const readingTopics = [
    "reading comprehension with complex passages",
    "analyzing non-fiction text features",
    "understanding sequence of events",
    "making predictions based on text evidence",
    "identifying theme and moral lessons",
    "understanding different points of view",
    "analyzing persuasive writing techniques",
    "interpreting charts, graphs, and diagrams",
    "understanding vocabulary in context",
    "synthesizing information from multiple sources"
];

const mathReasoningTopics = [
    "logical problem solving with multiple steps",
    "pattern recognition and extension",
    "spatial reasoning and geometry puzzles",
    "probability and chance calculations",
    "algebraic thinking with variables",
    "estimation and rounding strategies",
    "proportional reasoning and ratios",
    "critical thinking with number relationships",
    "problem solving with constraints",
    "mathematical modeling of real situations"
];

const thinkingSkillsTopics = [
    "logical reasoning and deduction",
    "pattern analysis and prediction",
    "critical thinking and evaluation",
    "problem solving strategies",
    "cause and effect analysis",
    "classification and categorization",
    "analogical reasoning",
    "creative problem solving",
    "decision making with criteria",
    "systems thinking and connections"
];

function getTopicsForSubject(subject) {
    switch(subject) {
        case 'math': return mathTopics;
        case 'english': return englishTopics;
        case 'reading': return readingTopics;
        case 'mathematical-reasoning': return mathReasoningTopics;
        case 'thinking-skills': return thinkingSkillsTopics;
        default: return mathTopics;
    }
}

function generateSingleQuestion(subject, topic, questionNum) {
    const prompt = `Create 1 Grade 5 hard ${subject} question about ${topic}. 
Format as JSON with: content, options (array of 4 strings), correctAnswer (A/B/C/D), explanation.
Make it challenging but appropriate for 10-11 year olds.`;

    try {
        console.log(`Generating question ${questionNum} about ${topic}...`);
        
        const result = execSync(`echo "${prompt}" | ollama run deepseek-r1:latest --format json --keepalive 5m`, {
            encoding: 'utf8',
            timeout: 120000 // 2 minute timeout
        });

        // Clean and parse the JSON
        let cleanJson = result.trim();
        
        // Remove any extra braces or formatting issues
        if (cleanJson.startsWith('{\n\n{')) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith('\n  }\n"')) {
            cleanJson = cleanJson.substring(0, cleanJson.length - 5) + '}';
        }
        
        const questionData = JSON.parse(cleanJson);
        
        // Format to match TestAce structure
        return {
            "_id": `${subject}_5_hard_${String(questionNum).padStart(3, '0')}`,
            "content": questionData.content,
            "type": "multiple_choice",
            "options": Array.isArray(questionData.options) ? 
                questionData.options.map(opt => typeof opt === 'string' ? opt : opt.content) :
                [questionData.options.A, questionData.options.B, questionData.options.C, questionData.options.D],
            "correctAnswer": questionData.correctAnswer,
            "subject": subject,
            "grade": "5",
            "difficulty": "hard",
            "explanation": questionData.explanation,
            "_cacheBreaker": `${Date.now()}_${questionNum}`
        };
        
    } catch (error) {
        console.error(`Failed to generate question ${questionNum}:`, error.message);
        return null;
    }
}

function generateQuestionsForSubject(subject, count = 50) {
    const topics = getTopicsForSubject(subject);
    const questions = [];
    
    console.log(`\n🎯 Generating ${count} Grade 5 hard ${subject} questions...`);
    
    for (let i = 1; i <= count; i++) {
        const topic = topics[(i - 1) % topics.length];
        const question = generateSingleQuestion(subject, topic, i);
        
        if (question) {
            questions.push(question);
            console.log(`✅ Generated question ${i}/${count}`);
        } else {
            console.log(`❌ Failed question ${i}/${count}`);
            // Add a simple fallback to maintain count
            questions.push({
                "_id": `${subject}_5_hard_${String(i).padStart(3, '0')}`,
                "content": `Grade 5 ${subject} question ${i} - Please regenerate`,
                "type": "multiple_choice",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "A",
                "subject": subject,
                "grade": "5", 
                "difficulty": "hard",
                "explanation": "This question needs to be regenerated",
                "_cacheBreaker": `${Date.now()}_${i}`
            });
        }
        
        // Small delay to avoid overwhelming Ollama
        if (i % 5 === 0) {
            console.log(`Pausing briefly...`);
            execSync('sleep 2');
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

if (!['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'].includes(subject)) {
    console.error('Invalid subject. Use: math, english, reading, mathematical-reasoning, thinking-skills');
    process.exit(1);
}

console.log(`🚀 Starting Grade 5 hard ${subject} question generation...`);
generateQuestionsForSubject(subject, count);
