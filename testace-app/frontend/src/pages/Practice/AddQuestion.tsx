import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel, QuestionType } from '../../types';
import { questionData } from './questionData';

// Helper function to generate unique IDs
const generateId = (() => {
  let counter = 1000; // Start from 1000 to avoid ID conflicts
  return () => (counter++).toString();
})();

const AddQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<Question>>({
    content: '',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['', '', '', ''],
    correctAnswer: '',  // Always use string for correctAnswer in this component
    explanation: '',
    subject: '',
    difficulty: DifficultyLevel.MEDIUM,
    tags: [],
    grade: '',
    topic: '',  // Initialize topic
    hints: []   // Initialize hints
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Tag input
  const [tagInput, setTagInput] = useState('');

  // Extract unique subjects and grades on component mount
  useEffect(() => {
    const subjectSet = new Set(questionData.map(q => q.subject));
    const gradeSet = new Set(questionData.map(q => q.grade || ''));
    
    const subjects = Array.from(subjectSet);
    const grades = Array.from(gradeSet).filter(Boolean);
    
    setAvailableSubjects(subjects);
    setAvailableGrades(grades);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
    
    // Clear error when options are edited
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: '' }));
    }
  };

  const handleAddOption = () => {
    setFormData(prev => ({ 
      ...prev, 
      options: [...(prev.options || []), ''] 
    }));
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions.splice(index, 1);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), tagInput.trim()] 
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: (prev.tags || []).filter(t => t !== tag) 
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.content) {
      newErrors.content = 'Question content is required';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }
    
    if (!formData.options || formData.options.some(opt => !opt.trim())) {
      newErrors.options = 'All options must be filled';
    }
    
    if (!formData.correctAnswer) {
      newErrors.correctAnswer = 'Correct answer is required';
    } else if (formData.options && !formData.options.includes(String(formData.correctAnswer))) {
      newErrors.correctAnswer = 'Correct answer must be one of the options';
    }
    
    if (!formData.explanation) {
      newErrors.explanation = 'Explanation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create new question
      const newQuestion: Question = {
        _id: generateId(),
        content: formData.content || '',
        type: formData.type || QuestionType.MULTIPLE_CHOICE,
        options: formData.options || [],
        correctAnswer: formData.correctAnswer || '',
        explanation: formData.explanation || '',
        subject: formData.subject || '',
        difficulty: formData.difficulty || DifficultyLevel.MEDIUM,
        tags: formData.tags || [],
        grade: formData.grade || '',
        createdBy: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        topic: formData.subject || '',  // Use subject as default topic
        hints: []  // Empty hints array
      };
      
      // Add to questionData
      questionData.push(newQuestion);
      
      // Show success message
      setSnackbarMessage('Question added successfully!');
      setSnackbarOpen(true);
      
      // Reset form
      setFormData({
        content: '',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        subject: formData.subject, // Keep the same subject for convenience
        difficulty: DifficultyLevel.MEDIUM,
        tags: [],
        grade: formData.grade, // Keep the same grade for convenience
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practice')}
          sx={{ mb: 2 }}
        >
          Back to Practice
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Add New Question
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Question Content */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Question Content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  error={!!errors.content}
                  helperText={errors.content}
                  required
                />
              </Grid>

              {/* Subject and Grade */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.subject} required>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    name="subject"
                    value={formData.subject || ''}
                    onChange={handleSelectChange}
                    label="Subject"
                  >
                    {availableSubjects.map(subject => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                    <MenuItem value="Math">Math</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="History">History</MenuItem>
                    <MenuItem value="Geography">Geography</MenuItem>
                  </Select>
                  {errors.subject && <FormHelperText>{errors.subject}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.grade} required>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    name="grade"
                    value={formData.grade || ''}
                    onChange={handleSelectChange}
                    label="Grade"
                  >
                    {availableGrades.map(grade => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <MenuItem key={grade} value={grade.toString()}>{grade}</MenuItem>
                    ))}
                  </Select>
                  {errors.grade && <FormHelperText>{errors.grade}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Difficulty */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    name="difficulty"
                    value={formData.difficulty || DifficultyLevel.MEDIUM}
                    onChange={handleSelectChange}
                    label="Difficulty"
                  >
                    <MenuItem value={DifficultyLevel.EASY}>Easy</MenuItem>
                    <MenuItem value={DifficultyLevel.MEDIUM}>Medium</MenuItem>
                    <MenuItem value={DifficultyLevel.HARD}>Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Options */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Options
                </Typography>
                {errors.options && (
                  <FormHelperText error>{errors.options}</FormHelperText>
                )}
                {formData.options?.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      error={!!errors.options && !option.trim()}
                    />
                    {formData.options && formData.options.length > 2 && (
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveOption(index)}
                        sx={{ ml: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={handleAddOption}
                  sx={{ mt: 1 }}
                >
                  Add Option
                </Button>
              </Grid>

              {/* Correct Answer */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.correctAnswer} required>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select
                    name="correctAnswer"
                    value={String(formData.correctAnswer || '')}
                    onChange={handleSelectChange}
                    label="Correct Answer"
                  >
                    {formData.options?.filter(Boolean).map((option, index) => (
                      <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                  {errors.correctAnswer && <FormHelperText>{errors.correctAnswer}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Explanation */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Explanation"
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  error={!!errors.explanation}
                  helperText={errors.explanation}
                  required
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTag}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  Add Question
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddQuestion;
