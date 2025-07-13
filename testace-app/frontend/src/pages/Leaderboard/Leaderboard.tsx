import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { EmojiEvents, TrendingUp, Person } from '@mui/icons-material';

const Leaderboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const leaderboardData = [
    { rank: 1, username: 'MathWiz2024', score: 2450, streak: 15, accuracy: 92 },
    { rank: 2, username: 'ScienceGuru', score: 2380, streak: 12, accuracy: 89 },
    { rank: 3, username: 'QuizMaster', score: 2290, streak: 8, accuracy: 87 },
    { rank: 4, username: 'BrainPower', score: 2150, streak: 10, accuracy: 85 },
    { rank: 5, username: 'StudyBuddy', score: 2050, streak: 6, accuracy: 83 },
    { rank: 6, username: 'TestAce', score: 1980, streak: 5, accuracy: 80 },
    { rank: 7, username: 'QuickLearner', score: 1920, streak: 4, accuracy: 78 },
    { rank: 8, username: 'SmartCookie', score: 1850, streak: 7, accuracy: 82 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: '#FFD700' }} />;
      case 2:
        return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
      case 3:
        return <EmojiEvents sx={{ color: '#CD7F32' }} />;
      default:
        return <Person />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return 'transparent';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Leaderboard
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Overall" />
            <Tab label="This Week" />
            <Tab label="This Month" />
          </Tabs>
        </Box>

        {/* Top 3 Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
          {leaderboardData.slice(0, 3).map((user) => (
            <Card 
              key={user.rank}
              sx={{ 
                minWidth: 200,
                backgroundColor: getRankColor(user.rank),
                backgroundImage: user.rank <= 3 ? 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%)' : 'none'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {getRankIcon(user.rank)}
                </Box>
                <Typography variant="h6" gutterBottom>
                  #{user.rank}
                </Typography>
                <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
                  {user.username.charAt(0)}
                </Avatar>
                <Typography variant="body1" gutterBottom>
                  {user.username}
                </Typography>
                <Typography variant="h6" color="primary">
                  {user.score} pts
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`${user.streak} day streak`} 
                    size="small" 
                    color="secondary"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Full Leaderboard Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Streak</TableCell>
                <TableCell align="right">Accuracy</TableCell>
                <TableCell align="right">Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow 
                  key={user.rank}
                  sx={{ 
                    backgroundColor: user.username === 'TestAce' ? 'action.hover' : 'inherit',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRankIcon(user.rank)}
                      <Typography variant="h6">
                        #{user.rank}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {user.username.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {user.username}
                          {user.username === 'TestAce' && (
                            <Chip label="You" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold">
                      {user.score}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${user.streak} days`}
                      size="small"
                      color={user.streak >= 10 ? 'success' : user.streak >= 5 ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {user.accuracy}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <TrendingUp color="success" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Leaderboard;
