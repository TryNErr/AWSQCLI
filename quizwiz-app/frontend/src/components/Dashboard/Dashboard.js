import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const Header = styled.header`
  background: white;
  padding: 16px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const SecondaryButton = styled(Button)`
  background: #e5e7eb;
  color: #374151;

  &:hover {
    background: #d1d5db;
  }
`;

const PrimaryButton = styled(Button)`
  background: #6366f1;
  color: white;

  &:hover {
    background: #5b21b6;
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 48px;
`;

const WelcomeTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const QuizOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const QuizIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${props => props.gradient};
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const QuizTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const QuizDescription = styled.p`
  color: #6b7280;
  margin-bottom: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    completedQuizzes: 0,
    bestSubject: 'N/A'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/quiz/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const startTest = () => {
    navigate('/test');
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>QuizWiz</Logo>
          <UserMenu>
            <UserName>Hi, {user?.name}</UserName>
            <SecondaryButton onClick={() => navigate('/profile')}>
              Profile
            </SecondaryButton>
            <PrimaryButton onClick={logout}>
              Logout
            </PrimaryButton>
          </UserMenu>
        </HeaderContent>
      </Header>

      <Main>
        <WelcomeSection>
          <WelcomeTitle>Ready to test your knowledge?</WelcomeTitle>
          <WelcomeSubtitle>
            Choose from organized test sets with 15 questions each. Track your progress across different subjects and difficulty levels.
          </WelcomeSubtitle>
        </WelcomeSection>

        <QuizOptions>
          <QuizCard>
            <QuizIcon gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)">📚</QuizIcon>
            <QuizTitle>Practice Mode</QuizTitle>
            <QuizDescription>
              Untimed practice with instant feedback. Perfect for learning and reviewing concepts. Each test set contains 15 carefully selected questions.
            </QuizDescription>
            <PrimaryButton onClick={startTest}>
              Start Practice Tests
            </PrimaryButton>
          </QuizCard>

          <QuizCard>
            <QuizIcon gradient="linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)">⏱️</QuizIcon>
            <QuizTitle>Exam Mode</QuizTitle>
            <QuizDescription>
              Timed exam simulation with results at the end. Test your knowledge under pressure with 30-minute time limits.
            </QuizDescription>
            <PrimaryButton onClick={startTest}>
              Start Exam Tests
            </PrimaryButton>
          </QuizCard>
        </QuizOptions>

        <section>
          <h3 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
            Your Progress
          </h3>
          <StatsGrid>
            <StatCard>
              <StatValue>{stats.totalQuizzes}</StatValue>
              <StatLabel>Total Test Sets</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.averageScore}%</StatValue>
              <StatLabel>Average Score</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.completedQuizzes}</StatValue>
              <StatLabel>Completed Sets</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.bestSubject}</StatValue>
              <StatLabel>Best Subject</StatLabel>
            </StatCard>
          </StatsGrid>
        </section>
      </Main>
    </DashboardContainer>
  );
};

export default Dashboard;
