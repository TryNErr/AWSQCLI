import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavigationHeader from './NavigationHeader';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 200px; /* Increased gap for navigation floaters */

  @media (max-width: 768px) {
    padding: 15px;
    padding-bottom: 220px; /* Increased gap for mobile */
  }
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TestInfo = styled.div``;

const TestTitle = styled.h2`
  color: #1f2937;
  margin: 0 0 5px 0;
`;

const TestMeta = styled.p`
  color: #6b7280;
  margin: 0;
`;

const ProgressInfo = styled.div`
  text-align: right;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.warning ? '#ef4444' : '#6366f1'};
  margin-bottom: 5px;
`;

const Progress = styled.div`
  color: #6b7280;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const QuestionNumber = styled.div`
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 10px;
`;

const QuestionText = styled.h3`
  color: #1f2937;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const Passage = styled.div`
  background: #f8fafc;
  border-left: 4px solid #6366f1;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  line-height: 1.6;
`;

const KeyboardShortcuts = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 15px;
  font-size: 0.8rem;
  color: #6b7280;
`;

const ShortcutTitle = styled.div`
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
`;

const ShortcutList = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ShortcutItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
`;

const ShortcutKey = styled.kbd`
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  padding: 1px 4px;
  font-size: 0.7rem;
  font-family: monospace;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionButton = styled.button`
  padding: 15px 20px;
  border: 2px solid ${props => props.selected ? '#6366f1' : '#e5e7eb'};
  background: ${props => props.selected ? '#f0f9ff' : 'white'};
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:hover {
    border-color: #6366f1;
    background: #f0f9ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const OptionLetter = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${props => props.selected ? '#6366f1' : '#f3f4f6'};
  color: ${props => props.selected ? 'white' : '#6b7280'};
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const OptionText = styled.span`
  flex: 1;
  line-height: 1.5;
`;

const FloatingActions = styled.div`
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 50;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FloatingButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #6366f1;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.2s;

  &:hover {
    background: #5b21b6;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const NavigationContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: calc(100% - 40px);
  max-width: 760px;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    bottom: 10px;
    width: calc(100% - 20px);
    padding: 15px;
    border-radius: 8px;
  }
`;

const NavigationTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const NavigationBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PrevButton = styled(NavButton)`
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;

  &:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
`;

const NextButton = styled(NavButton)`
  background: #6366f1;
  color: white;
  border: 2px solid #6366f1;

  &:hover:not(:disabled) {
    background: #5b21b6;
    border-color: #5b21b6;
  }
`;

const SubmitButton = styled(NavButton)`
  background: #ef4444;
  color: white;
  border: 2px solid #ef4444;
  font-size: 1.1rem;
  padding: 14px 32px;

  &:hover:not(:disabled) {
    background: #dc2626;
    border-color: #dc2626;
  }
`;

const QuestionGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const QuestionGridLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

const QuestionGridWrapper = styled.div`
  max-height: 50px;
  overflow-y: auto;
  padding: 6px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 500px;

  @media (max-width: 768px) {
    max-height: 40px;
    padding: 4px;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
`;

const QuestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28px, 1fr));
  gap: 4px;
  padding: 2px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(24px, 1fr));
    gap: 3px;
  }
`;

const QuestionDot = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid ${props => {
    if (props.current) return '#6366f1';
    if (props.answered) return '#10b981';
    return '#e5e7eb';
  }};
  background: ${props => {
    if (props.current) return '#6366f1';
    if (props.answered) return '#10b981';
    return 'white';
  }};
  color: ${props => (props.current || props.answered) ? 'white' : '#6b7280'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.7rem;
  position: relative;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 0.65rem;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    ${props => !props.current && !props.answered && `
      border-color: #6366f1;
      background: #f0f9ff;
    `}
  }

  ${props => props.current && `
    box-shadow: 0 0 0 2px #6366f1;
  `}
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #10b981 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 1.1rem;
`;

const TestTaking = ({ testSet, onComplete, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    startTest();
  }, [testSet._id]);

  useEffect(() => {
    if (testSet.mode === 'exam' && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, testSet.mode]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const optionIndex = parseInt(event.key) - 1;
          if (questions[currentQuestion] && questions[currentQuestion].options[optionIndex]) {
            handleAnswerSelect(questions[currentQuestion]._id, questions[currentQuestion].options[optionIndex]);
          }
          break;
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleSubmit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, questions]);

  const startTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/test-sets/${testSet._id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start test');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setStartTime(new Date(data.startedAt));
      
      if (testSet.mode === 'exam') {
        setTimeLeft(30 * 60);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    const timeSpent = startTime ? Math.floor((new Date() - startTime) / 1000) : 0;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/test-sets/${testSet._id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers,
          timeSpent,
          startedAt: startTime
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      const result = await response.json();
      onComplete(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return <LoadingMessage>Starting your test...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage style={{ color: '#ef4444' }}>Error: {error}</LoadingMessage>;
  }

  if (questions.length === 0) {
    return <LoadingMessage>No questions available</LoadingMessage>;
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <NavigationHeader 
        title={`${testSet.name} - Question ${currentQuestion + 1}/${questions.length}`}
        backTo="/" 
        backLabel="Dashboard"
      />
      <Container>
      <Header>
        <TestInfo>
          <TestTitle>{testSet.name}</TestTitle>
          <TestMeta>
            {testSet.subject} • Grade {testSet.grade} • {testSet.difficulty} • {testSet.mode}
          </TestMeta>
        </TestInfo>
        <ProgressInfo>
          {testSet.mode === 'exam' && timeLeft !== null && (
            <Timer warning={timeLeft < 300}>
              {formatTime(timeLeft)}
            </Timer>
          )}
          <Progress>
            {answeredCount} of {questions.length} answered
          </Progress>
        </ProgressInfo>
      </Header>

      <FloatingActions>
        <FloatingButton
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          title="Previous Question (←)"
        >
          ←
        </FloatingButton>
        <FloatingButton
          onClick={nextQuestion}
          disabled={currentQuestion === questions.length - 1}
          title="Next Question (→)"
        >
          →
        </FloatingButton>
        <FloatingButton
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          title="Go to Navigation"
        >
          ↓
        </FloatingButton>
      </FloatingActions>

      <QuestionCard>
        <QuestionNumber>
          Question {currentQuestion + 1} of {questions.length}
        </QuestionNumber>
        
        {question.passage && (
          <Passage>{question.passage}</Passage>
        )}
        
        <QuestionText>{question.question}</QuestionText>
        
        <OptionsContainer>
          {question.options.map((option, index) => (
            <OptionButton
              key={index}
              selected={answers[question._id] === option}
              onClick={() => handleAnswerSelect(question._id, option)}
            >
              <OptionLetter selected={answers[question._id] === option}>
                {String.fromCharCode(65 + index)}
              </OptionLetter>
              <OptionText>{option}</OptionText>
            </OptionButton>
          ))}
        </OptionsContainer>
      </QuestionCard>

      <NavigationContainer>
        <NavigationTop>
          <PrevButton
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </PrevButton>

          <ProgressIndicator>
            <span>Progress:</span>
            <ProgressBar>
              <ProgressFill percentage={(answeredCount / questions.length) * 100} />
            </ProgressBar>
            <span>{answeredCount}/{questions.length}</span>
          </ProgressIndicator>

          {currentQuestion === questions.length - 1 ? (
            <SubmitButton onClick={handleSubmit}>
              Submit Test →
            </SubmitButton>
          ) : (
            <NextButton onClick={nextQuestion}>
              Next →
            </NextButton>
          )}
        </NavigationTop>

        <QuestionGridContainer>
          <QuestionGridLabel>
            Jump to Question (Current: {currentQuestion + 1})
          </QuestionGridLabel>
          <QuestionGridWrapper>
            <QuestionGrid>
              {questions.map((_, index) => (
                <QuestionDot
                  key={index}
                  current={index === currentQuestion}
                  answered={answers[questions[index]._id]}
                  onClick={() => goToQuestion(index)}
                  title={`Question ${index + 1}${answers[questions[index]._id] ? ' (Answered)' : ' (Not answered)'}`}
                >
                  {index + 1}
                </QuestionDot>
              ))}
            </QuestionGrid>
          </QuestionGridWrapper>
        </QuestionGridContainer>
      </NavigationContainer>
    </Container>
    </>
  );
};

export default TestTaking;
