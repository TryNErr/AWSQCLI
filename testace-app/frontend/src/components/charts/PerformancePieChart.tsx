import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: PieChartData[];
  title: string;
}

const PerformancePieChart: React.FC<Props> = ({ data, title }) => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${Math.round(value)}%`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PerformancePieChart;
