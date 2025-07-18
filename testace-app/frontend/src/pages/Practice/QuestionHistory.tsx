import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tab,
  Tabs
} from '@mui/material';
import { ArrowBack, Check, Close, PieChart, BarChart, Timeline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getQuestionAttempts, 
  getQuestionStats, 
  QuestionAttempt 
} from '../../services/questionHistoryService';

// Simple bar chart component
const SimpleBarChart: React.FC<{ 
  data: { label: string; value: number; total: number; color: string }[] 
}> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.total));
  
  return (
    <Box sx={{ mt: 2 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{item.label}</Typography>
            <Typography variant="body2">{item.value}/{item.total} ({Math.round((item.value / item.total) * 100)}%)</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 20, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden' }}>
            <Box 
              sx={{ 
                width: `${(item.total / maxValue) * 100}%`, 
                height: '100%', 
                bgcolor: '#e0e0e0',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  width: `${(item.value / item.total) * 100}%`, 
                  height: '100%', 
                  bgcolor: item.color
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Simple pie chart component
const SimplePieChart: React.FC<{ 
  correct: number;
  incorrect: number;
}> = ({ correct, incorrect }) => {
  const total = correct + incorrect;
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;
  const incorrectPercentage = total > 0 ? (incorrect / total) * 100 : 0;
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
      <Box sx={{ position: 'relative', width: 150, height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#f44336"
            strokeWidth="20"
            strokeDasharray="376.8"
            strokeDashoffset="0"
          />
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#4caf50"
            strokeWidth="20"
            strokeDasharray="376.8"
            strokeDashoffset={376.8 * (1 - correctPercentage / 100)}
            transform="rotate(-90 75 75)"
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {Math.round(correctPercentage)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Correct
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ ml: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', mr: 1, borderRadius: 0.5 }} />
          <Typography variant="body2">Correct: {correct} ({Math.round(correctPercentage)}%)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', mr: 1, borderRadius: 0.5 }} />
          <Typography variant="body2">Incorrect: {incorrect} ({Math.round(incorrectPercentage)}%)</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const QuestionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  
  // Load question history on component mount
  useEffect(() => {
    loadHistory();
  }, [selectedSubject, selectedGrade, selectedDifficulty]);
  
  const loadHistory = () => {
    // Get question attempts with filters
    const filteredAttempts = getQuestionAttempts(
      undefined,
      selectedSubject || undefined,
      selectedGrade || undefined,
      selectedDifficulty || undefined
    );
    setAttempts(filteredAttempts);
    
    // Get question stats
    const questionStats = getQuestionStats();
    setStats(questionStats);
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
  
  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
    setPage(0);
  };
  
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value);
    setPage(0);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Get available subjects, grades, and difficulties from attempts
  const availableSubjects = Array.from(new Set(attempts.map(a => a.subject)));
  const availableGrades = Array.from(new Set(attempts.filter(a => a.grade).map(a => a.grade as string)));
  const availableDifficulties = Array.from(new Set(attempts.map(a => a.difficulty)));
  
  // Prepare data for charts
  const prepareSubjectData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.bySubject).map(([subject, data]: [string, any]) => ({
      label: subject,
      value: data.correct,
      total: data.total,
      color: '#4caf50'
    }));
  };
  
  const prepareGradeData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.byGrade)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([grade, data]: [string, any]) => ({
        label: `Grade ${grade}`,
        value: data.correct,
        total: data.total,
        color: '#2196f3'
      }));
  };
  
  const prepareDifficultyData = () => {
    if (!stats) return [];
    
    const difficultyOrder = ['EASY', 'MEDIUM', 'HARD'];
    
    return Object.entries(stats.byDifficulty)
      .sort(([a], [b]) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b))
      .map(([difficulty, data]: [string, any]) => ({
        label: difficulty.charAt(0) + difficulty.slice(1).toLowerCase(),
        value: data.correct,
        total: data.total,
        color: difficulty === 'EASY' ? '#4caf50' : difficulty === 'MEDIUM' ? '#ff9800' : '#f44336'
      }));
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/practice')}
          sx={{ mb: 2 }}
        >
          Back to Practice
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Question History
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="question history tabs">
            <Tab icon={<Timeline />} label="History" />
            <Tab icon={<PieChart />} label="Overall Stats" />
            <Tab icon={<BarChart />} label="Detailed Stats" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={selectedSubject}
                      label="Subject"
                      onChange={handleSubjectChange}
                    >
                      <MenuItem value="">All Subjects</MenuItem>
                      {availableSubjects.map(subject => (
                        <MenuItem key={subject} value={subject}>{subject}</MenuItem>
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
                      {availableDifficulties.map(difficulty => (
                        <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="question history table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Your Answer</TableCell>
                        <TableCell>Correct Answer</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attempts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((attempt, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
                            {attempt.question}
                          </TableCell>
                          <TableCell>{attempt.subject}</TableCell>
                          <TableCell>{attempt.grade ? `Grade ${attempt.grade}` : '-'}</TableCell>
                          <TableCell>{attempt.difficulty}</TableCell>
                          <TableCell>{attempt.userAnswer}</TableCell>
                          <TableCell>{attempt.correctAnswer}</TableCell>
                          <TableCell>
                            {attempt.isCorrect ? (
                              <Chip icon={<Check />} label="Correct" color="success" size="small" />
                            ) : (
                              <Chip icon={<Close />} label="Incorrect" color="error" size="small" />
                            )}
                          </TableCell>
                          <TableCell>{new Date(attempt.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {attempts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No question history found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={attempts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Performance
                </Typography>
                
                {stats && (
                  <>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h5">
                        Total Questions Attempted: {stats.totalAttempts}
                      </Typography>
                      <Typography variant="body1">
                        Correct: {stats.correctAttempts} ({Math.round((stats.correctAttempts / stats.totalAttempts) * 100)}%)
                      </Typography>
                    </Box>
                    
                    <SimplePieChart 
                      correct={stats.correctAttempts} 
                      incorrect={stats.totalAttempts - stats.correctAttempts} 
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Performance by Subject
                    </Typography>
                    <SimpleBarChart data={prepareSubjectData()} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Performance by Grade
                    </Typography>
                    <SimpleBarChart data={prepareGradeData()} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Performance by Difficulty
                    </Typography>
                    <SimpleBarChart data={prepareDifficultyData()} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionHistory;
