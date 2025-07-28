export interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TrendDataPoint {
  date: string;
  accuracy: number;
  avgTime: number;
}

export interface SkillDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface QuestionTypeDataPoint {
  type: string;
  correct: number;
  incorrect: number;
  skipped: number;
}

export interface TimeDistributionDataPoint {
  timeRange: string;
  count: number;
}

export interface BaseChartProps {
  title: string;
}

export interface DifficultyDistributionChartProps extends BaseChartProps {
  stats: DifficultyStats;
}

export interface PerformancePieChartProps extends BaseChartProps {
  data: ChartDataPoint[];
}

export interface PerformanceTrendChartProps extends BaseChartProps {
  data: TrendDataPoint[];
}

export interface SkillRadarChartProps extends BaseChartProps {
  data: SkillDataPoint[];
}

export interface QuestionTypeChartProps extends BaseChartProps {
  data: QuestionTypeDataPoint[];
}

export interface TimeDistributionChartProps extends BaseChartProps {
  data: TimeDistributionDataPoint[];
}
