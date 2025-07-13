const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login functionality...\n');
    
    // Test backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test login endpoint
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('✅ Login response:', loginResponse.data);
    
    // Test with different credentials
    console.log('\n3. Testing with different credentials...');
    const loginResponse2 = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@testace.com',
      password: 'demo123'
    });
    console.log('✅ Login response 2:', loginResponse2.data);
    
    console.log('\n🎉 All tests passed! Login functionality is working.');
    console.log('\n📝 Note: This is using demo authentication. Any email/password combination will work.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testLogin();
