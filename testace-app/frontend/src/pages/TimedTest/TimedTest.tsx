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
  Chip,
  LinearProgress
} from '@mui/material';
import { Timer, School, CheckCircle, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { Question, DifficultyLevel, QuestionType } from '../../types';
import { getUserGrade } from '../../services/userContextService';
import { generateTimedTest, validateCompleteTest, getTestStatistics } from '../../utils/enhancedTimedTestSystem';
import { validateAnswer } from '../../utils/enhancedAnswerValidation';
import { recordQuestionAttempt } from '../../services/questionHistoryService';
import { markQuestionAnswered } from '../../services/userProgressService';

interface TestConfig {
  subject: string;
  grade: string;
  difficulty: DifficultyLevel;
}

interface TestGenerationStatus {
  isGenerating: boolean;
  progress: string;
  questionsGenerated: number;
  duplicatesRemoved: number;
  validationErrors: string[];
}

const TimedTest: React.FC = () => {
  const [showConfig, setShowConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testConfig, setTestConfig] = useState<TestConfig>({
    subject: '',
    grade: getUserGrade(),
    difficulty: DifficultyLevel.MEDIUM
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [generationStatus, setGenerationStatus] = useState<TestGenerationStatus>({
    isGenerating: false,
    progress: '',
    questionsGenerated: 0,
    duplicatesRemoved: 0,
    validationErrors: []
  });
  const navigate = useNavigate();
  const { settings } = useSettings();

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

  const generateQuestions = async () => {
    setLoading(true);
    setError('');
    setGenerationStatus({
      isGenerating: true,
      progress: 'Initializing test generation...',
      questionsGenerated: 0,
      duplicatesRemoved: 0,
      validationErrors: []
    });

    try {
      console.log(`Generating timed test for ${testConfig.subject}, Grade ${testConfig.grade}, ${testConfig.difficulty} difficulty`);
      
      setGenerationStatus(prev => ({
        ...prev,
        progress: 'Generating questions with enhanced system...'
      }));

      // Get user's preferred question count (default to 30 if not set)
      const userQuestionCount = settings.questionsPerSession || 30;
      console.log(`User requested ${userQuestionCount} questions for timed test`);
      
      // Use enhanced timed test system with user's preferred count
      const testResult = await generateTimedTest({
        subject: testConfig.subject,
        grade: testConfig.grade,
        difficulty: testConfig.difficulty,
        questionCount: userQuestionCount,
        timeLimit: 30
      });

      console.log('Test generation result:', testResult);

      // Validate that we have enough questions (allow some flexibility)
      const minimumAcceptable = Math.max(Math.floor(userQuestionCount * 0.7), 5);
      if (testResult.questions.length < minimumAcceptable) {
        console.warn(`Only generated ${testResult.questions.length} questions, attempting emergency generation...`);
        
        // Emergency generation - create questions to reach user's preferred count
        const emergencyQuestions = [];
        const neededQuestions = userQuestionCount - testResult.questions.length;
        
        for (let i = 0; i < neededQuestions; i++) {
          const emergencyQuestion: Question = {
            _id: `emergency_${Date.now()}_${i}`,
            content: `Question ${testResult.questions.length + i + 1}: What is the result of ${Math.floor(Math.random() * 10) + 1} + ${Math.floor(Math.random() * 10) + 1}?`,
            subject: testConfig.subject,
            difficulty: testConfig.difficulty,
            grade: testConfig.grade,
            type: QuestionType.MULTIPLE_CHOICE,
            options: [] as string[],
            correctAnswer: '',
            explanation: 'This is an emergency generated question to ensure test completeness.',
            topic: 'Basic Math',
            timeLimit: 60,
            tags: ['emergency', 'generated'],
            createdBy: 'system',
            isGenerated: true
          };
          
          // Generate realistic math options
          const num1 = Math.floor(Math.random() * 10) + 1;
          const num2 = Math.floor(Math.random() * 10) + 1;
          const correctAnswer = num1 + num2;
          
          emergencyQuestion.content = `Question ${testResult.questions.length + i + 1}: What is ${num1} + ${num2}?`;
          emergencyQuestion.options = [
            correctAnswer.toString(),
            (correctAnswer + Math.floor(Math.random() * 5) + 1).toString(),
            (correctAnswer - Math.floor(Math.random() * 5) - 1).toString(),
            (correctAnswer + Math.floor(Math.random() * 10) + 5).toString()
          ];
          emergencyQuestion.correctAnswer = correctAnswer.toString();
          
          emergencyQuestions.push(emergencyQuestion);
        }
        
        testResult.questions.push(...emergencyQuestions);
        console.log(`Added ${emergencyQuestions.length} emergency questions. Total: ${testResult.questions.length}`);
      }
      
      // Final validation - ensure we have exactly the user's requested count
      if (testResult.questions.length !== userQuestionCount) {
        if (testResult.questions.length > userQuestionCount) {
          testResult.questions = testResult.questions.slice(0, userQuestionCount);
          console.log(`Trimmed questions to exactly ${userQuestionCount}`);
        } else {
          console.error(`Critical error: Only ${testResult.questions.length} questions available after all strategies`);
          throw new Error(`Unable to generate sufficient questions. Only ${testResult.questions.length} available, user requested ${userQuestionCount}.`);
        }
      }
      
      console.log(`✅ Successfully generated exactly ${userQuestionCount} questions as requested by user`);
      // Validate that we have enough questions
      if (testResult.questions.length < 20) {
        console.warn(`Only generated ${testResult.questions.length} questions, attempting emergency generation...`);
        
        // Emergency generation - create simple questions to reach minimum
        const emergencyQuestions = [];
        const neededQuestions = 30 - testResult.questions.length;
        
        for (let i = 0; i < neededQuestions; i++) {
          const emergencyQuestion = {
            _id: `emergency_${Date.now()}_${i}`,
            content: `Emergency Question ${i + 1}: What is the result of ${Math.floor(Math.random() * 10) + 1} + ${Math.floor(Math.random() * 10) + 1}?`,
            subject: testConfig.subject,
            difficulty: testConfig.difficulty,
            grade: testConfig.grade,
            type: QuestionType.MULTIPLE_CHOICE,
            options: [
              `${Math.floor(Math.random() * 20) + 1}`,
              `${Math.floor(Math.random() * 20) + 1}`,
              `${Math.floor(Math.random() * 20) + 1}`,
              `${Math.floor(Math.random() * 20) + 1}`
            ],
            correctAnswer: '',
            explanation: 'This is an emergency generated question to ensure test completeness.',
            topic: 'Basic Math',
            timeLimit: 60,
            tags: ['emergency', 'generated'],
            createdBy: 'system',
            isGenerated: true
          };
          
          // Set correct answer to first option
          emergencyQuestion.correctAnswer = emergencyQuestion.options[0];
          emergencyQuestions.push(emergencyQuestion);
        }
        
        testResult.questions.push(...emergencyQuestions);
        console.log(`Added ${emergencyQuestions.length} emergency questions. Total: ${testResult.questions.length}`);
      }
      
      // Final validation - ensure exactly 30 questions
      if (testResult.questions.length !== 30) {
        if (testResult.questions.length > 30) {
          testResult.questions = testResult.questions.slice(0, 30);
          console.log('Trimmed questions to exactly 30');
        } else {
          console.error(`Critical error: Only ${testResult.questions.length} questions available after all strategies`);
          throw new Error(`Unable to generate sufficient questions. Only ${testResult.questions.length} available.`);
        }
      }

      setGenerationStatus(prev => ({
        ...prev,
        progress: 'Validating test quality...',
        questionsGenerated: testResult.questions.length,
        duplicatesRemoved: testResult.duplicatesRemoved,
        validationErrors: testResult.validationErrors
      }));

      // Validate the complete test
      const validation = validateCompleteTest(testResult.questions);
      
      if (!validation.isValid) {
        console.warn('Test validation issues:', validation.issues);
        // Still proceed but log warnings
        validation.issues.forEach(issue => console.warn('Test issue:', issue));
      }

      if (validation.recommendations.length > 0) {
        console.info('Test recommendations:', validation.recommendations);
      }

      // Get test statistics
      const stats = getTestStatistics(testResult.questions);
      console.log('Test statistics:', stats);

      setGenerationStatus(prev => ({
        ...prev,
        progress: 'Test ready!'
      }));

      setQuestions(testResult.questions);
      
      // Show generation summary if there were issues
      if (testResult.duplicatesRemoved > 0 || testResult.validationErrors.length > 0) {
        console.log(`Test generation summary:
          - Questions generated: ${testResult.questions.length}
          - Duplicates removed: ${testResult.duplicatesRemoved}
          - Validation errors: ${testResult.validationErrors.length}
          - Generated questions: ${testResult.generatedCount}`);
      }

      setShowConfig(false);
      setTestStarted(true);
      
    } catch (err) {
      console.error('Error generating timed test:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate test questions');
      setGenerationStatus(prev => ({
        ...prev,
        isGenerating: false,
        progress: 'Generation failed'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = () => {
    // Calculate score using enhanced validation
    let correctCount = 0;
    const detailedResults: Array<{
      question: Question;
      userAnswer: string;
      isCorrect: boolean;
      validation: any;
    }> = [];

    questions.forEach(question => {
      const userAnswer = answers[question._id] || '';
      let isCorrect = false;
      let validation = { isCorrect: false, explanation: 'No answer provided', confidence: 0 };
      
      if (userAnswer) {
        // Use enhanced answer validation
        validation = validateAnswer(question, userAnswer);
        isCorrect = validation.isCorrect;
        
        if (isCorrect) {
          correctCount++;
        }
      }
      
      // Record question attempt in history
      recordQuestionAttempt(
        question._id,
        question.subject,
        question.difficulty,
        question.grade || testConfig.grade,
        isCorrect,
        userAnswer,
        question.correctAnswer,
        question.content,
        question.options,
        question.explanation
      );

      // Mark question as answered in progress tracking
      markQuestionAnswered(
        question._id,
        isCorrect,
        question.subject,
        question.difficulty,
        question.grade || testConfig.grade
      );
      
      detailedResults.push({
        question,
        userAnswer,
        isCorrect,
        validation
      });
    });

    console.log(`Test completed: ${correctCount}/${questions.length} correct answers`);
    console.log('Detailed results:', detailedResults);

    // Navigate to results page with enhanced data
    navigate('/timed-test/results', {
      state: {
        score: correctCount,
        totalQuestions: questions.length,
        answers,
        questions,
        detailedResults,
        timeSpent: 1800 - timeRemaining, // 30 minutes (1800 seconds) - remaining time
        subject: testConfig.subject,
        grade: testConfig.grade,
        difficulty: testConfig.difficulty,
        testStatistics: getTestStatistics(questions)
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

            {generationStatus.isGenerating && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    {generationStatus.progress}
                  </Typography>
                  {generationStatus.questionsGenerated > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block">
                        Questions generated: {generationStatus.questionsGenerated}
                      </Typography>
                      {generationStatus.duplicatesRemoved > 0 && (
                        <Typography variant="caption" display="block" color="warning.main">
                          Duplicates removed: {generationStatus.duplicatesRemoved}
                        </Typography>
                      )}
                      {generationStatus.validationErrors.length > 0 && (
                        <Typography variant="caption" display="block" color="error.main">
                          Validation errors: {generationStatus.validationErrors.length}
                        </Typography>
                      )}
                    </Box>
                  )}
                  <LinearProgress sx={{ mt: 1 }} />
                </Box>
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
                    setTestConfig(prev => ({ ...prev, difficulty: e.target.value as DifficultyLevel }))
                  }
                >
                  <MenuItem value={DifficultyLevel.EASY}>Easy</MenuItem>
                  <MenuItem value={DifficultyLevel.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={DifficultyLevel.HARD}>Hard</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Test Duration: 30 minutes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Questions: {settings.questionsPerSession || 30}
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
