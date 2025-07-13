import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Timer, PlayArrow, Stop } from '@mui/icons-material';

const TimedTest: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isActive, setIsActive] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = 20;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      // Handle test completion
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setShowStartDialog(false);
    setIsActive(true);
  };

  const stopTest = () => {
    setIsActive(false);
    // Handle test submission
  };

  const progress = ((totalQuestions - currentQuestion) / totalQuestions) * 100;

  return (
    <Container maxWidth="md">
      <Dialog open={showStartDialog} onClose={() => {}}>
        <DialogTitle>Start Timed Test</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to start a 30-minute timed test with 20 questions.
            Once you start, the timer cannot be paused.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              • 30 minutes total time
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 20 questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Mixed difficulty levels
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={startTest} startIcon={<PlayArrow />}>
            Start Test
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Timed Test
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer color={timeRemaining < 300 ? 'error' : 'primary'} />
              <Typography 
                variant="h6" 
                color={timeRemaining < 300 ? 'error' : 'primary'}
              >
                {formatTime(timeRemaining)}
              </Typography>
            </Box>
            {isActive && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={stopTest}
                startIcon={<Stop />}
              >
                End Test
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Question {currentQuestion + 1} of {totalQuestions}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sample Question
            </Typography>
            <Typography variant="body1" paragraph>
              What is the primary function of mitochondria in a cell?
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }}>
                A) Protein synthesis
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }}>
                B) Energy production
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }}>
                C) DNA replication
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }}>
                D) Waste removal
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          >
            Previous
          </Button>
          <Button 
            variant="contained"
            onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
          >
            {currentQuestion === totalQuestions - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TimedTest;
