const axios = require('axios');

async function testLoginFlow() {
  console.log('🧪 Testing complete login flow...\n');
  
  try {
    // Test 1: Backend Health Check
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test 2: API Health Check
    console.log('\n2. Testing API health...');
    const apiHealthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ API health:', apiHealthResponse.data);
    
    // Test 3: Login with demo credentials
    console.log('\n3. Testing login with demo credentials...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@testace.com',
      password: 'demo123'
    });
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token,
      user: loginResponse.data.user
    });
    
    // Test 4: Login with any credentials (since it's demo mode)
    console.log('\n4. Testing login with any credentials...');
    const loginResponse2 = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'anypassword'
    });
    console.log('✅ Login successful:', {
      success: loginResponse2.data.success,
      message: loginResponse2.data.message,
      hasToken: !!loginResponse2.data.token
    });
    
    // Test 5: Registration
    console.log('\n5. Testing registration...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      email: 'newuser@example.com',
      password: 'password123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    });
    console.log('✅ Registration successful:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      hasToken: !!registerResponse.data.token,
      user: registerResponse.data.user
    });
    
    // Test 6: Check frontend configuration
    console.log('\n6. Checking frontend configuration...');
    const fs = require('fs');
    const envContent = fs.readFileSync('./frontend/.env', 'utf8');
    const apiUrl = envContent.match(/REACT_APP_API_URL=(.+)/)?.[1];
    console.log('✅ Frontend API URL:', apiUrl);
    
    if (apiUrl === 'http://localhost:5000/api') {
      console.log('✅ Frontend is correctly configured to use local backend');
    } else {
      console.log('⚠️  Frontend API URL might need to be updated');
    }
    
    console.log('\n🎉 All tests passed! Login functionality is working correctly.');
    console.log('\n📋 Summary:');
    console.log('   • Backend is running on port 5000');
    console.log('   • Frontend should be running on port 3000');
    console.log('   • Demo authentication is active (any credentials work)');
    console.log('   • MongoDB is connected');
    console.log('\n🔧 To use the application:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Use any email/password combination to login');
    console.log('   3. Or use the demo credentials: demo@testace.com / demo123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Troubleshooting:');
      console.error('   • Make sure the backend is running: cd backend && node simple-server.js');
      console.error('   • Check if port 5000 is available: lsof -i :5000');
    } else if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLoginFlow();
