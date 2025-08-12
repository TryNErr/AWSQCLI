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
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowBack, 
  CheckCircle, 
  Cancel, 
  PlayArrow, 
  Pause, 
  SkipNext,
  ExitToApp,
  Timer
} from '@mui/icons-material';
import { Question as QuestionType, DifficultyLevel, QuestionType as QType } from '../../types';
import { markQuestionAnswered, getAnsweredQuestionIds } from '../../services/userProgressService';
import { recordQuestionAttempt } from '../../services/questionHistoryService';
import { StaticQuestionLoader } from '../../utils/staticQuestionLoader';
import { validateAnswer } from '../../utils/enhancedAnswerValidation';


// Component to properly format reading passages with paragraph breaks
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  return (
    <Box>
      {paragraphs.map((paragraph, index) => {
        const parts = paragraph.split('**');
        const formattedParagraph = parts.map((part, partIndex) => 
          partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
        );
        
        return (
          <Typography 
            key={index} 
            variant="body1" 
            paragraph 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              textAlign: 'left',
              whiteSpace: 'pre-line'
            }}
          >
            {formattedParagraph}
          </Typography>
        );
      })}
    </Box>
  );
};

interface PracticeSessionState {
  questions: QuestionType[];
  currentQuestionIndex: number;
  selectedAnswer: string;
  isSubmitted: boolean;
  isCorrect: boolean;
  showExplanation: boolean;
  sessionStats: {
    totalQuestions: number;
    correctAnswers: number;
    startTime: Date;
  };
  autoAdvanceTimer: number;
  isPaused: boolean;
}

const PracticeSession: React.FC = () => {
  // Smart navigation back to the correct practice screen
  const handleBackToPractice = () => {
    // Get URL parameters to determine where user came from
    const urlParams = new URLSearchParams(window.location.search);
    const hasFilters = urlParams.has('grade') || urlParams.has('difficulty') || urlParams.has('subject');
    
    if (hasFilters) {
      console.log('🔙 Navigating back to Enhanced Practice with filters');
      navigate('/practice/enhanced');
    } else {
      console.log('🔙 Navigating back to main Practice page');
      navigate('/practice');
    }
  };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Helper function to convert difficulty string to enum
  const getDifficultyLevel = (difficulty: string): DifficultyLevel => {
    switch (difficulty) {
      case 'easy': return DifficultyLevel.EASY;
      case 'medium': return DifficultyLevel.MEDIUM;
      case 'hard': return DifficultyLevel.HARD;
      default: return DifficultyLevel.MEDIUM;
    }
  };
  
  // Get session parameters
  const grade = searchParams.get('grade') || '3';
  const difficulty = searchParams.get('difficulty') || 'medium';
  const subject = searchParams.get('subject') || '';
  
  // Session state
  const [sessionState, setSessionState] = useState<PracticeSessionState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: '',
    isSubmitted: false,
    isCorrect: false,
    showExplanation: false,
    sessionStats: {
      totalQuestions: 0,
      correctAnswers: 0,
      startTime: new Date()
    },
    autoAdvanceTimer: 0,
    isPaused: false
  });
  
  const [loading, setLoading] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // Auto-advance timer effect
  useEffect(() => {
    if (sessionState.isSubmitted && !sessionState.isPaused && sessionState.autoAdvanceTimer > 0) {
      const interval = setInterval(() => {
        setSessionState(prev => {
          if (prev.autoAdvanceTimer <= 1) {
            // Time's up, advance to next question
            advanceToNextQuestion();
            return prev;
          }
          return {
            ...prev,
            autoAdvanceTimer: prev.autoAdvanceTimer - 1
          };
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    }
  }, [sessionState.isSubmitted, sessionState.isPaused, sessionState.autoAdvanceTimer]);

  const initializeSession = async () => {
    setLoading(true);
    
    try {
      const difficultyLevel = getDifficultyLevel(difficulty);
      
      console.log(`Initializing practice session: Grade ${grade}, ${difficulty} difficulty${subject ? `, ${subject}` : ''}`);
      
      // Use StaticQuestionLoader for consistent subject filtering (fixes Grade 9 Hard Reading → English bug)
      const questions = await StaticQuestionLoader.getQuestions(
        grade,
        difficultyLevel,
        subject || undefined,
        20 // Request 20 questions for the session
      );
      
      console.log(`Loaded ${questions.length} questions for practice session`);
      
      // Shuffle questions for variety
      const shuffledQuestions = shuffleArray(questions);
      
      setSessionState(prev => ({
        ...prev,
        questions: shuffledQuestions,
        sessionStats: {
          ...prev.sessionStats,
          totalQuestions: shuffledQuestions.length
        }
      }));
      
    } catch (error) {
      console.error('Error initializing session:', error);
      
      // Show error to user
      setSessionState(prev => ({
        ...prev,
        questions: [],
        sessionStats: {
          ...prev.sessionStats,
          totalQuestions: 0
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!sessionState.isSubmitted) {
      setSessionState(prev => ({
        ...prev,
        selectedAnswer: event.target.value
      }));
    }
  };

  const handleSubmit = () => {
    const currentQuestion = sessionState.questions[sessionState.currentQuestionIndex];
    if (!currentQuestion || !sessionState.selectedAnswer || sessionState.isSubmitted) return;

    // Use enhanced answer validation
    const validation = validateAnswer(currentQuestion, sessionState.selectedAnswer);
    const correct = validation.isCorrect;
    
    console.log(`Answer validation result:`, {
      userAnswer: sessionState.selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: correct,
      confidence: validation.confidence
    });
    
    setSessionState(prev => ({
      ...prev,
      isSubmitted: true,
      isCorrect: correct,
      showExplanation: true,
      autoAdvanceTimer: 5, // Start 5-second countdown
      sessionStats: {
        ...prev.sessionStats,
        correctAnswers: correct ? prev.sessionStats.correctAnswers + 1 : prev.sessionStats.correctAnswers
      }
    }));

    // Record the attempt
    markQuestionAnswered(
      currentQuestion._id,
      correct,
      currentQuestion.subject,
      currentQuestion.difficulty,
      currentQuestion.grade
    );

    recordQuestionAttempt(
      currentQuestion._id,
      currentQuestion.subject,
      currentQuestion.difficulty,
      currentQuestion.grade,
      correct,
      sessionState.selectedAnswer,
      currentQuestion.correctAnswer,
      currentQuestion.content,
      currentQuestion.options,
      currentQuestion.explanation
    );
  };

  const advanceToNextQuestion = useCallback(async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    setSessionState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      
      // Check if we need to generate more questions (when we have less than 3 remaining)
      const remainingQuestions = prev.questions.length - nextIndex;
      
      if (remainingQuestions <= 3) {
        // Generate more questions in the background
        generateMoreQuestions();
      }
      
      if (nextIndex >= prev.questions.length) {
        // If we somehow run out of questions, generate emergency questions
        generateEmergencyQuestions();
        return prev;
      }
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswer: '',
        isSubmitted: false,
        isCorrect: false,
        showExplanation: false,
        autoAdvanceTimer: 0,
        isPaused: false
      };
    });
  }, [timerInterval, navigate, grade, difficulty, subject]);

  // Function to generate more questions when running low
  const generateMoreQuestions = async () => {
    try {
      console.log('Generating more questions for continuous practice...');
      
      const { maintainQuestionPool } = await import('../../utils/enhancedQuestionMaintenance');
      
      const difficultyLevel = getDifficultyLevel(difficulty);
      
      const questionPool = await maintainQuestionPool({
        grade: grade,
        difficulty: difficultyLevel,
        subject: subject || undefined,
        minQuestionsRequired: 10,
        maxQuestionsToGenerate: 15
      });
      
      const newQuestions = [...questionPool.available, ...questionPool.generated];
      
      if (newQuestions.length > 0) {
        setSessionState(prev => ({
          ...prev,
          questions: [...prev.questions, ...newQuestions]
        }));
        console.log(`Added ${newQuestions.length} new questions to practice session`);
      }
    } catch (error) {
      console.error('Error generating more questions:', error);
      generateEmergencyQuestions();
    }
  };

  // Function to generate emergency questions if all else fails
  const generateEmergencyQuestions = () => {
    const emergencyQuestions: QuestionType[] = [];
    
    for (let i = 0; i < 5; i++) {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const correctAnswer = num1 + num2;
      
      const wrongAnswers = [
        correctAnswer + Math.floor(Math.random() * 10) + 1,
        correctAnswer - Math.floor(Math.random() * 10) - 1,
        correctAnswer + Math.floor(Math.random() * 15) + 5
      ];
      
      const allOptions = [correctAnswer, ...wrongAnswers];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      
      emergencyQuestions.push({
        _id: `emergency_${Date.now()}_${i}`,
        content: `What is ${num1} + ${num2}?`,
        subject: subject || 'Math',
        difficulty: getDifficultyLevel(difficulty),
        grade: grade,
        type: QType.MULTIPLE_CHOICE,
        options: shuffledOptions.map(String),
        correctAnswer: correctAnswer.toString(),
        explanation: `${num1} + ${num2} = ${correctAnswer}`,
        topic: 'Emergency Math',
        timeLimit: 60,
        tags: ['emergency', 'generated'],
        createdBy: 'system',
        isGenerated: true
      });
    }
    
    setSessionState(prev => ({
      ...prev,
      questions: [...prev.questions, ...emergencyQuestions]
    }));
    
    console.log('Added 5 emergency questions to continue practice');
  };

  const togglePause = () => {
    setSessionState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const handleExitSession = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    navigate('/practice');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Preparing your practice session...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (sessionState.questions.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            No questions available for the selected criteria.
          </Alert>
          <Button
            variant="contained"
            onClick={handleBackToPractice}
            sx={{ mt: 2 }}
          >
            Back to Practice
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = sessionState.questions[sessionState.currentQuestionIndex];
  const progress = ((sessionState.currentQuestionIndex + 1) / sessionState.questions.length) * 100;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Session Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Practice Session
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Grade ${grade}`} color="primary" size="small" />
              <Chip label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} color="secondary" size="small" />
              {subject && <Chip label={subject} color="info" size="small" />}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {sessionState.isSubmitted && sessionState.autoAdvanceTimer > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timer fontSize="small" />
                <Typography variant="body2">
                  Next in {sessionState.autoAdvanceTimer}s
                </Typography>
                <IconButton
                  size="small"
                  onClick={togglePause}
                  color={sessionState.isPaused ? "primary" : "default"}
                >
                  {sessionState.isPaused ? <PlayArrow /> : <Pause />}
                </IconButton>
              </Box>
            )}
            
            <Button
              variant="outlined"
              size="small"
              onClick={handleExitSession}
              startIcon={<ExitToApp />}
            >
              Exit Session
            </Button>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              Question {sessionState.currentQuestionIndex + 1} of {sessionState.questions.length}
            </Typography>
            <Typography variant="body2">
              Score: {sessionState.sessionStats.correctAnswers}/{sessionState.currentQuestionIndex + (sessionState.isSubmitted ? 1 : 0)}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Paper sx={{ p: 4 }}>
          {/* Auto-advance notification */}
          {sessionState.isSubmitted && sessionState.autoAdvanceTimer > 0 && !sessionState.isPaused && (
            <Alert 
              severity="info" 
              sx={{ mb: 3 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={advanceToNextQuestion}
                  startIcon={<SkipNext />}
                >
                  Next Now
                </Button>
              }
            >
              {sessionState.isPaused ? 
                "Timer paused. Click play to resume auto-advance." :
                `Automatically advancing to next question in ${sessionState.autoAdvanceTimer} seconds...`
              }
            </Alert>
          )}

          {/* Result Alert */}
          {sessionState.isSubmitted && (
            <Alert
              icon={sessionState.isCorrect ? <CheckCircle /> : <Cancel />}
              severity={sessionState.isCorrect ? "success" : "error"}
              sx={{ mb: 3 }}
            >
              {sessionState.isCorrect ? (
                "Correct! Well done!"
              ) : (
                <>
                  Incorrect. The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                </>
              )}
            </Alert>
          )}

          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={currentQuestion.subject} color="primary" />
              <Chip label={currentQuestion.topic} variant="outlined" />
              {(currentQuestion as any).isGenerated && (
                <Chip label="Enhanced" color="success" size="small" />
              )}
            </Stack>
            <Typography variant="h5" gutterBottom>
              <FormattedText text={currentQuestion.content} />
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Answer Options */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Choose your answer:
            </Typography>
            <RadioGroup
              value={sessionState.selectedAnswer}
              onChange={handleAnswerChange}
            >
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={sessionState.isSubmitted}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    ...(sessionState.isSubmitted && option === currentQuestion.correctAnswer && {
                      backgroundColor: 'success.light',
                      color: 'success.contrastText',
                    }),
                    ...(sessionState.isSubmitted && sessionState.selectedAnswer === option && option !== currentQuestion.correctAnswer && {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText',
                    }),
                  }}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Submit Button */}
          {!sessionState.isSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!sessionState.selectedAnswer}
              fullWidth
              size="large"
            >
              Submit Answer
            </Button>
          ) : (
            <Box>
              {/* Explanation */}
              {sessionState.showExplanation && (
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
                    {currentQuestion.explanation}
                  </Typography>

                  {/* Additional Information */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tags: {currentQuestion.tags?.join(', ') || 'No tags'}
                    </Typography>
                  </Box>
                </Paper>
              )}

              {/* Manual Next Button */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={advanceToNextQuestion}
                  fullWidth
                  startIcon={<SkipNext />}
                >
                  Next Question
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    navigate('/practice/session-complete', {
                      state: {
                        stats: sessionState.sessionStats,
                        grade,
                        difficulty,
                        subject
                      }
                    });
                  }}
                  fullWidth
                  startIcon={<ExitToApp />}
                >
                  Complete Session
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Exit Practice Session?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit this practice session? Your progress will be saved, but the session will end.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Current Score: {sessionState.sessionStats.correctAnswers}/{sessionState.currentQuestionIndex + (sessionState.isSubmitted ? 1 : 0)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>
            Continue Session
          </Button>
          <Button onClick={confirmExit} color="error" variant="contained">
            Exit Session
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PracticeSession;
