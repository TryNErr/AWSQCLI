import { Question } from '../../types';
import { grade1to3Questions } from './questionData/grade1to3';
import { grade4to6Questions } from './questionData/grade4to6';
import { grade7to9Questions } from './questionData/grade7to9';
import { grade10to12Questions } from './questionData/grade10to12';
import { 
  additionalEasyQuestions, 
  additionalMediumQuestions, 
  additionalHardQuestions 
} from './questionData/additionalQuestions';
import {
  thinkingSkillsQuestions,
  grade1ThinkingSkillsQuestions,
  grade2ThinkingSkillsQuestions,
  grade3ThinkingSkillsQuestions,
  grade4ThinkingSkillsQuestions,
  grade5ThinkingSkillsQuestions,
  grade6ThinkingSkillsQuestions,
  grade7ThinkingSkillsQuestions,
  grade8ThinkingSkillsQuestions,
  grade9ThinkingSkillsQuestions,
  grade10ThinkingSkillsQuestions,
  grade11ThinkingSkillsQuestions,
  grade12ThinkingSkillsQuestions
} from './questionData/thinkingSkills';

// Helper function to safely spread arrays that might be undefined
const safeSpread = <T>(arr: T[] | undefined): T[] => arr || [];

// Combine all question sets
export const questionData: Question[] = [
  ...safeSpread(grade1to3Questions),
  ...safeSpread(grade4to6Questions),
  ...safeSpread(grade7to9Questions),
  ...safeSpread(grade10to12Questions),
  ...safeSpread(additionalEasyQuestions),
  ...safeSpread(additionalMediumQuestions),
  ...safeSpread(additionalHardQuestions),
  ...safeSpread(grade1ThinkingSkillsQuestions),
  ...safeSpread(grade2ThinkingSkillsQuestions),
  ...safeSpread(grade3ThinkingSkillsQuestions),
  ...safeSpread(grade4ThinkingSkillsQuestions),
  ...safeSpread(grade5ThinkingSkillsQuestions),
  ...safeSpread(grade6ThinkingSkillsQuestions),
  ...safeSpread(grade7ThinkingSkillsQuestions),
  ...safeSpread(grade8ThinkingSkillsQuestions),
  ...safeSpread(grade9ThinkingSkillsQuestions),
  ...safeSpread(grade10ThinkingSkillsQuestions),
  ...safeSpread(grade11ThinkingSkillsQuestions),
  ...safeSpread(grade12ThinkingSkillsQuestions),
  ...safeSpread(thinkingSkillsQuestions)
];
