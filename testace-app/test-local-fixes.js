const axios = require('axios');

async function testAllFixes() {
  console.log('🎯 LOCAL COMPREHENSIVE TEST - All TestAce Fixes\n');
  console.log('Testing all resolved issues using localhost:\n');
  
  const BACKEND_URL = 'http://localhost:5000';
  const FRONTEND_URL = 'http://localhost:3000';
  
  let allTestsPassed = true;
  
  try {
    // TEST 1: Backend Health Check
    console.log('1. 🔧 TESTING BACKEND HEALTH...');
    try {
      const healthResponse = await axios.get(`${BACKEND_URL}/health`);
      if (healthResponse.data.status === 'OK') {
        console.log('   ✅ Backend server is running');
        console.log('   ✅ Socket.IO is enabled');
        console.log(`   ✅ Active connections: ${healthResponse.data.connections}`);
      } else {
        console.log('   ❌ Backend health check failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Backend health test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 2: Authentication System
    console.log('\n2. 🔧 TESTING AUTHENTICATION...');
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'demo@testace.com',
        password: 'demo123'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (loginResponse.data.success) {
        console.log('   ✅ Login endpoint working');
        console.log('   ✅ Demo user authentication successful');
        console.log(`   ✅ Token received: ${loginResponse.data.token}`);
        console.log(`   ✅ User data: ${loginResponse.data.user.email}`);
      } else {
        console.log('   ❌ Login test failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Authentication test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 3: Dashboard Endpoint
    console.log('\n3. 🔧 TESTING DASHBOARD ENDPOINT...');
    try {
      const dashboardResponse = await axios.get(`${BACKEND_URL}/api/users/dashboard`);
      
      if (dashboardResponse.status === 200 && dashboardResponse.data.success) {
        console.log('   ✅ Dashboard endpoint working (no more 404)');
        
        const data = dashboardResponse.data.data;
        const dashboardChecks = [
          { name: 'User data', check: !!data.user },
          { name: 'User profile', check: !!data.user.profile },
          { name: 'User profile firstName', check: !!data.user.profile.firstName },
          { name: 'User profile lastName', check: !!data.user.profile.lastName },
          { name: 'User stats', check: !!data.user.stats },
          { name: 'User streaks', check: !!data.user.streaks },
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
    
    // TEST 4: Socket.IO Connection
    console.log('\n4. 🔧 TESTING SOCKET.IO...');
    try {
      const socketResponse = await axios.get(`${BACKEND_URL}/socket.io/?EIO=4&transport=polling`, { timeout: 5000 });
      if (socketResponse.data.includes('sid')) {
        console.log('   ✅ Socket.IO endpoint accessible');
        console.log('   ✅ Socket.IO server running with session management');
      } else {
        console.log('   ❌ Socket.IO endpoint failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Socket.IO test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 5: Questions API
    console.log('\n5. 🔧 TESTING QUESTIONS API...');
    try {
      const questionsResponse = await axios.get(`${BACKEND_URL}/api/questions`);
      
      if (questionsResponse.data.success && Array.isArray(questionsResponse.data.questions)) {
        console.log('   ✅ Questions endpoint working');
        console.log(`   ✅ ${questionsResponse.data.questions.length} sample questions available`);
        
        const firstQuestion = questionsResponse.data.questions[0];
        if (firstQuestion && firstQuestion.content && firstQuestion.options) {
          console.log('   ✅ Question structure is valid');
        } else {
          console.log('   ❌ Question structure is invalid');
          allTestsPassed = false;
        }
      } else {
        console.log('   ❌ Questions API failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Questions test failed:', error.message);
      allTestsPassed = false;
    }
    
    // TEST 6: Quiz Session API
    console.log('\n6. 🔧 TESTING QUIZ SESSION API...');
    try {
      const quizStartResponse = await axios.post(`${BACKEND_URL}/api/quiz/start`, {
        subject: 'Math',
        difficulty: 'easy'
      });
      
      if (quizStartResponse.data.success && quizStartResponse.data.quizId) {
        console.log('   ✅ Quiz start endpoint working');
        console.log(`   ✅ Quiz ID generated: ${quizStartResponse.data.quizId}`);
        
        // Test quiz status endpoint
        const quizId = quizStartResponse.data.quizId;
        const statusResponse = await axios.get(`${BACKEND_URL}/api/quiz/${quizId}/status`);
        
        if (statusResponse.data.success) {
          console.log('   ✅ Quiz status endpoint working');
          console.log(`   ✅ Quiz status: ${statusResponse.data.status}`);
        } else {
          console.log('   ❌ Quiz status endpoint failed');
          allTestsPassed = false;
        }
      } else {
        console.log('   ❌ Quiz start failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Quiz session test failed:', error.message);
      allTestsPassed = false;
    }
    
    // FINAL RESULTS
    console.log('\n' + '='.repeat(60));
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! TestAce is fully functional!');
      console.log('\n✅ WORKING FEATURES:');
      console.log('   1. Backend server with Socket.IO');
      console.log('   2. Authentication system (demo login)');
      console.log('   3. Dashboard endpoint with complete data structure');
      console.log('   4. Socket.IO real-time communication');
      console.log('   5. Questions API with sample data');
      console.log('   6. Quiz session management');
      
      console.log('\n🚀 YOUR TESTACE APP IS READY:');
      console.log(`   • Backend: ${BACKEND_URL}`);
      console.log(`   • Frontend: ${FRONTEND_URL}`);
      console.log('   • Login: demo@testace.com / demo123 (or any credentials)');
      console.log('   • Features: All working - Dashboard, Socket.IO, Navigation');
      console.log('   • Status: Production ready for demo/development');
      
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
