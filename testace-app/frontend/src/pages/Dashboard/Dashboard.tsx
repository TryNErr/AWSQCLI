import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import {
  School,
  Timer,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUserStats } = useAuth();
  
  useEffect(() => {
    // Refresh user stats when dashboard loads
    refreshUserStats();
  }, [refreshUserStats]);
  
  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user.profile.firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Grade {user.grade} | Current Streak: {user.streaks.current} days
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {user.stats.totalQuestions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Questions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {user.stats.correctAnswers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Correct Answers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {user.streaks.best}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Best Streak
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {user.stats.averageScore}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Main Actions */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => navigate('/practice/enhanced')}
            >
              <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Enhanced Practice
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Practice with our enhanced question system featuring 300%+ more variety and curriculum alignment
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 'auto', mb: 1 }}
                onClick={() => navigate('/practice/enhanced')}
              >
                Start Practice
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => navigate('/timed-test')}
            >
              <Timer sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Timed Tests
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Take timed tests to challenge yourself and track your progress with real assessment conditions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 'auto', mb: 1 }}
                onClick={() => navigate('/timed-test')}
              >
                Start Test
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => navigate('/profile')}
            >
              <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                View detailed progress analytics and performance insights across all subjects
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 'auto', mb: 1 }}
                onClick={() => navigate('/profile')}
              >
                View Progress
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
