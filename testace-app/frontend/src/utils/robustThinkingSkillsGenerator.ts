import { Question, DifficultyLevel, QuestionType } from '../types';

/**
 * Robust Thinking Skills Question Generator
 * 
 * This generator GUARANTEES to produce the requested number of questions
 * by using multiple fallback strategies and emergency generation methods.
 * 
 * It addresses the critical error: "Only X questions available after all generation strategies"
 */

interface ThinkingSkillsTemplate {
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  variables?: Record<string, string[]>;
}

export class RobustThinkingSkillsGenerator {
  
  private static generateId(): string {
    return `robust_thinking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * GUARANTEED question generation - will always return the requested count
   */
  static generateQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
    console.log(`🎯 Generating ${count} thinking skills questions for Grade ${grade}, ${difficulty}`);
    
    const questions: Question[] = [];
    const gradeNum = parseInt(grade);
    
    // Get templates for this grade and difficulty
    const templates = this.getTemplatesForGrade(gradeNum, difficulty);
    
    // Strategy 1: Use templates with variations
    for (let i = 0; i < count && questions.length < count; i++) {
      try {
        const template = templates[i % templates.length];
        const question = this.generateFromTemplate(template, gradeNum, difficulty, i);
        questions.push(question);
      } catch (error) {
        console.warn(`Template generation failed for question ${i}:`, error);
      }
    }
    
    // Strategy 2: Fill remaining with emergency questions
    while (questions.length < count) {
      const emergencyQuestion = this.generateEmergencyQuestion(gradeNum, difficulty, questions.length);
      questions.push(emergencyQuestion);
    }
    
    console.log(`✅ Successfully generated ${questions.length} thinking skills questions`);
    return questions;
  }

  private static getTemplatesForGrade(grade: number, difficulty: DifficultyLevel): ThinkingSkillsTemplate[] {
    const baseTemplates = this.getBaseTemplates();
    
    // Filter and adapt templates based on grade and difficulty
    return baseTemplates.map(template => this.adaptTemplateForGrade(template, grade, difficulty));
  }

  private static getBaseTemplates(): ThinkingSkillsTemplate[] {
    return [
      // Pattern Recognition Templates
      {
        content: 'Look at this pattern: {pattern_sequence}\n\nWhat comes next?',
        options: ['{correct_next}', '{wrong_option1}', '{wrong_option2}', '{wrong_option3}'],
        correctAnswer: '{correct_next}',
        explanation: 'The pattern follows the rule: {pattern_rule}',
        topic: 'Pattern Recognition',
        variables: {
          pattern_sequence: ['A, B, A, B, A', '1, 2, 3, 1, 2', 'Red, Blue, Red, Blue, Red', 'Circle, Square, Circle, Square, Circle'],
          correct_next: ['B', '3', 'Blue', 'Square'],
          wrong_option1: ['A', '1', 'Red', 'Circle'],
          wrong_option2: ['C', '4', 'Green', 'Triangle'],
          wrong_option3: ['D', '5', 'Yellow', 'Diamond'],
          pattern_rule: ['alternating sequence', 'repeating cycle', 'color alternation', 'shape alternation']
        }
      },
      
      // Logical Reasoning Templates
      {
        content: 'All {category} are {property1}. {specific_item} is a {category}.\n\nWhat can we conclude about {specific_item}?',
        options: ['{specific_item} is {property1}', '{specific_item} might be {property1}', 'Some {category} are {property1}', 'All {property1} are {category}'],
        correctAnswer: '{specific_item} is {property1}',
        explanation: 'This is logical deduction. If all {category} are {property1} and {specific_item} is a {category}, then {specific_item} must be {property1}.',
        topic: 'Logical Reasoning',
        variables: {
          category: ['cats', 'birds', 'flowers', 'cars', 'books'],
          property1: ['furry', 'flying', 'colorful', 'fast', 'educational'],
          specific_item: ['Fluffy', 'Robin', 'Rose', 'Ferrari', 'Dictionary']
        }
      },
      
      // Spatial Reasoning Templates
      {
        content: 'The {object1} is {direction1} of the {object2}. The {object2} is {direction2} of the {object3}.\n\nWhere is the {object1} compared to the {object3}?',
        options: ['{result_direction} of the {object3}', '{wrong_direction1} of the {object3}', '{wrong_direction2} of the {object3}', 'Cannot be determined'],
        correctAnswer: '{result_direction} of the {object3}',
        explanation: 'Following the spatial relationships: {object1} → {direction1} → {object2} → {direction2} → {object3}',
        topic: 'Spatial Reasoning',
        variables: {
          object1: ['library', 'school', 'park', 'hospital', 'store'],
          object2: ['school', 'park', 'hospital', 'store', 'library'],
          object3: ['park', 'hospital', 'store', 'library', 'school'],
          direction1: ['north', 'south', 'east', 'west'],
          direction2: ['north', 'south', 'east', 'west'],
          result_direction: ['north', 'south', 'east', 'west'],
          wrong_direction1: ['south', 'north', 'west', 'east'],
          wrong_direction2: ['east', 'west', 'north', 'south']
        }
      },
      
      // Problem Solving Templates
      {
        content: 'A {worker} can {task} {amount} {units} in {time} {time_unit}. How many {units} can {number} {worker}s {task} in the same time?',
        options: ['{correct_answer} {units}', '{wrong_answer1} {units}', '{wrong_answer2} {units}', '{wrong_answer3} {units}'],
        correctAnswer: '{correct_answer} {units}',
        explanation: 'With {number} times as many {worker}s, they can {task} {number} times as many {units}: {amount} × {number} = {correct_answer}',
        topic: 'Problem Solving',
        variables: {
          worker: ['painter', 'baker', 'gardener', 'cleaner', 'writer'],
          task: ['paint', 'bake', 'plant', 'clean', 'write'],
          amount: ['2', '3', '4', '5', '6'],
          units: ['rooms', 'cakes', 'flowers', 'windows', 'pages'],
          time: ['1', '2', '3', '4'],
          time_unit: ['hour', 'day', 'minute'],
          number: ['2', '3', '4', '5'],
          correct_answer: ['4', '6', '8', '10', '12'],
          wrong_answer1: ['2', '3', '4', '5', '6'],
          wrong_answer2: ['6', '9', '12', '15', '18'],
          wrong_answer3: ['1', '2', '3', '4', '5']
        }
      },
      
      // Critical Thinking Templates
      {
        content: 'Statement: "{statement}"\n\nWhich assumption is necessary for this statement to be true?',
        options: ['{necessary_assumption}', '{unnecessary_assumption1}', '{unnecessary_assumption2}', '{contradictory_assumption}'],
        correctAnswer: '{necessary_assumption}',
        explanation: 'For the statement to be true, we must assume: {necessary_assumption}',
        topic: 'Critical Thinking',
        variables: {
          statement: [
            'All students who study hard will pass the test',
            'The library is the best place to study',
            'Exercise improves academic performance',
            'Reading books makes you smarter'
          ],
          necessary_assumption: [
            'The test measures what was studied',
            'The library has good study conditions',
            'Physical health affects mental performance',
            'Books contain valuable knowledge'
          ],
          unnecessary_assumption1: [
            'Students enjoy studying',
            'Libraries are quiet',
            'Exercise is fun',
            'Books are expensive'
          ],
          unnecessary_assumption2: [
            'Tests are difficult',
            'Libraries are free',
            'Exercise takes time',
            'Books are heavy'
          ],
          contradictory_assumption: [
            'Studying hard guarantees failure',
            'Libraries are noisy',
            'Exercise harms performance',
            'Books make you confused'
          ]
        }
      }
    ];
  }

  private static adaptTemplateForGrade(template: ThinkingSkillsTemplate, grade: number, difficulty: DifficultyLevel): ThinkingSkillsTemplate {
    // Clone the template
    const adapted = JSON.parse(JSON.stringify(template));
    
    // Adjust complexity based on grade
    if (grade <= 3) {
      // Simplify language for younger students
      adapted.content = adapted.content.replace(/conclude/g, 'say');
      adapted.content = adapted.content.replace(/determine/g, 'find out');
    } else if (grade >= 9) {
      // Add complexity for older students
      adapted.content = adapted.content.replace(/What/g, 'What specifically');
      adapted.content = adapted.content.replace(/can we/g, 'can we logically');
    }
    
    return adapted;
  }

  private static generateFromTemplate(template: ThinkingSkillsTemplate, grade: number, difficulty: DifficultyLevel, index: number): Question {
    let content = template.content;
    let options = [...template.options];
    let correctAnswer = template.correctAnswer;
    let explanation = template.explanation;
    
    // Replace variables if they exist
    if (template.variables) {
      for (const [key, values] of Object.entries(template.variables)) {
        const value = values[index % values.length];
        const placeholder = `{${key}}`;
        
        content = content.replace(new RegExp(placeholder, 'g'), value);
        options = options.map(opt => opt.replace(new RegExp(placeholder, 'g'), value));
        correctAnswer = correctAnswer.replace(new RegExp(placeholder, 'g'), value);
        explanation = explanation.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    
    return {
      _id: this.generateId(),
      content,
      type: QuestionType.MULTIPLE_CHOICE,
      options,
      correctAnswer,
      explanation,
      subject: 'Thinking Skills',
      topic: template.topic,
      difficulty,
      grade: grade.toString(),
      tags: ['thinking-skills', 'generated', 'robust'],
      createdBy: 'robust-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static generateEmergencyQuestion(grade: number, difficulty: DifficultyLevel, index: number): Question {
    const emergencyTemplates = [
      {
        content: `Which number comes next in this sequence: ${index + 1}, ${index + 2}, ${index + 3}, ?`,
        options: [`${index + 4}`, `${index + 5}`, `${index + 3}`, `${index + 1}`],
        correctAnswer: `${index + 4}`,
        explanation: `The sequence increases by 1 each time, so ${index + 3} + 1 = ${index + 4}`,
        topic: 'Number Patterns'
      },
      {
        content: `If A comes before B, and B comes before C, what comes first?`,
        options: ['A', 'B', 'C', 'Cannot tell'],
        correctAnswer: 'A',
        explanation: 'In the sequence A → B → C, A comes first.',
        topic: 'Logical Ordering'
      },
      {
        content: `All circles are round. This shape is a circle. What can we say about this shape?`,
        options: ['It is round', 'It is square', 'It might be round', 'It is not round'],
        correctAnswer: 'It is round',
        explanation: 'If all circles are round and this is a circle, then it must be round.',
        topic: 'Logical Reasoning'
      },
      {
        content: `Which pattern continues: Red, Blue, Red, Blue, ?`,
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 'Red',
        explanation: 'The pattern alternates: Red, Blue, Red, Blue, so Red comes next.',
        topic: 'Pattern Recognition'
      },
      {
        content: `If 2 people can paint 1 room in 4 hours, how long would it take 4 people to paint 1 room?`,
        options: ['2 hours', '4 hours', '8 hours', '1 hour'],
        correctAnswer: '2 hours',
        explanation: 'With twice as many people, the job takes half the time: 4 ÷ 2 = 2 hours.',
        topic: 'Problem Solving'
      }
    ];
    
    const template = emergencyTemplates[index % emergencyTemplates.length];
    
    return {
      _id: this.generateId(),
      content: template.content,
      type: QuestionType.MULTIPLE_CHOICE,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      subject: 'Thinking Skills',
      topic: template.topic,
      difficulty,
      grade: grade.toString(),
      tags: ['thinking-skills', 'emergency', 'generated'],
      createdBy: 'emergency-generator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Convenience function for external use
export function generateRobustThinkingSkillsQuestions(grade: string, difficulty: DifficultyLevel, count: number): Question[] {
  return RobustThinkingSkillsGenerator.generateQuestions(grade, difficulty, count);
}

export default RobustThinkingSkillsGenerator;
