import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavigationHeader from './NavigationHeader';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #6366f1;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  border: 2px solid ${props => props.active ? 'var(--primary)' : '#e5e7eb'};
  border-radius: 12px;
  background: ${props => props.active ? 'var(--primary)' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover {
    border-color: var(--primary);
    background: ${props => props.active ? 'var(--primary)' : '#f8fafc'};
  }
`;

const FilterButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const TestSetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const TestSetCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  ${props => props.status === 'completed' && `
    border-color: #10b981;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  `}

  ${props => props.status === 'in_progress' && `
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  `}
`;

const TestSetHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const TestSetTitle = styled.h3`
  color: #1f2937;
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return 'background: #10b981; color: white;';
      case 'in_progress':
        return 'background: #f59e0b; color: white;';
      default:
        return 'background: #e5e7eb; color: #6b7280;';
    }
  }}
`;

const TestSetInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.mode === 'exam' ? '#ef4444' : '#6366f1'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.mode === 'exam' ? '#dc2626' : '#5b21b6'};
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
  font-size: 1.1rem;
`;

const TestSetSelection = ({ onStartTest }) => {
  const { user } = useAuth();
  const [testSets, setTestSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    subject: 'reading',
    grade: user?.grade || '9',
    difficulty: 'medium',
    mode: 'practice'
  });

  const subjects = ['math', 'english', 'reading', 'thinking', 'reasoningmathematical'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const difficulties = ['easy', 'medium', 'hard'];
  const modes = ['practice', 'exam'];

  const fetchTestSets = async () => {
    if (!filters.subject || !filters.grade || !filters.difficulty || !filters.mode) {
      setTestSets([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/test-sets/available?subject=${filters.subject}&grade=${filters.grade}&difficulty=${filters.difficulty}&mode=${filters.mode}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch test sets');
      }

      const data = await response.json();
      setTestSets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestSets();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartTest = (testSet) => {
    onStartTest(testSet);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  return (
    <>
      <NavigationHeader 
        title="Choose Your Test Set" 
        backTo="/" 
        backLabel="Dashboard"
      />
      <Container>
      <Header>
        <Title>Choose Your Test Set</Title>
        <Subtitle>Select subject, grade, difficulty, and mode to see available test sets</Subtitle>
      </Header>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label>Subject</Label>
            <FilterButtonGrid>
              {subjects.map(subject => (
                <FilterButton
                  key={subject}
                  active={filters.subject === subject}
                  onClick={() => handleFilterChange('subject', subject)}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </FilterButton>
              ))}
            </FilterButtonGrid>
          </FilterGroup>

          <FilterGroup>
            <Label>Grade</Label>
            <FilterButtonGrid>
              {grades.map(grade => (
                <FilterButton
                  key={grade}
                  active={filters.grade === grade}
                  onClick={() => handleFilterChange('grade', grade)}
                >
                  Grade {grade}
                </FilterButton>
              ))}
            </FilterButtonGrid>
          </FilterGroup>

          <FilterGroup>
            <Label>Difficulty</Label>
            <FilterButtonGrid>
              {difficulties.map(difficulty => (
                <FilterButton
                  key={difficulty}
                  active={filters.difficulty === difficulty}
                  onClick={() => handleFilterChange('difficulty', difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </FilterButton>
              ))}
            </FilterButtonGrid>
          </FilterGroup>

          <FilterGroup>
            <Label>Mode</Label>
            <FilterButtonGrid>
              {modes.map(mode => (
                <FilterButton
                  key={mode}
                  active={filters.mode === mode}
                  onClick={() => handleFilterChange('mode', mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                </FilterButton>
              ))}
            </FilterButtonGrid>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      {loading && <LoadingMessage>Loading test sets...</LoadingMessage>}
      
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}

      {!loading && !error && testSets.length === 0 && filters.subject && (
        <LoadingMessage>No test sets available for the selected criteria</LoadingMessage>
      )}

      {!loading && !error && testSets.length > 0 && (
        <TestSetsGrid>
          {testSets.map(testSet => (
            <TestSetCard
              key={testSet._id}
              status={testSet.status}
              onClick={() => handleStartTest(testSet)}
            >
              <TestSetHeader>
                <TestSetTitle>Set {testSet.setNumber}</TestSetTitle>
                <StatusBadge status={testSet.status}>
                  {getStatusText(testSet.status)}
                </StatusBadge>
              </TestSetHeader>

              <TestSetInfo>
                <InfoItem>
                  <InfoLabel>Questions</InfoLabel>
                  <InfoValue>{testSet.totalQuestions}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Best Score</InfoLabel>
                  <InfoValue>{testSet.bestScore}%</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Attempts</InfoLabel>
                  <InfoValue>{testSet.totalAttempts}</InfoValue>
                </InfoItem>
              </TestSetInfo>

              <StartButton mode={filters.mode}>
                {testSet.status === 'completed' ? 'Retake Test' : 'Start Test'}
              </StartButton>
            </TestSetCard>
          ))}
        </TestSetsGrid>
      )}
    </Container>
    </>
  );
};

export default TestSetSelection;
