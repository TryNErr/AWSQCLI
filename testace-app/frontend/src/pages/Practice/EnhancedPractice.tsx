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
import { Add, History, NewReleases, PlayArrow, AutoMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import { questionData } from './questionData';
import { getUserGrade } from '../../services/userContextService';
import { getAnsweredQuestionIds } from '../../services/userProgressService';
import { generateEnhancedQuestion } from '../../utils/enhancedQuestionSystem';
import { saveGeneratedQuestions, getGeneratedQuestions } from '../../services/generatedQuestionsService';

// Enhanced Practice component with strict filtering and auto-generation
const EnhancedPractice: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(() => {
    const grade = getUserGrade();
    return typeof grade === 'string' ? grade : String(grade);
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [availableSubjects] = useState<string[]>([
    'Math',
    'English', 
    'Thinking Skills'
  ]);
  const [availableGrades] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  const navigate = useNavigate();

  // Load questions when filters change
  useEffect(() => {
    if (selectedGrade && selectedDifficulty) {
      loadQuestionsForSelection();
    }
  }, [selectedSubject, selectedGrade, selectedDifficulty]);

  const loadQuestionsForSelection = async () => {
    if (!selectedGrade || !selectedDifficulty) return;
    
    setLoading(true);
    setGeneratingQuestions(false);
    
    try {
      // Get difficulty level enum
      const difficultyLevel = getDifficultyLevel(selectedDifficulty);
      
      // Get answered question IDs
      const answeredQuestionIds = getAnsweredQuestionIds();
      
      // Get all existing questions (standard + generated)
      const allQuestions = [...questionData, ...getGeneratedQuestions()];
      
      // Apply STRICT filtering - only questions matching EXACT criteria
      let filteredQuestions = allQuestions.filter(q => {
        const gradeMatch = q.grade === selectedGrade;
        const difficultyMatch = q.difficulty === difficultyLevel;
        const subjectMatch = !selectedSubject || q.subject === selectedSubject;
        const notAnswered = !answeredQuestionIds.includes(q._id);
        
        return gradeMatch && difficultyMatch && subjectMatch && notAnswered;
      });
      
      console.log(`Found ${filteredQuestions.length} existing questions matching criteria`);
      
      // If we have fewer than 20 questions, generate more
      const targetQuestionCount = 20;
      if (filteredQuestions.length < targetQuestionCount) {
        setGeneratingQuestions(true);
        
        const questionsToGenerate = targetQuestionCount - filteredQuestions.length;
        console.log(`Generating ${questionsToGenerate} new questions`);
        
        const newQuestions = await generateQuestionsForCriteria(
          selectedGrade,
          difficultyLevel,
          selectedSubject,
          questionsToGenerate
        );
        
        // Add generated questions to the pool
        filteredQuestions = [...filteredQuestions, ...newQuestions];
        
        // Save generated questions to localStorage
        const existingGenerated = getGeneratedQuestions();
        saveGeneratedQuestions([...existingGenerated, ...newQuestions]);
      }
      
      // Shuffle and limit to display count
      const shuffledQuestions = shuffleArray(filteredQuestions);
      setQuestions(shuffledQuestions.slice(0, 12)); // Show 12 questions in grid
      
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
      setGeneratingQuestions(false);
    }
  };

  const generateQuestionsForCriteria = async (
    grade: string,
    difficulty: DifficultyLevel,
    subject: string,
    count: number
  ): Promise<Question[]> => {
    const newQuestions: Question[] = [];
    
    // If subject is specified, generate all questions for that subject
    if (subject) {
      for (let i = 0; i < count; i++) {
        try {
          const question = generateEnhancedQuestion(grade, subject, difficulty);
          question.isGenerated = true;
          question.generatedAt = new Date();
          newQuestions.push(question);
        } catch (error) {
          console.error(`Error generating ${subject} question:`, error);
        }
      }
    } else {
      // If no subject specified, distribute across all subjects
      const subjects = ['Math', 'English', 'Thinking Skills'];
      const questionsPerSubject = Math.ceil(count / subjects.length);
      
      for (const subj of subjects) {
        for (let i = 0; i < questionsPerSubject && newQuestions.length < count; i++) {
          try {
            const question = generateEnhancedQuestion(grade, subj, difficulty);
            question.isGenerated = true;
            question.generatedAt = new Date();
            newQuestions.push(question);
          } catch (error) {
            console.error(`Error generating ${subj} question:`, error);
          }
        }
      }
    }
    
    return newQuestions;
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
    navigate(`/practice/question/${questionId}`);
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
          Questions will auto-advance after 5 seconds once answered.
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
              Loading questions for Grade {selectedGrade}, {selectedDifficulty} difficulty...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {generatingQuestions && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              🎓 Generating challenging, curriculum-aligned questions for your selection...
            </Typography>
          </Alert>
        )}

        {/* Questions Grid */}
        {isReadyToStart && !loading && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Available Questions: Grade {selectedGrade} - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                {selectedSubject && ` - ${selectedSubject}`}
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
                  onClick={loadQuestionsForSelection}
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
            🎓 Enhanced Practice Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Auto-Advance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Questions automatically advance to the next one after 5 seconds once answered.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Strict Filtering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All questions match your exact grade and difficulty selection.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Smart Generation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New challenging questions are automatically generated when needed.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EnhancedPractice;
