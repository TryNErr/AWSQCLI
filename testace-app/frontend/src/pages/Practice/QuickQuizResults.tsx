import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import { 
  EmojiEvents, 
  Refresh, 
  Home, 
  ExpandMore, 
  CheckCircle, 
  Cancel,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  question: any;
}

const QuickQuizResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserStats } = useAuth();
  
  const { answers, subject, grade, difficulty } = location.state || {};

  useEffect(() => {
    // Refresh user stats to reflect the completed quiz
    refreshUserStats();
  }, [refreshUserStats]);

  if (!answers) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            No quiz results found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/quick-quiz')}>
            Start New Quiz
          </Button>
        </Box>
      </Container>
    );
  }

  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((answer: QuizAnswer) => answer.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! 🌟';
    if (score >= 80) return 'Excellent work! 🎉';
    if (score >= 70) return 'Good job! 👍';
    if (score >= 60) return 'Not bad! Keep practicing! 💪';
    return 'Keep learning! You\'ll improve! 📚';
  };

  const handleRetakeQuiz = () => {
    navigate(`/quick-quiz/session?subject=${subject}&grade=${grade}&difficulty=${difficulty}`);
  };

  const handleNewQuiz = () => {
    navigate('/quick-quiz');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Results Header */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center', 
          background: `linear-gradient(135deg, ${getScoreColor(score)} 0%, ${getScoreColor(score)}aa 100%)`,
          color: 'white'
        }}>
          <EmojiEvents sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Quiz Complete!
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
            {getScoreMessage(score)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip label={subject} color="secondary" />
            <Chip label={`Grade ${grade}`} color="secondary" />
            <Chip label={difficulty} color="secondary" />
          </Box>
        </Paper>

        {/* Score Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h2" sx={{ color: getScoreColor(score), fontWeight: 'bold' }}>
                  {score}%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Overall Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {correctAnswers}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Correct Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h2" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                  {totalQuestions - correctAnswers}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Incorrect Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Progress Bar */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp />
              Performance Breakdown
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                Correct ({correctAnswers}/{totalQuestions})
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={score} 
                sx={{ 
                  flexGrow: 1, 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getScoreColor(score)
                  }
                }} 
              />
              <Typography variant="body2" sx={{ minWidth: 40 }}>
                {score}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question Review
            </Typography>
            {answers.map((answer: QuizAnswer, index: number) => (
              <Accordion key={answer.questionId} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {answer.isCorrect ? (
                      <CheckCircle sx={{ color: '#4caf50' }} />
                    ) : (
                      <Cancel sx={{ color: '#f44336' }} />
                    )}
                    <Typography sx={{ flexGrow: 1 }}>
                      Question {index + 1}
                    </Typography>
                    <Chip 
                      label={answer.isCorrect ? 'Correct' : 'Incorrect'} 
                      color={answer.isCorrect ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Reading Passage (if exists) */}
                  {answer.question.passage && (
                    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle2" gutterBottom color="primary">
                        Reading Passage
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {answer.question.passage}
                      </Typography>
                    </Paper>
                  )}
                  
                  <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {answer.question.content}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Your Answer: 
                      <Chip 
                        label={answer.selectedAnswer} 
                        color={answer.isCorrect ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    
                    {!answer.isCorrect && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Correct Answer: 
                        <Chip 
                          label={answer.question.correctAnswer} 
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    )}
                    
                    {answer.question.explanation && (
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f7ff', borderRadius: 1 }}>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                          Explanation:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {answer.question.explanation}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRetakeQuiz}
            sx={{ 
              background: 'linear-gradient(45deg, #ff6b6b 30%, #feca57 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5252 30%, #ffb74d 90%)',
              }
            }}
          >
            Retake Quiz
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Star />}
            onClick={handleNewQuiz}
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
              }
            }}
          >
            New Quiz
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleBackToDashboard}
          >
            Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuickQuizResults;
