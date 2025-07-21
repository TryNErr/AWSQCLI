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
import { ArrowBack, Check, Close, History } from '@mui/icons-material';
import { Question as QuestionType } from '../../types';
import { questionData } from './questionData';
import { markQuestionAnswered, isQuestionAnswered } from '../../services/userProgressService';
import { recordQuestionAttempt } from '../../services/questionHistoryService';
import { getGeneratedQuestionById, getGeneratedQuestions } from '../../services/generatedQuestionsService';

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
        
        // For now, use our local question data
        if (id) {
          // First check in the standard question data
          let foundQuestion = questionData.find(q => q._id === id);
          
          // If not found, check in generated questions
          if (!foundQuestion) {
            const generatedQuestion = getGeneratedQuestionById(id);
            if (generatedQuestion) {
              foundQuestion = generatedQuestion;
            }
          }
          
          if (foundQuestion) {
            setQuestion(foundQuestion);
            
            // Check if the question has already been answered
            if (isQuestionAnswered(foundQuestion._id)) {
              // If already answered, automatically go to the next question
              setTimeout(() => {
                handleNextQuestion();
              }, 500);
            }
          } else {
            setError('Question not found');
          }
        } else {
          setError('Invalid question ID');
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
    
    // Mark question as answered in user progress
    markQuestionAnswered(question._id, correct);
    
    // Record the question attempt in history
    recordQuestionAttempt(question, selectedAnswer, correct);
    
    // Automatically proceed to the next question after a delay
    setTimeout(() => {
      handleNextQuestion();
    }, 3000); // 3 seconds delay
  };

  const handleNextQuestion = () => {
    // Find the next question in the same subject and grade
    if (question) {
      // Combine standard and generated questions
      const allQuestions = [...questionData, ...getGeneratedQuestions()];
      
      const currentIndex = allQuestions.findIndex(q => q._id === question._id);
      if (currentIndex !== -1) {
        // Filter questions with the same subject and grade
        const similarQuestions = allQuestions.filter(
          q => q.subject === question.subject && 
               q.grade === question.grade && 
               q._id !== question._id
        );
        
        if (similarQuestions.length > 0) {
          // Pick a random question from the filtered list
          const randomIndex = Math.floor(Math.random() * similarQuestions.length);
          navigate(`/practice/question/${similarQuestions[randomIndex]._id}`);
          // Reset state for the new question
          setSelectedAnswer('');
          setSubmitted(false);
          setIsCorrect(false);
          return;
        }
      }
    }
    
    // If no similar question found or any error, go back to practice
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
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={question.subject} color="primary" size="small" />
              {question.grade && (
                <Chip label={`Grade ${question.grade}`} color="info" size="small" />
              )}
              <Chip label={question.difficulty} color="secondary" size="small" />
              {question.tags && question.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" size="small" />
              ))}
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
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
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
