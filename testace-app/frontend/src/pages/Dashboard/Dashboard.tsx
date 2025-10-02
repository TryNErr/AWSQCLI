import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  School,
  Timer,
  TrendingUp,
  EmojiEvents,
  LocalFireDepartment,
  Star,
  PlayArrow,
  FlashOn,
  GpsFixed,
  Celebration,
  AutoAwesome,
  RocketLaunch,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUserStats } = useAuth();
  const [motivationalMessage, setMotivationalMessage] = useState('');
  
  useEffect(() => {
    // Refresh user stats when dashboard loads
    refreshUserStats();
  }, []); // Empty dependency array to run only once
  
  useEffect(() => {
    // Set initial motivational message and keep it stable
    const messages = [
      "You're crushing it! 🔥",
      "Keep the momentum going! 🚀",
      "Learning machine activated! ⚡",
      "You're on fire today! 🌟",
      "Unstoppable learner! 💪"
    ];
    
    // Set a stable message based on user's total questions (so it doesn't change randomly)
    const messageIndex = (user?.stats?.totalQuestions || 0) % messages.length;
    setMotivationalMessage(messages[messageIndex]);
  }, [user?.stats?.totalQuestions]); // Only depend on totalQuestions
  
  if (!user) {
    return null;
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "⚡";
    if (streak >= 1) return "✨";
    return "💫";
  };

  const calculateLevel = (totalQuestions: number) => {
    return Math.floor(totalQuestions / 10) + 1;
  };

  const calculateLevelProgress = (totalQuestions: number) => {
    return (totalQuestions % 10) * 10;
  };

  const currentLevel = calculateLevel(user.stats.totalQuestions);
  const levelProgress = calculateLevelProgress(user.stats.totalQuestions);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        {/* Hero Welcome Section */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4
          }}
        >
          {/* Decorative Elements */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }} />
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64,
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.5rem',
                    fontWeight: 700
                  }}
                >
                  {user.profile.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                    Hey {user.profile.firstName}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {motivationalMessage}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Star />}
                  label={`Level ${currentLevel}`}
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<LocalFireDepartment />}
                  label={`${user.streaks.current} day streak ${getStreakEmoji(user.streaks.current)}`}
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<GpsFixed />}
                  label={`Grade ${user.grade}`}
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>
                  {user.stats.averageScore}%
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Average Score
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={levelProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }} 
                />
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  {10 - (user.stats.totalQuestions % 10)} questions to Level {currentLevel + 1}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <School sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {user.stats.totalQuestions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Questions Solved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {user.stats.correctAnswers}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Correct Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {user.streaks.best}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Best Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {currentLevel}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Current Level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '2px solid rgba(99, 102, 241, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.2)',
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                }
              }}
              onClick={() => navigate('/practice/enhanced')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <AutoAwesome sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
                  Enhanced Practice
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                  🚀 Experience our AI-powered practice system with 300%+ more variety, curriculum alignment, and adaptive difficulty!
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/practice/enhanced');
                  }}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                border: '2px solid rgba(245, 158, 11, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2)',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                }
              }}
              onClick={() => navigate('/timed-test')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <FlashOn sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={700} gutterBottom color="#f59e0b">
                  Timed Challenge
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                  ⚡ Test your skills under pressure! Take timed tests with professional-grade filtering and zero repetition.
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Timer />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/timed-test');
                  }}
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
                border: '2px solid rgba(236, 72, 153, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(236, 72, 153, 0.2)',
                  borderColor: 'rgba(236, 72, 153, 0.4)',
                }
              }}
              onClick={() => navigate('/quick-quiz')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <FlashOn sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={700} gutterBottom color="#ec4899">
                  Quick Quiz
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                  ⚡ Jump into a quick 10-question quiz! Choose your subject, grade, and difficulty for instant practice.
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/quick-quiz');
                  }}
                >
                  Quick Start
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2)',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                }
              }}
              onClick={() => navigate('/profile')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Celebration sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={700} gutterBottom color="#10b981">
                  Your Journey
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                  📊 Track your amazing progress, view achievements, and see how you're leveling up your skills!
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunch />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/profile');
                  }}
                >
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Motivational Footer */}
        <Paper sx={{ 
          mt: 4, 
          p: 3, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
            🌟 Keep Going, Champion! 🌟
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Every question you answer makes you stronger. You're building skills that will last a lifetime!
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
