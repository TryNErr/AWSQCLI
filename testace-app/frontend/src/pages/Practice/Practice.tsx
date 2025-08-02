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
  Paper
} from '@mui/material';
import { Add, History, NewReleases, AutoMode, School, Upgrade } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import { questionData } from './questionData';
import { getUserGrade } from '../../services/userContextService';
import { getAnsweredQuestionIds } from '../../services/userProgressService';
import { generateMathQuestions } from '../../utils/mathQuestionGenerator';
import { generateThinkingSkillsQuestions } from '../../utils/thinkingSkillsQuestionGenerator';
import { generateEnglishQuestions } from '../../utils/englishQuestionGenerator';
import { generateMathematicalReasoningQuestions } from '../../utils/mathematicalReasoningQuestionGenerator';
import { saveGeneratedQuestions, getGeneratedQuestions } from '../../services/generatedQuestionsService';

// Helper function to shuffle an array
const shuffleArray = function<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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
    // Define all available subjects, including those that can be generated
    const allSubjects = [
      'Math',
      'English',
      'Thinking Skills',
      'Mathematical Reasoning',
      'Science',
      'Social Studies'
    ];
    
    const gradeSet = new Set(questionData.map(q => (q as any).grade || ''));
    const grades = Array.from(gradeSet).filter(Boolean);
    
    setAvailableSubjects(allSubjects);
    setAvailableGrades(grades);
    
    // Initial load of questions
    filterQuestions();
  }, []);

  // Filter questions when selections change
  useEffect(() => {
    // Reset questions to force a complete refresh
    setQuestions([]);
    // Apply filters
    filterQuestions();
  }, [selectedSubject, selectedGrade, selectedDifficulty]);

  const filterQuestions = () => {
    setLoading(true);
    
    // Get answered question IDs
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    // Get all questions (both standard and generated)
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    
    // Apply filters to all questions at once
    let filteredQuestions = allQuestions;
    
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
    
    if (unansweredQuestions.length < 10) {
      // Determine how many questions to generate
      const questionsToGenerate = 10 - unansweredQuestions.length;
      
      // Determine difficulty level for generated questions
      let difficultyLevel = DifficultyLevel.MEDIUM;
      if (selectedDifficulty === 'easy') difficultyLevel = DifficultyLevel.EASY;
      if (selectedDifficulty === 'medium') difficultyLevel = DifficultyLevel.MEDIUM;
      if (selectedDifficulty === 'hard') difficultyLevel = DifficultyLevel.HARD;
      
      // Generate questions based on subject
      let newGeneratedQuestions: Question[] = [];
      
      if (!selectedSubject || selectedSubject === 'Math') {
        newGeneratedQuestions = generateMathQuestions(
          selectedGrade || getUserGrade(),
          difficultyLevel,
          questionsToGenerate
        );
      } else if (selectedSubject === 'Thinking Skills') {
        newGeneratedQuestions = generateThinkingSkillsQuestions(
          selectedGrade || getUserGrade(),
          difficultyLevel,
          questionsToGenerate
        );
      } else if (selectedSubject === 'English') {
        newGeneratedQuestions = generateEnglishQuestions(
          selectedGrade || getUserGrade(),
          difficultyLevel,
          questionsToGenerate
        );
      } else if (selectedSubject === 'Mathematical Reasoning') {
        newGeneratedQuestions = generateMathematicalReasoningQuestions(
          selectedGrade || getUserGrade(),
          difficultyLevel,
          questionsToGenerate
        );
      }
      
      // Mark generated questions
      newGeneratedQuestions = newGeneratedQuestions.map(q => ({
        ...q,
        isGenerated: true
      }));
      
      // Save the generated questions to localStorage
      saveGeneratedQuestions([...getGeneratedQuestions(), ...newGeneratedQuestions]);
      
      // Add new questions to final questions
      finalQuestions = [...unansweredQuestions, ...newGeneratedQuestions];
    }
    
    // Shuffle all questions together
    const shuffledQuestions = shuffleArray(finalQuestions);
    
    // Limit to 10 questions for display
    const limitedQuestions = shuffledQuestions.slice(0, 10);
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

  const handleGenerateThinkingSkills = () => {
    setLoading(true);
    
    // Set subject to Thinking Skills
    setSelectedSubject('Thinking Skills');
    
    // Generate questions
    const difficultyLevel = selectedDifficulty === 'easy' 
      ? DifficultyLevel.EASY 
      : selectedDifficulty === 'hard' 
        ? DifficultyLevel.HARD 
        : DifficultyLevel.MEDIUM;
    
    const generatedQuestions = generateThinkingSkillsQuestions(
      selectedGrade || getUserGrade(),
      difficultyLevel,
      10
    ).map(q => ({
      ...q,
      isGenerated: true
    }));
    
    // Save the generated questions to localStorage
    saveGeneratedQuestions(generatedQuestions);
    
    // Shuffle the questions before setting them
    const shuffledQuestions = shuffleArray(generatedQuestions);
    
    setQuestions(shuffledQuestions);
    setLoading(false);
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

        {/* Enhanced Practice Mode Promotion */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Upgrade />
                Try Enhanced Practice Mode
              </Typography>
              <Typography variant="body1">
                🎓 Challenging curriculum-aligned questions with auto-advance and strict grade/difficulty filtering
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Auto-advance in 5s" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Chip label="Strict filtering" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Chip label="Smart generation" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              </Box>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/practice/enhanced')}
              startIcon={<School />}
              sx={{ minWidth: 200 }}
            >
              Try Enhanced Mode
            </Button>
          </Box>
        </Paper>
        
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
                  <MenuItem key={subject} value={subject}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {subject}
                      {(subject === 'Math' || 
                        subject === 'English' || 
                        subject === 'Thinking Skills' || 
                        subject === 'Mathematical Reasoning') && (
                        <Chip
                          label="Auto-generated"
                          size="small"
                          color="info"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </MenuItem>
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
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  {selectedSubject === 'Science' || selectedSubject === 'Social Studies' ? (
                    <>
                      Questions for {selectedSubject} need to be added manually.
                      Click "Add Question" to contribute questions for this subject.
                    </>
                  ) : (
                    <>
                      Questions will be automatically generated for {selectedSubject || 'selected subjects'}.
                      Try adjusting the grade or difficulty filters.
                    </>
                  )}
                </Typography>
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
