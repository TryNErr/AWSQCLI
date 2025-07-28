import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TrendData {
  date: string;
  accuracy: number;
  avgTime: number;
}

interface Props {
  data: TrendData[];
  title: string;
}

const PerformanceTrendChart: React.FC<Props> = ({ data, title }) => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="accuracy"
            stroke="#8884d8"
            name="Accuracy (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgTime"
            stroke="#82ca9d"
            name="Avg Time (s)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PerformanceTrendChart;
