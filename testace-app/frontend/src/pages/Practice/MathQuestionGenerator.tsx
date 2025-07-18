import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  LinearProgress,
  Alert,
  Grid,
  Paper,
  Divider,
  Chip,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Check, Close, ArrowUpward, ArrowDownward, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Question, DifficultyLevel } from '../../types';
import { generateMathQuestions } from '../../utils/mathQuestionGenerator';
import { markQuestionAnswered, recordMathSessionScore } from '../../services/userProgressService';
import { getUserGrade, updateUserGrade } from '../../services/userContextService';
import { recordQuestionAttempt } from '../../services/questionHistoryService';

const MathQuestionGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    // Ensure we get a valid string value for the grade
    const grade = getUserGrade();
    return typeof grade === 'string' ? grade : String(grade);
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Generate questions when grade and difficulty are selected
  const handleGenerateQuestions = () => {
    if (!selectedGrade) return;
    
    setIsGenerating(true);
    
    try {
      const generatedQuestions = generateMathQuestions(
        selectedGrade,
        selectedDifficulty,
        20
      );
      
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setScore(0);
      setAnsweredQuestions(new Set());
      setSessionStarted(true);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    const newGrade = String(event.target.value);
    setSelectedGrade(newGrade);
    updateUserGrade(newGrade); // Update the user's grade in the context
    setSessionStarted(false);
  };

  const handleGradeUp = () => {
    const currentGrade = parseInt(selectedGrade);
    if (currentGrade < 12) {
      const newGrade = (currentGrade + 1).toString();
      setSelectedGrade(newGrade);
      updateUserGrade(newGrade);
      setSessionStarted(false);
    }
  };

  const handleGradeDown = () => {
    const currentGrade = parseInt(selectedGrade);
    if (currentGrade > 1) {
      const newGrade = (currentGrade - 1).toString();
      setSelectedGrade(newGrade);
      updateUserGrade(newGrade);
      setSessionStarted(false);
    }
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value as DifficultyLevel);
    setSessionStarted(false);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isSubmitted) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const currentQuestion = questions[currentQuestionIndex];
      const correct = selectedAnswer === currentQuestion.correctAnswer;
      
      setIsCorrect(correct);
      setIsSubmitted(true);
      setShowExplanation(true);
      
      if (correct) {
        setScore(prev => prev + 1);
      }
      
      // Mark question as answered in user progress
      markQuestionAnswered(currentQuestion._id, correct);
      
      // Record the question attempt in history
      recordQuestionAttempt(currentQuestion, selectedAnswer, correct);
      
      // Mark question as answered in local state
      setAnsweredQuestions(prev => new Set(prev).add(currentQuestion._id));
      
      setLoading(false);
      
      // Automatically proceed to the next question after a delay
      if (answeredQuestions.size < questions.length - 1) {
        setTimeout(() => {
          handleNextQuestion();
        }, 3000); // 3 seconds delay
      } else {
        // Record the session score when all questions are answered
        recordMathSessionScore(
          selectedGrade,
          selectedDifficulty,
          score + (correct ? 1 : 0),
          questions.length
        );
      }
    }, 500);
  };

  const handleNextQuestion = () => {
    // Find the next unanswered question
    let nextIndex = currentQuestionIndex + 1;
    
    // If we've reached the end, go back to the beginning
    if (nextIndex >= questions.length) {
      nextIndex = 0;
    }
    
    // If all questions have been answered, just go to the next one
    if (answeredQuestions.size === questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer('');
      setIsSubmitted(false);
      setShowExplanation(false);
      return;
    }
    
    // Find the next unanswered question
    while (answeredQuestions.has(questions[nextIndex]._id)) {
      nextIndex = (nextIndex + 1) % questions.length;
    }
    
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer('');
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practice')}
          sx={{ mb: 2, mr: 2 }}
        >
          Back to Practice
        </Button>
        
        <Button
          startIcon={<History />}
          onClick={() => navigate('/practice/history')}
          sx={{ mb: 2 }}
          color="secondary"
        >
          View Question History
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Math Question Generator
        </Typography>

        {!sessionStarted ? (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate Math Questions
              </Typography>
              <Typography variant="body1" paragraph>
                Questions are set to your current grade level (Grade {selectedGrade}). You can adjust the grade level up or down using the controls.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl fullWidth>
                      <InputLabel>Grade</InputLabel>
                      <Select
                        value={selectedGrade}
                        label="Grade"
                        onChange={handleGradeChange}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                          <MenuItem key={grade} value={grade.toString()}>Grade {grade}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}>
                      <Button 
                        size="small" 
                        onClick={handleGradeUp}
                        disabled={parseInt(selectedGrade) >= 12}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <ArrowUpward fontSize="small" />
                      </Button>
                      <Button 
                        size="small" 
                        onClick={handleGradeDown}
                        disabled={parseInt(selectedGrade) <= 1}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <ArrowDownward fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={selectedDifficulty}
                      label="Difficulty"
                      onChange={handleDifficultyChange}
                    >
                      <MenuItem value={DifficultyLevel.EASY}>Easy</MenuItem>
                      <MenuItem value={DifficultyLevel.MEDIUM}>Medium</MenuItem>
                      <MenuItem value={DifficultyLevel.HARD}>Hard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleGenerateQuestions}
                    disabled={!selectedGrade || isGenerating}
                  >
                    {isGenerating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                        Generating Questions...
                      </Box>
                    ) : (
                      'Generate Questions'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">
                    Grade {selectedGrade} - {selectedDifficulty}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">
                    Score: {score}/{questions.length} ({Math.round((score / Math.max(1, answeredQuestions.size)) * 100)}%)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Questions Answered: {answeredQuestions.size}/{questions.length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <LinearProgress 
              variant="determinate" 
              value={(answeredQuestions.size / questions.length) * 100} 
              sx={{ mb: 3, height: 10, borderRadius: 5 }}
            />

            {currentQuestion && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label="Math" color="primary" size="small" />
                    <Chip label={`Grade ${currentQuestion.grade}`} color="info" size="small" />
                    <Chip label={currentQuestion.difficulty} color="secondary" size="small" />
                    {currentQuestion.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} variant="outlined" size="small" />
                    ))}
                  </Box>

                  <Typography variant="h5" gutterBottom>
                    Question {currentQuestionIndex + 1}: {currentQuestion.content}
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={selectedAnswer}
                        onChange={handleAnswerChange}
                      >
                        {currentQuestion.options?.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={option}
                            disabled={isSubmitted}
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              ...(isSubmitted && option === currentQuestion.correctAnswer && {
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              }),
                              ...(isSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer && {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                              }),
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {!isSubmitted ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer || loading}
                      sx={{ mt: 3 }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                          Checking...
                        </Box>
                      ) : (
                        'Submit Answer'
                      )}
                    </Button>
                  ) : (
                    <>
                      <Alert
                        severity={isCorrect ? 'success' : 'error'}
                        icon={isCorrect ? <Check /> : <Close />}
                        sx={{ mt: 3 }}
                      >
                        {isCorrect
                          ? 'Correct! Well done.'
                          : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
                      </Alert>

                      {showExplanation && (
                        <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="h6" gutterBottom>
                            Explanation
                          </Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {currentQuestion.explanation}
                          </Typography>
                        </Paper>
                      )}

                      <Divider sx={{ my: 3 }} />

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleNextQuestion}
                      >
                        Next Question
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {answeredQuestions.size === questions.length && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  All questions answered!
                </Typography>
                <Typography variant="body1">
                  Your final score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={handleGenerateQuestions}
                >
                  Generate New Questions
                </Button>
              </Alert>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default MathQuestionGenerator;
