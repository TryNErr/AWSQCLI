import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, CheckCircle, Cancel } from '@mui/icons-material';
import { Question as QuestionType } from '../../types';
import { questionData } from './questionData';
import { getGeneratedQuestions } from '../../services/generatedQuestionsService';
import { markQuestionAnswered } from '../../services/userProgressService';
import { recordQuestionAttempt } from '../../services/questionHistoryService';

const Question: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Find question in both standard and generated questions
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    const foundQuestion = allQuestions.find(q => q._id === id);
    setQuestion(foundQuestion || null);
    setLoading(false);
  }, [id]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setSelectedAnswer(event.target.value);
    }
  };

  const handleSubmit = () => {
    if (!question || !selectedAnswer || isSubmitted) return;

    setLoading(true);
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true);

    // Record the attempt
    markQuestionAnswered(
      question._id,
      correct,
      question.subject,
      question.difficulty,
      question.grade
    );

    recordQuestionAttempt(
      question._id,
      question.subject,
      question.difficulty,
      question.grade,
      correct,
      selectedAnswer,
      question.correctAnswer
    );

    setLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!question) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/practice')}
            sx={{ mb: 2 }}
          >
            Back to Practice
          </Button>
          <Alert severity="error">Question not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practice')}
          sx={{ mb: 2 }}
        >
          Back to Practice
        </Button>

        <Paper sx={{ p: 4 }}>
          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={question.subject} color="primary" />
              <Chip label={`Grade ${question.grade}`} color="info" />
              <Chip label={question.difficulty} color="secondary" />
              <Chip label={question.topic} variant="outlined" />
            </Stack>
            <Typography variant="h5" gutterBottom>
              {question.content}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Answer Options */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Choose your answer:
            </Typography>
            <RadioGroup
              value={selectedAnswer}
              onChange={handleAnswerChange}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={isSubmitted}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    ...(isSubmitted && option === question.correctAnswer && {
                      backgroundColor: 'success.light',
                      color: 'success.contrastText',
                    }),
                    ...(isSubmitted && selectedAnswer === option && option !== question.correctAnswer && {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText',
                    }),
                  }}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Submit Button or Result */}
          {!isSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              fullWidth
            >
              Submit Answer
            </Button>
          ) : (
            <Box>
              <Alert
                icon={isCorrect ? <CheckCircle /> : <Cancel />}
                severity={isCorrect ? "success" : "error"}
                sx={{ mb: 3 }}
              >
                {isCorrect ? (
                  "Correct! Well done!"
                ) : (
                  <>
                    Incorrect. The correct answer is: {question.correctAnswer}
                  </>
                )}
              </Alert>

              {/* Explanation */}
              {showExplanation && (
                <Paper variant="outlined" sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom>
                    Explanation
                  </Typography>
                  <Typography
                    variant="body1"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      my: 2
                    }}
                  >
                    {question.explanation}
                  </Typography>

                  {/* Additional Information */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Topic: {question.topic}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tags: {question.tags.join(', ')}
                    </Typography>
                  </Box>
                </Paper>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/practice')}
                sx={{ mt: 3 }}
                fullWidth
              >
                Try Another Question
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Question;
