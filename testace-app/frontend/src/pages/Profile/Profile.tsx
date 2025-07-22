import React, { useState } from 'react';
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
} from 'recharts';
import { School, Timer, TrendingUp } from '@mui/icons-material';

// Interface for performance data
interface SubjectPerformance {
  subject: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
  correct: number;
  attempted: number;
}

interface GradePerformance {
  grade: string;
  performance: number;
  questionsAttempted: number;
}

// Mock data - Replace with actual data from your storage
const mockSubjectData: SubjectPerformance[] = [
  {
    subject: 'Math',
    easy: 85,
    medium: 75,
    hard: 60,
    total: 100,
    correct: 75,
    attempted: 90
  },
  {
    subject: 'English',
    easy: 90,
    medium: 80,
    hard: 70,
    total: 80,
    correct: 65,
    attempted: 75
  },
  {
    subject: 'Thinking Skills',
    easy: 95,
    medium: 85,
    hard: 75,
    total: 120,
    correct: 100,
    attempted: 110
  },
  {
    subject: 'Mathematical Reasoning',
    easy: 88,
    medium: 78,
    hard: 68,
    total: 90,
    correct: 70,
    attempted: 85
  }
];

const mockGradeData: GradePerformance[] = [
  { grade: 'Grade 1', performance: 85, questionsAttempted: 50 },
  { grade: 'Grade 2', performance: 82, questionsAttempted: 45 },
  { grade: 'Grade 3', performance: 78, questionsAttempted: 60 },
  { grade: 'Grade 4', performance: 88, questionsAttempted: 55 },
  { grade: 'Grade 5', performance: 92, questionsAttempted: 70 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Profile: React.FC = () => {
  const [selectedView, setSelectedView] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const handleViewChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedView(newValue);
  };

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
  };

  // Calculate overall statistics
  const overallStats = {
    totalQuestions: mockSubjectData.reduce((acc, curr) => acc + curr.total, 0),
    correctAnswers: mockSubjectData.reduce((acc, curr) => acc + curr.correct, 0),
    questionsAttempted: mockSubjectData.reduce((acc, curr) => acc + curr.attempted, 0),
    averageScore: Math.round(
      mockSubjectData.reduce((acc, curr) => acc + (curr.correct / curr.attempted) * 100, 0) / 
      mockSubjectData.length
    )
  };

  // Prepare data for difficulty distribution pie chart
  const difficultyDistribution = [
    { name: 'Easy', value: mockSubjectData.reduce((acc, curr) => acc + curr.easy, 0) / mockSubjectData.length },
    { name: 'Medium', value: mockSubjectData.reduce((acc, curr) => acc + curr.medium, 0) / mockSubjectData.length },
    { name: 'Hard', value: mockSubjectData.reduce((acc, curr) => acc + curr.hard, 0) / mockSubjectData.length }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Progress
        </Typography>

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
              {mockSubjectData.map(subject => (
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
              {mockGradeData.map(grade => (
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
          </Tabs>
        </Box>

        {/* Performance by Subject Chart */}
        {selectedView === 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Performance by Subject
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={mockSubjectData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="easy" name="Easy" fill="#82ca9d" />
                <Bar dataKey="medium" name="Medium" fill="#8884d8" />
                <Bar dataKey="hard" name="Hard" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {/* Difficulty Distribution Chart */}
        {selectedView === 1 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Difficulty Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {/* Grade Progress Chart */}
        {selectedView === 2 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Grade Progress
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={mockGradeData}
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
          </Paper>
        )}

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mockSubjectData.slice(0, 3).map((subject, index) => (
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
                    {subject.attempted} questions attempted
                  </Typography>
                </Box>
                <Chip
                  label={`${Math.round((subject.correct / subject.attempted) * 100)}% correct`}
                  color={(subject.correct / subject.attempted) > 0.7 ? "success" : "warning"}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
