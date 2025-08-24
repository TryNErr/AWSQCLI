#!/usr/bin/env node

const OptimizedQuestionGenerator = require('./optimized_question_generator.js');

/**
 * Test single file generation with the optimized generator
 */
async function testSingleGeneration() {
    console.log('🧪 Testing Optimized Question Generator - Single File');
    console.log('==================================================\n');
    
    const generator = new OptimizedQuestionGenerator();
    
    try {
        // Test with Grade 5 Easy Math - should be quick and simple
        console.log('📝 Testing: Grade 5 Easy Math questions');
        console.log('⏱️  This should take 1-3 minutes with Ollama...\n');
        
        const result = await generator.generateSingleFile('math', '5', 'easy');
        
        if (result.success) {
            console.log('\n✅ Test successful!');
            console.log(`📊 Generated ${result.count} questions`);
            
            // Show a sample of the generated file
            const fs = require('fs');
            const filePath = '/workspace/AWSQCLI/testace-app/frontend/public/questions/5_easy_math.json';
            
            if (fs.existsSync(filePath)) {
                const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                console.log('\n📋 Sample generated question:');
                console.log(JSON.stringify(questions[0], null, 2));
            }
            
            console.log('\n🚀 Ready to generate more files!');
            console.log('💡 Try: node optimized_question_generator.js --subjects math --grades 5 --backup');
            
        } else {
            console.log('\n⚠️  Test completed with fallback questions');
            console.log('🔧 This means Ollama had issues, but the system still works');
        }
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n🔍 Troubleshooting tips:');
        console.log('1. Check if Ollama is running: ollama list');
        console.log('2. Try a simpler prompt with: ./chat_with_ollama.sh ask "Hello"');
        console.log('3. Restart Ollama service if needed');
    }
}

// Run the test
if (require.main === module) {
    testSingleGeneration().catch(console.error);
}
