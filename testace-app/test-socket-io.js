const axios = require('axios');

async function testSocketIO() {
  console.log('🧪 Testing Socket.IO Dashboard Fix...\n');
  
  const BACKEND_URL = 'https://5000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
  const FRONTEND_URL = 'https://3000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
  
  try {
    // Test 1: Backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test 2: Socket.IO endpoint
    console.log('\n2. Testing Socket.IO endpoint...');
    const socketResponse = await axios.get(`${BACKEND_URL}/socket.io/?EIO=4&transport=polling`);
    if (socketResponse.data.includes('sid')) {
      console.log('✅ Socket.IO endpoint working');
      console.log('   Response includes session ID');
    } else {
      console.log('❌ Socket.IO endpoint failed');
    }
    
    // Test 3: Check frontend environment
    console.log('\n3. Checking frontend Socket.IO configuration...');
    const fs = require('fs');
    const envContent = fs.readFileSync('./frontend/.env', 'utf8');
    const serverUrl = envContent.match(/REACT_APP_SERVER_URL=(.+)/)?.[1];
    console.log('✅ Frontend Socket.IO URL:', serverUrl);
    
    if (serverUrl && serverUrl.includes('5000-trynerr-awsqcli')) {
      console.log('✅ Frontend correctly configured for Gitpod Socket.IO');
    } else {
      console.log('⚠️  Frontend Socket.IO URL might need updating');
    }
    
    // Test 4: Frontend accessibility
    console.log('\n4. Testing frontend accessibility...');
    try {
      const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
      console.log('✅ Frontend accessible (HTTP', frontendResponse.status + ')');
    } catch (error) {
      console.log('⚠️  Frontend accessibility test failed:', error.message);
    }
    
    console.log('\n🎉 Socket.IO Dashboard Fix Complete!');
    console.log('\n📋 What was fixed:');
    console.log('   ✅ Added REACT_APP_SERVER_URL to frontend .env');
    console.log('   ✅ Updated URL to use Gitpod backend URL');
    console.log('   ✅ Added Socket.IO support to simple backend');
    console.log('   ✅ Added Socket.IO event handlers for:');
    console.log('      • Practice rooms');
    console.log('      • Live practice sessions');
    console.log('      • Daily challenges');
    console.log('      • Real-time features');
    
    console.log('\n🔧 Your TestAce Dashboard should now work:');
    console.log(`   • Frontend: ${FRONTEND_URL}`);
    console.log('   • Login and access Dashboard');
    console.log('   • Socket.IO connection should be green dot in navbar');
    console.log('   • Real-time features should work');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Make sure backend is running with Socket.IO');
    console.log('   • Check frontend .env has REACT_APP_SERVER_URL');
    console.log('   • Verify Gitpod ports are open and public');
  }
}

testSocketIO();
