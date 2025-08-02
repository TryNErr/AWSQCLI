import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid
} from '@mui/material';
import { School, AutoAwesome, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUserStats } = useAuth();

  useEffect(() => {
    // Refresh stats when practice page loads
    refreshUserStats();
  }, [refreshUserStats]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <AutoAwesome sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Enhanced Practice Mode
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Experience our advanced question system with 300%+ more variety
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.8 }}>
            Our Enhanced Practice Mode features Australian curriculum-aligned questions, 
            NAPLAN-style literacy tests, comprehensive mathematics coverage, and adaptive 
            difficulty scaling for optimal learning outcomes.
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Australian Curriculum Aligned
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Questions designed to match Australian educational standards and NAPLAN assessment formats
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <AutoAwesome sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Enhanced Variety
              </Typography>
              <Typography variant="body2" color="text.secondary">
                300%+ more question types including algebra, geometry, literacy, grammar, and mathematical reasoning
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Adaptive Difficulty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Grade-appropriate complexity scaling from Foundation to Year 12 with professional-quality explanations
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Action */}
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Jump into our enhanced practice mode and experience the difference
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => navigate('/practice/enhanced')}
            startIcon={<School />}
            sx={{ 
              minWidth: 250,
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            Start Enhanced Practice
          </Button>
        </Paper>

        {/* Benefits */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            What Makes Enhanced Practice Special?
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  mr: 2 
                }} />
                <Typography variant="body2">
                  NAPLAN-style literacy questions with Australian themes
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  mr: 2 
                }} />
                <Typography variant="body2">
                  Comprehensive mathematics covering all curriculum strands
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  mr: 2 
                }} />
                <Typography variant="body2">
                  Mathematical reasoning and critical thinking questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'secondary.main', 
                  mr: 2 
                }} />
                <Typography variant="body2">
                  Grade-appropriate complexity for all levels (1-12)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'secondary.main', 
                  mr: 2 
                }} />
                <Typography variant="body2">
                  Professional-quality explanations for every question
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'secondary.main', 
                  mr: 2 
                }} />
                <Typography variant="body2">
                  Real-time progress tracking and performance analytics
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Practice;
