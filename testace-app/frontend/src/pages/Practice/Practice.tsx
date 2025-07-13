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
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';

const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [selectedSubject, selectedDifficulty]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockQuestions: Question[] = [
        {
          _id: '1',
          content: 'What is 2 + 2?',
          type: 'multiple_choice' as any,
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          explanation: '2 + 2 equals 4',
          subject: 'Math',
          difficulty: DifficultyLevel.EASY,
          tags: ['arithmetic'],
          createdBy: 'system',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          content: 'What is the capital of France?',
          type: 'multiple_choice' as any,
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris',
          explanation: 'Paris is the capital city of France',
          subject: 'Geography',
          difficulty: DifficultyLevel.EASY,
          tags: ['capitals', 'europe'],
          createdBy: 'system',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
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
        
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <MenuItem value="">All Subjects</MenuItem>
              <MenuItem value="Math">Math</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="Geography">Geography</MenuItem>
              <MenuItem value="History">History</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={selectedDifficulty}
              label="Difficulty"
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {questions.map((question) => (
            <Grid item xs={12} md={6} key={question._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {question.content}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={question.subject} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
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

        {questions.length === 0 && !loading && (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No questions found for the selected filters.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Practice;
