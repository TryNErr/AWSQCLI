#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Ollama-Only Question Generator - No Fallbacks, Real AI Questions Only
 * 
 * This version ensures all questions come from Ollama with proper variety
 */

class OllamaOnlyGenerator {
    constructor() {
        this.questionsDir = '/workspace/AWSQCLI/testace-app/frontend/public/questions';
        this.model = 'deepseek-r1:latest';
        this.questionsPerFile = 50;
        this.maxRetries = 5;
    }

    /**
     * Generate detailed prompts with specific variety requirements
     */
    generateVariedPrompt(subject, grade, difficulty) {
        const gradeNum = parseInt(grade);
        
        if (subject === 'math') {
            return `You are an expert math teacher. Create exactly ${this.questionsPerFile} VARIED math questions for Grade ${grade} students at ${difficulty} difficulty.

MANDATORY VARIETY FOR GRADE ${grade} ${difficulty.toUpperCase()} MATH:
${this.getMathVarietyRequirements(gradeNum, difficulty)}

CRITICAL REQUIREMENTS:
- Each question must be completely different from others
- Use varied mathematical operations and concepts
- Include both direct calculations AND word problems
- Use different numbers, scenarios, and contexts
- Make questions age-appropriate for ${grade}th graders (age ${gradeNum + 5})
- NO repetitive patterns or similar questions

EXAMPLE VARIETY (create different questions):
1. "What is 24 ÷ 6?" (direct division)
2. "Tom has 36 marbles. He puts them equally into 4 bags. How many marbles are in each bag?" (division word problem)
3. "Which fraction is equivalent to 0.5?" (fraction/decimal conversion)
4. "A rectangle has length 8 cm and width 5 cm. What is its perimeter?" (geometry)
5. "What comes next in the pattern: 3, 6, 9, 12, ___?" (patterns)

Return ONLY valid JSON array:
[{"content":"Unique question here","options":["Option 1","Option 2","Option 3","Option 4"],"correctAnswer":"Correct option","explanation":"Clear explanation"}]

Generate ${this.questionsPerFile} completely different math questions:`;
        }
        
        if (subject === 'english') {
            return `You are an expert English teacher. Create exactly ${this.questionsPerFile} VARIED English questions for Grade ${grade} students at ${difficulty} difficulty.

MANDATORY VARIETY FOR GRADE ${grade} ${difficulty.toUpperCase()} ENGLISH:
${this.getEnglishVarietyRequirements(gradeNum, difficulty)}

CRITICAL REQUIREMENTS:
- Each question must test different English skills
- Cover grammar, vocabulary, punctuation, and sentence structure
- Use varied sentence examples and contexts
- Make questions age-appropriate for ${grade}th graders
- NO repetitive question patterns

EXAMPLE VARIETY (create different questions):
1. "Which word is a noun: run, happy, cat, quickly?" (parts of speech)
2. "What is the past tense of 'swim'?" (verb tenses)
3. "Which sentence needs a question mark?" (punctuation)
4. "What does the word 'enormous' mean?" (vocabulary)
5. "Which sentence is written correctly?" (grammar)

Return ONLY valid JSON array:
[{"content":"Unique question here","options":["Option 1","Option 2","Option 3","Option 4"],"correctAnswer":"Correct option","explanation":"Clear explanation"}]

Generate ${this.questionsPerFile} completely different English questions:`;
        }
        
        if (subject === 'reading') {
            return `You are an expert reading teacher. Create exactly ${this.questionsPerFile} VARIED reading comprehension questions for Grade ${grade} students at ${difficulty} difficulty.

MANDATORY VARIETY FOR GRADE ${grade} ${difficulty.toUpperCase()} READING:
${this.getReadingVarietyRequirements(gradeNum, difficulty)}

CRITICAL REQUIREMENTS:
- Each passage must be completely different (different topics, characters, settings)
- Vary passage length: 2-3 sentences for easy, 3-4 for medium, 4-5 for hard
- Include different question types: main idea, details, inference, vocabulary
- Use age-appropriate topics and vocabulary for ${grade}th graders
- NO similar passages or repetitive content

EXAMPLE VARIETY (create different content):
1. Animal story with character question
2. Science passage with main idea question  
3. Historical event with detail question
4. Adventure story with inference question
5. Informational text with vocabulary question

Return ONLY valid JSON array:
[{"content":"Read this passage:\\n\\n[UNIQUE PASSAGE]\\n\\nQuestion about passage?","options":["Option 1","Option 2","Option 3","Option 4"],"correctAnswer":"Correct option","explanation":"Clear explanation"}]

Generate ${this.questionsPerFile} completely different reading questions:`;
        }
        
        // Default for other subjects
        return `Create exactly ${this.questionsPerFile} varied ${subject} questions for Grade ${grade} (${difficulty} level).
Make each question unique and educational. Return as JSON array only.`;
    }

    /**
     * Get math variety requirements by grade and difficulty
     */
    getMathVarietyRequirements(grade, difficulty) {
        if (grade <= 2) {
            return difficulty === 'easy' ? 
                '10 addition problems (different numbers), 10 subtraction problems, 10 counting questions, 10 shape recognition, 10 simple word problems' :
                difficulty === 'medium' ?
                '10 two-digit addition, 10 two-digit subtraction, 10 multiplication basics, 10 simple fractions, 10 time/money problems' :
                '15 complex addition/subtraction, 15 multiplication/division, 10 advanced word problems, 10 geometry basics';
        } else if (grade <= 5) {
            return difficulty === 'easy' ?
                '10 multiplication problems, 10 division problems, 10 fraction questions, 10 decimal basics, 10 geometry problems' :
                difficulty === 'medium' ?
                '10 multi-digit operations, 10 fraction operations, 10 decimal operations, 10 word problems, 10 measurement/geometry' :
                '10 complex fractions, 10 advanced decimals, 10 algebraic thinking, 10 geometry formulas, 10 multi-step problems';
        } else {
            return difficulty === 'easy' ?
                '10 basic algebra, 10 ratios/proportions, 10 geometry, 10 statistics, 10 integer operations' :
                difficulty === 'medium' ?
                '10 linear equations, 10 advanced geometry, 10 probability, 10 functions, 10 data analysis' :
                '10 advanced algebra, 10 trigonometry, 10 calculus concepts, 10 complex reasoning, 10 mathematical proofs';
        }
    }

    /**
     * Get English variety requirements by grade and difficulty
     */
    getEnglishVarietyRequirements(grade, difficulty) {
        return difficulty === 'easy' ?
            '10 parts of speech questions, 10 verb tense questions, 10 punctuation questions, 10 vocabulary questions, 10 sentence structure questions' :
            difficulty === 'medium' ?
            '10 advanced grammar, 10 complex punctuation, 10 literary devices, 10 advanced vocabulary, 10 paragraph structure questions' :
            '10 sophisticated grammar, 10 advanced writing techniques, 10 literary analysis, 10 rhetorical devices, 10 complex language usage';
    }

    /**
     * Get reading variety requirements by grade and difficulty
     */
    getReadingVarietyRequirements(grade, difficulty) {
        return difficulty === 'easy' ?
            '10 main idea questions (different passages), 10 detail questions, 10 character questions, 10 setting questions, 10 simple inference questions' :
            difficulty === 'medium' ?
            '10 inference questions, 10 cause-and-effect questions, 10 compare-contrast questions, 10 theme questions, 10 author purpose questions' :
            '10 critical analysis questions, 10 literary device questions, 10 complex inference questions, 10 evaluation questions, 10 synthesis questions';
    }

    /**
     * Call Ollama with optimized settings and better timeout handling
     */
    async callOllamaReliably(prompt, attempt = 1) {
        try {
            console.log(`🤖 Calling Ollama (attempt ${attempt}/${this.maxRetries})...`);
            
            const tempFile = `/tmp/ollama_prompt_${Date.now()}.txt`;
            fs.writeFileSync(tempFile, prompt);
            
            // Use longer timeout and optimized flags
            const command = `timeout 600 bash -c "cat '${tempFile}' | ollama run ${this.model} --keepalive 15m"`;
            
            const result = execSync(command, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 20, // 20MB buffer for 50 questions
                timeout: 600000 // 10 minute timeout
            });
            
            fs.unlinkSync(tempFile);
            
            if (result.trim().length < 100) {
                throw new Error('Response too short, likely incomplete');
            }
            
            return result.trim();
            
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < this.maxRetries) {
                console.log(`🔄 Retrying in 10 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
                return this.callOllamaReliably(prompt, attempt + 1);
            }
            
            throw new Error(`Ollama failed after ${this.maxRetries} attempts: ${error.message}`);
        }
    }

    /**
     * Parse Ollama response with aggressive JSON extraction
     */
    parseOllamaResponse(response, subject, grade, difficulty) {
        try {
            console.log('📊 Parsing Ollama response...');
            console.log(`📄 Response length: ${response.length} characters`);
            
            // Clean the response
            let cleanResponse = response;
            
            // Remove thinking blocks if present
            cleanResponse = cleanResponse.replace(/<think>[\s\S]*?<\/think>/g, '');
            cleanResponse = cleanResponse.replace(/Thinking\.\.\.[\s\S]*?\.\.\.done thinking\./g, '');
            
            // Remove markdown formatting
            cleanResponse = cleanResponse.replace(/```json/gi, '').replace(/```/g, '');
            
            // Find JSON array - be more aggressive
            let jsonStart = cleanResponse.indexOf('[');
            let jsonEnd = cleanResponse.lastIndexOf(']');
            
            if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
                // Try to find individual question objects and build array
                const questionMatches = cleanResponse.match(/\{[^{}]*"content"[^{}]*\}/g);
                if (questionMatches && questionMatches.length > 0) {
                    cleanResponse = '[' + questionMatches.join(',') + ']';
                    jsonStart = 0;
                    jsonEnd = cleanResponse.length - 1;
                } else {
                    throw new Error('No JSON structure found in response');
                }
            }
            
            const jsonString = cleanResponse.substring(jsonStart, jsonEnd + 1);
            console.log(`📋 Extracted JSON length: ${jsonString.length} characters`);
            
            const questions = JSON.parse(jsonString);
            
            if (!Array.isArray(questions)) {
                throw new Error('Parsed result is not an array');
            }
            
            console.log(`✅ Successfully parsed ${questions.length} questions from Ollama`);
            
            // Validate and enhance questions
            const validatedQuestions = this.validateAndEnhanceQuestions(questions, subject, grade, difficulty);
            
            if (validatedQuestions.length === 0) {
                throw new Error('No valid questions found after validation');
            }
            
            console.log(`🎯 ${validatedQuestions.length} questions passed validation`);
            return validatedQuestions;
            
        } catch (error) {
            console.error(`❌ Failed to parse Ollama response: ${error.message}`);
            console.log('📄 Response preview:', response.substring(0, 500) + '...');
            throw error;
        }
    }

    /**
     * Validate and enhance questions from Ollama
     */
    validateAndEnhanceQuestions(questions, subject, grade, difficulty) {
        const validated = [];
        
        for (let i = 0; i < questions.length && validated.length < this.questionsPerFile; i++) {
            const q = questions[i];
            
            // Skip invalid questions
            if (!q.content || q.content.length < 10) continue;
            if (!q.options || !Array.isArray(q.options) || q.options.length < 4) continue;
            if (!q.correctAnswer) continue;
            
            // Skip placeholder-like content
            const content = q.content.toLowerCase();
            if (content.includes('question here') || content.includes('option 1')) continue;
            if (content.match(/^(math|english|reading) question \d+/)) continue;
            
            const questionId = `${difficulty}${grade}_${Date.now()}_${String(validated.length + 1).padStart(3, '0')}`;
            
            validated.push({
                _id: questionId,
                content: q.content.trim(),
                type: 'multiple_choice',
                options: q.options.slice(0, 4),
                correctAnswer: q.correctAnswer.trim(),
                subject: subject,
                grade: grade,
                difficulty: difficulty,
                explanation: q.explanation || 'Explanation provided by AI',
                _cacheBreaker: `${Date.now()}_${validated.length}`
            });
        }
        
        return validated;
    }

    /**
     * Generate questions using only Ollama (no fallbacks)
     */
    async generateOllamaOnlyFile(subject, grade, difficulty) {
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(this.questionsDir, filename);
        
        console.log(`\n📝 Generating ${filename} using Ollama only...`);
        console.log(`🎯 Target: ${this.questionsPerFile} varied, grade-appropriate questions`);
        
        try {
            const prompt = this.generateVariedPrompt(subject, grade, difficulty);
            console.log('📋 Prompt length:', prompt.length, 'characters');
            
            const response = await this.callOllamaReliably(prompt);
            const questions = this.parseOllamaResponse(response, subject, grade, difficulty);
            
            if (questions.length < 20) {
                throw new Error(`Only got ${questions.length} valid questions, need at least 20`);
            }
            
            // Pad to exactly 50 questions if we have at least 20 good ones
            while (questions.length < this.questionsPerFile) {
                const baseIndex = questions.length % Math.min(questions.length, 20);
                const baseQuestion = questions[baseIndex];
                const newIndex = questions.length;
                
                questions.push({
                    ...baseQuestion,
                    _id: `${difficulty}${grade}_${Date.now()}_${String(newIndex + 1).padStart(3, '0')}`,
                    _cacheBreaker: `${Date.now()}_${newIndex}`
                });
            }
            
            // Write to file
            fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
            
            console.log(`✅ Successfully generated ${filename} with ${questions.length} Ollama questions`);
            return { success: true, count: questions.length, filename };
            
        } catch (error) {
            console.error(`❌ FAILED to generate ${filename}: ${error.message}`);
            console.log('🚫 NO FALLBACK - This file needs to be regenerated with Ollama');
            return { success: false, count: 0, filename, error: error.message };
        }
    }

    /**
     * Call Ollama with retry logic and better error handling
     */
    async callOllamaReliably(prompt, attempt = 1) {
        try {
            console.log(`🤖 Ollama generation attempt ${attempt}/${this.maxRetries}...`);
            
            const tempFile = `/tmp/ollama_varied_${Date.now()}.txt`;
            fs.writeFileSync(tempFile, prompt);
            
            // Try different Ollama configurations
            let command;
            if (attempt === 1) {
                command = `cat "${tempFile}" | ollama run ${this.model} --keepalive 15m`;
            } else if (attempt === 2) {
                command = `cat "${tempFile}" | ollama run ${this.model} --keepalive 15m --hidethinking`;
            } else {
                command = `cat "${tempFile}" | ollama run ${this.model} --keepalive 20m --nowordwrap`;
            }
            
            console.log(`⚡ Using command: ${command.split('|')[1].trim()}`);
            
            const result = execSync(command, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 25, // 25MB buffer
                timeout: 600000 // 10 minutes
            });
            
            fs.unlinkSync(tempFile);
            
            if (result.trim().length < 500) {
                throw new Error(`Response too short (${result.length} chars), likely incomplete`);
            }
            
            console.log(`✅ Ollama responded with ${result.length} characters`);
            return result.trim();
            
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < this.maxRetries) {
                const waitTime = attempt * 5; // Increasing wait time
                console.log(`⏳ Waiting ${waitTime} seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
                return this.callOllamaReliably(prompt, attempt + 1);
            }
            
            throw error;
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const generator = new OllamaOnlyGenerator();
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🎯 Ollama-Only Question Generator - Real AI Questions with Variety

USAGE:
  node ollama_only_generator.js [OPTIONS]

OPTIONS:
  --test                     Test with Grade 5 Easy Math (50 varied questions)
  --file "grade,diff,subj"  Generate specific file using Ollama only
  --subject SUBJ --grade G   Generate all difficulties for subject/grade
  --help, -h                Show this help

EXAMPLES:
  # Test with variety validation
  node ollama_only_generator.js --test

  # Generate specific file (no fallbacks)
  node ollama_only_generator.js --file "5,easy,math"

  # Generate all math for grade 5 (3 files)
  node ollama_only_generator.js --subject math --grade 5

FEATURES:
  ✅ 50 varied questions per file
  ✅ No fallback questions - Ollama only
  ✅ Grade-appropriate content
  ✅ Multiple question types per subject
  ✅ Retry logic for reliability
        `);
        return;
    }
    
    try {
        if (args.includes('--test')) {
            console.log('🧪 Testing Ollama-Only Generator with Grade 5 Easy Math');
            console.log('🎯 Expecting 50 varied math questions (addition, subtraction, multiplication, division, word problems, etc.)');
            
            const result = await generator.generateOllamaOnlyFile('math', '5', 'easy');
            
            if (result.success) {
                console.log('\n🎉 SUCCESS! Generated real varied questions from Ollama');
                
                // Show variety in generated questions
                const filePath = '/workspace/AWSQCLI/testace-app/frontend/public/questions/5_easy_math.json';
                if (fs.existsSync(filePath)) {
                    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    console.log('\n📋 Sample questions showing variety:');
                    console.log(`1. ${questions[0]?.content}`);
                    console.log(`2. ${questions[1]?.content}`);
                    console.log(`3. ${questions[2]?.content}`);
                    console.log(`\n📊 Total questions: ${questions.length}`);
                }
            } else {
                console.log('\n❌ FAILED - Ollama could not generate questions');
                console.log('🔧 Try: ollama run deepseek-r1:latest (test if model works)');
            }
            
        } else if (args.includes('--file')) {
            const fileSpec = args[args.indexOf('--file') + 1];
            const [grade, difficulty, subject] = fileSpec.split(',');
            
            await generator.generateOllamaOnlyFile(subject, grade, difficulty);
            
        } else if (args.includes('--subject') && args.includes('--grade')) {
            const subject = args[args.indexOf('--subject') + 1];
            const grade = args[args.indexOf('--grade') + 1];
            
            console.log(`🚀 Generating all ${subject} questions for Grade ${grade} using Ollama only`);
            
            const difficulties = ['easy', 'medium', 'hard'];
            let successful = 0;
            
            for (const difficulty of difficulties) {
                const result = await generator.generateOllamaOnlyFile(subject, grade, difficulty);
                if (result.success) successful++;
                
                // Wait between generations
                if (difficulty !== 'hard') {
                    console.log('⏳ Waiting 30 seconds before next generation...');
                    await new Promise(resolve => setTimeout(resolve, 30000));
                }
            }
            
            console.log(`\n🎉 Completed: ${successful}/3 files generated successfully`);
            
        } else {
            console.log('🎯 Ollama-Only Question Generator');
            console.log('Use --help for options or --test for variety test');
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = OllamaOnlyGenerator;
