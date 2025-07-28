import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Timer, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import { getUserGrade } from '../../services/userContextService';
import { getAnsweredQuestionIds } from '../../services/userProgressService';
import { generateMathQuestions } from '../../utils/mathQuestionGenerator';
import { generateThinkingSkillsQuestions } from '../../utils/thinkingSkillsQuestionGenerator';
import { generateEnglishQuestions } from '../../utils/englishQuestionGenerator';
import { generateMathematicalReasoningQuestions } from '../../utils/mathematicalReasoningQuestionGenerator';
import { calculateAdaptiveDistribution, getDefaultDistribution, getDifficultyKey, getRecommendedDifficulty } from '../../utils/adaptiveDifficulty';
import { distributeQuestionsByDifficulty } from '../../utils/difficultyDistribution';
import { trackQuestionStats } from '../../utils/questionStats';

// Helper function to shuffle an array
const shuffleArray = <T extends unknown>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface TestConfig {
  subject: string;
  grade: string;
  difficulty: string;
}

const TimedTest: React.FC = () => {
  const [showConfig, setShowConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testConfig, setTestConfig] = useState<TestConfig>({
    subject: '',
    grade: getUserGrade(),
    difficulty: 'medium'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // Available subjects
  const subjects = ['Math', 'English', 'Thinking Skills', 'Mathematical Reasoning'];
  
  // Available grades (1-12)
  const grades = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeRemaining]);

  useEffect(() => {
    // Update recommended difficulty when subject changes
    if (testConfig.subject) {
      const recommended = getRecommendedDifficulty(testConfig.subject);
      setTestConfig(prev => ({
        ...prev,
        difficulty: recommended
      }));
    }
  }, [testConfig.subject]);

  const generateQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      const answeredQuestionIds = getAnsweredQuestionIds();
      
      // Get adaptive distribution based on performance
      const distribution = calculateAdaptiveDistribution(
        testConfig.subject,
        testConfig.difficulty
      ) || getDefaultDistribution(testConfig.difficulty);

      // Generate questions for all difficulty levels
      let generatedQuestions: Question[] = [];
      const difficulties = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD];
      
      for (const difficulty of difficulties) {
        const count = Math.floor((distribution[getDifficultyKey(difficulty)] / 100) * 60); // Generate double for better selection
        let questionsForDifficulty: Question[] = [];
        
        switch (testConfig.subject) {
          case 'Math':
            questionsForDifficulty = generateMathQuestions(testConfig.grade, difficulty, count);
            break;
          case 'English':
            questionsForDifficulty = generateEnglishQuestions(testConfig.grade, difficulty, count);
            break;
          case 'Thinking Skills':
            questionsForDifficulty = generateThinkingSkillsQuestions(testConfig.grade, difficulty, count);
            break;
          case 'Mathematical Reasoning':
            questionsForDifficulty = generateMathematicalReasoningQuestions(testConfig.grade, difficulty, count);
            break;
          default:
            throw new Error('Please select a subject');
        }
        
        generatedQuestions.push(...questionsForDifficulty);
      }

      // Filter out previously answered questions
      let availableQuestions = generatedQuestions.filter(q => !answeredQuestionIds.includes(q._id));

      // If we don't have enough questions after filtering, reset the answered questions for this subject
      if (availableQuestions.length < 30) {
        const otherSubjectsAnswered = answeredQuestionIds.filter(id => {
          const question = generatedQuestions.find(q => q._id === id);
          return !question || question.subject !== testConfig.subject;
        });
        localStorage.setItem('answeredQuestionIds', JSON.stringify(otherSubjectsAnswered));
        availableQuestions = generatedQuestions;
      }

      // Distribute questions according to the adaptive distribution
      const selectedQuestions = distributeQuestionsByDifficulty(
        availableQuestions,
        30,
        testConfig.difficulty
      );

      setQuestions(selectedQuestions);
      setShowConfig(false);
      setTestStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = () => {
    // Calculate score
    const score = questions.reduce((acc, q) => {
      return acc + (answers[q._id] === q.correctAnswer ? 1 : 0);
    }, 0);

    // Save answered questions to prevent repetition
    const correctlyAnsweredIds = questions
      .filter(q => answers[q._id] === q.correctAnswer)
      .map(q => q._id);
    
    const existingAnsweredIds = getAnsweredQuestionIds();
    // Create a Set from the combined arrays and convert back to array
    const uniqueIds = Array.from(new Set(existingAnsweredIds.concat(correctlyAnsweredIds)));
    localStorage.setItem('answeredQuestionIds', JSON.stringify(uniqueIds));

    // Track question statistics
    trackQuestionStats(questions);

    // Navigate to results page with score and answers
    navigate('/timed-test/results', {
      state: {
        score,
        totalQuestions: questions.length,
        answers,
        questions,
        timeSpent: 1800 - timeRemaining, // 30 minutes (1800 seconds) - remaining time
        subject: testConfig.subject,
        grade: testConfig.grade,
        difficulty: testConfig.difficulty
      }
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex]._id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (showConfig) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Timed Test Configuration
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={testConfig.subject}
                  label="Subject"
                  onChange={(e: SelectChangeEvent) => 
                    setTestConfig(prev => ({ ...prev, subject: e.target.value }))
                  }
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={testConfig.grade}
                  label="Grade"
                  onChange={(e: SelectChangeEvent) =>
                    setTestConfig(prev => ({ ...prev, grade: e.target.value }))
                  }
                >
                  {grades.map(grade => (
                    <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={testConfig.difficulty}
                  label="Difficulty"
                  onChange={(e: SelectChangeEvent) =>
                    setTestConfig(prev => ({ ...prev, difficulty: e.target.value }))
                  }
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Test Duration: 30 minutes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Questions: 30
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={generateQuestions}
              disabled={loading || !testConfig.subject}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Start Test'}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
            <Typography variant="h6" component="div">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'primary.main',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1
            }}>
              <Timer sx={{ mr: 1 }} />
              <Typography variant="h6">
                {formatTime(timeRemaining)}
              </Typography>
            </Box>
          </Box>

          {/* Question Content */}
          <Typography variant="h6" gutterBottom>
            {currentQuestion?.content}
          </Typography>

          {/* Options */}
          <Box sx={{ my: 3 }}>
            {currentQuestion?.options.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // Convert 0,1,2,3 to A,B,C,D
              return (
                <Button
                  key={index}
                  fullWidth
                  variant={answers[currentQuestion._id] === option ? "contained" : "outlined"}
                  sx={{ 
                    mb: 1, 
                    justifyContent: 'flex-start', 
                    py: 1,
                    pl: 2 
                  }}
                  onClick={() => handleAnswer(option)}
                >
                  <Typography sx={{ minWidth: '24px' }}>{optionLabel}.</Typography>
                  {option}
                </Button>
              );
            })}
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={currentQuestionIndex === questions.length - 1 ? handleTestComplete : handleNext}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next'}
            </Button>
          </Box>
        </Paper>

        {/* Progress Indicators */}
        <Paper sx={{ mt: 2, p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestionIndex === index ? "contained" : "outlined"}
                color={answers[questions[index]._id] ? "success" : "primary"}
                size="small"
                onClick={() => setCurrentQuestionIndex(index)}
                sx={{ minWidth: '40px', height: '40px', p: 0 }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Confirmation Dialog for Test Submission */}
      <Dialog
        open={timeRemaining === 0}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Time's Up!
        </DialogTitle>
        <DialogContent>
          <Typography>
            Your test will be submitted automatically.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTestComplete} autoFocus>
            View Results
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TimedTest;
