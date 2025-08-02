import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  HelpOutline,
  TrendingUp,
  Assessment,
  QuestionAnswer,
} from '@mui/icons-material';
import { Question } from '../../types';
import DifficultyDistributionChart from '../../components/charts/DifficultyDistributionChart';
import PerformancePieChart from '../../components/charts/PerformancePieChart';
import PerformanceTrendChart from '../../components/charts/PerformanceTrendChart';
import SkillRadarChart from '../../components/charts/SkillRadarChart';
import QuestionTypeChart from '../../components/charts/QuestionTypeChart';
import TimeDistributionChart from '../../components/charts/TimeDistributionChart';
import { getSubjectPerformance, getRecentAttempts } from '../../utils/questionStats';
import { getRecommendedDifficulty } from '../../utils/adaptiveDifficulty';

interface TestResults {
  score: number;
  totalQuestions: number;
  answers: { [key: string]: string };
  questions: Question[];
  detailedResults?: Array<{
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
    validation: any;
  }>;
  timeSpent: number;
  subject: string;
  grade: string;
  difficulty: string;
  testStatistics?: any;
}

interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

interface QuestionAttempt {
  timestamp: string;
  correct: boolean;
  timeSpent: number;
  difficulty: string;
}

const TimedTestResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results] = useState<TestResults>(location.state as TestResults);
  const [currentTab, setCurrentTab] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    accuracy: 0,
    averageTime: 0,
    difficultyBreakdown: { easy: 0, medium: 0, hard: 0, total: 0 }
  });
  const [recentAttempts] = useState<QuestionAttempt[]>(
    getRecentAttempts(5, results?.subject) || []
  );
  const [recommendedDifficulty, setRecommendedDifficulty] = useState('medium');

  useEffect(() => {
    if (!location.state) {
      navigate('/timed-test');
      return;
    }

    // Calculate accurate metrics using detailed results if available
    const totalQuestions = results.questions.length;
    let correctAnswers = 0;
    
    if (results.detailedResults) {
      // Use detailed results for accurate counting
      correctAnswers = results.detailedResults.filter(result => result.isCorrect).length;
    } else {
      // Fallback to basic comparison
      correctAnswers = results.questions.filter(
        q => results.answers[q._id] === q.correctAnswer
      ).length;
    }
    
    // Calculate accurate difficulty breakdown
    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: totalQuestions
    };
    
    results.questions.forEach(q => {
      const difficulty = q.difficulty.toLowerCase();
      if (difficulty === 'easy') difficultyBreakdown.easy++;
      else if (difficulty === 'medium') difficultyBreakdown.medium++;
      else if (difficulty === 'hard') difficultyBreakdown.hard++;
    });
    
    setMetrics({
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      averageTime: totalQuestions > 0 ? results.timeSpent / totalQuestions : 0,
      difficultyBreakdown
    });

    // Get recommended difficulty
    const recommended = getRecommendedDifficulty(results.subject);
    setRecommendedDifficulty(recommended);
  }, [location.state, navigate, results]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateConsistency = (): number => {
    if (recentAttempts.length < 2) return 100;
    
    const times = recentAttempts.map(a => a.timeSpent);
    const avg = times.reduce((a, b) => a + b) / times.length;
    const variance = times.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / times.length;
    const consistency = 100 - (Math.sqrt(variance) / avg) * 50;
    return Math.max(0, Math.min(100, consistency));
  };

  const calculateDifficultyScore = (): number => {
    const hardCorrect = countAnswersByDifficulty('HARD', true);
    const mediumCorrect = countAnswersByDifficulty('MEDIUM', true);
    const easyCorrect = countAnswersByDifficulty('EASY', true);
    
    return (hardCorrect * 100 + mediumCorrect * 60 + easyCorrect * 30) / 
           (results.questions.length * 100) * 100;
  };

  const calculateProgressScore = (): number => {
    if (recentAttempts.length < 2) return 50;
    
    const recentScores = recentAttempts
      .map(a => a.correct ? 1 : 0)
      .reduce((a: number, b: number): number => a + b, 0);
    
    return (recentScores / recentAttempts.length) * 100;
  };

  const countAnswersByDifficulty = (difficulty: string, correct: boolean): number => {
    if (results.detailedResults) {
      return results.detailedResults.filter(result => 
        result.question.difficulty.toLowerCase() === difficulty.toLowerCase() && 
        result.isCorrect === correct
      ).length;
    }
    
    // Fallback to basic comparison
    return results.questions.filter(q => 
      q.difficulty.toLowerCase() === difficulty.toLowerCase() && 
      (results.answers[q._id] === q.correctAnswer) === correct
    ).length;
  };

  const countSkippedByDifficulty = (difficulty: string): number => {
    return results.questions.filter(q => 
      q.difficulty.toLowerCase() === difficulty.toLowerCase() && 
      (!results.answers[q._id] || results.answers[q._id].trim() === '')
    ).length;
  };

  const generateTimeDistributionData = () => {
    const timeRanges = ['0-30s', '31-60s', '61-90s', '91-120s', '120s+'];
    const distribution = new Array(5).fill(0);
    
    results.questions.forEach(() => {
      const timeSpent = results.timeSpent / results.questions.length; // average time per question
      const rangeIndex = Math.min(Math.floor(timeSpent / 30), 4);
      distribution[rangeIndex]++;
    });

    return timeRanges.map((range, index) => ({
      timeRange: range,
      count: distribution[index]
    }));
  };

  const generateChartData = () => {
    // Performance distribution pie chart data - accurate calculation
    const correctCount = results.detailedResults 
      ? results.detailedResults.filter(r => r.isCorrect).length
      : results.questions.filter(q => results.answers[q._id] === q.correctAnswer).length;
    
    const accuracy = results.questions.length > 0 ? (correctCount / results.questions.length) * 100 : 0;
    
    const pieData = [
      { name: 'Correct', value: accuracy, color: '#4caf50' },
      { name: 'Incorrect', value: 100 - accuracy, color: '#f44336' }
    ];

    // Performance trend data
    const trendData = recentAttempts.map(attempt => ({
      date: attempt.timestamp,
      accuracy: attempt.correct ? 100 : 0,
      avgTime: attempt.timeSpent
    }));

    // Skill radar data - more accurate calculations
    const skillData = [
      { subject: 'Speed', value: Math.max(0, 100 - (metrics.averageTime / 120) * 100), fullMark: 100 },
      { subject: 'Accuracy', value: accuracy, fullMark: 100 },
      { subject: 'Consistency', value: calculateConsistency(), fullMark: 100 },
      { subject: 'Difficulty', value: calculateDifficultyScore(), fullMark: 100 },
      { subject: 'Progress', value: calculateProgressScore(), fullMark: 100 }
    ];

    // Question type analysis - accurate difficulty counting
    const questionTypeData = [
      {
        type: 'Easy',
        correct: countAnswersByDifficulty('easy', true),
        incorrect: countAnswersByDifficulty('easy', false),
        skipped: countSkippedByDifficulty('easy')
      },
      {
        type: 'Medium',
        correct: countAnswersByDifficulty('medium', true),
        incorrect: countAnswersByDifficulty('medium', false),
        skipped: countSkippedByDifficulty('medium')
      },
      {
        type: 'Hard',
        correct: countAnswersByDifficulty('hard', true),
        incorrect: countAnswersByDifficulty('hard', false),
        skipped: countSkippedByDifficulty('hard')
      }
    ];

    // Time distribution data - more realistic distribution
    const timeData = generateTimeDistributionData();

    return {
      pieData,
      trendData,
      skillData,
      questionTypeData,
      timeData
    };
  };

  const chartData = generateChartData();

  // Component for detailed question review
  const QuestionReview: React.FC = () => {
    if (!results.detailedResults && !results.questions) {
      return (
        <Alert severity="warning">
          Detailed question results are not available for this test.
        </Alert>
      );
    }

    const questionsToReview = results.detailedResults || results.questions.map(q => ({
      question: q,
      userAnswer: results.answers[q._id] || '',
      isCorrect: results.answers[q._id] === q.correctAnswer,
      validation: { isCorrect: results.answers[q._id] === q.correctAnswer, explanation: '' }
    }));

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Question-by-Question Review
        </Typography>
        {questionsToReview.map((result, index) => (
          <Accordion key={result.question._id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {result.isCorrect ? (
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                  ) : result.userAnswer ? (
                    <Cancel color="error" sx={{ mr: 1 }} />
                  ) : (
                    <HelpOutline color="warning" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2" fontWeight="bold">
                    Question {index + 1}
                  </Typography>
                </Box>
                <Chip
                  label={result.question.difficulty}
                  size="small"
                  color={
                    result.question.difficulty.toLowerCase() === 'easy' ? 'success' :
                    result.question.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error'
                  }
                  sx={{ mr: 2 }}
                />
                <Chip
                  label={result.isCorrect ? 'Correct' : result.userAnswer ? 'Incorrect' : 'Skipped'}
                  size="small"
                  color={result.isCorrect ? 'success' : result.userAnswer ? 'error' : 'default'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Question:</strong> {result.question.content}
                </Typography>
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Answer Options:</strong>
                  </Typography>
                  {result.question.options.map((option, optIndex) => (
                    <Box
                      key={optIndex}
                      sx={{
                        p: 1,
                        mb: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          option === result.question.correctAnswer ? '#e8f5e8' :
                          option === result.userAnswer && option !== result.question.correctAnswer ? '#ffebee' :
                          'transparent',
                        border: 
                          option === result.userAnswer ? '2px solid #2196f3' :
                          '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="body2">
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {option === result.question.correctAnswer && (
                          <Chip label="Correct Answer" size="small" color="success" sx={{ ml: 1 }} />
                        )}
                        {option === result.userAnswer && option !== result.question.correctAnswer && (
                          <Chip label="Your Answer" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Your Answer:</strong> {result.userAnswer || 'No answer provided'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Correct Answer:</strong> {result.question.correctAnswer}
                  </Typography>
                  {result.question.explanation && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Explanation:</strong> {result.question.explanation}
                    </Typography>
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (!results) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Summary Card */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Test Results
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Score: {results.score}/{results.totalQuestions}
              </Typography>
              <Typography variant="body1">
                Accuracy: {Math.round(metrics.accuracy)}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Time Spent: {formatTime(results.timeSpent)}
              </Typography>
              <Typography variant="body1">
                Avg. Time per Question: {Math.round(metrics.averageTime)}s
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Subject: {results.subject}
              </Typography>
              <Typography variant="body1">
                Grade: {results.grade} | Difficulty: {results.difficulty}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs for different views */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="test results tabs">
            <Tab icon={<Assessment />} label="Analytics" />
            <Tab icon={<QuestionAnswer />} label="Question Review" />
            <Tab icon={<TrendingUp />} label="Recommendations" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {currentTab === 0 && (
          <Grid container spacing={3}>
            {/* Performance Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <PerformancePieChart
                  data={chartData.pieData}
                  title="Performance Distribution"
                />
              </Paper>
            </Grid>

            {/* Performance Trend */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <PerformanceTrendChart
                  data={chartData.trendData}
                  title="Performance Trend"
                />
              </Paper>
            </Grid>

            {/* Skill Analysis */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <SkillRadarChart
                  data={chartData.skillData}
                  title="Skill Analysis"
                />
              </Paper>
            </Grid>

            {/* Question Type Analysis */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <QuestionTypeChart
                  data={chartData.questionTypeData}
                  title="Question Type Analysis"
                />
              </Paper>
            </Grid>

            {/* Time Distribution */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <TimeDistributionChart
                  data={chartData.timeData}
                  title="Time Distribution"
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <QuestionReview />
          </Paper>
        )}

        {currentTab === 2 && (
          <Grid container spacing={3}>
            {/* Recommendations */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Recommended Difficulty"
                      secondary={`Based on your performance, we recommend trying ${recommendedDifficulty} difficulty next time.`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Focus Areas"
                      secondary={`You performed best in ${metrics.difficultyBreakdown.easy > metrics.difficultyBreakdown.hard ? 'easier' : 'harder'} questions. Consider practicing more ${metrics.difficultyBreakdown.easy > metrics.difficultyBreakdown.hard ? 'challenging' : 'fundamental'} problems.`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Time Management"
                      secondary={
                        metrics.averageTime > 90 
                          ? "You're taking longer than average per question. Practice with time limits to improve speed."
                          : metrics.averageTime < 30
                          ? "You're answering very quickly. Consider taking more time to read questions carefully."
                          : "Your pacing is good. Keep maintaining this balance between speed and accuracy."
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Accuracy Improvement"
                      secondary={
                        metrics.accuracy >= 80
                          ? "Excellent accuracy! Consider challenging yourself with harder questions."
                          : metrics.accuracy >= 60
                          ? "Good accuracy. Focus on understanding concepts better to improve further."
                          : "Work on fundamental concepts. Consider reviewing easier material before attempting harder questions."
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/timed-test')}
          >
            Take Another Test
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TimedTestResults;
