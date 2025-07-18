import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { ArrowBack, Check, Close } from '@mui/icons-material';
import { Question as QuestionType, DifficultyLevel } from '../../types';

// Mock questions for when API fails
const MOCK_QUESTIONS: Record<string, QuestionType> = {
  '1': {
    _id: '1',
    content: 'What is 2 + 2?',
    type: 'multiple_choice' as any,
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: '2 + 2 equals 4',
    subject: 'Math',
    difficulty: DifficultyLevel.EASY,
    tags: ['arithmetic'],
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  '2': {
    _id: '2',
    content: 'What is the capital of France?',
    type: 'multiple_choice' as any,
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital city of France',
    subject: 'Geography',
    difficulty: DifficultyLevel.EASY,
    tags: ['capitals', 'europe'],
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API (in a real app)
        // const response = await api.get(`/api/questions/${id}`);
        // setQuestion(response.data);
        
        // For now, use mock data
        if (id && MOCK_QUESTIONS[id]) {
          setQuestion(MOCK_QUESTIONS[id]);
        } else {
          setError('Question not found');
        }
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (!question) return;
    
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    // In a real app, you would navigate to the next question
    // For now, just go back to practice
    navigate('/practice');
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !question) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Question not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practice')}
          sx={{ mt: 2 }}
        >
          Back to Practice
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practice')}
          sx={{ mb: 2 }}
        >
          Back to Practice
        </Button>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={question.subject} color="primary" size="small" />
              <Chip label={question.difficulty} color="secondary" size="small" />
            </Box>

            <Typography variant="h5" gutterBottom>
              {question.content}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={handleAnswerChange}
                >
                  {question.options?.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={submitted}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        ...(submitted && option === question.correctAnswer && {
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        }),
                        ...(submitted && selectedAnswer === option && option !== question.correctAnswer && {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        }),
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            {!submitted ? (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                sx={{ mt: 3 }}
              >
                Submit Answer
              </Button>
            ) : (
              <>
                <Alert
                  severity={isCorrect ? 'success' : 'error'}
                  icon={isCorrect ? <Check /> : <Close />}
                  sx={{ mt: 3 }}
                >
                  {isCorrect
                    ? 'Correct! Well done.'
                    : `Incorrect. The correct answer is: ${question.correctAnswer}`}
                </Alert>

                <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom>
                    Explanation
                  </Typography>
                  <Typography variant="body1">
                    {question.explanation}
                  </Typography>
                </Paper>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleNextQuestion}
                >
                  Next Question
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default QuestionPage;
