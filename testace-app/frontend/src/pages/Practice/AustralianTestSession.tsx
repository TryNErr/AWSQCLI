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
  Alert,
  Grid,
  Divider
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, Timer, School } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import QuestionTrackingService from '../../services/questionTrackingService';

interface AustralianQuestion extends Question {
  section: 'thinking-skills' | 'reading' | 'math' | 'english';
}

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  question: AustralianQuestion;
  section: string;
  timeSpent: number;
}

const AustralianTestSession: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const examType = searchParams.get('examType') || 'opportunity-class';
  const grade = searchParams.get('grade') || '6';
  const questionCount = parseInt(searchParams.get('questionCount') || '40');
  
  const [questions, setQuestions] = useState<AustralianQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [currentSection, setCurrentSection] = useState<string>('');

  // Australian test sections
  const testSections = [
    { name: 'thinking-skills', label: 'Thinking Skills', color: '#9c27b0' },
    { name: 'reading', label: 'Reading', color: '#2196f3' },
    { name: 'math', label: 'Mathematics', color: '#ff9800' },
    { name: 'english', label: 'English', color: '#4caf50' }
  ];

  useEffect(() => {
    loadAustralianQuestions();
    setStartTime(new Date());
    setQuestionStartTime(new Date());
  }, []);

  const loadAustralianQuestions = async () => {
    try {
      setLoading(true);
      
      // Import the test generator service
      const { default: AustralianTestGenerator } = await import('../../services/australianTestGenerator');
      
      // Get already answered questions to exclude
      const answeredQuestions = QuestionTrackingService.getCorrectlyAnsweredQuestions();
      
      // Generate test using the proper Australian format
      const generatedTest = await AustralianTestGenerator.generateTest(
        examType, 
        grade, 
        answeredQuestions
      );
      
      if (generatedTest.questions.length === 0) {
        setError('No new questions available. You have answered all questions correctly! Try a different grade level.');
        return;
      }
      
      // Convert to AustralianQuestion format and set current section
      const australianQuestions: AustralianQuestion[] = generatedTest.questions.map(q => {
        // Find which section this question belongs to
        const section = generatedTest.sections.find(s => 
          s.questions.some(sq => sq._id === q._id)
        );
        
        return {
          ...q,
          section: (section?.subject || 'thinking-skills') as any
        };
      });
      
      setQuestions(australianQuestions);
      
      if (australianQuestions.length > 0) {
        setCurrentSection(australianQuestions[0].section);
      }
      
      console.log(`Generated Australian ${examType} test for Year ${grade}:`, {
        totalQuestions: generatedTest.totalQuestions,
        sections: generatedTest.sections.map(s => ({
          name: s.name,
          questionCount: s.questions.length
        }))
      });
      
    } catch (err) {
      console.error('Error generating Australian test:', err);
      setError('Failed to generate test questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
    // Don't show feedback during test - only at the end
    setShowFeedback(false);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = new Date().getTime() - questionStartTime.getTime();
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer,
      isCorrect,
      question: currentQuestion,
      section: currentQuestion.section,
      timeSpent
    };

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setQuestionStartTime(new Date());
      
      // Update current section
      const nextQuestion = questions[currentQuestionIndex + 1];
      if (nextQuestion.section !== currentSection) {
        setCurrentSection(nextQuestion.section);
      }
    } else {
      // Test complete, navigate to results
      const totalTime = new Date().getTime() - startTime.getTime();
      navigate('/australian-test/results', { 
        state: { 
          answers: updatedAnswers, 
          examType, 
          grade,
          totalTime,
          sections: testSections
        } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswer(previousAnswer?.selectedAnswer || '');
      setShowFeedback(!!previousAnswer?.selectedAnswer);
      
      // Update current section
      const prevQuestion = questions[currentQuestionIndex - 1];
      setCurrentSection(prevQuestion.section);
    }
  };

  const handleBackToSelection = () => {
    navigate('/australian-test');
  };

  const getSectionColor = (sectionName: string) => {
    const section = testSections.find(s => s.name === sectionName);
    return section?.color || '#666';
  };

  const getSectionLabel = (sectionName: string) => {
    const section = testSections.find(s => s.name === sectionName);
    return section?.label || sectionName;
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading Australian test questions...</Typography>
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
            Back to Test Selection
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
            No questions available for the selected test configuration.
          </Alert>
          <Button variant="contained" onClick={handleBackToSelection}>
            Back to Test Selection
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const examTypeLabel = examType === 'opportunity-class' ? 'Opportunity Class Test' : 'Selective School Test';

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: 'white' 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School />
              {examTypeLabel}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`Year ${grade}`} 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                label={getSectionLabel(currentSection)}
                sx={{ 
                  backgroundColor: getSectionColor(currentSection), 
                  color: 'white' 
                }}
              />
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

        {/* Section Progress */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Test Sections Progress
            </Typography>
            <Grid container spacing={1}>
              {testSections.map(section => {
                const sectionQuestions = questions.filter(q => q.section === section.name);
                const answeredInSection = answers.filter(a => a.section === section.name).length;
                const sectionProgress = sectionQuestions.length > 0 ? (answeredInSection / sectionQuestions.length) * 100 : 0;
                
                return (
                  <Grid item xs={3} key={section.name}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        {section.label}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={sectionProgress}
                        sx={{ 
                          height: 6,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: section.color
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {answeredInSection}/{sectionQuestions.length}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Reading Passage (if exists) */}
            {currentQuestion.passage && (
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <Typography variant="h6" gutterBottom sx={{ color: getSectionColor(currentSection) }}>
                  Reading Passage
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {currentQuestion.passage}
                </Typography>
              </Paper>
            )}

            {/* Question Topic */}
            {currentQuestion.topic && (
              <Chip 
                label={currentQuestion.topic}
                size="small"
                sx={{ 
                  mb: 2,
                  backgroundColor: getSectionColor(currentSection),
                  color: 'white'
                }}
              />
            )}

            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
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
                    control={<Radio sx={{ color: getSectionColor(currentSection) }} />}
                    label={
                      <Typography variant="body1" sx={{ fontSize: '1rem', py: 0.5 }}>
                        {String.fromCharCode(65 + index)}. {option}
                      </Typography>
                    }
                    sx={{ 
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Feedback - Remove this section completely during test */}
            {/* No feedback shown during test - answers revealed only at the end */}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          py: 2,
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {/* Compact progress dots - show only nearby questions */}
          <Box sx={{ display: 'flex', gap: 0.5, maxWidth: '300px', overflow: 'hidden' }}>
            {questions.map((_, index) => {
              // Show current question and 5 questions on each side
              const showDot = Math.abs(index - currentQuestionIndex) <= 5;
              if (!showDot) return null;
              
              return (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index < currentQuestionIndex 
                      ? '#4caf50' 
                      : index === currentQuestionIndex 
                        ? getSectionColor(currentSection)
                        : '#e0e0e0'
                  }}
                />
              );
            })}
            {currentQuestionIndex < questions.length - 6 && (
              <Typography variant="caption" sx={{ mx: 1 }}>
                ...{questions.length - currentQuestionIndex - 1} more
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            endIcon={currentQuestionIndex === questions.length - 1 ? <CheckCircle /> : <ArrowForward />}
            onClick={handleNext}
            disabled={!selectedAnswer}
            sx={{
              background: currentQuestionIndex === questions.length - 1 
                ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'
                : `linear-gradient(45deg, ${getSectionColor(currentSection)} 30%, ${getSectionColor(currentSection)}90 90%)`
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AustralianTestSession;
