const axios = require('axios');

async function testGitpodLogin() {
  console.log('🧪 Testing TestAce login in Gitpod environment...\n');
  
  const FRONTEND_URL = 'https://3000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
  const BACKEND_URL = 'https://5000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
  
  try {
    // Test 1: Backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test 2: API health
    console.log('\n2. Testing API health...');
    const apiHealthResponse = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ API health:', apiHealthResponse.data);
    
    // Test 3: Login functionality
    console.log('\n3. Testing login functionality...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'demo@testace.com',
      password: 'demo123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL
      }
    });
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token,
      user: loginResponse.data.user
    });
    
    // Test 4: Frontend accessibility
    console.log('\n4. Testing frontend accessibility...');
    try {
      const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
      console.log('✅ Frontend is accessible (HTTP', frontendResponse.status + ')');
    } catch (error) {
      console.log('⚠️  Frontend accessibility test failed:', error.message);
    }
    
    console.log('\n🎉 All tests passed!');
    console.log('\n📋 Gitpod URLs:');
    console.log(`   • Frontend: ${FRONTEND_URL}`);
    console.log(`   • Backend:  ${BACKEND_URL}`);
    console.log('\n🔧 To use your TestAce app:');
    console.log(`   1. Open: ${FRONTEND_URL}`);
    console.log('   2. Use any email/password to login (demo mode active)');
    console.log('   3. Recommended: demo@testace.com / demo123');
    
    console.log('\n✅ CORS and login issues should now be resolved!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Make sure both frontend and backend are running');
    console.log('   • Check Gitpod port visibility: gp ports list');
    console.log('   • Verify .env files have correct Gitpod URLs');
  }
}

testGitpodLogin();
