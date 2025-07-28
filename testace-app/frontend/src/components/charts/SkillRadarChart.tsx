import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface SkillData {
  subject: string;
  value: number;
  fullMark: number;
}

interface Props {
  data: SkillData[];
  title: string;
}

const SkillRadarChart: React.FC<Props> = ({ data, title }) => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SkillRadarChart;
