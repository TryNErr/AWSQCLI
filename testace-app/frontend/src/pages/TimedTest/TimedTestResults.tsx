import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Timer,
  School,
  Grade as GradeIcon,
  Speed,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Question } from '../../types';

interface TestResults {
  score: number;
  totalQuestions: number;
  answers: { [key: string]: string };
  questions: Question[];
  timeSpent: number;
  subject: string;
  grade: string;
  difficulty: string;
}

const TimedTestResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state as TestResults;

  if (!results) {
    navigate('/timed-test');
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const percentage = (results.score / results.totalQuestions) * 100;
  const incorrectAnswers = results.totalQuestions - results.score;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Summary Card */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Test Results
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={120}
                thickness={4}
                color={percentage >= 70 ? "success" : percentage >= 40 ? "warning" : "error"}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="div" color="text.secondary">
                  {Math.round(percentage)}%
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="h6">
                  {results.subject}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <GradeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Grade
                </Typography>
                <Typography variant="h6">
                  Grade {results.grade}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Difficulty
                </Typography>
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {results.difficulty}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Timer color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Time Taken
                </Typography>
                <Typography variant="h6">
                  {formatTime(results.timeSpent)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {results.score} out of {results.totalQuestions} correct
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {incorrectAnswers} incorrect answers
            </Typography>
          </Box>
        </Paper>

        {/* Detailed Questions Review */}
        <Typography variant="h5" gutterBottom>
          Question Review
        </Typography>

        {results.questions.map((question, index) => (
          <Paper key={question._id} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Question {index + 1}
              </Typography>
              {results.answers[question._id] === question.correctAnswer ? (
                <Chip
                  icon={<CheckCircle />}
                  label="Correct"
                  color="success"
                  variant="outlined"
                />
              ) : (
                <Chip
                  icon={<Cancel />}
                  label="Incorrect"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>

            <Typography variant="body1" gutterBottom>
              {question.content}
            </Typography>

            <Box sx={{ my: 2 }}>
              {question.options.map((option, optionIndex) => (
                <Button
                  key={optionIndex}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mb: 1,
                    justifyContent: 'flex-start',
                    bgcolor: option === question.correctAnswer
                      ? 'success.light'
                      : option === results.answers[question._id] && option !== question.correctAnswer
                        ? 'error.light'
                        : 'inherit'
                  }}
                  disabled
                >
                  {option}
                </Button>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              Explanation: {question.explanation}
            </Typography>
          </Paper>
        ))}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/practice')}
          >
            Practice More
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/timed-test')}
          >
            Take Another Test
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TimedTestResults;
