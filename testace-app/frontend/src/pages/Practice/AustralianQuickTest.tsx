import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { School, PlayArrow, Timer, TrendingUp, CheckCircle, Warning, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserGrade } from '../../services/userContextService';
import QuestionTrackingService from '../../services/questionTrackingService';
import AustralianTestGenerator, { AUSTRALIAN_TEST_FORMATS } from '../../services/australianTestGenerator';

const AustralianQuickTest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Australian grade levels for Opportunity Classes and Selective Schools
  const [selectedGrade, setSelectedGrade] = useState(() => {
    const grade = getUserGrade();
    return typeof grade === 'string' ? grade : String(grade);
  });

  // Australian exam types
  const [selectedExamType, setSelectedExamType] = useState('opportunity-class');
  const [validationResult, setValidationResult] = useState<{
    canGenerate: boolean;
    issues: string[];
    recommendations: string[];
  } | null>(null);
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});

  // Grade mappings for Australian system
  const australianGrades = [
    { value: '4', label: 'Year 4 (Opportunity Class Prep)', examTypes: ['opportunity-class'] },
    { value: '5', label: 'Year 5 (Opportunity Class)', examTypes: ['opportunity-class'] },
    { value: '6', label: 'Year 6 (Selective School Prep)', examTypes: ['selective-school'] },
    { value: '7', label: 'Year 7 (Selective School)', examTypes: ['selective-school'] },
    { value: '8', label: 'Year 8 (Advanced)', examTypes: ['selective-school'] },
    { value: '9', label: 'Year 9 (Advanced)', examTypes: ['selective-school'] },
    { value: '10', label: 'Year 10 (Advanced)', examTypes: ['selective-school'] }
  ];

  useEffect(() => {
    // Set defaults based on user profile if available
    if (user?.grade) {
      setSelectedGrade(user.grade);
      // Auto-select exam type based on grade
      const grade = parseInt(user.grade);
      if (grade <= 5) {
        setSelectedExamType('opportunity-class');
      } else {
        setSelectedExamType('selective-school');
      }
    }
  }, [user]);

  useEffect(() => {
    validateTestGeneration();
  }, [selectedGrade, selectedExamType]);

  const validateTestGeneration = async () => {
    try {
      await AustralianTestGenerator.loadQuestions();
      const validation = AustralianTestGenerator.validateTestGeneration(selectedExamType, selectedGrade);
      const counts = AustralianTestGenerator.getAvailableQuestionCounts(selectedGrade);
      
      setValidationResult(validation);
      setQuestionCounts(counts);
    } catch (error) {
      console.error('Error validating test generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load questions';
      setValidationResult({
        canGenerate: false,
        issues: [errorMessage],
        recommendations: ['Check your internet connection and try refreshing the page']
      });
    }
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    const newGrade = event.target.value;
    setSelectedGrade(newGrade);
    
    // Auto-adjust exam type based on grade
    const grade = parseInt(newGrade);
    if (grade <= 5) {
      setSelectedExamType('opportunity-class');
    } else {
      setSelectedExamType('selective-school');
    }
  };

  const handleExamTypeChange = (event: SelectChangeEvent) => {
    setSelectedExamType(event.target.value);
  };

  const startTest = () => {
    if (!validationResult?.canGenerate) {
      return;
    }
    
    const selectedFormat = AUSTRALIAN_TEST_FORMATS[selectedExamType];
    navigate(`/australian-test/session?examType=${selectedExamType}&grade=${selectedGrade}&questionCount=${selectedFormat.totalQuestions}`);
  };

  const getAvailableGrades = () => {
    return australianGrades.filter(grade => 
      grade.examTypes.includes(selectedExamType)
    );
  };

  const selectedFormat = AUSTRALIAN_TEST_FORMATS[selectedExamType];
  const currentGradeInfo = australianGrades.find(grade => grade.value === selectedGrade);
  const masteryStats = QuestionTrackingService.getStats();

  return (
    <Container maxWidth="md">
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
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Australian Academic Test
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Opportunity Classes & Selective School Practice
          </Typography>
        </Paper>

        {/* Information Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>About Australian Academic Tests:</strong> These tests assess students for entry into 
            Opportunity Classes (Years 4-5) and Selective Schools (Years 6-12). They focus on critical thinking, 
            reading comprehension, mathematical reasoning, and English language skills.
          </Typography>
          {masteryStats.totalCorrect > 0 && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'success.main' }}>
              🎯 You have mastered {masteryStats.totalCorrect} questions! New questions will be prioritized.
            </Typography>
          )}
        </Alert>

        {/* Selection Form */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp color="primary" />
              Test Configuration
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Exam Type</InputLabel>
                  <Select
                    value={selectedExamType}
                    label="Exam Type"
                    onChange={handleExamTypeChange}
                  >
                    {Object.entries(AUSTRALIAN_TEST_FORMATS).map(([key, format]) => (
                      <MenuItem key={key} value={key}>
                        <Box>
                          <Typography variant="body1">{format.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Year Level</InputLabel>
                  <Select
                    value={selectedGrade}
                    label="Year Level"
                    onChange={handleGradeChange}
                  >
                    {getAvailableGrades().map((grade) => (
                      <MenuItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Test Format Details */}
        {selectedFormat && (
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info color="primary" />
                {selectedFormat.name} Format
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">{selectedFormat.totalQuestions}</Typography>
                    <Typography variant="body2">Total Questions</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2, color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">{Math.floor(selectedFormat.timeLimit / 60)}h {selectedFormat.timeLimit % 60}m</Typography>
                    <Typography variant="body2">Time Limit</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">{selectedFormat.sections.length}</Typography>
                    <Typography variant="body2">Sections</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Test Sections:</Typography>
              <Grid container spacing={2}>
                {selectedFormat.sections.map((section, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{section.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.questionCount} questions
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip size="small" label={`Easy: ${section.difficultyDistribution.easy}`} sx={{ mr: 0.5, mb: 0.5 }} />
                          <Chip size="small" label={`Medium: ${section.difficultyDistribution.medium}`} sx={{ mr: 0.5, mb: 0.5 }} />
                          <Chip size="small" label={`Hard: ${section.difficultyDistribution.hard}`} sx={{ mr: 0.5, mb: 0.5 }} />
                        </Box>
                        {questionCounts[section.subject] !== undefined && (
                          <Typography variant="caption" color="text.secondary">
                            Available: {questionCounts[section.subject]} questions
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Validation Results */}
        {validationResult && (
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {validationResult.canGenerate ? (
                  <CheckCircle color="success" />
                ) : (
                  <Warning color="error" />
                )}
                Test Availability
              </Typography>

              {validationResult.canGenerate ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Test can be generated successfully! All required questions are available.
                </Alert>
              ) : (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Cannot generate test due to insufficient questions.
                </Alert>
              )}

              {validationResult.issues.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>Issues:</Typography>
                  <List dense>
                    {validationResult.issues.map((issue, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={issue} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {validationResult.recommendations.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="warning.main" gutterBottom>Recommendations:</Typography>
                  <List dense>
                    {validationResult.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Info color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Start Test Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={startTest}
            disabled={!validationResult?.canGenerate}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              background: validationResult?.canGenerate 
                ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                : undefined
            }}
          >
            {validationResult?.canGenerate ? 'Start Australian Test' : 'Insufficient Questions'}
          </Button>
          
          {selectedFormat && validationResult?.canGenerate && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <Timer sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Estimated time: {Math.floor(selectedFormat.timeLimit / 60)} hours {selectedFormat.timeLimit % 60} minutes
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};
export default AustralianQuickTest;
