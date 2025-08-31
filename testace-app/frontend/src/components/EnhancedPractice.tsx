import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { Question } from '../types';
import { apiService } from '../services/api';
import InfiniteQuestionLoader from './InfiniteQuestionLoader';

interface EnhancedPracticeProps {
  subject?: string;
  difficulty?: string;
}

export const EnhancedPractice: React.FC<EnhancedPracticeProps> = ({
  subject = 'Mathematics',
  difficulty = 'medium'
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize infinite practice session
  useEffect(() => {
    initializePractice();
  }, [subject, difficulty]);

  const initializePractice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.post('/sessions/practice/infinite', {
        subject,
        difficulty,
        batchSize: 20
      });

      const { sessionId: newSessionId, questions: initialQuestions } = response.data.data;
      setSessionId(newSessionId);
      setQuestions(initialQuestions);
      setCurrentIndex(0);
      setScore({ correct: 0, total: 0 });
    } catch (error: any) {
      console.error('Error initializing practice:', error);
      setError(error.response?.data?.message || 'Failed to start practice session');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionsLoaded = (newQuestions: Question[]) => {
    setQuestions(prev => [...prev, ...newQuestions]);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !sessionId) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    try {
      // Submit answer to backend
      await apiService.post(`/sessions/${sessionId}/answer`, {
        questionId: currentQuestion._id,
        answer: selectedAnswer,
        timeSpent: 30 // Could track actual time
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(prev => prev + 1);
    setSelectedAnswer('');
    setShowResult(false);
    
    // Load more questions when approaching the end
    if (currentIndex >= questions.length - 5 && sessionId) {
      // Trigger loading more questions
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  if (loading && questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Starting infinite practice session...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={initializePractice} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!currentQuestion) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">No questions available</Typography>
        <Button onClick={initializePractice} sx={{ mt: 2 }}>
          Start Practice
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Progress and Stats */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip 
            label={`Question ${currentIndex + 1} of ${questions.length}+`} 
            color="primary" 
          />
          <Chip 
            label={`Accuracy: ${accuracy}%`} 
            color={accuracy >= 70 ? 'success' : 'warning'} 
          />
          <Chip 
            label={`Score: ${score.correct}/${score.total}`} 
            variant="outlined" 
          />
        </Stack>
        
        <LinearProgress 
          variant="determinate" 
          value={Math.min(progress, 100)} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.content}
          </Typography>

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">Choose your answer:</FormLabel>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={showResult}
                  sx={{
                    backgroundColor: showResult
                      ? option === currentQuestion.correct_answer
                        ? 'success.light'
                        : option === selectedAnswer
                        ? 'error.light'
                        : 'transparent'
                      : 'transparent',
                    borderRadius: 1,
                    px: 1,
                    my: 0.5
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {showResult && (
            <Alert 
              severity={selectedAnswer === currentQuestion.correct_answer ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {selectedAnswer === currentQuestion.correct_answer 
                ? '✅ Correct!' 
                : `❌ Incorrect. The correct answer is: ${currentQuestion.correct_answer}`
              }
              {currentQuestion.explanation && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </Typography>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        {!showResult ? (
          <Button
            variant="contained"
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            size="large"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={nextQuestion}
            size="large"
          >
            Next Question →
          </Button>
        )}
        
        <Button
          variant="outlined"
          onClick={initializePractice}
        >
          Restart Practice
        </Button>
      </Box>

      {/* Infinite Question Loader */}
      {sessionId && (
        <InfiniteQuestionLoader
          sessionId={sessionId}
          onQuestionsLoaded={handleQuestionsLoaded}
          onError={handleError}
          batchSize={10}
        />
      )}
    </Box>
  );
};

export default EnhancedPractice;
