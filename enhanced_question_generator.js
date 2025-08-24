#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Enhanced Question Generator - Real Variety and Grade-Appropriate Content
 * 
 * This version creates truly varied, educational questions with proper grade-level complexity
 */

class EnhancedQuestionGenerator {
    constructor() {
        this.questionsDir = '/workspace/AWSQCLI/testace-app/frontend/public/questions';
        this.model = 'deepseek-r1:latest';
        this.questionsPerFile = 50;
    }

    /**
     * Generate enhanced prompts with specific variety requirements
     */
    generateEnhancedPrompt(subject, grade, difficulty) {
        const gradeNum = parseInt(grade);
        
        if (subject === 'math') {
            return this.generateMathPrompt(gradeNum, difficulty);
        } else if (subject === 'english') {
            return this.generateEnglishPrompt(gradeNum, difficulty);
        } else if (subject === 'reading') {
            return this.generateReadingPrompt(gradeNum, difficulty);
        } else if (subject === 'mathematical-reasoning') {
            return this.generateReasoningPrompt(gradeNum, difficulty);
        } else if (subject === 'thinking-skills') {
            return this.generateThinkingPrompt(gradeNum, difficulty);
        }
        
        return this.generateGenericPrompt(subject, gradeNum, difficulty);
    }

    /**
     * Generate varied math prompts based on grade and difficulty
     */
    generateMathPrompt(grade, difficulty) {
        const topics = this.getMathTopicsByGrade(grade, difficulty);
        
        return `Create exactly ${this.questionsPerFile} varied math questions for Grade ${grade} (${difficulty} level).

REQUIRED VARIETY - Include ALL these types:
${topics.map(topic => `- ${topic.count} questions on: ${topic.description}`).join('\n')}

STRICT REQUIREMENTS:
- Each question must be completely different
- Use real numbers and calculations
- Age-appropriate for ${grade}th graders
- Include word problems and direct calculations
- Vary the question formats and scenarios

EXAMPLE FORMATS (create different questions):
- Direct calculation: "What is 15 × 4?"
- Word problem: "Sarah has 24 stickers. She gives 8 to friends and buys 12 more. How many does she have now?"
- Comparison: "Which is larger: 3/4 or 0.7?"
- Application: "A rectangle is 6 cm long and 4 cm wide. What is its area?"

Return as JSON array:
[
  {
    "content": "Real varied question here",
    "options": ["Real option 1", "Real option 2", "Real option 3", "Real option 4"],
    "correctAnswer": "Correct option",
    "explanation": "Clear mathematical explanation"
  }
]

Generate ${this.questionsPerFile} completely different math questions now:`;
    }

    /**
     * Get math topics distribution by grade and difficulty
     */
    getMathTopicsByGrade(grade, difficulty) {
        const distributions = {
            1: {
                easy: [
                    { count: 10, description: "Single-digit addition (1+2, 3+4, etc.)" },
                    { count: 10, description: "Single-digit subtraction (5-2, 8-3, etc.)" },
                    { count: 10, description: "Counting and number recognition (1-20)" },
                    { count: 10, description: "Simple word problems with small numbers" },
                    { count: 10, description: "Basic shapes and patterns" }
                ],
                medium: [
                    { count: 10, description: "Addition within 20 with regrouping" },
                    { count: 10, description: "Subtraction within 20 with borrowing" },
                    { count: 10, description: "Simple multiplication concepts (2×3, 5×2)" },
                    { count: 10, description: "Basic fractions (halves, quarters)" },
                    { count: 10, description: "Time and money problems" }
                ],
                hard: [
                    { count: 10, description: "Two-digit addition and subtraction" },
                    { count: 10, description: "Multiplication tables 2-5" },
                    { count: 10, description: "Division concepts and simple problems" },
                    { count: 10, description: "Complex word problems with multiple steps" },
                    { count: 10, description: "Measurement and geometry basics" }
                ]
            },
            2: {
                easy: [
                    { count: 10, description: "Two-digit addition without regrouping" },
                    { count: 10, description: "Two-digit subtraction without borrowing" },
                    { count: 10, description: "Skip counting by 2s, 5s, 10s" },
                    { count: 10, description: "Place value (tens and ones)" },
                    { count: 10, description: "Simple measurement problems" }
                ],
                medium: [
                    { count: 10, description: "Two-digit addition with regrouping" },
                    { count: 10, description: "Two-digit subtraction with borrowing" },
                    { count: 10, description: "Multiplication tables 2-10" },
                    { count: 10, description: "Basic division facts" },
                    { count: 10, description: "Fraction concepts and comparisons" }
                ],
                hard: [
                    { count: 10, description: "Three-digit addition and subtraction" },
                    { count: 10, description: "Multi-step word problems" },
                    { count: 10, description: "Advanced multiplication and division" },
                    { count: 10, description: "Geometry and area problems" },
                    { count: 10, description: "Data interpretation and graphs" }
                ]
            },
            3: {
                easy: [
                    { count: 10, description: "Multiplication tables 1-10" },
                    { count: 10, description: "Division facts and remainders" },
                    { count: 10, description: "Fraction identification and comparison" },
                    { count: 10, description: "Basic geometry (perimeter, area)" },
                    { count: 10, description: "Money and time calculations" }
                ],
                medium: [
                    { count: 10, description: "Multi-digit multiplication" },
                    { count: 10, description: "Long division problems" },
                    { count: 10, description: "Fraction operations (add/subtract)" },
                    { count: 10, description: "Decimal introduction and comparison" },
                    { count: 10, description: "Word problems with multiple operations" }
                ],
                hard: [
                    { count: 10, description: "Complex multiplication and division" },
                    { count: 10, description: "Advanced fraction operations" },
                    { count: 10, description: "Decimal operations" },
                    { count: 10, description: "Geometry with formulas" },
                    { count: 10, description: "Multi-step reasoning problems" }
                ]
            },
            4: {
                easy: [
                    { count: 10, description: "Multi-digit multiplication" },
                    { count: 10, description: "Division with remainders" },
                    { count: 10, description: "Equivalent fractions" },
                    { count: 10, description: "Decimal place value" },
                    { count: 10, description: "Basic coordinate geometry" }
                ],
                medium: [
                    { count: 10, description: "Fraction operations (all four operations)" },
                    { count: 10, description: "Decimal operations" },
                    { count: 10, description: "Area and perimeter formulas" },
                    { count: 10, description: "Factor and multiple problems" },
                    { count: 10, description: "Data analysis and probability" }
                ],
                hard: [
                    { count: 10, description: "Complex fraction problems" },
                    { count: 10, description: "Advanced decimal operations" },
                    { count: 10, description: "Geometric transformations" },
                    { count: 10, description: "Algebraic thinking and patterns" },
                    { count: 10, description: "Multi-step problem solving" }
                ]
            },
            5: {
                easy: [
                    { count: 10, description: "Decimal operations (add, subtract, multiply, divide)" },
                    { count: 10, description: "Fraction operations with like/unlike denominators" },
                    { count: 10, description: "Percentage calculations" },
                    { count: 10, description: "Volume and surface area" },
                    { count: 10, description: "Coordinate plane problems" }
                ],
                medium: [
                    { count: 10, description: "Advanced fraction and decimal conversions" },
                    { count: 10, description: "Algebraic expressions and equations" },
                    { count: 10, description: "Statistical measures (mean, median, mode)" },
                    { count: 10, description: "Geometric reasoning and proofs" },
                    { count: 10, description: "Complex word problems" }
                ],
                hard: [
                    { count: 10, description: "Advanced algebraic thinking" },
                    { count: 10, description: "Complex geometry problems" },
                    { count: 10, description: "Probability and combinations" },
                    { count: 10, description: "Mathematical modeling" },
                    { count: 10, description: "Multi-step reasoning and logic" }
                ]
            }
        };

        // For grades 6-12, use more advanced topics
        if (grade >= 6) {
            return {
                easy: [
                    { count: 10, description: "Ratios and proportions" },
                    { count: 10, description: "Basic algebra and equations" },
                    { count: 10, description: "Geometry and measurement" },
                    { count: 10, description: "Statistics and data analysis" },
                    { count: 10, description: "Integer operations" }
                ],
                medium: [
                    { count: 10, description: "Linear equations and inequalities" },
                    { count: 10, description: "Advanced geometry and trigonometry" },
                    { count: 10, description: "Probability and statistics" },
                    { count: 10, description: "Functions and graphing" },
                    { count: 10, description: "Mathematical reasoning" }
                ],
                hard: [
                    { count: 10, description: "Advanced algebra and polynomials" },
                    { count: 10, description: "Trigonometry and advanced geometry" },
                    { count: 10, description: "Calculus concepts" },
                    { count: 10, description: "Complex problem solving" },
                    { count: 10, description: "Mathematical proofs and logic" }
                ]
            }[difficulty];
        }

        return distributions[grade]?.[difficulty] || distributions[5][difficulty];
    }
