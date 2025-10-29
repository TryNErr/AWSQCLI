import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 0;
`;

const ResultsCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: var(--shadow-lg);
  text-align: center;
  margin-bottom: 32px;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.score >= 80 ? 'var(--success)' : props.score >= 60 ? 'var(--warning)' : 'var(--error)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto 24px;
`;

const ResultTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 16px;
`;

const ResultSubtitle = styled.p`
  font-size: 18px;
  color: var(--gray);
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-lighter);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: var(--gray);
  font-weight: 500;
`;

const AnswersReview = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow);
  margin-bottom: 32px;
`;

const QuestionReview = styled.div`
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid var(--gray-lighter);
  
  &.correct {
    background: #f0fdf4;
    border-color: var(--success);
  }
  
  &.incorrect {
    background: #fef2f2;
    border-color: var(--error);
  }
`;

const ReadingPassage = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--dark);
  
  h5 {
    color: var(--primary);
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
  }
`;

const QuestionText = styled.div`
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--dark);
`;

const AnswerText = styled.div`
  margin-bottom: 8px;
  
  &.user-answer {
    color: var(--error);
  }
  
  &.correct-answer {
    color: var(--success);
  }
`;

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

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

  if (!results) {
    navigate('/');
    return null;
  }

  const { score, totalQuestions, correctAnswers, timeSpent, mode, questions, userAnswers } = results;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding performance!";
    if (percentage >= 80) return "Great job!";
    if (percentage >= 70) return "Good work!";
    if (percentage >= 60) return "Not bad, keep practicing!";
    return "Keep studying and try again!";
  };

  return (
    <ResultsContainer>
      <div className="container">
        <ResultsCard>
          <ScoreCircle score={percentage}>
            {percentage}%
          </ScoreCircle>
          
          <ResultTitle>{getPerformanceMessage()}</ResultTitle>
          <ResultSubtitle>
            You scored {correctAnswers} out of {totalQuestions} questions correctly
          </ResultSubtitle>
          
          <StatsGrid>
            <StatCard>
              <StatValue>{percentage}%</StatValue>
              <StatLabel>Score</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{correctAnswers}/{totalQuestions}</StatValue>
              <StatLabel>Correct Answers</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{mode}</StatValue>
              <StatLabel>Mode</StatLabel>
            </StatCard>
            {timeSpent && (
              <StatCard>
                <StatValue>{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</StatValue>
                <StatLabel>Time Spent</StatLabel>
              </StatCard>
            )}
          </StatsGrid>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/quiz', { state: { mode } })}
            >
              Take Another Quiz
            </button>
          </div>
        </ResultsCard>

        {questions && userAnswers && (
          <AnswersReview>
            <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
              Review Your Answers
            </h3>
            
            {questions.map((question, index) => {
              const isCorrect = userAnswers[index] === question.correctAnswer;
              
              return (
                <QuestionReview key={index} className={isCorrect ? 'correct' : 'incorrect'}>
                  {question.passage && (
                    <ReadingPassage>
                      <h5>Reading Passage:</h5>
                      {cleanText(question.passage)}
                    </ReadingPassage>
                  )}
                  
                  <QuestionText>
                    {index + 1}. {cleanText(question.question)}
                  </QuestionText>
                  
                  <AnswerText className="user-answer">
                    Your answer: {cleanText(userAnswers[index]) || 'No answer'}
                  </AnswerText>
                  
                  {!isCorrect && (
                    <>
                      <AnswerText className="correct-answer">
                        Correct answer: {cleanText(question.correctAnswer)}
                      </AnswerText>
                      {question.explanation && (
                        <AnswerText style={{ color: '#0369a1', fontStyle: 'italic', marginTop: '8px' }}>
                          <strong>Explanation:</strong> {cleanText(question.explanation)}
                        </AnswerText>
                      )}
                    </>
                  )}
                </QuestionReview>
              );
            })}
          </AnswersReview>
        )}
      </div>
    </ResultsContainer>
  );
};

export default Results;
