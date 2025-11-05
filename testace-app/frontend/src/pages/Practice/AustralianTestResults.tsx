import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Divider,
  Alert
} from '@mui/material';
import { 
  Home, 
  Refresh, 
  TrendingUp, 
  School, 
  CheckCircle, 
  Cancel,
  Timer,
  Assessment
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionTrackingService from '../../services/questionTrackingService';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  question: any;
  section: string;
  timeSpent: number;
}

interface TestSection {
  name: string;
  label: string;
  color: string;
}

interface SectionResult extends TestSection {
  correct: number;
  total: number;
  percentage: number;
  averageTime: number;
}

const AustralianTestResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    answers = [], 
    examType = 'opportunity-class', 
    grade = '6',
    totalTime = 0,
    sections = []
  } = location.state || {};

  // Track correctly answered questions
  React.useEffect(() => {
    const correctQuestionIds = answers
      .filter((answer: QuizAnswer) => answer.isCorrect)
      .map((answer: QuizAnswer) => answer.questionId);
    
    if (correctQuestionIds.length > 0) {
      QuestionTrackingService.markQuestionsCorrect(correctQuestionIds);
    }
  }, [answers]);

  const examTypeLabel = examType === 'opportunity-class' ? 'Opportunity Class Test' : 'Selective School Test';
  
  // Calculate overall results
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((answer: QuizAnswer) => answer.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const overallPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Calculate section results
  const sectionResults: SectionResult[] = sections.map((section: TestSection) => {
    const sectionAnswers = answers.filter((answer: QuizAnswer) => answer.section === section.name);
    const sectionCorrect = sectionAnswers.filter((answer: QuizAnswer) => answer.isCorrect).length;
    const sectionTotal = sectionAnswers.length;
    const sectionPercentage = sectionTotal > 0 ? Math.round((sectionCorrect / sectionTotal) * 100) : 0;
    const averageTime = sectionAnswers.length > 0 
      ? Math.round(sectionAnswers.reduce((sum: number, answer: QuizAnswer) => sum + answer.timeSpent, 0) / sectionAnswers.length / 1000)
      : 0;
    
    return {
      ...section,
      correct: sectionCorrect,
      total: sectionTotal,
      percentage: sectionPercentage,
      averageTime
    };
  });

  // Performance assessment
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 85) return { level: 'Excellent', color: '#4caf50', description: 'Outstanding performance! You\'re well prepared.' };
    if (percentage >= 70) return { level: 'Good', color: '#2196f3', description: 'Good work! Continue practicing to improve further.' };
    if (percentage >= 55) return { level: 'Satisfactory', color: '#ff9800', description: 'Decent effort. Focus on areas needing improvement.' };
    return { level: 'Needs Improvement', color: '#f44336', description: 'More practice needed. Don\'t give up!' };
  };

  const performance = getPerformanceLevel(overallPercentage);
  const totalTimeMinutes = Math.round(totalTime / 60000);
  const averageTimePerQuestion = totalQuestions > 0 ? Math.round(totalTime / totalQuestions / 1000) : 0;
  
  // Get mastery statistics
  const masteryStats = QuestionTrackingService.getStats();

  // Australian test sections
  const testSections = [
    { name: 'thinking-skills', label: 'Thinking Skills', color: '#9c27b0' },
    { name: 'reading', label: 'Reading', color: '#2196f3' },
    { name: 'math', label: 'Mathematics', color: '#ff9800' },
    { name: 'writing', label: 'Writing', color: '#4caf50' }
  ];

  const getSectionColor = (sectionName: string) => {
    const section = testSections.find((s: TestSection) => s.name === sectionName);
    return section?.color || '#666';
  };

  const getSectionLabel = (sectionName: string) => {
    const section = testSections.find((s: TestSection) => s.name === sectionName);
    return section?.label || sectionName;
  };

  const handleRetakeTest = () => {
    navigate(`/australian-test/session?examType=${examType}&grade=${grade}&questionCount=${totalQuestions}`);
  };

  const handleBackToSelection = () => {
    navigate('/australian-test');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: 'white' 
        }}>
          <School sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Test Results
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {examTypeLabel} - Year {grade}
          </Typography>
        </Paper>

        {/* Overall Performance */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Assessment color="primary" />
              <Typography variant="h5" fontWeight="bold">
                Overall Performance
              </Typography>
            </Box>
            
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight="bold" sx={{ color: performance.color }}>
                    {overallPercentage}%
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Overall Score
                  </Typography>
                  <Chip 
                    label={performance.level}
                    sx={{ 
                      backgroundColor: performance.color,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      px: 2,
                      py: 1
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Correct Answers</Typography>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      {correctAnswers}/{totalQuestions}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallPercentage} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: performance.color
                      }
                    }}
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle color="success" />
                      <Typography variant="body2">
                        Correct: {correctAnswers}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Cancel color="error" />
                      <Typography variant="body2">
                        Incorrect: {incorrectAnswers}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer color="info" />
                      <Typography variant="body2">
                        Total Time: {totalTimeMinutes}m
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp color="info" />
                      <Typography variant="body2">
                        Mastered: {masteryStats.totalCorrect} questions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>{performance.level}:</strong> {performance.description}
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Section Breakdown */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment color="primary" />
              Section Performance
            </Typography>
            
            <Grid container spacing={3}>
              {sectionResults.map((section: SectionResult, index: number) => (
                <Grid item xs={12} md={6} key={section.name}>
                  <Paper sx={{ p: 3, border: `2px solid ${section.color}`, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {section.label}
                      </Typography>
                      <Chip 
                        label={`${section.percentage}%`}
                        sx={{ 
                          backgroundColor: section.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <LinearProgress 
                      variant="determinate" 
                      value={section.percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 2,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: section.color
                        }
                      }}
                    />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Correct: {section.correct}/{section.total}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Avg Time: {section.averageTime}s
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Detailed Answer Review */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Answer Review
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              {answers.map((answer: QuizAnswer, index: number) => (
                <Grid item xs={12} key={answer.questionId}>
                  <Paper sx={{ 
                    p: 3, 
                    border: answer.isCorrect ? '2px solid #4caf50' : '2px solid #f44336',
                    borderRadius: 2 
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Question {index + 1}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={getSectionLabel(answer.section)}
                          sx={{ 
                            backgroundColor: getSectionColor(answer.section),
                            color: 'white'
                          }}
                          size="small"
                        />
                        <Chip 
                          icon={answer.isCorrect ? <CheckCircle /> : <Cancel />}
                          label={answer.isCorrect ? 'Correct' : 'Incorrect'}
                          color={answer.isCorrect ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {answer.question.content}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Your Answer:</strong> {answer.selectedAnswer}
                      </Typography>
                      {!answer.isCorrect && (
                        <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                          <strong>Correct Answer:</strong> {answer.question.correctAnswer}
                        </Typography>
                      )}
                    </Box>
                    
                    {answer.question.explanation && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Explanation:</strong> {answer.question.explanation}
                        </Typography>
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Recommendations for Improvement
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {sectionResults
                .filter((section: SectionResult) => section.percentage < 70)
                .map((section: SectionResult) => (
                  <Grid item xs={12} md={6} key={section.name}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {section.label} - {section.percentage}%
                      </Typography>
                      <Typography variant="body2">
                        {section.name === 'thinking-skills' && 'Practice logical reasoning, pattern recognition, and problem-solving strategies.'}
                        {section.name === 'reading' && 'Focus on reading comprehension, main ideas, and inference skills.'}
                        {section.name === 'math' && 'Work on mathematical reasoning and problem-solving techniques.'}
                        {section.name === 'english' && 'Improve vocabulary, grammar, and language analysis skills.'}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              
              {sectionResults.every((section: SectionResult) => section.percentage >= 70) && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography variant="body1">
                      <strong>Excellent work!</strong> You performed well across all sections. 
                      Continue practicing to maintain and improve your skills further.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRetakeTest}
            sx={{ 
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              px: 3,
              py: 1.5
            }}
          >
            Retake Test
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<School />}
            onClick={handleBackToSelection}
            sx={{ px: 3, py: 1.5 }}
          >
            Try Different Test
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleBackToDashboard}
            sx={{ px: 3, py: 1.5 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AustralianTestResults;
