import { Question, DifficultyLevel } from '../types';
import { generateEnhancedMathQuestionV2 } from './enhancedMathQuestionGeneratorV2';
import { generateEnhancedEnglishQuestion } from './enhancedEnglishQuestionGenerator';
import { generateEnhancedThinkingSkillsQuestions } from './enhancedThinkingSkillsGenerator';
import { generateEnhancedMathematicalReasoningQuestions } from './enhancedMathematicalReasoningGenerator';
import { generateEnhancedNumeracyQuestions } from './enhancedNumeracyGenerator';
import { generateEnhancedReadingQuestions } from './enhancedReadingGenerator';
import { generateEnhancedLanguageQuestions } from './enhancedLanguageGenerator';
import { NALAPStyleQuestionGenerator } from './australianCurriculumEnhancer';
import { AustralianMathCurriculumGenerator } from './australianMathCurriculumEnhancer';
import { CurriculumExtrapolator } from './curriculumExtrapolator';
import { EnhancedQuestionVarietyGenerator } from './enhancedQuestionVarietyGenerator';
import { fixQuestionDifficulty, validateHighGradeDifficulty } from './questionDifficultyFixer';

// Enhanced Question Generation System
// Integrates all enhanced generators with curriculum-based, challenging questions

interface QuestionGenerationConfig {
  useEnhancedQuestions: boolean;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  subjectWeights: {
    math: number;
    english: number;
    reading: number;
    thinkingSkills: number;
  };
}

// Default configuration for enhanced questions
const defaultConfig: QuestionGenerationConfig = {
  useEnhancedQuestions: true,
  difficultyDistribution: {
    easy: 0.3,    // 30% easy questions
    medium: 0.5,  // 50% medium questions  
    hard: 0.2     // 20% hard questions
  },
  subjectWeights: {
    math: 0.3,           // 30% math questions
    english: 0.3,        // 30% english questions
    reading: 0.2,        // 20% reading questions
    thinkingSkills: 0.2  // 20% thinking skills questions
  }
};

// Grade-specific curriculum standards and expectations
const curriculumStandards: Record<string, any> = {
  "1": {
    math: {
      topics: ["addition_within_20", "subtraction_within_20", "place_value_tens_ones", "measurement_length"],
      cognitiveLoad: "concrete_operational",
      keySkills: ["counting", "basic_arithmetic", "pattern_recognition"]
    },
    english: {
      topics: ["phonics", "sight_words", "simple_sentences", "basic_comprehension"],
      readingLevel: "beginning_reader",
      keySkills: ["decoding", "fluency", "vocabulary_building"]
    },
    thinkingSkills: {
      topics: ["simple_patterns", "classification", "basic_logic"],
      cognitiveStage: "preoperational_to_concrete",
      keySkills: ["observation", "comparison", "simple_reasoning"]
    }
  },
  "2": {
    math: {
      topics: ["addition_subtraction_100", "place_value_hundreds", "measurement_time_money", "basic_geometry"],
      cognitiveLoad: "concrete_operational",
      keySkills: ["mental_math", "problem_solving", "spatial_awareness"]
    },
    english: {
      topics: ["reading_fluency", "comprehension_strategies", "grammar_basics", "writing_sentences"],
      readingLevel: "developing_reader",
      keySkills: ["comprehension", "grammar", "writing_mechanics"]
    },
    thinkingSkills: {
      topics: ["pattern_extension", "logical_sequences", "spatial_relationships"],
      cognitiveStage: "concrete_operational",
      keySkills: ["pattern_recognition", "logical_thinking", "spatial_reasoning"]
    }
  },
  "3": {
    math: {
      topics: ["multiplication_division", "fractions_basic", "area_perimeter", "data_graphs"],
      cognitiveLoad: "concrete_operational_advanced",
      keySkills: ["multiplicative_thinking", "fractional_reasoning", "data_analysis"]
    },
    english: {
      topics: ["reading_comprehension", "vocabulary_expansion", "paragraph_writing", "grammar_rules"],
      readingLevel: "transitional_reader",
      keySkills: ["inference", "vocabulary", "writing_organization"]
    },
    thinkingSkills: {
      topics: ["logical_reasoning", "problem_solving_strategies", "critical_thinking_basics"],
      cognitiveStage: "concrete_to_formal_transition",
      keySkills: ["deductive_reasoning", "strategy_selection", "analysis"]
    }
  },
  "4": {
    math: {
      topics: ["multi_digit_operations", "decimals", "equivalent_fractions", "geometric_properties"],
      cognitiveLoad: "formal_operational_emerging",
      keySkills: ["algorithmic_thinking", "proportional_reasoning", "geometric_reasoning"]
    },
    english: {
      topics: ["literary_analysis", "research_skills", "persuasive_writing", "advanced_grammar"],
      readingLevel: "fluent_reader",
      keySkills: ["analysis", "synthesis", "argumentation"]
    },
    thinkingSkills: {
      topics: ["abstract_reasoning", "hypothesis_testing", "argument_evaluation"],
      cognitiveStage: "formal_operational_developing",
      keySkills: ["abstract_thinking", "hypothesis_formation", "evidence_evaluation"]
    }
  },
  "5": {
    math: {
      topics: ["fraction_operations", "decimal_operations", "algebraic_thinking", "coordinate_geometry"],
      cognitiveLoad: "formal_operational",
      keySkills: ["algebraic_reasoning", "coordinate_systems", "mathematical_modeling"]
    },
    english: {
      topics: ["complex_texts", "literary_devices", "research_writing", "critical_analysis"],
      readingLevel: "advanced_reader",
      keySkills: ["critical_analysis", "synthesis", "academic_writing"]
    },
    thinkingSkills: {
      topics: ["formal_logic", "scientific_reasoning", "philosophical_thinking"],
      cognitiveStage: "formal_operational",
      keySkills: ["formal_reasoning", "scientific_method", "philosophical_inquiry"]
    }
  },
  "6": {
    math: {
      topics: ["ratios_proportions", "integers", "basic_algebra", "statistics_probability"],
      cognitiveLoad: "formal_operational",
      keySkills: ["proportional_reasoning", "negative_numbers", "algebraic_expressions", "data_interpretation"]
    },
    english: {
      topics: ["advanced_literature", "essay_writing", "research_methods", "media_literacy"],
      readingLevel: "proficient_reader",
      keySkills: ["literary_analysis", "argumentative_writing", "source_evaluation"]
    },
    thinkingSkills: {
      topics: ["deductive_reasoning", "scientific_method", "ethical_reasoning"],
      cognitiveStage: "formal_operational",
      keySkills: ["logical_proofs", "experimental_design", "moral_reasoning"]
    }
  },
  "7": {
    math: {
      topics: ["linear_equations", "geometry_proofs", "probability", "exponential_functions"],
      cognitiveLoad: "formal_operational_advanced",
      keySkills: ["equation_solving", "geometric_reasoning", "statistical_analysis", "function_concepts"]
    },
    english: {
      topics: ["classical_literature", "advanced_composition", "rhetoric", "linguistics"],
      readingLevel: "advanced_proficient",
      keySkills: ["textual_analysis", "persuasive_writing", "language_structure"]
    },
    thinkingSkills: {
      topics: ["formal_logic_systems", "philosophical_arguments", "scientific_reasoning"],
      cognitiveStage: "formal_operational_advanced",
      keySkills: ["symbolic_logic", "argument_construction", "hypothesis_testing"]
    }
  },
  "8": {
    math: {
      topics: ["quadratic_equations", "systems_equations", "trigonometry_basics", "advanced_geometry"],
      cognitiveLoad: "formal_operational_advanced",
      keySkills: ["quadratic_reasoning", "system_solving", "trigonometric_ratios", "proof_writing"]
    },
    english: {
      topics: ["world_literature", "advanced_rhetoric", "research_methodology", "creative_writing"],
      readingLevel: "college_prep",
      keySkills: ["comparative_analysis", "advanced_argumentation", "original_composition"]
    },
    thinkingSkills: {
      topics: ["advanced_logic", "epistemology", "research_design"],
      cognitiveStage: "formal_operational_expert",
      keySkills: ["complex_reasoning", "knowledge_evaluation", "methodology_design"]
    }
  },
  "9": {
    math: {
      topics: ["algebra_2", "advanced_functions", "statistics", "mathematical_modeling"],
      cognitiveLoad: "formal_operational_expert",
      keySkills: ["function_analysis", "statistical_inference", "model_construction", "abstract_reasoning"]
    },
    english: {
      topics: ["american_literature", "advanced_composition", "literary_criticism", "public_speaking"],
      readingLevel: "college_level",
      keySkills: ["critical_theory", "advanced_writing", "oral_communication"]
    },
    thinkingSkills: {
      topics: ["symbolic_logic", "philosophy_of_science", "advanced_problem_solving"],
      cognitiveStage: "formal_operational_expert",
      keySkills: ["symbolic_reasoning", "scientific_philosophy", "complex_problem_solving"]
    }
  },
  "10": {
    math: {
      topics: ["precalculus", "trigonometry", "sequences_series", "conic_sections"],
      cognitiveLoad: "formal_operational_expert",
      keySkills: ["advanced_functions", "trigonometric_analysis", "series_convergence", "analytic_geometry"]
    },
    english: {
      topics: ["world_literature", "advanced_rhetoric", "literary_theory", "research_writing"],
      readingLevel: "college_level_advanced",
      keySkills: ["theoretical_analysis", "advanced_research", "scholarly_writing"]
    },
    thinkingSkills: {
      topics: ["formal_systems", "advanced_logic", "philosophical_reasoning"],
      cognitiveStage: "formal_operational_expert",
      keySkills: ["system_analysis", "formal_proofs", "philosophical_argumentation"]
    }
  },
  "11": {
    math: {
      topics: ["calculus_basics", "advanced_statistics", "discrete_mathematics", "mathematical_proofs"],
      cognitiveLoad: "formal_operational_expert",
      keySkills: ["differential_calculus", "statistical_modeling", "discrete_structures", "proof_techniques"]
    },
    english: {
      topics: ["advanced_literature", "scholarly_writing", "linguistics", "comparative_literature"],
      readingLevel: "college_advanced",
      keySkills: ["scholarly_analysis", "academic_writing", "linguistic_analysis"]
    },
    thinkingSkills: {
      topics: ["advanced_formal_logic", "philosophy", "research_methodology"],
      cognitiveStage: "formal_operational_expert",
      keySkills: ["formal_reasoning", "philosophical_analysis", "research_design"]
    }
  },
  "12": {
    math: {
      topics: ["advanced_calculus", "linear_algebra", "probability_theory", "mathematical_analysis"],
      cognitiveLoad: "formal_operational_expert",
      keySkills: ["integral_calculus", "matrix_operations", "probability_distributions", "real_analysis"]
    },
    english: {
      topics: ["college_prep_literature", "advanced_composition", "critical_theory", "independent_research"],
      readingLevel: "college_ready",
      keySkills: ["independent_analysis", "college_writing", "theoretical_frameworks"]
    },
    thinkingSkills: {
      topics: ["advanced_philosophy", "formal_logic_systems", "independent_research"],
      cognitiveStage: "formal_operational_expert",
      keySkills: ["independent_reasoning", "system_construction", "original_research"]
    }
  }
};

// Enhanced question difficulty calibration
class QuestionDifficultyCalibrator {
  
  static calibrateDifficulty(grade: string, subject: string, baseDifficulty: DifficultyLevel): DifficultyLevel {
    const gradeNum = parseInt(grade);
    const standards = curriculumStandards[grade];
    
    if (!standards) return baseDifficulty;
    
    // Adjust difficulty based on grade-specific cognitive development
    const cognitiveStage = standards[subject]?.cognitiveStage || "concrete_operational";
    
    switch (cognitiveStage) {
      case "preoperational_to_concrete":
        // Grades 1-2: Focus on concrete, visual problems
        return baseDifficulty === DifficultyLevel.HARD ? DifficultyLevel.MEDIUM : baseDifficulty;
        
      case "concrete_operational":
        // Grades 2-3: Can handle logical operations with concrete objects
        return baseDifficulty;
        
      case "concrete_to_formal_transition":
        // Grade 3-4: Beginning abstract thinking
        return baseDifficulty;
        
      case "formal_operational_developing":
        // Grade 4: Developing abstract reasoning
        return baseDifficulty;
        
      case "formal_operational":
        // Grade 5+: Full abstract reasoning capabilities
        return baseDifficulty;
        
      default:
        return baseDifficulty;
    }
  }
  
  static getGradeAppropriateTopics(grade: string, subject: string): string[] {
    const standards = curriculumStandards[grade];
    return standards?.[subject]?.topics || [];
  }
  
  static getKeySkills(grade: string, subject: string): string[] {
    const standards = curriculumStandards[grade];
    return standards?.[subject]?.keySkills || [];
  }
}

// Enhanced question generator with curriculum alignment
export class EnhancedQuestionGenerator {
  
  private config: QuestionGenerationConfig;
  
  constructor(config: Partial<QuestionGenerationConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
  
  // Generate a single enhanced question
  generateQuestion(grade: string, subject?: string, difficulty?: DifficultyLevel): Question {
    // Determine subject if not specified
    if (!subject) {
      subject = this.selectSubjectByWeight();
    }
    
    // Determine difficulty if not specified
    if (!difficulty) {
      difficulty = this.selectDifficultyByDistribution();
    }
    
    // Calibrate difficulty based on grade and cognitive development
    const calibratedDifficulty = QuestionDifficultyCalibrator.calibrateDifficulty(grade, subject, difficulty);
    
    // Generate question using appropriate enhanced generator
    let question: Question;
    
    // Check if we should use Australian curriculum-based generators
    const gradeNum = parseInt(grade);
    const useAustralianCurriculum = gradeNum >= 7; // Use for secondary school grades
    const useEnhancedVariety = Math.random() < 0.3; // 30% chance for enhanced variety
    
    // Use enhanced variety generator for more diverse questions
    if (useEnhancedVariety) {
      question = EnhancedQuestionVarietyGenerator.generateVariedQuestion(grade, subject, calibratedDifficulty);
    } else {
      switch (subject.toLowerCase()) {
        case 'math':
        case 'mathematics':
        case 'numeracy':
          // Use enhanced numeracy generator for NAPLAN-style questions
          const numeracyQuestions = generateEnhancedNumeracyQuestions(grade, calibratedDifficulty, 1);
          question = numeracyQuestions[0];
          break;
          
        case 'english':
        case 'language arts':
        case 'ela':
        case 'language':
        case 'language conventions':
          // Use enhanced language generator for grammar, spelling, etc.
          const languageQuestions = generateEnhancedLanguageQuestions(grade, calibratedDifficulty, 1);
          question = languageQuestions[0];
          break;
          
        case 'reading':
        case 'reading comprehension':
        case 'comprehension':
          // Use enhanced reading generator for comprehension questions
          const readingQuestions = generateEnhancedReadingQuestions(grade, calibratedDifficulty, 1);
          question = readingQuestions[0];
          break;
          
        case 'literacy':
          if (useAustralianCurriculum) {
            question = NALAPStyleQuestionGenerator.generateLiteracyQuestion(grade, calibratedDifficulty);
          } else {
            // Use reading generator for literacy
            const literacyQuestions = generateEnhancedReadingQuestions(grade, calibratedDifficulty, 1);
            question = literacyQuestions[0];
          }
          break;
          
        case 'thinking skills':
        case 'critical thinking':
        case 'logic':
          // Use the enhanced thinking skills generator
          const thinkingSkillsQuestions = generateEnhancedThinkingSkillsQuestions(grade, calibratedDifficulty, 1);
          question = thinkingSkillsQuestions[0];
          break;
          
        case 'mathematical reasoning':
        case 'math reasoning':
        case 'reasoning':
          const mathReasoningQuestions = generateEnhancedMathematicalReasoningQuestions(grade, calibratedDifficulty, 1);
          question = mathReasoningQuestions[0];
          break;
          
        default:
          // Default to curriculum-aligned generation
          if (useAustralianCurriculum) {
            question = AustralianMathCurriculumGenerator.generateMathQuestion(grade, calibratedDifficulty);
          } else {
            question = CurriculumExtrapolator.generateCurriculumAlignedQuestion(grade, 'mathematics', calibratedDifficulty);
          }
      }
    }
    
    // Add curriculum alignment metadata
    question.tags = [
      ...(question.tags || []),
      `grade-${grade}`,
      `curriculum-aligned`,
      ...QuestionDifficultyCalibrator.getKeySkills(grade, subject)
    ];
    
    // Fix question difficulty if it's incorrectly classified
    question = fixQuestionDifficulty(question);
    
    // Validate Grade 9+ and 10+ difficulty appropriateness
    if (!validateHighGradeDifficulty(question)) {
      console.warn(`Difficulty validation failed for Grade ${grade} question: "${question.content}"`);
      // Force correction for high grade simple operations
      if (parseInt(grade) >= 9 && question.difficulty === DifficultyLevel.HARD) {
        const content = question.content.toLowerCase();
        
        // Comprehensive patterns for inappropriate Hard questions
        const inappropriatePatterns = [
          /^\d+\.?\d*\s*[+\-×÷*\/]\s*\d+\.?\d*$/, // Simple arithmetic
          /^\d+\/\d+\s*[+\-]\s*\d+\/\d+$/, // Simple fractions like "1/12 + 10/12"
          /there are \d+.*and \d+.*how many.*total/i, // Simple word problems
          /\d+ dogs and \d+ cats.*how many animals/i, // Pet store type problems
          /what is \d+.*[+\-×÷*\/].*\d+/i, // Basic "what is" questions
        ];
        
        if (inappropriatePatterns.some(pattern => pattern.test(content))) {
          question.difficulty = DifficultyLevel.EASY;
          question.tags = [...(question.tags || []), 'high-grade-corrected', `grade-${grade}-fixed`];
          console.log(`🔧 Auto-corrected Grade ${grade} question to Easy: "${question.content}"`);
        }
      }
    }
    
    return question;
  }
  
  // Generate a set of questions for a complete assessment
  generateAssessment(grade: string, questionCount: number = 20): Question[] {
    const questions: Question[] = [];
    
    for (let i = 0; i < questionCount; i++) {
      const question = this.generateQuestion(grade);
      questions.push(question);
    }
    
    return this.balanceAssessment(questions, grade);
  }
  
  // Generate questions for specific learning objectives
  generateTargetedQuestions(grade: string, learningObjectives: string[], count: number = 10): Question[] {
    const questions: Question[] = [];
    
    // Map learning objectives to subjects and difficulties
    const objectiveMapping = this.mapObjectivesToSubjects(learningObjectives);
    
    for (let i = 0; i < count; i++) {
      const objective = learningObjectives[i % learningObjectives.length];
      const mapping = objectiveMapping[objective];
      
      if (mapping) {
        const question = this.generateQuestion(grade, mapping.subject, mapping.difficulty);
        if (!question.tags) question.tags = [];
        question.tags.push(`objective-${objective.replace(/\s+/g, '-').toLowerCase()}`);
        questions.push(question);
      }
    }
    
    return questions;
  }
  
  // Private helper methods
  private selectSubjectByWeight(): string {
    const random = Math.random();
    const weights = this.config.subjectWeights;
    
    if (random < weights.math) return 'math';
    if (random < weights.math + weights.english) return 'english';
    if (random < weights.math + weights.english + weights.reading) return 'reading';
    return 'thinking skills';
  }
  
  private selectDifficultyByDistribution(): DifficultyLevel {
    const random = Math.random();
    const dist = this.config.difficultyDistribution;
    
    if (random < dist.easy) return DifficultyLevel.EASY;
    if (random < dist.easy + dist.medium) return DifficultyLevel.MEDIUM;
    return DifficultyLevel.HARD;
  }
  
  private balanceAssessment(questions: Question[], grade: string): Question[] {
    // Ensure proper distribution of subjects and difficulties
    const subjectCounts = { math: 0, english: 0, thinkingSkills: 0 };
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    
    questions.forEach(q => {
      if (q.subject.toLowerCase().includes('math')) subjectCounts.math++;
      else if (q.subject.toLowerCase().includes('english')) subjectCounts.english++;
      else subjectCounts.thinkingSkills++;
      
      difficultyCounts[q.difficulty.toLowerCase() as keyof typeof difficultyCounts]++;
    });
    
    // Add additional questions if needed to balance
    const totalQuestions = questions.length;
    const targetMath = Math.floor(totalQuestions * this.config.subjectWeights.math);
    const targetEnglish = Math.floor(totalQuestions * this.config.subjectWeights.english);
    
    // Balance subjects if needed
    while (subjectCounts.math < targetMath) {
      questions.push(this.generateQuestion(grade, 'math'));
      subjectCounts.math++;
    }
    
    while (subjectCounts.english < targetEnglish) {
      questions.push(this.generateQuestion(grade, 'english'));
      subjectCounts.english++;
    }
    
    return questions.slice(0, totalQuestions); // Maintain original count
  }
  
  private mapObjectivesToSubjects(objectives: string[]): Record<string, { subject: string; difficulty: DifficultyLevel }> {
    const mapping: Record<string, { subject: string; difficulty: DifficultyLevel }> = {};
    
    objectives.forEach(objective => {
      const lower = objective.toLowerCase();
      
      if (lower.includes('math') || lower.includes('arithmetic') || lower.includes('algebra')) {
        mapping[objective] = { subject: 'math', difficulty: DifficultyLevel.MEDIUM };
      } else if (lower.includes('reading') || lower.includes('writing') || lower.includes('grammar')) {
        mapping[objective] = { subject: 'english', difficulty: DifficultyLevel.MEDIUM };
      } else if (lower.includes('logic') || lower.includes('reasoning') || lower.includes('critical')) {
        mapping[objective] = { subject: 'thinking skills', difficulty: DifficultyLevel.MEDIUM };
      } else {
        // Default mapping
        mapping[objective] = { subject: 'math', difficulty: DifficultyLevel.MEDIUM };
      }
    });
    
    return mapping;
  }
}

// Export convenience functions
export const generateEnhancedQuestion = (grade: string, subject?: string, difficulty?: DifficultyLevel): Question => {
  const generator = new EnhancedQuestionGenerator();
  return generator.generateQuestion(grade, subject, difficulty);
};

export const generateEnhancedAssessment = (grade: string, questionCount: number = 20): Question[] => {
  const generator = new EnhancedQuestionGenerator();
  return generator.generateAssessment(grade, questionCount);
};

export const generateTargetedAssessment = (grade: string, objectives: string[], count: number = 10): Question[] => {
  const generator = new EnhancedQuestionGenerator();
  return generator.generateTargetedQuestions(grade, objectives, count);
};

// Configuration for different educational contexts
export const educationalConfigs = {
  // Standard curriculum (balanced approach)
  standard: {
    useEnhancedQuestions: true,
    difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
    subjectWeights: { math: 0.4, english: 0.4, thinkingSkills: 0.2 }
  },
  
  // STEM-focused curriculum
  stem: {
    useEnhancedQuestions: true,
    difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
    subjectWeights: { math: 0.6, english: 0.2, thinkingSkills: 0.2 }
  },
  
  // Liberal arts focused
  liberalArts: {
    useEnhancedQuestions: true,
    difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
    subjectWeights: { math: 0.2, english: 0.6, thinkingSkills: 0.2 }
  },
  
  // Critical thinking emphasis
  criticalThinking: {
    useEnhancedQuestions: true,
    difficultyDistribution: { easy: 0.2, medium: 0.4, hard: 0.4 },
    subjectWeights: { math: 0.3, english: 0.3, thinkingSkills: 0.4 }
  },
  
  // Remedial/support learning
  remedial: {
    useEnhancedQuestions: true,
    difficultyDistribution: { easy: 0.5, medium: 0.4, hard: 0.1 },
    subjectWeights: { math: 0.4, english: 0.4, thinkingSkills: 0.2 }
  },
  
  // Advanced/gifted programs
  advanced: {
    useEnhancedQuestions: true,
    difficultyDistribution: { easy: 0.1, medium: 0.4, hard: 0.5 },
    subjectWeights: { math: 0.4, english: 0.3, thinkingSkills: 0.3 }
  }
};
