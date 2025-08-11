import React, { useEffect } from 'react';
// Updated: 2025-08-11 - Added 5 practice options including Timed Test and Daily Challenge
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
  Avatar,
} from '@mui/material';
import { 
  School, 
  AutoAwesome, 
  TrendingUp, 
  PlayArrow,
  EmojiEvents,
  Star,
  FlashOn,
  RocketLaunch,
  LocalFireDepartment,
  Timer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUserStats, user } = useAuth();

  useEffect(() => {
    // Refresh stats when practice page loads
    refreshUserStats();
  }, [refreshUserStats]);

  const practiceOptions = [
    {
      title: 'Enhanced Practice',
      description: 'AI-powered adaptive learning with 300%+ more variety',
      icon: <AutoAwesome />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      path: '/practice/enhanced',
      features: ['Adaptive Difficulty', 'Curriculum Aligned', 'Real-time Feedback'],
      emoji: '🚀'
    },
    {
      title: 'Original Practice',
      description: 'Classic practice mode with core question sets',
      icon: <School />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      path: '/practice/question/1',
      features: ['Core Questions', 'Structured Learning', 'Progress Tracking'],
      emoji: '📚'
    },
    {
      title: 'Timed Test',
      description: 'Challenge yourself with time-limited practice sessions',
      icon: <Timer />,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      path: '/timed-test',
      features: ['Time Pressure', 'Exam Simulation', 'Performance Metrics'],
      emoji: '⏱️'
    },
    {
      title: 'Daily Challenge',
      description: 'Complete daily challenges to maintain your streak',
      icon: <EmojiEvents />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      path: '/practice/daily-challenge',
      features: ['Daily Rewards', 'Streak Building', 'Special Challenges'],
      emoji: '🏆'
    },
    {
      title: 'Question History',
      description: 'Review your past performance and track improvement',
      icon: <TrendingUp />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      path: '/practice/history',
      features: ['Performance Analytics', 'Progress Insights', 'Improvement Tips'],
      emoji: '📊'
    }
  ];

  // Debug logging to help identify the issue
  console.log('🎯 Practice Options Debug:', {
    optionsCount: practiceOptions.length,
    optionTitles: practiceOptions.map(opt => opt.title),
    timestamp: new Date().toISOString()
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        {/* Hero Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4
          }}
        >
          {/* Decorative Elements */}
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
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
                    fontSize: '2rem'
                  }}
                >
                  📚
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                    Practice Hub 🎯
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Choose your learning adventure!
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 600 }}>
                Experience our advanced question system with Australian curriculum alignment, 
                adaptive difficulty, and comprehensive progress tracking. Level up your skills! ⚡
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<EmojiEvents />}
                  label="300%+ More Variety"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<Star />}
                  label="Curriculum Aligned"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<FlashOn />}
                  label="Adaptive Learning"
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
                  {user?.stats?.totalQuestions || 0}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Questions Completed
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <LocalFireDepartment sx={{ color: '#fbbf24' }} />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {user?.streaks?.current || 0} day streak!
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Practice Options */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {practiceOptions.map((option: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${option.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[0] || '#6366f1'}15 0%, ${option.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[1] || '#8b5cf6'}15 100%)`,
                  border: `2px solid ${option.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[0] || '#6366f1'}30`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    borderColor: `${option.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[0] || '#6366f1'}60`,
                  }
                }}
                onClick={() => navigate(option.path)}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    background: option.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    {React.cloneElement(option.icon, { sx: { fontSize: 40, color: 'white' } })}
                  </Box>
                  
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {option.title} {option.emoji}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                    {option.description}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {option.features.map((feature: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        sx={{
                          m: 0.5,
                          background: option.gradient,
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{ 
                      background: option.gradient,
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: option.gradient,
                        transform: 'scale(1.02)',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(option.path);
                    }}
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Showcase */}
        <Paper sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 4
        }}>
          <Typography variant="h4" fontWeight={700} gutterBottom align="center" color="primary">
            🌟 Why Choose Enhanced Practice? 🌟
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                }}>
                  🧠
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Adaptive AI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Questions adapt to your skill level for optimal learning
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}>
                  📈
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Progress Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detailed analytics show your improvement over time
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
                }}>
                  🎯
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Curriculum Aligned
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Questions match Australian educational standards
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                }}>
                  ⚡
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Instant Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get immediate explanations and learning tips
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<RocketLaunch />}
            onClick={() => navigate('/practice/enhanced')}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              }
            }}
          >
            Start Enhanced Practice Now! 🚀
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Practice;
