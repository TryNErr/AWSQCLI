import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { CheckCircle, Cancel, ArrowBack, Timeline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getQuestionAttempts, 
  getQuestionStats, 
  QuestionAttempt,
  getPerformanceTrend,
  getSubjectPerformance,
  getDifficultyPerformance
} from '../../services/questionHistoryService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const QuestionHistory: React.FC = () => {
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [performanceTrend, setPerformanceTrend] = useState<any[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<any[]>([]);
  const [difficultyPerformance, setDifficultyPerformance] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, [selectedSubject, selectedDifficulty]);

  const loadHistory = () => {
    setLoading(true);
    try {
      // Get all attempts
      let filteredAttempts = getQuestionAttempts();

      // Apply filters
      if (selectedSubject !== 'all') {
        filteredAttempts = filteredAttempts.filter(attempt => attempt.subject === selectedSubject);
      }
      if (selectedDifficulty !== 'all') {
        filteredAttempts = filteredAttempts.filter(attempt => attempt.difficulty === selectedDifficulty);
      }

      // Sort by timestamp (most recent first)
      filteredAttempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setAttempts(filteredAttempts);
      
      // Load performance data
      setPerformanceTrend(getPerformanceTrend(7));
      setSubjectPerformance(getSubjectPerformance());
      setDifficultyPerformance(getDifficultyPerformance());
    } catch (error) {
      console.error('Error loading question history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
    setPage(0);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value);
    setPage(0);
  };

  const stats = getQuestionStats();
  const subjects = Array.from(new Set(attempts.map(a => a.subject)));
  const difficulties = Array.from(new Set(attempts.map(a => a.difficulty)));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/practice')}
            sx={{ mr: 2 }}
          >
            Back to Practice
          </Button>
          <Typography variant="h4" component="h1">
            Question History
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Questions
                </Typography>
                <Typography variant="h4">
                  {stats.total}
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
                  {stats.correct}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Accuracy
                </Typography>
                <Typography variant="h4">
                  {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Recent Performance
                </Typography>
                <Typography variant="h4">
                  {performanceTrend.length > 0 
                    ? Math.round((performanceTrend[performanceTrend.length - 1].correct / 
                                Math.max(1, performanceTrend[performanceTrend.length - 1].total)) * 100)
                    : 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Performance Trend */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="correct" stroke="#8884d8" name="Correct" />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Subject Performance */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Subject Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectPerformance}
                    dataKey="correct"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {subjectPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Difficulty Performance */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance by Difficulty
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="correct" name="Correct" fill="#8884d8" />
                  <Bar dataKey="total" name="Total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ mb: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {attempts.slice(0, 5).map((attempt, index) => (
              <ListItem key={index} divider={index < 4}>
                <ListItemIcon>
                  {attempt.isCorrect ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`Question ${attempt.questionId}`}
                  secondary={`${attempt.subject} - ${attempt.difficulty} - ${new Date(attempt.timestamp).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={handleSubjectChange}
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {subjects.map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
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
              <MenuItem value="all">All Levels</MenuItem>
              {difficulties.map(difficulty => (
                <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Question History Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Your Answer</TableCell>
                  <TableCell>Correct Answer</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attempts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((attempt, index) => (
                    <TableRow key={index}>
                      <TableCell>Question {attempt.questionId}</TableCell>
                      <TableCell>{attempt.subject}</TableCell>
                      <TableCell>
                        <Chip
                          label={attempt.difficulty}
                          color={
                            attempt.difficulty === 'EASY' ? 'success' :
                            attempt.difficulty === 'MEDIUM' ? 'warning' :
                            'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{attempt.userAnswer}</TableCell>
                      <TableCell>{attempt.correctAnswer}</TableCell>
                      <TableCell>
                        {attempt.isCorrect ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={attempts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default QuestionHistory;
