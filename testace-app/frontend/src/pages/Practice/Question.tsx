import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Stack
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowBack, CheckCircle, Cancel, Refresh } from '@mui/icons-material';
import { Question as QuestionType, DifficultyLevel } from '../../types';
import { questionData } from './questionData';
import { getGeneratedQuestions, saveGeneratedQuestions } from '../../services/generatedQuestionsService';
import { markQuestionAnswered, getAnsweredQuestionIds } from '../../services/userProgressService';
import { recordQuestionAttempt } from '../../services/questionHistoryService';
import { getUserGrade } from '../../services/userContextService';
import { generateMathQuestions } from '../../utils/mathQuestionGenerator';
import { generateEnhancedQuestion } from '../../utils/enhancedQuestionSystem';
import { generateThinkingSkillsQuestions } from '../../utils/thinkingSkillsQuestionGenerator';
import { generateEnglishQuestions } from '../../utils/englishQuestionGenerator';
import { generateMathematicalReasoningQuestions } from '../../utils/mathematicalReasoningQuestionGenerator';
import BulletproofPracticeSystem from '../../utils/bulletproofPracticeSystem';
import { StaticQuestionLoader } from '../../utils/staticQuestionLoader';

// Helper function to shuffle an array
const shuffleArray = function<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to convert difficulty string to enum
const getDifficultyLevel = (difficulty: string): DifficultyLevel => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return DifficultyLevel.EASY;
    case 'medium': return DifficultyLevel.MEDIUM;
    case 'hard': return DifficultyLevel.HARD;
    default: return DifficultyLevel.MEDIUM;
  }
};

// Component to properly format reading passages with paragraph breaks
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  return (
    <Box>
      {paragraphs.map((paragraph, index) => {
        const parts = paragraph.split('**');
        const formattedParagraph = parts.map((part, partIndex) => 
          partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
        );
        
        return (
          <Typography 
            key={index} 
            variant="body1" 
            paragraph 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              textAlign: 'left',
              whiteSpace: 'pre-line'
            }}
          >
            {formattedParagraph}
          </Typography>
        );
      })}
    </Box>
  );
};

const Question: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);

  // Get session parameters from URL to maintain filters
  const sessionGrade = searchParams.get('grade');
  const sessionDifficulty = searchParams.get('difficulty');
  const sessionSubject = searchParams.get('subject');
  // Smart navigation back to the correct practice screen with filters preserved
  const handleBackToPractice = () => {
    // If we have session parameters, user came from Enhanced Practice
    if (sessionGrade || sessionDifficulty || sessionSubject) {
      console.log('🔙 Navigating back to Enhanced Practice with filters preserved');
      
      // Build URL with filter parameters to maintain state
      const params = new URLSearchParams();
      if (sessionGrade) params.set('grade', sessionGrade);
      if (sessionDifficulty) params.set('difficulty', sessionDifficulty);
      if (sessionSubject) params.set('subject', sessionSubject);
      
      const enhancedPracticeUrl = `/practice/enhanced?${params.toString()}`;
      console.log(`🎯 Navigating to: ${enhancedPracticeUrl}`);
      
      navigate(enhancedPracticeUrl);
    } else {
      console.log('🔙 Navigating back to main Practice page');
      navigate('/practice');
    }
  };

    const loadQuestion = async (questionId: string) => {
    setLoading(true);
    
    try {
      console.log(`🔍 Loading question: ${questionId}`);
      
      // Parse question ID to extract grade, difficulty, and subject
      const parts = questionId.split('_');
      if (parts.length >= 3) {
        const grade = parts[0].replace('grade', '');
        const difficulty = parts[1];
        const subject = parts[2];
        
        console.log(`📊 Parsed: Grade ${grade}, ${difficulty}, ${subject}`);
        
        // Use StaticQuestionLoader ONLY
        const questions = await StaticQuestionLoader.getQuestions(
          grade,
          getDifficultyLevel(difficulty),
          subject,
          50
        );
        
        const foundQuestion = questions.find(q => q._id === questionId);
        
        if (foundQuestion) {
          console.log(`✅ Found: ${foundQuestion.subject} question`);
          setQuestion(foundQuestion);
        } else {
          console.error(`❌ Question ${questionId} not found`);
          setQuestion(null);
        }
      } else {
        console.error(`❌ Invalid question ID: ${questionId}`);
        setQuestion(null);
      }
      
      // Reset form state
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setShowExplanation(false);
      setLoadingNextQuestion(false);
      
    } catch (error) {
      console.error('Error loading question:', error);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadQuestion(id);
    }
  }, [id]);

  const getNextQuestion = (): QuestionType | null => {
    // Get all available questions
    const allQuestions = [...questionData, ...getGeneratedQuestions()];
    
    // Get answered question IDs
    const answeredQuestionIds = getAnsweredQuestionIds();
    
    // Filter out answered questions and current question
    const availableQuestions = allQuestions.filter(q => 
      !answeredQuestionIds.includes(q._id) && q._id !== question?._id
    );
    
    if (availableQuestions.length > 0) {
      // Return a random question from available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      return availableQuestions[randomIndex];
    }
    
    return null;
  };

  const generateNewQuestion = (): QuestionType | null => {
    if (!question) return null;
    
    // Use the current question's properties to generate a similar one
    const grade = question.grade || getUserGrade();
    const difficulty = question.difficulty || DifficultyLevel.MEDIUM;
    const subject = question.subject;
    
    let newQuestions: QuestionType[] = [];
    
    try {
      switch (subject) {
        case 'Math':
          newQuestions = generateMathQuestions(grade, difficulty, 1);
          break;
        case 'English':
          newQuestions = generateEnglishQuestions(grade, difficulty, 1);
          break;
        case 'Thinking Skills':
          newQuestions = generateThinkingSkillsQuestions(grade, difficulty, 1);
          break;
        case 'Mathematical Reasoning':
          newQuestions = generateMathematicalReasoningQuestions(grade, difficulty, 1);
          break;
        default:
          // For other subjects, try to find any available question
          const allQuestions = [...questionData, ...getGeneratedQuestions()];
          const answeredQuestionIds = getAnsweredQuestionIds();
          const availableQuestions = allQuestions.filter(q => 
            !answeredQuestionIds.includes(q._id) && q._id !== question._id
          );
          if (availableQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            return availableQuestions[randomIndex];
          }
          return null;
      }
      
      if (newQuestions.length > 0) {
        const newQuestion = {
          ...newQuestions[0],
          isGenerated: true
        };
        
        // Save the generated question
        const existingGenerated = getGeneratedQuestions();
        saveGeneratedQuestions([...existingGenerated, newQuestion]);
        
        return newQuestion;
      }
    } catch (error) {
      console.error('Error generating new question:', error);
    }
    
    return null;
  };

  const handleTryAnotherQuestion = async () => {
    setLoadingNextQuestion(true);
    
    try {
      // Determine the grade and difficulty to use for the next question
      let targetGrade = sessionGrade || question?.grade || getUserGrade().toString();
      let targetDifficulty = sessionDifficulty ? getDifficultyLevel(sessionDifficulty) : (question?.difficulty || DifficultyLevel.MEDIUM);
      let targetSubject = sessionSubject || question?.subject;
      
      console.log(`🎯 Getting next question with filters: Grade ${targetGrade}, ${targetDifficulty}${targetSubject ? `, ${targetSubject}` : ''}`);
      
      // Use BulletproofPracticeSystem to get questions with maintained filters
      const questionPool = await BulletproofPracticeSystem.getPracticeQuestions({
        grade: targetGrade,
        difficulty: targetDifficulty,
        subject: targetSubject,
        count: 5 // Get 5 questions to have options
      });
      
      if (questionPool.questions.length > 0) {
        // Filter out the current question if it's in the results
        const availableQuestions = questionPool.questions.filter(q => q._id !== question?._id);
        
        if (availableQuestions.length > 0) {
          // Select a random question from the available ones
          const nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
          
          console.log(`✅ Selected next question: ${nextQuestion.subject} - Grade ${nextQuestion.grade} - ${nextQuestion.difficulty}`);
          
          // Load the new question directly
          setQuestion(nextQuestion);
          setSelectedAnswer('');
          setIsSubmitted(false);
          setIsCorrect(false);
          setShowExplanation(false);
          
          // Update URL to maintain session parameters
          const params = new URLSearchParams();
          if (sessionGrade) params.set('grade', sessionGrade);
          if (sessionDifficulty) params.set('difficulty', sessionDifficulty);
          if (sessionSubject) params.set('subject', sessionSubject);
          
          const paramString = params.toString();
          const newUrl = `/practice/question/${nextQuestion._id}${paramString ? `?${paramString}` : ''}`;
          window.history.pushState(null, '', newUrl);
          
          setLoadingNextQuestion(false);
          return;
        }
      }
      
      // If no questions available with current filters, show message and go back
      console.warn('⚠️ No more questions available with current filters');
      alert('No more questions available with the current filters. Returning to practice selection.');
      navigate('/practice/enhanced');
      
    } catch (error) {
      console.error('Error getting next question:', error);
      
      // Fallback: try to generate a single question using the old method
      try {
        const nextQuestion = generateNewQuestion();
        if (nextQuestion) {
          setQuestion(nextQuestion);
          setSelectedAnswer('');
          setIsSubmitted(false);
          setIsCorrect(false);
          setShowExplanation(false);
          
          // Update URL to maintain session parameters
          const params = new URLSearchParams();
          if (sessionGrade) params.set('grade', sessionGrade);
          if (sessionDifficulty) params.set('difficulty', sessionDifficulty);
          if (sessionSubject) params.set('subject', sessionSubject);
          
          const paramString = params.toString();
          const newUrl = `/practice/question/${nextQuestion._id}${paramString ? `?${paramString}` : ''}`;
          window.history.pushState(null, '', newUrl);
        } else {
          navigate('/practice/enhanced');
        }
      } catch (fallbackError) {
        console.error('Fallback question generation also failed:', fallbackError);
        navigate('/practice/enhanced');
      }
    } finally {
      setLoadingNextQuestion(false);
    }
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setSelectedAnswer(event.target.value);
    }
  };

  const handleSubmit = () => {
    if (!question || !selectedAnswer || isSubmitted) return;

    setLoading(true);
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true);

    // Record the attempt
    markQuestionAnswered(
      question._id,
      correct,
      question.subject,
      question.difficulty,
      question.grade
    );

    recordQuestionAttempt(
      question._id,
      question.subject,
      question.difficulty,
      question.grade,
      correct,
      selectedAnswer,
      question.correctAnswer,
      question.content,
      question.options,
      question.explanation
    );

    setLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!question) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToPractice}
            sx={{ mb: 2 }}
          >
            Back to Practice
          </Button>
          <Alert severity="error">Question not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToPractice}
          sx={{ mb: 2 }}
        >
          Back to Practice
        </Button>

        <Paper sx={{ p: 4 }}>
          {/* Session Filter Display */}
          {(sessionGrade || sessionDifficulty || sessionSubject) && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2" color="primary.contrastText" gutterBottom>
                🎯 Practice Session Filters Active:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sessionGrade && (
                  <Chip 
                    label={`Grade ${sessionGrade}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ bgcolor: 'white' }}
                  />
                )}
                {sessionDifficulty && (
                  <Chip 
                    label={sessionDifficulty.charAt(0).toUpperCase() + sessionDifficulty.slice(1)} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                    sx={{ bgcolor: 'white' }}
                  />
                )}
                {sessionSubject && (
                  <Chip 
                    label={sessionSubject} 
                    size="small" 
                    color="info" 
                    variant="outlined"
                    sx={{ bgcolor: 'white' }}
                  />
                )}
              </Stack>
              <Typography variant="caption" color="primary.contrastText" sx={{ mt: 1, display: 'block' }}>
                Next questions will maintain these filters
              </Typography>
            </Box>
          )}

          {/* Top Action Bar - Show after submission */}
          {isSubmitted && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Alert
                icon={isCorrect ? <CheckCircle /> : <Cancel />}
                severity={isCorrect ? "success" : "error"}
                sx={{ flex: 1, minWidth: '200px' }}
              >
                {isCorrect ? (
                  "Correct! Well done!"
                ) : (
                  <>
                    Incorrect. The correct answer is: {question.correctAnswer}
                  </>
                )}
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={handleTryAnotherQuestion}
                disabled={loadingNextQuestion}
                startIcon={loadingNextQuestion ? <CircularProgress size={16} /> : <Refresh />}
                sx={{ minWidth: '180px' }}
              >
                {loadingNextQuestion ? 'Loading...' : 
                  (sessionGrade || sessionDifficulty || sessionSubject) ? 
                    'Next Question (Same Filters)' : 
                    'Try Another Question'
                }
              </Button>
            </Box>
          )}

          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={question.subject} color="primary" />
              <Chip label={`Grade ${question.grade}`} color="info" />
              <Chip label={question.difficulty} color="secondary" />
              <Chip label={question.topic} variant="outlined" />
            </Stack>
            <FormattedText text={question.content} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Answer Options */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Choose your answer:
            </Typography>
            <RadioGroup
              value={selectedAnswer}
              onChange={handleAnswerChange}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={isSubmitted}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    ...(isSubmitted && option === question.correctAnswer && {
                      backgroundColor: 'success.light',
                      color: 'success.contrastText',
                    }),
                    ...(isSubmitted && selectedAnswer === option && option !== question.correctAnswer && {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText',
                    }),
                  }}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Submit Button or Result */}
          {!isSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              fullWidth
            >
              Submit Answer
            </Button>
          ) : (
            <Box>
              {/* Explanation */}
              {showExplanation && (
                <Paper variant="outlined" sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom>
                    Explanation
                  </Typography>
                  <Typography
                    variant="body1"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      my: 2
                    }}
                  >
                    {question.explanation}
                  </Typography>

                  {/* Additional Information */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Topic: {question.topic}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tags: {question.tags?.join(', ') || 'No tags'}
                    </Typography>
                  </Box>
                </Paper>
              )}

              {/* Bottom Try Another Question Button - for users who scroll down */}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleTryAnotherQuestion}
                disabled={loadingNextQuestion}
                startIcon={loadingNextQuestion ? <CircularProgress size={16} /> : <Refresh />}
                sx={{ mt: 3 }}
                fullWidth
              >
                {loadingNextQuestion ? 'Loading Next Question...' : 
                  (sessionGrade || sessionDifficulty || sessionSubject) ? 
                    'Next Question (Same Filters)' : 
                    'Try Another Question'
                }
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Question;
