import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { 
  School, 
  TrendingUp, 
  EmojiEvents, 
  LocalFireDepartment,
  Star,
  CheckCircle,
  Cancel,
  Settings,
  Person,
  Analytics,
  Celebration,
  RocketLaunch,
  AutoAwesome,
  FlashOn,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getQuestionAttempts, QuestionAttempt, getQuestionDetails } from '../../services/questionHistoryService';
import { getOverallProgress, getSubjectProgress } from '../../services/userProgressService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, refreshUserStats } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [questionHistory, setQuestionHistory] = useState<QuestionAttempt[]>([]);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetType, setResetType] = useState<'all' | 'history' | 'progress'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionAttempt | null>(null);
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState<any>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [chartData, setChartData] = useState<any>({
    subjectChartData: [],
    gradeChartData: [],
    pieChartData: []
  });

  useEffect(() => {
    refreshUserStats();
    const history = getQuestionAttempts();
    setQuestionHistory(history);
    
    // Prepare stable chart data
    const overallProgress = getOverallProgress();
    
    // Get subject progress for all subjects
    const subjects = ['Math', 'English', 'Reading', 'Thinking Skills', 'Mathematical Reasoning'];
    const subjectProgressData: Record<string, any> = {};
    subjects.forEach(subject => {
      const progress = getSubjectProgress(subject);
      if (progress) {
        subjectProgressData[subject] = {
          totalQuestions: progress.total,
          correctAnswers: progress.correct
        };
      }
    });
    
    // Create grade progress from overall progress
    const gradeProgressData = overallProgress.bySubject || {};
    
    // Prepare stable chart data
    const subjectChartData = Object.entries(subjectProgressData).map(([subject, data]: [string, any]) => ({
      subject,
      correct: data.correctAnswers || 0,
      total: data.totalQuestions || 0,
      accuracy: data.totalQuestions > 0 ? Math.round((data.correctAnswers / data.totalQuestions) * 100) : 0
    }));

    const gradeChartData = Object.entries(gradeProgressData).map(([grade, data]: [string, any]) => ({
      grade: `Grade ${grade}`,
      correct: data.correct || 0,
      total: data.total || 0,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));

    const pieChartData = [
      { name: 'Correct', value: overallProgress.correctAnswers, color: '#10b981' },
      { name: 'Incorrect', value: overallProgress.totalQuestions - overallProgress.correctAnswers, color: '#ef4444' }
    ];
    
    setChartData({
      subjectChartData,
      gradeChartData,
      pieChartData
    });
  }, [refreshUserStats]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
  };

  const handleQuestionClick = (attempt: QuestionAttempt) => {
    setSelectedQuestion(attempt);
    // Fetch question details once when question is selected
    const questionDetails = getQuestionDetails(attempt.questionId);
    setSelectedQuestionDetails(questionDetails);
    setShowQuestionDialog(true);
  };

  const overallProgress = getOverallProgress();
  
  // Get subject progress for all subjects
  const subjects = ['Math', 'English', 'Reading', 'Thinking Skills', 'Mathematical Reasoning'];
  const subjectProgressData: Record<string, any> = {};
  subjects.forEach(subject => {
    const progress = getSubjectProgress(subject);
    if (progress) {
      subjectProgressData[subject] = {
        totalQuestions: progress.total,
        correctAnswers: progress.correct
      };
    }
  });
  
  // Create grade progress from overall progress
  const gradeProgressData = overallProgress.bySubject || {};

  // Calculate level and progress
  const calculateLevel = (totalQuestions: number) => {
    return Math.floor(totalQuestions / 10) + 1;
  };

  const calculateLevelProgress = (totalQuestions: number) => {
    return (totalQuestions % 10) * 10;
  };

  const currentLevel = calculateLevel(user?.stats?.totalQuestions || 0);
  const levelProgress = calculateLevelProgress(user?.stats?.totalQuestions || 0);

  // Filter data based on selections
  const filteredHistory = questionHistory.filter(attempt => {
    const subjectMatch = selectedSubject === 'All' || attempt.subject === selectedSubject;
    const gradeMatch = selectedGrade === 'All' || attempt.grade === selectedGrade;
    return subjectMatch && gradeMatch;
  });

  // Use stable chart data from state
  const { subjectChartData, gradeChartData, pieChartData } = chartData;

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        {/* Hero Profile Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4
          }}
        >
          {/* Decorative Elements */}
          <Box sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }} />
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80,
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '2rem',
                    fontWeight: 700
                  }}
                >
                  {user.profile.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                    {user.profile.firstName} {user.profile.lastName} 🌟
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                    Grade {user.grade} • Level {currentLevel} Learner
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<LocalFireDepartment />}
                      label={`${user.streaks.current} day streak 🔥`}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Chip 
                      icon={<EmojiEvents />}
                      label={`Best: ${user.streaks.best} days`}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>
                  {user.stats.averageScore}%
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Overall Accuracy
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={levelProgress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }} 
                />
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  {10 - (user.stats.totalQuestions % 10)} questions to Level {currentLevel + 1}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <School sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {user.stats.totalQuestions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Questions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {user.stats.correctAnswers}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Correct Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Star sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {currentLevel}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Current Level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Cancel sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {user.stats.wrongAnswers}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Wrong Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 64,
                },
                '& .Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                }
              }}
            >
              <Tab 
                icon={<Analytics />} 
                label="Analytics 📊" 
                iconPosition="start"
              />
              <Tab 
                icon={<TrendingUp />} 
                label="Progress 📈" 
                iconPosition="start"
              />
              <Tab 
                icon={<School />} 
                label="History 📚" 
                iconPosition="start"
              />
              <Tab 
                icon={<Settings />} 
                label="Settings ⚙️" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
              📊 Performance Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Subject Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="accuracy" fill="#6366f1" name="Accuracy %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Overall Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Progress Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
              📈 Learning Progress
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Grade-wise Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={gradeChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} name="Accuracy %" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* History Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
              📚 Question History
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select value={selectedSubject} label="Subject" onChange={handleSubjectChange}>
                    <MenuItem value="All">All Subjects</MenuItem>
                    <MenuItem value="Math">Math</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Reading">Reading</MenuItem>
                    <MenuItem value="Thinking Skills">Thinking Skills</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select value={selectedGrade} label="Grade" onChange={handleGradeChange}>
                    <MenuItem value="All">All Grades</MenuItem>
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i + 1} value={(i + 1).toString()}>
                        Grade {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Card>
              <List>
                {filteredHistory.slice(0, 20).map((attempt: QuestionAttempt, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem
                      button
                      onClick={() => handleQuestionClick(attempt)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.04)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        {attempt.isCorrect ? 
                          <CheckCircle sx={{ color: '#10b981' }} /> : 
                          <Cancel sx={{ color: '#ef4444' }} />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">
                              {(attempt as any).questionContent?.substring(0, 100) || attempt.userAnswer?.substring(0, 100) || 'Click to view question details'}...
                            </Typography>
                            <Chip 
                              label={attempt.subject} 
                              size="small" 
                              color="primary"
                            />
                            <Chip 
                              label={`Grade ${attempt.grade}`} 
                              size="small" 
                              color="secondary"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {new Date(attempt.timestamp).toLocaleDateString()} • 
                            Your answer: {attempt.userAnswer} • 
                            Correct: {attempt.correctAnswer}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < filteredHistory.slice(0, 20).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
              ⚙️ Profile Settings
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight={600}>
                ⚠️ Data Reset Options
              </Typography>
              <Typography variant="body2">
                Use these options carefully. Data reset cannot be undone!
              </Typography>
            </Alert>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reset Learning Data
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowResetDialog(true)}
                sx={{ mt: 2 }}
              >
                Reset Data
              </Button>
            </Card>
          </TabPanel>
        </Paper>

        {/* Motivational Footer */}
        <Paper sx={{ 
          mt: 4, 
          p: 3, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.1)',
          borderRadius: 4
        }}>
          <Typography variant="h6" fontWeight={600} color="#10b981" gutterBottom>
            🎉 Amazing Progress, {user.profile.firstName}! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You've completed {user.stats.totalQuestions} questions with {user.stats.averageScore}% accuracy. 
            Keep up the fantastic work! 🌟
          </Typography>
        </Paper>

        {/* Question Details Dialog */}
        <Dialog 
          open={showQuestionDialog} 
          onClose={() => {
            setShowQuestionDialog(false);
            setSelectedQuestion(null);
            setSelectedQuestionDetails(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedQuestion?.isCorrect ? 
                <CheckCircle sx={{ color: '#10b981' }} /> : 
                <Cancel sx={{ color: '#ef4444' }} />
              }
              <Typography variant="h6">
                Question Details
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <Chip 
                  label={selectedQuestion?.subject} 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label={`Grade ${selectedQuestion?.grade}`} 
                  size="small" 
                  color="secondary"
                />
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedQuestion && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Question:
                </Typography>
                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fafc' }}>
                  <Typography variant="body1">
                    {selectedQuestionDetails?.content || 
                     (selectedQuestion as any).questionContent || 
                     `Question ID: ${selectedQuestion.questionId} - Content not available in history`}
                  </Typography>
                </Paper>

                {selectedQuestionDetails?.options && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Available Options:
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedQuestionDetails.options.map((option: string, index: number) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Paper sx={{ 
                            p: 2, 
                            backgroundColor: option === selectedQuestion.correctAnswer ? '#f0fdf4' : 
                                           option === selectedQuestion.userAnswer ? '#fef2f2' : '#f8fafc',
                            border: `1px solid ${
                              option === selectedQuestion.correctAnswer ? '#10b981' : 
                              option === selectedQuestion.userAnswer ? '#ef4444' : '#e2e8f0'
                            }`
                          }}>
                            <Typography variant="body2" fontWeight={
                              option === selectedQuestion.correctAnswer || option === selectedQuestion.userAnswer ? 600 : 400
                            }>
                              {String.fromCharCode(65 + index)}. {option}
                              {option === selectedQuestion.correctAnswer && ' ✅'}
                              {option === selectedQuestion.userAnswer && option !== selectedQuestion.correctAnswer && ' ❌'}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Your Answer:
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      backgroundColor: selectedQuestion.isCorrect ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${selectedQuestion.isCorrect ? '#10b981' : '#ef4444'}`
                    }}>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedQuestion.userAnswer}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Correct Answer:
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #10b981'
                    }}>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedQuestion.correctAnswer}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {selectedQuestionDetails?.explanation && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Explanation:
                    </Typography>
                    <Paper sx={{ p: 3, backgroundColor: '#f0f9ff', border: '1px solid #3b82f6' }}>
                      <Typography variant="body1">
                        {selectedQuestionDetails.explanation}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Details:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Result
                        </Typography>
                        <Typography variant="h6" color={selectedQuestion.isCorrect ? '#10b981' : '#ef4444'}>
                          {selectedQuestion.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="h6">
                          {new Date(selectedQuestion.timestamp).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Difficulty
                        </Typography>
                        <Typography variant="h6">
                          {selectedQuestion.difficulty || selectedQuestionDetails?.difficulty || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="h6">
                          {new Date(selectedQuestion.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setShowQuestionDialog(false);
              setSelectedQuestion(null);
              setSelectedQuestionDetails(null);
            }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reset Dialog */}
        <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
          <DialogTitle>Reset Learning Data</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              What would you like to reset?
            </Typography>
            <RadioGroup
              value={resetType}
              onChange={(e) => setResetType(e.target.value as 'all' | 'history' | 'progress')}
            >
              <FormControlLabel value="all" control={<Radio />} label="All data (history + progress)" />
              <FormControlLabel value="history" control={<Radio />} label="Question history only" />
              <FormControlLabel value="progress" control={<Radio />} label="Progress stats only" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                // Reset logic would go here
                setShowResetDialog(false);
              }} 
              color="error"
            >
              Reset
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
