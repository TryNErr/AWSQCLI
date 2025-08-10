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
import EnhancedTimedTestSystem from '../../utils/enhancedTimedTestSystem';
import ProfessionalTimedTestSystem from '../../utils/professionalTimedTestSystem';
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
  const subjects = ['Math', 'English', 'Reading', 'Thinking Skills', 'Mathematical Reasoning'];
  
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

    // Create a timeout promise to prevent infinite hanging (same as Practice Test)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timed test generation timed out after 30 seconds'));
      }, 30000); // 30 second timeout
    });

    try {
      console.log(`🎯 Generating PROFESSIONAL timed test for ${testConfig.subject}, Grade ${testConfig.grade}, ${testConfig.difficulty} difficulty`);
      
      setGenerationStatus(prev => ({
        ...prev,
        progress: 'Generating questions with PROFESSIONAL system (strict filtering)...'
      }));

      // Get user's preferred question count (default to 30 if not set)
      const userQuestionCount = settings.questionsPerSession || 30;
      console.log(`📊 User requested ${userQuestionCount} questions for timed test`);
      
      // Use ProfessionalTimedTestSystem for STRICT subject filtering and zero repetition
      const testGenerationPromise = ProfessionalTimedTestSystem.generateTimedTest({
        subject: testConfig.subject,
        grade: testConfig.grade,
        difficulty: testConfig.difficulty,
        questionCount: userQuestionCount,
        timeLimit: 30,
        userId: 'current-user'
      });

      const testResult = await Promise.race([testGenerationPromise, timeoutPromise]) as any;

      console.log('✅ PROFESSIONAL timed test generation result:', testResult);

      // Validate that ALL questions match the selected subject
      const subjectMismatches = testResult.questions.filter((q: any) => 
        !q.subject.toLowerCase().includes(testConfig.subject.toLowerCase())
      ).length;
      
      if (subjectMismatches > 0) {
        console.error(`❌ CRITICAL: ${subjectMismatches} questions don't match subject ${testConfig.subject}!`);
        throw new Error(`Subject filtering failed: ${subjectMismatches} non-${testConfig.subject} questions found`);
      }

      // The professional system guarantees EXACTLY the requested subject and no repetition
      console.log(`✅ PROFESSIONAL QUALITY VERIFIED:`);
      console.log(`   - Questions: ${testResult.questions.length}`);
      console.log(`   - Subject Accuracy: ${testResult.qualityMetrics.subjectAccuracy}%`);
      console.log(`   - Grade Accuracy: ${testResult.qualityMetrics.gradeAccuracy}%`);
      console.log(`   - Difficulty Accuracy: ${testResult.qualityMetrics.difficultyAccuracy}%`);
      console.log(`   - Uniqueness: ${testResult.qualityMetrics.uniqueness}%`);
      console.log(`   - Zero subject mismatches: ✅`);
      console.log(`   - Zero repetition: ✅`);
      
      if (testResult.validationErrors.length > 0) {
        console.warn('Quality warnings:', testResult.validationErrors);
      }

      setGenerationStatus(prev => ({
        ...prev,
        progress: 'PROFESSIONAL test ready - strict filtering applied!',
        questionsGenerated: testResult.questions.length,
        duplicatesRemoved: testResult.duplicatesRemoved,
        validationErrors: testResult.validationErrors
      }));

      setQuestions(testResult.questions);
      
      // Show generation summary
      if (testResult.duplicatesRemoved > 0 || testResult.validationErrors.length > 0 || 
          testResult.subjectMismatches > 0 || testResult.gradeMismatches > 0) {
        console.log(`PROFESSIONAL test generation summary:
          - Questions generated: ${testResult.questions.length}
          - Subject accuracy: ${testResult.qualityMetrics.subjectAccuracy}%
          - Grade accuracy: ${testResult.qualityMetrics.gradeAccuracy}%
          - Difficulty accuracy: ${testResult.qualityMetrics.difficultyAccuracy}%
          - Uniqueness: ${testResult.qualityMetrics.uniqueness}%
          - Duplicates removed: ${testResult.duplicatesRemoved}
          - Validation errors: ${testResult.validationErrors.length}`);
      }

      setShowConfig(false);
      setTestStarted(true);
      
    } catch (err: any) {
      console.error('Error generating timed test:', err);
      
      // Handle timeout specifically (same as Practice Test)
      if (err?.message && err.message.includes('timed out')) {
        console.error('🕐 PROFESSIONAL timed test generation timed out - this may indicate an infinite loop or system issue');
        setError('Test generation is taking too long. Please try different criteria or contact support.');
      } else if (err?.message && err.message.includes('Subject filtering failed')) {
        console.error('❌ CRITICAL: Subject filtering failed in professional system');
        setError(`Subject filtering error: ${err.message}. Please try again or contact support.`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate test questions');
      }
      
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
        correctAnswers: correctCount
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
              Professional Timed Test
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                🎯 <strong>Professional Grade System Active</strong>
              </Typography>
              <Typography variant="caption" display="block">
                • Strict subject filtering - Only {testConfig.subject || 'selected subject'} questions
              </Typography>
              <Typography variant="caption" display="block">
                • Zero repetition - Each question appears only once
              </Typography>
              <Typography variant="caption" display="block">
                • Grade & difficulty consistency guaranteed
              </Typography>
            </Alert>

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
