import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import { Edit, Save, Cancel, Person, School, TrendingUp } from '@mui/icons-material';

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'TestAce',
    email: 'testace@example.com',
    firstName: 'John',
    lastName: 'Doe',
    grade: '12th Grade',
    subjects: ['Math', 'Science', 'History'],
    targetTests: ['SAT', 'AP Physics']
  });

  const stats = {
    totalQuestions: 150,
    correctAnswers: 120,
    accuracy: 80,
    currentStreak: 5,
    longestStreak: 12,
    totalTime: 3600 // in minutes
  };

  const achievements = [
    { name: 'First Steps', description: 'Completed your first question', earned: true },
    { name: 'Week Warrior', description: 'Maintained a 7-day streak', earned: true },
    { name: 'Math Master', description: 'Scored 90%+ in Math category', earned: false },
    { name: 'Speed Demon', description: 'Answered 10 questions in under 5 minutes', earned: true },
    { name: 'Perfectionist', description: 'Got 100% on a practice test', earned: false }
  ];

  const handleSave = () => {
    // Save profile changes
    setEditing(false);
  };

  const handleCancel = () => {
    // Reset changes
    setEditing(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </Avatar>
                
                {editing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      size="small"
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                    <TextField
                      size="small"
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                    <TextField
                      size="small"
                      label="Email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                    <TextField
                      size="small"
                      label="Grade"
                      value={profile.grade}
                      onChange={(e) => setProfile({...profile, grade: e.target.value})}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={handleSave}
                        startIcon={<Save />}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={handleCancel}
                        startIcon={<Cancel />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      @{profile.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.grade}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => setEditing(true)}
                      startIcon={<Edit />}
                      sx={{ mt: 2 }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Subjects & Tests */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Subjects
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profile.subjects.map((subject) => (
                    <Chip key={subject} label={subject} color="primary" size="small" />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Target Tests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.targetTests.map((test) => (
                    <Chip key={test} label={test} color="secondary" size="small" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats & Progress */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Statistics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {stats.totalQuestions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Questions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {stats.accuracy}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accuracy
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {stats.currentStreak}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main">
                        {Math.floor(stats.totalTime / 60)}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Study Time
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Subject Progress
                </Typography>
                {[
                  { subject: 'Math', progress: 85, questions: 50 },
                  { subject: 'Science', progress: 72, questions: 40 },
                  { subject: 'History', progress: 68, questions: 35 },
                  { subject: 'Geography', progress: 45, questions: 25 }
                ].map((item) => (
                  <Box key={item.subject} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {item.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.progress}% ({item.questions} questions)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Achievements
                </Typography>
                <Grid container spacing={2}>
                  {achievements.map((achievement, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          border: '1px solid',
                          borderColor: achievement.earned ? 'success.main' : 'grey.300',
                          borderRadius: 1,
                          opacity: achievement.earned ? 1 : 0.6,
                          backgroundColor: achievement.earned ? 'success.light' : 'grey.50'
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold">
                          {achievement.name}
                          {achievement.earned && ' ✓'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
