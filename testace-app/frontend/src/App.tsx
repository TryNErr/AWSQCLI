import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Practice from './pages/Practice/Practice';
import Question from './pages/Practice/Question';
import QuestionHistory from './pages/Practice/QuestionHistory';
import EnhancedPractice from './pages/Practice/EnhancedPractice';
import PracticeSession from './pages/Practice/PracticeSession';
import SessionComplete from './pages/Practice/SessionComplete';
import EnhancedQuestion from './pages/Practice/EnhancedQuestion';
import TimedTest from './pages/TimedTest/TimedTest';
import TimedTestResults from './pages/TimedTest/TimedTestResults';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Original Practice Routes */}
            <Route path="/practice" element={
              <PrivateRoute>
                <Layout>
                  <Practice />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/practice/question/:id" element={
              <PrivateRoute>
                <Layout>
                  <Question />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/practice/history" element={
              <PrivateRoute>
                <Layout>
                  <QuestionHistory />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Enhanced Practice Routes */}
            <Route path="/practice/enhanced" element={
              <PrivateRoute>
                <Layout>
                  <EnhancedPractice />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/practice/session" element={
              <PrivateRoute>
                <Layout>
                  <PracticeSession />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/practice/session-complete" element={
              <PrivateRoute>
                <Layout>
                  <SessionComplete />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/practice/enhanced-question/:id" element={
              <PrivateRoute>
                <Layout>
                  <EnhancedQuestion />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Timed Test Routes */}
            <Route path="/timed-test" element={
              <PrivateRoute>
                <Layout>
                  <TimedTest />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/timed-test/results" element={
              <PrivateRoute>
                <Layout>
                  <TimedTestResults />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Profile Route */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
