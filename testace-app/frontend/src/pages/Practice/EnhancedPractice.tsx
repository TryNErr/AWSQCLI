import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import { Add, History, NewReleases, PlayArrow, AutoMode, FilterList, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import { getUserGrade } from '../../services/userContextService';
import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';
import { useAuth } from '../../contexts/AuthContext';

// Enhanced Practice component with bulletproof filtering and deduplication
const EnhancedPractice: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const navigate = useNavigate();
  const { refreshUserStats } = useAuth();

  useEffect(() => {
    // Refresh stats when component loads
    refreshUserStats();
  }, [refreshUserStats]);
  
  const [selectedGrade, setSelectedGrade] = useState(() => {
    const grade = getUserGrade();
    return typeof grade === 'string' ? grade : String(grade);
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionPool, setQuestionPool] = useState<any>(null);
  const [availableSubjects] = useState<string[]>([
    'Math',
    'English', 
    'Reading',
    'Thinking Skills',
    'Mathematical Reasoning'
  ]);
  const [availableGrades] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);

  // Load questions when filters change - GUARANTEED filtering
  useEffect(() => {
    if (selectedGrade && selectedDifficulty) {
      loadQuestionsWithBulletproofFiltering();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedGrade, selectedDifficulty]);

  const loadQuestionsWithBulletproofFiltering = async () => {
    if (!selectedGrade || !selectedDifficulty) return;
    
    setLoading(true);
    
    // Create a timeout promise to prevent infinite hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Question generation timed out after 30 seconds'));
      }, 30000); // 30 second timeout
    });
    
    try {
      // Get difficulty level enum
      const difficultyLevel = getDifficultyLevel(selectedDifficulty);
      
      console.log(`🎯 Loading with BULLETPROOF filtering: Grade ${selectedGrade}, ${selectedDifficulty}${selectedSubject ? `, ${selectedSubject}` : ''}`);
      
      // Race between question generation and timeout
      const questionGenerationPromise = BulletproofPracticeSystem.getPracticeQuestions({
        grade: selectedGrade,
        difficulty: difficultyLevel,
        subject: selectedSubject || undefined,
        count: 20
      });
      
      const pool = await Promise.race([questionGenerationPromise, timeoutPromise]) as any;
      
      console.log(`✅ Bulletproof system results:`, {
        questionsLoaded: pool.questions.length,
        totalAvailable: pool.totalAvailable,
        filtersApplied: pool.filtersApplied,
        duplicatesRemoved: pool.duplicatesRemoved
      });
      
      setQuestions(pool.questions);
      setQuestionPool(pool);
      
      // Show helpful message if no questions were generated
      if (pool.questions.length === 0) {
        console.warn('⚠️ No questions could be generated for the selected criteria');
        // You could show a user-friendly message here
      }
      
    } catch (error: any) {
      console.error('Error loading questions:', error);
      
      // Handle timeout specifically
      if (error?.message && error.message.includes('timed out')) {
        console.error('🕐 Question generation timed out - this may indicate an infinite loop or system issue');
        alert('Question generation is taking too long. Please try different criteria or contact support.');
      }
      
      setQuestions([]);
      setQuestionPool(null);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLevel = (difficulty: string): DifficultyLevel => {
    switch (difficulty) {
      case 'easy': return DifficultyLevel.EASY;
      case 'medium': return DifficultyLevel.MEDIUM;
      case 'hard': return DifficultyLevel.HARD;
      default: return DifficultyLevel.MEDIUM;
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

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value);
  };

  const startPracticeSession = () => {
    if (!selectedGrade || !selectedDifficulty) {
      return;
    }
    
    // Navigate to practice session with parameters
    const params = new URLSearchParams({
      grade: selectedGrade,
      difficulty: selectedDifficulty,
      ...(selectedSubject && { subject: selectedSubject })
    });
    
    navigate(`/practice/session?${params.toString()}`);
  };

  const startSingleQuestion = (questionId: string) => {
    // Build URL with session parameters to maintain filters
    const params = new URLSearchParams();
    if (selectedGrade) params.set('grade', selectedGrade);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
    if (selectedSubject) params.set('subject', selectedSubject);
    
    const paramString = params.toString();
    const url = `/practice/question/${questionId}${paramString ? `?${paramString}` : ''}`;
    
    console.log(`🎯 Starting single question with maintained filters: ${url}`);
    navigate(url);
  };

  const isReadyToStart = selectedGrade && selectedDifficulty;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Enhanced Practice Mode
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select your grade and difficulty level to get challenging, curriculum-aligned questions.
          <strong> Filters are guaranteed to be maintained - no irrelevant questions!</strong>
        </Typography>

        {/* Selection Controls */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }} required>
            <InputLabel>Grade *</InputLabel>
            <Select
              value={selectedGrade}
              label="Grade *"
              onChange={handleGradeChange}
            >
              {availableGrades.map(grade => (
                <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }} required>
            <InputLabel>Difficulty *</InputLabel>
            <Select
              value={selectedDifficulty}
              label="Difficulty *"
              onChange={handleDifficultyChange}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Subject (Optional)</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject (Optional)"
              onChange={handleSubjectChange}
            >
              <MenuItem value="">All Subjects</MenuItem>
              {availableSubjects.map(subject => (
                <MenuItem key={subject} value={subject}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {subject}
                    <Chip
                      label="Enhanced"
                      size="small"
                      color="success"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Start Practice Session Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startPracticeSession}
            disabled={!isReadyToStart}
            startIcon={<AutoMode />}
            sx={{ minWidth: 200 }}
          >
            Start Auto Practice
          </Button>
        </Box>

        {/* Filter Status Display */}
        {questionPool && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterList />
              <Typography variant="body2">
                <strong>Filters Applied:</strong> Grade {questionPool.filtersApplied.grade}, 
                {questionPool.filtersApplied.difficulty} difficulty
                {questionPool.filtersApplied.subject && `, ${questionPool.filtersApplied.subject}`}
                {questionPool.duplicatesRemoved > 0 && (
                  <span> • <strong>{questionPool.duplicatesRemoved} duplicates removed</strong></span>
                )}
              </Typography>
              <CheckCircle color="success" />
            </Box>
          </Alert>
        )}

        {/* Requirements Alert */}
        {!isReadyToStart && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please select both Grade and Difficulty level to start practicing.
          </Alert>
        )}

        {/* Loading States */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              🎯 Loading questions with bulletproof filtering: Grade {selectedGrade}, {selectedDifficulty} difficulty...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Questions Grid */}
        {isReadyToStart && !loading && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Available Questions: Grade {selectedGrade} - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                {selectedSubject && ` - ${selectedSubject}`}
                {questionPool && (
                  <Chip 
                    label={`${questions.length} questions loaded`} 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 2 }} 
                  />
                )}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/practice/add')}
                  startIcon={<Add />}
                  size="small"
                >
                  Add Question
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/practice/history')}
                  startIcon={<History />}
                  size="small"
                >
                  History
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {questions.map((question) => (
                <Grid item xs={12} md={6} lg={4} key={question._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
                          {question.content.length > 100 
                            ? `${question.content.substring(0, 100)}...` 
                            : question.content}
                        </Typography>
                        {(question as any).isGenerated && (
                          <Chip 
                            icon={<NewReleases fontSize="small" />}
                            label="New" 
                            color="success" 
                            size="small"
                            sx={{ ml: 1, flexShrink: 0 }}
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        <Chip 
                          label={question.subject} 
                          color="primary" 
                          size="small"
                        />
                        <Chip 
                          label={`Grade ${question.grade}`} 
                          color="info" 
                          size="small"
                        />
                        <Chip 
                          label={question.difficulty} 
                          color="secondary" 
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Topic: {question.topic}
                      </Typography>
                      
                      {question.tags && question.tags.length > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Tags: {question.tags.slice(0, 3).join(', ')}
                          {question.tags.length > 3 && '...'}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => startSingleQuestion(question._id)}
                        startIcon={<PlayArrow />}
                        fullWidth
                      >
                        Practice This
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {questions.length === 0 && !loading && (
              <Box textAlign="center" sx={{ mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No questions available for the selected criteria.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Questions will be automatically generated for Grade {selectedGrade}, {selectedDifficulty} difficulty.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={loadQuestionsWithBulletproofFiltering}
                  sx={{ mt: 2 }}
                >
                  Generate Questions Now
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Information Box */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            🎯 Bulletproof Practice Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                ✅ Guaranteed Filtering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filters are ALWAYS maintained - no irrelevant questions will appear.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                🚫 Zero Duplicates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Each question appears only once - no more seeing the same question multiple times.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                🎓 Professional Quality
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All questions are validated for accuracy and curriculum alignment.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EnhancedPractice;
