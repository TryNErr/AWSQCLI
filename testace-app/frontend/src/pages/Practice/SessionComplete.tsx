import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  EmojiEvents, 
  Refresh, 
  Home, 
  TrendingUp,
  CheckCircle,
  Cancel,
  Timer
} from '@mui/icons-material';

interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  startTime: Date;
}

interface LocationState {
  stats: SessionStats;
  grade: string;
  difficulty: string;
  subject?: string;
}

const SessionComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as LocationState;
  
  if (!state) {
    // Redirect if no state available
    navigate('/practice');
    return null;
  }

  const { stats, grade, difficulty, subject } = state;
  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
  const sessionDuration = Math.round((new Date().getTime() - new Date(stats.startTime).getTime()) / 1000 / 60); // in minutes
  
  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'success', icon: '🏆' };
    if (accuracy >= 80) return { level: 'Great', color: 'info', icon: '🌟' };
    if (accuracy >= 70) return { level: 'Good', color: 'warning', icon: '👍' };
    if (accuracy >= 60) return { level: 'Fair', color: 'warning', icon: '📚' };
    return { level: 'Needs Practice', color: 'error', icon: '💪' };
  };

  const performance = getPerformanceLevel(accuracy);

  const getEncouragementMessage = (accuracy: number) => {
    if (accuracy >= 90) return "Outstanding work! You've mastered this level.";
    if (accuracy >= 80) return "Great job! You're doing really well.";
    if (accuracy >= 70) return "Good progress! Keep up the practice.";
    if (accuracy >= 60) return "You're getting there! A bit more practice will help.";
    return "Don't give up! Every practice session makes you stronger.";
  };

  const getNextSteps = (accuracy: number, difficulty: string) => {
    if (accuracy >= 90) {
      if (difficulty === 'easy') return "Try medium difficulty questions!";
      if (difficulty === 'medium') return "Challenge yourself with hard questions!";
      return "You've mastered this level! Try a different subject.";
    }
    if (accuracy >= 70) {
      return "Practice a few more questions at this level to build confidence.";
    }
    return "Focus on understanding the explanations and try similar questions.";
  };

  const startNewSession = () => {
    const params = new URLSearchParams({
      grade,
      difficulty,
      ...(subject && { subject })
    });
    navigate(`/practice/session?${params.toString()}`);
  };

  const tryDifferentLevel = () => {
    navigate('/practice');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <EmojiEvents sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Session Complete!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {getEncouragementMessage(accuracy)}
          </Typography>
        </Box>

        {/* Results Summary */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={4}>
            {/* Score Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent>
                  <Typography variant="h2" color="primary.main" gutterBottom>
                    {accuracy}%
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Accuracy
                  </Typography>
                  <Chip 
                    label={`${performance.icon} ${performance.level}`}
                    color={performance.color as any}
                    size="large"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Questions Answered */}
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h3" color="success.main">
                      {stats.correctAnswers}
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ mx: 1 }}>
                      /
                    </Typography>
                    <Typography variant="h3" color="text.secondary">
                      {stats.totalQuestions}
                    </Typography>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Questions Correct
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.totalQuestions - stats.correctAnswers} incorrect
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Session Info */}
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent>
                  <Timer sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                  <Typography variant="h4" color="info.main" gutterBottom>
                    {sessionDuration}m
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Session Time
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Chip label={`Grade ${grade}`} size="small" />
                    <Chip label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} size="small" />
                    {subject && <Chip label={subject} size="small" />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Detailed Breakdown */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Session Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Performance Analysis
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Accuracy Level:</strong> {performance.level}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Questions Attempted:</strong> {stats.totalQuestions}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Success Rate:</strong> {stats.correctAnswers}/{stats.totalQuestions} ({accuracy}%)
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Session Duration:</strong> {sessionDuration} minutes
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Next Steps
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getNextSteps(accuracy, difficulty)}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Recommendation:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {accuracy >= 85 
                      ? "You're ready for more challenging questions!"
                      : "Review the explanations and practice similar questions."
                    }
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startNewSession}
            startIcon={<Refresh />}
            sx={{ minWidth: 200 }}
          >
            Practice Again
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={tryDifferentLevel}
            startIcon={<TrendingUp />}
            sx={{ minWidth: 200 }}
          >
            Try Different Level
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard')}
            startIcon={<Home />}
            sx={{ minWidth: 200 }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Motivational Footer */}
        <Box sx={{ textAlign: 'center', mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            🎓 Keep Learning, Keep Growing!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Every question you answer makes you smarter. Great job on completing this practice session!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SessionComplete;
