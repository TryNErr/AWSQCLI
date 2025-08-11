import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Grid,
  Avatar
} from '@mui/material';
import { EmojiEvents, CalendarToday, Timer, Star, LocalFireDepartment, PlayArrow } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DailyChallenge: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(user?.streaks?.current || 0);
  const [loading, setLoading] = useState(false);

  // Get today's date for challenge tracking
  const today = new Date().toDateString();
  const lastChallengeDate = localStorage.getItem('lastDailyChallengeDate');
  const isCompletedToday = lastChallengeDate === today;

  useEffect(() => {
    setChallengeCompleted(isCompletedToday);
  }, [isCompletedToday]);

  const startDailyChallenge = () => {
    setLoading(true);
    
    // Navigate to enhanced practice with daily challenge parameters
    const params = new URLSearchParams({
      mode: 'daily-challenge',
      questions: '10',
      difficulty: 'mixed',
      timeLimit: '600' // 10 minutes
    });
    
    setTimeout(() => {
      navigate(`/practice/session?${params.toString()}`);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#2196f3';
    }
  };

  const todaysChallenges = [
    {
      title: 'Math Master',
      description: 'Solve 5 mathematical reasoning problems',
      difficulty: 'medium',
      points: 50,
      subject: 'Math',
      emoji: '🧮'
    },
    {
      title: 'Reading Comprehension',
      description: 'Complete 3 reading passages with questions',
      difficulty: 'hard',
      points: 75,
      subject: 'English',
      emoji: '📖'
    },
    {
      title: 'Quick Fire',
      description: 'Answer 10 mixed questions in under 5 minutes',
      difficulty: 'easy',
      points: 30,
      subject: 'Mixed',
      emoji: '⚡'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
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
                  🏆
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                    Daily Challenge 🔥
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {challengeCompleted ? 'Challenge Complete!' : 'Ready for today\'s challenge?'}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 600 }}>
                Complete daily challenges to build your streak, earn rewards, and track your progress. 
                New challenges available every day! 🌟
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<LocalFireDepartment />}
                  label={`${currentStreak} Day Streak`}
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<Star />}
                  label="Daily Rewards"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<EmojiEvents />}
                  label="Leaderboard Points"
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
                  {challengeCompleted ? '✅' : '🎯'}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {challengeCompleted ? 'Today\'s Challenge Complete!' : 'Challenge Awaits'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {challengeCompleted ? 'Come back tomorrow for a new challenge!' : 'Complete to maintain your streak'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Challenge Status */}
        {challengeCompleted && (
          <Alert 
            severity="success" 
            sx={{ mb: 4, fontSize: '1.1rem' }}
            icon={<EmojiEvents />}
          >
            🎉 Congratulations! You've completed today's daily challenge. Your streak is now {currentStreak} days!
          </Alert>
        )}

        {/* Today's Challenges */}
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          📅 Today's Challenges
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {todaysChallenges.map((challenge, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: challengeCompleted 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                  border: challengeCompleted 
                    ? '2px solid rgba(76, 175, 80, 0.3)'
                    : '2px solid rgba(245, 158, 11, 0.3)',
                  position: 'relative',
                  opacity: challengeCompleted ? 0.7 : 1
                }}
              >
                {challengeCompleted && (
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#4caf50',
                    color: 'white',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    ✓
                  </Box>
                )}
                
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {challenge.emoji}
                  </Typography>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {challenge.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {challenge.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={challenge.difficulty}
                      size="small"
                      sx={{
                        background: getDifficultyColor(challenge.difficulty),
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    <Chip
                      label={challenge.subject}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    +{challenge.points} points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Button */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
            onClick={startDailyChallenge}
            disabled={challengeCompleted || loading}
            sx={{
              background: challengeCompleted 
                ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              minWidth: 250,
              '&:hover': {
                transform: challengeCompleted ? 'none' : 'translateY(-2px)',
                boxShadow: challengeCompleted ? 'none' : '0 8px 25px rgba(245, 158, 11, 0.3)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                color: 'white'
              }
            }}
          >
            {loading ? 'Starting Challenge...' : challengeCompleted ? 'Challenge Complete! ✅' : 'Start Daily Challenge 🚀'}
          </Button>
        </Box>

        {/* Streak Information */}
        <Paper sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 4
        }}>
          <Typography variant="h5" fontWeight={700} gutterBottom align="center" color="primary">
            🔥 Streak Rewards 🔥
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
                }}>
                  🥉
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  3 Days
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bronze Badge + 50 bonus points
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
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                }}>
                  🥈
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  7 Days
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Silver Badge + 100 bonus points
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
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                }}>
                  🥇
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  14 Days
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gold Badge + 200 bonus points
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
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                }}>
                  💎
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  30 Days
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Diamond Badge + 500 bonus points
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default DailyChallenge;
