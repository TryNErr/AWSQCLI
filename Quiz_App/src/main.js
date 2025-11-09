let questions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// Load questions and populate filters
async function loadQuestions() {
    try {
        const response = await fetch('/fixed_questions.json');
        const text = await response.text();
        // Fix common encoding issues
        const fixedText = text
            .replace(/├ù/g, '×')
            .replace(/├÷/g, '÷')
            .replace(/├ë/g, '±')
            .replace(/├ó/g, '²')
            .replace(/├│/g, '³')
            .replace(/├ñ/g, '√')
            .replace(/├ç/g, '∞')
            .replace(/├ä/g, '≤')
            .replace(/├ñ/g, '≥')
            .replace(/├ë/g, '≠')
            .replace(/├ÿ/g, '∑')
            .replace(/├ÿ/g, '∏')
            .replace(/├ÿ/g, '∆')
            .replace(/├ÿ/g, '∫')
            .replace(/├ÿ/g, '∂')
            .replace(/├ÿ/g, '∇')
            .replace(/├ÿ/g, '∈')
            .replace(/├ÿ/g, '∉')
            .replace(/├ÿ/g, '⊂')
            .replace(/├ÿ/g, '⊃')
            .replace(/├ÿ/g, '∪')
            .replace(/├ÿ/g, '∩')
            .replace(/├ÿ/g, '∅')
            .replace(/├ÿ/g, '∀')
            .replace(/├ÿ/g, '∃')
            .replace(/├ÿ/g, '∴')
            .replace(/├ÿ/g, '∵')
            .replace(/├ÿ/g, '∠')
            .replace(/├ÿ/g, '∟')
            .replace(/├ÿ/g, '°')
            .replace(/├ÿ/g, 'π')
            .replace(/├ÿ/g, 'α')
            .replace(/├ÿ/g, 'β')
            .replace(/├ÿ/g, 'γ')
            .replace(/├ÿ/g, 'δ')
            .replace(/├ÿ/g, 'θ')
            .replace(/├ÿ/g, 'λ')
            .replace(/├ÿ/g, 'μ')
            .replace(/├ÿ/g, 'σ')
            .replace(/├ÿ/g, 'φ')
            .replace(/├ÿ/g, 'ω');
        
        questions = JSON.parse(fixedText);
        populateFilters();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function populateFilters() {
    const subjects = [...new Set(questions.map(q => q.subject).filter(Boolean))].sort();
    const grades = [...new Set(questions.map(q => q.grade).filter(Boolean))].sort((a, b) => a - b);
    const difficulties = [...new Set(questions.map(q => q.difficulty).filter(Boolean))].sort();
    
    populateSelect('subject', subjects);
    populateSelect('grade', grades);
    populateSelect('difficulty', difficulties);
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
        if (option != null) {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = typeof option === 'string' ? 
                option.charAt(0).toUpperCase() + option.slice(1) : 
                option.toString();
            select.appendChild(optionElement);
        }
    });
}

window.startQuiz = function() {
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;
    const difficulty = document.getElementById('difficulty').value;
    
    // Filter questions
    filteredQuestions = questions.filter(q => {
        return (!subject || q.subject === subject) &&
               (!grade || q.grade == grade) &&
               (!difficulty || q.difficulty === difficulty);
    });
    
    if (filteredQuestions.length === 0) {
        alert('No questions found for the selected criteria. Please adjust your filters.');
        return;
    }
    
    // Shuffle questions multiple times for better randomization
    filteredQuestions = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5);
    
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    showQuestion();
}

function showQuestion() {
    const question = filteredQuestions[currentQuestionIndex];
    
    document.getElementById('question-counter').textContent = 
        `Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}`;
    
    document.getElementById('question-content').textContent = question.content;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(option, optionDiv);
        optionsDiv.appendChild(optionDiv);
    });
    
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    selectedAnswer = null;
}

function selectAnswer(answer, element) {
    if (selectedAnswer) return; // Already answered
    
    selectedAnswer = answer;
    const question = filteredQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;
    
    // Show correct/incorrect styling
    document.querySelectorAll('.option').forEach(opt => {
        opt.onclick = null; // Disable clicking
        if (opt.textContent === question.correctAnswer) {
            opt.classList.add('correct');
        } else if (opt === element && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        score++;
        document.getElementById('result').innerHTML = 
            `<div class="success">✅ Correct! ${question.explanation || ''}</div>`;
    } else {
        document.getElementById('result').innerHTML = 
            `<div class="error">❌ Incorrect. The correct answer is: ${question.correctAnswer}. ${question.explanation || ''}</div>`;
    }
    
    document.getElementById('next-btn').style.display = 'inline-block';
}

window.nextQuestion = function() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= filteredQuestions.length) {
        showResults();
    } else {
        showQuestion();
    }
}

function showResults() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    document.getElementById('final-score').innerHTML = 
        `<h3>Your Score: ${score}/${filteredQuestions.length} (${percentage}%)</h3>`;
}

window.restartQuiz = function() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('selection-screen').style.display = 'block';
}

// Initialize when page loads
loadQuestions();
