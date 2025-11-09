let questions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let questionResults = []; // Track results for each question
let filters = {
    subject: '',
    grade: '',
    difficulty: ''
};

// Load questions and populate filters
async function loadQuestions() {
    try {
        const response = await fetch('/fixed_questions.json');
        const text = await response.text();
        // Fix common encoding issues - use safe replacements
        const fixedText = text
            .replace(/ΓÇ»/g, ' ')
            .replace(/ΓÇæ/g, '-')
            .replace(/ΓÇô/g, '–')
            .replace(/ΓÇö/g, '—')
            .replace(/ΓÇÿ/g, '\u2019')
            .replace(/ΓÇÖ/g, '\u2018')
            .replace(/ΓÇ£/g, '\u201C')
            .replace(/ΓÇ¥/g, '\u201D')
            .replace(/ΓÇª/g, '...')
            .replace(/┬¼/g, '¼')
            .replace(/┬¾/g, '¾')
            .replace(/┬¹/g, '¹')
            .replace(/┬╜/g, '½')
            .replace(/┬▓/g, '²')
            .replace(/┬│/g, '³')
            .replace(/├ù/g, '×')
            .replace(/├╖/g, '÷')
            .replace(/├÷/g, '÷')
            .replace(/├ë/g, '±')
            .replace(/├ñ/g, '√')
            .replace(/├ç/g, '∞')
            .replace(/├ä/g, '≤')
            .replace(/├ñ/g, '≥')
            .replace(/├ë/g, '≠')
            .replace(/┬░/g, '°')
            .replace(/╬▒/g, 'α')
            .replace(/╬▓/g, 'β')
            .replace(/╬│/g, 'γ')
            .replace(/╬┤/g, 'δ')
            .replace(/╬╕/g, 'θ')
            .replace(/╬╗/g, 'λ')
            .replace(/╬╝/g, 'μ')
            .replace(/╧Ç/g, 'π')
            .replace(/╧â/g, 'σ')
            .replace(/╧ä/g, 'φ')
            .replace(/╧ë/g, 'ω');
        
        questions = JSON.parse(fixedText);
        populateFilters();
        updateQuestionCount();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function populateFilters() {
    const subjects = [...new Set(questions.map(q => q.subject).filter(Boolean))].sort();
    const grades = [...new Set(questions.map(q => q.grade).filter(Boolean))].sort((a, b) => a - b);
    const difficulties = [...new Set(questions.map(q => q.difficulty).filter(Boolean))].sort();
    
    createFilterButtons('subject', subjects);
    createFilterButtons('grade', grades);
    createFilterButtons('difficulty', difficulties);
}

function createFilterButtons(type, options) {
    const container = document.getElementById(`${type}-buttons`);
    container.innerHTML = '';
    
    // Add "All" button
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = `All ${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    allBtn.onclick = () => selectFilter(type, '', allBtn);
    container.appendChild(allBtn);
    
    // Add option buttons
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = typeof option === 'string' ? 
            option.charAt(0).toUpperCase() + option.slice(1) : 
            `Grade ${option}`;
        btn.onclick = () => selectFilter(type, option, btn);
        container.appendChild(btn);
    });
}

function selectFilter(type, value, button) {
    // Remove active class from all buttons in this group
    const container = document.getElementById(`${type}-buttons`);
    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Update filter
    filters[type] = value;
    updateQuestionCount();
}

function updateQuestionCount() {
    const filtered = questions.filter(q => {
        return (!filters.subject || q.subject === filters.subject) &&
               (!filters.grade || q.grade == filters.grade) &&
               (!filters.difficulty || q.difficulty === filters.difficulty);
    });
    
    document.getElementById('question-count').textContent = 
        `${filtered.length} questions available`;
}

window.startQuiz = function() {
    // Filter questions using the filters object
    filteredQuestions = questions.filter(q => {
        return (!filters.subject || q.subject === filters.subject) &&
               (!filters.grade || q.grade == filters.grade) &&
               (!filters.difficulty || q.difficulty === filters.difficulty);
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
    questionResults = new Array(filteredQuestions.length).fill(null);
    
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    initializeProgressTracker();
    showQuestion();
}

function initializeProgressTracker() {
    const progressDots = document.getElementById('progress-dots');
    progressDots.innerHTML = '';
    
    filteredQuestions.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.id = `dot-${index}`;
        progressDots.appendChild(dot);
    });
    
    updateProgressTracker();
}

function updateProgressTracker() {
    // Update score display
    const correctCount = questionResults.filter(result => result === true).length;
    const incorrectCount = questionResults.filter(result => result === false).length;
    
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
    
    // Update progress dots
    filteredQuestions.forEach((_, index) => {
        const dot = document.getElementById(`dot-${index}`);
        dot.className = 'progress-dot';
        
        if (index === currentQuestionIndex) {
            dot.classList.add('current');
        } else if (questionResults[index] === true) {
            dot.classList.add('correct');
        } else if (questionResults[index] === false) {
            dot.classList.add('incorrect');
        }
    });
}

function showQuestion() {
    const question = filteredQuestions[currentQuestionIndex];
    
    document.getElementById('question-counter').textContent = 
        `Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}`;
    
    // Handle passage for reading questions
    const passageDiv = document.getElementById('passage');
    if (question.passage) {
        passageDiv.innerHTML = `<div class="passage">${question.passage}</div>`;
        passageDiv.style.display = 'block';
    } else {
        passageDiv.style.display = 'none';
    }
    
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
    
    // Update navigation button visibility
    document.getElementById('back-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    selectedAnswer = null;
    
    updateProgressTracker();
    document.getElementById('result').innerHTML = '';
    selectedAnswer = null;
}

window.previousQuestion = function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

window.goHome = function() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('selection-screen').style.display = 'block';
}

function selectAnswer(answer, element) {
    if (selectedAnswer) return; // Already answered
    
    selectedAnswer = answer;
    const question = filteredQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;
    
    // Record the result
    questionResults[currentQuestionIndex] = isCorrect;
    if (isCorrect) score++;
    
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
        document.getElementById('result').innerHTML = 
            `<div class="answer-feedback correct">✓ Correct!</div>`;
    } else {
        document.getElementById('result').innerHTML = 
            `<div class="answer-feedback incorrect">✗ Wrong: ${question.correctAnswer}</div>`;
    }
    
    document.getElementById('next-btn').style.display = 'inline-block';
    updateProgressTracker();
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
