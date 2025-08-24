#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Ollama Question Generator for TestAce
 * 
 * This script uses your local Ollama model to generate diverse, high-quality questions
 * for all subjects, grades, and difficulty levels in the TestAce project.
 */

class OllamaQuestionGenerator {
    constructor() {
        this.questionsDir = '/workspace/AWSQCLI/testace-app/frontend/public/questions';
        this.model = 'deepseek-r1:latest';
        this.subjects = ['math', 'english', 'reading', 'mathematical-reasoning', 'thinking-skills'];
        this.grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        this.difficulties = ['easy', 'medium', 'hard'];
        this.questionsPerFile = 10; // Number of questions per file
    }

    /**
     * Generate a comprehensive prompt for Ollama based on subject, grade, and difficulty
     */
    generatePrompt(subject, grade, difficulty) {
        const basePrompts = {
            math: {
                easy: `Generate ${this.questionsPerFile} unique, age-appropriate math questions for Grade ${grade} students at EASY difficulty level.

REQUIREMENTS:
- Focus on fundamental concepts: basic arithmetic, simple fractions, basic geometry
- Use clear, simple language appropriate for Grade ${grade}
- Include real-world scenarios that students can relate to
- Ensure questions test understanding, not just memorization
- Provide 4 multiple choice options with only ONE correct answer
- Include clear, educational explanations

TOPICS FOR GRADE ${grade}:
${this.getMathTopics(grade, 'easy')}

FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "content": "Question text here",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "subject": "math",
    "grade": "${grade}",
    "difficulty": "easy",
    "explanation": "Clear explanation of why this answer is correct"
  }
]

Make each question unique and engaging. Avoid repetitive patterns.`,

                medium: `Generate ${this.questionsPerFile} challenging math questions for Grade ${grade} students at MEDIUM difficulty level.

REQUIREMENTS:
- Build on fundamental concepts with more complex applications
- Include multi-step problems and logical reasoning
- Use varied question formats and scenarios
- Test deeper understanding and problem-solving skills
- Provide 4 multiple choice options with only ONE correct answer
- Include detailed explanations showing solution steps

TOPICS FOR GRADE ${grade}:
${this.getMathTopics(grade, 'medium')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Make each question unique, challenging, and educationally valuable.`,

                hard: `Generate ${this.questionsPerFile} advanced math questions for Grade ${grade} students at HARD difficulty level.

REQUIREMENTS:
- Present complex, multi-layered problems requiring critical thinking
- Include abstract concepts and advanced applications
- Challenge students to synthesize multiple mathematical concepts
- Use sophisticated scenarios and real-world applications
- Provide 4 multiple choice options with only ONE correct answer
- Include comprehensive explanations with step-by-step solutions

TOPICS FOR GRADE ${grade}:
${this.getMathTopics(grade, 'hard')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Create intellectually stimulating questions that push students' mathematical thinking.`
            },

            english: {
                easy: `Generate ${this.questionsPerFile} engaging English language questions for Grade ${grade} students at EASY difficulty level.

REQUIREMENTS:
- Focus on basic grammar, vocabulary, and sentence structure
- Use age-appropriate vocabulary and concepts
- Include questions about parts of speech, simple punctuation, basic spelling
- Make questions relatable and interesting for Grade ${grade} students
- Provide 4 multiple choice options with only ONE correct answer
- Include clear explanations that help students learn

TOPICS FOR GRADE ${grade}:
${this.getEnglishTopics(grade, 'easy')}

FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "content": "Question text here",
    "type": "multiple_choice", 
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "subject": "english",
    "grade": "${grade}",
    "difficulty": "easy",
    "explanation": "Clear explanation of the grammar rule or concept"
  }
]

Create diverse, educational questions that build language skills.`,

                medium: `Generate ${this.questionsPerFile} comprehensive English questions for Grade ${grade} students at MEDIUM difficulty level.

REQUIREMENTS:
- Cover intermediate grammar, vocabulary, and writing concepts
- Include questions about sentence types, punctuation rules, word usage
- Test understanding of literary devices and text structure
- Use varied and engaging question formats
- Provide 4 multiple choice options with only ONE correct answer
- Include detailed explanations that reinforce learning

TOPICS FOR GRADE ${grade}:
${this.getEnglishTopics(grade, 'medium')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Focus on building stronger language and analytical skills.`,

                hard: `Generate ${this.questionsPerFile} advanced English questions for Grade ${grade} students at HARD difficulty level.

REQUIREMENTS:
- Present complex grammar, advanced vocabulary, and sophisticated writing concepts
- Include analysis of literary techniques, advanced punctuation, complex sentence structures
- Challenge students with nuanced language usage and critical thinking
- Use sophisticated scenarios and advanced concepts
- Provide 4 multiple choice options with only ONE correct answer
- Include comprehensive explanations with detailed reasoning

TOPICS FOR GRADE ${grade}:
${this.getEnglishTopics(grade, 'hard')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Create intellectually challenging questions that develop advanced language skills.`
            },

            reading: {
                easy: `Generate ${this.questionsPerFile} engaging reading comprehension questions for Grade ${grade} students at EASY difficulty level.

REQUIREMENTS:
- Include short, age-appropriate passages (2-4 sentences)
- Focus on basic comprehension: main idea, simple details, basic inference
- Use familiar topics and vocabulary appropriate for Grade ${grade}
- Create questions that test understanding of what was directly stated
- Provide 4 multiple choice options with only ONE correct answer
- Include clear explanations referencing the passage

PASSAGE TOPICS FOR GRADE ${grade}:
${this.getReadingTopics(grade, 'easy')}

FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "content": "Read this passage:\\n\\n[SHORT PASSAGE HERE]\\n\\nQuestion about the passage?",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "subject": "reading",
    "grade": "${grade}",
    "difficulty": "easy",
    "explanation": "Explanation referencing specific parts of the passage"
  }
]

Create diverse passages and questions that build reading comprehension skills.`,

                medium: `Generate ${this.questionsPerFile} comprehensive reading questions for Grade ${grade} students at MEDIUM difficulty level.

REQUIREMENTS:
- Include moderate-length passages (4-6 sentences)
- Test inference, cause-and-effect, character analysis, and theme identification
- Use varied topics that challenge students' thinking
- Create questions requiring deeper analysis of the text
- Provide 4 multiple choice options with only ONE correct answer
- Include detailed explanations showing reasoning process

PASSAGE TOPICS FOR GRADE ${grade}:
${this.getReadingTopics(grade, 'medium')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Focus on developing analytical and inferential reading skills.`,

                hard: `Generate ${this.questionsPerFile} advanced reading comprehension questions for Grade ${grade} students at HARD difficulty level.

REQUIREMENTS:
- Include complex passages (6-8 sentences) with sophisticated vocabulary
- Test critical analysis, complex inference, literary devices, and abstract concepts
- Use challenging topics that require deep thinking and analysis
- Create questions that synthesize multiple elements from the passage
- Provide 4 multiple choice options with only ONE correct answer
- Include comprehensive explanations with detailed textual analysis

PASSAGE TOPICS FOR GRADE ${grade}:
${this.getReadingTopics(grade, 'hard')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Create intellectually demanding questions that develop advanced reading analysis skills.`
            },

            'mathematical-reasoning': {
                easy: `Generate ${this.questionsPerFile} logical mathematical reasoning questions for Grade ${grade} students at EASY difficulty level.

REQUIREMENTS:
- Focus on basic patterns, simple logic, and fundamental reasoning
- Use visual patterns, number sequences, and basic problem-solving
- Present problems in clear, understandable language for Grade ${grade}
- Test logical thinking rather than complex calculations
- Provide 4 multiple choice options with only ONE correct answer
- Include explanations that show the reasoning process

REASONING TOPICS FOR GRADE ${grade}:
${this.getReasoningTopics(grade, 'easy')}

FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "content": "Question presenting a logical problem or pattern",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "subject": "mathematical-reasoning",
    "grade": "${grade}",
    "difficulty": "easy",
    "explanation": "Step-by-step explanation of the logical reasoning"
  }
]

Create engaging problems that develop logical thinking skills.`,

                medium: `Generate ${this.questionsPerFile} challenging mathematical reasoning questions for Grade ${grade} students at MEDIUM difficulty level.

REQUIREMENTS:
- Present multi-step logical problems and complex patterns
- Include spatial reasoning, advanced sequences, and analytical thinking
- Test ability to apply logical principles to solve problems
- Use varied scenarios that require systematic thinking
- Provide 4 multiple choice options with only ONE correct answer
- Include detailed explanations showing logical steps

REASONING TOPICS FOR GRADE ${grade}:
${this.getReasoningTopics(grade, 'medium')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Focus on developing systematic logical thinking and problem-solving strategies.`,

                hard: `Generate ${this.questionsPerFile} advanced mathematical reasoning questions for Grade ${grade} students at HARD difficulty level.

REQUIREMENTS:
- Present complex logical puzzles requiring sophisticated reasoning
- Include abstract patterns, advanced logical principles, and critical analysis
- Challenge students with multi-layered problems requiring creative thinking
- Test ability to synthesize multiple logical concepts
- Provide 4 multiple choice options with only ONE correct answer
- Include comprehensive explanations with detailed logical analysis

REASONING TOPICS FOR GRADE ${grade}:
${this.getReasoningTopics(grade, 'hard')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Create intellectually stimulating problems that push logical reasoning abilities.`
            },

            'thinking-skills': {
                easy: `Generate ${this.questionsPerFile} engaging thinking skills questions for Grade ${grade} students at EASY difficulty level.

REQUIREMENTS:
- Focus on basic critical thinking, simple problem-solving, and observation skills
- Use everyday scenarios and familiar situations for Grade ${grade} students
- Test ability to make simple connections and basic analysis
- Present problems that develop foundational thinking skills
- Provide 4 multiple choice options with only ONE correct answer
- Include explanations that model good thinking processes

THINKING TOPICS FOR GRADE ${grade}:
${this.getThinkingTopics(grade, 'easy')}

FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "content": "Question presenting a thinking challenge or scenario",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "subject": "thinking-skills",
    "grade": "${grade}",
    "difficulty": "easy",
    "explanation": "Explanation showing the thinking process and reasoning"
  }
]

Create questions that develop fundamental critical thinking abilities.`,

                medium: `Generate ${this.questionsPerFile} comprehensive thinking skills questions for Grade ${grade} students at MEDIUM difficulty level.

REQUIREMENTS:
- Present multi-faceted problems requiring analytical thinking
- Include decision-making scenarios, cause-and-effect analysis, and evaluation skills
- Test ability to compare, contrast, and synthesize information
- Use varied contexts that challenge different thinking skills
- Provide 4 multiple choice options with only ONE correct answer
- Include detailed explanations showing analytical processes

THINKING TOPICS FOR GRADE ${grade}:
${this.getThinkingTopics(grade, 'medium')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Focus on developing systematic analytical and evaluative thinking skills.`,

                hard: `Generate ${this.questionsPerFile} advanced thinking skills questions for Grade ${grade} students at HARD difficulty level.

REQUIREMENTS:
- Present complex scenarios requiring sophisticated critical thinking
- Include abstract reasoning, advanced problem-solving, and creative thinking
- Challenge students with multi-dimensional problems requiring innovative solutions
- Test ability to think creatively and evaluate complex situations
- Provide 4 multiple choice options with only ONE correct answer
- Include comprehensive explanations with detailed critical analysis

THINKING TOPICS FOR GRADE ${grade}:
${this.getThinkingTopics(grade, 'hard')}

FORMAT: Return ONLY a valid JSON array with the exact structure shown above.
Create intellectually challenging questions that develop advanced critical thinking skills.`
            }
        };

        return basePrompts[subject][difficulty];
    }

    /**
     * Get appropriate math topics based on grade and difficulty
     */
    getMathTopics(grade, difficulty) {
        const topics = {
            '1': {
                easy: 'Counting 1-20, basic addition/subtraction within 10, shapes recognition, comparing numbers',
                medium: 'Addition/subtraction within 20, simple word problems, basic measurement, time to the hour',
                hard: 'Two-digit addition/subtraction, complex word problems, money counting, advanced time concepts'
            },
            '2': {
                easy: 'Addition/subtraction within 100, place value, basic multiplication concepts, simple fractions',
                medium: 'Multi-step word problems, measurement units, data interpretation, skip counting',
                hard: 'Three-digit numbers, advanced multiplication, complex fractions, geometric reasoning'
            },
            '3': {
                easy: 'Multiplication tables, division basics, fraction concepts, area and perimeter',
                medium: 'Multi-digit multiplication, fraction operations, decimal introduction, data analysis',
                hard: 'Complex word problems, advanced fractions, measurement conversions, geometric properties'
            },
            '4': {
                easy: 'Multi-digit operations, equivalent fractions, decimal basics, angle concepts',
                medium: 'Fraction operations, decimal operations, factor/multiple concepts, coordinate planes',
                hard: 'Complex problem solving, advanced decimals, geometric transformations, data interpretation'
            },
            '5': {
                easy: 'Decimal operations, fraction operations, basic algebra concepts, volume calculations',
                medium: 'Advanced fractions, coordinate geometry, statistical concepts, algebraic expressions',
                hard: 'Complex algebraic thinking, advanced geometry, probability concepts, multi-step reasoning'
            }
        };

        // For grades 6-12, use more advanced topics
        if (parseInt(grade) >= 6) {
            return {
                easy: 'Ratios, proportions, basic algebra, geometric concepts, statistical basics',
                medium: 'Algebraic equations, advanced geometry, probability, data analysis, functions',
                hard: 'Complex algebra, trigonometry basics, advanced statistics, calculus introduction, abstract reasoning'
            }[difficulty];
        }

        return topics[grade] ? topics[grade][difficulty] : topics['5'][difficulty];
    }

    /**
     * Get appropriate English topics based on grade and difficulty
     */
    getEnglishTopics(grade, difficulty) {
        const topics = {
            easy: 'Parts of speech, basic punctuation, simple sentence structure, common spelling patterns, vocabulary building',
            medium: 'Complex sentences, advanced punctuation, paragraph structure, literary devices, advanced vocabulary',
            hard: 'Advanced grammar, sophisticated writing techniques, complex literary analysis, advanced vocabulary usage, rhetorical devices'
        };
        return topics[difficulty];
    }

    /**
     * Get appropriate reading topics based on grade and difficulty
     */
    getReadingTopics(grade, difficulty) {
        const topics = {
            easy: 'Family stories, animal adventures, school experiences, friendship tales, simple informational texts',
            medium: 'Historical events, science concepts, character development, cause-and-effect relationships, compare-contrast texts',
            hard: 'Complex narratives, abstract concepts, advanced informational texts, literary analysis, critical thinking scenarios'
        };
        return topics[difficulty];
    }

    /**
     * Get appropriate reasoning topics based on grade and difficulty
     */
    getReasoningTopics(grade, difficulty) {
        const topics = {
            easy: 'Simple patterns, basic sequences, logical ordering, simple comparisons, basic problem-solving',
            medium: 'Complex patterns, multi-step reasoning, spatial relationships, analytical thinking, systematic problem-solving',
            hard: 'Abstract reasoning, complex logical puzzles, advanced pattern recognition, sophisticated problem-solving, creative thinking'
        };
        return topics[difficulty];
    }

    /**
     * Get appropriate thinking skills topics based on grade and difficulty
     */
    getThinkingTopics(grade, difficulty) {
        const topics = {
            easy: 'Basic decision-making, simple observation, cause-and-effect, basic categorization, everyday problem-solving',
            medium: 'Critical analysis, evaluation skills, comparison techniques, systematic thinking, decision-making strategies',
            hard: 'Advanced critical thinking, complex evaluation, creative problem-solving, abstract reasoning, sophisticated analysis'
        };
        return topics[difficulty];
    }

    /**
     * Call Ollama model with the generated prompt
     */
    async callOllama(prompt) {
        try {
            console.log('🤖 Calling Ollama model...');
            
            // Create a temporary file for the prompt to handle special characters
            const tempPromptFile = '/tmp/ollama_prompt.txt';
            fs.writeFileSync(tempPromptFile, prompt);
            
            // Call Ollama using the temporary file
            const result = execSync(`cat "${tempPromptFile}" | ollama run ${this.model}`, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer
                timeout: 300000 // 5 minute timeout
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
     * Parse and validate the JSON response from Ollama
     */
    parseOllamaResponse(response, subject, grade, difficulty) {
        try {
            // Try to extract JSON from the response
            let jsonMatch = response.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON array found in response');
            }
            
            const questions = JSON.parse(jsonMatch[0]);
            
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array');
            }

            // Validate and enhance each question
            const validatedQuestions = questions.map((q, index) => {
                const questionId = `${difficulty}${grade}_${Date.now()}_${String(index + 1).padStart(3, '0')}`;
                
                return {
                    _id: questionId,
                    content: q.content || `Generated question ${index + 1}`,
                    type: q.type || 'multiple_choice',
                    options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: q.correctAnswer || q.options?.[0] || 'Option A',
                    subject: subject,
                    grade: grade,
                    difficulty: difficulty,
                    explanation: q.explanation || 'Generated explanation',
                    _cacheBreaker: `${Date.now()}_${index}`
                };
            });

            return validatedQuestions;
        } catch (error) {
            console.error('❌ Error parsing Ollama response:', error.message);
            console.log('Raw response:', response.substring(0, 500) + '...');
            throw error;
        }
    }

    /**
     * Generate questions for a specific file
     */
    async generateQuestionsForFile(subject, grade, difficulty) {
        const filename = `${grade}_${difficulty}_${subject}.json`;
        const filepath = path.join(this.questionsDir, filename);
        
        console.log(`\n📝 Generating questions for ${filename}...`);
        
        try {
            const prompt = this.generatePrompt(subject, grade, difficulty);
            const response = await this.callOllama(prompt);
            const questions = this.parseOllamaResponse(response, subject, grade, difficulty);
            
            // Write the questions to file
            fs.writeFileSync(filepath, JSON.stringify(questions, null, 2));
            
            console.log(`✅ Generated ${questions.length} questions for ${filename}`);
            return questions.length;
        } catch (error) {
            console.error(`❌ Failed to generate questions for ${filename}:`, error.message);
            return 0;
        }
    }

    /**
     * Generate questions for all files or specific filters
     */
    async generateAllQuestions(filters = {}) {
        const { subjects, grades, difficulties } = filters;
        
        const targetSubjects = subjects || this.subjects;
        const targetGrades = grades || this.grades;
        const targetDifficulties = difficulties || this.difficulties;
        
        let totalGenerated = 0;
        let totalFiles = 0;
        
        console.log('🚀 Starting question generation with Ollama...');
        console.log(`📊 Targeting: ${targetSubjects.length} subjects × ${targetGrades.length} grades × ${targetDifficulties.length} difficulties = ${targetSubjects.length * targetGrades.length * targetDifficulties.length} files`);
        
        for (const subject of targetSubjects) {
            for (const grade of targetGrades) {
                for (const difficulty of targetDifficulties) {
                    const generated = await this.generateQuestionsForFile(subject, grade, difficulty);
                    totalGenerated += generated;
                    totalFiles++;
                    
                    // Add a small delay to prevent overwhelming the system
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        console.log(`\n🎉 Generation complete!`);
        console.log(`📈 Total files processed: ${totalFiles}`);
        console.log(`📝 Total questions generated: ${totalGenerated}`);
        
        return { totalFiles, totalGenerated };
    }

    /**
     * Backup existing questions before generation
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
            generatedBy: 'Ollama Question Generator'
        };
        
        fs.writeFileSync(
            path.join(this.questionsDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        // Update version
        const version = {
            version: Date.now(),
            lastUpdated: new Date().toISOString(),
            generatedBy: 'Ollama Question Generator'
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
    const generator = new OllamaQuestionGenerator();
    
    // Parse command line arguments
    const options = {
        backup: args.includes('--backup'),
        subjects: args.includes('--subjects') ? args[args.indexOf('--subjects') + 1]?.split(',') : null,
        grades: args.includes('--grades') ? args[args.indexOf('--grades') + 1]?.split(',') : null,
        difficulties: args.includes('--difficulties') ? args[args.indexOf('--difficulties') + 1]?.split(',') : null,
        help: args.includes('--help') || args.includes('-h')
    };
    
    if (options.help) {
        console.log(`
🤖 Ollama Question Generator for TestAce

USAGE:
  node ollama_question_generator.js [OPTIONS]

OPTIONS:
  --backup                    Backup existing questions before generation
  --subjects sub1,sub2        Generate for specific subjects (math,english,reading,mathematical-reasoning,thinking-skills)
  --grades 1,2,3             Generate for specific grades (1-12)
  --difficulties easy,medium  Generate for specific difficulties (easy,medium,hard)
  --help, -h                 Show this help message

EXAMPLES:
  # Generate all questions with backup
  node ollama_question_generator.js --backup

  # Generate only math questions for grades 1-5
  node ollama_question_generator.js --subjects math --grades 1,2,3,4,5

  # Generate easy and medium questions for all subjects
  node ollama_question_generator.js --difficulties easy,medium

  # Generate specific combination
  node ollama_question_generator.js --subjects math,english --grades 5,6 --difficulties easy --backup
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
        
        const results = await generator.generateAllQuestions(filters);
        
        // Update manifest files
        generator.updateManifestFiles();
        
        console.log('\n🎯 Question generation completed successfully!');
        console.log('🔄 You can now test the new questions in your TestAce application.');
        
    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = OllamaQuestionGenerator;
