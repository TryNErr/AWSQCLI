import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import styled from 'styled-components';

const QuizContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 20px 0;
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--gray-lighter);
`;

const QuizTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: var(--dark);
`;

const QuizInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--gray);
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
`;

const QuestionNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 16px;
`;

const QuestionText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 24px;
  line-height: 1.6;
`;

const ReadingPassage = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--dark);
  
  h4 {
    color: var(--primary);
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
`;

const OptionButton = styled.button`
  padding: 16px;
  border: 2px solid var(--gray-light);
  border-radius: 12px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    border-color: var(--primary);
  }
  
  &.selected {
    border-color: var(--primary);
    background: #f0f9ff;
  }
  
  &.correct {
    border-color: var(--success);
    background: #f0fdf4;
  }
  
  &.incorrect {
    border-color: var(--error);
    background: #fef2f2;
  }
`;

const FeedbackMessage = styled.div`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-weight: 500;
  
  &.correct {
    background: #f0fdf4;
    color: var(--success);
    border: 1px solid var(--success);
  }
  
  &.incorrect {
    background: #fef2f2;
    color: var(--error);
    border: 1px solid var(--error);
  }
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: var(--shadow);
`;

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mode = location.state?.mode || 'practice';
  
  const [step, setStep] = useState('setup'); // setup, quiz, completed
  const [quizConfig, setQuizConfig] = useState({
    subject: '',
    grade: user?.grade || '9',
    difficulty: 'medium'
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(() => {
    // Load from localStorage on component mount
    const saved = localStorage.getItem('answeredQuestionIds');
    return saved ? JSON.parse(saved) : [];
  });

  // Save answered questions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('answeredQuestionIds', JSON.stringify(answeredQuestionIds));
  }, [answeredQuestionIds]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (step === 'quiz' && mode === 'exam' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, mode, timeLeft]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/quiz/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const startQuiz = async () => {
    try {
      const response = await axios.post('/api/quiz/start', {
        ...quizConfig,
        mode,
        answeredQuestionIds
      });
      setQuestions(response.data.questions);
      setTimeLeft(mode === 'exam' ? response.data.timeLimit : 0);
      setStep('quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });

    if (mode === 'practice') {
      setShowFeedback(true);
    }
  };

  const nextQuestion = () => {
    // Add current question to answered questions
    const currentQuestionId = questions[currentQuestion]._id;
    if (!answeredQuestionIds.includes(currentQuestionId)) {
      setAnsweredQuestionIds(prev => [...prev, currentQuestionId]);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || '');
      setShowFeedback(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    try {
      const questionIds = questions.map(q => q._id);
      const response = await axios.post('/api/quiz/complete', {
        answers,
        mode,
        config: quizConfig,
        timeSpent: mode === 'exam' ? (questions.length * 60 - timeLeft) : null,
        questionIds
      });
      navigate('/results', { state: { results: response.data } });
    } catch (error) {
      console.error('Failed to complete quiz:', error);
    }
  };

  const cleanText = (text) => {
    if (!text) return text;
    return text
      .replace(/├ù/g, '×')
      .replace(/├╖/g, '÷')
      .replace(/┬▓/g, '²')
      .replace(/┬│/g, '³')
      .replace(/┬╜/g, '½')
      .replace(/┬╝/g, '¼')
      .replace(/┬¬/g, '¬')
      .replace(/┬░/g, '°')
      .replace(/ΓÇæ/g, '-')
      .replace(/ΓÇÖ/g, "'")
      .replace(/ΓÇ£/g, '"')
      .replace(/ΓÇ¥/g, '"')
      .replace(/ΓÇ»/g, '"')
      .replace(/ΓÇª/g, '...')
      .replace(/Γëá/g, '≠')
      .replace(/Γëñ/g, '≤')
      .replace(/ΓëÑ/g, '≥')
      .replace(/Γêæ/g, '∞')
      .replace(/ΓêÆ/g, '-')
      .replace(/Γêê/g, '±')
      .replace(/ΓêÜ/g, '√')
      .replace(/Γçæ/g, '→')
      .replace(/ΓçÆ/g, '⇒')
      .replace(/Γçô/g, '←')
      .replace(/Γçá/g, '↑')
      .replace(/Γçƒ/g, '↓')
      .replace(/╧Ç/g, 'π')
      .replace(/╧â/g, 'σ')
      .replace(/╧ü/g, 'ρ')
      .replace(/╧ä/g, 'τ')
      .replace(/╧à/g, 'υ')
      .replace(/╧ç/g, 'χ')
      .replace(/╧ê/g, 'ψ')
      .replace(/╧ë/g, 'ω')
      .replace(/╬╕/g, 'θ')
      .replace(/╬▒/g, 'α')
      .replace(/╬▓/g, 'β')
      .replace(/╬│/g, 'γ')
      .replace(/╬┤/g, 'δ')
      .replace(/╬╡/g, 'ε')
      .replace(/╬╢/g, 'ζ')
      .replace(/╬╖/g, 'η')
      .replace(/╬╣/g, 'ι')
      .replace(/╬║/g, 'κ')
      .replace(/╬╗/g, 'λ')
      .replace(/╬╝/g, 'μ')
      .replace(/╬╜/g, 'ν')
      .replace(/╬╛/g, 'ξ')
      .replace(/╬┐/g, 'ο');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'setup') {
    return (
      <QuizContainer>
        <div className="container">
          <QuizCard>
            <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>
              Quiz Setup - {mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
            </h2>
            
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                className="form-input"
                value={quizConfig.subject}
                onChange={(e) => setQuizConfig({...quizConfig, subject: e.target.value})}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Grade</label>
              <select
                className="form-input"
                value={quizConfig.grade}
                onChange={(e) => setQuizConfig({...quizConfig, grade: e.target.value})}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-input"
                value={quizConfig.difficulty}
                onChange={(e) => setQuizConfig({...quizConfig, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={startQuiz}
                disabled={!quizConfig.subject}
              >
                Start Quiz
              </button>
            </div>
          </QuizCard>
        </div>
      </QuizContainer>
    );
  }

  if (step === 'quiz' && questions.length > 0) {
    const question = questions[currentQuestion];
    
    return (
      <QuizContainer>
        <div className="container">
          <QuizCard>
            <QuizHeader>
              <QuizTitle>{quizConfig.subject} - Grade {quizConfig.grade}</QuizTitle>
              <QuizInfo>
                <span>Mode: {mode}</span>
                <span>Difficulty: {quizConfig.difficulty}</span>
                {mode === 'exam' && <Timer>Time: {formatTime(timeLeft)}</Timer>}
              </QuizInfo>
            </QuizHeader>
          </QuizCard>

          <QuestionCard>
            <QuestionNumber>
              Question {currentQuestion + 1} of {questions.length}
            </QuestionNumber>
            
            {question.passage && (
              <ReadingPassage>
                <h4>Reading Passage:</h4>
                {cleanText(question.passage)}
              </ReadingPassage>
            )}
            
            <QuestionText>{cleanText(question.question)}</QuestionText>
            
            <OptionsGrid>
              {question.options.map((option, index) => (
                <OptionButton
                  key={index}
                  className={`
                    ${selectedAnswer === option ? 'selected' : ''}
                    ${showFeedback && option === question.correctAnswer ? 'correct' : ''}
                    ${showFeedback && selectedAnswer === option && option !== question.correctAnswer ? 'incorrect' : ''}
                  `}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                >
                  {cleanText(option)}
                </OptionButton>
              ))}
            </OptionsGrid>
            
            {showFeedback && (
              <>
                <FeedbackMessage className={selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}>
                  {selectedAnswer === question.correctAnswer 
                    ? 'Correct! Well done.' 
                    : `Incorrect. The correct answer is: ${cleanText(question.correctAnswer)}`
                  }
                </FeedbackMessage>
                {question.explanation && (
                  <FeedbackMessage style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #0ea5e9' }}>
                    <strong>Explanation:</strong> {cleanText(question.explanation)}
                  </FeedbackMessage>
                )}
              </>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Exit Quiz
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={nextQuestion}
                disabled={!selectedAnswer || (mode === 'practice' && !showFeedback)}
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </QuestionCard>
        </div>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <div className="container">
        <QuizCard>
          <div style={{ textAlign: 'center' }}>
            <h2>Loading Quiz...</h2>
          </div>
        </QuizCard>
      </div>
    </QuizContainer>
  );
};

export default Quiz;
