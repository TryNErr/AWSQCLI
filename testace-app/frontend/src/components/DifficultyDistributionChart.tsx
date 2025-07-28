import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { DifficultyLevel } from '../types';

interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

interface Props {
  stats: DifficultyStats;
  title?: string;
}

const DifficultyDistributionChart: React.FC<Props> = ({ stats, title }) => {
  const getColorForDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#000000';
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      {Object.entries(stats).map(([difficulty, value]) => {
        if (difficulty === 'total') return null;
        
        const percentage = stats.total > 0 ? (value / stats.total) * 100 : 0;
        
        return (
          <Box key={difficulty} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {difficulty}
              </Typography>
              <Typography variant="body2">
                {Math.round(percentage)}% ({value}/{stats.total})
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColorForDifficulty(difficulty)
                }
              }}
            />
          </Box>
        );
      })}
    </Paper>
  );
};

export default DifficultyDistributionChart;
