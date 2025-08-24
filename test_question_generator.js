#!/usr/bin/env node

const OllamaQuestionGenerator = require('./ollama_question_generator.js');

/**
 * Test the Ollama Question Generator with a small sample
 */
async function testGenerator() {
    console.log('🧪 Testing Ollama Question Generator...\n');
    
    const generator = new OllamaQuestionGenerator();
    
    try {
        // Test with a single file - Grade 5 Easy Math
        console.log('📝 Testing with Grade 5 Easy Math questions...');
        
        const prompt = generator.generatePrompt('math', '5', 'easy');
        console.log('📋 Generated prompt preview:');
        console.log(prompt.substring(0, 300) + '...\n');
        
        console.log('🤖 Calling Ollama model (this may take a moment)...');
        const response = await generator.callOllama(prompt);
        
        console.log('✅ Received response from Ollama');
        console.log('📄 Response preview:');
        console.log(response.substring(0, 500) + '...\n');
        
        // Parse the response
        const questions = generator.parseOllamaResponse(response, 'math', '5', 'easy');
        
        console.log(`🎯 Successfully parsed ${questions.length} questions!`);
        console.log('\n📋 Sample question:');
        console.log(JSON.stringify(questions[0], null, 2));
        
        return true;
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

// Run the test
if (require.main === module) {
    testGenerator().then(success => {
        if (success) {
            console.log('\n✅ Test completed successfully!');
            console.log('🚀 You can now run the full generator with:');
            console.log('   node ollama_question_generator.js --help');
        } else {
            console.log('\n❌ Test failed. Please check your Ollama setup.');
            process.exit(1);
        }
    }).catch(console.error);
}
