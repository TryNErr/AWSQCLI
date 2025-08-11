#!/usr/bin/env node

console.log('🔧 Testing Static Files Fix...\n');

const http = require('http');

// Test function to check if a URL returns JSON
const testUrl = (url) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            success: true,
            statusCode: res.statusCode,
            contentType: res.headers['content-type'],
            dataLength: data.length,
            questionsCount: Array.isArray(json) ? json.length : 'N/A'
          });
        } catch (error) {
          resolve({
            success: false,
            statusCode: res.statusCode,
            contentType: res.headers['content-type'],
            error: 'Invalid JSON',
            dataPreview: data.substring(0, 100)
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout'
      });
    });
  });
};

// Test key files
const testFiles = [
  'http://localhost:3000/questions/9_medium_math.json',
  'http://localhost:3000/questions/9_medium_english.json',
  'http://localhost:3000/questions/9_medium_reading.json',
  'http://localhost:3000/questions/9_medium_thinking-skills.json',
  'http://localhost:3000/questions/manifest.json'
];

const runTests = async () => {
  console.log('🧪 Testing Static File Access:\n');
  
  for (const url of testFiles) {
    const filename = url.split('/').pop();
    console.log(`📁 Testing ${filename}:`);
    
    const result = await testUrl(url);
    
    if (result.success) {
      console.log(`   ✅ SUCCESS`);
      console.log(`   Status: ${result.statusCode}`);
      console.log(`   Content-Type: ${result.contentType}`);
      console.log(`   Data Length: ${result.dataLength} bytes`);
      if (result.questionsCount !== 'N/A') {
        console.log(`   Questions: ${result.questionsCount}`);
      }
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${result.error}`);
      if (result.statusCode) {
        console.log(`   Status: ${result.statusCode}`);
      }
      if (result.dataPreview) {
        console.log(`   Preview: ${result.dataPreview}...`);
      }
    }
    console.log('');
  }
};

runTests().then(() => {
  console.log('📊 Test Summary:');
  console.log('If all tests show SUCCESS, the Enhanced Practice page should now load questions correctly.');
  console.log('');
  console.log('🎯 Expected Behavior:');
  console.log('   - Grade 9, Medium, Math should now show 25 questions');
  console.log('   - All other grade/difficulty/subject combinations should work');
  console.log('   - Questions should load instantly (<50ms)');
  console.log('   - No more "No questions available" messages');
  console.log('');
  console.log('🔄 To Verify:');
  console.log('   1. Go to Enhanced Practice page');
  console.log('   2. Select Grade 9, Medium difficulty, Math');
  console.log('   3. Should see 25 math questions instantly');
  console.log('   4. Try other combinations to verify they all work');
}).catch(error => {
  console.error('❌ Test failed:', error);
});
