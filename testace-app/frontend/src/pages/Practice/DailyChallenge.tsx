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
  FormLabel
} from '@mui/material';
import { EmojiEvents, CalendarToday, Timer } from '@mui/icons-material';
import api from '../../services/authService';

// Mock questions for fallback when API fails
const FALLBACK_QUESTIONS = [
  {
    id: 'q1',
    content: 'What is the chemical symbol for gold?',
    options: ['Au', 'Ag', 'Fe', 'Cu'],
    correctAnswer: 'Au'
  },
  {
    id: 'q2',
    content: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars'
  },
  {
    id: 'q3',
    content: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Platinum', 'Diamond', 'Quartz'],
    correctAnswer: 'Diamond'
  },
  {
    id: 'q4',
    content: 'Which of the following is NOT a state of matter?',
    options: ['Solid', 'Liquid', 'Gas', 'Energy'],
    correctAnswer: 'Energy'
  },
  {
    id: 'q5',
    content: 'What is the process by which plants make their own food using sunlight?',
    options: ['Photosynthesis', 'Respiration', 'Fermentation', 'Digestion'],
    correctAnswer: 'Photosynthesis'
  }
];

const DailyChallenge: React.FC = () => {
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24 hours in seconds
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Challenge dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

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

  const startChallenge = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get questions from API
      try {
        const response = await api.get('/api/challenges/daily');
        if (response.data && response.data.success) {
          setCurrentQuestions(response.data.data.questions);
        } else {
          // Use fallback questions if API response is invalid
          setCurrentQuestions(FALLBACK_QUESTIONS);
        }
      } catch (apiError) {
        console.warn('API error, using fallback questions:', apiError);
        // Use fallback questions if API fails
        setCurrentQuestions(FALLBACK_QUESTIONS);
      }
      
      // Reset challenge state
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setScore(0);
      setShowResults(false);
      
      // Open the challenge dialog
      setDialogOpen(true);
      setLoading(false);
    } catch (err) {
      console.error('Error starting challenge:', err);
      setError('Failed to start challenge. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    // Move to next question or show results
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
      // Mark challenge as completed if score is good enough
      if (score >= 3) {
        setChallengeCompleted(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                      Loading...
                    </Box>
                  ) : 'Start Today\'s Challenge'}
                </Button>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
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
                { date: 'Today', status: challengeCompleted ? 'completed' : 'pending', subject: 'Science', score: challengeCompleted ? '5/5' : undefined },
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

      {/* Challenge Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        {showResults ? (
          <>
            <DialogTitle>Challenge Results</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {score >= 3 ? '🎉 Great job!' : '😕 Try again!'}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Your score: {score}/{currentQuestions.length}
                </Typography>
                <Typography variant="body1">
                  {score >= 3 
                    ? `You've successfully completed today's challenge and maintained your ${currentStreak}-day streak!` 
                    : 'You need to score at least 3/5 to complete the daily challenge.'}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {score < 3 && (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer('');
                    setScore(0);
                    setShowResults(false);
                  }}
                >
                  Try Again
                </Button>
              )}
            </DialogActions>
          </>
        ) : currentQuestions.length > 0 ? (
          <>
            <DialogTitle>
              Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(currentQuestionIndex / currentQuestions.length) * 100} 
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {currentQuestions[currentQuestionIndex].content}
              </Typography>
              
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Select your answer:</FormLabel>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={handleAnswerSelect}
                >
                  {currentQuestions[currentQuestionIndex].options.map((option: string, index: number) => (
                    <FormControlLabel 
                      key={index} 
                      value={option} 
                      control={<Radio />} 
                      label={option} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex < currentQuestions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Loading Challenge</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DailyChallenge;
