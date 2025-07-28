import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel, QuestionType } from '../../types';

interface QuestionFormData {
  content: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  difficulty: DifficultyLevel;
  tags: string[];
  grade: string;
  topic: string;
  hints: string[];
}

const AddQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<QuestionFormData>({
    content: '',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    subject: '',
    difficulty: DifficultyLevel.MEDIUM,
    tags: [],
    grade: '',
    topic: '',
    hints: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newQuestion: Question = {
      _id: generateId(),
      content: formData.content,
      type: formData.type,
      options: formData.options.filter(opt => opt.trim() !== ''),
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      subject: formData.subject,
      difficulty: formData.difficulty,
      tags: formData.tags,
      grade: formData.grade,
      topic: formData.topic,
      hints: formData.hints,
      createdBy: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Add question to database/storage
      console.log('New question:', newQuestion);
      
      // Reset form
      setFormData({
        content: '',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        subject: '',
        difficulty: DifficultyLevel.MEDIUM,
        tags: [],
        grade: '',
        topic: '',
        hints: []
      });
      
      // Navigate back or show success message
      navigate(-1);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // Helper function to generate unique IDs
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Question
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Question Content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Question Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Question Type"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</MenuItem>
                <MenuItem value={QuestionType.SHORT_ANSWER}>Short Answer</MenuItem>
                <MenuItem value={QuestionType.TRUE_FALSE}>True/False</MenuItem>
                <MenuItem value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Answer Options
              </Typography>
              {formData.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  {index > 1 && (
                    <Button
                      color="error"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <Delete />
                    </Button>
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
            </Box>

            <TextField
              fullWidth
              label="Correct Answer"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                label="Subject"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="Math">Math</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Thinking Skills">Thinking Skills</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={formData.difficulty}
                label="Difficulty"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value={DifficultyLevel.EASY}>Easy</MenuItem>
                <MenuItem value={DifficultyLevel.MEDIUM}>Medium</MenuItem>
                <MenuItem value={DifficultyLevel.HARD}>Hard</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              margin="normal"
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
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
                <Button onClick={handleAddTag}>
                  <Add />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Add Question
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddQuestion;
