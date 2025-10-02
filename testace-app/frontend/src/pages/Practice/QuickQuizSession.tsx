import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, Timer } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import StaticQuestionLoader from '../../utils/staticQuestionLoader';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  question: Question;
}

const QuickQuizSession: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const subject = searchParams.get('subject') || 'Math';
  const grade = searchParams.get('grade') || '6';
  const difficulty = searchParams.get('difficulty') || 'medium';
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const loadedQuestions = await StaticQuestionLoader.getQuestions(
        grade,
        difficulty as DifficultyLevel,
        subject,
        10 // Get exactly 10 questions
      );
      
      if (loadedQuestions.length === 0) {
        setError(`No questions found for ${subject} Grade ${grade} ${difficulty} difficulty.`);
        return;
      }
      
      // Shuffle and take exactly 10 questions
      const shuffled = [...loadedQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 10));
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer,
      isCorrect,
      question: currentQuestion
    };

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      // Quiz complete, navigate to results
      navigate('/quick-quiz/results', { 
        state: { 
          answers: updatedAnswers, 
          subject, 
          grade, 
          difficulty 
        } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Restore previous answer if exists
      const previousAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswer(previousAnswer?.selectedAnswer || '');
      setShowFeedback(!!previousAnswer?.selectedAnswer);
    }
  };

  const handleBackToSelection = () => {
    navigate('/quick-quiz');
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading quiz questions...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={handleBackToSelection}>
            Back to Quiz Selection
          </Button>
        </Box>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            No questions available for the selected criteria.
          </Alert>
          <Button variant="contained" onClick={handleBackToSelection}>
            Back to Quiz Selection
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer />
              Quick Quiz
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={subject} color="secondary" />
              <Chip label={`Grade ${grade}`} color="secondary" />
              <Chip label={difficulty} color="secondary" />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body2">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50'
              }
            }} 
          />
        </Paper>

        {/* Question Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Reading Passage (if exists) */}
            {currentQuestion.passage && (
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Reading Passage
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {currentQuestion.passage}
                </Typography>
              </Paper>
            )}

            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {currentQuestion.content}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswer}
                onChange={handleAnswerChange}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{ 
                      mb: 1,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Feedback */}
            {showFeedback && selectedAnswer && (
              <Box sx={{ mt: 3 }}>
                <Alert 
                  severity={selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                >
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </Alert>
                {currentQuestion.explanation && (
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {questions.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index < currentQuestionIndex 
                    ? '#4caf50' 
                    : index === currentQuestionIndex 
                      ? '#2196f3' 
                      : '#e0e0e0'
                }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            endIcon={currentQuestionIndex === questions.length - 1 ? <CheckCircle /> : <ArrowForward />}
            onClick={handleNext}
            disabled={!selectedAnswer}
            sx={{
              background: currentQuestionIndex === questions.length - 1 
                ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuickQuizSession;
