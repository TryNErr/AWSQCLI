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
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
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
  timeSpent: number;
  subject: string;
  grade: string;
  difficulty: string;
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

    // Calculate initial metrics
    const totalQuestions = results.questions.length;
    const correctAnswers = results.questions.filter(
      q => results.answers[q._id] === q.correctAnswer
    ).length;
    
    setMetrics({
      accuracy: (correctAnswers / totalQuestions) * 100,
      averageTime: results.timeSpent / totalQuestions,
      difficultyBreakdown: {
        easy: results.questions.filter(q => q.difficulty === 'EASY').length,
        medium: results.questions.filter(q => q.difficulty === 'MEDIUM').length,
        hard: results.questions.filter(q => q.difficulty === 'HARD').length,
        total: totalQuestions
      }
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
    return results.questions.filter(q => 
      q.difficulty === difficulty && 
      (results.answers[q._id] === q.correctAnswer) === correct
    ).length;
  };

  const countSkippedByDifficulty = (difficulty: string): number => {
    return results.questions.filter(q => 
      q.difficulty === difficulty && 
      !results.answers[q._id]
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
    // Performance distribution pie chart data
    const pieData = [
      { name: 'Correct', value: metrics.accuracy, color: '#4caf50' },
      { name: 'Incorrect', value: 100 - metrics.accuracy, color: '#f44336' }
    ];

    // Performance trend data
    const trendData = recentAttempts.map(attempt => ({
      date: attempt.timestamp,
      accuracy: attempt.correct ? 100 : 0,
      avgTime: attempt.timeSpent
    }));

    // Skill radar data
    const skillData = [
      { subject: 'Speed', value: 100 - (metrics.averageTime / 120) * 100, fullMark: 100 },
      { subject: 'Accuracy', value: metrics.accuracy, fullMark: 100 },
      { subject: 'Consistency', value: calculateConsistency(), fullMark: 100 },
      { subject: 'Difficulty', value: calculateDifficultyScore(), fullMark: 100 },
      { subject: 'Progress', value: calculateProgressScore(), fullMark: 100 }
    ];

    // Question type analysis
    const questionTypeData = [
      {
        type: 'Easy',
        correct: countAnswersByDifficulty('EASY', true),
        incorrect: countAnswersByDifficulty('EASY', false),
        skipped: countSkippedByDifficulty('EASY')
      },
      {
        type: 'Medium',
        correct: countAnswersByDifficulty('MEDIUM', true),
        incorrect: countAnswersByDifficulty('MEDIUM', false),
        skipped: countSkippedByDifficulty('MEDIUM')
      },
      {
        type: 'Hard',
        correct: countAnswersByDifficulty('HARD', true),
        incorrect: countAnswersByDifficulty('HARD', false),
        skipped: countSkippedByDifficulty('HARD')
      }
    ];

    // Time distribution data
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

          {/* Recommendations */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
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
              </List>
            </Paper>
          </Grid>
        </Grid>

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
