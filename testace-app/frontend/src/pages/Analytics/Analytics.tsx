import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { TrendingUp, Assessment, Timer, CheckCircle } from '@mui/icons-material';

const Analytics: React.FC = () => {
  const stats = {
    totalQuestions: 150,
    correctAnswers: 120,
    accuracy: 80,
    averageTime: 45,
    streak: 5
  };

  const StatCard = ({ title, value, icon, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Questions"
              value={stats.totalQuestions}
              icon={<Assessment />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Correct Answers"
              value={stats.correctAnswers}
              icon={<CheckCircle />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Accuracy"
              value={`${stats.accuracy}%`}
              icon={<TrendingUp />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Time (sec)"
              value={stats.averageTime}
              icon={<Timer />}
              color="warning"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Subject Performance
                </Typography>
                {[
                  { subject: 'Math', accuracy: 85, questions: 50 },
                  { subject: 'Science', accuracy: 78, questions: 40 },
                  { subject: 'History', accuracy: 82, questions: 35 },
                  { subject: 'Geography', accuracy: 75, questions: 25 }
                ].map((item) => (
                  <Box key={item.subject} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {item.subject}
                      </Typography>
                      <Typography variant="body2">
                        {item.accuracy}% ({item.questions} questions)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.accuracy} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { date: 'Today', activity: 'Completed Daily Challenge', score: '4/5' },
                    { date: 'Yesterday', activity: 'Practice Session', score: '8/10' },
                    { date: '2 days ago', activity: 'Timed Test', score: '15/20' },
                    { date: '3 days ago', activity: 'Daily Challenge', score: '5/5' }
                  ].map((item, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Box>
                        <Typography variant="body2">
                          {item.activity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="primary">
                        {item.score}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Analytics;
