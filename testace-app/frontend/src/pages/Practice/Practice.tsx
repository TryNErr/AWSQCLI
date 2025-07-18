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
  Badge
} from '@mui/material';
import { Add, AutoAwesome, History, NewReleases } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import { questionData } from './questionData';
import { getUserGrade } from '../../services/userContextService';
import { getAnsweredQuestionIds } from '../../services/userProgressService';
import { generateMathQuestions } from '../../utils/mathQuestionGenerator';

const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(() => {
    // Ensure we get a valid string value for the grade
    const grade = getUserGrade();
    return typeof grade === 'string' ? grade : String(grade);
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const navigate = useNavigate();

  // Extract unique subjects and grades on component mount
  useEffect(() => {
    const subjectSet = new Set(questionData.map(q => q.subject));
    const gradeSet = new Set(questionData.map(q => (q as any).grade || ''));
    
    const subjects = Array.from(subjectSet);
    const grades = Array.from(gradeSet).filter(Boolean);
    
    setAvailableSubjects(subjects);
    setAvailableGrades(grades);
    
    // Initial load of questions
    filterQuestions();
  }, []);

  // Filter questions when selections change
  useEffect(() => {
    filterQuestions();
  }, [selectedSubject, selectedGrade, selectedDifficulty]);

  const filterQuestions = () => {
    setLoading(true);
    
    // Get answered question IDs
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    // Apply filters
    let filteredQuestions = [...questionData];
    
    if (selectedSubject) {
      filteredQuestions = filteredQuestions.filter(q => q.subject === selectedSubject);
    }
    
    if (selectedGrade) {
      filteredQuestions = filteredQuestions.filter(q => q.grade === selectedGrade);
    }
    
    if (selectedDifficulty) {
      filteredQuestions = filteredQuestions.filter(q => {
        if (selectedDifficulty === 'easy') return q.difficulty === DifficultyLevel.EASY;
        if (selectedDifficulty === 'medium') return q.difficulty === DifficultyLevel.MEDIUM;
        if (selectedDifficulty === 'hard') return q.difficulty === DifficultyLevel.HARD;
        return true;
      });
    }
    
    // Filter out answered questions
    const unansweredQuestions = filteredQuestions.filter(q => !answeredQuestionIds.includes(q._id));
    
    // If we have fewer than 10 unanswered questions, generate new ones
    let finalQuestions = [...unansweredQuestions];
    let generatedQuestions: Question[] = [];
    
    if (unansweredQuestions.length < 10) {
      // Determine how many questions to generate
      const questionsToGenerate = 10 - unansweredQuestions.length;
      
      // Determine difficulty level for generated questions
      let difficultyLevel = DifficultyLevel.MEDIUM;
      if (selectedDifficulty === 'easy') difficultyLevel = DifficultyLevel.EASY;
      if (selectedDifficulty === 'medium') difficultyLevel = DifficultyLevel.MEDIUM;
      if (selectedDifficulty === 'hard') difficultyLevel = DifficultyLevel.HARD;
      
      // Only generate math questions for now
      if (!selectedSubject || selectedSubject === 'Math') {
        generatedQuestions = generateMathQuestions(
          selectedGrade || getUserGrade(),
          difficultyLevel,
          questionsToGenerate
        );
        
        // Mark generated questions
        generatedQuestions = generatedQuestions.map(q => ({
          ...q,
          isGenerated: true // Add a flag to identify generated questions
        }));
        
        finalQuestions = [...unansweredQuestions, ...generatedQuestions];
      }
    }
    
    // Limit to 10 questions for display
    const limitedQuestions = finalQuestions.slice(0, 10);
    setQuestions(limitedQuestions);
    setLoading(false);
  };

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    const newGrade = String(event.target.value);
    setSelectedGrade(newGrade);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value);
  };

  const startPractice = (questionId?: string) => {
    if (questionId) {
      navigate(`/practice/question/${questionId}`);
    } else {
      navigate('/practice/session');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Practice Questions
        </Typography>
        
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedSubject}
                label="Subject"
                onChange={handleSubjectChange}
              >
                <MenuItem value="">All Subjects</MenuItem>
                {availableSubjects.map(subject => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Grade</InputLabel>
              <Select
                value={selectedGrade}
                label="Grade"
                onChange={handleGradeChange}
              >
                <MenuItem value="">All Grades</MenuItem>
                {availableGrades.map(grade => (
                  <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={handleDifficultyChange}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/practice/math-generator')}
              startIcon={<AutoAwesome />}
            >
              Auto-Generate Math
            </Button>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/practice/add')}
              startIcon={<Add />}
            >
              Add Question
            </Button>
            
            <Button 
              variant="outlined" 
              color="info"
              onClick={() => navigate('/practice/history')}
              startIcon={<History />}
            >
              Question History
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {questions.map((question) => (
                <Grid item xs={12} md={6} key={question._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" gutterBottom>
                          {question.content}
                        </Typography>
                        {(question as any).isGenerated && (
                          <Chip 
                            icon={<NewReleases fontSize="small" />}
                            label="New" 
                            color="success" 
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label={question.subject} 
                          color="primary" 
                          size="small"
                        />
                        {question.grade && (
                          <Chip 
                            label={`Grade ${question.grade}`} 
                            color="info" 
                            size="small"
                          />
                        )}
                        <Chip 
                          label={question.difficulty} 
                          color="secondary" 
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Type: {question.type.replace('_', ' ')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => startPractice(question._id)}
                      >
                        Practice This
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {questions.length === 0 && (
              <Box textAlign="center" sx={{ mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No questions found for the selected filters.
                </Typography>
                {selectedSubject !== 'Math' && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Try selecting Math as the subject to get auto-generated questions.
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/practice/add')}
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                >
                  Add a New Question
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Practice;
