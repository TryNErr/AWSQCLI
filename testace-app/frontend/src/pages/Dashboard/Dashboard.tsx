import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Timer,
  EmojiEvents,
  PlayArrow,
  Assessment,
  Create,
  Leaderboard,
  LocalFireDepartment,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/authService';

interface DashboardData {
  user: {
    username: string;
    profile: any;
    stats: any;
    streaks: any;
  };
  recentSessions: any[];
  dailyChallengeStatus: {
    completed: boolean;
    score: number | null;
    completedAt: Date | null;
  };
  weekStats: {
    sessionsCompleted: number;
    questionsAnswered: number;
    averageAccuracy: number;
    studyTime: number;
  };
  studyRecommendations: string[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboardData, isLoading } = useQuery<DashboardData>(
    'dashboard',
    async () => {
      const response = await api.get('/users/dashboard');
      return response.data.data;
    },
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  if (isLoading || !dashboardData) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading your dashboard...</Typography>
      </Box>
    );
  }

  const { user: userData, recentSessions, dailyChallengeStatus, weekStats, studyRecommendations } = dashboardData;

  const quickActions = [
    {
      title: 'Start Practice',
      description: 'Begin adaptive practice session',
      icon: <PlayArrow />,
      color: 'primary',
      action: () => navigate('/practice'),
    },
    {
      title: 'Timed Test',
      description: 'Take a timed practice test',
      icon: <Timer />,
      color: 'secondary',
      action: () => navigate('/timed-test'),
    },
    {
      title: 'Daily Challenge',
      description: dailyChallengeStatus.completed ? 'Completed!' : 'Take today\'s challenge',
      icon: <EmojiEvents />,
      color: dailyChallengeStatus.completed ? 'success' : 'warning',
      action: () => navigate('/daily-challenge'),
      disabled: dailyChallengeStatus.completed,
    },
    {
      title: 'Writing Critique',
      description: 'Get AI feedback on your writing',
      icon: <Create />,
      color: 'info',
      action: () => navigate('/writing'),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}
                src={userData.profile.avatar}
              >
                {userData.profile.firstName[0]}{userData.profile.lastName[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Welcome back, {userData.profile.firstName}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Ready to continue your learning journey? You're doing great!
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalFireDepartment />
                <Typography variant="h6">
                  {userData.streaks.current} day streak
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayArrow /> Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: action.disabled ? 'not-allowed' : 'pointer',
                      opacity: action.disabled ? 0.6 : 1,
                      '&:hover': {
                        transform: action.disabled ? 'none' : 'translateY(-4px)',
                        boxShadow: action.disabled ? 'none' : 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={action.disabled ? undefined : action.action}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: `${action.color}.light`,
                          color: `${action.color}.main`,
                          mb: 2,
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Stats Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment /> This Week's Progress
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {weekStats.sessionsCompleted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sessions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      {weekStats.questionsAnswered}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Questions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {Math.round(weekStats.averageAccuracy)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {weekStats.studyTime}m
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Study Time
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Overall Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(userData.stats.accuracy, 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Math.round(userData.stats.accuracy)}% accuracy across {userData.stats.totalQuestions} questions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Streak & Achievements */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalFireDepartment /> Streak & Stats
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" color="warning.main">
                  {userData.streaks.current}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Current Streak
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Longest: {userData.streaks.longest} days
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Questions</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {userData.stats.totalQuestions}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Correct Answers</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {userData.stats.correctAnswers}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Study Time</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(userData.stats.totalStudyTime / 3600)}h
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Sessions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule /> Recent Sessions
              </Typography>
              {recentSessions.length > 0 ? (
                <List>
                  {recentSessions.slice(0, 5).map((session, index) => (
                    <React.Fragment key={session._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getSessionColor(session.mode) }}>
                            {getSessionIcon(session.mode)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1">
                                {session.subject || 'Mixed'} - {session.mode.replace('_', ' ')}
                              </Typography>
                              <Chip
                                label={`${session.score}%`}
                                size="small"
                                color={session.score >= 80 ? 'success' : session.score >= 60 ? 'warning' : 'error'}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {session.questionsCount} questions • {new Date(session.createdAt).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentSessions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No recent sessions. Start practicing to see your progress here!
                </Typography>
              )}
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/analytics')}
              >
                View All Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> AI Study Recommendations
              </Typography>
              {studyRecommendations.length > 0 ? (
                <List>
                  {studyRecommendations.slice(0, 4).map((recommendation, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 32, height: 32 }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {recommendation}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  Complete more sessions to get personalized recommendations!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper functions
const getSessionColor = (mode: string) => {
  switch (mode) {
    case 'practice': return 'primary.main';
    case 'timed': return 'secondary.main';
    case 'daily_challenge': return 'warning.main';
    default: return 'grey.500';
  }
};

const getSessionIcon = (mode: string) => {
  switch (mode) {
    case 'practice': return <School />;
    case 'timed': return <Timer />;
    case 'daily_challenge': return <EmojiEvents />;
    default: return <PlayArrow />;
  }
};

export default Dashboard;
