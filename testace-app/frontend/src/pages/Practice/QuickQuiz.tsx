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
  Chip
} from '@mui/material';
import { FlashOn, PlayArrow, Timer } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserGrade } from '../../services/userContextService';

const QuickQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Default selections based on profile or fallback
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [selectedGrade, setSelectedGrade] = useState(() => {
    const grade = getUserGrade();
    return typeof grade === 'string' ? grade : String(grade);
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  const availableSubjects = ['Math', 'English', 'Reading', 'Thinking Skills', 'Mathematical Reasoning'];
  const availableGrades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const availableDifficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    // Set defaults based on user profile if available
    if (user?.grade) {
      setSelectedGrade(user.grade);
    }
  }, [user]);

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value);
  };

  const startQuiz = () => {
    navigate(`/quick-quiz/session?subject=${selectedSubject}&grade=${selectedGrade}&difficulty=${selectedDifficulty}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', color: 'white' }}>
          <FlashOn sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Quick Quiz
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Test your knowledge with 10 random questions
          </Typography>
        </Paper>

        {/* Selection Form */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer color="primary" />
              Quiz Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={selectedSubject}
                    label="Subject"
                    onChange={handleSubjectChange}
                  >
                    {availableSubjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={selectedGrade}
                    label="Grade"
                    onChange={handleGradeChange}
                  >
                    {availableGrades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        Grade {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={selectedDifficulty}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                  >
                    {availableDifficulties.map((difficulty) => (
                      <MenuItem key={difficulty} value={difficulty}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
                            color={getDifficultyColor(difficulty) as any}
                            size="small"
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quiz Preview */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Quiz Preview
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Chip label={`Subject: ${selectedSubject}`} color="primary" />
              <Chip label={`Grade: ${selectedGrade}`} color="secondary" />
              <Chip 
                label={`Difficulty: ${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}`} 
                color={getDifficultyColor(selectedDifficulty) as any}
              />
              <Chip label="10 Questions" variant="outlined" />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You'll get 10 random questions from {selectedSubject} for Grade {selectedGrade} at {selectedDifficulty} difficulty level.
              Your answers will be recorded and you'll receive a score at the end.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={startQuiz}
              sx={{ 
                py: 1.5, 
                px: 4,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                }
              }}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default QuickQuiz;
