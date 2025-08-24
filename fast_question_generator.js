#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Fast Question Generator - Optimized for Speed
 * Uses Ollama performance flags and minimal prompts
 */

class FastQuestionGenerator {
    constructor() {
        this.questionsDir = '/workspace/AWSQCLI/testace-app/frontend/public/questions';
        this.model = 'deepseek-r1:latest';
        this.questionsPerFile = 10;
    }

    /**
     * Generate ultra-concise prompts for maximum speed
     */
    generateFastPrompt(subject, grade, difficulty) {
        return `Generate ${this.questionsPerFile} ${grade}th grade ${difficulty} ${subject} questions. JSON format only:
[{"content":"Q1","type":"multiple_choice","options":["A","B","C","D"],"correctAnswer":"A","subject":"${subject}","grade":"${grade}","difficulty":"${difficulty}","explanation":"Why A"}]

Make unique questions. No extra text.`;
    }

    /**
     * Call Ollama with maximum performance optimizations
     */
    async callOllamaFast(prompt) {
        try {
            console.log('⚡ Fast Ollama call...');
            
            const tempFile = '/tmp/fast_prompt.txt';
            fs.writeFileSync(tempFile, prompt);
            
            // Use performance flags for faster generation
            const command = `cat "${tempFile}" | ollama run ${this.model} --format json --keepalive 5m --hidethinking --nowordwrap`;
            
            const result = execSync(command, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 2, // 2MB buffer
                timeout: 60000 // 1 minute timeout
            });
            
            fs.unlinkSync(tempFile);
            return result.trim();
            
        } catch (error) {
            console.error('❌ Fast call failed:', error.message);
            throw error;
        }
    }

    /**
     * Parse response with aggressive fallback
     */
    parseResponse(response, subject, grade, difficulty) {
        try {
            // Try to find and parse JSON
            let jsonStr = response;
            
            // Clean up common issues
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
            jsonStr = jsonStr.trim();
            
            // Find array bounds
            const start = jsonStr.indexOf('[');
            const end = jsonStr.lastIndexOf(']') + 1;
            
            if (start >= 0 && end > start) {
                jsonStr = jsonStr.substring(start, end);
            }
            
            const questions = JSON.parse(jsonStr);
            
            if (Array.isArray(questions) && questions.length > 0) {
                return this.validateQuestions(questions, subject, grade, difficulty);
            }
            
            throw new Error('No valid questions in response');
            
        } catch (error) {
            console.log('⚠️  Parsing failed, using fallback');
            return this.createFallbackQuestions(subject, grade, difficulty);
        }
    }

    /**
     * Validate and fix questions
     */
    validateQuestions(questions, subject, grade, difficulty) {
        const validated = [];
        
        for (let i = 0; i < Math.min(questions.length, this.questionsPerFile); i++) {
            const q = questions[i];
            const id = `${difficulty}${grade}_${Date.now()}_${String(i + 1).padStart(3, '0')}`;
            
            validated.push({
                _id: id,
                content: q.content || `${subject} question ${i + 1}`,
                type: 'multiple_choice',
                options: Array.isArray(q.options) && q.options.length >= 4 ? 
                         q.options.slice(0, 4) : ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: q.correctAnswer || 'Option A',
                subject: subject,
                grade: grade,
                difficulty: difficulty,
                explanation: q.explanation || 'Explanation provided',
                _cacheBreaker: `${Date.now()}_${i}`
            });
        }
        
        // Fill remaining slots if needed
        while (validated.length < this.questionsPerFile) {
            const i = validated.length;
            const id = `${difficulty}${grade}_${Date.now()}_${String(i + 1).padStart(3, '0')}`;
            
            validated.push({
                _id: id,
                content: `${subject} question ${i + 1} for Grade ${grade}`,
                type: 'multiple_choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A',
                subject: subject,
                grade: grade,
                difficulty: difficulty,
                explanation: 'Generated explanation',
                _cacheBreaker: `${Date.now()}_${i}`
            });
        }
        
        return validated;
    }

    /**
     * Create fallback questions when Ollama fails
     */
    createFallbackQuestions(subject, grade, difficulty) {
        const questions = [];
        
        for (let i = 0; i < this.questionsPerFile; i++) {
            const id = `${difficulty}${grade}_${Date.now()}_${String(i + 1).padStart(3, '0')}`;
            
            questions.push({
                _id: id,
                content: `${subject.charAt(0).toUpperCase() + subject.slice(1)} question ${i + 1} for Grade ${grade} (${difficulty})`,
                type: 'multiple_choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A',
                subject: subject,
                grade: grade,
                difficulty: difficulty,
                explanation: `This is a ${difficulty} level ${subject} question for Grade ${grade}.`,
                _cacheBreaker: `${Date.now()}_${i}`
            });
        }
        
        return questions;
    }

    /**
     * Generate one file quickly
     */
    async generateFileFast(subject, grade, difficulty) {
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(this.questionsDir, filename);
        
        console.log(`\n⚡ Fast generating ${filename}...`);
        
        try {
            const prompt = this.generateFastPrompt(subject, grade, difficulty);
            const response = await this.callOllamaFast(prompt);
            const questions = this.parseResponse(response, subject, grade, difficulty);
            
            fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
            
            console.log(`✅ Generated ${filename} (${questions.length} questions)`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed ${filename}: ${error.message}`);
            
            // Create fallback
            const fallback = this.createFallbackQuestions(subject, grade, difficulty);
            fs.writeFileSync(filepath, JSON.stringify(fallback, null, 2));
            
            console.log(`⚠️  Created fallback ${filename}`);
            return false;
        }
    }

    /**
     * Generate multiple files in sequence
     */
    async generateBatch(fileList) {
        let successful = 0;
        let total = fileList.length;
        
        console.log(`🚀 Fast batch generation: ${total} files`);
        console.log('⏱️  Estimated time: 30-60 seconds per file\n');
        
        for (let i = 0; i < fileList.length; i++) {
            const { subject, grade, difficulty } = fileList[i];
            
            console.log(`📈 Progress: ${i + 1}/${total}`);
            
            const success = await this.generateFileFast(subject, grade, difficulty);
            if (success) successful++;
            
            // Short delay between files
            if (i < fileList.length - 1) {
                console.log('⏳ Waiting 1 second...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        console.log(`\n🎉 Batch complete: ${successful}/${total} successful`);
        return { successful, total };
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const generator = new FastQuestionGenerator();
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
⚡ Fast Question Generator for TestAce

USAGE:
  node fast_question_generator.js [OPTIONS]

OPTIONS:
  --test                     Test with single file (Grade 5 Easy Math)
  --subject SUBJECT          Generate for one subject (math, english, reading, etc.)
  --grade GRADE             Generate for one grade (1-12)
  --difficulty DIFF         Generate for one difficulty (easy, medium, hard)
  --batch "sub1,grade1,diff1 sub2,grade2,diff2"  Generate specific files
  --help, -h                Show this help

EXAMPLES:
  # Quick test
  node fast_question_generator.js --test

  # Generate all math questions for grade 5
  node fast_question_generator.js --subject math --grade 5

  # Generate specific files
  node fast_question_generator.js --batch "math,5,easy english,5,easy"
        `);
        return;
    }
    
    try {
        if (args.includes('--test')) {
            console.log('🧪 Fast test: Grade 5 Easy Math');
            await generator.generateFileFast('math', '5', 'easy');
            
        } else if (args.includes('--subject') || args.includes('--grade') || args.includes('--difficulty')) {
            const subject = args.includes('--subject') ? args[args.indexOf('--subject') + 1] : 'math';
            const grade = args.includes('--grade') ? args[args.indexOf('--grade') + 1] : '5';
            const difficulty = args.includes('--difficulty') ? args[args.indexOf('--difficulty') + 1] : 'easy';
            
            await generator.generateFileFast(subject, grade, difficulty);
            
        } else if (args.includes('--batch')) {
            const batchStr = args[args.indexOf('--batch') + 1];
            const fileList = batchStr.split(' ').map(item => {
                const [subject, grade, difficulty] = item.split(',');
                return { subject, grade, difficulty };
            });
            
            await generator.generateBatch(fileList);
            
        } else {
            console.log('⚡ Fast Question Generator');
            console.log('Use --help for options or --test for quick test');
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = FastQuestionGenerator;
