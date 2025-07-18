import { Question, DifficultyLevel, QuestionType } from '../../types';
import { grade1to3Questions } from './questionData/grade1to3';
import { grade4to6Questions } from './questionData/grade4to6';
import { grade7to9Questions } from './questionData/grade7to9';
import { grade10to12Questions } from './questionData/grade10to12';

// Combine all question sets
export const questionData: Question[] = [
  ...grade1to3Questions,
  ...grade4to6Questions,
  ...grade7to9Questions,
  ...grade10to12Questions
];
