// Simple API handler for filtered questions
const fs = require('fs');

function encodeQuestions(questions) {
    return btoa(JSON.stringify(questions));
}

function getFilteredQuestions(subject, grade, difficulty, limit = 10) {
    try {
        const allQuestions = JSON.parse(fs.readFileSync('./fixed_questions.json', 'utf8'));
        
        const filtered = allQuestions.filter(q => {
            return (!subject || q.subject === subject) &&
                   (!grade || q.grade == grade) &&
                   (!difficulty || q.difficulty === difficulty);
        });
        
        // Shuffle and limit
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, limit);
        
        return encodeQuestions(shuffled);
    } catch (error) {
        console.error('Error filtering questions:', error);
        return null;
    }
}

// Export for use
if (typeof module !== 'undefined') {
    module.exports = { getFilteredQuestions, encodeQuestions };
}
