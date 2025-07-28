import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DifficultyDistributionChartProps } from './types';

const DifficultyDistributionChart: React.FC<DifficultyDistributionChartProps> = ({ stats, title }) => {
  const data = [
    {
      name: 'Easy',
      percentage: (stats.easy / stats.total) * 100,
      count: stats.easy
    },
    {
      name: 'Medium',
      percentage: (stats.medium / stats.total) * 100,
      count: stats.medium
    },
    {
      name: 'Hard',
      percentage: (stats.hard / stats.total) * 100,
      count: stats.hard
    }
  ];

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            label={{ value: 'Count', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'percentage') return `${Math.round(value)}%`;
              return value;
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="percentage"
            fill="#8884d8"
            name="Percentage"
          />
          <Bar
            yAxisId="right"
            dataKey="count"
            fill="#82ca9d"
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DifficultyDistributionChart;
