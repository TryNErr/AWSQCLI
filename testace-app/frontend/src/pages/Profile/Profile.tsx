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
  Timer, 
  TrendingUp, 
  CheckCircle, 
  Cancel, 
  HelpOutline,
  History,
  Assessment,
  Close as CloseIcon
} from '@mui/icons-material';

// Import services
import { 
  getQuestionAttempts, 
  getQuestionStats, 
  getSubjectPerformance, 
  getDifficultyPerformance,
  getPerformanceTrend,
  getRecentQuestionAttempts,
  QuestionAttempt 
} from '../../services/questionHistoryService';
import { getOverallProgress } from '../../services/userProgressService';
import { getUserGrade, getUserName } from '../../services/userContextService';

// Interface for performance data
interface SubjectPerformance {
  subject: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
  correct: number;
  attempted: number;
  percentage: number;
}

interface GradePerformance {
  grade: string;
  performance: number;
  questionsAttempted: number;
  questionsCorrect: number;
}

interface DifficultyStats {
  difficulty: string;
  correct: number;
  total: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Profile: React.FC = () => {
  const [selectedView, setSelectedView] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectPerformance[]>([]);
  const [gradeData, setGradeData] = useState<GradePerformance[]>([]);
  const [difficultyData, setDifficultyData] = useState<DifficultyStats[]>([]);
  const [performanceTrend, setPerformanceTrend] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    questionsAttempted: 0,
    averageScore: 0
  });

  // Enhanced question dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionAttempt | null>(null);

  const currentUserGrade = getUserGrade();
  const userName = getUserName();

  // Load real data from services
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    // Get all question attempts
    const attempts = getQuestionAttempts();
    setQuestionAttempts(attempts);

    // Get overall progress
    const overallProgress = getOverallProgress();
    setOverallStats({
      totalQuestions: overallProgress.totalQuestions,
      correctAnswers: overallProgress.correctAnswers,
      questionsAttempted: overallProgress.totalQuestions,
      averageScore: overallProgress.totalQuestions > 0 
        ? Math.round((overallProgress.correctAnswers / overallProgress.totalQuestions) * 100)
        : 0
    });

    // Process subject data
    const subjectPerf = getSubjectPerformance();
    const processedSubjectData: SubjectPerformance[] = subjectPerf.map(subject => {
      const subjectAttempts = attempts.filter(a => a.subject === subject.subject);
      
      // Calculate difficulty breakdown
      const easyAttempts = subjectAttempts.filter(a => a.difficulty.toLowerCase() === 'easy');
      const mediumAttempts = subjectAttempts.filter(a => a.difficulty.toLowerCase() === 'medium');
      const hardAttempts = subjectAttempts.filter(a => a.difficulty.toLowerCase() === 'hard');

      return {
        subject: subject.subject,
        easy: easyAttempts.length > 0 ? Math.round((easyAttempts.filter(a => a.isCorrect).length / easyAttempts.length) * 100) : 0,
        medium: mediumAttempts.length > 0 ? Math.round((mediumAttempts.filter(a => a.isCorrect).length / mediumAttempts.length) * 100) : 0,
        hard: hardAttempts.length > 0 ? Math.round((hardAttempts.filter(a => a.isCorrect).length / hardAttempts.length) * 100) : 0,
        total: subject.total,
        correct: subject.correct,
        attempted: subject.total,
        percentage: subject.total > 0 ? Math.round((subject.correct / subject.total) * 100) : 0
      };
    });
    setSubjectData(processedSubjectData);

    // Process grade data (all grades 1-12)
    const gradeStats: { [key: string]: { correct: number; total: number } } = {};
    
    // Initialize all grades 1-12
    for (let i = 1; i <= 12; i++) {
      gradeStats[i.toString()] = { correct: 0, total: 0 };
    }

    // Fill with actual data
    attempts.forEach(attempt => {
      const grade = attempt.grade;
      if (gradeStats[grade]) {
        gradeStats[grade].total++;
        if (attempt.isCorrect) {
          gradeStats[grade].correct++;
        }
      }
    });

    const processedGradeData: GradePerformance[] = Object.entries(gradeStats)
      .filter(([_, stats]) => stats.total > 0) // Only show grades with attempts
      .map(([grade, stats]) => ({
        grade: `Grade ${grade}`,
        performance: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        questionsAttempted: stats.total,
        questionsCorrect: stats.correct
      }))
      .sort((a, b) => parseInt(a.grade.split(' ')[1]) - parseInt(b.grade.split(' ')[1]));
    
    setGradeData(processedGradeData);

    // Process difficulty data
    const difficultyPerf = getDifficultyPerformance();
    const processedDifficultyData: DifficultyStats[] = difficultyPerf.map(diff => ({
      difficulty: diff.difficulty.charAt(0).toUpperCase() + diff.difficulty.slice(1),
      correct: diff.correct,
      total: diff.total,
      percentage: diff.total > 0 ? Math.round((diff.correct / diff.total) * 100) : 0
    }));
    setDifficultyData(processedDifficultyData);

    // Get performance trend
    const trend = getPerformanceTrend(14); // Last 14 days
    const processedTrend = trend.map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      accuracy: day.total > 0 ? Math.round((day.correct / day.total) * 100) : 0,
      questions: day.total
    }));
    setPerformanceTrend(processedTrend);
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedView(newValue);
  };

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
  };

  // Handle question click to show detailed dialog
  const handleQuestionClick = (attempt: QuestionAttempt) => {
    setSelectedQuestion(attempt);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuestion(null);
  };

  // Filter data based on selections
  const getFilteredData = () => {
    let filteredAttempts = questionAttempts;
    
    if (selectedSubject !== 'all') {
      filteredAttempts = filteredAttempts.filter(a => a.subject === selectedSubject);
    }
    
    if (selectedGrade !== 'all') {
      const gradeNumber = selectedGrade.replace('Grade ', '');
      filteredAttempts = filteredAttempts.filter(a => a.grade === gradeNumber);
    }
    
    return filteredAttempts;
  };

  // Get filtered subject data based on current filters
  const getFilteredSubjectData = () => {
    const filteredAttempts = getFilteredData();
    
    if (selectedSubject !== 'all') {
      // If a specific subject is selected, return only that subject's data
      const subjectPerf = subjectData.find(s => s.subject === selectedSubject);
      return subjectPerf ? [subjectPerf] : [];
    }
    
    // If grade filter is applied, recalculate subject data for that grade
    if (selectedGrade !== 'all') {
      const subjects = [...new Set(filteredAttempts.map(a => a.subject))];
      return subjects.map(subject => {
        const subjectAttempts = filteredAttempts.filter(a => a.subject === subject);
        const correct = subjectAttempts.filter(a => a.isCorrect).length;
        const total = subjectAttempts.length;
        
        return {
          subject,
          easy: subjectAttempts.filter(a => a.difficulty === 'easy').length,
          medium: subjectAttempts.filter(a => a.difficulty === 'medium').length,
          hard: subjectAttempts.filter(a => a.difficulty === 'hard').length,
          total,
          correct,
          attempted: total,
          percentage: total > 0 ? Math.round((correct / total) * 100) : 0
        };
      });
    }
    
    return subjectData;
  };

  // Get filtered difficulty data based on current filters
  const getFilteredDifficultyData = () => {
    const filteredAttempts = getFilteredData();
    
    const difficulties = ['easy', 'medium', 'hard'];
    return difficulties.map(difficulty => {
      const diffAttempts = filteredAttempts.filter(a => a.difficulty === difficulty);
      const correct = diffAttempts.filter(a => a.isCorrect).length;
      const total = diffAttempts.length;
      
      return {
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0
      };
    }).filter(d => d.total > 0); // Only show difficulties with attempts
  };

  // Prepare data for difficulty distribution pie chart
  const filteredDifficultyData = getFilteredDifficultyData();
  const difficultyDistribution = filteredDifficultyData.map(diff => ({
    name: diff.difficulty,
    value: diff.percentage,
    count: diff.total
  }));

  // Get recent activity
  const recentAttempts = getRecentQuestionAttempts(10);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {userName}'s Progress - Grade {currentUserGrade}
        </Typography>

        {questionAttempts.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No question attempts found. Start practicing to see your progress here!
          </Alert>
        )}

        {/* Overall Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Questions
                </Typography>
                <Typography variant="h4">
                  {overallStats.totalQuestions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Questions Attempted
                </Typography>
                <Typography variant="h4">
                  {overallStats.questionsAttempted}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Correct Answers
                </Typography>
                <Typography variant="h4">
                  {overallStats.correctAnswers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h4">
                  {overallStats.averageScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={handleSubjectChange}
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {subjectData.map(subject => (
                <MenuItem key={subject.subject} value={subject.subject}>
                  {subject.subject}
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
              <MenuItem value="all">All Grades</MenuItem>
              {gradeData.map(grade => (
                <MenuItem key={grade.grade} value={grade.grade}>
                  {grade.grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabs for different views */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={selectedView} onChange={handleViewChange}>
            <Tab label="Performance by Subject" />
            <Tab label="Difficulty Distribution" />
            <Tab label="Grade Progress" />
            <Tab label="Performance Trend" />
            <Tab label="Question History" />
          </Tabs>
        </Box>

        {/* Performance by Subject Chart */}
        {selectedView === 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Performance by Subject
              {selectedSubject !== 'all' && ` - ${selectedSubject}`}
              {selectedGrade !== 'all' && ` - ${selectedGrade}`}
            </Typography>
            {getFilteredSubjectData().length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={getFilteredSubjectData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="easy" name="Easy %" fill="#82ca9d" />
                  <Bar dataKey="medium" name="Medium %" fill="#8884d8" />
                  <Bar dataKey="hard" name="Hard %" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No subject data available. Start practicing to see your performance!
              </Typography>
            )}
          </Paper>
        )}

        {/* Difficulty Distribution Chart */}
        {selectedView === 1 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Difficulty Distribution
              {selectedSubject !== 'all' && ` - ${selectedSubject}`}
              {selectedGrade !== 'all' && ` - ${selectedGrade}`}
            </Typography>
            {difficultyDistribution.length > 0 && difficultyDistribution.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={difficultyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, count }) => `${name}: ${value}% (${count} questions)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No difficulty data available. Start practicing to see your difficulty distribution!
              </Typography>
            )}
          </Paper>
        )}

        {/* Grade Progress Chart */}
        {selectedView === 2 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Grade Progress (All Grades 1-12)
            </Typography>
            {gradeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={gradeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" name="Performance %" fill="#8884d8" />
                  <Bar dataKey="questionsAttempted" name="Questions Attempted" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No grade data available. Start practicing different grade levels to see your progress!
              </Typography>
            )}
          </Paper>
        )}

        {/* Performance Trend Chart */}
        {selectedView === 3 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend (Last 14 Days)
            </Typography>
            {performanceTrend.length > 0 && performanceTrend.some(d => d.questions > 0) ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={performanceTrend}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#8884d8" name="Accuracy %" />
                  <Line type="monotone" dataKey="questions" stroke="#82ca9d" name="Questions Attempted" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No trend data available. Practice regularly to see your performance trend!
              </Typography>
            )}
          </Paper>
        )}

        {/* Question History */}
        {selectedView === 4 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Question History
              {selectedSubject !== 'all' && ` - ${selectedSubject}`}
              {selectedGrade !== 'all' && ` - ${selectedGrade}`}
            </Typography>
            {getFilteredData().length > 0 ? (
              <List>
                {getFilteredData().slice(0, 20).map((attempt, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button 
                      onClick={() => handleQuestionClick(attempt)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { 
                          backgroundColor: 'action.hover' 
                        },
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        {attempt.isCorrect ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">
                              {attempt.subject} - Grade {attempt.grade}
                            </Typography>
                            <Chip 
                              label={attempt.difficulty} 
                              size="small" 
                              color={
                                attempt.difficulty.toLowerCase() === 'easy' ? 'success' :
                                attempt.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error'
                              }
                            />
                            <Chip 
                              label={attempt.isCorrect ? 'Correct' : 'Incorrect'} 
                              size="small" 
                              color={attempt.isCorrect ? 'success' : 'error'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {attempt.content ? attempt.content.substring(0, 100) + '...' : 'Question content not available'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(attempt.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentAttempts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No question history available. Start practicing to build your question history!
              </Typography>
            )}
          </Paper>
        )}

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity Summary
            {selectedSubject !== 'all' && ` - ${selectedSubject}`}
            {selectedGrade !== 'all' && ` - ${selectedGrade}`}
          </Typography>
          {getFilteredSubjectData().length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {getFilteredSubjectData().slice(0, 4).map((subject, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      {subject.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subject.attempted} questions attempted • {subject.correct} correct
                    </Typography>
                  </Box>
                  <Chip
                    label={`${subject.percentage}% correct`}
                    color={subject.percentage > 70 ? "success" : subject.percentage > 50 ? "warning" : "error"}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No recent activity. Start practicing to see your activity here!
            </Typography>
          )}
        </Paper>

        {/* Enhanced Question Details Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { minHeight: '400px' }
          }}
        >
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Question Details</Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedQuestion && (
              <Box>
                {/* Question Content */}
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  {selectedQuestion.content || `Question ${selectedQuestion.questionId}`}
                </Typography>
                
                {/* Question Metadata */}
                <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label={`Subject: ${selectedQuestion.subject}`} color="primary" />
                  <Chip label={`Grade: ${selectedQuestion.grade}`} color="info" />
                  <Chip 
                    label={`Difficulty: ${selectedQuestion.difficulty}`} 
                    color={
                      selectedQuestion.difficulty.toLowerCase() === 'easy' ? 'success' :
                      selectedQuestion.difficulty.toLowerCase() === 'medium' ? 'warning' : 'error'
                    }
                  />
                  <Chip 
                    label={selectedQuestion.isCorrect ? 'Correct' : 'Incorrect'} 
                    color={selectedQuestion.isCorrect ? 'success' : 'error'}
                  />
                </Box>
                
                {/* Options and Answers */}
                <Box sx={{ my: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Answer Options:
                  </Typography>
                  {selectedQuestion.options && selectedQuestion.options.length > 0 ? (
                    <RadioGroup value={selectedQuestion.correctAnswer}>
                      {selectedQuestion.options.map((option: string, index: number) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={
                            <Radio 
                              color={option === selectedQuestion.correctAnswer ? "success" : 
                                    (option === selectedQuestion.userAnswer && option !== selectedQuestion.correctAnswer) ? "error" : "default"}
                              checked={option === selectedQuestion.correctAnswer || option === selectedQuestion.userAnswer}
                              disabled
                            />
                          }
                          label={
                            <Box component="span" sx={{ 
                              color: option === selectedQuestion.correctAnswer ? "success.main" : 
                                    (option === selectedQuestion.userAnswer && option !== selectedQuestion.correctAnswer) ? "error.main" : "text.primary",
                              fontWeight: option === selectedQuestion.correctAnswer || option === selectedQuestion.userAnswer ? 'bold' : 'normal'
                            }}>
                              {option}
                              {option === selectedQuestion.correctAnswer && " ✓ (Correct Answer)"}
                              {option === selectedQuestion.userAnswer && option !== selectedQuestion.correctAnswer && " ✗ (Your Answer)"}
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                  ) : (
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Your answer:</strong> {selectedQuestion.userAnswer}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'success.main' }}>
                        <strong>Correct answer:</strong> {selectedQuestion.correctAnswer}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Explanation */}
                {selectedQuestion.explanation && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'info.dark' }}>
                      💡 Explanation:
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'info.dark' }}>
                      {selectedQuestion.explanation}
                    </Typography>
                  </Box>
                )}
                
                {/* Timestamp */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Typography variant="caption" color="text.secondary">
                    Attempted on: {new Date(selectedQuestion.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
