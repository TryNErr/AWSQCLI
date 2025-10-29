import React, { useState } from 'react';
import styled from 'styled-components';
import NavigationHeader from './NavigationHeader';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ScoreCard = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
`;

const ScoreValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ScoreLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 20px;
`;

const ScoreDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ScoreDetail = styled.div`
  text-align: center;
`;

const DetailValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const TestInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  text-align: center;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
`;

const InfoValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 5px;
`;

const InfoLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const QuestionsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuestionItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
`;

const QuestionHeader = styled.div`
  background: ${props => props.correct ? '#f0fdf4' : '#fef2f2'};
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuestionNumber = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const QuestionStatus = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.correct ? '#10b981' : '#ef4444'};
  color: white;
`;

const QuestionContent = styled.div`
  padding: 15px;
`;

const QuestionText = styled.div`
  color: #1f2937;
  margin-bottom: 15px;
  font-weight: 500;
`;

const AnswerSection = styled.div`
  margin-bottom: 10px;
`;

const AnswerLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 5px;
`;

const AnswerText = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  background: ${props => {
    if (props.correct) return '#f0fdf4';
    if (props.wrong) return '#fef2f2';
    return '#f8fafc';
  }};
  border: 1px solid ${props => {
    if (props.correct) return '#10b981';
    if (props.wrong) return '#ef4444';
    return '#e5e7eb';
  }};
  color: ${props => {
    if (props.correct) return '#065f46';
    if (props.wrong) return '#991b1b';
    return '#1f2937';
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background: #6366f1;
  color: white;

  &:hover {
    background: #5b21b6;
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Button)`
  background: #e5e7eb;
  color: #374151;

  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
  }
`;

const DisputeButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #f59e0b;
  background: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s;

  &:hover {
    background: #fde68a;
    border-color: #d97706;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TestResults = ({ results, onRetakeTest, onBackToSelection }) => {
  const [disputedQuestions, setDisputedQuestions] = useState(new Set());
  const disputeQuestion = async (question, index) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test-sets/dispute-question', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: question.questionId,
          testSetId: results.testSet._id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          userAnswer: question.userAnswer,
          wasMarkedCorrect: question.isCorrect,
          disputeReason: `Question ${index + 1} disputed by user`
        })
      });

      if (response.ok) {
        setDisputedQuestions(prev => new Set([...prev, question.questionId]));
        alert('Question disputed successfully. It will be reviewed by our team.');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to dispute question');
      }
    } catch (error) {
      alert('Error disputing question');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 80) return '#f59e0b';
    if (percentage >= 70) return '#ef4444';
    return '#6b7280';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <>
      <NavigationHeader 
        title="Test Results" 
        backTo="/" 
        backLabel="Dashboard"
      />
      <Container>
      <Header>
        <ScoreCard>
          <ScoreValue style={{ color: getGradeColor(results.percentage) }}>
            {results.percentage}%
          </ScoreValue>
          <ScoreLabel>
            Grade: {getGradeLetter(results.percentage)} • {results.correctAnswers} out of {results.totalQuestions} correct
          </ScoreLabel>
          
          <ScoreDetails>
            <ScoreDetail>
              <DetailValue>{results.correctAnswers}</DetailValue>
              <DetailLabel>Correct</DetailLabel>
            </ScoreDetail>
            <ScoreDetail>
              <DetailValue>{results.totalQuestions - results.correctAnswers}</DetailValue>
              <DetailLabel>Incorrect</DetailLabel>
            </ScoreDetail>
            <ScoreDetail>
              <DetailValue>{formatTime(results.timeSpent)}</DetailValue>
              <DetailLabel>Time Spent</DetailLabel>
            </ScoreDetail>
            <ScoreDetail>
              <DetailValue>#{results.attemptNumber}</DetailValue>
              <DetailLabel>Attempt</DetailLabel>
            </ScoreDetail>
          </ScoreDetails>
        </ScoreCard>
      </Header>

      <TestInfo>
        <InfoGrid>
          <InfoItem>
            <InfoValue>{results.testSet.name}</InfoValue>
            <InfoLabel>Test Set</InfoLabel>
          </InfoItem>
          <InfoItem>
            <InfoValue>{results.testSet.subject}</InfoValue>
            <InfoLabel>Subject</InfoLabel>
          </InfoItem>
          <InfoItem>
            <InfoValue>Grade {results.testSet.grade}</InfoValue>
            <InfoLabel>Grade Level</InfoLabel>
          </InfoItem>
          <InfoItem>
            <InfoValue>{results.testSet.difficulty}</InfoValue>
            <InfoLabel>Difficulty</InfoLabel>
          </InfoItem>
          <InfoItem>
            <InfoValue>{results.testSet.mode}</InfoValue>
            <InfoLabel>Mode</InfoLabel>
          </InfoItem>
        </InfoGrid>
      </TestInfo>

      <QuestionsSection>
        <SectionTitle>
          📝 Question Review
        </SectionTitle>
        
        {results.results.map((question, index) => (
          <QuestionItem key={index}>
            <QuestionHeader correct={question.isCorrect}>
              <QuestionNumber>Question {index + 1}</QuestionNumber>
              <QuestionStatus correct={question.isCorrect}>
                {question.isCorrect ? 'Correct' : 'Incorrect'}
              </QuestionStatus>
            </QuestionHeader>
            
            <QuestionContent>
              <QuestionText>{question.question}</QuestionText>
              
              <AnswerSection>
                <AnswerLabel>Your Answer:</AnswerLabel>
                <AnswerText 
                  correct={question.isCorrect}
                  wrong={!question.isCorrect && question.userAnswer}
                >
                  {question.userAnswer || 'No answer selected'}
                </AnswerText>
              </AnswerSection>
              
              {!question.isCorrect && (
                <AnswerSection>
                  <AnswerLabel>Correct Answer:</AnswerLabel>
                  <AnswerText correct>
                    {question.correctAnswer}
                  </AnswerText>
                </AnswerSection>
              )}
              
              <DisputeButton
                onClick={() => disputeQuestion(question, index)}
                disabled={disputedQuestions.has(question.questionId)}
              >
                {disputedQuestions.has(question.questionId) ? 'Disputed ✓' : 'Dispute This Question'}
              </DisputeButton>
            </QuestionContent>
          </QuestionItem>
        ))}
      </QuestionsSection>

      <ActionButtons>
        <SecondaryButton onClick={onBackToSelection}>
          Back to Test Selection
        </SecondaryButton>
        <PrimaryButton onClick={onRetakeTest}>
          Retake This Test
        </PrimaryButton>
      </ActionButtons>
    </Container>
    </>
  );
};

export default TestResults;
