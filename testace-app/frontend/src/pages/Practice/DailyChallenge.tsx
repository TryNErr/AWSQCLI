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
  Alert
} from '@mui/material';
import { EmojiEvents, CalendarToday, Timer } from '@mui/icons-material';

const DailyChallenge: React.FC = () => {
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const startChallenge = () => {
    // Start the daily challenge
    console.log('Starting daily challenge...');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Daily Challenge
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      Current Streak
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {currentStreak} days
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                    Next challenge in:
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {formatTimeRemaining(timeRemaining)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {challengeCompleted ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6">
                🎉 Today's challenge completed!
              </Typography>
              <Typography>
                Great job! You've maintained your {currentStreak}-day streak. 
                Come back tomorrow for a new challenge.
              </Typography>
            </Alert>
          ) : (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday color="primary" />
                  <Typography variant="h6">
                    Today's Challenge
                  </Typography>
                  <Chip label="Science" color="primary" size="small" />
                  <Chip label="Medium" color="secondary" size="small" />
                </Box>

                <Typography variant="body1" paragraph>
                  Complete 5 science questions correctly to maintain your streak!
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Progress: 0/5 questions
                  </Typography>
                  <LinearProgress variant="determinate" value={0} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Timer />
                  <Typography variant="body2">
                    Estimated time: 10-15 minutes
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={startChallenge}
                  sx={{ mt: 2 }}
                >
                  Start Today's Challenge
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Challenge History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { date: 'Today', status: 'pending', subject: 'Science' },
                { date: 'Yesterday', status: 'completed', subject: 'Math', score: '4/5' },
                { date: '2 days ago', status: 'completed', subject: 'History', score: '5/5' },
                { date: '3 days ago', status: 'completed', subject: 'Geography', score: '3/5' },
                { date: '4 days ago', status: 'completed', subject: 'Science', score: '5/5' },
              ].map((challenge, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {challenge.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {challenge.subject}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={challenge.status === 'completed' ? 'Completed' : 'Pending'}
                      color={challenge.status === 'completed' ? 'success' : 'default'}
                      size="small"
                    />
                    {challenge.score && (
                      <Typography variant="body2" color="text.secondary">
                        Score: {challenge.score}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DailyChallenge;
