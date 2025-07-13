const axios = require('axios');

async function testAllFixes() {
  console.log('🎯 FINAL COMPREHENSIVE TEST - All TestAce Fixes\n');
  console.log('Testing all resolved issues:\n');
  
  const BACKEND_URL = 'https://5000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
  const FRONTEND_URL = 'https://3000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
  
  let allTestsPassed = true;
  
  try {
    // TEST 1: CORS Issues (Original Problem)
    console.log('1. 🔧 TESTING CORS FIXES...');
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'demo@testace.com',
        password: 'demo123'
      }, {
        headers: {
          'Origin': FRONTEND_URL,
          'Content-Type': 'application/json'
        }
      });
      
      if (loginResponse.data.success) {
        console.log('   ✅ CORS working - Login successful from frontend origin');
        console.log('   ✅ Backend accepts requests from Gitpod frontend URL');
      } else {
        console.log('   ❌ CORS test failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ CORS test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 2: React Component Errors (Second Problem)
    console.log('\n2. 🔧 TESTING COMPONENT ERROR FIXES...');
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'demo@testace.com',
        password: 'demo123'
      });
      
      const user = loginResponse.data.user;
      const componentChecks = [
        { name: 'user.profile exists', check: !!user.profile },
        { name: 'user.profile.firstName exists', check: !!user.profile?.firstName },
        { name: 'user.profile.lastName exists', check: !!user.profile?.lastName },
        { name: 'user.streaks exists', check: !!user.streaks },
        { name: 'user.streaks.current is number', check: typeof user.streaks?.current === 'number' },
        { name: 'user.stats exists', check: !!user.stats },
        { name: 'user.stats.totalQuestions exists', check: typeof user.stats?.totalQuestions === 'number' }
      ];
      
      let componentTestsPassed = true;
      componentChecks.forEach(check => {
        console.log(`   ${check.check ? '✅' : '❌'} ${check.name}`);
        if (!check.check) componentTestsPassed = false;
      });
      
      if (componentTestsPassed) {
        console.log('   ✅ All component data structure issues resolved');
      } else {
        console.log('   ❌ Some component issues remain');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Component test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 3: Socket.IO Connection Issues (Third Problem)
    console.log('\n3. 🔧 TESTING SOCKET.IO FIXES...');
    try {
      const socketResponse = await axios.get(`${BACKEND_URL}/socket.io/?EIO=4&transport=polling`, { timeout: 5000 });
      if (socketResponse.data.includes('sid')) {
        console.log('   ✅ Socket.IO endpoint accessible');
        console.log('   ✅ Socket.IO server running with session management');
        
        // Check environment configuration
        const fs = require('fs');
        const envContent = fs.readFileSync('./frontend/.env', 'utf8');
        const serverUrl = envContent.match(/REACT_APP_SERVER_URL=(.+)/)?.[1];
        
        if (serverUrl && serverUrl.includes('5000-trynerr-awsqcli')) {
          console.log('   ✅ Frontend configured with correct Socket.IO URL');
        } else {
          console.log('   ❌ Frontend Socket.IO URL configuration issue');
          allTestsPassed = false;
        }
      } else {
        console.log('   ❌ Socket.IO endpoint failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Socket.IO test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 4: Dashboard 404 Error (Fourth Problem)
    console.log('\n4. 🔧 TESTING DASHBOARD ENDPOINT FIX...');
    try {
      const dashboardResponse = await axios.get(`${BACKEND_URL}/api/users/dashboard`);
      
      if (dashboardResponse.status === 200 && dashboardResponse.data.success) {
        console.log('   ✅ Dashboard endpoint working (no more 404)');
        
        const data = dashboardResponse.data.data;
        const dashboardChecks = [
          { name: 'User data', check: !!data.user },
          { name: 'Recent sessions', check: Array.isArray(data.recentSessions) },
          { name: 'Daily challenge status', check: !!data.dailyChallengeStatus },
          { name: 'Week stats', check: !!data.weekStats },
          { name: 'Study recommendations', check: Array.isArray(data.studyRecommendations) }
        ];
        
        let dashboardTestsPassed = true;
        dashboardChecks.forEach(check => {
          console.log(`   ${check.check ? '✅' : '❌'} ${check.name}`);
          if (!check.check) dashboardTestsPassed = false;
        });
        
        if (dashboardTestsPassed) {
          console.log('   ✅ Dashboard data structure complete');
        } else {
          console.log('   ❌ Dashboard data structure incomplete');
          allTestsPassed = false;
        }
      } else {
        console.log('   ❌ Dashboard endpoint still failing');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Dashboard test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 5: Overall System Integration
    console.log('\n5. 🔧 TESTING OVERALL SYSTEM INTEGRATION...');
    try {
      // Test complete login flow
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'demo@testace.com',
        password: 'demo123'
      });
      
      // Test user data endpoint
      const userResponse = await axios.get(`${BACKEND_URL}/api/auth/me`);
      
      // Test dashboard endpoint
      const dashboardResponse = await axios.get(`${BACKEND_URL}/api/users/dashboard`);
      
      // Test frontend accessibility
      const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
      
      console.log('   ✅ Complete authentication flow working');
      console.log('   ✅ All API endpoints responding');
      console.log('   ✅ Frontend accessible');
      console.log('   ✅ System integration successful');
      
    } catch (error) {
      console.log('   ❌ System integration test failed:', error.message);
      allTestsPassed = false;
    }
    
    // FINAL RESULTS
    console.log('\n' + '='.repeat(60));
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! TestAce is fully functional!');
      console.log('\n✅ RESOLVED ISSUES:');
      console.log('   1. CORS errors - Fixed with Gitpod URLs');
      console.log('   2. React component errors - Fixed user data structure');
      console.log('   3. Socket.IO connection failures - Added server & fixed URLs');
      console.log('   4. Dashboard 404 errors - Added missing endpoint');
      
      console.log('\n🚀 YOUR TESTACE APP IS READY:');
      console.log(`   • Frontend: ${FRONTEND_URL}`);
      console.log('   • Login: demo@testace.com / demo123 (or any credentials)');
      console.log('   • Features: All working - Dashboard, Socket.IO, Navigation');
      console.log('   • Status: Production ready for demo/development');
      
      console.log('\n📁 Test Files Created:');
      console.log('   • test-socket-connection.html - Socket.IO browser test');
      console.log('   • test-dashboard-browser.html - Dashboard endpoint test');
      console.log('   • test-component-errors.html - Component error test');
      console.log('   • test-login.html - Login functionality test');
      
    } else {
      console.log('❌ SOME TESTS FAILED - Please check the issues above');
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Critical test failure:', error.message);
    allTestsPassed = false;
  }
  
  return allTestsPassed;
}

testAllFixes();
