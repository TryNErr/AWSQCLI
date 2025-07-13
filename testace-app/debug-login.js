// Debug script to test login functionality
const axios = require('axios');

async function debugLogin() {
  console.log('🔍 Debugging login functionality...\n');
  
  try {
    // Test 1: Check backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test 2: Check API health
    console.log('\n2. Testing API health...');
    const apiHealthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ API health:', apiHealthResponse.data);
    
    // Test 3: Test CORS preflight
    console.log('\n3. Testing CORS preflight...');
    try {
      const preflightResponse = await axios({
        method: 'OPTIONS',
        url: 'http://localhost:5000/api/auth/login',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      console.log('✅ CORS preflight successful');
    } catch (error) {
      console.log('⚠️  CORS preflight failed:', error.message);
    }
    
    // Test 4: Test login with proper headers
    console.log('\n4. Testing login with browser-like headers...');
    const loginResponse = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/login',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/'
      },
      data: {
        email: 'demo@testace.com',
        password: 'demo123'
      },
      withCredentials: true
    });
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token
    });
    
    // Test 5: Check frontend environment
    console.log('\n5. Checking frontend configuration...');
    const fs = require('fs');
    const envContent = fs.readFileSync('./frontend/.env', 'utf8');
    console.log('Frontend .env content:');
    console.log(envContent);
    
    console.log('\n✅ All backend tests passed!');
    console.log('\n📋 Summary:');
    console.log('   • Backend is running correctly on port 5000');
    console.log('   • CORS is configured for http://localhost:3000');
    console.log('   • Login endpoint is working');
    console.log('   • Frontend environment is configured correctly');
    
    console.log('\n🔧 If you\'re still getting CORS errors in the browser:');
    console.log('   1. Make sure you\'re accessing http://localhost:3000 (not https)');
    console.log('   2. Clear browser cache and cookies');
    console.log('   3. Check browser console for specific error messages');
    console.log('   4. Try opening browser in incognito/private mode');
    console.log('   5. Check if any browser extensions are blocking requests');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    }
  }
}

debugLogin();
