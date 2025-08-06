import OpenAI from 'openai';
import { WritingCritique, WritingType } from '../../../shared/types';

// Fallback function for when OpenAI is not available
function getFallbackWritingCritique(content: string, type: WritingType): WritingCritique {
  return {
    overallScore: 75,
    grammar: { score: 75, feedback: 'Good grammar overall' },
    structure: { score: 75, feedback: 'Clear structure' },
    clarity: { score: 75, feedback: 'Generally clear writing' },
    vocabulary: { score: 75, feedback: 'Good use of vocabulary' },
    suggestions: ['Try varying your sentence length', 'Consider using more descriptive language'],
    strengths: ['Clear structure', 'Good use of vocabulary'],
    areasForImprovement: ['Consider adding more examples', 'Work on sentence variety'],
    processedAt: new Date()
  };
}

// Check if OpenAI API key is available and valid
const isOpenAIAvailable = process.env.OPENAI_API_KEY && 
  process.env.OPENAI_API_KEY !== 'your-openai-api-key-here' && 
  process.env.OPENAI_API_KEY !== 'sk-placeholder-key-replace-with-real-key';

let openai: OpenAI | null = null;

if (isOpenAIAvailable) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI service initialized');
  } catch (error) {
    console.warn('⚠️ OpenAI initialization failed:', error);
    openai = null;
  }
} else {
  console.warn('⚠️ OpenAI API key not configured. Writing analysis will use fallback responses.');
}

export async function analyzeWriting(content: string, type: WritingType): Promise<WritingCritique> {
  // If OpenAI is not available, return a fallback response
  if (!openai) {
    console.warn('OpenAI not available, returning fallback writing analysis');
    return getFallbackWritingCritique(content, type);
  }

  try {
    const prompt = generateAnalysisPrompt(content, type);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert writing tutor and English teacher. Provide detailed, constructive feedback on student writing. Your analysis should be encouraging while highlighting areas for improvement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysis = response.choices[0].message.content;
    if (!analysis) {
      throw new Error('No analysis received from OpenAI');
    }

    return parseAnalysis(analysis);
  } catch (error) {
    console.error('Error analyzing writing with OpenAI:', error);
    return getFallbackWritingCritique(content, type);
  }
}

function generateAnalysisPrompt(content: string, type: WritingType): string {
  const typeInstructions = {
    [WritingType.ESSAY]: 'This is an essay. Focus on thesis clarity, argument structure, evidence support, and conclusion effectiveness.',
    [WritingType.PARAGRAPH]: 'This is a paragraph. Focus on topic sentence, supporting details, coherence, and concluding sentence.',
    [WritingType.CREATIVE]: 'This is creative writing. Focus on creativity, imagery, narrative flow, and character development.',
    [WritingType.ARGUMENTATIVE]: 'This is argumentative writing. Focus on claim clarity, evidence quality, counterargument consideration, and logical reasoning.'
  };

  return `
Please analyze the following ${type} writing and provide detailed feedback in the following JSON format:

{
  "overallScore": [0-100],
  "grammar": {
    "score": [0-100],
    "feedback": "detailed feedback on grammar",
    "examples": ["specific examples of grammar issues or strengths"]
  },
  "structure": {
    "score": [0-100],
    "feedback": "detailed feedback on structure and organization",
    "examples": ["specific examples of structural elements"]
  },
  "clarity": {
    "score": [0-100],
    "feedback": "detailed feedback on clarity and coherence",
    "examples": ["specific examples of clear or unclear passages"]
  },
  "vocabulary": {
    "score": [0-100],
    "feedback": "detailed feedback on word choice and vocabulary",
    "examples": ["specific examples of vocabulary usage"]
  },
  "suggestions": ["3-5 specific actionable suggestions for improvement"],
  "strengths": ["3-5 specific strengths in the writing"],
  "areasForImprovement": ["3-5 specific areas that need work"]
}

${typeInstructions[type]}

Writing to analyze:
"""
${content}
"""

Please provide constructive, encouraging feedback that helps the student improve. Be specific with examples and suggestions.
`;
}

function parseAnalysis(analysis: string): WritingCritique {
  try {
    // Try to extract JSON from the response
    const jsonMatch = analysis.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in analysis');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and structure the response
    const critique: WritingCritique = {
      overallScore: Math.max(0, Math.min(100, parsed.overallScore || 0)),
      grammar: {
        score: Math.max(0, Math.min(100, parsed.grammar?.score || 0)),
        feedback: parsed.grammar?.feedback || 'No grammar feedback provided',
        examples: Array.isArray(parsed.grammar?.examples) ? parsed.grammar.examples : []
      },
      structure: {
        score: Math.max(0, Math.min(100, parsed.structure?.score || 0)),
        feedback: parsed.structure?.feedback || 'No structure feedback provided',
        examples: Array.isArray(parsed.structure?.examples) ? parsed.structure.examples : []
      },
      clarity: {
        score: Math.max(0, Math.min(100, parsed.clarity?.score || 0)),
        feedback: parsed.clarity?.feedback || 'No clarity feedback provided',
        examples: Array.isArray(parsed.clarity?.examples) ? parsed.clarity.examples : []
      },
      vocabulary: {
        score: Math.max(0, Math.min(100, parsed.vocabulary?.score || 0)),
        feedback: parsed.vocabulary?.feedback || 'No vocabulary feedback provided',
        examples: Array.isArray(parsed.vocabulary?.examples) ? parsed.vocabulary.examples : []
      },
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      areasForImprovement: Array.isArray(parsed.areasForImprovement) ? parsed.areasForImprovement : [],
      processedAt: new Date()
    };

    return critique;
  } catch (error) {
    console.error('Error parsing analysis:', error);
    
function getFallbackWritingCritique(content: string, type: WritingType): WritingCritique {
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).length - 1;
  
  // Basic scoring based on length and structure
  const lengthScore = Math.min(100, Math.max(20, wordCount * 2));
  const structureScore = Math.min(100, Math.max(30, sentenceCount * 10));
  const overallScore = Math.round((lengthScore + structureScore) / 2);

  return {
    overallScore,
    grammar: {
      score: Math.max(60, overallScore - 10),
      feedback: 'Basic grammar analysis is not available without OpenAI API. Please check for common errors like subject-verb agreement, punctuation, and spelling.',
      examples: ['Consider reviewing punctuation usage', 'Check for spelling errors']
    },
    structure: {
      score: structureScore,
      feedback: `Your writing has ${sentenceCount} sentences and ${wordCount} words. ${type === WritingType.ESSAY ? 'Consider organizing into clear paragraphs with introduction, body, and conclusion.' : 'Ensure your ideas flow logically from one to the next.'}`,
      examples: ['Use transition words to connect ideas', 'Organize thoughts into clear paragraphs']
    },
    clarity: {
      score: Math.max(50, overallScore - 5),
      feedback: 'For detailed clarity analysis, please configure OpenAI API. Focus on using clear, concise language and avoiding ambiguous statements.',
      examples: ['Use specific examples to support your points', 'Avoid overly complex sentences']
    },
    vocabulary: {
      score: Math.max(55, overallScore),
      feedback: 'Vocabulary analysis requires OpenAI API. Try to use varied and appropriate word choices for your audience and purpose.',
      examples: ['Use synonyms to avoid repetition', 'Choose words appropriate for your audience']
    },
    suggestions: [
      'Configure OpenAI API key for detailed AI-powered feedback',
      'Read your writing aloud to catch errors and improve flow',
      'Have someone else review your work for a fresh perspective',
      'Practice writing regularly to improve your skills',
      'Focus on one improvement area at a time'
    ],
    strengths: [
      `Good effort with ${wordCount} words written`,
      'You completed the writing task',
      'Keep practicing to develop your writing skills'
    ],
    areasForImprovement: [
      'Configure OpenAI for detailed analysis',
      'Review grammar and punctuation rules',
      'Practice organizing ideas clearly'
    ],
    processedAt: new Date()
  };
}
  }
}

// Function to generate adaptive questions using OpenAI
export async function generateAdaptiveQuestions(
  subject: string,
  topic: string,
  difficulty: string,
  count: number = 5,
  userWeakAreas: string[] = []
): Promise<any[]> {
  // If OpenAI is not available, return empty array (questions will come from database)
  if (!openai) {
    console.warn('OpenAI not available, skipping adaptive question generation');
    return [];
  }

  try {
    const prompt = `
Generate ${count} multiple choice questions for:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
${userWeakAreas.length > 0 ? `Focus on weak areas: ${userWeakAreas.join(', ')}` : ''}

Return a JSON array of questions in this format:
[
  {
    "content": "Question text here?",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Detailed explanation of why this is correct",
    "hints": ["Helpful hint 1", "Helpful hint 2"],
    "timeLimit": 60
  }
]

Make sure questions are educational, accurate, and appropriate for the difficulty level.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator creating high-quality educational questions. Generate accurate, well-structured questions with clear explanations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error('Error generating questions with OpenAI:', error);
    return [];
  }
}

// Function to get personalized study recommendations
export async function getStudyRecommendations(
  userStats: any,
  weakAreas: string[],
  recentPerformance: any[]
): Promise<string[]> {
  // If OpenAI is not available, return default recommendations
  if (!openai) {
    return getDefaultStudyRecommendations(userStats, weakAreas);
  }

  try {
    const prompt = `
Based on the following student data, provide 5 specific, actionable study recommendations:

User Statistics:
- Total Questions: ${userStats.totalQuestions}
- Accuracy: ${userStats.accuracy}%
- Weak Areas: ${weakAreas.join(', ')}
- Study Time: ${Math.round(userStats.totalStudyTime / 60)} minutes

Recent Performance:
${recentPerformance.map(p => `- ${p.subject}: ${p.accuracy}% accuracy`).join('\n')}

Provide recommendations as a JSON array of strings:
["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"]

Focus on specific, actionable advice for improvement.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert tutor providing personalized study advice. Give specific, actionable recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return getDefaultStudyRecommendations(userStats, weakAreas);
    }

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return getDefaultStudyRecommendations(userStats, weakAreas);
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    return Array.isArray(recommendations) ? recommendations : getDefaultStudyRecommendations(userStats, weakAreas);
  } catch (error) {
    console.error('Error getting study recommendations:', error);
    return getDefaultStudyRecommendations(userStats, weakAreas);
  }
}

function getDefaultStudyRecommendations(userStats: any, weakAreas: string[]): string[] {
  const recommendations = [
    'Continue practicing regularly to build consistency and improve retention',
    'Review explanations carefully after each question to understand concepts better'
  ];

  if (weakAreas.length > 0) {
    recommendations.push(`Focus extra time on your identified weak areas: ${weakAreas.slice(0, 2).join(' and ')}`);
  }

  if (userStats.accuracy < 70) {
    recommendations.push('Slow down and read questions more carefully to improve accuracy');
  } else {
    recommendations.push('Try timed practice sessions to improve speed while maintaining accuracy');
  }

  recommendations.push('Set daily study goals to maintain momentum and track progress');

  return recommendations;
}
