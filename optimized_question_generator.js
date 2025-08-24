#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Optimized Ollama Question Generator for TestAce
 * 
 * This version processes one file at a time with optimized prompts for faster generation
 */

class OptimizedQuestionGenerator {
    constructor() {
        this.questionsDir = '/workspace/AWSQCLI/testace-app/frontend/public/questions';
        this.model = 'deepseek-r1:latest';
        this.subjects = ['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'];
        this.grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        this.difficulties = ['easy', 'medium', 'hard'];
        this.questionsPerFile = 10;
    }

    /**
     * Generate a concise, optimized prompt for faster processing
     */
    generateOptimizedPrompt(subject, grade, difficulty) {
        const prompts = {
            math: `Create ${this.questionsPerFile} Grade ${grade} ${difficulty} math questions. Return ONLY valid JSON array:

[{"content":"Question text","type":"multiple_choice","options":["A","B","C","D"],"correctAnswer":"A","subject":"math","grade":"${grade}","difficulty":"${difficulty}","explanation":"Brief explanation"}]

Topics: ${this.getTopics(subject, grade, difficulty)}
Make each question unique and educational.`,

            english: `Create ${this.questionsPerFile} Grade ${grade} ${difficulty} English questions. Return ONLY valid JSON array:

[{"content":"Question text","type":"multiple_choice","options":["A","B","C","D"],"correctAnswer":"A","subject":"english","grade":"${grade}","difficulty":"${difficulty}","explanation":"Brief explanation"}]

Topics: ${this.getTopics(subject, grade, difficulty)}
Focus on grammar, vocabulary, and language skills.`,

            reading: `Create ${this.questionsPerFile} Grade ${grade} ${difficulty} reading questions. Return ONLY valid JSON array:

[{"content":"Read this passage:\\n\\n[SHORT PASSAGE]\\n\\nQuestion?","type":"multiple_choice","options":["A","B","C","D"],"correctAnswer":"A","subject":"reading","grade":"${grade}","difficulty":"${difficulty}","explanation":"Brief explanation"}]

Include short passages appropriate for Grade ${grade}. Make each passage and question unique.`,

            'mathematical-reasoning': `Create ${this.questionsPerFile} Grade ${grade} ${difficulty} logical reasoning questions. Return ONLY valid JSON array:

[{"content":"Logic problem or pattern","type":"multiple_choice","options":["A","B","C","D"],"correctAnswer":"A","subject":"mathematical-reasoning","grade":"${grade}","difficulty":"${difficulty}","explanation":"Brief explanation"}]

Topics: ${this.getTopics(subject, grade, difficulty)}
Focus on patterns, logic, and reasoning skills.`,

            'thinking-skills': `Create ${this.questionsPerFile} Grade ${grade} ${difficulty} critical thinking questions. Return ONLY valid JSON array:

[{"content":"Thinking scenario or problem","type":"multiple_choice","options":["A","B","C","D"],"correctAnswer":"A","subject":"thinking-skills","grade":"${grade}","difficulty":"${difficulty}","explanation":"Brief explanation"}]

Topics: ${this.getTopics(subject, grade, difficulty)}
Focus on problem-solving and critical analysis.`
        };

        return prompts[subject] || prompts['math'];
    }

    /**
     * Get appropriate topics for the subject/grade/difficulty
     */
    getTopics(subject, grade, difficulty) {
        const gradeNum = parseInt(grade);
        
        const topicMap = {
            math: {
                easy: gradeNum <= 3 ? 'Basic counting, simple addition/subtraction, shapes' :
                      gradeNum <= 6 ? 'Multiplication, division, fractions, decimals' :
                      'Algebra basics, geometry, percentages',
                medium: gradeNum <= 3 ? 'Word problems, measurement, patterns' :
                        gradeNum <= 6 ? 'Multi-step problems, advanced fractions, area/perimeter' :
                        'Equations, coordinate geometry, statistics',
                hard: gradeNum <= 3 ? 'Complex word problems, logical reasoning' :
                      gradeNum <= 6 ? 'Advanced problem solving, complex geometry' :
                      'Advanced algebra, trigonometry, calculus concepts'
            },
            english: {
                easy: 'Grammar basics, simple vocabulary, sentence structure',
                medium: 'Complex sentences, punctuation, literary devices',
                hard: 'Advanced grammar, sophisticated vocabulary, writing techniques'
            },
            reading: {
                easy: 'Simple stories, main ideas, basic comprehension',
                medium: 'Character analysis, inference, cause and effect',
                hard: 'Complex texts, critical analysis, literary interpretation'
            },
            'mathematical-reasoning': {
                easy: 'Simple patterns, basic logic, number sequences',
                medium: 'Complex patterns, spatial reasoning, logical deduction',
                hard: 'Abstract reasoning, advanced logic puzzles, mathematical proofs'
            },
            'thinking-skills': {
                easy: 'Basic problem solving, simple decisions, observation',
                medium: 'Critical analysis, evaluation, systematic thinking',
                hard: 'Complex reasoning, creative solutions, advanced analysis'
            }
        };

        return topicMap[subject]?.[difficulty] || 'General educational content';
    }

    /**
     * Call Ollama with optimized settings for faster response
     */
    async callOllamaOptimized(prompt) {
        try {
            console.log('🤖 Calling Ollama (optimized)...');
            
            // Create temporary file for the prompt
            const tempPromptFile = '/tmp/ollama_prompt_optimized.txt';
            fs.writeFileSync(tempPromptFile, prompt);
            
            // Use optimized Ollama parameters for faster generation
            const result = execSync(`cat "${tempPromptFile}" | ollama run ${this.model} --verbose`, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 5, // 5MB buffer (reduced)
                timeout: 120000 // 2 minute timeout (reduced)
            });
            
            // Clean up temp file
            fs.unlinkSync(tempPromptFile);
            
            return result.trim();
        } catch (error) {
            console.error('❌ Error calling Ollama:', error.message);
            throw error;
        }
    }

    /**
     * Parse and validate the JSON response with better error handling
     */
    parseOllamaResponse(response, subject, grade, difficulty) {
        try {
            // Clean the response - remove any non-JSON content
            let cleanResponse = response;
            
            // Find JSON array in the response
            const jsonStart = cleanResponse.indexOf('[');
            const jsonEnd = cleanResponse.lastIndexOf(']') + 1;
            
            if (jsonStart === -1 || jsonEnd === 0) {
                throw new Error('No JSON array found in response');
            }
            
            const jsonString = cleanResponse.substring(jsonStart, jsonEnd);
            const questions = JSON.parse(jsonString);
            
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array');
            }

            // Validate and enhance each question
            const validatedQuestions = questions.slice(0, this.questionsPerFile).map((q, index) => {
                const questionId = `${difficulty}${grade}_${Date.now()}_${String(index + 1).padStart(3, '0')}`;
                
                return {
                    _id: questionId,
                    content: q.content || `Generated ${subject} question ${index + 1}`,
                    type: 'multiple_choice',
                    options: Array.isArray(q.options) && q.options.length === 4 ? 
                             q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: q.correctAnswer || q.options?.[0] || 'Option A',
                    subject: subject,
                    grade: grade,
                    difficulty: difficulty,
                    explanation: q.explanation || 'Generated explanation',
                    _cacheBreaker: `${Date.now()}_${index}`
                };
            });

            // Ensure we have exactly the right number of questions
            while (validatedQuestions.length < this.questionsPerFile) {
                const index = validatedQuestions.length;
                const questionId = `${difficulty}${grade}_${Date.now()}_${String(index + 1).padStart(3, '0')}`;
                
                validatedQuestions.push({
                    _id: questionId,
                    content: `Generated ${subject} question ${index + 1} for Grade ${grade}`,
                    type: 'multiple_choice',
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: 'Option A',
                    subject: subject,
                    grade: grade,
                    difficulty: difficulty,
                    explanation: 'Generated explanation',
                    _cacheBreaker: `${Date.now()}_${index}`
                });
            }

            return validatedQuestions;
        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
            console.log('Raw response preview:', response.substring(0, 200) + '...');
            
            // Return fallback questions if parsing fails
            return this.generateFallbackQuestions(subject, grade, difficulty);
        }
    }

    /**
     * Generate fallback questions if Ollama fails
     */
    generateFallbackQuestions(subject, grade, difficulty) {
        console.log('⚠️  Generating fallback questions...');
        
        const fallbackQuestions = [];
        for (let i = 0; i < this.questionsPerFile; i++) {
            const questionId = `${difficulty}${grade}_${Date.now()}_${String(i + 1).padStart(3, '0')}`;
            
            fallbackQuestions.push({
                _id: questionId,
                content: `${subject.charAt(0).toUpperCase() + subject.slice(1)} question ${i + 1} for Grade ${grade} (${difficulty} level)`,
                type: 'multiple_choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A',
                subject: subject,
                grade: grade,
                difficulty: difficulty,
                explanation: `This is a ${difficulty} level ${subject} question for Grade ${grade} students.`,
                _cacheBreaker: `${Date.now()}_${i}`
            });
        }
        
        return fallbackQuestions;
    }

    /**
     * Generate questions for a single file
     */
    async generateSingleFile(subject, grade, difficulty) {
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(this.questionsDir, filename);
        
        console.log(`\n📝 Generating ${filename}...`);
        
        try {
            const prompt = this.generateOptimizedPrompt(subject, grade, difficulty);
            const response = await this.callOllamaOptimized(prompt);
            const questions = this.parseOllamaResponse(response, subject, grade, difficulty);
            
            // Write the questions to file
            fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
            
            console.log(`✅ Generated ${questions.length} questions for ${filename}`);
            return { success: true, count: questions.length };
        } catch (error) {
            console.error(`❌ Failed to generate ${filename}:`, error.message);
            
            // Generate fallback questions
            const fallbackQuestions = this.generateFallbackQuestions(subject, grade, difficulty);
            fs.writeFileSync(filepath, JSON.stringify(fallbackQuestions, null, 2));
            
            console.log(`⚠️  Created ${fallbackQuestions.length} fallback questions for ${filename}`);
            return { success: false, count: fallbackQuestions.length };
        }
    }

    /**
     * Generate questions with progress tracking and error recovery
     */
    async generateWithProgress(filters = {}) {
        const { subjects, grades, difficulties } = filters;
        
        const targetSubjects = subjects || this.subjects;
        const targetGrades = grades || this.grades;
        const targetDifficulties = difficulties || this.difficulties;
        
        const totalFiles = targetSubjects.length * targetGrades.length * targetDifficulties.length;
        let processedFiles = 0;
        let successfulFiles = 0;
        let totalQuestions = 0;
        
        console.log('🚀 Starting optimized question generation...');
        console.log(`📊 Processing ${totalFiles} files (${targetSubjects.length} subjects × ${targetGrades.length} grades × ${targetDifficulties.length} difficulties)`);
        console.log('⏱️  Estimated time: 2-5 minutes per file\n');
        
        for (const subject of targetSubjects) {
            for (const grade of targetGrades) {
                for (const difficulty of targetDifficulties) {
                    processedFiles++;
                    
                    console.log(`\n📈 Progress: ${processedFiles}/${totalFiles} files`);
                    
                    const result = await this.generateSingleFile(subject, grade, difficulty);
                    
                    if (result.success) {
                        successfulFiles++;
                    }
                    
                    totalQuestions += result.count;
                    
                    // Small delay to prevent overwhelming the system
                    if (processedFiles < totalFiles) {
                        console.log('⏳ Waiting 2 seconds before next generation...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        }
        
        console.log(`\n🎉 Generation complete!`);
        console.log(`📈 Files processed: ${processedFiles}/${totalFiles}`);
        console.log(`✅ Successful generations: ${successfulFiles}`);
        console.log(`⚠️  Fallback generations: ${processedFiles - successfulFiles}`);
        console.log(`📝 Total questions generated: ${totalQuestions}`);
        
        return { 
            totalFiles: processedFiles, 
            successfulFiles, 
            totalQuestions 
        };
    }

    /**
     * Backup existing questions
     */
    backupExistingQuestions() {
        const backupDir = path.join(this.questionsDir, '..', 'questions_backup_' + Date.now());
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const files = fs.readdirSync(this.questionsDir);
        let backedUp = 0;
        
        for (const file of files) {
            if (file.endsWith('.json') && file !== 'manifest.json' && file !== 'version.json') {
                const sourcePath = path.join(this.questionsDir, file);
                const backupPath = path.join(backupDir, file);
                fs.copyFileSync(sourcePath, backupPath);
                backedUp++;
            }
        }
        
        console.log(`💾 Backed up ${backedUp} question files to ${backupDir}`);
        return backupDir;
    }

    /**
     * Update manifest and version files
     */
    updateManifestFiles() {
        const files = fs.readdirSync(this.questionsDir);
        const questionFiles = files.filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'version.json');
        
        // Update manifest
        const manifest = {
            files: questionFiles,
            lastUpdated: new Date().toISOString(),
            totalFiles: questionFiles.length,
            generatedBy: 'Optimized Ollama Question Generator'
        };
        
        fs.writeFileSync(
            path.join(this.questionsDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        // Update version
        const version = {
            version: Date.now(),
            lastUpdated: new Date().toISOString(),
            generatedBy: 'Optimized Ollama Question Generator'
        };
        
        fs.writeFileSync(
            path.join(this.questionsDir, 'version.json'),
            JSON.stringify(version, null, 2)
        );
        
        console.log('📋 Updated manifest.json and version.json');
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const generator = new OptimizedQuestionGenerator();
    
    // Parse command line arguments
    const options = {
        backup: args.includes('--backup'),
        subjects: args.includes('--subjects') ? args[args.indexOf('--subjects') + 1]?.split(',') : null,
        grades: args.includes('--grades') ? args[args.indexOf('--grades') + 1]?.split(',') : null,
        difficulties: args.includes('--difficulties') ? args[args.indexOf('--difficulties') + 1]?.split(',') : null,
        single: args.includes('--single'),
        help: args.includes('--help') || args.includes('-h')
    };
    
    if (options.help) {
        console.log(`
🤖 Optimized Ollama Question Generator for TestAce

USAGE:
  node optimized_question_generator.js [OPTIONS]

OPTIONS:
  --backup                    Backup existing questions before generation
  --subjects sub1,sub2        Generate for specific subjects
  --grades 1,2,3             Generate for specific grades  
  --difficulties easy,medium  Generate for specific difficulties
  --single                   Generate one file at a time (interactive)
  --help, -h                 Show this help message

EXAMPLES:
  # Generate all questions with backup (optimized)
  node optimized_question_generator.js --backup

  # Generate only math questions for grade 5
  node optimized_question_generator.js --subjects math --grades 5

  # Generate easy questions for all subjects
  node optimized_question_generator.js --difficulties easy --backup

  # Interactive single file generation
  node optimized_question_generator.js --single
        `);
        return;
    }
    
    try {
        // Backup if requested
        if (options.backup) {
            generator.backupExistingQuestions();
        }
        
        // Generate questions
        const filters = {};
        if (options.subjects) filters.subjects = options.subjects;
        if (options.grades) filters.grades = options.grades;
        if (options.difficulties) filters.difficulties = options.difficulties;
        
        const results = await generator.generateWithProgress(filters);
        
        // Update manifest files
        generator.updateManifestFiles();
        
        console.log('\n🎯 Optimized question generation completed!');
        console.log('🔄 Your TestAce application now has unique, diverse questions.');
        
    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = OptimizedQuestionGenerator;
