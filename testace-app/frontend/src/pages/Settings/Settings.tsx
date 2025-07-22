import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography>Settings content will go here</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings;
