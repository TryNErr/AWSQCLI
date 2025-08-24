#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Improved Question Generator - 50 Real Questions with Grade Validation
 * 
 * This version ensures all questions are real, educational, and grade-appropriate
 */

class ImprovedQuestionGenerator {
    constructor() {
        this.questionsDir = '/workspace/AWSQCLI/testace-app/frontend/public/questions';
        this.model = 'deepseek-r1:latest';
        this.questionsPerFile = 50; // Increased to 50 questions
        this.maxRetries = 3; // Retry failed generations
    }

    /**
     * Generate detailed, educational prompts that ensure real questions
     */
    generateDetailedPrompt(subject, grade, difficulty) {
        const gradeNum = parseInt(grade);
        
        const prompts = {
            math: `You are an expert math teacher creating ${this.questionsPerFile} unique, educational math questions for Grade ${grade} students at ${difficulty} difficulty.

STRICT REQUIREMENTS:
- Each question must be a real, solvable math problem
- Questions must be appropriate for ${grade}th grade students (age ${gradeNum + 5}-${gradeNum + 6})
- Use ${difficulty} difficulty level concepts only
- Include real numbers, scenarios, and calculations
- NO placeholder text like "math question X" or "Option A/B/C/D"
- Each question must be completely different from others

GRADE ${grade} ${difficulty.toUpperCase()} MATH TOPICS:
${this.getMathTopics(gradeNum, difficulty)}

EXAMPLE FORMAT (but create completely different questions):
{
  "content": "Sarah has 24 stickers. She gives 8 stickers to her friend and buys 15 more. How many stickers does Sarah have now?",
  "options": ["29 stickers", "31 stickers", "39 stickers", "47 stickers"],
  "correctAnswer": "31 stickers",
  "explanation": "24 - 8 + 15 = 31 stickers"
}

Return ONLY a JSON array of ${this.questionsPerFile} questions:
[{"content":"Real question here","type":"multiple_choice","options":["Real option 1","Real option 2","Real option 3","Real option 4"],"correctAnswer":"Correct option text","subject":"math","grade":"${grade}","difficulty":"${difficulty}","explanation":"Clear mathematical explanation"}]

Generate ${this.questionsPerFile} completely unique, real math questions now:`,

            english: `You are an expert English teacher creating ${this.questionsPerFile} unique, educational English questions for Grade ${grade} students at ${difficulty} difficulty.

STRICT REQUIREMENTS:
- Each question must test real English language skills
- Questions must be appropriate for ${grade}th grade students (age ${gradeNum + 5}-${gradeNum + 6})
- Use ${difficulty} difficulty level grammar and vocabulary
- Include real sentences, words, and language concepts
- NO placeholder text like "english question X" or "Option A/B/C/D"
- Each question must be completely different from others

GRADE ${grade} ${difficulty.toUpperCase()} ENGLISH TOPICS:
${this.getEnglishTopics(gradeNum, difficulty)}

EXAMPLE FORMAT (but create completely different questions):
{
  "content": "Which word is a proper noun in this sentence: 'The dog ran to Central Park yesterday'?",
  "options": ["dog", "ran", "Central Park", "yesterday"],
  "correctAnswer": "Central Park",
  "explanation": "Central Park is a proper noun because it names a specific place"
}

Return ONLY a JSON array of ${this.questionsPerFile} questions:
[{"content":"Real question here","type":"multiple_choice","options":["Real option 1","Real option 2","Real option 3","Real option 4"],"correctAnswer":"Correct option text","subject":"english","grade":"${grade}","difficulty":"${difficulty}","explanation":"Clear grammar/language explanation"}]

Generate ${this.questionsPerFile} completely unique, real English questions now:`,

            reading: `You are an expert reading teacher creating ${this.questionsPerFile} unique reading comprehension questions for Grade ${grade} students at ${difficulty} difficulty.

STRICT REQUIREMENTS:
- Each question must include a real, age-appropriate passage
- Questions must be appropriate for ${grade}th grade students (age ${gradeNum + 5}-${gradeNum + 6})
- Use ${difficulty} difficulty level vocabulary and concepts
- Include real stories, scenarios, and comprehension tasks
- NO placeholder text like "reading question X" or generic passages
- Each passage and question must be completely different from others

GRADE ${grade} ${difficulty.toUpperCase()} READING TOPICS:
${this.getReadingTopics(gradeNum, difficulty)}

EXAMPLE FORMAT (but create completely different content):
{
  "content": "Read this passage:\\n\\nThe ancient library contained thousands of scrolls written by scholars from different civilizations. Each scroll was carefully preserved in clay jars to protect it from moisture and insects. Visitors had to wear special gloves when handling these precious documents.\\n\\nWhat was the main purpose of the clay jars?",
  "options": ["To make the scrolls look prettier", "To protect scrolls from damage", "To organize scrolls by subject", "To make scrolls easier to read"],
  "correctAnswer": "To protect scrolls from damage",
  "explanation": "The passage states clay jars protected scrolls from moisture and insects"
}

Return ONLY a JSON array of ${this.questionsPerFile} questions:
[{"content":"Real passage and question here","type":"multiple_choice","options":["Real option 1","Real option 2","Real option 3","Real option 4"],"correctAnswer":"Correct option text","subject":"reading","grade":"${grade}","difficulty":"${difficulty}","explanation":"Clear reading comprehension explanation"}]

Generate ${this.questionsPerFile} completely unique, real reading questions now:`,

            'mathematical-reasoning': `You are an expert logic teacher creating ${this.questionsPerFile} unique mathematical reasoning questions for Grade ${grade} students at ${difficulty} difficulty.

STRICT REQUIREMENTS:
- Each question must test real logical thinking and pattern recognition
- Questions must be appropriate for ${grade}th grade students (age ${gradeNum + 5}-${gradeNum + 6})
- Use ${difficulty} difficulty level logical concepts
- Include real patterns, sequences, and reasoning problems
- NO placeholder text like "reasoning question X" or generic patterns
- Each question must be completely different from others

GRADE ${grade} ${difficulty.toUpperCase()} REASONING TOPICS:
${this.getReasoningTopics(gradeNum, difficulty)}

EXAMPLE FORMAT (but create completely different questions):
{
  "content": "Look at this pattern: 2, 5, 8, 11, 14, ?. What number comes next?",
  "options": ["16", "17", "18", "19"],
  "correctAnswer": "17",
  "explanation": "The pattern adds 3 each time: 2+3=5, 5+3=8, 8+3=11, 11+3=14, 14+3=17"
}

Return ONLY a JSON array of ${this.questionsPerFile} questions:
[{"content":"Real reasoning problem here","type":"multiple_choice","options":["Real option 1","Real option 2","Real option 3","Real option 4"],"correctAnswer":"Correct option text","subject":"mathematical-reasoning","grade":"${grade}","difficulty":"${difficulty}","explanation":"Clear logical reasoning explanation"}]

Generate ${this.questionsPerFile} completely unique, real reasoning questions now:`,

            'thinking-skills': `You are an expert critical thinking teacher creating ${this.questionsPerFile} unique thinking skills questions for Grade ${grade} students at ${difficulty} difficulty.

STRICT REQUIREMENTS:
- Each question must test real critical thinking and problem-solving
- Questions must be appropriate for ${grade}th grade students (age ${gradeNum + 5}-${gradeNum + 6})
- Use ${difficulty} difficulty level thinking concepts
- Include real scenarios, decisions, and analytical problems
- NO placeholder text like "thinking question X" or generic scenarios
- Each question must be completely different from others

GRADE ${grade} ${difficulty.toUpperCase()} THINKING TOPICS:
${this.getThinkingTopics(gradeNum, difficulty)}

EXAMPLE FORMAT (but create completely different questions):
{
  "content": "A school wants to reduce paper waste. Which solution would be most effective and practical?",
  "options": ["Ban all paper use immediately", "Use both sides of paper and recycle", "Only use expensive recycled paper", "Make students bring their own paper"],
  "correctAnswer": "Use both sides of paper and recycle",
  "explanation": "This solution reduces waste while being practical and cost-effective for the school"
}

Return ONLY a JSON array of ${this.questionsPerFile} questions:
[{"content":"Real thinking scenario here","type":"multiple_choice","options":["Real option 1","Real option 2","Real option 3","Real option 4"],"correctAnswer":"Correct option text","subject":"thinking-skills","grade":"${grade}","difficulty":"${difficulty}","explanation":"Clear critical thinking explanation"}]

Generate ${this.questionsPerFile} completely unique, real thinking questions now:`
        };

        return prompts[subject] || prompts['math'];
    }

    /**
     * Get detailed math topics by grade and difficulty
     */
    getMathTopics(grade, difficulty) {
        const topics = {
            1: {
                easy: 'Counting 1-20, single-digit addition/subtraction, basic shapes (circle, square, triangle), comparing numbers (bigger/smaller)',
                medium: 'Counting to 100, two-digit addition without regrouping, simple word problems, telling time to the hour, basic measurement',
                hard: 'Two-digit addition with regrouping, subtraction with borrowing, complex word problems, money counting, time to half-hour'
            },
            2: {
                easy: 'Two-digit addition/subtraction, place value (tens/ones), basic multiplication concepts, simple fractions (halves, quarters)',
                medium: 'Three-digit numbers, regrouping in addition/subtraction, multiplication tables 2-5, measurement units, data graphs',
                hard: 'Complex word problems, multiplication tables 6-10, division concepts, advanced fractions, geometry properties'
            },
            3: {
                easy: 'Multiplication tables 1-10, basic division, fraction concepts, area and perimeter of rectangles',
                medium: 'Multi-digit multiplication, division with remainders, equivalent fractions, decimal introduction, data interpretation',
                hard: 'Complex multiplication/division, fraction operations, decimal operations, advanced geometry, multi-step word problems'
            },
            4: {
                easy: 'Multi-digit operations, fraction comparisons, decimal basics, angle concepts, factor/multiple introduction',
                medium: 'Fraction operations (add/subtract), decimal operations, coordinate planes, area/perimeter formulas, data analysis',
                hard: 'Complex fraction problems, advanced decimals, geometric transformations, algebraic thinking, probability concepts'
            },
            5: {
                easy: 'Decimal operations, fraction operations, basic algebra concepts, volume calculations, coordinate geometry',
                medium: 'Advanced fractions, decimal/fraction conversions, algebraic expressions, statistical concepts, geometric reasoning',
                hard: 'Complex algebraic thinking, advanced geometry, probability calculations, multi-step reasoning, mathematical modeling'
            }
        };

        // For grades 6-12, use more advanced topics
        if (grade >= 6) {
            const advancedTopics = {
                easy: 'Ratios and proportions, basic algebra, geometric concepts, statistical basics, integer operations',
                medium: 'Algebraic equations, advanced geometry, probability, data analysis, functions introduction',
                hard: 'Complex algebra, trigonometry basics, advanced statistics, calculus introduction, abstract reasoning'
            };
            return advancedTopics[difficulty];
        }

        return topics[grade]?.[difficulty] || topics[5][difficulty];
    }

    /**
     * Get detailed English topics by grade and difficulty
     */
    getEnglishTopics(grade, difficulty) {
        const baseTopics = {
            easy: 'Parts of speech (nouns, verbs, adjectives), basic punctuation (periods, question marks), simple sentence structure, common spelling patterns, basic vocabulary',
            medium: 'Complex sentences, advanced punctuation (commas, apostrophes), paragraph structure, literary devices (simile, metaphor), advanced vocabulary, verb tenses',
            hard: 'Advanced grammar rules, sophisticated punctuation, complex writing techniques, advanced literary analysis, etymology, rhetorical devices'
        };
        return baseTopics[difficulty];
    }

    /**
     * Get detailed reading topics by grade and difficulty
     */
    getReadingTopics(grade, difficulty) {
        const topics = {
            easy: 'Simple stories about family, friends, animals, school experiences, basic informational texts about nature and community',
            medium: 'Adventure stories, historical events, science concepts, character development, cause-and-effect relationships, compare-contrast texts',
            hard: 'Complex narratives, abstract concepts, advanced informational texts, literary analysis, critical thinking scenarios, multiple perspectives'
        };
        return topics[difficulty];
    }

    /**
     * Get detailed reasoning topics by grade and difficulty
     */
    getReasoningTopics(grade, difficulty) {
        const topics = {
            easy: 'Simple number patterns, basic sequences, logical ordering, simple comparisons, basic problem-solving steps',
            medium: 'Complex patterns, multi-step reasoning, spatial relationships, analytical thinking, systematic problem-solving approaches',
            hard: 'Abstract reasoning, complex logical puzzles, advanced pattern recognition, sophisticated problem-solving, creative mathematical thinking'
        };
        return topics[difficulty];
    }

    /**
     * Get detailed thinking topics by grade and difficulty
     */
    getThinkingTopics(grade, difficulty) {
        const topics = {
            easy: 'Basic decision-making, simple observation skills, cause-and-effect understanding, basic categorization, everyday problem-solving',
            medium: 'Critical analysis, evaluation skills, comparison techniques, systematic thinking approaches, decision-making strategies',
            hard: 'Advanced critical thinking, complex evaluation, creative problem-solving, abstract reasoning, sophisticated analysis techniques'
        };
        return topics[difficulty];
    }

    /**
     * Call Ollama with optimized settings and retry logic
     */
    async callOllamaWithRetry(prompt, retryCount = 0) {
        try {
            console.log(`🤖 Calling Ollama (attempt ${retryCount + 1}/${this.maxRetries + 1})...`);
            
            const tempFile = '/tmp/improved_prompt.txt';
            fs.writeFileSync(tempFile, prompt);
            
            // Use optimized Ollama parameters
            const command = `cat "${tempFile}" | ollama run ${this.model} --format json --keepalive 10m --hidethinking`;
            
            const result = execSync(command, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer for 50 questions
                timeout: 300000 // 5 minute timeout for larger generation
            });
            
            fs.unlinkSync(tempFile);
            return result.trim();
            
        } catch (error) {
            console.error(`❌ Ollama call failed (attempt ${retryCount + 1}): ${error.message}`);
            
            if (retryCount < this.maxRetries) {
                console.log(`🔄 Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                return this.callOllamaWithRetry(prompt, retryCount + 1);
            }
            
            throw error;
        }
    }

    /**
     * Validate that questions are real and grade-appropriate
     */
    validateQuestionQuality(questions, subject, grade, difficulty) {
        const validQuestions = [];
        const issues = [];

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const questionNum = i + 1;
            
            // Check for placeholder content
            if (this.isPlaceholderQuestion(q)) {
                issues.push(`Question ${questionNum}: Contains placeholder content`);
                continue;
            }
            
            // Check if grade-appropriate
            if (!this.isGradeAppropriate(q, grade, difficulty)) {
                issues.push(`Question ${questionNum}: Not appropriate for Grade ${grade} ${difficulty}`);
                continue;
            }
            
            // Check if educationally valid
            if (!this.isEducationallyValid(q, subject)) {
                issues.push(`Question ${questionNum}: Not educationally valid for ${subject}`);
                continue;
            }
            
            validQuestions.push(q);
        }

        return { validQuestions, issues };
    }

    /**
     * Check if question contains placeholder content
     */
    isPlaceholderQuestion(question) {
        const placeholderPatterns = [
            /question \d+/i,
            /option [a-d]/i,
            /generated question/i,
            /placeholder/i,
            /example question/i,
            /sample question/i,
            /^[a-d]\)?\s*option/i,
            /^option [a-d]/i
        ];

        const content = question.content?.toLowerCase() || '';
        const options = question.options?.join(' ').toLowerCase() || '';
        
        return placeholderPatterns.some(pattern => 
            pattern.test(content) || pattern.test(options)
        );
    }

    /**
     * Check if question is appropriate for the grade level
     */
    isGradeAppropriate(question, grade, difficulty) {
        const gradeNum = parseInt(grade);
        const content = question.content?.toLowerCase() || '';
        
        // Check vocabulary complexity
        const complexWords = [
            'sophisticated', 'comprehensive', 'analytical', 'synthesize', 'paradigm',
            'methodology', 'theoretical', 'conceptual', 'empirical', 'hypothesis'
        ];
        
        const simpleWords = [
            'cat', 'dog', 'run', 'jump', 'happy', 'big', 'small', 'red', 'blue'
        ];
        
        if (gradeNum <= 3 && complexWords.some(word => content.includes(word))) {
            return false; // Too complex for early grades
        }
        
        if (gradeNum >= 8 && difficulty === 'hard' && simpleWords.every(word => !content.includes(word))) {
            // This is actually good for higher grades
        }
        
        // Check content length appropriateness
        const contentLength = content.length;
        const maxLength = gradeNum <= 3 ? 200 : gradeNum <= 6 ? 400 : 600;
        
        if (contentLength > maxLength && difficulty === 'easy') {
            return false; // Too long for easy questions
        }
        
        return true;
    }

    /**
     * Check if question is educationally valid
     */
    isEducationallyValid(question, subject) {
        const content = question.content || '';
        const options = question.options || [];
        const correctAnswer = question.correctAnswer || '';
        const explanation = question.explanation || '';
        
        // Must have real content
        if (content.length < 10) return false;
        
        // Must have 4 options
        if (options.length !== 4) return false;
        
        // Correct answer must be one of the options
        if (!options.includes(correctAnswer)) return false;
        
        // Must have explanation
        if (explanation.length < 5) return false;
        
        // Subject-specific validation
        if (subject === 'math') {
            // Math questions should contain numbers or mathematical concepts
            const mathPattern = /\d+|plus|minus|add|subtract|multiply|divide|equals|fraction|decimal/i;
            if (!mathPattern.test(content)) return false;
        }
        
        if (subject === 'reading') {
            // Reading questions should contain passages
            if (!content.includes('Read this') && !content.includes('passage')) return false;
        }
        
        return true;
    }

    /**
     * Parse and validate Ollama response with strict quality control
     */
    parseAndValidateResponse(response, subject, grade, difficulty) {
        try {
            // Clean and extract JSON
            let jsonStr = response.trim();
            
            // Remove markdown formatting
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
            
            // Find JSON array bounds
            const start = jsonStr.indexOf('[');
            const end = jsonStr.lastIndexOf(']') + 1;
            
            if (start === -1 || end === 0) {
                throw new Error('No JSON array found in response');
            }
            
            jsonStr = jsonStr.substring(start, end);
            const questions = JSON.parse(jsonStr);
            
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array');
            }
            
            console.log(`📊 Received ${questions.length} questions from Ollama`);
            
            // Validate question quality
            const { validQuestions, issues } = this.validateQuestionQuality(questions, subject, grade, difficulty);
            
            if (issues.length > 0) {
                console.log(`⚠️  Quality issues found:`);
                issues.forEach(issue => console.log(`   - ${issue}`));
            }
            
            console.log(`✅ ${validQuestions.length} questions passed quality validation`);
            
            // Enhance valid questions with proper IDs
            const enhancedQuestions = validQuestions.map((q, index) => {
                const questionId = `${difficulty}${grade}_${Date.now()}_${String(index + 1).padStart(3, '0')}`;
                
                return {
                    _id: questionId,
                    content: q.content,
                    type: 'multiple_choice',
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    subject: subject,
                    grade: grade,
                    difficulty: difficulty,
                    explanation: q.explanation,
                    _cacheBreaker: `${Date.now()}_${index}`
                };
            });
            
            // If we don't have enough valid questions, we need to regenerate
            if (enhancedQuestions.length < this.questionsPerFile * 0.8) { // At least 80% should be valid
                throw new Error(`Only ${enhancedQuestions.length} valid questions out of ${this.questionsPerFile} required`);
            }
            
            return enhancedQuestions.slice(0, this.questionsPerFile);
            
        } catch (error) {
            console.error(`❌ Failed to parse/validate response: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generate questions for a single file with quality assurance
     */
    async generateQualityFile(subject, grade, difficulty) {
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(this.questionsDir, filename);
        
        console.log(`\n📝 Generating ${filename} (${this.questionsPerFile} questions)...`);
        
        try {
            const prompt = this.generateDetailedPrompt(subject, grade, difficulty);
            const response = await this.callOllamaWithRetry(prompt);
            const questions = this.parseAndValidateResponse(response, subject, grade, difficulty);
            
            // Write questions to file
            fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
            
            console.log(`✅ Successfully generated ${filename} with ${questions.length} quality questions`);
            return { success: true, count: questions.length, filename };
            
        } catch (error) {
            console.error(`❌ Failed to generate ${filename}: ${error.message}`);
            console.log(`⚠️  This file will need manual attention or regeneration`);
            return { success: false, count: 0, filename, error: error.message };
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const generator = new ImprovedQuestionGenerator();
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🎯 Improved Question Generator - 50 Real Questions with Quality Validation

USAGE:
  node improved_question_generator.js [OPTIONS]

OPTIONS:
  --test                     Test with single file (Grade 5 Easy Math)
  --subject SUBJECT          Generate for one subject
  --grade GRADE             Generate for one grade (1-12)
  --difficulty DIFF         Generate for one difficulty (easy, medium, hard)
  --file "grade,diff,subj"  Generate specific file
  --help, -h                Show this help

EXAMPLES:
  # Test with quality validation
  node improved_question_generator.js --test

  # Generate specific file
  node improved_question_generator.js --file "5,easy,math"

  # Generate all math for grade 5
  node improved_question_generator.js --subject math --grade 5
        `);
        return;
    }
    
    try {
        if (args.includes('--test')) {
            console.log('🧪 Testing with Grade 5 Easy Math (50 questions with validation)');
            const result = await generator.generateQualityFile('math', '5', 'easy');
            
            if (result.success) {
                console.log('\n🎉 Test successful! Check the generated file for quality.');
            } else {
                console.log('\n❌ Test failed. Please check Ollama setup and try again.');
            }
            
        } else if (args.includes('--file')) {
            const fileSpec = args[args.indexOf('--file') + 1];
            const [grade, difficulty, subject] = fileSpec.split(',');
            
            await generator.generateQualityFile(subject, grade, difficulty);
            
        } else if (args.includes('--subject') && args.includes('--grade')) {
            const subject = args[args.indexOf('--subject') + 1];
            const grade = args[args.indexOf('--grade') + 1];
            
            console.log(`🚀 Generating all ${subject} questions for Grade ${grade}`);
            
            for (const difficulty of ['easy', 'medium', 'hard']) {
                await generator.generateQualityFile(subject, grade, difficulty);
                
                // Wait between generations
                console.log('⏳ Waiting 3 seconds before next generation...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
        } else {
            console.log('🎯 Improved Question Generator');
            console.log('Use --help for options or --test for quality test');
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ImprovedQuestionGenerator;
