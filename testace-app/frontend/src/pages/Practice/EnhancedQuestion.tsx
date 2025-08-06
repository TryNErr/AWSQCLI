import React, { useState, useEffect, useCallback } from 'react';
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
  Stack,
  IconButton
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowBack, CheckCircle, Cancel, Refresh, Timer, PlayArrow, Pause } from '@mui/icons-material';
import { Question as QuestionType, DifficultyLevel } from '../../types';
import { questionData } from './questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../../services/generatedQuestionsService';
import { markQuestionAnswered, getAnsweredQuestionIds } from '../../services/userProgressService';
import { recordQuestionAttempt } from '../../services/questionHistoryService';
import { getUserGrade } from '../../services/userContextService';
import { generateEnhancedQuestion } from '../../utils/enhancedQuestionSystem';

const EnhancedQuestion: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get context parameters for strict filtering
  const contextGrade = searchParams.get('grade');
  const contextDifficulty = searchParams.get('difficulty');
  const contextSubject = searchParams.get('subject');
  
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const loadQuestion = (questionId: string) => {
    setLoading(true);
    
    try {
      // Find question in both standard and generated questions
      const allQuestions = [...questionData, ...getGeneratedQuestions()];
      let foundQuestion = allQuestions.find(q => q._id === questionId);
      
      // If question not found, try to generate a new one with context
      if (!foundQuestion && (contextGrade || contextDifficulty || contextSubject)) {
        console.log(`Question ${questionId} not found, generating new question with context`);
        
        try {
          const grade = contextGrade || getUserGrade().toString();
          const difficulty = contextDifficulty as DifficultyLevel || DifficultyLevel.MEDIUM;
          const subject = contextSubject || undefined;
          
          foundQuestion = generateEnhancedQuestion(grade, subject, difficulty);
          
          if (foundQuestion) {
            // Update the question ID to match the requested one for consistency
            foundQuestion._id = questionId;
            
            // Save the generated question for future use
            const currentGenerated = getGeneratedQuestions();
            const updatedGenerated = [...currentGenerated, foundQuestion];
            saveGeneratedQuestions(updatedGenerated);
            
            console.log(`Generated new question for ID ${questionId}`);
          }
        } catch (error) {
          console.error('Error generating fallback question:', error);
        }
      }
      
      setQuestion(foundQuestion || null);
      
      // Reset question state
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setShowExplanation(false);
      setLoadingNextQuestion(false);
      setAutoAdvanceTimer(0);
      setIsPaused(false);
      
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
    } catch (error) {
      console.error('Error loading question:', error);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadQuestion(id);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [id]);

  // Auto-advance timer effect
  useEffect(() => {
    if (isSubmitted && !isPaused && autoAdvanceTimer > 0) {
      const interval = setInterval(() => {
        setAutoAdvanceTimer(prev => {
          if (prev <= 1) {
            // Time's up, advance to next question
            handleTryAnotherQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    }
  }, [isSubmitted, isPaused, autoAdvanceTimer]);

  const getDifficultyLevel = (difficulty: string): DifficultyLevel => {
    switch (difficulty) {
      case 'easy': return DifficultyLevel.EASY;
      case 'medium': return DifficultyLevel.MEDIUM;
      case 'hard': return DifficultyLevel.HARD;
      default: return DifficultyLevel.MEDIUM;
    }
  };

  const getNextQuestionWithStrictFiltering = (): QuestionType | null => {
    if (!question) return null;
    
    // Use context parameters for strict filtering, fallback to current question properties
    const targetGrade = contextGrade || question.grade;
    const targetDifficulty = contextDifficulty ? getDifficultyLevel(contextDifficulty) : question.difficulty;
    const targetSubject = contextSubject || question.subject;
    
    // Get all available questions
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    
    // Get answered question IDs
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    // Apply STRICT filtering - only questions matching EXACT criteria
    const availableQuestions = allQuestions.filter(q => {
      const gradeMatch = q.grade === targetGrade;
      const difficultyMatch = q.difficulty === targetDifficulty;
      const subjectMatch = !targetSubject || q.subject === targetSubject;
      const notAnswered = !answeredQuestionIds.includes(q._id);
      const notCurrent = q._id !== question._id;
      
      return gradeMatch && difficultyMatch && subjectMatch && notAnswered && notCurrent;
    });
    
    if (availableQuestions.length > 0) {
      // Return a random question from available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      return availableQuestions[randomIndex];
    }
    
    return null;
  };

  const generateNewQuestionWithStrictCriteria = (): QuestionType | null => {
    if (!question) return null;
    
    // Use context parameters for strict filtering, fallback to current question properties
    const targetGrade = contextGrade || question.grade || getUserGrade();
    const targetDifficulty = contextDifficulty ? getDifficultyLevel(contextDifficulty) : question.difficulty || DifficultyLevel.MEDIUM;
    const targetSubject = contextSubject || question.subject;
    
    try {
      const newQuestion = generateEnhancedQuestion(targetGrade, targetSubject, targetDifficulty);
      newQuestion.isGenerated = true;
      newQuestion.generatedAt = new Date();
      
      // Save the generated question
      const existingGenerated = getGeneratedQuestions();
      saveGeneratedQuestions([...existingGenerated, newQuestion]);
      
      return newQuestion;
    } catch (error) {
      console.error('Error generating new question with strict criteria:', error);
      return null;
    }
  };

  const handleTryAnotherQuestion = useCallback(() => {
    setLoadingNextQuestion(true);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // First, try to get an existing unanswered question with strict filtering
    let nextQuestion = getNextQuestionWithStrictFiltering();
    
    // If no existing questions available, generate a new one with strict criteria
    if (!nextQuestion) {
      nextQuestion = generateNewQuestionWithStrictCriteria();
    }
    
    if (nextQuestion) {
      // Load the new question directly
      setQuestion(nextQuestion);
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setShowExplanation(false);
      setLoadingNextQuestion(false);
      setAutoAdvanceTimer(0);
      setIsPaused(false);
      
      // Update URL without navigation, preserving context parameters
      const newUrl = `/practice/question/${nextQuestion._id}`;
      const params = new URLSearchParams();
      if (contextGrade) params.set('grade', contextGrade);
      if (contextDifficulty) params.set('difficulty', contextDifficulty);
      if (contextSubject) params.set('subject', contextSubject);
      
      const finalUrl = params.toString() ? `${newUrl}?${params.toString()}` : newUrl;
      window.history.pushState(null, '', finalUrl);
    } else {
      // If no questions available, go back to practice page
      setLoadingNextQuestion(false);
      navigate('/practice');
    }
  }, [question, contextGrade, contextDifficulty, contextSubject, timerInterval, navigate]);

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
    setAutoAdvanceTimer(5); // Start 5-second countdown

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
      question.correctAnswer,
      question.content,
      question.options,
      question.explanation
    );

    setLoading(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
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
          {/* Auto-advance notification */}
          {isSubmitted && autoAdvanceTimer > 0 && (
            <Alert 
              severity="info" 
              sx={{ mb: 3 }}
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={togglePause}
                    color={isPaused ? "primary" : "default"}
                  >
                    {isPaused ? <PlayArrow /> : <Pause />}
                  </IconButton>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleTryAnotherQuestion}
                  >
                    Next Now
                  </Button>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timer fontSize="small" />
                {isPaused ? 
                  "Timer paused. Click play to resume auto-advance." :
                  `Next question in ${autoAdvanceTimer} seconds...`
                }
              </Box>
            </Alert>
          )}

          {/* Top Action Bar - Show after submission */}
          {isSubmitted && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Alert
                icon={isCorrect ? <CheckCircle /> : <Cancel />}
                severity={isCorrect ? "success" : "error"}
                sx={{ flex: 1, minWidth: '200px' }}
              >
                {isCorrect ? (
                  "Correct! Well done!"
                ) : (
                  <>
                    Incorrect. The correct answer is: {question.correctAnswer}
                  </>
                )}
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={handleTryAnotherQuestion}
                disabled={loadingNextQuestion}
                startIcon={loadingNextQuestion ? <CircularProgress size={16} /> : <Refresh />}
                sx={{ minWidth: '180px' }}
              >
                {loadingNextQuestion ? 'Loading...' : 'Try Another Question'}
              </Button>
            </Box>
          )}

          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={question.subject} color="primary" />
              <Chip label={`Grade ${question.grade}`} color="info" />
              <Chip label={question.difficulty} color="secondary" />
              <Chip label={question.topic} variant="outlined" />
              {(question as any).isGenerated && (
                <Chip label="Enhanced" color="success" size="small" />
              )}
              {/* Show context indicators */}
              {contextGrade && contextDifficulty && (
                <Chip label="Filtered Mode" color="warning" size="small" />
              )}
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
                      Tags: {question.tags?.join(', ') || 'No tags'}
                    </Typography>
                  </Box>
                </Paper>
              )}

              {/* Bottom Try Another Question Button - for users who scroll down */}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleTryAnotherQuestion}
                disabled={loadingNextQuestion}
                startIcon={loadingNextQuestion ? <CircularProgress size={16} /> : <Refresh />}
                sx={{ mt: 3 }}
                fullWidth
              >
                {loadingNextQuestion ? 'Loading Next Question...' : 'Try Another Question'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EnhancedQuestion;
