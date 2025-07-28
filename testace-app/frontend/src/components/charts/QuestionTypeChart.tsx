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

interface QuestionTypeData {
  type: string;
  correct: number;
  incorrect: number;
  skipped: number;
}

interface Props {
  data: QuestionTypeData[];
  title: string;
}

const QuestionTypeChart: React.FC<Props> = ({ data, title }) => {
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
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="correct" stackId="a" fill="#4caf50" name="Correct" />
          <Bar dataKey="incorrect" stackId="a" fill="#f44336" name="Incorrect" />
          <Bar dataKey="skipped" stackId="a" fill="#9e9e9e" name="Skipped" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuestionTypeChart;
